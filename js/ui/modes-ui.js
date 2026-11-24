(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var NEXT_MS = 700;
var REVEAL_MS = 1000;
var WHY_MS = 4500;
var TICK_MS = 250;
var TOAST_MS = 1200;   // a 'Correct' message stays about 1.2 s, one at a time
var REVIEW_ZOOM = 0.6;   // the phone review opens here, where the names can be read
var RING_LABEL_SCALE = 1.3;   // ring sugars: their labels are drawn this much larger
var FOCUS_ZOOM = 0.7;
var FULL_ZOOM = 0.8;
var MIN_LABEL_PX = 11;
var SIZE_PART_WIDE = [120, 110];
var SIZE_PART_PHONE = [96, 90];
var SIZE_BUILD_OPT = [180, 120];
var SIZE_CHOOSER_OPT = [120, 84];
var CHIP_FAMILIES = { adenylate: true, redox: true, carrier: true, small: true };
var ARROW_SVG = '<svg class="mgq-arrow__line" viewBox="0 0 40 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
'<path d="M20 2V64"/><path d="M11 54L20 72L29 54"/></svg>';
function h() { return MG.ui.el.apply(null, arguments); }
function toast(text) {
if (MG.ui && typeof MG.ui.toast === 'function') { MG.ui.toast(text, TOAST_MS); }
}
function openDetail(kind, id, opts) {
return MG.ui && typeof MG.ui.detailCard === 'function' ? MG.ui.detailCard(kind, id, opts) : null;
}
function isWide() {
if (root.matchMedia) {
try { return root.matchMedia('(min-width: 900px)').matches; } catch (e) { /* fall back to the width */ }
}
return (root.innerWidth || 0) >= 900;
}
function reducedMotion() {
if (!root.matchMedia) { return false; }
try { return root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
}
function entityOf(kind, id) {
var table = MG.entities && MG.entities[kind];
return table && Object.prototype.hasOwnProperty.call(table, id) ? table[id] : null;
}
function fullName(kind, id) {
var e = entityOf(kind, id);
return e ? e.name : String(id);
}
function partLabel(kind, id) {
var e = entityOf(kind, id);
if (!e) { return String(id); }
return kind === 'cofactor' ? (e.display || e.name) : e.name;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function formatTime(ms) {
var s = Math.floor(Math.max(0, ms) / 1000);
var sec = s % 60;
return Math.floor(s / 60) + ':' + (sec < 10 ? '0' : '') + sec;
}
function longestWord(text) {
return String(text).split(/[\s-]+/).reduce(function (m, w) { return Math.max(m, w.length); }, 0);
}
function structureSVG(molId, w, hgt, hl, title, fontScale) {
if (!MG.renderMolecule || !MG.geometry || !MG.geometry[molId]) { return null; }
var opts = { width: w, height: hgt, maxBond: 34, hl: hl || [] };
if (title) { opts.title = title; }
if (fontScale > 1) { opts.fontScale = fontScale; }
return MG.renderMolecule(MG.geometry[molId], opts);
}
function hlFor(rxn, side, node) {
var map = rxn && rxn.hl ? rxn.hl[side] : null;
return map && map[node] ? map[node] : [];
}
var measureCtx = null;
function longestWordPx(el, px) {
if (!measureCtx) { measureCtx = document.createElement('canvas').getContext('2d'); }
var cs = root.getComputedStyle(el);
measureCtx.font = cs.fontWeight + ' ' + px + 'px ' + cs.fontFamily;
return String(el.textContent).split(/[\s-]+/).reduce(function (m, w) {
return Math.max(m, measureCtx.measureText(w).width);
}, 0);
}
function fitText(el) {
if (!el || !el.clientWidth) { return; }
el.style.fontSize = '';
var avail = el.clientWidth - 2;
var px = parseFloat(root.getComputedStyle(el).fontSize) || 16;
while (px > MIN_LABEL_PX && longestWordPx(el, px) > avail) { px = Math.max(MIN_LABEL_PX, px - 1); }
el.style.fontSize = px + 'px';
}
function hasDrawing(molId) {
var e = entityOf('molecule', molId);
if (e && e.noStructure) { return false; }
return !!(MG.renderMolecule && MG.geometry && MG.geometry[molId]);
}
function markMore(list) {
list.classList.toggle('is-more', list.scrollTop + list.clientHeight < list.scrollHeight - 2);
list.classList.toggle('is-less', list.scrollTop > 2);
}
function isTapered(molId) {
var g = MG.geometry && MG.geometry[molId];
return !!g && Array.isArray(g.bonds) && g.bonds.some(function (b) { return !!b && Array.isArray(b.taper) && b.taper.length >= 2; });
}
function shortLabel(kind, id) {
var e = entityOf(kind, id);
if (!e) { return String(id); }
return e.short || e.name || String(id);
}
var MAP_PAIRS = {
adenylate: ['#FFD08A', '#5C2E00'], redox: ['#FFD08A', '#5C2E00'], carrier: ['#D7DBE0', '#141414'], small: ['#FFFFFF', '#141414']
};
function mapPair(cofId) {
var e = entityOf('cofactor', cofId);
if (!e || !MAP_PAIRS.hasOwnProperty(e.family)) { return null; }
return ['var(--mg-map-' + e.family + ', ' + MAP_PAIRS[e.family][0] + ')', 'var(--mg-map-' + e.family + '-ink, ' + MAP_PAIRS[e.family][1] + ')'];
}
function normHint(res) {
if (!res) { return null; }
var lines;
if (Array.isArray(res.lines)) {
lines = res.lines.filter(function (l) { return l && typeof l.text === 'string' && l.text; })
.map(function (l) { return { label: String(l.label || 'Một manh mối'), text: l.text }; });
} else if (typeof res.text === 'string' && res.text) {
lines = [{ label: 'Một manh mối', text: res.text }];
} else {
return null;
}
return {
level: typeof res.level === 'number' ? res.level : lines.length,
lines: lines,
more: res.more !== false,
total: typeof res.total === 'number' ? res.total : (typeof res.levels === 'number' ? res.levels : null)
};
}
function hintLabel(st) {
if (st && st.more === false) { return 'Hết gợi ý'; }
if (!st || !st.level) { return 'Gợi ý'; }
return st.total ? 'Gợi ý (' + st.level + '/' + st.total + ')' : 'Gợi ý (' + st.level + ')';
}
function optionContent(q, opt, size) {
if (q.format === 'structures' && opt.entityKind === 'molecule') {
if (hasDrawing(opt.id)) {
var svg = structureSVG(opt.id, size[0], size[1], null, opt.label);
if (svg) { return h('span', { class: 'mgq-optart', html: svg }); }
}
return h('span', { class: 'mgq-optshort', text: shortLabel('molecule', opt.id) });
}
return h('span', { class: 'mgq-optlabel', text: opt.label });
}
function joinParts(parts) {
var out = [];
parts.forEach(function (p, i) {
if (i > 0) { out.push(h('span', { class: 'mgq-op', 'aria-hidden': 'true', text: '+' })); }
out.push(p);
});
return out;
}
function flash(node, cls) {
if (!node) { return; }
node.classList.remove(cls);
void node.offsetWidth;   // restart the animation even when the class is still on
node.classList.add(cls);
node.addEventListener('animationend', function done(e) {
if (e.target !== node) { return; }
node.classList.remove(cls);
node.removeEventListener('animationend', done);
});
}
function pausableClock(base) {
var hiddenTotal = 0;   // ms paused in earlier spells
var hiddenAt = null;   // when the current pause began, or null
return {
now: function () {
var t = base();
return t - hiddenTotal - (hiddenAt === null ? 0 : t - hiddenAt);
},
setHidden: function (hidden) {
var t = base();
if (hidden && hiddenAt === null) { hiddenAt = t; }
else if (!hidden && hiddenAt !== null) { hiddenTotal += t - hiddenAt; hiddenAt = null; }
}
};
}
function mount(container, config, hooks) {
if (!container) { throw new Error('MG.quiz.mount needs a container'); }
if (!MG.ui || typeof MG.ui.el !== 'function') { throw new Error('MG.quiz.mount needs MG.ui from app.js'); }
var cfg = config || {};
var hk = hooks || {};
var review = !!cfg.review;
var settings = cfg.settings || {};
var clock = pausableClock(typeof cfg.now === 'function' ? cfg.now : function () { return Date.now(); });
var engineCfg = {};
Object.keys(cfg).forEach(function (k) { engineCfg[k] = cfg[k]; });
delete engineCfg.settings;
delete engineCfg.review;
delete engineCfg.theme;
engineCfg.now = clock.now;
if (review) { engineCfg.store = null; }   // a review plays nothing, so it records nothing
var game = MG.engine.createGame(engineCfg);
var pathway = game.pathway;
function enzWordOf(rid) {
var r = rid ? pathway.reactions.filter(function (x) { return x.id === rid; })[0] : null;
if (r && r.terms && r.terms.enz) { return r.terms.enz; }
return pathway.terms && pathway.terms.enz ? pathway.terms.enz : 'enzyme';
}
var enzWords = {};   // the words the map uses for its enzyme slots
pathway.reactions.forEach(function (r) { enzWords[enzWordOf(r.id)] = true; });
var mode = game.mode;
function isBig() { return pathway.id === 'full' || pathway.big === true; }
var rxnById = {};
pathway.reactions.forEach(function (r) { rxnById[r.id] = r; });
var showLabels = typeof settings.showSlotLabels === 'boolean' ? settings.showSlotLabels : true;
var reduce = reducedMotion();
var destroyed = false;
var finishing = false;      // from the done event on: the celebration runs and nothing else changes
var moved = false;          // the Continue button was pressed: the summary has gone to the shell
var locked = false;         // build: a right answer or a reveal shows its feedback
var busy = false;           // pick and type: the chooser shows a reveal and is closing
var shownQ = null;          // build: the question on screen, with fresh options
var wrongBySlot = {};       // slot id -> { option id: true } for wrong tries, drawn red
var chooserSlot = null;     // pick and type: the slot whose chooser is open
var chooserQ = null;        // the chooser's fresh question
var chooserUI = null;       // the chooser's elements
var chooser = null;         // the chooser element
var chooserRaf = 0;         // frame handle of the popover tracker
var lastNext = -1;          // slot list index of the last "Next empty slot"
var knownRxn = null;        // equation card: the reaction drawn last
var knownIds = {};          // equation card: slot ids that were known when it was drawn
var keyboardUsed = false;   // the last input was a key: slots may take focus
var tabHidden = false;      // the tab is hidden
var modalPaused = false;    // the leave confirmation is open
var settingsPaused = false; // Settings is open over the quiz (the gear in the header)
var leaveModal = null;      // the leave confirmation, while it is open
var shownWhy = {};          // reaction id -> true once its why has been shown (or the banner carried it)
var timers = { tick: 0, next: 0, close: 0, finish: 0, review: 0 };
var unsubscribe = null;
var chart = null;
function wrongFor(slotId) {
if (!wrongBySlot[slotId]) { wrongBySlot[slotId] = {}; }
return wrongBySlot[slotId];
}
function syncClock() {
clock.setHidden(tabHidden || modalPaused || settingsPaused);
}
function partSize() {
return isWide() ? SIZE_PART_WIDE : SIZE_PART_PHONE;
}
var contextEl = h('p', { class: 'mgq-context mgq-head__context' });
var rightNum = h('span', { class: 'mgq-num', text: '0' });
var wrongNum = h('span', { class: 'mgq-num', text: '0' });
var countRight = review ? null : h('span', { class: 'mg-count mg-count--right', title: 'Số câu đúng' }, MG.ui.icon('badge-check'), rightNum);
var countWrong = review ? null : h('span', { class: 'mg-count mg-count--wrong', title: 'Số câu sai' }, MG.ui.icon('badge-cross'), wrongNum);
var timerEl = review ? null : h('span', { class: 'mg-timer', text: '0:00' });
var titleEl = review ? h('span', { class: 'mgq-title', text: 'Review: ' + pathway.title }) : null;
var backBtn = h('button', { type: 'button', class: 'mg-btn mg-btn--icon mgq-back', title: 'Về menu', 'aria-label': 'Về menu', on: { click: exitQuiz } }, MG.ui.icon('undo'));
var settingsBtn = typeof hk.onSettings === 'function' ? h('button', {
type: 'button', class: 'mg-btn mg-btn--icon mgq-settings' + (review ? ' mgq-settings--review' : ''), title: 'Cài đặt', 'aria-label': 'Cài đặt', 'data-key': 'quiz:settings',
on: { click: openSettings }
}, MG.ui.icon('gear')) : null;
var head = h('header', { class: 'mg-header mgq-head' }, backBtn, titleEl, countRight, countWrong, contextEl, timerEl, settingsBtn);
var fillEl = h('span', { style: { width: review ? '100%' : '0%' } });
var barEl = h('div', {
class: 'mg-progress mgq-bar', role: 'progressbar', 'aria-label': 'Tiến độ câu trả lời',
'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': review ? '100' : '0'
}, fillEl);
var statEl = review ? null : h('span', { class: 'mgq-stat', text: '0 đã trả lời, 0 còn lại' });
var barRow = h('div', { class: 'mgq-barrow' }, barEl, statEl);
var side = h('div', { class: 'mgq-side' });
var eqCard = h('div', { class: 'mg-card mg-card--question mgq-eq-card' });
var promptEl = h('h2', { class: 'mg-outlined mgq-prompt' });
var eqBody = h('div', { class: 'mgq-eq' });
eqCard.appendChild(promptEl);
eqCard.appendChild(eqBody);
var gridEl = h('div', { class: 'mg-grid mgq-grid mg-grid--2x3' });
var buildHint = makeHintPanel(hintBuild, revealBuild);
var feedbackEl = h('p', { class: 'mgq-feedback', role: 'status' });
var readoutEl = h('p', { class: 'mgq-readout' });
var nextBtn = h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mgq-next', on: { click: nextEmpty } }, 'Ô trống tiếp theo');
var mapCard = h('div', { class: 'mg-card mg-card--question mgq-map-card' },
h('div', { class: 'mgq-map-card__text' },
h('h2', { class: 'mgq-prompt', text: mode === 'pick' ? 'Điền vào bản đồ' : 'Điền vào chỗ trống' }),
h('p', {
class: 'mgq-context',
text: mode === 'pick' ? 'Chạm vào ô trống trên bản đồ, rồi chọn đáp án từ 6 phương án.' : 'Chạm vào ô trống trên bản đồ, rồi gõ tên đáp án.'
})),
readoutEl, nextBtn);
var reviewCard = h('div', { class: 'mg-card mg-card--question mgq-map-card' },
h('div', { class: 'mgq-map-card__text' },
h('h2', { class: 'mgq-prompt', text: 'Bản đồ hoàn chỉnh' }),
h('p', { class: 'mgq-context', text: Object.keys(enzWords).length > 1 ? 'Chạm vào phân tử, enzyme hoặc protein trên bản đồ để xem chi tiết.'
: 'Chạm vào phân tử hoặc ' + (Object.keys(enzWords)[0] === 'enzyme' ? 'enzyme' : Object.keys(enzWords)[0]) + ' trên bản đồ để xem chi tiết.' })));
var whyLabel = h('span', { class: 'mgq-why__label', text: 'Giải thích' });
var whyText = h('span', { class: 'mgq-why__text' });
var whyNext = !review && mode === 'build' ? h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mgq-why__next', on: { click: skipWhy } }, 'Tiếp') : null;
var whyEl = h('div', { class: 'mgq-why', role: 'status', hidden: true }, h('p', { class: 'mgq-why__body' }, whyLabel, ' ', whyText), whyNext);
if (review) {
side.appendChild(reviewCard);
} else if (mode === 'build') {
side.appendChild(eqCard);
side.appendChild(whyEl);
side.appendChild(buildHint.el);
side.appendChild(gridEl);
side.appendChild(feedbackEl);
} else {
side.appendChild(mapCard);
side.appendChild(whyEl);
}
var coach = null;
var stObj = (MG.store && typeof MG.store.getSettings === 'function') ? MG.store.getSettings() : {};
var coachKey = 'introSeen_' + mode;
var coachSeen = stObj[coachKey] || stObj.introSeen;
if (!review && !coachSeen) {
var coachText = mode === 'build'
? 'Chọn đáp án cho ô màu vàng. "Gợi ý" cho manh mối, "Hiện đáp án" tính 1 lỗi.'
: (mode === 'type'
? 'Chạm ô trống trên bản đồ và tự gõ chính xác tên chất.'
: 'Chạm ô trống trên bản đồ, rồi chọn 1 trong 6 đáp án.');
coach = h('div', { class: 'mgq-coach', role: 'note' },
h('p', { class: 'mgq-coach__text', text: coachText }),
h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mgq-coach__ok', on: { click: function () {
if (coach.parentNode) { coach.parentNode.removeChild(coach); }
var patch = { introSeen: true };
patch[coachKey] = true;
try { MG.store.setSettings(patch); } catch (err) { console.error(err); }
} }
}, 'Đã hiểu'));
side.insertBefore(coach, side.firstChild);
}
var host = h('div', { class: 'mgq-chart' });
var expandBtn = review || mode !== 'build' ? null : h('button', {
type: 'button', class: 'mgq-expand', 'aria-label': 'Phóng to bản đồ', 'aria-expanded': 'false',
on: { click: function () { setExpanded(true); } }
}, h('span', { class: 'mgq-expand__label', text: 'Chạm để phóng to' }));
var closeChartBtn = expandBtn ? h('button', {
type: 'button', class: 'mg-btn mg-btn--icon mgq-chart-close', 'aria-label': 'Đóng bản đồ', title: 'Đóng bản đồ',
on: { click: function () { setExpanded(false); } }
}, MG.ui.icon('close')) : null;
var panel = h('div', { class: 'mgq-panel' }, host, expandBtn, closeChartBtn);
var body = h('div', { class: 'mgq-body' }, side, panel);
var rootEl = h('div', { class: 'mgq-root', 'data-mode': review ? 'review' : mode }, head, barRow, body);
container.appendChild(rootEl);
function placeBuildLines() {
if (review || mode !== 'build' || !buildHint) { return; }
var list = buildHint.list;
if (isWide()) {
list.classList.add('mgq-hints__list--overlay');
if (list.parentNode !== panel) { panel.appendChild(list); }
} else {
list.classList.remove('mgq-hints__list--overlay');
if (list.parentNode !== buildHint.el) { buildHint.el.insertBefore(list, buildHint.say); }
}
}
placeBuildLines();
function askedGroupIds(q) {
var ids = {};
var s = game.slot(q.slotId);
if (!s || !s.group || s.kind !== 'node') { return ids; }
game.slotList.forEach(function (x) {
if (x.scored && x.group === s.group && x.state !== 'filled' && x.state !== 'missed') { ids[x.id] = true; }
});
return ids;
}
function molPart(entry, hl, fresh, asked, rxnId) {
var s = game.slot(entry.slotId);
var known = entry.state === 'known';
var missed = known && !!s && s.state === 'missed';
var size = partSize();
var name = '';
var box;
if (known) {
name = fullName('molecule', entry.value);
var svg = hasDrawing(entry.value) ? structureSVG(entry.value, size[0], size[1], hl, name, isTapered(entry.value) ? RING_LABEL_SCALE : 1) : null;
var changed = !!(hl && hl.length);
box = h('button', {
type: 'button', class: 'mgq-box is-known' + (missed ? ' is-missed' : ''), 'aria-label': name + ', chi tiết',
on: { click: function () { openDetail('molecule', entry.value, { rxnId: rxnId, pathwayId: pathway.id }); } }
}, svg ? h('span', { class: 'mgq-svg', html: svg })
: h('span', { class: 'mgq-boxlabel' + (changed ? ' is-changed' : ''), text: shortLabel('molecule', entry.value) }),
missed ? h('span', { class: 'mgq-mark', 'aria-hidden': 'true', text: '!' }) : null);
} else {
box = h('div', { class: 'mgq-box mgq-box--unknown' + (asked ? ' is-asked' : '') }, '?');
}
var repeats = known && !hasDrawing(entry.value) && String(name).toLowerCase() === String(shortLabel('molecule', entry.value)).toLowerCase();
var nameEl = h('div', { class: 'mgq-name', text: repeats ? '' : name });
return h('div', { class: 'mgq-part' + (fresh ? ' pop' : '') }, box, nameEl);
}
function chipPart(entry, fresh, asked) {
var s = game.slot(entry.slotId);
if (entry.state !== 'known') {
return h('span', { class: 'mg-chip mgq-chip mgq-chip--unknown' + (asked ? ' is-asked' : '') }, '?');
}
var c = entityOf('cofactor', entry.value);
var pair = mapPair(entry.value);
var family = !pair && c && CHIP_FAMILIES[c.family] ? ' mg-chip--' + c.family : '';
var missed = !!s && s.state === 'missed';
var chip = h('button', {
type: 'button', class: 'mg-chip mgq-chip is-known' + family + (pair ? ' mgq-chip--map' : '') + (missed ? ' is-missed' : '') + (fresh ? ' pop' : ''),
on: { click: function () { openDetail('cofactor', entry.value, { pathwayId: pathway.id }); } }
}, partLabel('cofactor', entry.value), missed ? h('span', { class: 'mgq-mark', 'aria-hidden': 'true', text: '!' }) : null);
if (pair) { chip.style.background = pair[0]; chip.style.color = pair[1]; }
return chip;
}
function enzymePill(entry, fresh, asked, rxnId) {
if (entry.state !== 'known') {
return h('span', { class: 'mgq-enz mgq-enz--unknown' + (asked ? ' is-asked' : '') }, '?');
}
var s = game.slot(entry.slotId);
var missed = !!s && s.state === 'missed';
return h('button', {
type: 'button', class: 'mgq-enz is-known' + (missed ? ' is-missed' : '') + (fresh ? ' pop' : ''),
on: { click: function () { openDetail('enzyme', entry.value, { rxnId: rxnId, pathwayId: pathway.id }); } }
}, fullName('enzyme', entry.value), missed ? h('span', { class: 'mgq-mark', 'aria-hidden': 'true', text: '!' }) : null);
}
function renderEquation(q) {
var rxn = rxnById[q.rxnId];
var eq = game.equation(q.rxnId);
var sameRxn = knownRxn === q.rxnId;
var askedIds = askedGroupIds(q);
function fresh(entry) { return entry.state === 'known' && sameRxn && !knownIds[entry.slotId]; }
function asked(entry) { return entry.state === 'active' || !!askedIds[entry.slotId]; }
var inParts = [];
var outParts = [];
eq.subs.forEach(function (e, i) { inParts.push(molPart(e, hlFor(rxn, 'sub', rxn.substrates[i]), fresh(e), asked(e), rxn.id)); });
eq.ins.forEach(function (e) { inParts.push(chipPart(e, fresh(e), asked(e))); });
eq.prods.forEach(function (e, i) { outParts.push(molPart(e, hlFor(rxn, 'prod', rxn.products[i]), fresh(e), asked(e), rxn.id)); });
eq.outs.forEach(function (e) { outParts.push(chipPart(e, fresh(e), asked(e))); });
var pill = enzymePill(eq.enzyme, fresh(eq.enzyme), asked(eq.enzyme), rxn.id);
var now = {};
[eq.subs, eq.ins, eq.prods, eq.outs, [eq.enzyme]].forEach(function (list) {
list.forEach(function (e) { if (e.state === 'known') { now[e.slotId] = true; } });
});
knownIds = now;
knownRxn = q.rxnId;
eqBody.innerHTML = '';
eqBody.appendChild(h('div', { class: 'mgq-row' }, joinParts(inParts)));
eqBody.appendChild(h('div', { class: 'mgq-arrow' }, h('span', { class: 'mgq-arrow__svg', html: ARROW_SVG }), pill));
eqBody.appendChild(h('div', { class: 'mgq-row' }, joinParts(outParts)));
Array.prototype.forEach.call(eqBody.querySelectorAll('.mgq-name, .mgq-boxlabel'), fitText);
}
function renderGrid(q, opts, holder, size, onChoose, twoCols) {
var o = opts || {};
var wrong = wrongFor(q.slotId);
var flashNode = null;
holder.className = 'mg-grid mgq-grid ' + (twoCols ? 'mg-grid--2x2 mgq-grid--struct' : 'mg-grid--2x3');
holder.innerHTML = '';
q.options.forEach(function (opt, i) {
var isCorrect = o.correctId === opt.id;
var isWrong = !isCorrect && !!wrong[opt.id];
var off = isCorrect || isWrong || !!o.lockAll;
var isText = !(q.format === 'structures' && opt.entityKind === 'molecule');
var cls = 'mg-option mgq-opt' + (q.format === 'structures' ? ' mgq-opt--struct' : '');
if (!isText && !hasDrawing(opt.id)) { cls += ' mgq-opt--short'; }
if (isText && longestWord(opt.label) > 12) { cls += ' is-long'; }
if (isCorrect) { cls += ' is-correct'; }
if (isWrong) { cls += ' is-wrong'; }
if (off) { cls += ' is-disabled'; }
var btn = h('button', {
type: 'button', class: cls, 'data-id': opt.id, 'aria-label': opt.label, disabled: off,
on: { click: function () { onChoose(opt.id); } }
}, optionContent(q, opt, size), h('span', { class: 'mgq-key', 'aria-hidden': 'true', text: String(i + 1) }));
if (o.flashId && o.flashId === opt.id) { flashNode = btn; }
holder.appendChild(btn);
});
Array.prototype.forEach.call(holder.querySelectorAll('.mgq-optlabel, .mgq-optshort'), fitText);
flash(flashNode, 'shake');
}
function makeHintPanel(onHint, onReveal, bare) {
var btn = h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mgq-act mgq-hint-btn', on: { click: onHint } }, 'Gợi ý');
var reveal = onReveal
? h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mgq-act mgq-reveal-btn',
title: 'Hiện đáp án chính xác (tính là 1 lỗi sai)',
on: { click: onReveal }
},
h('span', { text: 'Hiện đáp án' }),
h('span', { class: 'mgq-reveal-sub', text: '(tính 1 lỗi)' })
)
: null;
var list = h('div', { class: 'mgq-hints__list', on: { scroll: function () { markMore(list); } } });
var say = h('p', { class: 'mgq-sr-only', 'aria-live': 'polite' });
var cls = 'mgq-hints' + (bare ? ' mgq-hints--bare' : '');
var el = bare
? h('div', { class: cls, role: 'region', 'aria-label': 'Gợi ý' }, list, say)
: h('div', { class: cls, role: 'region', 'aria-label': 'Gợi ý' },
h('div', { class: 'mgq-hints__bar' }, btn, reveal),
list, say);
return { el: el, btn: btn, reveal: reveal, list: list, say: say, st: null, open: {}, shown: 0 };
}
function renderHintPanel(p) {
var st = p.st;
var lines = st ? st.lines : [];
var phone = !isWide();
p.btn.textContent = hintLabel(st);
p.list.innerHTML = '';
p.list.classList.toggle('is-empty', !lines.length);
p.el.classList.toggle('is-empty', !lines.length);
if (!lines.length) {
p.list.appendChild(h('p', { class: 'mgq-hints__empty', text: st && st.more === false ? 'Không có gợi ý cho bước này.' : 'Chạm Gợi ý để xem manh mối.' }));
} else if (lines.length > 1) {
var earlier = lines.length - 1;
p.list.appendChild(h('p', { class: 'mgq-hints__earlier', text: earlier + ' gợi ý trước đó' }));
}
lines.forEach(function (ln, i) {
var last = i === lines.length - 1;
var folded = phone && !last && !p.open[i];
var toggle = null;
if (phone && !last) {
toggle = h('button', {
type: 'button', class: 'mgq-hint-line__toggle', 'aria-expanded': folded ? 'false' : 'true',
on: { click: function () { p.open[i] = !p.open[i]; renderHintPanel(p); } }
}, folded ? 'Hiện' : 'Ẩn');
}
p.list.appendChild(h('div', { class: 'mgq-hint-line' + (folded ? ' is-folded' : '') },
h('p', { class: 'mgq-hint-line__text' },
h('span', { class: 'mgq-hint-line__label', text: ln.label }), ' ',
h('span', { class: 'mgq-hint-line__body', text: ln.text })),
toggle));
});
if (lines.length > p.shown) {
var fresh = lines[lines.length - 1];
p.say.textContent = fresh.label + '. ' + fresh.text;
}
p.shown = lines.length;
var newest = p.list.lastElementChild;
p.list.scrollTop = newest ? newest.offsetTop : 0;
markMore(p.list);
}
function clearHintPanel(p) {
p.st = null;
p.open = {};
p.shown = 0;
p.say.textContent = '';
renderHintPanel(p);
}
function engineHint(slotId) {
try { return game.hint(slotId); }
catch (err) { console.error(err); return null; }
}
function whyOf(rid) {
var r = rid ? rxnById[rid] : null;
if (!r || !MG.hints || typeof MG.hints.why !== 'function') { return ''; }
try { return String(MG.hints.why(pathway, r) || ''); }
catch (err) { console.error(err); return ''; }
}
function stepWrapped(rid) {
if (!rid) { return false; }
var slots = game.slotList.filter(function (s) { return s.scored && s.rxn === rid; });
if (!slots.length) { return false; }
var done = slots.every(function (s) { return s.state === 'filled' || s.state === 'missed'; });
var missed = slots.some(function (s) { return s.state === 'missed' || s.wrong > 0; });
return done && missed;
}
function showWhy(rid) {
if (shownWhy[rid]) { return false; }
shownWhy[rid] = true;
var text = whyOf(rid);
if (!text) { return false; }
whyLabel.textContent = mode === 'build' ? 'Tại sao' : stepCaption(rid);
whyText.textContent = text;
whyEl.hidden = false;
return true;
}
function hideWhy() {
whyEl.hidden = true;
whyText.textContent = '';
}
function lastWhy() {
for (var i = 0; i < pathway.order.length; i++) {
var rid = pathway.order[i];
if (!shownWhy[rid] && stepWrapped(rid)) { shownWhy[rid] = true; return whyOf(rid); }
}
return '';
}
function skipWhy() {
if (destroyed || finishing || !timers.next) { return; }
clearTimeout(timers.next);
afterFeedback();
}
function renderBuildQuestion(q) {
shownQ = q;
clearHintPanel(buildHint);
hideWhy();
promptEl.textContent = q.prompt;   // the engine words group questions ("Name one product ...", "Name the other ...")
contextEl.textContent = q.context || '';
feedbackEl.textContent = '';
renderEquation(q);
renderGrid(q, {}, gridEl, SIZE_BUILD_OPT, chooseBuild, q.format === 'structures');
syncBuildButtons();
}
function syncBuildButtons() {
var off = locked || finishing || !shownQ;
buildHint.btn.disabled = off || !!(buildHint.st && buildHint.st.more === false);
buildHint.reveal.disabled = off;
}
function chooseBuild(optId) {
if (locked || finishing || !shownQ) { return; }
var q = shownQ;
var res = engineAnswer(q.slotId, optId);
if (res.ok) { buildRight(q, optId, res); }
else { buildWrong(q, optId); }
}
function buildWrong(q, optId) {
wrongFor(q.slotId)[optId] = true;
shownQ = game.options(q.slotId) || q;
renderGrid(shownQ, { flashId: optId }, gridEl, SIZE_BUILD_OPT, chooseBuild, shownQ.format === 'structures');
feedbackEl.textContent = 'Chưa đúng, hãy thử lại.';
}
function buildRight(q, optId, res) {
if (MG.sound) { MG.sound.correct(); }
locked = true;
syncBuildButtons();
renderGrid(q, { correctId: optId, lockAll: true }, gridEl, SIZE_BUILD_OPT, chooseBuild, q.format === 'structures');
renderEquation(q);
feedbackEl.textContent = 'Chính xác!';
if (res.done || finishing) { return; }   // the done event has started the celebration
var pause = stepWrapped(q.rxnId) && showWhy(q.rxnId) ? WHY_MS : NEXT_MS;
timers.next = setTimeout(afterFeedback, pause);
}
function afterFeedback() {
timers.next = 0;
if (destroyed || finishing) { return; }
locked = false;
var q = game.current();
if (!q) { syncBuildButtons(); return; }
renderBuildQuestion(q);
focusChart(q.slotId, isBig() ? FULL_ZOOM : FOCUS_ZOOM);
}
function hintBuild() {
if (locked || finishing || !shownQ) { return; }
var st = normHint(engineHint(shownQ.slotId));
if (!st) { return; }
buildHint.st = st;
renderHintPanel(buildHint);
syncBuildButtons();
}
function revealBuild() {
if (locked || finishing || !shownQ) { return; }
var q = shownQ;
var res = engineReveal(q.slotId);
if (!res.ok) { return; }
locked = true;
syncBuildButtons();
renderGrid(q, { correctId: res.expected, lockAll: true }, gridEl, SIZE_BUILD_OPT, chooseBuild, q.format === 'structures');
renderEquation(q);
feedbackEl.textContent = 'Đáp án là: ' + fullName(q.entityKind, res.expected) + '.';
if (res.done || finishing) { return; }
var pause = stepWrapped(q.rxnId) && showWhy(q.rxnId) ? WHY_MS : REVEAL_MS;
timers.next = setTimeout(afterFeedback, pause);
}
function kindWord(s) {
if (s.kind === 'enz') { return enzWordOf(s.rxn); }
if (s.kind === 'in') { return 'consumed'; }
if (s.kind === 'out') { return 'released'; }
var r = rxnById[s.rxn];
return r && r.products.indexOf(s.node) >= 0 ? 'product' : 'substrate';
}
function stepCaption(rxnId) {
var r = rxnById[rxnId];
if (!r) { return ''; }
if (r.label) { return r.label; }
if (pathway.id !== 'full') { return 'Bước ' + r.step; }
if (rxnId === 'pdc') { return 'Phản ứng liên kết (PDC)'; }
var gly = !!MG.pathways && !!MG.pathways.glycolysis && MG.pathways.glycolysis.order.indexOf(rxnId) >= 0;
return (gly ? 'Bước Đường phân ' : 'Bước Chu trình TCA ') + r.step;
}
function chooserHeading(q) {
var s = game.slot(q.slotId);
if (!s || !s.rxn) { return 'Phân tử ban đầu'; }
return stepCaption(s.rxn) + ': ' + kindWord(s);
}
function buildChooser(q) {
var ui = {
box: null,
hint: makeHintPanel(chooserHint, null, true),
grid: h('div', { class: 'mgq-chooser__grid' }),
msg: h('div', { class: 'mgq-chooser__msg', role: 'status' }),
input: null,
submit: null,
revealBtn: h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mgq-act mgq-reveal-btn', on: { click: chooserReveal } }, 'Hiện đáp án')
};
var heading = chooserHeading(q);
var body;
if (mode === 'type') {
ui.input = h('input', {
class: 'mg-input mgq-input', type: 'text', placeholder: 'Nhập câu trả lời của bạn', 'aria-label': 'Nhập câu trả lời của bạn',
autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
on: {
keydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); submitTyped(); } },
input: function () { ui.input.classList.remove('is-error'); }
}
});
ui.submit = h('button', { type: 'button', class: 'mg-btn mg-btn--primary mgq-submit', on: { click: submitTyped } }, 'Gửi');
body = h('div', { class: 'mgq-typing' }, ui.input, ui.submit);
} else {
body = ui.grid;
}
ui.box = h('div', {
class: 'mgq-chooser ' + (isWide() ? 'mgq-chooser--pop' : 'mgq-chooser--sheet'),
role: 'dialog', 'aria-label': heading
},
h('div', { class: 'mgq-chooser__head' },
h('div', { class: 'mgq-chooser__titles' },
h('h2', { class: 'mgq-chooser__title', text: heading }),
h('p', { class: 'mgq-chooser__prompt', text: q.prompt })),
h('div', { class: 'mgq-chooser__tools' },
ui.revealBtn,
h('button', {
type: 'button', class: 'mg-btn mg-btn--icon mgq-close', 'aria-label': 'Đóng', title: 'Đóng',
on: { click: function () { closeChooser(true); } }
}, MG.ui.icon('close')))),
ui.hint.el,
h('div', { class: 'mgq-chooser__body' }, body),
h('div', { class: 'mgq-chooser__foot' }, ui.msg, ui.hint.btn));
renderHintPanel(ui.hint);   // the empty panel shows its placeholder line before the first hint
return ui;
}
function openChooser(slotId) {
if (destroyed || finishing || review || mode === 'build' || !chart) { return; }
closeChooser(false);
var q = game.options(slotId);
if (!q) { return; }   // already filled or missed
chooserSlot = slotId;
chooserQ = q;
chooserUI = buildChooser(q);
chooser = chooserUI.box;
if (mode === 'pick') { renderGrid(q, {}, chooserUI.grid, SIZE_CHOOSER_OPT, chooseFromChooser, false); }
if (game.slot(slotId).state === 'empty') { chart.setSlot(slotId, { state: 'active' }); }
rootEl.appendChild(chooser);
Array.prototype.forEach.call(chooserUI.grid.querySelectorAll('.mgq-optlabel, .mgq-optshort'), fitText);
if (!slotClear(slotId)) { chart.focus(slotId, { zoom: FOCUS_ZOOM }); }
placeChooser();
chooserRaf = requestAnimationFrame(trackChooser);
if (mode === 'type') {
chooserUI.input.focus({ preventScroll: true });
} else if (keyboardUsed) {
var first = chooserUI.grid.querySelector('button:not([disabled])');
if (first) { first.focus({ preventScroll: true }); }
}
}
function closeChooser(restore) {
var slotId = chooserSlot;
clearTimeout(timers.close);
timers.close = 0;
removeChooserDom();
if (slotId !== null && !destroyed && chart) {
syncChartSlot(slotId);
if (restore && keyboardUsed) { focusSlotEl(slotId); }
}
}
function removeChooserDom() {
if (chooserRaf) { cancelAnimationFrame(chooserRaf); chooserRaf = 0; }
if (chooser && chooser.parentNode) { chooser.parentNode.removeChild(chooser); }
chooser = null;
chooserUI = null;
chooserQ = null;
chooserSlot = null;
busy = false;
}
function refreshChooser(flashId) {
if (mode !== 'pick' || !chooserUI || chooserSlot === null) { return; }
var q = game.options(chooserSlot);
if (!q) { return; }
chooserQ = q;
renderGrid(q, { flashId: flashId || null, lockAll: busy }, chooserUI.grid, SIZE_CHOOSER_OPT, chooseFromChooser, false);
}
function setChooserMsg(lines) {
if (!chooserUI) { return; }
chooserUI.msg.innerHTML = '';
(Array.isArray(lines) ? lines : [lines]).forEach(function (t) {
chooserUI.msg.appendChild(h('span', { class: 'mgq-msg-line', text: t }));
});
}
function slotOnPanel(slotId) {
var r = chart ? chart.getSlotRect(slotId) : null;
if (!r) { return false; }
var pr = panel.getBoundingClientRect();
var cx = r.left + r.width / 2;
var cy = r.top + r.height / 2;
return cx > pr.left && cx < pr.right && cy > pr.top && cy < pr.bottom;
}
function slotClear(slotId) {
if (!slotOnPanel(slotId)) { return false; }
if (isWide() || !chooser) { return true; }
var r = chart ? chart.getSlotRect(slotId) : null;
return !!r && r.top + r.height / 2 < chooser.getBoundingClientRect().top - 8;
}
function placeChooser() {
if (!chooser || chooserSlot === null || !chart || !chooser.classList.contains('mgq-chooser--pop')) { return; }
var r = chart.getSlotRect(chooserSlot);
if (!r) { return; }
var pr = panel.getBoundingClientRect();
var vw = root.innerWidth || 1200;
var vh = root.innerHeight || 800;
var w = chooser.offsetWidth || 430;
var ht = chooser.offsetHeight || 300;
var onChart = slotOnPanel(chooserSlot);
var xLo = onChart ? 8 : Math.max(8, pr.left + 8);
var xHi = onChart ? vw - w - 8 : Math.min(vw - w - 8, pr.right - w - 8);
var yLo = onChart ? 8 : Math.max(8, pr.top + 8);
var yHi = onChart ? vh - ht - 8 : Math.min(vh - ht - 8, pr.bottom - ht - 8);
var cx = r.left + r.width / 2;
var cy = r.top + r.height / 2;
function fits(c) { return c.x >= xLo && c.x <= xHi && c.y >= yLo && c.y <= yHi; }
var across = clamp(cx - w / 2, xLo, Math.max(xLo, xHi));
var spot = [
{ x: across, y: r.bottom + 12 },
{ x: across, y: r.top - ht - 12 },
{ x: r.right + 12, y: cy - ht / 2 },
{ x: r.left - w - 12, y: cy - ht / 2 }
].filter(fits)[0] || (vw - r.right >= r.left ? { x: r.right + 12, y: cy - ht / 2 } : { x: r.left - w - 12, y: cy - ht / 2 });
chooser.style.visibility = 'visible';
chooser.style.left = Math.round(clamp(spot.x, xLo, Math.max(xLo, xHi))) + 'px';
chooser.style.top = Math.round(clamp(spot.y, yLo, Math.max(yLo, yHi))) + 'px';
}
function trackChooser() {
chooserRaf = 0;
if (!chooser || destroyed) { return; }
placeChooser();
chooserRaf = requestAnimationFrame(trackChooser);
}
function chooseFromChooser(optId) {
if (chooserSlot === null || busy || finishing) { return; }
var slotId = chooserSlot;
var res = engineAnswer(slotId, optId);
if (res.ok) { chooserRight(slotId); return; }
wrongFor(slotId)[optId] = true;
refreshChooser(optId);
setChooserMsg('Chưa đúng, hãy thử lại.');
}
function chooserRight(slotId) {
if (MG.sound) { MG.sound.correct(); }
var s = game.slot(slotId);
if (s && s.value) { toast('Correct: ' + fullName(s.entityKind, s.value)); }
closeChooser(false);
if (!finishing && s && s.rxn && stepWrapped(s.rxn)) { showWhy(s.rxn); }
}
function chooserHint() {
if (chooserSlot === null || busy || finishing || !chooserUI) { return; }
var st = normHint(engineHint(chooserSlot));
if (!st) { return; }
chooserUI.hint.st = st;
renderHintPanel(chooserUI.hint);
syncChooserButtons();
}
function syncChooserButtons() {
if (!chooserUI) { return; }
var off = busy || finishing;
chooserUI.hint.btn.disabled = off || !!(chooserUI.hint.st && chooserUI.hint.st.more === false);
chooserUI.revealBtn.disabled = off;
}
function chooserReveal() {
if (chooserSlot === null || busy || finishing) { return; }
var slotId = chooserSlot;
var res = engineReveal(slotId);
if (!res.ok) { return; }
busy = true;
var name = fullName(game.slot(slotId).entityKind, res.expected);
if (mode === 'type') { chooserUI.input.value = name; }
else { renderGrid(chooserQ, { correctId: res.expected, lockAll: true }, chooserUI.grid, SIZE_CHOOSER_OPT, chooseFromChooser, false); }
syncChooserButtons();
setChooserMsg('Đáp án là: ' + name + '.');
var revealed = game.slot(slotId);
if (!finishing && revealed && revealed.rxn && stepWrapped(revealed.rxn)) { showWhy(revealed.rxn); }
timers.close = setTimeout(function () { timers.close = 0; closeChooser(true); }, REVEAL_MS);
}
function submitTyped() {
if (mode !== 'type' || chooserSlot === null || busy || finishing || !chooserUI) { return; }
var slotId = chooserSlot;
var text = chooserUI.input.value;
var norm = MG.match && typeof MG.match.normalize === 'function' ? MG.match.normalize(text) : String(text).trim();
if (!norm) { setChooserMsg('Hãy nhập câu trả lời trước.'); return; }
var res = engineAnswer(slotId, text);
if (res.ok) { chooserRight(slotId); return; }
var s = game.slot(slotId);
var lines = ['Chưa đúng. Hãy thử lại.'];
var other = MG.match && typeof MG.match.identify === 'function' ? MG.match.identify(s.entityKind, text) : null;
if (other) { lines.push('Đó là ' + fullName(s.entityKind, other) + ', nhưng không nằm ở vị trí này.'); }
setChooserMsg(lines);
chooserUI.input.classList.add('is-error');
flash(chooserUI.input, 'shake');
chooserUI.input.select();
}
function engineAnswer(slotId, value) {
try { return game.answer(slotId, value); }
catch (err) { console.error(err); return recoverAfterFault(slotId, false); }
}
function engineReveal(slotId) {
try { return game.reveal(slotId); }
catch (err) { console.error(err); return recoverAfterFault(slotId, true); }
}
function recoverAfterFault(slotId, revealed) {
var s = game.slot(slotId);
var placed = !!s && (s.state === 'filled' || s.state === 'missed');
if (!placed) { return { ok: false, slotId: slotId, filled: [], done: game.isDone() }; }
game.slotList.forEach(function (x) { syncChartSlot(x.id); });
syncStats();
if (game.isDone()) { finishGame(); }
var res = { ok: true, slotId: slotId, filled: [slotId], done: game.isDone() };
if (revealed) { res.expected = s.value; }
return res;
}
function slotElement(id) {
return host.querySelector('.mgc-slot[data-slot="' + id + '"]');
}
function focusSlotEl(id) {
var g = slotElement(id);
if (g && typeof g.focus === 'function') { g.focus({ preventScroll: true }); }
}
function focusChart(slotId, zoom) {
if (!destroyed && chart && slotId) { chart.focus(slotId, { zoom: zoom || FOCUS_ZOOM }); }
}
function findEmpty(from) {
var list = game.slotList;
var n = list.length;
for (var k = 0; k < n; k++) {
var i = (((from + k) % n) + n) % n;
if (list[i].scored && list[i].state === 'empty') { return i; }
}
return -1;
}
function nextEmpty() {
if (destroyed || finishing || review) { return; }
closeChooser(false);
var i = findEmpty(lastNext + 1);
if (i < 0) { toast('Tất cả các ô đã được điền.'); return; }
lastNext = i;
var id = game.slotList[i].id;
focusChart(id, FOCUS_ZOOM);
if (!isWide()) { openChooser(id); return; }
if (keyboardUsed) { focusSlotEl(id); }
}
function syncChartSlot(id) {
var s = game.slot(id);
if (!s || !chart) { return; }
var state = s.state;
if (state === 'empty' && id === chooserSlot) { state = 'active'; }
chart.setSlot(id, { state: state, value: s.value });
}
function syncStats() {
if (destroyed || review) { return; }
var st = game.stats();
rightNum.textContent = String(st.right);
wrongNum.textContent = String(st.wrong);
var pct = st.total ? Math.round((st.filled / st.total) * 100) : 100;
fillEl.style.width = pct + '%';
barEl.setAttribute('aria-valuenow', String(pct));
var left = Math.max(0, st.total - st.filled);
statEl.textContent = st.filled + ' đã trả lời, ' + left + ' còn lại';
statEl.title = st.filled + ' của ' + st.total + ' đã trả lời';
readoutEl.textContent = st.filled + ' của ' + st.total + ' đã trả lời';
tick();
}
function tick() {
if (timerEl && !destroyed) { timerEl.textContent = formatTime(game.elapsed()); }
}
function onEngineEvent(evt) {
if (destroyed) { return; }
if (evt.type === 'slot') { syncChartSlot(evt.slotId); }
else if (evt.type === 'stats') { syncStats(); }
else if (evt.type === 'done') { finishGame(); }
}
function finishGame() {
if (finishing || destroyed) { return; }
removeChooserDom();
finishing = true;
locked = true;
busy = true;
clearTimeout(timers.next);
timers.next = 0;
panel.classList.remove('is-open');
tick();
syncBuildButtons();
celebrate();
if (MG.sound) { MG.sound.complete(); }
}
function moveOn() {
if (destroyed || !finishing || moved) { return; }
moved = true;
if (typeof hk.onFinish === 'function') { hk.onFinish(game.summary()); }
}
function celebrate() {
if (chart) { chart.fit({ animate: true }); }
panel.classList.add('mgq-celebrate');
var groups = host.querySelectorAll('.mgc-slot');
for (var i = 0; i < groups.length; i++) { groups[i].style.setProperty('--mgq-d', (i * 30) + 'ms'); }
var st = game.stats();
var why = lastWhy();
var mascot = MG.brand && MG.brand.mascot
? h('img', { class: 'mgq-banner__mascot', src: MG.brand.mascot, alt: '', 'aria-hidden': 'true', width: 112, height: 111, draggable: 'false' })
: null;
var banner = h('div', { class: 'mg-card mg-card--question mgq-banner', role: 'status' },
mascot,
h('h2', { class: 'mgq-banner__title mg-outlined', text: 'Chúc mừng bạn!' }),
h('p', { class: 'mgq-banner__lead', text: 'Lộ trình đã hoàn tất!' }),
h('p', { class: 'mgq-banner__text', text: st.right + ' right, ' + st.wrong + ' wrong' }),
why ? h('p', { class: 'mgq-banner__why' }, h('span', { class: 'mgq-why__label', text: 'Tại sao' }), ' ', why) : null,
h('button', { type: 'button', class: 'mg-btn mg-btn--primary mgq-banner__go', 'data-key': 'celebrate:continue', on: { click: moveOn } }, 'Tiếp tục'));
if (isWide()) { panel.appendChild(banner); }
else { banner.classList.add('mgq-banner--top'); rootEl.appendChild(banner); }
var go = banner.querySelector('.mgq-banner__go');
if (go && go.focus) { try { go.focus({ preventScroll: true }); } catch (e) { /* focus is a courtesy */ } }
}
function setExpanded(open) {
if (!expandBtn || destroyed) { return; }
panel.classList.toggle('is-open', !!open);
expandBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
var id = shownQ ? shownQ.slotId : null;
requestAnimationFrame(function () {
if (!destroyed && id) { focusChart(id, open ? FULL_ZOOM : FOCUS_ZOOM); }
});
}
function firstReactionOf(nodeId) {
for (var i = 0; i < pathway.order.length; i++) {
var r = rxnById[pathway.order[i]];
if (r && (r.substrates.indexOf(nodeId) >= 0 || r.products.indexOf(nodeId) >= 0)) { return r; }
}
return null;
}
function openNodeDetail(nodeId) {
if (destroyed) { return; }
closeChooser(false);
var r = firstReactionOf(nodeId);
openDetail('node', nodeId, { pathwayId: pathway.id, rxnId: r ? r.id : null });
}
function openEnzymeDetail(rxnId) {
var r = rxnById[rxnId];
if (destroyed || !r) { return; }
closeChooser(false);
openDetail('enzyme', r.enzyme, { rxnId: r.id, pathwayId: pathway.id });
}
function openChipDetail(slotId) {
if (destroyed) { return; }
var live = game && typeof game.slot === 'function' ? game.slot(slotId) : null;
var id = live && live.value ? live.value : null;
if (!id) {
var meta = MG.slots.list(pathway).filter(function (x) { return x.id === slotId; })[0];
id = meta ? meta.answer : null;
}
if (!id) { return; }
closeChooser(false);
openDetail('cofactor', id, { pathwayId: pathway.id });
}
function exitQuiz() {
if (destroyed || leaveModal) { return; }
if (!review && !finishing && game.stats().filled > 0 && MG.ui && typeof MG.ui.modal === 'function') {
askLeave();
return;
}
leaveNow();
}
function leaveNow() {
if (!destroyed && typeof hk.onExit === 'function') { hk.onExit(); }
}
var settingsOpen = false;
function openSettings() {
if (destroyed || leaveModal || settingsOpen || typeof hk.onSettings !== 'function') { return; }
settingsOpen = true;
settingsPaused = true;
syncClock();
hk.onSettings(function (now) {
settingsOpen = false;
settingsPaused = false;
if (destroyed) { return; }
syncClock();
if (now && typeof now.showSlotLabels === 'boolean' && now.showSlotLabels !== showLabels) {
showLabels = now.showSlotLabels;
if (chart && typeof chart.setShowSlotLabels === 'function') { chart.setShowSlotLabels(showLabels); }
}
});
}
function askLeave() {
modalPaused = true;
syncClock();
var body = h('div', { class: 'mgq-leave' },
h('p', { class: 'mgq-leave__text', text: 'Tiến trình của vòng chơi này sẽ bị mất.' }),
h('div', { class: 'mgq-leave__actions' },
h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mgq-leave__stay',
on: { click: function () { if (leaveModal) { leaveModal.close(); } } }
}, 'Ở lại'),
h('button', {
type: 'button', class: 'mg-btn mg-btn--danger mgq-leave__go',
on: { click: function () { if (leaveModal) { leaveModal.close(); } leaveNow(); } }
}, 'Rời khỏi')));
leaveModal = MG.ui.modal({
title: 'Rời bài quiz?', label: 'Rời bài quiz?', body: body,
onClose: function () {
leaveModal = null;
modalPaused = false;
if (!destroyed) { syncClock(); }
}
});
}
function onKey(e) {
if (destroyed || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) { return; }
keyboardUsed = true;
if (document.querySelector('.mg-modal')) { return; }
if (e.key === 'Escape' || e.key === 'Esc') {
if (panel.classList.contains('is-open')) { e.preventDefault(); setExpanded(false); return; }
if (chooser && !finishing) { e.preventDefault(); closeChooser(true); }
return;
}
if (finishing || review) { return; }
var t = e.target;
if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) { return; }
if (!/^[1-6]$/.test(e.key)) { return; }
var index = Number(e.key) - 1;
if (mode === 'build') {
if (locked || !shownQ) { return; }
var bo = shownQ.options[index];
if (!bo || wrongFor(shownQ.slotId)[bo.id]) { return; }
e.preventDefault();
chooseBuild(bo.id);
} else if (mode === 'pick' && chooserQ && !busy) {
var po = chooserQ.options[index];
if (!po || wrongFor(chooserSlot)[po.id]) { return; }
e.preventDefault();
chooseFromChooser(po.id);
}
}
function onPointer() {
keyboardUsed = false;
}
function onVisibility() {
tabHidden = document.visibilityState === 'hidden';
syncClock();
}
var first = null;
if (review) {
chart = MG.chart.create(host, pathway, {
interactive: false, showSlotLabels: showLabels, arrows: 'auto', reduceMotion: reduce,
onSlotClick: null,
onNodeClick: openNodeDetail, onEnzymeClick: openEnzymeDetail, onChipClick: openChipDetail, chipTheme: 'map'
});
chart.setSlots(MG.slots.list(pathway).map(function (s) { return { id: s.id, state: 'filled', value: s.answer }; }));
if (!isWide()) {
var firstStep = MG.slots.list(pathway)[0];
timers.review = setTimeout(function () {
timers.review = 0;
if (!destroyed && chart && firstStep) { chart.focus(firstStep.id, { zoom: REVIEW_ZOOM, animate: false }); }
}, 60);
var pinchNote = h('p', { class: 'mgq-pinch', text: 'Chụm hai ngón tay để phóng to' });
panel.appendChild(pinchNote);
host.addEventListener('pointerdown', function () { pinchNote.classList.add('is-done'); }, { once: true });
}
} else {
chart = MG.chart.create(host, pathway, {
interactive: mode !== 'build',
showSlotLabels: showLabels,
arrows: mode === 'build' ? 'auto' : 'always',
reduceMotion: reduce,
onSlotClick: function (id) { openChooser(id); },
onNodeClick: openNodeDetail,
onEnzymeClick: openEnzymeDetail,
onChipClick: openChipDetail,
chipTheme: 'map'
});
chart.setSlots(game.slotList.filter(function (s) { return s.state !== 'hidden'; })
.map(function (s) { return { id: s.id, state: s.state, value: s.value }; }));
unsubscribe = game.subscribe(onEngineEvent);
game.start();
tabHidden = document.visibilityState === 'hidden';
syncClock();
syncStats();
timers.tick = setInterval(tick, TICK_MS);
document.addEventListener('visibilitychange', onVisibility);
document.addEventListener('keydown', onKey);
document.addEventListener('pointerdown', onPointer, true);
if (mode === 'build') {
first = game.current();
if (first) { renderBuildQuestion(first); }
syncBuildButtons();
}
}
requestAnimationFrame(function () {
if (destroyed || review) { return; }
var full = isBig();
var zoom = full ? FULL_ZOOM : FOCUS_ZOOM;
if (mode === 'build') {
if (first && (!isWide() || full)) { focusChart(first.slotId, zoom); }
} else {
var i = findEmpty(0);
if (i >= 0 && (!isWide() || full)) { focusChart(game.slotList[i].id, zoom); }
}
});
function refitLabels() {
if (destroyed) { return; }
Array.prototype.forEach.call(rootEl.querySelectorAll('.mgq-optlabel, .mgq-optshort, .mgq-name, .mgq-boxlabel'), fitText);
}
var resizeTimer = 0;
function onResize() {
placeBuildLines();
clearTimeout(resizeTimer);
resizeTimer = setTimeout(refitLabels, 150);
}
if (!review && document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
document.fonts.ready.then(refitLabels);
}
root.addEventListener('resize', onResize);
function destroy() {
if (destroyed) { return; }
destroyed = true;
clearInterval(timers.tick);
clearTimeout(timers.next);
clearTimeout(timers.close);
clearTimeout(timers.finish);
clearTimeout(timers.review);
clearTimeout(resizeTimer);
root.removeEventListener('resize', onResize);
removeChooserDom();
document.removeEventListener('keydown', onKey);
document.removeEventListener('pointerdown', onPointer, true);
document.removeEventListener('visibilitychange', onVisibility);
if (unsubscribe) { unsubscribe(); unsubscribe = null; }
if (leaveModal) { leaveModal.close(); leaveModal = null; }
if (chart) { chart.destroy(); }
if (rootEl.parentNode) { rootEl.parentNode.removeChild(rootEl); }
}
return { destroy: destroy, game: game, chart: chart, root: rootEl };
}
MG.quiz = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var KEY = 'mg.atp.v1';
var DEFAULTS = { convention: 'modern', guided: true, scenario: 'glucose', shuttle: 'ma', carbons: 16, doubleBonds: 0, best: {} };
var FA_PICKS = [
{ name: 'Axit palmitic', carbons: 16, doubleBonds: 0 }, { name: 'Stearic', carbons: 18, doubleBonds: 0 },
{ name: 'Myristic', carbons: 14, doubleBonds: 0 }, { name: 'Lauric', carbons: 12, doubleBonds: 0 },
{ name: 'Axit oleic', carbons: 18, doubleBonds: 1 }, { name: 'Axit palmitoleic', carbons: 16, doubleBonds: 1 },
{ name: 'Axit linoleic', carbons: 18, doubleBonds: 2 }, { name: 'Linolenic', carbons: 18, doubleBonds: 3 }
];
var GROUP_ORDER = ['Khởi động', 'Glucose', 'Chất béo'];
var PASS_PCT = 80;
function h() { return MG.ui.el.apply(null, arguments); }
function icon(name) { return MG.ui.icon(name); }
function sound() {
return !(MG.store && typeof MG.store.getSettings === 'function' && MG.store.getSettings().sound === false);
}
function playCorrect() { if (sound() && MG.sound && MG.sound.correct) { MG.sound.correct(); } }
function playComplete() { if (sound() && MG.sound && MG.sound.complete) { MG.sound.complete(); } }
function reduceMotion() {
try { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
catch (err) { return false; }
}
function fmt(n) { return MG.atp.format(n); }
function randomFattyAcid(unsaturated) {
return MG.atp.fattyAcid(8 + 2 * Math.floor(Math.random() * 9), unsaturated ? 1 + Math.floor(Math.random() * 2) : 0);
}
function bestId(id, doubleBonds) { return id === 'fattyacid' && doubleBonds > 0 ? 'unsaturated' : id; }
function structureSvg(st) {
if (!st || typeof MG.renderMolecule !== 'function') { return null; }
var geom = st.kind === 'fatty' ? MG.atp.fattyAcidGeometry(st.carbons, st.doubleBonds) : (MG.geometry ? MG.geometry[st.mol] : null);
if (!geom) { return null; }
var wide = st.kind === 'fatty';
return MG.renderMolecule(geom, {
width: wide ? 440 : 260, height: wide ? 130 : 150, maxBond: wide ? 34 : 40,
title: st.kind === 'fatty' ? 'Cấu trúc của axit béo' : 'Cấu trúc của ' + st.name.toLowerCase()
});
}
function structureFigure(st) {
var svg = structureSvg(st);
return svg ? h('div', { class: 'mg-atp-figure', html: svg }) : null;
}
function sheetNode(sheet) {
return h('section', { class: 'mg-card mg-card--option mg-atp-sheet', 'aria-label': 'Cách tính toán' },
h('h2', { class: 'mg-results__heading', text: 'Cách tính toán' }),
sheet.map(function (block) {
return h('div', { class: 'mg-atp-sheet__block' + (block.id === 'total' ? ' is-total' : ''), 'data-block': block.id },
h('p', { class: 'mg-atp-sheet__title', text: block.title }),
block.lines.map(function (line) { return h('p', { class: 'mg-atp-sheet__line', text: line }); }));
}));
}
function clampInt(v, lo, hi, fallback) {
var n = typeof v === 'number' ? v : (typeof v === 'string' ? parseInt(v, 10) : NaN);
if (!isFinite(n)) { return fallback; }
n = Math.round(n);
return Math.max(lo, Math.min(hi, n));
}
var memory = null;
function readRaw() {
try {
var raw = root.localStorage ? root.localStorage.getItem(KEY) : null;
return raw ? JSON.parse(raw) : null;
} catch (err) {
return null;
}
}
function writeRaw(doc) {
memory = doc;
try { if (root.localStorage) { root.localStorage.setItem(KEY, JSON.stringify(doc)); } }
catch (err) { /* blocked or full: the memory copy stays */ }
}
function sanitize(raw) {
var src = raw && typeof raw === 'object' ? raw : {};
var out = {};
out.convention = src.convention === 'classic' ? 'classic' : 'modern';
out.guided = src.guided === false ? false : true;
out.scenario = typeof src.scenario === 'string' && MG.atp.scenario(src.scenario) ? src.scenario : (src.scenario === 'quick' ? 'quick' : DEFAULTS.scenario);
out.shuttle = src.shuttle === 'gp' ? 'gp' : 'ma';
var fa = MG.atp.fattyAcid(clampInt(src.carbons, 4, 30, DEFAULTS.carbons), clampInt(src.doubleBonds, 0, 4, 0));
out.carbons = fa.carbons;
out.doubleBonds = fa.doubleBonds;
out.best = {};
if (src.best && typeof src.best === 'object' && !Array.isArray(src.best)) {
Object.keys(src.best).forEach(function (k) {
var v = src.best[k];
if (typeof v === 'number' && isFinite(v) && v >= 0 && v <= 100) { out.best[k] = Math.round(v); }
});
}
return out;
}
function storageKey(scenarioId, convention, guided) {
return scenarioId + ':' + (convention === 'classic' ? 'classic' : 'modern') + ':' + (guided === false ? 'r' : 'g');
}
function loadState() {
var doc = memory || readRaw();
return sanitize(doc || {});
}
function saveState(state) {
writeRaw(sanitize(state));
}
function recordBest(state, key, pct) {
var before = typeof state.best[key] === 'number' ? state.best[key] : -1;
if (pct > before) {
state.best[key] = pct;
saveState(state);
}
return state.best[key];
}
function scorePrompts(results) {
if (!results || !results.length) { return 0; }
var clean = 0;
results.forEach(function (r) { if (r === 'clean') { clean += 1; } });
return Math.round((100 * clean) / results.length);
}
function ring(pct) {
var r = 46, c = 2 * Math.PI * r;
var svg = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
'<circle class="mg-atp-ring__edge" cx="60" cy="60" r="' + r + '"/>' +
'<circle class="mg-atp-ring__track" cx="60" cy="60" r="' + r + '"/>' +
'<circle class="mg-atp-ring__arc" cx="60" cy="60" r="' + r + '"' +
' stroke-dasharray="' + (c * pct / 100).toFixed(2) + ' ' + c.toFixed(2) + '"' +
' transform="rotate(-90 60 60)"/></svg>';
return h('div', { class: 'mg-ring mg-atp-ring', role: 'img', 'aria-label': 'Đúng ngay lần đầu tiên ' + pct + ' phần trăm' },
h('div', { class: 'mg-ring__art', html: svg }),
h('span', { class: 'mg-ring__value', text: pct + '%' }));
}
function mount(container, hooks) {
var opts = hooks || {};
var state = loadState();
var destroyed = false;
var view = null;          // the element the screen currently shows (menu, play or results)
var run = null;           // the run in progress (null on the menu): see startRun
var refs = {};            // the play screen's boxes by field key, so a typed change can clear its mark without a redraw
function show(node, keepScroll) {
if (!container) { return; }
while (container.firstChild) { container.removeChild(container.firstChild); }
container.appendChild(node);
view = node;
if (!keepScroll && typeof root.scrollTo === 'function') { root.scrollTo(0, 0); }
}
function onCleared() {
if (destroyed) { return; }
state = loadState();
if (!run && view && view.classList && view.classList.contains('mg-atp-menu')) { rebuildMenu(); }
}
function menuScreen() {
var sets = MG.atp.SETS;
var setKeys = ['modern', 'classic'];
var countingSeg = h('div', { class: 'mg-segmented mg-atp-seg', role: 'group', 'aria-label': 'Đếm' },
setKeys.map(function (id) {
var on = state.convention === id;
return h('button', {
type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-key': 'atp:convention:' + id,
class: on ? 'is-active' : '', text: sets[id].title, title: sets[id].text,
on: { click: function () { setConvention(id); } }
});
}));
var helpSeg = h('div', { class: 'mg-segmented mg-atp-seg', role: 'group', 'aria-label': 'Giúp đỡ' },
[
{ id: 'guided', label: 'Hướng dẫn', on: state.guided, tip: 'Hiển thị kết quả của từng bước trong quá trình đếm.' },
{ id: 'recall', label: 'Nhớ lại', on: !state.guided, tip: 'Không có gì được hiển thị. Hãy sử dụng Gợi ý hoặc Hiển thị khi bạn gặp khó khăn.' }
].map(function (b) {
return h('button', {
type: 'button', 'aria-pressed': b.on ? 'true' : 'false', 'data-key': 'atp:help:' + b.id,
class: b.on ? 'is-active' : '', text: b.label, title: b.tip,
on: { click: function () { setGuided(b.id === 'guided'); } }
});
}));
var groupNames = GROUP_ORDER.slice();
MG.atp.scenarios.forEach(function (sc) { if (groupNames.indexOf(sc.group) < 0) { groupNames.push(sc.group); } });
var groups = groupNames.map(function (g) {
var tiles = [];
MG.atp.scenarios.forEach(function (sc) {
if (sc.group !== g) { return; }
if (sc.id === 'fattyacid') {
tiles.push(scenarioTile('fattyacid', 'Axit béo bão hòa', 'Các chuỗi không có liên kết đôi C=C', 'saturated'));
tiles.push(scenarioTile('fattyacid', 'Axit béo không bão hòa', 'Chuỗi có một hoặc nhiều liên kết đôi C=C', 'unsaturated'));
} else {
tiles.push(scenarioTile(sc.id, sc.title, sc.subtitle));
}
});
if (g === 'Warm up') { tiles.push(scenarioTile('quick', 'Câu hỏi trắc nghiệm nhanh', 'Mười câu hỏi từ mọi thứ')); }
return h('div', { class: 'mg-atp-group' },
h('p', { class: 'mg-atp-group__name', text: g }),
h('div', { class: 'mg-atp-tiles', role: 'group', 'aria-label': g }, tiles));
});
var selected = state.scenario;
var panel = optionsPanel(selected);
return h('section', { class: 'mg-atp-menu' },
h('header', { class: 'mg-atp-head' },
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-atp-back', 'data-key': 'atp:home', on: { click: exitToMenu } }, 'Trở lại menu'),
h('h1', { class: 'mg-title', text: 'Máy tính ATP' }),
h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-atp-explainer-open', 'data-key': 'atp:explainer', on: { click: function () { renderExplainer('atp:ex:' + explainId, false); } },
title: 'Ví dụ minh họa: axit béo bão hòa, axit béo không bão hòa và glucose'
}, 'Người giải thích')),
h('div', { class: 'mg-atp-body' },
h('div', { class: 'mg-section mg-atp-area-count' },
h('p', { class: 'mg-label', text: 'Đếm' }),
countingSeg),
h('div', { class: 'mg-section mg-atp-area-help' },
helpSeg),
h('div', { class: 'mg-section mg-atp-area-practice' },
h('p', { class: 'mg-label', text: 'Luyện tập' }),
h('div', { class: 'mg-panel mg-atp-panel' }, groups)),
panel,
h('div', { class: 'mg-dock mg-atp-dock mg-atp-area-dock' },
isLedger(selected) ? h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-atp-show', 'data-key': 'atp:show', on: { click: showFromMenu },
title: 'Máy tính này làm được tất cả và hiển thị cách thực hiện.'
}, 'Cho tôi xem') : null,
h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'atp:start', on: { click: startFromMenu } }, 'Bắt đầu'))));
}
function isLedger(id) {
var sc = MG.atp.scenario(id);
return !!sc && sc.type === 'ledger';
}
function scenarioTile(id, title, subtitle, kind) {
var on = kind ? state.scenario === id && (kind === 'unsaturated') === (state.doubleBonds > 0) : state.scenario === id;
var tileId = kind || id;
var bestKey = storageKey(kind ? bestId(id, kind === 'unsaturated' ? 1 : 0) : id, state.convention, state.guided);
var best = typeof state.best[bestKey] === 'number' ? state.best[bestKey] : null;
var name = title + '. ' + subtitle + (best === null ? '' : '. Tốt nhất ' + best + '%');
return h('button', {
type: 'button', class: 'mg-atp-tile' + (on ? ' is-selected' : ''), 'aria-pressed': on ? 'true' : 'false',
'data-key': 'atp:scenario:' + tileId, 'aria-label': name, title: subtitle,
on: { click: function () { if (kind) { selectFat(kind); } else { selectScenario(id); } } }
},
h('span', { class: 'mg-atp-tile__title', text: title }),
best === null ? null : h('span', { class: 'mg-atp-tile__best', text: 'Best ' + best + '%' }));
}
function optionsPanel(id) {
var sc = MG.atp.scenario(id);
var opts2 = sc ? sc.options || [] : [];
var inner = [];
var start = sc && sc.type === 'ledger' ? MG.atp.structureOf(id, { carbons: state.carbons, doubleBonds: state.doubleBonds }) : null;
var figure = start ? structureFigure(start) : null;
if (figure) {
inner.push(h('p', { class: 'mg-label', text: 'Bắt đầu với' }));
inner.push(figure);
inner.push(h('p', { class: 'mg-atp-figure__name', text: start.name }));
}
if (opts2.indexOf('shuttle') >= 0) {
inner.push(h('p', { class: 'mg-label', text: 'Xe đưa đón' }));
inner.push(h('div', { class: 'mg-segmented mg-atp-seg', role: 'group', 'aria-label': 'Xe đưa đón' }, [
{ id: 'ma', label: 'Malate-aspartate' }, { id: 'gp', label: 'Glycerol phosphate' }
].map(function (b) {
var on = state.shuttle === b.id;
return h('button', {
type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-key': 'atp:shuttle:' + b.id,
class: on ? 'is-active' : '', text: b.label,
on: { click: function () { setShuttle(b.id); } }
});
})));
}
if (opts2.indexOf('fattyacid') >= 0) {
var fa = MG.atp.fattyAcid(state.carbons, state.doubleBonds);
var unsat = fa.doubleBonds > 0;
inner.push(h('p', { class: 'mg-label', text: 'Axit béo' }));
inner.push(h('div', { class: 'mg-atp-stepper' },
h('button', { type: 'button', class: 'mg-btn mg-atp-step', 'data-key': 'atp:carbons:minus', 'aria-label': 'Ít carbon hơn', disabled: fa.carbons <= 4,
on: { click: function () { setFattyAcid(fa.carbons - 2, fa.doubleBonds); } } }, '−'),
h('span', { class: 'mg-atp-stepper__value', text: fa.carbons + ' carbons' }),
h('button', { type: 'button', class: 'mg-btn mg-atp-step', 'data-key': 'atp:carbons:plus', 'aria-label': 'Nhiều carbon hơn', disabled: fa.carbons >= 30,
on: { click: function () { setFattyAcid(fa.carbons + 2, fa.doubleBonds); } } }, '+')));
var maxK = MG.atp.fattyAcid(fa.carbons, 99).doubleBonds;
if (unsat) {
inner.push(h('div', { class: 'mg-atp-stepper' },
h('button', { type: 'button', class: 'mg-btn mg-atp-step', 'data-key': 'atp:db:minus', 'aria-label': 'Ít liên kết đôi hơn', disabled: fa.doubleBonds <= 1,
on: { click: function () { setFattyAcid(fa.carbons, fa.doubleBonds - 1); } } }, '−'),
h('span', { class: 'mg-atp-stepper__value', text: fa.doubleBonds + ' double ' + (fa.doubleBonds === 1 ? 'bond' : 'bonds') }),
h('button', { type: 'button', class: 'mg-btn mg-atp-step', 'data-key': 'atp:db:plus', 'aria-label': 'Nhiều liên kết đôi hơn', disabled: fa.doubleBonds >= maxK,
on: { click: function () { setFattyAcid(fa.carbons, fa.doubleBonds + 1); } } }, '+')));
}
var picks = FA_PICKS.filter(function (p) { return (p.doubleBonds > 0) === unsat; }).map(function (p) {
var on = p.carbons === fa.carbons && p.doubleBonds === fa.doubleBonds;
return h('button', {
type: 'button', class: 'mg-btn mg-atp-pick' + (on ? ' is-selected' : ''), 'aria-pressed': on ? 'true' : 'false',
'data-key': 'atp:fa:' + p.carbons + ':' + p.doubleBonds,
on: { click: function () { setFattyAcid(p.carbons, p.doubleBonds); } }
}, p.name + ' ' + p.carbons + ':' + p.doubleBonds);
});
picks.push(h('button', {
type: 'button', class: 'mg-btn mg-atp-pick', 'data-key': 'atp:fa:random',
on: { click: function () { var r = randomFattyAcid(unsat); setFattyAcid(r.carbons, r.doubleBonds); } }
}, 'Ngẫu nhiên'));
inner.push(h('div', { class: 'mg-atp-picks' }, picks));
}
if (!inner.length) { return null; }
return h('div', { class: 'mg-card mg-card--question mg-atp-options', role: 'group', 'aria-label': 'Các tùy chọn cho ' + (sc ? sc.title : 'thực hành này') }, inner);
}
function setConvention(id) { state.convention = id === 'classic' ? 'classic' : 'modern'; saveState(state); rebuildMenu(); }
function setGuided(on) { state.guided = !!on; saveState(state); rebuildMenu(); }
function setShuttle(id) { state.shuttle = id === 'gp' ? 'gp' : 'ma'; saveState(state); rebuildMenu(); }
function selectScenario(id) { state.scenario = id; saveState(state); rebuildMenu(); }
function selectFat(kind) {
var fa = MG.atp.fattyAcid(state.carbons, state.doubleBonds);
var next = MG.atp.fattyAcid(fa.carbons, kind === 'unsaturated' ? Math.max(1, fa.doubleBonds) : 0);
state.scenario = 'fattyacid';
state.carbons = next.carbons;
state.doubleBonds = next.doubleBonds;
saveState(state);
rebuildMenu();
}
function setFattyAcid(carbons, doubleBonds) {
var fa = MG.atp.fattyAcid(carbons, doubleBonds);
state.carbons = fa.carbons;
state.doubleBonds = fa.doubleBonds;
saveState(state);
rebuildMenu();
}
function rebuildMenu() {
if (destroyed) { return; }
var focusKey = document.activeElement && document.activeElement.getAttribute ? document.activeElement.getAttribute('data-key') : null;
show(menuScreen(), true);
if (focusKey) {
var target = container.querySelector('[data-key="' + focusKey + '"]');
if (target) { target.focus({ preventScroll: true }); }
}
}
function exitToMenu() {
if (typeof opts.onExit === 'function') { opts.onExit(); }
}
function startFromMenu() {
var id = state.scenario;
if (id === 'quick') { startRun({ kind: 'quick', scenarioId: 'quick', seed: seedNow() }); return; }
if (id === 'facts') { startRun({ kind: 'facts', scenarioId: 'facts' }); return; }
if (id === 'structure') { startRun({ kind: 'structure', scenarioId: 'structure', seed: seedNow() }); return; }
startRun({ kind: 'ledger', scenarioId: id });
}
function showFromMenu() {
var id = state.scenario;
if (!isLedger(id)) { return; }
var b = MG.atp.build(id, { convention: state.convention, shuttle: state.shuttle, carbons: state.carbons, doubleBonds: state.doubleBonds });
if (b) { renderShow(b); }
}
function seedNow() { return Date.now() % 1000000000; }
function enterPrompt() {
var p = run.prompts[run.index];
run.draft = {};
run.marks = {};
run.tries = 0;
run.hintTapped = false;
run.hintsShown = run.guided && p.hints.length ? 1 : 0;
run.solved = false;
run.revealed = false;
run.feedback = '';
run.fresh = null;
}
function startRun(spec) {
var o = { convention: state.convention, shuttle: state.shuttle, carbons: state.carbons, doubleBonds: state.doubleBonds };
run = {
spec: spec, scenarioId: spec.scenarioId, guided: state.guided, opts: o, build: null, title: '', intro: '',
prompts: [], index: 0, results: [], answered: {}, hintsTaken: 0, shown: 0, pct: 0, best: null
};
if (spec.kind === 'ledger') {
run.build = MG.atp.build(spec.scenarioId, o);
run.prompts = run.build ? run.build.prompts : [];
run.title = run.build ? run.build.blindTitle : '';
run.fullTitle = run.build ? run.build.title : '';
run.intro = run.build ? run.build.intro : '';
} else if (spec.kind === 'facts') {
run.prompts = MG.atp.facts({ convention: o.convention });
run.title = 'Thông tin nhanh';
run.intro = MG.atp.scenario('facts').subtitle;
} else if (spec.kind === 'structure') {
run.prompts = MG.atp.structureDrill(6, spec.seed, { convention: o.convention });
run.title = 'Từ một cấu trúc';
run.intro = 'Hãy quan sát từng hình vẽ, sau đó tính toán giá trị ATP tương ứng. Cách tính toán chi tiết sẽ được trình bày sau mỗi đáp án.';
} else {
run.prompts = MG.atp.quick(10, spec.seed, { convention: o.convention });
run.title = 'Câu hỏi trắc nghiệm nhanh';
run.intro = 'Mười câu hỏi từ mọi chủ đề, được sắp xếp ngẫu nhiên.';
}
if (!run.prompts.length) { run = null; rebuildMenu(); return; }
enterPrompt();
renderPlay('field', false, true);
}
function solve() {
var p = run.prompts[run.index];
run.solved = true;
run.results[run.index] = run.tries === 0 && !run.hintTapped ? 'clean' : 'hinted';
run.answered[p.id] = 'solved';
run.fresh = p.id;
run.feedback = 'Phải. ' + p.working;
playCorrect();
}
function check() {
if (!run || run.solved || run.revealed) { return; }
var p = run.prompts[run.index];
var values = {};
var blank = false;
p.fields.forEach(function (f) {
var raw = run.draft[f.key] === undefined ? '' : String(run.draft[f.key]);
if (raw.trim() === '') { blank = true; }
values[f.key] = raw;
});
if (blank) {
run.feedback = 'Hãy điền đầy đủ thông tin vào tất cả các ô.';
renderPlay('atp:check');
return;
}
var res = MG.atp.check(p, values);
p.fields.forEach(function (f) { run.marks[f.key] = res.fields[f.key] === true; });
if (res.ok) {
solve();
renderPlay('atp:next');
return;
}
run.tries += 1;
run.feedback = 'Chưa hẳn, thử lại xem.';
renderPlay('atp:check', true);
}
function hint() {
if (!run || run.solved || run.revealed) { return; }
var p = run.prompts[run.index];
if (run.hintsShown >= p.hints.length) { return; }
run.hintsShown += 1;
run.hintsTaken += 1;
run.hintTapped = true;
renderPlay('atp:hint');
}
function reveal() {
if (!run || run.solved || run.revealed) { return; }
var p = run.prompts[run.index];
p.fields.forEach(function (f) {
run.draft[f.key] = MG.atp.format(f.answer);
run.marks[f.key] = 'shown';
});
run.revealed = true;
run.results[run.index] = 'shown';
run.answered[p.id] = 'shown';
run.fresh = p.id;
run.shown += 1;
run.feedback = 'Câu trả lời: ' + p.working;
renderPlay('atp:next');
}
function next() {
if (!run || !(run.solved || run.revealed)) { return; }
run.index += 1;
if (run.index >= run.prompts.length) { finishRun(); return; }
enterPrompt();
renderPlay('field');
}
function finishRun() {
run.fresh = null;
run.pct = scorePrompts(run.results);
run.best = recordBest(state, storageKey(bestId(run.scenarioId, run.opts.doubleBonds), run.opts.convention, run.guided), run.pct);
if (run.pct >= PASS_PCT) { playComplete(); }
renderResults();
}
function stepValue(f, dir) {
if (!run || run.solved || run.revealed) { return; }
var cur = MG.atp.parseNumber(run.draft[f.key]);
if (isNaN(cur)) { cur = 0; }
var next = Math.round((cur + dir * f.step) * 1000) / 1000;
run.draft[f.key] = MG.atp.format(Math.max(f.min, Math.min(f.max, next)));
run.marks[f.key] = undefined;
renderPlay('atp:field:' + f.key + (dir < 0 ? ':minus' : ':plus'));
}
function typed(f, value) {
if (!run) { return; }
run.draft[f.key] = value;
if (run.marks[f.key] === undefined) { return; }
run.marks[f.key] = undefined;
var r = refs[f.key];
if (!r) { return; }
r.wrap.className = 'mg-atp-field';
r.input.removeAttribute('aria-invalid');
while (r.mark.firstChild) { r.mark.removeChild(r.mark.firstChild); }
}
function backToMenu() {
run = null;
show(menuScreen(), false);
}
function again() {
var spec = run ? run.spec : null;
if (!spec) { backToMenu(); return; }
startRun(spec.kind === 'quick' || spec.kind === 'structure' ? { kind: spec.kind, scenarioId: spec.scenarioId, seed: seedNow() } : spec);
}
function renderPlay(focusKey, shake, toTop) {
if (destroyed || !run) { return; }
var p = run.prompts[run.index];
var locked = run.solved || run.revealed;
var pct = Math.round((100 * (run.index + (locked ? 1 : 0))) / run.prompts.length);
var promptId = 'mg-atp-q' + run.index;
refs = {};
var guide = [];
if (run.guided && p.recipe) { guide.push(h('p', { class: 'mg-atp-guide', text: p.recipe })); }
if (run.guided && p.hints.length) { guide.push(h('p', { class: 'mg-atp-guide', text: p.hints[0] })); }
var hintItems = [];
for (var i = run.guided ? 1 : 0; i < run.hintsShown; i++) { hintItems.push(h('li', { class: 'mg-atp-hint-line', text: p.hints[i] })); }
var fields = p.fields.map(function (f) { return fieldNode(f, locked); });
var buttons = [];
if (!locked) { buttons.push(h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'atp:check', on: { click: check } }, 'Kiểm tra')); }
buttons.push(h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'atp:hint',
disabled: locked || run.hintsShown >= p.hints.length, on: { click: hint }
}, 'Gợi ý'));
buttons.push(h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'atp:reveal', disabled: locked, on: { click: reveal }
}, 'Tiết lộ'));
if (locked) {
buttons.push(h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'atp:next', on: { click: next } },
run.index >= run.prompts.length - 1 ? 'Xem kết quả' : 'Kế tiếp'));
}
var card = h('section', { class: 'mg-card mg-card--question mg-atp-prompt', 'aria-labelledby': promptId },
h('p', { class: 'mg-atp-prompt__text', id: promptId, text: p.text }),
p.structure ? structureFigure(p.structure) : (p.kind === 'read' && run.build && run.build.structure ? structureFigure(run.build.structure) : null),
guide,
h('div', { class: 'mg-atp-fields' }, fields),
h('div', { class: 'mg-atp-actions' }, buttons),
h('p', { class: 'mg-atp-feedback', 'aria-live': 'polite', text: run.feedback || '' }),
hintItems.length ? h('ul', { class: 'mg-atp-hints' }, hintItems) : null);
var screen = h('section', { class: 'mg-atp-play' + (run.build ? ' mg-atp-play--ledger' : '') },
h('header', { class: 'mg-atp-play__bar' },
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-atp-back', 'data-key': 'atp:menu', on: { click: backToMenu } }, 'Mặt sau'),
h('div', { class: 'mg-atp-play__name' },
h('h1', { class: 'mg-atp-play__title', text: run.title }),
h('p', { class: 'mg-atp-count', text: 'Question ' + (run.index + 1) + ' of ' + run.prompts.length }))),
h('div', {
class: 'mg-progress mg-atp-bar', role: 'progressbar', 'aria-label': 'Tiến triển',
'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct)
}, h('span', { style: { width: pct + '%' } })),
h('div', { class: 'mg-atp-play__body' + (run.build ? '' : ' is-single') }, card, run.build ? ledgerNode(run.build, false) : null,
locked && p.sheet ? sheetNode(p.sheet) : null));
show(screen, !toTop);
var target = null;
if (focusKey === 'field') { target = container.querySelector('.mg-atp-input'); }
else if (focusKey) { target = container.querySelector('[data-key="' + focusKey + '"]'); }
if (!target || target.disabled) { target = container.querySelector('[data-key="atp:check"]') || container.querySelector('.mg-atp-input'); }
if (target && typeof target.focus === 'function') { target.focus({ preventScroll: true }); }
if (shake && !reduceMotion()) {
p.fields.forEach(function (f) { if (run.marks[f.key] === false && refs[f.key]) { refs[f.key].wrap.classList.add('shake'); } });
}
}
function markParts(mark) {
if (mark === true || mark === 'shown') { return [icon('check'), mark === true ? 'right' : 'answer']; }
if (mark === false) { return [icon('cross'), 'thử lại']; }
return null;
}
function fieldNode(f, locked) {
var mark = run.marks[f.key];
var wrapClass = 'mg-atp-field' + (mark === true || mark === 'shown' ? ' is-right' : (mark === false ? ' is-wrong' : ''));
var inputId = 'mg-atp-' + run.index + '-' + f.key;
var input = h('input', {
type: 'text', class: 'mg-input mg-atp-input', id: inputId, 'data-key': 'atp:field:' + f.key,
inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false',
'aria-label': f.label + ', câu hỏi ' + (run.index + 1),
'aria-invalid': mark === false ? 'true' : null,
readonly: locked,
value: run.draft[f.key] === undefined ? '' : run.draft[f.key],
on: {
input: function (e) { typed(f, e.target.value); },
keydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } }
}
});
var markEl = h('span', { class: 'mg-atp-field__mark' }, markParts(mark));
var minus = h('button', {
type: 'button', class: 'mg-btn mg-atp-step', 'data-key': 'atp:field:' + f.key + ':minus', 'aria-label': 'Ít hơn ' + f.label,
disabled: locked, on: { click: function () { stepValue(f, -1); } }
}, '−');
var plus = h('button', {
type: 'button', class: 'mg-btn mg-atp-step', 'data-key': 'atp:field:' + f.key + ':plus', 'aria-label': 'Hơn ' + f.label,
disabled: locked, on: { click: function () { stepValue(f, 1); } }
}, '+');
var wrap = h('div', { class: wrapClass },
h('div', { class: 'mg-atp-field__top' },
h('label', { class: 'mg-atp-field__label', for: inputId, text: f.label }),
markEl),
h('div', { class: 'mg-atp-stepper' }, minus, input, plus));
refs[f.key] = { wrap: wrap, input: input, mark: markEl };
return wrap;
}
function chip(name, n, cls, isNew) {
return h('span', { class: 'mg-chip ' + cls + (isNew ? ' is-new' : ''), text: name + ' ×' + MG.atp.format(n) });
}
function makesChips(st, isNew) {
var t = st.tally;
var out = [];
if (t.nadh) { out.push(chip('NADH', t.nadh, 'mg-chip--redox', isNew)); }
if (t.fadh2) { out.push(chip('FADH₂', t.fadh2, 'mg-chip--redox', isNew)); }
if (t.nadph) { out.push(chip('NADPH', t.nadph, 'mg-chip--redox', isNew)); }
if (t.atp) {
var gtp = st.each.some(function (e) { return e.label === 'GTP'; });
out.push(chip(gtp ? 'GTP' : 'ATP', t.atp, 'mg-chip--adenylate', isNew));
}
return out.length ? out : [h('span', { class: 'mg-atp-none', text: 'không có hãng vận chuyển' })];
}
function placeholderChips() {
return [0, 1, 2].map(function () { return h('span', { class: 'mg-atp-chip mg-atp-chip--empty', 'aria-hidden': 'true' }); });
}
function arrow() {
return h('div', { class: 'mg-atp-arrow', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 28" focusable="false"><path d="M12 2v20M6 16l6 7 6-7"/></svg>' });
}
function emptyChips() {
return [0, 1].map(function () { return h('span', { class: 'mg-atp-chip mg-atp-chip--empty', 'aria-hidden': 'true' }); });
}
function structureCard(st, readDone, current, isNew) {
var figure = structureFigure(st);
return h('article', {
class: 'mg-atp-stage mg-atp-structure' + (current ? ' is-current' : '') + (readDone ? ' is-done' : ''), 'data-stage': 'read'
},
h('div', { class: 'mg-atp-stage__head' },
h('p', { class: 'mg-atp-stage__title', text: readDone ? st.name : st.blind }),
readDone ? icon('check') : null),
figure,
h('div', { class: 'mg-atp-makes' }, readDone
? st.facts.map(function (f) { return h('span', { class: 'mg-chip mg-atp-fact' + (isNew ? ' is-new' : ''), text: f }); })
: emptyChips()));
}
function ledgerNode(build, final) {
var now = final ? null : run.prompts[run.index];
var fresh = final ? null : run.fresh;
var answered = final ? {} : run.answered;
var out = [];
var counts = build.mode === 'counts';
if (build.structure) {
out.push(structureCard(build.structure, final || !!answered.read, !!now && now.stage === 'read', fresh === 'read'));
out.push(arrow());
}
build.stages.forEach(function (st) {
var tallyDone = final || st.info || !!answered[st.id + '.tally'];
var worthDone = counts || st.info ? tallyDone : (final || !!answered[st.id + '.worth']);
var current = !!now && now.stage === st.id;
out.push(h('article', {
class: 'mg-atp-stage' + (current ? ' is-current' : '') + (worthDone ? ' is-done' : ''), 'data-stage': st.id
},
h('div', { class: 'mg-atp-stage__head' },
h('p', { class: 'mg-atp-stage__title', text: st.title }),
worthDone ? icon('check') : null),
h('p', { class: 'mg-atp-stage__where', text: st.where }),
(final || run.guided || worthDone) && st.recipe ? h('p', { class: 'mg-atp-stage__recipe', text: st.recipe }) : null,
h('div', { class: 'mg-atp-makes' }, tallyDone ? makesChips(st, fresh === st.id + '.tally') : placeholderChips()),
worthDone && !st.info ? h('div', { class: 'mg-atp-worth' + (fresh === st.id + (counts ? '.tally' : '.worth') ? ' is-new' : '') },
h('p', { class: 'mg-atp-worth__value', text: counts ? st.working : '= ' + MG.atp.format(st.worth) + ' ATP' }),
counts ? null : h('p', { class: 'mg-atp-worth__working', text: st.working })) : null));
out.push(arrow());
});
var totalDone = final || !!answered.total;
out.push(h('article', {
class: 'mg-atp-total' + (now && now.kind === 'total' ? ' is-current' : '') + (totalDone ? ' is-done' : '') + (fresh === 'total' ? ' is-new' : '')
},
h('p', { class: 'mg-atp-total__label', text: 'Tổng cộng' }),
h('p', { class: 'mg-atp-total__value' + (totalDone ? '' : ' is-unknown'), text: totalDone ? (counts ? MG.atp.format(build.total) + ' ATP, ' + MG.atp.format(build.totalNadph) + ' NADPH' : MG.atp.format(build.total) + ' ATP') : '?' }),
totalDone ? h('p', { class: 'mg-atp-total__working', text: build.working }) : null,
totalDone && build.note ? h('p', { class: 'mg-atp-total__note', text: build.note }) : null));
return h('div', { class: 'mg-atp-ledger', role: 'group', 'aria-label': 'Sổ cái ATP' }, out);
}
function renderResults() {
if (destroyed || !run) { return; }
var total = run.prompts.length;
var clean = run.results.filter(function (r) { return r === 'clean'; }).length;
var facts = [h('p', { class: 'mg-atp-score__line', text: 'Đúng ngay lần đầu tiên: ' + clean + ' of ' + total })];
if (run.hintsTaken) { facts.push(h('p', { class: 'mg-atp-score__more', text: 'Gợi ý đã dùng: ' + run.hintsTaken })); }
if (run.shown) { facts.push(h('p', { class: 'mg-atp-score__more', text: 'Các câu trả lời được hiển thị: ' + run.shown })); }
if (typeof run.best === 'number') { facts.push(h('p', { class: 'mg-atp-score__more', text: 'Best ' + run.best + '%' })); }
var score = h('section', { class: 'mg-card mg-card--option mg-atp-score' },
ring(run.pct), h('div', { class: 'mg-atp-score__text' }, facts));
var stageTitle = {};
(run.build ? run.build.stages : []).forEach(function (st) { stageTitle[st.id] = st.title; });
var misses = [];
run.prompts.forEach(function (p, i) {
if (run.results[i] !== 'clean') {
misses.push(h('li', { class: 'mg-atp-look__item' },
p.structure ? h('p', { class: 'mg-atp-look__stage', text: p.structure.name }) : (stageTitle[p.stage] ? h('p', { class: 'mg-atp-look__stage', text: stageTitle[p.stage] }) : null),
h('p', { class: 'mg-atp-look__text', text: p.text }),
h('p', { class: 'mg-atp-look__working', text: p.working })));
}
});
var look = h('section', { class: 'mg-card mg-card--question mg-atp-look' },
h('h2', { class: 'mg-results__heading', text: 'Cần xem lại' }),
misses.length ? h('ul', { class: 'mg-atp-look__list' }, misses) : h('p', { class: 'mg-results__none', text: 'Mọi câu trả lời đều đúng ngay từ lần đầu tiên.' }));
var chart = run.build ? h('section', { class: 'mg-card mg-card--option mg-atp-results__chart' },
h('h2', { class: 'mg-results__heading', text: 'Sổ cái' }), ledgerNode(run.build, true)) : null;
var sheet = run.build ? sheetNode(run.build.sheet) : null;
var actions = h('div', { class: 'mg-atp-results__actions' },
h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'atp:again', on: { click: again } }, 'Chơi lại'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'atp:another', on: { click: backToMenu } }, 'Hãy chọn một lựa chọn khác'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'atp:home', on: { click: exitToMenu } }, 'Trở lại menu'));
var screen = h('section', { class: 'mg-atp-results' },
h('header', { class: 'mg-atp-results__head' },
h('h1', { class: 'mg-title', text: run.fullTitle || run.title }),
h('p', { class: 'mg-subtitle', text: 'Kết quả' })),
h('div', { class: 'mg-atp-results__body' },
h('div', { class: 'mg-atp-results__main' }, score, actions),
h('div', { class: 'mg-atp-results__side' }, chart, sheet, look)));
show(screen, false);
var first = container.querySelector('[data-key="atp:again"]');
if (first) { first.focus({ preventScroll: true }); }
}
var explainId = 'saturated';   // the worked example on show (kept for this visit to the screen)
var EX_LABEL = { saturated: 'Bão hòa', unsaturated: 'Không bão hòa', glucose: 'Glucose' };
function explainFigure(fig, title) {
if (!fig || typeof MG.renderMolecule !== 'function') { return null; }
var geom = fig.kind === 'fatty' ? MG.atp.fattyAcidGeometry(fig.carbons, fig.doubleBonds, { numbered: !!fig.numbered }) : (MG.geometry ? MG.geometry[fig.mol] : null);
if (!geom) { return null; }
return h('div', {
class: 'mg-atp-figure mg-atp-figure--explain',
html: MG.renderMolecule(geom, { width: fig.kind === 'fatty' ? 560 : 260, height: 150, maxBond: 44, hl: fig.hl || [], title: title })
});
}
function selectExample(id) { explainId = id; renderExplainer('atp:ex:' + id, true); }
function setExplainConvention(id) { state.convention = id === 'classic' ? 'classic' : 'modern'; saveState(state); renderExplainer('atp:ex:convention:' + state.convention, true); }
function setExplainShuttle(id) { state.shuttle = id === 'gp' ? 'gp' : 'ma'; saveState(state); renderExplainer('atp:ex:shuttle:' + state.shuttle, true); }
function practiceExample(ex) {
var pr = ex.practice;
state.scenario = pr.scenario;
state.carbons = pr.carbons;
state.doubleBonds = pr.doubleBonds;
state.shuttle = pr.shuttle;
saveState(state);
startRun({ kind: 'ledger', scenarioId: pr.scenario });
}
function renderExplainer(focusKey, keepScroll) {
if (destroyed) { return; }
run = null;
if (!MG.atp.explainers.some(function (e) { return e.id === explainId; })) { explainId = MG.atp.explainers[0].id; }
var ex = MG.atp.explain(explainId, { convention: state.convention, shuttle: state.shuttle });
if (!ex) { return; }
var info = MG.atp.explainers.filter(function (e) { return e.id === explainId; })[0];
var examples = h('div', { class: 'mg-segmented mg-atp-seg', role: 'group', 'aria-label': 'Ví dụ' },
MG.atp.explainers.map(function (e) {
var on = e.id === explainId;
return h('button', {
type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-key': 'atp:ex:' + e.id, class: on ? 'is-active' : '', text: EX_LABEL[e.id] || e.title,
on: { click: function () { selectExample(e.id); } }
});
}));
var counting = h('div', { class: 'mg-segmented mg-atp-seg', role: 'group', 'aria-label': 'Đếm' },
['modern', 'classic'].map(function (id) {
var on = state.convention === id;
return h('button', {
type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-key': 'atp:ex:convention:' + id, class: on ? 'is-active' : '', text: MG.atp.SETS[id].title,
on: { click: function () { setExplainConvention(id); } }
});
}));
var shuttle = info && info.options.indexOf('shuttle') >= 0
? h('div', { class: 'mg-section' },
h('p', { class: 'mg-label', text: 'Xe đưa đón' }),
h('div', { class: 'mg-segmented mg-atp-seg', role: 'group', 'aria-label': 'Xe đưa đón' },
[{ id: 'ma', label: 'Malate-aspartate' }, { id: 'gp', label: 'Glycerol phosphate' }].map(function (b) {
var on = state.shuttle === b.id;
return h('button', {
type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-key': 'atp:ex:shuttle:' + b.id, class: on ? 'is-active' : '', text: b.label,
on: { click: function () { setExplainShuttle(b.id); } }
});
})))
: null;
var steps = ex.steps.map(function (st, i) {
var name = st.figure && st.figure.kind === 'fatty' ? 'Cấu trúc của ' + ex.structure.name.toLowerCase() + ', các nguyên tử cacbon được đánh số từ nguyên tử cacbon carboxyl' : 'Cấu trúc của ' + ex.structure.name.toLowerCase();
return h('li', { class: 'mg-atp-ex-step' + (st.id === 'total' ? ' is-total' : ''), 'data-step': st.id },
h('div', { class: 'mg-atp-ex-step__head' },
h('span', { class: 'mg-atp-ex-step__num', 'aria-hidden': 'true', text: String(i + 1) }),
h('h2', { class: 'mg-atp-ex-step__title', text: st.title })),
h('p', { class: 'mg-atp-ex-step__text', text: st.text }),
st.figure ? explainFigure(st.figure, name) : null,
h('div', { class: 'mg-atp-ex-math' }, st.math.map(function (line) { return h('p', { class: 'mg-atp-ex-math__line', text: line }); })));
});
var screen = h('section', { class: 'mg-atp-ex' },
h('header', { class: 'mg-atp-head' },
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-atp-back', 'data-key': 'atp:ex:back', on: { click: backToMenu } }, 'Quay lại menu ATP'),
h('h1', { class: 'mg-title', text: 'Người giải thích' })),
h('div', { class: 'mg-atp-ex__controls' },
h('div', { class: 'mg-section' },
h('p', { class: 'mg-label', text: 'Ví dụ' }), examples),
h('div', { class: 'mg-section' },
h('p', { class: 'mg-label', text: 'Đếm' }), counting),
shuttle),
h('ol', { class: 'mg-atp-ex__steps', 'aria-label': ex.title + ': các bước' }, steps),
h('div', { class: 'mg-atp-results__actions' },
h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'atp:ex:practice', on: { click: function () { practiceExample(ex); } } }, 'Hãy luyện tập điều này'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'atp:ex:back2', on: { click: backToMenu } }, 'Quay lại menu ATP')));
show(screen, !!keepScroll);
var target = focusKey ? container.querySelector('[data-key="' + focusKey + '"]') : null;
if (target && typeof target.focus === 'function') { target.focus({ preventScroll: true }); }
}
function renderShow(build) {
if (destroyed) { return; }
run = null;
var actions = h('div', { class: 'mg-atp-results__actions' },
h('button', {
type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'atp:practice',
on: { click: function () { startRun({ kind: 'ledger', scenarioId: build.id }); } }
}, 'Hãy luyện tập điều này'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'atp:another', on: { click: backToMenu } }, 'Hãy chọn một lựa chọn khác'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'atp:home', on: { click: exitToMenu } }, 'Trở lại menu'));
var screen = h('section', { class: 'mg-atp-results mg-atp-show-screen' },
h('header', { class: 'mg-atp-results__head' },
h('h1', { class: 'mg-title', text: build.title })),
h('div', { class: 'mg-atp-results__body' },
h('div', { class: 'mg-atp-results__main' },
actions),
h('div', { class: 'mg-atp-results__side' },
h('section', { class: 'mg-card mg-card--option mg-atp-results__chart' },
h('h2', { class: 'mg-results__heading', text: 'Sổ cái' }), ledgerNode(build, true)),
sheetNode(build.sheet))));
show(screen, false);
var first = container.querySelector('[data-key="atp:practice"]');
if (first) { first.focus({ preventScroll: true }); }
}
show(menuScreen(), true);
if (typeof root.addEventListener === 'function') { root.addEventListener('mg:atp-cleared', onCleared); }
return {
destroy: function () {
destroyed = true;
if (typeof root.removeEventListener === 'function') { root.removeEventListener('mg:atp-cleared', onCleared); }
while (container && container.firstChild) { container.removeChild(container.firstChild); }
view = null;
run = null;
refs = {};
}
};
}
MG.atpUi = {
mount: mount,
clearBest: function () {
var doc = loadState();
doc.best = {};
saveState(doc);
if (typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function') {
root.dispatchEvent(new root.CustomEvent('mg:atp-cleared'));
}
},
_test: { sanitize: sanitize, storageKey: storageKey, scorePrompts: scorePrompts }
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var KEY = 'mg.games.v1';
var PASS_PCT = 80;
var LETTERS = 'ABCDEFGH';
var ARROW_UP = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 15l6-6 6 6"/></svg>';
var ARROW_DOWN = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>';
function h() { return MG.ui.el.apply(null, arguments); }
function icon(name) { return MG.ui.icon(name); }
function engine() { return MG.gameEngine; }
function sound() {
return !(MG.store && typeof MG.store.getSettings === 'function' && MG.store.getSettings().sound === false);
}
function playCorrect() { if (sound() && MG.sound && MG.sound.correct) { MG.sound.correct(); } }
function playComplete() { if (sound() && MG.sound && MG.sound.complete) { MG.sound.complete(); } }
function reduceMotion() {
try { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
catch (err) { return false; }
}
function byId(list, id) {
for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
return null;
}
function drawing(mol, width, height, title) {
if (typeof MG.renderMolecule !== 'function' || !MG.geometry || !MG.geometry[mol]) { return null; }
return MG.renderMolecule(MG.geometry[mol], { width: width, height: height, maxBond: 40, title: title });
}
function figuresRow(list) {
if (!Array.isArray(list) || !list.length) { return null; }
return h('div', { class: 'mg-gm-figures' + (list.length === 1 ? ' mg-gm-figures--one' : '') }, list.map(function (f) {
var svg = f.mol ? drawing(f.mol, 220, 130, f.label) : null;
return h('div', { class: 'mg-gm-figures__item' + (svg ? '' : ' is-name') },
svg ? h('span', { class: 'mg-gm-figures__art', html: svg }) : null,
h('span', { class: 'mg-gm-figures__label', text: f.label }));
}));
}
var memory = null;
function readRaw() {
try {
var raw = root.localStorage ? root.localStorage.getItem(KEY) : null;
return raw ? JSON.parse(raw) : null;
} catch (err) {
return null;
}
}
function writeRaw(doc) {
memory = doc;
try { if (root.localStorage) { root.localStorage.setItem(KEY, JSON.stringify(doc)); } }
catch (err) { /* blocked or full: the memory copy stays */ }
}
function sanitize(raw) {
var src = raw && typeof raw === 'object' ? raw : {};
var out = { best: {} };
if (src.best && typeof src.best === 'object' && !Array.isArray(src.best)) {
Object.keys(src.best).forEach(function (k) {
var v = src.best[k];
if (/^[a-z0-9-]{1,40}$/.test(k) && typeof v === 'number' && isFinite(v) && v >= 0 && v <= 100) { out.best[k] = Math.round(v); }
});
}
return out;
}
function loadState() { return sanitize(memory || readRaw() || {}); }
function saveState(state) { writeRaw(sanitize(state)); }
function recordBest(state, id, pct) {
var before = typeof state.best[id] === 'number' ? state.best[id] : 0;
if (pct > before) {
state.best[id] = pct;
saveState(state);
}
return state.best[id];
}
function scorePrompts(results) { return engine() ? engine().scoreRun(results) : 0; }
function ring(pct) {
var r = 46, c = 2 * Math.PI * r;
var svg = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
'<circle class="mg-gm-ring__edge" cx="60" cy="60" r="' + r + '"/>' +
'<circle class="mg-gm-ring__track" cx="60" cy="60" r="' + r + '"/>' +
'<circle class="mg-gm-ring__arc" cx="60" cy="60" r="' + r + '"' +
' stroke-dasharray="' + (c * pct / 100).toFixed(2) + ' ' + c.toFixed(2) + '"' +
' transform="rotate(-90 60 60)"/></svg>';
return h('div', { class: 'mg-ring mg-gm-ring', role: 'img', 'aria-label': 'Đúng ngay lần đầu tiên ' + pct + ' phần trăm' },
h('div', { class: 'mg-ring__art', html: svg }),
h('span', { class: 'mg-ring__value', text: pct + '%' }));
}
function mount(container, hooks) {
var opts = hooks || {};
var state = loadState();
var destroyed = false;
var view = null;          // the element the screen currently shows (menu, play or results)
var run = null;           // the run in progress (null on the menu): see startRun
var refs = {};            // the boxes of a number prompt by field key, so a typed change can clear its mark without a redraw
function show(node, keepScroll) {
if (!container) { return; }
while (container.firstChild) { container.removeChild(container.firstChild); }
container.appendChild(node);
view = node;
if (!keepScroll && typeof root.scrollTo === 'function') { root.scrollTo(0, 0); }
}
function onCleared() {
if (destroyed) { return; }
state = loadState();
if (!run && view && view.classList && view.classList.contains('mg-gm-menu')) { show(menuScreen(), true); }
}
function exitToMenu() { if (typeof opts.onExit === 'function') { opts.onExit(); } }
function tile(g) {
var best = state.best[g.id];
var name = g.title + '. ' + g.subtitle + (typeof best === 'number' ? '. Tốt nhất ' + best + '%' : '');
return h('button', {
type: 'button', class: 'mg-gm-tile', 'data-key': 'games:game:' + g.id, 'aria-label': name, title: g.subtitle,
on: { click: function () { startRun(g.id); } }
},
h('span', { class: 'mg-gm-tile__title', text: g.title }),
typeof best === 'number' ? h('span', { class: 'mg-gm-tile__best', text: 'Best ' + best + '%' }) : null);
}
function menuScreen() {
var list = engine().games();
var names = [];
var byGroup = {};
list.forEach(function (g) {
if (!byGroup[g.group]) { byGroup[g.group] = []; names.push(g.group); }
byGroup[g.group].push(g);
});
var groups = names.map(function (name) {
return h('div', { class: 'mg-gm-group' },
h('h2', { class: 'mg-gm-group__name', text: name }),
h('div', { class: 'mg-gm-tiles' }, byGroup[name].map(tile)));
});
return h('section', { class: 'mg-gm-menu' },
h('header', { class: 'mg-gm-head' },
h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-gm-back', 'data-key': 'games:exit', on: { click: exitToMenu }
}, 'Trở lại menu'),
h('h1', { class: 'mg-title', text: 'Câu hỏi trắc nghiệm' })),
h('div', { class: 'mg-gm-body' }, groups.length ? groups : h('p', { class: 'mg-hint', text: 'Hiện chưa có trò chơi nào.' })));
}
function backToMenu() {
run = null;
refs = {};
show(menuScreen(), false);
var first = container.querySelector('.mg-gm-tile');
if (first) { first.focus({ preventScroll: true }); }
}
function seedNow() { return Date.now() % 1000000000; }
function enterPrompt() {
var p = run.prompts[run.index];
run.tries = 0;
run.hintTapped = false;
run.hintsShown = 0;
run.solved = false;
run.revealed = false;
run.feedback = '';
run.wrong = {};
run.chosen = null;
run.order = p.kind === 'order' ? p.items.map(function (it) { return it.id; }) : [];
run.assign = {};
run.values = {};
run.marks = {};
}
function startRun(gameId) {
var game = engine().game(gameId);
if (!game) { return; }
var built = engine().start(game, seedNow());
run = {
id: game.id, game: game, title: built.title, intro: built.intro, summary: built.summary || '', prompts: built.prompts, index: 0, results: [],
hintsTaken: 0, shown: 0, pct: 0, best: null
};
if (!run.prompts.length) { run = null; backToMenu(); return; }
enterPrompt();
renderPlay('first', false, true);
}
function solve() {
run.solved = true;
run.results[run.index] = run.tries === 0 && !run.hintTapped ? 'clean' : 'hinted';
run.feedback = 'Phải.';
playCorrect();
}
function pickOption(id) {
if (!run || run.solved || run.revealed || run.wrong[id]) { return; }
var p = run.prompts[run.index];
var res = engine().check(p, { pick: id });
if (res.ok) {
run.chosen = id;
solve();
renderPlay('games:next');
return;
}
run.wrong[id] = true;
run.tries += 1;
run.feedback = 'Chưa hẳn, thử lại xem.';
renderPlay('first', true);
}
function responseOf(p) {
if (p.kind === 'order') { return { order: run.order.slice() }; }
if (p.kind === 'sort') {
var sort = {};
Object.keys(run.assign).forEach(function (k) { sort[k] = run.assign[k]; });
return { sort: sort };
}
return { values: run.values };
}
function check() {
if (!run || run.solved || run.revealed) { return; }
var p = run.prompts[run.index];
if (p.kind === 'sort') {
var left = p.items.filter(function (it) { return !run.assign[it.id]; });
if (left.length) {
run.feedback = 'Đặt từng món đồ lên trước.';
renderPlay('games:check');
return;
}
}
if (p.kind === 'number') {
var blank = p.fields.some(function (f) { return String(run.values[f.key] === undefined ? '' : run.values[f.key]).trim() === ''; });
if (blank) {
run.feedback = 'Hãy điền đầy đủ thông tin vào tất cả các ô.';
renderPlay('games:check');
return;
}
}
var res = engine().check(p, responseOf(p));
run.marks = res.marks;
if (res.ok) {
solve();
renderPlay('games:next');
return;
}
run.tries += 1;
run.feedback = 'Chưa hẳn, thử lại xem.';
renderPlay('games:check', true);
}
function hint() {
if (!run || run.solved || run.revealed) { return; }
var p = run.prompts[run.index];
if (run.hintsShown >= p.hints.length) { return; }
run.hintsShown += 1;
run.hintsTaken += 1;
run.hintTapped = true;
renderPlay('games:hint');
}
function answerLine(p) {
if (p.kind === 'pick') { return 'Câu trả lời: ' + byId(p.options, p.answer).label + '.'; }
if (p.kind === 'order') { return 'Thứ tự đúng đã được hiển thị.'; }
if (p.kind === 'sort') { return 'Những địa điểm chính xác đã được chỉ ra.'; }
return 'Câu trả lời: ' + p.fields.map(function (f) { return engine().formatNumber(f.answer) + ' ' + f.label; }).join(', ') + '.';
}
function reveal() {
if (!run || run.solved || run.revealed) { return; }
var p = run.prompts[run.index];
var r = engine().reveal(p);
if (p.kind === 'pick') { run.chosen = r.pick; }
else if (p.kind === 'order') { run.order = r.order; }
else if (p.kind === 'sort') { run.assign = r.sort; }
else { run.values = r.values; }
run.marks = {};
run.revealed = true;
run.results[run.index] = 'shown';
run.shown += 1;
run.feedback = answerLine(p);
renderPlay('games:next');
}
function next() {
if (!run || !(run.solved || run.revealed)) { return; }
run.index += 1;
if (run.index >= run.prompts.length) { finishRun(); return; }
enterPrompt();
renderPlay('first');
}
function finishRun() {
run.pct = scorePrompts(run.results);
run.best = recordBest(state, run.id, run.pct);
if (run.pct >= PASS_PCT) { playComplete(); }
renderResults();
}
function again() {
if (!run) { backToMenu(); return; }
startRun(run.id);
}
function moveItem(id, dir) {
if (!run || run.solved || run.revealed) { return; }
var at = run.order.indexOf(id);
var to = at + dir;
if (at < 0 || to < 0 || to >= run.order.length) { return; }
run.order[at] = run.order[to];
run.order[to] = id;
run.marks = {};
renderPlay('games:' + (dir < 0 ? 'up' : 'down') + ':' + id);
}
function assignItem(itemId, bucketId) {
if (!run || run.solved || run.revealed) { return; }
run.assign[itemId] = bucketId;
delete run.marks[itemId];
renderPlay('games:item:' + itemId + ':' + bucketId);
}
function typed(f, value) {
if (!run) { return; }
run.values[f.key] = value;
if (run.marks[f.key] === undefined) { return; }
delete run.marks[f.key];
var r = refs[f.key];
if (!r) { return; }
r.wrap.className = 'mg-gm-field';
r.input.removeAttribute('aria-invalid');
while (r.mark.firstChild) { r.mark.removeChild(r.mark.firstChild); }
}
function markParts(mark, revealed) {
if (mark === true || revealed) { return [icon('check'), revealed ? 'answer' : 'right']; }
if (mark === false) { return [icon('cross'), 'thử lại']; }
return null;
}
function markNode(mark, revealed) {
var parts = markParts(mark, revealed);
return h('span', { class: 'mg-gm-mark' + (mark === false ? ' is-wrong' : (parts ? ' is-right' : '')) }, parts);
}
function pickNode(p, locked) {
var figure = p.optionStyle === 'figure';
return h('div', { class: 'mg-gm-options' + (figure ? ' mg-gm-options--figure' : ''), role: 'group', 'aria-label': 'Câu trả lời' },
p.options.map(function (o, i) {
var right = locked && run.chosen === o.id;
var wrong = !!run.wrong[o.id];
var cls = 'mg-option mg-gm-option' + (figure ? ' is-figure' : '') + (right ? ' is-correct' : '') + (wrong ? ' is-wrong' : '');
var name = figure ? 'Vẽ ' + LETTERS.charAt(i) : o.label;
var inner;
if (figure) {
var svg = drawing(o.mol, 220, 130, name);
inner = [h('span', { class: 'mg-gm-option__art', html: svg || '' }),
h('span', { class: 'mg-gm-option__name', text: locked ? o.label : LETTERS.charAt(i) })];
} else {
inner = [h('span', { class: 'mg-gm-option__label', text: o.label })];
}
return h('button', {
type: 'button', class: cls, 'data-key': 'games:option:' + o.id, 'aria-label': figure ? (locked ? name + ': ' + o.label : name) : null,
disabled: locked || wrong, on: { click: function () { pickOption(o.id); } }
}, inner);
}));
}
function orderNode(p, locked) {
return h('ol', { class: 'mg-gm-order' }, run.order.map(function (id, i) {
var item = byId(p.items, id);
var mark = run.marks[id];
var cls = 'mg-gm-order__item' + (mark === true || run.revealed ? ' is-right' : (mark === false ? ' is-wrong' : ''));
function move(dir, label, art) {
var edge = dir < 0 ? i === 0 : i === run.order.length - 1;
return h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-gm-move', 'data-key': 'games:' + (dir < 0 ? 'up' : 'down') + ':' + id,
'aria-label': 'Di chuyển ' + item.label + ' ' + label, disabled: locked || edge, html: art, on: { click: function () { moveItem(id, dir); } }
});
}
return h('li', { class: cls, 'data-item': id },
h('span', { class: 'mg-gm-order__rank', text: String(i + 1) }),
h('span', { class: 'mg-gm-order__label', text: item.label }),
markNode(mark, run.revealed),
h('span', { class: 'mg-gm-order__moves' }, move(-1, 'up', ARROW_UP), move(1, 'down', ARROW_DOWN)));
}));
}
function sortNode(p, locked) {
return h('ul', { class: 'mg-gm-sort' }, p.items.map(function (it) {
var mark = run.marks[it.id];
var cls = 'mg-gm-sort__item' + (mark === true || run.revealed ? ' is-right' : (mark === false ? ' is-wrong' : ''));
return h('li', { class: cls, 'data-item': it.id },
h('div', { class: 'mg-gm-sort__top' },
h('span', { class: 'mg-gm-sort__label', text: it.label }), markNode(mark, run.revealed)),
h('div', { class: 'mg-gm-sort__buckets', role: 'group', 'aria-label': 'Địa điểm ' + it.label },
p.buckets.map(function (b) {
var on = run.assign[it.id] === b.id;
return h('button', {
type: 'button', class: 'mg-gm-bucket' + (on ? ' is-on' : ''), 'aria-pressed': on ? 'true' : 'false',
'data-key': 'games:item:' + it.id + ':' + b.id, disabled: locked, text: b.label,
on: { click: function () { assignItem(it.id, b.id); } }
});
})));
}));
}
function numberNode(p, locked) {
return h('div', { class: 'mg-gm-fields' }, p.fields.map(function (f) {
var mark = run.marks[f.key];
var inputId = 'mg-gm-' + run.index + '-' + f.key;
var value = run.values[f.key] === undefined ? '' : String(run.values[f.key]);
var wrap = h('div', { class: 'mg-gm-field' + (mark === true || run.revealed ? ' is-right' : (mark === false ? ' is-wrong' : '')) });
var markEl = h('span', { class: 'mg-gm-field__mark' }, markParts(mark, run.revealed));
var input = h('input', {
type: 'text', class: 'mg-input mg-gm-input', id: inputId, 'data-key': 'games:field:' + f.key, inputmode: 'decimal', autocomplete: 'off',
spellcheck: 'false', value: value, disabled: locked, 'aria-invalid': mark === false ? 'true' : null,
on: { input: function (e) { typed(f, e.target.value); }, keydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } } }
});
wrap.appendChild(h('div', { class: 'mg-gm-field__top' }, h('label', { class: 'mg-gm-field__label', 'for': inputId, text: f.label }), markEl));
wrap.appendChild(input);
refs[f.key] = { wrap: wrap, input: input, mark: markEl };
return wrap;
}));
}
function interaction(p, locked) {
if (p.kind === 'pick') { return pickNode(p, locked); }
if (p.kind === 'order') { return orderNode(p, locked); }
if (p.kind === 'sort') { return sortNode(p, locked); }
return numberNode(p, locked);
}
function renderPlay(focusKey, shake, toTop) {
if (destroyed || !run) { return; }
var p = run.prompts[run.index];
var locked = run.solved || run.revealed;
var pct = Math.round((100 * (run.index + (locked ? 1 : 0))) / run.prompts.length);
var promptId = 'mg-gm-q' + run.index;
refs = {};
var hintItems = [];
for (var i = 0; i < run.hintsShown; i++) { hintItems.push(h('li', { class: 'mg-gm-hint-line', text: p.hints[i] })); }
var buttons = [];
if (!locked && p.kind !== 'pick') {
buttons.push(h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'games:check', on: { click: check } }, 'Kiểm tra'));
}
buttons.push(h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'games:hint',
disabled: locked || run.hintsShown >= p.hints.length, on: { click: hint }
}, 'Gợi ý'));
buttons.push(h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'games:reveal', disabled: locked, on: { click: reveal }
}, 'Tiết lộ'));
if (locked) {
buttons.push(h('button', {
type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'games:next', on: { click: next }
}, run.index >= run.prompts.length - 1 ? 'Xem kết quả' : 'Kế tiếp'));
}
var art = p.figure ? drawing(p.figure.mol, 280, 160, 'Cấu trúc của một phân tử') : null;
var card = h('section', { class: 'mg-card mg-card--question mg-gm-prompt', 'aria-labelledby': promptId },
p.group ? h('p', { class: 'mg-gm-prompt__group', text: p.group }) : null,
h('p', { class: 'mg-gm-prompt__text', id: promptId, text: p.text }),
art ? h('div', { class: 'mg-gm-figure', html: art }) : null,
art ? null : figuresRow(p.figures),
interaction(p, locked),
h('div', { class: 'mg-gm-actions' }, buttons),
h('p', { class: 'mg-gm-feedback', 'aria-live': 'polite', text: run.feedback || '' }),
hintItems.length ? h('ul', { class: 'mg-gm-hints' }, hintItems) : null,
locked ? h('p', { class: 'mg-gm-explain', text: p.explain }) : null,
locked ? figuresRow(p.figuresAfter) : null);
var screen = h('section', { class: 'mg-gm-play' },
h('header', { class: 'mg-gm-play__bar' },
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-gm-back', 'data-key': 'games:menu', on: { click: backToMenu } }, 'Mặt sau'),
h('div', { class: 'mg-gm-play__name' },
h('h1', { class: 'mg-gm-play__title', text: run.title }),
h('p', { class: 'mg-gm-count', text: 'Question ' + (run.index + 1) + ' of ' + run.prompts.length }))),
h('div', {
class: 'mg-progress mg-gm-bar', role: 'progressbar', 'aria-label': 'Tiến triển',
'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct)
}, h('span', { style: { width: pct + '%' } })),
h('div', { class: 'mg-gm-play__body' }, card));
show(screen, !toTop);
var target = null;
if (focusKey === 'first') {
target = container.querySelector('.mg-gm-option:not(:disabled), .mg-gm-move:not(:disabled), .mg-gm-bucket:not(:disabled), .mg-gm-input:not(:disabled)');
} else if (focusKey) {
target = container.querySelector('[data-key="' + focusKey + '"]');
}
if (!target || target.disabled) {
target = container.querySelector('[data-key="games:check"]') || container.querySelector('[data-key="games:next"]') ||
container.querySelector('[data-key="games:hint"]:not(:disabled)') || container.querySelector('[data-key="games:reveal"]:not(:disabled)');
}
if (target && typeof target.focus === 'function') { target.focus({ preventScroll: true }); }
if (shake && !reduceMotion()) {
var bad = container.querySelectorAll('.mg-gm-option.is-wrong, .mg-gm-order__item.is-wrong, .mg-gm-sort__item.is-wrong, .mg-gm-field.is-wrong');
for (var k = 0; k < bad.length; k++) { bad[k].classList.add('shake'); }
}
}
function renderResults() {
if (destroyed || !run) { return; }
var total = run.prompts.length;
var clean = run.results.filter(function (r) { return r === 'clean'; }).length;
var facts = [h('p', { class: 'mg-gm-score__line', text: 'Đúng ngay lần đầu tiên: ' + clean + ' of ' + total })];
if (run.hintsTaken) { facts.push(h('p', { class: 'mg-gm-score__more', text: 'Gợi ý đã dùng: ' + run.hintsTaken })); }
if (run.shown) { facts.push(h('p', { class: 'mg-gm-score__more', text: 'Các câu trả lời được hiển thị: ' + run.shown })); }
if (typeof run.best === 'number') { facts.push(h('p', { class: 'mg-gm-score__more', text: 'Best ' + run.best + '%' })); }
var score = h('section', { class: 'mg-card mg-card--option mg-gm-score' }, ring(run.pct), h('div', { class: 'mg-gm-score__text' }, facts));
var summary = run.summary ? h('section', { class: 'mg-card mg-card--question mg-gm-summary' },
h('h2', { class: 'mg-results__heading', text: 'Tóm lại' }),
h('p', { class: 'mg-gm-summary__text', text: run.summary })) : null;
var misses = [];
run.prompts.forEach(function (p, i) {
if (run.results[i] !== 'clean') {
misses.push(h('li', { class: 'mg-gm-look__item' },
p.group ? h('p', { class: 'mg-gm-look__group', text: p.group }) : null,
h('p', { class: 'mg-gm-look__text', text: p.text }),
h('p', { class: 'mg-gm-look__why', text: p.explain })));
}
});
var look = h('section', { class: 'mg-card mg-card--question mg-gm-look' },
h('h2', { class: 'mg-results__heading', text: 'Cần xem lại' }),
misses.length ? h('ul', { class: 'mg-gm-look__list' }, misses) : h('p', { class: 'mg-results__none', text: 'Mọi câu trả lời đều đúng ngay từ lần đầu tiên.' }));
var actions = h('div', { class: 'mg-gm-results__actions' },
h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'games:again', on: { click: again } }, 'Chơi lại'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'games:another', on: { click: backToMenu } }, 'Hãy chọn một lựa chọn khác'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'games:home', on: { click: exitToMenu } }, 'Trở lại menu'));
var screen = h('section', { class: 'mg-gm-results' },
h('header', { class: 'mg-gm-results__head' },
h('h1', { class: 'mg-title', text: run.title }),
h('p', { class: 'mg-subtitle', text: 'Kết quả' })),
h('div', { class: 'mg-gm-results__body' }, score, summary, actions, look));
show(screen, false);
var first = container.querySelector('[data-key="games:again"]');
if (first) { first.focus({ preventScroll: true }); }
}
show(menuScreen(), true);
if (typeof root.addEventListener === 'function') { root.addEventListener('mg:games-cleared', onCleared); }
return {
destroy: function () {
destroyed = true;
if (typeof root.removeEventListener === 'function') { root.removeEventListener('mg:games-cleared', onCleared); }
while (container && container.firstChild) { container.removeChild(container.firstChild); }
view = null;
run = null;
refs = {};
}
};
}
MG.gamesUi = {
mount: mount,
clearBest: function () {
var doc = loadState();
doc.best = {};
saveState(doc);
if (typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function') {
root.dispatchEvent(new root.CustomEvent('mg:games-cleared'));
}
},
_test: { sanitize: sanitize, scorePrompts: scorePrompts }
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var KEY = 'mg.draw.v1';
var PASS_PCT = 80;
var FW = 520;
var FH = 320;
var MAX_BOND = 62;
var HIT_GHOST = 34;
var PAPER_MIN_W = 280;
var PAPER_MAX_W = 640;
var L_MAX = 52;
var L_MIN = 18;
var MARGIN = 0.8;
var EDGE = 42;
var TAP_ATOM = 24;
var TAP_BOND = 12;
var LABEL_PAD = 4;
var MAX_REACH_ATOM = 0.45;
var MAX_REACH_BOND = 0.3;
var TOKEN_NAMES = {
R: 'phần còn lại của phân tử', CoA: 'coenzyme A', 'P-Ribose': 'ribose phosphate', Adenine: 'adenine', PP: 'pyrophosphate, chất này bám vào chính oxy của nó.',
PPP: 'triphosphate, chất này bám vào oxy của chính nó.', UDP: 'uridine diphosphate, chất này bám vào chính oxy của nó.'
};
var ELEMENT_NAMES = { C: 'carbon', O: 'oxygen', N: 'nitrogen', S: 'sulfur', P: 'phosphorus' };
var STAMPS = [
{ id: 'phosphate', label: 'Phosphate ', tip: 'Photphat: một nhóm gồm một nguyên tử phốt pho và bốn nguyên tử oxy.' },
{ id: 'carboxyl', label: 'Carboxyl', tip: 'Carboxyl: một nguyên tử cacbon có liên kết đôi với một nguyên tử oxy và một nguyên tử oxy có liên kết đơn.' },
{ id: 'ring6', label: '6-ring', tip: 'Vòng 6: một vòng gồm sáu nguyên tử cacbon' },
{ id: 'ring5', label: '5-ring', tip: 'Vòng 5: một vòng gồm năm nguyên tử cacbon' }
];
var TOOLS = [
{ id: 'add', label: '+', tip: 'Thêm: ghi rõ các nguyên tử và liên kết' },
{ id: 'change', label: 'Thay đổi', tip: 'Thay đổi: chạm vào một nguyên tử để gán cho nó nguyên tố đã chọn.' },
{ id: 'erase', label: 'Xóa', tip: 'Xóa: chạm vào một nguyên tử hoặc một liên kết để loại bỏ nó.' }
];
var CLOCK = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2'];
var live = null;
function h() { return MG.ui.el.apply(null, arguments); }
function D() { return MG.draw; }
function E() { return MG.drawEdit; }
function sound() {
return !(MG.store && typeof MG.store.getSettings === 'function' && MG.store.getSettings().sound === false);
}
function playCorrect() { if (sound() && MG.sound && MG.sound.correct) { MG.sound.correct(); } }
function playComplete() { if (sound() && MG.sound && MG.sound.complete) { MG.sound.complete(); } }
function byId(list, id) {
for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
return null;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
var memory = null;
function readRaw() {
try {
var raw = root.localStorage ? root.localStorage.getItem(KEY) : null;
return raw ? JSON.parse(raw) : null;
} catch (err) {
return null;
}
}
function writeRaw(doc) {
memory = doc;
try { if (root.localStorage) { root.localStorage.setItem(KEY, JSON.stringify(doc)); } }
catch (err) { /* blocked or full: the memory copy stays */ }
}
function sanitize(raw) {
var src = raw && typeof raw === 'object' ? raw : {};
var out = { mode: 'restore', size: 'all', best: {} };
var modes = D() ? D().modes : [{ id: 'restore' }, { id: 'draw' }, { id: 'mixed' }];
var sizes = D() ? D().sizes : [{ id: 'small' }, { id: 'medium' }, { id: 'all' }];
if (byId(modes, src.mode)) { out.mode = src.mode; }
if (byId(sizes, src.size)) { out.size = src.size; }
if (src.best && typeof src.best === 'object' && !Array.isArray(src.best)) {
Object.keys(src.best).forEach(function (k) {
var v = src.best[k];
var m = /^([a-z]{1,12}):([a-z]{1,12})$/.exec(k);
if (m && byId(modes, m[1]) && byId(sizes, m[2]) && typeof v === 'number' && isFinite(v) && v >= 0 && v <= 100) { out.best[k] = Math.round(v); }
});
}
return out;
}
function loadState() { return sanitize(memory || readRaw() || {}); }
function saveState(state) { writeRaw(sanitize(state)); }
function keyOf(state) { return state.mode + ':' + state.size; }
function recordBest(state, pct) {
var k = keyOf(state);
var before = typeof state.best[k] === 'number' ? state.best[k] : 0;
if (pct > before) {
state.best[k] = pct;
saveState(state);
}
return state.best[k];
}
function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
function segDist(px, py, x1, y1, x2, y2) {
var dx = x2 - x1, dy = y2 - y1, len2 = dx * dx + dy * dy;
var t = len2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
return dist(px, py, x1 + dx * t, y1 + dy * t);
}
function boxDist(px, py, b) {
var dx = Math.max(b.x0 - px, 0, px - b.x1), dy = Math.max(b.y0 - py, 0, py - b.y1);
return Math.sqrt(dx * dx + dy * dy);
}
function nearest(layout, x, y, ra, onlyAtoms) {
var best = null;
(layout.atoms || []).forEach(function (a, i) {
if (onlyAtoms && onlyAtoms.indexOf(i) < 0) { return; }
var d = Math.min(dist(x, y, a.x, a.y), a.box ? boxDist(x, y, a.box) : Infinity);
if (d <= ra && (!best || d < best.d)) { best = { atom: i, d: d }; }
});
return best ? { atom: best.atom } : null;
}
function labelAt(layout, x, y, pad, use) {
var best = null;
(layout.atoms || []).forEach(function (a, i) {
if (!a.box || (use && !use(i))) { return; }
var d = boxDist(x, y, a.box);
if (d <= pad && (!best || d < best.d)) { best = { atom: i, d: d }; }
});
return best ? { atom: best.atom } : null;
}
function paperSize(width) {
var avail = width > 0 ? width - 40 : PAPER_MAX_W;
var w = clamp(Math.round(avail), PAPER_MIN_W, PAPER_MAX_W);
return { w: w, h: Math.max(230, Math.round(w * 0.62)) };
}
function fitView(ext, size, prev) {
if (!ext) { return { s: L_MAX, ox: 0, oy: 0 }; }
var w = ext.x1 - ext.x0 + 2 * MARGIN, hh = ext.y1 - ext.y0 + 2 * MARGIN;
var s = Math.max(L_MIN, Math.min(L_MAX, size.w / w, size.h / hh));
if (prev && Math.abs(prev.s - s) < 1e-6 &&
prev.ox + (ext.x0 - MARGIN) * s >= -0.5 && prev.ox + (ext.x1 + MARGIN) * s <= size.w + 0.5 &&
prev.oy + (ext.y0 - MARGIN) * s >= -0.5 && prev.oy + (ext.y1 + MARGIN) * s <= size.h + 0.5) { return prev; }
return { s: s, ox: size.w / 2 - (ext.x0 + ext.x1) / 2 * s, oy: size.h / 2 - (ext.y0 + ext.y1) / 2 * s };
}
function pieceSvg(opt, width, height) {
var atoms = [{ x: -0.866, y: 0.5, el: 'C', label: null }, { x: 0, y: 0, el: 'C', label: null }];
if (opt.key === 'C') { atoms.push({ x: 0.866, y: 0.5, el: 'C', label: null }); }
else { atoms.push({ x: 0.866, y: 0.5, el: 'X', label: { runs: opt.runsRight || [{ t: opt.caption, main: true }] } }); }
var geom = { atoms: atoms, bonds: [{ a: 0, b: 1, o: 1, s: 0 }, { a: 1, b: 2, o: opt.order === 2 ? 2 : 1, s: 0 }], groups: {} };
return MG.renderMolecule(geom, { width: width, height: height, maxBond: 36, pad: 6 });
}
function answerSvg(p, width, height) {
var g = MG.geometry[p.mol];
if (!g) { return ''; }
var opts = { width: width, height: height, maxBond: 40, extentOf: g, title: 'Cấu trúc của ' + p.name };
if (p.kind === 'restore') { opts.ghosts = D().ghosts(p, null, null, true); }
return MG.renderMolecule(g, opts);
}
function ring(pct) {
var r = 46, c = 2 * Math.PI * r;
var svg = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
'<circle class="mg-gm-ring__edge" cx="60" cy="60" r="' + r + '"/>' +
'<circle class="mg-gm-ring__track" cx="60" cy="60" r="' + r + '"/>' +
'<circle class="mg-gm-ring__arc" cx="60" cy="60" r="' + r + '"' +
' stroke-dasharray="' + (c * pct / 100).toFixed(2) + ' ' + c.toFixed(2) + '"' +
' transform="rotate(-90 60 60)"/></svg>';
return h('div', { class: 'mg-ring mg-gm-ring', role: 'img', 'aria-label': 'Đúng ngay lần đầu tiên ' + pct + ' phần trăm' },
h('div', { class: 'mg-ring__art', html: svg }),
h('span', { class: 'mg-ring__value', text: pct + '%' }));
}
function mount(container, hooks) {
var opts = hooks || {};
var state = loadState();
var destroyed = false;
var view = null;
var run = null;
var sheet = null;         // the open sheet of choices (a modal), or null
function show(node, keepScroll) {
if (!container) { return; }
while (container.firstChild) { container.removeChild(container.firstChild); }
container.appendChild(node);
view = node;
if (!keepScroll && typeof root.scrollTo === 'function') { root.scrollTo(0, 0); }
}
function onCleared() {
if (destroyed) { return; }
state = loadState();
if (!run && view && view.classList && view.classList.contains('mg-dw-menu')) { show(menuScreen(), true); }
}
function exitToMenu() { closeSheet(); if (typeof opts.onExit === 'function') { opts.onExit(); } }
function closeSheet() {
if (sheet) { var s = sheet; sheet = null; s.close(); }
}
function choiceButton(group, item, on, onPick) {
return h('button', {
type: 'button', class: 'mg-dw-choice' + (on ? ' is-on' : ''), 'aria-pressed': on ? 'true' : 'false', 'data-key': 'draw:' + group + ':' + item.id,
'aria-label': item.label + '. ' + item.note, title: item.note,
on: { click: function () { onPick(item.id); } }
},
h('span', { class: 'mg-dw-choice__label', text: item.label }));
}
function menuScreen() {
var n = D().available({ mode: state.mode, size: state.size });
var best = state.best[keyOf(state)];
var modes = h('div', { class: 'mg-dw-choices', role: 'group', 'aria-label': 'Nên luyện tập những gì' },
D().modes.map(function (m) {
return choiceButton('mode', m, state.mode === m.id, function (id) { state.mode = id; saveState(state); show(menuScreen(), true); focusKey('draw:mode:' + id); });
}));
var sizes = h('div', { class: 'mg-dw-choices mg-dw-choices--size', role: 'group', 'aria-label': 'Các phân tử lớn đến mức nào?' },
D().sizes.map(function (m) {
return choiceButton('size', m, state.size === m.id, function (id) { state.size = id; saveState(state); show(menuScreen(), true); focusKey('draw:size:' + id); });
}));
var card = h('section', { class: 'mg-card mg-card--option mg-dw-setup' },
h('h2', { class: 'mg-dw-setup__name', text: 'Bạn muốn luyện tập điều gì?' }), modes,
h('h2', { class: 'mg-dw-setup__name', text: 'Các phân tử có kích thước bao nhiêu?' }), sizes,
h('button', {
type: 'button', class: 'mg-btn mg-btn--primary mg-dw-start', 'data-key': 'draw:start', disabled: n < 1, on: { click: startRun }
}, 'Bắt đầu'),
typeof best === 'number' ? h('p', { class: 'mg-dw-best', text: 'Best ' + best + '%' }) : null);
return h('section', { class: 'mg-dw-menu' },
h('header', { class: 'mg-dw-head' },
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-dw-back', 'data-key': 'draw:exit', on: { click: exitToMenu } }, 'Trở lại menu'),
h('h1', { class: 'mg-title', text: 'Vẽ các phân tử' })),
h('div', { class: 'mg-dw-body' }, card));
}
function focusKey(key) {
var t = container ? container.querySelector('[data-key="' + key + '"]') : null;
if (t && typeof t.focus === 'function') { t.focus({ preventScroll: true }); }
}
function backToMenu() {
closeSheet();
run = null;
show(menuScreen(), false);
focusKey('draw:start');
}
function seedNow() { return Date.now() % 1000000000; }
function enterPrompt() {
var p = run.prompts[run.index];
run.tries = 0;
run.hintTapped = false;
run.hintsShown = 0;
run.solved = false;
run.revealed = false;
run.feedback = '';
run.placed = p.kind === 'restore' ? p.items.map(function () { return null; }) : [];
run.marks = p.kind === 'restore' ? p.items.map(function () { return null; }) : [];
run.wrongOpts = p.kind === 'restore' ? p.items.map(function () { return {}; }) : [];
run.halved = false;
run.ed = null;
run.view = null;
run.layout = null;
run.paper = null;
run.over = [];
run.status = '';
run.armClear = false;
if (p.kind === 'draw') {
run.ed = E().create();
run.paper = paperSize(container ? container.clientWidth : 0);
run.view = fitView(null, run.paper, null);
}
}
function startRun() {
var built = D().start({ mode: state.mode, size: state.size }, seedNow());
run = { title: built.title, intro: built.intro, prompts: built.prompts, index: 0, results: [], hintsTaken: 0, shown: 0, pct: 0, best: null, mode: state.mode };
if (!run.prompts.length) { run = null; backToMenu(); return; }
enterPrompt();
renderPlay('first', true);
}
function current() { return run.prompts[run.index]; }
function locked() { return run.solved || run.revealed; }
function solve() {
run.solved = true;
run.results[run.index] = run.tries === 0 && !run.hintTapped ? 'clean' : 'hinted';
run.feedback = current().kind === 'draw' ? 'Đúng vậy. Trò chơi vẽ nó như thế đấy.' : 'Phải.';
playCorrect();
}
function unplacedFirst() {
var p = current();
for (var i = 0; i < p.items.length; i++) { if (!run.placed[i]) { return i; } }
return -1;
}
function place(i, optionId) {
if (!run || locked()) { return; }
run.placed[i] = optionId;
run.marks[i] = null;
run.feedback = '';
var next = unplacedFirst();
renderPlay(next >= 0 ? 'draw:ghost:' + next : 'draw:check', false);
}
function clearPiece(i) {
if (!run || locked()) { return; }
run.placed[i] = null;
run.marks[i] = null;
renderPlay('draw:ghost:' + i, false);
}
function checkRestore() {
if (!run || locked()) { return; }
var p = current();
var open = unplacedFirst();
if (open >= 0) {
run.feedback = 'Trước tiên, hãy chọn một mảnh ghép cho mỗi vòng tròn nét đứt.';
renderPlay('draw:ghost:' + open, false);
return;
}
var res = D().check(p, { placed: run.placed });
run.marks = res.marks;
if (res.ok) { solve(); renderPlay('draw:next', false); return; }
run.tries += 1;
res.marks.forEach(function (m, i) {
if (m === false) { run.wrongOpts[i][run.placed[i]] = true; run.placed[i] = null; }
});
run.feedback = 'Chưa hẳn. Những hình tròn có dấu thập là sai, hãy thử lại.';
var first = res.marks.indexOf(false);
renderPlay('draw:ghost:' + first, false);
}
function checkDraw() {
if (!run || locked()) { return; }
var p = current();
var res = D().check(p, { state: run.ed });
if (res.ok) { solve(); renderPlay('draw:next', false); return; }
if (res.code !== 'empty' && res.code !== 'over' && res.code !== 'split') { run.tries += 1; }
run.over = res.over || [];
run.feedback = res.message;
renderPlay('draw:check', false);
}
function check() { if (current().kind === 'draw') { checkDraw(); } else { checkRestore(); } }
function hint() {
if (!run || locked()) { return; }
var p = current();
if (run.hintsShown >= p.hints.length) { return; }
run.hintsShown += 1;
run.hintsTaken += 1;
run.hintTapped = true;
if (p.kind === 'restore' && run.hintsShown >= 3) { run.halved = true; }
renderPlay('draw:hint', false);
}
function reveal() {
if (!run || locked()) { return; }
var p = current();
run.revealed = true;
run.results[run.index] = 'shown';
run.shown += 1;
run.feedback = p.kind === 'restore' ? 'Những mảnh ghép còn thiếu: ' + p.answerText + '.' : 'Đây là ' + p.name + ', như cách trò chơi diễn ra.';
renderPlay('draw:next', false);
}
function next() {
if (!run || !locked()) { return; }
closeSheet();
run.index += 1;
if (run.index >= run.prompts.length) { finishRun(); return; }
enterPrompt();
renderPlay('first', true);
}
function finishRun() {
run.pct = D().score(run.results);
run.best = recordBest(state, run.pct);
if (run.pct >= PASS_PCT) { playComplete(); }
renderResults();
}
function again() {
if (!run) { backToMenu(); return; }
startRun();
}
function visibleOptions(item) {
if (!run.halved) { return item.options; }
var keep = [];
item.options.forEach(function (o) {
if (o.id === item.answerId || keep.filter(function (k) { return k.id !== item.answerId; }).length < 2) { keep.push(o); }
});
return item.options.filter(function (o) { return keep.indexOf(o) >= 0; });
}
function openSheet(i) {
if (!run || locked() || sheet) { return; }
var p = current();
var item = p.items[i];
var wrong = run.wrongOpts[i] || {};
var now = run.placed[i] ? byId(item.options, run.placed[i]) : null;
var grid = h('div', { class: 'mg-dw-opts', role: 'group', 'aria-label': 'Các sản phẩm để lựa chọn' },
visibleOptions(item).map(function (o) {
var isWrong = !!wrong[o.id];
var on = run.placed[i] === o.id;
return h('button', {
type: 'button', class: 'mg-option mg-dw-opt' + (on ? ' is-on' : '') + (isWrong ? ' is-wrong' : ''), 'data-key': 'draw:opt:' + o.id,
'aria-label': o.name + (on ? ', được chọn bây giờ' : '') + (isWrong ? 'đã thử và sai' : ''), 'aria-pressed': on ? 'true' : 'false', disabled: isWrong,
on: { click: function () { closeSheet(); place(i, o.id); } }
},
h('span', { class: 'mg-dw-opt__art', html: pieceSvg(o, 120, 70) }),
h('span', { class: 'mg-dw-opt__cap', text: o.caption }),
isWrong ? h('span', { class: 'mg-dw-opt__no', text: 'Không phải cái này.' }) : null);
}));
var tools = run.placed[i]
? h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-dw-clear', 'data-key': 'draw:clear', on: { click: function () { closeSheet(); clearPiece(i); } } }, 'Mang nó đi')
: null;
var title = p.items.length > 1 ? 'Cái gì quay theo vòng tròn ' + (i + 1) + ' của ' + p.items.length + '?' : 'Cái gì nằm trong vòng tròn?';
var nowLine = now ? h('p', { class: 'mg-dw-sheetnow', 'data-key': 'draw:now', text: 'Now: ' + now.caption + 'Hãy chọn một mảnh ghép khác để thay thế.' }) : null;
var body = h('div', { class: 'mg-dw-sheetbody' }, nowLine, grid, tools);
var mod = MG.ui.modal({
title: title, label: title, panelClass: 'mg-sheet mg-dw-sheet', body: body,
onClose: function () { if (sheet === mod) { sheet = null; } }
});
sheet = mod;
}
function target(list, w, hh, x, y, label, key, act) {
list.push(h('button', {
type: 'button', class: 'mg-dw-target', 'data-key': key, 'aria-label': label, disabled: locked(),
style: { left: (100 * x / w).toFixed(2) + '%', top: (100 * y / hh).toFixed(2) + '%' },
on: { click: function (e) { e.stopPropagation(); act(); } }
}));
}
function figureNode(p) {
var g = MG.geometry[p.mol];
var o = { width: FW, height: FH, maxBond: MAX_BOND, pad: 18, extentOf: g, title: 'Cấu trúc của ' + p.name };
o.ghosts = D().ghosts(p, run.placed, run.marks, run.revealed);
var drawn = MG.renderMoleculeEx(g, o);
var layout = drawn.layout;
var art = h('div', { class: 'mg-dw-art', html: drawn.svg });
var box = h('div', { class: 'mg-dw-figure' + (locked() ? ' is-locked' : ''), 'data-key': 'draw:figure' }, art);
var targets = [];
p.items.forEach(function (it, i) {
var a = layout.atoms[it.atom];
var chosen = run.placed[i] ? byId(it.options, run.placed[i]) : null;
var about = run.revealed ? 'shown' : (chosen ? 'chosen: ' + chosen.name + 'Nhấn vào đây để thay đổi.' : 'empty');
target(targets, FW, FH, a.x, a.y, 'Vòng tròn ' + (i + 1) + ' của ' + p.items.length + ', ' + about, 'draw:ghost:' + i, function () { openSheet(i); });
});
box.appendChild(h('div', { class: 'mg-dw-targets' }, targets));
box.addEventListener('click', function (e) {
if (locked() || !run) { return; }
var rect = art.getBoundingClientRect();
if (!rect.width) { return; }
var k = FW / rect.width;
var x = (e.clientX - rect.left) * k, y = (e.clientY - rect.top) * k;
var idx = nearest(layout, x, y, HIT_GHOST * k, p.items.map(function (it) { return it.atom; }));
if (idx) {
for (var i = 0; i < p.items.length; i++) { if (p.items[i].atom === idx.atom) { openSheet(i); return; } }
}
});
return box;
}
function sayAfter(res) {
var said = {
first: 'Nguyên tử đầu tiên được đặt vào vị trí.', atom: 'Atom đã thêm.', bond: 'Bond nói thêm.', order: 'Bond đã thay đổi.', select: 'Nguyên tử đã được chọn.',
deselect: 'Quá trình lựa chọn đã hoàn tất.', change: 'Nguyên tử đã thay đổi.', 'erase-atom': 'Nguyên tử đã bị xóa.', 'erase-bond': 'Bond đã bị xóa sổ.', stamp: 'Nhóm đã được xếp hạng.'
};
var line = said[res.did] || res.message || '';
return (line ? line + ' ' : '') + E().describe(run.ed) + '.';
}
function helpText() {
var st = run.ed;
if (st.tool === 'erase') { return 'Chạm vào một nguyên tử hoặc một liên kết để loại bỏ nó.'; }
if (st.tool === 'change') { return 'Chọn một nguyên tố, sau đó chạm vào nguyên tử mà bạn muốn biến thành nguyên tố đó.'; }
if (st.stamp) { return st.stamp === 'ring5' || st.stamp === 'ring6' ? 'Chạm vào một nguyên tử để gắn vòng vào đó, chạm vào một liên kết để nối vòng với nguyên tử, hoặc chạm vào trang giấy để đặt nó xuống.' : 'Chạm vào một nguyên tử để gắn nhóm vào đó, hoặc chạm vào trang để đặt nó xuống.'; }
if (!st.atoms.length) { return 'Chạm vào trang để đặt nguyên tử đầu tiên.'; }
if (st.sel === null) { return 'Chạm vào một nguyên tử để chọn nó.'; }
return 'Chạm vào bên cạnh nguyên tử đã chọn để thêm nguyên tử tiếp theo. Chạm vào một liên kết để biến nó thành liên kết đơn hoặc đôi. Chạm vào một nguyên tử để chọn nó hoặc để đóng vòng.';
}
function atomLabel(a) {
var name = ELEMENT_NAMES[a.el] || (TOKEN_NAMES[a.el] ? a.el + ', ' + TOKEN_NAMES[a.el] : a.el);
return name.charAt(0).toUpperCase() + name.slice(1);
}
function toModel(x, y) { return { x: (x - run.view.ox) / run.view.s, y: (y - run.view.oy) / run.view.s }; }
function editorTap(mx, my, k, focus) {
if (!run || locked() || current().kind !== 'draw') { return; }
var reach = { atom: Math.min(MAX_REACH_ATOM, TAP_ATOM * k / run.view.s), bond: Math.min(MAX_REACH_BOND, TAP_BOND * k / run.view.s) };
var res = E().tap(run.ed, mx, my, reach);
var f = focus;
if (focus && /^draw:(atom|slot|center)/.test(focus)) { f = run.ed.sel !== null ? 'draw:atom:' + run.ed.sel : (/^draw:atom:/.test(focus) ? focus : null); }
afterEdit(sayAfter(res), f);
}
function afterEdit(said, focus) {
run.over = [];
run.armClear = false;
run.feedback = '';
run.status = said;
run.view = fitView(E().extent(run.ed), run.paper, run.view);
refreshEditor(focus);
}
function palette(key, act) {
if (!run || locked()) { return; }
var said = act();
afterEdit((typeof said === 'string' ? said + ' ' : '') + E().describe(run.ed) + '.', key);
}
function refreshEditor(focus) {
if (destroyed || !run || !container) { return; }
var old = container.querySelector('.mg-dw-editor');
if (!old) { renderPlay(focus, false); return; }
var fresh = editorNode(current());
old.parentNode.replaceChild(fresh, old);
var fb = container.querySelector('.mg-dw-feedback');
if (fb) { fb.textContent = run.feedback || ''; }
var say = container.querySelector('[data-key="draw:say"]');
if (say) { say.textContent = run.status || ''; }
var t = focus ? container.querySelector('[data-key="' + focus + '"]') : null;
if (focus && (!t || t.disabled) && run.ed.sel !== null) { t = container.querySelector('[data-key="draw:atom:' + run.ed.sel + '"]'); }
if (!t || t.disabled) { t = container.querySelector('.mg-dw-paper'); }
if (t && typeof t.focus === 'function') { t.focus({ preventScroll: true }); }
}
function overlayMarkup(size) {
var st = run.ed, v = run.view;
var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size.w + ' ' + size.h + '" width="' + size.w + '" height="' + size.h + '" aria-hidden="true" focusable="false">';
if (st.tool === 'add' && st.sel !== null && !st.stamp) {
E().slotsOf(st).forEach(function (s) {
if (s.taken === null) { out += '<circle class="mg-dw-slot" cx="' + (v.ox + s.x * v.s).toFixed(1) + '" cy="' + (v.oy + s.y * v.s).toFixed(1) + '" r="3.5"/>'; }
});
}
if (st.sel !== null) {
var a = E()._test.atomById(st, st.sel);
if (a) { out += '<circle class="mg-dw-sel" cx="' + (v.ox + a.x * v.s).toFixed(1) + '" cy="' + (v.oy + a.y * v.s).toFixed(1) + '" r="' + Math.max(13, 0.34 * v.s).toFixed(1) + '"/>'; }
}
return out + '</svg>';
}
function pageSvg(p, size) {
var st = run.ed;
var title = 'Bản vẽ của bạn ' + p.name;
if (!st.atoms.length) {
run.layout = null;
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size.w + ' ' + size.h + '" width="' + size.w + '" height="' + size.h + '" role="img"><title>' + title + ': empty</title></svg>';
}
var marks = run.over.map(function (i) { return { atom: i, state: 'wrong' }; });
var drawn = MG.renderMoleculeEx(E().toGeometry(st), { width: size.w, height: size.h, view: run.view, pad: 0, title: title, marks: marks });
run.layout = drawn.layout;
return drawn.svg;
}
function editorNode(p) {
var st = run.ed, size = run.paper, v = run.view;
var art = h('div', { class: 'mg-dw-art', html: pageSvg(p, size) });
var over = h('div', { class: 'mg-dw-over', html: overlayMarkup(size) });
var paper = h('div', {
class: 'mg-dw-paper' + (st.atoms.length ? '' : ' is-empty'), 'data-key': 'draw:paper', tabindex: '-1', role: 'group',
'aria-label': 'Trang vẽ. ' + E().describe(st) + '.'
}, art, over);
var keys = [];
if (!st.atoms.length) {
target(keys, size.w, size.h, size.w / 2, size.h / 2, 'Trang. Nhấn để đặt nguyên tử đầu tiên vào giữa.', 'draw:center', function () {
var m = toModel(size.w / 2, size.h / 2);
editorTap(m.x, m.y, 1, 'draw:center');
});
}
st.atoms.forEach(function (a, i) {
var bonds = st.bonds.filter(function (b) { return b.a === a.id || b.b === a.id; }).length;
target(keys, size.w, size.h, v.ox + a.x * v.s, v.oy + a.y * v.s,
atomLabel(a) + 'nguyên tử ' + (i + 1) + ' của ' + st.atoms.length + ', ' + bonds + (bonds === 1 ? ' trái phiếu' : ' trái phiếu') + (st.sel === a.id ? 'đã chọn' : '') + 'Nhấn vào để thực hiện.',
'draw:atom:' + a.id, function () { editorTap(a.x, a.y, 1, 'draw:atom:' + a.id); });
});
st.bonds.forEach(function (b, j) {
var A = E()._test.atomById(st, b.a), B = E()._test.atomById(st, b.b);
if (!A || !B) { return; }
target(keys, size.w, size.h, v.ox + (A.x + B.x) / 2 * v.s, v.oy + (A.y + B.y) / 2 * v.s,
(b.o === 2 ? 'Thêm nối đôi' : 'Đơn') + ' trái phiếu ' + (j + 1) + ' giữa ' + (ELEMENT_NAMES[A.el] || A.el) + ' Và ' + (ELEMENT_NAMES[B.el] || B.el) + 'Nhấn vào để thực hiện.',
'draw:bond:' + b.id, function () { editorTap((A.x + B.x) / 2, (A.y + B.y) / 2, 1, 'draw:bond:' + b.id); });
});
if (st.tool === 'add' && st.sel !== null && !st.stamp) {
E().slotsOf(st).forEach(function (s) {
var sx = v.ox + s.x * v.s, sy = v.oy + s.y * v.s;
if (s.taken !== null || sx < 14 || sy < 14 || sx > size.w - 14 || sy > size.h - 14) { return; }
target(keys, size.w, size.h, v.ox + s.x * v.s, v.oy + s.y * v.s, 'Thêm vào ' + (ELEMENT_NAMES[st.brush] || st.brush) + ' Tại ' + CLOCK[s.k] + ' giờ của nguyên tử được chọn',
'draw:slot:' + s.k, function () { editorTap(s.x, s.y, 1, 'draw:slot:' + s.k); });
});
}
paper.appendChild(h('div', { class: 'mg-dw-targets' }, keys));
paper.addEventListener('click', function (e) {
if (locked() || !run) { return; }
var rect = art.getBoundingClientRect();
if (!rect.width) { return; }
var k = size.w / rect.width;
var x = (e.clientX - rect.left) * k, y = (e.clientY - rect.top) * k;
if (!st.atoms.length && st.tool === 'add' && !st.stamp) { x = clamp(x, EDGE, size.w - EDGE); y = clamp(y, EDGE, size.h - EDGE); }
var onAtom = run.layout ? labelAt(run.layout, x, y, LABEL_PAD * k, function (i) { return !!st.atoms[i] && E().ELEMENTS.indexOf(st.atoms[i].el) < 0; }) : null;
if (onAtom && st.atoms[onAtom.atom]) { editorTap(st.atoms[onAtom.atom].x, st.atoms[onAtom.atom].y, k, null); return; }
var m = toModel(x, y);
editorTap(m.x, m.y, k, null);
});
function keyButton(key, text, on, tip, act, extra) {
return h('button', {
type: 'button', class: 'mg-dw-key' + (on ? ' is-on' : '') + (extra ? ' ' + extra : ''), 'data-key': key, 'aria-pressed': on ? 'true' : 'false', title: tip, 'aria-label': tip,
on: { click: function () { palette(key, act); } }
}, text);
}
var brushes = ['C', 'O', 'N', 'S', 'P'].concat(p.tokens || []);
var atomsRow = h('div', { class: 'mg-dw-row', role: 'group', 'aria-label': 'Nguyên tử' }, brushes.map(function (el) {
var tip = el + (ELEMENT_NAMES[el] ? ', ' + ELEMENT_NAMES[el] : ', ' + (TOKEN_NAMES[el] || 'một nhóm được viết dưới dạng một nhãn'));
return keyButton('draw:brush:' + el, el, st.brush === el && st.tool !== 'erase' && !st.stamp, tip, function () { E().setBrush(st, el); return el + ' đã được chọn.'; }, el.length > 2 ? 'mg-dw-key--wide' : '');
}));
var stampsRow = h('div', { class: 'mg-dw-row', role: 'group', 'aria-label': 'Các nhóm được đặt toàn bộ' }, STAMPS.map(function (s) {
return keyButton('draw:stamp:' + s.id, s.label, st.stamp === s.id, s.tip, function () { E().setStamp(st, s.id); return st.stamp ? s.label + ' Sẵn sàng: chạm vào vị trí cần đặt.' : s.label + ' cất đi.'; }, 'mg-dw-key--wide');
}));
var toolsRow = h('div', { class: 'mg-dw-row', role: 'group', 'aria-label': 'Công cụ' },
TOOLS.map(function (t) {
return keyButton('draw:tool:' + t.id, t.label, st.tool === t.id && !st.stamp, t.tip, function () { E().setTool(st, t.id); return t.label + ' dụng cụ.'; }, 'mg-dw-key--wide');
}).concat([
keyButton('draw:double', 'Gấp đôi', st.dbl, 'Đôi: liên kết tiếp theo bạn thêm vào là liên kết đôi.', function () { E().toggleDouble(st); return st.dbl ? 'Liên kết tiếp theo sẽ là liên kết đôi.' : 'Trái phiếu tiếp theo sẽ là trái phiếu đơn.'; }, 'mg-dw-key--wide'),
h('button', {
type: 'button', class: 'mg-dw-key mg-dw-key--wide', 'data-key': 'draw:undo', disabled: !st.undo.length, title: 'Hoàn tác: lấy lại thay đổi cuối cùng', 'aria-label': 'Hoàn tác: lấy lại thay đổi cuối cùng',
on: { click: function () { palette('draw:undo', function () { E().undo(st); return 'Đã hủy.'; }); } }
}, 'Hoàn tác'),
h('button', {
type: 'button', class: 'mg-dw-key mg-dw-key--wide' + (run.armClear ? ' is-warn' : ''), 'data-key': 'draw:clear-page', disabled: !st.atoms.length, title: 'Xóa: làm trống trang',
'aria-label': run.armClear ? 'Chắc chắn rồi? Nhấn lại để xóa trang.' : 'Xóa: làm trống trang',
on: { click: function () {
if (!run.armClear) { run.armClear = true; refreshEditor('draw:clear-page'); return; }
palette('draw:clear-page', function () { E().clear(st); return 'Trang đã được xóa.'; });
} }
}, run.armClear ? 'Chắc chắn?' : 'Thông thoáng')
]));
var tokenNote = (p.tokens || []).length
? h('p', { class: 'mg-dw-note', text: 'Phân tử này được vẽ với ' + (p.tokens.length === 1 ? 'một nhóm' : 'groups') + ' được viết dưới dạng một nhãn duy nhất: ' +
p.tokens.map(function (t) { return t + ' là ' + (TOKEN_NAMES[t] || 'một nhóm'); }).join(', ') + '.' })
: null;
return h('div', { class: 'mg-dw-editor' },
paper,
h('p', { class: 'mg-dw-status', text: run.status || (E().describe(st) + '.') }),
h('p', { class: 'mg-dw-help', text: helpText() }),
atomsRow, stampsRow, toolsRow, tokenNote);
}
function storedNode(p) {
var g = MG.geometry[p.mol];
var all = g.atoms.map(function (a, i) { return i; });
var allBonds = g.bonds.map(function (b, j) { return j; });
var svg = MG.renderMolecule(g, { width: FW, height: FH, maxBond: MAX_BOND, pad: 18, extentOf: g, title: 'Cấu trúc của ' + p.name, hlAtoms: all, hlBonds: allBonds });
return h('div', { class: 'mg-dw-figure is-locked mg-dw-stored', 'data-key': 'draw:figure' }, h('div', { class: 'mg-dw-art', html: svg }));
}
function moreButton(targetId) {
var open = run.moreFor === run.index;
return h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-dw-more', 'data-key': 'draw:more', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': targetId,
on: { click: function () { run.moreFor = open ? -1 : run.index; renderPlay('draw:more'); } }
}, open ? 'Hiển thị ít hơn' : 'Đọc thêm');
}
function renderPlay(focus, toTop) {
if (destroyed || !run) { return; }
var p = current();
var isLocked = locked();
var pct = Math.round((100 * (run.index + (isLocked ? 1 : 0))) / run.prompts.length);
var promptId = 'mg-dw-q' + run.index;
var hintItems = [];
for (var i = 0; i < run.hintsShown; i++) { hintItems.push(h('li', { class: 'mg-dw-hint-line', text: p.hints[i] })); }
var buttons = [];
if (!isLocked) {
buttons.push(h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'draw:check', on: { click: check } }, 'Kiểm tra'));
}
buttons.push(h('button', {
type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'draw:hint', disabled: isLocked || run.hintsShown >= p.hints.length, on: { click: hint }
}, 'Gợi ý'));
buttons.push(h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'draw:reveal', disabled: isLocked, on: { click: reveal } }, 'Tiết lộ'));
if (isLocked) {
buttons.push(h('button', {
type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'draw:next', on: { click: next }
}, run.index >= run.prompts.length - 1 ? 'Xem kết quả' : 'Kế tiếp'));
}
var figure = p.kind === 'draw' ? (isLocked ? storedNode(p) : editorNode(p)) : figureNode(p);
var say = p.kind === 'draw' && !isLocked ? h('p', { class: 'mgq-sr-only', 'aria-live': 'polite', 'data-key': 'draw:say', text: '' }) : null;
var card = h('section', { class: 'mg-card mg-card--question mg-dw-prompt', 'aria-labelledby': promptId },
h('p', { class: 'mg-dw-prompt__text', id: promptId, text: p.text }),
figure, say,
h('div', { class: 'mg-dw-actions' }, buttons),
h('p', { class: 'mg-dw-feedback', 'aria-live': 'polite', text: run.feedback || '' }),
hintItems.length ? h('ul', { class: 'mg-dw-hints' }, hintItems) : null,
isLocked && p.explain ? moreButton(promptId + '-more') : null,
isLocked && p.explain ? h('p', { class: 'mg-dw-explain', id: promptId + '-more', hidden: run.moreFor !== run.index, text: p.explain }) : null);
var screen = h('section', { class: 'mg-dw-play' },
h('header', { class: 'mg-dw-play__bar' },
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-dw-back', 'data-key': 'draw:menu', on: { click: backToMenu } }, 'Mặt sau'),
h('div', { class: 'mg-dw-play__name' },
h('h1', { class: 'mg-dw-play__title', text: run.title }),
h('p', { class: 'mg-dw-count', text: 'Question ' + (run.index + 1) + ' of ' + run.prompts.length }))),
h('div', {
class: 'mg-progress mg-dw-bar', role: 'progressbar', 'aria-label': 'Tiến triển',
'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct)
}, h('span', { style: { width: pct + '%' } })),
h('div', { class: 'mg-dw-play__body' }, card));
show(screen, !toTop);
var tgt = null;
if (focus === 'first') {
tgt = container.querySelector('.mg-dw-target:not(:disabled)') || container.querySelector('[data-key="draw:hint"]:not(:disabled)');
} else if (focus) {
tgt = container.querySelector('[data-key="' + focus + '"]');
}
if (!tgt || tgt.disabled) {
tgt = container.querySelector('[data-key="draw:check"]') || container.querySelector('[data-key="draw:next"]') ||
container.querySelector('[data-key="draw:hint"]:not(:disabled)') || container.querySelector('[data-key="draw:reveal"]:not(:disabled)');
}
if (tgt && typeof tgt.focus === 'function') { tgt.focus({ preventScroll: true }); }
}
function renderResults() {
if (destroyed || !run) { return; }
var total = run.prompts.length;
var clean = run.results.filter(function (r) { return r === 'clean'; }).length;
var facts = [h('p', { class: 'mg-gm-score__line', text: 'Đúng ngay lần đầu tiên: ' + clean + ' of ' + total })];
if (run.hintsTaken) { facts.push(h('p', { class: 'mg-gm-score__more', text: 'Gợi ý đã dùng: ' + run.hintsTaken })); }
if (run.shown) { facts.push(h('p', { class: 'mg-gm-score__more', text: 'Các câu trả lời được hiển thị: ' + run.shown })); }
if (typeof run.best === 'number') { facts.push(h('p', { class: 'mg-gm-score__more', text: 'Best ' + run.best + '%' })); }
var score = h('section', { class: 'mg-card mg-card--option mg-gm-score' }, ring(run.pct), h('div', { class: 'mg-gm-score__text' }, facts));
var misses = [];
run.prompts.forEach(function (p, i) {
if (run.results[i] === 'clean') { return; }
var what = p.kind === 'restore' ? 'Những mảnh ghép còn thiếu: ' + p.answerText + '.' : 'Bản vẽ hoàn chỉnh được hiển thị.';
misses.push(h('li', { class: 'mg-dw-look__item' },
h('div', { class: 'mg-dw-look__art', html: answerSvg(p, 200, 120) }),
h('div', { class: 'mg-dw-look__text' },
h('p', { class: 'mg-dw-look__name', text: p.name }),
h('p', { class: 'mg-dw-look__what', text: what }))));
});
var look = h('section', { class: 'mg-card mg-card--question mg-dw-look' },
h('h2', { class: 'mg-results__heading', text: 'Cần xem lại' }),
misses.length ? h('ul', { class: 'mg-dw-look__list' }, misses) : h('p', { class: 'mg-results__none', text: 'Mọi câu trả lời đều đúng ngay từ lần đầu tiên.' }));
var actions = h('div', { class: 'mg-dw-results__actions' },
h('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'draw:again', on: { click: again } }, 'Chơi lại'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'draw:another', on: { click: backToMenu } }, 'Đổi bài luyện tập'),
h('button', { type: 'button', class: 'mg-btn mg-btn--ghost', 'data-key': 'draw:home', on: { click: exitToMenu } }, 'Về menu'));
var screen = h('section', { class: 'mg-dw-results' },
h('header', { class: 'mg-dw-results__head' },
h('h1', { class: 'mg-title', text: run.title }),
h('p', { class: 'mg-subtitle', text: 'Kết quả' })),
h('div', { class: 'mg-dw-results__body' }, score, actions, look));
show(screen, false);
focusKey('draw:again');
}
show(menuScreen(), true);
if (typeof root.addEventListener === 'function') { root.addEventListener('mg:draw-cleared', onCleared); }
var controller = {
destroy: function () {
destroyed = true;
if (live === controller) { live = null; }
closeSheet();
if (typeof root.removeEventListener === 'function') { root.removeEventListener('mg:draw-cleared', onCleared); }
while (container && container.firstChild) { container.removeChild(container.firstChild); }
view = null;
run = null;
},
_state: function () {
return run ? {
index: run.index, prompt: run.prompts[run.index], placed: run.placed.slice(), marks: run.marks.slice(), solved: run.solved, revealed: run.revealed,
hintsShown: run.hintsShown, tries: run.tries, results: run.results.slice(), total: run.prompts.length,
ed: run.ed ? { atoms: run.ed.atoms, bonds: run.ed.bonds, sel: run.ed.sel, brush: run.ed.brush, tool: run.ed.tool, stamp: run.ed.stamp, dbl: run.ed.dbl, undo: run.ed.undo.length } : null,
view: run.view, paper: run.paper, over: run.over.slice(), feedback: run.feedback
} : null;
}
};
live = controller;
return controller;
}
MG.drawUi = {
mount: mount,
clearBest: function () {
var doc = loadState();
doc.best = {};
saveState(doc);
if (typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function') {
root.dispatchEvent(new root.CustomEvent('mg:draw-cleared'));
}
},
_test: {
current: function () { return live && live._state ? live._state() : null; }, sanitize: sanitize, keyOf: keyOf, nearest: nearest, segDist: segDist,
boxDist: boxDist, labelAt: labelAt, fitView: fitView, paperSize: paperSize, FW: FW, FH: FH, HIT_GHOST: HIT_GHOST, L_MAX: L_MAX, L_MIN: L_MIN, MARGIN: MARGIN, EDGE: EDGE,
TAP_ATOM: TAP_ATOM, TAP_BOND: TAP_BOND, MAX_REACH_ATOM: MAX_REACH_ATOM, MAX_REACH_BOND: MAX_REACH_BOND, LABEL_PAD: LABEL_PAD
}
};
})(typeof window !== 'undefined' ? window : globalThis);
