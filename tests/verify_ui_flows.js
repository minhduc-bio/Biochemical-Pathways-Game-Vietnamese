/**
 * Automated UI & Interaction Flow Verification Suite
 * Uses Node.js built-in WebSocket and headless Chrome via Chrome DevTools Protocol (CDP).
 * Zero external dependencies.
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('index.html');
const PORT = 9227;

console.log("=== BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG CÁC LUỒNG THAO TÁC UI ===");

async function runTestSuite() {
  const os = require('os');
  const fs = require('fs');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cdp-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-sandbox',
    `file://${htmlPath}`
  ]);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  try {
    // Wait for Chrome CDP port with retry
    let page = null;
    let lastErr = null;
    for (let attempt = 0; attempt < 25; attempt++) {
      try {
        const list = await new Promise((resolve, reject) => {
          http.get(`http://127.0.0.1:${PORT}/json`, (res) => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
              try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
            });
          }).on('error', reject);
        });
        page = list.find(p => p.type === 'page');
        if (page) break;
      } catch (e) {
        lastErr = e;
      }
      await new Promise(r => setTimeout(r, 300));
    }
    if (!page) throw lastErr || new Error("No page found on CDP port");

    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const consoleErrors = [];

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    await send('Runtime.enable');
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    });

    async function evaluate(code) {
      const res = await send('Runtime.evaluate', {
        expression: code,
        returnByValue: true,
        awaitPromise: true
      });
      return res.result ? res.result.value : undefined;
    }

    for (let w = 0; w < 40; w++) {
      const ready = await evaluate('!!(window.MG && MG.app && document.querySelector(".mg-app"))');
      if (ready) break;
      await new Promise(r => setTimeout(r, 200));
    }

    console.log("\n--- TEST GROUP 1: Khởi động & Màn hình Menu (Home Screen) ---");
    const initCheck = await evaluate(`({
      title: document.title,
      screen: document.querySelector('.mg-app') ? document.querySelector('.mg-app').getAttribute('data-screen') : null,
      theme: document.documentElement.getAttribute('data-theme'),
      hasStartBtn: !!document.querySelector('[data-key="start"]'),
      groupCount: document.querySelectorAll('.mg-group').length,
      initialTiles: document.querySelectorAll('.mg-tile').length,
      startDisabled: document.querySelector('[data-key="start"]').disabled
    })`);

    assert(initCheck.title === 'Pathway Quiz' || initCheck.title === 'Trắc nghiệm Con đường Chuyển hóa', "Tiêu đề trang phải là 'Pathway Quiz' hoặc 'Trắc nghiệm Con đường Chuyển hóa'", initCheck.title);
    assert(initCheck.screen === 'select', "Màn hình khởi động phải là 'select'", initCheck.screen);
    assert(initCheck.hasStartBtn, "Nút Start Quiz phải tồn tại trên màn hình select");
    
    // Kiểm tra các thành phần mới của Phase 2 & Refactor Nhóm B
    const phase2Check = await evaluate(`({
      hasHelpHeader: !!document.querySelector('.mg-help-icon'),
      hasDockSettings: !!document.querySelector('[data-key="settings:open"]'),
      hasModeDesc: !!document.querySelector('.mg-choice__text') || !!document.querySelector('.mg-mode-desc'),
      hasSummaryOrChips: !!document.querySelector('.mg-picked-summary') || document.querySelectorAll('.mg-chip--picked').length >= 1
    })`);
    assert(phase2Check.hasHelpHeader, "Pha 2: Header có nút icon '?' trợ giúp");
    assert(phase2Check.hasDockSettings, "Pha 2: Có nút Settings gear (⚙)");
    assert(phase2Check.hasModeDesc, "Pha 2: Khối Mode có mô tả cách chơi");
    assert(phase2Check.hasSummaryOrChips, "Pha 2/Nhóm B: Có tóm tắt pathway đang chọn (dòng tóm tắt hoặc chip)");
    assert(initCheck.groupCount >= 5, "Danh sách con đường phải có ít nhất 5 nhóm", initCheck.groupCount);
    assert(initCheck.initialTiles === 10, "Mặc định Glycolysis được chọn và có 10 bước (HK, PGI...)", initCheck.initialTiles);
    assert(!initCheck.startDisabled, "Mặc định nút Start đã sẵn sàng (không bị disabled)");

    console.log("\n--- TEST GROUP 2: Hệ thống Theme & Design Tokens ---");
    const themeTest = await evaluate(`(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      const bgLight = rootStyle.getPropertyValue('--mg-bg').trim();
      
      // Chuyển sang dark theme
      document.documentElement.setAttribute('data-theme', 'dark');
      const rootStyleDark = getComputedStyle(document.documentElement);
      const bgDark = rootStyleDark.getPropertyValue('--mg-bg').trim();
      
      // Khôi phục light theme
      document.documentElement.setAttribute('data-theme', 'light');

      return { bgLight, bgDark, differs: bgLight !== bgDark };
    })()`);

    assert(themeTest.differs, "Biến CSS --mg-bg phải thay đổi giữa Light và Dark theme", `${themeTest.bgLight} vs ${themeTest.bgDark}`);

    console.log("\n--- TEST GROUP 3: Luồng chọn Pathway & Hiển thị Lưới Bước ---");
    const pathwayCheck = await evaluate(`(() => {
      const tiles = document.querySelectorAll('.mg-tile');
      const startBtn = document.querySelector('[data-key="start"]');
      const glycolysisBtn = document.querySelector('[data-key="pathway:glycolysis"]');
      
      return {
        tileCount: tiles.length,
        hasGlycolysisBtn: !!glycolysisBtn,
        startText: startBtn ? startBtn.textContent.trim() : ''
      };
    })()`);

    assert(pathwayCheck.hasGlycolysisBtn, "Button chọn Glycolysis tồn tại trên danh mục");
    assert(pathwayCheck.tileCount === 10, "Glycolysis hiển thị 10 ô bước phản ứng", pathwayCheck.tileCount);
    assert(pathwayCheck.startText.includes('Start') || pathwayCheck.startText.includes('Bắt đầu') || pathwayCheck.startText.includes('Chơi'), "Nút Start có nhãn bắt đầu", pathwayCheck.startText);

    console.log("\n--- TEST GROUP 4: Khởi chạy Quiz (Chế độ Build) & Tương tác ---");
    const quizStartTest = await evaluate(`(() => {
      const startBtn = document.querySelector('[data-key="start"]');
      startBtn.click();
      
      const screen = document.querySelector('.mg-app').getAttribute('data-screen');
      const hasHead = !!document.querySelector('.mgq-head');
      const hasBar = !!document.querySelector('.mgq-bar');
      const hasSvg = !!document.querySelector('.mgc-host');
      const hasHint = !!document.querySelector('.mgq-hint-btn');
      const hasReveal = !!document.querySelector('.mgq-reveal-btn');
      const hasQuestionCard = !!document.querySelector('.mgq-eq-card');
      const optCount = document.querySelectorAll('.mgq-opt').length;
      
      return { screen, hasHead, hasBar, hasSvg, hasHint, hasReveal, hasQuestionCard, optCount };
    })()`);

    assert(quizStartTest.screen === 'quiz', "Màn hình chuyển sang 'quiz'", quizStartTest.screen);
    assert(quizStartTest.hasHead, "Màn quiz có Header (.mgq-head)");
    assert(quizStartTest.hasBar, "Màn quiz có Progress bar (.mgq-bar)");
    assert(quizStartTest.hasSvg, "Bản đồ sinh học SVG (.mgc-host) được mount");
    assert(quizStartTest.hasQuestionCard, "Thẻ câu hỏi (.mgq-eq-card) hiển thị câu hỏi hiện tại");
    assert(quizStartTest.hasHint, "Nút Hint (.mgq-hint-btn) có mặt");
    assert(quizStartTest.hasReveal, "Nút Reveal (.mgq-reveal-btn) có mặt");
    assert(quizStartTest.optCount >= 4, "Có các phương án lựa chọn trả lời", quizStartTest.optCount);
    
    // Kiểm tra các đặc tính hiển thị của Pha 3
    const phase3Check = await evaluate(`({
      hasCleanNodeShadow: !document.querySelector('.mgc-node-shadow[style*="opacity: 1"]'),
      hasCleanArrowLine: !!document.querySelector('.mgc-arrow-line'),
      modalPanelStyled: !!document.querySelector('.mg-header')
    })`);
    assert(phase3Check.hasCleanNodeShadow, "Pha 3: SVG Node bóng đen dày đã được làm sạch");
    assert(phase3Check.hasCleanArrowLine, "Pha 3: Mũi tên SVG phản ứng hiển thị sắc nét");

    console.log("\n--- TEST GROUP 5: Tương tác Reveal (Tính lỗi & Chuyển bước) ---");
    const revealTest = await evaluate(`(() => {
      const revealBtn = document.querySelector('.mgq-reveal-btn');
      if (!revealBtn) return { success: false, reason: 'no reveal btn' };
      revealBtn.click();
      
      const wrongCountEl = document.querySelector('.mg-count--wrong .mgq-num');
      const hasNext = !!document.querySelector('.mgq-why__next') || !!document.querySelector('.is-missed');
      
      return {
        success: true,
        wrongVal: wrongCountEl ? wrongCountEl.textContent.trim() : null,
        hasNext
      };
    })()`);

    assert(revealTest.success, "Nút Reveal click thành công");
    assert(revealTest.wrongVal === '1', "Reveal ghi nhận chính xác 1 lỗi sai vào bộ đếm wrong", revealTest.wrongVal);
    assert(revealTest.hasNext, "Phản hồi lỗi hiển thị nút chuyển bước hoặc highlight bước bị lỡ");

    console.log("\n--- TEST GROUP 6: Mở Tiện ích Phụ (ATP Calculator, Draw, Games, Settings) ---");
    const toolsTest = await evaluate(`(() => {
      // 1. Thử mở ATP
      MG.app.showAtp();
      const atpScreen = document.querySelector('.mg-screen--atp');
      
      // 2. Thử mở Draw
      MG.app.showDraw();
      const drawScreen = document.querySelector('.mg-screen--draw');
      
      // 3. Thử mở Games/Quizzes
      MG.app.showGames();
      const gamesScreen = document.querySelector('.mg-screen--games');
      
      // 4. Mở Settings
      const handle = MG.app.openSettings();
      const hasModal = !!document.querySelector('.mg-modal');
      if (handle && handle.close) handle.close();
      
      // Quay về menu
      MG.app.showSelect();
      const finalScreen = document.querySelector('.mg-app').getAttribute('data-screen');
      
      return {
        atpOk: !!atpScreen,
        drawOk: !!drawScreen,
        gamesOk: !!gamesScreen,
        modalOk: hasModal,
        returnedToMenu: finalScreen === 'select'
      };
    })()`);

    assert(toolsTest.atpOk, "ATP Calculator mount thành công");
    assert(toolsTest.drawOk, "Draw molecules mount thành công");
    assert(toolsTest.gamesOk, "Games/Quizzes mount thành công");
    assert(toolsTest.modalOk, "Settings modal mở và đóng chuẩn xác");
    assert(toolsTest.returnedToMenu, "Quay về menu an toàn");

    console.log("\n--- TEST GROUP 7: Kiểm tra Toàn vẹn Dữ liệu localStorage ---");
    const storageTest = await evaluate(`(() => {
      const raw = localStorage.getItem('mg.v1');
      if (!raw) return { ok: false, reason: 'mg.v1 is null' };
      try {
        const parsed = JSON.parse(raw);
        return {
          ok: true,
          hasSettings: typeof parsed.settings === 'object',
          hasHistory: typeof parsed.history === 'object',
          hasMastery: typeof parsed.mastery === 'object'
        };
      } catch (e) {
        return { ok: false, reason: e.message };
      }
    })()`);

    assert(storageTest.ok, "localStorage key 'mg.v1' tồn tại và parse JSON hợp lệ");
    assert(storageTest.hasSettings, "Cấu trúc settings trong 'mg.v1' nguyên vẹn");

    console.log("\n--- TEST GROUP 8: Hash Router, Browser Back & Dọn dẹp Modal ---");
    const modalBeforeSwitch = await evaluate(`(() => {
      MG.app.showSelect();
      MG.ui.modal({ title: 'Test Modal Cleanup' });
      const openedModalCount = document.querySelectorAll('.mg-modal').length;
      const lockedBefore = document.documentElement.classList.contains('mg-lock');
      MG.app.showAtp();
      const remainingModalCount = document.querySelectorAll('.mg-modal').length;
      const lockedAfter = document.documentElement.classList.contains('mg-lock');
      return {
        openedModalCount,
        lockedBefore,
        remainingModalCount,
        lockedAfter,
        atpHash: window.location.hash,
        atpScreen: document.querySelector('.mg-app').getAttribute('data-screen')
      };
    })()`);

    assert(modalBeforeSwitch.openedModalCount === 1 && modalBeforeSwitch.lockedBefore, "Modal mở đúng và gắn mg-lock trước khi chuyển màn hình");
    assert(modalBeforeSwitch.remainingModalCount === 0 && !modalBeforeSwitch.lockedAfter, "Chuyển màn hình (setStage) dọn sạch modalStack và gỡ mg-lock");
    assert(modalBeforeSwitch.atpHash === '#atp' && modalBeforeSwitch.atpScreen === 'atp', "Hash Router cập nhật #atp khi vào ATP Calculator", modalBeforeSwitch.atpHash);

    await new Promise(r => setTimeout(r, 150));
    await evaluate(`(() => { window.history.back(); return true; })()`);
    await new Promise(r => setTimeout(r, 350));

    const backFromAtp = await evaluate(`({
      screen: document.querySelector('.mg-app').getAttribute('data-screen'),
      hash: window.location.hash
    })`);
    assert(backFromAtp.screen === 'select', "window.history.back() từ #atp quay lại đúng màn hình select", JSON.stringify(backFromAtp));

    // Kiểm tra navStack với goBack() (atp -> draw -> goBack() về atp)
    await evaluate(`(() => { MG.app.showAtp(); MG.app.showDraw(); return true; })()`);
    await new Promise(r => setTimeout(r, 120));
    const stackBack = await evaluate(`(() => {
      MG.app._test.goBack();
      return {
        screenAfterOneBack: document.querySelector('.mg-app').getAttribute('data-screen'),
        hashAfterOneBack: window.location.hash
      };
    })()`);
    assert(stackBack.screenAfterOneBack === 'atp', "goBack() từ draw quay lại màn hình trước đó (atp) thay vì nhảy cứng về select", JSON.stringify(stackBack));

    // Kiểm tra vào quiz (#quiz/glycolysis) rồi history.back() quay về select & dọn activeQuiz
    await evaluate(`(() => {
      MG.app.showSelect();
      MG.app._test.setPicked(['glycolysis']);
      MG.app._test.startFromSelect();
      return true;
    })()`);
    await new Promise(r => setTimeout(r, 250));
    const inQuizHash = await evaluate(`({
      screen: document.querySelector('.mg-app').getAttribute('data-screen'),
      hash: window.location.hash
    })`);
    assert(inQuizHash.screen === 'quiz' && inQuizHash.hash.indexOf('#quiz/') === 0, "Vào quiz cập nhật hash #quiz/<pathwayId>", JSON.stringify(inQuizHash));

    await evaluate(`(() => { window.history.back(); return true; })()`);
    await new Promise(r => setTimeout(r, 350));
    const backFromQuiz = await evaluate(`({
      screen: document.querySelector('.mg-app').getAttribute('data-screen'),
      hasQuizDom: !!document.querySelector('.mg-screen--quiz')
    })`);
    assert(backFromQuiz.screen === 'select' && !backFromQuiz.hasQuizDom, "window.history.back() từ quiz quay lại select và dọn DOM quiz", JSON.stringify(backFromQuiz));

    console.log("\n--- TEST GROUP 9: Bắt lỗi Console Runtime ---");
    assert(consoleErrors.length === 0, "Không có bất kỳ console error nào trong suốt quá trình chạy", consoleErrors.join('; '));

    ws.close();
    chrome.kill();

    console.log("\n=======================================================");
    console.log(`KẾT QUẢ TỔNG HỢP: ${passed} PASS, ${failed} FAIL`);
    console.log("=======================================================\n");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("Test Suite Execution Error:", err);
    chrome.kill();
    process.exit(1);
  }
}

runTestSuite();
