(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var KINDS = ['pick', 'order', 'sort', 'number'];
var MAX_HINTS = 3;
var MAX_HINT_LENGTH = 260;
var EPS = 1e-9;
function rng(seed) {
var a = (seed >>> 0) || 1;
return function () {
a = (a + 0x6D2B79F5) >>> 0;
var t = a;
t = Math.imul(t ^ (t >>> 15), t | 1);
t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
function shuffle(list, rand) {
var a = list.slice();
for (var i = a.length - 1; i > 0; i--) {
var j = Math.floor(rand() * (i + 1));
var t = a[i]; a[i] = a[j]; a[j] = t;
}
return a;
}
function sameOrder(a, b) {
if (a.length !== b.length) { return false; }
for (var i = 0; i < a.length; i++) { if (a[i] !== b[i]) { return false; } }
return true;
}
function parseNumber(text) {
if (typeof text === 'number') { return isFinite(text) ? text : NaN; }
if (typeof text !== 'string') { return NaN; }
var t = text.replace(/\s+/g, '').replace(/[−–‒]/g, '-').replace(',', '.').replace(/^\+/, '');
if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) { return NaN; }
return parseFloat(t);
}
function formatNumber(n) {
var v = Math.round(n * 1000) / 1000;
var text = String(Math.abs(v));
return v < 0 ? '−' + text : text;
}
function check(prompt, response) {
var r = response || {};
var marks = {};
var ok = false;
var i;
if (prompt.kind === 'pick') {
ok = typeof r.pick === 'string' && r.pick === prompt.answer;
if (typeof r.pick === 'string') { marks[r.pick] = ok; }
} else if (prompt.kind === 'order') {
var order = Array.isArray(r.order) ? r.order : [];
ok = order.length === prompt.answer.length;
for (i = 0; i < prompt.answer.length; i++) {
var right = order[i] === prompt.answer[i];
marks[prompt.answer[i]] = order.length === prompt.answer.length ? order.indexOf(prompt.answer[i]) === i : null;
if (!right) { ok = false; }
}
} else if (prompt.kind === 'sort') {
var sort = r.sort && typeof r.sort === 'object' ? r.sort : {};
ok = true;
Object.keys(prompt.answer).forEach(function (item) {
var put = sort[item];
if (typeof put !== 'string' || put === '') { marks[item] = null; ok = false; return; }
marks[item] = put === prompt.answer[item];
if (!marks[item]) { ok = false; }
});
} else if (prompt.kind === 'number') {
var values = r.values && typeof r.values === 'object' ? r.values : {};
ok = true;
prompt.fields.forEach(function (f) {
var n = parseNumber(values[f.key]);
if (isNaN(n)) { marks[f.key] = null; ok = false; return; }
marks[f.key] = Math.abs(n - f.answer) < EPS;
if (!marks[f.key]) { ok = false; }
});
}
return { ok: ok, marks: marks };
}
function reveal(prompt) {
if (prompt.kind === 'pick') { return { pick: prompt.answer }; }
if (prompt.kind === 'order') { return { order: prompt.answer.slice() }; }
if (prompt.kind === 'sort') {
var sort = {};
Object.keys(prompt.answer).forEach(function (k) { sort[k] = prompt.answer[k]; });
return { sort: sort };
}
var values = {};
prompt.fields.forEach(function (f) { values[f.key] = formatNumber(f.answer); });
return { values: values };
}
function plain(text) {
return String(text).toLowerCase().replace(/[′’']/g, '').replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function spellings(label, names) {
var out = [label];
var m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(label);
if (m) { out.push(m[1], m[2]); }
return out.concat(names || []).filter(function (s) { return s && plain(s).length >= 2; });
}
function leaks(text, names) {
var t = ' ' + plain(text) + ' ';
var found = [];
names.forEach(function (nm) {
var p = plain(nm);
if (p && t.indexOf(' ' + p + ' ') >= 0 && found.indexOf(nm) < 0) { found.push(nm); }
});
return found;
}
function validate(p) {
var problems = [];
var where = (p && p.id ? p.id : '?') + ': ';
function bad(msg) { problems.push(where + msg); }
if (!p || typeof p !== 'object') { return ['not a prompt']; }
if (typeof p.id !== 'string' || !/^[a-z0-9._:-]+$/.test(p.id)) { bad('the id is a lower-case word'); }
if (KINDS.indexOf(p.kind) < 0) { bad('unknown kind ' + p.kind); return problems; }
if (typeof p.text !== 'string' || p.text.length < 12) { bad('the question text is missing or too short'); }
if (typeof p.explain !== 'string' || p.explain.length < 12) { bad('there is no explanation'); }
if (!Array.isArray(p.hints) || p.hints.length < 1 || p.hints.length > MAX_HINTS) { bad('one to ' + MAX_HINTS + ' hints'); }
(p.hints || []).forEach(function (h, i) {
if (typeof h !== 'string' || h.length < 8 || h.length > MAX_HINT_LENGTH) { bad('hint ' + (i + 1) + ' is one short line'); }
if (/^(the )?(answer|total) is\b/i.test(String(h))) { bad('hint ' + (i + 1) + ' announces the answer'); }
});
var all = [p.text, p.explain].concat(p.hints || []);
all.forEach(function (t) { if (String(t).indexOf('\u2014') >= 0) { bad('an em-dash in: ' + t); } });
var ids = {};
function unique(list, what) {
list.forEach(function (x) {
if (!x || typeof x.id !== 'string' || !x.id) { bad(what + ' without an id'); return; }
if (ids[what + x.id]) { bad('duplicate ' + what + ' id ' + x.id); }
ids[what + x.id] = true;
if (typeof x.label !== 'string' || !x.label) { bad(what + ' ' + x.id + ' has no label'); }
});
}
if (p.figure !== null && p.figure !== undefined) {
if (typeof p.figure !== 'object' || typeof p.figure.mol !== 'string') { bad('a figure names a molecule'); }
}
function figureRow(list, what) {
if (list === undefined || list === null) { return; }
if (!Array.isArray(list) || list.length < 1 || list.length > 3) { bad(what + ' is a list of one to three drawings or names'); return; }
list.forEach(function (f, i) {
if (!f || typeof f !== 'object' || typeof f.label !== 'string' || !f.label) { bad(what + ' item ' + (i + 1) + ' has no label'); return; }
if (f.mol !== undefined && f.mol !== null && typeof f.mol !== 'string') { bad(what + ' item ' + (i + 1) + ' names no molecule'); }
if (String(f.label).indexOf('\u2014') >= 0) { bad('an em-dash in: ' + f.label); }
});
}
figureRow(p.figures, 'figures');
figureRow(p.figuresAfter, 'figuresAfter');
if (p.figure && p.figures) { bad('a prompt has a figure or a row of figures, not both'); }
if (p.kind === 'pick') {
if (!Array.isArray(p.options) || p.options.length < 2 || p.options.length > 8) { bad('two to eight options'); return problems; }
unique(p.options, 'option');
var labels = {};
p.options.forEach(function (o) {
var k = String(o.label).toLowerCase();
if (labels[k]) { bad('two options are both called ' + o.label); }
labels[k] = true;
if (p.optionStyle === 'figure' && typeof o.mol !== 'string') { bad('option ' + o.id + ' has no drawing'); }
});
var right = p.options.filter(function (o) { return o.id === p.answer; })[0];
if (!right) { bad('the answer is not one of the options'); return problems; }
var spelled = p.leakCheck === false ? [] : leaks(p.hints.join(' '), spellings(right.label, right.names));
if (spelled.length) { bad('a hint spells the answer: ' + spelled.join(', ')); }
} else if (p.kind === 'order') {
if (!Array.isArray(p.items) || p.items.length < 3 || p.items.length > 10) { bad('three to ten items'); return problems; }
unique(p.items, 'item');
if (!Array.isArray(p.answer) || p.answer.length !== p.items.length) { bad('the answer lists every item once'); return problems; }
var seen = {};
p.answer.forEach(function (id) {
if (seen[id] || !p.items.some(function (it) { return it.id === id; })) { bad('the answer holds ' + id + ' twice or not at all'); }
seen[id] = true;
});
} else if (p.kind === 'sort') {
if (!Array.isArray(p.items) || p.items.length < 2 || p.items.length > 12) { bad('two to twelve items'); return problems; }
if (!Array.isArray(p.buckets) || p.buckets.length < 2 || p.buckets.length > 6) { bad('two to six buckets'); return problems; }
unique(p.items, 'item');
unique(p.buckets, 'bucket');
if (!p.answer || typeof p.answer !== 'object') { bad('no answer'); return problems; }
p.items.forEach(function (it) {
if (!p.buckets.some(function (b) { return b.id === p.answer[it.id]; })) { bad('item ' + it.id + ' has no right bucket'); }
});
p.buckets.forEach(function (b) {
if (!p.items.some(function (it) { return p.answer[it.id] === b.id; })) { bad('bucket ' + b.id + ' stays empty'); }
});
} else {
if (!Array.isArray(p.fields) || !p.fields.length) { bad('a number prompt has fields'); return problems; }
p.fields.forEach(function (f) {
if (typeof f.key !== 'string' || !f.key || !isFinite(f.answer)) { bad('a field has a key and a finite answer'); return; }
if (f.min > f.answer || f.answer > f.max) { bad('the answer of ' + f.key + ' is outside its range'); }
var digits = formatNumber(f.answer).replace('.', '\\.');
var rx = new RegExp('(^|[^\\d.])' + digits + '([^\\d]|$)');
if (p.hints.some(function (h) { return rx.test(h); })) { bad('a hint gives ' + f.key + ' = ' + f.answer + ' away'); }
});
}
return problems;
}
function validateGame(g) {
var problems = [];
var where = (g && g.id ? g.id : '?') + ': ';
if (!g || typeof g !== 'object') { return ['not a game']; }
if (typeof g.id !== 'string' || !/^[a-z0-9-]+$/.test(g.id)) { problems.push(where + 'the id is a lower-case word'); }
['title', 'subtitle', 'group'].forEach(function (k) { if (typeof g[k] !== 'string' || !g[k]) { problems.push(where + 'no ' + k); } });
if (typeof g.build !== 'function') { problems.push(where + 'no build function'); }
if (g.count !== undefined && !(g.count >= 1 && g.count <= 40)) { problems.push(where + 'count is 1 to 40'); }
if (g.summary !== undefined && (typeof g.summary !== 'string' || g.summary.length < 12 || g.summary.indexOf('\u2014') >= 0)) { problems.push(where + 'the summary is one plain line'); }
return problems;
}
function arrange(p, rand) {
var q = {};
Object.keys(p).forEach(function (k) { q[k] = p[k]; });
q.hints = p.hints.slice();
if (p.kind === 'pick') {
q.options = shuffle(p.options, rand);
} else if (p.kind === 'order') {
var items = shuffle(p.items, rand);
var guard = 0;
while (sameOrder(items.map(function (it) { return it.id; }), p.answer) && guard < 20) { items = shuffle(p.items, rand); guard += 1; }
q.items = items;
} else if (p.kind === 'sort') {
q.items = shuffle(p.items, rand);
}
return q;
}
function games() { return Array.isArray(MG.games) ? MG.games : []; }
function game(id) {
var list = games();
for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
return null;
}
function start(g, seed) {
var rand = rng(seed === undefined ? 1 : seed);
var built = g.build({ seed: seed === undefined ? 1 : seed });
var prompts = built.prompts.slice();
if (!g.fixedOrder) { prompts = shuffle(prompts, rand); }
if (g.count && prompts.length > g.count) { prompts = prompts.slice(0, g.count); }
return {
id: g.id, title: g.title, intro: built.intro || g.intro || '', summary: built.summary || g.summary || '',
prompts: prompts.map(function (p) { return arrange(p, rand); })
};
}
function scoreRun(results) {
if (!results || !results.length) { return 0; }
var clean = 0;
results.forEach(function (r) { if (r === 'clean') { clean += 1; } });
return Math.round((100 * clean) / results.length);
}
MG.gameEngine = {
KINDS: KINDS, MAX_HINTS: MAX_HINTS, games: games, game: game, start: start, check: check, reveal: reveal, validate: validate,
validateGame: validateGame, leaks: leaks, spellings: spellings, scoreRun: scoreRun, parseNumber: parseNumber, formatNumber: formatNumber,
rng: rng, shuffle: shuffle
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var GROUP = 'So sánh hai';
var SUB2 = '₂';
var CO2 = 'CO' + SUB2;
var FADH2 = 'FADH' + SUB2;
var NADPLUS = 'NAD⁺';
var PI = 'Pᵢ';
function register(game) {
var list = MG.games = MG.games || [];
var at = list.length;
for (var i = 0; i < list.length; i++) { if (list[i].pack) { at = i; break; } }
list.splice(at, 0, game);
}
function fail(msg) { throw new Error('games/compare.js: ' + msg); }
function pathway(id) {
var p = MG.pathways && MG.pathways[id];
if (!p) { fail('no pathway ' + id); }
return p;
}
function reaction(pathwayId, rid) {
var rs = pathway(pathwayId).reactions;
for (var i = 0; i < rs.length; i++) { if (rs[i].id === rid) { return rs[i]; } }
return fail('no step ' + rid + ' in ' + pathwayId);
}
function has(list, id) { return Array.isArray(list) && list.indexOf(id) >= 0; }
function uses(r, cof) { return has(r.ins, cof); }
function makes(r, cof) { return has(r.outs, cof); }
function molOf(pathwayId, nodeId) { return pathway(pathwayId).nodes[nodeId].mol; }
function mols(pathwayId, nodeIds) { return nodeIds.map(function (n) { return molOf(pathwayId, n); }); }
function products(pathwayId, r) { return mols(pathwayId, r.products); }
function substrates(pathwayId, r) { return mols(pathwayId, r.substrates); }
function enzymes(pathwayId) { return pathway(pathwayId).reactions.map(function (r) { return r.enzyme; }); }
function anyStep(pathwayId, test) { return pathway(pathwayId).reactions.some(test); }
function allMols(pathwayId) {
var nodes = pathway(pathwayId).nodes;
return Object.keys(nodes).map(function (n) { return nodes[n].mol; });
}
function note(kind, id) {
var e = MG.entities && MG.entities[kind] && MG.entities[kind][id];
return e && e.note ? e.note : '';
}
function which(a, b) { return a && b ? 'both' : (a ? 'a' : (b ? 'b' : 'neither')); }
function expect(where, got, want) {
if (got !== want) { fail(where + ' derives "' + got + '" from the pathway data, but the prompt says "' + want + '"'); }
return got;
}
function comparison(spec) {
var header = [{ label: spec.a.label, mol: spec.a.mol }, { label: spec.b.label, mol: spec.b.mol }];
var T = {
ab: function (id, text, answer, hints, explain) {
return {
id: id, kind: 'pick', text: text, optionStyle: 'text',
options: [{ id: 'a', label: spec.a.short }, { id: 'b', label: spec.b.short }, { id: 'both', label: 'Cả hai' }, { id: 'neither', label: 'Không' }],
answer: answer, hints: hints, explain: explain
};
},
pick: function (id, text, options, answer, hints, explain) {
return {
id: id, kind: 'pick', text: text, optionStyle: 'text',
options: options.map(function (o) { return { id: o[0], label: o[1] }; }), answer: answer, hints: hints, explain: explain
};
},
figurePick: function (id, text, options, answer, hints, explain) {
return {
id: id, kind: 'pick', text: text, optionStyle: 'figure', leakCheck: false, figures: null,
options: options.map(function (o) { return { id: o[0], label: o[1], mol: o[2] }; }), answer: answer, hints: hints, explain: explain
};
},
sort: function (id, text, items, buckets, hints, explain) {
var answer = {};
items.forEach(function (it) { answer[it[0]] = it[2]; });
return {
id: id, kind: 'sort', text: text,
items: items.map(function (it) { return { id: it[0], label: it[1] }; }),
buckets: buckets.map(function (b) { return { id: b[0], label: b[1] }; }),
answer: answer, hints: hints, explain: explain
};
},
number: function (id, text, fields, hints, explain) {
return {
id: id, kind: 'number', text: text,
fields: fields.map(function (f) { return { key: f[0], label: f[1], answer: f[2], step: 1, min: 0, max: f[3] || 200 }; }),
hints: hints, explain: explain
};
},
abBuckets: function () { return [['a', spec.a.short], ['b', spec.b.short], ['both', 'Cả hai']]; },
twoBuckets: function () { return [['a', spec.a.short], ['b', spec.b.short]]; }
};
function build() {
var prompts = spec.prompts(T);
prompts.forEach(function (p) {
p.group = p.group || spec.a.short + ' hoặc ' + spec.b.short;
if (p.figures === undefined) { p.figures = header; }
if (p.figures === null) { delete p.figures; }
if (p.figure === undefined) { p.figure = null; }
});
return { intro: spec.subtitle, summary: spec.summary, prompts: prompts };
}
var game = { id: spec.id, title: spec.title, subtitle: spec.subtitle, group: GROUP, fixedOrder: true, summary: spec.summary, build: build };
var counted = 0;
Object.defineProperty(game, 'count', { enumerable: true, get: function () { if (!counted) { counted = spec.count || build().prompts.length; } return counted; } });
return game;
}
register(comparison({
id: 'cmp-hk-gk', title: 'Hexokinase hay glucokinase', subtitle: 'Một phản ứng, hai isoenzyme: ái lực, sự ức chế bởi sản phẩm và vị trí hoạt động của mỗi enzyme',
a: { short: 'Hexokinase', label: 'Hexokinase (I đến III)' }, b: { short: 'Glucokinase', label: 'Glucokinase (hexokinase IV)' },
summary: 'Phản ứng tương tự diễn ra trong hai trường hợp: hexokinase bắt giữ glucose với tốc độ tối đa và dừng lại khi glucose 6-phosphate tích tụ; glucokinase, trong gan và tế bào beta, theo dõi lượng glucose trong máu và không bị ức chế.',
prompts: function (T) {
var hk = reaction('glycolysis', 'hk');
expect('cmp-hk-gk uses ATP', which(uses(hk, 'atp'), uses(hk, 'atp')), 'both');
expect('cmp-hk-gk makes G6P', has(products('glycolysis', hk), 'g6p'), true);
return [
T.ab('hk.atp', 'Trong hai chất này, chất nào phosphoryl hóa glucose ở vị trí carbon 6 bằng ATP?', 'both', [
'Enzyme kinase di chuyển một nhóm phosphate từ ATP; tên gọi của chúng đã nói lên chức năng của chúng.',
'Chúng là hai đồng phân enzym của cùng một bước, bước đầu tiên của quá trình đường phân.'
], 'Chúng xúc tác cho cùng một bước đầu tiên của quá trình đường phân: ' + hk.equation + 'Glucokinase là hexokinase IV, một isozyme của gan và tế bào beta tuyến tụy.'),
T.ab('hk.km', 'Loại nào có ái lực với glucose cao hơn (giá trị Km thấp hơn), để nó hoạt động hết công suất ngay cả khi lượng đường trong máu thấp?', 'a', [
'Đây là isoenzyme của các mô phải hấp thụ glucose bất kể nồng độ glucose trong máu là bao nhiêu, chẳng hạn như cơ và não.',
'Giá trị Km của nó gần 0,1 mM, thấp hơn nhiều so với glucose trong máu (khoảng 5 mM).'
], 'Hexokinase có Km gần 0,1 mM và đạt trạng thái bão hòa ở mức đường huyết bình thường. Glucokinase có Km gần 10 mM, do đó tốc độ phản ứng của nó tiếp tục tăng khi đường huyết tăng sau bữa ăn.'),
T.ab('hk.g6p', 'Enzyme nào bị ức chế bởi chính sản phẩm của nó, glucose 6-phosphate?', 'a', [
'Phương pháp ức chế sản phẩm phù hợp với mô chỉ cần lượng glucose 6-phosphate vừa đủ để sử dụng tại một thời điểm.',
'Enzyme đồng phân của gan thoát khỏi quá trình này, nhờ đó gan có thể tiếp tục hấp thụ glucose sau bữa ăn.'
], 'Hexokinase ở cơ và não bị ức chế bởi glucose 6-phosphate, do đó glucose chỉ được giữ lại nhanh bằng tốc độ sử dụng của quá trình đường phân. Glucokinase thì không bị ảnh hưởng, vì vậy gan có thể dự trữ glucose dưới dạng glycogen khi lượng đường trong máu cao.'),
T.ab('hk.where', 'Chất nào được tìm thấy trong gan và trong các tế bào beta của tuyến tụy?', 'b', [
'Đây là các mô có chức năng cảm nhận lượng glucose trong máu.',
'Chỉ số Km cao cho phép tốc độ của nó theo sát lượng đường trong máu trên toàn bộ phạm vi sau bữa ăn.'
], 'Glucokinase (hexokinase IV) hoạt động trong gan và trong tế bào beta tuyến tụy. Trong tế bào beta, tốc độ của nó quyết định sự giải phóng insulin; trong gan, nó cho phép glucose được dự trữ sau bữa ăn, và một protein điều hòa giữ glucose trong nhân tế bào khi nồng độ glucose thấp.'),
T.sort('hk.sort', 'Mỗi phát biểu phù hợp với isozyme nào?', [
['km01', 'Km gần 0,1 mM', 'a'], ['km10', 'Km gần 10 mM', 'b'], ['inh', 'Bị ức chế bởi glucose 6-phosphate', 'a'], ['muscle', 'Cơ bắp và não bộ', 'a'],
['liver', 'Tế bào beta gan và tuyến tụy', 'b'], ['rate', 'Nhịp tim tăng lên khi lượng đường trong máu tăng sau bữa ăn.', 'b'], ['atp', 'Sử dụng ATP để phosphoryl hóa glucose', 'both']
], T.abBuckets(), [
'Giá trị Km thấp có nghĩa là ái lực cao; giá trị Km cao có nghĩa là enzyme chưa bão hòa ở nồng độ glucose trong máu.',
'Một cái là bẫy glucose cho mô đang thiếu glucose, cái còn lại là cảm biến glucose.'
], 'Hexokinase: Giá trị Km gần 0,1 mM, bị ức chế bởi glucose 6-phosphate, có trong cơ và não. Glucokinase: Giá trị Km gần 10 mM, không bị ức chế, có trong gan và tế bào beta, do đó tốc độ của nó phụ thuộc vào nồng độ glucose trong máu. Cả hai đều tiêu thụ ATP.')
];
}
}));
register(comparison({
id: 'cmp-pfk-fbpase', title: 'PFK-1 hay FBPase-1', subtitle: 'So sánh kinase của đường phân với phosphatase của tân tạo glucose và các tín hiệu điều hòa quyết định hoạt động của chúng',
a: { short: 'PFK-1', label: 'Phosphofructokinase-1 (PFK-1)' }, b: { short: 'FBPase-1', label: 'Fructose 1,6-bisphosphatase (FBPase-1)' },
summary: 'PFK-1 (ATP, quá trình đường phân) và FBPase-1 (nước, quá trình tân tạo đường) trung hòa lẫn nhau, do đó AMP và fructose 2,6-bisphosphate làm tăng hoạt động của enzyme này và ức chế enzyme kia.',
prompts: function (T) {
var pfk = reaction('glycolysis', 'pfk1');
var fbp = reaction('gluconeogenesis', 'fbpase');
return [
T.ab('pf.atp', 'Trong hai cái đó, cái nào tiêu tốn ATP?', expect('cmp-pfk-fbpase ATP', which(uses(pfk, 'atp'), uses(fbp, 'atp')), 'a'), [
'Enzyme kinase tiêu thụ chất này; còn enzyme phosphatase sử dụng nước thay thế.',
'Đây là bước quan trọng quyết định quá trình đường phân.'
], 'PFK-1: ' + pfk.equation + 'FBPase-1 cũng loại bỏ nhóm phosphate tương tự bằng phương pháp thủy phân: ' + fbp.equation + '.'),
T.ab('pf.pi', 'Chất nào giải phóng phốt phát vô cơ?', expect('cmp-pfk-fbpase Pi', which(makes(pfk, 'pi'), makes(fbp, 'pi')), 'b'), [
'Thủy phân bằng nước giải phóng phosphat; một loại kinase sẽ chuyển nó cho ADP.',
'Đây là enzyme tham gia vào quá trình tân tạo glucose.'
], 'FBPase-1 thủy phân nhóm phosphate trên carbon 1 và giải phóng nó dưới dạng... ' + PI + 'PFK-1 gắn nhóm phosphate đó với ATP, vì vậy nó tạo ra ADP, chứ không phải... ' + PI + '.'),
T.ab('pf.irrev', 'Quá trình nào là không thể đảo ngược trong tế bào?', expect('cmp-pfk-fbpase irreversible', which(!!pfk.irreversible, !!fbp.irreversible), 'both'), [
'Mỗi bước đều là một phần được xác định rõ ràng và có quy luật trong lộ trình riêng của nó.',
'Một loại kinase tiêu thụ ATP và quá trình thủy phân diễn ra ở trạng thái cách xa trạng thái cân bằng.'
], 'Cả hai quá trình đều diễn ra cách xa trạng thái cân bằng, đó là lý do tại sao tế bào cần hai enzyme, mỗi enzyme được điều chỉnh riêng biệt: PFK-1 cho quá trình đường phân và FBPase-1 cho quá trình tân tạo đường.'),
T.ab('pf.f26bp', 'Fructose 2,6-bisphosphate là tín hiệu của một lá gan khỏe mạnh. Nó kích hoạt loại enzyme nào?', 'a', [
'Nó được tạo ra khi nồng độ insulin cao và lượng glucose dồi dào, do đó quá trình đường phân sẽ diễn ra.',
'Nó là chất kích hoạt mạnh nhất của enzyme đường phân và ức chế enzyme còn lại.'
], 'Fructose 2,6-bisphosphate kích hoạt PFK-1 và ức chế FBPase-1. Insulin làm tăng nồng độ FBPase-1, còn glucagon làm giảm nồng độ này, do đó gan khi no sẽ thực hiện quá trình đường phân, còn gan khi đói sẽ thực hiện quá trình tân tạo đường.'),
T.sort('pf.signals', 'Mỗi tín hiệu có làm tăng hay giảm PFK-1 không?', [
['amp', 'AMP', 'up'], ['f26', 'Fructose 2,6-bisphosphate', 'up'], ['atp', 'ATP (ở mức cao)', 'down'], ['cit', 'Citrate', 'down']
], [['up', 'Tăng PFK-1 lên'], ['down', 'Giảm PFK-1 xuống']], [
'Tín hiệu năng lượng thấp thúc đẩy quá trình đường phân; tín hiệu năng lượng dồi dào làm chậm quá trình này.',
'Citrate cho biết chu trình TCA đã có đủ nhiên liệu.'
], 'AMP và fructose 2,6-bisphosphate kích hoạt PFK-1; ATP và citrate ức chế nó. AMP và fructose 2,6-bisphosphate ức chế FBPase-1, vì vậy hai enzyme này không bao giờ hoạt động hết công suất cùng lúc.'),
T.pick('pf.futile', 'Nếu cả hai enzyme cùng hoạt động hết công suất đồng thời, kết quả cuối cùng sẽ như thế nào?', [
['futile', 'ATP sẽ bị thủy phân thành ADP và ' + PI + ' mà không có sự thay đổi ròng nào về lượng đường (một vòng luẩn quẩn vô ích)'],
['twice', 'Lượng fructose 1,6-bisphosphate được tạo ra sẽ gấp đôi.'],
['glucose', 'Glucose sẽ được tạo ra từ ' + CO2]
], 'futile', [
'Cộng hai phương trình lại với nhau và xem phần dư là bao nhiêu.',
'Lượng đường trở lại không thay đổi.'
], 'PFK-1 cộng với FBPase-1 tạo thành ATP + H' + SUB2 + 'O → ADP + ' + PI + 'Chỉ có nhiệt. Cơ chế điều chỉnh tương hỗ ngăn không cho hai quá trình này diễn ra đồng thời.')
];
}
}));
register(comparison({
id: 'cmp-gly-gng', title: 'Đường phân hay tân tạo glucose', subtitle: 'Nơi mỗi quá trình diễn ra, chi phí của từng quá trình, các enzyme dùng chung và ba bước bypass',
a: { short: 'Đường phân', label: 'Đường phân' }, b: { short: 'Quá trình tân tạo glucose', label: 'Quá trình tân tạo glucose' },
summary: 'Quá trình đường phân tạo ra hai ATP trong mỗi tế bào; quá trình tân tạo đường tiêu tốn sáu ATP ở gan và bỏ qua ba bước không thể đảo ngược nhờ các enzyme của chính nó.',
prompts: function (T) {
var G = pathway('glycolysis'), N = pathway('gluconeogenesis');
var TWICE_G = ['gapdh', 'pgk', 'pgm', 'enolase', 'pk'];
var TWICE_N = ['pc', 'pepck', 'enolr', 'pgmr', 'pgkr', 'gapdhr'];
function count(p, twice, cof, io) {
var n = 0;
p.reactions.forEach(function (r) { if (has(r[io], cof)) { n += has(twice, r.id) ? 2 : 1; } });
return n;
}
var glyNet = count(G, TWICE_G, 'atp', 'outs') - count(G, TWICE_G, 'atp', 'ins');
var gngCost = count(N, TWICE_N, 'atp', 'ins') + count(N, TWICE_N, 'gtp', 'ins');
expect('cmp-gly-gng ATP of glycolysis', glyNet, 2);
expect('cmp-gly-gng cost of gluconeogenesis', gngCost, 6);
expect('cmp-gly-gng irreversible steps of glycolysis', G.reactions.filter(function (r) { return r.irreversible; }).length, 3);
var eG = enzymes('glycolysis'), eN = enzymes('gluconeogenesis');
function side(id) { return which(has(eG, id), has(eN, id)); }
var items = [
['hexokinase', 'Hexokinase', 'a'], ['pfk1', 'PFK-1', 'a'], ['pk', 'Pyruvate kinase', 'a'], ['pc', 'Pyruvate carboxylase', 'b'], ['pepck', 'PEP carboxykinase', 'b'],
['fbpase', 'FBPase-1', 'b'], ['g6pase', 'Glucose 6-phosphatase', 'b'], ['aldolase', 'Aldolase', 'both'], ['gapdh', 'GAPDH', 'both'], ['enolase', 'Enolase', 'both']
].map(function (it) { return [it[0], it[1], expect('cmp-gly-gng ' + it[0], side(it[0]), it[2])]; });
return [
T.ab('gg.liver', 'Quá trình nào trong hai quá trình đó chủ yếu diễn ra ở gan (và thận)?', 'b', [
'Một con đường vận chuyển glucose diễn ra trong mọi tế bào; con đường còn lại cung cấp glucose vào máu trong thời gian nhịn ăn.',
'Enzyme cuối cùng của nó, glucose 6-phosphatase, được tìm thấy trong các cơ quan này.'
], 'Quá trình tân tạo glucose diễn ra ở gan và, ở mức độ ít hơn, ở thận: chúng có glucose 6-phosphatase và xuất glucose vào máu. Quá trình đường phân diễn ra ở mọi tế bào.'),
T.ab('gg.mito', 'Con đường nào có một bước diễn ra bên trong ty thể?', 'b', [
'Hãy nghĩ về quá trình chuyển hóa pyruvate thành axit bốn cacbon.',
'Enzyme cần biotin hoạt động trong chất nền.'
], 'Pyruvate carboxylase hoạt động trong chất nền ty thể; sản phẩm oxaloacetate của nó được tách ra (dưới dạng malate hoặc PEP) và phần còn lại của quá trình tân tạo glucose diễn ra trong bào tương. Quá trình đường phân diễn ra hoàn toàn trong bào tương.'),
T.ab('gg.glucagon', 'Glucagon kích hoạt con đường nào trong gan?', 'b', [
'Glucagon là hormone báo hiệu trạng thái nhịn ăn.',
'Nó làm giảm lượng fructose 2,6-bisphosphate và do đó làm chậm quá trình PFK-1.'
], 'Glucagon, thông qua cAMP và protein kinase A, làm giảm fructose 2,6-bisphosphate (làm chậm PFK-1 và giải phóng FBPase-1) và làm bất hoạt pyruvate kinase, do đó gan sản xuất glucose thay vì đốt cháy nó.'),
T.pick('gg.why', 'Tại sao quá trình tân tạo glucose không thể đơn giản là đảo ngược quá trình đường phân?', [
['bypass', 'Ba bước của quá trình đường phân là không thể đảo ngược, vì vậy các enzyme khác sẽ bỏ qua chúng.'],
['destroyed', 'Các enzyme đường phân bị phân hủy giữa các bữa ăn.'],
['cytosol', 'Pyruvate không thể tồn tại trong tế bào chất.']
], 'bypass', [
'Đếm số mũi tên một chiều trong quá trình đường phân.',
'Mỗi chất trong số đó được thay thế bằng một loại enzyme có tên khác.'
], 'Hexokinase, PFK-1 và pyruvate kinase là các enzyme không thể đảo ngược. Quá trình tân tạo glucose bỏ qua chúng nhờ glucose 6-phosphatase, FBPase-1, và pyruvate carboxylase nhờ PEP carboxykinase; bảy bước còn lại là các enzyme của quá trình đường phân diễn ra theo chiều ngược lại.'),
T.sort('gg.enzymes', 'Mỗi loại enzyme sử dụng con đường chuyển hóa nào?', items, T.abBuckets(), [
'Bảy loại enzyme hoạt động theo cả hai chiều; các loại enzyme còn lại chỉ thuộc về một con đường chuyển hóa duy nhất.',
'Mỗi bước một chiều của quá trình đường phân đều có một enzyme bù trừ trong con đường còn lại.'
], 'Các enzyme chung: aldolase, GAPDH và enolase (cùng với TPI, PGK, PGM và PGI). Chỉ tham gia quá trình đường phân: hexokinase, PFK-1 và pyruvate kinase. Chỉ tham gia quá trình tân tạo glucose: pyruvate carboxylase, PEP carboxykinase, FBPase-1 và glucose 6-phosphatase.'),
T.number('gg.atp', 'Tính trên mỗi phân tử glucose, quá trình đường phân tạo ra bao nhiêu ATP ròng, và quá trình tân tạo glucose tiêu tốn bao nhiêu ATP tương đương (ATP và GTP cộng lại) để tạo ra một phân tử glucose từ hai phân tử pyruvate?', [
['gly', 'ATP được tạo ra bởi quá trình đường phân', glyNet, 20], ['gng', 'Lượng ATP tương đương được tiêu hao bởi quá trình tân tạo glucose', gngCost, 20]
], [
'Trong quá trình đường phân, hãy đếm số lượng kinase; các bước tạo thành sản phẩm diễn ra một lần cho mỗi nửa chu trình ba carbon.',
'Quá trình tân tạo glucose diễn ra tại pyruvate carboxylase, PEP carboxykinase và phosphoglycerate kinase, mỗi enzyme diễn ra hai lần.'
], 'Quá trình đường phân tiêu tốn ATP tại hexokinase và PFK-1, đồng thời tạo ra hai ATP tại phosphoglycerate kinase và hai ATP tại pyruvate kinase: tổng cộng là hai. Quá trình tân tạo glucose tiêu tốn hai ATP tại pyruvate carboxylase, hai GTP tại PEP carboxykinase và hai ATP tại phosphoglycerate kinase: tổng cộng là sáu.')
];
}
}));
register(comparison({
id: 'cmp-lactate-ethanol', title: 'Lên men lactic hay lên men rượu', subtitle: 'Hai cách tái tạo NAD⁺ khi thiếu oxygen: sinh vật nào sử dụng con đường nào và sản phẩm được giải phóng',
a: { short: 'Đường lactate', label: 'Lactate', mol: 'lactate' }, b: { short: 'Tuyến đường ethanol', label: 'Ethanol', mol: 'ethanol' },
summary: 'Cả hai quá trình lên men đều khử pyruvate bằng NADH để thu hồi NAD⁺ cho quá trình đường phân; cơ bắp tạo ra lactate trong một bước, nấm men mất CO₂ trước rồi mới tạo ra ethanol.',
prompts: function (T) {
var ldh = reaction('lactate', 'ldh');
var pdec = reaction('ethanol', 'pdecarb');
var adh = reaction('ethanol', 'adh');
var extraLac = pathway('lactate').order.length - pathway('glycolysis').order.length;
var extraEth = pathway('ethanol').order.length - pathway('glycolysis').order.length;
expect('cmp-lactate-ethanol steps after pyruvate', extraLac + ',' + extraEth, '1,2');
var lacMols = allMols('lactate'), ethMols = allMols('ethanol');
function where(mol) { return which(has(lacMols, mol), has(ethMols, mol)); }
return [
T.ab('le.co2', 'Bản phát hành nào trong hai bản đó ' + CO2 + '?', expect('cmp-lactate-ethanol CO2', which(makes(ldh, 'co2'), makes(pdec, 'co2') || makes(adh, 'co2')), 'b'), [
'Đếm số nguyên tử cacbon: một sản phẩm cuối có ba, sản phẩm kia có hai.',
'Khí đó là thứ làm cho bánh mì nở.'
], 'Pyruvate decarboxylase: ' + pdec.equation + 'Lactate giữ nguyên cả ba nguyên tử carbon của pyruvate.'),
T.ab('le.nad', 'Cái nào tái sinh? ' + NADPLUS + 'Để glyceraldehyde 3-phosphate dehydrogenase có thể tiếp tục hoạt động mà không cần oxy?', expect('cmp-lactate-ethanol NAD', which(makes(ldh, 'nad'), makes(adh, 'nad')), 'both'), [
'Nếu không có oxy, chuỗi vận chuyển electron không thể tái chế chất mang, vì vậy cần phải có bước khử.',
'Đó chính là mục đích cốt lõi của quá trình lên men.'
], 'Mỗi chu trình đều kết thúc bằng phản ứng khử bởi NADH, tạo ra ' + NADPLUS + ' back: ' + ldh.equation + ', Và ' + adh.equation + '.'),
T.ab('le.muscle', 'Điều gì xảy ra ở cơ bắp hoạt động mạnh mẽ của con người và ở các tế bào hồng cầu?', 'a', [
'Con người không có enzyme pyruvate decarboxylase.',
'Sản phẩm này di chuyển trong máu đến gan, nơi gan chuyển hóa nó trở lại thành glucose.'
], 'Lactate dehydrogenase khử pyruvate thành lactate trong cơ và hồng cầu; gan hấp thụ lactate và tổng hợp glucose từ đó (chu trình Cori).'),
T.ab('le.yeast', 'Men sử dụng thành phần nào để làm cho bánh mì nở và nước nho chuyển hóa thành rượu?', 'b', [
'Nó cần một loại enzyme mà động vật không có.',
'Quá trình này tạo ra hai sản phẩm: một loại khí và một loại cồn.'
], 'Nấm men và một số vi khuẩn khử carboxyl pyruvate và khử acetaldehyde thành ethanol; ' + CO2 + ' Giúp bột nở và cồn vẫn còn trong rượu.'),
T.number('le.steps', 'Sau pyruvate, mỗi chu trình cần bao nhiêu bước enzyme?', [
['lac', 'Đường lactate', extraLac, 10], ['eth', 'Tuyến đường ethanol', extraEth, 10]
], [
'Đếm số lượng enzyme sau pyruvate kinase.',
'Một trong hai con đường phải mất đi một nguyên tử carbon trước khi quá trình khử có thể diễn ra.'
], 'Chỉ riêng lactate dehydrogenase tạo ra lactate. Ethanol cần pyruvate decarboxylase và sau đó là alcohol dehydrogenase.'),
T.sort('le.sort', 'Mỗi chiếc xe thuộc tuyến đường nào?', [
['acet', 'Acetaldehyde', expect('cmp-lactate-ethanol acetaldehyde', where('acetaldehyde'), 'b')], ['co2', CO2 + ' released', 'b'],
['lac', 'Lactate', expect('cmp-lactate-ethanol lactate', where('lactate'), 'a')], ['nadh', 'NADH đã được sử dụng hết', 'both'],
['pyr', 'Pyruvat', expect('cmp-lactate-ethanol pyruvate', where('pyruvate'), 'both')], ['adh', 'Dehydrogenase rượu', 'b'],
['ldh', 'Lactate dehydrogenase', 'a'], ['atp', 'Hai phân tử ATP ròng trên mỗi phân tử glucose', 'both']
], T.abBuckets(), [
'Cả hai con đường đều bắt đầu từ cùng một phân tử và sử dụng cùng một chất mang.',
'Chỉ có một lộ trình có chứa anđehit trên đường đi.'
], 'Con đường chuyển hóa lactate: lactate dehydrogenase và lactate. Con đường chuyển hóa ethanol: pyruvate decarboxylase, acetaldehyde. ' + CO2 + 'Các thành phần chung bao gồm: dehydrogenase rượu và ethanol. Các thành phần khác gồm: pyruvate, NADH được sử dụng hết và hai ATP của quá trình đường phân.')
];
}
}));
register(comparison({
id: 'cmp-nadh-fadh2', title: 'NADH hay FADH' + SUB2, subtitle: 'Nơi mỗi chất mang đi vào chuỗi hô hấp, giá trị ATP của từng loại, và dehydrogenase nào tạo ra chất nào',
a: { short: 'NADH', label: 'NADH', mol: 'etcnadh' }, b: { short: FADH2, label: FADH2, mol: 'etcfadh2' },
summary: 'NADH đi vào phức hợp I và có giá trị khoảng 2,5 ATP; FADH₂ đi vào phức hợp II, bỏ qua một bơm proton, và có giá trị khoảng 1,5 ATP.',
prompts: function (T) {
var c1 = reaction('etc', 'c1'), c2 = reaction('etc', 'c2');
expect('cmp-nadh-fadh2 Complex I', substrates('etc', c1)[0] + ',' + substrates('etc', c2)[0], 'etcnadh,etcfadh2');
var makers = [
['idh', 'Isocitrate dehydrogenase', reaction('tca', 'idh')], ['kgdh', 'α-Ketoglutarate dehydrogenase', reaction('tca', 'kgdh')],
['mdh', 'Malate dehydrogenase', reaction('tca', 'mdh')], ['sdh', 'Succinate dehydrogenase', reaction('tca', 'sdh')],
['acadh', 'Acyl-CoA dehydrogenase', reaction('betaox', 'acadh')], ['hadh', 'L-Hydroxyacyl-CoA dehydrogenase', reaction('betaox', 'hadh')],
['gapdh', 'GAPDH', reaction('glycolysis', 'gapdh')], ['pdc', 'phức hợp pyruvate dehydrogenase', reaction('pdhtca', 'pdc')]
].map(function (m) {
var w = which(makes(m[2], 'nadh'), makes(m[2], 'fadh2'));
if (w === 'both' || w === 'neither') { fail('cmp-nadh-fadh2: ' + m[0] + ' makes ' + w); }
return [m[0], m[1], w];
});
var tca = which(anyStep('tca', function (r) { return makes(r, 'nadh'); }), anyStep('tca', function (r) { return makes(r, 'fadh2'); }));
return [
T.ab('nf.c1', 'Chất mang nào chuyển electron của nó cho phức chất I?', 'a', [
'Nó là chất mang được tạo ra bởi các dehydrogenase trong chất nền, có chức năng oxy hóa rượu và aldehyd.',
'Chất vận chuyển còn lại tham gia vào chuỗi tại Tổ hợp II.'
], 'Tổ hợp I: ' + c1.equation + '. ' + FADH2 + ' Thay vào đó, nó truyền các electron của mình cho phức hợp II (succinate dehydrogenase).'),
T.ab('nf.yield', 'Chất vận chuyển nào có giá trị khoảng 1,5 ATP thay vì 2,5?', 'b', [
'Các electron của nó đi vào bên dưới phức hợp đầu tiên, do đó một vị trí bơm proton bị bỏ qua.',
'Nó là chất vận chuyển của succinate dehydrogenase.'
], note('molecule', 'etcfadh2')),
T.sort('nf.makers', 'Mỗi loại dehydrogenase khử chất vận chuyển nào?', makers, [['a', 'Tạo ra NADH'], ['b', 'Makes ' + FADH2]], [
'Enzyme FAD lấy hai nguyên tử hydro từ liên kết cacbon-cacbon bão hòa để tạo thành liên kết đôi.',
'Rượu, anđehit và các phản ứng khử cacbon oxy hóa sử dụng chất mang khác.'
], 'FAD: succinate dehydrogenase và acyl-CoA dehydrogenase, cả hai đều tạo ra liên kết đôi trans. ' + NADPLUS + ': isocitrate, α-ketoglutarate, malate và L-hydroxyacyl-CoA dehydrogenase, GAPDH và phức hợp pyruvate dehydrogenase.'),
T.ab('nf.tca', 'Chất vận chuyển nào được tạo ra trong chu trình TCA?', expect('cmp-nadh-fadh2 TCA', tca, 'both'), [
'Chu trình này có bốn bước oxy hóa, và không phải tất cả các bước đều sử dụng cùng một chất mang.',
'Một trong số chúng tạo thành liên kết đôi dạng trans.'
], 'Ba NADH mỗi lượt (isocitrate, α-ketoglutarate và malate dehydrogenase) và một ' + FADH2 + ' (succinate dehydrogenase).'),
T.number('nf.atp', 'Mỗi chất mang tạo ra khoảng bao nhiêu ATP khi các electron của nó di chuyển hết quãng đường đến O?' + SUB2 + '?', [
['nadh', 'ATP trên mỗi NADH', 2.5, 5], ['fadh2', 'ATP mỗi ' + FADH2, 1.5, 5]
], [
'Đếm số phức chất bơm proton mà mỗi chất mang đi qua: ba cho một chất mang, hai cho chất mang còn lại.',
'Khoảng bốn proton có thể đổi lấy một ATP, vì vậy sản lượng không phải là số nguyên.'
], 'Khoảng 10 proton được bơm cho mỗi NADH (Phức hợp I, III và IV) và 6 proton cho mỗi ' + FADH2 + ' (III và IV); với khoảng 4 proton trên mỗi ATP, tức là 2,5 và 1,5.'),
T.ab('nf.two', 'Loại hạt tải điện nào mang hai electron cùng một lúc?', 'both', [
'Đếm số nguyên tử hydro mà dạng khử đã hấp thụ.',
'Chỉ có các trung tâm sắt và đồng trong chuỗi mới di chuyển các electron đơn lẻ.'
], 'NADH mang một nguyên tử hydride (hai electron và một proton); ' + FADH2 + ' Chuỗi này mang hai nguyên tử hydro. Sau đó, các electron được truyền từng cái một qua các trung tâm sắt-lưu huỳnh và cytochrome của nó.')
];
}
}));
register(comparison({
id: 'cmp-complex1-2', title: 'Phức hợp I hay Phức hợp II', subtitle: 'Hai điểm đi vào chuỗi: mỗi phức hợp oxy hóa chất nào, phức hợp nào bơm proton và phức hợp nào là enzyme của chu trình TCA',
a: { short: 'Phức hợp I', label: 'Phức hợp I (NADH dehydrogenase)' }, b: { short: 'Phức hợp II', label: 'Phức hợp II (succinate dehydrogenase)' },
summary: 'Phức hợp I oxy hóa NADH và bơm proton; phức hợp II (succinate dehydrogenase) oxy hóa succinate bằng FAD của nó và không bơm proton; cả hai đều chuyển electron cho ubiquinone.',
prompts: function (T) {
var c1 = reaction('etc', 'c1'), c2 = reaction('etc', 'c2');
var tcaEnz = enzymes('tca');
return [
T.ab('c12.nadh', 'Phức hợp nào lấy electron từ NADH?', expect('cmp-complex1-2 NADH', which(substrates('etc', c1)[0] === 'etcnadh', substrates('etc', c2)[0] === 'etcnadh'), 'a'), [
'Đây là tổ hợp đầu tiên và lớn nhất trong chuỗi.',
'Rotenone ngăn chặn nó.'
], 'Tổ hợp I: ' + c1.equation + '.'),
T.ab('c12.pump', 'Phức hợp nào bơm proton qua màng trong?', expect('cmp-complex1-2 protons', which(makes(c1, 'hplus'), makes(c2, 'hplus')), 'a'), [
'Chỉ có một trong số chúng chuyển đổi các electron của nó thành gradient proton.',
'Đó là lý do tại sao hai hãng vận chuyển cung cấp thức ăn cho chúng lại có giá trị không giống nhau.'
], 'Phức hợp I bơm bốn proton cho mỗi cặp electron; Phức hợp II không bơm proton nào: ' + c2.equation + '.'),
T.ab('c12.tca', 'Phức hợp nào cũng là một enzyme của chu trình TCA?', expect('cmp-complex1-2 TCA', which(has(tcaEnz, c1.enzyme), has(tcaEnz, c2.enzyme)), 'b'), [
'Nó oxy hóa một axit bốn cacbon trong chu trình.',
'Flavin của nó là chất bị chu trình này khử.'
], note('enzyme', 'sdh')),
T.ab('c12.q', 'Phức hợp nào truyền electron của nó cho ubiquinone (Q)?', expect('cmp-complex1-2 Q', which(uses(c1, 'q'), uses(c2, 'q')), 'both'), [
'Hãy xem mỗi phức hợp tạo ra cái gì.',
'Chất mang tan trong lipid thu thập electron từ nhiều nguồn khác nhau.'
], 'Mỗi chất này khử ubiquinone thành ubiquinol, chất này mang các electron đến phức hợp III.'),
T.ab('c12.rotenone', 'Hợp chất nào bị rotenone ngăn chặn?', 'a', [
'Với chất độc này, succinate vẫn có thể tiếp tục duy trì chuỗi phản ứng.',
'Amytal cũng ngăn chặn cùng một loại phức hợp đó.'
], 'Rotenone và amytal ngăn chặn phức hợp I, do đó NADH không thể bị oxy hóa nữa; các electron từ succinate vẫn đi vào phức hợp II.'),
T.sort('c12.sort', 'Mỗi phát biểu phù hợp với phức hợp nào?', [
['big', 'Khoảng 45 tiểu đơn vị, đây là phức hợp lớn nhất.', 'a'], ['fad', 'FAD liên kết cộng hóa trị', 'b'], ['succ', 'Oxy hóa succinat thành fumarat', 'b'],
['fmn', 'FMN và một chuỗi các cụm sắt-lưu huỳnh', 'a'], ['q', 'Khử ubiquinone thành ubiquinol', 'both'], ['malonate', 'Bị ức chế bởi malonate', 'b'],
['pump', 'Bơm bốn proton cho mỗi cặp electron', 'a'], ['membrane', 'Nằm ở màng trong của ty thể.', 'both']
], T.abBuckets(), [
'Hãy suy nghĩ xem mỗi phức chất oxy hóa chất nào và nó sử dụng năng lượng đó như thế nào.',
'Cả hai đều là flavoprotein, nhưng có loại flavin khác nhau.'
], 'Phức hợp I: 45 tiểu đơn vị, FMN và các cụm sắt-lưu huỳnh, bốn proton trên mỗi cặp electron. Phức hợp II: FAD liên kết cộng hóa trị, chuyển hóa succinat thành fumarat, bị ức chế bởi malonat. Cả hai đều nằm ở màng trong và khử ubiquinon.')
];
}
}));
register(comparison({
id: 'cmp-slp-oxphos', title: 'Phosphoryl hóa mức cơ chất hay phosphoryl hóa oxy hóa', subtitle: 'Hai cách tổng hợp ATP: trực tiếp từ một chất trung gian hoặc nhờ gradient proton',
a: { short: 'Mức độ chất nền', label: 'Substrate-level phosphorylation' }, b: { short: 'Oxy hóa', label: 'Quá trình phosphoryl hóa oxy hóa' },
summary: 'Quá trình phosphoryl hóa ở mức chất nền lấy một nhóm phosphate trực tiếp từ chất trung gian trong chu trình và không cần oxy; trong khi đó, quá trình phosphoryl hóa oxy hóa cần gradient proton do quá trình vận chuyển electron tạo ra.',
prompts: function (T) {
var G = pathway('glycolysis');
var TWICE_G = ['gapdh', 'pgk', 'pgm', 'enolase', 'pk'];
function count(cof, io) {
var n = 0;
G.reactions.forEach(function (r) { if (has(r[io], cof)) { n += has(TWICE_G, r.id) ? 2 : 1; } });
return n;
}
var made = expect('cmp-slp-oxphos ATP made', count('atp', 'outs'), 4);
var spent = expect('cmp-slp-oxphos ATP spent', count('atp', 'ins'), 2);
function kindOf(r) {
if (/substrate-level/i.test(r.type)) { return 'a'; }
if (/chemiosmosis/i.test(r.type)) { return 'b'; }
if (uses(r, 'atp')) { return 'spend'; }
return fail('cmp-slp-oxphos: ' + r.id + ' is none of the kinds');
}
var steps = [
['pgk', 'Phosphoglycerate kinase', reaction('glycolysis', 'pgk'), 'a'], ['pk', 'Pyruvate kinase', reaction('glycolysis', 'pk'), 'a'],
['scs', 'Succinyl-CoA synthetase (tạo ra GTP)', reaction('tca', 'scs'), 'a'], ['c5', 'ATP synthase', reaction('etc', 'c5'), 'b'],
['hk', 'Hexokinase', reaction('glycolysis', 'hk'), 'spend'], ['pfk1', 'PFK-1', reaction('glycolysis', 'pfk1'), 'spend']
].map(function (s) { return [s[0], s[1], expect('cmp-slp-oxphos ' + s[0], kindOf(s[2]), s[3])]; });
var c5 = reaction('etc', 'c5');
return [
T.ab('so.gradient', 'Quá trình nào cần có sự chênh lệch nồng độ proton qua màng trong của ty thể?', 'b', [
'Một trong số đó là quá trình hóa thẩm thấu.',
'Một chất tách cặp như DNP sẽ ngăn chặn điều đó.'
], 'ATP synthase: ' + c5.equation + 'Các proton chảy ngược vào ma trận làm quay rôto của nó, và đầu xúc tác kết hợp ADP với phosphate.'),
T.ab('so.direct', 'Chất nào tạo ra ATP trực tiếp từ chất trung gian năng lượng cao như 1,3-bisphosphoglycerate hoặc PEP?', 'a', [
'Photphat đến trực tiếp từ một phân tử trong chu trình.',
'Phosphoglycerate kinase và pyruvate kinase thực hiện điều đó.'
], 'Quá trình phosphoryl hóa ở mức chất nền: một acyl phosphate hoặc enol phosphate chuyển nhóm phosphate của nó cho ADP trong một bước enzyme duy nhất, không cần màng và không có sự chênh lệch nồng độ phosphate.'),
T.ab('so.o2', 'Cái nào vẫn hoạt động được mà không cần oxy?', 'a', [
'Các tế bào lên men tạo ra toàn bộ ATP theo cách này.',
'Cái còn lại kết thúc ở O' + SUB2 + '.'
], 'Quá trình lên men tạo ra hai ATP trên mỗi phân tử glucose bằng phản ứng phosphoryl hóa ở mức chất nền. Phản ứng phosphoryl hóa oxy hóa cần sự vận chuyển electron, chất nhận cuối cùng là oxy.'),
T.sort('so.steps', 'Mỗi bước tạo ra ATP theo cách nào, hay là nó tiêu tốn ATP?', steps, [['a', 'Mức độ chất nền'], ['b', 'Oxy hóa'], ['spend', 'Tiêu hao ATP']], [
'Hãy xem xét những bước nào tạo ra ATP hoặc GTP và những bước nào sử dụng ATP.',
'Chỉ có một bước được thực hiện nhờ proton.'
], 'Cơ chế ở cấp độ chất nền: phosphoglycerate kinase, pyruvate kinase và succinyl-CoA synthetase (GTP). Cơ chế oxy hóa: ATP synthase. Hexokinase và PFK-1 tiêu thụ ATP.'),
T.number('so.count', 'Trong quá trình đường phân, với mỗi phân tử glucose, có bao nhiêu ATP được tạo ra thông qua quá trình phosphoryl hóa ở mức chất nền, và bao nhiêu ATP bị tiêu hao?', [
['made', 'ATP được tạo ra', made, 20], ['spent', 'ATP đã tiêu hao', spent, 20]
], [
'Các bước tính toán lợi nhuận được thực hiện một lần cho mỗi mảnh ba carbon.',
'Hai kinase tiêu thụ và hai kinase tạo ra.'
], 'Phosphoglycerate kinase và pyruvate kinase mỗi loại tạo ra một ATP cho mỗi trong hai mảnh ba carbon: tổng cộng là bốn. Hexokinase và PFK-1 mỗi loại tiêu thụ một ATP: tổng cộng là hai.'),
T.pick('so.energy', 'Quá trình phosphoryl hóa oxy hóa lấy năng lượng để tạo ra ATP từ đâu?', [
['protons', 'Từ các proton chảy ngược trở lại chất nền thông qua ATP synthase'],
['gtp', 'Từ quá trình thủy phân GTP được tạo ra trong chu trình TCA.'],
['bpg', 'Từ nhóm phosphat của 1,3-bisphosphoglycerate']
], 'protons', [
'Quá trình vận chuyển electron trước tiên lưu trữ năng lượng dưới dạng gradient.',
'Động cơ quay sẽ hoạt động khi chúng đi qua.'
], note('enzyme', 'atpsynthase'))
];
}
}));
register(comparison({
id: 'cmp-pdc-kgdh', title: 'PDC hay α-KG dehydrogenase', subtitle: 'Hai phức hợp có cấu trúc tương tự: cơ chất đầu vào, sản phẩm đầu ra và những thành phần chung',
a: { short: 'PDC', label: 'Phức hợp pyruvate dehydrogenase (PDC)', mol: 'pyruvate' }, b: { short: 'KGDH', label: 'Phức hợp α-ketoglutarate dehydrogenase (KGDH)', mol: 'akg' },
summary: 'Hai phức hợp, một thiết kế: TPP, lipoamide, CoA, FAD và NAD⁺ chuyển hóa axit keto thành acyl-CoA, CO₂ và NADH; PDC cung cấp acetyl-CoA cho chu trình, KGDH tạo ra succinyl-CoA bên trong đó.',
prompts: function (T) {
var pdc = reaction('pdhtca', 'pdc'), kg = reaction('tca', 'kgdh'), scs = reaction('tca', 'scs');
expect('cmp-pdc-kgdh succinyl-CoA feeds the synthetase', has(substrates('tca', scs), 'succoa'), true);
function both(cof, io) { return which(has(pdc[io], cof), has(kg[io], cof)); }
return [
T.ab('pk.common', 'Những bản phát hành phức hợp nào ' + CO2 + 'giảm ' + NADPLUS + ' và tạo thành thioeste với coenzyme A?',
expect('cmp-pdc-kgdh shared chemistry', [both('co2', 'outs'), both('nadh', 'outs'), both('coa', 'ins')].join() === 'both,both,both' ? 'both' : 'differ', 'both'), [
'Hãy so sánh hai phương trình cạnh nhau.',
'Chúng được cấu tạo từ ba loại enzyme giống nhau.'
], 'PDC: ' + pdc.equation + '. KGDH: ' + kg.equation + '.'),
T.ab('pk.acetyl', 'Phức hợp nào tạo ra acetyl-CoA đi vào chu trình TCA?', expect('cmp-pdc-kgdh acetyl-CoA', which(has(products('pdhtca', pdc), 'acetylcoa'), has(products('tca', kg), 'acetylcoa')), 'a'), [
'Chất nền của nó là sản phẩm cuối cùng có ba nguyên tử carbon của quá trình đường phân.',
'Sản phẩm này có hai nguyên tử carbon trên chất mang.'
], 'Phức hợp pyruvate dehydrogenase chuyển hóa pyruvate thành acetyl-CoA, sau đó citrate synthase sẽ kết hợp chất này với oxaloacetate.'),
T.ab('pk.succ', 'Phức hợp nào tạo nên chất nền của quá trình phosphoryl hóa ở mức chất nền duy nhất trong chu trình TCA?', expect('cmp-pdc-kgdh succinyl-CoA', which(has(products('pdhtca', pdc), 'succoa'), has(products('tca', kg), 'succoa')), 'b'), [
'Sản phẩm của nó có bốn nguyên tử carbon trên chất mang.',
'Enzyme tiếp theo tạo ra GTP.'
], 'KGDH tạo ra succinyl-CoA, và succinyl-CoA synthetase sau đó sử dụng thioester để tạo ra GTP: ' + scs.equation + '.'),
T.pick('pk.tpp', 'Chất đồng yếu tố nào mà E1 của mỗi phức chất sử dụng để tấn công axit keto và giải phóng ' + CO2 + ' rời khỏi?', [
['tpp', 'Thiamine pyrophosphate (TPP)'], ['plp', 'Pyridoxal phosphate (PLP)'], ['biotin', 'Biotin'], ['lip', 'Lipoamide']
], 'tpp', [
'Nó tạo thành một carbanion tấn công nguyên tử cacbon của nhóm cacbonyl.',
'Vitamin của nó là vitamin B1; thiếu vitamin này sẽ gây ra bệnh beriberi.'
], 'TPP (từ thiamine, vitamin B1) khử carboxyl cả hai axit keto; lipoamide sau đó mang nhóm acyl, coenzyme A lấy nó, và FAD và ' + NADPLUS + ' Mang các electron đi chỗ khác.'),
T.sort('pk.sort', 'Mỗi phân tử thuộc về phức hợp nào?', [
['pyr', 'Pyruvat', expect('cmp-pdc-kgdh pyruvate', which(has(substrates('pdhtca', pdc), 'pyruvate'), has(substrates('tca', kg), 'pyruvate')), 'a')],
['accoa', 'Acetyl-CoA', 'a'],
['akg', 'α-Ketoglutarate', expect('cmp-pdc-kgdh akg', which(has(substrates('pdhtca', pdc), 'akg'), has(substrates('tca', kg), 'akg')), 'b')],
['succoa', 'Succinyl-CoA', 'b'], ['co2', CO2, 'both'], ['nadh', 'NADH', 'both'],
['coa', 'Coenzyme A', expect('cmp-pdc-kgdh CoA', both('coa', 'ins'), 'both')], ['lip', 'Lipoamide', 'both'], ['fad', 'FAD', 'both']
], T.abBuckets(), [
'Nguyên liệu và sản phẩm khác nhau; nhưng máy móc thì giống nhau.',
'Có năm đồng yếu tố.'
], 'PDC: pyruvate vào, acetyl-CoA ra. KGDH: α-ketoglutarate vào, succinyl-CoA ra. Cả hai: ' + CO2 + 'NADH, coenzyme A, lipoamide, FAD (và TPP).'),
T.ab('pk.inhibit', 'Phức hợp nào bị ức chế bởi chính sản phẩm acyl-CoA của nó và bởi NADH?', 'both', [
'Ức chế sản phẩm là quy luật đối với một bước không thể đảo ngược và đã được xác định.',
'Nồng độ NADH cao cho thấy chuỗi phản ứng đã được cung cấp đầy đủ.'
], 'PDC bị ức chế bởi acetyl-CoA, NADH và ATP; KGDH bị ức chế bởi succinyl-CoA, NADH và ATP.')
];
}
}));
register(comparison({
id: 'cmp-phosphorylase-synthase', title: 'Glycogen phosphorylase hay synthase', subtitle: 'Phân giải hoặc tổng hợp glycogen: cơ chất, đồng yếu tố và tác động của phosphoryl hóa lên mỗi enzyme',
a: { short: 'Phosphorylase', label: 'Glycogen phosphorylase' }, b: { short: 'Synthase', label: 'Glycogen synthase' },
summary: 'Glycogen synthase được tổng hợp từ UDP-glucose và bị tắt bởi quá trình phosphoryl hóa; glycogen phosphorylase cắt glucose 1-phosphate bằng Pᵢ và được kích hoạt bởi quá trình này.',
prompts: function (T) {
var gs = reaction('glycogen', 'gsyn'), gp = reaction('glycogen', 'gphos');
return [
T.ab('gs.udpg', 'Enzyme nào sử dụng UDP-glucose?', expect('cmp-phosphorylase-synthase UDP-glucose', which(has(substrates('glycogen', gp), 'udpg'), has(substrates('glycogen', gs), 'udpg')), 'b'), [
'Đường hoạt hóa có tác dụng xây dựng, chứ không phải phá vỡ.',
'UDP được giải phóng khi glucose được thêm vào.'
], 'Glycogen synthase: ' + gs.equation + '.'),
T.ab('gs.pi', 'Enzyme nào sử dụng phốt phát vô cơ, chứ không phải nước, để cắt một phân tử glucose?', expect('cmp-phosphorylase-synthase Pi', which(uses(gp, 'pi'), uses(gs, 'pi')), 'a'), [
'Phản ứng photphoryl hóa, không phải thủy phân.',
'Glucose được tách ra ở dạng đã được phosphoryl hóa, do đó không tiêu tốn ATP.'
], 'Glycogen phosphorylase: ' + gp.equation + '. ' + note('enzyme', 'glycogenphosphorylase')),
T.ab('gs.g1p', 'Enzyme nào tạo ra glucose 1-phosphate?', expect('cmp-phosphorylase-synthase G1P', which(has(products('glycogen', gp), 'g1p'), has(products('glycogen', gs), 'g1p')), 'a'), [
'Đó là enzyme phân giải.',
'Sau đó, phosphoglucomutase chuyển hóa sản phẩm thành glucose 6-phosphate.'
], 'Glycogen phosphorylase giải phóng glucose 1-phosphate; phosphoglucomutase chuyển hóa glucose 6-phosphate thành glucose 6-phosphate để sử dụng trong quá trình đường phân hoặc, ở gan, để giải phóng dưới dạng glucose.'),
T.ab('gs.pka', 'Epinephrine và glucagon, thông qua protein kinase A, dẫn đến sự phosphoryl hóa cả hai enzyme. Enzyme nào trở nên hoạt động mạnh hơn khi bị phosphoryl hóa?', 'a', [
'Các hormone này yêu cầu glucose được giải phóng, chứ không phải được dự trữ.',
'Dạng hoạt động, được phosphoryl hóa của nó được gọi là dạng α.'
], 'Phosphorylase kinase phosphoryl hóa glycogen phosphorylase b thành dạng hoạt động a; chuỗi phản ứng tương tự cũng phosphoryl hóa glycogen synthase và tắt nó đi. Insulin đảo ngược cả hai quá trình này thông qua protein phosphatase 1.'),
T.ab('gs.plp', 'Enzyme nào cần pyridoxal phosphate (vitamin B6)?', 'a', [
'Điều bất thường là, nhóm phosphat của chính coenzyme lại đóng vai trò như một chất xúc tác axit-bazơ ở đây.',
'Enzyme còn lại không cần chất xúc tác vitamin.'
], 'Glycogen phosphorylase chứa pyridoxal phosphate, nhóm phosphate của chất này giúp phosphate vô cơ tấn công liên kết glycosidic. Glycogen synthase không có cofactor như vậy.'),
T.sort('gs.sort', 'Mỗi câu phát biểu phù hợp với loại enzyme nào?', [
['udpg', 'UDP-glucose', 'b'], ['udp', 'UDP đã phát hành', expect('cmp-phosphorylase-synthase UDP', which(makes(gp, 'udp'), makes(gs, 'udp')), 'b')], ['pi', PI + ' used', 'a'],
['g1p', 'Glucose 1-phosphate', 'both'], ['ends', 'Hoạt động ở đầu không khử của glycogen', 'both'],
['on', 'Được kích hoạt bởi quá trình phosphoryl hóa', 'a'], ['off', 'Bị tắt bởi quá trình phosphoryl hóa', 'b']
], T.abBuckets(), [
'Quá trình phân giải tiêu tốn phốt phát; quá trình tổng hợp tiêu tốn một nucleotide đường.',
'Quá trình phosphoryl hóa có tác dụng ngược lại với hai quá trình trên.'
], 'Phosphorylase: ' + PI + 'Enzyme synthase: UDP-glucose đi vào, UDP đi ra, tắt đi bởi quá trình phosphoryl hóa. Glucose 1-phosphate là sản phẩm của quá trình phân giải và, thông qua UDP-glucose, là điểm khởi đầu của quá trình tổng hợp; cả hai enzyme đều hoạt động ở đầu không khử.')
];
}
}));
register(comparison({
id: 'cmp-betaox-fas', title: 'Beta-oxidation hay tổng hợp acid béo', subtitle: 'Phân giải và tổng hợp acid béo: các khoang tế bào, chất mang, chất mang electron và đơn vị hai carbon',
a: { short: 'Quá trình oxy hóa beta', label: 'Quá trình oxy hóa beta' }, b: { short: 'Tổng hợp axit béo', label: 'Tổng hợp axit béo' },
summary: 'Quá trình beta-oxy hóa (ma trận, CoA, FAD và NAD⁺) loại bỏ hai nguyên tử carbon mỗi chu kỳ dưới dạng acetyl-CoA; quá trình tổng hợp axit béo (bào tương, ACP, NADPH) thêm hai nguyên tử carbon mỗi chu kỳ từ malonyl-CoA.',
prompts: function (T) {
var acadh = reaction('betaox', 'acadh'), hadh = reaction('betaox', 'hadh');
expect('cmp-betaox-fas NADPH', anyStep('betaox', function (r) { return uses(r, 'nadph') || makes(r, 'nadph'); }), false);
return [
T.ab('bf.where', 'Điều gì xảy ra trong chất nền ty thể?', 'a', [
'Chuỗi acyl phải được vận chuyển vào trước tiên bởi carnitine.',
'Quá trình còn lại diễn ra trong bào tương.'
], 'Quá trình beta-oxy hóa diễn ra trong chất nền ty thể (acyl-CoA đi vào thông qua con đường vận chuyển carnitine). Quá trình tổng hợp axit béo diễn ra trong bào tương.'),
T.ab('bf.nadph', 'Loại nào sử dụng NADPH?', 'b', [
'Quá trình xây dựng cần năng lượng khử, và con đường pentose phosphate cung cấp năng lượng này.',
'Việc giảm chi phí bảo hiểm khiến số lượng nhà cung cấp giảm thay vì phải chi tiêu nhiều hơn.'
], 'Enzyme tổng hợp axit béo (fatty acid synthase) cắt chuỗi đang phát triển hai lần trong mỗi chu kỳ với NADPH. Quá trình beta-oxy hóa không sử dụng NADPH; nó tạo ra... ' + FADH2 + ' và NADH.'),
T.ab('bf.fadh2', 'Cái nào tạo nên ' + FADH2 + ' và NADH?', expect('cmp-betaox-fas carriers', which(makes(acadh, 'fadh2') && makes(hadh, 'nadh'), false), 'a'), [
'Hai trong bốn bước của một vòng phản ứng là các bước oxy hóa.',
'Các hạt tải điện tiếp tục di chuyển trong chuỗi vận chuyển electron.'
], acadh.equation + '. ' + hadh.equation + '.'),
T.pick('bf.malonyl', 'Phân tử nào cung cấp hai nguyên tử carbon được thêm vào trong mỗi vòng tổng hợp?', [
['malonyl', 'Malonyl-CoA'], ['acetyl', 'Acetyl-CoA'], ['succinyl', 'Succinyl-CoA']
], 'malonyl', [
'Nó được tạo ra từ acetyl-CoA bởi một carboxylase cần biotin.',
'Nó mất đi lượng carbon đã hấp thụ. ' + CO2 + ' khi nó ngưng tụ cùng với chuỗi đang phát triển.'
], 'Acetyl-CoA carboxylase tạo ra malonyl-CoA, bước quyết định trong quá trình tổng hợp. Acetyl-CoA khởi đầu chuỗi; malonyl-CoA kéo dài chuỗi thêm hai nguyên tử carbon mỗi vòng, đồng thời mất đi nguyên tử carbon thừa. ' + CO2 + '.'),
T.pick('bf.acp', 'Chất mang nào giữ chuỗi đang phát triển trong quá trình tổng hợp?', [
['acp', 'Protein mang acyl (ACP) của enzyme tổng hợp axit béo'], ['coa', 'Coenzyme A'], ['carnitine', 'Carnitine']
], 'acp', [
'Ở động vật, nó là một phần của một loại protein đa enzyme lớn.',
'Nhánh của nó là phosphopantetheine, cùng nhánh với coenzyme A.'
], 'Chuỗi đang phát triển là một thioester trên protein mang nhóm acyl của enzyme tổng hợp axit béo. Quá trình beta-oxy hóa diễn ra trên các thioester của coenzyme A; carnitine chỉ mang nhóm acyl qua màng trong.'),
T.sort('bf.sort', 'Mỗi phần tử thuộc quy trình nào?', [
['fad', 'FAD', 'a'], ['nad', NADPLUS, 'a'], ['nadph', 'NADPH', 'b'], ['malonyl', 'Malonyl-CoA', 'b'], ['acp', 'Protein mang acyl', 'b'],
['coa', 'Các thioeste của Coenzyme A', 'a'], ['carnitine', 'Vận chuyển Carnitine', 'a'], ['citrate', 'Cơ chế vận chuyển citrate cho acetyl-CoA', 'b'],
['two', 'Hai nguyên tử carbon một lúc', 'both'], ['cyto', 'Tế bào chất', 'b'], ['matrix', 'Chất nền ty thể', 'a']
], T.abBuckets(), [
'Quá trình phân hủy và xây dựng sử dụng các ngăn, chất mang và chất mang điện tử khác nhau.',
'Chỉ có đơn vị hai nguyên tử carbon là giống nhau ở cả hai.'
], 'Quá trình beta-oxy hóa: ma trận, coenzyme A, vận chuyển carnitine, FAD và ' + NADPLUS + 'Tổng hợp: cytosol, protein vận chuyển acyl, hệ thống vận chuyển citrate, malonyl-CoA và NADPH. Cả hai đều vận chuyển hai nguyên tử carbon cùng một lúc.')
];
}
}));
register(comparison({
id: 'cmp-sat-unsat', title: 'Acid béo bão hòa hay không bão hòa', subtitle: 'So sánh acid stearic và acid oleic: cùng có 18 carbon nhưng khác nhau một liên kết đôi, ảnh hưởng thế nào đến lượng ATP tạo ra',
a: { short: 'Axit stearic (18:0)', label: 'Axit stearic (18:0), bão hòa' }, b: { short: 'Axit oleic (18:1)', label: 'Axit oleic (18:1), một liên kết đôi cis' },
summary: 'Một axit có 18 nguyên tử carbon sẽ tạo ra chín acetyl-CoA theo cả hai cách; một liên kết đôi đã có sẵn trong chuỗi sẽ bỏ qua một bước của acyl-CoA dehydrogenase, do đó axit oleic tạo ra ít hơn một FADH₂ (khoảng 1,5 ATP) so với axit stearic.',
prompts: function (T) {
var fa = MG.atp && typeof MG.atp.fattyAcid === 'function' ? MG.atp.fattyAcid(18, 0) : { rounds: 8, acetyl: 9 };
expect('cmp-sat-unsat rounds and acetyl-CoA', fa.rounds + ',' + fa.acetyl, '8,9');
return [
T.ab('su.more', 'Cả hai đều có 18 nguyên tử carbon. Chất nào tạo ra nhiều ATP hơn khi bị oxy hóa hoàn toàn?', 'a', [
'Liên kết đôi đã có sẵn là một liên kết mà tế bào không tạo ra được, do đó một bước oxy hóa bị bỏ qua.',
'Càng nhiều nguyên tử hydro thì càng có nhiều electron để cung cấp cho chuỗi.'
], 'Axit stearic tạo ra 120 ATP (với NADH 2,5 và ' + FADH2 + ' 1,5); axit oleic, với một liên kết đôi, tạo thành một ' + FADH2 + ' ít hơn: 118,5.'),
T.pick('su.why', 'Tại sao axit không bão hòa lại cho ít hơn?', [
['skip', 'Một vòng bỏ qua acyl-CoA dehydrogenase, vì vậy một ' + FADH2 + ' ít hơn được sản xuất'],
['fewer', 'Nó có ít nguyên tử carbon hơn.'],
['activation', 'Nó không thể được hoạt hóa thành acyl-CoA.']
], 'skip', [
'Cả hai sợi dây chuyền đều có cùng chiều dài.',
'Bước đầu tiên của một vòng tạo thành liên kết đôi; ở đây, một liên kết đôi đã có sẵn.'
], 'Acyl-CoA dehydrogenase tạo ra liên kết đôi trans và ' + FADH2 + '. Ở những vị trí mà chuỗi đã có liên kết đôi, bước đó sẽ được bỏ qua một lần, vì vậy một ' + FADH2 + ' (khoảng 1,5 ATP) bị mất đi.'),
T.pick('su.isomerase', 'Axit oleic cần thêm loại enzyme nào?', [
['iso', 'Enoyl-CoA isomerase'], ['hyd', 'Enoyl-CoA hydratase'], ['acc', 'Acetyl-CoA carboxylase']
], 'iso', [
'Sau ba vòng, liên kết đôi nằm ở carbon 3 ở dạng cis, mà hydratase không thể sử dụng.',
'Nó chuyển liên kết đôi đến carbon số 2 và làm cho nó trở thành dạng trans.'
], 'Oleoyl-CoA trải qua ba chu trình bình thường để tạo thành cis-Δ³-dodecenoyl-CoA. Enoyl-CoA isomerase chuyển hóa nó thành trans-Δ²-enoyl-CoA, chất nền bình thường của hydratase, do đó chu trình này bỏ qua dehydrogenase.'),
T.ab('su.fadh2', 'Chất nào tạo ra tám FADH₂ trong tám chu kỳ beta-oxy hóa?', 'a', [
'Mỗi vòng đều bắt đầu với acyl-CoA dehydrogenase, trừ khi liên kết đôi đã có sẵn.',
'Chuỗi không có liên kết đôi sẽ không bị bỏ sót bước nào.'
], 'Axit stearic không có liên kết đôi, vì vậy cả tám vòng đều bắt đầu với acyl-CoA dehydrogenase và tạo ra tám ' + FADH2 + 'Axit oleic bỏ qua bước đó một lần và tạo ra bảy phân tử.'),
T.number('su.count', 'Một axit có 18 nguyên tử carbon sẽ tạo ra bao nhiêu acetyl-CoA và trải qua bao nhiêu vòng beta-oxy hóa?', [
['acetyl', 'Acetyl-CoA', fa.acetyl, 30], ['rounds', 'Vòng', fa.rounds, 30]
], [
'Cứ hai nguyên tử carbon sẽ tạo thành một acetyl-CoA.',
'Vòng cuối cùng tạo ra hai phân tử acetyl-CoA cùng một lúc, vì vậy số vòng ít hơn số lượng acetyl-CoA một vòng.'
], 'Mười tám nguyên tử carbon tạo ra chín acetyl-CoA trong tám chu kỳ: chu kỳ cuối cùng cắt một acyl-CoA bốn carbon thành hai acetyl-CoA.'),
T.ab('su.same', 'Axit nào tạo ra chín acetyl-CoA?', 'both', [
'Liên kết đôi làm thay đổi các nguyên tử hydro, chứ không phải các nguyên tử carbon.',
'Đếm số nguyên tử carbon, không phải số liên kết.'
], 'Mỗi phân tử có 18 nguyên tử carbon, do đó mỗi phân tử tạo ra chín acetyl-CoA trong tám chu kỳ. Chỉ có số lượng... ' + FADH2 + ' khác nhau.'),
T.sort('su.sort', 'Mỗi câu phát biểu phù hợp với loại axit nào?', [
['eight', 'Làm thành tám ' + FADH2, 'a'], ['skip', 'Bỏ qua một bước của enzyme acyl-CoA dehydrogenase.', 'b'], ['iso', 'Cần có enoyl-CoA isomerase', 'b'],
['nine', 'Cung cấp chín acetyl-CoA', 'both'], ['rounds', 'Trải qua tám vòng oxy hóa beta.', 'both']
], T.abBuckets(), [
'Liên kết đôi của axit oleic đã có sẵn trong chuỗi, vì vậy một bước trong chu trình bị bỏ qua và một bước khác được thêm vào.',
'Cả hai đều có cùng số lượng nguyên tử carbon.'
], 'Axit stearic: tám ' + FADH2 + 'Axit oleic: bỏ qua một bước acyl-CoA dehydrogenase, nên còn bảy bước, và enoyl-CoA isomerase để di chuyển liên kết đôi cis của nó. Cả hai đều: 18 nguyên tử carbon, chín acetyl-CoA, tám vòng.')
];
}
}));
register(comparison({
id: 'cmp-g3p-glycerol3p', title: 'Glyceraldehyde 3-P hay glycerol 3-P', subtitle: 'Hai hợp chất phosphate ba carbon có tên gần giống nhau: aldehyde trong đường phân và khung cấu trúc của chất béo',
a: { short: 'Glyceraldehyde 3-phosphate', label: 'Glyceraldehyde 3-phosphate' }, b: { short: 'Glycerol 3-phosphate', label: 'Glycerol 3-phosphate' },
summary: 'Glyceraldehyde 3-phosphate là aldehyd của quá trình đường phân; glycerol 3-phosphate là cấu trúc xương sống khử của chất béo và là chất vận chuyển trong chu trình glycerol phosphate.',
prompts: function (T) {
var gapdh = reaction('glycolysis', 'gapdh'), gp1 = reaction('gpshuttle', 'gp1');
expect('cmp-g3p-glycerol3p GAPDH', substrates('glycolysis', gapdh)[0], 'g3p');
expect('cmp-g3p-glycerol3p shuttle', substrates('gpshuttle', gp1)[0] + '>' + products('gpshuttle', gp1)[0] + (uses(gp1, 'nadh') ? ' nadh' : ''), 'dhap>glycerol3p nadh');
var shuttleMols = allMols('gpshuttle');
return [
T.figurePick('g3.which', 'Hình nào là glyceraldehyde 3-phosphate?', [
['g3p', 'Glyceraldehyde 3-phosphate', 'g3p'], ['glycerol3p', 'Glycerol 3-phosphate', 'glycerol3p']
], 'g3p', [
'Hãy tìm nhóm carbonyl: một anđehit ở cacbon số 1.',
'Hình vẽ còn lại là một loại rượu ba cacbon đã bị khử hoàn toàn với một nhóm photphat.'
], 'Glyceraldehyde 3-phosphate có nhóm aldehyde (C=O với H) ở carbon số 1. Glycerol 3-phosphate chỉ có các nhóm hydroxyl trên các nguyên tử carbon của nó: đó là glycerol có nhóm phosphate.'),
T.ab('g3.gapdh', 'Chất nào là chất trung gian của quá trình đường phân mà GAPDH oxy hóa?', 'a', [
'Quá trình oxy hóa của nó tạo ra 1,3-bisphosphoglycerate.',
'Đó là chất có nhóm cacbonyl.'
], 'GAPDH: ' + gapdh.equation + '.'),
T.ab('g3.dhap', 'Chất nào được tạo ra từ dihydroxyacetone phosphate bằng phản ứng khử với NADH?', 'b', [
'Quá trình khử thêm electron: xeton trở thành ancol.',
'Đây là bước đầu tiên của một cơ chế vận chuyển các electron từ NADH trong tế bào chất đến chuỗi phản ứng.'
], 'Dehydrogenase glycerol 3-phosphate trong bào tương: ' + gp1.equation + 'Triose phosphate isomerase chuyển hóa DHAP thành glyceraldehyde 3-phosphate mà không cần chất vận chuyển nào.'),
T.ab('g3.fat', 'Cấu trúc nào là khung xương mà các axit béo được este hóa vào trong chất béo?', 'b', [
'Chất béo là este của triol ba cacbon.',
'Quá trình tổng hợp lipid bắt đầu bằng việc acyl hóa nó.'
], note('molecule', 'glycerol3p')),
T.ab('g3.carbonyl', 'Chất nào mang nhóm cacbonyl?', 'a', [
'Hãy tìm nhóm C=O ở cuối chuỗi.',
'Chất còn lại chỉ có nhóm hydroxyl và nhóm phosphate.'
], 'Glyceraldehyde 3-phosphate là một aldehyde. Glycerol 3-phosphate được khử hoàn toàn: có ba nguyên tử carbon, mỗi nguyên tử đều có một nhóm hydroxyl, trong đó một nhóm được phosphoryl hóa.'),
T.ab('g3.shuttle', 'Cái nào là một phần của chu trình vận chuyển glycerol phosphate?', expect('cmp-g3p-glycerol3p shuttle member', which(has(shuttleMols, 'g3p'), has(shuttleMols, 'glycerol3p')), 'b'), [
'Tàu con thoi được đặt tên theo nó.',
'Dehydrogenase ty thể của nó chuyển các electron cho ubiquinone.'
], 'Glycerol 3-phosphate được tạo ra trong bào tương từ DHAP với NADH và được oxy hóa trở lại thành DHAP trên màng trong bởi enzyme FAD, enzyme này truyền các electron cho ubiquinone.'),
T.sort('g3.sort', 'Mỗi phát biểu phù hợp với phân tử nào?', [
['ald', 'Nó là một anđehit', 'a'], ['gapdh', 'GAPDH oxy hóa nó trong quá trình đường phân.', 'a'], ['red', 'Đã khử hoàn toàn: chỉ còn lại các nhóm hydroxyl', 'b'],
['dhap', 'Được làm từ DHAP với NADH', 'b'], ['fat', 'Xương sống của một người béo', 'b']
], T.twoBuckets(), [
'Một chất có nhóm cacbonyl, chất kia thì không.',
'Dạng bị khử là dạng mang các electron của con thoi và là khung xương của lipid.'
], 'Glyceraldehyde 3-phosphate: là aldehyd mà GAPDH oxy hóa. Glycerol 3-phosphate: được tạo ra từ DHAP bằng phản ứng khử với NADH, chỉ có các nhóm hydroxyl và là khung xương của chất béo.')
];
}
}));
register(comparison({
id: 'cmp-shuttles', title: 'sự vận chuyển glycerol phosphate hay sự vận chuyển malate-aspartate', subtitle: 'Hai cách đưa electron của NADH trong bào tương vào ty thể và lý do chúng tạo ra lượng ATP khác nhau',
a: { short: 'Con thoi glycerol phosphate', label: 'Con thoi glycerol phosphate' }, b: { short: 'Con thoi malate-aspartate', label: 'Con thoi malate-aspartate' },
summary: 'Cả hai hệ thống vận chuyển đều mang các electron của NADH trong tế bào chất vào bên trong; hệ thống vận chuyển glycerol phosphate cung cấp chúng cho ubiquinone (khoảng 1,5 ATP), hệ thống vận chuyển malate-aspartate tái tạo NADH trong chất nền (khoảng 2,5) và hoạt động theo một chiều.',
prompts: function (T) {
var gp2 = reaction('gpshuttle', 'gp2'), ma3 = reaction('masshuttle', 'ma3');
var gpNadh = anyStep('gpshuttle', function (r) { return makes(r, 'nadh'); }), maNadh = anyStep('masshuttle', function (r) { return makes(r, 'nadh'); });
var gpFad = anyStep('gpshuttle', function (r) { return uses(r, 'fad'); }), maFad = anyStep('masshuttle', function (r) { return uses(r, 'fad'); });
var gpOne = anyStep('gpshuttle', function (r) { return r.irreversible; }), maOne = anyStep('masshuttle', function (r) { return r.irreversible; });
var gpM = allMols('gpshuttle'), maM = allMols('masshuttle'), gpE = enzymes('gpshuttle'), maE = enzymes('masshuttle');
return [
T.ab('sh.purpose', 'Cơ chế vận chuyển nào đưa các electron của NADH trong tế bào chất vào ty thể?', 'both', [
'Chúng tồn tại vì cùng một lý do: bản thân NADH không thể đi qua màng trong.',
'Chúng khác nhau ở vị trí mà các electron đến.'
], 'Mỗi con thoi oxy hóa NADH trong tế bào chất và đưa các electron vào bên trong; chúng khác nhau ở chỗ các electron đến trên FAD và ubiquinone hay trên NADH trong chất nền.'),
T.ab('sh.matrix', 'Trong con thoi nào các electron cuối cùng sẽ chuyển hóa thành NADH bên trong chất nền?', expect('cmp-shuttles matrix NADH', which(gpNadh, maNadh), 'b'), [
'Dehydrogenase cuối cùng của nó là một enzyme của chu trình TCA.',
'Không có gì bị mất trên đường đi, vì vậy sản lượng thu được là trọn vẹn.'
], 'Malate dehydrogenase ty thể: ' + ma3.equation + 'Các electron sau đó đi vào phức hợp I.'),
T.ab('sh.fad', 'Con thoi nào chuyển các electron cho FAD rồi đến ubiquinone, bỏ qua phức hợp I?', expect('cmp-shuttles FAD', which(gpFad, maFad), 'a'), [
'Enzyme thứ hai của nó nằm ở mặt ngoài của màng trong.',
'Các electron đi vào ở mức succinate.'
], 'Dehydrogenase glycerol 3-phosphate ty thể: ' + gp2.equation + '. Của nó ' + FADH2 + ' truyền các electron trực tiếp đến ubiquinone.'),
T.number('sh.atp', 'Một phân tử NADH trong tế bào chất tạo ra khoảng bao nhiêu ATP thông qua mỗi chu trình?', [
['gp', 'Con thoi glycerol phosphate', 1.5, 5], ['ma', 'Con thoi malate-aspartate', 2.5, 5]
], [
'Một con thoi vận chuyển ở mức succinate, con thoi còn lại vận chuyển ở mức phức hợp I.',
'Tổng lượng glucose của 30 và 32 ATP khác nhau chính xác là do điều này.'
], 'Thông qua cơ chế vận chuyển glycerol phosphate, NADH trong tế bào chất có giá trị tương đương với... ' + FADH2 + ' Nó có giá trị tương đương khoảng 1,5 ATP; thông qua chu trình malate-aspartate, nó có giá trị tương đương khoảng 2,5 NADH trong chất nền.'),
T.ab('sh.oneway', 'Loại vận chuyển nào chỉ di chuyển theo một chiều, vì điện thế màng điều khiển một trong các chất mang của nó?', expect('cmp-shuttles one way', which(gpOne, maOne), 'b'), [
'Một trong những chất vận chuyển của nó thực hiện việc trao đổi một axit amin này với một axit amin khác xuyên qua màng tế bào.',
'Aspartate rời khỏi chất nền và glutamate đi vào.'
], note('enzyme', 'gaa')),
T.ab('sh.tissue', 'Loại vận chuyển nào chiếm ưu thế ở gan, thận và tim?', 'b', [
'Các mô này nhận được toàn bộ lượng ATP từ NADH trong tế bào chất.',
'Cơ xương và não chủ yếu sử dụng cái còn lại.'
], 'Chu trình malate-aspartate là chu trình chính ở gan, thận và tim; chu trình glycerol-phosphate nổi bật ở cơ xương và não.'),
T.sort('sh.sort', 'Mỗi chiếc thuộc về tàu con thoi nào?', [
['gpdh', 'Glycerol 3-phosphate dehydrogenase', expect('cmp-shuttles GPDH', which(has(gpE, 'glycerol3pdh'), has(maE, 'glycerol3pdh')), 'a')], ['fad', 'FAD', expect('cmp-shuttles FAD item', which(gpFad, maFad), 'a')],
['malate', 'Malate', expect('cmp-shuttles malate', which(has(gpM, 'malate'), has(maM, 'malate')), 'b')], ['asp', 'Aspartate', expect('cmp-shuttles aspartate', which(has(gpM, 'aspartate'), has(maM, 'aspartate')), 'b')],
['ast', 'Aspartate aminotransferase', expect('cmp-shuttles AST', which(has(gpE, 'ast'), has(maE, 'ast')), 'b')], ['anti', 'Hai chất vận chuyển ngược chiều của màng trong', 'b'],
['dhap', 'Dihydroxyacetone phosphate', expect('cmp-shuttles DHAP', which(has(gpM, 'dhap'), has(maM, 'dhap')), 'a')], ['nadh', 'Oxy hóa NADH trong tế bào chất', 'both']
], T.abBuckets(), [
'Một hệ thống vận chuyển gồm hai enzyme; hệ thống kia gồm sáu bước với hai chất mang.',
'Cả hai đều bắt đầu bằng quá trình oxy hóa cùng một chất mang.'
], 'Chu trình glycerol phosphate: DHAP, glycerol 3-phosphate dehydrogenase (trong bào tương và ty thể), FAD. Chu trình malate-aspartate: malate, aspartate, aspartate aminotransferase và hai chất vận chuyển ngược chiều. Cả hai đều oxy hóa NADH trong bào tương.')
];
}
}));
register(comparison({
id: 'cmp-apoptosis', title: 'Apoptosis nội sinh hay ngoại sinh', subtitle: 'Con đường qua ty thể và con đường qua thụ thể chết: vị trí khởi đầu, caspase khởi phát và điểm hội tụ của mỗi con đường',
a: { short: 'Nội tại', label: 'Con đường nội tại (ty thể)' }, b: { short: 'Bên ngoài', label: 'Đường dẫn ngoại sinh (thụ thể gây chết tế bào)' },
summary: 'Nguyên nhân nội tại: tổn thương, Bax, cytochrome c, apoptosome và caspase-9. Nguyên nhân ngoại lai: TNF, thụ thể của nó, FADD và caspase-8. Cả hai đều kết thúc ở caspase-3.',
prompts: function (T) {
var iE = enzymes('apopint'), eE = enzymes('apopext'), iM = allMols('apopint'), eM = allMols('apopext');
function fam(id) { var e = MG.entities.enzyme[id]; return e ? e.family : ''; }
var receptor = which(iE.some(function (id) { return fam(id) === 'receptor'; }), eE.some(function (id) { return fam(id) === 'receptor'; }));
return [
T.ab('ap.receptor', 'Con đường nào bắt đầu từ thụ thể gây chết tế bào ở màng tế bào chất?', expect('cmp-apoptosis receptor', receptor, 'b'), [
'Tín hiệu đến từ bên ngoài tế bào.',
'TNF là phối tử ở đây.'
], note('enzyme', 'tnfr1')),
T.ab('ap.cytc', 'Con đường nào giải phóng cytochrome c từ ty thể?', expect('cmp-apoptosis cytochrome c', which(has(iM, 'cytcrel'), has(eM, 'cytcrel')), 'a'), [
'Tín hiệu này đến từ bên trong tế bào, chẳng hạn như tổn thương DNA nghiêm trọng.',
'Bax tạo nên các lỗ chân lông.'
], note('molecule', 'cytcrel')),
T.ab('ap.casp3', 'Con đường nào kết thúc bằng việc kích hoạt các caspase gây chết tế bào?', expect('cmp-apoptosis caspase-3', which(has(iE, 'casp3'), has(eE, 'casp3')), 'both'), [
'Hai tuyến đường gặp nhau ở cuối.',
'Caspase-3 thực hiện việc phân giải trong mỗi trường hợp.'
], note('molecule', 'execcasp')),
T.ab('ap.casp8', 'Con đường tín hiệu nào sử dụng caspase-8 làm chất khởi đầu?', expect('cmp-apoptosis caspase-8', which(has(iE, 'casp8'), has(eE, 'casp8')), 'b'), [
'Chất khởi đầu của nó được kích hoạt tại phức hợp thụ thể bởi FADD.',
'Con đường còn lại sử dụng caspase-9.'
], note('enzyme', 'casp8')),
T.sort('ap.sort', 'Mỗi phần tử thuộc về con đường nào?', [
['bax', 'Bax', expect('cmp-apoptosis Bax', which(has(iE, 'bax'), has(eE, 'bax')), 'a')], ['apaf', 'Apaf-1 và apoptosome', expect('cmp-apoptosis Apaf-1', which(has(iE, 'apaf1'), has(eE, 'apaf1')), 'a')],
['c9', 'Caspase-9', expect('cmp-apoptosis caspase-9', which(has(iE, 'casp9'), has(eE, 'casp9')), 'a')], ['c8', 'Caspase-8', 'b'],
['fadd', 'FADD', expect('cmp-apoptosis FADD', which(has(iE, 'fadd'), has(eE, 'fadd')), 'b')], ['tnf', 'TNF và TNFR1', expect('cmp-apoptosis TNF', which(has(iM, 'tnf'), has(eM, 'tnf')), 'b')],
['c3', 'Caspase-3', 'both'], ['dna', 'Tổn thương DNA nghiêm trọng', expect('cmp-apoptosis DNA damage', which(has(iM, 'dnadmg'), has(eM, 'dnadmg')), 'a')]
], T.abBuckets(), [
'Một con đường đi qua ty thể, con đường còn lại đi qua thụ thể và bộ chuyển đổi.',
'Chỉ có đao phủ là dùng chung.'
], 'Nguyên nhân nội tại: tổn thương DNA nghiêm trọng, Bax, cytochrome c, Apaf-1 và apoptosome, caspase-9. Nguyên nhân ngoại lai: TNF và TNFR1, FADD, caspase-8. Cả hai: caspase-3.'),
T.pick('ap.apoptosome', 'Apoptosome là gì?', [
['wheel', 'Một vòng gồm bảy phân tử Apaf-1, mỗi phân tử đều có cytochrome c và dATP, kích hoạt procaspase-9.'],
['receptor', 'Phức hợp TNF với ba chuỗi thụ thể'],
['pore', 'Một lỗ chân lông do Bax tạo ra ở màng ngoài của ty thể.']
], 'wheel', [
'Nó hình thành trong bào tương sau khi ty thể đã giải phóng một chất nào đó.',
'Nó là một nền tảng, không phải là một loại enzyme.'
], note('molecule', 'apoptosome'))
];
}
}));
register(comparison({
id: 'cmp-fission-fusion', title: 'Phân chia hay hợp nhất', subtitle: 'Cách ty thể phân chia và hợp nhất: các gTPase, các lớp màng và mục đích của từng quá trình',
a: { short: 'Phân hạch', label: 'Phân chia ty thể' }, b: { short: 'Hợp nhất', label: 'Sự hợp nhất ty thể' },
summary: 'Phân chia: Drp1, được Mff và Fis1 tuyển dụng, siết chặt vòng dẫn động bằng GTP và phân chia bào quan. Hợp nhất: các mitofusin kết nối màng ngoài và Opa1 kết nối màng trong.',
prompts: function (T) {
var md1 = reaction('mitodyn', 'md1'), md2 = reaction('mitodyn', 'md2'), md3 = reaction('mitodyn', 'md3');
expect('cmp-fission-fusion Drp1', md1.enzyme + '>' + products('mitodyn', md1)[0], 'drp1>mtfissioned');
expect('cmp-fission-fusion fusion', md2.enzyme + ',' + md3.enzyme + '>' + products('mitodyn', md3)[0], 'mfn,opa1>mtfused');
var allGtpase = enzymes('mitodyn').every(function (id) { return MG.entities.enzyme[id].family === 'gtpase'; });
return [
T.ab('ff.drp1', 'Drp1 điều khiển tiến trình nào?', 'a', [
'Nó tạo thành một vòng bao quanh bào quan và siết chặt lại.',
'Kết quả là có hai ty thể nhỏ hơn.'
], note('enzyme', 'drp1')),
T.ab('ff.mfn', 'Các mitofusin (Mfn1 và Mfn2) và Opa1 thúc đẩy quá trình nào?', 'b', [
'Hai ty thể hợp nhất thành một.',
'Màng ngoài trước, màng trong sau.'
], 'Các mitofusin kéo màng ngoài của hai ty thể lại gần nhau cho đến khi chúng hợp nhất; sau đó Opa1 sẽ hợp nhất màng trong.'),
T.ab('ff.gtp', 'Quá trình nào được thúc đẩy bởi sự thủy phân GTP?', expect('cmp-fission-fusion GTPases', allGtpase ? 'both' : 'differ', 'both'), [
'Hãy xem loại protein mà mỗi loại sử dụng.',
'Drp1, mitofusin và Opa1 là cùng một loại enzyme.'
], 'Drp1, Mfn1, Mfn2 và Opa1 đều là các GTPase: mỗi loại đều sử dụng năng lượng của GTP để định hình lại màng tế bào.'),
T.pick('ff.opa1', 'Opa1 hợp nhất với màng nào?', [
['inner', 'Màng trong của ty thể'], ['outer', 'Màng ngoài của ty thể'], ['plasma', 'Màng sinh chất']
], 'inner', [
'Các màng ngoài đã liên kết với nhau khi nó hoạt động.',
'Nó cũng định hình các mào xương.'
], note('enzyme', 'opa1')),
T.pick('ff.good', 'Phản ứng phân hạch có ích lợi gì?', [
['qc', 'Cắt bỏ phần bị hư hỏng để thực hiện quá trình tự thực bào ty thể, và tạo ra nhiều ty thể hơn.'],
['share', 'Trộn protein và mtDNA của hai ty thể'],
['pyr', 'Cho phép pyruvate đi qua màng ngoài']
], 'qc', [
'Hãy nghĩ đến khâu kiểm soát chất lượng.',
'Sản phẩm là nhiều bào quan nhỏ.'
], note('molecule', 'mtfissioned')),
T.sort('ff.sort', 'Mỗi phần tử thuộc quy trình nào?', [
['drp1', 'Drp1', 'a'], ['mfn', 'Mitofusin 1 và 2', 'b'], ['opa1', 'Opa1', 'b'], ['adaptors', 'Mff và Fis1, những chất tuyển dụng GTPase.', 'a'],
['gtp', 'GTP bị thủy phân', 'both'], ['order', 'Các màng ngoài nối với nhau trước, sau đó đến các màng trong.', 'b'], ['ring', 'Một vòng siết chặt quanh bào quan.', 'a']
], T.abBuckets(), [
'Các bộ phận thích ứng ở màng ngoài thu hút GTPase cắt.',
'Sự hợp nhất là một quá trình diễn ra giữa hai màng tế bào.'
], 'Phân tách: Drp1, được Mff và Fis1 tuyển dụng, siết chặt vòng. Hợp nhất: các mitofusin kết hợp với màng ngoài, sau đó Opa1 kết hợp với màng trong. Cả hai đều thủy phân GTP.')
];
}
}));
register(comparison({
id: 'cmp-q-cytc', title: 'Ubiquinone hay cytochrome c', subtitle: 'Hai chất mang di động trong chuỗi: một lipid nằm trong màng và một protein heme ở phía bên cạnh',
a: { short: 'Ubiquinone (Q)', label: 'Ubiquinol (QH' + SUB2 + ')', mol: 'ubiquinol' }, b: { short: 'Cytochrome c', label: 'Cytochrome c (nhóm heme của nó)', mol: 'cytcred' },
summary: 'Ubiquinone là một lipid trong màng tế bào, có chức năng vận chuyển hai electron từ phức hợp I và II đến phức hợp III; cytochrome c là một protein heme nằm trong không gian giữa màng, có chức năng vận chuyển một electron mỗi lần từ phức hợp III đến phức hợp IV.',
prompts: function (T) {
var c1 = reaction('etc', 'c1'), c2 = reaction('etc', 'c2'), c3 = reaction('etc', 'c3'), c4 = reaction('etc', 'c4');
expect('cmp-q-cytc Complex III', substrates('etc', c3)[0] + '>' + products('etc', c3)[0], 'ubiquinol>cytcred');
var collects = which(products('etc', c1)[0] === 'ubiquinol' && products('etc', c2)[0] === 'ubiquinol', products('etc', c1)[0] === 'cytcred' && products('etc', c2)[0] === 'cytcred');
var toC4 = which(substrates('etc', c4)[0] === 'ubiquinol', substrates('etc', c4)[0] === 'cytcred');
var apop = which(has(allMols('apopint'), 'ubiquinol'), has(allMols('apopint'), 'cytcrel'));
return [
T.ab('qc.protein', 'Chất vận chuyển nào là protein?', 'b', [
'Một chất mang là lipid nhỏ, chất còn lại là polypeptide nhỏ có chứa heme.',
'Nguyên tử sắt của nó nằm trong một vòng porphyrin.'
], note('molecule', 'cytcred')),
T.ab('qc.lipid', 'Chất vận chuyển nào hòa tan trong lipid của màng trong?', 'a', [
'Nó có một đuôi isoprenoid dài.',
'Nó di chuyển giữa các phức hợp bên trong màng tế bào.'
], note('molecule', 'ubiquinol')),
T.ab('qc.collect', 'Chất mang nào thu thập electron từ phức chất I và từ phức chất II?', expect('cmp-q-cytc collects', collects, 'a'), [
'Cả hai phức chất đều khử cùng một phân tử nhỏ.',
'Dạng khử của nó mang hai electron và hai proton.'
], 'Cả phức hợp I và II đều khử ubiquinone thành ubiquinol, chất này khuếch tán đến phức hợp III.'),
T.ab('qc.c4', 'Chất mang nào chuyển electron cho phức chất IV?', expect('cmp-q-cytc Complex IV', toC4, 'b'), [
'Nó hoạt động trong không gian giữa các màng.',
'Phức hợp III khử nó, từng electron một.'
], 'Phức hợp IV: ' + c4.equation + '.'),
T.ab('qc.one', 'Loại hạt tải nào vận chuyển từng electron một?', 'b', [
'Sắt trong đó chuyển đổi giữa hai trạng thái oxy hóa.',
'Hạt tải điện còn lại mang theo hai electron và hai proton.'
], 'Cytochrome c mang một electron: sắt heme của nó chuyển từ Fe³⁺ sang Fe²⁺ và ngược lại. Ubiquinone nhận hai electron và hai proton để trở thành ubiquinol.'),
T.ab('qc.apop', 'Chất vận chuyển nào được giải phóng từ ty thể như một tín hiệu cho quá trình apoptosis?', expect('cmp-q-cytc apoptosis', apop, 'b'), [
'Khi vào trong bào tương, nó sẽ kết hợp với Apaf-1.',
'Các lỗ chân lông của Bax ở màng ngoài cho phép nó thoát ra ngoài.'
], note('molecule', 'cytcrel')),
T.sort('qc.sort', 'Mỗi câu tuyên bố phù hợp với hãng vận chuyển nào?', [
['tail', 'Đuôi isoprenoid', 'a'], ['heme', 'Sắt heme, Fe²⁺ và Fe³⁺', 'b'], ['two', 'Mang hai electron và hai proton.', 'a'],
['ims', 'Nằm trong không gian giữa các màng', 'b'], ['redc3', 'Được khử bởi phức hợp III', 'b'], ['gp', 'Giảm thiểu nhờ cơ chế vận chuyển glycerol phosphate.', 'a'],
['oxc3', 'Bị oxy hóa bởi phức hợp III', 'a']
], T.twoBuckets(), [
'Một chất được khử bởi các dehydrogenase, chất còn lại bởi phức hợp III.',
'Hãy nghĩ xem bên trong màng có gì và bên cạnh nó có gì.'
], 'Ubiquinone: đuôi isoprenoid, hai electron và hai proton, bị khử bởi phức hợp I và II và bởi hệ thống vận chuyển glycerol phosphate, bị oxy hóa bởi phức hợp III. Cytochrome c: sắt heme, nằm trong không gian giữa màng, bị khử bởi phức hợp III và bị oxy hóa bởi phức hợp IV.')
];
}
}));
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var GROUP = 'Cơ chế';
var SUB2 = '₂';
var CO2 = 'CO' + SUB2;
var H2O = 'H' + SUB2 + 'O';
var O2 = 'O' + SUB2;
var FADH2 = 'FADH' + SUB2;
var NADPLUS = 'NAD⁺';
var PI = 'Pᵢ';
var ARROW = ' → ';
function register(game) {
var list = MG.games = MG.games || [];
var at = list.length;
for (var i = 0; i < list.length; i++) { if (list[i].pack) { at = i; break; } }
list.splice(at, 0, game);
}
function fail(msg) { throw new Error('games/mechanisms.js: ' + msg); }
function equation(pathwayId, rid) {
var p = MG.pathways && MG.pathways[pathwayId];
var rs = p ? p.reactions : [];
for (var i = 0; i < rs.length; i++) { if (rs[i].id === rid) { return rs[i].equation; } }
return fail('no step ' + rid + ' in ' + pathwayId);
}
function fig(mol, label) {
return MG.geometry && MG.geometry[mol] ? { mol: mol, label: label } : null;
}
function walkthrough(spec) {
function build() {
var n = spec.moves.length;
var prompts = spec.moves.map(function (m, i) {
var after = m.after ? (Array.isArray(m.after) ? m.after : [m.after]) : [];
after = after.filter(function (f) { return !!f; });
var p = {
id: m.id, kind: 'pick', group: 'Move ' + (i + 1) + ' of ' + n, text: m.text, figure: null, optionStyle: 'text',
options: [{ id: 'a', label: m.right }, { id: 'b', label: m.wrong[0] }, { id: 'c', label: m.wrong[1] }], answer: 'a',
hints: m.hints, explain: m.explain
};
if (i === 0 && spec.start) { p.figures = [spec.start]; }
if (after.length) { p.figuresAfter = after; }
return p;
});
return { intro: spec.subtitle, summary: spec.summary, prompts: prompts };
}
return { id: spec.id, title: spec.title, subtitle: spec.subtitle, group: GROUP, count: spec.moves.length, fixedOrder: true, summary: spec.summary, build: build };
}
register(walkthrough({
id: 'mech-aldolase', title: 'Aldolase: Bazơ Schiff', subtitle: 'Cách lysine tại enzyme giúp phân cắt đường sáu carbon thành hai phân tử ba carbon',
summary: 'Aldolase giữ đường dưới dạng bazơ Schiff lysine, một chất nhận electron cho phép liên kết giữa carbon 3 và 4 bị phá vỡ: fructose 1,6-bisphosphate tạo ra glyceraldehyde 3-phosphate và dihydroxyacetone phosphate.',
start: fig('f16bp', 'Fructose 1,6-bisphosphate'),
moves: [
{
id: 'al.1', text: 'Fructose 1,6-bisphosphate liên kết với nhóm ketone ở vị trí carbon 2 bên cạnh lysine tại vị trí hoạt động. Điều gì sẽ xảy ra tiếp theo?',
right: 'Amin lysine tấn công nhóm carbonyl ở carbon 2 và, sau khi nước tách ra, tạo thành bazơ Schiff được proton hóa (một iminium).',
wrong: ['Một thiolat cysteine tấn công nhóm phosphate trên carbon 1 và loại bỏ nó.', NADPLUS + ' lấy một hydride từ cacbon 2'],
hints: ['Enzyme sẽ tạo liên kết cộng hóa trị với chất nền trước tiên.', 'Nhóm mới là một liên kết đôi cacbon-nitơ với enzyme.'],
explain: 'Aldolase loại I hoạt động thông qua liên kết Schiff cộng hóa trị: nguyên tử nitơ của lysine tạo thành liên kết C=N⁺ với carbon số 2, biến carbon đó thành nơi nhận electron. (Aldolase loại II của vi khuẩn và nấm sử dụng ion kẽm cho cùng chức năng này.)'
},
{
id: 'al.2', text: 'Cấu trúc Schiff base đã được proton hóa. Điều gì sẽ xảy ra tiếp theo?',
right: 'Một bazơ loại bỏ proton từ nhóm hydroxyl của cacbon 4 và liên kết giữa cacbon 3 và 4 bị phá vỡ, giải phóng glyceraldehyde 3-phosphate',
wrong: ['Một bazơ loại bỏ một proton từ cacbon 1 và liên kết giữa cacbon 1 và 2 bị phá vỡ, giải phóng một nhóm phosphat.', 'Nước tấn công carbon số 2 và bazơ Schiff bị thủy phân trở lại thành đường tự do.'],
hints: ['Đây là phản ứng ngược lại của phản ứng cộng aldol.', 'Các electron của liên kết bị phá vỡ sẽ di chuyển về phía nguyên tử nitơ mang điện tích dương.'],
explain: 'Bước phản ứng retro-aldol: các electron của liên kết C3-C4 bị phá vỡ chảy vào iminium, tạo thành enamine của nửa ba carbon vẫn còn trên enzyme, và các carbon từ 4 đến 6 tách ra dưới dạng glyceraldehyde 3-phosphate.',
after: fig('g3p', 'Glyceraldehyde 3-phosphate để lại')
},
{
id: 'al.3', text: 'Enamin ba cacbon vẫn còn liên kết với lysine. Điều gì sẽ xảy ra tiếp theo?',
right: 'Enamin bị proton hóa tại cacbon 3, tạo lại iminium (bazơ Schiff), lúc này là dihydroxyacetone phosphate',
wrong: ['Enamin bị oxy hóa bởi ' + NADPLUS + ' thành thioeste', 'Enamin mất đi nhóm phosphat dưới dạng phosphat vô cơ.'],
hints: ['Enamin là thành phần giàu electron; nó thu nhận những electron mà bazơ đã lấy đi trước đó.', 'Không có chất đồng yếu tố nào tham gia vào bất kỳ giai đoạn nào của enzyme này.'],
explain: 'Sự proton hóa enamine tại carbon 3 khôi phục lại cấu trúc Schiff base, lần này với nhóm ketose ba carbon vẫn còn gắn với lysine.'
},
{
id: 'al.4', text: 'Bazơ Schiff của dihydroxyacetone phosphate đã liên kết. Điều gì sẽ xảy ra tiếp theo?',
right: 'Nước được thêm vào carbon 2 và liên kết Schiff bị thủy phân, giải phóng dihydroxyacetone phosphate và lysine tự do.',
wrong: ['ATP phosphoryl hóa nguyên tử carbon 1 trước khi sản phẩm có thể rời đi.', 'Lysine rời khỏi enzyme như một phần của sản phẩm.'],
hints: ['Liên kết cộng hóa trị được tạo ra trong bước đầu tiên cần phải được phá vỡ.', 'Bước này ngược lại với cách hình thành bazơ Schiff.'],
explain: 'Quá trình thủy phân bazơ Schiff giải phóng sản phẩm thứ hai và trả lại lysine cho vòng tiếp theo: ' + equation('glycolysis', 'aldolase') + '.',
after: fig('dhap', 'Dihydroxyacetone phosphate lá')
},
{
id: 'al.5', text: 'Tại sao enzyme lại phải tốn công tạo ra liên kết Schiff?',
right: 'C=N⁺ đã được proton hóa là một chất nhận electron tốt hơn nhiều so với xeton thông thường, do đó liên kết carbon-carbon có thể bị phá vỡ.',
wrong: ['Nó ngăn không cho đường rời khỏi vị trí hoạt động trước khi bị phosphoryl hóa.', 'Nó cung cấp năng lượng tương đương hai phân tử ATP mà quá trình phân cắt cần.'],
hints: ['Hãy suy nghĩ xem các electron của liên kết bị phá vỡ sẽ đi về đâu.', 'Không tốn chi phí nào ở bước này; thao tác hoàn toàn có thể đảo ngược.'],
explain: 'Iminium mang điện tích dương hút electron mạnh hơn nhiều so với carbonyl trung tính, đó là lý do tại sao phản ứng phân cắt retro-aldol (và, theo chiều ngược lại, phản ứng ngưng tụ aldol trong quá trình tân tạo glucose) có thể diễn ra mà không cần bất kỳ chất xúc tác nào.'
}
]
}));
register(walkthrough({
id: 'mech-tpi', title: 'Triose phosphate isomerase: enediol', subtitle: 'Cách nhóm carbonyl chuyển từ carbon số 2 sang carbon số 1 thông qua cis-enediol',
summary: 'Triose phosphate isomerase chuyển nhóm carbonyl từ carbon 2 sang carbon 1 thông qua cis-enediol, với glutamate làm bazơ và histidine làm axit, và một vòng xoắn giữ cho chất trung gian không bị mất nhóm phosphate.',
start: fig('dhap', 'Dihydroxyacetone phosphate'),
moves: [
{
id: 'tp.1', text: 'Dihydroxyacetone phosphate liên kết. Điều gì sẽ xảy ra tiếp theo?',
right: 'Một glutamat ở vị trí hoạt động loại bỏ một proton từ carbon 1, trong khi một histidine phân cực nhóm carbonyl của carbon 2.',
wrong: ['Photphat được chuyển lên enzyme.', 'Nước cộng vào cacbonyl cacbonyl ở vị trí cacbon 2 để tạo thành hydrat.'],
hints: ['Nguyên tử carbon liền kề với nhóm carbonyl có các proton mà một bazơ có thể lấy đi.', 'Axit và bazơ cùng hoạt động ở hai đầu của liên kết C1-C2.'],
explain: 'Glutamate là bazơ chung; việc lấy proton từ carbon 1 tạo ra enolate, mà histidine ổn định bằng cách proton hóa oxy cacbonyl.'
},
{
id: 'tp.2', text: 'Nguyên tử proton đã rời khỏi nguyên tử carbon 1. Chất trung gian nào được hình thành?',
right: 'Một cis-enediol (enediolate), với liên kết đôi giữa cacbon 1 và 2 và một nhóm hydroxyl trên mỗi nguyên tử cacbon.',
wrong: ['Một liên kết Schiff giữa chất nền và lysine', 'Methylglyoxal, sau khi phosphat bị loại bỏ'],
hints: ['Cả hai nguyên tử oxy giờ đều đã được chuyển hóa thành nhóm hydroxyl.', 'Nó là chất trung gian phổ biến giữa ketose và aldose.'],
explain: 'Enediol có liên kết đôi C1=C2 với nhóm hydroxyl trên mỗi nguyên tử carbon; nó là điểm trung gian giữa dihydroxyacetone phosphate (nhóm ketone ở carbon 2) và glyceraldehyde 3-phosphate (nhóm aldehyde ở carbon 1).'
},
{
id: 'tp.3', text: 'Enediol đã nằm trong vị trí hoạt động. Điều gì sẽ xảy ra tiếp theo?',
right: 'Nguyên tử glutamat nhường proton của nó cho cacbon 2 trong khi nhóm hydroxyl ở cacbon 1 nhường proton của nó, do đó tạo thành anđehit ở cacbon 1.',
wrong: ['ATP phosphoryl hóa nhóm hydroxyl ở carbon 2.', NADPLUS + ' oxy hóa cacbon 1 thành cacboxylat'],
hints: ['Cùng một bazơ đó giờ lại hoạt động như một axit, tác dụng lên nguyên tử cacbon còn lại.', 'Không có chất đồng yếu tố nào tham gia vào bất kỳ giai đoạn nào của enzyme này.'],
explain: 'Glyceraldehyde 3-phosphate được hình thành: nhóm carbonyl đã chuyển từ carbon 2 sang carbon 1 (' + equation('glycolysis', 'tpi') + ').',
after: fig('g3p', 'Glyceraldehyde 3-phosphate')
},
{
id: 'tp.4', text: 'Tại sao vòng xoắn của enzyme lại khép lại trên vị trí hoạt động trong quá trình phản ứng?',
right: 'Để ngăn enediol phosphate loại bỏ nhóm phosphate của nó, điều này sẽ tạo ra methylglyoxal độc hại.',
wrong: ['Để ngăn oxy xâm nhập, vì chất trung gian là một gốc tự do.', 'Để giữ lại lượng ATP cần thiết cho phản ứng.'],
hints: ['Chất trung gian có một nhóm rời đi ngay cạnh liên kết đôi của nó.', 'Phản ứng phụ tạo ra một hợp chất hai cacbonyl độc hại và photphat vô cơ.'],
explain: 'Ở dạng tự do trong dung dịch, enediol phosphate sẽ mất nhóm phosphate để tạo thành methylglyoxal; vòng khép kín giữ nhóm phosphate và khiến cho quá trình đồng phân hóa gần như là kết quả duy nhất.'
},
{
id: 'tp.5', text: 'Glyceraldehyde 3-phosphate tách ra. Tại sao phản ứng cứ tiếp diễn theo cách này, mặc dù ở trạng thái cân bằng, dihydroxyacetone phosphate được ưu tiên hơn?',
right: 'GAPDH loại bỏ glyceraldehyde 3-phosphate ngay lập tức, do đó chất này không bao giờ tích tụ.',
wrong: ['Enzyme này tiêu thụ ATP để thúc đẩy phản ứng.', 'Dihydroxyacetone phosphate bị phân hủy bởi enzyme'],
hints: ['Hãy nghĩ về enzyme tiếp theo của quá trình đường phân.', 'Việc loại bỏ một sản phẩm giúp duy trì phản ứng thuận nghịch.'],
explain: 'Ở trạng thái cân bằng, khoảng 96% hỗn hợp là dihydroxyacetone phosphate, nhưng enzyme tiếp theo giữ cho glyceraldehyde 3-phosphate ở mức thấp, do đó cả hai phần glucose đều tiếp tục chảy qua giai đoạn thu lợi nhuận.'
}
]
}));
register(walkthrough({
id: 'mech-gapdh', title: 'GAPDH: thioester, rồi đến acyl phosphate', subtitle: 'Cách phản ứng oxy hóa cung cấp năng lượng để tạo liên kết phosphate giàu năng lượng',
summary: 'GAPDH oxy hóa aldehyd thành thioeste trên cysteine của nó, khử NAD⁺, và sau đó cho phép phosphat (không phải nước) lấy nhóm acyl, do đó năng lượng của quá trình oxy hóa được giữ lại trong 1,3-bisphosphoglycerate.',
start: fig('g3p', 'Glyceraldehyde 3-phosphate'),
moves: [
{
id: 'gd.1', text: 'Glyceraldehyde 3-phosphate liên kết bên cạnh ' + NADPLUS + 'Điều gì sẽ xảy ra tiếp theo?',
right: 'Một nhóm thiol cysteine tại vị trí hoạt động tấn công nguyên tử cacbon của aldehyd, tạo thành thiohemiacetal.',
wrong: ['Photphat vô cơ tấn công trực tiếp vào cacbon của anđehit.', NADPLUS + ' phosphoryl hóa aldehyd'],
hints: ['Enzyme sẽ tạo liên kết cộng hóa trị với chất nền trước tiên.', 'Iodoacetate tiêu diệt enzyme này bằng cách alkyl hóa nhóm tấn công.'],
explain: 'Thiohemiacetal liên kết carbon 1 với cysteine của enzyme; chất trung gian cộng hóa trị này cho phép thu giữ năng lượng oxy hóa trong các bước tiếp theo.'
},
{
id: 'gd.2', text: 'Thiohemiacetal được hình thành. Điều gì sẽ xảy ra tiếp theo?',
right: 'Một nguyên tử hydride từ cacbon 1 được chuyển đến ' + NADPLUS + ', để lại một acyl thioester trên enzyme và NADH',
wrong: ['Thiohemiacetal mất nước để tạo thành thioeste mà không thay đổi trạng thái oxy hóa.', 'FAD lấy hai nguyên tử hydro từ cacbon 1 và 2.'],
hints: ['Đây là bước oxy hóa, và chất mang là nicotinamide.', 'Sản phẩm là một nhóm acyl được giữ dưới dạng thioeste, chứ không phải là một axit tự do.'],
explain: 'Anđehit bị oxy hóa thành nhóm acyl, nhưng năng lượng của nó được giữ lại dưới dạng thioeste năng lượng cao thay vì bị mất đi dưới dạng nhiệt; các electron chuyển đến ' + NADPLUS + '.'
},
{
id: 'gd.3', text: 'NADH liên kết và tạo thành thioeste acyl-enzyme. Điều gì sẽ xảy ra tiếp theo?',
right: 'Lá NADH và một loại mới ' + NADPLUS + ' liên kết với enzyme',
wrong: ['ADP liên kết và lấy nhóm acyl để tạo thành ATP.', 'Nước thủy phân thioeste thành 3-phosphoglycerat'],
hints: ['Chất mang vừa được giảm bớt không cần thiết cho phần còn lại của chu kỳ.', 'Nhóm acyl vẫn bám trên enzyme thêm một bước nữa.'],
explain: 'Chất mang bị khử được thay thế bằng chất mang bị oxy hóa trước khi nhóm acyl được giải phóng; NADH đi vào các chất vận chuyển, chuỗi phản ứng hoặc quá trình lên men.'
},
{
id: 'gd.4', text: 'Acyl thioeste đã sẵn sàng. Bước tiếp theo là gì?',
right: 'Photphat vô cơ tấn công cacbon thioeste, giải phóng 1,3-bisphosphoglycerat (một acyl photphat) và cysteine tự do.',
wrong: ['Nước thủy phân thioeste, giải phóng 3-phosphoglycerate', 'ADP tấn công thioester, tạo ra ATP trực tiếp.'],
hints: ['Phản ứng photphoryl hóa, không phải thủy phân.', 'Sản phẩm vẫn giữ liên kết năng lượng cao, hiện tại nằm trên nguyên tử carbon số 1.'],
explain: 'Photphat gắn với nhóm acyl: ' + equation('glycolysis', 'gapdh') + 'Acyl phosphate mang năng lượng đến phosphoglycerate kinase, enzyme này sẽ tạo ra ATP từ năng lượng đó.',
after: fig('bpg13', '1,3-Bisphosphoglycerate')
},
{
id: 'gd.5', text: 'Asenat (AsO₄³⁻) có thể thay thế photphat trong bước cuối cùng. Điều gì sẽ xảy ra sau đó?',
right: '1-Arseno-3-phosphoglycerate tự hình thành và thủy phân thành 3-phosphoglycerate, do đó bước tiếp theo không tạo ra ATP.',
wrong: ['Enzyme bị vô hiệu hóa bằng liên kết cộng hóa trị, tương tự như trường hợp của iodoaxetat.', 'Không có gì: arsenat quá lớn để chứa trong trang web.'],
hints: ['Este arsenat không bền trong nước.', 'Quá trình đường phân vẫn tiếp diễn, nhưng lợi ích của bước này đã bị mất đi.'],
explain: 'Acyl arsenat bị phân hủy trước khi phosphoglycerate kinase có thể sử dụng nó, do đó quá trình đường phân vẫn tiếp diễn nhưng mất đi một ATP cho mỗi triose: đây là lý do tại sao arsenat tách rời quá trình đường phân khỏi quá trình tổng hợp ATP.'
}
]
}));
register(walkthrough({
id: 'mech-pdc', title: 'Phức hợp pyruvate dehydrogenase: E1, E2, E3', subtitle: 'Năm đồng yếu tố theo thứ tự: TPP, lipoamide, coenzyme A, FAD và NAD⁺',
summary: 'TPP ở E1 khử carboxyl pyruvate, lipoamide ở E2 mang và oxy hóa hai nguyên tử carbon rồi chuyển chúng cho coenzyme A, và FAD sau đó NAD⁺ ở E3 mang các electron đi: pyruvate + CoA + NAD⁺ tạo ra acetyl-CoA, CO₂ và NADH.',
start: fig('pyruvate', 'Pyruvat'),
moves: [
{
id: 'pd.1', text: 'Pyruvate đi đến E1, nơi chứa thiamine pyrophosphate (TPP). Điều gì sẽ xảy ra tiếp theo?',
right: 'Anion cacbon TPP (ylide) tấn công nhóm cacbonyl cacbon 2 của pyruvat, và sản phẩm cộng hợp bị mất đi ' + CO2 + ', để lại hydroxyethyl-TPP',
wrong: ['Lipoamide tấn công trực tiếp pyruvate và giải phóng ' + CO2, NADPLUS + ' oxy hóa pyruvat thành axetat và ' + CO2],
hints: ['Vòng thiazolium của coenzyme có thể mất một proton và trở thành carbanion.', 'Nguyên tử carbon rời đi chính là nguyên tử carbon của nhóm carboxyl.'],
explain: 'TPP là đồng yếu tố của mọi phản ứng khử cacbon của axit α-keto: vòng thiazolium của nó ổn định anion cacbon còn lại sau phản ứng. ' + CO2 + ' lá, tạo ra hydroxyethyl-TPP trên E1.'
},
{
id: 'pd.2', text: 'Hydroxyethyl-TPP nằm trên E1, và nhánh lipoyl dài của E2 xoay vào. Điều gì sẽ xảy ra tiếp theo?',
right: 'Nhóm hydroxyethyl bị oxy hóa thành nhóm acetyl và được chuyển đến lipoamide, sau đó liên kết disulfide của lipoamide bị khử: acetyl-dihydrolipoamide',
wrong: ['Nhóm hydroxyethyl được chuyển sang coenzyme A mà không bị biến đổi.', 'FAD oxy hóa nhóm hydroxyethyl thành acetyl-TPP.'],
hints: ['Cánh tay này mang một liên kết disulfide có thể nhận hai electron.', 'Hai nguyên tử carbon này cuối cùng tạo thành một thioester trên nhánh.'],
explain: 'Các electron của quá trình oxy hóa khử liên kết disulfide của lipoamit, và nhóm acetyl được giữ lại dưới dạng thioeste trên nhánh lipoyl, nhánh này dao động giữa ba enzyme.'
},
{
id: 'pd.3', text: 'Acetyl-dihydrolipoamide nằm trên E2. Điều gì sẽ xảy ra tiếp theo?',
right: 'E2 chuyển nhóm acetyl cho coenzyme A, giải phóng acetyl-CoA và để lại dihydrolipoamide.',
wrong: ['Nhóm acetyl được giải phóng dưới dạng acetate tự do.', NADPLUS + ' lấy nhóm acetyl'],
hints: ['Nhóm acetyl di chuyển từ chất mang thiol này sang chất mang thiol khác.', 'Sản phẩm này được chuyển đến citrate synthase.'],
explain: 'Phản ứng chuyển nhóm acetyl: năng lượng của nhóm thioester được giữ lại trong acetyl-CoA, chất này cung cấp nguyên liệu cho chu trình TCA, trong khi nhánh lipoyl vẫn ở trạng thái khử hoàn toàn.',
after: fig('acetylcoa', 'Acetyl-CoA')
},
{
id: 'pd.4', text: 'Nhóm lipoyl vẫn ở trạng thái khử hoàn toàn (dihydrolipoamide). Điều gì sẽ xảy ra tiếp theo?',
right: 'E3 tái oxy hóa nó thành disulfide, truyền hai electron cho FAD của nó.',
wrong: ['Nó vẫn ở mức thấp và phức hợp dừng lại.', 'Coenzyme A tái oxy hóa nó'],
hints: ['Cần phải khôi phục lại cấu trúc cánh tay trước khi E2 có thể nhận nhóm acetyl tiếp theo.', 'Enzyme thứ ba là một flavoprotein.'],
explain: 'E3, dihydrolipoyl dehydrogenase, khôi phục liên kết disulfide của lipoamide và giữ các electron trong giây lát trên FAD của nó.'
},
{
id: 'pd.5', text: 'E3 hiện đang diễn ra ' + FADH2 + 'Điều gì sẽ xảy ra tiếp theo?',
right: FADH2 + ' truyền các electron đến ' + NADPLUS + ', tạo ra NADH, và FAD lại sẵn sàng hoạt động.',
wrong: [FADH2 + ' truyền các electron đến ubiquinone trong màng tế bào.', FADH2 + ' chuyển hóa pyruvate thành lactate'],
hints: ['Phức hợp này nằm trong chất nền, chứ không phải trong màng tế bào.', 'Chất mang hòa tan rời khỏi phức hợp là nicotinamide.'],
explain: 'Các electron kết thúc ở NADH, sau đó chuyển đến phức hợp I. Toàn bộ phức hợp: ' + equation('pdhtca', 'pdc') + '.'
}
]
}));
register(walkthrough({
id: 'mech-aconitase', title: 'Aconitase: qua cis-aconitate', subtitle: 'Cách nhóm hydroxyl chuyển từ carbon này sang carbon kế tiếp trên cụm iron-sulfur không tham gia phản ứng oxy hóa-khử',
summary: 'Aconitase loại bỏ nước để tạo ra cis-aconitate và gắn lại nước đó vào nguyên tử carbon còn lại: nhóm hydroxyl di chuyển từ carbon bậc ba của citrate sang carbon bậc hai trong isocitrate, nơi nó có thể bị oxy hóa.',
start: fig('citrate', 'Citrate'),
moves: [
{
id: 'ac.1', text: 'Citrate liên kết với aconitase. Điều gì giữ nó lại?',
right: 'Nhóm hydroxyl và nhóm carboxylate của nó liên kết với sắt của cụm [4Fe-4S] không có phối tử cysteine.',
wrong: ['Một bazơ Schiff với lysine', 'Ion magiê liên kết với ATP'],
hints: ['Enzyme này có một cụm kim loại, nhưng nó không có chức năng vận chuyển electron.', 'Một nguyên tử sắt trong cụm có thể tự do liên kết với chất nền.'],
explain: 'Aconitase là một loại enzyme sắt-lưu huỳnh không tham gia vào phản ứng oxy hóa khử: nguyên tử sắt lộ ra trong cụm hoạt động như một axit Lewis giữ chặt chất nền và giúp nhóm hydroxyl tách ra.'
},
{
id: 'ac.2', text: 'Citrate được giữ lại trên cụm. Điều gì sẽ xảy ra tiếp theo?',
right: 'Một bazơ loại bỏ một proton từ nguyên tử carbon liền kề với nhóm hydroxyl, và nhóm hydroxyl tách ra dưới dạng nước, tạo thành liên kết đôi: cis-aconitate',
wrong: [NADPLUS + ' oxy hóa nhóm hydroxyl thành xeton', 'Một nhóm carboxyl tách ra như ' + CO2],
hints: ['Một phân tử rượu và một proton lân cận sẽ cùng rời đi.', 'Chất trung gian là phân tử mà enzyme được đặt tên theo.'],
explain: 'Quá trình khử nước tạo ra cis-aconitate, chất trung gian liên kết với enzyme: ' + equation('tca', 'aconitase') + '.'
},
{
id: 'ac.3', text: 'cis-Aconitate đã được liên kết. Vậy enzyme tạo ra isocitrate từ nó như thế nào?',
right: 'Nước cộng hợp trở lại qua liên kết đôi, với nhóm hydroxyl giờ nằm trên nguyên tử carbon đã mất proton và proton nằm trên nguyên tử carbon đã mất nhóm hydroxyl.',
wrong: [NADPLUS + ' oxy hóa liên kết đôi', CO2 + ' được thêm vào qua liên kết đôi'],
hints: ['Nửa sau là nửa đầu đảo ngược, nhưng ở nguyên tử carbon khác.', 'Chu trình trung gian diễn ra ở vị trí giữa hai nửa.'],
explain: 'cis-Aconitate bị lật ngược trong vị trí hoạt động, do đó nước được thêm vào theo chiều ngược lại và nhóm hydroxyl kết thúc ở nguyên tử carbon liền kề: isocitrate.',
after: fig('isocitrate', 'Isocitrate')
},
{
id: 'ac.4', text: 'Việc di chuyển nhóm hydroxyl đã đạt được điều gì?',
right: 'Rượu bậc ba không thể bị oxy hóa đã trở thành rượu bậc hai mà isocitrate dehydrogenase có thể oxy hóa.',
wrong: ['Phân tử đã mất đi một nguyên tử carbon.', 'Phân tử này hiện đang giữ một nhóm phosphate năng lượng cao.'],
hints: ['Hãy nhìn vào nguyên tử carbon mang nhóm hydroxyl trong citrate: nó liên kết với bao nhiêu nguyên tử carbon?', 'Enzyme tiếp theo cần một nguyên tử hydro trên nguyên tử carbon đó.'],
explain: 'Trong citrate, nhóm hydroxyl nằm trên một nguyên tử carbon không có hydro, do đó nó không thể bị oxy hóa thành ketone. Trong isocitrate, nó nằm trên một nguyên tử carbon bậc hai, và isocitrate dehydrogenase có thể lấy một hydride từ đó.'
},
{
id: 'ac.5', text: 'Chất độc fluoroacetate được tế bào chuyển hóa thành fluorocitrate. Quá trình này có tác dụng gì?',
right: 'Nó liên kết với aconitase và ngăn chặn hoạt động của nó, do đó citrate tích tụ lại và chu trình dừng lại.',
wrong: ['Nó tách rời chuỗi vận chuyển electron.', 'Nó ngăn chặn citrate synthase'],
hints: ['Enzyme citrate synthase xử lý fluoroacetyl-CoA như thể đó là acetyl-CoA.', 'Sản phẩm này sau đó sẽ làm tắc nghẽn enzyme tiếp theo trong chu trình.'],
explain: 'Fluoroacetyl-CoA được chuyển hóa bởi citrate synthase thành fluorocitrate, một chất ức chế mạnh aconitase: citrate tích tụ và chu trình TCA dừng lại, đó là lý do tại sao fluoroacetate lại độc hại đến vậy.'
}
]
}));
register(walkthrough({
id: 'mech-atpsynthase', title: 'ATP synthase: chu trình thay đổi liên kết (binding-change)', subtitle: 'Mở (open), lỏng (loose) và chặt (tight): cách trục quay làm ba vị trí luân phiên nhau',
summary: 'Dòng proton làm quay trục γ; mỗi bước 120 độ biến L thành T (ATP được hình thành), T thành O (ATP được giải phóng) và O thành L (ADP và Pᵢ liên kết): ba ATP mỗi vòng quay, với năng lượng được tiêu hao để giải phóng ATP.',
start: fig('etcadp', 'ADP'),
moves: [
{
id: 'as.1', text: 'ADP và ' + PI + ' nằm trong tiểu đơn vị β của F₁ ở dạng lỏng lẻo (L). Điều gì thúc đẩy sự thay đổi tiếp theo?',
right: 'Các proton di chuyển theo hướng dốc của chúng qua F₀, làm quay vòng c và trục γ bên trong F₁.',
wrong: ['Sự thủy phân GTP bởi tiểu đơn vị γ', 'Sự gắn kết của NADH với các tiểu đơn vị α'],
hints: ['Năng lượng đến từ sự chênh lệch độ dốc được tạo ra bởi quá trình vận chuyển electron.', 'Một phần của enzyme là động cơ quay trong màng tế bào.'],
explain: 'F₀ là kênh proton và rôto trong màng; các proton đi qua nó làm quay vòng c, và trục γ gắn với nó quay bên trong đầu α₃β₃.'
},
{
id: 'as.2', text: 'Trục γ quay 120 độ. Điều gì sẽ xảy ra với ba tiểu đơn vị β?',
right: 'Mỗi chất đều thay đổi hình dạng: L trở thành T, T trở thành O và O trở thành L.',
wrong: ['Cả ba đều trở thành T cùng một lúc.', 'Các tiểu đơn vị β xoay cùng với trục nhưng vẫn giữ nguyên hình dạng.'],
hints: ['Trục này không đối xứng, do đó mỗi tiểu đơn vị β cảm nhận một mặt khác nhau của nó.', 'Ba trang web, ba mẫu đơn, mỗi mẫu một bước.'],
explain: 'Trục γ bất đối xứng buộc mỗi tiểu đơn vị β phải có một dạng khác nhau, do đó một vòng quay hoàn chỉnh sẽ lần lượt đưa mọi vị trí đi qua cả ba dạng.'
},
{
id: 'as.3', text: 'Trang web chứa ADP và ' + PI + ' Hiện giờ nó đang bị siết chặt (T). Chuyện gì sẽ xảy ra ở đó?',
right: 'ADP và ' + PI + ' cô đọng thành ATP, chất này vẫn liên kết chặt chẽ; tại vị trí T, trạng thái cân bằng nghiêng về phía ATP.',
wrong: ['ATP bị thủy phân để bơm proton.', PI + ' được chuyển sang tiểu đơn vị γ'],
hints: ['Việc tạo dựng mối liên kết không phải là phần khó ở đây.', 'Sản phẩm vẫn chưa được xuất xưởng.'],
explain: 'Tại vị trí chặt chẽ, sự ngưng tụ của ADP và ' + PI + ' Trạng thái gần cân bằng và không cần năng lượng; ATP được tạo thành vẫn ở dạng liên kết.'
},
{
id: 'as.4', text: 'Lần rẽ 120 độ tiếp theo sẽ mở ra vị trí đó (O). Điều gì sẽ xảy ra?',
right: 'ATP được giải phóng; năng lượng của dòng proton chủ yếu được sử dụng để giải phóng ATP liên kết chặt chẽ.',
wrong: ['ATP lại bị thủy phân.', 'ADP rời đi mà không trải qua quá trình phosphoryl hóa.'],
hints: ['Hãy suy nghĩ xem bước nào thực sự tiêu tốn năng lượng.', 'Dạng mở chỉ liên kết yếu với các nucleotide.'],
explain: 'Việc giải phóng ATP từ vị trí liên kết chặt chẽ là bước cần năng lượng; vị trí liên kết mở sẽ giải phóng ATP và sẵn sàng cho ADP mới. ' + PI + ': ' + equation('etc', 'c5') + '.',
after: fig('etcatp', 'ATP')
},
{
id: 'as.5', text: 'Trục đã quay một vòng hoàn chỉnh. Enzyme đã tạo ra gì, và tại sao một vòng quay lại cần ba bước?',
right: 'Ba phân tử ATP, mỗi phân tử dành cho một tiểu đơn vị β, vì mỗi vị trí cần một vòng quay hoàn chỉnh để đi qua L, T và O.',
wrong: ['Một phân tử ATP, vì chỉ có vị trí T mới có thể tạo ra ATP.', 'Mười hai phân tử ATP, mỗi phân tử tương ứng với một proton đã đi qua.'],
hints: ['Đếm số vị trí xúc tác.', 'Mỗi trang web sẽ duyệt qua tất cả các biểu mẫu một lần trong mỗi lượt.'],
explain: 'F₁ có ba tiểu đơn vị β xúc tác, và một vòng quay hoàn chỉnh (ba bước 120 độ) đưa mỗi tiểu đơn vị đi qua L, T và O một lần, do đó một vòng quay tạo ra ba ATP.'
}
]
}));
register(walkthrough({
id: 'mech-qcycle', title: 'Complex III: chu trình Q (Q cycle)', subtitle: 'Cách hai electron từ một ubiquinol được phân chia: một electron chuyển cho cytochrome c, electron còn lại quay trở lại quinone',
summary: 'Chu trình Q tách hai electron của mỗi ubiquinol: một electron đi đến cytochrome c, electron còn lại quay trở lại quinone, do đó cứ mỗi ubiquinol bị oxy hóa thì hai cytochrome c bị khử và bốn proton đi vào không gian giữa màng.',
start: fig('ubiquinol', 'Ubiquinol (QH' + SUB2 + ')'),
moves: [
{
id: 'qc.1', text: 'Ubiquinol (QH' + SUB2 + '(Liên kết) tại vị trí Qₒ của phức hợp III, gần không gian giữa màng. Điều gì sẽ xảy ra tiếp theo?',
right: 'Một electron đi đến trung tâm sắt-lưu huỳnh Rieske và tiếp tục đi qua cytochrome c₁ đến cytochrome c; hai proton đi vào không gian giữa màng.',
wrong: ['Cả hai electron cùng lúc chuyển đến cytochrome c.', 'Hai proton đi vào chất nền'],
hints: ['Chất nhận ở phía này lấy từng electron một.', 'Các proton được giải phóng ở phía mặt tiếp xúc với vị trí đó.'],
explain: 'Các electron bị phân tách: cytochrome c chỉ nhận một electron tại một thời điểm, thông qua trung tâm sắt-lưu huỳnh Rieske và cytochrome c₁, và hai proton của ubiquinol được giải phóng vào không gian giữa màng.'
},
{
id: 'qc.2', text: 'Ubiquinol đã mất một electron và cả hai proton, để lại một semiquinone ở Qₒ. Electron thứ hai sẽ đi đâu?',
right: 'Quá trình này diễn ra theo chiều ngược lại, thông qua các heme bₗ và bₕ, đến một ubiquinone liên kết tại vị trí Qᵢ ở phía chất nền, tạo thành một semiquinone tại đó.',
wrong: ['Nó cũng đi đến cytochrome c, thông qua trung tâm Rieske.', 'Nó làm giảm ' + O2 + ' để tưới nước'],
hints: ['Phức hợp này có hai nhóm heme b trải dài qua màng tế bào.', 'Một vị trí quinone thứ hai hướng về phía ma trận.'],
explain: 'Electron thứ hai đi qua màng tế bào thông qua hai nhóm heme b và khử một nửa ubiquinone đang chờ ở vị trí Qᵢ; ubiquinone bị oxy hóa ở vị trí Qₒ rời đi.'
},
{
id: 'qc.3', text: 'Một phân tử ubiquinol thứ hai liên kết tại Qₒ và thực hiện chức năng tương tự. Electron đầu tiên của nó sẽ đi về đâu?',
right: 'Trên cytochrome c thứ hai, thông qua trung tâm Rieske và cytochrome c₁; hai proton nữa đi vào không gian giữa màng.',
wrong: ['Trên semiquinone tại Qᵢ', 'TRÊN ' + NADPLUS],
hints: ['Vẫn địa điểm đó, vẫn tuyến đường đó như lần đầu tiên.', 'Mỗi phân tử ubiquinol bị oxy hóa tại vị trí này sẽ làm giảm một cytochrome c.'],
explain: 'Ubiquinol thứ hai lặp lại một nửa chu trình đầu tiên: một electron truyền đến cytochrome c thông qua trung tâm Rieske và cytochrome c₁, hai proton vào không gian giữa màng.'
},
{
id: 'qc.4', text: 'Electron thứ hai của nó đi qua các heme b đến vị trí Qᵢ. Điều gì xảy ra ở đó?',
right: 'Semiquinone tại Qᵢ lấy electron và hai proton từ chất nền, trở thành ubiquinol, sau đó tái gia nhập nhóm.',
wrong: ['Semiquinone trả lại electron cho Qₒ', 'Semiquinone tách ra dưới dạng gốc tự do.'],
hints: ['Hai lần giảm một nửa sẽ tạo thành một lần giảm toàn phần.', 'Các proton này đến từ phía ma trận.'],
explain: 'Semiquinone Qᵢ bị khử thành ubiquinol, lấy đi hai proton từ chất nền, do đó một trong hai ubiquinol bị oxy hóa đã được tạo thành lại.',
after: fig('ubiquinol', 'Ubiquinol được sản xuất lại tại Qᵢ')
},
{
id: 'qc.5', text: 'Hãy tính tổng lại. Với mỗi mạng lưới ubiquinol bị oxy hóa, phức hợp III đã thực hiện những thao tác gì?',
right: 'Hai cytochrome c bị khử, bốn proton được giải phóng vào không gian giữa màng, hai proton được lấy từ chất nền.',
wrong: ['Một cytochrome c bị khử và hai proton được giải phóng.', 'Bốn cytochrome c bị khử và không có proton nào di chuyển'],
hints: ['Hai phân tử ubiquinol bị oxy hóa tại Qₒ và một phân tử được tái tạo tại Qᵢ.', 'Mỗi phân tử ubiquinol bị oxy hóa sẽ giải phóng hai proton ở phía ngoài.'],
explain: 'Hai phân tử ubiquinol đi vào, một phân tử đi ra: kết quả là một phân tử ubiquinol bị oxy hóa, hai cytochrome c bị khử, bốn proton đi vào không gian giữa màng và hai proton được lấy từ chất nền: ' + equation('etc', 'c3') + '.'
}
]
}));
register(walkthrough({
id: 'mech-betaox', title: 'Beta-oxidation: những bước đầu tiên', subtitle: 'Từ acid béo tự do đến acetyl-CoA đầu tiên: hoạt hóa, hệ vận chuyển carnitine và bốn bước của một chu kỳ',
summary: 'Kích hoạt, vận chuyển vào, sau đó oxy hóa (FAD), hydrat hóa, oxy hóa (NAD⁺) và cắt (thiolase): mỗi chu trình tạo ra một FADH₂, một NADH, một acetyl-CoA và một acyl-CoA ngắn hơn hai nguyên tử carbon.',
start: fig('fattyacid', 'Một axit béo'),
moves: [
{
id: 'bo.1', text: 'Một axit béo đi đến màng ngoài của ty thể. Điều gì xảy ra đầu tiên?',
right: 'Acyl-CoA synthetase kết hợp nó với coenzyme A thông qua một acyl-adenylate, sử dụng ATP để tạo ra AMP và PPᵢ.',
wrong: ['Carnitine liên kết với axit tự do và vận chuyển nó vào bên trong.', 'FAD loại bỏ hai nguyên tử hydro khỏi axit tự do'],
hints: ['Trước tiên, cần phải chuyển hóa axit thành thioeste.', 'Hai liên kết năng lượng cao của ATP bị tiêu hao.'],
explain: 'Activation: ' + equation('betaox', 'acs') + 'Acyl-adenylate là chất trung gian; việc tách PPᵢ thúc đẩy bước phản ứng tiến lên.',
after: fig('acylcoa', 'Axit béo acyl-CoA')
},
{
id: 'bo.2', text: 'Fattyline acyl-CoA nằm trong bào tương, nhưng quá trình beta-oxy hóa diễn ra trong chất nền. Điều gì sẽ xảy ra tiếp theo?',
right: 'Carnitine palmitoyltransferase I (CPT I) thay thế CoA bằng carnitine; acyl-carnitine đi qua màng trong và CPT II tái tạo acyl-CoA trong chất nền.',
wrong: ['Acyl-CoA khuếch tán thẳng qua màng trong.', 'Nhóm acyl được chuyển giao cho protein mang acyl.'],
hints: ['Màng trong không cho phép acyl-CoA đi qua.', 'Một phân tử vận chuyển nhỏ mang nhóm acyl đi và quay trở lại mà không mang theo gì.'],
explain: 'Cơ chế vận chuyển carnitine: CPT I nằm trên màng ngoài, translocase nằm ở màng trong và CPT II nằm ở phía màng trong; CPT I là điểm kiểm soát chính của quá trình oxy hóa axit béo.'
},
{
id: 'bo.3', text: 'Acyl-CoA nằm trong ma trận. Phản ứng đầu tiên của vòng này là gì?',
right: 'Acyl-CoA dehydrogenase loại bỏ hai nguyên tử hydro từ các nguyên tử cacbon α và β, tạo thành liên kết đôi trans và ' + FADH2,
wrong: ['Nước được thêm vào dọc theo chuỗi bên cạnh thioester', NADPLUS + ' oxy hóa cacbon β thành xeton'],
hints: ['Bước oxy hóa đầu tiên tạo ra liên kết đôi, giống như hoạt động của succinate dehydrogenase.', 'Chất mang là một loại flavin.'],
explain: equation('betaox', 'acadh') + 'Các electron đi qua ETF đến ubiquinone.',
after: fig('enoylcoa', 'trans-Δ²-Enoyl-CoA')
},
{
id: 'bo.4', text: 'Trans-Δ²-Enoyl-CoA được hình thành. Điều gì sẽ xảy ra tiếp theo?',
right: 'Enoyl-CoA hydratase thêm nước vào liên kết đôi, tạo ra L-β-hydroxyacyl-CoA.',
wrong: ['Thiolase cắt chuỗi tại liên kết đôi.', 'FAD tạo ra liên kết đôi thứ hai'],
hints: ['Đây là một bước tương tự như hoạt động của enzyme fumarase trong chu trình TCA.', 'Không có sự thay đổi về trạng thái oxy hóa.'],
explain: equation('betaox', 'enoylh') + 'Nhóm hydroxyl nằm trên nguyên tử cacbon β với cấu hình lập thể L.',
after: fig('hydroxyacylcoa', 'L-β-Hydroxyacyl-CoA')
},
{
id: 'bo.5', text: 'L-β-Hydroxyacyl-CoA được hình thành. Điều gì sẽ xảy ra tiếp theo?',
right: 'L-Hydroxyacyl-CoA dehydrogenase oxy hóa nhóm β-hydroxyl thành ketone với ' + NADPLUS + ', tạo ra β-ketoacyl-CoA và NADH',
wrong: ['Enoyl-CoA hydratase loại bỏ nước một lần nữa.', 'Coenzyme A tấn công nguyên tử cacbon β.'],
hints: ['Đây là một bước tương tự như bước của malate dehydrogenase trong chu trình TCA.', 'Chất mang là nicotinamide.'],
explain: equation('betaox', 'hadh') + 'Cacbon β lúc này là một xeton, sẵn sàng bị tấn công.',
after: fig('ketoacylcoa', 'β-Ketoacyl-CoA')
},
{
id: 'bo.6', text: 'β-Ketoacyl-CoA được hình thành. Điều gì sẽ xảy ra tiếp theo?',
right: 'Thiolase: một coenzyme A thứ hai tấn công carbon β-keto, cắt đứt acetyl-CoA và để lại acyl-CoA ngắn hơn hai carbon.',
wrong: ['Nước thủy phân thioeste thành axit tự do.', CO2 + ' được giải phóng từ cacbon β'],
hints: ['Liên kết giữa các nguyên tử cacbon α và β bị đứt.', 'Nhóm tấn công là một thiol, không phải nước.'],
explain: equation('betaox', 'thiolase') + 'Acyl-CoA rút ngắn sẽ quay trở lại quá trình oxy hóa đầu tiên, và chu trình này lặp lại cho đến khi chuỗi được sử dụng hết.',
after: fig('acetylcoa', 'Acetyl-CoA')
}
]
}));
})(typeof window !== 'undefined' ? window : globalThis);
