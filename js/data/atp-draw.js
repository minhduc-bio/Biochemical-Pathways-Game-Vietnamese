(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var SUB2 = '₂';
var MINUS = '−';
var EPS = 1e-9;
var SETS = {
modern: {
id: 'modern', nadh: 2.5, fadh2: 1.5, title: 'NADH 2,5, FADH' + SUB2 + ' 1,5',
text: 'NADH có giá trị 2,5 ATP và FADH' + SUB2 + ' 1,5 ATP, nên một glucose tạo ra 30 hoặc 32 ATP.'
},
classic: {
id: 'classic', nadh: 3, fadh2: 2, title: 'NADH 3, FADH' + SUB2 + ' 2',
text: 'NADH có giá trị 3 ATP và FADH' + SUB2 + ' 2 ATP, nên một glucose tạo ra 36 hoặc 38 ATP.'
}
};
function set(id) { return Object.prototype.hasOwnProperty.call(SETS, id) ? SETS[id] : SETS.modern; }
function worth(kind, s, shuttle) {
if (kind === 'nadh') { return s.nadh; }
if (kind === 'fadh2') { return s.fadh2; }
if (kind === 'nadhc') { return shuttle === 'gp' ? s.fadh2 : s.nadh; }
if (kind === 'nadph') { return 0; }   // NADPH is counted on its own (the Advanced scenarios), never turned into ATP
return 1;
}
function format(n) {
var v = Math.round(n * 1000) / 1000;
var text = String(Math.abs(v)).replace('.', ',');
return v < 0 ? MINUS + text : text;
}
function parseNumber(text) {
if (typeof text === 'number') { return isFinite(text) ? text : NaN; }
if (typeof text !== 'string') { return NaN; }
var t = text.replace(/\s+/g, '').replace(/[−–‒]/g, '-').replace(',', '.').replace(/^\+/, '');
if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) { return NaN; }
return parseFloat(t);
}
function same(a, b) { return Math.abs(a - b) < EPS; }
function stepFor(values) {
return values.some(function (v) { return Math.abs(v * 2 - Math.round(v * 2)) < EPS && Math.abs(v - Math.round(v)) > EPS; }) ? 0.5 : 1;
}
function plural(n, one, many) { return n === 1 ? one : (many || one + 's'); }
var FA_NAMES = {
'4:0': 'axit butyric', '6:0': 'axit caproic', '8:0': 'axit caprylic', '10:0': 'axit capric', '12:0': 'axit lauric', '14:0': 'axit myristic',
'16:0': 'axit palmitic', '18:0': 'axit stearic', '20:0': 'axit arachidic', '22:0': 'axit behenic', '24:0': 'axit lignoceric',
'16:1': 'axit palmitoleic', '18:1': 'axit oleic', '18:2': 'axit linoleic', '18:3': 'axit linolenic', '20:4': 'axit arachidonic'
};
function fattyAcid(carbons, doubleBonds) {
var c = Math.round(Number(carbons));
var k = Math.round(Number(doubleBonds) || 0);
if (!isFinite(c) || c < 4) { c = 4; }
if (c > 30) { c = 30; }
if (c % 2) { c -= 1; }
var maxK = Math.min(4, Math.floor((c - 2) / 3));
if (!isFinite(k) || k < 0) { k = 0; }
if (k > maxK) { k = maxK; }
var label = c + ':' + k;
return {
carbons: c, doubleBonds: k, label: label, name: FA_NAMES[label] || null,
rounds: c / 2 - 1, acetyl: c / 2
};
}
function faTitle(fa) { return fa.name ? fa.name.charAt(0).toUpperCase() + fa.name.slice(1) + ' (' + fa.label + ')' : fa.label + ' axit béo'; }
function article(n) { return n === 8 || n === 18 ? 'an' : 'a'; }
function round3(v) { return Math.round(v * 1000) / 1000; }
var DB_AT = { '16:1': [9], '18:1': [9], '18:2': [9, 12], '18:3': [9, 12, 15], '20:4': [5, 8, 11, 14] };
function doubleBondAt(fa) {
if (!fa.doubleBonds) { return []; }
if (DB_AT[fa.label]) { return DB_AT[fa.label].slice(); }
var first = Math.max(3, Math.min(9, fa.carbons - 2 - 3 * (fa.doubleBonds - 1)));
var out = [];
for (var i = 0; i < fa.doubleBonds; i++) { out.push(first + 3 * i); }
return out;
}
function fattyAcidGeometry(carbons, doubleBonds, opts) {
var fa = fattyAcid(carbons, doubleBonds);
var numbered = !!(opts && opts.numbered);
var n = fa.carbons;
var atoms = [];
var bonds = [];
var i;
for (i = 0; i < n; i++) {
atoms.push({ x: round3(i * 0.866), y: i % 2 ? 0.5 : 0, el: 'C', label: numbered ? { runs: [{ t: String(i + 1), main: true }] } : null });
}
atoms.push({ x: 0, y: -1, el: 'O', label: { runs: [{ t: 'O', main: true }] } });
atoms.push({ x: -0.866, y: 0.5, el: 'O', label: { runs: [{ t: 'O', main: true }, { t: MINUS, style: 'sup' }] } });
var at = doubleBondAt(fa);
for (i = 0; i < n - 1; i++) { bonds.push({ a: i, b: i + 1, o: at.indexOf(i + 1) >= 0 ? 2 : 1, s: 0 }); }
bonds.push({ a: 0, b: n, o: 2, s: 0 });
bonds.push({ a: 0, b: n + 1, o: 1, s: 0 });
var groups = { carboxyl: { atoms: [0, n, n + 1], bonds: [n - 1, n] } };
if (at.length) {
var dbAtoms = [];
var dbBonds = [];
at.forEach(function (p) { dbBonds.push(p - 1); [p - 1, p].forEach(function (q) { if (dbAtoms.indexOf(q) < 0) { dbAtoms.push(q); } }); });
groups.doubleBonds = { atoms: dbAtoms, bonds: dbBonds };
}
return {
id: 'fa' + fa.carbons + '_' + fa.doubleBonds + (numbered ? '_n' : ''), atoms: atoms, bonds: bonds, groups: groups,
bbox: { x0: -0.866, y0: -1, x1: round3((n - 1) * 0.866), y1: 0.5 }
};
}
var MOLECULE_FOR = { tca: 'acetylcoa', pyruvate: 'pyruvate', glycolysis: 'glucose', glucose: 'glucose', fermentation: 'glucose', uncoupled: 'glucose' };
var MOLECULE_NAME = { acetylcoa: 'Acetyl-CoA', pyruvate: 'Pyruvat', glucose: 'Glucose' };
var MOLECULE_CARBONS = { acetylcoa: 2, pyruvate: 3, glucose: 6 };
function structureOf(id, opts) {
var o = normalizeOpts(opts);
var packed = scenario(id);
if (packed && typeof packed.ledger === 'function') { return packed.ledger(o).structure || null; }
if (id === 'fattyacid') {
var fa = fattyAcid(o.carbons, o.doubleBonds);
return {
kind: 'fatty', mol: null, carbons: fa.carbons, doubleBonds: fa.doubleBonds, name: faTitle(fa), blind: 'Một axit béo',
facts: [fa.carbons + ' cacbon', fa.doubleBonds + ' C=C kép ' + plural(fa.doubleBonds, 'bond')]
};
}
var mol = MOLECULE_FOR[id];
if (!mol) { return null; }
var c = MOLECULE_CARBONS[mol];
return {
kind: 'molecule', mol: mol, carbons: c, doubleBonds: 0, name: MOLECULE_NAME[mol], blind: MOLECULE_NAME[mol],
facts: [mol === 'acetylcoa' ? c + ' các nguyên tử cacbon trong nhóm axetyl' : c + ' cacbon']
};
}
function readPrompt(st) {
var p = { id: 'read', stage: 'read', kind: 'read', recipe: '' };
if (st.kind === 'fatty') {
var bonds = st.doubleBonds ? st.doubleBonds + ' gấp đôi ' + plural(st.doubleBonds, 'bond') : 'không có liên kết đôi';
p.text = 'Hãy nhìn vào cấu trúc. Chuỗi này có bao nhiêu nguyên tử cacbon và có bao nhiêu liên kết đôi C=C?';
p.fields = [fieldFor('carbons', 'Cacbon', st.carbons, 1, 2, 40), fieldFor('doubleBonds', 'liên kết đôi C=C', st.doubleBonds, 1, 0, 8)];
p.hints = [
'Mỗi góc và điểm cuối của đường zigzag đều là một nguyên tử carbon, và nguyên tử carbon của nhóm carboxyl ở đầu bên trái cũng vậy.',
'Liên kết đôi được vẽ bằng hai đường thẳng song song nối giữa hai nguyên tử carbon.'
];
p.working = st.carbons + ' cacbon, ' + bonds;
return p;
}
if (st.mol === 'glucose') {
p.text = 'Hãy nhìn vào cấu trúc. Glucose có bao nhiêu nguyên tử carbon?';
p.hints = [
'Trong vòng, mỗi góc đều là một nguyên tử carbon ngoại trừ nguyên tử được đánh dấu O, và có thêm một nguyên tử carbon nữa nằm bên ngoài vòng ở vị trí CH.' + SUB2 + 'Nhóm OH.',
'Glucose là một loại hexose, và hex- có nghĩa là sáu.'
];
} else if (st.mol === 'pyruvate') {
p.text = 'Hãy nhìn vào cấu trúc. Pyruvate có bao nhiêu nguyên tử cacbon?';
p.hints = [
'Một góc hoặc một đầu không có nhãn là một carbon.',
'Pyruvate là một axit keto: gồm một nhóm metyl, một nhóm cacbonyl và một nhóm cacboxylat, mỗi nhóm đều có một nguyên tử cacbon riêng.'
];
} else {
p.text = 'Hãy nhìn vào cấu trúc. Nhóm acetyl của acetyl-CoA mang bao nhiêu nguyên tử carbon vào chu trình?';
p.hints = [
'Nhóm acetyl là phần được vẽ trước nguyên tử lưu huỳnh: một nhóm methyl và một nhóm carbonyl.',
'Phần coenzyme A vẫn nằm lại phía sau khi nhóm acetyl đi vào chu trình.'
];
}
p.fields = [fieldFor('carbons', 'Cacbon', st.carbons, 1, 1, 40)];
p.working = st.carbons + ' cacbon';
return p;
}
function carrierWords(each) {
var parts = [];
each.forEach(function (e) {
var word = e.kind === 'fadh2' ? 'FADH' + SUB2 : (e.kind === 'atp' ? (e.label || 'ATP') : (e.kind === 'nadph' ? 'NADPH' : 'NADH'));
parts.push(format(e.n) + ' ' + word);
});
return parts.join(', ');
}
function makeStage(def, sc) {
var runs = def.runs;
var tally = { nadh: 0, fadh2: 0, atp: 0, nadph: 0 };
var cyto = 0;
var money = 0;
def.each.forEach(function (e) {
var n = e.n * runs;
if (e.kind === 'fadh2') { tally.fadh2 += n; }
else if (e.kind === 'atp') { tally.atp += n; }
else if (e.kind === 'nadph') { tally.nadph += n; }
else { tally.nadh += n; if (e.kind === 'nadhc') { cyto += n; } }
money += n * (sc.uncoupled && e.kind !== 'atp' ? 0 : worth(e.kind, sc.set, sc.shuttle));
});
var terms = [];
var nadhIn = tally.nadh - cyto;
var perNadh = sc.uncoupled ? 0 : sc.set.nadh;
var perCyto = sc.uncoupled ? 0 : worth('nadhc', sc.set, sc.shuttle);
var perFad = sc.uncoupled ? 0 : sc.set.fadh2;
if (tally.atp) { terms.push(format(tally.atp)); }
if (cyto) { terms.push(format(cyto) + ' × ' + format(perCyto)); }
if (nadhIn) { terms.push(format(nadhIn) + ' × ' + format(perNadh)); }
if (tally.fadh2) { terms.push(format(tally.fadh2) + ' × ' + format(perFad)); }
var working = terms.length ? terms.join(' + ').replace(/\+ -/g, '+ ' + MINUS) : '0';
working = working.replace(/\+ −/g, '− ');
var shown = working + ' = ' + format(money);
if (sc.counts) { shown = countsWorking(def.each, runs); }
return {
id: def.id, title: def.title, where: def.where || '', runs: runs, runsLabel: def.runsLabel || '', runsText: def.runsText || '',
runsHint: def.runsHint || '', tallyText: def.tallyText || '',
per: def.per || '', recipe: def.per ? 'Theo ' + def.per + ': ' + carrierWords(def.each) : carrierWords(def.each),
rule: def.rule, tally: tally, cyto: cyto, worth: money, working: shown, each: def.each, note: def.note || '',
text: def.text || '', info: !def.each.length
};
}
function countsWorking(each, runs) {
var parts = [];
['atp', 'nadph'].forEach(function (kind) {
var n = 0;
each.forEach(function (e) { if (e.kind === kind) { n += e.n; } });
if (!n) { return; }
parts.push((kind === 'nadph' ? 'NADPH ' : 'ATP ') + (runs === 1 ? format(n) : runs + ' × ' + format(n) + ' = ' + format(n * runs)));
});
return parts.length ? parts.join(', ') : 'không có hãng vận chuyển';
}
var STAGE_DEFS = {
gly: function (runs) {
return {
id: 'gly', title: 'Đường phân', where: 'Tế bào chất', runs: 1, per: 'glucose',
each: [{ kind: 'atp', n: 2, label: 'ATP ròng' }, { kind: 'nadhc', n: 2 }],
rule: 'Tính toán lượng ATP được tạo ra trực tiếp và lượng NADH được tạo ra khi glyceraldehyde 3-phosphate bị oxy hóa. Lượng NADH này được tạo ra trong tế bào chất, vì vậy nó cần một chất vận chuyển.'
};
},
link: function (runs, fromGlucose) {
return {
id: 'link', title: 'Pyruvate thành acetyl-CoA', where: 'Chất nền ty thể', runs: runs, per: 'pyruvate',
runsText: fromGlucose ? 'Một phân tử glucose tạo ra bao nhiêu pyruvate?' : '', runsLabel: 'pyruvate',
runsHint: 'Quá trình đường phân phân tách glucose sáu carbon thành hai phần ba carbon.',
each: [{ kind: 'nadh', n: 1 }],
rule: 'Pyruvate dehydrogenase oxy hóa pyruvate và giải phóng CO₂.' + SUB2 + 'và nó làm giảm số lượng chất mang cho mỗi phân tử pyruvate.'
};
},
tca: function (runs, fromGlucose) {
return {
id: 'tca', title: 'Chu trình TCA', where: 'Chất nền ty thể', runs: runs, per: 'turn',
runsText: fromGlucose ? 'Chu trình TCA diễn ra bao nhiêu lần để tạo ra một phân tử glucose?' : '', runsLabel: 'lượt',
runsHint: 'Mỗi phân tử pyruvate chuyển hóa thành một phân tử acetyl-CoA, và mỗi phân tử acetyl-CoA hoàn thành một vòng chu trình.',
each: [{ kind: 'nadh', n: 3 }, { kind: 'fadh2', n: 1 }, { kind: 'atp', n: 1, label: 'GTP' }],
rule: 'Đếm số bước khử NAD⁺, bước khử FAD (succinate dehydrogenase) và bước tạo ra nucleoside triphosphate (succinyl-CoA synthetase).'
};
}
};
var SCENARIOS = [
{ id: 'facts', type: 'facts', group: 'Khởi động', title: 'Kiến thức nhanh', subtitle: 'Giá trị chất mang, hệ shuttle, proton và kiến thức cơ bản về lipid', options: [] },
{ id: 'structure', type: 'structure', group: 'Khởi động', title: 'Từ công thức cấu tạo', subtitle: 'Đọc công thức hóa học, sau đó tính lượng ATP', options: [] },
{ id: 'tca', type: 'ledger', group: 'Glucose', title: 'Một vòng của chu trình TCA', subtitle: 'Từ một acetyl-CoA đến CO' + SUB2, options: [] },
{ id: 'pyruvate', type: 'ledger', group: 'Glucose', title: 'Pyruvate thành CO' + SUB2, subtitle: 'Link reaction và một vòng chu trình', options: [] },
{ id: 'glycolysis', type: 'ledger', group: 'Glucose', title: 'Đường phân khi có oxygen', subtitle: 'Glucose thành pyruvate, sau đó qua shuttle', options: ['shuttle'] },
{ id: 'glucose', type: 'ledger', group: 'Glucose', title: 'Oxy hóa hoàn toàn một phân tử glucose', subtitle: 'Đường phân, phản ứng chuyển tiếp và chu trình TCA', options: ['shuttle'] },
{ id: 'fermentation', type: 'ledger', group: 'Glucose', title: 'Một phân tử glucose khi không có oxygen', subtitle: 'Lên men tạo lactate hoặc ethanol', options: [] },
{ id: 'uncoupled', type: 'ledger', group: 'Glucose', title: 'Một phân tử glucose khi có chất phá ghép cặp', subtitle: 'Electron vẫn được truyền nhưng ATP synthase không tổng hợp ATP', options: [] },
{ id: 'fattyacid', type: 'ledger', group: 'Chất béo', title: 'Một acid béo', subtitle: 'Hoạt hóa, beta-oxidation và chu trình TCA', options: ['fattyacid'] }
];
function scenario(id) {
for (var i = 0; i < SCENARIOS.length; i++) { if (SCENARIOS[i].id === id) { return SCENARIOS[i]; } }
return null;
}
function stageDefs(id, o) {
var S = STAGE_DEFS;
if (id === 'tca') { return [S.tca(1, false)]; }
if (id === 'pyruvate') { return [S.link(1, false), S.tca(1, false)]; }
if (id === 'glycolysis') { return [S.gly()]; }
if (id === 'glucose' || id === 'uncoupled') { return [S.gly(), S.link(2, true), S.tca(2, true)]; }
if (id === 'fermentation') {
var g = S.gly();
return [{
id: 'gly', title: 'Đường phân và quá trình lên men', where: 'Tế bào chất', runs: 1, per: 'glucose',
each: [{ kind: 'atp', n: 2, label: 'ATP ròng' }],
tallyText: 'Quá trình đường phân và lên men: tính toán lượng chất còn lại trong chuỗi phản ứng và lượng ATP được tạo ra trực tiếp từ một phân tử glucose.',
rule: 'Tính toán lượng ATP ròng của quá trình đường phân. Lượng NADH được tạo ra sẽ được sử dụng hết khi pyruvate bị khử thành lactate (hoặc ethanol), vì vậy không còn chất mang nào cho chuỗi phản ứng.',
note: g.rule
}];
}
if (id === 'fattyacid') {
var fa = fattyAcid(o.carbons, o.doubleBonds);
var out = [
{
id: 'act', title: 'Kích hoạt', where: 'Tế bào chất', runs: 1, per: 'axit béo',
each: [{ kind: 'atp', n: -2, label: 'lượng ATP tương đương' }],
rule: 'Việc gắn axit béo vào coenzyme A sẽ phân tách ATP thành AMP và pyrophosphate: hãy đếm số liên kết năng lượng cao bị tiêu hao.'
},
{
id: 'box', title: 'Quá trình oxy hóa beta', where: 'Chất nền ty thể', runs: fa.rounds, per: 'round',
runsText: 'Quá trình beta-oxy hóa diễn ra bao nhiêu vòng? ' + article(fa.carbons) + ' ' + fa.carbons + '-Cần axit béo cacbon?', runsLabel: 'vòng',
runsHint: 'Mỗi vòng cắt bỏ hai nguyên tử carbon, và vòng cuối cùng để lại hai phân tử acetyl-CoA cùng một lúc, vì vậy số vòng cắt ít hơn số lượng acetyl-CoA một đơn vị.',
each: [{ kind: 'fadh2', n: 1 }, { kind: 'nadh', n: 1 }],
rule: 'Mỗi chu trình đều có một bước oxy hóa làm giảm FAD và một bước khác làm giảm NAD⁺.'
},
{
id: 'tca', title: 'Acetyl-CoA trong chu trình TCA', where: 'Chất nền ty thể', runs: fa.acetyl, per: 'acetyl-CoA',
runsText: 'Có bao nhiêu acetyl-CoA? ' + article(fa.carbons) + ' ' + fa.carbons + 'Axit béo cacbon cho ra?', runsLabel: 'acetyl-CoA',
runsHint: 'Cứ mỗi hai nguyên tử carbon trong chuỗi sẽ tách ra thành một acetyl-CoA.',
each: [{ kind: 'nadh', n: 3 }, { kind: 'fadh2', n: 1 }, { kind: 'atp', n: 1, label: 'GTP' }],
rule: 'Mỗi phân tử acetyl-CoA đều trải qua một vòng chu trình TCA: hãy đếm số bước NAD⁺, bước FAD và bước tạo ra nucleoside triphosphate.'
}
];
if (fa.doubleBonds) {
out.push({
id: 'db', title: 'Liên kết đôi', where: 'Chất nền ty thể', runs: fa.doubleBonds, per: 'liên kết đôi',
each: [{ kind: 'fadh2', n: -1 }],
rule: 'Tại vị trí chuỗi đã có liên kết đôi, enzyme isomerase sẽ thay thế cho acyl-CoA dehydrogenase, do đó FADH' + SUB2 + ' Bước đó không bao giờ được thực hiện.'
});
}
return out;
}
return [];
}
function introFor(id, sc, o) {
var s = sc.set;
var shuttleText = sc.shuttle === 'gp' ? 'chu trình glycerol phosphate (mỗi NADH trong tế bào chất có giá trị ' + format(s.fadh2) + ')' :
'chu trình malate-aspartate (mỗi NADH trong tế bào chất có giá trị ' + format(s.nadh) + ')';
if (id === 'glycolysis' || id === 'glucose') { return 'Đếm với ' + s.title + ', sử dụng ' + shuttleText + '.'; }
if (id === 'uncoupled') { return 'Đếm với ' + s.title + 'Một chất tách cặp như 2,4-dinitrophenol cho phép các proton rò rỉ ngược trở lại qua màng trong, do đó ATP synthase không có gradient để sử dụng.'; }
if (id === 'fermentation') { return 'Vì không có oxy nên không có chất nào đến được chuỗi phản ứng.'; }
if (id === 'fattyacid') { return 'Đếm với ' + s.title + 'Việc kích hoạt được thanh toán bằng 2 đơn vị ATP tương đương.'; }
return 'Đếm với ' + s.title + '.';
}
function unitFor(id, o) {
if (id === 'tca') { return 'một acetyl-CoA'; }
if (id === 'pyruvate') { return 'một pyruvate'; }
if (id === 'fattyacid') { return 'một ' + faTitle(fattyAcid(o.carbons, o.doubleBonds)).replace(/^([A-Z])/, function (m) { return m.toLowerCase(); }); }
return 'một glucose';
}
function titleFor(id, o) {
var sc = scenario(id);
if (id === 'fattyacid') { return faTitle(fattyAcid(o.carbons, o.doubleBonds)); }
if (id === 'glycolysis' || id === 'glucose') { return sc.title + (o.shuttle === 'gp' ? ', vận chuyển glycerol phosphate' : ', vận chuyển malate-aspartate'); }
return sc.title;
}
function normalizeOpts(opts) {
var o = opts || {};
var fa = fattyAcid(o.carbons === undefined ? 16 : o.carbons, o.doubleBonds || 0);
return {
convention: set(o.convention).id, shuttle: o.shuttle === 'gp' ? 'gp' : 'ma',
carbons: fa.carbons, doubleBonds: fa.doubleBonds
};
}
function fieldFor(key, label, answer, step, min, max) {
return { key: key, label: label, answer: answer, step: step, min: min === undefined ? -50 : min, max: max === undefined ? 400 : max };
}
function noteFor(id, o, total) {
if (id === 'glucose' && o.convention === 'modern') { return 'Sách giáo khoa hiện hành đưa ra con số 30 ATP với cơ chế vận chuyển glycerol-phosphate và 32 ATP với cơ chế vận chuyển malate-aspartate.'; }
if (id === 'glucose') { return 'Các sách cũ hơn đưa ra con số 36 ATP với cơ chế vận chuyển glycerol phosphate và 38 ATP với cơ chế vận chuyển malate-aspartate.'; }
if (id === 'fattyacid') {
var fa = fattyAcid(o.carbons, o.doubleBonds);
var before = format(total + 2);
var text = before + ' ATP được tạo ra từ acyl-CoA; 2 đơn vị ATP tương đương cho quá trình hoạt hóa đã được tiêu hao.';
if (fa.label === '18:0' && o.convention === 'modern') { text += ' Như vậy, tổng lượng ATP của axit stearic là 120 ATP.'; }
if (fa.doubleBonds > 1) { text += ' Liên kết đôi tại nguyên tử carbon chẵn cũng cần NADPH, điều mà quy tắc đơn giản này bỏ qua.'; }
return text;
}
if (id === 'uncoupled') { return 'Chỉ còn lại ATP được tạo ra trực tiếp (ở mức chất nền). Các chất mang vẫn nhường electron của chúng, và năng lượng được giải phóng dưới dạng nhiệt.'; }
return '';
}
function carrierPlus(each, times) {
return each.map(function (e) {
var word = e.kind === 'fadh2' ? 'FADH' + SUB2 : (e.kind === 'atp' ? (e.label || 'ATP') : (e.kind === 'nadph' ? 'NADPH' : 'NADH'));
return format(e.n * times) + ' ' + word;
}).join(' + ').replace(/\+ −/g, '− ');
}
function dedupeWork(working) {
var at = working.lastIndexOf(' = ');
return at > 0 && working.slice(0, at) === working.slice(at + 3) ? working.slice(0, at) : working;
}
function buildSheet(id, o, stages, total, st, sumWorking, note) {
var sheet = [];
if (st) {
sheet.push({
id: 'read', title: 'Đọc cấu trúc',
lines: [st.kind === 'fatty' ? st.facts.join(', ') + '.' : (st.mol === 'acetylcoa' ? 'Nhóm acetyl có 2 nguyên tử carbon.' : st.name + ' has ' + st.carbons + ' carbons.')]
});
}
var counts = [];
if (id === 'fattyacid') {
var fa = fattyAcid(o.carbons, o.doubleBonds);
counts.push('Acetyl-CoA = cacbon ÷ 2 = ' + fa.carbons + ' ÷ 2 = ' + fa.acetyl + '.');
counts.push('Số vòng beta-oxy hóa = acetyl-CoA − 1 = ' + fa.acetyl + ' − 1 = ' + fa.rounds + '.');
} else if (id === 'glucose' || id === 'uncoupled') {
counts.push('Glucose (6 nguyên tử carbon) phân ly thành 2 pyruvate, do đó phản ứng liên kết diễn ra 2 lần.');
counts.push('Mỗi phân tử pyruvate tạo ra 1 phân tử acetyl-CoA, do đó chu trình TCA diễn ra 2 vòng.');
}
if (counts.length) { sheet.push({ id: 'count', title: 'Đếm', lines: counts }); }
stages.forEach(function (stage) {
var makes = stage.runs === 1
? (stage.per ? 'Theo ' + stage.per + ': ' : '') + carrierPlus(stage.each, 1) + '.'
: stage.runs + ' × (' + carrierPlus(stage.each, 1) + ') = ' + carrierPlus(stage.each, stage.runs) + '.';
sheet.push({ id: stage.id, title: stage.title, lines: [makes, dedupeWork(stage.working) + ' ATP.'] });
});
var lines = [dedupeWork(sumWorking) + ' ATP.'];
if (id === 'fattyacid') {
var f = fattyAcid(o.carbons, o.doubleBonds);
var c = o.convention === 'classic' ? { a: 8.5, b: 7, db: 2 } : { a: 7, b: 6, db: 1.5 };
lines.push('Đường tắt cho chuỗi n nguyên tử cacbon: ' + format(c.a) + ' × n − ' + c.b + (f.doubleBonds ? ' − ' + format(c.db) + ' × (liên kết đôi)' : '') + ' = ' +
format(c.a) + ' × ' + f.carbons + ' − ' + c.b + (f.doubleBonds ? ' − ' + format(c.db) + ' × ' + f.doubleBonds : '') + ' = ' + format(total) + '.');
}
if (note) { lines.push(note); }
sheet.push({ id: 'total', title: 'Tổng cộng', lines: lines });
return sheet;
}
function build(id, opts) {
var sc0 = scenario(id);
if (!sc0 || sc0.type !== 'ledger') { return null; }
var o = normalizeOpts(opts);
if (typeof sc0.ledger === 'function') { return buildPack(sc0, o); }
var sc = { set: set(o.convention), shuttle: o.shuttle, uncoupled: id === 'uncoupled' };
var stages = stageDefs(id, o).map(function (d) { return makeStage(d, sc); });
var total = 0;
stages.forEach(function (st) { total += st.worth; });
var unit = unitFor(id, o);
var structure = structureOf(id, o);
var prompts = structure ? [readPrompt(structure)] : [];
stages.forEach(function (st) {
if (st.runsText) {
prompts.push({
id: st.id + '.runs', stage: st.id, kind: 'runs', text: st.runsText, recipe: '',
fields: [fieldFor('runs', st.runsLabel, st.runs, 1, 0, 60)],
hints: [st.runsHint || st.rule], working: format(st.runs)
});
}
var runWords = st.runs > 1 ? ' Nó chạy ' + st.runs + ' lần.' : '';
prompts.push({
id: st.id + '.tally', stage: st.id, kind: 'tally', recipe: st.recipe,
text: st.tallyText || (st.title + ': tính toán xem nó tạo ra lợi nhuận gì ' + unit + '.' + runWords),
fields: [
fieldFor('nadh', 'NADH', st.tally.nadh, 1), fieldFor('fadh2', 'FADH' + SUB2, st.tally.fadh2, 1), fieldFor('atp', st.each.some(function (e) { return e.kind === 'atp' && e.label === 'GTP'; }) ? 'ATP hoặc GTP' : 'ATP được tạo ra trực tiếp', st.tally.atp, 1)
],
hints: [st.rule, st.recipe + (st.runs > 1 ? ', ' + st.runs + ' lần' : '') + '.'],
working: 'NADH ' + format(st.tally.nadh) + ', FADH' + SUB2 + ' ' + format(st.tally.fadh2) + ', ATP ' + format(st.tally.atp)
});
var worthHint = sc.uncoupled ? 'Với bộ tách cặp, không có chất vận chuyển nào cung cấp ATP; chỉ có ATP được tạo ra trực tiếp mới được tính.' :
'NADH có giá trị ' + format(sc.set.nadh) + ', FADH' + SUB2 + ' ' + format(sc.set.fadh2) + (st.cyto ? 'và NADH trong tế bào chất ' + format(worth('nadhc', sc.set, sc.shuttle)) + ' với con thoi này' : '') + '.';
prompts.push({
id: st.id + '.worth', stage: st.id, kind: 'worth', recipe: '',
text: 'Giá trị đó tương đương bao nhiêu ATP?',
fields: [fieldFor('atp', 'ATP', st.worth, stepFor([st.worth, sc.set.nadh, sc.set.fadh2]))],
hints: [worthHint, 'Nhân giá trị của mỗi chất mang với giá trị của nó, sau đó cộng trực tiếp lượng ATP được tạo ra.'],
working: st.working
});
});
var sumWorking = stages.length === 1 ? stages[0].working : stages.map(function (st) { return format(st.worth); }).join(' + ').replace(/\+ −/g, '− ') + ' = ' + format(total);
prompts.push({
id: 'total', stage: '', kind: 'total', recipe: '',
text: 'Cộng tất cả các giai đoạn lại với nhau: có bao nhiêu ATP? ' + unit + ' Giá trị trong tất cả mọi thứ là gì?',
fields: [fieldFor('atp', 'ATP', total, stepFor([total, sc.set.nadh, sc.set.fadh2]))],
hints: ['Cộng tổng ATP của mỗi giai đoạn, tính chi phí là số âm.'],
working: sumWorking
});
var note = noteFor(id, o, total);
var title = titleFor(id, o);
return {
id: id, title: title, blindTitle: id === 'fattyacid' ? 'Một axit béo' : title, unit: unit, intro: introFor(id, sc, o), options: o,
convention: o.convention, shuttle: o.shuttle, stages: stages, prompts: prompts, total: total, working: sumWorking, note: note,
structure: structure, sheet: buildSheet(id, o, stages, total, structure, sumWorking, note)
};
}
function countsTotal(stages) {
var parts = [];
[['atp', 'ATP'], ['nadph', 'NADPH']].forEach(function (k) {
var terms = [];
var sum = 0;
stages.forEach(function (st) { if (st.tally[k[0]]) { terms.push(format(st.tally[k[0]])); sum += st.tally[k[0]]; } });
if (!terms.length) { return; }
parts.push(k[1] + ' ' + (terms.length === 1 ? terms[0] : terms.join(' + ').replace(/\+ −/g, '− ') + ' = ' + format(sum)));
});
return parts.join(', ');
}
function packSheet(led, stages, counts, structure, sumWorking, note) {
var sheet = [];
if (structure) {
sheet.push({ id: 'read', title: 'Đọc cấu trúc', lines: led.readLines || [structure.name + ' has ' + structure.carbons + ' carbons.'] });
}
if (led.counts && led.counts.length) { sheet.push({ id: 'count', title: 'Đếm', lines: led.counts }); }
stages.forEach(function (stage) {
var makes = stage.info ? 'Ở đây không có thứ gì được sản xuất mà bá tước cần cả.'
: (stage.runs === 1 ? (stage.per ? 'Theo ' + stage.per + ': ' : '') + carrierPlus(stage.each, 1) + '.'
: stage.runs + ' × (' + carrierPlus(stage.each, 1) + ') = ' + carrierPlus(stage.each, stage.runs) + '.');
sheet.push({ id: stage.id, title: stage.title, lines: [makes, counts ? stage.working + '.' : dedupeWork(stage.working) + ' ATP.'] });
});
var lines = [counts ? sumWorking + '.' : dedupeWork(sumWorking) + ' ATP.'];
if (note) { lines.push(note); }
sheet.push({ id: 'total', title: 'Tổng cộng', lines: lines });
return sheet;
}
function buildPack(sc0, o) {
var led = sc0.ledger(o);
var counts = led.mode === 'counts';
var sc = { set: set(o.convention), shuttle: o.shuttle, uncoupled: false, counts: counts };
var stages = led.stages.map(function (d) { return makeStage(d, sc); });
var total = 0;
var nadph = 0;
stages.forEach(function (st) { total += counts ? st.tally.atp : st.worth; nadph += st.tally.nadph; });
var unit = led.unit;
var structure = led.structure || null;
var noteText = typeof led.note === 'function' ? led.note(total, nadph) : (led.note || '');
var prompts = [];
if (structure && led.read) {
prompts.push({
id: 'read', stage: 'read', kind: 'read', recipe: '', text: led.read.text, hints: led.read.hints, working: led.read.working,
fields: led.read.fields.map(function (f) { return fieldFor(f.key, f.label, f.answer, 1, 0, 40); })
});
}
stages.forEach(function (st) {
if (st.info) { return; }
if (st.runsText) {
prompts.push({
id: st.id + '.runs', stage: st.id, kind: 'runs', text: st.runsText, recipe: '',
fields: [fieldFor('runs', st.runsLabel, st.runs, 1, 0, 60)],
hints: [st.runsHint || st.rule], working: format(st.runs)
});
}
var runWords = st.runs > 1 ? ' Nó chạy ' + st.runs + ' lần.' : '';
var gtp = st.each.some(function (e) { return e.kind === 'atp' && e.label === 'GTP'; });
prompts.push({
id: st.id + '.tally', stage: st.id, kind: 'tally', recipe: st.recipe,
text: st.tallyText || (st.title + ': tính toán xem nó tạo ra lợi nhuận gì ' + unit + '.' + runWords),
fields: counts
? [fieldFor('atp', 'ATP', st.tally.atp, 1), fieldFor('nadph', 'NADPH', st.tally.nadph, 1)]
: [fieldFor('nadh', 'NADH', st.tally.nadh, 1), fieldFor('fadh2', 'FADH' + SUB2, st.tally.fadh2, 1), fieldFor('atp', gtp ? 'ATP hoặc GTP' : 'ATP được tạo ra trực tiếp', st.tally.atp, 1)],
hints: [st.rule, st.recipe + (st.runs > 1 ? ', ' + st.runs + ' lần' : '') + '.'],
working: counts ? 'ATP ' + format(st.tally.atp) + 'NADPH ' + format(st.tally.nadph)
: 'NADH ' + format(st.tally.nadh) + ', FADH' + SUB2 + ' ' + format(st.tally.fadh2) + ', ATP ' + format(st.tally.atp)
});
if (!counts) {
var worthHint = 'NADH có giá trị ' + format(sc.set.nadh) + ', FADH' + SUB2 + ' ' + format(sc.set.fadh2) + (st.cyto ? 'và NADH trong tế bào chất ' + format(worth('nadhc', sc.set, sc.shuttle)) + ' với con thoi này' : '') + '.';
prompts.push({
id: st.id + '.worth', stage: st.id, kind: 'worth', recipe: '',
text: 'Giá trị đó tương đương bao nhiêu ATP?',
fields: [fieldFor('atp', 'ATP', st.worth, stepFor([st.worth, sc.set.nadh, sc.set.fadh2]))],
hints: [worthHint, 'Nhân giá trị của mỗi chất mang với giá trị của nó, sau đó cộng trực tiếp lượng ATP được tạo ra.'],
working: st.working
});
}
});
var sumWorking = counts ? countsTotal(stages)
: (stages.length === 1 ? stages[0].working : stages.map(function (st) { return format(st.worth); }).join(' + ').replace(/\+ −/g, '− ') + ' = ' + format(total));
prompts.push({
id: 'total', stage: '', kind: 'total', recipe: '',
text: led.totalText || (counts ? 'Cộng tất cả các giai đoạn lại với nhau: tổng cộng bao nhiêu ATP và bao nhiêu NADPH? ' + unit + ' Tổng chi phí là bao nhiêu?' : 'Cộng tất cả các giai đoạn lại với nhau: có bao nhiêu ATP? ' + unit + ' Giá trị trong tất cả mọi thứ là gì?'),
fields: counts ? [fieldFor('atp', 'ATP', total, 1), fieldFor('nadph', 'NADPH', nadph, 1)] : [fieldFor('atp', 'ATP', total, stepFor([total, sc.set.nadh, sc.set.fadh2]))],
hints: led.totalHints || [counts ? 'Cộng lượng ATP của mỗi giai đoạn và cộng lượng NADPH của mỗi giai đoạn.' : 'Cộng tổng ATP của mỗi giai đoạn, tính chi phí là số âm.'],
working: sumWorking
});
var title = led.title || sc0.title;
return {
id: sc0.id, title: title, blindTitle: led.blindTitle || title, unit: unit, intro: led.intro || '', options: o, mode: counts ? 'counts' : 'atp',
convention: o.convention, shuttle: o.shuttle, stages: stages, prompts: prompts, total: total, totalNadph: nadph, working: sumWorking, note: noteText,
structure: structure, sheet: packSheet(led, stages, counts, structure, sumWorking, noteText)
};
}
function packExplainerOf(id) {
for (var i = 0; i < SCENARIOS.length; i++) {
if (typeof SCENARIOS[i].ledger === 'function' && SCENARIOS[i].explainer && SCENARIOS[i].explainer.id === id) { return SCENARIOS[i]; }
}
return null;
}
function packExplain(sc, opts) {
var base = normalizeOpts(opts);
var o = { convention: base.convention, shuttle: sc.options.indexOf('shuttle') >= 0 ? base.shuttle : 'ma', carbons: 16, doubleBonds: 0 };
var b = build(sc.id, o);
var ex = sc.explainer;
var steps = [];
if (b.structure) {
steps.push(stepOf('read', 'Đọc cấu trúc', ex.readText || 'Hãy nhìn vào bức vẽ: ' + b.structure.name.toLowerCase() + ' là điểm khởi đầu của quá trình đếm.', b.sheet[0].lines,
{ kind: 'molecule', mol: b.structure.mol, hl: [] }));
}
b.sheet.forEach(function (block) {
if (block.id === 'count') { steps.push(stepOf('count', 'Đếm số mảnh', ex.countText || 'Hãy tính toán tần suất hoạt động của từng giai đoạn trước khi tính toán sản lượng thu được.', block.lines)); }
});
b.stages.forEach(function (st) {
var block = b.sheet.filter(function (x) { return x.id === st.id; })[0];
steps.push(stepOf(st.id, st.title, st.text || st.rule, block.lines));
});
var last = b.sheet[b.sheet.length - 1];
steps.push(stepOf('total', 'Cộng lại', ex.totalText || 'Cộng tổng ATP của từng giai đoạn. Chi phí được tính là một khoản trừ.', last.lines));
return {
id: ex.id, title: ex.title, subtitle: ex.subtitle, scenario: sc.id, options: o, intro: ex.intro,
counting: ex.noCounting ? 'Ví dụ này tính riêng ATP và NADPH, vì vậy quy tắc đếm không thay đổi ở đây.' : set(o.convention).text,
structure: b.structure, steps: steps, total: b.total, working: b.working,
practice: { scenario: sc.id, carbons: o.carbons, doubleBonds: o.doubleBonds, shuttle: o.shuttle }
};
}
function explainerList() {
var out = EXPLAINERS.map(function (e) { return { id: e.id, title: e.title, subtitle: e.subtitle, options: e.options.slice() }; });
SCENARIOS.forEach(function (sc) {
if (typeof sc.ledger === 'function' && sc.explainer) { out.push({ id: sc.explainer.id, title: sc.explainer.title, subtitle: sc.explainer.subtitle, options: sc.options.slice() }); }
});
return out;
}
function fact(id, group, text, label, answer, explain, hints) {
return { id: id, group: group, text: text, label: label, answer: answer, explain: explain, hints: hints };
}
var FACTS = [
fact('nadh', 'Các hãng vận chuyển', 'Một phân tử NADH có giá trị bao nhiêu ATP trong chuỗi vận chuyển electron?', 'ATP',
function (s) { return s.nadh; },
function (s) { return s.id === 'modern' ? 'Tỷ lệ P/O là 2,5 đối với NADH: chuỗi phản ứng bơm khoảng 10 H⁺ cho mỗi NADH và mỗi ATP cần khoảng 4 H⁺ (3 thông qua ATP synthase, 1 để vận chuyển phosphate và nucleotide).' : 'Số tròn cũ hơn: P/O là 3 đối với NADH.'; },
['Hãy nghĩ đến tỷ lệ P/O: ATP được tạo ra trên mỗi nguyên tử oxy bị khử.']),
fact('fadh2', 'Các hãng vận chuyển', 'Một FADH có bao nhiêu ATP?' + SUB2 + ' đáng giá?', 'ATP',
function (s) { return s.fadh2; },
function (s) { return s.id === 'modern' ? 'P/O là 1,5 đối với FADH' + SUB2 + ': các electron của nó đi vào ubiquinone, vì vậy phức hợp I không bơm chúng (6 H⁺, khoảng 4 trên mỗi ATP).' : 'Số tròn cũ hơn: P/O là 2 cho FADH' + SUB2 + '.'; },
['FADH' + SUB2 + ' Tham gia vào chuỗi sau Phức hợp I.']),
fact('shuttle-ma', 'Các hãng vận chuyển', 'Một phân tử NADH trong tế bào chất tương đương với bao nhiêu ATP nhờ cơ chế vận chuyển malate-aspartate?', 'ATP',
function (s) { return s.nadh; },
function () { return 'Con thoi tái tạo NADH bên trong ma trận, vì vậy nó có giá trị tương đương với bất kỳ NADH nào trong ma trận.'; },
['Con thoi di chuyển các electron vào và tạo ra NADH một lần nữa bên trong.']),
fact('shuttle-gp', 'Các hãng vận chuyển', 'Một phân tử NADH trong tế bào chất tương đương với bao nhiêu ATP nhờ cơ chế vận chuyển glycerol phosphate?', 'ATP',
function (s) { return s.fadh2; },
function () { return 'Các electron đạt tới ubiquinone dưới dạng FADH' + SUB2 + ' (từ dehydrogenase glycerol phosphate ty thể), vì vậy mỗi phân tử có giá trị tương đương một FADH' + SUB2 + '.'; },
['Hãy suy nghĩ xem chất vận chuyển nào được sử dụng trong hệ thống vận chuyển glycerol phosphate.']),
fact('hplus-nadh', 'Các hãng vận chuyển', 'Các phức chất I, III và IV cùng nhau bơm bao nhiêu H⁺ để tạo ra một NADH?', 'H⁺',
function () { return 10; },
function () { return 'Phức hợp I bơm 4, phức hợp III bơm 4 và phức hợp IV bơm 2 (cho mỗi cặp electron): tổng cộng là 10.'; },
['Phức hợp II không bơm electron nào, và cặp electron này đi qua ba phức hợp còn lại.']),
fact('hplus-fadh2', 'Các hãng vận chuyển', 'Các phức chất này bơm bao nhiêu H⁺ để tạo ra một FADH' + SUB2 + '?', 'H⁺',
function () { return 6; },
function () { return 'Các electron bỏ qua Phức hợp I và Phức hợp II không bơm gì cả, vì vậy chỉ có Phức hợp III (4) và Phức hợp IV (2) bơm.'; },
['FADH' + SUB2 + ' Cung cấp nguyên liệu cho phức hợp II, phức hợp này không di chuyển proton nào.']),
fact('tca-gtp', 'Glucose', 'Một vòng chu trình TCA tạo ra trực tiếp bao nhiêu ATP hoặc GTP?', 'ATP hoặc GTP',
function () { return 1; },
function () { return 'Succinyl-CoA synthetase tạo ra một GTP (hoặc ATP) từ succinyl-CoA.'; },
['Hãy tìm bước tạo ra nucleoside triphosphate mà không có oxy.']),
fact('tca-nadh', 'Glucose', 'Một vòng chu trình TCA tạo ra bao nhiêu phân tử NADH?', 'NADH',
function () { return 3; },
function () { return 'Isocitrate dehydrogenase, α-ketoglutarate dehydrogenase và malate dehydrogenase mỗi loại tạo ra một phân tử.'; },
['Hãy xem xét các bước oxy hóa của chu trình và xem bước nào sử dụng NAD⁺.']),
fact('tca-fadh2', 'Glucose', 'Có bao nhiêu FADH' + SUB2 + ' Một vòng chu trình TCA tạo ra gì?', 'FADH' + SUB2,
function () { return 1; },
function () { return 'Succinate dehydrogenase (thuộc phức hợp II) là bước FAD duy nhất.'; },
['Enzyme nào trong chu trình cũng là một phức hợp của chuỗi?']),
fact('tca-worth', 'Glucose', 'Một phân tử acetyl-CoA tương đương với bao nhiêu ATP sau một chu trình TCA?', 'ATP',
function (s) { return 3 * s.nadh + s.fadh2 + 1; },
function (s) { return '3 × ' + format(s.nadh) + ' + 1 × ' + format(s.fadh2) + ' + 1 = ' + format(3 * s.nadh + s.fadh2 + 1) + '.'; },
['Đếm 3 NADH, 1 FADH' + SUB2 + ' và 1 GTP.']),
fact('link-nadh', 'Glucose', 'Một phân tử pyruvate sẽ giải phóng bao nhiêu NADH khi chuyển hóa thành acetyl-CoA?', 'NADH',
function () { return 1; },
function () { return 'Pyruvate dehydrogenase tạo ra một NADH, một CO' + SUB2 + ' và acetyl-CoA.'; },
['Bước này là quá trình khử cacbon oxy hóa.']),
fact('gly-atp', 'Glucose', 'Một phân tử glucose được tạo ra trực tiếp bao nhiêu ATP từ quá trình đường phân?', 'ATP',
function () { return 2; },
function () { return 'Bốn phân tử được tạo ra tại hai kinase trả tiền và hai phân tử được tiêu hao tại hexokinase và phosphofructokinase.'; },
['Tính lượng ATP được tạo ra và trừ đi lượng ATP đã tiêu hao.']),
fact('gly-nadh', 'Glucose', 'Quá trình đường phân tạo ra bao nhiêu phân tử NADH cho một phân tử glucose?', 'NADH',
function () { return 2; },
function () { return 'Enzyme glyceraldehyde 3-phosphate dehydrogenase hoạt động một lần cho mỗi trong hai đoạn ba carbon.'; },
['Bước này được thực hiện một lần cho mỗi bộ ba.']),
fact('glc-acetyl', 'Glucose', 'Một phân tử glucose cung cấp bao nhiêu acetyl-CoA?', 'acetyl-CoA',
function () { return 2; },
function () { return 'Một phân tử glucose tạo ra hai phân tử pyruvate, và mỗi phân tử pyruvate lại trở thành một phân tử acetyl-CoA.'; },
['Glucose có sáu nguyên tử carbon, còn acetyl-CoA mang hai trong số đó.']),
fact('fa-act', 'Chất béo', 'Việc hoạt hóa một axit béo tiêu tốn bao nhiêu đơn vị ATP?', 'lượng ATP tương đương',
function () { return 2; },
function () { return 'ATP chuyển hóa thành AMP và pyrophosphate: hai liên kết năng lượng cao, tương đương với 2 ATP.'; },
['Sự phân tách này diễn ra đến tận AMP.']),
fact('fa-rounds', 'Chất béo', 'Axit palmitic (16:0) cần bao nhiêu vòng oxy hóa beta?', 'rounds',
function () { return 7; },
function () { return 'Mười sáu nguyên tử carbon tạo ra tám phân tử acetyl-CoA, và vòng cuối cùng tạo ra hai phân tử cùng một lúc: 7 vòng.'; },
['Số vòng ít hơn số lượng acetyl-CoA một vòng.']),
fact('fa-acetyl', 'Chất béo', 'Axit palmitic (16:0) cung cấp bao nhiêu acetyl-CoA?', 'acetyl-CoA',
function () { return 8; },
function () { return 'Mỗi phân tử acetyl-CoA có hai nguyên tử carbon, và 16 / 2 = 8.'; },
['Chia đôi số nguyên tử cacbon.']),
fact('fa-round-carriers', 'Chất béo', 'Có bao nhiêu người mang mầm bệnh (FADH)' + SUB2 + ' và NADH cùng nhau) một chu kỳ beta-oxy hóa tạo ra bao nhiêu?', 'carriers',
function () { return 2; },
function () { return 'Một FADH' + SUB2 + ' tại acyl-CoA dehydrogenase và một NADH tại L-hydroxyacyl-CoA dehydrogenase.'; },
['Hãy xem xét các bước oxy hóa của một chu kỳ.']),
fact('fa-double', 'Chất béo', 'Mỗi liên kết đôi của axit béo lấy đi bao nhiêu ATP?', 'ATP',
function (s) { return s.fadh2; },
function (s) { return 'Enzyme isomerase thay thế acyl-CoA dehydrogenase ở bước đó, do đó cần một FADH' + SUB2 + ' (' + format(s.fadh2) + ' ATP) không được tạo ra.'; },
['Hãy suy nghĩ xem enzyme isomerase bỏ qua bước nào.'])
];
function factPrompts(opts) {
var s = set(normalizeOpts(opts).convention);
return FACTS.map(function (f) {
var answer = f.answer(s);
var explain = f.explain(s);
return {
id: 'fact.' + f.id, stage: '', kind: 'fact', recipe: '', group: f.group, text: f.text,
fields: [fieldFor('n', f.label, answer, stepFor([answer]), 0, 60)],
hints: f.hints, working: explain
};
});
}
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
function methodText(id, b) {
if (id === 'fattyacid') {
return 'Mỗi vòng chơi tạo ra 1 FADH' + SUB2 + ' và 1 NADH, mỗi acetyl-CoA tạo thành 3 NADH, 1 FADH' + SUB2 + ' và 1 GTP trong chu trình TCA, chi phí hoạt hóa là 2, và mỗi liên kết đôi lấy đi một FADH' + SUB2 + '.';
}
return b.stages.map(function (st) {
if (st.info) { return st.title + ' (không có gì để đếm)'; }
return st.title + ' (' + st.recipe + (st.runs > 1 ? ', ' + st.runs + ' lần' : '') + ')';
}).join(', then ') + '.';
}
function piecesText(id) {
if (id === 'fattyacid') { return 'Cứ mỗi hai nguyên tử carbon trong chuỗi sẽ tách ra thành một acetyl-CoA, và số vòng beta-oxy hóa ít hơn số acetyl-CoA một vòng.'; }
if (id === 'glucose' || id === 'uncoupled') { return 'Quá trình đường phân cắt glucose sáu carbon thành hai pyruvate ba carbon, và mỗi pyruvate tạo ra một acetyl-CoA.'; }
if (id === 'pyruvate') { return 'Một phân tử pyruvate tạo ra một phân tử acetyl-CoA, và phân tử này sẽ hoàn thành một vòng chu trình.'; }
return '';
}
function totalHints(id, b) {
var out = [];
if (id === 'uncoupled') { out.push('Các electron vẫn di chuyển nhưng các proton lại rò rỉ ngược trở lại, vì vậy không có chất mang nào cung cấp ATP: chỉ có ATP được tạo ra trực tiếp mới được tính.'); }
else if (id === 'fermentation') { return ['Nếu không có oxy, NADH sẽ bị tiêu thụ để tạo ra lactate hoặc ethanol, do đó không có chất mang nào đến được chuỗi phản ứng.']; }
else if (b.stages.length > 1) { out.push('Các giai đoạn cần đếm: ' + b.stages.map(function (st) { return st.title; }).join(', then ') + '.'); }
if (piecesText(id)) { out.push(piecesText(id)); }
out.push(methodText(id, b));
return out;
}
function totalPrompt(id, o) {
var b = build(id, o);
var last = b.prompts[b.prompts.length - 1];
var shuttleWords = '';
if (id === 'glycolysis' || id === 'glucose') { shuttleWords = b.shuttle === 'gp' ? ' (vận chuyển glycerol phosphate)' : ' (chu trình malate-aspartate)'; }
return {
id: 'quick.' + id + (id === 'fattyacid' ? '.' + fattyAcid(o.carbons, o.doubleBonds).label : '') + (id === 'glycolysis' || id === 'glucose' ? '.' + b.shuttle : ''), stage: '', kind: 'total', recipe: '', group: scenario(id).group,
text: 'Có bao nhiêu ATP? ' + b.unit + ' worth' + (id === 'tca' ? ' sau một chu trình TCA' : (id === 'pyruvate' ? ' khi nó bị oxy hóa thành CO' + SUB2 : (id === 'glycolysis' ? ' sau quá trình đường phân, với oxy' : (id === 'glucose' ? ' khi nó bị oxy hóa hoàn toàn' : (id === 'fermentation' ? ' trong điều kiện kỵ khí' : (id === 'uncoupled' ? ' có bộ tách rời' : ' khi nó bị oxy hóa hoàn toàn (sau khi trừ đi năng lượng hoạt hóa)')))))) + shuttleWords + '?',
fields: [fieldFor('atp', 'ATP', b.total, stepFor([b.total, set(o.convention).nadh, set(o.convention).fadh2]))],
hints: totalHints(id, b),
working: b.working + (b.note ? ' ATP. ' + b.note : '')
};
}
function quick(count, seed, opts) {
var o = normalizeOpts(opts);
var rand = rng(seed === undefined ? 1 : seed);
var pool = factPrompts(o);
['tca', 'pyruvate', 'glycolysis', 'glucose', 'fermentation', 'uncoupled'].forEach(function (id) {
pool.push(totalPrompt(id, { convention: o.convention, shuttle: 'ma' }));
if (id === 'glucose') { pool.push(totalPrompt(id, { convention: o.convention, shuttle: 'gp' })); }
});
[[12, 0], [14, 0], [16, 0], [18, 0], [18, 1], [20, 0], [22, 0], [16, 1]].forEach(function (p) {
pool.push(totalPrompt('fattyacid', { convention: o.convention, carbons: p[0], doubleBonds: p[1] }));
});
var evens = [8, 10, 12, 14, 16, 18, 20, 22, 24];
var c = evens[Math.floor(rand() * evens.length)];
var k = rand() < 0.35 ? 1 : 0;
pool.push(totalPrompt('fattyacid', { convention: o.convention, carbons: c, doubleBonds: k }));
for (var i = pool.length - 1; i > 0; i--) {
var j = Math.floor(rand() * (i + 1));
var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
}
var seen = {};
var out = [];
pool.forEach(function (p) {
var key = p.id + '|' + p.text;
if (!seen[key] && out.length < count) { seen[key] = true; out.push(p); }
});
return out;
}
function structureDrill(count, seed, opts) {
var o = normalizeOpts(opts);
var rand = rng(seed === undefined ? 1 : seed);
var pool = [];
[[10, 0], [12, 0], [14, 0], [16, 0], [16, 1], [18, 0], [18, 1], [18, 2], [20, 0], [20, 4], [22, 0], [24, 0]].forEach(function (p) {
pool.push({ id: 'fattyacid', o: { convention: o.convention, carbons: p[0], doubleBonds: p[1] } });
});
var evens = [8, 10, 12, 14, 16, 18, 20, 22, 24];
pool.push({ id: 'fattyacid', o: { convention: o.convention, carbons: evens[Math.floor(rand() * evens.length)], doubleBonds: rand() < 0.5 ? 1 : 0 } });
['ma', 'gp'].forEach(function (sh) { pool.push({ id: 'glucose', o: { convention: o.convention, shuttle: sh } }); });
pool.push({ id: 'pyruvate', o: { convention: o.convention } });
pool.push({ id: 'tca', o: { convention: o.convention } });
SCENARIOS.forEach(function (sc) {
if (typeof sc.ledger !== 'function' || !sc.drill) { return; }
(sc.options.indexOf('shuttle') >= 0 ? ['ma', 'gp'] : ['ma']).forEach(function (sh) { pool.push({ id: sc.id, o: { convention: o.convention, shuttle: sh } }); });
});
for (var i = pool.length - 1; i > 0; i--) {
var j = Math.floor(rand() * (i + 1));
var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
}
var seen = {};
var out = [];
pool.forEach(function (item) {
var b = build(item.id, item.o);
var packed = scenario(item.id);
var key = item.id + (item.id === 'fattyacid' ? '.' + b.structure.carbons + ':' + b.structure.doubleBonds : '') + (item.id === 'glucose' || (packed && typeof packed.ledger === 'function' && packed.options.indexOf('shuttle') >= 0) ? '.' + b.shuttle : '');
if (seen[key] || out.length >= count) { return; }
seen[key] = true;
var words = {
fattyacid: 'Axit béo này có giá trị bao nhiêu ATP khi nó bị oxy hóa hoàn toàn (sau khi trừ đi năng lượng hoạt hóa)?',
glucose: 'Một phân tử glucose có giá trị bao nhiêu ATP khi bị oxy hóa hoàn toàn? ' + (b.shuttle === 'gp' ? 'sự vận chuyển glycerol phosphate' : 'the malate-aspartate shuttle') + '?',
pyruvate: 'Một phân tử pyruvate có giá trị bao nhiêu ATP khi bị oxy hóa thành CO₂' + SUB2 + '?',
tca: 'Một phân tử acetyl-CoA tương đương với bao nhiêu ATP sau một chu trình TCA?'
};
out.push({
id: 'structure.' + key, stage: '', kind: 'total', recipe: '', group: 'Kết cấu', text: words[item.id] || (packed && packed.drill) || b.title, structure: b.structure,
fields: [fieldFor('atp', 'ATP', b.total, stepFor([b.total, set(o.convention).nadh, set(o.convention).fadh2]))],
hints: [
item.id === 'fattyacid' ? 'Trước tiên hãy đọc cấu trúc: đếm số nguyên tử cacbon (bao gồm cả cacbon carboxyl) và số liên kết đôi C=C.' : 'Hãy đọc cấu trúc trước: ' + b.sheet[0].lines[0],
piecesText(item.id), methodText(item.id, b)
].filter(Boolean),
working: b.working, sheet: b.sheet
});
});
return out;
}
var EXPLAINERS = [
{ id: 'saturated', title: 'Axit béo bão hòa', subtitle: 'Axit palmitic, 16:0', scenario: 'fattyacid', carbons: 16, doubleBonds: 0, options: [] },
{ id: 'unsaturated', title: 'Một axit béo không bão hòa', subtitle: 'Axit oleic, 18:1', scenario: 'fattyacid', carbons: 18, doubleBonds: 1, options: [] },
{ id: 'glucose', title: 'Glucose', subtitle: 'Một phân tử glucose, bị oxy hóa hoàn toàn.', scenario: 'glucose', carbons: 16, doubleBonds: 0, options: ['shuttle'] }
];
function explainerOf(id) {
for (var i = 0; i < EXPLAINERS.length; i++) { if (EXPLAINERS[i].id === id) { return EXPLAINERS[i]; } }
return null;
}
function bondPlaces(at) {
var parts = at.map(function (p) { return p + ' Và ' + (p + 1); });
if (parts.length < 2) { return parts.join(''); }
return parts.slice(0, -1).join(', ') + (parts.length > 2 ? ',' : '') + ' Và ' + parts[parts.length - 1];
}
function stepOf(id, title, text, math, figure) {
return { id: id, title: title, text: text, math: math, figure: figure || null };
}
function fattyExplainSteps(o, b) {
var fa = fattyAcid(o.carbons, o.doubleBonds);
var st = set(o.convention);
var n = fa.carbons, a = fa.acetyl, r = fa.rounds, k = fa.doubleBonds;
var at = doubleBondAt(fa);
var lines = function (id) { return b.sheet.filter(function (x) { return x.id === id; })[0].lines; };
var steps = [];
steps.push(stepOf('read', 'Đọc cấu trúc',
'Đánh số các nguyên tử cacbon từ nhóm carboxyl ở đầu bên trái, tức là cacbon số 1. Số cuối cùng là chiều dài của chuỗi: ' + n + ' cacbon. ' +
(k ? 'Liên kết đôi được vẽ bằng hai đường thẳng song song. Chuỗi này có ' + (k === 1 ? 'một, giữa các nguyên tử cacbon ' : k + ', giữa các nguyên tử cacbon ') + bondPlaces(at) + '.' :
'Mỗi liên kết giữa hai nguyên tử carbon là một đường thẳng, vì vậy chuỗi này không có liên kết đôi.'),
[n + ' cacbon, ' + (k ? k + ' gấp đôi ' + plural(k, 'bond') : 'không có liên kết đôi') + '.'],
{ kind: 'fatty', carbons: n, doubleBonds: k, numbered: true, hl: k ? ['carboxyl', 'doubleBonds'] : ['carboxyl'] }));
steps.push(stepOf('act', 'Thanh toán phí kích hoạt',
'Trước khi được đốt cháy, axit béo sẽ liên kết với coenzyme A trong bào tương. Quá trình này phân tách ATP thành AMP và pyrophosphate, sử dụng hai liên kết năng lượng cao, do đó chi phí hoạt hóa tương đương 2 ATP.',
lines('act')));
steps.push(stepOf('count', 'Đếm các mảnh có hai nguyên tử cacbon',
'Quá trình beta-oxy hóa cắt chuỗi thành các đoạn hai nguyên tử carbon, và mỗi đoạn được tách ra dưới dạng acetyl-CoA. Vòng cuối cùng tạo ra hai acetyl-CoA cùng một lúc, vì vậy số vòng ít hơn số lượng acetyl-CoA tạo thành.',
lines('count')));
steps.push(stepOf('box', 'Những gì vòng quay tạo nên',
'Mỗi chu kỳ gồm hai bước oxy hóa: một bước khử FAD thành FADH' + SUB2 + ' và một chất khử NAD⁺ thành NADH. Vì vậy, một chu trình tạo ra 1 FADH' + SUB2 + ' và 1 NADH. Với cách tính này, NADH có giá trị là ' +
format(st.nadh) + ' ATP và FADH' + SUB2 + ' đáng giá ' + format(st.fadh2) + ' ATP.',
lines('box')));
steps.push(stepOf('tca', 'Chu trình TCA tạo ra gì?',
'Mỗi phân tử acetyl-CoA tham gia một chu trình TCA. Một chu trình tạo ra 3 NADH và 1 FADH.' + SUB2 + ' và 1 GTP, và một GTP được tính là 1 ATP.',
lines('tca')));
if (k) {
steps.push(stepOf('db', 'Cho phép liên kết đôi' + (k > 1 ? 's' : ''),
'Một liên kết đôi đã có sẵn trong chuỗi sẽ thay đổi hình dạng của nó: một enzyme đồng phân hóa sẽ di chuyển nó vào đúng vị trí, và enzyme acyl-CoA dehydrogenase sẽ thực hiện bước tạo ra FADH2.' + SUB2 + ', bị bỏ qua. Quy tắc đơn giản là mỗi liên kết đôi có giá trị một FADH' + SUB2 +
', tức là ' + format(st.fadh2) + ' ATP.' + (k > 1 ? ' Liên kết đôi tại nguyên tử carbon chẵn cũng sử dụng NADPH, điều mà quy tắc đơn giản này bỏ qua.' : ''),
lines('db')));
}
var total = [dedupeWork(b.working) + ' ATP.'];
if (b.note) { total.push(b.note); }
steps.push(stepOf('total', 'Cộng lại', 'Cộng tổng ATP của từng giai đoạn. Chi phí được tính là một khoản trừ.', total));
var round = st.fadh2 + st.nadh;
var acetyl = 3 * st.nadh + st.fadh2 + 1;
var A = (round + acetyl) / 2;
var B = 2 + round;
steps.push(stepOf('shortcut', 'Cách rút gọn để tính tổng',
'Thực hiện tất cả các giai đoạn cùng một lúc cho một chuỗi n nguyên tử cacbon. Chi phí kích hoạt là 2. Có n ÷ 2 − 1 vòng, mỗi vòng trị giá ' + format(round) + ' (FADH' + SUB2 + ' và NADH), và n ÷ 2 acetyl-CoA, mỗi chất có giá trị ' + format(acetyl) +
' (3 NADH, FADH' + SUB2 + ' và GTP). Việc thu thập các điều khoản mang lại ' + format(A) + ' × n − ' + format(B) + (k ? 'và mỗi liên kết đôi tách ra ' + format(st.fadh2) : '') + '.',
['−2 + (n ÷ 2 − 1) × ' + format(round) + ' + (n ÷ 2) × ' + format(acetyl) + ' = ' + format(A) + ' × n − ' + format(B),
'n = ' + n + ': ' + format(A) + ' × ' + n + ' − ' + format(B) + (k ? ' − ' + format(st.fadh2) + ' × ' + k : '') + ' = ' + format(b.total) + '.']));
return steps;
}
function glucoseExplainSteps(o, b) {
var st = set(o.convention);
var gp = o.shuttle === 'gp';
var lines = function (id) { return b.sheet.filter(function (x) { return x.id === id; })[0].lines; };
var gly = lines('gly');
var steps = [];
steps.push(stepOf('read', 'Đọc cấu trúc',
'Glucose là một loại đường có sáu nguyên tử carbon. Năm trong số các góc của vòng là carbon (góc thứ sáu là oxy của vòng), và carbon thứ sáu là nhóm CH.' + SUB2 + 'Nhóm OH nằm ngoài vòng.',
['Glucose có 6 nguyên tử carbon.'], { kind: 'molecule', mol: 'glucose', hl: [] }));
steps.push(stepOf('gly', 'Quá trình đường phân, trong tế bào chất',
'Quá trình đường phân phân tách glucose sáu carbon thành hai pyruvate ba carbon. Nó tạo ra trực tiếp 4 ATP và tiêu tốn 2 ATP, tức là tổng cộng 2 ATP, và tạo ra 1 NADH cho mỗi pyruvate, tức là 2 NADH.',
[gly[0]]));
steps.push(stepOf('shuttle', 'Cơ chế vận chuyển NADH trong tế bào chất',
'Hai phân tử NADH này được tạo ra trong bào tương, và NADH không thể vượt qua màng trong của ty thể, vì vậy một cơ chế vận chuyển mang các electron của chúng vào. Cơ chế vận chuyển malate-aspartate tái tạo NADH trong chất nền, vì vậy mỗi phân tử đều có giá trị ' + format(st.nadh) +
' ATP. Hệ thống vận chuyển glycerol phosphate chuyển các electron cho FAD, do đó mỗi electron chỉ có giá trị tương đương một FADH.' + SUB2 + ', ' + format(st.fadh2) + ' ATP. Ví dụ này sử dụng ' + (gp ? 'glycerol phosphate' : 'malate-aspartate') + ' xe đưa đón.',
[gly[1]]));
steps.push(stepOf('link', 'Pyruvate chuyển hóa thành acetyl-CoA trong chất nền',
'Mỗi phân tử pyruvate đi vào chất nền ty thể và bị oxy hóa thành acetyl-CoA. Nó mất đi một nguyên tử carbon dưới dạng CO₂.' + SUB2 + ' và tạo ra 1 NADH. Hai phân tử pyruvate tạo ra 2 NADH.',
lines('link')));
steps.push(stepOf('tca', 'Chu trình TCA, hai lần',
'Mỗi phân tử acetyl-CoA đi một vòng trong chu trình TCA, vì vậy chu trình quay hai vòng. Một vòng tạo ra 3 NADH và 1 FADH.' + SUB2 + ' và 1 GTP.',
lines('tca')));
var total = [dedupeWork(b.working) + ' ATP.'];
if (b.note) { total.push(b.note); }
steps.push(stepOf('total', 'Cộng lại', 'Cộng tổng lượng ATP của từng giai đoạn: quá trình đường phân với chất vận chuyển của nó, phản ứng liên kết và hai vòng của chu trình TCA.', total));
steps.push(stepOf('check', 'Kiểm tra bằng than chì',
'Tất cả sáu nguyên tử carbon của glucose đều rời đi dưới dạng CO₂.' + SUB2 + ': một từ mỗi pyruvate trong phản ứng liên kết, và hai trong mỗi vòng của chu trình TCA. Sáu nguyên tử carbon trong và sáu CO' + SUB2 + ' "Out" có nghĩa là glucose đã bị oxy hóa hoàn toàn.',
['2 + 2 × 2 = 6 CO' + SUB2]));
return steps;
}
function explain(id, opts) {
var ex = explainerOf(id);
if (!ex) {
var packedEx = packExplainerOf(id);
return packedEx ? packExplain(packedEx, opts) : null;
}
var base = normalizeOpts(opts);
var o = ex.scenario === 'glucose'
? { convention: base.convention, shuttle: base.shuttle, carbons: 16, doubleBonds: 0 }
: { convention: base.convention, shuttle: 'ma', carbons: ex.carbons, doubleBonds: ex.doubleBonds };
var b = build(ex.scenario, o);
var steps = ex.scenario === 'glucose' ? glucoseExplainSteps(o, b) : fattyExplainSteps(o, b);
var intro = {
saturated: 'Hãy bắt đầu từ hình vẽ và tính toán ATP theo vài bước. Đây là axit palmitic, một axit béo bão hòa có 16 nguyên tử carbon.',
unsaturated: 'Axit oleic có một liên kết đôi. Các bước thực hiện tương tự như đối với axit béo bão hòa, chỉ khác ở chỗ có một liên kết đôi.',
glucose: 'Glucose được oxy hóa qua ba giai đoạn: đường phân trong bào tương, sau đó là phản ứng liên kết và chu trình TCA trong chất nền. NADH trong bào tương cần một chất vận chuyển.'
}[ex.id];
return {
id: ex.id, title: ex.title, subtitle: ex.subtitle, scenario: ex.scenario, options: o, intro: intro, counting: set(o.convention).text,
structure: b.structure, steps: steps, total: b.total, working: b.working,
practice: { scenario: ex.scenario, carbons: o.carbons, doubleBonds: o.doubleBonds, shuttle: o.shuttle }
};
}
function check(prompt, values) {
var fields = {};
var ok = true;
(prompt.fields || []).forEach(function (f) {
var raw = values ? values[f.key] : undefined;
var n = parseNumber(raw);
if (isNaN(n)) { fields[f.key] = null; ok = false; return; }
fields[f.key] = same(n, f.answer);
if (!fields[f.key]) { ok = false; }
});
return { ok: ok, fields: fields };
}
MG.atp = {
SETS: SETS, set: set, worth: worth, scenarios: SCENARIOS, scenario: scenario, build: build, facts: factPrompts, quick: quick,
fattyAcid: fattyAcid, fattyAcidGeometry: fattyAcidGeometry, structureOf: structureOf, structureDrill: structureDrill,
get explainers() { return explainerList(); }, explain: explain,
parts: { gly: STAGE_DEFS.gly, link: STAGE_DEFS.link, tca: STAGE_DEFS.tca },
check: check, parseNumber: parseNumber, format: format
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var t = MG.drawTargets = MG.drawTargets || {};
t.acetaldehyde = {"n":["C","C","O"],"e":[0,1,1,2],"o":[[1,2]],"heavy":3,"rings":0,"tokens":[],"ok":true};
t.acetylcoa = {"n":["C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4],"o":[[1,2,1,1]],"heavy":5,"rings":0,"tokens":["CoA"],"ok":true};
t.acylcoa = {"n":["R","C","C","C","O","S","CoA"],"e":[0,1,1,2,2,3,3,4,3,5,5,6],"o":[[1,1,1,2,1,1]],"heavy":7,"rings":0,"tokens":["CoA","R"],"ok":true};
t.akg = {"n":["O","C","O","C","C","C","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,5,7,7,8,7,9],"o":[[1,2,1,1,1,2,1,2,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.alanine = {"n":["C","C","N","C","O","O"],"e":[0,1,1,2,1,3,3,4,3,5],"o":[[1,1,1,2,1]],"heavy":6,"rings":0,"tokens":[],"ok":true};
t.ammonium = {"n":["N"],"e":[],"o":[[]],"heavy":1,"rings":0,"tokens":[],"ok":false};
t.arginine = {"n":["N","C","N","N","C","C","C","C","N","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,7,8,7,9,9,10,9,11],"o":[[1,2,1,1,1,1,1,1,1,2,1],[1,1,2,1,1,1,1,1,1,1,2]],"heavy":12,"rings":0,"tokens":[],"ok":true};
t.argsucc = {"n":["N","C","C","C","C","N","C","N","N","C","C","C","O","O","C","O","O","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,6,8,8,9,9,10,10,11,11,12,11,13,9,14,14,15,14,16,1,17,17,18,17,19],"o":[[1,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1],[1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,2],[1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,2]],"heavy":20,"rings":0,"tokens":[],"ok":true};
t.aspartate = {"n":["N","C","C","C","O","O","C","O","O"],"e":[0,1,1,2,2,3,3,4,3,5,1,6,6,7,6,8],"o":[[1,1,1,2,1,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.bpg13 = {"n":["C","C","C","O","O","P","O","O","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,5,6,5,7,5,8,1,9,0,10,10,11,11,12,11,13,11,14],"o":[[1,1,2,1,1,2,1,1,1,1,1,2,1,1]],"heavy":15,"rings":0,"tokens":[],"ok":true};
t.carbamoylasp = {"n":["N","C","O","N","C","C","C","O","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,6,8,4,9,9,10,9,11],"o":[[1,2,1,1,1,1,2,1,1,2,1]],"heavy":12,"rings":0,"tokens":[],"ok":true};
t.carbamoylp = {"n":["N","C","O","O","P","O","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,4,7],"o":[[1,2,1,1,2,1,1]],"heavy":8,"rings":0,"tokens":[],"ok":true};
t.citrate = {"n":["O","C","O","C","C","O","C","C","O","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7,7,8,7,9,4,10,10,11,10,12],"o":[[1,2,1,1,1,1,1,2,1,1,2,1]],"heavy":13,"rings":0,"tokens":[],"ok":true};
t.citrulline = {"n":["N","C","O","N","C","C","C","C","N","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,7,8,7,9,9,10,9,11],"o":[[1,2,1,1,1,1,1,1,1,2,1]],"heavy":12,"rings":0,"tokens":[],"ok":true};
t.cytcoxm = {"n":["protein","C","C","C","C","C","C","C","C","C","C","N","Fe","N","C","C","C","C","C","C","C","C","C","C","N","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,13,12,13,14,14,15,15,16,16,17,17,18,14,19,19,20,20,21,21,22,22,23,23,24,25,12,23,1,24,3,25,5,25,8,18,10,16,11,24,12,21,13],"o":[[1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,2,1,2],[1,1,2,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,2,1,2,1,2,1,1,1,2,1,2,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,2,1,1,1,1],[1,2,1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,2,1,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,1,1,2,1,1,2,1,2,1,1],[1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,2,1,2,1,1,1,2,1,1,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,1,2,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,2,1,2,1,1,1,2,1,2,2,1,1],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2],[1,2,1,2,1,2,1,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,1,1,2,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,1,1,2,1,1],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,2,2,1,2],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,2],[1,2,1,1,2,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,2,1,1,2,2,1,2],[1,2,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,1,1,1,2,1,1,1,1,1],[1,2,1,1,2,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,1,1,2],[1,2,1,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,1,1,2,1,1,1,1,2,1,1,1,1,2],[1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,1,1,2,1,1,1,2,1,1,1,1,1,2],[1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,1,1,2,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,2,1,1,2,1,1],[1,2,1,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,1,2,1,1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,2,1,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,1,1,1,2,1,2,1,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,2,2,1,2,1,2,1,1,1,2,1,2,1,2,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,2,1,1,1,2],[1,2,1,1,2,1,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2],[1,2,1,2,1,2,1,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1,2,1,1,1,2,1,2,1,2,1,1],[1,2,1,2,1,2,1,2,1,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,2,1,1,2,1,1,1,2,1,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,2,1,2,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,2,2,1,2],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,2,1,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,2,1,1,2,1,2],[1,1,2,1,1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1]],"heavy":26,"rings":5,"tokens":["protein"],"ok":false};
t.cytcred = {"n":["protein","C","C","C","C","C","C","C","C","C","C","N","Fe","N","C","C","C","C","C","C","C","C","C","C","N","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,13,12,13,14,14,15,15,16,16,17,17,18,14,19,19,20,20,21,21,22,22,23,23,24,25,12,23,1,24,3,25,5,25,8,18,10,16,11,24,12,21,13],"o":[[1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,2,1,2],[1,1,2,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,2,1,2,1,2,1,1,1,2,1,2,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,2,1,1,1,1],[1,2,1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,2,1,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,1,1,2,1,1,2,1,2,1,1],[1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,2,1,2,1,1,1,2,1,1,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,1,2,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,2,1,2,1,1,1,2,1,2,2,1,1],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2],[1,2,1,2,1,2,1,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,1,1,2,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,1,1,2,1,1],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,2,2,1,2],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,2],[1,2,1,1,2,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,2,1,1,2,2,1,2],[1,2,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,1,1,1,2,1,1,1,1,1],[1,2,1,1,2,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,1,1,2],[1,2,1,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,1,1,2,1,1,1,1,2,1,1,1,1,2],[1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,1,1,2,1,1,1,2,1,1,1,1,1,2],[1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,1,1,2,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,1,1,2,1,1,2,1,1],[1,2,1,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,1,2,1,1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,2,1,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,1,1,1,2,1,2,1,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,2,2,1,2,1,2,1,1,1,2,1,2,1,2,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,2,1,1,1,2],[1,2,1,1,2,1,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2],[1,2,1,2,1,2,1,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1,2,1,1,1,2,1,2,1,2,1,1],[1,2,1,2,1,2,1,2,1,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,1,2,1,2,2,1,2,1,1,2,1,1,1,2,1,1,1,1,1],[1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,2,1,2,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1,2,1,2,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2],[1,1,2,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,2,1,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,2,2,1,2],[1,2,1,2,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2],[1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,2,1,1,2,1,1],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,2,1,2,1,2],[1,2,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,1,2,1,1,2,1,2],[1,1,2,1,1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1]],"heavy":26,"rings":5,"tokens":["protein"],"ok":false};
t.dhap = {"n":["O","C","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,5,6,6,7,6,8,6,9],"o":[[1,1,2,1,1,1,2,1,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.enoylcoa = {"n":["R","C","C","C","O","S","CoA"],"e":[0,1,1,2,2,3,3,4,3,5,5,6],"o":[[1,2,1,2,1,1]],"heavy":7,"rings":0,"tokens":["CoA","R"],"ok":true};
t.etcadp = {"n":["Adenine","C","C","C","C","O","C","O","PP","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,3,9,2,10,5,1],"o":[[1,1,1,1,1,1,1,1,1,1,1]],"heavy":11,"rings":1,"tokens":["Adenine","PP"],"ok":true};
t.etcatp = {"n":["Adenine","C","C","C","C","O","C","O","PPP","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,3,9,2,10,5,1],"o":[[1,1,1,1,1,1,1,1,1,1,1]],"heavy":11,"rings":1,"tokens":["Adenine","PPP"],"ok":true};
t.etcfad = {"n":["C","C","C","C","C","C","C","C","N","R","C","N","C","O","N","C","O","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,4,8,8,9,8,10,10,11,11,12,12,13,12,14,14,15,15,16,15,17,17,18,6,1,18,3,17,10],"o":[[1,2,1,2,1,2,1,1,1,1,2,1,2,1,1,2,1,2,1,1,1],[1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,2,2,1,1]],"heavy":19,"rings":3,"tokens":["R"],"ok":false};
t.etcfadh2 = {"n":["C","C","C","C","C","C","C","C","N","R","C","C","N","C","O","N","C","O","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,4,8,8,9,8,10,10,11,11,12,11,13,13,14,13,15,15,16,16,17,16,18,6,1,12,3,18,10],"o":[[1,2,1,2,1,2,1,1,1,1,2,1,1,2,1,1,2,1,1,1,1],[1,1,2,1,2,1,1,1,1,1,2,1,1,2,1,1,2,1,2,1,1]],"heavy":19,"rings":3,"tokens":["R"],"ok":false};
t.etcnad = {"n":["N","C","O","C","C","C","C","N","R","C"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,7,8,7,9,9,3],"o":[[1,2,1,2,1,2,1,1,2,1],[1,2,1,1,2,1,2,1,1,2]],"heavy":10,"rings":1,"tokens":["R"],"ok":true};
t.etcnadh = {"n":["N","C","O","C","C","N","R","C","C","C"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,5,7,7,8,8,9,9,3],"o":[[1,2,1,2,1,1,1,2,1,1]],"heavy":10,"rings":1,"tokens":["R"],"ok":true};
t.etco2 = {"n":["O","O"],"e":[0,1],"o":[[2]],"heavy":2,"rings":0,"tokens":[],"ok":true};
t.etcwater = {"n":["O"],"e":[],"o":[[]],"heavy":1,"rings":0,"tokens":[],"ok":false};
t.ethanol = {"n":["C","C","O"],"e":[0,1,1,2],"o":[[1,1]],"heavy":3,"rings":0,"tokens":[],"ok":true};
t.f16bp = {"n":["C","C","C","C","C","O","C","O","P","O","O","O","O","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,8,10,8,11,4,12,3,13,2,14,0,15,15,16,16,17,16,18,16,19,5,1],"o":[[1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1]],"heavy":20,"rings":1,"tokens":[],"ok":true};
t.f6p = {"n":["C","C","C","C","C","O","C","O","O","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,4,8,3,9,2,10,0,11,11,12,12,13,12,14,12,15,5,1],"o":[[1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1]],"heavy":16,"rings":1,"tokens":[],"ok":true};
t.fattyacid = {"n":["R","C","C","C","O","O"],"e":[0,1,1,2,2,3,3,4,3,5],"o":[[1,1,1,2,1]],"heavy":6,"rings":0,"tokens":["R"],"ok":true};
t.fes = {"n":["Cys","Fe","Cys","S","Fe","Cys","Cys","S"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,4,7,7,1],"o":[[1,1,1,1,1,1,1,1]],"heavy":8,"rings":1,"tokens":["Cys"],"ok":false};
t.fmn = {"n":["C","C","C","C","C","C","C","C","N","ribityl-P","C","C","N","C","O","N","C","O","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,4,8,8,9,8,10,10,11,11,12,11,13,13,14,13,15,15,16,16,17,16,18,6,1,12,3,18,10],"o":[[1,2,1,2,1,2,1,1,1,1,2,1,1,2,1,1,2,1,1,1,1],[1,1,2,1,2,1,1,1,1,1,2,1,1,2,1,1,2,1,2,1,1]],"heavy":19,"rings":3,"tokens":["ribityl-P"],"ok":false};
t.fumarate = {"n":["O","C","O","C","C","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,5,7],"o":[[1,2,1,2,1,2,1]],"heavy":8,"rings":0,"tokens":[],"ok":true};
t.g1p = {"n":["C","C","C","C","C","C","O","O","P","O","O","O","O","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,7,8,8,9,8,10,8,11,4,12,3,13,2,14,0,15,6,1],"o":[[1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1]],"heavy":16,"rings":1,"tokens":[],"ok":true};
t.g3p = {"n":["C","C","C","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,1,4,0,5,5,6,6,7,6,8,6,9],"o":[[1,1,2,1,1,1,2,1,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.g6p = {"n":["O","P","O","O","O","C","C","O","C","O","C","O","C","O","C","O"],"e":[0,1,1,2,1,3,1,4,4,5,5,6,6,7,7,8,8,9,8,10,10,11,10,12,12,13,12,14,14,15,14,6],"o":[[1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],"heavy":16,"rings":1,"tokens":[],"ok":true};
t.glucose = {"n":["O","C","C","O","C","O","C","O","C","O","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,6,8,8,9,8,10,10,11,10,2],"o":[[1,1,1,1,1,1,1,1,1,1,1,1]],"heavy":12,"rings":1,"tokens":[],"ok":true};
t.glutamate = {"n":["N","C","C","C","C","O","O","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,1,7,7,8,7,9],"o":[[1,1,1,1,2,1,1,2,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.glutamine = {"n":["N","C","C","C","C","N","O","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,1,7,7,8,7,9],"o":[[1,1,1,1,1,2,1,2,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.glycerol = {"n":["O","C","C","O","C","O"],"e":[0,1,1,2,2,3,2,4,4,5],"o":[[1,1,1,1,1]],"heavy":6,"rings":0,"tokens":[],"ok":true};
t.glycerol3p = {"n":["C","C","C","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,1,4,0,5,5,6,6,7,6,8,6,9],"o":[[1,1,1,1,1,1,2,1,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.glycogen = {"n":["O","C","C","O","C","O","(Glc)n","C","O","C","O","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,4,7,7,8,7,9,9,10,9,11,11,12,11,2],"o":[[1,1,1,1,1,1,1,1,1,1,1,1,1]],"heavy":13,"rings":1,"tokens":["(Glc)n"],"ok":false};
t.glyoxylate = {"n":["O","C","C","O","O"],"e":[0,1,1,2,2,3,2,4],"o":[[2,1,2,1]],"heavy":5,"rings":0,"tokens":[],"ok":true};
t.hydroxyacylcoa = {"n":["R","C","O","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7],"o":[[1,1,1,1,2,1,1]],"heavy":8,"rings":0,"tokens":["CoA","R"],"ok":true};
t.isocitrate = {"n":["C","C","C","C","O","O","O","C","O","O","C","O","O"],"e":[0,1,1,2,2,3,3,4,3,5,2,6,1,7,7,8,7,9,0,10,10,11,10,12],"o":[[1,1,1,2,1,1,1,2,1,1,2,1]],"heavy":13,"rings":0,"tokens":[],"ok":true};
t.ketoacylcoa = {"n":["R","C","O","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7],"o":[[1,2,1,1,2,1,1]],"heavy":8,"rings":0,"tokens":["CoA","R"],"ok":true};
t.lactate = {"n":["C","C","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,3,5],"o":[[1,1,1,2,1]],"heavy":6,"rings":0,"tokens":[],"ok":true};
t.lysine = {"n":["N","C","C","C","C","C","N","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,7,8,7,9],"o":[[1,1,1,1,1,1,1,2,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.malate = {"n":["C","C","C","O","O","O","C","O","O"],"e":[0,1,1,2,2,3,2,4,1,5,0,6,6,7,6,8],"o":[[1,1,2,1,1,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.malonate = {"n":["O","C","O","C","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,4,6],"o":[[1,2,1,1,2,1]],"heavy":7,"rings":0,"tokens":[],"ok":true};
t.nacglu = {"n":["C","C","O","N","C","C","C","C","O","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,7,8,7,9,4,10,10,11,10,12],"o":[[1,2,1,1,1,1,1,2,1,1,2,1]],"heavy":13,"rings":0,"tokens":[],"ok":true};
t.oaa = {"n":["O","C","O","C","C","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7,6,8],"o":[[1,2,1,1,2,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.ornithine = {"n":["N","C","C","C","C","N","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,6,8],"o":[[1,1,1,1,1,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.pep = {"n":["C","C","O","P","O","O","O","C","O","O"],"e":[0,1,1,2,2,3,3,4,3,5,3,6,1,7,7,8,7,9],"o":[[2,1,1,2,1,1,1,2,1]],"heavy":10,"rings":0,"tokens":[],"ok":true};
t.pg2 = {"n":["C","C","C","O","O","O","P","O","O","O","O"],"e":[0,1,1,2,2,3,2,4,1,5,5,6,6,7,6,8,6,9,0,10],"o":[[1,1,2,1,1,1,2,1,1,1]],"heavy":11,"rings":0,"tokens":[],"ok":true};
t.pg3 = {"n":["C","C","C","O","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,1,5,0,6,6,7,7,8,7,9,7,10],"o":[[1,1,2,1,1,1,1,2,1,1]],"heavy":11,"rings":0,"tokens":[],"ok":true};
t.proline = {"n":["O","C","O","C","C","C","C","N"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,7,3],"o":[[1,2,1,1,1,1,1,1]],"heavy":8,"rings":1,"tokens":[],"ok":true};
t.pyruvate = {"n":["C","C","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,3,5],"o":[[1,2,1,2,1]],"heavy":6,"rings":0,"tokens":[],"ok":true};
t.r5p = {"n":["C","C","C","C","C","O","O","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,3,7,2,8,0,9,9,10,10,11,10,12,10,13,5,1],"o":[[1,1,1,1,1,1,1,1,1,1,2,1,1,1]],"heavy":14,"rings":1,"tokens":[],"ok":true};
t.succinate = {"n":["O","C","O","C","C","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,5,7],"o":[[1,2,1,1,1,2,1]],"heavy":8,"rings":0,"tokens":[],"ok":true};
t.succoa = {"n":["O","C","O","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,5,7,7,8],"o":[[1,2,1,1,1,2,1,1]],"heavy":9,"rings":0,"tokens":["CoA"],"ok":true};
t.tag = {"n":["O","C","R","O","C","C","O","C","O","R","C","O","C","O","R"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,7,8,7,9,5,10,10,11,11,12,12,13,12,14],"o":[[2,1,1,1,1,1,1,2,1,1,1,1,2,1]],"heavy":15,"rings":0,"tokens":["R"],"ok":true};
t.ubiquinol = {"n":["O","C","C","O","C","C","O","C","C","O","C","C","C","R"],"e":[0,1,1,2,2,3,3,4,2,5,5,6,6,7,5,8,8,9,8,10,10,11,10,12,12,13,12,1],"o":[[1,2,1,1,1,1,1,2,1,1,1,2,1,1],[1,1,1,1,2,1,1,1,1,2,1,1,1,2]],"heavy":14,"rings":1,"tokens":["R"],"ok":true};
t.ubiquinone = {"n":["O","C","C","O","C","C","O","C","C","O","C","C","C","R"],"e":[0,1,1,2,2,3,3,4,2,5,5,6,6,7,5,8,8,9,8,10,10,11,10,12,12,13,12,1],"o":[[2,1,1,1,2,1,1,1,2,1,1,2,1,1]],"heavy":14,"rings":1,"tokens":["R"],"ok":true};
t.udpg = {"n":["O","C","C","O","C","O","UDP","C","O","C","O","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,4,7,7,8,7,9,9,10,9,11,11,12,11,2],"o":[[1,1,1,1,1,1,1,1,1,1,1,1,1]],"heavy":13,"rings":1,"tokens":["UDP"],"ok":true};
t.urea = {"n":["N","C","N","O"],"e":[0,1,1,2,1,3],"o":[[1,1,2]],"heavy":4,"rings":0,"tokens":[],"ok":true};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var t = MG.drawTargets = MG.drawTargets || {};
t.acetoacetate = {"n":["C","C","O","C","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,4,6],"o":[[1,2,1,1,2,1]],"heavy":7,"rings":0,"tokens":[],"ok":true};
t.adsucc = {"n":["P-Ribose","N","C","N","C","C","N","C","N","C","N","C","C","C","O","O","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,13,15,11,16,16,17,16,18,5,1,9,4],"o":[[1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,2,1,1,1],[1,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,2,1,1,2]],"heavy":19,"rings":2,"tokens":["P-Ribose"],"ok":true};
t.aicar = {"n":["P-Ribose","N","C","N","C","C","N","O","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,4,8,8,9,8,1],"o":[[1,1,2,1,1,1,2,2,1,1]],"heavy":10,"rings":1,"tokens":["P-Ribose"],"ok":true};
t.air = {"n":["P-Ribose","N","C","N","C","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,1],"o":[[1,1,2,1,2,1,1]],"heavy":7,"rings":1,"tokens":["P-Ribose"],"ok":true};
t.akic = {"n":["C","C","C","C","C","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7,6,8],"o":[[1,1,1,1,2,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.akiv = {"n":["C","C","C","C","O","C","O","O"],"e":[0,1,1,2,1,3,3,4,3,5,5,6,5,7],"o":[[1,1,1,2,1,2,1]],"heavy":8,"rings":0,"tokens":[],"ok":true};
t.akmv = {"n":["C","C","C","C","C","O","C","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7,6,8],"o":[[1,1,1,1,2,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.ampmol = {"n":["C","N","C","C","C","N","N","C","N","C","C","C","C","O","C","O","P","O","O","O","O","O","N"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,6,9,9,10,10,11,11,12,12,13,12,14,14,15,15,16,16,17,16,18,16,19,11,20,10,21,2,22,5,0,8,3,13,9],"o":[[2,1,2,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1],[1,2,1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1]],"heavy":23,"rings":3,"tokens":[],"ok":false};
t.cair = {"n":["P-Ribose","N","C","N","C","C","O","O","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,4,8,8,9,8,1],"o":[[1,1,2,1,1,2,1,2,1,1]],"heavy":10,"rings":1,"tokens":["P-Ribose"],"ok":true};
t.camp = {"n":["C","C","C","C","C","O","N","C","N","C","C","N","C","N","C","N","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,10,15,3,16,2,17,17,18,18,19,18,20,18,21,20,0,5,1,14,6,14,9],"o":[[1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,1,1,1,1,1],[1,1,1,1,1,1,1,2,1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,1,2]],"heavy":22,"rings":4,"tokens":[],"ok":false};
t.cgmp = {"n":["C","C","C","C","C","O","N","C","N","C","C","N","C","N","C","O","N","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,12,16,3,17,2,18,18,19,19,20,19,21,19,22,21,0,5,1,10,6,14,9],"o":[[1,1,1,1,1,1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,1,1,1,1]],"heavy":23,"rings":4,"tokens":[],"ok":false};
t.ctpmol = {"n":["C","C","C","C","C","O","N","C","C","C","N","N","C","O","O","O","O","PPP"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,9,10,9,11,11,12,12,13,3,14,2,15,0,16,16,17,5,1,12,6],"o":[[1,1,1,1,1,1,1,2,1,1,2,1,2,1,1,1,1,1,1]],"heavy":18,"rings":2,"tokens":["PPP"],"ok":false};
t.dag = {"n":["R","C","O","O","C","C","O","C","O","R","C","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,7,8,7,9,5,10,10,11],"o":[[1,2,1,1,1,1,1,2,1,1,1]],"heavy":12,"rings":0,"tokens":["R"],"ok":true};
t.dhf = {"n":["N","C","N","C","C","C","O","N","N","C","C","N","R","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,4,8,8,9,9,10,10,11,11,12,9,13,13,14,7,1,14,3],"o":[[1,2,1,2,1,2,1,1,2,1,1,1,1,1,1,1]],"heavy":15,"rings":2,"tokens":["R"],"ok":false};
t.dihydroorotate = {"n":["O","C","C","C","N","C","O","N","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,3,8,8,9,8,10,7,1],"o":[[2,1,1,1,1,2,1,1,2,1,1]],"heavy":11,"rings":1,"tokens":[],"ok":true};
t.dtmp = {"n":["C","C","C","C","C","O","N","C","C","C","C","O","N","C","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,8,10,10,11,10,12,12,13,13,14,2,15,0,16,16,17,17,18,17,19,17,20,5,1,13,6],"o":[[1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,1]],"heavy":21,"rings":2,"tokens":[],"ok":false};
t.dump = {"n":["C","C","C","C","C","O","N","C","C","C","O","N","C","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,9,10,9,11,11,12,12,13,2,14,0,15,15,16,16,17,16,18,16,19,5,1,12,6],"o":[[1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,1]],"heavy":20,"rings":2,"tokens":[],"ok":false};
t.e4p = {"n":["O","C","C","O","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7,7,8,8,9,8,10,8,11],"o":[[2,1,1,1,1,1,1,1,2,1,1]],"heavy":12,"rings":0,"tokens":[],"ok":true};
t.epinephrine = {"n":["C","N","C","C","O","C","C","C","C","O","C","O","C"],"e":[0,1,1,2,2,3,3,4,3,5,5,6,6,7,7,8,8,9,8,10,10,11,10,12,12,5],"o":[[1,1,1,1,1,2,1,2,1,1,1,2,1],[1,1,1,1,1,1,2,1,1,2,1,1,2]],"heavy":13,"rings":1,"tokens":[],"ok":true};
t.faicar = {"n":["P-Ribose","N","C","N","C","C","N","O","C","N","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,4,8,8,9,9,10,10,11,8,1],"o":[[1,1,2,1,1,1,2,2,1,1,2,1]],"heavy":12,"rings":1,"tokens":["P-Ribose"],"ok":true};
t.fgam = {"n":["P-Ribose","N","C","N","C","N","C","O"],"e":[0,1,1,2,2,3,2,4,4,5,5,6,6,7],"o":[[1,1,2,1,1,1,2]],"heavy":8,"rings":0,"tokens":["P-Ribose"],"ok":true};
t.fgar = {"n":["P-Ribose","N","C","O","C","N","C","O"],"e":[0,1,1,2,2,3,2,4,4,5,5,6,6,7],"o":[[1,1,2,1,1,1,2]],"heavy":8,"rings":0,"tokens":["P-Ribose"],"ok":true};
t.fumarylacac = {"n":["O","C","O","C","C","C","O","C","C","O","C","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,5,7,7,8,8,9,8,10,10,11,11,12,11,13],"o":[[1,2,1,2,1,2,1,1,2,1,1,2,1]],"heavy":14,"rings":0,"tokens":[],"ok":true};
t.gar = {"n":["P-Ribose","N","C","O","C","N"],"e":[0,1,1,2,2,3,2,4,4,5],"o":[[1,1,2,1,1]],"heavy":6,"rings":0,"tokens":["P-Ribose"],"ok":true};
t.glycine = {"n":["N","C","C","O","O"],"e":[0,1,1,2,2,3,2,4],"o":[[1,1,2,1]],"heavy":5,"rings":0,"tokens":[],"ok":true};
t.gmp = {"n":["P-Ribose","N","C","N","C","C","N","C","N","N","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,7,9,9,10,10,11,5,1,10,4],"o":[[1,1,2,1,2,1,2,1,1,1,2,1,1]],"heavy":12,"rings":2,"tokens":["P-Ribose"],"ok":true};
t.hib = {"n":["O","C","C","C","C","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6],"o":[[1,1,1,1,2,1]],"heavy":7,"rings":0,"tokens":[],"ok":true};
t.hibcoa = {"n":["O","C","C","C","C","O","S","CoA"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7],"o":[[1,1,1,1,2,1,1]],"heavy":8,"rings":0,"tokens":["CoA"],"ok":true};
t.hmgcoa = {"n":["C","C","O","C","C","O","O","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,1,7,7,8,8,9,8,10,10,11],"o":[[1,1,1,1,2,1,1,1,2,1,1]],"heavy":12,"rings":0,"tokens":["CoA"],"ok":true};
t.homogentisate = {"n":["O","C","O","C","C","C","C","O","C","C","C","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,6,7,6,8,8,9,9,10,10,11,10,4],"o":[[1,2,1,1,2,1,1,2,1,2,1,1],[1,2,1,1,1,2,1,1,2,1,1,2]],"heavy":12,"rings":1,"tokens":[],"ok":true};
t.hpp = {"n":["O","C","O","C","O","C","C","C","C","C","O","C","C"],"e":[0,1,1,2,1,3,3,4,3,5,5,6,6,7,7,8,8,9,9,10,9,11,11,12,12,6],"o":[[1,2,1,2,1,1,2,1,2,1,1,2,1]],"heavy":13,"rings":1,"tokens":[],"ok":true};
t.imp = {"n":["P-Ribose","N","C","N","C","C","N","C","N","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,5,1,9,4],"o":[[1,1,2,1,2,1,2,1,1,2,1,1]],"heavy":11,"rings":2,"tokens":["P-Ribose"],"ok":true};
t.ip3 = {"n":["C","O","P","O","O","O","C","O","C","O","C","O","P","O","O","O","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,2,5,0,6,6,7,6,8,8,9,8,10,10,11,11,12,12,13,12,14,12,15,10,16,16,17,16,18,18,19,19,20,20,21,20,22,20,23,18,0],"o":[[1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1]],"heavy":24,"rings":1,"tokens":[],"ok":false};
t.isobutyrylcoa = {"n":["C","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,3,5,5,6],"o":[[1,1,1,2,1,1]],"heavy":7,"rings":0,"tokens":["CoA"],"ok":true};
t.isoleucine = {"n":["C","C","C","C","C","N","C","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7,6,8],"o":[[1,1,1,1,1,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.isovalerylcoa = {"n":["C","C","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7],"o":[[1,1,1,1,2,1,1]],"heavy":8,"rings":0,"tokens":["CoA"],"ok":true};
t.leucine = {"n":["C","C","C","C","C","N","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7,6,8],"o":[[1,1,1,1,1,1,2,1]],"heavy":9,"rings":0,"tokens":[],"ok":true};
t.makcoa = {"n":["C","C","O","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,3,5,5,6,5,7,7,8],"o":[[1,2,1,1,1,2,1,1]],"heavy":9,"rings":0,"tokens":["CoA"],"ok":true};
t.maleylacac = {"n":["O","C","O","C","C","C","O","C","C","O","C","C","O","O"],"e":[0,1,1,2,1,3,3,4,4,5,5,6,5,7,7,8,8,9,8,10,10,11,11,12,11,13],"o":[[1,2,1,2,1,2,1,1,2,1,1,2,1]],"heavy":14,"rings":0,"tokens":[],"ok":true};
t.mbcoa = {"n":["C","C","C","C","C","O","S","CoA"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7],"o":[[1,1,1,1,2,1,1]],"heavy":8,"rings":0,"tokens":["CoA"],"ok":true};
t.mccoa = {"n":["C","C","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7],"o":[[1,1,2,1,2,1,1]],"heavy":8,"rings":0,"tokens":["CoA"],"ok":true};
t.methacrylylcoa = {"n":["C","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,3,5,5,6],"o":[[1,2,1,2,1,1]],"heavy":7,"rings":0,"tokens":["CoA"],"ok":true};
t.mgcoa = {"n":["O","C","O","C","C","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,4,5,4,6,6,7,7,8,7,9,9,10],"o":[[1,2,1,2,1,1,1,2,1,1]],"heavy":11,"rings":0,"tokens":["CoA"],"ok":true};
t.mhbcoa = {"n":["C","C","O","C","C","C","O","S","CoA"],"e":[0,1,1,2,1,3,3,4,3,5,5,6,5,7,7,8],"o":[[1,1,1,1,1,2,1,1]],"heavy":9,"rings":0,"tokens":["CoA"],"ok":true};
t.mmsa = {"n":["O","C","C","C","C","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6],"o":[[2,1,1,1,2,1]],"heavy":7,"rings":0,"tokens":[],"ok":true};
t.mthf = {"n":["N","C","N","C","C","C","O","N","N","C","N","R","C","C","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,4,8,8,9,9,10,10,11,10,12,12,13,13,14,14,15,7,1,15,3,13,8],"o":[[1,2,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1]],"heavy":16,"rings":3,"tokens":["R"],"ok":false};
t.omp = {"n":["C","C","C","C","C","O","N","C","C","O","O","C","C","O","N","C","O","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,8,10,7,11,11,12,12,13,12,14,14,15,15,16,3,17,2,18,0,19,19,20,20,21,20,22,20,23,5,1,15,6],"o":[[1,1,1,1,1,1,1,1,2,1,2,1,2,1,1,2,1,1,1,1,2,1,1,1,1]],"heavy":24,"rings":2,"tokens":[],"ok":false};
t.orotate = {"n":["O","C","C","C","N","C","O","N","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,3,8,8,9,8,10,7,1],"o":[[2,1,2,1,1,2,1,1,2,1,1]],"heavy":11,"rings":1,"tokens":[],"ok":true};
t.pglactone = {"n":["O","P","O","O","O","C","C","O","C","O","C","O","C","O","C","O"],"e":[0,1,1,2,1,3,1,4,4,5,5,6,6,7,7,8,8,9,8,10,10,11,10,12,12,13,12,14,14,15,14,6],"o":[[1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1]],"heavy":16,"rings":1,"tokens":[],"ok":true};
t.pgluconate = {"n":["O","P","O","O","O","C","C","O","C","O","C","O","C","O","C","O","O"],"e":[0,1,1,2,1,3,1,4,4,5,5,6,6,7,6,8,8,9,8,10,10,11,10,12,12,13,12,14,14,15,14,16],"o":[[1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1]],"heavy":17,"rings":0,"tokens":[],"ok":true};
t.phenylalanine = {"n":["N","C","C","C","C","C","C","C","C","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,1,9,9,10,9,11,8,3],"o":[[1,1,1,2,1,2,1,2,1,2,1,1]],"heavy":12,"rings":1,"tokens":[],"ok":true};
t.phosphotyrosine = {"n":["N","C","C","C","C","C","C","O","P","O","O","O","C","C","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,8,10,8,11,6,12,12,13,1,14,14,15,14,16,13,3],"o":[[1,1,1,2,1,2,1,1,2,1,1,1,2,1,2,1,1]],"heavy":17,"rings":1,"tokens":[],"ok":true};
t.pip2 = {"n":["C","O","P","O","O","O","C","O","C","O","C","O","P","O","O","O","C","C","O","C","O","R","C","O","C","O","R","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,2,5,0,6,6,7,6,8,8,9,8,10,10,11,11,12,12,13,12,14,12,15,15,16,16,17,17,18,18,19,19,20,19,21,17,22,22,23,23,24,24,25,24,26,10,27,27,28,27,29,29,30,30,31,31,32,31,33,31,34,29,0],"o":[[1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1]],"heavy":35,"rings":1,"tokens":["R"],"ok":false};
t.plp = {"n":["C","C","N","C","C","C","O","P","O","O","O","C","C","O","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,7,9,7,10,4,11,11,12,12,13,11,14,14,15,14,1],"o":[[1,2,1,2,1,1,1,2,1,1,1,1,2,2,1,1],[1,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2]],"heavy":16,"rings":1,"tokens":[],"ok":true};
t.pmp = {"n":["C","C","N","C","C","C","O","P","O","O","O","C","C","N","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,7,9,7,10,4,11,11,12,12,13,11,14,14,15,14,1],"o":[[1,2,1,2,1,1,1,2,1,1,1,1,1,2,1,1],[1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2]],"heavy":16,"rings":1,"tokens":[],"ok":true};
t.pra = {"n":["C","C","C","C","C","O","N","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,3,7,2,8,0,9,9,10,10,11,10,12,10,13,5,1],"o":[[1,1,1,1,1,1,1,1,1,1,2,1,1,1]],"heavy":14,"rings":1,"tokens":[],"ok":true};
t.propionylcoa = {"n":["C","C","C","O","S","CoA"],"e":[0,1,1,2,2,3,2,4,4,5],"o":[[1,1,2,1,1]],"heavy":6,"rings":0,"tokens":["CoA"],"ok":true};
t.prpp = {"n":["C","C","C","C","C","O","O","PP","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,3,8,2,9,0,10,10,11,11,12,11,13,11,14,5,1],"o":[[1,1,1,1,1,1,1,1,1,1,1,2,1,1,1]],"heavy":15,"rings":1,"tokens":["PP"],"ok":true};
t.ru5p = {"n":["O","C","C","O","C","O","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7,6,8,8,9,9,10,10,11,10,12,10,13],"o":[[1,1,2,1,1,1,1,1,1,1,2,1,1]],"heavy":14,"rings":0,"tokens":[],"ok":true};
t.rubp = {"n":["O","P","O","O","O","C","C","O","C","O","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,1,3,1,4,4,5,5,6,6,7,6,8,8,9,8,10,10,11,10,12,12,13,13,14,14,15,14,16,14,17],"o":[[1,2,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1]],"heavy":18,"rings":0,"tokens":[],"ok":true};
t.s7p = {"n":["O","C","C","O","C","O","C","O","C","O","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7,6,8,8,9,8,10,10,11,10,12,12,13,13,14,14,15,14,16,14,17],"o":[[1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1]],"heavy":18,"rings":0,"tokens":[],"ok":true};
t.saicar = {"n":["P-Ribose","N","C","N","C","C","O","N","C","C","C","O","O","C","O","O","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,7,8,8,9,9,10,10,11,10,12,8,13,13,14,13,15,4,16,16,17,16,1],"o":[[1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,1,1]],"heavy":18,"rings":1,"tokens":["P-Ribose"],"ok":true};
t.sbp = {"n":["O","P","O","O","O","C","C","O","C","O","C","O","C","O","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,1,3,1,4,4,5,5,6,6,7,6,8,8,9,8,10,10,11,10,12,12,13,12,14,14,15,14,16,16,17,17,18,18,19,18,20,18,21],"o":[[1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1]],"heavy":22,"rings":0,"tokens":[],"ok":false};
t.thfmol = {"n":["N","C","N","C","C","C","O","N","N","C","C","N","R","C","N"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,5,7,4,8,8,9,9,10,10,11,11,12,9,13,13,14,7,1,14,3],"o":[[1,2,1,2,1,2,1,1,1,1,1,1,1,1,1,1]],"heavy":15,"rings":2,"tokens":["R"],"ok":false};
t.tiglylcoa = {"n":["C","C","C","C","C","O","S","CoA"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7],"o":[[1,2,1,1,2,1,1]],"heavy":8,"rings":0,"tokens":["CoA"],"ok":true};
t.tyrosine = {"n":["N","C","C","C","C","C","C","O","C","C","C","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,6,8,8,9,1,10,10,11,10,12,9,3],"o":[[1,1,1,2,1,2,1,1,2,1,2,1,1]],"heavy":13,"rings":1,"tokens":[],"ok":true};
t.udpmol = {"n":["C","C","C","C","C","O","N","C","C","C","O","N","C","O","O","O","O","PP"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,9,10,9,11,11,12,12,13,3,14,2,15,0,16,16,17,5,1,12,6],"o":[[1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1,1,1]],"heavy":18,"rings":2,"tokens":["PP"],"ok":false};
t.umpmol = {"n":["C","C","C","C","C","O","N","C","C","C","O","N","C","O","O","O","O","P","O","O","O"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,9,10,9,11,11,12,12,13,3,14,2,15,0,16,16,17,17,18,17,19,17,20,5,1,12,6],"o":[[1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1,2,1,1,1,1]],"heavy":21,"rings":2,"tokens":[],"ok":false};
t.utpmol = {"n":["C","C","C","C","C","O","N","C","C","C","O","N","C","O","O","O","O","PPP"],"e":[0,1,1,2,2,3,3,4,4,5,4,6,6,7,7,8,8,9,9,10,9,11,11,12,12,13,3,14,2,15,0,16,16,17,5,1,12,6],"o":[[1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1,1,1]],"heavy":18,"rings":2,"tokens":["PPP"],"ok":false};
t.valine = {"n":["C","C","C","C","N","C","O","O"],"e":[0,1,1,2,1,3,3,4,3,5,5,6,5,7],"o":[[1,1,1,1,1,2,1]],"heavy":8,"rings":0,"tokens":[],"ok":true};
t.xmp = {"n":["P-Ribose","N","C","N","C","C","N","C","O","N","C","O"],"e":[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,7,9,9,10,10,11,5,1,10,4],"o":[[1,1,2,1,2,1,1,2,1,1,2,1,1]],"heavy":12,"rings":2,"tokens":["P-Ribose"],"ok":true};
t.xu5p = {"n":["O","C","C","O","C","O","C","O","C","O","P","O","O","O"],"e":[0,1,1,2,2,3,2,4,4,5,4,6,6,7,6,8,8,9,9,10,10,11,10,12,10,13],"o":[[1,1,2,1,1,1,1,1,1,1,2,1,1]],"heavy":14,"rings":0,"tokens":[],"ok":true};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var ELEMENTS = ['C', 'O', 'N', 'S', 'P'];
var MAX_BONDS = { C: 4, N: 4, O: 2, S: 2, P: 5 };
var NORMAL = { C: 4, N: 3, O: 2, S: 2 };
var STEP = Math.PI / 6;           // the directions: every 30 degrees
var GRID = 0.25;                  // the first atom lands on this grid, in bond lengths
var HISTORY = 80;
var JOIN_REACH = 1.6;             // an atom closer than this to the selected one is joined to it
var STAMP_REACH = 2.2;            // a stamp tapped closer than this to the selected atom is attached to it
var SAME_PLACE = 0.4;             // two atoms closer than this are one place
function create() {
return { atoms: [], bonds: [], sel: null, brush: 'C', tool: 'add', stamp: null, dbl: false, next: 1, undo: [] };
}
function snap(v) { return Math.round(v / GRID) * GRID; }
function round(v) { return Math.round(v * 1000) / 1000; }
function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
function dir(angle) { return { x: Math.cos(angle), y: Math.sin(angle) }; }
function snapAngle(a) { return Math.round(a / STEP) * STEP; }
function atomById(st, id) { for (var i = 0; i < st.atoms.length; i++) { if (st.atoms[i].id === id) { return st.atoms[i]; } } return null; }
function bondBetween(st, a, b) {
for (var i = 0; i < st.bonds.length; i++) {
var k = st.bonds[i];
if ((k.a === a && k.b === b) || (k.a === b && k.b === a)) { return k; }
}
return null;
}
function bondsOf(st, id) { return st.bonds.filter(function (k) { return k.a === id || k.b === id; }); }
function snapshot(st) { return JSON.stringify({ atoms: st.atoms, bonds: st.bonds, sel: st.sel, next: st.next }); }
function remember(st) {
st.undo.push(snapshot(st));
if (st.undo.length > HISTORY) { st.undo.shift(); }
}
function undo(st) {
if (!st.undo.length) { return false; }
var s = JSON.parse(st.undo.pop());
st.atoms = s.atoms; st.bonds = s.bonds; st.sel = s.sel; st.next = s.next;
st.dbl = false;
return true;
}
function clear(st) {
if (!st.atoms.length) { return false; }
remember(st);
st.atoms = []; st.bonds = []; st.sel = null; st.dbl = false;
return true;
}
function addAtom(st, el, x, y) {
var a = { id: st.next++, el: el, x: round(x), y: round(y) };
st.atoms.push(a);
return a;
}
function addBond(st, a, b, o) {
var k = { id: st.next++, a: a, b: b, o: o === 2 ? 2 : 1 };
st.bonds.push(k);
return k;
}
function removeAtom(st, id) {
st.atoms = st.atoms.filter(function (a) { return a.id !== id; });
st.bonds = st.bonds.filter(function (k) { return k.a !== id && k.b !== id; });
if (st.sel === id) { st.sel = null; }
}
function cycle(k) { k.o = k.o === 1 ? 2 : 1; }
function nearestAtom(st, x, y, r) {
var best = null, bd = Infinity;
st.atoms.forEach(function (a) {
var d = dist(x, y, a.x, a.y);
if (d <= r && d < bd) { best = a; bd = d; }
});
return best;
}
function segDist(px, py, x1, y1, x2, y2) {
var dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
var t = l2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
return dist(px, py, x1 + dx * t, y1 + dy * t);
}
function nearestBond(st, x, y, r) {
var best = null, bd = Infinity;
st.bonds.forEach(function (k) {
var a = atomById(st, k.a), b = atomById(st, k.b);
if (!a || !b) { return; }
var d = segDist(x, y, a.x, a.y, b.x, b.y);
if (d <= r && d < bd) { best = k; bd = d; }
});
return best;
}
function slotsAround(st, a) {
var out = [];
for (var k = 0; k < 12; k++) {
var ang = k * STEP;
var d = dir(ang);
var x = round(a.x + d.x), y = round(a.y + d.y);
var near = nearestAtom(st, x, y, SAME_PLACE);
out.push({ k: k, angle: ang, x: x, y: y, taken: near ? near.id : null });
}
return out;
}
function slotsOf(st) {
var a = st.sel === null ? null : atomById(st, st.sel);
return a ? slotsAround(st, a) : [];
}
function bestSlot(st, a) {
var slots = slotsAround(st, a).filter(function (s) { return s.taken === null; });
if (!slots.length) { return null; }
var around = bondsOf(st, a.id).map(function (k) {
var o = atomById(st, k.a === a.id ? k.b : k.a);
return Math.atan2(o.y - a.y, o.x - a.x);
});
var best = null, bs = -1;
slots.forEach(function (s) {
var gap = Infinity;
around.forEach(function (ang) {
var d = Math.abs(s.angle - ang) % (2 * Math.PI);
d = Math.min(d, 2 * Math.PI - d);
if (d < gap) { gap = d; }
});
var zig = [1, 5, 7, 11, 3, 9].indexOf(s.k);
var score = gap + (zig >= 0 ? 0.01 * (6 - zig) : 0);
if (score > bs) { best = s; bs = score; }
});
return best;
}
function ringFrom(st, n, p0, th, anchor) {
var radius = 1 / (2 * Math.sin(Math.PI / n));
var c = { x: p0.x + radius * Math.cos(th), y: p0.y + radius * Math.sin(th) };
var made = [];
for (var i = 0; i < n; i++) {
var ang = th + Math.PI + 2 * Math.PI * i / n;
made.push(addAtom(st, 'C', c.x + radius * Math.cos(ang), c.y + radius * Math.sin(ang)));
}
for (var j = 0; j < n; j++) { addBond(st, made[j].id, made[(j + 1) % n].id, 1); }
if (anchor) { addBond(st, anchor.id, made[0].id, 1); }
}
var STAMPS = {
carboxyl: function (st, p0, th, anchor) {
var c = addAtom(st, 'C', p0.x, p0.y);
if (anchor) { addBond(st, anchor.id, c.id, 1); }
var d1 = dir(th + Math.PI / 3), d2 = dir(th - Math.PI / 3);
addBond(st, c.id, addAtom(st, 'O', p0.x + d1.x, p0.y + d1.y).id, 2);
addBond(st, c.id, addAtom(st, 'O', p0.x + d2.x, p0.y + d2.y).id, 1);
},
phosphate: function (st, p0, th, anchor) {
var o = addAtom(st, 'O', p0.x, p0.y);
if (anchor) { addBond(st, anchor.id, o.id, 1); }
var dp = dir(th);
var p = addAtom(st, 'P', p0.x + dp.x, p0.y + dp.y);
addBond(st, o.id, p.id, 1);
[0, Math.PI / 2, -Math.PI / 2].forEach(function (turn, i) {
var d = dir(th + turn);
addBond(st, p.id, addAtom(st, 'O', p.x + d.x, p.y + d.y).id, i === 0 ? 2 : 1);
});
},
ring6: function (st, p0, th, anchor) { ringFrom(st, 6, p0, th, anchor); },
ring5: function (st, p0, th, anchor) { ringFrom(st, 5, p0, th, anchor); }
};
function fuseRing(st, n, bond) {
var A = atomById(st, bond.a), B = atomById(st, bond.b);
var d = dist(A.x, A.y, B.x, B.y);
if (d < 0.3) { return { did: 'none' }; }
var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
var ux = (B.x - A.x) / d, uy = (B.y - A.y) / d;
var apothem = d / (2 * Math.tan(Math.PI / n)), radius = d / (2 * Math.sin(Math.PI / n));
var others = st.atoms.filter(function (a) { return a.id !== A.id && a.id !== B.id; });
function corners(side) {
var cx = mx + side * -uy * apothem, cy = my + side * ux * apothem;
var a0 = Math.atan2(A.y - cy, A.x - cx), a1 = Math.atan2(B.y - cy, B.x - cx);
var turn = Math.atan2(Math.sin(a1 - a0), Math.cos(a1 - a0)) > 0 ? 1 : -1;
var out = [];
for (var k = 2; k < n; k++) {
var ang = a0 + turn * 2 * Math.PI * k / n;
out.push({ x: cx + radius * Math.cos(ang), y: cy + radius * Math.sin(ang) });
}
return { c: { x: cx, y: cy }, v: out };
}
function crowd(r) {
var bad = 0;
r.v.forEach(function (p) { others.forEach(function (o) { if (dist(p.x, p.y, o.x, o.y) < 0.6) { bad++; } }); });
if (others.some(function (o) { return dist(r.c.x, r.c.y, o.x, o.y) < 0.6; })) { bad += 2; }
return bad;
}
var one = corners(1), two = corners(-1);
var gx = mx, gy = my;
if (others.length) {
gx = others.reduce(function (s, o) { return s + o.x; }, 0) / others.length;
gy = others.reduce(function (s, o) { return s + o.y; }, 0) / others.length;
}
var c1 = crowd(one), c2 = crowd(two);
var pick = one;
if (c2 < c1 || (c2 === c1 && dist(two.c.x, two.c.y, gx, gy) > dist(one.c.x, one.c.y, gx, gy))) { pick = two; }
remember(st);
var prev = B;
pick.v.forEach(function (p) {
var m = addAtom(st, 'C', p.x, p.y);
addBond(st, prev.id, m.id, 1);
prev = m;
});
addBond(st, prev.id, A.id, 1);
st.stamp = null;
st.sel = null;
return { did: 'stamp' };
}
function placeStamp(st, x, y, hitAtom) {
var build = STAMPS[st.stamp];
if (!build) { st.stamp = null; return { did: 'none' }; }
var sel = st.sel === null ? null : atomById(st, st.sel);
var anchor = hitAtom || (sel && (x === null || dist(x, y, sel.x, sel.y) <= STAMP_REACH) ? sel : null);
var p0, th;
if (anchor) {
var slot;
if (hitAtom || x === null) { slot = bestSlot(st, anchor); }
else {
var ang = snapAngle(Math.atan2(y - anchor.y, x - anchor.x));
var d = dir(ang);
var sx = round(anchor.x + d.x), sy = round(anchor.y + d.y);
slot = nearestAtom(st, sx, sy, SAME_PLACE) ? null : { angle: ang, x: sx, y: sy };
}
if (!slot) { return { did: 'none', message: 'Vị trí đó đã có người rồi.' }; }
remember(st);
p0 = { x: slot.x, y: slot.y };
th = slot.angle;
} else {
remember(st);
th = Math.PI / 2;
p0 = { x: snap(x === null ? 0 : x), y: snap(y === null ? 0 : y) };
if (st.stamp === 'ring6' || st.stamp === 'ring5') {
p0.y = round(p0.y - 1 / (2 * Math.sin(Math.PI / (st.stamp === 'ring6' ? 6 : 5))));
}
}
build(st, p0, th, anchor);
st.stamp = null;
st.sel = null;
return { did: 'stamp' };
}
function tapAtom(st, a) {
if (st.sel === null) { st.sel = a.id; return { did: 'select' }; }
if (st.sel === a.id) { st.sel = null; return { did: 'deselect' }; }
var from = atomById(st, st.sel);
if (bondBetween(st, from.id, a.id) || dist(from.x, from.y, a.x, a.y) > JOIN_REACH) { st.sel = a.id; return { did: 'select' }; }
remember(st);
addBond(st, from.id, a.id, st.dbl ? 2 : 1);
st.dbl = false;
st.sel = a.id;
return { did: 'bond' };
}
function tap(st, x, y, reach) {
var r = reach || {};
var ra = r.atom || 0.42, rb = r.bond || 0.2;
var a = nearestAtom(st, x, y, ra);
var b = a ? null : nearestBond(st, x, y, rb);
if (st.tool === 'erase') {
if (a) { remember(st); removeAtom(st, a.id); return { did: 'erase-atom' }; }
if (b) { remember(st); st.bonds = st.bonds.filter(function (k) { return k !== b; }); return { did: 'erase-bond' }; }
return { did: 'none' };
}
if (st.tool === 'change') {
if (a && a.el !== st.brush) { remember(st); a.el = st.brush; return { did: 'change' }; }
return { did: 'none' };
}
if (st.stamp) {
if (!a && b && (st.stamp === 'ring5' || st.stamp === 'ring6')) { return fuseRing(st, st.stamp === 'ring6' ? 6 : 5, b); }
return placeStamp(st, x, y, a);
}
if (a) { return tapAtom(st, a); }
if (b) { remember(st); cycle(b); return { did: 'order' }; }
if (!st.atoms.length) {
remember(st);
var first = addAtom(st, st.brush, snap(x), snap(y));
st.sel = first.id;
return { did: 'first' };
}
if (st.sel === null) { return { did: 'none', message: 'Chạm vào một nguyên tử trước, sau đó chạm vào nguyên tử bên cạnh nó.' }; }
var s = atomById(st, st.sel);
var d = dir(snapAngle(Math.atan2(y - s.y, x - s.x)));
var nx = round(s.x + d.x), ny = round(s.y + d.y);
var there = nearestAtom(st, nx, ny, SAME_PLACE);
if (there) { return tapAtom(st, there); }
remember(st);
var m = addAtom(st, st.brush, nx, ny);
addBond(st, s.id, m.id, st.dbl ? 2 : 1);
st.dbl = false;
st.sel = m.id;
return { did: 'atom' };
}
function setBrush(st, name) { st.brush = name; if (st.tool === 'erase') { st.tool = 'add'; } st.stamp = null; }
function setTool(st, tool) { st.tool = tool; st.stamp = null; }
function setStamp(st, name) { st.stamp = st.stamp === name ? null : name; if (st.stamp) { st.tool = 'add'; } }
function toggleDouble(st) { st.dbl = !st.dbl; }
function sumOf(st, id) { return bondsOf(st, id).reduce(function (n, k) { return n + k.o; }, 0); }
function impliedH(el, sum) { return NORMAL[el] === undefined ? 0 : Math.max(0, NORMAL[el] - sum); }
function labelFor(st, a, left) {
if (ELEMENTS.indexOf(a.el) < 0) { return { runs: [{ t: a.el, main: true }] }; }
var sum = sumOf(st, a.id);
if (a.el === 'C') { return sum === 0 ? { runs: [{ t: 'C', main: true }] } : null; }
var h = impliedH(a.el, sum);
var main = { t: a.el, main: true };
if (h === 0) { return { runs: [main] }; }
var hs = [{ t: 'H' }];
if (h > 1) { hs.push({ t: String(h), style: 'sub' }); }
return { runs: left || sum === 0 ? hs.concat([main]) : [main].concat(hs) };
}
function toGeometry(st) {
var index = {};
st.atoms.forEach(function (a, i) { index[a.id] = i; });
return {
atoms: st.atoms.map(function (a) {
var own = bondsOf(st, a.id);
var left = false;
if (own.length === 1) {
var o = atomById(st, own[0].a === a.id ? own[0].b : own[0].a);
left = a.x < o.x - 0.3;
}
return { x: a.x, y: a.y, el: ELEMENTS.indexOf(a.el) < 0 ? '*' : a.el, label: labelFor(st, a, left) };
}),
bonds: st.bonds.map(function (k) { return { a: index[k.a], b: index[k.b], o: k.o, s: 0 }; }),
groups: {}
};
}
function extent(st) {
if (!st.atoms.length) { return null; }
var e = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
st.atoms.forEach(function (a) {
e.x0 = Math.min(e.x0, a.x); e.x1 = Math.max(e.x1, a.x); e.y0 = Math.min(e.y0, a.y); e.y1 = Math.max(e.y1, a.y);
});
return e;
}
function describe(st) {
var n = st.atoms.length, m = st.bonds.length;
if (!n) { return 'Chưa có gì được vẽ cả.'; }
return n + (n === 1 ? ' nguyên tử' : ' nguyên tử') + ' Và ' + m + (m === 1 ? ' trái phiếu' : ' trái phiếu');
}
function analyse(st) {
var index = {};
st.atoms.forEach(function (a, i) { index[a.id] = i; });
var nodes = st.atoms.map(function (a) { return a.el; });
var edges = st.bonds.map(function (k) { return [index[k.a], index[k.b], k.o]; });
var over = [];
st.atoms.forEach(function (a, i) {
var limit = MAX_BONDS[a.el];
if (limit === undefined) { limit = 1; }               // a token holds one bond
if (sumOf(st, a.id) > limit) { over.push(i); }
});
var seen = {};
var stack = st.atoms.length ? [st.atoms[0].id] : [];
while (stack.length) {
var id = stack.pop();
if (seen[id]) { continue; }
seen[id] = true;
bondsOf(st, id).forEach(function (k) { stack.push(k.a === id ? k.b : k.a); });
}
var split = st.atoms.some(function (a) { return !seen[a.id]; });
return { empty: st.atoms.length === 0, nodes: nodes, edges: edges, over: over, split: split };
}
function adjacency(nodes, edges) {
var adj = nodes.map(function () { return []; });
edges.forEach(function (e) { adj[e[0]].push([e[1], e[2]]); adj[e[1]].push([e[0], e[2]]); });
return adj;
}
function signature(nodes, adj, i) {
return nodes[i] + '|' + adj[i].map(function (p) { return nodes[p[0]] + p[1]; }).sort().join(',');
}
function isomorphic(n1, e1, n2, e2) {
if (n1.length !== n2.length || e1.length !== e2.length) { return false; }
var a1 = adjacency(n1, e1), a2 = adjacency(n2, e2);
var s1 = n1.map(function (x, i) { return signature(n1, a1, i); });
var s2 = n2.map(function (x, i) { return signature(n2, a2, i); });
if (s1.slice().sort().join(';') !== s2.slice().sort().join(';')) { return false; }
var count2 = {};
s2.forEach(function (s) { count2[s] = (count2[s] || 0) + 1; });
var order = [];
var left = n1.map(function (x, i) { return i; });
while (left.length) {
var pick = null, pr = Infinity;
left.forEach(function (i) {
var linked = order.some(function (j) { return a1[i].some(function (p) { return p[0] === j; }); });
var pri = (order.length && !linked ? 1e6 : 0) + count2[s1[i]];
if (pri < pr) { pick = i; pr = pri; }
});
order.push(pick);
left = left.filter(function (i) { return i !== pick; });
}
var map = {}, used = {};
function fits(i, j) {
if (s1[i] !== s2[j]) { return false; }
var k, p, q;
for (k = 0; k < a1[i].length; k++) {
p = a1[i][k];
if (map[p[0]] === undefined) { continue; }
if (!a2[j].some(function (z) { return z[0] === map[p[0]] && z[1] === p[1]; })) { return false; }
}
for (k = 0; k < a2[j].length; k++) {
q = a2[j][k];
var back = null;
for (var key in map) { if (Object.prototype.hasOwnProperty.call(map, key) && map[key] === q[0]) { back = +key; } }
if (back === null) { continue; }
if (!a1[i].some(function (z) { return z[0] === back && z[1] === q[1]; })) { return false; }
}
return true;
}
function go(at) {
if (at === order.length) { return true; }
var i = order[at];
for (var j = 0; j < n2.length; j++) {
if (used[j] || !fits(i, j)) { continue; }
map[i] = j; used[j] = true;
if (go(at + 1)) { return true; }
delete map[i]; delete used[j];
}
return false;
}
return go(0);
}
function targetEdges(t) {
var out = [];
for (var i = 0; i < t.e.length; i += 2) { out.push([t.e[i], t.e[i + 1]]); }
return out;
}
function count(list) {
var c = {};
list.forEach(function (x) { c[x] = (c[x] || 0) + 1; });
return c;
}
function sameCounts(a, b) {
var ka = Object.keys(a), kb = Object.keys(b);
return ka.length === kb.length && ka.every(function (k) { return a[k] === b[k]; });
}
function doubles(edges, orders) {
var n = 0;
for (var i = 0; i < edges.length; i++) { n += (orders ? orders[i] : edges[i][2]) - 1; }
return n;
}
function check(st, target) {
var an = analyse(st);
if (an.empty) { return { ok: false, code: 'empty', message: 'Hãy vẽ trước: chạm vào trang để đặt nguyên tử đầu tiên.', over: [] }; }
if (an.over.length) { return { ok: false, code: 'over', message: 'Một nguyên tử có nhiều liên kết hơn số liên kết mà nó có thể có. Các nguyên tử có hình chữ thập cần phải loại bỏ một liên kết.', over: an.over }; }
if (an.split) { return { ok: false, code: 'split', message: 'Bức vẽ gồm nhiều mảnh. Hãy ghép các mảnh lại với nhau bằng keo dán hoặc tách một mảnh ra.', over: [] }; }
var edges = targetEdges(target);
for (var f = 0; f < target.o.length; f++) {
var te = edges.map(function (e, i) { return [e[0], e[1], target.o[f][i]]; });
if (isomorphic(an.nodes, an.edges, target.n, te)) { return { ok: true, code: 'ok', message: 'Phải.', over: [] }; }
}
if (!sameCounts(count(an.nodes), count(target.n))) { return { ok: false, code: 'atoms', message: 'Chưa hẳn. Các nguyên tử chưa phải là đúng: cần phải là các nguyên tố, hoặc số lượng của mỗi nguyên tố.', over: [] }; }
if (an.edges.length - an.nodes.length !== edges.length - target.n.length) { return { ok: false, code: 'rings', message: 'Không hẳn. Các nguyên tử thì đúng, nhưng hình vẽ của bạn có số vòng khác với phân tử thực tế.', over: [] }; }
var wanted = target.o.map(function (o) { return doubles(edges, o); });
if (wanted.indexOf(doubles(an.edges)) < 0) { return { ok: false, code: 'doubles', message: 'Chưa hẳn. Các nguyên tử và vòng thì đúng rồi. Hãy nhìn lại các liên kết đôi.', over: [] }; }
return { ok: false, code: 'joined', message: 'Không hẳn. Số lượng nguyên tử và liên kết đôi thì đúng, nhưng chúng được liên kết với nhau theo cách khác.', over: [] };
}
var NAMES = { C: ['carbon', 'carbons'], N: ['nitrogen', 'nitrogens'], O: ['oxygen', 'oxygens'], S: ['sulfur', 'sulfurs'], P: ['phosphorus', 'nguyên tử phốt pho'] };
var WORDS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine' };
function word(n) { return WORDS[n] || String(n); }
function joinList(parts) { return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' Và ' + parts[parts.length - 1] : parts[0]; }
function atomCounts(target) {
var c = count(target.n);
var parts = [];
['C', 'N', 'O', 'S', 'P'].forEach(function (el) { if (c[el]) { parts.push(word(c[el]) + ' ' + NAMES[el][c[el] === 1 ? 0 : 1]); } });
Object.keys(c).forEach(function (k) { if (!NAMES[k]) { parts.push(c[k] === 1 ? 'nhóm ' + k : word(c[k]) + ' ' + k + ' các nhóm'); } });
return joinList(parts);
}
function ringSizes(target) {
var edges = targetEdges(target);
var adj = target.n.map(function () { return []; });
edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
var sizes = [];
edges.forEach(function (e) {
var seen = {};
seen[e[0]] = 0;
var queue = [e[0]];
while (queue.length) {
var u = queue.shift();
adj[u].forEach(function (w) {
if (u === e[0] && w === e[1]) { return; }
if (seen[w] === undefined) { seen[w] = seen[u] + 1; queue.push(w); }
});
}
if (seen[e[1]] !== undefined) { sizes.push(seen[e[1]] + 1); }
});
return sizes.filter(function (s, i) { return sizes.indexOf(s) === i; }).sort(function (a, b) { return a - b; });
}
function skeletonText(target) {
var edges = targetEdges(target);
var rings = edges.length - target.n.length + 1;
var dbl = doubles(edges, target.o[0]);
var text;
if (rings < 1) { text = 'Nó không có nhẫn'; }
else {
var sizes = ringSizes(target);
text = 'Nó có ' + word(rings) + (rings === 1 ? ' vòng (của ' : ' vòng (của ') + joinList(sizes.map(word)) + ' nguyên tử' + (rings > 1 && sizes.length === 1 ? ' mỗi' : '') + ')';
}
return text + ' Và ' + (dbl === 0 ? 'không có liên kết đôi' : word(dbl) + (dbl === 1 ? ' liên kết đôi' : ' liên kết đôi')) + '.';
}
function hints(target, note) {
var out = [];
var first = String(note || '').match(/^[^.!?]*[.!?]/);
if (first) { out.push('Nó là gì: ' + first[0].trim()); }
var inDrawing = target.tokens && target.tokens.length ? 'Trong bản vẽ, nó được làm từ ' : 'Nó được làm từ ';
out.push(inDrawing + atomCounts(target) + (target.n.indexOf('P') >= 0 ? 'Một nhóm photphat gồm một nguyên tử phốt pho và bốn nguyên tử oxy.' : '.'));
var skeleton = skeletonText(target);
out.push(target.tokens && target.tokens.length ? 'Trong bức vẽ ' + skeleton.charAt(0).toLowerCase() + skeleton.slice(1) : skeleton);
return out;
}
MG.drawEdit = {
ELEMENTS: ELEMENTS, MAX_BONDS: MAX_BONDS, JOIN_REACH: JOIN_REACH,
create: create, tap: tap, undo: undo, clear: clear, setBrush: setBrush, setTool: setTool, setStamp: setStamp, toggleDouble: toggleDouble,
slotsOf: slotsOf, bestSlot: bestSlot, toGeometry: toGeometry, extent: extent, describe: describe, analyse: analyse, check: check, hints: hints,
isomorphic: isomorphic,
_test: { addAtom: addAtom, addBond: addBond, atomById: atomById, sumOf: sumOf, impliedH: impliedH, ringSizes: ringSizes, skeletonText: skeletonText, atomCounts: atomCounts, labelFor: labelFor, targetEdges: targetEdges }
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', 'n': 'ₙ' };
var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '−': '⁻' };
var MINUS = '−';
var WORDS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine' };
var SIZES = [
{ id: 'small', label: 'Bé nhỏ', note: 'Tối đa 8 nguyên tử', max: 8 },
{ id: 'medium', label: 'Trung bình', note: 'Tối đa 12 nguyên tử', max: 12 },
{ id: 'all', label: 'Tất cả', note: 'Tất cả hình vẽ', max: 1000 }
];
var MODES = [
{ id: 'restore', label: 'Hoàn thành bức vẽ', note: 'Một số mảnh đang bị thiếu. Hãy chọn phần phù hợp vào đó.', count: 10 },
{ id: 'draw', label: 'Hãy vẽ nó.', note: 'Xây dựng phân tử từ các nguyên tử trên trang trống.', count: 5 },
{ id: 'mixed', label: 'Hỗn hợp', note: 'Cả hai dạng, lần lượt nhau.', count: 8 }
];
var NO_RESTORE = { cytcoxm: true, cytcred: true, fes: true, etco2: true };
var NO_DRAW = { etco2: true };
var AVOID = { fgam: ['H2N1|+/2'] };
function geometry() { return MG.geometry || {}; }
function entity(id) { return MG.entities && MG.entities.molecule ? MG.entities.molecule[id] || null : null; }
function targets() { return MG.drawTargets || {}; }
function word(n) { return WORDS[n] || String(n); }
function rngFrom(seed) {
var a = (Number(seed) || 1) >>> 0;
return function () {
a = (a + 0x6D2B79F5) >>> 0;
var t = a;
t = Math.imul(t ^ (t >>> 15), t | 1);
t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
function shuffled(list, rand) {
var out = list.slice();
for (var i = out.length - 1; i > 0; i--) {
var j = Math.floor(rand() * (i + 1));
var t = out[i]; out[i] = out[j]; out[j] = t;
}
return out;
}
function scripts(text, table) {
return String(text).split('').map(function (c) { return Object.prototype.hasOwnProperty.call(table, c) ? table[c] : c; }).join('');
}
function sentencesOf(text) {
var plain = String(text || '').replace(/\b(e\.g|i\.e|vs|cf)\./gi, function (m) { return m.replace(/\./g, '@@'); }).replace(/(\d)\.(\d)/g, '$1@@$2');
var found = plain.match(/[^.!?]+[.!?]+(?=\s|$)/g) || (plain.trim() ? [plain.trim()] : []);
return found.map(function (s) { return s.trim().replace(/@@/g, '.'); }).filter(function (s) { return !!s; });
}
var variants = null;
var variantsSize = -1;
function isElement(t) { return /^[A-Z][a-z]?$/.test(t); }
function labelKey(atom) {
var label = atom && atom.label;
if (!label || !label.runs || !label.runs.length) { return atom && atom.el === 'C' ? 'C' : (atom ? atom.el : ''); }
var runs = label.runs;
if (runs.length === 1 && !runs[0].style) { return runs[0].t; }
var count = {};
var order = [];
var charge = '';
var last = null;
for (var i = 0; i < runs.length; i++) {
var r = runs[i];
if (r.style === 'sup') { charge = String(r.t).replace(/[−–]/g, '-'); continue; }
if (r.style === 'sub') {
if (last === null) { return runs.map(function (x) { return x.t; }).join(''); }
count[last] += (parseInt(r.t, 10) || 1) - 1;
continue;
}
if (!isElement(r.t)) { return runs.map(function (x) { return x.t; }).join(''); }
if (count[r.t] === undefined) { count[r.t] = 0; order.push(r.t); }
count[r.t] += 1;
last = r.t;
}
var sorted = order.slice().sort(function (a, b) {
var rank = function (e) { return e === 'C' ? 0 : (e === 'H' ? 1 : 2); };
return rank(a) - rank(b) || (a < b ? -1 : (a > b ? 1 : 0));
});
return sorted.map(function (e) { return e + count[e]; }).join('') + (charge ? '|' + charge : '');
}
function runsText(runs) {
return (runs || []).map(function (r) {
if (r.style === 'sub') { return scripts(r.t, SUB); }
if (r.style === 'sup') { return scripts(r.t, SUP); }
return r.t;
}).join('');
}
function collectVariants() {
var G = geometry();
var size = Object.keys(G).length;
if (variants && variantsSize === size) { return variants; }
variants = {};
variantsSize = size;
Object.keys(G).forEach(function (id) {
(G[id].atoms || []).forEach(function (a) {
if (!a.label || !a.label.runs) { return; }
var key = labelKey(a);
var v = variants[key] || (variants[key] = { right: null, left: null });
var mainFirst = !!a.label.runs[0].main;
if (mainFirst && !v.right) { v.right = a.label.runs; }
if (!mainFirst && !v.left) { v.left = a.label.runs; }
});
});
return variants;
}
var NAMED = {
'O': { text: 'O', name: 'oxygen' },
'O1|-': { text: 'O⁻', name: 'oxy mang điện tích âm' },
'H1O1': { text: 'OH', name: 'hydroxyl' },
'H2N1': { text: 'NH₂', name: 'amino' },
'H3N1|+': { text: 'NH₃⁺', name: 'ammonium' },
'H2N1|+': { text: 'NH₂⁺', name: 'iminium' },
'H1N1': { text: 'NH', name: 'imino' },
'O4P1|2-': { text: 'OPO₃²⁻', name: 'phosphate' },
'C1H2O4P1|2-': { text: 'CH₂OPO₃²⁻', name: 'phốt phát trên CH₂' },
'C1H3O1': { text: 'CH₂OH', name: 'hydroxymethyl' },
'H': { text: 'H', name: 'hydrogen' },
'S': { text: 'S', name: 'sulfur' }
};
function plainCaption(text) {
var back = {};
Object.keys(SUB).forEach(function (k) { back[SUB[k]] = k; });
Object.keys(SUP).forEach(function (k) { back[SUP[k]] = k === '−' ? '-' : k; });
return String(text).split('').map(function (c) { return Object.prototype.hasOwnProperty.call(back, c) ? back[c] : c; }).join('');
}
function pieceText(key, order, atom) {
var base;
if (key === 'C') { base = order === 2 ? 'CH₂' : 'CH₃'; }
else if (NAMED[key]) { base = NAMED[key].text; }
else {
var v = collectVariants()[key];
base = v && (v.right || v.left) ? runsText(v.right || v.left) : (atom && atom.label ? runsText(atom.label.runs) : key);
}
return (order === 2 ? '=' : MINUS) + base;
}
function pieceName(key, order, atom) {
var bond = order === 2 ? 'liên kết đôi với ' : 'liên kết đơn với ';
if (key === 'C') { return order === 2 ? 'liên kết đôi đến cuối mạch, một CH2' : 'liên kết đơn đến cuối mạch, một nhóm metyl'; }
var named = NAMED[key];
return bond + (named ? named.name : (atom && atom.label ? runsText(atom.label.runs) : key));
}
function pieceRuns(key, left) {
if (key === 'C') { return null; }
var v = collectVariants()[key];
if (!v) { return null; }
return left ? (v.left || v.right) : (v.right || v.left);
}
function graphOf(g) {
var atoms = g.atoms || [], bonds = g.bonds || [];
var adj = atoms.map(function () { return []; });
bonds.forEach(function (b, j) {
if (!atoms[b.a] || !atoms[b.b]) { return; }
adj[b.a].push({ to: b.b, bond: j, order: b.o });
adj[b.b].push({ to: b.a, bond: j, order: b.o });
});
return { atoms: atoms, bonds: bonds, adj: adj };
}
function isTerminal(graph, i) { return graph.adj[i].length === 1; }
function isPlainBond(b) { return !b.s && !(b.taper && b.taper.length); }
function tierOf(count) { return count <= 8 ? 'A' : (count <= 12 ? 'B' : (count <= 20 ? 'C' : 'D')); }
var PIECES = { A: 1, B: 2, C: 3, D: 2 };
var NEVER_HIDDEN = { R1: true, R2: true, R3: true };
var infoCache = {};
function elementOf(a) {
var text = a.label && a.label.runs ? a.label.runs.map(function (r) { return r.t; }).join('') : '';
if (a.el === '*' && /^(NH2|NH3|OH|SH)$/.test(text)) { return text.charAt(0); }
return a.el;
}
function candidatesOf(id) {
var g = geometry()[id];
if (!g) { return []; }
var graph = graphOf(g);
var inGroup = {};
Object.keys(g.groups || {}).forEach(function (n) { (g.groups[n].atoms || []).forEach(function (i) { inGroup[i] = true; }); });
var out = [];
graph.atoms.forEach(function (a, i) {
if (!isTerminal(graph, i) || a.el === 'H') { return; }
var e = graph.adj[i][0];
var b = graph.bonds[e.bond];
if (b.o !== 1 && b.o !== 2) { return; }
var key = labelKey(a);
if (NEVER_HIDDEN[key]) { return; }
if (a.label) {
var v = collectVariants()[key];
if (!v || !v.right) { return; }       // only a label that has a writing to the right can be offered as a choice
}
out.push({ atom: i, bond: e.bond, neighbor: e.to, order: b.o, fixedBond: !isPlainBond(b), key: key, el: elementOf(a), inGroup: !!inGroup[i] });
});
return out;
}
function targetOf(id) {
var t = targets()[id];
return t && t.ok && t.n && t.n.length >= 2 && !NO_DRAW[id] ? t : null;
}
function infoOf(id) {
var g = geometry()[id];
if (!g) { return null; }
var hit = infoCache[id];
if (hit && hit.g === g) { return hit.info; }
var count = (g.atoms || []).length;
var cands = candidatesOf(id);
var e = entity(id);
var tg = targetOf(id);
var info = {
id: id, name: e ? e.name : id, atoms: count, tier: tierOf(count), restore: count >= 2 && cands.length >= 1 && !NO_RESTORE[id],
draw: !!tg, heavy: tg ? tg.heavy : 0, candidates: cands.length
};
infoCache[id] = { g: g, info: info };
return info;
}
function molecules() {
var G = geometry();
return Object.keys(G).filter(function (id) {
var e = entity(id);
return e && !e.noStructure && G[id].atoms && G[id].atoms.length;
}).map(infoOf).filter(function (info) { return info && (info.restore || info.draw); });
}
var poolCache = null;
var poolSize = -1;
function piecePool() {
var G = geometry();
var size = Object.keys(G).length;
if (poolCache && poolSize === size) { return poolCache; }
var map = {};
molecules().filter(function (m) { return m.restore; }).forEach(function (m) {
candidatesOf(m.id).forEach(function (c) {
var id = c.key + '/' + c.order;
if (!map[id]) { map[id] = { id: id, key: c.key, order: c.order, el: c.el, freq: 0, atom: G[m.id].atoms[c.atom] }; }
map[id].freq += 1;
});
});
poolCache = Object.keys(map).map(function (k) {
var p = map[k];
p.caption = pieceText(p.key, p.order, p.atom);
return p;
});
poolSize = size;
return poolCache;
}
function family(el) { return el === '*' ? 'token' : el; }
function optionsFor(item, rand, mol) {
var answerId = item.answer.key + '/' + item.answer.order;
var pool = piecePool();
var answerEntry = null;
pool.forEach(function (p) { if (p.id === answerId) { answerEntry = p; } });
var answerCaption = answerEntry ? answerEntry.caption : pieceText(item.answer.key, item.answer.order, null);
var avoid = AVOID[mol] || [];
var starAnswer = item.el === '*';
var scored = [];
pool.forEach(function (p) {
if (p.id === answerId || avoid.indexOf(p.id) >= 0) { return; }
if (item.fixedBond && p.order !== 1) { return; }
if (starAnswer && item.answer.key !== 'R' && p.key === 'R') { return; }
if (item.answer.key === 'R' && p.el === '*') { return; }
if (plainCaption(p.caption) === plainCaption(answerCaption)) { return; }           // two buttons that read the same cannot both be offered
var score = Math.log(1 + p.freq) + rand() * 1.2;
if (p.order === item.answer.order) { score += 2; }
if (family(p.el) === family(item.el)) { score += 2.5; }
if (p.key === item.answer.key) { score += 1; }
scored.push({ p: p, score: score });
});
scored.sort(function (a, b) { return b.score - a.score; });
var picks = [];
scored.forEach(function (x) {
if (picks.length < 4 && !picks.some(function (q) { return plainCaption(q.caption) === plainCaption(x.p.caption); })) { picks.push(x.p); }
});
var need = item.answer.order === 2 ? 1 : 2;
if (!item.fixedBond && !picks.some(function (p) { return p.order === need; })) {
var alt = scored.filter(function (x) { return x.p.order === need && !picks.some(function (q) { return plainCaption(q.caption) === plainCaption(x.p.caption); }); })[0];
if (alt) { picks[picks.length - 1] = alt.p; }
}
var entries = [answerEntry || { id: answerId, key: item.answer.key, order: item.answer.order, el: item.el, caption: answerCaption }].concat(picks);
var out = entries.map(function (p) {
return {
id: p.id, key: p.key, order: p.order, caption: p.caption || pieceText(p.key, p.order, null), name: pieceName(p.key, p.order, p.atom || null),
runsRight: pieceRuns(p.key, false), runsLeft: pieceRuns(p.key, true)
};
});
return shuffled(out, rand);
}
function restoreItems(id, rand) {
var g = geometry()[id];
var cands = candidatesOf(id);
if (!g || !cands.length) { return []; }
var want = Math.min(PIECES[tierOf(g.atoms.length)], cands.length);
if (cands.every(function (c) { return c.key === cands[0].key && c.order === cands[0].order; })) { want = Math.min(want, 1); }
var ordered = cands.map(function (c) { return { c: c, k: (c.inGroup ? 0.6 : 0) + rand() }; })
.sort(function (a, b) { return b.k - a.k; }).map(function (x) { return x.c; });
var chosen = [];
function clash(c) {
return chosen.some(function (d) { return d.neighbor === c.neighbor && !(d.key === c.key && d.order === c.order); });
}
[true, false].forEach(function (distinct) {
ordered.forEach(function (c) {
if (chosen.length >= want || chosen.indexOf(c) >= 0 || clash(c)) { return; }
if (distinct && chosen.some(function (d) { return d.key === c.key && d.order === c.order; })) { return; }
chosen.push(c);
});
});
chosen.sort(function (a, b) { return a.atom - b.atom; });
return chosen.map(function (c) {
var item = { atom: c.atom, bond: c.bond, fixedBond: c.fixedBond, el: c.el, answer: { key: c.key, order: c.order }, left: false };
var n = g.atoms[c.neighbor], a = g.atoms[c.atom];
item.left = a.x < n.x - 0.3;
item.options = optionsFor(item, rand, id);
item.answerId = c.key + '/' + c.order;
item.answerText = pieceText(c.key, c.order, a);
return item;
});
}
var LEAK = {
'O': /carbonyl|keto|aldehyde|ester|amide|carboxy|oxo|anhydride|acyl/i,
'O1|-': /carboxy|oxo|anhydride/i,
'H1O1': /hydroxy|alcohol/i,
'C1H3O1': /hydroxy|alcohol/i,
'H2N1': /amino|amine|amidine|guanid/i,
'H3N1|+': /amino|amine|ammonium/i,
'H2N1|+': /amino|amine|amidine|imine|iminium|guanid/i,
'H1N1': /amino|amine|amidine|imin/i,
'O4P1|2-': /phosph/i,
'C1H2O4P1|2-': /phosph/i,
'C': /methyl/i,
'CoA': /coenzyme|\bCoA\b|acyl/i,
'R': /chain|tail|isoprenoid|acyl|fatty/i,
'P-Ribose': /ribos|ribotide/i,
'Adenine': /adenin|adenosine|adenylate/i,
'UDP': /uridine|\bUDP\b/i,
'PP': /phosph/i,
'PPP': /phosph/i,
'protein': /protein/i,
'Cys': /cystein/i
};
function leaks(sentence, items) {
return items.some(function (it) {
var re = LEAK[it.answer.key];
if (!re) {
var k = String(it.answer.key);
if (k.length < 3 || /\|/.test(k)) { return false; }
re = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}
return re.test(sentence);
});
}
function chargeCount(g) {
var pos = 0, neg = 0;
(g.atoms || []).forEach(function (a) {
((a.label && a.label.runs) || []).forEach(function (r) {
if (r.style !== 'sup') { return; }
var m = String(r.t).replace(/[−–]/g, '-').match(/^(\d*)([+-])$/);
if (!m) { return; }
var n = m[1] ? parseInt(m[1], 10) : 1;
if (m[2] === '+') { pos += n; } else { neg += n; }
});
});
return { pos: pos, neg: neg };
}
function formulaText(g) {
if (!g.formula) { return ''; }
var f = String(g.formula).replace(/(\d+)/g, function (m) { return scripts(m, SUB); });
var c = typeof g.charge === 'number' ? g.charge : 0;
var cc = chargeCount(g);
var charge;
if (cc.pos > 0 && cc.neg > 0) {
charge = 'một khoản phí ròng ' + (c > 0 ? '+' + c : (c < 0 ? MINUS + Math.abs(c) : '0')) + ' (' + word(cc.pos) + ' tích cực và ' + word(cc.neg) + ' tiêu cực)';
} else {
charge = c === 0 ? 'không tính phí' : 'một cáo buộc ' + (c > 0 ? '+' + c : MINUS + Math.abs(c));
}
return 'Công thức của nó là ' + f + ', với ' + charge + ' ở độ pH 7.';
}
function restorePrompt(id, rand) {
var g = geometry()[id];
var e = entity(id) || {};
var items = restoreItems(id, rand);
if (!items.length) { return null; }
var hints = [];
var all = sentencesOf(e.note);
var open = all.filter(function (s) { return !leaks(s, items); })[0];
hints.push(open ? 'Nó là gì: ' + open
: 'Mỗi vòng tròn gắn vào một nguyên tử đã có sẵn một số liên kết. Nguyên tử carbon có tổng cộng bốn liên kết, nitơ có ba liên kết và oxy có hai liên kết; phần còn lại là hydro.');
hints.push(formulaText(g) || ('Bản vẽ hoàn chỉnh có ' + g.atoms.length + ' nguyên tử. Một nhóm như CoA được tính là một nguyên tử. Nó được vẽ như ở pH 7.'));
hints.push('Hai lựa chọn sai sẽ bị loại bỏ ở mỗi vòng chơi.');
var pieces = items.map(function (it) { return it.answerText; });
var missing = items.length === 1 ? 'Một mảnh ghép bị thiếu.' : (word(items.length).charAt(0).toUpperCase() + word(items.length).slice(1) + ' Một số bộ phận bị thiếu.');
return {
id: 'restore.' + id, kind: 'restore', mol: id, name: e.name || id, tier: tierOf(g.atoms.length),
text: 'Hoàn thành bức vẽ ' + (e.name || id) + '.',
sub: missing + (items.length === 1 ? ' Chạm vào vòng tròn nét đứt và chọn nội dung cần đặt vào đó.' : ' Chạm vào từng vòng tròn nét đứt và chọn nội dung phù hợp với vị trí đó.'),
items: items, hints: hints, explain: all.join(' '), answerText: pieces.join(' Và ')
};
}
function drawPrompt(id) {
var g = geometry()[id];
var e = entity(id) || {};
var tg = targetOf(id);
if (!g || !tg) { return null; }
var all = sentencesOf(e.note);
var hints = MG.drawEdit ? MG.drawEdit.hints(tg, all[0] || '') : [];
return {
id: 'draw.' + id, kind: 'draw', mol: id, name: e.name || id, tier: tierOf(g.atoms.length), heavy: tg.heavy, tokens: tg.tokens.slice(),
text: 'Draw ' + (e.name || id) + '.',
sub: 'Đặt các nguyên tử lên trang giấy và nối chúng lại với nhau. Nguyên tử hydro, điện tích và cấu hình lập thể (L, D, cis, trans) không được vẽ hoặc kiểm tra.',
hints: hints, explain: all.join(' '), answerText: ''
};
}
function sizeMax(size) {
for (var i = 0; i < SIZES.length; i++) { if (SIZES[i].id === size) { return SIZES[i].max; } }
return 1000;
}
function modeOf(spec) { return MODES.some(function (m) { return m.id === (spec || {}).mode; }) ? spec.mode : 'restore'; }
function modeInfo(mode) { for (var i = 0; i < MODES.length; i++) { if (MODES[i].id === mode) { return MODES[i]; } } return MODES[0]; }
function fits(m, kind, max) { return kind === 'restore' ? m.restore && m.atoms <= max : m.draw && m.heavy <= max; }
function poolFor(spec) {
var mode = modeOf(spec);
var max = sizeMax((spec || {}).size);
return molecules().filter(function (m) { return mode === 'mixed' ? fits(m, 'restore', max) || fits(m, 'draw', max) : fits(m, mode, max); });
}
function available(spec) { return poolFor(spec).length; }
function start(spec, seed) {
var s = spec || {};
var mode = modeOf(s);
var rand = rngFrom(seed);
var want = s.count > 0 ? Math.floor(s.count) : modeInfo(mode).count;
var max = sizeMax(s.size);
var order = shuffled(poolFor(s), rand);
var prompts = [];
if (mode === 'mixed') {
var left = order.slice();
var firstThat = function (kind) {
for (var j = 0; j < left.length; j++) { if (fits(left[j], kind, max)) { return j; } }
return -1;
};
while (prompts.length < want && left.length) {
var kind = prompts.length % 2 === 0 ? 'restore' : 'draw';
var at = firstThat(kind);
if (at < 0) { kind = kind === 'restore' ? 'draw' : 'restore'; at = firstThat(kind); }
if (at < 0) { break; }
var picked = left.splice(at, 1)[0];
var q = kind === 'restore' ? restorePrompt(picked.id, rand) : drawPrompt(picked.id);
if (q) { prompts.push(q); }
}
} else {
for (var i = 0; i < order.length && prompts.length < want; i++) {
var m = order[i];
var p = mode === 'restore' ? restorePrompt(m.id, rand) : drawPrompt(m.id);
if (p) { prompts.push(p); }
}
}
return {
title: mode === 'restore' ? 'Hoàn thành bức vẽ' : (mode === 'draw' ? 'Hãy vẽ nó.' : 'Vẽ các phân tử'),
intro: mode === 'restore' ? 'Một số phần của mỗi phân tử bị thiếu. Hãy chọn phần nào thuộc về mỗi vòng tròn nét đứt. Các phân tử được vẽ như trạng thái ở pH 7.'
: (mode === 'draw' ? 'Hãy vẽ từng phân tử dựa trên trí nhớ. Các nguyên tử hydro, điện tích và cấu trúc không gian được bỏ qua, và việc kiểm tra sẽ dựa vào các nguyên tử và liên kết.'
: 'Hoàn thành một số hình vẽ và vẽ thêm những hình khác. Các phân tử được vẽ ở trạng thái pH 7.'),
prompts: prompts
};
}
function check(prompt, response) {
var r = response || {};
if (prompt.kind === 'draw') {
var tg = targetOf(prompt.mol);
if (!tg || !MG.drawEdit || !r.state) { return { ok: false, code: 'empty', message: 'Hãy vẽ một cái gì đó trước đã.', over: [] }; }
return MG.drawEdit.check(r.state, tg);
}
var placed = r.placed || [];
var marks = prompt.items.map(function (it, i) { return placed[i] ? placed[i] === it.answerId : null; });
var ok = marks.every(function (m) { return m === true; });
return { ok: ok, marks: marks };
}
function reveal(prompt) {
if (prompt.kind === 'draw') { return { mol: prompt.mol }; }
return { placed: prompt.items.map(function (it) { return it.answerId; }) };
}
function optionOf(item, id) {
for (var i = 0; i < item.options.length; i++) { if (item.options[i].id === id) { return item.options[i]; } }
return null;
}
function ghosts(prompt, placed, marks, revealed) {
return prompt.items.map(function (it, i) {
var state = 'open';
var label = null;
var order = 1;
if (revealed) { state = 'answer'; }
else if (placed && placed[i]) {
var opt = optionOf(it, placed[i]);
state = marks && marks[i] === true ? 'right' : 'placed';
if (opt) { label = it.left ? (opt.runsLeft || opt.runsRight) : opt.runsRight; order = opt.order; }
} else if (marks && marks[i] === false) { state = 'wrong'; }
return { atom: it.atom, bond: it.bond, state: state, label: label, order: order };
});
}
function score(results) {
var list = results || [];
if (!list.length) { return 0; }
var clean = list.filter(function (r) { return r === 'clean'; }).length;
return Math.round(100 * clean / list.length);
}
MG.draw = {
sizes: SIZES,
modes: MODES,
molecules: molecules,
info: infoOf,
available: available,
start: start,
check: check,
reveal: reveal,
ghosts: ghosts,
score: score,
pieceText: pieceText,
_test: {
rngFrom: rngFrom, labelKey: labelKey, candidatesOf: candidatesOf, restoreItems: restoreItems, restorePrompt: restorePrompt, drawPrompt: drawPrompt,
piecePool: piecePool, pieceRuns: pieceRuns, tierOf: tierOf, sentencesOf: sentencesOf, leaks: leaks, formulaText: formulaText, targetOf: targetOf,
optionsFor: optionsFor, NO_RESTORE: NO_RESTORE, NO_DRAW: NO_DRAW, AVOID: AVOID
}
};
})(typeof window !== 'undefined' ? window : globalThis);
