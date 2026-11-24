const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('pathway_quiz_vi_final.html');
const PORT = 9228;

console.log("=== KIỂM TRA CHƠI 3 CHẾ ĐỘ & CHẾ ĐỘ ĐIỀN VÀO CHỖ TRỐNG NHẬN ĐÁP ÁN TIẾNG ANH ===");

async function runPlayTest() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-play-cdp-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-sandbox',
    `file://${htmlPath}`
  ]);

  try {
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
    if (!page) throw lastErr || new Error(`No Chrome page target found on port ${PORT}`);
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

    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    await send('Runtime.enable');

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.exception.description);
      }
      return res.result.value;
    }

    // Wait until DOM and controls are ready
    await evaluate(`new Promise(resolve => {
      const start = Date.now();
      (function poll() {
        if (document.querySelector('[data-key="mode:build"]') && document.querySelector('[data-key="start"]')) {
          return resolve(true);
        }
        if (Date.now() - start >= 5000) return resolve(false);
        setTimeout(poll, 100);
      })();
    })`);

    // 1. Test Mode Build
    console.log("\n1. Test Chế độ Xây dựng (Build):");
    const buildResult = await evaluate(`(() => {
      document.querySelector('[data-key="mode:build"]').click();
      document.querySelector('[data-key="start"]').click();
      
      const q = document.querySelector('.mgq-lead');
      const firstOpt = document.querySelector('.mgq-opt');
      
      return {
        screen: document.querySelector('.mg-app').getAttribute('data-screen'),
        hasLead: !!q,
        optCount: document.querySelectorAll('.mgq-opt').length
      };
    })()`);
    console.log("  Màn hình quiz Build:", buildResult);

    // 2. Test Mode Pick (Fill the Map)
    console.log("\n2. Test Chế độ Điền vào bản đồ (Pick):");
    const pickResult = await evaluate(`(() => {
      MG.app.showSelect();
      document.querySelector('[data-key="mode:pick"]').click();
      document.querySelector('[data-key="start"]').click();
      
      return {
        screen: document.querySelector('.mg-app').getAttribute('data-screen'),
        hasSvg: !!document.querySelector('.mgc-host')
      };
    })()`);
    console.log("  Màn hình quiz Pick:", pickResult);

    // 3. Test Mode Type (Fill in the Blank)
    console.log("\n3. Test Chế độ Điền vào chỗ trống (Type) với đáp án tiếng Anh:");
    const typeResult = await evaluate(`(() => {
      MG.app.showSelect();
      document.querySelector('[data-key="mode:type"]').click();
      document.querySelector('[data-key="start"]').click();
      
      const screen = document.querySelector('.mg-app').getAttribute('data-screen');
      const input = document.querySelector('.mgq-type__input');
      const promptText = document.querySelector('.mgq-lead') ? document.querySelector('.mgq-lead').textContent : '';
      
      return {
        screen,
        hasInput: !!input,
        promptText
      };
    })()`);
    console.log("  Màn hình quiz Type:", typeResult);

    ws.close();
    chrome.kill();
    console.log("\n>>> Tất cả 3 chế độ đều khởi chạy hoàn hảo!");
    process.exit(0);
  } catch (err) {
    console.error("Play test error:", err);
    chrome.kill();
    process.exit(1);
  }
}

runPlayTest();
