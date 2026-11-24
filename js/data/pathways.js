(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
var ROW = 290, TOP = 150;
var COL = 650, FORK = 460, SIDE = 270;
function row(k) { return TOP + ROW * k; }
var PINK = '#F5CCCD', TAN = '#F7EAD5', GREEN = '#F1F4E4', BLUE = '#E2F0F9';   // carbohydrates, oxidative metabolism, lipids, amino acids
var NOTE = '#6b5d3a';
var LEFT_RIGHT = { 'in': 'west', out: 'east' };
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: NOTE, anchor: anchor || 'start' }; }
function glycolysisPart() {
var nodes = {
glc: node('glucose', FORK, row(0)),
g6p: node('g6p', FORK, row(1)),
f6p: node('f6p', FORK, row(2)),
f16bp: node('f16bp', FORK, row(3)),
dhap: node('dhap', SIDE, row(4)),
g3p: node('g3p', COL, row(4)),
bpg13: node('bpg13', COL, row(5)),
pg3: node('pg3', COL, row(6)),
pg2: node('pg2', COL, row(7)),
pep: node('pep', COL, row(8)),
pyr: node('pyruvate', COL, row(9))
};
var reactions = [
{
id: 'hk', step: 1, enzyme: 'hexokinase', substrates: ['glc'], products: ['g6p'],
ins: ['atp'], outs: ['adp'], arrows: [{ from: 'glc', to: 'g6p' }], cof: LEFT_RIGHT,
type: 'Phosphoryl transfer', irreversible: true,
equation: 'Glucose + ATP → Glucose 6-phosphate + ADP + H⁺',
hint: 'Một nhóm phosphat được chuyển từ chất cho giàu năng lượng sang carbon cuối (carbon 6) của phân tử đường. Phân tử đường mang điện tích nên bị giữ chặt bên trong tế bào. Bước này về bản chất là không thuận nghịch.',
hl: { sub: { glc: ['o6'] }, prod: { g6p: ['p6'] } }
},
{
id: 'pgi', step: 2, enzyme: 'pgi', substrates: ['g6p'], products: ['f6p'],
ins: [], outs: [], arrows: [{ from: 'g6p', to: 'f6p' }], twoWay: true,
type: 'Sự đồng phân hóa', irreversible: false,
equation: 'Glucose 6-phosphate ⇌ Fructose 6-phosphate',
hint: 'Vòng 6 cạnh mở ra, nhóm carbonyl chuyển từ carbon 1 sang carbon 2 (aldose chuyển thành ketose), rồi phân tử đường đóng vòng lại thành vòng 5 cạnh. Phản ứng không cần đồng yếu tố và hoàn toàn thuận nghịch.',
hl: {}
},
{
id: 'pfk1', step: 3, enzyme: 'pfk1', substrates: ['f6p'], products: ['f16bp'],
ins: ['atp'], outs: ['adp'], arrows: [{ from: 'f6p', to: 'f16bp' }], cof: LEFT_RIGHT,
type: 'Phosphoryl transfer', irreversible: true,
equation: 'Fructose 6-phosphate + ATP → Fructose 1,6-bisphosphate + ADP + H⁺',
hint: 'Nhóm phosphat thứ hai được chuyển từ chất cho giàu năng lượng, lần này gắn vào carbon 1 của vòng 5 cạnh. Đây là bước quyết định (committed step) và điểm điều hòa chính của con đường, có tính không thuận nghịch.',
hl: { sub: { f6p: ['o1'] }, prod: { f16bp: ['p1'] } }
},
{
id: 'aldolase', step: 4, enzyme: 'aldolase', substrates: ['f16bp'], products: ['g3p', 'dhap'],
ins: [], outs: [],
arrows: [{ from: 'f16bp', to: 'g3p' }, { from: 'f16bp', to: 'dhap' }], twoWay: true,
type: 'Aldol cleavage', irreversible: false,
equation: 'Fructose 1,6-bisphosphate ⇌ Dihydroxyacetone phosphate + Glyceraldehyde 3-phosphate',
hint: 'Phân tử đường 6 carbon bị phân cắt giữa carbon 3 và carbon 4, tạo ra hai mảnh 3 carbon: một mảnh mang nhóm ketone và một mảnh mang nhóm aldehyde. Không có chất nào khác bị tiêu thụ hay giải phóng.',
hl: {}
},
{
id: 'tpi', step: 5, enzyme: 'tpi', substrates: ['dhap'], products: ['g3p'],
ins: [], outs: [], arrows: [{ from: 'dhap', to: 'g3p' }], twoWay: true,
type: 'Sự đồng phân hóa', irreversible: false,
equation: 'Dihydroxyacetone phosphate ⇌ Glyceraldehyde 3-phosphate',
hint: 'Triose mang nhóm ketone được chuyển thành đồng phân aldehyde của nó bằng cách dịch chuyển nhóm carbonyl, giúp cả hai nửa của phân tử đường ban đầu đều đi tiếp theo con đường. Không có đồng yếu tố tham gia.',
hl: { sub: { dhap: ['ket'] }, prod: { g3p: ['ald'] } }
},
{
id: 'gapdh', step: 6, enzyme: 'gapdh', substrates: ['g3p'], products: ['bpg13'],
ins: ['nad', 'pi'], outs: ['nadh'], arrows: [{ from: 'g3p', to: 'bpg13' }],
cof: LEFT_RIGHT, twoWay: true,
type: 'Oxidation + phosphorylation', irreversible: false,
equation: 'Glyceraldehyde 3-phosphate + NAD⁺ + Pᵢ ⇌ 1,3-Bisphosphoglycerate + NADH + H⁺',
hint: 'Nhóm aldehyde bị oxi hóa đồng thời hình thành một liên kết có năng lượng tự do thủy phân cao tại chính carbon đó, sử dụng một ion vô cơ từ dung dịch. Các electron tách ra được thu nhận bởi một chất mang electron. Đây là bước bảo toàn năng lượng đầu tiên và xảy ra hai lần cho mỗi phân tử glucose.',
hl: { sub: { g3p: ['ald'] }, prod: { bpg13: ['acylp'] } }
},
{
id: 'pgk', step: 7, enzyme: 'pgk', substrates: ['bpg13'], products: ['pg3'],
ins: ['adp'], outs: ['atp'], arrows: [{ from: 'bpg13', to: 'pg3' }],
cof: LEFT_RIGHT, twoWay: true,
type: 'Substrate-level phosphorylation', irreversible: false,
equation: '1,3-Bisphosphoglycerate + ADP ⇌ 3-Phosphoglycerate + ATP',
hint: 'Nhóm giàu năng lượng ở carbon 1 được chuyển sang một nucleotide diphosphate, tạo thành triphosphate. Đây là phản ứng phosphoryl hóa ở mức cơ chất, giúp hoàn trả khoản đầu tư năng lượng ở nửa đầu con đường.',
hl: { sub: { bpg13: ['acylp'] }, prod: { pg3: ['coo'] } }
},
{
id: 'pgm', step: 8, enzyme: 'pgm', substrates: ['pg3'], products: ['pg2'],
ins: [], outs: [], arrows: [{ from: 'pg3', to: 'pg2' }], twoWay: true,
type: 'Phosphoryl shift', irreversible: false,
equation: '3-Phosphoglycerate ⇌ 2-Phosphoglycerate',
hint: 'Một nhóm phosphat chuyển vị từ carbon 3 sang carbon 2 trên cùng phân tử. Không có gì được thêm vào hay tách ra; phân tử chỉ được sắp xếp lại.',
hl: { sub: { pg3: ['p3'] }, prod: { pg2: ['p2'] } }
},
{
id: 'enolase', step: 9, enzyme: 'enolase', substrates: ['pg2'], products: ['pep'],
ins: [], outs: ['h2o'], arrows: [{ from: 'pg2', to: 'pep' }],
cof: LEFT_RIGHT, twoWay: true,
type: 'Mất nước', irreversible: false,
equation: '2-Phosphoglycerate ⇌ Phosphoenolpyruvate + H₂O',
hint: 'Một phân tử nhỏ bị tách khỏi cơ chất, tạo ra một liên kết đôi và một enol phosphate rất giàu năng lượng. Bước này cần ion magie (Mg²⁺).',
hl: { sub: { pg2: ['oh3'] }, prod: { pep: ['cc'] } }
},
{
id: 'pk', step: 10, enzyme: 'pk', substrates: ['pep'], products: ['pyr'],
ins: ['adp'], outs: ['atp'], arrows: [{ from: 'pep', to: 'pyr' }], cof: LEFT_RIGHT,
type: 'Substrate-level phosphorylation', irreversible: true,
equation: 'Phosphoenolpyruvate + ADP + H⁺ → Pyruvate + ATP',
hint: 'Enol phosphate chuyển nhóm phosphat của nó sang một nucleotide diphosphate, còn phần enol còn lại chuyển thành ketone. Đây là bước phosphoryl hóa ở mức cơ chất thứ hai và là phản ứng không thuận nghịch.',
hl: { sub: { pep: ['enolp'] }, prod: { pyr: ['ket'] } }
}
];
return {
nodes: nodes,
reactions: reactions,
order: ['hk', 'pgi', 'pfk1', 'aldolase', 'tpi', 'gapdh', 'pgk', 'pgm', 'enolase', 'pk'],
regions: [glycolysisRegion('Đường phân', 810)],
notes: glycolysisNotes('các bước 6 đến 10')
};
}
function glycolysisRegion(label, w) {
return { type: 'rect', label: label, color: PINK, x: 20, y: 20, w: w, h: row(9) + 76 + 84 - 20 };
}
function glycolysisNotes(runs) {
return [
note('Đầu tư năng lượng', 40, row(1) + 250), note('các bước 1 đến 5', 40, row(1) + 280),
note('Lợi ích về năng lượng, các bước 6 đến 10', 40, row(5) + 130),
note('Mỗi phân tử glucose tạo ra hai phân tử triose.', 40, row(5) + 162), note('so ' + runs + ' chạy hai lần', 40, row(5) + 194)
];
}
function linkReaction() {
return {
id: 'pdc', step: 'Liên kết', enzyme: 'pdc', substrates: ['pyr'], products: ['acetylcoa'],
ins: ['coa', 'nad'], outs: ['co2', 'nadh'], avoid: ['fad', 'fadh2'], arrows: [{ from: 'pyr', to: 'acetylcoa' }],
type: 'Oxidative decarboxylation', irreversible: true,
equation: 'Pyruvat + CoA-SH + NAD⁺ → Acetyl-CoA + CO₂ + NADH',
hint: 'Acid keto mất một carbon dưới dạng khí, đơn vị 2 carbon còn lại gắn vào chất mang chứa lưu huỳnh tạo liên kết thioester, và các electron được thu nhận bởi chất mang electron. Phản ứng do một phức hợp đa enzyme với năm đồng yếu tố xúc tác và có tính không thuận nghịch.',
hl: { sub: { pyr: ['coo'] }, prod: { acetylcoa: ['thioester'] } }
};
}
function tcaPart(cx, cy, acetylPos) {
var R = 480, d = R * Math.SQRT1_2;
function p(dx, dy) { return [Math.round(cx + dx), Math.round(cy + dy)]; }
var pos = {
citrate: p(0, -R), isocitrate: p(d, -d), akg: p(R, 0), succoa: p(d, d),
succinate: p(0, R), fumarate: p(-d, d), malate: p(-R, 0), oaa: p(-d, -d)
};
var nodes = {};
var molOf = { citrate: 'citrate', isocitrate: 'isocitrate', akg: 'akg', succoa: 'succoa', succinate: 'succinate', fumarate: 'fumarate', malate: 'malate', oaa: 'oaa' };
Object.keys(pos).forEach(function (id) { nodes[id] = node(molOf[id], pos[id][0], pos[id][1]); });
if (acetylPos) { nodes.acetylcoa = node('acetylcoa', acetylPos[0], acetylPos[1]); }
var reactions = [
{
id: 'cs', step: 1, enzyme: 'cs', substrates: ['acetylcoa', 'oaa'], products: ['citrate'],
ins: ['h2o'], outs: ['coa'], avoid: ['glyoxylate'],
arrows: [{ from: 'oaa', to: 'citrate' }, { from: 'acetylcoa', to: 'citrate' }],
cof: { 'in': 'R', out: 'R' },
type: 'Sự ngưng tụ', irreversible: true,
equation: 'Acetyl-CoA + Oxaloacetate + H₂O → Citrate + CoA-SH + H⁺',
hint: 'Đơn vị acetyl 2 carbon được nối vào carbon carbonyl của một acid 4 carbon; sự thủy phân liên kết thioester giải phóng chất mang và kéo phản ứng tiến mạnh về phía trước. Sản phẩm có 6 carbon và 3 nhóm carboxyl.',
hl: { sub: { acetylcoa: ['methyl'], oaa: ['ket'] }, prod: { citrate: ['oh'] } }
},
{
id: 'aconitase', step: 2, enzyme: 'aconitase', substrates: ['citrate'], products: ['isocitrate'],
ins: [], outs: [], arrows: [{ from: 'citrate', to: 'isocitrate' }], twoWay: true,
type: 'Isomerization (dehydration, then rehydration)', irreversible: false,
equation: 'Citrat ⇌ cis-Aconitat + H₂O ⇌ Isocitrat',
hint: 'Nhóm hydroxyl dịch chuyển từ carbon bậc ba sang carbon kế cận thông qua một chất trung gian chưa bão hòa, biến một rượu không thể bị oxi hóa thành rượu có thể bị oxi hóa. Không có đồng yếu tố nào bị biến đổi.',
hl: { sub: { citrate: ['oh'] }, prod: { isocitrate: ['oh'] } }
},
{
id: 'idh', step: 3, enzyme: 'idh', substrates: ['isocitrate'], products: ['akg'],
ins: ['nad'], outs: ['co2', 'nadh'], avoid: ['nadp', 'nadph'], arrows: [{ from: 'isocitrate', to: 'akg' }],
type: 'Oxidative decarboxylation', irreversible: true,
equation: 'Isocitrate + NAD⁺ → α-Ketoglutarate + CO₂ + NADH',
hint: 'Một rượu bậc hai bị oxi hóa thành ketone và ngay trên cùng enzyme đó, một nhóm carboxyl bị tách ra dưới dạng khí. Các electron được thu nhận bởi chất mang electron. Đây là phản ứng khử carboxyl oxi hóa đầu tiên của chu trình và là một điểm điều hòa then chốt.',
hl: { sub: { isocitrate: ['oh'] }, prod: { akg: ['ket'] } }
},
{
id: 'kgdh', step: 4, enzyme: 'kgdh', substrates: ['akg'], products: ['succoa'],
ins: ['coa', 'nad'], outs: ['co2', 'nadh'], avoid: ['fad', 'fadh2'], arrows: [{ from: 'akg', to: 'succoa' }],
type: 'Oxidative decarboxylation', irreversible: true,
equation: 'α-Ketoglutarate + CoA-SH + NAD⁺ → Succinyl-CoA + CO₂ + NADH',
hint: 'Một acid keto 5 carbon bị khử carboxyl oxi hóa: một carbon thoát ra dưới dạng khí, một liên kết thioester được tạo với chất mang chứa lưu huỳnh, và các electron được thu nhận bởi chất mang electron. Enzyme là một phức hợp đa enzyme có cấu trúc tương tự enzyme ở phản ứng nối.',
hl: { sub: { akg: ['cooa'] }, prod: { succoa: ['thioester'] } }
},
{
id: 'scs', step: 5, enzyme: 'scs', substrates: ['succoa'], products: ['succinate'],
ins: ['gdp', 'pi'], outs: ['gtp', 'coa'], arrows: [{ from: 'succoa', to: 'succinate' }], twoWay: true,
type: 'Substrate-level phosphorylation', irreversible: false,
equation: 'Succinyl-CoA + GDP + Pᵢ ⇌ Succinate + GTP + CoA-SH',
hint: 'Năng lượng của liên kết thioester được dùng để nối một ion vô cơ vào nucleotide diphosphate, tạo thành nucleotide triphosphate đồng thời giải phóng chất mang. Đây là bước phosphoryl hóa ở mức cơ chất duy nhất trong chu trình.',
hl: { sub: { succoa: ['thioester'] }, prod: { succinate: ['coo'] } }
},
{
id: 'sdh', step: 6, enzyme: 'sdh', substrates: ['succinate'], products: ['fumarate'],
ins: ['fad'], outs: ['fadh2'], arrows: [{ from: 'succinate', to: 'fumarate' }],
type: 'Oxidation (FAD)', irreversible: false,
equation: 'Succinate + FAD ⇌ Fumarate + FADH₂',
hint: 'Hai nguyên tử hydro bị tách khỏi liên kết đơn carbon-carbon bão hòa, tạo ra một liên kết đôi trans. Các electron đi tới một đồng yếu tố flavin gắn cộng hóa trị với enzyme nằm trên màng trong ty thể.',
hl: { sub: { succinate: ['ch2ch2'] }, prod: { fumarate: ['cc'] } }
},
{
id: 'fumarase', step: 7, enzyme: 'fumarase', substrates: ['fumarate'], products: ['malate'],
ins: ['h2o'], outs: [], arrows: [{ from: 'fumarate', to: 'malate' }], twoWay: true,
type: 'Cấp nước', irreversible: false,
equation: 'Fumarat + H₂O ⇌ L-Malat',
hint: 'Một phân tử nhỏ cộng vào liên kết đôi carbon-carbon, gắn nhóm hydroxyl lên một carbon với cấu hình không gian (L) chính xác. Không có sự thay đổi trạng thái oxi hóa.',
hl: { sub: { fumarate: ['cc'] }, prod: { malate: ['choh'] } }
},
{
id: 'mdh', step: 8, enzyme: 'mdh', substrates: ['malate'], products: ['oaa'],
ins: ['nad'], outs: ['nadh'], arrows: [{ from: 'malate', to: 'oaa' }], twoWay: true,
type: 'Oxidation (NAD⁺)', irreversible: false,
equation: 'L-Malate + NAD⁺ ⇌ Oxaloacetate + NADH + H⁺',
hint: 'Một rượu bậc hai bị oxi hóa thành ketone và các electron được thu nhận bởi chất mang electron. Sản phẩm là chất nhận 4 carbon dùng để khởi đầu vòng chu trình tiếp theo.',
hl: { sub: { malate: ['choh'] }, prod: { oaa: ['ket'] } }
}
];
return {
nodes: nodes,
reactions: reactions,
order: ['cs', 'aconitase', 'idh', 'kgdh', 'scs', 'sdh', 'fumarase', 'mdh'],
regions: [
{ type: 'circle', label: 'Chu trình axit citric', color: TAN, cx: cx, cy: cy, r: R + 150 }
],
notes: []
};
}
function ldhReaction() {
return {
id: 'ldh', step: 11, enzyme: 'ldh', substrates: ['pyr'], products: ['lac'],
ins: ['nadh'], outs: ['nad'], arrows: [{ from: 'pyr', to: 'lac' }], twoWay: true,
type: 'Reduction (NADH)', irreversible: false,
equation: 'Pyruvat + NADH + H⁺ ⇌ L-Lactate + NAD⁺',
hint: 'Nhóm ketone bị khử thành rượu nhờ các electron từ chất mang electron. Chất mang đó trở lại dạng oxi hóa, giúp bước oxi hóa ở đoạn trước của con đường tiếp tục hoạt động khi không có oxy.',
hl: { sub: { pyr: ['ket'] }, prod: { lac: ['choh'] } }
};
}
function etcPart() {
var nodes = {
nadh: node('etcnadh', 150, 665),
qh2: node('ubiquinol', 530, 395),
cytc: node('cytcred', 910, 145),
h2o: node('etcwater', 1290, 665),
fadh2: node('etcfadh2', 530, 665),
adp: node('etcadp', 910, 925),
atp: node('etcatp', 1290, 925)
};
var reactions = [
{
id: 'c1', step: 1, enzyme: 'complex1', substrates: ['nadh'], products: ['qh2'],
ins: ['q'], outs: ['nad', 'hplus'], arrows: [{ from: 'nadh', to: 'qh2' }],
avoid: ['nadh', 'hplus', 'etcnad'],
type: 'Electron transfer and proton pumping', irreversible: false,
equation: 'NADH + H⁺ + Q + 4 H⁺(ma trận) → NAD⁺ + QH₂ + 4 H⁺(khoang giữa màng)',
hint: 'Các electron từ chất mang nucleotide dạng khử đi qua một flavin và chuỗi cụm sắt-lưu huỳnh tới một chất mang tan trong lipid khuếch tán trong màng. Năng lượng giải phóng được dùng để vận chuyển các ion qua màng trong.',
hl: { sub: { nadh: ['h4'] }, prod: { qh2: ['hq'] } }
},
{
id: 'c2', step: 2, tile: 'Tổ hợp II', enzyme: 'sdh', substrates: ['fadh2'], products: ['qh2'],
ins: ['q'], outs: ['fad'], arrows: [{ from: 'fadh2', to: 'qh2' }],
cof: { 'in': 'east', out: 'east' },
avoid: ['fadh2', 'etcfad'],
type: 'Electron transfer (no proton pumping)', irreversible: false,
equation: 'FADH₂ + Q → FAD + QH₂',
hint: 'Các electron từ một flavin gắn cộng hóa trị được chuyển sang cùng chất mang tan trong lipid đó, nhưng phức hợp này không vận chuyển bất kỳ ion nào qua màng.',
hl: { sub: { fadh2: ['nh'] }, prod: { qh2: ['hq'] } }
},
{
id: 'c3', step: 3, enzyme: 'complex3', substrates: ['qh2'], products: ['cytc'],
ins: ['cytcox'], outs: ['q', 'hplus'], arrows: [{ from: 'qh2', to: 'cytc' }],
avoid: ['hplus', 'ubiquinone'],
type: 'Electron transfer and proton pumping (quinone cycle)', irreversible: false,
equation: 'QH₂ + 2 cyt c (Fe³⁺) + 2 H⁺(ma trận) → Q + 2 cyt c (Fe²⁺) + 4 H⁺(khoảng gian màng)',
hint: 'Chất mang tan trong lipid dạng khử truyền từng electron một cho một protein heme nhỏ di động trong khoang gian màng (chu trình quinone), đồng thời các ion được bơm qua màng. Antimycin A ức chế bước này.',
hl: { sub: { qh2: ['hq'] }, prod: { cytc: ['fe'] } }
},
{
id: 'c4', step: 4, enzyme: 'complex4', substrates: ['cytc'], products: ['h2o'],
ins: ['o2'], outs: ['cytcox', 'hplus'], arrows: [{ from: 'cytc', to: 'h2o' }],
avoid: ['hplus', 'h2o', 'cytcoxm'],
type: 'Electron transfer to O₂ and proton pumping', irreversible: true,
equation: '4 cyt c (Fe²⁺) + O₂ + 8 H⁺(ma trận) → 4 cyt c (Fe³⁺) + 2 H₂O + 4 H⁺(khoảng gian màng)',
hint: 'Protein heme nhỏ được tái oxi hóa khi bốn electron được chuyển qua các trung tâm đồng và heme tới chất nhận electron cuối cùng của hô hấp hiếu khí, làm chất này bị khử hoàn toàn. Các ion được bơm qua màng. Cyanide và carbon monoxide ức chế bước này.',
hl: { sub: { cytc: ['fe'] } }
},
{
id: 'c5', step: 5, tile: 'Phức hợp V', enzyme: 'atpsynthase', substrates: ['adp'], products: ['atp'],
ins: ['pi', 'hplus'], outs: ['h2o'], arrows: [{ from: 'adp', to: 'atp' }],
avoid: ['adp', 'atp', 'hplus', 'etcwater'],
type: 'ATP synthesis (chemiosmosis)', irreversible: false,
equation: 'ADP + Pᵢ + H⁺ + 4 H⁺ (khoảng gian màng) → ATP + H₂O + 4 H⁺ (chất nền)',
hint: 'Các ion chảy ngược qua màng xuyên qua một động cơ quay, và chuyển động quay dẫn động đầu xúc tác nối nucleotide diphosphate với một ion vô cơ để tạo nucleotide triphosphate.',
hl: { sub: { adp: ['tail'] }, prod: { atp: ['tail'] } }
}
];
return {
nodes: nodes,
reactions: reactions,
order: ['c1', 'c2', 'c3', 'c4', 'c5'],
regions: [
{ type: 'rect', label: 'Khoảng gian màng', color: BLUE, x: 20, y: 20, w: 1520, h: 250 },
{ type: 'rect', label: 'màng trong ty thể', color: '#EDCB93', x: 20, y: 270, w: 1520, h: 250 },
{ type: 'rect', label: 'Ma trận', color: TAN, x: 20, y: 520, w: 1520, h: 540 },
{ type: 'rect', label: 'tổng hợp ATP', color: '#EFD9B3', x: 790, y: 810, w: 640, h: 230 }
],
notes: []
};
}
function etcSimplePart() {
var nodes = {
cytc: node('cytcred', 1070, 145),
qh2: node('ubiquinol', 610, 395),
nadh: node('etcnadh', 150, 665), fadh2: node('etcfadh2', 610, 665), h2o: node('etcwater', 1530, 665),
adp: node('etcadp', 1070, 925), atp: node('etcatp', 1530, 925)
};
var reactions = [
{
id: 'se1', step: 1, enzyme: 'complex1', substrates: ['nadh'], products: ['qh2'],
ins: [], outs: ['nad'], arrows: [{ from: 'nadh', to: 'qh2' }],
avoid: ['nadh', 'hplus', 'etcnad'],
type: 'Electron transfer and proton pumping', irreversible: false,
equation: 'NADH + H⁺ + Q → NAD⁺ + QH₂',
hint: 'Một chất mang chứa đầy electron truyền chúng cho protein lớn đầu tiên trên màng. Protein này chuyển tiếp chúng sang một chất mang nhỏ di động trong màng và dùng năng lượng để đẩy bốn proton ra khỏi chất nền ty thể.',
hl: { sub: { nadh: ['h4'] }, prod: { qh2: ['hq'] } }
},
{
id: 'se2', step: 2, tile: 'Tổ hợp II', enzyme: 'sdh', substrates: ['fadh2'], products: ['qh2'],
ins: [], outs: ['fad'], arrows: [{ from: 'fadh2', to: 'qh2' }],
cof: { 'in': 'west', out: 'east' },
avoid: ['fadh2', 'etcfad'],
type: 'Electron transfer (no proton pumping)', irreversible: false,
equation: 'FADH₂ + Q → FAD + QH₂',
hint: 'Một lối vào thứ hai: các electron từ một chất mang khác nhập vào cùng chất mang di động trong màng và bỏ qua protein lớn đầu tiên. Protein này đồng thời là một enzyme của chu trình TCA và hoàn toàn không bơm proton.',
hl: { sub: { fadh2: ['nh'] }, prod: { qh2: ['hq'] } }
},
{
id: 'se3', step: 3, enzyme: 'complex3', substrates: ['qh2'], products: ['cytc'],
ins: ['cytcox'], outs: ['q'], arrows: [{ from: 'qh2', to: 'cytc' }],
avoid: ['hplus', 'ubiquinone'],
type: 'Electron transfer and proton pumping', irreversible: false,
equation: 'QH₂ + 2 cyt c (oxy hóa) → Q + 2 cyt c (khử)',
hint: 'Chất mang di động trong màng truyền từng electron một cho một protein heme nhỏ nằm ở mặt ngoài của màng. Phức hợp protein này đẩy thêm bốn proton ra ngoài khi hoạt động.',
hl: { sub: { qh2: ['hq'] }, prod: { cytc: ['fe'] } }
},
{
id: 'se4', step: 4, enzyme: 'complex4', substrates: ['cytc'], products: ['h2o'],
ins: ['o2'], outs: ['cytcox'], arrows: [{ from: 'cytc', to: 'h2o' }],
avoid: ['hplus', 'h2o', 'cytcoxm'],
type: 'Electron transfer to O₂ and proton pumping', irreversible: true,
equation: '2 cytochrome c (dạng khử) + ½ O₂ + 2 H⁺ → 2 cytochrome c (dạng oxy hóa) + H₂O',
hint: 'Protein cuối cùng của chuỗi truyền các electron cùng với các proton từ chất nền ty thể tới chất nhận cuối cùng của sự sống hiếu khí, làm nó bị khử hoàn toàn. Các chất độc như cyanide làm ngừng chuỗi ở bước này.',
hl: { sub: { cytc: ['fe'] } }
},
{
id: 'se5', step: 5, tile: 'Phức hợp V', enzyme: 'atpsynthase', substrates: ['adp'], products: ['atp'],
ins: ['pi'], outs: [], arrows: [{ from: 'adp', to: 'atp' }],
avoid: ['adp', 'atp', 'hplus', 'etcwater', 'h2o'],
type: 'ATP synthesis (chemiosmosis)', irreversible: false,
equation: 'ADP + Pᵢ + H⁺ → ATP + H₂O',
hint: 'Các proton chảy ngược vào chất nền ty thể qua một động cơ protein quay. Chuyển động quay dẫn động đầu xúc tác nối nucleotide diphosphate và ion vô cơ thành triphosphate — đây là nơi gradient nồng độ phát huy tác dụng.',
hl: { sub: { adp: ['tail'] }, prod: { atp: ['tail'] } }
}
];
return {
nodes: nodes, reactions: reactions, order: ['se1', 'se2', 'se3', 'se4', 'se5'],
regions: [
{ type: 'rect', label: 'Khoảng gian màng', color: BLUE, x: 20, y: 20, w: 1640, h: 250 },
{ type: 'rect', label: 'màng trong ty thể', color: '#EDCB93', x: 20, y: 270, w: 1640, h: 250 },
{ type: 'rect', label: 'Ma trận', color: TAN, x: 20, y: 520, w: 1640, h: 540 },
{ type: 'rect', label: 'tổng hợp ATP', color: '#EFD9B3', x: 830, y: 810, w: 820, h: 230 }
],
notes: [
note('4 H⁺ được bơm', 400, 625, 'middle', 18), note('không bơm H⁺', 690, 600, 'start', 18),
note('4 H⁺ được bơm', 860, 345, 'middle', 18), note('2 H⁺ được bơm', 1300, 490, 'middle', 18),
note('Khoảng 3 H⁺ chảy ngược trở lại cho mỗi ATP.', 1300, 1030, 'middle', 18)
]
};
}
function glycogenPart() {
var nodes = {
g6p: node('g6p', 150, 150),
g1p: node('g1p', 530, 150),
udpg: node('udpg', 910, 150),
glycogen: node('glycogen', 910, 470)
};
var reactions = [
{
id: 'pgmut', step: 1, enzyme: 'pglucomutase', substrates: ['g6p'], products: ['g1p'],
ins: [], outs: [], arrows: [{ from: 'g6p', to: 'g1p' }], twoWay: true,
type: 'Phosphoryl shift', irreversible: false,
equation: 'Glucose 6-phosphate ⇌ Glucose 1-phosphate',
hint: 'Một nhóm phosphoryl dịch chuyển từ carbon 6 sang carbon 1 trên cùng phân tử đường thông qua một chất trung gian bisphosphate. Không có chất nào được thêm hay bớt và phản ứng hoàn toàn thuận nghịch.',
hl: {}
},
{
id: 'ugp', step: 2, enzyme: 'ugpase', substrates: ['g1p'], products: ['udpg'],
ins: ['utp'], outs: ['ppi'], arrows: [{ from: 'g1p', to: 'udpg' }], twoWay: true,
avoid: ['ump'],
type: 'Nucleotidyl transfer (activation)', irreversible: false,
equation: 'Glucose 1-phosphate + UTP ⇌ UDP-glucose + PPᵢ',
hint: 'Đường phosphate tấn công một nucleotide triphosphate, nhận lấy đơn vị nucleoside monophosphate của nó và giải phóng hai nhóm phosphoryl còn lại cùng nhau. Phân tử đường nay đã được hoạt hóa cho tổng hợp polymer. Sự phân cắt cặp phosphat được giải phóng giúp kéo phản ứng tiến về phía trước.',
hl: { prod: { udpg: ['udp'] } }
},
{
id: 'gsyn', step: 3, enzyme: 'glycogensynthase', substrates: ['udpg'], products: ['glycogen'],
ins: [], outs: ['udp'], arrows: [{ from: 'udpg', to: 'glycogen' }],
cof: { 'in': 'east', out: 'east' },
type: 'Glycosyl transfer', irreversible: true,
equation: 'UDP-glucose + Glycogen(n) → UDP + Glycogen(n+1) + H⁺',
hint: 'Phân tử đường đã hoạt hóa được chuyển lên đầu không khử của chuỗi polymer dự trữ đang dài ra, tạo liên kết alpha-1,4 glycosidic và giải phóng nucleoside diphosphate. Đây là bước điều hòa chủ chốt của quá trình dự trữ.',
hl: { sub: { udpg: ['udp'] }, prod: { glycogen: ['glyc'] } }
},
{
id: 'gphos', step: 4, enzyme: 'glycogenphosphorylase', substrates: ['glycogen'], products: ['g1p'],
ins: ['pi'], outs: [], arrows: [{ from: 'glycogen', to: 'g1p' }],
type: 'Sự phân giải photphoric', irreversible: false,
equation: 'Glycogen(n) + Pᵢ → Glycogen(n-1) + Glucose 1-phosphate',
hint: 'Chuỗi polymer bị phân cắt từ đầu không khử nhờ sự tấn công của một ion vô cơ thay vì nước, nên phân tử đường giải phóng ra đã mang sẵn nhóm phosphoryl mà không tốn ATP.',
hl: {}
}
];
return {
nodes: nodes, reactions: reactions, order: ['pgmut', 'ugp', 'gsyn', 'gphos'],
regions: [{ type: 'rect', label: 'chuyển hóa glycogen', color: PINK, x: 20, y: 20, w: 1160, h: 600 }],
notes: []
};
}
function gluconeogenesisPart() {
var nodes = {
pyr: node('pyruvate', SIDE, row(9)), oaa: node('oaa', SIDE, row(8)), pep: node('pep', COL, row(8)), pg2: node('pg2', COL, row(7)),
pg3: node('pg3', COL, row(6)), bpg13: node('bpg13', COL, row(5)), g3p: node('g3p', COL, row(4)), dhap: node('dhap', SIDE, row(4)),
f16bp: node('f16bp', FORK, row(3)), f6p: node('f6p', FORK, row(2)), g6p: node('g6p', FORK, row(1)), glc: node('glucose', FORK, row(0))
};
var reactions = [
{
id: 'pc', step: 1, enzyme: 'pc', substrates: ['pyr'], products: ['oaa'],
ins: ['atp'], outs: ['adp', 'pi'], arrows: [{ from: 'pyr', to: 'oaa' }],
avoid: ['co2', 'hco3'],
type: 'Carboxylation (bypass of pyruvate kinase)', irreversible: true,
equation: 'Pyruvat + HCO₃⁻ + ATP → Oxaloaxetat + ADP + Pᵢ + H⁺',
hint: 'Một đơn vị 1 carbon từ bicarbonate được gắn vào acid keto 3 carbon tạo nhóm carboxyl mới nhờ năng lượng của nucleotide triphosphate, sinh ra một acid 4 carbon. Enzyme cần biotin, hoạt động trong ty thể và là bước vòng tránh (bypass) đầu tiên của con đường đảo ngược.',
hl: {}
},
{
id: 'pepck', step: 2, enzyme: 'pepck', substrates: ['oaa'], products: ['pep'],
ins: ['gtp'], outs: ['gdp', 'co2'], arrows: [{ from: 'oaa', to: 'pep' }],
type: 'Decarboxylation and phosphorylation (bypass of pyruvate kinase)', irreversible: false,
equation: 'Oxaloacetate + GTP → Phosphoenolpyruvate + CO₂ + GDP',
hint: 'Acid 4 carbon mất một nhóm carboxyl dưới dạng khí đồng thời một nucleotide triphosphate cho một nhóm phosphoryl, tạo thành enol phosphate giàu năng lượng. Cùng với bước trước, phản ứng này hoàn tất việc vòng tránh bước cuối của đường phân.',
hl: {}
},
{
id: 'enolr', step: 3, enzyme: 'enolase', substrates: ['pep'], products: ['pg2'],
ins: ['h2o'], outs: [], arrows: [{ from: 'pep', to: 'pg2' }], cof: LEFT_RIGHT, twoWay: true,
type: 'Hydration (reverse of glycolysis)', irreversible: false,
equation: 'Phosphoenolpyruvate + H₂O ⇌ 2-Phosphoglycerate',
hint: 'Một phân tử nhỏ cộng vào liên kết đôi của enol phosphate. Chính enzyme hoạt động trong đường phân xúc tác bước này theo chiều ngược lại.',
hl: {}
},
{
id: 'pgmr', step: 4, enzyme: 'pgm', substrates: ['pg2'], products: ['pg3'],
ins: [], outs: [], arrows: [{ from: 'pg2', to: 'pg3' }], twoWay: true,
type: 'Phosphoryl shift (reverse of glycolysis)', irreversible: false,
equation: '2-Phosphoglycerate ⇌ 3-Phosphoglycerate',
hint: 'Một nhóm phosphat chuyển vị từ carbon 2 sang carbon 3 trên cùng phân tử. Không có gì được thêm vào hay tách ra. Đây là cùng enzyme như trong đường phân nhưng chạy theo chiều ngược lại.',
hl: {}
},
{
id: 'pgkr', step: 5, enzyme: 'pgk', substrates: ['pg3'], products: ['bpg13'],
ins: ['atp'], outs: ['adp'], arrows: [{ from: 'pg3', to: 'bpg13' }],
cof: LEFT_RIGHT, twoWay: true,
type: 'Phosphoryl transfer (reverse of glycolysis)', irreversible: false,
equation: '3-Phosphoglycerate + ATP ⇌ 1,3-Bisphosphoglycerate + ADP',
hint: 'Một nhóm phosphoryl được chuyển từ nucleotide triphosphate lên nhóm carboxyl, tạo thành acyl phosphate giàu năng lượng. Đây là liên kết giàu năng lượng thứ ba bị tiêu tốn cho mỗi đơn vị 3 carbon, sau hai liên kết đã dùng để vòng tránh pyruvate kinase.',
hl: {}
},
{
id: 'gapdhr', step: 6, enzyme: 'gapdh', substrates: ['bpg13'], products: ['g3p'],
ins: ['nadh'], outs: ['nad', 'pi'], arrows: [{ from: 'bpg13', to: 'g3p' }],
cof: LEFT_RIGHT, twoWay: true,
type: 'Reduction (reverse of glycolysis)', irreversible: false,
equation: '1,3-Bisphosphoglycerate + NADH + H⁺ ⇌ Glyceraldehyde 3-phosphate + NAD⁺ + Pᵢ',
hint: 'Nhóm acyl giàu năng lượng bị khử thành aldehyde nhờ các electron từ chất mang electron, đồng thời giải phóng một ion vô cơ. Chính enzyme của đường phân xúc tác bước này theo chiều ngược lại.',
hl: {}
},
{
id: 'tpir', step: 7, enzyme: 'tpi', substrates: ['g3p'], products: ['dhap'],
ins: [], outs: [], arrows: [{ from: 'g3p', to: 'dhap' }],
cof: { 'in': 'up', out: 'down' }, twoWay: true,
type: 'Isomerization (reverse of glycolysis)', irreversible: false,
equation: 'Glyceraldehyde 3-phosphate ⇌ Dihydroxyacetone phosphate',
hint: 'Triose mang nhóm aldehyde được chuyển thành đồng phân ketone của nó bằng cách dịch chuyển nhóm carbonyl, để hai mảnh 3 carbon có thể nối với nhau. Không có đồng yếu tố tham gia.',
hl: {}
},
{
id: 'aldolr', step: 8, enzyme: 'aldolase', substrates: ['dhap', 'g3p'], products: ['f16bp'],
ins: [], outs: [], arrows: [{ from: 'dhap', to: 'f16bp' }, { from: 'g3p', to: 'f16bp' }], twoWay: true,
type: 'Aldol condensation (reverse of glycolysis)', irreversible: false,
equation: 'Dihydroxyacetone phosphate + Glyceraldehyde 3-phosphate ⇌ Fructose 1,6-bisphosphate',
hint: 'Hai mảnh 3 carbon, một mảnh mang nhóm ketone và một mảnh mang nhóm aldehyde, được nối với nhau giữa carbon 3 và carbon 4 để tạo đường bisphosphate 6 carbon. Không có chất nào khác bị tiêu thụ hay giải phóng.',
hl: {}
},
{
id: 'fbpase', step: 9, enzyme: 'fbpase', substrates: ['f16bp'], products: ['f6p'],
ins: ['h2o'], outs: ['pi'], arrows: [{ from: 'f16bp', to: 'f6p' }], cof: LEFT_RIGHT,
type: 'Hydrolysis (bypass of phosphofructokinase)', irreversible: true,
equation: 'Fructose 1,6-bisphosphate + H₂O → Fructose 6-phosphate + Pᵢ',
hint: 'Nhóm phosphoryl ở carbon 1 bị loại bỏ bằng thủy phân và giải phóng dưới dạng ion vô cơ, tạo thành dạng monophosphate. Bước này vòng tránh điểm điều hòa chính của đường phân và là bước điều hòa chủ chốt của con đường đảo ngược.',
hl: {}
},
{
id: 'pgir', step: 10, enzyme: 'pgi', substrates: ['f6p'], products: ['g6p'],
ins: [], outs: [], arrows: [{ from: 'f6p', to: 'g6p' }], twoWay: true,
type: 'Isomerization (reverse of glycolysis)', irreversible: false,
equation: 'Fructose 6-phosphate ⇌ Glucose 6-phosphate',
hint: 'Vòng 5 cạnh của ketose mở ra, nhóm carbonyl chuyển từ carbon 2 sang carbon 1, rồi phân tử đường đóng lại thành vòng 6 cạnh. Không cần đồng yếu tố.',
hl: {}
},
{
id: 'g6pase', step: 11, enzyme: 'g6pase', substrates: ['g6p'], products: ['glc'],
ins: ['h2o'], outs: ['pi'], arrows: [{ from: 'g6p', to: 'glc' }], cof: LEFT_RIGHT,
type: 'Hydrolysis (bypass of hexokinase)', irreversible: true,
equation: 'Glucose 6-phosphate + H₂O → Glucose + Pᵢ',
hint: 'Nhóm phosphoryl ở carbon 6 bị loại bỏ bằng thủy phân và giải phóng dưới dạng ion vô cơ, trả lại phân tử đường tự do có thể rời khỏi tế bào. Bước này vòng tránh bước đầu của đường phân và xảy ra chủ yếu ở gan và thận.',
hl: {}
}
];
return {
nodes: nodes, reactions: reactions,
order: ['pc', 'pepck', 'enolr', 'pgmr', 'pgkr', 'gapdhr', 'tpir', 'aldolr', 'fbpase', 'pgir', 'g6pase'],
regions: [{ type: 'rect', label: 'Quá trình tân tạo glucose', color: PINK, x: 20, y: 20, w: 810, h: row(9) + 76 + 84 - 20 }],
notes: [
note('Vượt qua cơ chế hoạt động của hexokinase,', 40, row(0) + 200), note('bước 11', 40, row(0) + 230),
note('Đường vòng của', 40, row(2) + 150), note('phosphofructokinase-1,', 40, row(2) + 180), note('bước 9', 40, row(2) + 210),
note('Sự đảo ngược của quá trình đường phân,', 40, row(6) + 100), note('các bước 3 đến 8', 40, row(6) + 130),
note('Vượt qua hoạt động của pyruvate kinase,', 40, row(8) - 140), note('bước 1 và 2', 40, row(8) - 110)
]
};
}
function ethanolReactions() {
return [
{
id: 'pdecarb', step: 11, enzyme: 'pyrdecarb', substrates: ['pyr'], products: ['acet'],
ins: [], outs: ['co2'], arrows: [{ from: 'pyr', to: 'acet' }],
type: 'Khử cacbon', irreversible: true,
equation: 'Pyruvat + H⁺ → Acetaldehyde + CO₂',
hint: 'Acid keto 3 carbon mất nhóm carboxyl dưới dạng khí, để lại một aldehyde 2 carbon. Enzyme cần thiamine pyrophosphate và có ở nấm men cùng một số vi khuẩn, không có ở động vật.',
hl: {}
},
{
id: 'adh', step: 12, enzyme: 'adh', substrates: ['acet'], products: ['etoh'],
ins: ['nadh'], outs: ['nad'], arrows: [{ from: 'acet', to: 'etoh' }], twoWay: true,
type: 'Reduction (NADH)', irreversible: false,
equation: 'Acetaldehyde + NADH + H⁺ ⇌ Ethanol + NAD⁺',
hint: 'Aldehyde bị khử thành rượu nhờ các electron từ chất mang electron; chất mang này trở lại dạng oxi hóa để đường phân có thể tiếp tục chạy khi không có oxy.',
hl: {}
}
];
}
function betaoxPart() {
var nodes = {
tag: node('tag', 150, row(0)), fa: node('fattyacid', 530, row(0)), glycerol: node('glycerol', 150, row(1)),
acoa: node('acylcoa', 530, row(1)), enoyl: node('enoylcoa', 530, row(2)), hydroxy: node('hydroxyacylcoa', 530, row(3)),
keto: node('ketoacylcoa', 530, row(4)), acetyl: node('acetylcoa', 910, row(4))
};
var reactions = [
{
id: 'lipase', step: 1, enzyme: 'lipase', substrates: ['tag'], products: ['fa', 'glycerol'],
ins: ['h2o'], outs: [], arrows: [{ from: 'tag', to: 'fa' }, { from: 'tag', to: 'glycerol' }],
type: 'Thủy phân', irreversible: false,
equation: 'Triacylglycerol + 3 H₂O → Glycerol + 3 Axit béo + 3 H⁺',
hint: 'Các liên kết ester giữ ba chuỗi acyl trên khung rượu 3 carbon bị cắt bằng phản ứng thủy phân, giải phóng các chuỗi tự do dưới dạng acid và khung rượu. Ở tế bào mỡ, bước này được bật lên bởi các hormone như epinephrine và glucagon.',
hl: { sub: { tag: ['ester'] } }
},
{
id: 'acs', step: 2, enzyme: 'acs', substrates: ['fa'], products: ['acoa'],
ins: ['coa', 'atp'], outs: ['amp', 'ppi'], arrows: [{ from: 'fa', to: 'acoa' }], cof: LEFT_RIGHT,
type: 'Activation (thioester formation)', irreversible: true,
equation: 'Axit béo + CoA-SH + ATP → Axit béo acyl-CoA + AMP + PPᵢ',
hint: 'Acid tự do được hoạt hóa: nó được nối với chất mang chứa lưu huỳnh qua liên kết thioester, dùng một nucleotide triphosphate bị cắt thành monophosphate và giải phóng cùng lúc hai nhóm phosphoryl. Quá trình này tiêu tốn hai liên kết giàu năng lượng, sau đó chuỗi đã hoạt hóa được vận chuyển vào ty thể.',
hl: {}
},
{
id: 'acadh', step: 3, enzyme: 'acadh', substrates: ['acoa'], products: ['enoyl'],
ins: ['fad'], outs: ['fadh2'], arrows: [{ from: 'acoa', to: 'enoyl' }], cof: LEFT_RIGHT,
type: 'Oxidation (FAD)', irreversible: false,
equation: 'Acyl-CoA béo + FAD → trans-Δ²-Enoyl-CoA + FADH₂',
hint: 'Hai nguyên tử hydro bị tách khỏi các carbon kế cận liên kết thioester, tạo ra một liên kết đôi trans. Các electron đi tới một đồng yếu tố flavin gắn trên enzyme.',
hl: {}
},
{
id: 'enoylh', step: 4, enzyme: 'enoylh', substrates: ['enoyl'], products: ['hydroxy'],
ins: ['h2o'], outs: [], arrows: [{ from: 'enoyl', to: 'hydroxy' }],
cof: LEFT_RIGHT,
type: 'Cấp nước', irreversible: false,
equation: 'trans-Δ²-Enoyl-CoA + H₂O ⇌ L-β-Hydroxyacyl-CoA',
hint: 'Một phân tử nhỏ cộng vào liên kết đôi trans, gắn nhóm hydroxyl vào carbon beta với cấu hình không gian L. Không có sự thay đổi trạng thái oxi hóa.',
hl: {}
},
{
id: 'hadh', step: 5, enzyme: 'hadh', substrates: ['hydroxy'], products: ['keto'],
ins: ['nad'], outs: ['nadh'], arrows: [{ from: 'hydroxy', to: 'keto' }],
cof: LEFT_RIGHT,
type: 'Oxidation (NAD⁺)', irreversible: false,
equation: 'L-β-Hydroxyacyl-CoA + NAD⁺ ⇌ β-Ketoacyl-CoA + NADH + H⁺',
hint: 'Nhóm beta-hydroxyl bị oxi hóa thành ketone và các electron được thu nhận bởi một chất mang electron.',
hl: {}
},
{
id: 'thiolase', step: 6, enzyme: 'thiolase', substrates: ['keto'], products: ['acetyl', 'acoa'],
ins: ['coa'], outs: [],
arrows: [{ from: 'keto', to: 'acetyl' }, { from: 'keto', to: 'acoa', via: [{ x: 290, y: row(4) }, { x: 290, y: row(1) }] }],
type: 'Thiolysis', irreversible: false,
equation: 'β-Ketoacyl-CoA + CoA-SH ⇌ Acetyl-CoA + Fatty acyl-CoA (ngắn hơn hai nguyên tử carbon)',
hint: 'Một chất mang chứa lưu huỳnh thứ hai tấn công vào carbon beta-keto và cắt chuỗi giữa carbon alpha và beta. Một đơn vị 2 carbon rời đi làm phân tử đầu vào của chu trình TCA, còn chuỗi ngắn đi 2 carbon quay lại đầu vòng xoắn.',
hl: {}
}
];
return {
nodes: nodes, reactions: reactions, order: ['lipase', 'acs', 'acadh', 'enoylh', 'hadh', 'thiolase'],
regions: [{ type: 'rect', label: 'Quá trình oxy hóa axit béo', color: GREEN, x: 20, y: 20, w: 1010, h: row(4) + 76 + 84 - 20 }],
notes: [
note('Ngắn hơn 2 nguyên tử carbon,', 270, row(2) + 150, 'end', 18), note('quay lại bước 3', 270, row(2) + 176, 'end', 18),
note('Chu trình xoắn ốc lặp lại cho đến khi hết dây chuyền.', 40, row(4) + 130, 'start', 18)
]
};
}
function boxSimplePart() {
var nodes = {
fa: node('fattyacid', 1000, 150), acoa: node('acylcoa', 1000, 520), enoyl: node('enoylcoa', 1380, 900),
hydroxy: node('hydroxyacylcoa', 1000, 1280), keto: node('ketoacylcoa', 620, 900), acetyl: node('acetylcoa', 180, 900)
};
var reactions = [
{
id: 'sb1', step: 1, enzyme: 'acs', substrates: ['fa'], products: ['acoa'],
ins: ['coa', 'atp'], outs: ['amp', 'ppi'], arrows: [{ from: 'fa', to: 'acoa' }], cof: LEFT_RIGHT,
type: 'Activation (thioester formation)', irreversible: true,
equation: 'Axit béo + CoA-SH + ATP → Axit béo acyl-CoA + AMP + PPᵢ',
hint: 'Một chuỗi dài tự do có đầu acid chưa thể đi vào chu trình ngay. Trước tiên nó được gắn với một chất mang chứa lưu huỳnh có nguồn gốc từ vitamin nhóm B, và năng lượng cho việc gắn kết lấy từ một nucleotide bị cắt tận gốc, tốn tương đương hai liên kết giàu năng lượng.',
hl: {}
},
{
id: 'sb2', step: 2, enzyme: 'acadh', substrates: ['acoa'], products: ['enoyl'],
ins: ['fad'], outs: ['fadh2'], arrows: [{ from: 'acoa', to: 'enoyl' }],
type: 'Oxidation (FAD)', irreversible: false,
equation: 'Acyl-CoA béo + FAD → trans-Δ²-Enoyl-CoA + FADH₂',
hint: 'Chu trình bắt đầu bằng một phản ứng oxi hóa: hai hydro bị tách khỏi carbon thứ hai và thứ ba của chuỗi, để lại một liên kết đôi trans. Các electron được thu nhận bởi chất mang flavin rồi chuyển tiếp tới chuỗi truyền electron.',
hl: {}
},
{
id: 'sb3', step: 3, enzyme: 'enoylh', substrates: ['enoyl'], products: ['hydroxy'],
ins: ['h2o'], outs: [], arrows: [{ from: 'enoyl', to: 'hydroxy' }],
type: 'Cấp nước', irreversible: false,
equation: 'trans-Δ²-Enoyl-CoA + H₂O ⇌ L-β-Hydroxyacyl-CoA',
hint: 'Một phân tử nhỏ từ môi trường cộng vào liên kết đôi mới tạo và gắn nhóm hydroxyl vào carbon thứ ba. Không có sự oxi hóa hay khử nào trong bước này.',
hl: {}
},
{
id: 'sb4', step: 4, enzyme: 'hadh', substrates: ['hydroxy'], products: ['keto'],
ins: ['nad'], outs: ['nadh'], arrows: [{ from: 'hydroxy', to: 'keto' }],
type: 'Oxidation (NAD⁺)', irreversible: false,
equation: 'L-β-Hydroxyacyl-CoA + NAD⁺ ⇌ β-Ketoacyl-CoA + NADH + H⁺',
hint: 'Nhóm hydroxyl ở carbon thứ ba bị oxi hóa thành ketone, và lần này các electron được thu nhận bởi một chất mang di động tự do có thể vận chuyển chúng tới chuỗi truyền electron.',
hl: {}
},
{
id: 'sb5', step: 5, enzyme: 'thiolase', substrates: ['keto'], products: ['acetyl', 'acoa'],
ins: ['coa'], outs: [], arrows: [{ from: 'keto', to: 'acetyl' }, { from: 'keto', to: 'acoa' }], cof: { 'in': 'up', out: 'down' },
type: 'Cleavage (thiolysis)', irreversible: false,
equation: 'β-Ketoacyl-CoA + CoA-SH ⇌ Acetyl-CoA + Fatty acyl-CoA (ngắn hơn hai nguyên tử carbon)',
hint: 'Một chất mang chứa lưu huỳnh khác tấn công vào carbon ketone và cắt đứt chuỗi giữa carbon thứ hai và thứ ba. Hai carbon rời đi làm nhiên liệu cho chu trình TCA, còn phần chuỗi ngắn đi 2 carbon quay lại đầu chu trình.',
hl: {}
}
];
return {
nodes: nodes, reactions: reactions, order: ['sb1', 'sb2', 'sb3', 'sb4', 'sb5'],
regions: [{ type: 'rect', label: 'Quá trình oxy hóa axit béo', color: GREEN, x: 20, y: 20, w: 1480, h: 1410 }],
notes: [
note('Ngắn hơn 2 nguyên tử carbon,', 700, 676, 'end', 18), note('quay lại bước 2', 700, 702, 'end', 18),
note('Lặp lại cho đến khi hết dây chuyền.', 1000, 900, 'middle', 20)
]
};
}
function etcPathPart() {
var nodes = {
nadh: node('etcnadh', 150, 150), fmn: node('fmn', 530, 150), fes: node('fes', 910, 150), qh2: node('ubiquinol', 1290, 150),
cytb: node('cytb', 1290, 470), cytc1: node('cytc1', 910, 470), cytc: node('cytcred', 530, 470), cyta: node('cyta', 150, 470),
cyta3: node('cyta3', 150, 790), h2o: node('etcwater', 530, 790)
};
var reactions = [
{
id: 'ep1', step: 1, enzyme: 'complex1', substrates: ['nadh'], products: ['fmn'],
ins: [], outs: ['nad'], arrows: [{ from: 'nadh', to: 'fmn' }], avoid: ['hplus'],
type: 'Electron transfer (2 e⁻ and 2 H⁺)', irreversible: false,
equation: 'NADH + FMN + H⁺ → NAD⁺ + FMNH₂',
hint: 'Chất mang nucleotide dạng khử nhường hai electron và một proton (tức một ion hydride) cho một flavin nằm bên trong phức hợp màng đầu tiên, còn nucleotide rời đi ở dạng oxi hóa.',
hl: { sub: { nadh: ['h4'] }, prod: { fmn: ['nh'] } }
},
{
id: 'ep2', step: 2, enzyme: 'complex1', substrates: ['fmn'], products: ['fes'],
ins: [], outs: [], arrows: [{ from: 'fmn', to: 'fes' }],
type: 'Electron transfer (1 e⁻ at a time)', irreversible: false,
equation: 'FMNH₂ + 2 Fe-S (oxy hóa) → FMN + 2 Fe-S (khử) + 2 H⁺',
hint: 'Flavin chuyển hai electron của nó, từng electron một, sang các cụm kim loại được giữ trong protein bởi các gốc cysteine, nên từ đây các electron di chuyển đơn lẻ.',
hl: { prod: { fes: ['fe'] } }
},
{
id: 'ep3', step: 3, enzyme: 'complex1', substrates: ['fes'], products: ['qh2'],
ins: ['q'], outs: [], arrows: [{ from: 'fes', to: 'qh2' }], avoid: ['hplus'],
type: 'Electron transfer (2 e⁻ and 2 H⁺)', irreversible: false,
equation: '2 Fe-S (khử) + Q + 2 H⁺ (ma trận) → 2 Fe-S (oxy hóa) + QH₂',
hint: 'Các trung tâm kim loại mang từng electron đơn lẻ truyền chúng cho một chất mang tan trong lipid không bao giờ rời khỏi màng, và chất mang này nhận hai hydro từ chất nền ty thể khi bị khử. Phức hợp cũng bơm bốn ion qua màng nhờ năng lượng giải phóng. Rotenone chặn chuỗi tại đây bằng cách phong bế vị trí gắn của chất mang.',
hl: { sub: { fes: ['fe'] }, prod: { qh2: ['hq'] } }
},
{
id: 'ep4', step: 4, enzyme: 'complex3', substrates: ['qh2'], products: ['cytb'],
ins: [], outs: ['q', 'hplus'], arrows: [{ from: 'qh2', to: 'cytb' }],
type: 'Electron transfer (heme iron Fe³⁺ to Fe²⁺)', irreversible: false,
equation: 'QH₂ + 2 cyt b (Fe³⁺) → Q + 2 cyt b (Fe²⁺) + 2 H⁺(khoảng không gian giữa màng)',
hint: 'Chất mang màng dạng khử truyền các electron của nó cho một protein heme thuộc phức hợp bơm tiếp theo và được giải phóng ở dạng oxi hóa, trong khi các điện tích dương nó mang xuất hiện ở phía khoang gian màng. Antimycin A gắn vào phức hợp ngay cạnh protein heme này và làm ngừng hoạt động của nó.',
hl: { sub: { qh2: ['hq'] } }
},
{
id: 'ep5', step: 5, enzyme: 'complex3', substrates: ['cytb'], products: ['cytc1'],
ins: [], outs: [], arrows: [{ from: 'cytb', to: 'cytc1' }],
type: 'Electron transfer (heme to heme)', irreversible: false,
equation: '2 cyt b (Fe²⁺) + 2 cyt c₁ (Fe³⁺) → 2 cyt b (Fe³⁺) + 2 cyt c₁ (Fe²⁺)',
hint: 'Electron tiếp tục di chuyển bên trong cùng phức hợp tới một protein heme thứ hai, protein heme cuối cùng của phức hợp nằm hướng ra khoang gian màng.'
},
{
id: 'ep6', step: 6, enzyme: 'complex3', substrates: ['cytc1'], products: ['cytc'],
ins: ['cytcox'], outs: [], arrows: [{ from: 'cytc1', to: 'cytc' }],
type: 'Electron transfer (heme to heme)', irreversible: false,
equation: '2 cyt c₁ (Fe²⁺) + 2 cyt c (Fe³⁺) → 2 cyt c₁ (Fe³⁺) + 2 cyt c (Fe²⁺)',
hint: 'Heme cuối cùng của phức hợp truyền electron của nó cho một protein heme nhỏ tan trong nước, chất này sau đó mang từng electron một qua khoang gian màng tới phức hợp tiếp theo. Tính chung cả phức hợp vận chuyển bốn ion qua màng cho mỗi phân tử ubiquinol bị oxi hóa.',
hl: { prod: { cytc: ['fe'] } }
},
{
id: 'ep7', step: 7, enzyme: 'complex4', substrates: ['cytc'], products: ['cyta'],
ins: [], outs: ['cytcox'], arrows: [{ from: 'cytc', to: 'cyta' }],
type: 'Electron transfer (copper and heme)', irreversible: false,
equation: '2 cyt c (Fe²⁺) + 2 cyt a (Fe³⁺) → 2 cyt c (Fe³⁺) + 2 cyt a (Fe²⁺)',
hint: 'Protein heme di động giao electron của nó cho phức hợp bơm cuối cùng của chuỗi, nơi electron đi tới một cặp nguyên tử đồng trước rồi tới một heme của phức hợp đó, còn chất mang được giải phóng ở dạng oxi hóa.',
hl: { sub: { cytc: ['fe'] } }
},
{
id: 'ep8', step: 8, enzyme: 'complex4', substrates: ['cyta'], products: ['cyta3'],
ins: [], outs: [], arrows: [{ from: 'cyta', to: 'cyta3' }],
type: 'Electron transfer (heme to heme)', irreversible: false,
equation: '2 cyt a (Fe²⁺) + 2 cyt a₃ (Fe³⁺) → 2 cyt a (Fe³⁺) + 2 cyt a₃ (Fe²⁺)',
hint: 'Electron di chuyển bên trong phức hợp tới một heme thứ hai ghép cặp với một nguyên tử đồng; cả hai cùng tạo thành vị trí nơi chất nhận electron cuối cùng sẽ gắn vào.'
},
{
id: 'ep9', step: 9, enzyme: 'complex4', substrates: ['cyta3'], products: ['h2o'],
ins: ['o2', 'hplus'], outs: [], arrows: [{ from: 'cyta3', to: 'h2o' }],
type: 'Reduction of O₂ (4 e⁻)', irreversible: true,
equation: '4 cyt a₃ (Fe²⁺) + O₂ + 4 H⁺(ma trận) → 4 cyt a₃ (Fe³⁺) + 2 H₂O',
hint: 'Bốn electron lần lượt đi tới và được trao cho chất nhận electron cuối cùng — một chất khí bị tách ra và kết hợp với các điện tích dương từ chất nền ty thể để tạo sản phẩm cuối của chuỗi. Phức hợp cũng bơm thêm bốn ion qua màng. Cyanide và carbon monoxide chặn chuỗi tại đây.'
}
];
return {
nodes: nodes, reactions: reactions, order: ['ep1', 'ep2', 'ep3', 'ep4', 'ep5', 'ep6', 'ep7', 'ep8', 'ep9'],
regions: [
{ type: 'rect', label: 'Bơm proton 1', color: '#E5DAFB', x: 400, y: 20, w: 600, h: 280 },
{ type: 'rect', label: 'Bơm proton 2', color: '#DDEBFB', x: 780, y: 340, w: 640, h: 260 },
{ type: 'rect', label: 'Bơm proton 3', color: '#FBE3F0', x: 20, y: 340, w: 420, h: 560 }
],
notes: [
{ text: 'Mỗi thẻ đều hiển thị tên hãng vận chuyển sau đó.', x: 640, y: 690, size: 18, color: '#6b5d3a', anchor: 'start' },
{ text: 'nó đã lấy đi các electron', x: 640, y: 716, size: 18, color: '#6b5d3a', anchor: 'start' }
]
};
}
function glycerolShuttlePart() {
var nodes = {
dhap: node('dhap', 150, 150), g3p: node('glycerol3p', 530, 150), dhap2: node('dhap', 910, 150)
};
var reactions = [
{
id: 'gp1', step: 1, enzyme: 'glycerol3pdh', substrates: ['dhap'], products: ['g3p'],
ins: ['nadh'], outs: ['nad'], arrows: [{ from: 'dhap', to: 'g3p' }], avoid: ['hplus'],
type: 'Reduction (NADH)', irreversible: false,
equation: 'Dihydroxyacetone phosphate + NADH + H⁺ → Glycerol 3-phosphate + NAD⁺',
hint: 'Trong bào tương, nhóm ketone của một phân tử phosphate 3 carbon bị khử thành rượu nhờ các electron từ chất mang tạo ra trong đường phân, giúp chất mang trở lại dạng oxi hóa còn các electron nằm trên phân tử có thể đi tới ty thể.',
hl: { sub: { dhap: ['ket'] } }
},
{
id: 'gp2', step: 2, enzyme: 'gpd2', substrates: ['g3p'], products: ['dhap2'],
ins: ['fad'], outs: ['fadh2'], arrows: [{ from: 'g3p', to: 'dhap2' }],
type: 'Oxidation (FAD)', irreversible: false,
equation: 'Glycerol 3-phosphate + FAD → Dihydroxyacetone phosphate + FADH₂',
hint: 'Ở mặt ngoài của màng trong ty thể, một enzyme có đồng yếu tố gắn chặt tách hai hydro khỏi phân tử rượu để tái tạo nhóm ketone và chuyển thẳng các electron sang chất mang tan trong lipid của chuỗi; nhờ vậy chúng đi vào chuỗi ở cùng mức năng lượng với electron từ succinate và bỏ qua phức hợp I.'
}
];
return {
nodes: nodes, reactions: reactions, order: ['gp1', 'gp2'],
regions: [
{ type: 'rect', label: 'Con thoi glycerol phosphate', color: TAN, x: 20, y: 20, w: 1100, h: 280 }
],
membranes: [{ x1: 710, y1: 27, x2: 710, y2: 293 }],
notes: [
note('Tế bào chất', 40, 285, 'start', 16), note('màng trong, mặt ngoài', 730, 285, 'start', 16),
note('Nếu bỏ qua phức hợp I, mỗi phân tử NADH trong tế bào chất sẽ tạo ra khoảng 1,5 ATP, chứ không phải 2,5.', 150, 400)
]
};
}
function malateAspartateShuttlePart() {
var nodes = {
oaa: node('oaa', 150, 150), malc: node('malate', 530, 150), oaa2: node('oaa', 910, 150), aspc: node('aspartate', 1290, 150),
malm: node('malate', 530, 470), oaam: node('oaa', 910, 470), aspm: node('aspartate', 1290, 470)
};
var reactions = [
{
id: 'ma1', step: 1, enzyme: 'mdh1', substrates: ['oaa'], products: ['malc'],
ins: ['nadh'], outs: ['nad'], arrows: [{ from: 'oaa', to: 'malc' }], avoid: ['hplus'],
type: 'Reduction (NADH)', irreversible: false,
equation: 'Oxaloaxetat + NADH + H⁺ → Malate + NAD⁺',
hint: 'Nhóm ketone của một acid 4 carbon trong bào tương bị khử thành rượu nhờ các electron từ chất mang tạo ra trong đường phân, đưa các electron lên một phân tử mà màng trong ty thể có thể vận chuyển.',
hl: { sub: { oaa: ['ket'] }, prod: { malc: ['choh'] } }
},
{
id: 'ma2', step: 2, enzyme: 'mkat', substrates: ['malc'], products: ['malm'],
ins: [], outs: [], avoid: ['akg'], arrows: [{ from: 'malc', to: 'malm' }],
type: 'Antiport (exchange)', irreversible: false,
equation: 'Malate (bào tương) + α-Ketoglutarate (chất nền) → Malate (chất nền) + α-Ketoglutarate (bào tương)',
hint: 'Một chất mang trên màng trong vận chuyển dicarboxylate vào chất nền ty thể và đổi lại đưa một acid keto 5 carbon ra bào tương. Không có sự oxi hóa hay khử nào trong bước này.'
},
{
id: 'ma3', step: 3, enzyme: 'mdh', substrates: ['malm'], products: ['oaam'],
ins: ['nad'], outs: ['nadh'], arrows: [{ from: 'malm', to: 'oaam' }], avoid: ['hplus'],
type: 'Oxidation (NAD⁺)', irreversible: false,
equation: 'Malate + NAD⁺ → Oxaloacetate + NADH + H⁺',
hint: 'Bên trong chất nền ty thể, phân tử rượu bị oxi hóa ngược lại thành ketone bởi chất mang dạng oxi hóa — đây là cách các electron từ chất mang bào tương cuối cùng nhập vào bể chất mang dạng khử cung cấp cho phức hợp I.',
hl: { sub: { malm: ['choh'] }, prod: { oaam: ['ket'] } }
},
{
id: 'ma4', step: 4, enzyme: 'ast', substrates: ['oaam'], products: ['aspm'],
ins: ['glutc'], outs: ['akgc'], arrows: [{ from: 'oaam', to: 'aspm' }],
type: 'Chuyển hóa amin', irreversible: false,
equation: 'Oxaloacetate + Glutamate → Aspartate + α-Ketoglutarate',
hint: 'Một nhóm amin được chuyển từ một amino acid sang nhóm ketone của một acid 4 carbon với sự hỗ trợ của vitamin B6, tạo thành một amino acid khác và một acid keto 5 carbon. Không có sự oxi hóa hay khử ròng.'
},
{
id: 'ma5', step: 5, enzyme: 'gaa', substrates: ['aspm'], products: ['aspc'],
ins: [], outs: [], avoid: ['glutamate'], arrows: [{ from: 'aspm', to: 'aspc' }],
type: 'Antiport (exchange)', irreversible: true,
equation: 'Aspartate (chất nền) + Glutamate (bào tương) + H⁺ (bào tương) → Aspartate (bào tương) + Glutamate (chất nền) + H⁺ (chất nền)',
hint: 'Một chất mang thứ hai trên màng trong xuất amino acid tạo ra trong chất nền ty thể ra bào tương và nhập amino acid kia vào. Điện thế màng thúc đẩy sự trao đổi này, đó là lý do chu trình chạy theo một chiều trong tế bào.'
},
{
id: 'ma6', step: 6, enzyme: 'ast', substrates: ['aspc'], products: ['oaa2'],
ins: ['akgc'], outs: ['glutc'], arrows: [{ from: 'aspc', to: 'oaa2' }],
type: 'Chuyển hóa amin', irreversible: false,
equation: 'Aspartate + α-Ketoglutarate → Oxaloacetate + Glutamate',
hint: 'Trong bào tương, cùng loại enzyme đó đảo ngược quá trình chuyển nhóm amin, tái tạo acid keto 4 carbon khởi đầu chu trình và amino acid quay trở lại chất nền ty thể.'
}
];
return {
nodes: nodes, reactions: reactions, order: ['ma1', 'ma2', 'ma3', 'ma4', 'ma5', 'ma6'],
regions: [
{ type: 'rect', label: 'Con thoi malate-aspartate', color: TAN, x: 20, y: 20, w: 1440, h: 600 }
],
membranes: [{ x1: 27, y1: 310, x2: 1453, y2: 310 }],
notes: [note('Tế bào chất và không gian giữa màng', 40, 290, 'start', 16), note('Chất nền ty thể', 40, 600, 'start', 16)]
};
}
function atpExportPart() {
var nodes = {
adp: node('etcadp', 150, 150), atp: node('etcatp', 530, 150), atpc: node('etcatp', 910, 150)
};
var reactions = [
{
id: 'x1', step: 1, enzyme: 'atpsynthase', substrates: ['adp'], products: ['atp'],
ins: ['pi', 'hplus'], outs: ['h2o'], arrows: [{ from: 'adp', to: 'atp' }],
type: 'ATP synthesis (binding change)', irreversible: false,
equation: 'ADP + Pᵢ + H⁺ → ATP + H₂O',
hint: 'Ba vị trí xúc tác ở đầu enzyme luân phiên qua ba cấu hình khi trục trung tâm quay nhờ dòng ion: một cấu hình gắn lỏng lẻo cơ chất, một cấu hình giữ chặt chúng khi sản phẩm hình thành, và một cấu hình giải phóng sản phẩm.',
hl: { sub: { adp: ['tail'] }, prod: { atp: ['tail'] } }
},
{
id: 'x2', step: 2, enzyme: 'ant', substrates: ['atp'], products: ['atpc'],
ins: ['adp'], outs: [], arrows: [{ from: 'atp', to: 'atpc' }], avoid: ['atp', 'amp'],
type: 'Antiport (exchange)', irreversible: false,
equation: 'ADP³⁻ (bào tương) + ATP⁴⁻ (chất nền) → ADP³⁻ (chất nền) + ATP⁴⁻ (bào tương)',
hint: 'Một chất mang trên màng trong xuất đồng tiền năng lượng ra ngoài và nhập một nucleotide khác vào theo tỉ lệ 1:1 ngược chiều nhau. Vì đồng tiền năng lượng mang nhiều hơn một điện tích âm, điện thế màng dương thuận lợi cho việc xuất nó ra ngoài, tiêu tốn khoảng một phần tư năng lượng của chuỗi.'
}
];
return {
nodes: nodes, reactions: reactions, order: ['x1', 'x2'],
regions: [
{ type: 'rect', label: 'Tổng hợp và xuất khẩu ATP', color: TAN, x: 20, y: 20, w: 1100, h: 280 }
],
membranes: [{ x1: 710, y1: 27, x2: 710, y2: 293 }],
notes: [note('Chất nền ty thể', 40, 285, 'start', 16), note('Tế bào chất', 730, 285, 'start', 16)]
};
}
function ureaCyclePart() {
var nodes = {
nh4: node('ammonium', 150, 150), cp: node('carbamoylp', 530, 150),
citm: node('citrulline', 530, 470), ornm: node('ornithine', 530, 790),
citc: node('citrulline', 1290, 470), ornc: node('ornithine', 1290, 790),
asp: node('aspartate', 1670, 150), asa: node('argsucc', 1670, 470), fum: node('fumarate', 2050, 470),
arg: node('arginine', 1670, 790), urea: node('urea', 2050, 790)
};
var reactions = [
{
id: 'cps1', step: 1, enzyme: 'cps1', substrates: ['nh4'], products: ['cp'],
ins: ['hco3', 'atp'], outs: ['adp', 'pi'], arrows: [{ from: 'nh4', to: 'cp' }],
type: 'Carboxylation and phosphorylation (committed step)', irreversible: true,
equation: 'NH₄⁺ + HCO₃⁻ + 2 ATP → Carbamoyl phosphate + 2 ADP + Pᵢ + 2 H⁺',
hint: 'Một nguyên tử carbon từ bể carbon vô cơ của tế bào được hoạt hóa bởi một nucleotide triphosphate, chất cho nitơ tấn công vào đó, và một nucleotide triphosphate thứ hai phosphoryl hóa sản phẩm tạo thành. Phản ứng xảy ra trong chất nền ty thể và cần một chất hoạt hóa dị lập thể nhỏ gắn vào.',
hl: { prod: { cp: ['carb'] } }
},
{
id: 'otc', step: 2, enzyme: 'otc', substrates: ['cp', 'ornm'], products: ['citm'],
ins: [], outs: ['pi'], arrows: [{ from: 'ornm', to: 'citm' }, { from: 'cp', to: 'citm' }],
type: 'Carbamoyl transfer', irreversible: true,
equation: 'Carbamoyl phosphate + Ornithine → Citrulline + Pᵢ',
hint: 'Một nhóm carbamoyl được chuyển từ chất mang đã hoạt hóa sang nhóm amin mạch bên của một amino acid kiềm 5 carbon, tạo thành nhóm ureido và giải phóng một oxyanion vô cơ nhỏ.',
hl: { sub: { cp: ['carb'], ornm: ['dn'] }, prod: { citm: ['ureido'] } }
},
{
id: 'ornt1', step: 3, enzyme: 'ornt1', substrates: ['citm', 'ornc'], products: ['citc', 'ornm'],
ins: [], outs: [], arrows: [{ from: 'citm', to: 'citc' }, { from: 'ornc', to: 'ornm' }],
terms: { enz: 'protein' }, pillAt: 0.3,
type: 'Antiport (exchange)', irreversible: false,
equation: 'Citrulline (chất nền) + Ornithine (bào tương) ⇌ Citrulline (bào tương) + Ornithine (chất nền)',
hint: 'Một chất vận chuyển trên màng trong ty thể trao đổi hai amino acid theo tỉ lệ 1:1: chất được tạo trong chất nền ty thể đi ra bào tương, còn chất tạo trong bào tương đi vào chất nền. Không tiêu tốn năng lượng.',
hl: {}
},
{
id: 'ass', step: 4, enzyme: 'ass', substrates: ['citc', 'asp'], products: ['asa'],
ins: ['atp'], outs: ['amp', 'ppi'], arrows: [{ from: 'citc', to: 'asa' }, { from: 'asp', to: 'asa' }],
type: 'Condensation (activated by ATP)', irreversible: true,
equation: 'Citrulline + Aspartate + ATP → Argininosuccinate + AMP + PPᵢ',
hint: 'Một nucleotide triphosphate hoạt hóa oxy carbonyl của nhóm ureido và bản thân bị cắt thành hai sản phẩm nhỏ hơn. Sau đó một nhóm amin từ một amino acid có tính acid thay thế oxy đó, bổ sung nguyên tử nitơ thứ hai. Enzyme pyrophosphatase phân cắt sản phẩm giải phóng thứ hai để kéo phản ứng tiến về phía trước.',
hl: { sub: { citc: ['ureido'], asp: ['amino'] }, prod: { asa: ['succ'] } }
},
{
id: 'asl', step: 5, enzyme: 'asl', substrates: ['asa'], products: ['arg', 'fum'],
ins: [], outs: [], arrows: [{ from: 'asa', to: 'arg' }, { from: 'asa', to: 'fum' }],
type: 'Elimination (lyase)', irreversible: false,
equation: 'Argininosuccinate ⇌ Arginine + Fumarate',
hint: 'Một acid dicarboxylic 4 carbon có liên kết đôi C=C bị cắt khỏi amino acid được thêm vào ở bước bào tương trước đó; nó cũng là một chất trung gian của chu trình TCA. Phần mang nitơ ở lại tạo thành nhóm guanidino của sản phẩm.',
hl: { sub: { asa: ['succ'] }, prod: { arg: ['guan'], fum: ['cc'] } }
},
{
id: 'arg1', step: 6, enzyme: 'arg1', substrates: ['arg'], products: ['ornc', 'urea'],
ins: ['h2o'], outs: [], arrows: [{ from: 'arg', to: 'ornc' }, { from: 'arg', to: 'urea' }],
type: 'Thủy phân', irreversible: true,
equation: 'Arginine + H₂O → Ornithine + Urea',
hint: 'Phản ứng thủy phân cắt tách nhóm guanidino bằng cách cộng các thành phần của một phân tử nhỏ vào liên kết của nó. Nhóm giải phóng đi ra dưới dạng một sản phẩm nhỏ, trung hòa, chứa nitơ để bài tiết, còn phần còn lại của amino acid quay về đầu chu trình.',
hl: { sub: { arg: ['guan'] }, prod: { urea: ['urea'] } }
}
];
return {
nodes: nodes, reactions: reactions, order: ['cps1', 'otc', 'ornt1', 'ass', 'asl', 'arg1'],
regions: [
{ type: 'rect', label: 'Chu trình urê', color: BLUE, x: 20, y: 20, w: 2210, h: 920 }
],
membranes: [{ x1: 790, y1: 27, x2: 790, y2: 933 }],
notes: [
note('Chất nền ty thể', 40, 915, 'start', 18), note('Tế bào chất', 850, 915, 'start', 18),
{ text: 'màng trong ty thể', x: 790, y: 980, size: 20, color: '#6b5d3a', anchor: 'middle' },
{ text: 'được kích hoạt bởi N-acetylglutamate', x: 340, y: 268, size: 18, color: '#6b5d3a', anchor: 'middle' },
{ text: 'từ oxaloacetate bằng phản ứng chuyển amin', x: 1850, y: 156, size: 18, color: '#6b5d3a', anchor: 'start' },
{ text: 'tham gia chu trình TCA', x: 2050, y: 590, size: 18, color: '#6b5d3a', anchor: 'middle' }
]
};
}
function glutamateAlaninePart() {
var nodes = {
akg1: node('akg', 150, 150), glu1: node('glutamate', 530, 150), gln1: node('glutamine', 910, 150), nh41: node('ammonium', 150, 440),
gln2: node('glutamine', 1290, 150), glu2: node('glutamate', 1670, 150), akg2: node('akg', 2050, 150), nh42: node('ammonium', 2050, 440),
ala: node('alanine', 150, 730), pyr: node('pyruvate', 530, 730), asp: node('aspartate', 150, 1020), oaa: node('oaa', 530, 1020)
};
var reactions = [
{
id: 'ga1', step: 1, enzyme: 'gdh', substrates: ['akg1', 'nh41'], products: ['glu1'],
ins: ['nadph'], outs: ['nadp', 'h2o'], avoid: ['nad', 'nadh', 'hplus', 'akg', 'ammonium'],
arrows: [{ from: 'akg1', to: 'glu1' }, { from: 'nh41', to: 'glu1' }],
type: 'Reductive amination', irreversible: false,
equation: 'α-Ketoglutarate + NH₄⁺ + NADPH + H⁺ → Glutamate + NADP⁺ + H₂O',
hint: 'Acid keto 5 carbon của chu trình TCA nhận nitơ tự do cùng các electron của chất mang dạng khử, biến nhóm carbonyl thành nhóm amin. Đây là một trong hai con đường đưa nitơ tự do vào amino acid.'
},
{
id: 'ga2', step: 2, enzyme: 'gs', substrates: ['glu1', 'nh41'], products: ['gln1'],
ins: ['atp'], outs: ['adp', 'pi'], avoid: ['hplus'],
arrows: [{ from: 'glu1', to: 'gln1' }, { from: 'nh41', to: 'gln1' }],
type: 'Amidation (spends ATP)', irreversible: true,
equation: 'Glutamate + NH₄⁺ + ATP → Glutamine + ADP + Pᵢ + H⁺',
hint: 'Nguyên tử nitơ thứ hai được gắn vào amino acid tại nhóm carboxyl của mạch bên. Đồng tiền năng lượng trước tiên hoạt hóa nhóm đó, rồi nitơ tự do thay thế nhóm đã hoạt hóa, tạo thành một amide vô hại có thể vận chuyển trong máu.'
},
{
id: 'ga3', step: 3, enzyme: 'glnase', substrates: ['gln2'], products: ['glu2', 'nh42'],
ins: ['h2o'], outs: [], avoid: ['glutamate', 'ammonium'],
arrows: [{ from: 'gln2', to: 'glu2' }, { from: 'gln2', to: 'nh42' }, { from: 'gln1', to: 'gln2' }],
type: 'Hydrolysis of an amide', irreversible: true,
equation: 'Glutamine + H₂O → Glutamate + NH₄⁺',
hint: 'Cách xa nơi được tổng hợp, ở các mô như gan và thận, nhóm amide của amino acid vận chuyển bị cắt bằng thủy phân. Nitơ được giải phóng lại dưới dạng ion và để lại nhóm carboxyl trên mạch bên.'
},
{
id: 'ga4', step: 4, enzyme: 'gdh', substrates: ['glu2'], products: ['akg2', 'nh42'],
ins: ['nad', 'h2o'], outs: ['nadh'], avoid: ['nadp', 'nadph', 'hplus', 'akg', 'ammonium'],
arrows: [{ from: 'glu2', to: 'akg2' }, { from: 'glu2', to: 'nh42' }],
type: 'Oxidative deamination', irreversible: false,
equation: 'Glutamate + NAD⁺ + H₂O → α-Ketoglutarate + NH₄⁺ + NADH + H⁺',
hint: 'Amino acid bị oxi hóa: nhóm amin của nó tách ra dưới dạng ion tự do trong khi nhóm carbonyl thay thế vào đó, và chất mang dạng oxi hóa thu nhận các electron. Bộ khung carbon còn lại là một acid keto của chu trình TCA.'
},
{
id: 'ga5', step: 5, enzyme: 'alt', substrates: ['ala'], products: ['pyr'],
ins: ['akgc'], outs: ['glutc'], arrows: [{ from: 'ala', to: 'pyr' }],
type: 'Chuyển hóa amin', irreversible: false,
equation: 'Alanine + α-Ketoglutarate → Pyruvate + Glutamate',
hint: 'Một amino acid 3 carbon chuyển nhóm amin của nó cho một acid keto 5 carbon với coenzyme dẫn xuất từ vitamin B6 mang nhóm này trong trung tâm hoạt động. Phân tử 3 carbon trở thành một acid keto của đường phân và không có sự oxi hóa hay khử nào.'
},
{
id: 'ga6', step: 6, enzyme: 'ast', substrates: ['asp'], products: ['oaa'],
ins: ['akgc'], outs: ['glutc'], arrows: [{ from: 'asp', to: 'oaa' }],
type: 'Chuyển hóa amin', irreversible: false,
equation: 'Aspartate + α-Ketoglutarate → Oxaloacetate + Glutamate',
hint: 'Một amino acid 4 carbon có hai nhóm carboxyl chuyển nhóm amin của nó cho một acid keto 5 carbon nhờ coenzyme vitamin B6 trong trung tâm hoạt động, trở thành acid keto 4 carbon nằm trong chu trình TCA.'
}
];
return {
nodes: nodes, reactions: reactions, order: ['ga1', 'ga2', 'ga3', 'ga4', 'ga5', 'ga6'],
regions: [
{ type: 'rect', label: 'thu giữ amoni', color: '#DDF3D4', x: 20, y: 20, w: 1020, h: 560 },
{ type: 'rect', label: 'Giải phóng amoni', color: '#FBE0D6', x: 1160, y: 20, w: 1100, h: 560 },
{ type: 'rect', label: 'Chuyển hóa amin', color: BLUE, x: 20, y: 620, w: 1300, h: 560 }
],
notes: [
note('trong máu', 1100, 128, 'middle', 18),
note('NH₄⁺ đi vào chu trình urê.', 2050, 545, 'middle', 18),
note('Alanine vận chuyển các nhóm amino của cơ bắp đến gan.', 780, 760, 'start', 18),
note('(chu trình glucose-alanine)', 780, 790, 'start', 18),
note('Trong gan, aspartate cũng tham gia vào chu trình urê.', 780, 1050, 'start', 18)
]
};
}
function pyruvateEntryPart() {
var nodes = {
pyrc: node('pyruvate', 150, 150), pyri: node('pyruvate', 530, 150), pyrm: node('pyruvate', 910, 150), acoa: node('acetylcoa', 1290, 150)
};
var link = linkReaction();
var reactions = [
{
id: 'pe1', step: 1, enzyme: 'porin', substrates: ['pyrc'], products: ['pyri'],
ins: [], outs: [], avoid: ['pyrsym'], arrows: [{ from: 'pyrc', to: 'pyri' }],
type: 'Facilitated diffusion through a channel', irreversible: false,
equation: 'Pyruvate⁻ (trong tế bào chất) ⇌ Pyruvate⁻ (trong không gian giữa màng)',
hint: 'Một lỗ chứa nước cấu tạo từ thùng các sợi beta cho phép các phân tử nhỏ trượt qua màng ngoài theo cả hai chiều, nên không tốn năng lượng và không có sự oxi hóa hay khử nào.'
},
{
id: 'pe2', step: 2, enzyme: 'pyrsym', substrates: ['pyri'], products: ['pyrm'],
ins: [], outs: [], avoid: ['porin'], arrows: [{ from: 'pyri', to: 'pyrm' }],
type: 'Symport với H⁺', irreversible: false,
equation: 'Pyruvate⁻ (khoảng gian màng) + H⁺ (khoảng gian màng) ⇌ Pyruvate⁻ (chất nền) + H⁺ (chất nền)',
hint: 'Màng trong không cho acid này tự đi qua. Một chất mang vận chuyển nó qua màng cùng với một ion dương nhỏ có nồng độ cao hơn ở khoảng giữa hai màng, nên quá trình vận chuyển được thúc đẩy bởi gradient do chuỗi truyền electron tạo ra. Không có sự oxi hóa hay khử nào.'
},
{
id: 'pe3', step: 3, enzyme: 'pdc', substrates: ['pyrm'], products: ['acoa'],
ins: ['coa', 'nad'], outs: ['co2', 'nadh'], avoid: ['fad', 'fadh2', 'hplus'], arrows: [{ from: 'pyrm', to: 'acoa' }],
type: link.type, irreversible: true, equation: link.equation + ' (ma trận)', hint: link.hint,
hl: { sub: { pyrm: ['coo'] }, prod: { acoa: ['thioester'] } }
}
];
return {
nodes: nodes, reactions: reactions, order: ['pe1', 'pe2', 'pe3'],
regions: [
{ type: 'rect', label: 'Mục nhập Pyruvate', color: TAN, x: 20, y: 20, w: 1460, h: 280 }
],
membranes: [{ x1: 340, y1: 27, x2: 340, y2: 293 }, { x1: 720, y1: 27, x2: 720, y2: 293 }],
notes: [
note('Tế bào chất', 40, 285, 'start', 16), note('Khoảng gian màng', 360, 285, 'start', 16), note('Chất nền ty thể', 740, 285, 'start', 16),
note('Màng ngoài', 330, 62, 'end', 16), note('Màng trong', 710, 62, 'end', 16)
]
};
}
function mitoDynamicsPart() {
var nodes = {
fused: node('mtfused', 150, 150), fiss: node('mtfissioned', 530, 150), outer: node('mtouterfused', 910, 150), fused2: node('mtfused', 1290, 150)
};
var reactions = [
{
id: 'md1', step: 1, enzyme: 'drp1', substrates: ['fused'], products: ['fiss'],
ins: ['gtp'], outs: ['gdp', 'pi'], arrows: [{ from: 'fused', to: 'fiss' }], exactAnswers: true, avoid: ['mtnew', 'mtdamaged'],
type: 'Fission, spends GTP', irreversible: false,
equation: 'Ty thể hợp nhất + n GTP + n H₂O → Ty thể phân tách + n GDP + n Pᵢ + n H⁺ (vòng Drp1 thủy phân nhiều GTP)',
hint: 'Một vòng gồm một protein lớn hòa tan lắp ráp trên màng ngoài tại vị trí mà một ống lưới nội chất đã thắt hẹp bào quan. Vòng này siết chặt khi tiêu tốn năng lượng từ nucleotide triphosphate, cho đến khi một cấu trúc dài bị cắt đôi thành hai.'
},
{
id: 'md2', step: 2, enzyme: 'mfn', substrates: ['fiss'], products: ['outer'],
ins: [], outs: [], arrows: [{ from: 'fiss', to: 'outer' }], exactAnswers: true,
type: 'Outer membrane fusion, spends GTP', irreversible: false,
equation: 'Ty thể phân chia + n GTP + n H₂O → Màng ngoài hợp nhất + n GDP + n Pᵢ + n H⁺',
hint: 'Các protein trên màng ngoài của hai ty thể lân cận vươn ra liên kết với nhau, và năng lượng từ nucleotide triphosphate kéo hai lớp màng ngoài áp sát cho đến khi hợp nhất thành một, trong khi các màng trong vẫn tách biệt.'
},
{
id: 'md3', step: 3, enzyme: 'opa1', substrates: ['outer'], products: ['fused2'],
ins: [], outs: [], arrows: [{ from: 'outer', to: 'fused2' }], exactAnswers: true,
type: 'Inner membrane fusion, spends GTP', irreversible: false,
equation: 'Màng ngoài hợp nhất + n GTP + n H₂O → Ty thể hợp nhất + n GDP + n Pᵢ + n H⁺',
hint: 'Sau khi hai màng ngoài đã hợp nhất, một protein trên màng trong dùng nucleotide triphosphate để kéo hai màng trong hợp nhất với nhau, giúp chất chứa bên trong hai bào quan hòa trộn thành một khoang liên tục.'
}
];
return { nodes: nodes, reactions: reactions, order: ['md1', 'md2', 'md3'], regions: [], notes: [] };
}
function intrinsicApoptosisPart() {
var nodes = {
dna: node('dnadmg', 150, 150), cyt: node('cytcrel', 530, 150), apop: node('apoptosome', 910, 150),
c9: node('casp9a', 1290, 150), c3: node('execcasp', 1670, 150), death: node('apoptosis', 2050, 150),
pc9: node('procasp9', 1290, 470), pc3: node('procexec', 1670, 470), prot: node('cellprot', 2050, 470)
};
var reactions = [
{
id: 'ai1', step: 1, enzyme: 'bax', substrates: ['dna'], products: ['cyt'],
ins: [], outs: [], arrows: [{ from: 'dna', to: 'cyt' }],
type: 'Pore formation and release', irreversible: true,
equation: 'Tổn thương DNA nghiêm trọng → (các yếu tố gây chết tế bào kích hoạt Bax) → Bax tạo lỗ trên màng ngoài ty thể → Cytochrome c được giải phóng vào bào tương',
hint: 'Tổn thương mà tế bào không thể sửa chữa sẽ kích hoạt một protein thuộc họ Bcl-2. Protein này di chuyển tới màng ngoài ty thể và lắp ráp thành các lỗ, khiến một protein nhỏ mang electron từ khoang gian màng thoát ra bên trong tế bào.'
},
{
id: 'ai2', step: 2, enzyme: 'apaf1', substrates: ['cyt'], products: ['apop'],
ins: [], outs: [], arrows: [{ from: 'cyt', to: 'apop' }],
type: 'Complex assembly', irreversible: false,
equation: '7 Cytochrome c + 7 Apaf-1 + 7 dATP → Apoptosome (một heptamer)',
hint: 'Trong bào tương, chất mang thoát ra gắn vào một protein tiếp hợp lớn cùng một nucleotide, và bảy phân tử protein tiếp hợp này kết hợp thành một phức hợp hình bánh xe có trục trung tâm.'
},
{
id: 'ai3', step: 3, enzyme: 'apoptosomeenz', substrates: ['pc9'], products: ['c9'],
ins: [], outs: [], arrows: [{ from: 'pc9', to: 'c9' }, { from: 'apop', to: 'c9' }],
type: 'Activation of a precursor by proximity', irreversible: true,
equation: 'Procaspase-9 → Caspase-9, tại phức hợp apoptosis.',
hint: 'Nhiều tiền chất bất hoạt của một protease được tuyển mộ về trục của phức hợp vừa tạo ở bước trước. Khi bị giữ sát nhau, chúng tự cắt và hoạt hóa lẫn nhau, tạo ra protease hoạt động đầu tiên của con đường.'
},
{
id: 'ai4', step: 4, enzyme: 'casp9', substrates: ['pc3'], products: ['c3'],
ins: [], outs: [], avoid: ['casp8'], arrows: [{ from: 'pc3', to: 'c3' }, { from: 'c9', to: 'c3' }],
type: 'Proteolytic activation', irreversible: true,
equation: 'Procaspase-3 → Caspase-3, bị cắt bởi caspase-9',
hint: 'Protease hoạt động đầu tiên cắt các tiền chất bất hoạt của nhóm protease thứ hai tại các gốc aspartate đặc hiệu, biến chúng thành các enzyme hoạt động sẽ thực hiện công đoạn phá hủy cuối cùng.'
},
{
id: 'ai5', step: 5, enzyme: 'casp3', substrates: ['prot'], products: ['death'],
ins: [], outs: [], arrows: [{ from: 'prot', to: 'death' }, { from: 'c3', to: 'death' }],
type: 'Proteolysis of cell proteins', irreversible: true,
equation: 'Protein tế bào → Protein bị phân cắt bởi caspase-3: tế bào bị phá hủy (quá trình apoptosis)',
hint: 'Các protease hoạt động của nhóm cuối cắt hàng trăm protein cấu trúc và điều hòa, bao gồm màng lá nhân (nuclear lamina), bộ khung tế bào, một enzyme sửa chữa DNA và chất ức chế của enzyme cắt DNA. Tế bào co rút lại và vỡ thành các mảnh có màng bao bọc.'
}
];
return {
nodes: nodes, reactions: reactions, order: ['ai1', 'ai2', 'ai3', 'ai4', 'ai5'],
regions: [
{ type: 'rect', label: 'Cò súng', color: '#FBE0D6', x: 20, y: 20, w: 1020, h: 280 },
{ type: 'rect', label: 'Lần kích hoạt đầu tiên', color: '#FFF0C9', x: 1160, y: 20, w: 260, h: 590 },
{ type: 'rect', label: 'Kích hoạt lần thứ hai', color: '#DDF3D4', x: 1540, y: 20, w: 260, h: 590 },
{ type: 'rect', label: 'Kết quả', color: '#E5DAFB', x: 1920, y: 20, w: 260, h: 590 }
],
notes: [
{ text: 'activates', x: 1100, y: 128, size: 18, color: '#6b5d3a', anchor: 'middle' },
{ text: 'activates', x: 1480, y: 128, size: 18, color: '#6b5d3a', anchor: 'middle' },
{ text: 'thực hiện', x: 1860, y: 128, size: 18, color: '#6b5d3a', anchor: 'middle' }
]
};
}
function extrinsicApoptosisPart() {
var nodes = {
tnf: node('tnf', 150, 150), dc: node('deathrc', 530, 150), c8: node('casp8a', 910, 150),
ec: node('execcasp', 1290, 150), death: node('apoptosis', 1670, 150),
pc8: node('procasp8', 910, 470), pe: node('procexec', 1290, 470), prot: node('cellprot', 1670, 470)
};
var reactions = [
{
id: 'ae1', step: 1, enzyme: 'tnfr1', substrates: ['tnf'], products: ['dc'],
ins: [], outs: [], arrows: [{ from: 'tnf', to: 'dc' }],
type: 'Receptor activation', irreversible: false,
equation: 'TNF (một trimer) + 3 TNFR1 → phức hợp TNF-TNFR1 với các miền chết lộ ra',
hint: 'Một protein tín hiệu do các tế bào khác tiết ra gắn vào thụ thể trên màng sinh chất và kéo ba chuỗi thụ thể lại với nhau, làm bộc lộ vùng gắn protein ở đuôi của chúng (miền chết — death domain) ở mặt trong tế bào.'
},
{
id: 'ae2', step: 2, enzyme: 'fadd', substrates: ['pc8'], products: ['c8'],
ins: [], outs: [], arrows: [{ from: 'pc8', to: 'c8' }, { from: 'dc', to: 'c8' }],
type: 'Recruitment and activation of a precursor', irreversible: true,
equation: 'Procaspase-8 → Caspase-8, tại phức hợp thụ thể gây chết tế bào (với TRADD và FADD)',
hint: 'Một chuỗi protein tiếp hợp gắn vào vùng bộc lộ ở một đầu, còn protein cuối cùng gắn với tiền chất bất hoạt của một protease ở đầu kia. Nhiều tiền chất bị giữ sát nhau nên tự cắt và hoạt hóa lẫn nhau.'
},
{
id: 'ae3', step: 3, enzyme: 'casp8', substrates: ['pe'], products: ['ec'],
ins: [], outs: [], avoid: ['casp9'], arrows: [{ from: 'pe', to: 'ec' }, { from: 'c8', to: 'ec' }],
type: 'Proteolytic activation', irreversible: true,
equation: 'Các procaspase thực thi → Các caspase thực thi, bị cắt bởi caspase-8',
hint: 'Protease hoạt động đầu tiên cắt các tiền chất bất hoạt của nhóm protease thứ hai tại các gốc aspartate đặc hiệu, biến chúng thành các enzyme hoạt động sẽ thực hiện công đoạn phá hủy cuối cùng.'
},
{
id: 'ae4', step: 4, enzyme: 'casp3', substrates: ['prot'], products: ['death'],
ins: [], outs: [], arrows: [{ from: 'prot', to: 'death' }, { from: 'ec', to: 'death' }],
type: 'Proteolysis of cell proteins', irreversible: true,
equation: 'Protein tế bào → Protein bị phân cắt bởi caspase-3: tế bào bị phá hủy (quá trình apoptosis)',
hint: 'Các protease hoạt động của nhóm cuối cắt hàng trăm protein cấu trúc và điều hòa, bao gồm màng lá nhân, bộ khung tế bào, một enzyme sửa chữa DNA và chất ức chế của enzyme cắt DNA. Tế bào co rút lại và vỡ thành các mảnh có màng bao bọc.'
}
];
return {
nodes: nodes, reactions: reactions, order: ['ae1', 'ae2', 'ae3', 'ae4'],
regions: [
{ type: 'rect', label: 'Tín hiệu', color: '#FBE0D6', x: 20, y: 20, w: 640, h: 280 },
{ type: 'rect', label: 'Lần kích hoạt đầu tiên', color: '#FFF0C9', x: 780, y: 20, w: 260, h: 590 },
{ type: 'rect', label: 'Kích hoạt lần thứ hai', color: '#DDF3D4', x: 1160, y: 20, w: 260, h: 590 },
{ type: 'rect', label: 'Kết quả', color: '#E5DAFB', x: 1540, y: 20, w: 260, h: 590 }
],
notes: [
{ text: 'activates', x: 720, y: 128, size: 18, color: '#6b5d3a', anchor: 'middle' },
{ text: 'activates', x: 1100, y: 128, size: 18, color: '#6b5d3a', anchor: 'middle' },
{ text: 'thực hiện', x: 1480, y: 128, size: 18, color: '#6b5d3a', anchor: 'middle' }
]
};
}
var SUMMARY_GLY = [
'Thu được ròng trên mỗi glucose: 2 pyruvate, 2 ATP, 2 NADH, 2 H₂O',
'ATP: tiêu tốn 2 (bước 1 và 3), tạo ra 4 (bước 7 và 10, mỗi triose một lần)',
'Glucose + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 Pyruvate + 2 NADH + 2 ATP + 2 H⁺ + 2 H₂O',
'Các điểm kiểm soát: hexokinase, phosphofructokinase-1 và pyruvate kinase xúc tác ba bước bất thuận nghịch. Chúng được điều hòa bởi allosteric effectors, covalent modification và gene transcription, trong đó ATP là chất điều hòa chính'
];
var SUMMARY_TCA = [
'Trên mỗi acetyl-CoA: 2 CO₂, 3 NADH, 1 FADH₂, 1 GTP',
'CO₂ tách ra tại isocitrate dehydrogenase và α-ketoglutarate dehydrogenase; nước được sử dụng tại citrate synthase và fumarase',
'Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pᵢ + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + 2 H⁺ + CoA-SH',
'Năm trong số chín phản ứng, tính cả link reaction, được xúc tác bởi các dehydrogenases. Các điểm kiểm soát: pyruvate dehydrogenase complex, citrate synthase, isocitrate dehydrogenase và α-ketoglutarate dehydrogenase complex; ATP và NADH ức chế chúng, còn ADP và NAD⁺ kích thích isocitrate dehydrogenase'
];
var SUMMARY_GLYCOGEN = [
'Tổng hợp: glucose 6-phosphate → glucose 1-phosphate → UDP-glucose → glycogen. Mỗi phân tử glucose gắn thêm tiêu tốn một UTP, tương đương một ATP (UDP được tái phosphoryl hóa bởi nucleoside diphosphate kinase, và sự phân cắt pyrophosphate kéo bước hoạt hóa tiến về phía trước).',
'Phân giải: glycogen phosphorylase sử dụng Pᵢ, nên mỗi glucose tách ra ở dạng glucose 1-phosphate mà không tốn ATP',
'Tổng hợp và phân giải sử dụng các enzymes khác nhau, nhờ đó chúng có thể được điều hòa độc lập'
];
var SUMMARY_GNG = [
'Phương trình tổng: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺',
'Bảy enzymes của glycolysis hoạt động theo cả hai chiều; bốn bypass enzymes (pyruvate carboxylase, PEP carboxykinase, fructose-1,6-bisphosphatase, glucose-6-phosphatase) đi vòng qua các bước bất thuận nghịch',
'Sáu liên kết phosphate giàu năng lượng bị tiêu tốn cho mỗi glucose, so với hai liên kết thu được trong glycolysis'
];
var SUMMARY_ETOH = [
'Thu được ròng trên mỗi glucose: 2 ethanol, 2 CO₂ và 2 ATP (tạo ra 4, tiêu tốn 2)',
'Glucose + 2 ADP + 2 Pᵢ + 2 H⁺ → 2 Ethanol + 2 CO₂ + 2 ATP + 2 H₂O',
'Alcohol dehydrogenase tái oxy hóa 2 NADH được tạo ra ở bước glyceraldehyde 3-phosphate dehydrogenase, giúp glycolysis tiếp tục diễn ra mà không cần oxygen'
];
var SUMMARY_PDHTCA = [
'Trên mỗi pyruvate: 3 CO₂, 4 NADH, 1 FADH₂ và 1 GTP (1 NADH đến từ link reaction)',
'Trên mỗi glucose, vốn tạo ra 2 pyruvate: thu được 6 CO₂, 8 NADH, 2 FADH₂ và 2 GTP từ phần này của pathway'
];
var SUMMARY_BETAOX = [
'Mỗi vòng xoắn tạo ra 1 FADH₂, 1 NADH và 1 acetyl-CoA, đồng thời rút ngắn fatty acyl-CoA đi 2 carbons',
'Palmitoyl-CoA (16 carbons) cần 7 vòng: thu được 7 FADH₂, 7 NADH và 8 acetyl-CoA',
'Quá trình hoạt hóa tiêu tốn hai liên kết phosphate giàu năng lượng (ATP bị cắt thành AMP và PPᵢ)'
];
var SUMMARY_LAC = [
'Thu được ròng trên mỗi glucose: 2 lactate và 2 ATP (tạo ra 4, tiêu tốn 2)',
'Glucose + 2 ADP + 2 Pᵢ → 2 Lactate + 2 ATP + 2 H₂O',
'Lactate dehydrogenase chuyển 2 NADH được tạo ra ở bước glyceraldehyde 3-phosphate dehydrogenase trở lại thành NAD⁺, giúp glycolysis tiếp tục chạy mà không cần oxygen'
];
var SUMMARY_ETC = [
'Trên mỗi NADH: khoảng 10 H⁺ được bơm (4 tại Complex I, 4 tại Complex III, 2 tại Complex IV), đủ cho khoảng 2.5 ATP',
'Trên mỗi FADH₂: khoảng 6 H⁺ được bơm (Complex II không bơm proton), đủ cho khoảng 1.5 ATP',
'Tổng quát: NADH + H⁺ + ½ O₂ → NAD⁺ + H₂O, với khoảng 4 H⁺ đi qua ATP synthase cho mỗi ATP được tổng hợp'
];
var SUMMARY_ETCSIMPLE = [
'Electrons đi vào tại Complex I (từ NADH) hoặc tại Complex II (từ FADH₂), tới ubiquinone, rồi đi qua Complex III, cytochrome c và Complex IV tới oxygen để tạo thành nước',
'Trên mỗi NADH có khoảng 10 H⁺ được bơm ra khỏi matrix (4 tại Complex I, 4 tại Complex III, 2 tại Complex IV); Complex II không bơm, nên FADH₂ tạo ra khoảng 6 H⁺',
'ATP synthase cho các protons quay trở lại và tổng hợp ATP: khoảng 2.5 ATP trên mỗi NADH và 1.5 ATP trên mỗi FADH₂ (chỉ số P/O ratios)'
];
var SUMMARY_BOXSIMPLE = [
'Mỗi vòng của chu trình gồm bốn bước: oxy hóa (FAD), cộng nước, oxy hóa lần nữa (NAD⁺), sau đó cắt bỏ hai carbons dưới dạng acetyl-CoA',
'Mỗi vòng tạo ra 1 FADH₂, 1 NADH và 1 acetyl-CoA, làm mạch carbon ngắn đi 2 carbons',
'Palmitic acid (16 carbons) cần 7 vòng: thu được 7 FADH₂, 7 NADH và 8 acetyl-CoA',
'Quá trình hoạt hóa tốn 2 ATP tương đương (ATP thành AMP và PPᵢ); ATP Calculator sẽ cộng tất cả lại (106 ATP cho palmitic acid)'
];
var SUMMARY_FULL = [
'Glucose bị oxy hóa hoàn toàn thành 6 CO₂',
'Trên mỗi glucose: thu được 10 NADH, 2 FADH₂ và 4 ATP hoặc GTP ròng từ substrate-level phosphorylation (glycolysis tạo 4 và tiêu tốn 2, chu trình tạo 2 GTP)',
'Glycolysis cho 2 pyruvate, link reaction cho 2 acetyl-CoA, và chu trình quay hai lần',
'Theo các con số làm tròn 3 ATP trên mỗi NADH và 2 trên mỗi FADH₂, hiệu suất là 36 ATP ở tế bào vận chuyển hai cytosolic NADH vào trong bằng glycerol phosphate shuttle (38 ATP với malate-aspartate shuttle, và 38 ATP ở vi khuẩn vì không cần shuttle)',
'Theo con số thực tế hơn là 2.5 ATP trên mỗi NADH và 1.5 trên mỗi FADH₂, hiệu suất là khoảng 30 ATP với glycerol phosphate shuttle và khoảng 32 ATP với malate-aspartate shuttle (10 H⁺ trên mỗi NADH và khoảng 4 H⁺ trên mỗi ATP cho 2.5, đồng thời rò rỉ và các mục đích sử dụng gradient khác làm giảm hiệu suất thêm nữa)'
];
var SUMMARY_ETCPATH = [
'Electrons đi qua các carriers theo thứ tự redox potential nhìn chung tăng dần, từ NADH (khoảng −0.32 V) tới oxygen (khoảng +0.82 V)',
'Các Complexes I, III và IV bơm protons: 4 H⁺ tại Complex I, 4 tại Complex III và 2 tại Complex IV, tổng cộng 10 H⁺ cho mỗi NADH',
'Flavins và ubiquinone vận chuyển hai electrons và hai protons, các iron-sulfur centers vận chuyển một electron, và cytochromes vận chuyển một electron qua sắt của nhân heme (Fe³⁺ sang Fe²⁺)',
'Rotenone ức chế Complex I, antimycin A ức chế Complex III, còn cyanide và carbon monoxide ức chế Complex IV'
];
var SUMMARY_GPSHUTTLE = [
'NADH không thể đi qua màng trong (inner membrane), nên electrons của nó được đưa vào bằng một shuttle',
'Trong glycerol phosphate shuttle, electrons kết thúc trên FADH₂ và đi vào chuỗi tại ubiquinone, bỏ qua Complex I, nên mỗi cytosolic NADH chỉ tạo khoảng 1.5 ATP thay vì 2.5'
];
var SUMMARY_MASHUTTLE = [
'Malate-aspartate shuttle trả lại electrons của cytosolic NADH dưới dạng NADH trong matrix, nên chúng đi vào tại Complex I (khoảng 2.5 ATP cho mỗi NADH)',
'Shuttle này cần malate dehydrogenase và aspartate aminotransferase ở cả trong matrix lẫn phía bên kia màng trong (cytosol và intermembrane space), cùng một malate-α-ketoglutarate antiporter và một glutamate-aspartate antiporter',
'Glutamate-aspartate antiporter được thúc đẩy bởi điện thế màng (membrane potential), nên shuttle chỉ chạy theo một chiều duy nhất'
];
var SUMMARY_ANTPORT = [
'ATP và ADP không khuếch tán tự do qua màng trong: ATP-ADP translocase trao đổi chúng theo tỉ lệ một đổi một',
'ATP mang nhiều hơn ADP một điện tích âm, nên điện thế màng dương làm ATP rời khỏi matrix nhanh hơn khoảng 30 lần so với ADP',
'Khoảng một phần tư năng lượng của chuỗi vận chuyển được dùng để duy trì điện thế màng thúc đẩy sự trao đổi này'
];
var SUMMARY_PYRENTRY = [
'Pyruvate đi qua màng ngoài qua các kênh porin và đi qua màng trong trên H⁺/pyruvate symporter, được thúc đẩy bởi proton gradient của electron transport chain',
'Link reaction trong matrix tạo ra acetyl-CoA, CO₂ và NADH; coenzyme A được cấu tạo từ vitamin pantothenic acid (vitamin B5), và nguyên tử lưu huỳnh của nó mang nhóm acetyl',
'Trên mỗi glucose, vốn tạo ra 2 pyruvate, quá trình này tạo 2 acetyl-CoA, 2 CO₂ và 2 NADH'
];
var SUMMARY_MITODYN = [
'Fission làm tăng số lượng ty thể và cho phép cắt bỏ phần bị hư hỏng để loại thải (mitophagy); fusion cho phép một ty thể bị tổn thương chia sẻ thành phần với một ty thể khỏe mạnh, và được kích thích bởi nhu cầu năng lượng và stress',
'Drp1, các mitofusins và Opa1 đều là GTPases, nên mỗi bước đều tiêu tốn GTP. Thứ tự diễn ra là màng ngoài hợp nhất bởi các mitofusins, sau đó màng trong hợp nhất bởi Opa1',
'Ty thể luôn sinh ra từ các ty thể có sẵn: quá trình biogenesis (được PGC-1α bật lên) bổ sung vật chất ty thể mới, và fission chia nó thành nhiều bào quan hơn'
];
var SUMMARY_APOINT = [
'Tổn thương DNA nghiêm trọng kích hoạt Bax, tạo lỗ trên màng ngoài ty thể, khiến cytochrome c thoát ra cytosol',
'Cytochrome c, Apaf-1 và dATP kết hợp tạo thành apoptosome, giúp hoạt hóa procaspase-9; caspase-9 hoạt hóa các executioner procaspases (procaspase-3), và caspase-3 cắt các protein tế bào',
'Tổn thương nghiêm trọng cũng ức chế các yếu tố anti-apoptotic vốn kìm giữ Bax',
'Trong trò chơi này, protein của một bước là thành phần của phức hợp trực tiếp tác động tại mũi tên'
];
var SUMMARY_APOEXT = [
'TNF kéo ba chuỗi TNFR1 lại gần nhau; các death domains huy động TRADD, TRADD huy động FADD, và FADD huy động procaspase-8',
'Các phân tử procaspase-8 được giữ sát nhau sẽ tự hoạt hóa lẫn nhau; caspase-8 hoạt hóa các executioner procaspases, và các executioner caspases cắt các protein tế bào',
'Con đường extrinsic và intrinsic gặp nhau tại các executioner caspases',
'Trong trò chơi này, protein của một bước là thành phần của phức hợp trực tiếp tác động tại mũi tên'
];
var SUMMARY_GLUALA = [
'Ammonium được bắt giữ theo hai cách: glutamate dehydrogenase gắn nó vào α-ketoglutarate cùng NADPH để tạo glutamate, và glutamine synthetase gắn nguyên tử nitơ thứ hai vào glutamate cùng ATP để tạo glutamine, chất vận chuyển ammonia an toàn trong máu',
'Nitơ được giải phóng trở lại ở nơi cần thiết: glutaminase giải phóng amide nitrogen của glutamine tại gan và thận, còn glutamate dehydrogenase tách nhóm amino của glutamate dưới dạng NH₄⁺ cùng NAD⁺, trả lại α-ketoglutarate. NH₄⁺ sau đó đi vào urea cycle',
'Các transaminases ALT và AST (vitamin B6) chuyển nhóm amino qua lại giữa amino acids và α-ketoglutarate mà không làm thay đổi tổng lượng nitơ: alanine cho pyruvate và aspartate cho oxaloacetate, còn glutamate thu nhận các nhóm amino',
'Cơ gửi các nhóm amino tới gan dưới dạng alanine (glucose-alanine cycle): ALT tạo ra pyruvate, được gluconeogenesis chuyển thành glucose cho cơ, và tạo glutamate có nitơ đi vào urea cycle'
];
var SUMMARY_UREA = [
'Mỗi vòng chuyển hóa một ammonium nitrogen và một aspartate nitrogen thành một phân tử urea: NH₄⁺ + HCO₃⁻ + aspartate + 3 ATP + H₂O → urea + fumarate + 2 ADP + AMP + 2 Pᵢ + PPᵢ + 2 H⁺. Tính bước ATP thành AMP + PPᵢ là hai liên kết, vì PPᵢ của nó bị thủy phân, nên bốn liên kết phosphate giàu năng lượng bị tiêu tốn cho mỗi urea: hai tại carbamoyl phosphate synthetase I và hai tại argininosuccinate synthetase',
'Hai nguyên tử nitơ của urea đến từ ammonium (qua carbamoyl phosphate) và từ aspartate (qua argininosuccinate); nguyên tử carbon của nó đến từ bicarbonate',
'Bước 1 và 2 diễn ra trong mitochondrial matrix, còn bước 4 đến 6 ở cytosol; chất vận chuyển giữa hai nơi đưa ornithine vào để đổi lấy citrulline đi ra. Carbamoyl phosphate synthetase I là bước cam kết (committed step), được kích hoạt bởi N-acetylglutamate',
'Fumarate được tạo ra bởi argininosuccinate lyase tham gia vào TCA cycle (fumarate thành malate rồi thành oxaloacetate, và quay lại aspartate qua transamination), giúp kết nối urea cycle với TCA cycle'
];
function clone(o) { return JSON.parse(JSON.stringify(o)); }
var gly = glycolysisPart();
var glycolysis = {
id: 'glycolysis', title: 'Đường phân (Glycolysis)', subtitle: 'Glucose thành pyruvate', tag: 'GLY',
location: 'Tế bào chất', color: '#FFB347', big: true,
nodes: gly.nodes, reactions: gly.reactions, order: gly.order, start: ['glc'],
regions: gly.regions, notes: gly.notes, summary: SUMMARY_GLY,
region: ['gly', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var lacGly = clone(gly);
lacGly.nodes.lac = node('lactate', COL + 380, row(9));
var lactate = {
id: 'lactate', title: 'Lên men lactic (Lactic Acid Fermentation)', subtitle: 'Glucose thành lactate trong điều kiện thiếu oxygen', tag: 'LAC',
location: 'Tế bào chất', color: '#F28CA6', big: true,
nodes: lacGly.nodes,
reactions: lacGly.reactions.concat([ldhReaction()]),
order: lacGly.order.concat(['ldh']),
start: ['glc'],
regions: [glycolysisRegion('quá trình lên men axit lactic', 1160)],
notes: glycolysisNotes('các bước 6 đến 11').concat([note('Nồng độ O₂ thấp', COL + 380, row(9) - 110, 'middle')]),
summary: SUMMARY_LAC,
region: ['gly', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var glycogenParts = glycogenPart();
var glycogen = {
id: 'glycogen', title: 'Chuyển hóa glycogen (Glycogen Metabolism)', subtitle: 'Tổng hợp và phân giải glycogen', tag: 'GLG',
location: 'Dịch bào (gan và cơ)', color: '#9BD66F',
nodes: glycogenParts.nodes, reactions: glycogenParts.reactions, order: glycogenParts.order, start: ['g6p'],
regions: glycogenParts.regions, notes: glycogenParts.notes, summary: SUMMARY_GLYCOGEN,
region: ['gly', 'both', 'all', 'glycogen'], noDistractor: ['hplus', 'mg']
};
var gngParts = gluconeogenesisPart();
var gluconeogenesis = {
id: 'gluconeogenesis', title: 'Tân tạo glucose (Gluconeogenesis)', subtitle: 'Chuyển pyruvate ngược trở lại thành glucose', tag: 'GNG',
location: 'Gan và thận (ty thể và bào tương)', color: '#F2A65A', big: true,
nodes: gngParts.nodes, reactions: gngParts.reactions, order: gngParts.order, start: ['pyr'],
regions: gngParts.regions, notes: gngParts.notes, summary: SUMMARY_GNG,
region: ['gly', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var ethGly = clone(gly);
ethGly.nodes.acet = node('acetaldehyde', COL + 380, row(9));
ethGly.nodes.etoh = node('ethanol', COL + 760, row(9));
var ethanol = {
id: 'ethanol', title: 'Lên men rượu (Alcohol Fermentation)', subtitle: 'Glucose thành ethanol trong điều kiện thiếu oxygen', tag: 'ETH',
location: 'Tế bào chất (nấm men)', color: '#E9B96E', big: true,
nodes: ethGly.nodes,
reactions: ethGly.reactions.concat(ethanolReactions()),
order: ethGly.order.concat(['pdecarb', 'adh']),
start: ['glc'],
regions: [glycolysisRegion('quá trình lên men rượu', 1520)],
notes: glycolysisNotes('các bước 6 đến 12').concat([note('Men, hàm lượng O₂ thấp', COL + 570, row(9) - 110, 'middle')]),
summary: SUMMARY_ETOH,
region: ['gly', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var pdhRing = tcaPart(1100, 900, null);
var pdhNodes = pdhRing.nodes;
pdhNodes.pyr = node('pyruvate', 150, 150);
pdhNodes.acetylcoa = node('acetylcoa', 530, 150);
var pdhtca = {
id: 'pdhtca', title: 'Pyruvate thành CO₂ (Pyruvate to CO₂)', subtitle: 'Pyruvate dehydrogenase và chu trình TCA', tag: 'PDH',
location: 'Chất nền ty thể', color: '#7FB8E8',
nodes: pdhNodes,
reactions: [linkReaction()].concat(pdhRing.reactions),
order: ['pdc'].concat(pdhRing.order),
start: ['pyr'],
regions: pdhRing.regions, notes: [], summary: SUMMARY_PDHTCA,
region: ['tca', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var boxParts = betaoxPart();
var betaox = {
id: 'betaox', title: 'Oxi hóa Beta (Nâng cao)', subtitle: 'Chuyển hóa chất béo thành acetyl-CoA', tag: 'FAO',
location: 'Chất nền tế bào và ty thể', color: '#F0A878',
nodes: boxParts.nodes, reactions: boxParts.reactions, order: boxParts.order, start: ['tag'],
regions: boxParts.regions, notes: boxParts.notes, summary: SUMMARY_BETAOX,
region: ['tca', 'both', 'all', 'lipid'], noDistractor: ['hplus', 'mg']
};
var boxSimpleParts = boxSimplePart();
var boxsimple = {
id: 'boxsimple', title: 'Oxi hóa Beta (Cơ bản)', subtitle: 'Chu trình bốn bước phân cắt acid béo thành acetyl-CoA', tag: 'BOS', simpleOf: 'betaox',
location: 'Chất nền tế bào và ty thể', color: '#F0A878',
nodes: boxSimpleParts.nodes, reactions: boxSimpleParts.reactions, order: boxSimpleParts.order, start: ['fa'],
regions: boxSimpleParts.regions, notes: boxSimpleParts.notes, summary: SUMMARY_BOXSIMPLE,
region: ['lipid', 'all'],
noDistractor: ['hplus', 'mg', 'cpt1', 'lipase', 'acc', 'co2', 'hco3', 'nadp', 'nadph', 'o2', 'q', 'cytcox', 'glutc', 'akgc', 'gtp', 'gdp']
};
var etcParts = etcPart();
var etc = {
id: 'etc', title: 'Chuỗi vận chuyển electron (Electron Transport Chain)', subtitle: 'NADH và FADH₂ chuyển electron đến oxygen và tạo ATP', tag: 'ETC',
location: 'màng trong ty thể', color: '#B596F2',
nodes: etcParts.nodes, reactions: etcParts.reactions, order: etcParts.order,
start: ['nadh', 'fadh2', 'adp'],
regions: etcParts.regions, notes: etcParts.notes, summary: SUMMARY_ETC,
region: ['etc', 'all'], noDistractor: ['mg']
};
var etcSimpleParts = etcSimplePart();
var etcsimple = {
id: 'etcsimple', title: 'Vận chuyển electron (cơ bản)', subtitle: 'Truyền electron từ NADH và FADH₂ đến oxygen, sau đó tạo ATP', tag: 'ETS', simpleOf: 'etc',
location: 'màng trong ty thể', color: '#B596F2', terms: { enz: 'complex' },
nodes: etcSimpleParts.nodes, reactions: etcSimpleParts.reactions, order: etcSimpleParts.order,
start: ['nadh', 'fadh2', 'adp'],
regions: etcSimpleParts.regions, notes: etcSimpleParts.notes, summary: SUMMARY_ETCSIMPLE,
region: ['etc', 'all'],
noDistractor: ['mg', 'hplus', 'ucp1', 'aox', 'gpd2', 'ant', 'mkat', 'gaa', 'fmn', 'fes', 'cytb', 'cytc1', 'cyta', 'cyta3', 'cytcrel',
'amp', 'ppi', 'nadp', 'nadph', 'co2', 'hco3', 'glutc', 'akgc', 'gtp', 'gdp', 'coa']
};
var tcaStandalone = tcaPart(800, 800, [320, 150]);
var tca = {
id: 'tca', title: 'Chu trình TCA (TCA Cycle)', subtitle: 'Acetyl-CoA thành CO₂', tag: 'TCA',
location: 'Chất nền ty thể', color: '#6CB4EE',
nodes: tcaStandalone.nodes, reactions: tcaStandalone.reactions, order: tcaStandalone.order,
start: ['acetylcoa'], regions: tcaStandalone.regions, notes: tcaStandalone.notes, summary: SUMMARY_TCA,
region: ['tca', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var fullGly = clone(gly);
var fullTca = tcaPart(1300, 3450, null);
var fullNodes = fullGly.nodes;
fullNodes.acetylcoa = node('acetylcoa', COL + 380, row(9));
Object.keys(fullTca.nodes).forEach(function (id) { fullNodes[id] = fullTca.nodes[id]; });
var full = {
id: 'full', title: 'Từ glucose đến CO₂ (Glucose to CO₂)', subtitle: 'Đường phân, phản ứng chuyển tiếp và chu trình TCA', tag: 'FULL',
location: 'Tế bào chất, sau đó là ty thể', color: '#8BD17C',
nodes: fullNodes,
reactions: fullGly.reactions.concat([linkReaction()], fullTca.reactions),
order: fullGly.order.concat(['pdc'], fullTca.order),
start: ['glc'],
regions: fullGly.regions.concat(fullTca.regions),
notes: fullGly.notes,
summary: SUMMARY_FULL,
region: ['gly', 'tca', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var etcPathParts = etcPathPart();
var etcpath = {
id: 'etcpath', title: 'Thứ tự các chất mang electron (Electron Carriers in Order)', subtitle: 'Truyền electron từ NADH đến oxygen qua từng chất mang electron', tag: 'ETP',
location: 'màng trong ty thể', color: '#B596F2',
nodes: etcPathParts.nodes, reactions: etcPathParts.reactions, order: etcPathParts.order, start: ['nadh'],
regions: etcPathParts.regions, notes: etcPathParts.notes, summary: SUMMARY_ETCPATH,
region: ['etc', 'all'], noDistractor: ['mg']
};
var gpParts = glycerolShuttlePart();
var gpshuttle = {
id: 'gpshuttle', title: 'Con thoi glycerol phosphate', subtitle: 'Truyền electron từ NADH trong bào tương đến ubiquinone', tag: 'GPS',
location: 'Tế bào chất và màng trong ty thể', color: '#E9B96E',
nodes: gpParts.nodes, reactions: gpParts.reactions, order: gpParts.order, start: ['dhap'],
regions: gpParts.regions, membranes: gpParts.membranes, notes: gpParts.notes, summary: SUMMARY_GPSHUTTLE,
region: ['gly', 'etc', 'both', 'all'], noDistractor: ['mg']
};
var maParts = malateAspartateShuttlePart();
var masshuttle = {
id: 'masshuttle', title: 'Con thoi malate-aspartate', subtitle: 'Chuyển electron từ NADH trong bào tương thành NADH trong chất nền ty thể', tag: 'MAS',
location: 'Chất nền tế bào và ty thể', color: '#6CB4EE', terms: { enz: 'protein' },
nodes: maParts.nodes, reactions: maParts.reactions, order: maParts.order, start: ['oaa'],
regions: maParts.regions, membranes: maParts.membranes, notes: maParts.notes, summary: SUMMARY_MASHUTTLE,
region: ['tca', 'etc', 'both', 'all'], noDistractor: ['mg']
};
var antParts = atpExportPart();
var antport = {
id: 'antport', title: 'Tổng hợp và vận chuyển ATP ra ngoài (ATP Synthesis and Export)', subtitle: 'ATP synthase và ATP-ADP translocase', tag: 'ANT',
location: 'màng trong ty thể', color: '#8BD17C', terms: { enz: 'protein' },
nodes: antParts.nodes, reactions: antParts.reactions, order: antParts.order, start: ['adp'],
regions: antParts.regions, membranes: antParts.membranes, notes: antParts.notes, summary: SUMMARY_ANTPORT,
region: ['etc', 'all'], noDistractor: ['mg']
};
var pyeParts = pyruvateEntryPart();
var pyrentry = {
id: 'pyrentry', title: 'Pyruvate đi vào ty thể và phản ứng chuyển tiếp (Pyruvate Entry and Link Reaction)', subtitle: 'Đi qua hai lớp màng để tạo acetyl-CoA', tag: 'PYE',
location: 'Tế bào chất, màng ty thể và chất nền', color: '#F2B35E',
nodes: pyeParts.nodes, reactions: pyeParts.reactions, order: pyeParts.order, start: ['pyrc'],
regions: pyeParts.regions, membranes: pyeParts.membranes, notes: pyeParts.notes, summary: SUMMARY_PYRENTRY,
region: ['tca', 'mito', 'both', 'all'], noDistractor: ['mg'], terms: { enz: 'protein' }
};
var mdParts = mitoDynamicsPart();
var mitodyn = {
id: 'mitodyn', title: 'Phân chia và hợp nhất ty thể (Mitochondrial Fission and Fusion)', subtitle: 'Cách ty thể phân chia và hợp nhất', tag: 'MDY',
location: 'Màng ty thể', color: '#7BC8A4',
nodes: mdParts.nodes, reactions: mdParts.reactions, order: mdParts.order, start: ['fused'],
regions: mdParts.regions, notes: mdParts.notes, summary: SUMMARY_MITODYN,
region: ['dyn', 'all'], noDistractor: ['mg'], terms: { enz: 'protein' }
};
var aiParts = intrinsicApoptosisPart();
var apopint = {
id: 'apopint', title: 'Apoptosis: con đường nội sinh (Intrinsic Pathway)', subtitle: 'Con đường gây chết tế bào qua ty thể', tag: 'AIN',
location: 'Ty thể và tế bào chất', color: '#E56F6F', big: true, terms: { enz: 'protein' },
nodes: aiParts.nodes, reactions: aiParts.reactions, order: aiParts.order, start: ['dna', 'prot'],
regions: aiParts.regions, notes: aiParts.notes, summary: SUMMARY_APOINT,
region: ['apop'], noDistractor: ['mg']
};
var aeParts = extrinsicApoptosisPart();
var apopext = {
id: 'apopext', title: 'Apoptosis: con đường ngoại sinh (Extrinsic Pathway)', subtitle: 'Con đường gây chết tế bào thông qua thụ thể chết', tag: 'AEX',
location: 'màng sinh chất và tế bào chất', color: '#B58AE0', big: true, terms: { enz: 'protein' },
nodes: aeParts.nodes, reactions: aeParts.reactions, order: aeParts.order, start: ['tnf', 'prot'],
regions: aeParts.regions, notes: aeParts.notes, summary: SUMMARY_APOEXT,
region: ['apop'], noDistractor: ['mg']
};
var ureaParts = ureaCyclePart();
var urea = {
id: 'urea', title: 'Chu trình urea (Urea Cycle)', subtitle: 'Chuyển ammonia thành urea', tag: 'URE',
location: 'Gan: chất nền ty thể và bào tương', color: '#C79BE0',
nodes: ureaParts.nodes, reactions: ureaParts.reactions, order: ureaParts.order, start: ['nh4'],
regions: ureaParts.regions, membranes: ureaParts.membranes, notes: ureaParts.notes, summary: SUMMARY_UREA,
region: ['urea', 'all'], noDistractor: ['hplus', 'mg']
};
var glParts = glutamateAlaninePart();
var gluala = {
id: 'gluala', title: 'Glutamate và alanine (Glutamate and Alanine)', subtitle: 'Thu nhận và giải phóng ammonium, cùng các enzyme transaminase', tag: 'GLA',
location: 'Chất nền bào tương và ty thể của gan, thận, cơ và não', color: '#8FC1E3',
nodes: glParts.nodes, reactions: glParts.reactions, order: glParts.order, start: ['akg1', 'nh41', 'ala', 'asp'],
regions: glParts.regions, notes: glParts.notes, summary: SUMMARY_GLUALA,
region: ['urea', 'tca', 'both', 'all'], noDistractor: ['hplus', 'mg']
};
var lipidMolecules = {
    malonylcoa: {
      name: 'Malonyl-CoA', short: 'Mal-CoA', family: 'lipid', lines: ['Malonyl-CoA'],
      aliases: ['malonyl-coa', 'malonyl coa', 'mal-coa', 'malonyl-coenzyme a'],
      note: 'Sản phẩm carboxyl hóa của acetyl-CoA, chất cho 2C trong mỗi vòng kéo dài mạch acid béo và là chất ức chế CAT I.'
    },
    acetoacetylacp: {
      name: 'β-Ketobutyryl-ACP', short: 'AcAc-ACP', family: 'lipid', lines: ['β-Ketobutyryl-', 'ACP'],
      aliases: ['acetoacetyl-acp', 'acetoacetyl acp', 'b-ketobutyryl-acp', 'beta-ketobutyryl-acp', 'acetoacetylacp'],
      note: 'Sản phẩm ngưng tụ đầu tiên giữa gốc acetyl và malonyl-ACP trên phức hệ FAS, giải phóng CO₂.'
    },
    hydroxybutyrylacp: {
      name: 'D-β-Hydroxybutyryl-ACP', short: 'OH-But-ACP', family: 'lipid', lines: ['D-β-Hydroxy-', 'butyryl-ACP'],
      aliases: ['d-b-hydroxybutyryl-acp', 'hydroxybutyryl-acp', 'beta-hydroxybutyryl-acp', 'hydroxybutyrylacp'],
      note: 'Đồng phân D-hydroxy tạo thành nhờ phản ứng khử nhóm keto bởi NADPH.'
    },
    butenoylacp: {
      name: 'trans-Δ²-Butenoyl-ACP', short: 'Enoyl-ACP', family: 'lipid', lines: ['trans-Δ²-', 'Butenoyl-ACP'],
      aliases: ['trans-d2-butenoyl-acp', 'butenoyl-acp', 'crotonyl-acp', 'trans-butenoyl-acp'],
      note: 'Chất trung gian có liên kết đôi trans tạo ra sau phản ứng khử nước.'
    },
    butyrylacp: {
      name: 'Butyryl-ACP', short: 'But-ACP', family: 'lipid', lines: ['Butyryl-ACP'],
      aliases: ['butyryl-acp', 'butyryl acp', 'butyrylacp'],
      note: 'Sản phẩm 4C bão hòa kết thúc vòng 1 của phức hệ FAS, sẵn sàng chuyển sang KS để lặp vòng tiếp theo.'
    },
    palmitoylacp: {
      name: 'Palmitoyl-ACP', short: 'Palm-ACP', family: 'lipid', lines: ['Palmitoyl-ACP', '(C16)'],
      aliases: ['palmitoyl-acp', 'palmitoyl acp', 'palmitoylacp'],
      note: 'Acyl-ACP 16 carbon hoàn chỉnh sau 7 vòng lặp của phức hệ FAS, cơ chất cho thioesterase.'
    },
    palmitate: {
      name: 'Palmitate', short: 'Palm (16:0)', family: 'lipid', lines: ['Palmitate', '(16:0)'],
      aliases: ['palmitate', 'palmitic acid', '16:0', 'hexadecanoate'],
      note: 'Acid béo bão hòa 16 carbon, sản phẩm chính giải phóng từ phức hệ FAS ở động vật.'
    },
    palmitoleate: {
      name: 'Palmitoleate', short: '16:1(Δ⁹)', family: 'lipid', lines: ['Palmitoleate', '16:1(Δ⁹)'],
      aliases: ['palmitoleate', 'palmitoleic acid', '16:1', 'cis-9-hexadecenoate'],
      note: 'Acid béo không no một nối đôi (cis-Δ⁹) tạo ra từ palmitate nhờ Δ⁹-desaturase.'
    },
    stearate: {
      name: 'Stearate', short: 'Ste (18:0)', family: 'lipid', lines: ['Stearate', '(18:0)'],
      aliases: ['stearate', 'stearic acid', '18:0', 'octadecanoate'],
      note: 'Acid béo bão hòa 18 carbon tạo thành khi kéo dài chuỗi palmitate thêm 2 carbon tại màng ER/ty thể.'
    },
    lsf: {
      name: 'Very Long-Chain Fatty Acids (VLCFA)', short: 'VLCFA (≥20C)', family: 'lipid', lines: ['VLCFA (≥20C)', '(Very Long-Chain)'],
      aliases: ['vlcfa', 'very long-chain fatty acids', 'longer saturated fatty acids', 'lsf', 'lsfa', 'arachidate', 'lignocerate', 'behenate'],
      note: 'Các acid béo no chuỗi rất dài (VLCFA: C20, C22, C24...) được tổng hợp qua các bước kéo dài liên tiếp tại ER.'
    },
    oleate: {
      name: 'Oleate', short: 'Ole (18:1)', family: 'lipid', lines: ['Oleate', '18:1(Δ⁹)'],
      aliases: ['oleate', 'oleic acid', '18:1', 'cis-9-octadecenoate'],
      note: 'Acid béo không no một nối đôi 18 carbon (cis-Δ⁹) phổ biến nhất trong lipid màng và dự trữ.'
    },
    linoleate: {
      name: 'Linoleate', short: 'Lin (18:2)', family: 'lipid', lines: ['Linoleate', '18:2(Δ⁹,¹²)'],
      aliases: ['linoleate', 'linoleic acid', '18:2', 'omega-6'],
      note: 'Acid béo thiết yếu omega-6 có hai nối đôi, động vật không tự tổng hợp được mà phải thu nhận từ thực vật.'
    },
    alinolenate: {
      name: 'α-Linolenate', short: 'ALA (18:3)', family: 'lipid', lines: ['α-Linolenate', '18:3(Δ⁹,¹²,¹⁵)'],
      aliases: ['a-linolenate', 'alpha-linolenate', 'ala', '18:3', 'omega-3'],
      note: 'Acid béo thiết yếu omega-3 có ba nối đôi ở thực vật, tiền chất tổng hợp EPA và DHA.'
    },
    pufa: {
      name: 'Các axit béo không bão hòa đa khác (EPA, DHA)', short: 'PUFA (ω-3)', family: 'lipid', lines: ['PUFA khác', '(EPA, DHA)'],
      aliases: ['pufa', 'other polyunsaturated fatty acids', 'epa', 'dha', 'polyunsaturated fatty acids'],
      note: 'Các acid béo không no nhiều nối đôi chuỗi dài omega-3 đóng vai trò quan trọng trong não bộ và màng tế bào.'
    },
    glinolenate: {
      name: 'γ-Linolenate', short: 'GLA (18:3)', family: 'lipid', lines: ['γ-Linolenate', '18:3(Δ⁶,⁹,¹²)'],
      aliases: ['g-linolenate', 'gamma-linolenate', 'gla', 'gamma-linolenic acid'],
      note: 'Sản phẩm của phản ứng khử bão hòa linoleate bởi Δ⁶-desaturase trên con đường tạo arachidonate.'
    },
    eicosatrienoate: {
      name: 'Eicosatrienoate', short: '20:3', family: 'lipid', lines: ['Eicosatrienoate', '20:3(Δ⁸,¹¹,¹⁴)'],
      aliases: ['eicosatrienoate', 'dihomo-gamma-linolenate', 'dgla', '20:3'],
      note: 'Chất trung gian 20 carbon có 3 nối đôi sau khi kéo dài chuỗi γ-linolenate.'
    },
    arachidonate: {
      name: 'Arachidonate', short: 'Ara (20:4)', family: 'lipid', lines: ['Arachidonate', '20:4(Δ⁵,⁸,¹¹,¹⁴)'],
      aliases: ['arachidonate', 'arachidonic acid', 'ara', '20:4', 'omega-6 ara'],
      note: 'Acid béo omega-6 có 4 nối đôi (20:4), tiền chất chính để sinh tổng hợp eicosanoid (prostaglandin, leukotriene).'
    },
    pcoleate: {
      name: 'PC-Oleate (18:1)', short: 'PC-Oleate', family: 'lipid', lines: ['PC-Oleate', '18:1(Δ⁹)'],
      aliases: ['pc-oleate', 'phosphatidylcholine oleate'],
      note: 'Phosphatidylcholine gắn gốc oleate trên màng, nơi diễn ra phản ứng khử bão hòa trực tiếp.'
    },
    pclinoleate: {
      name: 'PC-Linoleate (18:2)', short: 'PC-Linoleate', family: 'lipid', lines: ['PC-Linoleate', '18:2(Δ⁹,¹²)'],
      aliases: ['pc-linoleate', 'phosphatidylcholine linoleate'],
      note: 'Phosphatidylcholine chứa gốc linoleate tạo ra bởi desaturase màng ở thực vật.'
    },
    pclinolenate: {
      name: 'PC-Linolenate (18:3)', short: 'PC-Linolenate', family: 'lipid', lines: ['PC-Linolenate', '18:3(Δ⁹,¹²,¹⁵)'],
      aliases: ['pc-linolenate', 'phosphatidylcholine linolenate'],
      note: 'Phosphatidylcholine chứa gốc linolenate giàu PUFA trên màng tế bào.'
    },
    cytb5red: {
      name: 'Cyt b₅ reductase', short: 'b₅ Reductase', family: 'redox', lines: ['Cyt b₅', 'reductase'],
      aliases: ['cyt b5 reductase', 'cytochrome b5 reductase'],
      note: 'Flavoprotein chứa FAD nhận 2 electron từ NADPH để khử cytochrome b₅.'
    },
    cytb5: {
      name: 'Cytochrome b₅', short: 'Cyt b₅', family: 'redox', lines: ['Cytochrome', 'b₅ (Fe²⁺/Fe³⁺)'],
      aliases: ['cyt b5', 'cytochrome b5'],
      note: 'Protein chứa nhân heme truyền electron từ reductase sang phức hệ acyl-CoA desaturase.'
    },
    desatcomp: {
      name: 'Acyl-CoA desaturase', short: 'Khử bão hòa', family: 'lipid', lines: ['Acyl-CoA', 'desaturase'],
      aliases: ['acyl-coa desaturase', 'fatty acyl-coa desaturase'],
      note: 'Enzyme gắn màng ER xúc tác phản ứng tạo liên kết đôi cis đồng thời khử O₂ thành 2 H₂O.'
    },
    dag: {
      name: '1,2-Diacylglycerol (DAG)', short: 'DAG', family: 'lipid', lines: ['1,2-Diacylglycerol', '(DAG)'],
      aliases: ['dag', 'diacylglycerol', '1,2-diacylglycerol', 'diglyceride', '1,2-dag'],
      note: 'Chất trung gian mang hai gốc acyl và một nhóm OH tự do, tiền chất trực tiếp để tổng hợp TAG.'
    },
    gly3p: {
      name: 'L-Glycerol 3-phosphate', short: 'Gly-3-P', family: 'lipid', lines: ['L-Glycerol', '3-phosphate'],
      aliases: ['gly3p', 'l-glycerol 3-phosphate', 'glycerol 3-phosphate', 'glycerol-3-p', 'gly-3-p', 'alpha-glycerophosphate'],
      note: 'Khung 3 carbon khởi đầu cho quá trình este hóa tổng hợp phosphatidic acid, TAG và phospholipid.'
    },
    fattyacid: {
      name: 'Fatty acid (R-COO⁻)', short: 'R-COO⁻', family: 'lipid', lines: ['Fatty acid', '(R-COO⁻)'],
      aliases: ['fatty acid', 'fatty acids', 'r-coo-', 'free fatty acid', 'ffa'],
      note: 'Acid béo tự do cần được hoạt hóa thành acyl-CoA trước khi tham gia phản ứng este hóa.'
    },
    fattyacylcoa: {
      name: 'Fatty acyl-CoA', short: 'Acyl-CoA', family: 'lipid', lines: ['Fatty acyl-CoA', '(R-CO-S-CoA)'],
      aliases: ['fatty acyl-coa', 'acyl-coa', 'fatty acyl coa', 'acyl coa'],
      note: 'Dạng hoạt hóa của acid béo mang liên kết thioester giàu năng lượng.'
    },
    lysopa: {
      name: 'Lysophosphatidic acid', short: 'LPA', family: 'lipid', lines: ['Lysophosphatidic', 'acid (LPA)'],
      aliases: ['lysophosphatidic acid', 'lpa', 'lysophosphatidate', '1-acyl-glycerol 3-phosphate'],
      note: 'Sản phẩm este hóa nhóm OH ở C1 của glycerol 3-phosphate với gốc acyl thứ nhất.'
    },
    pa: {
      name: 'Phosphatidic acid', short: 'PA', family: 'lipid', lines: ['Phosphatidic', 'acid (PA)'],
      aliases: ['phosphatidic acid', 'pa', 'phosphatidate', '1,2-diacylglycerol 3-phosphate'],
      note: 'Tiền chất trung tâm có 2 gốc acyl và 1 nhóm phosphat, rẽ nhánh sang TAG và glycerophospholipid.'
    },
    gpl: {
      name: 'PI, PG, Cardiolipin (CDP-DAG pathway)', short: 'PI, PG, CL', family: 'lipid', lines: ['GPL (CDP-DAG)', '(PI, PG, Cardiolipin)'],
      aliases: ['glycerophospholipid', 'gpl', 'phospholipid', 'pi, pg, cardiolipin', 'cardiolipin'],
      note: 'Các phospholipid màng tổng hợp từ Phosphatidic acid qua trung gian CDP-diacylglycerol (PI, PG, Cardiolipin).'
    },
    gplpcpe: {
      name: 'PC, PE (Kennedy pathway)', short: 'PC, PE', family: 'lipid', lines: ['PC & PE', '(Kennedy pathway)'],
      aliases: ['pc', 'pe', 'pc, pe', 'kennedy pathway', 'phosphatidylcholine', 'phosphatidylethanolamine'],
      note: 'Phosphatidylcholine (PC) và Phosphatidylethanolamine (PE) — hai phospholipid màng chính ở động vật tổng hợp từ 1,2-DAG qua con đường Kennedy.'
    },
    accact: {
      name: 'ACC (Đang hoạt động)', short: 'ACC (Active)', family: 'enzyme', lines: ['ACC (Hoạt động)', 'Đã khử P'],
      aliases: ['acc active', 'active acc', 'acc-active', 'acc'],
      note: 'Dạng hoạt động của Acetyl-CoA carboxylase khi được phosphatase khử nhóm phosphate (hoạt hóa bởi insulin và citrate).'
    },
    accinact: {
      name: 'ACC (Không hoạt động)', short: 'ACC-P', family: 'enzyme', lines: ['ACC (Bất hoạt)', 'Đã gắn P'],
      aliases: ['acc inactive', 'inactive acc', 'acc-inactive', 'p-acc'],
      note: 'Dạng bất hoạt của Acetyl-CoA carboxylase bị PKA hoặc AMPK gắn nhóm phosphate.'
    },
    insulin: {
      name: 'Insulin (Đường huyết cao)', short: 'Insulin', family: 'messenger', lines: ['Insulin', '(Đường huyết cao)'],
      aliases: ['insulin', 'high glucose', 'high blood glucose'],
      note: 'Hormone kích thích protein phosphatase khử phosphate hoạt hóa ACC, thúc đẩy tổng hợp lipid.'
    },
    glucagon: {
      name: 'Glucagon / Epinephrine (Đường huyết thấp)', short: 'Glucagon', family: 'messenger', lines: ['/ Epinephrine', '(Đường huyết thấp)'],
      aliases: ['glucagon', 'epinephrine', 'low glucose', 'low blood glucose'],
      note: 'Hormone báo hiệu đói/stress, hoạt hóa PKA phosphoryl hóa bất hoạt ACC, tắt tổng hợp acid béo.'
    },
    facylcoacyt: {
      name: 'Fatty acyl-CoA (Cytosol)', short: 'Acyl-CoA (Cyt)', family: 'lipid', lines: ['Fatty acyl-CoA', '(Cytosol)'],
      aliases: ['fatty acyl-coa (cytosol)', 'acyl-coa cytosol', 'facylcoacyt'],
      note: 'Fatty acyl-CoA ở bào tương cần carnitine để được vận chuyển qua màng ty thể.'
    },
    facylcarn: {
      name: 'Fatty acyl-carnitine', short: 'Acyl-Carnitine', family: 'lipid', lines: ['Fatty acyl-', 'carnitine'],
      aliases: ['fatty acyl-carnitine', 'acyl-carnitine', 'acylcarnitine'],
      note: 'Sản phẩm của CAT I (CPT1) tại màng ngoài ty thể, đi qua CACT vào chất nền.'
    },
    facylcoamat: {
      name: 'Fatty acyl-CoA (Matrix)', short: 'Acyl-CoA (Matrix)', family: 'lipid', lines: ['Fatty acyl-CoA', '(Matrix)'],
      aliases: ['fatty acyl-coa (matrix)', 'acyl-coa matrix', 'facylcoamat'],
      note: 'Tái tạo trong chất nền ty thể nhờ CAT II (CPT II), sẵn sàng đi vào β-oxidation.'
    },
    acetylcoamat: {
      name: 'Acetyl-CoA (Matrix)', short: 'AcCoA (Matrix)', family: 'coa', lines: ['Acetyl-CoA', '(Matrix)'],
      aliases: ['acetyl-coa (matrix)', 'acetyl coa matrix', 'accoamat'],
      note: 'Sản phẩm cuối cùng của chu trình β-oxidation trong chất nền ty thể.'
    },
    fascharged: {
      name: 'Phức hệ FAS đã nạp', short: 'FAS (Đã nạp)', family: 'lipid', lines: ['Phức hệ FAS', '(KS-Acyl+ACP-Mal)'],
      aliases: ['fas', 'charged fas', 'phuc he fas'],
      note: 'Phức hệ FAS đã nạp (Vòng 1: KS-Ac + ACP-Mal; Vòng 2–7: KS-Acyl + ACP-Mal).'
    },
    acylks: {
      name: 'Acyl-KS + ACP-SH tự do', short: 'Acyl-KS', family: 'lipid', lines: ['Acyl-KS +', 'ACP-SH tự do'],
      aliases: ['acyl-ks', 'acyl ks'],
      note: 'Gốc acyl được chuyển vị từ ACP sang Cys (-SH) của KS để giải phóng ACP-SH tiếp nhận Malonyl-CoA mới.'
    },
    satfacylcoa: {
      name: 'Saturated fatty acyl-CoA', short: 'Acyl-CoA (No)', family: 'lipid', lines: ['Saturated', 'fatty acyl-CoA'],
      aliases: ['saturated fatty acyl-coa', 'saturated acyl-coa'],
      note: 'Axit béo hoạt hóa dạng mạch no (+ O₂ + 2 H⁺), cơ chất của hệ Fatty acyl-CoA desaturase.'
    },
    monounsatfacylcoa: {
      name: 'Monounsaturated fatty acyl-CoA', short: 'Acyl-CoA (1=)', family: 'lipid', lines: ['Monounsaturated', 'fatty acyl-CoA'],
      aliases: ['monounsaturated fatty acyl-coa'],
      note: 'Sản phẩm mang một liên kết đôi cis (ví dụ Oleoyl-CoA hoặc Palmitoleoyl-CoA).'
    },
    fadfadh2: {
      name: 'FAD → FADH₂ (Nhóm ngoại Cyt b₅ reductase)', short: 'FAD → FADH₂', family: 'redox', lines: ['FAD → FADH₂', '(Cyt b₅ reductase)'],
      aliases: ['fad', 'fadh2', 'fad/fadh2', 'cyt b5 reductase fad'],
      note: 'Nhóm ngoại flavin gắn chặt trên Cytochrome b₅ reductase, nhận 2e⁻ từ NADPH + H⁺ rồi truyền từng 1e⁻ sang 2 Cyt b₅.'
    },
    ampksig: {
      name: 'AMPK (Năng lượng thấp / ↑ AMP)', short: 'AMPK (↑ AMP)', family: 'messenger', lines: ['AMPK', '(Năng lượng thấp)'],
      aliases: ['ampk', 'amp-activated protein kinase'],
      note: 'Khi năng lượng tế bào thấp (↑ AMP/ATP), AMPK phosphoryl hóa bất hoạt ACC.'
    },
    citratesig: {
      name: 'Citrate (Hoạt hóa dị lập thể)', short: 'Citrate', family: 'acid', lines: ['Citrate', '(Dị lập thể +)'],
      aliases: ['citrate', 'citric acid'],
      note: 'Chất hoạt hóa dị lập thể mạnh của ACC, thúc đẩy trùng hợp dạng sợi hoạt động.'
    },
    palmsig: {
      name: 'Palmitoyl-CoA (Ức chế ngược)', short: 'Palmitoyl-CoA', family: 'lipid', lines: ['Palmitoyl-CoA', '(Ức chế ngược −)'],
      aliases: ['palmitoyl-coa', 'palmitoyl coa'],
      note: 'Sản phẩm cuối ức chế dị lập thể ngược (feedback inhibition) ACC.'
    },
    nadphnode: {
      name: 'NADPH + H⁺', short: 'NADPH + H⁺', family: 'redox', lines: ['NADPH + H⁺'],
      aliases: ['nadph', 'nadph + h+'],
      note: 'Nguồn cung cấp 2 electron khử cho chuỗi truyền electron desaturase.'
    },
    dietcarb: {
      name: 'Carbohydrate thức ăn', short: 'Carb thức ăn', family: 'sugar', lines: ['Carbohydrate', 'thức ăn'],
      aliases: ['dietary carbohydrate', 'carbohydrate'],
      note: 'Nguồn tinh bột/đường từ bữa ăn làm tăng đường huyết và cung cấp glucose.'
    },
    highglc: {
      name: 'Đường huyết cao', short: 'Đường huyết ↑', family: 'messenger', lines: ['Đường huyết', 'cao'],
      aliases: ['high blood glucose', 'high glucose'],
      note: 'Trạng thái sau ăn kích thích tế bào beta tụy tiết Insulin.'
    },
    lowglc: {
      name: 'Đường huyết thấp', short: 'Đường huyết ↓', family: 'messenger', lines: ['Đường huyết', 'thấp'],
      aliases: ['low blood glucose', 'low glucose'],
      note: 'Trạng thái đói kích thích tế bào alpha tụy tiết Glucagon.'
    }
  };

  var lipidEnzymes = {
    mat: {
      name: 'Malonyl/acetyl-CoA-ACP transferase', short: 'MAT', ec: '2.3.1.39', family: 'transferase',
      aliases: ['mat', 'at', 'mt', 'malonyl/acetyl transferase'],
      note: 'Nạp các gốc acetyl và malonyl từ CoA lên các nhóm -SH của KS và ACP trên phức hệ FAS.'
    },
    ks: {
      name: 'β-Ketoacyl-ACP synthase', short: 'KS', ec: '2.3.1.41', family: 'synthase',
      aliases: ['ks', 'beta-ketoacyl-acp synthase', 'ketoacyl synthase'],
      note: 'Ngưng tụ gốc acyl với malonyl-ACP, giải phóng CO₂ để kéo dài chuỗi thêm 2 carbon.'
    },
    kr: {
      name: 'β-Ketoacyl-ACP reductase', short: 'KR', ec: '1.1.1.100', family: 'oxidoreductase',
      aliases: ['kr', 'beta-ketoacyl-acp reductase', 'ketoacyl reductase'],
      note: 'Khử nhóm β-keto thành nhóm hydroxyl sử dụng lực khử từ NADPH.'
    },
    dhfas: {
      name: 'β-Hydroxyacyl-ACP dehydratase', short: 'DH', ec: '4.2.1.59', family: 'lyase',
      aliases: ['dh', 'hd', 'hydroxyacyl dehydratase', 'dehydratase'],
      note: 'Khử nước tạo liên kết đôi trans-Δ² trên mạch acyl gắn ACP.'
    },
    er: {
      name: 'Enoyl-ACP reductase', short: 'ER', ec: '1.3.1.9', family: 'oxidoreductase',
      aliases: ['er', 'enoyl-acp reductase', 'enoyl reductase'],
      note: 'Khử liên kết đôi trans-Δ² thành liên kết đơn bão hòa bằng NADPH.'
    },
    te: {
      name: 'Thioesterase', short: 'TE', ec: '3.1.2.14', family: 'hydrolase',
      aliases: ['te', 'thioesterase', 'palmitoyl thioesterase'],
      note: 'Thủy phân liên kết thioester giải phóng palmitate tự do khi chuỗi đạt độ dài 16 carbon.'
    },
    elongase: {
      name: 'Fatty acid elongase', short: 'Elongase', ec: '2.3.1.199', family: 'transferase',
      aliases: ['elongase', 'fatty acid elongase', 'elovl'],
      note: 'Hệ thống kéo dài chuỗi tại màng lưới nội chất (ER), dùng Malonyl-CoA và 2 NADPH để thêm 2 carbon.'
    },
    desat9: {
      name: 'Stearoyl-CoA desaturase (Δ⁹)', short: 'Δ⁹-Desat', ec: '1.14.19.1', family: 'oxidoreductase',
      aliases: ['desaturase', 'd9-desaturase', 'stearoyl-coa desaturase', 'scd', 'delta 9 desaturase'],
      note: 'Tạo liên kết đôi cis tại vị trí carbon 9 trên palmitate và stearate.'
    },
    desat12: {
      name: 'Δ¹²-Fatty acid desaturase (Plants)', short: 'Δ¹²-Desat', ec: '1.14.19.6', family: 'oxidoreductase',
      aliases: ['d12-desaturase', 'delta 12 desaturase', 'fad2'],
      note: 'Tạo liên kết đôi cis tại vị trí carbon 12 trên lipid màng Phosphatidylcholine (chỉ có ở thực vật).'
    },
    desat15: {
      name: 'Δ¹⁵-Fatty acid desaturase (Plants)', short: 'Δ¹⁵-Desat', ec: '1.14.19.7', family: 'oxidoreductase',
      aliases: ['d15-desaturase', 'delta 15 desaturase', 'fad3'],
      note: 'Tạo liên kết đôi cis tại vị trí carbon 15 trên lipid màng Phosphatidylcholine (chỉ có ở thực vật).'
    },
    desat6: {
      name: 'Δ⁶-Fatty acid desaturase', short: 'Δ⁶-Desat', ec: '1.14.19.3', family: 'oxidoreductase',
      aliases: ['d6-desaturase', 'delta 6 desaturase', 'fads2'],
      note: 'Khử bão hòa linoleate thành gamma-linolenate ở động vật.'
    },
    desat5: {
      name: 'Δ⁵-Fatty acid desaturase', short: 'Δ⁵-Desat', ec: '1.14.19.34', family: 'oxidoreductase',
      aliases: ['d5-desaturase', 'delta 5 desaturase', 'fads1'],
      note: 'Khử bão hòa eicosatrienoate thành arachidonate (20:4) ở động vật.'
    },
    cb5r: {
      name: 'Cytochrome b₅ reductase', short: 'Cyt b₅ Red', ec: '1.6.2.2', family: 'oxidoreductase',
      aliases: ['cyt b5 reductase', 'cytochrome b5 reductase', 'cb5r'],
      note: 'Chuyển electron từ NADPH qua FAD tới cytochrome b₅.'
    },
    gpdh: {
      name: 'Glycerol-3-phosphate dehydrogenase', short: 'GPDH', ec: '1.1.1.8', family: 'oxidoreductase',
      aliases: ['gpdh', 'glycerol-3-phosphate dehydrogenase', 'gpd1'],
      note: 'Khử dihydroxyacetone phosphate (DHAP) thành L-glycerol 3-phosphate bằng NADH.'
    },
    gk: {
      name: 'Glycerol kinase', short: 'GK', ec: '2.7.1.30', family: 'kinase',
      aliases: ['gk', 'glycerol kinase'],
      note: 'Phosphoryl hóa glycerol tự do bằng ATP tại gan.'
    },
    facs: {
      name: 'Fatty acyl-CoA synthetase', short: 'FACS', ec: '6.2.1.3', family: 'ligase',
      aliases: ['facs', 'acyl-coa synthetase', 'fatty acid thiokinase'],
      note: 'Hoạt hóa acid béo tự do thành fatty acyl-CoA tiêu tốn 2 liên kết phosphate giàu năng lượng (ATP -> AMP + PPi).'
    },
    gpat: {
      name: 'Glycerol-3-phosphate acyltransferase', short: 'GPAT', ec: '2.3.1.15', family: 'transferase',
      aliases: ['gpat', 'glycerol-3-phosphate acyltransferase'],
      note: 'Gắn gốc acyl thứ nhất vào vị trí C1 của L-glycerol 3-phosphate tạo lysophosphatidic acid.'
    },
    agpat: {
      name: '1-Acylglycerol-3-phosphate acyltransferase', short: 'AGPAT', ec: '2.3.1.51', family: 'transferase',
      aliases: ['agpat', 'acylglycerol-3-phosphate acyltransferase'],
      note: 'Gắn gốc acyl thứ hai vào vị trí C2 của lysophosphatidic acid tạo phosphatidic acid.'
    },
    pap: {
      name: 'Phosphatidic acid phosphatase (Lipin)', short: 'PAP', ec: '3.1.3.4', family: 'hydrolase',
      aliases: ['pap', 'lipin', 'phosphatidate phosphatase'],
      note: 'Thủy phân nhóm phosphate của phosphatidic acid tạo thành 1,2-diacylglycerol (DAG).'
    },
    dgat: {
      name: 'Diacylglycerol acyltransferase', short: 'DGAT', ec: '2.3.1.20', family: 'transferase',
      aliases: ['dgat', 'diacylglycerol acyltransferase'],
      note: 'Bước cam kết gắn gốc acyl thứ ba vào DAG tạo triacylglycerol (TAG) dự trữ.'
    },
    cdpdags: {
      name: 'CDP-DAG synthase', short: 'CDP-DAG synthase', ec: '2.7.7.41', family: 'transferase',
      aliases: ['cdpdags', 'cdp-dag synthase', 'phosphatidate cytidylyltransferase'],
      note: 'Hoạt hóa Phosphatidic acid bằng CTP (giải phóng PPᵢ) tạo CDP-DAG để tổng hợp PI, PG và Cardiolipin.'
    },
    pphosphatase: {
      name: 'Protein phosphatase', short: 'Phosphatase', ec: '3.1.3.16', family: 'hydrolase',
      aliases: ['protein phosphatase', 'phosphatase', 'pp2a'],
      note: 'Khử nhóm phosphate gắn trên ACC dưới kích thích của insulin, chuyển ACC sang trạng thái hoạt động.'
    },
    pka: {
      name: 'Protein kinase A (PKA)', short: 'PKA', ec: '2.7.11.11', family: 'kinase',
      aliases: ['pka', 'protein kinase a'],
      note: 'Gắn nhóm phosphate vào ACC dưới kích thích của glucagon/epinephrine, ức chế tổng hợp acid béo khi đói.'
    },
    cact: {
      name: 'Carnitine-acylcarnitine translocase & CAT II (CPT II)', short: 'CACT & CAT II', ec: '2.3.1.21', family: 'translocase',
      aliases: ['cact', 'carnitine translocase', 'cat ii', 'cpt ii', 'cpt2'],
      note: 'Translocase đưa fatty acyl-carnitine qua màng trong vào matrix, sau đó CAT II (CPT II) gắn lại CoA-SH và giải phóng Carnitine.'
    },
    cpt2: {
      name: 'Carnitine palmitoyltransferase II', short: 'CPT2', ec: '2.3.1.21', family: 'transferase',
      aliases: ['cpt2', 'cpt-2', 'carnitine acyltransferase ii'],
      note: 'Tái tạo fatty acyl-CoA từ fatty acyl-carnitine bên trong matrix ty thể.'
    },
    betaoxenz: {
      name: 'β-Oxidation enzymes', short: 'β-Oxidation', ec: '1.1.1.35', family: 'oxidoreductase',
      aliases: ['beta-oxidation', 'beta oxidation', 'fao'],
      note: 'Bốn phản ứng thoái hóa acid béo sinh FADH₂, NADH và giải phóng acetyl-CoA trong ty thể.'
    },
    glycpdh: {
      name: 'Đường phân → PDH (ty thể) → Con thoi Citrate & ATP-citrate lyase', short: 'Gly→PDH→Citrate→ACL', ec: '2.3.3.8', family: 'oxidoreductase',
      aliases: ['glycolysis', 'pdh', 'citrate shuttle', 'atp-citrate lyase', 'acl'],
      note: 'Glucose qua đường phân tạo Pyruvate vào ty thể (PDH → Acetyl-CoA → Citrate), xuất ra bào tương qua con thoi Citrate và được ATP-citrate lyase cắt lại thành Acetyl-CoA.'
    },
    glycolysisenz: {
      name: 'Glycolysis', short: 'Glycolysis', ec: '4.1.2.13', family: 'lyase',
      aliases: ['glycolysis', 'duong phan'],
      note: 'Con đường đường phân chuyển hóa Glucose thành Dihydroxyacetone phosphate (DHAP) và Pyruvate.'
    },
    fascomp: {
      name: 'Fatty acid synthase (FAS)', short: 'FAS', ec: '2.3.1.85', family: 'synthase',
      aliases: ['fas', 'fatty acid synthase'],
      note: 'Phức hệ đa enzyme lặp 7 chu kỳ kéo dài mạch tổng hợp palmitate (16:0) từ malonyl-CoA.'
    },
    desatcompenz: {
      name: 'Fatty acyl-CoA desaturase', short: 'Desaturase', ec: '1.14.19.1', family: 'oxidoreductase',
      aliases: ['fatty acyl-coa desaturase', 'acyl-coa desaturase', 'desaturase'],
      note: 'Enzyme gắn màng ER xúc tác phản ứng tạo nối đôi cis cùng O₂ và 2e⁻ từ Cyt b₅.'
    },
    fas6cycles: {
      name: 'Lặp thêm 6 vòng nữa (tổng 7 vòng)', short: 'Lặp +6 vòng', ec: '2.3.1.85', family: 'synthase',
      aliases: ['fas', '6 cycles', '7 cycles', 'fatty acid synthase'],
      note: 'Chu trình lặp thêm 6 vòng nữa (C4 → C16, tổng 7 vòng từ C2 → C16) tạo Palmitoyl-ACP.'
    },
    digestion: {
      name: 'Tiêu hóa & hấp thu', short: 'Tiêu hóa & hấp thu', ec: '3.2.1.1', family: 'hydrolase',
      aliases: ['digestion', 'absorption', 'tieu hoa hap thu'],
      note: 'Carbohydrate thức ăn được tiêu hóa và hấp thu vào máu/tế bào dưới dạng Glucose.'
    },
    pufaenz: {
      name: 'Elongase + Δ⁶/Δ⁵-Desaturase (+ β-oxy hóa peroxisome cho DHA)', short: 'Elongase + Δ⁶/Δ⁵', ec: '1.14.19.3', family: 'oxidoreductase',
      aliases: ['elongase + desaturase', 'pufa', 'epa', 'dha'],
      note: 'Tổng hợp EPA (20:5) và DHA (22:6) thông qua Elongase, Δ⁶/Δ⁵-Desaturase và 1 vòng β-oxy hóa ở peroxisome (cho DHA).'
    },
    etctransfer: {
      name: 'Truyền từng 1 e⁻ (×2)', short: '2 × 1 e⁻', ec: '1.6.2.2', family: 'oxidoreductase',
      aliases: ['electron transfer', '1e- transfer'],
      note: 'Nhóm ngoại FADH₂ trên Cytochrome b₅ reductase truyền lần lượt từng 1 electron (×2) khử 2 phân tử Cyt b₅ (Fe³⁺ → Fe²⁺).'
    },
    kennedyenz: {
      name: 'Choline / Ethanolamine phosphotransferase (Kennedy)', short: 'Kennedy (CPT/EPT)', ec: '2.7.8.2', family: 'transferase',
      aliases: ['kennedy pathway', 'choline phosphotransferase', 'ethanolamine phosphotransferase', 'cpt', 'ept'],
      note: 'Con đường Kennedy: gắn nhóm đầu từ CDP-choline/CDP-ethanolamine vào 1,2-DAG tạo PC và PE (hai phospholipid màng chính ở động vật).'
    }
  };

  var lipidCofactors = {
    carnitine: {
      name: 'Carnitine', display: 'Carnitine', family: 'carrier',
      aliases: ['carnitine', 'l-carnitine'],
      note: 'Chất mang vận chuyển gốc acyl béo qua màng ty thể dưới dạng fatty acyl-carnitine.'
    },
    acpsh: {
      name: 'ACP-SH', display: 'ACP-SH', family: 'carrier',
      aliases: ['acp', 'acp-sh', 'acyl carrier protein'],
      note: 'Protein mang nhóm acyl (Acyl Carrier Protein) của phức hệ FAS.'
    },
    h2o2: {
      name: '2 H₂O', display: '2 H₂O', family: 'small',
      aliases: ['2 h2o', '2h2o', 'h2o', 'water'],
      note: 'Hai phân tử nước tạo thành khi 1 O₂ nhận 4 electron trong phản ứng khử bão hòa (desaturase).'
    },
    nadph2: {
      name: '2 NADPH', display: '2 NADPH', family: 'redox',
      aliases: ['2 nadph', '2nadph', 'nadph'],
      note: 'Hai phân tử NADPH tiêu tốn trong mỗi chu kỳ kéo dài mạch (+2C) của Elongase tại ER.'
    },
    nadp2: {
      name: '2 NADP⁺', display: '2 NADP⁺', family: 'redox',
      aliases: ['2 nadp+', '2 nadp', '2nadp', 'nadp+'],
      note: 'Hai phân tử NADP⁺ giải phóng sau hai bước khử của chu kỳ Elongase.'
    },
    malonylcof: {
      name: 'Malonyl-CoA', display: 'Mal-CoA', family: 'carrier',
      aliases: ['malonyl-coa', 'mal-coa', 'malonyl coa'],
      note: 'Chất cho 2 carbon trong phản ứng kéo dài mạch axit béo bởi Elongase tại ER.'
    },
    ctp: {
      name: 'CTP', display: 'CTP', family: 'adenylate',
      aliases: ['ctp', 'cytidine triphosphate'],
      note: 'Hoạt hóa Phosphatidic acid thành CDP-diacylglycerol (giải phóng PPᵢ).'
    },
    cdpchoeth: {
      name: 'CDP-choline / CDP-ethanolamine', display: 'CDP-Cho/Eth', family: 'carrier',
      aliases: ['cdp-choline', 'cdp-ethanolamine', 'cdp-cho/eth'],
      note: 'Chất mang nhóm đầu phân cực hoạt hóa của con đường Kennedy gắn vào 1,2-DAG tạo PC và PE.'
    },
    cmp: {
      name: 'CMP', display: 'CMP', family: 'adenylate',
      aliases: ['cmp', 'cytidine monophosphate'],
      note: 'Giải phóng khi chuyển nhóm phosphocholine/phosphoethanolamine sang 1,2-DAG.'
    },
    edonor: {
      name: 'NADPH / Ferredoxin', display: 'NADPH / Fd', family: 'redox',
      aliases: ['nadph', 'nadh', 'ferredoxin', 'nadph/fd'],
      note: 'Chất cho electron cho Δ¹²- và Δ¹⁵-desaturase ở thực vật (NADPH/NADH ở ER hoặc Ferredoxin ở lục lạp).'
    },
    eacc: {
      name: 'NADP⁺ / Fd(ox)', display: 'NADP⁺ / Fd(ox)', family: 'redox',
      aliases: ['nadp+', 'fd(ox)', 'nadp+/fd'],
      note: 'Dạng oxy hóa của chất cho electron sau khi cấp 2e⁻ cho phản ứng desaturase thực vật.'
    }
  };
  Object.keys(lipidCofactors).forEach(function (id) {
    lipidCofactors[id].id = id; lipidCofactors[id].kind = 'cofactor';
    MG.entities.cofactor[id] = lipidCofactors[id];
  });

  Object.keys(lipidMolecules).forEach(function (id) {
    lipidMolecules[id].id = id; lipidMolecules[id].kind = 'molecule';
    MG.entities.molecule[id] = lipidMolecules[id];
  });
  Object.keys(lipidEnzymes).forEach(function (id) {
    lipidEnzymes[id].id = id; lipidEnzymes[id].kind = 'enzyme';
    MG.entities.enzyme[id] = lipidEnzymes[id];
  });

  function nNode(mol, x, y) { return { mol: mol, x: x, y: y }; }
  var LEFT_RIGHT = { 'in': 'west', out: 'east' };
  var TOP_BOTTOM = { 'in': 'north', out: 'south' };

  // ==========================================================================
  // PATHWAY 1: fas (Tổng hợp Malonyl-CoA & Chu trình tổng hợp Palmitate)
  // ==========================================================================
  function fasPathway() {
    var nodes = {
      acetylcoa: nNode('acetylcoa', 200, 160),
      malonylcoa: nNode('malonylcoa', 200, 560),
      fascharged: nNode('fascharged', 720, 360),
      acetoacetylacp: nNode('acetoacetylacp', 1180, 160),
      hydroxybutyrylacp: nNode('hydroxybutyrylacp', 1640, 360),
      butenoylacp: nNode('butenoylacp', 1640, 720),
      butyrylacp: nNode('butyrylacp', 1180, 900),
      acylks: nNode('acylks', 720, 720),
      palmitoylacp: nNode('palmitoylacp', 200, 1340),
      palmitate: nNode('palmitate', 200, 1700)
    };

    var reactions = [
      {
        id: 'acc1', step: 1, enzyme: 'acc',
        substrates: ['acetylcoa'], products: ['malonylcoa'],
        ins: ['atp', 'hco3'], outs: ['adp', 'pi'],
        arrows: [{ from: 'acetylcoa', to: 'malonylcoa' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Carboxylation (Biotin-dependent)',
        equation: 'Acetyl-CoA + ATP + HCO₃⁻ → Malonyl-CoA + ADP + Pᵢ + H⁺',
        hint: 'Giai đoạn 1: acetyl-CoA được carboxyl hóa tiêu tốn 1 ATP tạo malonyl-CoA 3 carbon.'
      },
      {
        id: 'matac1', step: 2, enzyme: 'mat',
        substrates: ['acetylcoa'], products: ['fascharged'],
        ins: [], outs: ['coa'],
        arrows: [{ from: 'acetylcoa', to: 'fascharged' }],
        cof: { 'in': 'up', out: 'up' }, irreversible: true, type: 'FAS Loading (Acetyl-KS)',
        equation: 'Acetyl-CoA + KS-SH → Acetyl-KS + CoA-SH',
        hint: 'Giai đoạn 2a: MAT (AT) nạp gốc acetyl khởi đầu lên nhóm -SH của KS và giải phóng CoA-SH.'
      },
      {
        id: 'matmal1', step: 3, enzyme: 'mat',
        substrates: ['malonylcoa'], products: ['fascharged'],
        ins: [], outs: ['coa'],
        arrows: [{ from: 'malonylcoa', to: 'fascharged' }],
        cof: { 'in': 'down', out: 'down' }, irreversible: true, type: 'FAS Loading (Malonyl-ACP)',
        equation: 'Malonyl-CoA + ACP-SH → Malonyl-ACP + CoA-SH',
        hint: 'Giai đoạn 2b: MAT (MT) nạp gốc malonyl lên nhóm -SH của ACP và giải phóng CoA-SH.'
      },
      {
        id: 'ks1', step: 4, enzyme: 'ks',
        substrates: ['fascharged'], products: ['acetoacetylacp'],
        ins: [], outs: ['co2'],
        arrows: [{ from: 'fascharged', to: 'acetoacetylacp' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Condensation',
        equation: 'Acyl-KS + Malonyl-ACP → β-Ketoacyl-ACP + CO₂',
        hint: 'Bước 1 vòng lặp: ngưng tụ gốc acyl và malonyl giải phóng CO₂ tạo β-ketoacyl-ACP.'
      },
      {
        id: 'kr1', step: 5, enzyme: 'kr',
        substrates: ['acetoacetylacp'], products: ['hydroxybutyrylacp'],
        ins: ['nadph'], outs: ['nadp'],
        arrows: [{ from: 'acetoacetylacp', to: 'hydroxybutyrylacp' }],
        cof: TOP_BOTTOM, twoWay: false, irreversible: true, type: 'Reduction (NADPH)',
        equation: 'β-Ketobutyryl-ACP + NADPH + H⁺ → D-β-Hydroxybutyryl-ACP + NADP⁺',
        hint: 'Bước 2 vòng lặp: khử nhóm β-keto thành D-β-hydroxy bằng NADPH (chiều sinh tổng hợp).'
      },
      {
        id: 'dh1', step: 6, enzyme: 'dhfas',
        substrates: ['hydroxybutyrylacp'], products: ['butenoylacp'],
        ins: [], outs: ['h2o'],
        arrows: [{ from: 'hydroxybutyrylacp', to: 'butenoylacp' }],
        cof: LEFT_RIGHT, twoWay: false, irreversible: true, type: 'Dehydration',
        equation: 'D-β-Hydroxybutyryl-ACP → trans-Δ²-Butenoyl-ACP + H₂O',
        hint: 'Bước 3 vòng lặp: khử một phân tử H₂O tạo liên kết đôi trans-Δ² (chiều sinh tổng hợp).'
      },
      {
        id: 'er1', step: 7, enzyme: 'er',
        substrates: ['butenoylacp'], products: ['butyrylacp'],
        ins: ['nadph'], outs: ['nadp'],
        arrows: [{ from: 'butenoylacp', to: 'butyrylacp' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Reduction (NADPH)',
        equation: 'trans-Δ²-Butenoyl-ACP + NADPH + H⁺ → Butyryl-ACP + NADP⁺',
        hint: 'Bước 4 vòng lặp: khử liên kết đôi tạo acyl-ACP bão hòa (4C ở vòng 1).'
      },
      {
        id: 'trans1', step: 8, enzyme: 'ks',
        substrates: ['butyrylacp'], products: ['acylks'],
        ins: [], outs: [],
        arrows: [{ from: 'butyrylacp', to: 'acylks' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Translocation',
        equation: 'Butyryl-ACP + KS-SH → Acyl-KS + ACP-SH tự do',
        hint: 'Bước 5 vòng lặp: chuyển gốc acyl từ ACP sang Cys của KS để giải phóng ACP.'
      },
      {
        id: 'rechg1', step: 9, enzyme: 'mat',
        substrates: ['acylks', 'malonylcoa'], products: ['fascharged'],
        ins: [], outs: ['coa'],
        arrows: [
          { from: 'acylks', to: 'fascharged' },
          { from: 'malonylcoa', to: 'fascharged', toPill: 'rechg1', via: [{ x: 480, y: 580 }] }
        ],
        cof: LEFT_RIGHT, irreversible: true, type: 'Recharging (lặp vòng 2→7)',
        equation: 'Acyl-KS + ACP-SH + Malonyl-CoA → Acyl-KS / Malonyl-ACP + CoA-SH',
        hint: 'Bước 6 vòng lặp: nạp thêm Malonyl-CoA mới để lặp lại chu trình từ vòng 2 đến vòng 7.'
      },
      {
        id: 'loop1', step: 10, enzyme: 'fas6cycles',
        substrates: ['butyrylacp'], products: ['palmitoylacp'],
        ins: [], outs: [],
        arrows: [{ from: 'butyrylacp', to: 'palmitoylacp', via: [{ x: 200, y: 960 }] }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Elongation (6 more cycles)',
        equation: 'Butyryl-ACP + 6 Malonyl-CoA + 12 NADPH + 12 H⁺ → Palmitoyl-ACP (16:0)',
        hint: 'Chu trình lặp thêm 6 vòng nữa (tổng 7 vòng từ C2 → C16) tạo Palmitoyl-ACP.'
      },
      {
        id: 'te1', step: 11, enzyme: 'te',
        substrates: ['palmitoylacp'], products: ['palmitate'],
        ins: ['h2o'], outs: ['acpsh'],
        arrows: [{ from: 'palmitoylacp', to: 'palmitate' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Thioester hydrolysis',
        equation: 'Palmitoyl-ACP + H₂O → Palmitate (16:0) + ACP-SH',
        hint: 'Giai đoạn 4: Thioesterase thủy phân giải phóng Palmitate (16:0) tự do khỏi phức hệ FAS.'
      }
    ];

    return {
      id: 'fas',
      title: 'Sinh tổng hợp Acid Béo từ Malonyl-CoA',
      subtitle: 'Tạo tiền chất Malonyl-CoA, nạp phức hệ FAS và chu trình lặp 7 vòng (C2 → C16) tạo Palmitate',
      tag: 'FAS', location: 'Cytosol', color: '#B8CC8A',
      nodes: nodes, reactions: reactions,
      order: ['acc1', 'matac1', 'matmal1', 'ks1', 'kr1', 'dh1', 'er1', 'trans1', 'rechg1', 'loop1', 'te1'],
      start: ['acetylcoa'],
      regions: [
        {
          type: 'rect',
          label: 'Cytosol: Malonyl-CoA & Fatty Acid Synthase (FAS)',
          color: '#F1F4E4',
          nodes: ['acetylcoa', 'malonylcoa', 'fascharged', 'acetoacetylacp', 'hydroxybutyrylacp', 'butenoylacp', 'butyrylacp', 'acylks', 'palmitoylacp', 'palmitate'],
          padX: 70, padTop: 70, padBottom: 70
        }
      ],
      notes: [
        { text: 'Lặp 7 vòng (C2 → C16) • Vòng 1: KS-Ac, Vòng 2–7: KS-Acyl', x: 1180, y: 540, size: 15, color: '#6b5d3a', anchor: 'middle' },
        { text: 'Tổng: 8 Acetyl-CoA + 7 ATP + 14 NADPH + 14 H⁺ → Palmitate + 7 ADP + 7 Pᵢ + 14 NADP⁺ + 8 CoA-SH + 6 H₂O', x: 1180, y: 1060, size: 14, color: '#6b5d3a', anchor: 'middle' }
      ],
      summary: [
        'Giai đoạn 1–2: Acetyl-CoA carboxylase (ACC) tạo Malonyl-CoA; MAT nạp Acetyl-CoA lên KS và Malonyl-CoA lên ACP (đều giải phóng CoA-SH).',
        'Giai đoạn 3: Chu trình 4 bước chính (KS → KR → DH → ER) kèm chuyển vị và tái nạp Malonyl-CoA lặp tổng cộng 7 vòng (C2 → C16).',
        'Giai đoạn 4: Thioesterase giải phóng Palmitate (16:0). Tổng phương trình: 8 Acetyl-CoA + 7 ATP + 14 NADPH + 14 H⁺ → Palmitate + 7 ADP + 7 Pᵢ + 14 NADP⁺ + 8 CoA-SH + 6 H₂O.'
      ],
      region: ['lipid', 'all'], noDistractor: ['hplus', 'mg']
    };
  }

  // ==========================================================================
  // PATHWAY 2: faelong (Tổng hợp các axit béo no và không no khác — Tr. 16, 23, 27)
  // ==========================================================================
  function faelongPathway() {
    var nodes = {
      // Hàng 0: Màng Phosphatidylcholine (Trang 27 — thực vật)
      pcoleate: nNode('pcoleate', 680, 160),
      pclinoleate: nNode('pclinoleate', 1160, 160),
      pclinolenate: nNode('pclinolenate', 1640, 160),
      // Hàng 1: Trục chính từ Palmitate (Trang 23)
      palmitate: nNode('palmitate', 200, 540),
      stearate: nNode('stearate', 680, 540),
      oleate: nNode('oleate', 1160, 540),
      linoleate: nNode('linoleate', 1640, 540),
      alinolenate: nNode('alinolenate', 2120, 540),
      pufa: nNode('pufa', 2600, 540),
      // Hàng 2: Nhánh phân nhánh
      palmitoleate: nNode('palmitoleate', 200, 920),
      lsf: nNode('lsf', 680, 920),
      glinolenate: nNode('glinolenate', 1640, 920),
      // Hàng 3: Nhánh Arachidonate ở động vật
      eicosatrienoate: nNode('eicosatrienoate', 1640, 1300),
      arachidonate: nNode('arachidonate', 2120, 1300)
    };

    var reactions = [
      {
        id: 'des9a', step: 1, enzyme: 'desat9',
        substrates: ['palmitate'], products: ['palmitoleate'],
        ins: ['o2', 'nadph'], outs: ['h2o2', 'nadp'],
        arrows: [{ from: 'palmitate', to: 'palmitoleate' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Desaturation (cis-Δ⁹)',
        equation: 'Palmitoyl-CoA (16:0) + NADPH + H⁺ + O₂ → Palmitoleoyl-CoA (16:1 Δ⁹) + NADP⁺ + 2 H₂O',
        hint: 'Tạo liên kết đôi cis tại vị trí C9 của palmitoyl-CoA, giải phóng 2 H₂O.'
      },
      {
        id: 'elo1', step: 2, enzyme: 'elongase',
        substrates: ['palmitate'], products: ['stearate'],
        ins: ['malonylcof', 'nadph2'], outs: ['co2', 'coa', 'h2o', 'nadp2'],
        arrows: [{ from: 'palmitate', to: 'stearate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Elongation (+2C at ER)',
        equation: 'Palmitoyl-CoA (16:0) + Malonyl-CoA + 2 NADPH + 2 H⁺ → Stearoyl-CoA (18:0) + CO₂ + CoA-SH + H₂O + 2 NADP⁺',
        hint: 'Fatty acid elongase tại ER dùng Malonyl-CoA và 2 NADPH để kéo dài mạch thêm 2 carbon.'
      },
      {
        id: 'des9b', step: 3, enzyme: 'desat9',
        substrates: ['stearate'], products: ['oleate'],
        ins: ['o2', 'nadph'], outs: ['h2o2', 'nadp'],
        arrows: [{ from: 'stearate', to: 'oleate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Desaturation (cis-Δ⁹)',
        equation: 'Stearoyl-CoA (18:0) + NADPH + H⁺ + O₂ → Oleoyl-CoA (18:1 Δ⁹) + NADP⁺ + 2 H₂O',
        hint: 'Tạo liên kết đôi cis-Δ⁹ trên stearoyl-CoA tạo Oleate và 2 H₂O.'
      },
      {
        id: 'elo2', step: 4, enzyme: 'elongase',
        substrates: ['stearate'], products: ['lsf'],
        ins: ['malonylcof', 'nadph2'], outs: ['co2', 'coa', 'h2o', 'nadp2'],
        arrows: [{ from: 'stearate', to: 'lsf' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Elongation (VLCFA)',
        equation: 'Stearoyl-CoA (18:0) + Malonyl-CoA + 2 NADPH + 2 H⁺ → VLCFA-CoA (≥20C) + CO₂ + CoA-SH + H₂O + 2 NADP⁺',
        hint: 'Kéo dài liên tiếp bằng Malonyl-CoA và 2 NADPH tạo Very Long-Chain Fatty Acids (VLCFA ≥20C).'
      },
      {
        id: 'des12', step: 5, enzyme: 'desat12',
        substrates: ['oleate'], products: ['linoleate'],
        ins: ['o2', 'edonor'], outs: ['h2o2', 'eacc'],
        arrows: [{ from: 'oleate', to: 'linoleate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Plant Desaturation (cis-Δ¹² trên PC)',
        equation: 'PC-Oleate (18:1 Δ⁹) + O₂ + NADPH/Fd(red) → PC-Linoleate (18:2 Δ⁹,¹²) + 2 H₂O + NADP⁺/Fd(ox)',
        hint: 'Chỉ có ở thực vật: Δ¹²-desaturase tác động trên Phosphatidylcholine (PC) màng (như khung PC phía trên), không tác động lên acyl-CoA tự do.'
      },
      {
        id: 'des15', step: 6, enzyme: 'desat15',
        substrates: ['linoleate'], products: ['alinolenate'],
        ins: ['o2', 'edonor'], outs: ['h2o2', 'eacc'],
        arrows: [{ from: 'linoleate', to: 'alinolenate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Plant Desaturation (cis-Δ¹⁵ trên PC)',
        equation: 'PC-Linoleate (18:2) + O₂ + NADPH/Fd(red) → PC-α-Linolenate (18:3 Δ⁹,¹²,¹⁵) + 2 H₂O + NADP⁺/Fd(ox)',
        hint: 'Chỉ có ở thực vật: Δ¹⁵-desaturase tác động trên lipid màng Phosphatidylcholine (PC) tạo omega-3.'
      },
      {
        id: 'pufastep', step: 7, enzyme: 'pufaenz',
        substrates: ['alinolenate'], products: ['pufa'],
        ins: [], outs: [],
        arrows: [{ from: 'alinolenate', to: 'pufa' }],
        type: 'PUFA synthesis (EPA, DHA)',
        equation: 'α-Linolenate (18:3 ω-3) → EPA (20:5) → DHA (22:6) [Elongase + Δ⁶/Δ⁵-Desaturase + β-oxy hóa peroxisome]',
        hint: 'Từ α-Linolenate thực vật, động vật dùng Elongase + Δ⁶/Δ⁵-Desaturase (cộng 1 vòng β-oxy hóa peroxisome cho DHA).'
      },
      {
        id: 'des6', step: 8, enzyme: 'desat6',
        substrates: ['linoleate'], products: ['glinolenate'],
        ins: ['o2', 'nadph'], outs: ['h2o2', 'nadp'],
        arrows: [{ from: 'linoleate', to: 'glinolenate' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Animal Desaturation (cis-Δ⁶)',
        equation: 'Linoleoyl-CoA (18:2) + O₂ + NADPH + H⁺ → γ-Linolenoyl-CoA (18:3 Δ⁶,⁹,¹²) + 2 H₂O + NADP⁺',
        hint: 'Động vật chuyển hóa Linoleate từ thức ăn bằng phản ứng Δ⁶-desaturase tại C6.'
      },
      {
        id: 'elo3', step: 9, enzyme: 'elongase',
        substrates: ['glinolenate'], products: ['eicosatrienoate'],
        ins: ['malonylcof', 'nadph2'], outs: ['co2', 'coa', 'h2o', 'nadp2'],
        arrows: [{ from: 'glinolenate', to: 'eicosatrienoate' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Elongation (+2C at ER)',
        equation: 'γ-Linolenoyl-CoA (18:3) + Malonyl-CoA + 2 NADPH + 2 H⁺ → Eicosatrienoyl-CoA (20:3) + CO₂ + CoA-SH + H₂O + 2 NADP⁺',
        hint: 'Fatty acid elongase kéo dài mạch 18C thành 20C (Dihomo-γ-linolenoyl-CoA) tại ER.'
      },
      {
        id: 'des5', step: 10, enzyme: 'desat5',
        substrates: ['eicosatrienoate'], products: ['arachidonate'],
        ins: ['o2', 'nadph'], outs: ['h2o2', 'nadp'],
        arrows: [{ from: 'eicosatrienoate', to: 'arachidonate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Animal Desaturation (cis-Δ⁵)',
        equation: 'Eicosatrienoyl-CoA (20:3) + O₂ + NADPH + H⁺ → Arachidonoyl-CoA (20:4 Δ⁵,⁸,¹¹,¹⁴) + 2 H₂O + NADP⁺',
        hint: 'Tạo nối đôi thứ tư tại C5, giải phóng 2 H₂O để tạo Arachidonate.'
      },
      {
        id: 'pcdes1', step: 11, enzyme: 'desat12',
        substrates: ['pcoleate'], products: ['pclinoleate'],
        ins: ['o2', 'edonor'], outs: ['h2o2', 'eacc'],
        arrows: [{ from: 'pcoleate', to: 'pclinoleate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Membrane PC Desaturation (Δ¹²)',
        equation: 'Phosphatidylcholine (18:1) + O₂ + NADPH/Fd → Phosphatidylcholine (18:2) + 2 H₂O + NADP⁺/Fd(ox)',
        hint: 'Cơ chất thực sự của Δ¹²-desaturase ở thực vật là gốc acyl gắn trên Phosphatidylcholine (PC).'
      },
      {
        id: 'pcdes2', step: 12, enzyme: 'desat15',
        substrates: ['pclinoleate'], products: ['pclinolenate'],
        ins: ['o2', 'edonor'], outs: ['h2o2', 'eacc'],
        arrows: [{ from: 'pclinoleate', to: 'pclinolenate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Membrane PC Desaturation (Δ¹⁵)',
        equation: 'Phosphatidylcholine (18:2) + O₂ + NADPH/Fd → Phosphatidylcholine (18:3) + 2 H₂O + NADP⁺/Fd(ox)',
        hint: 'Tiếp tục tạo nối đôi Δ¹⁵ ngay trên Phosphatidylcholine (PC) màng.'
      }
    ];

    return {
      id: 'faelong',
      title: 'Kéo dài chuỗi và khử bão hòa chuỗi acid béo',
      subtitle: 'Kéo dài mạch (Malonyl-CoA + 2 NADPH) và khử bão hòa trên Acyl-CoA (động vật) hoặc Phosphatidylcholine (thực vật)',
      tag: 'ELO', location: 'ER (Microsome) & Chloroplast', color: '#9CCBEA',
      nodes: nodes, reactions: reactions,
      order: ['des9a', 'elo1', 'des9b', 'elo2', 'des12', 'des15', 'pufastep', 'des6', 'elo3', 'des5', 'pcdes1', 'pcdes2'],
      start: ['palmitate'],
      regions: [
        {
          type: 'rect',
          label: 'Thực vật: Desaturase Δ¹² / Δ¹⁵ tác động trên Phosphatidylcholine (PC) màng',
          color: '#F1F4E4',
          nodes: ['pcoleate', 'pclinoleate', 'pclinolenate'],
          padX: 60, padTop: 60, padBottom: 50
        },
        {
          type: 'rect',
          label: 'Kéo dài chuỗi & Khử bão hòa từ Palmitate (Acyl-CoA; riêng Δ¹²/Δ¹⁵ thực vật trên PC)',
          color: '#E2F0F9',
          nodes: [
            'palmitate', 'stearate', 'oleate', 'linoleate', 'alinolenate', 'pufa',
            'palmitoleate', 'lsf', 'glinolenate', 'eicosatrienoate', 'arachidonate'
          ],
          padX: 70, padTop: 70, padBottom: 70
        }
      ],
      notes: [
        { text: 'Thực vật: Δ¹²/Δ¹⁵ dùng PC màng (như khung trên), không dùng Acyl-CoA tự do', x: 1640, y: 342, size: 14, color: '#6b5d3a', anchor: 'middle' },
        { text: 'Con đường ở động vật tạo Arachidonate (20:4)', x: 2120, y: 1120, size: 15, color: '#6b5d3a', anchor: 'middle' }
      ],
      summary: [
        'Mỗi vòng Elongase ở ER dùng Malonyl-CoA + 2 NADPH → CO₂ + CoA-SH + H₂O + 2 NADP⁺, tạo Stearate (18:0) và VLCFA (≥20C).',
        'Mỗi phản ứng Desaturase tiêu thụ 1 O₂ và 2e⁻ (NADPH hoặc Ferredoxin) để tạo liên kết đôi cis và giải phóng 2 H₂O.',
        'Ở thực vật, Δ¹²- và Δ¹⁵-desaturase tác động trên lipid màng Phosphatidylcholine (PC), không tác động trực tiếp lên Acyl-CoA tự do.'
      ],
      region: ['lipid', 'all'], noDistractor: ['hplus', 'mg']
    };
  }

  // ==========================================================================
  // PATHWAY 3: desatmech (Cơ chế tạo nối đôi bởi hệ Acyl-CoA desaturase — Tr. 24)
  // ==========================================================================
  function desatmechPathway() {
    var nodes = {
      nadphnode: nNode('nadphnode', 200, 180),
      fadfadh2: nNode('fadfadh2', 680, 180),
      cytb5: nNode('cytb5', 1160, 180),
      satfacylcoa: nNode('satfacylcoa', 680, 560),
      monounsatfacylcoa: nNode('monounsatfacylcoa', 1160, 560)
    };

    var reactions = [
      {
        id: 'etcred', step: 1, enzyme: 'cb5r',
        substrates: ['nadphnode'], products: ['fadfadh2'],
        ins: [], outs: ['nadp'],
        arrows: [{ from: 'nadphnode', to: 'fadfadh2' }],
        cof: TOP_BOTTOM, irreversible: true, type: '2 e⁻ transfer (NADPH → FAD)',
        equation: 'NADPH + H⁺ + FAD (Cyt b₅ reductase) → NADP⁺ + FADH₂ (Cyt b₅ reductase)',
        hint: 'Cytochrome b₅ reductase chuyển 2 electron từ NADPH + H⁺ sang nhóm ngoại FAD thành FADH₂.'
      },
      {
        id: 'etccyt', step: 2, enzyme: 'etctransfer',
        substrates: ['fadfadh2'], products: ['cytb5'],
        ins: [], outs: [],
        arrows: [{ from: 'fadfadh2', to: 'cytb5' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Single-electron transfer (2 × 1 e⁻)',
        equation: 'FADH₂ + 2 Cyt b₅ (Fe³⁺) → FAD + 2 Cyt b₅ (Fe²⁺)',
        hint: 'FADH₂ trên Cytochrome b₅ reductase truyền từng 1 electron (×2) sang 2 phân tử Cyt b₅ (Fe³⁺ → Fe²⁺).'
      },
      {
        id: 'desatrxn', step: 3, enzyme: 'desatcompenz',
        substrates: ['satfacylcoa'], products: ['monounsatfacylcoa'],
        ins: ['o2'], outs: ['h2o2'],
        arrows: [
          { from: 'satfacylcoa', to: 'monounsatfacylcoa' },
          { from: 'cytb5', to: 'monounsatfacylcoa', toPill: 'desatrxn', link: true, dashed: true, via: [{ x: 1160, y: 370 }, { x: 1275, y: 370 }, { x: 1275, y: 488 }, { x: 920, y: 488 }] }
        ],
        cof: { 'in': 'down', out: 'down' }, irreversible: true, type: 'Desaturation (Mixed-function oxidase)',
        equation: 'Saturated fatty acyl-CoA + O₂ + 2 H⁺ + 2 e⁻ → Monounsaturated fatty acyl-CoA + 2 H₂O',
        hint: '2 Cyt b₅ (Fe²⁺ → Fe³⁺) cung cấp 2 electron cho Fatty acyl-CoA desaturase khử O₂ thành 2 H₂O và tạo nối đôi cis.'
      }
    ];

    return {
      id: 'desatmech',
      title: 'Chuỗi điện tử của Fatty Acyl-CoA Desaturase',
      subtitle: 'Chuỗi truyền electron màng ER (NADPH → FAD/FADH₂ trên Cyt b₅ reductase → 2 Cyt b₅) ghép cặp phản ứng tạo nối đôi',
      tag: 'DES', location: 'ER Membrane', color: '#A3D2CA',
      nodes: nodes, reactions: reactions,
      order: ['etcred', 'etccyt', 'desatrxn'],
      start: ['nadphnode', 'satfacylcoa'],
      regions: [
        {
          type: 'rect',
          label: 'Chuỗi truyền electron ghép cặp (Màng ER)',
          color: '#E2F0F9',
          nodes: ['nadphnode', 'fadfadh2', 'cytb5'],
          padX: 60, padTop: 60, padBottom: 60
        },
        {
          type: 'rect',
          label: 'Phản ứng khử bão hòa bởi Fatty acyl-CoA desaturase',
          color: '#F1F4E4',
          nodes: ['satfacylcoa', 'monounsatfacylcoa'],
          padX: 60, padTop: 60, padBottom: 60
        }
      ],
      notes: [
        { text: '2 Cyt b₅ (Fe²⁺ → Fe³⁺) cung cấp 2 e⁻ cho Desaturase', x: 920, y: 345, size: 15, color: '#6b5d3a', anchor: 'middle' }
      ],
      summary: [
        'Cytochrome b₅ reductase dùng nhóm ngoại FAD nhận 2e⁻ từ NADPH + H⁺ thành FADH₂, sau đó truyền từng 1e⁻ (×2) sang 2 Cyt b₅ (Fe³⁺ → Fe²⁺).',
        'Fatty acyl-CoA desaturase dùng 2e⁻ này cùng O₂ + 2 H⁺ để tạo liên kết đôi cis và giải phóng 2 H₂O.'
      ],
      region: ['lipid', 'all'], noDistractor: ['hplus', 'mg']
    };
  }

  // ==========================================================================
  // PATHWAY 4: tag (Sinh tổng hợp Triacylglycerol & Glycerophospholipid — Tr. 25–26)
  // ==========================================================================
  function tagPathway() {
    var nodes = {
      glucose: nNode('glucose', 620, 160),
      glycerol: nNode('glycerol', 180, 480),
      dhap: nNode('dhap', 620, 480),
      gly3p: nNode('gly3p', 400, 820),
      fattyacid: nNode('fattyacid', 1180, 480),
      fattyacylcoa: nNode('fattyacylcoa', 1180, 820),
      lysopa: nNode('lysopa', 400, 1160),
      pa: nNode('pa', 400, 1500),
      dag: nNode('dag', 400, 1840),
      tag: nNode('tag', 400, 2180),
      gpl: nNode('gpl', 880, 1500),
      gplpcpe: nNode('gplpcpe', 880, 1840)
    };

    var reactions = [
      {
        id: 'glyc2dhap', step: 1, enzyme: 'glycolysisenz',
        substrates: ['glucose'], products: ['dhap'],
        ins: [], outs: [],
        arrows: [{ from: 'glucose', to: 'dhap' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Glycolysis',
        equation: 'Glucose → Dihydroxyacetone phosphate (DHAP)',
        hint: 'Đường phân phân giải Glucose tạo DHAP làm nguồn tiền chất khung glycerol.'
      },
      {
        id: 'gpdh1', step: 2, enzyme: 'gpdh',
        substrates: ['dhap'], products: ['gly3p'],
        ins: ['nadh'], outs: ['nad'],
        arrows: [{ from: 'dhap', to: 'gly3p' }],
        cof: { 'in': 'east', out: 'east' }, twoWay: true, type: 'Dehydrogenation (Reduction)',
        equation: 'Dihydroxyacetone phosphate + NADH + H⁺ ⇌ L-Glycerol 3-phosphate + NAD⁺',
        hint: 'Khử DHAP thành L-Glycerol 3-phosphate nhờ NADH.'
      },
      {
        id: 'gk1', step: 3, enzyme: 'gk',
        substrates: ['glycerol'], products: ['gly3p'],
        ins: ['atp'], outs: ['adp'],
        arrows: [{ from: 'glycerol', to: 'gly3p' }],
        cof: { 'in': 'west', out: 'west' }, irreversible: true, type: 'Phosphorylation',
        equation: 'Glycerol + ATP → L-Glycerol 3-phosphate + ADP',
        hint: 'Chủ yếu ở gan & thận (vắng mặt ở mô mỡ): phosphoryl hóa glycerol tự do bằng ATP.'
      },
      {
        id: 'facs1', step: 4, enzyme: 'facs',
        substrates: ['fattyacid'], products: ['fattyacylcoa'],
        ins: ['atp', 'coa'], outs: ['amp', 'ppi'],
        arrows: [{ from: 'fattyacid', to: 'fattyacylcoa' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Fatty acyl activation',
        equation: 'R-COO⁻ + CoA-SH + ATP → R-CO-S-CoA + AMP + PPᵢ',
        hint: 'Fatty acyl-CoA synthetase hoạt hóa axit béo tự do tiêu tốn ATP (giải phóng AMP + PPᵢ).'
      },
      {
        id: 'gpat1', step: 5, enzyme: 'gpat',
        substrates: ['gly3p', 'fattyacylcoa'], products: ['lysopa'],
        ins: [], outs: ['coa'],
        arrows: [
          { from: 'gly3p', to: 'lysopa' },
          { from: 'fattyacylcoa', to: 'lysopa', toPill: 'gpat1', via: [{ x: 1180, y: 990 }] }
        ],
        cof: { 'in': 'west', out: 'west' }, irreversible: true, type: 'Acyl transfer 1',
        equation: 'L-Glycerol 3-phosphate + R₁-CO-S-CoA → Lysophosphatidic acid + CoA-SH',
        hint: 'GPAT gắn gốc R₁-CO- vào C1 tạo Lysophosphatidic acid và giải phóng CoA-SH.'
      },
      {
        id: 'agpat1', step: 6, enzyme: 'agpat',
        substrates: ['lysopa', 'fattyacylcoa'], products: ['pa'],
        ins: [], outs: ['coa'],
        arrows: [
          { from: 'lysopa', to: 'pa' },
          { from: 'fattyacylcoa', to: 'pa', toPill: 'agpat1', via: [{ x: 1180, y: 1330 }] }
        ],
        cof: { 'in': 'west', out: 'west' }, irreversible: true, type: 'Acyl transfer 2',
        equation: 'Lysophosphatidic acid + R₂-CO-S-CoA → Phosphatidic acid + CoA-SH',
        hint: 'AGPAT gắn gốc R₂-CO- vào C2 tạo Phosphatidic acid và giải phóng CoA-SH.'
      },
      {
        id: 'pap1', step: 7, enzyme: 'pap',
        substrates: ['pa'], products: ['dag'],
        ins: ['h2o'], outs: ['pi'],
        arrows: [{ from: 'pa', to: 'dag' }],
        cof: { 'in': 'west', out: 'west' }, irreversible: true, type: 'Dephosphorylation',
        equation: 'Phosphatidic acid + H₂O → 1,2-Diacylglycerol + Pᵢ',
        hint: 'Phosphatidic acid phosphatase (Lipin) tách nhóm phosphate tạo 1,2-Diacylglycerol.'
      },
      {
        id: 'dgat1', step: 8, enzyme: 'dgat',
        substrates: ['dag', 'fattyacylcoa'], products: ['tag'],
        ins: [], outs: ['coa'],
        arrows: [
          { from: 'dag', to: 'tag' },
          { from: 'fattyacylcoa', to: 'tag', toPill: 'dgat1', via: [{ x: 1180, y: 2010 }] }
        ],
        cof: { 'in': 'west', out: 'west' }, irreversible: true, type: 'Acyl transfer 3',
        equation: '1,2-Diacylglycerol + R₃-CO-S-CoA → Triacylglycerol + CoA-SH',
        hint: 'DGAT gắn gốc R₃-CO- thứ ba vào 1,2-DAG tạo Triacylglycerol (lipid dự trữ) và giải phóng CoA-SH.'
      },
      {
        id: 'gpl1', step: 9, enzyme: 'cdpdags',
        substrates: ['pa'], products: ['gpl'],
        ins: ['ctp'], outs: ['ppi'],
        arrows: [{ from: 'pa', to: 'gpl' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'CDP-DAG pathway (PI, PG, Cardiolipin)',
        equation: 'Phosphatidic acid + CTP → CDP-DAG + PPᵢ → PI, PG, Cardiolipin',
        hint: 'CDP-DAG synthase hoạt hóa Phosphatidic acid bằng CTP (giải phóng PPᵢ) để tổng hợp PI, PG, Cardiolipin.'
      },
      {
        id: 'kennedy1', step: 10, enzyme: 'kennedyenz',
        substrates: ['dag'], products: ['gplpcpe'],
        ins: ['cdpchoeth'], outs: ['cmp'],
        arrows: [{ from: 'dag', to: 'gplpcpe' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Kennedy pathway (PC, PE)',
        equation: '1,2-Diacylglycerol + CDP-choline/ethanolamine → PC / PE + CMP',
        hint: 'Con đường Kennedy: gắn nhóm đầu từ CDP-choline / CDP-ethanolamine vào 1,2-DAG tạo PC và PE (hai phospholipid màng chính ở động vật).'
      }
    ];

    return {
      id: 'tag',
      title: 'Sinh tổng hợp Triacylglycerol & Glycerophospholipid',
      subtitle: 'Tạo khung L-Glycerol 3-phosphate, tổng hợp Phosphatidic acid, TAG và các con đường tạo Phospholipid màng (CDP-DAG & Kennedy)',
      tag: 'TAG', location: 'Cytosol & ER', color: '#F0C987',
      nodes: nodes, reactions: reactions,
      order: ['glyc2dhap', 'gpdh1', 'gk1', 'facs1', 'gpat1', 'agpat1', 'pap1', 'dgat1', 'gpl1', 'kennedy1'],
      start: ['glucose', 'glycerol', 'fattyacid'],
      regions: [
        {
          type: 'rect',
          label: 'Cytosol & ER: Triacylglycerol & Glycerophospholipid Biosynthesis',
          color: '#F7EAD5',
          nodes: ['glucose', 'glycerol', 'dhap', 'gly3p', 'fattyacid', 'fattyacylcoa', 'lysopa', 'pa', 'dag', 'tag', 'gpl', 'gplpcpe'],
          padX: 70, padTop: 70, padBottom: 70
        }
      ],
      notes: [
        { text: '1. Tổng hợp khung L-Glycerol 3-phosphate', x: 165, y: 210, size: 13, color: '#6b5d3a', anchor: 'middle' },
        { text: 'GK: Chủ yếu ở gan & thận', x: 155, y: 835, size: 13, color: '#6b5d3a', anchor: 'middle' },
        { text: '(vắng mặt ở mô mỡ)', x: 155, y: 857, size: 12, color: '#6b5d3a', anchor: 'middle' },
        { text: '2. Hoạt hóa axit béo & tạo Phosphatidic acid', x: 860, y: 1160, size: 14, color: '#6b5d3a', anchor: 'middle' },
        { text: '3. Rẽ nhánh: Lipid dự trữ (TAG) & Lipid màng (CDP-DAG / Kennedy)', x: 880, y: 2040, size: 14, color: '#6b5d3a', anchor: 'middle' }
      ],
      summary: [
        'Khung L-Glycerol 3-phosphate được tạo từ Glucose (qua DHAP) hoặc từ Glycerol tự do (nhờ Glycerol kinase, chủ yếu ở gan & thận, vắng mặt ở mô mỡ).',
        'GPAT và AGPAT gắn 2 gốc Fatty acyl-CoA tạo Phosphatidic acid (PA).',
        'PA rẽ nhánh qua CDP-DAG synthase (dùng CTP → PPᵢ) tạo PI, PG, Cardiolipin; hoặc qua PAP tạo 1,2-DAG để tổng hợp TAG (DGAT) và PC, PE (con đường Kennedy dùng CDP-choline/ethanolamine).'
      ],
      region: ['lipid', 'all'], noDistractor: ['hplus', 'mg']
    };
  }

  // ==========================================================================
  // PATHWAY 5: lipidsreg (Điều hòa trao đổi axit béo qua trục ACC & CAT I — Tr. 28)
  // ==========================================================================
  function lipidsregPathway() {
    var nodes = {
      // Hàng 0: Tín hiệu dinh dưỡng & hormone
      dietcarb:     nNode('dietcarb',     180,  160),
      highglc:      nNode('highglc',      600,  160),
      insulin:      nNode('insulin',     1020,  160),
      lowglc:       nNode('lowglc',      1940,  160),
      // Hàng 1: Glucose, Citrate, Trạng thái ACC & Glucagon
      glucose:      nNode('glucose',      180,  480),
      citratesig:   nNode('citratesig',   580,  480),
      accact:       nNode('accact',      1020,  480),
      accinact:     nNode('accinact',    1520,  480),
      glucagon:     nNode('glucagon',    1940,  480),
      // Hàng 2: Tổng hợp Malonyl-CoA -> Palmitate & Tín hiệu ức chế ngược / năng lượng
      acetylcoar:   nNode('acetylcoa',    180,  840),
      malonylcoar:  nNode('malonylcoa',   620,  840),
      palmitate:    nNode('palmitate',   1020,  840),
      palmsig:      nNode('palmsig',     1440,  840),
      ampksig:      nNode('ampksig',     1940,  840),
      // Hàng 3: Vận chuyển qua màng ty thể & β-oxy hóa
      facylcoacyt:  nNode('facylcoacyt',  620, 1220),
      facylcarn:    nNode('facylcarn',   1220, 1220),
      facylcoamat:  nNode('facylcoamat', 1720, 1220),
      acetylcoamat: nNode('acetylcoamat',2200, 1220)
    };

    var reactions = [
      {
        id: 'carb2glc', step: 1, enzyme: 'digestion',
        substrates: ['dietcarb'], products: ['glucose'],
        ins: [], outs: [],
        arrows: [
          { from: 'dietcarb', to: 'glucose' },
          { from: 'dietcarb', to: 'highglc', link: true, dashed: true }
        ],
        cof: LEFT_RIGHT, irreversible: true, type: 'Digestion & Absorption',
        equation: 'Dietary carbohydrate → Glucose (làm tăng đường huyết)',
        hint: 'Carbohydrate thức ăn được tiêu hóa & hấp thu cung cấp Glucose và làm tăng đường huyết.'
      },
      {
        id: 'glc2accoa', step: 2, enzyme: 'glycpdh',
        substrates: ['glucose'], products: ['acetylcoar'],
        ins: [], outs: [],
        arrows: [{ from: 'glucose', to: 'acetylcoar' }],
        cof: LEFT_RIGHT, irreversible: true, type: 'Glycolysis → PDH (Mito) → Citrate Shuttle & ACL',
        equation: 'Glucose (Cytosol) → Pyruvate → Acetyl-CoA (Mito) → Citrate → Acetyl-CoA (Cytosol)',
        hint: 'Đường phân ở bào tương → PDH trong ty thể → Citrate xuất ra bào tương qua Con thoi Citrate & ATP-citrate lyase tạo Acetyl-CoA.'
      },
      {
        id: 'regacc1', step: 3, enzyme: 'pphosphatase',
        substrates: ['accinact'], products: ['accact'],
        ins: [], outs: ['pi'],
        shift: [0, -40],
        arrows: [
          { from: 'accinact', to: 'accact' },
          { from: 'highglc', to: 'insulin', link: true },
          { from: 'insulin', to: 'accact', toPill: 'regacc1', link: true, effect: 'activate', dashed: true, badge: '+', via: [{ x: 1270, y: 160 }] },
          { from: 'citratesig', to: 'accact', link: true, effect: 'activate', dashed: true, badge: '+' }
        ],
        cof: { 'in': 'up', out: 'up' }, irreversible: true, type: 'Dephosphorylation ([+] Insulin & Citrate)',
        equation: 'ACC-P (Inactive) → ACC (Active) + Pᵢ  [Insulin → Phosphatase; Citrate (+) dị lập thể]',
        hint: 'Insulin hoạt hóa Protein Phosphatase khử P trên ACC; đồng thời Citrate hoạt hóa dị lập thể ACC.'
      },
      {
        id: 'regacc2', step: 4, enzyme: 'pka',
        substrates: ['accact'], products: ['accinact'],
        ins: ['atp'], outs: ['adp'],
        shift: [0, 40],
        arrows: [
          { from: 'accact', to: 'accinact' },
          { from: 'lowglc', to: 'glucagon', link: true },
          { from: 'glucagon', to: 'accinact', toPill: 'regacc2', link: true, effect: 'activate', dashed: true, badge: '+', via: [{ x: 1940, y: 650 }, { x: 1270, y: 650 }] },
          { from: 'palmsig', to: 'accact', link: true, effect: 'inhibit', dashed: true, badge: '−', via: [{ x: 1440, y: 745 }, { x: 1020, y: 745 }] },
          { from: 'ampksig', to: 'accact', link: true, effect: 'inhibit', dashed: true, badge: '−', via: [{ x: 1940, y: 695 }, { x: 1055, y: 695 }] }
        ],
        cof: { 'in': 'down', out: 'down' }, irreversible: true, type: 'Phosphorylation (PKA / AMPK) & Feedback (−)',
        equation: 'ACC (Active) + ATP → ACC-P (Inactive) + ADP  [Glucagon/Epinephrine → PKA; AMPK (−); Palmitoyl-CoA (−)]',
        hint: 'Glucagon/Epinephrine hoạt hóa PKA (và AMPK khi thiếu năng lượng) phosphoryl hóa bất hoạt ACC; Palmitoyl-CoA ức chế dị lập thể ngược.'
      },
      {
        id: 'regacc3', step: 5, enzyme: 'acc',
        substrates: ['acetylcoar'], products: ['malonylcoar'],
        ins: ['atp', 'hco3'], outs: ['adp', 'pi'],
        arrows: [
          { from: 'acetylcoar', to: 'malonylcoar' },
          { from: 'accact', to: 'malonylcoar', toPill: 'regacc3', link: true, dashed: true, via: [{ x: 515, y: 805 }] }
        ],
        cof: TOP_BOTTOM, irreversible: true, type: 'Carboxylation (ACC)',
        equation: 'Acetyl-CoA + ATP + HCO₃⁻ → Malonyl-CoA + ADP + Pᵢ',
        hint: 'ACC dạng hoạt động xúc tác biến Acetyl-CoA thành Malonyl-CoA.'
      },
      {
        id: 'regfas', step: 6, enzyme: 'fascomp',
        substrates: ['malonylcoar'], products: ['palmitate'],
        ins: [], outs: [],
        arrows: [{ from: 'malonylcoar', to: 'palmitate' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Fatty Acid Synthesis (FAS)',
        equation: 'Malonyl-CoA → Palmitate (16:0)',
        hint: 'Malonyl-CoA đi vào phức hệ Fatty Acid Synthase (FAS) tổng hợp Palmitate.'
      },
      {
        id: 'regcpt1', step: 7, enzyme: 'cpt1',
        substrates: ['facylcoacyt'], products: ['facylcarn'],
        ins: ['carnitine'], outs: ['coa'],
        arrows: [
          { from: 'facylcoacyt', to: 'facylcarn' },
          { from: 'malonylcoar', to: 'facylcarn', toPill: 'regcpt1', link: true, effect: 'inhibit', dashed: true, badge: '−', via: [{ x: 620, y: 1040 }, { x: 920, y: 1040 }] }
        ],
        cof: { 'in': 'down', out: 'down' }, irreversible: true, type: 'Carnitine acyltransferase I (CAT I / CPT1)',
        equation: 'Fatty acyl-CoA + Carnitine → Fatty acyl-carnitine + CoA-SH  [✖ Bị Malonyl-CoA ức chế]',
        hint: 'Malonyl-CoA ức chế dị lập thể CAT I (CPT1) tại màng ngoài ty thể, khóa β-oxy hóa khi đang tổng hợp.'
      },
      {
        id: 'regcact', step: 8, enzyme: 'cact',
        substrates: ['facylcarn'], products: ['facylcoamat'],
        ins: ['coa'], outs: ['carnitine'],
        arrows: [{ from: 'facylcarn', to: 'facylcoamat' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'Translocase & CAT II (CPT II)',
        equation: 'Fatty acyl-carnitine + CoA-SH → Fatty acyl-CoA (Matrix) + Carnitine',
        hint: 'Carnitine-acylcarnitine translocase vận chuyển qua màng trong, sau đó CAT II (CPT II) tái tạo Fatty acyl-CoA và giải phóng Carnitine.'
      },
      {
        id: 'regbeta', step: 9, enzyme: 'betaoxenz',
        substrates: ['facylcoamat'], products: ['acetylcoamat'],
        ins: ['fad', 'nad'], outs: ['fadh2', 'nadh'],
        arrows: [{ from: 'facylcoamat', to: 'acetylcoamat' }],
        cof: TOP_BOTTOM, irreversible: true, type: 'β-Oxidation',
        equation: 'Fatty acyl-CoA (Matrix) + FAD + NAD⁺ → Acetyl-CoA + FADH₂ + NADH',
        hint: 'Chu trình β-oxidation trong chất nền ty thể sinh FADH₂, NADH và Acetyl-CoA.'
      }
    ];

    return {
      id: 'lipidsreg',
      title: 'Điều hòa chuyển hóa Lipid thông qua ACC & CAT I',
      subtitle: 'Kiểm soát đối kháng giữa tổng hợp axit béo (Cytosol) và β-oxidation (Mitochondria)',
      tag: 'REG', location: 'Cytosol & Mitochondria', color: '#E56F6F',
      nodes: nodes, reactions: reactions,
      order: ['carb2glc', 'glc2accoa', 'regacc1', 'regacc2', 'regacc3', 'regfas', 'regcpt1', 'regcact', 'regbeta'],
      start: ['dietcarb', 'lowglc', 'citratesig', 'palmsig', 'ampksig'],
      regions: [
        {
          type: 'rect',
          label: 'Cytosol: Điều hòa ACC & Tổng hợp axit béo',
          color: '#F1F4E4',
          nodes: ['dietcarb', 'highglc', 'insulin', 'lowglc', 'glucose', 'citratesig', 'accact', 'accinact', 'glucagon', 'acetylcoar', 'malonylcoar', 'palmitate', 'palmsig', 'ampksig', 'facylcoacyt'],
          padX: 60, padTop: 60, padBottom: 60
        },
        {
          type: 'rect',
          label: 'Mitochondria: OMM → IMM → Matrix (β-Oxidation)',
          color: '#F7EAD5',
          nodes: ['facylcarn', 'facylcoamat', 'acetylcoamat'],
          padX: 60, padTop: 60, padBottom: 70
        }
      ],
      membranes: [
        { x1:  930, y1: 1070, x2:  930, y2: 1360 },
        { x1: 1470, y1: 1070, x2: 1470, y2: 1360 }
      ],
      notes: [
        { text: 'OMM – CAT I (CPT1)', x: 930, y: 1390, size: 14, color: '#5a4a2a', anchor: 'middle' },
        { text: 'IMM – CACT & CAT II (CPT II)', x: 1470, y: 1390, size: 14, color: '#5a4a2a', anchor: 'middle' },
        { text: '✖ Malonyl-CoA ức chế dị lập thể CAT I (khóa β-oxy hóa)', x: 820, y: 995, size: 14, color: '#C0392B', anchor: 'middle' }
      ],
      summary: [
        'Đường huyết cao → ↑ Insulin → Protein phosphatase khử P kích hoạt ACC; Citrate hoạt hóa dị lập thể ACC.',
        'Đường huyết thấp → ↑ Glucagon/Epinephrine → PKA (cùng AMPK khi thiếu năng lượng) gắn P bất hoạt ACC; Palmitoyl-CoA ức chế ngược ACC.',
        'Malonyl-CoA ức chế dị lập thể CAT I (CPT1) ở màng ngoài ty thể, ngăn đồng thời tổng hợp và β-oxy hóa axit béo.'
      ],
      region: ['lipid', 'all'], noDistractor: ['hplus', 'mg']
    };
  }

  var fas = fasPathway();
  var faelong = faelongPathway();
  var desatmech = desatmechPathway();
  var tag = tagPathway();
  var lipidsreg = lipidsregPathway();

  fas.stepNames = function (r) { return ['FAS bước ' + r.step, 'FAS ' + r.step]; };
  faelong.stepNames = function (r) { return ['Kéo dài/Khử bão hòa ' + r.step, 'ELO ' + r.step]; };
  desatmech.stepNames = function (r) { return ['Hệ Desaturase bước ' + r.step, 'DES ' + r.step]; };
  tag.stepNames = function (r) { return ['Tổng hợp TAG/GPL ' + r.step, 'TAG ' + r.step]; };
  lipidsreg.stepNames = function (r) { return ['Điều hòa ACC-CAT1 ' + r.step, 'REG ' + r.step]; };


MG.pathways = {
fas: fas, faelong: faelong, desatmech: desatmech, tag: tag, lipidsreg: lipidsreg,
glycolysis: glycolysis, lactate: lactate, ethanol: ethanol, gluconeogenesis: gluconeogenesis, glycogen: glycogen,
pdhtca: pdhtca, tca: tca, full: full, betaox: betaox, boxsimple: boxsimple, etc: etc, etcsimple: etcsimple,
etcpath: etcpath, gpshuttle: gpshuttle, masshuttle: masshuttle, antport: antport,
pyrentry: pyrentry, mitodyn: mitodyn, apopint: apopint, apopext: apopext,
urea: urea, gluala: gluala
};
})(typeof window !== 'undefined' ? window : globalThis);
