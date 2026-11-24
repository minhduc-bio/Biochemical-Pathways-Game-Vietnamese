(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
MG.categories = [
{
id: 'carbs', title: 'Carbohydrate', color: '#EE9B9D',
pathways: ['glycolysis', 'lactate', 'ethanol', 'gluconeogenesis', 'glycogen'],
everything: 'everything-carbs'
},
{
id: 'tca', title: 'Chu trình TCA (TCA Cycle)', color: '#F0C987',
pathways: ['pdhtca', 'tca', 'full', 'pyrentry'],
everything: 'everything-tca'
},
{
id: 'etc', title: 'Chuỗi vận chuyển electron (Electron Transport Chain)', color: '#E8A55D',
pathways: ['etcsimple', 'etc', 'etcpath', 'antport', 'gpshuttle', 'masshuttle'],
everything: 'everything-etc'
},
{
id: 'lipids', title: 'Lipid', color: '#C5D58A',
pathways: ['boxsimple', 'betaox', 'fas', 'faelong', 'desatmech', 'tag', 'lipidsreg'],
presets: [
  { id: 'lipids-synth', label: 'Sinh tổng hợp Lipid (1–5)', ids: ['fas', 'faelong', 'desatmech', 'tag', 'lipidsreg'] }
],
everything: 'everything-lipids'
},
{
id: 'aminoacids', title: 'Axit amin', color: '#9CCBEA',
pathways: ['gluala', 'urea'],
everything: 'everything-aminoacids'
},
{
id: 'cellbio', title: 'Động lực học ty thể và apoptosis', color: '#C9BFE0',
pathways: ['mitodyn', 'apopint', 'apopext'],
everything: 'everything-cellbio'
}
];
MG.everythingAll = 'everything-all';
MG.courses = {};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.pathways) { return; }
function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function sourceOf(from) {
if (typeof from !== 'string') { return from; }
if (!has(MG.pathways, from)) { throw new Error('MG everything: unknown pathway ' + from); }
return MG.pathways[from];
}
function moved(item, dx, dy) {
var c = clone(item);
if (c.type === 'circle') { c.cx += dx; c.cy += dy; }
else if (typeof c.x1 === 'number') { c.x1 += dx; c.y1 += dy; c.x2 += dx; c.y2 += dy; }
else if (typeof c.x === 'number') { c.x += dx; c.y += dy; }
return c;
}
function renameHl(hl, map) {
var out = {};
Object.keys(hl).forEach(function (side) {
out[side] = {};
Object.keys(hl[side]).forEach(function (n) { out[side][has(map, n) ? map[n] : n] = hl[side][n]; });
});
return out;
}
function unique(list) {
return list.filter(function (x, i) { return list.indexOf(x) === i; });
}
function compose(spec) {
var res = { nodes: {}, reactions: [], order: [], start: [], regions: [], notes: [], membranes: [], merged: [] };
var seenShape = {};
var regionIds = [];
var blockMaps = {};
spec.blocks.forEach(function (b, bIdx) {
var src = sourceOf(b.from);
var dx = b.dx || 0, dy = b.dy || 0;
var map = {};
Object.keys(src.nodes).forEach(function (n) {
var sn = src.nodes[n];
var at = b.place && b.place[n] ? b.place[n] : [sn.x + dx, sn.y + dy];
var target;
if (b.share && has(b.share, n)) {
target = b.share[n];
if (!has(res.nodes, target) || res.nodes[target].mol !== sn.mol) {
throw new Error('MG everything: ' + spec.id + ' cannot share ' + n + ' with ' + target);
}
} else if (has(res.nodes, n) && res.nodes[n].mol === sn.mol && res.nodes[n].x === at[0] && res.nodes[n].y === at[1]) {
target = n;
} else {
target = has(res.nodes, n) ? (b.key || 'x') + '_' + n : n;
if (has(res.nodes, target)) { throw new Error('MG everything: ' + spec.id + ' has two nodes called ' + target); }
res.nodes[target] = { mol: sn.mol, x: at[0], y: at[1] };
}
map[n] = target;
});
blockMaps[b.key || ('b' + bIdx)] = map;
if (typeof b.from === 'string') { blockMaps[b.from] = map; }
var bySrc = {};
src.reactions.forEach(function (r) { bySrc[r.id] = r; });
src.order.forEach(function (rid) {
if (b.skip && b.skip.indexOf(rid) >= 0) { res.merged.push(rid); return; }
if (res.order.indexOf(rid) >= 0) { return; }
var r = clone(bySrc[rid]);
if (src.terms && src.terms.enz && !(r.terms && r.terms.enz)) { r.terms = { enz: src.terms.enz }; }
r.substrates = r.substrates.map(function (n) { return map[n]; });
r.products = r.products.map(function (n) { return map[n]; });
r.arrows = r.arrows.map(function (a) {
var out = { from: map[a.from], to: map[a.to] };
if (a.via) { out.via = a.via.map(function (p) { return { x: p.x + dx, y: p.y + dy }; }); }
if (a.link) { out.link = true; }
if (a.effect) { out.effect = a.effect; }
if (a.dashed) { out.dashed = true; }
if (a.badge) { out.badge = a.badge; }
if (a.toPill) { out.toPill = a.toPill; }
if (a.twoWay !== undefined) { out.twoWay = !!a.twoWay; }
if (a.label) { out.label = a.label; }
if (a.role) { out.role = a.role; }
if (a.junction) { out.junction = { x: a.junction.x + dx, y: a.junction.y + dy }; }
return out;
});
if (r.hl) { r.hl = renameHl(r.hl, map); }
if (b.patch && has(b.patch, rid)) { Object.keys(b.patch[rid]).forEach(function (k) { r[k] = clone(b.patch[rid][k]); }); }
if ((src.noDistractor || []).length) { r.avoid = unique((r.avoid || []).concat(src.noDistractor)); }
var nm = b.names ? b.names(r) : null;
if (nm) { r.label = nm[0]; r.short = nm[1]; }
res.reactions.push(r);
res.order.push(rid);
});
(src.start || []).forEach(function (n) { res.start.push(map[n]); });
if (b.regions !== false) {
(src.regions || []).forEach(function (g) {
if (b.dropRegions && b.dropRegions.indexOf(g.label) >= 0) { return; }
var c = moved(g, dx, dy);
if (g.nodes) {
c.nodes = g.nodes.map(function (n) { return map[n] || n; });
}
if (b.renameRegions && has(b.renameRegions, g.label)) { c.label = b.renameRegions[g.label]; }
var key = JSON.stringify(c);
if (!seenShape[key]) { seenShape[key] = true; res.regions.push(c); }
});
}
if (b.notes !== false) {
(src.notes || []).forEach(function (t) {
if (b.dropNotes && b.dropNotes.indexOf(t.text) >= 0) { return; }
var c = moved(t, dx, dy);
var key = JSON.stringify(c);
if (!seenShape[key]) { seenShape[key] = true; res.notes.push(c); }
});
}
if (b.membranes !== false) {
(src.membranes || []).forEach(function (m) {
var c = moved(m, dx, dy);
var key = JSON.stringify(c);
if (!seenShape[key]) { seenShape[key] = true; res.membranes.push(c); }
});
}
(src.merged || []).forEach(function (id) { if (res.merged.indexOf(id) < 0) { res.merged.push(id); } });
regionIds = regionIds.concat(src.region || []);
});
(spec.extraRegions || []).forEach(function (g) { res.regions.push(clone(g)); });
(spec.extraNotes || []).forEach(function (t) { res.notes.push(clone(t)); });
(spec.extraMembranes || []).forEach(function (m) { res.membranes.push(clone(m)); });
var allLinks = (spec.links || []).slice();
if (typeof spec.buildLinks === 'function') {
  allLinks = allLinks.concat(spec.buildLinks(blockMaps, res) || []);
}
allLinks.forEach(function (l) {
var host = res.reactions.filter(function (r) { return r.id === l.on; })[0];
if (!host) { throw new Error('MG everything: ' + spec.id + ' has a link on an unknown step ' + l.on); }
if (!has(res.nodes, l.from) || !has(res.nodes, l.to)) { throw new Error('MG everything: ' + spec.id + ' has a link between unknown nodes ' + l.from + ' and ' + l.to); }
var arrow = { from: l.from, to: l.to, link: true };
if (l.via) { arrow.via = l.via.map(function (p) { return Array.isArray(p) ? { x: p[0], y: p[1] } : { x: p.x, y: p.y }; }); }
if (l.dashed) { arrow.dashed = true; }
if (l.twoWay) { arrow.twoWay = true; }
if (l.effect) { arrow.effect = l.effect; }
if (l.badge) { arrow.badge = l.badge; }
if (l.toPill) { arrow.toPill = l.toPill; }
if (l.label) { arrow.label = l.label; }
if (l.role) { arrow.role = l.role; }
if (l.junction) { arrow.junction = { x: Math.round(l.junction.x), y: Math.round(l.junction.y) }; }
host.arrows.push(arrow);
});
res.start = unique(spec.start || res.start);
return {
id: spec.id, title: spec.title, subtitle: spec.subtitle, tag: spec.tag,
location: spec.location, color: spec.color,
nodes: res.nodes, reactions: res.reactions, order: res.order, start: res.start,
regions: res.regions, membranes: res.membranes, notes: res.notes, summary: spec.summary, merged: res.merged,
region: unique(regionIds), noDistractor: [],
hidden: true, big: true, scope: spec.scope || null
};
}
function numbered(label, short) {
return function (r) { return typeof r.step === 'number' ? [label + ' bước ' + r.step, short + ' ' + r.step] : null; };
}
var glycolysisIds = {};
MG.pathways.glycolysis.order.forEach(function (id) { glycolysisIds[id] = true; });
var glycolysisNames = numbered('Đường phân', 'GLY');
var tcaNames = numbered('Chu trình TCA', 'TCA');
function oxidationNames(r) {
if (r.id === 'pdc') { return ['Phản ứng liên kết (PDC)', 'Liên kết']; }
return (glycolysisIds[r.id] ? glycolysisNames : tcaNames)(r);
}
function ethanolNames(r) {
if (glycolysisIds[r.id]) { return glycolysisNames(r); }
return ['Lên men rượu bước ' + (r.step - 10), 'ETH ' + (r.step - 10)];
}
function lactateNames(r) {
return glycolysisIds[r.id] ? glycolysisNames(r) : ['Lên men lactic', 'LAC'];
}
var pyeNames = numbered('Vận chuyển pyruvate', 'PYE');
var mdyNames = numbered('Phân hạch và hợp nhất', 'MDY');
var ainNames = numbered('Apoptosis nội sinh', 'AIN');
var aexNames = numbered('Apoptosis ngoại sinh', 'AEX');
var ecpNames = numbered('Chất mang điện tử', 'ECP');
var etcNames = numbered('Chuỗi vận chuyển điện tử', 'ETC');
var gpsNames = numbered('Thoi glycerol phosphat', 'GPS');
var masNames = numbered('Thoi malate-aspartate', 'MAS');
var antNames = numbered('Tổng hợp & xuất ATP', 'ANT');
var faoNames = numbered('Beta-oxy hóa', 'FAO');
var etcSimpleNames = numbered('Chuỗi vận chuyển điện tử giản lược', 'ETS');
var faoSimpleNames = numbered('Beta-oxy hóa giản lược', 'BOS');
var GN = MG.pathways.glycolysis.nodes;
var COL = GN.pyr.x, SIDE = GN.dhap.x, FORK = GN.glc.x, ROW = GN.g6p.y - GN.glc.y;
function row(k) { return GN.glc.y + ROW * k; }
var GLY_NODES = ['glc', 'g6p', 'f6p', 'f16bp', 'dhap', 'g3p', 'bpg13', 'pg3', 'pg2', 'pep', 'pyr'];
function shareGly() {
var out = {};
GLY_NODES.forEach(function (n) { out[n] = n; });
return out;
}
function note(text, x, y, anchor) { return { text: text, x: x, y: y, size: 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var EAST = { 'in': 'east', out: 'east' }, WEST = { 'in': 'west', out: 'west' };
var FORWARD_BESIDE = {
hk: { shift: [60, 0], pillAt: 0.32, cof: EAST }, pfk1: { shift: [60, 0], pillAt: 0.32, cof: EAST }, pk: { cof: EAST }
};
var BYPASS_BESIDE = {
g6pase: { shift: [-60, 0], pillAt: 0.32, cof: WEST }, fbpase: { shift: [-60, 0], pillAt: 0.32, cof: WEST },
pc: { cof: { 'in': 'down', out: 'down' } }
};
var REVERSED = ['enolr', 'pgmr', 'pgkr', 'gapdhr', 'tpir', 'aldolr', 'pgir'];
var SUMMARY_CARBS = [
'Glycolysis: thu ròng 2 pyruvate, 2 ATP (tạo 4, tốn 2) và 2 NADH trên mỗi glucose',
'Fermentation tái oxy hóa 2 NADH để glycolysis có thể chạy không cần oxygen: lactate dehydrogenase tạo 2 lactate, hoặc pyruvate decarboxylase và alcohol dehydrogenase tạo 2 ethanol và 2 CO₂',
'Gluconeogenesis: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺. Bảy enzymes của glycolysis chạy ngược (các mũi tên hai đầu) và bốn bypass enzymes đi vòng qua các bước bất thuận nghịch',
'Glucose 6-phosphate là ngã ba trung tâm giữa glucose và glycogen. Glycogen synthase và glycogen phosphorylase là hai enzymes khác nhau, nên quá trình dự trữ và phân giải được điều hòa riêng biệt'
];
var carbs = compose({
id: 'everything-carbs', title: 'Tất cả: Carbohydrate',
subtitle: 'Glycolysis, fermentation, gluconeogenesis và glycogen trên một bản đồ',
tag: 'ALL', location: 'Dịch bào (gan và cơ; nấm men dùng để sản xuất ethanol)', color: '#FFB347',
summary: SUMMARY_CARBS, scope: { type: 'category', id: 'carbs' },
blocks: [
{ from: 'glycolysis', names: glycolysisNames, regions: false, patch: FORWARD_BESIDE },
{
from: 'gluconeogenesis', key: 'gng', share: shareGly(), place: { oaa: [SIDE, row(9)] }, skip: REVERSED,
names: numbered('Quá trình tân tạo glucose', 'GNG'), regions: false, notes: false, patch: BYPASS_BESIDE
},
{
from: 'glycogen', key: 'glg', share: { g6p: 'g6p' }, names: numbered('Glycogen', 'GLG'), regions: false, notes: false,
place: { g1p: [FORK + 380, row(1)], udpg: [FORK + 760, row(1)], glycogen: [FORK + 760, row(2)] }
},
{ from: 'lactate', key: 'lac', share: shareGly(), place: { lac: [COL + 380, row(9)] }, names: lactateNames, regions: false, notes: false },
{
from: 'ethanol', key: 'eth', share: shareGly(), place: { acet: [COL, row(10)], etoh: [COL + 380, row(10)] },
names: ethanolNames, regions: false, notes: false
}
],
start: ['glc'],
extraRegions: [
{ type: 'rect', label: 'Đường phân và tân tạo đường', color: '#F5CCCD', x: 20, y: 20, w: 1400, h: row(10) + 76 + 84 - 20 },
{ type: 'rect', label: 'chuyển hóa glycogen', color: '#EFBBBE', x: 740, y: row(1) - 110, w: 660, h: 560 }
],
extraNotes: [
note('Nồng độ O₂ thấp', COL + 380, row(9) - 110, 'middle'),
note('Men, hàm lượng O₂ thấp', COL + 190, row(10) - 110, 'middle')
]
});
function fermentationNames(r) {
if (r.id === 'ldh') { return lactateNames(r); }
return glycolysisIds[r.id] ? glycolysisNames(r) : ethanolNames(r);
}
var fermentations = compose({
id: 'fermentations', title: 'Đường phân và lên men',
tag: 'FER', location: 'Tế bào chất (men dùng để sản xuất ethanol)', color: '#FFB347',
summary: MG.pathways.glycolysis.summary.slice(0, 1).concat(MG.pathways.lactate.summary.slice(0, 1), MG.pathways.ethanol.summary.slice(0, 1)),
scope: null,
blocks: [
{ from: 'glycolysis', names: glycolysisNames, regions: false },
{ from: 'lactate', key: 'lac', share: shareGly(), place: { lac: [COL + 380, row(9)] }, names: lactateNames, regions: false, notes: false },
{
from: 'ethanol', key: 'eth', share: shareGly(), place: { acet: [COL, row(10)], etoh: [COL + 380, row(10)] },
names: ethanolNames, regions: false, notes: false
}
],
start: ['glc'],
extraRegions: [{ type: 'rect', label: 'Đường phân và quá trình lên men', color: '#F5CCCD', x: 20, y: 20, w: 1160, h: row(10) + 76 + 84 - 20 }],
extraNotes: [
note('Nồng độ O₂ thấp', COL + 380, row(9) - 110, 'middle'),
note('Men, hàm lượng O₂ thấp', COL + 190, row(10) - 110, 'middle')
]
});
var SUMMARY_TCA = [
'Glucose bị oxy hóa hoàn toàn thành 6 CO₂: glycolysis, link reaction và TCA cycle tạo tổng cộng 10 NADH, 2 FADH₂ và 4 ATP hoặc GTP ròng trên mỗi glucose',
'Pyruvate đi qua màng ngoài qua porin và màng trong trên H⁺/pyruvate symporter, rồi link reaction tạo acetyl-CoA, CO₂ và NADH trong matrix'
];
var tcaMap = compose({
id: 'everything-tca', title: 'Tất cả: Chu trình TCA',
subtitle: 'Glucose thành CO₂ và quá trình pyruvate đi vào ty thể trên một bản đồ',
tag: 'ALL', location: 'Tế bào chất và ty thể', color: '#F2B35E',
summary: SUMMARY_TCA, scope: { type: 'category', id: 'tca' },
blocks: [
{ from: 'full', names: oxidationNames },
{ from: 'pyrentry', dx: 2200, key: 'pye', names: pyeNames }
]
});
var SUMMARY_ETC = [
'Electron transport chain truyền electrons của NADH và FADH₂ tới oxygen: khoảng 10 H⁺ được bơm trên mỗi NADH và 6 trên mỗi FADH₂, đủ cho khoảng 2.5 và 1.5 ATP',
'Các shuttles đưa electrons của cytosolic NADH vào matrix, còn ATP synthase và ATP-ADP translocase tổng hợp và xuất khẩu ATP'
];
var etcMap = compose({
id: 'everything-etc', title: 'Tất cả: Chuỗi vận chuyển electron',
subtitle: 'Chuỗi vận chuyển, các electron carriers, xuất khẩu ATP và hai shuttles trên một bản đồ',
tag: 'ALL', location: 'màng trong ty thể và chất nền', color: '#B596F2',
summary: SUMMARY_ETC, scope: { type: 'category', id: 'etc' },
blocks: [
{ from: 'etc', key: 'etc', names: etcNames },
{ from: 'etcpath', dy: 1320, key: 'ecp', names: ecpNames },
{ from: 'antport', dy: 2500, key: 'ant', names: antNames },
{ from: 'masshuttle', dx: 1800, key: 'mas', names: masNames },
{ from: 'gpshuttle', dx: 1800, dy: 900, key: 'gps', names: gpsNames }
]
});
var fasNames = numbered('Tổng hợp Palmitate', 'FAS');
var eloNames = numbered('Kéo dài & khử bão hòa', 'ELO');
var desNames = numbered('Hệ Desaturase', 'DES');
var tagNames = numbered('Sinh tổng hợp TAG & GPL', 'TAG');
var regNames = numbered('Điều hòa ACC & CAT I', 'REG');

var SUMMARY_LIPIDS = [
'β-oxy hóa thoái hóa Fatty acyl-CoA trong ty thể sinh FADH₂, NADH và Acetyl-CoA.',
'Phức hệ FAS thực hiện 7 vòng lặp tạo Palmitate (16:0) từ Acetyl-CoA và Malonyl-CoA.',
'Palmitate được kéo dài và khử bão hòa tại ER/ty thể nhờ hệ Acyl-CoA desaturase và chuỗi truyền electron Cyt b₅.',
'Khung L-Glycerol 3-phosphate gắn gốc fatty acyl-CoA tạo Phosphatidic acid rồi rẽ nhánh sang TAG và Glycerophospholipid.',
'Malonyl-CoA ức chế dị lập thể CAT I ngăn β-oxy hóa ở ty thể khi đang tổng hợp lipid ở bào tương.'
];
var lipids = compose({
id: 'everything-lipids', title: 'Tất cả: Lipid',
subtitle: 'β-oxy hóa, sinh tổng hợp axit béo, desaturase, TAG/GPL và điều hòa ACC–CAT I trên một bản đồ',
tag: 'ALL', location: 'Tế bào chất, lưới nội chất và ty thể', color: '#B8CC8A',
summary: SUMMARY_LIPIDS, scope: { type: 'category', id: 'lipids' },
blocks: [
{ from: 'betaox', key: 'betaox', names: faoNames },
{ from: 'fas', dx: 2400, dy: 0, key: 'fas', names: fasNames },
{ from: 'lipidsreg', dx: 4800, dy: 0, key: 'lipidsreg', names: regNames },
{ from: 'tag', dx: 0, dy: 2300, key: 'tag', names: tagNames },
{ from: 'faelong', dx: 2400, dy: 2300, key: 'faelong', names: eloNames },
{ from: 'desatmech', dx: 2400, dy: 4200, key: 'desatmech', names: desNames }
]
});
var ureNames = numbered('Chu trình urê', 'URE');
var glaNames = numbered('Glutamate và alanine', 'GLA');
var aminoacids = compose({
id: 'everything-aminoacids', title: 'Tất cả: Amino acid',
subtitle: 'Glutamate, alanine và urea cycle trên một bản đồ',
tag: 'ALL', location: 'Gan, thận, cơ và não: dịch bào và chất nền ty thể', color: '#C79BE0',
summary: MG.pathways.gluala.summary.concat(MG.pathways.urea.summary), scope: { type: 'category', id: 'aminoacids' },
blocks: [
{ from: 'gluala', key: 'gla', names: glaNames },
{ from: 'urea', dy: 1350, key: 'ure', names: ureNames }
]
});
var SUMMARY_CELLBIO = [
'Ty thể phân chia và dung hợp (Drp1, các mitofusins, Opa1): fission cắt bỏ phần hư hỏng và tạo thêm bào quan, fusion cho phép ty thể tổn thương chia sẻ thành phần với ty thể khỏe mạnh',
'Tổn thương nghiêm trọng kích hoạt Bax, tạo lỗ trên màng ngoài ty thể, khiến cytochrome c thoát ra cytosol. Cytochrome c, Apaf-1 và dATP tạo thành apoptosome, hoạt hóa procaspase-9, và caspase-9 hoạt hóa các executioner procaspases (con đường intrinsic)',
'TNF kéo ba chuỗi TNFR1 lại nhau; TRADD, FADD và procaspase-8 được huy động, các phân tử procaspase-8 sát nhau tự hoạt hóa lẫn nhau, và caspase-8 hoạt hóa các executioner procaspases (con đường extrinsic)',
'Hai con đường gặp nhau tại các executioner caspases, và caspase-3 cắt các protein tế bào'
];
var cellbio = compose({
id: 'everything-cellbio', title: 'Tất cả: Động lực học ty thể và apoptosis',
subtitle: 'Fission, fusion và hai con đường apoptosis trên một bản đồ',
tag: 'ALL', location: 'Ty thể, màng sinh chất và bào tương', color: '#E56F6F',
summary: SUMMARY_CELLBIO, scope: { type: 'category', id: 'cellbio' },
blocks: [
{ from: 'mitodyn', key: 'mdy', names: mdyNames },
{ from: 'apopint', dy: 450, key: 'ain', names: ainNames },
{ from: 'apopext', dy: 1300, key: 'aex', names: aexNames }
]
});
var SUMMARY_ALL = [
'Glycolysis: thu ròng 2 pyruvate, 2 ATP và 2 NADH trên mỗi glucose. Fermentation (lactate hoặc ethanol) tái oxy hóa NADH để glycolysis chạy không cần oxygen',
'Gluconeogenesis đảo ngược glycolysis với bốn bypass enzymes. Glycogen được tổng hợp và phân giải bởi các enzymes khác nhau, với glucose 6-phosphate làm trung tâm',
'Trên mỗi pyruvate, link reaction và TCA cycle cho 3 CO₂, 4 NADH, 1 FADH₂ và 1 GTP',
'Beta-oxidation: mỗi vòng xoắn cho 1 FADH₂, 1 NADH và 1 acetyl-CoA, làm ngắn fatty acyl-CoA đi 2 carbons',
'Electron transport chain truyền electrons của NADH và FADH₂ tới oxygen: khoảng 10 H⁺ được bơm trên mỗi NADH và 6 trên mỗi FADH₂, đủ cho khoảng 2.5 và 1.5 ATP',
'var MATRIX_X = ENTRY_DX + 150 + 2 * 380;',
'var HUB_X = ENTRY_DX + 150 + 3 * 380;',
'var TCA_DX = MATRIX_X - 150, TCA_DY = ENTRY_DY + 40;'
].concat(SUMMARY_CELLBIO, MG.pathways.gluala.summary, MG.pathways.urea.summary);
var ENTRY = { x: 1600, y: 3150 };
var ENTRY_DX = ENTRY.x - 150, ENTRY_DY = ENTRY.y - 150;
var MATRIX_X = ENTRY_DX + 150 + 2 * 380;
var HUB_X = ENTRY_DX + 150 + 3 * 380;
var TCA_DX = MATRIX_X - 150, TCA_DY = ENTRY_DY + 40;
function ringAt(x, y) { return [x + TCA_DX, y + TCA_DY]; }
var RING_OAA = ringAt(761, 561), RING_FUM = ringAt(761, 1239), RING_AKG = ringAt(1580, 900);
var FAO_DX = HUB_X - 530, FAO_DY = ENTRY.y - 900 - 1310;
var UREA_DY = RING_OAA[1] - 150;
var GLA_DX = RING_AKG[0] + 510 - 150, GLA_DY = RING_AKG[1] - 150;
var CHAIN = { x: 3380, y: 1050 };
var CELL = { x: 3760, y: 320 };
var everything = compose({
id: 'everything-all', title: 'Tất cả: Mọi con đường',
subtitle: 'Tất cả hai mươi pathways trên một bản đồ',
tag: 'ALL', location: 'Tế bào chất và ty thể', color: '#FFD166',
summary: SUMMARY_ALL, scope: { type: 'all', id: 'all' },
blocks: [
{ from: carbs },
{ from: 'pyrentry', dx: ENTRY_DX, dy: ENTRY_DY, key: 'pye', names: pyeNames, skip: ['pe3'] },
{ from: 'pdhtca', dx: TCA_DX, dy: TCA_DY, key: 'pdh', names: oxidationNames, share: { pyr: 'pyrm', acetylcoa: 'acoa' } },
{
from: 'betaox', dx: FAO_DX, dy: FAO_DY, key: 'fao', names: faoNames, share: { acetyl: 'acoa' }
},
{ from: 'etc', dx: CHAIN.x, dy: CHAIN.y, key: 'etc', names: etcNames },
{ from: 'etcpath', dx: CHAIN.x + 1720, dy: CHAIN.y, key: 'ecp', names: ecpNames },
{ from: 'antport', dx: CHAIN.x, dy: 2300, key: 'ant', names: antNames },
{ from: 'masshuttle', dx: CHAIN.x + 1280, dy: 2300, key: 'mas', names: masNames },
{ from: 'gpshuttle', dx: CHAIN.x + 2900, dy: 2300, key: 'gps', names: gpsNames },
{ from: 'gluala', dx: GLA_DX, dy: GLA_DY, key: 'gla', names: glaNames },
{ from: 'urea', dx: 0, dy: UREA_DY, key: 'ure', names: ureNames, dropNotes: ['từ oxaloacetate bằng phản ứng chuyển amin'] },
{ from: 'mitodyn', dx: CELL.x, dy: 0, key: 'mdy', names: mdyNames },
{ from: 'apopint', dx: CELL.x, dy: CELL.y, key: 'ain', names: ainNames },
{ from: 'apopext', dx: CELL.x + 2320, dy: CELL.y, key: 'aex', names: aexNames }
],
links: [
{ on: 'pe1', from: 'pyr', to: 'pyrc' },
{ on: 'ass', from: 'pdh_oaa', to: 'ure_asp' },
{ on: 'asl', from: 'fum', to: 'fumarate', via: [[RING_FUM[0] - 520, UREA_DY + 470], [RING_FUM[0] - 520, RING_FUM[1]]] },
{ on: 'ga1', from: 'akg', to: 'akg1' },
{ on: 'ai1', from: 'cytc', to: 'cyt' }
],
extraNotes: [
note('NADH và FADH₂ từ quá trình đường phân, chu trình TCA và quá trình beta-oxy hóa cung cấp nguyên liệu cho chuỗi phản ứng.', CHAIN.x + 20, 2170),
note('Glycerol đi vào', FAO_DX + 150 - 100, FAO_DY + 440 + 120), note('quá trình đường phân tại DHAP', FAO_DX + 150 - 100, FAO_DY + 440 + 150),
note('được giải phóng qua các lỗ chân lông Bax', CHAIN.x + 910 + 20, CHAIN.y - 30)
]
});
everything.start = everything.start.filter(function (n) { return n !== 'pyrm'; });
MG.everything = {};
[carbs, tcaMap, etcMap, lipids, aminoacids, cellbio, everything].forEach(function (p) {
MG.everything[p.id] = p;
Object.defineProperty(MG.pathways, p.id, { value: p, enumerable: false, writable: false, configurable: true });
});
var NAMES = {
glycolysis: glycolysisNames, lactate: lactateNames, ethanol: ethanolNames, gluconeogenesis: numbered('Quá trình tân tạo glucose', 'GNG'),
glycogen: numbered('Glycogen', 'GLG'), pdhtca: oxidationNames, tca: tcaNames, full: oxidationNames, betaox: faoNames,
etc: etcNames, etcsimple: etcSimpleNames, boxsimple: faoSimpleNames, etcpath: ecpNames, gpshuttle: gpsNames, masshuttle: masNames, antport: antNames, pyrentry: pyeNames,
mitodyn: mdyNames, apopint: ainNames, apopext: aexNames, urea: ureNames, gluala: glaNames, fermentations: fermentationNames,
fas: fasNames, faelong: eloNames, desatmech: desNames, tag: tagNames, lipidsreg: regNames
};
function namesFor(pathwayId) {
if (has(NAMES, pathwayId)) { return NAMES[pathwayId]; }
var rec = has(MG.pathways, pathwayId) ? MG.pathways[pathwayId] : null;
if (rec && typeof rec.stepNames === 'function') { return rec.stepNames; }
throw new Error('MG everything: no step names for ' + pathwayId);
}
Object.defineProperty(MG.everything, '_tools', {
value: {
compose: compose, numbered: numbered, glycolysisNames: glycolysisNames, lactateNames: lactateNames,
ethanolNames: ethanolNames, oxidationNames: oxidationNames, namesFor: namesFor
},
enumerable: false
});
Object.defineProperty(MG.everything, '_parts', { value: { fermentations: fermentations }, enumerable: false });
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.pathways || !MG.categories || !MG.everything || !MG.everything._tools || !MG.everything._parts) { return; }
var T = MG.everything._tools;
var PREFIX = 'mix:';
var ROW_WIDTH = 4200;   // a row of fallback pieces wraps when exceeding this width
var GUTTER_X = 320;     // horizontal corridor width between semantic columns/blocks
var GUTTER_Y = 320;     // vertical corridor height between semantic rows
var PAD = 100;          // fallback pad when early boot lacks MG.chart.layout
var LIPID_GRID = {
  betaox:    { row: 0, col: 0 },
  boxsimple: { row: 0, col: 0 },
  fas:       { row: 0, col: 1 },
  lipidsreg: { row: 0, col: 2 },
  tag:       { row: 1, col: 0 },
  faelong:   { row: 1, col: 1 },
  desatmech: { row: 2, col: 1 }
};
var TRACK_OFFSETS = [0, 52, -52, 104, -104];
var CROSS_LINKS = [
  { id: 'lnkPalmElo',  tier: 'primary',   role: 'transfer', fromMods: ['fas'],                 fromNode: 'palmitate',    exitSide: 'south', toMods: ['faelong'],   toNode: 'palmitate',    entrySide: 'west',  on: 'elo1',      twoWay: false, label: 'Palmitate 16:0 → kéo dài & khử bão hòa' },
  { id: 'lnkPalmTag',  tier: 'primary',   role: 'transfer', fromMods: ['fas'],                 fromNode: 'palmitate',    exitSide: 'south', toMods: ['tag'],       toNode: 'fattyacid',    entrySide: 'east',  on: 'facs1',     twoWay: false, label: 'Axit béo → tổng hợp TAG/GPL' },
  { id: 'lnkMalReg',   tier: 'primary',   role: 'reg',      fromMods: ['fas'],                 fromNode: 'malonylcoa',   exitSide: 'west',  toMods: ['lipidsreg'], toNode: 'malonylcoar',  entrySide: 'south', entryStub: [{ dx: -125, dy: 155 }], on: 'regacc3', twoWay: true, label: 'Điều hòa ACC – Mal-CoA – CAT I' },
  { id: 'lnkDesMech',  tier: 'primary',   role: 'mech',     fromMods: ['desatmech'],           fromNode: 'cytb5',        exitSide: 'north', toMods: ['faelong'],   toNode: 'oleate',       toPill: 'des9b', entrySide: 'south', entryStub: [{ dx: 110, dy: 120 }], on: 'etccyt', twoWay: false, label: 'Cơ chế 2e⁻ Cyt b₅ cho Desaturase ER' },
  { id: 'lnkTagCycle', tier: 'primary',   role: 'cycle',    fromMods: ['betaox'],              fromNode: 'tag',          exitSide: 'west',  toMods: ['tag'],       toNode: 'tag',          entrySide: 'west',  on: 'dgat1',     twoWay: true,  label: 'Tổng hợp TAG ↔ Lipolysis' },
  { id: 'lnkBetaCat1', tier: 'primary',   role: 'reg',      fromMods: ['betaox', 'boxsimple'], fromNode: 'acoa',         exitSide: 'east',  toMods: ['lipidsreg'], toNode: 'facylcoamat',  entrySide: 'south', on: 'regcact',   twoWay: true,  label: 'β-oxy hóa ty thể (CAT I)' },
  { id: 'lnkAcCyto',   tier: 'secondary', role: 'reg',      fromMods: ['fas'],                 fromNode: 'acetylcoa',    exitSide: 'north', toMods: ['lipidsreg'], toNode: 'acetylcoar',   entrySide: 'west',  on: 'glc2accoa', twoWay: true,  label: 'Acetyl-CoA bào tương' },
  { id: 'lnkAcMat',    tier: 'secondary', role: 'reg',      fromMods: ['betaox', 'boxsimple'], fromNode: 'acetyl',       exitSide: 'south', toMods: ['lipidsreg'], toNode: 'acetylcoamat', entrySide: 'south', on: 'regbeta',   twoWay: true,  label: 'Acetyl-CoA chất nền ty thể' },
  { id: 'lnkPalmInh',  tier: 'secondary', role: 'reg',      fromMods: ['fas'],                 fromNode: 'palmitate',    exitSide: 'south', toMods: ['lipidsreg'], toNode: 'palmsig',      entrySide: 'east',  entryStub: [{ dx: 0, dy: 120 }], on: 'regfas', twoWay: false, label: 'Ức chế ngược ACC' },
  { id: 'lnkGlyCycle', tier: 'secondary', role: 'cycle',    fromMods: ['betaox'],              fromNode: 'glycerol',     exitSide: 'west',  toMods: ['tag'],       toNode: 'glycerol',     entrySide: 'west',  on: 'gk1',       twoWay: true,  label: 'Glycerol chung' },
  { id: 'lnkGlcCyto',  tier: 'secondary', role: 'reg',      fromMods: ['tag'],                 fromNode: 'glucose',      exitSide: 'east',  toMods: ['lipidsreg'], toNode: 'glucose',      entrySide: 'west',  on: 'carb2glc',  twoWay: true,  label: 'Glucose bào tương' },
  { id: 'lnkEloTag',   tier: 'secondary', role: 'transfer', fromMods: ['faelong'],             fromNode: 'palmitoleate', exitSide: 'west',  toMods: ['tag'],       toNode: 'fattyacylcoa', entrySide: 'east',  on: 'gpat1',     twoWay: false, label: 'Acyl-CoA biến đổi → TAG/GPL' }
];
function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
function menuOrder() {
  var out = [];
  (MG.categories || []).forEach(function (g) {
    (g.pathways || []).forEach(function (id) { if (has(MG.pathways, id) && out.indexOf(id) < 0) { out.push(id); } });
  });
  Object.keys(MG.pathways).forEach(function (id) { if (out.indexOf(id) < 0) { out.push(id); } });
  return out;
}
function isMix(id) { return typeof id === 'string' && id.indexOf(PREFIX) === 0; }
function prune(id) {
  if (!isMix(id)) { return null; }
  var parts = id.slice(PREFIX.length).split('+');
  var kept = normalize(parts);
  return kept.length ? idFor(kept) : null;
}
function normalize(list) {
  var want = {};
  (Array.isArray(list) ? list : []).forEach(function (id) {
    if (typeof id === 'string' && has(MG.pathways, id) && !MG.pathways[id].hidden) { want[id] = true; }
  });
  return menuOrder().filter(function (id) { return want[id] === true; });
}
function idFor(list) {
  var ids = normalize(list);
  if (!ids.length) { return null; }
  return ids.length === 1 ? ids[0] : PREFIX + ids.join('+');
}
function parse(id) {
  if (!isMix(id)) { return null; }
  var parts = id.slice(PREFIX.length).split('+');
  var ids = normalize(parts);
  if (ids.length < 2 || ids.length !== parts.length || idFor(ids) !== id) { return null; }
  return ids;
}
function reactionSet(rec) {
  var out = {};
  (rec.order || []).forEach(function (id) { out[id] = true; });
  return out;
}
function strictSubset(a, b) {
  var ka = Object.keys(a);
  return ka.length < Object.keys(b).length && ka.every(function (k) { return b[k] === true; });
}
function sources(list) {
  var sel = normalize(list);
  var pick = function (id) { return sel.indexOf(id) >= 0; };
  sel = sel.filter(function (id) { return !(MG.pathways[id].simpleOf && sel.indexOf(MG.pathways[id].simpleOf) >= 0); });
  if (pick('full') && (pick('lactate') || pick('ethanol'))) {
    sel = sel.map(function (id) { return id === 'full' ? 'pdhtca' : id; });
    sel = sel.filter(function (id, i) { return sel.indexOf(id) === i; });
  }
  var sets = {};
  sel.forEach(function (id) { sets[id] = reactionSet(MG.pathways[id]); });
  sel = sel.filter(function (a) { return !sel.some(function (b) { return b !== a && strictSubset(sets[a], sets[b]); }); });
  var both = pick('lactate') && pick('ethanol');
  var out = [];
  sel.forEach(function (id) {
    if (both && (id === 'lactate' || id === 'ethanol')) {
      if (id === 'lactate') { out.push({ id: 'fermentations', rec: MG.everything._parts.fermentations }); }
      return;
    }
    out.push({ id: id, rec: MG.pathways[id] });
  });
  return out;
}
function fallbackBounds(rec) {
  var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  function grow(x0, y0, x1, y1) {
    if (!isFinite(x0) || !isFinite(y0) || !isFinite(x1) || !isFinite(y1)) { return; }
    b.x0 = Math.min(b.x0, x0); b.y0 = Math.min(b.y0, y0);
    b.x1 = Math.max(b.x1, x1); b.y1 = Math.max(b.y1, y1);
  }
  Object.keys(rec.nodes || {}).forEach(function (n) {
    var p = rec.nodes[n];
    grow(p.x - 70 - PAD, p.y - 76 - PAD, p.x + 70 + PAD, p.y + 76 + PAD);
  });
  (rec.regions || []).forEach(function (g) {
    if (g.type === 'circle') {
      grow(g.cx - g.r, g.cy - g.r - 20, g.cx + g.r, g.cy + g.r);
    } else if (typeof g.x === 'number' && typeof g.w === 'number') {
      grow(g.x, g.y - 20, g.x + g.w, g.y + g.h);
    } else if (Array.isArray(g.nodes) && g.nodes.length) {
      var mx0 = Infinity, my0 = Infinity, mx1 = -Infinity, my1 = -Infinity;
      g.nodes.forEach(function (nid) {
        var nd = rec.nodes[nid];
        if (!nd) { return; }
        mx0 = Math.min(mx0, nd.x - 70); my0 = Math.min(my0, nd.y - 76);
        mx1 = Math.max(mx1, nd.x + 70); my1 = Math.max(my1, nd.y + 76);
      });
      if (mx0 < Infinity) {
        var px = g.padX != null ? g.padX : (g.pad != null ? g.pad : 60);
        var pt = g.padTop != null ? g.padTop : (g.pad != null ? g.pad : 60);
        var pb = g.padBottom != null ? g.padBottom : (g.pad != null ? g.pad : 60);
        grow(mx0 - px, my0 - pt - 20, mx1 + px, my1 + pb);
      }
    }
  });
  (rec.membranes || []).forEach(function (m) {
    grow(Math.min(m.x1, m.x2) - 8, Math.min(m.y1, m.y2) - 8, Math.max(m.x1, m.x2) + 8, Math.max(m.y1, m.y2) + 8);
  });
  (rec.notes || []).forEach(function (n) {
    var size = n.size || 16;
    var w = Math.ceil(String(n.text).length * size * 0.56);
    var x0 = n.anchor === 'end' ? n.x - w : (n.anchor === 'middle' ? n.x - w / 2 : n.x);
    grow(x0, n.y - size, x0 + w, n.y + size * 0.3);
  });
  if (b.x0 === Infinity) { b = { x0: 0, y0: 0, x1: 100, y1: 100 }; }
  b.w = b.x1 - b.x0;
  b.h = b.y1 - b.y0;
  return b;
}
function measureBounds(rec) {
  if (MG.chart && typeof MG.chart.layout === 'function') {
    var b = MG.chart.layout(rec).bounds;
    return { x0: b.x, y0: b.y, x1: b.x + b.w, y1: b.y + b.h, w: b.w, h: b.h };
  }
  return fallbackBounds(rec);
}
function placeSemantic(parts) {
  var bounds = parts.map(function (p) { return measureBounds(p.rec); });
  var placements = new Array(parts.length);
  var lipidIdxs = [], otherIdxs = [];
  parts.forEach(function (p, i) {
    if (has(LIPID_GRID, p.id)) { lipidIdxs.push(i); }
    else { otherIdxs.push(i); }
  });
  var rowSet = {}, colSet = {};
  lipidIdxs.forEach(function (i) {
    var g = LIPID_GRID[parts[i].id];
    rowSet[g.row] = true; colSet[g.col] = true;
  });
  var usedRows = Object.keys(rowSet).map(Number).sort(function (a, b) { return a - b; });
  var usedCols = Object.keys(colSet).map(Number).sort(function (a, b) { return a - b; });
  var rowIdxMap = {}, colIdxMap = {}, rowH = {}, colW = {}, rowY = {}, colX = {};
  usedRows.forEach(function (r, ri) { rowIdxMap[r] = ri; rowH[r] = 0; });
  usedCols.forEach(function (c, ci) { colIdxMap[c] = ci; colW[c] = 0; });
  lipidIdxs.forEach(function (i) {
    var g = LIPID_GRID[parts[i].id];
    rowH[g.row] = Math.max(rowH[g.row], bounds[i].h);
    colW[g.col] = Math.max(colW[g.col], bounds[i].w);
  });
  var curY = 0;
  usedRows.forEach(function (r) { rowY[r] = curY; curY += rowH[r] + GUTTER_Y; });
  var curX = 0;
  usedCols.forEach(function (c) { colX[c] = curX; curX += colW[c] + GUTTER_X; });
  var totalLipidW = usedCols.length ? curX - GUTTER_X : 0;
  var totalLipidH = usedRows.length ? curY - GUTTER_Y : 0;
  var hMid = [], vMid = [];
  for (var ri = 0; ri < usedRows.length - 1; ri++) {
    hMid.push(rowY[usedRows[ri]] + rowH[usedRows[ri]] + GUTTER_Y / 2);
  }
  for (var ci = 0; ci < usedCols.length - 1; ci++) {
    vMid.push(colX[usedCols[ci]] + colW[usedCols[ci]] + GUTTER_X / 2);
  }
  var cells = {};
  lipidIdxs.forEach(function (i) {
    var id = parts[i].id, b = bounds[i], g = LIPID_GRID[id];
    var cx = Math.round(colX[g.col]), cy = Math.round(rowY[g.row]);
    var dx = Math.round(cx - b.x0), dy = Math.round(cy - b.y0);
    placements[i] = { dx: dx, dy: dy };
    cells[id] = {
      id: id, row: g.row, col: g.col, ri: rowIdxMap[g.row], ci: colIdxMap[g.col],
      dx: dx, dy: dy, x0: cx, y0: cy, x1: cx + b.w, y1: cy + b.h
    };
  });
  var baseX = lipidIdxs.length ? Math.round(totalLipidW + GUTTER_X) : 0;
  var ox = baseX, oy = 0, oRowH = 0;
  otherIdxs.forEach(function (i) {
    var b = bounds[i];
    if (ox > baseX && (ox - baseX) + b.w > ROW_WIDTH) {
      ox = baseX; oy += oRowH + GUTTER_Y; oRowH = 0;
    }
    var dx = Math.round(ox - b.x0), dy = Math.round(oy - b.y0);
    placements[i] = { dx: dx, dy: dy };
    ox += b.w + GUTTER_X;
    oRowH = Math.max(oRowH, b.h);
  });
  return {
    placements: placements, cells: cells,
    usedRows: usedRows, usedCols: usedCols, rowY: rowY, rowH: rowH, colX: colX, colW: colW,
    hMid: hMid, vMid: vMid, hTop: -160, hBot: totalLipidH + 160, vLeft: -160, vRight: totalLipidW + 160,
    lipidCount: lipidIdxs.length
  };
}
function findPillLocalAnchor(rec, rxnId, fallbackNode) {
  var r = (rec.reactions || []).filter(function (x) { return x.id === rxnId; })[0];
  if (r && r.arrows && r.arrows[0]) {
    var nA = rec.nodes[r.arrows[0].from], nB = rec.nodes[r.arrows[0].to];
    if (nA && nB) { return { x: (nA.x + nB.x) / 2, y: (nA.y + nB.y) / 2 }; }
  }
  return rec.nodes[fallbackNode];
}
function routeCrossLinks(parts, layoutInfo, blockMaps) {
  if (layoutInfo.lipidCount < 2) { return []; }
  var cells = layoutInfo.cells, usedRows = layoutInfo.usedRows, usedCols = layoutInfo.usedCols;
  var hMid = layoutInfo.hMid, vMid = layoutInfo.vMid;
  var usedTracks = {};
  function allocTrack(key) {
    var i = usedTracks[key] || 0;
    usedTracks[key] = i + 1;
    return i < TRACK_OFFSETS.length ? TRACK_OFFSETS[i] : ((i % 2 === 0 ? 1 : -1) * Math.ceil(i / 2) * 52);
  }
  function gutterInfo(side, cell) {
    if (side === 'west') { return { axis: 'V', ch: cell.ci > 0 ? 'V:' + (cell.ci - 1) : 'V:L', base: cell.ci > 0 ? vMid[cell.ci - 1] : layoutInfo.vLeft }; }
    if (side === 'east') { return { axis: 'V', ch: cell.ci < usedCols.length - 1 ? 'V:' + cell.ci : 'V:R', base: cell.ci < usedCols.length - 1 ? vMid[cell.ci] : layoutInfo.vRight }; }
    if (side === 'north') { return { axis: 'H', ch: cell.ri > 0 ? 'H:' + (cell.ri - 1) : 'H:T', base: cell.ri > 0 ? hMid[cell.ri - 1] : layoutInfo.hTop }; }
    return { axis: 'H', ch: cell.ri < usedRows.length - 1 ? 'H:' + cell.ri : 'H:B', base: cell.ri < usedRows.length - 1 ? hMid[cell.ri] : layoutInfo.hBot };
  }
  function bridgeGutter(axis, cA, cB) {
    if (axis === 'H') {
      if (cA.ri !== cB.ri) {
        var rIdx = Math.min(cA.ri, cB.ri);
        return { ch: 'H:' + rIdx, base: hMid[rIdx] };
      }
      if (cA.ri > 0) { return { ch: 'H:' + (cA.ri - 1), base: hMid[cA.ri - 1] }; }
      if (hMid.length > 0) { return { ch: 'H:0', base: hMid[0] }; }
      return { ch: 'H:B', base: layoutInfo.hBot };
    }
    if (cA.ci !== cB.ci) {
      var cIdx = Math.min(cA.ci, cB.ci);
      return { ch: 'V:' + cIdx, base: vMid[cIdx] };
    }
    if (cA.ci > 0) { return { ch: 'V:' + (cA.ci - 1), base: vMid[cA.ci - 1] }; }
    if (vMid.length > 0) { return { ch: 'V:0', base: vMid[0] }; }
    return { ch: 'V:R', base: layoutInfo.vRight };
  }
  function cleanVia(pts) {
    var dedup = [];
    pts.forEach(function (p) {
      var last = dedup[dedup.length - 1];
      if (!last || Math.abs(p.x - last.x) + Math.abs(p.y - last.y) > 1) {
        dedup.push({ x: Math.round(p.x), y: Math.round(p.y) });
      }
    });
    if (dedup.length <= 2) { return dedup; }
    var out = [dedup[0]];
    for (var k = 1; k < dedup.length - 1; k++) {
      var a = out[out.length - 1], b = dedup[k], c = dedup[k + 1];
      var colH = Math.abs(a.y - b.y) < 1 && Math.abs(b.y - c.y) < 1;
      var colV = Math.abs(a.x - b.x) < 1 && Math.abs(b.x - c.x) < 1;
      if (!colH && !colV) { out.push(b); }
    }
    out.push(dedup[dedup.length - 1]);
    return out;
  }
  var showSecondary = parts.length <= 3;
  var earlyFork = !!(cells.fas && cells.tag && cells.faelong && hMid.length > 0 && vMid.length > 0);
  var out = [];
  CROSS_LINKS.forEach(function (spec) {
    if (spec.tier === 'secondary' && !showSecondary) { return; }
    var fromId = spec.fromMods.filter(function (m) { return has(cells, m) && has(blockMaps, m); })[0];
    var toId = spec.toMods.filter(function (m) { return has(cells, m) && has(blockMaps, m); })[0];
    if (!fromId || !toId) { return; }
    var fMap = blockMaps[fromId], tMap = blockMaps[toId];
    if (!has(fMap, spec.fromNode) || !has(tMap, spec.toNode)) { return; }
    var fRec = MG.pathways[fromId], tRec = MG.pathways[toId];
    var cFrom = cells[fromId], cTo = cells[toId];
    var fLocal = fRec.nodes[spec.fromNode];
    var tLocal = spec.toPill ? findPillLocalAnchor(tRec, spec.toPill, spec.toNode) : tRec.nodes[spec.toNode];
    if (!fLocal || !tLocal) { return; }
    var A0 = { x: fLocal.x + cFrom.dx, y: fLocal.y + cFrom.dy };
    var B0 = { x: tLocal.x + cTo.dx, y: tLocal.y + cTo.dy };
    if (earlyFork && (spec.id === 'lnkPalmTag' || spec.id === 'lnkPalmElo')) {
      var yFork = hMid[0] - 104;
      var xPalm = A0.x;
      if (spec.id === 'lnkPalmTag') {
        var xTagTrack = vMid[0] - 90;
        out.push({
          on: spec.on, from: fMap[spec.fromNode], to: tMap[spec.toNode],
          toPill: null, twoWay: false, dashed: true, role: spec.role, label: spec.label,
          via: cleanVia([
            { x: xPalm, y: yFork },
            { x: xTagTrack, y: yFork },
            { x: xTagTrack, y: B0.y }
          ])
        });
      } else {
        var xFaTrack = vMid[0] + 90;
        var yTurn = layoutInfo.rowY[1] + 220;
        out.push({
          on: spec.on, from: fMap[spec.fromNode], to: tMap[spec.toNode],
          toPill: null, twoWay: false, dashed: true, role: spec.role, label: spec.label,
          junction: { x: xPalm, y: yFork },
          via: cleanVia([
            { x: xPalm, y: yFork },
            { x: xPalm, y: yTurn },
            { x: xFaTrack, y: yTurn },
            { x: xFaTrack, y: B0.y }
          ])
        });
      }
      return;
    }
    var exPts = (spec.exitStub || []).map(function (s) { return { x: A0.x + s.dx, y: A0.y + s.dy }; });
    var enPts = (spec.entryStub || []).map(function (s) { return { x: B0.x + s.dx, y: B0.y + s.dy }; });
    var pExit = exPts.length ? exPts[exPts.length - 1] : A0;
    var pEntry = enPts.length ? enPts[0] : B0;
    var g1 = gutterInfo(spec.exitSide, cFrom), g2 = gutterInfo(spec.entrySide, cTo);
    var via = exPts.slice();
    if (g1.axis === g2.axis && g1.ch === g2.ch) {
      var sharedPos = g1.base + allocTrack(g1.ch);
      if (g1.axis === 'V') {
        via.push({ x: sharedPos, y: pExit.y }, { x: sharedPos, y: pEntry.y });
      } else {
        via.push({ x: pExit.x, y: sharedPos }, { x: pEntry.x, y: sharedPos });
      }
    } else {
      var pos1 = g1.base + allocTrack(g1.ch);
      var pos2 = g2.base + allocTrack(g2.ch);
      var G1 = g1.axis === 'V' ? { x: pos1, y: pExit.y } : { x: pExit.x, y: pos1 };
      var G2 = g2.axis === 'V' ? { x: pos2, y: pEntry.y } : { x: pEntry.x, y: pos2 };
      via.push(G1);
      if (g1.axis === 'V' && g2.axis === 'H') {
        via.push({ x: G1.x, y: G2.y });
      } else if (g1.axis === 'H' && g2.axis === 'V') {
        via.push({ x: G2.x, y: G1.y });
      } else if (g1.axis === 'V') {
        var bh = bridgeGutter('H', cFrom, cTo);
        var hy = bh.base + allocTrack(bh.ch);
        via.push({ x: G1.x, y: hy }, { x: G2.x, y: hy });
      } else {
        var bv = bridgeGutter('V', cFrom, cTo);
        var vx = bv.base + allocTrack(bv.ch);
        via.push({ x: vx, y: G1.y }, { x: vx, y: G2.y });
      }
      via.push(G2);
    }
    via = via.concat(enPts);
    out.push({
      on: spec.on, from: fMap[spec.fromNode], to: tMap[spec.toNode],
      toPill: spec.toPill || null, twoWay: !!spec.twoWay, dashed: true, role: spec.role, label: spec.label,
      via: cleanVia(via)
    });
  });
  return out;
}
function composeGridParts(parts, spec) {
  var layoutInfo = placeSemantic(parts);
  var at = layoutInfo.placements;
  return T.compose({
    id: spec.id,
    title: spec.title,
    subtitle: spec.subtitle,
    tag: spec.tag,
    location: spec.location,
    color: spec.color,
    summary: spec.summary,
    scope: spec.scope,
    blocks: parts.map(function (p, i) {
      return { from: p.rec, dx: at[i].dx, dy: at[i].dy, key: p.id, names: T.namesFor(p.id) };
    }),
    buildLinks: function (blockMaps) {
      return routeCrossLinks(parts, layoutInfo, blockMaps);
    }
  });
}
function unique(list) {
  return list.filter(function (x, i) { return list.indexOf(x) === i; });
}
function build(list) {
  var ids = normalize(list);
  if (ids.length < 2) { return null; }
  var id = idFor(ids);
  var parts = sources(ids);
  var titles = ids.map(function (pid) { return MG.pathways[pid].title; });
  var summary = [];
  var locations = [];
  parts.forEach(function (p) {
    (p.rec.summary || []).forEach(function (line) { summary.push(line); });
    if (p.rec.location) { locations.push(p.rec.location); }
  });
  var every = ids.length === menuOrder().length;
  var rec = composeGridParts(parts, {
    id: id,
    title: every ? 'Tất cả mọi thứ: Tất cả các con đường' : (titles.length <= 3 ? titles.join(' + ') : titles.slice(0, 2).join(' + ') + ' + ' + (titles.length - 2) + ' hơn'),
    subtitle: ids.length + ' các tuyến đường trên một bản đồ',
    tag: 'MIX', location: unique(locations).join('; '), color: MG.pathways[ids[0]].color,
    summary: unique(summary), scope: { type: 'custom', id: id }
  });
  rec.custom = ids.slice();
  return rec;
}
function rebuildLipidsEverything() {
  var cat = (MG.categories || []).filter(function (c) { return c.id === 'lipids'; })[0];
  var base = MG.everything['everything-lipids'] || MG.pathways['everything-lipids'];
  var rawIds = cat ? cat.pathways : ['betaox', 'fas', 'faelong', 'desatmech', 'tag', 'lipidsreg'];
  var parts = sources(rawIds);
  var rec = composeGridParts(parts, {
    id: 'everything-lipids',
    title: base ? base.title : 'Tất cả: Lipid',
    subtitle: base ? base.subtitle : 'β-oxy hóa, sinh tổng hợp axit béo, desaturase, TAG/GPL và điều hòa ACC–CAT I trên một bản đồ',
    tag: 'ALL',
    location: base ? base.location : 'Tế bào chất, lưới nội chất và ty thể',
    color: (cat && cat.color) || '#B8CC8A',
    summary: base ? base.summary : [],
    scope: { type: 'category', id: 'lipids' }
  });
  MG.everything['everything-lipids'] = rec;
  Object.defineProperty(MG.pathways, 'everything-lipids', { value: rec, enumerable: false, writable: false, configurable: true });
  return rec;
}
function resolve(id) {
  if (!isMix(id)) { return null; }
  if (has(MG.pathways, id)) { return MG.pathways[id]; }
  var ids = parse(id);
  if (!ids) { return null; }
  var rec = build(ids);
  if (!rec || rec.id !== id) { return null; }
  Object.defineProperty(MG.pathways, id, { value: rec, enumerable: false, writable: false, configurable: true });
  return rec;
}
MG.custom = {
  PREFIX: PREFIX, normalize: normalize, idFor: idFor, parse: parse, isMix: isMix,
  resolve: resolve, build: build, sources: sources, prune: prune,
  LIPID_GRID: LIPID_GRID, CROSS_LINKS: CROSS_LINKS,
  measureBounds: measureBounds, placeSemantic: placeSemantic, rebuildLipidsEverything: rebuildLipidsEverything
};
})(typeof window !== 'undefined' ? window : globalThis);
