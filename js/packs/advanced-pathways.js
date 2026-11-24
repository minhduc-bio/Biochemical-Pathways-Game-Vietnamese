(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs || !MG.everything || !MG.everything._tools) { return; }
var P = MG.packs.pack('advanced');
var numbered = MG.everything._tools.numbered;
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var WEST_EAST = { 'in': 'west', out: 'east' };
var CHLORO_NOTES = {
etcwater: 'Chất cho electron trong quá trình quang hợp. Phức hợp Mn của hệ thống quang hợp II hút electron từ nước ở phía lòng ống: mỗi phân tử H₂O cho ½ O₂ và 2 H⁺ cho mỗi cặp electron (2 phân tử H₂O cho O₂ và 4 H⁺ cho mỗi bốn electron), và H⁺ tích tụ bên trong thylakoid.',
etcadp: 'Nucleotide diphosphate (ADP) là chất nền mà enzyme của màng thylakoid liên kết với phosphate vô cơ. Nó là chất nền của ATP synthase CF1CF0, và trong lục lạp, nó được tạo ra lại khi chu trình Calvin tiêu thụ ATP, do đó ADP quay trở lại từ chất nền (stroma) đến màng thylakoid.',
etcatp: 'Đây là đơn vị năng lượng mà enzyme của màng thylakoid tạo ra trong chất nền khi các proton chảy ra khỏi khoang. Nó là sản phẩm của enzyme tổng hợp ATP CF1CF0, và chu trình Calvin sử dụng nó: 18 ATP và 12 NADPH được dùng để tạo ra một phân tử glucose.'
};
var zNodes = {
mn: node('zmn', 150, 1600), p680: node('zp680', 150, 1310), p680x: node('zp680x', 150, 150),
chla: node('zchla', 530, 150), pheo: node('zpheo', 530, 440), qa: node('zqa', 530, 730), qb: node('zqb', 530, 1020),
pq: node('zpq', 910, 1020), fes: node('zfes', 1290, 1020), cytf: node('zcytf', 1290, 1310), pc: node('zpc', 1670, 1310),
p700: node('zp700', 2050, 1310), p700x: node('zp700x', 2050, 150),
a0: node('za0', 2430, 150), a1: node('za1', 2430, 440), fex: node('zfex', 2430, 730), fd: node('zfd', 2810, 730), nadph: node('znadph', 3190, 730)
};
var zReactions = [
{
id: 'zs1', step: 1, tile: 'Nước', enzyme: 'psii', substrates: ['mn'], products: ['p680'], ins: ['h2o'], outs: ['o2', 'hplus'],
arrows: [{ from: 'mn', to: 'p680' }], cof: WEST_EAST,
type: 'Water oxidation (4 e⁻)', irreversible: true,
equation: '2 H₂O → O₂ + 4 H⁺ + 4 e⁻ tại phức chất Mn, và các electron lấp đầy các lỗ trống của P680⁺.',
hint: 'Một cụm kim loại ở mặt trong của màng rút từng electron một khỏi một phân tử nhỏ phổ biến qua năm trạng thái oxi hóa và trao chúng cho cặp sắc tố vừa mất electron. Sau bốn vòng, một chất khí được giải phóng và môi trường bên trong túi trở nên acid hơn.'
},
{
id: 'zs2', step: 2, tile: 'P680*', enzyme: 'psii', substrates: ['p680'], products: ['p680x'], ins: ['photon'], outs: [],
arrows: [{ from: 'p680', to: 'p680x' }], cof: WEST_EAST,
type: 'Kích thích quang học', irreversible: false,
equation: 'P680 + photon → P680*',
hint: 'Cặp sắc tố đặc biệt ở trung tâm phản ứng hấp thụ một lượng tử năng lượng bức xạ, khiến một electron của nó nhảy lên mức năng lượng cao hơn nhiều. Cặp sắc tố lúc này trở thành chất cho electron mạnh thay vì chất nhận electron mạnh.'
},
{
id: 'zs3', step: 3, tile: 'Chl a', enzyme: 'psii', substrates: ['p680x'], products: ['chla'], ins: [], outs: [],
arrows: [{ from: 'p680x', to: 'chla' }],
type: 'Electron transfer (charge separation)', irreversible: false,
equation: 'P680* + Chl a → P680⁺ + Chl a⁻',
hint: 'Cặp sắc tố ở trạng thái kích thích trao electron của nó cho một phân tử sắc tố xanh kế cận, để lại một điện tích dương trên chất cho. Đây là bước đầu tiên của sự phân tách điện tích qua màng.'
},
{
id: 'zs4', step: 4, tile: 'Pheo', enzyme: 'psii', substrates: ['chla'], products: ['pheo'], ins: [], outs: [],
arrows: [{ from: 'chla', to: 'pheo' }], cof: WEST_EAST,
type: 'Electron transfer', irreversible: false,
equation: 'Chl a⁻ + Pheo → Chl a + Pheo⁻',
hint: 'Electron di chuyển tiếp sang sắc tố thứ hai, là một vòng chlorin đã mất ion kim loại ở tâm. Nó giữ electron trong khoảnh khắc và ngăn electron rơi ngược trở lại chất cho.'
},
{
id: 'zs5', step: 5, tile: 'QA', enzyme: 'psii', substrates: ['pheo'], products: ['qa'], ins: [], outs: [],
arrows: [{ from: 'pheo', to: 'qa' }], cof: WEST_EAST,
avoid: ['zpq'],
type: 'Electron transfer', irreversible: false,
equation: 'Pheo⁻ + QA → Pheo + QA⁻',
hint: 'Electron đi tới quinone đầu tiên trong hai quinone gắn trong trung tâm phản ứng, vốn chỉ giữ được từng electron một. Từ đây electron đã ở xa chất cho và khó quay ngược trở lại.'
},
{
id: 'zs6', step: 6, tile: 'QB', enzyme: 'psii', substrates: ['qa'], products: ['qb'], ins: [], outs: [],
arrows: [{ from: 'qa', to: 'qb' }], cof: WEST_EAST,
avoid: ['zpq'],
type: 'Electron transfer', irreversible: false,
equation: 'QA⁻ + QB → QA + QB⁻ (hai lần, sau đó QB lấy 2 H⁺ từ mô đệm)',
hint: 'Quinone thứ nhất truyền electron cho quinone thứ hai. Khi quinone thứ hai đã thu đủ hai electron và hai điện tích dương từ chất nền (stroma), nó rời khỏi vị trí gắn dưới dạng chất mang khử hoàn toàn.'
},
{
id: 'zs7', step: 7, tile: 'PQ', enzyme: 'psii', substrates: ['qb'], products: ['pq'], ins: [], outs: [],
arrows: [{ from: 'qb', to: 'pq' }],
type: 'Release into the quinone pool', irreversible: false,
equation: 'QBH₂ → PQH₂ (tham gia vào nhóm plastoquinone di động)',
hint: 'Quinone dạng khử rời khỏi trung tâm phản ứng và gia nhập bể chất mang tan trong lipid di động ở giữa màng, sẵn sàng giao hai electron của nó cho phức hợp tiếp theo.'
},
{
id: 'zs8', step: 8, tile: 'Fe-S', enzyme: 'cytb6f', substrates: ['pq'], products: ['fes'], ins: [], outs: ['hplus'],
arrows: [{ from: 'pq', to: 'fes' }],
type: 'Electron transfer and proton release', irreversible: false,
equation: 'PQH₂ + 2 Fe-S (oxy hóa) → PQ + 2 Fe-S (khử) + 2 H⁺ (lumen)',
hint: 'Chất mang di động bị oxi hóa tại phức hợp kế tiếp: các electron của nó chuyển sang một protein nhỏ chứa cụm kim loại, đồng thời hai ion dương được giải phóng vào khoang bên trong túi. Đây là nơi phần lớn gradient qua màng được thiết lập.'
},
{
id: 'zs9', step: 9, tile: 'Cyt f', enzyme: 'cytb6f', substrates: ['fes'], products: ['cytf'], ins: [], outs: [],
arrows: [{ from: 'fes', to: 'cytf' }], cof: WEST_EAST,
type: 'Electron transfer', irreversible: false,
equation: 'Fe-S (khử) + cyt f (Fe³⁺) → Fe-S (oxy hóa) + cyt f (Fe²⁺)',
hint: 'Electron di chuyển từ protein nhỏ chứa cụm kim loại đó sang một protein heme thuộc cùng phức hợp nằm hướng vào lòng túi thylakoid.'
},
{
id: 'zs10', step: 10, tile: 'PC', enzyme: 'cytb6f', substrates: ['cytf'], products: ['pc'], ins: [], outs: [],
arrows: [{ from: 'cytf', to: 'pc' }],
type: 'Electron transfer', irreversible: false,
equation: 'cyt f (Fe²⁺) + PC (Cu²⁺) → cyt f (Fe³⁺) + PC (Cu⁺)',
hint: 'Electron rời khỏi phức hợp trên một protein chứa đồng nhỏ trôi nổi trong lòng túi và vận chuyển từng electron một về phía trung tâm phản ứng thứ hai.'
},
{
id: 'zs11', step: 11, tile: 'P700', enzyme: 'psi', substrates: ['pc'], products: ['p700'], ins: [], outs: [],
arrows: [{ from: 'pc', to: 'p700' }],
type: 'Electron transfer', irreversible: false,
equation: 'PC (Cu⁺) + P700⁺ → PC (Cu²⁺) + P700',
hint: 'Chất mang hòa tan cập bến vào trung tâm phản ứng thứ hai và trao electron của nó cho cặp sắc tố bị mất electron ở đó, giúp cặp sắc tố sẵn sàng hấp thụ một lượng tử năng lượng bức xạ khác.'
},
{
id: 'zs12', step: 12, tile: 'P700*', enzyme: 'psi', substrates: ['p700'], products: ['p700x'], ins: ['photon'], outs: [],
arrows: [{ from: 'p700', to: 'p700x' }], cof: WEST_EAST,
type: 'Kích thích quang học', irreversible: false,
equation: 'P700 + photon → P700*',
hint: 'Cặp sắc tố thứ hai hấp thụ một lượng tử năng lượng bức xạ và một electron nhảy lên mức năng lượng còn cao hơn cả ở trung tâm phản ứng thứ nhất. Điều này tạo ra lực khử mạnh nhất toàn chuỗi.'
},
{
id: 'zs13', step: 13, tile: 'A0', enzyme: 'psi', substrates: ['p700x'], products: ['a0'], ins: [], outs: [],
arrows: [{ from: 'p700x', to: 'a0' }],
type: 'Electron transfer (charge separation)', irreversible: false,
equation: 'P700* + A₀ → P700⁺ + A₀⁻',
hint: 'Cặp sắc tố ở trạng thái kích thích trao electron cho chất nhận đầu tiên của trung tâm phản ứng thứ hai — một phân tử sắc tố — và để lại một điện tích dương trên cặp sắc tố.'
},
{
id: 'zs14', step: 14, tile: 'A1', enzyme: 'psi', substrates: ['a0'], products: ['a1'], ins: [], outs: [],
arrows: [{ from: 'a0', to: 'a1' }], cof: WEST_EAST,
type: 'Electron transfer', irreversible: false,
equation: 'A₀⁻ + A₁ → A₀ + A₁⁻',
hint: 'Electron chuyển sang một quinone gắn trong cùng trung tâm phản ứng, tiến thêm một bước ra xa cặp sắc tố.'
},
{
id: 'zs15', step: 15, tile: 'FX FA FB', enzyme: 'psi', substrates: ['a1'], products: ['fex'], ins: [], outs: [],
arrows: [{ from: 'a1', to: 'fex' }], cof: WEST_EAST,
avoid: ['zfes'],
type: 'Electron transfer', irreversible: false,
equation: 'A₁⁻ + các trung tâm Fe-S (bị oxy hóa) → A₁ + các trung tâm Fe-S (bị khử)',
hint: 'Electron rời khỏi quinone và di chuyển dọc theo một dây dẫn ngắn gồm ba cụm kim loại nhỏ ở rìa phía stroma của trung tâm phản ứng.'
},
{
id: 'zs16', step: 16, tile: 'Fd', enzyme: 'psi', substrates: ['fex'], products: ['fd'], ins: [], outs: [],
arrows: [{ from: 'fex', to: 'fd' }],
avoid: ['zfes'],
type: 'Electron transfer', irreversible: false,
equation: 'Các trung tâm Fe-S (bị khử) + Fd (bị oxy hóa) → Các trung tâm Fe-S (bị oxy hóa) + Fd (bị khử)',
hint: 'Cụm cuối cùng trao electron cho một protein nhỏ hòa tan trong stroma, chất này mang từng electron một đi ra xa khỏi màng.'
},
{
id: 'zs17', step: 17, tile: 'NADPH', enzyme: 'fnr', substrates: ['fd'], products: ['nadph'], ins: ['nadp', 'hplus'], outs: [],
arrows: [{ from: 'fd', to: 'nadph' }],
type: 'Reduction of NADP⁺', irreversible: false,
equation: '2 Fd (dạng khử) + NADP⁺ + H⁺ → 2 Fd (dạng oxy hóa) + NADPH',
hint: 'Một enzyme flavin trong stroma thu nhận electron từ hai chất mang nhỏ hòa tan và trao cặp electron đó cho một chất mang nucleotide dạng oxi hóa cùng một ion dương từ stroma. Bước này tạo ra chất mang dạng khử cần cho chu trình Calvin.'
}
];
var zscheme = {
title: 'Sơ đồ Z', subtitle: 'Chuyển hóa nước thành NADPH, từng chất vận chuyển một.', tag: 'ZSC',
location: 'Màng thylakoid', color: '#8FD19E', big: true, terms: { enz: 'protein' },
nodes: zNodes, reactions: zReactions, order: zReactions.map(function (r) { return r.id; }), start: ['mn'],
regions: [
{ type: 'rect', label: 'Hệ thống quang hợp II', color: '#F6DFB4', x: 20, y: 20, w: 700, h: 1760 },
{ type: 'rect', label: 'Phức hợp Cytochrome b6f', color: '#F6C9D8', x: 1130, y: 860, w: 320, h: 640 },
{ type: 'rect', label: 'Hệ thống quang hợp I', color: '#F6DFB4', x: 1900, y: 20, w: 700, h: 1500 }
],
notes: [
note('Các bang hưng phấn ở vị trí cao, các bang bình lặng ở vị trí thấp.', 40, 1750)
],
summary: [
'Hai hệ quang hợp hoạt động nối tiếp: hệ quang hợp II lấy electron từ nước và hệ quang hợp I lại kích thích chúng, do đó mỗi electron được kích thích hai lần trên đường đến NADPH, mỗi lần trong một hệ quang hợp.',
'Đường đi được vạch ra là P680, diệp lục a, pheophytin, QA, QB, nhóm plastoquinone, protein Rieske Fe-S và cytochrome f của phức hợp b6f, plastocyanin, P700, A0, A1, các trung tâm sắt-lưu huỳnh, ferredoxin và reductase.',
'Các proton được giải phóng vào khoang rỗng tại phức hợp Mn và phức hợp b6f, và được hấp thụ từ chất nền tại QB, tại phức hợp b6f và khi NADP⁺ bị khử; gradient mà chúng tạo ra thúc đẩy hoạt động của ATP synthase.',
'Trong phức hợp b6f, một electron của mỗi plastoquinol đi qua protein Rieske và electron còn lại quay trở lại bể quinone thông qua cytochrome b6 (chu trình Q), nhờ đó 4 H⁺ được giải phóng và 2 H⁺ được hấp thụ cho mỗi hai electron.',
'Chu trình tuần hoàn từ hệ thống quang hợp I trở lại phức hợp b6f tạo ra ATP nhưng không tạo ra NADPH.'
],
region: ['photo', 'etc', 'all'], noDistractor: ['mg', 'gtp', 'gdp', 'glutc', 'akgc', 'coa', 'utp', 'udp', 'ump', 'q', 'cytcox', 'proclight', 'procphotophos', 'proccalvin', 'procglycolysis', 'procoxphos', 'proctca'],
stepNames: numbered('Sơ đồ Z', 'ZSC')
};
var tNodes = {
h2o: node('etcwater', 150, 925), pq: node('zpq', 530, 395), pc: node('zpc', 910, 925), fd: node('zfd', 1290, 145), nadph: node('znadph', 1670, 145),
adp: node('etcadp', 2050, 145), atp: node('etcatp', 2430, 145)
};
var tReactions = [
{
id: 'th1', step: 1, tile: 'PSII', enzyme: 'psii', substrates: ['h2o'], products: ['pq'], ins: ['photon'], outs: ['o2', 'hplus'],
arrows: [{ from: 'h2o', to: 'pq' }],
type: 'Water oxidation and quinone reduction', irreversible: true,
equation: 'H₂O + PQ + 2 H⁺ (stroma) → ½ O₂ + PQH₂ + 2 H⁺ (lumen), được thúc đẩy bởi hai photon (một photon cho mỗi electron)',
hint: 'Năng lượng bức xạ hấp thụ cho phép một phức hợp lớn trên màng rút electron từ một phân tử nhỏ phổ biến trong khoang trong và trao chúng cho chất mang lipid di động, chất này đồng thời lấy các ion dương từ phía bên kia. Một chất khí được giải phóng và acid tích tụ bên trong.'
},
{
id: 'th2', step: 2, tile: 'Cyt b6f', enzyme: 'cytb6f', substrates: ['pq'], products: ['pc'], ins: [], outs: ['hplus'],
arrows: [{ from: 'pq', to: 'pc' }],
type: 'Electron transfer and proton pumping', irreversible: false,
equation: 'PQH₂ + 2 PC (Cu²⁺) + 2 H⁺ (stroma) → PQ + 2 PC (Cu⁺) + 4 H⁺ (lumen)',
hint: 'Chất mang di động dạng khử bị oxi hóa bởi một phức hợp nằm giữa hai trung tâm phản ứng. Phức hợp này truyền electron cho một protein đồng nhỏ trong khoang trong và bơm các ion dương qua màng vào khoang đó.'
},
{
id: 'th3', step: 3, tile: 'PSI', enzyme: 'psi', substrates: ['pc'], products: ['fd'], ins: ['photon'], outs: [],
arrows: [{ from: 'pc', to: 'fd' }],
type: 'Photoexcitation and electron transfer', irreversible: false,
equation: 'PC (Cu⁺) + Fd (bị oxy hóa) + photon → PC (Cu²⁺) + Fd (bị khử)',
hint: 'Một phức hợp lớn thứ hai hấp thụ năng lượng bức xạ và nâng một electron từ protein đồng ở khoang trong lên một protein sắt-lưu huỳnh nhỏ ở mặt ngoài màng.'
},
{
id: 'th4', step: 4, tile: 'FNR', enzyme: 'fnr', substrates: ['fd'], products: ['nadph'], ins: ['nadp', 'hplus'], outs: [],
arrows: [{ from: 'fd', to: 'nadph' }],
type: 'Reduction of NADP⁺', irreversible: false,
equation: '2 Fd (dạng khử) + NADP⁺ + H⁺ → 2 Fd (dạng oxy hóa) + NADPH',
hint: 'Một enzyme flavin ở mặt ngoài nhận electron từ hai chất mang sắt-lưu huỳnh nhỏ và trao chúng cho một chất mang nucleotide dạng oxi hóa cùng với một ion dương.'
},
{
id: 'th5', step: 5, tile: 'ATP synthase', enzyme: 'cf1cf0', substrates: ['adp'], products: ['atp'], ins: ['pi', 'hplus'], outs: ['h2o'],
arrows: [{ from: 'adp', to: 'atp' }],
type: 'ATP synthesis (chemiosmosis)', irreversible: false,
equation: 'ADP + Pᵢ + n H⁺ (lumen) → ATP + H₂O + n H⁺ (stroma)',
hint: 'Các ion dương tích tụ bên trong túi chảy ngược ra ngoài qua một phức hợp quay, và sự quay của trục trung tâm dẫn động đầu xúc tác nối nucleotide diphosphate với một ion vô cơ trong dung dịch để tạo đồng tiền năng lượng. Dòng chảy này vẫn hoạt động trong tối nếu có sẵn gradient.'
}
];
var thylakoid = {
title: 'Phản ứng quang hóa trên màng thylakoid', subtitle: 'Hình minh họa: electron, proton và ATP', tag: 'THY',
location: 'Màng thylakoid', color: '#7FCDB0', terms: { enz: 'protein' },
nodes: tNodes, reactions: tReactions, order: tReactions.map(function (r) { return r.id; }), start: ['h2o'],
regions: [
{ type: 'rect', label: 'Mô đệm', color: '#DCEBF7', x: 20, y: 20, w: 2560, h: 250 },
{ type: 'rect', label: 'Màng thylakoid', color: '#EFD9B3', x: 20, y: 270, w: 2560, h: 250 },
{ type: 'rect', label: 'Lumen', color: '#FFF1BF', x: 20, y: 520, w: 2560, h: 540 }
],
notes: [
note('Các proton được giải phóng vào lòng ống.', 300, 1010),
note('và chảy ngược trở lại qua ATP synthase', 300, 1042)
],
summary: [
'Hệ thống quang hợp II phân tách nước ở phía lòng ống, bể plastoquinone vận chuyển các electron qua màng đến phức hợp cytochrome b6f, và plastocyanin vận chuyển chúng qua lòng ống đến hệ thống quang hợp I.',
'Ở phía chất nền, ferredoxin lấy các electron từ hệ thống quang hợp I và reductase (FNR) sử dụng chúng để tạo ra NADPH; phức hợp b6f hấp thụ 2 H⁺ từ chất nền và giải phóng 4 H⁺ vào khoang lumen.',
'Enzyme ATP synthase CF1CF0 cho phép H⁺ di chuyển từ khoang nội bào vào mô đệm qua màng thylakoid và tạo ra ATP từ ADP và Pᵢ.'
],
region: ['photo', 'etc', 'all'], noDistractor: ['mg', 'gtp', 'gdp', 'glutc', 'akgc', 'coa', 'utp', 'udp', 'ump', 'q', 'cytcox', 'proclight', 'procphotophos', 'proccalvin', 'procglycolysis', 'procoxphos', 'proctca'],
stepNames: numbered('Màng thylakoid', 'THY'),
entityNotes: { etcwater: CHLORO_NOTES.etcwater, etcadp: CHLORO_NOTES.etcadp, etcatp: CHLORO_NOTES.etcatp }
};
var lNodes = {
h2o: node('etcwater', 150, 150), nadph: node('znadph', 530, 150), adp: node('etcadp', 150, 730), atp: node('etcatp', 530, 730), glc: node('glucose', 1290, 440)
};
var lReactions = [
{
id: 'ls1', step: 1, enzyme: 'proclight', substrates: ['h2o'], products: ['nadph'], ins: ['nadp', 'photon'], outs: ['o2', 'hplus'],
arrows: [{ from: 'h2o', to: 'nadph' }],
type: 'Light reactions: NADP⁺ reduced, water oxidized', irreversible: false,
equation: '2 H₂O + 2 NADP⁺ → O₂ + 2 NADPH + 2 H⁺ (được thúc đẩy bởi photon)',
hint: 'Hai tổ hợp protein liên kết trên màng thylakoid dùng năng lượng bức xạ hấp thụ để đẩy electron từ phân tử nhỏ phổ biến nhất của tế bào sang một chất mang nucleotide dạng oxi hóa, đồng thời giải phóng một chất khí.'
},
{
id: 'ls2', step: 2, enzyme: 'procphotophos', substrates: ['adp'], products: ['atp'], ins: ['pi'], outs: ['h2o'],
arrows: [{ from: 'adp', to: 'atp' }],
avoid: ['proclight'],
type: 'Quang hợp', irreversible: false,
equation: 'ADP + Pᵢ → ATP + H₂O (được thúc đẩy bởi gradient H⁺)',
hint: 'Dòng ion dương chảy ra khỏi túi thylakoid xuôi theo gradient của chúng dẫn động sự nối ghép nucleotide diphosphate và ion vô cơ để tạo đồng tiền năng lượng. Quá trình này cần gradient chứ không cần trực tiếp ánh sáng.'
},
{
id: 'ls3', step: 3, enzyme: 'proccalvin', substrates: ['nadph', 'atp'], products: ['glc'], ins: ['co2', 'hplus', 'h2o'], outs: ['nadp', 'adp', 'pi'],
arrows: [{ from: 'nadph', to: 'glc' }, { from: 'atp', to: 'glc' }],
type: 'Carbon fixation (net equation of the Calvin cycle)', irreversible: true,
equation: '6 CO₂ + 18 ATP + 12 NADPH + 12 H⁺ + 12 H₂O → glucose + 18 ADP + 18 Pᵢ + 12 NADP⁺',
hint: 'Trong stroma, chất mang dạng khử và đồng tiền năng lượng được tiêu thụ để cố định một chất khí từ không khí thành đường 6 carbon, còn các dạng đã dùng xong quay lại màng thylakoid để được nạp lại.'
}
];
var lightsugar = {
title: 'Từ ánh sáng đến đường', subtitle: 'Phản ứng quang hợp cung cấp năng lượng cho chu trình Calvin như thế nào?', tag: 'L2S',
location: 'Lục lạp: màng thylakoid và chất nền', color: '#A8D88A', terms: { enz: 'process' },
nodes: lNodes, reactions: lReactions, order: lReactions.map(function (r) { return r.id; }), start: ['h2o', 'adp'],
regions: [
{ type: 'rect', label: 'Phản ứng ánh sáng', color: '#EFD9B3', x: 20, y: 20, w: 700, h: 1000 },
{ type: 'rect', label: 'Mô đệm', color: '#DCEBF7', x: 860, y: 20, w: 700, h: 1000 }
],
notes: [
note('ADP và NADP⁺ quay trở lại màng thylakoid.', 880, 960),
note('để được nạp lại năng lượng (ATP và NADPH bị mất đi)', 880, 992)
],
summary: [
'Phản ứng quang hợp tạo ra NADPH (và O₂) từ nước, quá trình phosphoryl hóa quang hợp tạo ra ATP từ gradient proton, và chu trình Calvin sử dụng cả hai để cố định CO₂ thành đường.',
'Chu trình Calvin sử dụng 18 ATP và 12 NADPH cho mỗi phân tử glucose, đồng thời trả lại 18 ADP và 12 NADP⁺; phương trình tổng thể cũng bao gồm 12 H₂O và 12 H⁺.',
'Phản ứng quang hợp cần ánh sáng, nhưng enzyme tổng hợp ATP chỉ cần độ chênh lệch độ pH: lục lạp tạo ra ATP trong bóng tối khi có sự chênh lệch độ pH: lục lạp tạo ra ATP trong bóng tối khi có sự chênh lệch độ pH.'
],
region: ['photo', 'gly', 'etc', 'all'], noDistractor: ['mg', 'gtp', 'gdp', 'glutc', 'akgc', 'coa', 'utp', 'udp', 'ump', 'q', 'cytcox'],
stepNames: numbered('Từ ánh sáng đến đường', 'L2S'),
entityNotes: {
etcwater: CHLORO_NOTES.etcwater, etcadp: CHLORO_NOTES.etcadp, etcatp: CHLORO_NOTES.etcatp,
glucose: 'Đường được tạo ra bởi chu trình Calvin từ 6 CO₂, 18 ATP và 12 NADPH trong phương trình tổng quát. Glucose hiếm khi là sản phẩm cuối cùng của thực vật.'
}
};
var yNodes = {
p700: node('zp700', 150, 395), p700x: node('zp700x', 530, 395), fd: node('zfd', 910, 145), pc: node('zpc', 910, 925),
adp: node('etcadp', 1670, 145), atp: node('etcatp', 2050, 145)
};
var yReactions = [
{
id: 'cy1', step: 1, tile: 'Fd', enzyme: 'psi', substrates: ['p700x'], products: ['fd'], ins: [], outs: [],
arrows: [{ from: 'p700x', to: 'fd' }],
type: 'Electron transfer out of the reaction center', irreversible: false,
equation: 'P700* + Fd (bị oxy hóa) → P700⁺ + Fd (bị khử), thông qua A₀, A₁ và các trung tâm Fe-S',
hint: 'Cặp sắc tố bị kích thích của trung tâm phản ứng thứ hai trao electron cho chuỗi chất nhận trong phức hợp, và electron kết thúc trên một protein sắt-lưu huỳnh nhỏ hòa tan trong stroma — chính là chất cung cấp electron cho enzyme khử ở con đường không vòng.'
},
{
id: 'cy2', step: 2, tile: 'Cyt b6f', enzyme: 'cytb6f', substrates: ['fd'], products: ['pc'], ins: [], outs: ['hplus'],
arrows: [{ from: 'fd', to: 'pc' }], pillAt: 0.4,
type: 'Electron return and proton pumping', irreversible: false,
equation: '2 Fd (khử) + PQ + 2 H⁺ (stroma) → 2 Fd (oxy hóa) + PQH₂; PQH₂ + 2 PC (Cu²⁺) → PQ + 2 PC (Cu⁺) + 4 H⁺ (lumen)',
hint: 'Thay vì khử chất mang nucleotide, protein sắt-lưu huỳnh hòa tan trao electron ngược trở lại bể quinone di động trong màng. Phức hợp giữa hai trung tâm phản ứng lại oxi hóa quinol, đẩy ion dương vào khoang trong và truyền electron sang protein đồng của lòng túi.'
},
{
id: 'cy3', step: 3, tile: 'P700', enzyme: 'psi', substrates: ['pc'], products: ['p700'], ins: ['photon'], outs: [],
arrows: [{ from: 'p700', to: 'p700x' }, { from: 'pc', to: 'p700' }],
type: 'The ring closes: the hole is refilled and the pair is excited again', irreversible: false,
equation: 'PC (Cu⁺) + P700⁺ → PC (Cu²⁺) + P700, sau đó là P700 + photon → P700*',
hint: 'Protein đồng cập bến vào trung tâm phản ứng thứ hai và trả lại electron cho cặp sắc tố vừa mất nó. Một lượng tử năng lượng bức xạ mới lại nâng electron đó lên, nên cùng một electron có thể đi vòng lại lần nữa. Không có gì bị lấy từ nước trong vòng này.'
},
{
id: 'cy4', step: 4, tile: 'ATP synthase', enzyme: 'cf1cf0', substrates: ['adp'], products: ['atp'], ins: ['pi', 'hplus'], outs: ['h2o'],
arrows: [{ from: 'adp', to: 'atp' }],
type: 'ATP synthesis (the only product of the loop)', irreversible: false,
equation: 'ADP + Pᵢ + n H⁺ (lumen) → ATP + H₂O + n H⁺ (stroma)',
hint: 'Các ion dương được vòng này bơm vào trong túi chảy ngược ra ngoài qua phức hợp quay, và đầu xúc tác nối nucleotide diphosphate với một ion vô cơ. Đây là sản phẩm duy nhất của vòng: không tạo chất mang dạng khử và không sinh chất khí.'
}
];
var cyclic = {
title: 'Dòng electron tuần hoàn', subtitle: 'Chỉ riêng hệ thống quang hợp I: ATP không có NADPH', tag: 'CYC',
location: 'Màng thylakoid', color: '#9ED4C2', terms: { enz: 'protein' },
nodes: yNodes, reactions: yReactions, order: yReactions.map(function (r) { return r.id; }), start: ['p700x', 'adp'],
regions: [
{ type: 'rect', label: 'Mô đệm', color: '#DCEBF7', x: 20, y: 20, w: 2300, h: 250 },
{ type: 'rect', label: 'Màng thylakoid', color: '#EFD9B3', x: 20, y: 270, w: 2300, h: 250 },
{ type: 'rect', label: 'Lumen', color: '#FFF1BF', x: 20, y: 520, w: 2300, h: 540 }
],
notes: [
note('Electron chuyển động vòng tròn: nước không bị phân tách.', 1290, 880),
note('Không có NADPH nào được tạo ra, chỉ có ATP được tạo ra.', 1290, 912)
],
summary: [
'Trong dòng electron tuần hoàn, electron rời khỏi P700* sẽ đi đến ferredoxin rồi quay trở lại bể plastoquinone và phức hợp cytochrome b6f thay vì đến NADP⁺; plastocyanin trả lại electron đó cho P700, và ánh sáng lại kích thích nó.',
'Phức hợp b6f vẫn bơm proton vào khoang, do đó ATP synthase vẫn tạo ra ATP: vòng lặp chỉ tạo ra ATP và không có gì khác, không có NADPH và không có O₂, bởi vì hệ thống quang hợp II và phức hợp phân tách nước không tham gia vào quá trình này.',
'Lục lạp chuyển sang chu trình này khi cần nhiều ATP hơn NADPH: chu trình Calvin tiêu tốn 3 ATP cho mỗi 2 NADPH, và con đường không tuần hoàn tạo ra ít ATP hơn thế.',
'Vi khuẩn quang hợp chỉ có một trung tâm phản ứng duy nhất vận hành theo chu trình này, đó là lý do tại sao nhiều loại trong số chúng không tạo ra O₂.'
],
region: ['photo', 'etc', 'all'], noDistractor: ['mg', 'gtp', 'gdp', 'glutc', 'akgc', 'coa', 'utp', 'udp', 'ump', 'q', 'cytcox', 'proclight', 'procphotophos', 'proccalvin', 'procglycolysis', 'procoxphos', 'proctca'],
stepNames: numbered('Dòng electron tuần hoàn', 'CYC'),
entityNotes: {
etcadp: CHLORO_NOTES.etcadp, etcatp: CHLORO_NOTES.etcatp,
zfd: 'Protein sắt-lưu huỳnh nhỏ trong chất nền nhận electron từ hệ thống quang hợp I. Trong chu trình khép kín, nó trả lại electron đó cho bể plastoquinone thay vì cho reductase tạo ra NADPH.',
zpc: 'Protein đồng trong lòng ống mang electron từ phức hợp cytochrome b6f đến P700⁺. Trong chu trình khép kín, nó hoàn thành vòng lặp.',
zp700x: 'Cặp sắc tố bị kích thích của hệ thống quang hợp I, điểm khởi đầu của chu trình: electron của nó đi đến ferredoxin, và electron đó quay trở lại P700 thông qua phức hợp b6f và plastocyanin.',
zp700: 'Cặp sắc tố ở trạng thái cơ bản của hệ thống quang hợp I. Plastocyanin lấp đầy khoảng trống do sự kích thích để lại, và photon tiếp theo bắt đầu lại chu trình.'
}
};
P.pathways.zscheme = zscheme;
P.pathways.thylakoid = thylakoid;
P.pathways.cyclic = cyclic;
P.pathways.lightsugar = lightsugar;
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs || !MG.everything || !MG.everything._tools) { return; }
var P = MG.packs.pack('advanced');
var numbered = MG.everything._tools.numbered;
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var WEST_EAST = { 'in': 'west', out: 'east' };
var cNodes = {
rubp: node('rubp', 150, 150), pg3: node('pg3', 530, 150), bpg13: node('bpg13', 910, 150), g3p: node('g3p', 1290, 150),
dhap: node('dhap', 1290, 440), f16bp: node('f16bp', 1290, 730), f6p: node('f6p', 1290, 1020), g6p: node('g6p', 1670, 1020), glc: node('glucose', 2050, 1020),
e4p: node('e4p', 910, 1020), sbp: node('sbp', 530, 1020), s7p: node('s7p', 530, 1310), r5p: node('r5p', 150, 1310),
xu5p: node('xu5p', 530, 730), ru5p: node('ru5p', 150, 440)
};
var cReactions = [
{
id: 'cal1', step: 1, enzyme: 'rubisco', substrates: ['rubp'], products: ['pg3'], ins: ['co2', 'h2o'], outs: [],
arrows: [{ from: 'rubp', to: 'pg3' }],
type: 'Carboxylation (carbon fixation)', irreversible: true,
equation: '6 CO₂ + 6 H₂O + 6 RuBP → 12 3-Phosphoglycerate',
hint: 'Một phân tử đường 5 carbon có một nhóm phosphat ở mỗi đầu tiếp nhận một chất khí từ không khí, và sản phẩm 6 carbon kém bền lập tức tách thành hai phân tử acid 3 carbon giống hệt nhau. Đây là bước carbon vô cơ đi vào chu trình.',
hl: { sub: { rubp: ['ket'] }, prod: { pg3: ['coo'] } }
},
{
id: 'cal2', step: 2, enzyme: 'pgk', substrates: ['pg3'], products: ['bpg13'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'pg3', to: 'bpg13' }],
type: 'Phosphoryl transfer', irreversible: false,
equation: '12 3-Phosphoglycerate + 12 ATP → 12 1,3-Bisphosphoglycerate + 12 ADP',
hint: 'Một nhóm phosphat được chuyển từ đồng tiền năng lượng lên nhóm carboxyl của acid, tạo ra một hợp chất có thế năng chuyển nhóm phosphat rất cao. Đây là phản ứng đường phân chạy theo chiều ngược lại.',
hl: { sub: { pg3: ['coo'] }, prod: { bpg13: ['acylp'] } }
},
{
id: 'cal3', step: 3, enzyme: 'nadpgapdh', substrates: ['bpg13'], products: ['g3p'], ins: ['nadph'], outs: ['nadp', 'pi'],
arrows: [{ from: 'bpg13', to: 'g3p' }],
type: 'Reduction (NADPH)', irreversible: false,
equation: '12 1,3-Bisphosphoglycerate + 12 NADPH → 12 Glyceraldehyde 3-phosphate + 12 NADP⁺ + 12 Pᵢ',
hint: 'Nhóm carboxyl đã hoạt hóa bị khử thành aldehyde nhờ các electron của chất mang dạng khử trong lục lạp, đồng thời nhóm trên carbon đó được giải phóng dưới dạng ion vô cơ. Đây là giai đoạn khử, dùng một chất mang khác với trong đường phân.',
hl: { sub: { bpg13: ['acylp'] }, prod: { g3p: ['ald'] } }
},
{
id: 'cal4', step: 4, enzyme: 'tpi', substrates: ['g3p'], products: ['dhap'], ins: [], outs: [],
arrows: [{ from: 'g3p', to: 'dhap' }], cof: WEST_EAST, twoWay: true,
type: 'Sự đồng phân hóa', irreversible: false,
equation: '5-Glyceraldehyde 3-phosphate ⇌ 5-Dihydroxyacetone phosphate',
hint: 'Dạng aldehyde của đường phosphate 3 carbon được chuyển thành dạng ketone bằng cách dịch chuyển nhóm carbonyl, giúp cả hai dạng có mặt với lượng phù hợp cho bước kế tiếp. Không cần chất mang.',
hl: { sub: { g3p: ['ald'] }, prod: { dhap: ['ket'] } }
},
{
id: 'cal5', step: 5, enzyme: 'aldolase', substrates: ['dhap', 'g3p'], products: ['f16bp'], ins: [], outs: [],
arrows: [{ from: 'dhap', to: 'f16bp' }, { from: 'g3p', to: 'f16bp', via: [{ x: 1530, y: 150 }, { x: 1530, y: 730 }] }], cof: WEST_EAST, twoWay: true,
type: 'Aldol condensation', irreversible: false,
equation: '3 Glyceraldehyde 3-phosphate + 3 Dihydroxyacetone phosphate ⇌ 3 Fructose 1,6-bisphosphate',
hint: 'Một ketone và một aldehyde, mỗi chất là một đường 3 carbon mang một phosphat, được nối với nhau bằng một liên kết carbon-carbon mới thành đường 6 carbon có một phosphat ở mỗi đầu. Không có chất nào khác bị tiêu thụ.'
},
{
id: 'cal6', step: 6, enzyme: 'fbpase', substrates: ['f16bp'], products: ['f6p'], ins: ['h2o'], outs: ['pi'],
arrows: [{ from: 'f16bp', to: 'f6p' }], cof: WEST_EAST,
type: 'Thủy phân', irreversible: true,
equation: '3 Fructose 1,6-bisphosphate + 3 H₂O → 3 Fructose 6-phosphate + 3 Pᵢ',
hint: 'Nhóm ở carbon 1 bị loại bỏ bằng thủy phân dưới dạng ion vô cơ, khiến phản ứng chỉ xảy ra một chiều và để lại một phân tử đường 6 carbon có thể dùng theo hai hướng khác nhau.',
hl: { sub: { f16bp: ['p1'] } }
},
{
id: 'cal7', step: 7, enzyme: 'pgi', substrates: ['f6p'], products: ['g6p'], ins: [], outs: [],
arrows: [{ from: 'f6p', to: 'g6p' }], twoWay: true,
type: 'Sự đồng phân hóa', irreversible: false,
equation: 'Fructose 6-phosphate ⇌ Glucose 6-phosphate',
hint: 'Vòng ketose mở ra, nhóm carbonyl chuyển từ carbon 2 sang carbon 1, và phân tử đường đóng lại thành vòng 6 cạnh. Không có chất mang tham gia và bước này hoàn toàn thuận nghịch.'
},
{
id: 'cal8', step: 8, enzyme: 'g6pase', substrates: ['g6p'], products: ['glc'], ins: ['h2o'], outs: ['pi'],
arrows: [{ from: 'g6p', to: 'glc' }],
type: 'Thủy phân', irreversible: true,
equation: 'Glucose 6-phosphate + H₂O → Glucose + Pᵢ',
hint: 'Nhóm còn lại ở carbon 6 bị loại bỏ bằng thủy phân dưới dạng ion vô cơ, giải phóng phân tử đường 6 carbon tự do — sản phẩm của phương trình tổng, dù phân tử đường này hiếm khi là sản phẩm cuối cùng ở thực vật.',
hl: { sub: { g6p: ['p6'] } }
},
{
id: 'cal9', step: 9, enzyme: 'tkt', substrates: ['f6p', 'g3p'], products: ['xu5p', 'e4p'], ins: [], outs: [],
arrows: [{ from: 'f6p', to: 'e4p' }, { from: 'g3p', to: 'xu5p' }],
type: 'Two-carbon transfer', irreversible: false,
equation: '2 Fructose 6-phosphate + 2 Glyceraldehyde 3-phosphate → 2 Xylulose 5-phosphate + 2 Erythrose 4-phosphate',
hint: 'Một enzyme nhấc một đơn vị 2 carbon khỏi đầu trên của một ketose phosphate 6 carbon và gắn lên nhóm aldehyde của một đường 3 carbon. Kết quả để lại một aldose 4 carbon và tạo ra một ketose 5 carbon.'
},
{
id: 'cal10', step: 10, enzyme: 'aldolase', substrates: ['e4p', 'dhap'], products: ['sbp'], ins: [], outs: [],
arrows: [{ from: 'e4p', to: 'sbp' }, { from: 'dhap', to: 'sbp' }], twoWay: true,
type: 'Aldol condensation', irreversible: false,
equation: '2 Erythrose 4-phosphate + 2 Dihydroxyacetone phosphate ⇌ 2 Sedoheptulose 1,7-bisphosphate',
hint: 'Một aldose phosphate 4 carbon và một ketose phosphate 3 carbon được nối với nhau bằng một liên kết carbon-carbon mới, tạo thành phân tử đường 7 carbon có một phosphat ở mỗi đầu.'
},
{
id: 'cal11', step: 11, enzyme: 'sbpase', substrates: ['sbp'], products: ['s7p'], ins: ['h2o'], outs: ['pi'],
arrows: [{ from: 'sbp', to: 's7p' }], cof: WEST_EAST,
type: 'Thủy phân', irreversible: true,
equation: '2 Sedoheptulose 1,7-bisphosphate + 2 H₂O → 2 Sedoheptulose 7-phosphate + 2 Pᵢ',
hint: 'Nhóm ở carbon 1 của phân tử đường 7 carbon bị loại bỏ bằng thủy phân dưới dạng ion vô cơ, và bước này có tính không thuận nghịch.',
hl: { sub: { sbp: ['p1'] } }
},
{
id: 'cal12', step: 12, enzyme: 'tkt', substrates: ['s7p', 'g3p'], products: ['xu5p', 'r5p'], ins: [], outs: [],
arrows: [{ from: 's7p', to: 'r5p' }, { from: 'g3p', to: 'xu5p' }],
type: 'Two-carbon transfer', irreversible: false,
equation: '2 Sedoheptulose 7-phosphate + 2 Glyceraldehyde 3-phosphate → 2 Xylulose 5-phosphate + 2 Ribose 5-phosphate',
hint: 'Ketose phosphate 7 carbon nhường hai carbon đầu trên của nó cho một aldehyde 3 carbon, để lại một aldose 5 carbon và tạo thành một ketose 5 carbon khác.'
},
{
id: 'cal13', step: 13, enzyme: 'rpe', substrates: ['xu5p'], products: ['ru5p'], ins: [], outs: [],
arrows: [{ from: 'xu5p', to: 'ru5p' }], twoWay: true,
type: 'Sự đồng phân hóa', irreversible: false,
equation: '4 Xylulose 5-phosphate ⇌ 4 Ribulose 5-phosphate',
hint: 'Nhóm hydroxyl ở carbon 3 được xoay đảo cấu hình, biến một ketose phosphate thành đồng phân có thể được phosphoryl hóa ở cuối chu trình.',
hl: { sub: { xu5p: ['oh3'] }, prod: { ru5p: ['oh3'] } }
},
{
id: 'cal14', step: 14, enzyme: 'rpi', substrates: ['r5p'], products: ['ru5p'], ins: [], outs: [],
arrows: [{ from: 'r5p', to: 'ru5p' }], cof: WEST_EAST, twoWay: true,
type: 'Sự đồng phân hóa', irreversible: false,
equation: '2 Ribose 5-phosphate ⇌ 2 Ribulose 5-phosphate',
hint: 'Aldose phosphate được chuyển thành đồng phân ketose của nó, cùng kiểu sắp xếp lại như ở nửa đầu đường phân, và không cần chất mang.'
},
{
id: 'cal15', step: 15, enzyme: 'prk', substrates: ['ru5p'], products: ['rubp'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'ru5p', to: 'rubp' }], cof: WEST_EAST,
type: 'Phosphoryl transfer', irreversible: true,
equation: '6 Ribulose 5-phosphate + 6 ATP → 6 Ribulose 1,5-bisphosphate + 6 ADP',
hint: 'Đồng tiền năng lượng được tiêu tốn để gắn một nhóm phosphat lên carbon 1 của ketose phosphate 5 carbon, tái tạo chất nhận đã khởi đầu chu trình. Bước cuối này không thuận nghịch.',
hl: { sub: { ru5p: ['oh1'] }, prod: { rubp: ['p1'] } }
}
];
var calvin = {
title: 'Chu trình Calvin', subtitle: 'Mười lăm bước từ CO₂ đến glucose (Bảng 22.1)', tag: 'CAL',
location: 'chất nền lục lạp', color: '#9CCB6B', big: true,
nodes: cNodes, reactions: cReactions, order: cReactions.map(function (r) { return r.id; }), start: ['rubp'],
regions: [
{ type: 'rect', label: 'Cố định và giảm', color: '#DCEBF7', x: 20, y: 20, w: 1420, h: 270 },
{ type: 'rect', label: 'Sự tái tạo của RuBP', color: '#F7EAD5', x: 20, y: 340, w: 1000, h: 1130 },
{ type: 'rect', label: 'Nhánh glucose', color: '#F5CCCD', x: 1540, y: 900, w: 600, h: 240 }
],
notes: [
note('Bốn nghệ danh:', 1400, 1210, 'start', 18),
note('Chuẩn bị: G3P và DHAP', 1400, 1245, 'start', 18),
note('Sắp xếp lại: transketolase, aldolase (Bảng 22.1)', 1400, 1275, 'start', 18),
note('Sự đồng phân hóa: R5P và Xu5P thành Ru5P', 1400, 1305, 'start', 18),
note('Phosphoryl hóa: Ru5P thành RuBP', 1400, 1335, 'start', 18)
],
summary: [
'Sáu phân tử CO₂ được cố định trên mỗi phân tử glucose: 6 CO₂ + 18 ATP + 12 NADPH + 12 H⁺ + 12 H₂O tạo ra glucose + 18 ADP + 18 Pᵢ + 12 NADP⁺. Như vậy, mỗi phân tử CO₂ tạo ra 3 ATP và 2 NADPH, và mỗi phân tử glucose tạo ra 18 ATP và 12 NADPH. Bảng chỉ in 12 H⁺ ở dòng cuối cùng, chứ không in ở bất kỳ bước nào trong mười lăm bước phản ứng.',
'Mười hai G3P được tạo thành từ sáu cặp 3-phosphoglycerate; hai G3P (6 carbon) trở thành glucose và mười G3P (30 carbon) tái tạo sáu RuBP (30 carbon).',
'Các bước từ 1 đến 3 cố định và khử carbon; trong số các bước còn lại, các bước từ 4 đến 8 dẫn đến glucose và các bước từ 9 đến 15 tái tạo RuBP, kết thúc bằng nhóm phosphate thứ hai trên Ru5P ở bước 15. Các bước được chia thành bốn nhóm: chuẩn bị (G3P và DHAP), sắp xếp lại, đồng phân hóa (R5P và Xu5P thành Ru5P) và phosphoryl hóa (Ru5P thành RuBP).',
'Sản phẩm cuối cùng của quá trình phân hủy thực vật hiếm khi là glucose: tinh bột, sucrose và cellulose được tạo ra sau đó.'
],
region: ['carbon', 'gly', 'both', 'all'], noDistractor: ['mg', 'hplus', 'gtp', 'gdp'],
stepNames: numbered('Chu trình Calvin', 'CAL'),
entityNotes: {
pg3: 'Sản phẩm ổn định đầu tiên của quá trình cố định carbon: RuBisCO tạo ra hai phân tử này từ mỗi RuBP và CO₂. Trong chu trình Calvin, ATP sau đó thêm một nhóm phosphate vào nó (bước 2), và NADPH khử sản phẩm (bước 3).',
bpg13: 'G3P được tạo thành từ 3-phosphoglycerate bởi phosphoglycerate kinase và ATP, sau đó được khử bởi NADPH thành G3P. Trong quá trình đường phân, cùng một loại kinase này hoạt động theo chiều ngược lại và sử dụng nó để tạo ra ATP.',
g3p: 'Triose phosphate là sản phẩm rời khỏi giai đoạn khử. Trong số mười hai phân tử G3P được tạo ra từ mỗi phân tử glucose, hai phân tử (6 nguyên tử carbon) trở thành glucose và mười phân tử (30 nguyên tử carbon) tái tạo lại sáu phân tử RuBP.',
dhap: 'Chất ketose liên kết với G3P, được chuyển hóa qua lại bởi triose phosphate isomerase. Nó tham gia cùng G3P trong phản ứng aldolase đầu tiên (bước 5) và E4P trong phản ứng thứ hai (bước 10).',
f16bp: 'Được tạo ra bởi aldolase từ G3P và DHAP. Sau đó, fructose bisphosphatase loại bỏ nhóm phosphate trên carbon 1 (bước 6), một bước chỉ diễn ra theo một chiều.',
f6p: 'Được sử dụng hai lần trong chu trình: nó được đồng phân hóa thành glucose (bước 7), và transketolase lấy hai nguyên tử carbon từ nó để tạo ra Xu5P và E4P (bước 9).',
g6p: 'Glucose 6-phosphate. Bước cuối cùng ở đây là loại bỏ nhóm phosphate của nó bằng glucose-6-phosphatase để tạo ra glucose (bước 8), mặc dù glucose hiếm khi là sản phẩm cuối cùng của thực vật, vì tinh bột, cellulose và sucrose sẽ được tạo ra sau đó.',
glucose: 'Sản phẩm của phương trình phản ứng tổng quát: 6 CO₂ với 12 NADPH và 18 ATP tạo ra một phân tử glucose. Đây hiếm khi là sản phẩm cuối cùng của thực vật, vì tinh bột, cellulose và sucrose sẽ được tạo ra sau đó.',
r5p: 'Ribose 5-phosphate, được vẽ dưới dạng vòng. Transketolase tạo ra nó từ S7P và G3P (bước 12), và phosphopentose isomerase chuyển nó thành Ru5P (bước 14).',
pgk: 'Một loại kinase sử dụng ATP để gắn nhóm phosphate thứ hai vào nhóm carboxyl của axit (bước 2). Trong quá trình đường phân, cùng một enzyme này hoạt động theo chiều ngược lại và tạo ra ATP.',
tpi: 'Nó chuyển đổi qua lại giữa hai triose phosphate, sao cho chu trình có đủ lượng của cả hai (bước 4). Một loại enzyme hoàn hảo về mặt xúc tác, chỉ bị giới hạn bởi sự khuếch tán.',
aldolase: 'Enzyme này kết hợp hai phân tử đường phosphate trong phản ứng aldol, một lần để tạo thành bisphosphate sáu carbon (bước 5) và một lần để tạo thành bisphosphate bảy carbon (bước 10). Cả hai lần đều có một chất tham gia là DHAP. Trong quá trình đường phân, cùng một enzyme này hoạt động theo chiều ngược lại và phân tách fructose 1,6-bisphosphate.',
pgi: 'Xúc tác quá trình đồng phân hóa một đường photphat sáu cacbon giữa dạng ketose và aldose; trong chu trình, nó diễn ra theo hướng tạo thành aldose (bước 7). Có thể đảo ngược hoàn toàn.',
fbpase: 'Enzyme phosphatase này loại bỏ nhóm phosphate trên carbon 1 của bisphosphate sáu carbon (bước 6). Nó chỉ hoạt động theo một chiều, giống như trong quá trình tân tạo glucose, nơi nó đối kháng với PFK-1.',
g6pase: 'Enzyme phosphatase loại bỏ nhóm phosphate cuối cùng để tạo ra glucose tự do (bước 8), phản ứng tương tự như trong quá trình tân tạo glucose. Glucose hiếm khi là sản phẩm cuối cùng của thực vật.'
}
};
var vNodes = {
rubp: node('rubp', 150, 150), pg3: node('pg3', 530, 150), g3p: node('g3p', 910, 150), rubp2: node('rubp', 1290, 150)
};
var vReactions = [
{
id: 'cv1', step: 1, enzyme: 'rubisco', substrates: ['rubp'], products: ['pg3'], ins: ['co2', 'h2o'], outs: [],
arrows: [{ from: 'rubp', to: 'pg3' }],
type: 'Stage 1: carbon fixation', irreversible: true,
equation: '3 CO₂ + 3 H₂O + 3 RuBP → 6 3-Phosphoglycerate',
hint: 'Mỗi phân tử trong ba đường 5 carbon có nhóm phosphat ở hai đầu tiếp nhận một chất khí từ không khí, và mỗi sản phẩm 6 carbon lập tức tách thành hai acid 3 carbon; như vậy ba carbon đi vào và sáu acid đi ra.',
hl: { sub: { rubp: ['ket'] }, prod: { pg3: ['coo'] } }
},
{
id: 'cv2', step: 2, enzyme: 'procreduce', substrates: ['pg3'], products: ['g3p'], ins: ['atp', 'nadph'], outs: ['adp', 'nadp', 'pi'],
arrows: [{ from: 'pg3', to: 'g3p' }],
type: 'Stage 2: reduction', irreversible: false,
equation: '6 3-Phosphoglycerate + 6 ATP + 6 NADPH → 6 G3P + 6 ADP + 6 NADP⁺ + 6 Pᵢ, và một trong sáu G3P tách ra (một nửa glucose)',
hint: 'Sáu phân tử acid trước tiên được phosphoryl hóa nhờ đồng tiền năng lượng rồi bị khử bởi các electron của chất mang dạng khử trong lục lạp; trong sáu phân tử đường phosphate 3 carbon tạo ra, một phân tử rời chu trình để tổng hợp đường và năm phân tử còn lại ở lại.'
},
{
id: 'cv3', step: 3, enzyme: 'procregen', substrates: ['g3p'], products: ['rubp2'], ins: ['atp'], outs: ['adp', 'pi'],
arrows: [{ from: 'g3p', to: 'rubp2' }],
type: 'Stage 3: regeneration', irreversible: false,
equation: '5 G3P + 3 ATP → 3 RuBP + 3 ADP + 2 Pᵢ',
hint: 'Năm phân tử đường phosphate ở lại được sắp xếp lại qua một chuỗi dài các phản ứng hoán đổi, tiêu tốn thêm một ít đồng tiền năng lượng, cho đến khi tái tạo đủ ba phân tử chất nhận 5 carbon để chu trình bắt đầu lại.'
}
];
var calvinsimple = {
title: 'Chu trình Calvin gồm ba giai đoạn', subtitle: 'Mỗi 3 CO₂', tag: 'CVS',
location: 'chất nền lục lạp', color: '#B7DC8E', terms: { enz: 'enzyme' },
nodes: vNodes, reactions: vReactions, order: vReactions.map(function (r) { return r.id; }), start: ['rubp'],
regions: [{ type: 'rect', label: 'chất nền lục lạp', color: '#E4F1D2', x: 20, y: 20, w: 1420, h: 360 }],
notes: [note('Stage 1: carbon fixation', 340, 62, 'middle'), note('Stage 2: reduction', 720, 62, 'middle'), note('Stage 3: regeneration', 1100, 62, 'middle'),
note('Một trong sáu phân tử G3P rời khỏi chu trình dưới dạng một nửa glucose.', 910, 305, 'middle', 18)],
summary: [
'Chu trình của 3 CO₂ có ba giai đoạn: cố định carbon (RuBisCO: 3 CO₂ và 3 RuBP tạo ra 6 3-phosphoglycerate), khử (6 ATP và 6 NADPH tạo ra 6 G3P) và tái tạo (5 G3P và 3 ATP tạo ra 3 RuBP).',
'Một trong sáu G3P rời khỏi chu trình dưới dạng một nửa glucose; nhân đôi tất cả các lượng sẽ thu được 18 ATP, 12 NADPH và một glucose cho mỗi 6 CO₂ (Bảng 22.1)',
'Các giai đoạn là tên gọi được sử dụng cho hình này; mười lăm bước của chu trình hoàn chỉnh được chia thành bốn nhóm khác (chuẩn bị, sắp xếp lại, đồng phân hóa, phosphoryl hóa), và ô của giai đoạn 2 cũng bao gồm bước ATP.',
'Trong trò chơi này, đáp án của một màn chơi chính là tên của màn chơi đó, giống như trong "Từ Ánh Sáng đến Đường".'
],
region: ['carbon', 'photo', 'gly', 'both', 'all'], noDistractor: ['mg', 'hplus', 'gtp', 'gdp', 'glutc', 'akgc', 'coa'],
stepNames: numbered('Chu trình Calvin, ba giai đoạn', 'CVS'),
entityNotes: {
g3p: 'Triose phosphate rời khỏi giai đoạn khử: trong số sáu G3P được tạo ra trên mỗi 3 CO₂, một phân tử rời đi dưới dạng một nửa glucose và năm phân tử còn lại ở lại để tái tạo ba RuBP.'
}
};
var fNodes = {
pep: node('pep', 150, 150), oaa: node('oaa', 150, 730), malm: node('malate', 530, 730), pyrm: node('pyruvate', 530, 150),
malb: node('malate', 1110, 730), pyrb: node('pyruvate', 1110, 150), rubp: node('rubp', 1490, 150), pg3: node('pg3', 1490, 730)
};
var fReactions = [
{
id: 'c4a', step: 1, tile: 'PEPC', enzyme: 'pepc', substrates: ['pep'], products: ['oaa'], ins: ['co2'], outs: ['pi'],
arrows: [{ from: 'pep', to: 'oaa' }], cof: WEST_EAST,
avoid: ['hco3'],
type: 'cacboxyl hóa', irreversible: true,
equation: 'PEP + CO₂ → Oxaloacetate + Pᵢ',
hint: 'Ở tế bào bên ngoài (tế bào thịt lá), một chất khí từ không khí được cộng vào một enol 3 carbon tạo thành acid 4 carbon, đồng thời giải phóng một ion vô cơ. Sản phẩm bền đầu tiên có 4 carbon, cũng là nguồn gốc tên gọi của con đường.'
},
{
id: 'c4b', step: 2, tile: 'NADP-MDH', enzyme: 'nadpmdh', substrates: ['oaa'], products: ['malm'], ins: ['nadph'], outs: ['nadp'],
arrows: [{ from: 'oaa', to: 'malm' }],
type: 'Reduction (NADPH)', irreversible: false,
equation: 'Oxaloacetate + NADPH + H⁺ → L-Malate + NADP⁺',
hint: 'Nhóm ketone của acid 4 carbon bị khử thành rượu nhờ chất mang dạng khử của lục lạp, tạo thành dạng có thể di chuyển sang tế bào kế tiếp.'
},
{
id: 'c4c', step: 3, tile: 'NADP-ME', enzyme: 'nadpme', substrates: ['malb'], products: ['pyrb'], ins: ['nadp'], outs: ['nadph', 'co2'],
arrows: [{ from: 'malb', to: 'pyrb' }, { from: 'malm', to: 'malb' }], cof: WEST_EAST,
type: 'Oxidative decarboxylation', irreversible: true,
equation: 'L-Malate + NADP⁺ → Pyruvate + CO₂ + NADPH + H⁺',
hint: 'Ở tế bào bên trong (tế bào bao bó mạch), acid 4 carbon bị oxi hóa và mất một carbon dưới dạng khí, để lại một acid keto 3 carbon và khử chất mang dạng oxi hóa. Chất khí được giải phóng ngay sát enzyme cố định carbon.'
},
{
id: 'c4d', step: 4, tile: 'RuBisCO', enzyme: 'rubisco', substrates: ['rubp'], products: ['pg3'], ins: ['co2', 'h2o'], outs: [],
arrows: [{ from: 'rubp', to: 'pg3' }], cof: WEST_EAST,
type: 'Carboxylation (the Calvin cycle starts)', irreversible: true,
equation: 'CO₂ + H₂O + RuBP → 2 3-Phosphoglycerate',
hint: 'Chất khí giải phóng ở tế bào bên trong được gắn vào một đường 5 carbon có hai nhóm phosphat, và sản phẩm 6 carbon tách thành hai acid 3 carbon, đưa carbon vào bước đầu tiên của chu trình Calvin.',
hl: { sub: { rubp: ['ket'] }, prod: { pg3: ['coo'] } }
},
{
id: 'c4e', step: 5, tile: 'PPDK', enzyme: 'ppdk', substrates: ['pyrm'], products: ['pep'], ins: ['atp', 'pi'], outs: ['amp', 'ppi'],
arrows: [{ from: 'pyrm', to: 'pep' }, { from: 'pyrb', to: 'pyrm' }],
type: 'Phosphorylation (regenerates PEP)', irreversible: false,
equation: 'Pyruvate + ATP + Pᵢ → PEP + AMP + PPᵢ + H⁺',
hint: 'Một enzyme ở tế bào bên ngoài tái tạo enol 3 carbon từ acid keto quay trở lại từ tế bào bên trong. Enzyme này tiêu thụ đồng tiền năng lượng theo cách đặc biệt: nucleotide mất hai nhóm phosphat và chỉ giữ lại một, đồng thời tiêu thụ thêm một ion vô cơ.'
}
];
var c4 = {
title: 'Con đường C4', subtitle: 'CO₂ được vận chuyển từ mô lá đến tế bào bao bó mạch.', tag: 'C4P',
location: 'Tế bào mô mềm và tế bào bao bó mạch của lá C4', color: '#B6D86A',
nodes: fNodes, reactions: fReactions, order: fReactions.map(function (r) { return r.id; }), start: ['pep', 'rubp'],
regions: [
{ type: 'rect', label: 'Tế bào mô lá', color: '#E9F1CC', x: 20, y: 20, w: 700, h: 880 },
{ type: 'rect', label: 'Tế bào bao bó', color: '#D4ECDD', x: 960, y: 20, w: 700, h: 880 }
],
membranes: [{ x1: 840, y1: 20, x2: 840, y2: 900 }],
notes: [
note('Pyruvate trả lại', 640, 108),
note('Malate mang CO₂', 640, 690),
note('Phần còn lại của chu trình Calvin chuyển hóa 3-PG thành đường.', 1230, 850, 'start', 18)
],
summary: [
'Trong tế bào mô lá, enzyme PEP carboxylase cố định CO₂ thành oxaloacetate, NADPH khử nó thành malate, và malate đi vào tế bào bao bó mạch; tại đó, enzyme malic giải phóng CO₂ ngay bên cạnh RuBisCO.',
'Lượng pyruvate còn lại sẽ quay trở lại tế bào mô lá, nơi enzyme pyruvate phosphate dikinase tái tạo PEP từ pyruvate, ATP và Pᵢ.',
'Chu trình C4 tiêu tốn ATP để tái tạo PEP, chất nhận CO₂, chứ không phải để vận chuyển CO₂; chi phí cho mỗi CO₂ tiêu tốn nhiều hơn khoảng hai đơn vị ATP so với chu trình Calvin đơn thuần.',
'Các loài thực vật C4 phát triển tốt hơn trong điều kiện hạn hán, nắng nóng và nồng độ CO₂ thấp, bởi vì CO₂ tập trung ở nơi RuBisCO hoạt động.'
],
region: ['carbon', 'gly', 'both', 'tca', 'all'], noDistractor: ['mg', 'hplus', 'gtp', 'gdp', 'glutc', 'akgc', 'coa'],
stepNames: numbered('Con đường C4', 'C4'),
entityNotes: {
pep: 'Chất nhận CO₂ ba nguyên tử carbon trong tế bào mô lá của cây C4: PEP carboxylase thêm CO₂ vào đó để tạo thành oxaloacetate. Pyruvate phosphate dikinase tái tạo nó từ pyruvate.',
oaa: 'Sản phẩm bốn nguyên tử carbon của quá trình cố định CO₂ đầu tiên, trong tế bào mô lá (số 4 của C4). NADPH khử nó thành malate, chất này có thể di chuyển.',
malate: 'Axit bốn cacbon mang cacbon từ tế bào mô lá đến tế bào bao bó mạch, nơi enzyme malic giải phóng CO₂ bên cạnh RuBisCO.',
pyruvate: 'Sản phẩm ba nguyên tử carbon còn lại khi malate mất CO₂. Nó quay trở lại tế bào mô lá, nơi PEP được tái tạo từ đó với chi phí là ATP; đây là nơi C4 sử dụng ATP, chứ không phải để vận chuyển CO₂.',
pg3: 'Sản phẩm đầu tiên của RuBisCO trong tế bào bao bó mạch là hai sản phẩm cho mỗi RuBP và CO₂. Từ đây, cây C4 thực hiện chu trình Calvin thông thường.'
}
};
P.pathways.calvin = calvin;
P.pathways.calvinsimple = calvinsimple;
P.pathways.c4 = c4;
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs || !MG.everything || !MG.everything._tools) { return; }
var P = MG.packs.pack('advanced');
var numbered = MG.everything._tools.numbered;
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var WEST_EAST = { 'in': 'west', out: 'east' };
var NO_CHIP = ['mg', 'hplus', 'nad', 'nadh', 'nadp', 'nadph', 'fad', 'fadh2', 'coa', 'q', 'cytcox', 'co2', 'o2', 'hco3', 'utp', 'udp', 'ump', 'glutc', 'akgc', 'photon'];
var ATP_NOTE = { etcatp: 'Đơn vị năng lượng ở đây là chất nền của adenylate cyclase, chuyển hóa nó thành AMP vòng và pyrophosphate, và là chất cho phosphate của mọi kinase trong chu trình này.' };
var gNodes = {
hormone: node('hormone', 530, 150),
rest: node('gprest', 150, 440), bound: node('gpbound', 530, 440), chg: node('gpchg', 910, 440),
gtpst: node('gpgtp', 910, 880), free: node('gpfree', 530, 880), gdpst: node('gpgdp', 150, 880)
};
var gReactions = [
{
id: 'gc1', step: 1, enzyme: 'gpcrp', substrates: ['rest', 'hormone'], products: ['bound'], ins: [], outs: [], avoid: ['badr', 'a2r'],
arrows: [{ from: 'rest', to: 'bound' }, { from: 'hormone', to: 'bound' }],
type: 'Binding of the hormone', irreversible: false,
equation: 'Thụ thể ở trạng thái nghỉ + Hormone → Thụ thể liên kết với hormone',
hint: 'Một chất truyền tin từ bên ngoài tế bào khớp vào vị trí gắn của một protein 7 vòng xoắn xuyên màng, vốn có protein đối tác chờ sẵn ở mặt trong. Không có liên kết nào được tạo ra hay bẻ gãy.'
},
{
id: 'gc2', step: 2, enzyme: 'gpcrp', substrates: ['bound'], products: ['chg'], ins: [], outs: [], avoid: ['badr', 'a2r'],
arrows: [{ from: 'bound', to: 'chg' }],
type: 'Structural change of the receptor', irreversible: false,
equation: 'Thụ thể liên kết với hormone → Thụ thể có hình dạng thay đổi',
hint: 'Tín hiệu đã gắn tác động lên protein màng, và biến đổi lan dọc theo các vòng xoắn xuống phía hướng vào tế bào chất, nơi protein đối tác đang được giữ. Không có gì được tạo ra hay bẻ gãy.'
},
{
id: 'gc3', step: 3, enzyme: 'gprot', substrates: ['chg'], products: ['gtpst'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['galpha', 'bagtp', 'plgact', 'gsalpha', 'gialpha', 'gigtp'],
arrows: [{ from: 'chg', to: 'gtpst' }], cof: WEST_EAST,
type: 'Replacement of GDP by GTP', irreversible: false,
equation: 'Protein G·GDP + GTP → Protein G·GTP + GDP',
hint: 'Thụ thể, lúc này tác động lên protein đối tác kế bên, khiến protein đó thả nucleotide nó đang mang ra, và một nucleotide triphosphate thay thế vị trí của diphosphate.'
},
{
id: 'gc4', step: 4, enzyme: 'galpha', substrates: ['gtpst'], products: ['free'], ins: [], outs: [], avoid: ['gprot', 'bagtp', 'plgact', 'gigtp'],
arrows: [{ from: 'gtpst', to: 'free' }],
type: 'Dissociation and activation of an enzyme', irreversible: false,
equation: 'G alpha-GTP·G beta-gamma → G alpha-GTP + G beta-gamma, và G alpha-GTP sau đó kích hoạt một enzyme.',
hint: 'Tiểu đơn vị lúc này mang triphosphate tách khỏi hai đối tác của nó và trượt dọc mặt trong của màng để bật một enzyme tại đó.'
},
{
id: 'gc5', step: 5, enzyme: 'galpha', substrates: ['free'], products: ['gdpst'], ins: ['h2o'], outs: ['pi'], avoid: ['gprot', 'bagdp'],
arrows: [{ from: 'free', to: 'gdpst' }],
type: 'GTPase action', irreversible: true,
equation: 'G alpha-GTP + H₂O → G alpha-GDP + Pᵢ',
hint: 'Tiểu đơn vị từ từ cắt bỏ nhóm cuối cùng khỏi chính nucleotide của nó, nên sau một lúc dạng hoạt động tự tắt đi.'
},
{
id: 'gc6', step: 6, enzyme: 'gbg', substrates: ['gdpst'], products: ['rest'], ins: [], outs: [], avoid: ['gprot', 'galpha', 'gsalpha', 'gialpha'],
arrows: [{ from: 'gdpst', to: 'rest' }],
type: 'Return to the original state', irreversible: false,
equation: 'G alpha-GDP + G beta-gamma → G protein·GDP tại thụ thể (trạng thái nghỉ); hormone đã rời khỏi thụ thể.',
hint: 'Tiểu đơn vị bất hoạt thả enzyme đích ra và quay lại với hai đối tác vẫn chờ ở thụ thể, giúp toàn hệ thống sẵn sàng cho tín hiệu tiếp theo.'
}
];
var gpcr = {
title: 'Chu kỳ hoạt động của GPCR', subtitle: 'Từ hormone đến trạng thái nghỉ ngơi', tag: 'GPC',
location: 'màng sinh chất và tế bào chất', color: '#C9A7E8', terms: { enz: 'protein' },
nodes: gNodes, reactions: gReactions, order: gReactions.map(function (r) { return r.id; }), start: ['rest', 'hormone'],
regions: [{ type: 'rect', label: 'màng sinh chất và tế bào chất', color: '#F3E6FB', x: 20, y: 20, w: 1040, h: 1040 }],
notes: [],
summary: [
'Sáu hình ảnh minh họa: trạng thái nghỉ ngơi, sự gắn kết của hormone, sự thay đổi cấu trúc của thụ thể, sự thay thế GDP bằng GTP, sự hoạt hóa enzyme và hoạt động của GTPase, với mũi tên chỉ về trạng thái ban đầu.',
'Tiểu đơn vị alpha của protein G đóng vai trò như công tắc: GDP gắn vào nghĩa là tắt, GTP gắn vào nghĩa là bật, và hoạt động GTPase chậm của chính nó sẽ kết thúc tín hiệu.',
'Các tiểu đơn vị beta và gamma vẫn liên kết với nhau; tiểu đơn vị alpha-GTP tự do kích hoạt một loại enzyme, chẳng hạn như adenylate cyclase.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Chu kỳ GPCR', 'GPC')
};
var cNodes = {
atp: node('etcatp', 150, 150), camp: node('camp', 530, 150), amp: node('ampmol', 910, 150),
pkaoff: node('pkaoff', 530, 440), pkaon: node('pkaon', 910, 440),
prot: node('serprot', 150, 730), pprot: node('phosprot', 530, 730), prot2: node('serprot', 910, 730)
};
var cReactions = [
{
id: 'cm1', step: 1, enzyme: 'adcyc', substrates: ['atp'], products: ['camp'], ins: [], outs: ['ppi'],
arrows: [{ from: 'atp', to: 'camp' }],
type: 'Chu trình', irreversible: true,
equation: 'ATP → cAMP + PPᵢ',
hint: 'Một enzyme màng được protein G bật lên nối nhóm phosphat đầu tiên của đồng tiền năng lượng vào nhóm 3′-hydroxyl trên chính phân tử đường của nó, đóng thành một vòng và giải phóng hai phosphat còn lại thành một cặp.'
},
{
id: 'cm2', step: 2, enzyme: 'pka', substrates: ['pkaoff', 'camp'], products: ['pkaon'], ins: [], outs: [],
arrows: [{ from: 'pkaoff', to: 'pkaon' }, { from: 'camp', to: 'pkaon' }], shift: [0, -40],
type: 'Binding of cAMP to the regulatory subunits', irreversible: false,
equation: 'R₂C₂ + 4 cAMP → R₂(cAMP)₄ + 2 C',
hint: 'Bốn phân tử chất truyền tin dạng vòng gắn vào hai phần điều hòa của một tetramer bất hoạt, khiến hai phần xúc tác của nó được giải phóng. Các phần được giải phóng chính là enzyme hoạt động.'
},
{
id: 'cm3', step: 3, enzyme: 'pka', substrates: ['prot'], products: ['pprot'], ins: ['atp'], outs: ['adp'], avoid: ['ktarget', 'ktargetp'],
arrows: [{ from: 'prot', to: 'pprot' }, { from: 'pkaon', to: 'pprot' }],
type: 'Phosphorylation of a Ser/Thr protein', irreversible: false,
equation: 'Protein + ATP → Phosphoprotein + ADP',
hint: 'Một phần xúc tác tự do của kinase chuyển nhóm phosphat tận cùng của đồng tiền năng lượng lên nhóm hydroxyl của gốc serine hoặc threonine trên một protein khác, làm thay đổi hoạt tính của protein đó.'
},
{
id: 'cm4', step: 4, enzyme: 'ppase', substrates: ['pprot'], products: ['prot2'], ins: ['h2o'], outs: ['pi'], avoid: ['ktarget', 'ktargetp'],
arrows: [{ from: 'pprot', to: 'prot2' }],
type: 'Khử phosphoryl hóa', irreversible: true,
equation: 'Phosphoprotein + H₂O → Protein + Pᵢ',
hint: 'Phản ứng thủy phân loại bỏ nhóm vừa gắn khỏi protein đã biến đổi và giải phóng nó dưới dạng ion vô cơ, trả lại protein chưa biến đổi và chấm dứt tác dụng của kinase.'
},
{
id: 'cm5', step: 5, enzyme: 'pde', substrates: ['camp'], products: ['amp'], ins: ['h2o'], outs: [],
arrows: [{ from: 'camp', to: 'amp' }],
type: 'Hydrolysis of the ring', irreversible: true,
equation: 'cAMP + H₂O → AMP + H⁺',
hint: 'Phản ứng thủy phân mở vòng của chất truyền tin tại liên kết 3′ của nó, để lại một nucleotide mạch thẳng không còn hoạt tính truyền tin, qua đó chấm dứt tín hiệu.'
},
{
id: 'cm6', step: 6, enzyme: 'pka', substrates: ['pkaon'], products: ['pkaoff'], ins: [], outs: [],
arrows: [{ from: 'pkaon', to: 'pkaoff' }], shift: [0, 40],
type: 'Reassembly of inactive PKA', irreversible: false,
equation: 'R₂(cAMP)₄ + 2 C → R₂C₂ + 4 cAMP, khi nồng độ cAMP giảm xuống.',
hint: 'Khi chất truyền tin đã bị loại bỏ và nồng độ của nó giảm xuống, các phần điều hòa gắn lại với các phần xúc tác, đưa enzyme trở về trạng thái bất hoạt.'
}
];
var camp = {
title: 'Chu trình cAMP', subtitle: 'Tạo cAMP, bật PKA rồi tắt đi.', tag: 'CAM',
location: 'màng sinh chất và tế bào chất', color: '#D6A7E2', terms: { enz: 'protein' },
nodes: cNodes, reactions: cReactions, order: cReactions.map(function (r) { return r.id; }), start: ['atp', 'pkaoff', 'prot'],
regions: [{ type: 'rect', label: 'màng sinh chất và tế bào chất', color: '#F6E9FA', x: 20, y: 20, w: 1160, h: 880 }],
notes: [],
summary: [
'Adenylate cyclase tạo ra chất truyền tin thứ cấp cAMP từ ATP; bốn phân tử cAMP liên kết với hai tiểu đơn vị điều hòa của PKA (R₂C₂) và giải phóng hai tiểu đơn vị xúc tác.',
'Một tiểu đơn vị xúc tác chuyển nhóm phosphate của ATP lên một serine hoặc threonine của protein, và một phosphoprotein phosphatase sẽ loại bỏ nó đi.',
'Phosphodiesterase tạo ra AMP từ cAMP, và khi nồng độ cAMP giảm, các tiểu đơn vị điều hòa sẽ liên kết lại với các tiểu đơn vị xúc tác: PKA trở nên không hoạt động.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('chu kỳ cAMP', 'CAM'),
entityNotes: ATP_NOTE
};
var bNodes = {
epi: node('epinephrine', 910, 150), baact: node('baact', 910, 440), bagtp: node('bagtp', 910, 730),
baatp: node('etcatp', 530, 1020), bacamp: node('camp', 910, 1020),
bapkai: node('pkaoff', 530, 1310), bapkaa: node('pkaon', 910, 1310),
bags: node('gsa', 530, 1600), bagsi: node('gsi', 910, 1600), baphki: node('phkoff', 1290, 1600), baphka: node('phkon', 1670, 1600),
bagpb: node('gpb', 1290, 1890), bagpa: node('gpa', 1670, 1890), baglyc: node('glycogen', 1290, 2180), bag1p: node('g1p', 1670, 2180)
};
var bReactions = [
{
id: 'ba1', step: 1, enzyme: 'badr', substrates: ['epi'], products: ['baact'], ins: [], outs: [], avoid: ['gpcrp', 'gpbound', 'gpchg', 'boact'],
arrows: [{ from: 'epi', to: 'baact' }], cof: WEST_EAST,
type: 'Hormone stimulation', irreversible: false,
equation: 'Epinephrine + Thụ thể → Thụ thể hoạt động với Gs liên kết',
hint: 'Hormone stress khớp vào thụ thể 7 vòng xoắn xuyên màng của nó trên màng sinh chất, khiến thụ thể thay đổi cấu hình ở mặt trong để có thể tác động lên protein G bên cạnh.'
},
{
id: 'ba2', step: 2, enzyme: 'galpha', substrates: ['baact'], products: ['bagtp'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['gprot', 'gpgtp', 'gpfree', 'plgact', 'gsalpha', 'gialpha', 'boact'],
arrows: [{ from: 'baact', to: 'bagtp' }], cof: WEST_EAST,
type: 'GDP replaced by GTP', irreversible: false,
equation: 'Gs alpha-GDP + GTP → Gs alpha-GTP + GDP',
hint: 'Một protein bên cạnh thụ thể đang bị kích thích trao đổi nucleotide nó nắm giữ: diphosphate rời đi và triphosphate gắn vào, bật một phần của protein đó lên và tách nó khỏi các đối tác.'
},
{
id: 'ba3', step: 3, enzyme: 'adcyc', substrates: ['baatp'], products: ['bacamp'], ins: [], outs: ['ppi'],
arrows: [{ from: 'baatp', to: 'bacamp' }, { from: 'bagtp', to: 'bacamp' }],
type: 'Synthesis of the second messenger', irreversible: true,
equation: 'ATP → cAMP + PPᵢ',
hint: 'Một enzyme trên màng được tiểu đơn vị protein G hoạt động bật lên biến đồng tiền năng lượng thành chất truyền tin thứ hai dạng vòng và giải phóng hai phosphat thành một cặp.'
},
{
id: 'ba4', step: 4, enzyme: 'pka', substrates: ['bapkai'], products: ['bapkaa'], ins: [], outs: [],
arrows: [{ from: 'bapkai', to: 'bapkaa' }, { from: 'bacamp', to: 'bapkaa' }],
type: 'Release of the catalytic subunits', irreversible: false,
equation: 'R₂C₂ + 4 cAMP → R₂(cAMP)₄ + 2 C',
hint: 'Bốn phân tử chất truyền tin thứ hai gắn vào các phần điều hòa của một kinase bất hoạt, và các phần xúc tác được giải phóng ở dạng enzyme hoạt động.'
},
{
id: 'ba5', step: 5, enzyme: 'pka', substrates: ['bags'], products: ['bagsi'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'bags', to: 'bagsi' }, { from: 'bapkaa', to: 'bagsi' }],
type: 'Sự phosphoryl hóa', irreversible: false,
equation: 'Glycogen synthase + ATP → Glycogen synthase-P + ADP',
hint: 'Kinase hoạt động gắn một nhóm phosphat lên enzyme tổng hợp glycogen và tắt nó đi, để tế bào không tổng hợp glycogen trong lúc đang phân giải nó.'
},
{
id: 'ba6', step: 6, enzyme: 'pka', substrates: ['baphki'], products: ['baphka'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'baphki', to: 'baphka' }, { from: 'bapkaa', to: 'baphka' }],
type: 'Sự phosphoryl hóa', irreversible: false,
equation: 'Phosphorylase kinase + ATP → Phosphorylase kinase-P + ADP',
hint: 'Chính kinase đó cũng phosphoryl hóa một kinase thứ hai và bật nó lên, giúp tín hiệu truyền xuống tầng thác và được khuếch đại qua mỗi bước.'
},
{
id: 'ba7', step: 7, enzyme: 'phk', substrates: ['bagpb'], products: ['bagpa'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'bagpb', to: 'bagpa' }, { from: 'baphka', to: 'bagpa' }],
type: 'Sự phosphoryl hóa', irreversible: false,
equation: 'Glycogen phosphorylase b + ATP → Glycogen phosphorylase a (đã được phosphoryl hóa) + ADP',
hint: 'Kinase thứ hai gắn một nhóm phosphat lên enzyme phân giải glycogen, chuyển nó từ dạng ít hoạt động sang dạng hoạt động mạnh.'
},
{
id: 'ba8', step: 8, enzyme: 'glycogenphosphorylase', substrates: ['baglyc'], products: ['bag1p'], ins: ['pi'], outs: [],
arrows: [{ from: 'baglyc', to: 'bag1p' }, { from: 'bagpa', to: 'bag1p' }],
type: 'Phosphorolysis of glycogen', irreversible: false,
equation: 'Glycogen(n) + Pᵢ → Glycogen(n-1) + Glucose 1-phosphate',
hint: 'Enzyme hoạt động dùng một ion vô cơ nhỏ thay vì nước để tách một đơn vị glucose khỏi đầu chuỗi polymer, nên đơn vị này rời đi với ion đó đã gắn sẵn.'
}
];
var badrenergic = {
title: 'Epinephrine chuyển hóa thành glycogen', subtitle: 'Thác beta-adrenergic', tag: 'BAR',
location: 'Màng sinh chất và chất nguyên sinh của tế bào cơ hoặc tế bào gan', color: '#E3A7C9', big: true, terms: { enz: 'protein' },
nodes: bNodes, reactions: bReactions, order: bReactions.map(function (r) { return r.id; }),
start: ['epi', 'baatp', 'bapkai', 'bags', 'baphki', 'bagpb', 'baglyc'],
regions: [
{ type: 'rect', label: 'Màng sinh chất', color: '#F3E6FB', x: 20, y: 20, w: 1160, h: 840 },
{ type: 'rect', label: 'Tế bào chất', color: '#FBE0D6', x: 20, y: 910, w: 1160, h: 560 },
{ type: 'rect', label: 'Tế bào chất, thác nước', color: '#DDF3D4', x: 20, y: 1520, w: 2000, h: 780 }
],
notes: [],
summary: [
'Chuỗi phản ứng được đánh số như sau: 1 kích thích hormone, 2 chuyển GDP thành GTP trên tiểu đơn vị alpha của G, 3 adenylate cyclase tạo ra cAMP, 4 cAMP giải phóng các tiểu đơn vị xúc tác của PKA, 5a PKA tắt glycogen synthase, 5 PKA bật phosphorylase kinase, 6 phosphorylase kinase bật glycogen phosphorylase, 7 glycogen phosphorylase giải phóng glucose 1-phosphate',
'Mỗi kinase kích hoạt nhiều phân tử của enzyme kế tiếp, do đó tín hiệu nhỏ của một phân tử hormone được khuếch đại.',
'Cùng một loại hormone đó ngăn chặn quá trình tổng hợp glycogen và bắt đầu quá trình phân giải glycogen, làm tăng lượng glucose trong máu.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'glycogen', 'all'], noDistractor: NO_CHIP, stepNames: numbered('chuỗi phản ứng epinephrine', 'BAR'),
entityNotes: ATP_NOTE
};
var lNodes = {
plhorm: node('hormone', 910, 150), plgact: node('plgact', 910, 440),
plcoff: node('plcoff', 530, 730), plcon: node('plcon', 910, 730),
pip2: node('pip2', 530, 1020), ip3: node('ip3', 910, 1020), dag: node('dag', 530, 1310),
caer: node('caer', 1290, 1310), cacyt: node('cacyt', 1670, 1310),
calmc: node('calmcard', 1290, 1600), camca: node('camca', 1670, 1600), ktarget: node('ktarget', 1290, 1890), ktargetp: node('ktargetp', 1670, 1890),
pkcoff: node('pkcoff', 530, 1600), pkcon: node('pkcon', 910, 1600), cachan: node('cachan', 530, 1890), cachanp: node('cachanp', 910, 1890)
};
var lReactions = [
{
id: 'pl1', step: 1, enzyme: 'gpcrp', substrates: ['plhorm'], products: ['plgact'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['badr', 'a2r', 'gpgtp', 'gpfree', 'bagtp'],
arrows: [{ from: 'plhorm', to: 'plgact' }], cof: WEST_EAST,
type: 'Hormone binding and activation of a G protein', irreversible: false,
equation: 'Hormone + Thụ thể + Protein G·GDP + GTP → Protein G hoạt động (GTP) + GDP',
hint: 'Một tín hiệu từ mô khác gắn vào thụ thể 7 vòng xoắn xuyên màng, làm thụ thể thay đổi cấu hình và khiến protein đối tác bên cạnh đổi diphosphate trên tiểu đơn vị alpha lấy triphosphate, nhờ đó đối tác trở nên hoạt động.'
},
{
id: 'pl2', step: 2, enzyme: 'gprot', substrates: ['plcoff'], products: ['plcon'], ins: [], outs: [], avoid: ['galpha'],
arrows: [{ from: 'plcoff', to: 'plcon' }, { from: 'plgact', to: 'plcon' }],
type: 'Activation of an enzyme by the G protein', irreversible: false,
equation: 'Phospholipase C + Protein G hoạt động → Phospholipase C hoạt động',
hint: 'Protein đối tác hoạt động của thụ thể gắn vào một enzyme áp sát mặt trong màng và bật nó lên.'
},
{
id: 'pl3', step: 3, enzyme: 'plcp', substrates: ['pip2'], products: ['ip3', 'dag'], ins: ['h2o'], outs: [],
arrows: [{ from: 'pip2', to: 'ip3' }, { from: 'pip2', to: 'dag' }, { from: 'plcon', to: 'ip3' }],
type: 'Hydrolysis of a phospholipid', irreversible: true,
equation: 'PIP2 + H₂O → IP3 + DAG + H⁺',
hint: 'Enzyme hoạt động cắt một phospholipid màng bằng thủy phân giữa nhóm phosphat và khung glycerol của nó, giải phóng phần đầu tan trong nước mang nhiều nhóm phosphat và để lại phần không phân cực trong màng.'
},
{
id: 'pl4', step: 4, enzyme: 'ip3r', substrates: ['caer'], products: ['cacyt'], ins: [], outs: [],
arrows: [{ from: 'caer', to: 'cacyt' }, { from: 'ip3', to: 'cacyt' }],
type: 'Release of Ca²⁺ from the endoplasmic reticulum', irreversible: false,
equation: 'Ca²⁺ (trong lòng lưới nội chất) → Ca²⁺ (trong tế bào chất), thông qua kênh mà IP3 mở ra.',
hint: 'Chất truyền tin vừa rời khỏi màng đi qua bào tương tới một màng bên trong tế bào và gắn vào một protein tại đó, mở đường cho chất dự trữ phía sau màng thoát ra bào tương.'
},
{
id: 'pl5', step: 5, enzyme: 'calm', substrates: ['calmc'], products: ['camca'], ins: [], outs: [],
arrows: [{ from: 'calmc', to: 'camca' }, { from: 'cacyt', to: 'camca' }],
type: 'Binding of Ca²⁺', irreversible: false,
equation: 'Calmodulin + Ca²⁺ → phức hợp Ca²⁺-calmodulin',
hint: 'Một protein nhỏ trong bào tương gắn với nhiều ion vừa được giải phóng và thay đổi cấu hình khi chúng gắn vào; phức hợp tạo thành chính là tín hiệu hoạt động.'
},
{
id: 'pl6', step: 6, enzyme: 'camk', substrates: ['ktarget'], products: ['ktargetp'], ins: ['atp'], outs: ['adp'], avoid: ['serprot', 'phosprot'],
arrows: [{ from: 'ktarget', to: 'ktargetp' }, { from: 'camca', to: 'ktargetp' }],
type: 'Phosphorylation of a target enzyme', irreversible: false,
equation: 'Enzyme đích + ATP → Enzyme đích được phosphoryl hóa + ADP',
hint: 'Một kinase bào tương được phức hợp đó bật lên chuyển nhóm phosphat tận cùng của đồng tiền năng lượng sang một enzyme khác, làm thay đổi hoạt tính của enzyme đó.'
},
{
id: 'pl7', step: 7, enzyme: 'pkc', substrates: ['pkcoff'], products: ['pkcon'], ins: [], outs: [],
arrows: [{ from: 'pkcoff', to: 'pkcon' }, { from: 'dag', to: 'pkcon' }],
type: 'Activation of a membrane kinase', irreversible: false,
equation: 'Protein kinase C + DAG → Protein kinase C hoạt tính',
hint: 'Nửa không phân cực ở lại trong màng gắn vào một kinase màng và bật nó lên.'
},
{
id: 'pl8', step: 8, enzyme: 'pkc', substrates: ['cachan'], products: ['cachanp'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'cachan', to: 'cachanp' }, { from: 'pkcon', to: 'cachanp' }],
type: 'Phosphorylation of channels', irreversible: false,
equation: 'Kênh Ca²⁺ + ATP → Kênh Ca²⁺ được phosphoryl hóa + ADP',
hint: 'Kinase màng hoạt động gắn các nhóm phosphat lên các protein màng sinh chất cho phép một loại ion đi qua, làm thay đổi lượng ion đó vượt qua màng.'
}
];
var plc = {
title: 'PIP2, IP3, DAG và Ca²⁺', subtitle: 'Các chất truyền tin thứ cấp của phospholipase C', tag: 'PLC',
location: 'Màng sinh chất, bào tương và lưới nội chất', color: '#E8B8A0', big: true, terms: { enz: 'protein' },
nodes: lNodes, reactions: lReactions, order: lReactions.map(function (r) { return r.id; }),
start: ['plhorm', 'plcoff', 'pip2', 'caer', 'calmc', 'ktarget', 'pkcoff', 'cachan'],
regions: [
{ type: 'rect', label: 'Màng sinh chất', color: '#F3E6FB', x: 20, y: 20, w: 1160, h: 2060 },
{ type: 'rect', label: 'lưới nội chất và bào tương', color: '#FFF0C9', x: 1160, y: 1160, w: 1100, h: 920 }
],
notes: [],
summary: [
'Một hormone liên kết với thụ thể của nó và một protein G kích hoạt phospholipase C, enzyme này thủy phân lipid màng PIP2 thành hai chất truyền tin, IP3 và DAG.',
'IP3 thực chất là chất truyền tin thứ cấp: nó khuếch tán đến lưới nội chất và giải phóng Ca²⁺; Ca²⁺ liên kết với calmodulin, và phức hợp này kích hoạt một kinase trong tế bào chất, kinase này sẽ phosphoryl hóa một enzyme mục tiêu.',
'DAG là chất không phân cực và nằm trong màng tế bào, nơi nó kích hoạt protein kinase C, chất này phosphoryl hóa các kênh điều khiển dòng chảy Ca²⁺ vào và ra khỏi tế bào.',
'PIP2 là tiền chất, không phải là thụ thể và cũng không phải là chất truyền tin.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('PIP2 và Ca2+', 'PLC'),
entityNotes: { pip2: 'Tiền chất của hai chất truyền tin này là phospholipase C, enzyme cắt nó thành IP3 và diacylglycerol.' }
};
P.pathways.gpcr = gpcr;
P.pathways.camp = camp;
P.pathways.badrenergic = badrenergic;
P.pathways.plc = plc;
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs || !MG.everything || !MG.everything._tools) { return; }
var P = MG.packs.pack('advanced');
var numbered = MG.everything._tools.numbered;
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var NO_CHIP = ['mg', 'hplus', 'nad', 'nadh', 'nadp', 'nadph', 'fad', 'fadh2', 'coa', 'q', 'cytcox', 'co2', 'o2', 'hco3', 'utp', 'udp', 'ump', 'glutc', 'akgc', 'photon'];
var rNodes = {
hormone: node('hormone', 910, 150),
mono: node('rtkmono', 530, 440), bound: node('rtkbound', 910, 440), dimer: node('rtkdimer', 910, 730),
tyr: node('tyrosine', 530, 1020), ptyr: node('phosphotyrosine', 910, 1020),
sh2: node('sh2prot', 530, 1310), complex: node('sigcomplex', 910, 1310), msg: node('rtkmsg', 910, 1600)
};
var rReactions = [
{
id: 'rk1', step: 1, enzyme: 'rtkp', substrates: ['mono', 'hormone'], products: ['bound'], ins: [], outs: [], avoid: ['insr', 'irbound', 'egfrp', 'egfrdimer'],
arrows: [{ from: 'mono', to: 'bound' }, { from: 'hormone', to: 'bound' }],
type: 'Binding of the ligand', irreversible: false,
equation: 'Monomer RTK + Ligand → RTK liên kết với Ligand',
hint: 'Một chất truyền tin từ bên ngoài tế bào khớp vào vị trí gắn ở phần ngoài của một protein xuyên màng một lần, có phần bên trong là một kinase vẫn đang bất hoạt.'
},
{
id: 'rk2', step: 2, enzyme: 'rtkp', substrates: ['bound'], products: ['dimer'], ins: [], outs: [], avoid: ['insr', 'egfrp', 'egfrdimer'],
arrows: [{ from: 'bound', to: 'dimer' }],
type: 'Sự nhị hợp', irreversible: false,
equation: '2 RTK liên kết với phối tử → RTK dimer',
hint: 'Hai protein màng đang mang phối tử tiến lại gần nhau trong màng, đưa hai phần kinase bên trong của chúng áp sát nhau để mỗi bên có thể tác động lên bên kia.'
},
{
id: 'rk3', step: 3, enzyme: 'rtkp', substrates: ['tyr'], products: ['ptyr'], ins: ['atp'], outs: ['adp'], avoid: ['insr', 'egfrp'],
arrows: [{ from: 'tyr', to: 'ptyr' }, { from: 'dimer', to: 'ptyr' }],
type: 'Autophosphorylation of tyrosines', irreversible: false,
equation: 'Tyrosine + ATP → Phosphotyrosine + ADP + H⁺ (mỗi phần kinase phosphoryl hóa phần đuôi của phần kia)',
hint: 'Mỗi phần bên trong hoạt động chuyển nhóm phosphat tận cùng của đồng tiền năng lượng lên nhóm hydroxyl vòng của một amino acid trên đuôi của đối tác, khiến cả hai đuôi đều mang các nhóm phosphat.'
},
{
id: 'rk4', step: 4, enzyme: 'sh2p', substrates: ['sh2'], products: ['complex'], ins: [], outs: [], avoid: ['pi3k', 'grb2', 'egfrcx'],
arrows: [{ from: 'sh2', to: 'complex' }, { from: 'ptyr', to: 'complex' }],
type: 'Assembly of the signaling complex', irreversible: false,
equation: 'Protein miền SH2 + Phosphotyrosine ở đuôi → Phức hợp tín hiệu',
hint: 'Các protein trong bào tương nhận diện các dấu phosphat mới trên hai đuôi sẽ gắn vào đó và tập hợp cạnh nhau.'
},
{
id: 'rk5', step: 5, enzyme: 'sh2p', substrates: ['complex'], products: ['msg'], ins: [], outs: [], avoid: ['pi3k', 'grb2'],
arrows: [{ from: 'complex', to: 'msg' }],
type: 'The message is passed on', irreversible: false,
equation: 'Phức hợp truyền tín hiệu → Thông điệp được truyền đến tế bào (thường bằng quá trình phosphoryl hóa)',
hint: 'Các protein tập hợp trên các đuôi truyền tín hiệu vào sâu trong tế bào, thường bằng cách phosphoryl hóa các protein khác, và tế bào đáp ứng.'
}
];
var rtk = {
title: 'Chu trình RTK', subtitle: 'Từ phối tử đến phức hợp truyền tín hiệu', tag: 'RTK',
location: 'màng sinh chất và tế bào chất', color: '#9CC7E8', terms: { enz: 'protein' },
nodes: rNodes, reactions: rReactions, order: rReactions.map(function (r) { return r.id; }), start: ['hormone', 'mono', 'tyr', 'sh2'],
regions: [{ type: 'rect', label: 'màng sinh chất và tế bào chất', color: '#E2F0F9', x: 20, y: 20, w: 1040, h: 1700 }],
notes: [],
summary: [
'Năm bước đó là: sự gắn kết của hormone với RTK trong màng tế bào, sự dimer hóa thụ thể, quá trình tự phosphoryl hóa, sự lắp ráp phức hợp tín hiệu và sự truyền tín hiệu đến tế bào.',
'Sự dimer hóa rất quan trọng cho hoạt động của enzyme: nó đưa hai phần kinase lại gần nhau, và mỗi phần sau đó phosphoryl hóa các tyrosine trên đuôi của phần kia (tyrosine + ATP → phosphotyrosine + ADP + H⁺); dimer được phosphoryl hóa chính là tyrosine kinase hoạt động.',
'Các miền SH2 nhận biết phosphotyrosine, do đó các đuôi được phosphoryl hóa sẽ thu thập các protein truyền tín hiệu, thường là bằng cách phosphoryl hóa.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'urea', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Chu kỳ RTK', 'RTK')
};
var iNodes = {
insulin: node('insulin', 910, 150),
irrest: node('irrest', 530, 440), irbound: node('irbound', 910, 440), irp: node('irp', 910, 730),
irsoff: node('irsoff', 530, 1020), irson: node('irson', 910, 1020),
pi3koff: node('pi3koff', 530, 1310), pi3kon: node('pi3kon', 910, 1310),
pip2: node('pip2', 530, 1600), pip3: node('pip3', 910, 1600),
pdk1off: node('pdk1off', 530, 1890), pdk1on: node('pdk1on', 910, 1890),
aktoff: node('aktoff', 530, 2180), akton: node('akton', 910, 2180),
glut4ves: node('glut4ves', 530, 2470), glut4pm: node('glut4pm', 910, 2470),
glcout: node('glcout', 530, 2760), glcin: node('glcin', 910, 2760),
ppoff: node('ppoff', 1290, 1020), ppon: node('ppon', 1670, 1020)
};
var iReactions = [
{
id: 'in1', step: 1, enzyme: 'insr', substrates: ['irrest', 'insulin'], products: ['irbound'], ins: [], outs: [], avoid: ['rtkp', 'rtkbound'],
arrows: [{ from: 'irrest', to: 'irbound' }, { from: 'insulin', to: 'irbound' }],
type: 'Binding of insulin', irreversible: false,
equation: 'Dimer thụ thể insulin + Insulin → Thụ thể liên kết insulin',
hint: 'Một hormone báo cho tế bào biết máu đang dồi dào glucose khớp vào một thụ thể màng vốn luôn tồn tại trên màng dưới dạng một cặp chuỗi.'
},
{
id: 'in2', step: 2, enzyme: 'insr', substrates: ['irbound'], products: ['irp'], ins: ['atp'], outs: ['adp'], avoid: ['rtkp'],
arrows: [{ from: 'irbound', to: 'irp' }],
type: 'Tự phosphoryl hóa', irreversible: false,
equation: 'Thụ thể gắn insulin + ATP → Thụ thể tự phosphoryl hóa + ADP',
hint: 'Hai phần kinase bên trong của thụ thể chuyển nhóm phosphat tận cùng của đồng tiền năng lượng lên các gốc tyrosine của nhau và của đuôi chúng, biến thụ thể thành một tyrosine kinase hoạt động.'
},
{
id: 'in3', step: 3, enzyme: 'irs1', substrates: ['irsoff'], products: ['irson'], ins: [], outs: [],
arrows: [{ from: 'irsoff', to: 'irson' }, { from: 'irp', to: 'irson' }],
type: 'Activation of the docking protein', irreversible: false,
equation: 'IRS-1 + Thụ thể tự phosphoryl hóa → IRS-1 (hoạt động)',
hint: 'Một protein neo trong bào tương gắn vào thụ thể đã phosphoryl hóa và được hoạt hóa tại đó; từ đây thông điệp đi tiếp theo con đường này đồng thời rẽ nhánh sang các con đường truyền tín hiệu khác.'
},
{
id: 'in4', step: 4, enzyme: 'pi3k', substrates: ['pi3koff'], products: ['pi3kon'], ins: [], outs: [],
arrows: [{ from: 'pi3koff', to: 'pi3kon' }, { from: 'irson', to: 'pi3kon' }],
type: 'Activation of a lipid kinase', irreversible: false,
equation: 'PI3 kinase + IRS-1 (hoạt động) → PI3 kinase (hoạt động)',
hint: 'Protein neo hoạt động tuyển mộ một kinase tác động lên lipid màng tới màng sinh chất và bật nó lên tại đó.'
},
{
id: 'in5', step: 5, enzyme: 'pi3k', substrates: ['pip2'], products: ['pip3'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'pip2', to: 'pip3' }, { from: 'pi3kon', to: 'pip3' }],
type: 'Phosphorylation of a lipid', irreversible: false,
equation: 'PIP2 + ATP → PIP3 + ADP + H⁺',
hint: 'Lipid kinase hoạt động chuyển nhóm phosphat tận cùng của đồng tiền năng lượng lên vị trí số 3 của vòng inositol trên một phospholipid màng, tạo thành một lipid có thêm một nhóm phosphat.'
},
{
id: 'in6', step: 6, enzyme: 'pdk1', substrates: ['pdk1off'], products: ['pdk1on'], ins: [], outs: [],
arrows: [{ from: 'pdk1off', to: 'pdk1on' }, { from: 'pip3', to: 'pdk1on' }],
type: 'Activation of PDK1', irreversible: false,
equation: 'PDK1 + PIP3 → PDK1 (hoạt động)',
hint: 'Lipid mới mang ba nhóm phosphat thu hút một kinase bào tương tới màng sinh chất, và kinase này trở nên hoạt động tại đó.'
},
{
id: 'in7', step: 7, enzyme: 'akt', substrates: ['aktoff'], products: ['akton'], ins: [], outs: [],
arrows: [{ from: 'aktoff', to: 'akton' }, { from: 'pdk1on', to: 'akton' }],
type: 'Activation of Akt', irreversible: false,
equation: 'Akt + PDK1 (hoạt động) → Akt (hoạt động)',
hint: 'Kinase hoạt động tại màng phosphoryl hóa một kinase thứ hai cũng đang được giữ tại màng bởi lipid đó, làm kinase thứ hai trở nên hoạt động.'
},
{
id: 'in8', step: 8, enzyme: 'akt', substrates: ['glut4ves'], products: ['glut4pm'], ins: [], outs: [],
arrows: [{ from: 'glut4ves', to: 'glut4pm' }, { from: 'akton', to: 'glut4pm' }],
type: 'Movement of GLUT4 to the plasma membrane', irreversible: false,
equation: 'GLUT4 trong túi vận chuyển → GLUT4 trong màng tế bào',
hint: 'Tín hiệu truyền dọc theo chuỗi đi tới đích cuối: các túi dự trữ bên trong tế bào được đưa ra bề mặt và hòa nhập với màng sinh chất tại đó.'
},
{
id: 'in9', step: 9, enzyme: 'glut4', substrates: ['glcout'], products: ['glcin'], ins: [], outs: [],
arrows: [{ from: 'glcout', to: 'glcin' }, { from: 'glut4pm', to: 'glcin' }],
type: 'Uptake of glucose', irreversible: false,
equation: 'Glucose (trong máu) → Glucose (bên trong tế bào), do đó nồng độ glucose trong máu giảm xuống.',
hint: 'Một protein trên màng bề mặt mở lối đi xuyên màng cho đường trong máu, giúp nó di chuyển xuôi theo gradient nồng độ sang phía bên kia.'
},
{
id: 'in10', step: 10, enzyme: 'ppase', substrates: ['ppoff'], products: ['ppon'], ins: [], outs: [],
arrows: [{ from: 'ppoff', to: 'ppon' }, { from: 'irp', to: 'ppon' }],
type: 'Activation of phosphoprotein phosphatase', irreversible: false,
equation: 'Phosphoprotein phosphatase + tín hiệu insulin → Phosphoprotein phosphatase (hoạt động)',
hint: 'Tín hiệu insulin cũng bật lên một enzyme chuyên gỡ bỏ các nhóm phosphat, đảo ngược tác động của các kinase thuộc hormone stress lên các enzyme chuyển hóa glycogen.'
}
];
var insulin = {
title: 'Đường dẫn thụ thể insulin', subtitle: 'Từ insulin đến sự hấp thụ glucose và tổng hợp glycogen', tag: 'INS',
location: 'Màng sinh chất và chất nguyên sinh của tế bào cơ hoặc tế bào mỡ', color: '#8FD1C0', big: true, terms: { enz: 'protein' },
nodes: iNodes, reactions: iReactions, order: iReactions.map(function (r) { return r.id; }),
start: ['insulin', 'irrest', 'irsoff', 'pi3koff', 'pip2', 'pdk1off', 'aktoff', 'glut4ves', 'glcout', 'ppoff'],
regions: [
{ type: 'rect', label: 'màng sinh chất và tế bào chất', color: '#E2F0F9', x: 20, y: 20, w: 1160, h: 2880 },
{ type: 'rect', label: 'Glycogen', color: '#DDF3D4', x: 1160, y: 900, w: 1100, h: 400 }
],
notes: [],
summary: [
'Chuỗi phản ứng bao gồm: insulin liên kết, tự phosphoryl hóa, hoạt hóa IRS-1, hoạt hóa PI3 kinase, hình thành PIP3, hoạt hóa PDK1, hoạt hóa Akt kinase, vận chuyển GLUT4, tế bào hấp thụ glucose và làm giảm nồng độ glucose trong máu.',
'IRS-1 cũng phân nhánh đến các con đường truyền tín hiệu khác; tín hiệu insulin còn kích hoạt phosphoprotein phosphatase, làm cho phosphorylase kinase và glycogen phosphorylase trở nên không hoạt động và glycogen synthase hoạt động, do đó glycogen được tạo ra.',
'Con đường này nằm cạnh con đường beta-adrenergic: epinephrine làm tăng lượng đường trong máu bằng cách kích hoạt quá trình phân giải glycogen, insulin làm giảm lượng đường trong máu bằng cách thúc đẩy hấp thu glucose và tổng hợp glycogen.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'glycogen', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Con đường insulin', 'INS'),
entityNotes: { pip2: 'Lipid màng mà PI3 kinase phosphoryl hóa tại carbon 3 của vòng inositol, tạo thành PIP3.' }
};
P.pathways.rtk = rtk;
P.pathways.insulin = insulin;
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs || !MG.everything || !MG.everything._tools) { return; }
var P = MG.packs.pack('advanced');
var numbered = MG.everything._tools.numbered;
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var WEST_EAST = { 'in': 'west', out: 'east' };
var NO_CHIP = ['mg', 'hplus', 'nad', 'nadh', 'nadp', 'nadph', 'fad', 'fadh2', 'coa', 'q', 'cytcox', 'co2', 'o2', 'hco3', 'utp', 'udp', 'ump', 'glutc', 'akgc', 'photon'];
var ATP_NOTE = { etcatp: 'Đơn vị năng lượng ở đây là chất nền của adenylate cyclase, chuyển hóa nó thành AMP vòng và pyrophosphate, và là chất cho phosphate của mọi kinase trong chu trình này.' };
var sNodes = {
beff: node('beff', 530, 150), baact: node('baact', 530, 440), bagtp: node('bagtp', 530, 730),
acbasal: node('acbasal', 150, 1020), acstim: node('acstim', 530, 1020), atp: node('etcatp', 150, 1310), camp: node('camp', 530, 1310),
acinh: node('acinh', 910, 1020), gstrimer: node('gstrimer', 910, 1310), gsblock: node('gsblock', 1290, 1310),
aeff: node('aeff', 1290, 150), a2act: node('a2act', 1290, 440), gigtp: node('gigtp', 1290, 730), gbgfree: node('gbgfree', 1670, 730)
};
var sReactions = [
{
id: 'gg1', step: 1, enzyme: 'badr', substrates: ['beff'], products: ['baact'], ins: [], outs: [], avoid: ['gpcrp', 'a2r', 'gpbound', 'gpchg', 'gprest'],
arrows: [{ from: 'beff', to: 'baact' }], cof: WEST_EAST,
type: 'Binding of the effector to the stimulatory receptor', irreversible: false,
equation: 'Tác nhân beta + Thụ thể kích thích ở trạng thái nghỉ → Thụ thể hoạt động với Gs liên kết',
hint: 'Một tín hiệu nhỏ từ bên ngoài tế bào khớp vào một protein màng có mặt trong giữ một đối tác chuyên bật enzyme lên, làm protein thay đổi cấu hình. Không có gì được tạo ra hay bẻ gãy.'
},
{
id: 'gg2', step: 2, enzyme: 'gsalpha', substrates: ['baact'], products: ['bagtp'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['galpha', 'gprot', 'gpgtp', 'gpfree', 'plgact'],
arrows: [{ from: 'baact', to: 'bagtp' }], cof: WEST_EAST,
type: 'GTP-GDP exchange on Gs', irreversible: false,
equation: 'Gs alpha-GDP + GTP → Gs alpha-GTP + GDP',
hint: 'Thụ thể đã hoạt hóa khiến protein đối tác bên cạnh trao đổi nucleotide trên một tiểu đơn vị của nó: diphosphate rời đi và triphosphate thế chỗ, bật tiểu đơn vị đó lên.'
},
{
id: 'gg3', step: 3, enzyme: 'gsalpha', substrates: ['acbasal'], products: ['acstim'], ins: [], outs: [], avoid: ['galpha', 'gprot'],
arrows: [{ from: 'acbasal', to: 'acstim' }, { from: 'bagtp', to: 'acstim' }],
type: 'Stimulation of adenylate cyclase (the green plus)', irreversible: false,
equation: 'Adenylate cyclase + Gs alpha-GTP → Adenylate cyclase được kích thích',
hint: 'Tiểu đơn vị lúc này mang triphosphate gắn vào một enzyme trên màng và bật nó lên, giữ enzyme hoạt động chừng nào triphosphate còn gắn trên nó.'
},
{
id: 'gg4', step: 4, enzyme: 'adcyc', substrates: ['atp'], products: ['camp'], ins: [], outs: ['ppi'],
arrows: [{ from: 'atp', to: 'camp' }, { from: 'acstim', to: 'camp' }],
type: 'Synthesis of the second messenger', irreversible: true,
equation: 'ATP → cAMP + PPᵢ',
hint: 'Enzyme đã bật nối một nhóm phosphat của đồng tiền năng lượng vào phần đường của chính phân tử đó để khép thành vòng, còn hai phosphat kia rời đi thành một cặp.'
},
{
id: 'gg5', step: 5, enzyme: 'a2r', substrates: ['aeff'], products: ['a2act'], ins: [], outs: [], avoid: ['gpcrp', 'badr', 'gpbound', 'gpchg'],
arrows: [{ from: 'aeff', to: 'a2act' }], cof: WEST_EAST,
type: 'Binding of the effector to the inhibitory receptor', irreversible: false,
equation: 'Tác nhân gây hiệu ứng Alpha2 + Thụ thể ức chế alpha2 → Thụ thể alpha2 hoạt động với Gi liên kết',
hint: 'Một loại tín hiệu nhỏ thứ hai khớp vào một protein màng khác, loại có mặt trong giữ đối tác chuyên làm giảm hoạt tính của cùng enzyme đó, khiến protein thay đổi cấu hình.'
},
{
id: 'gg6', step: 6, enzyme: 'gialpha', substrates: ['a2act'], products: ['gigtp', 'gbgfree'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['galpha', 'gprot', 'gpgtp', 'gpfree', 'plgact'],
arrows: [{ from: 'a2act', to: 'gigtp' }, { from: 'a2act', to: 'gbgfree' }], cof: WEST_EAST,
type: 'GTP-GDP exchange on Gi', irreversible: false,
equation: 'Gi alpha-GDP + GTP → Gi alpha-GTP + GDP, và G beta-gamma được giải phóng.',
hint: 'Thụ thể đã hoạt hóa khiến protein đối tác của nó trao đổi nucleotide trên một tiểu đơn vị — diphosphate đi ra và triphosphate đi vào — rồi protein tách thành tiểu đơn vị mang nucleotide và một cặp tiểu đơn vị đi cùng nhau.'
},
{
id: 'gg7', step: 7, enzyme: 'gialpha', substrates: ['acstim'], products: ['acinh'], ins: [], outs: [], avoid: ['galpha', 'gprot', 'gbg'],
arrows: [{ from: 'acstim', to: 'acinh' }, { from: 'gigtp', to: 'acinh' }],
type: 'Inhibition of the enzyme', irreversible: false,
equation: 'Adenylate cyclase được kích thích + Gi alpha-GTP → Adenylate cyclase bị ức chế',
hint: 'Tiểu đơn vị mang triphosphate gắn vào chính enzyme màng mà nhánh thứ nhất đã bật lên, nhưng với tác dụng ngược lại: enzyme tạo ra ít sản phẩm hơn.'
},
{
id: 'gg8', step: 8, enzyme: 'gbg', substrates: ['gstrimer'], products: ['gsblock'], ins: [], outs: [], avoid: ['gprot'],
arrows: [{ from: 'gstrimer', to: 'gsblock' }, { from: 'gbgfree', to: 'gsblock' }],
type: 'Inhibition of the stimulatory arm', irreversible: false,
equation: 'G beta-gamma tự do tác động lên trimer Gs → trimer Gs bị giữ ở trạng thái không hoạt động',
hint: 'Cặp tiểu đơn vị được giải phóng ở nhánh ức chế di chuyển tới protein kích thích và chặn nó lại, khiến nhánh kích thích truyền tín hiệu kém hơn.'
}
];
var gsgi = {
title: 'Gs và Gi trên Adenylate Cyclase', subtitle: 'Cánh tay kích thích và cánh tay ức chế', tag: 'GSI',
location: 'màng sinh chất và tế bào chất', color: '#B9A7E8', big: true, terms: { enz: 'protein' },
nodes: sNodes, reactions: sReactions, order: sReactions.map(function (r) { return r.id; }),
start: ['beff', 'aeff', 'acbasal', 'atp', 'gstrimer'],
regions: [{ type: 'rect', label: 'màng sinh chất và tế bào chất', color: '#F3E6FB', x: 20, y: 20, w: 1800, h: 1460 }],
notes: [],
summary: [
'Hai nhánh gặp nhau tại adenylate cyclase: một thụ thể beta kích thích hoạt động thông qua Gs, trong đó tiểu đơn vị alpha-GTP kích thích enzyme, và một thụ thể alpha2 ức chế hoạt động thông qua Gi, trong đó tiểu đơn vị alpha-GTP ức chế enzyme.',
'Mỗi nhánh bắt đầu bằng quá trình trao đổi GTP-GDP trên tiểu đơn vị alpha; enzyme được kích thích sẽ tạo ra cAMP từ ATP (ATP → cAMP + PPᵢ)',
'Các phân tử G beta-gamma tự do từ nhánh ức chế được kéo đến để ngăn chặn trimer Gs, do đó nhánh ức chế cũng làm giảm hoạt động của nhánh kích thích.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('G và Gi', 'GSI'),
entityNotes: ATP_NOTE
};
var oNodes = {
boact: node('boact', 150, 150), bophos: node('bophos', 150, 440), boarr: node('boarr', 150, 730),
bagtp: node('bagtp', 910, 150), bagdp: node('bagdp', 910, 440), gstrimer: node('gstrimer', 910, 730), acbasal: node('acbasal', 1290, 730),
camp: node('camp', 1670, 150), ampmol: node('ampmol', 1670, 440), pkaon: node('pkaon', 2050, 730), pkaoff: node('pkaoff', 2050, 1020)
};
var oReactions = [
{
id: 'bo1', step: 1, enzyme: 'grk', substrates: ['boact'], products: ['bophos'], ins: ['atp'], outs: ['adp'], avoid: ['baact'],
arrows: [{ from: 'boact', to: 'bophos' }], cof: WEST_EAST,
type: 'Phosphorylation of the receptor tail', irreversible: false,
equation: 'Thụ thể liên kết với epinephrine + ATP → Thụ thể được phosphoryl hóa + ADP',
hint: 'Một kinase tác động lên các thụ thể đã hoạt hóa gắn nhóm phosphat tận cùng của đồng tiền năng lượng lên phần đuôi thò vào tế bào chất, đánh dấu protein màng cho protein tiếp theo nhận diện.'
},
{
id: 'bo2', step: 2, enzyme: 'arrestin', substrates: ['bophos'], products: ['boarr'], ins: [], outs: [],
arrows: [{ from: 'bophos', to: 'boarr' }],
type: 'Binding to the phosphorylated tail (blocks and favors endocytosis)', irreversible: false,
equation: 'Thụ thể được phosphoryl hóa + Arrestin → Thụ thể có liên kết với arrestin',
hint: 'Một protein bào tương gắn vào phần đuôi nay đã mang nhóm phosphat, khiến thụ thể không còn truyền tín hiệu cho đối tác được nữa, và phức hợp sau đó bị đưa vào trong tế bào.'
},
{
id: 'bo3', step: 3, enzyme: 'galpha', substrates: ['bagtp'], products: ['bagdp'], ins: ['h2o'], outs: ['pi'], avoid: ['gprot'],
arrows: [{ from: 'bagtp', to: 'bagdp' }], cof: WEST_EAST,
type: 'GTPase action (the switch turns itself off)', irreversible: true,
equation: 'Gs alpha-GTP + H₂O → Gs alpha-GDP + Pᵢ',
hint: 'Tiểu đơn vị hoạt động từ từ cắt nhóm cuối cùng khỏi chính nucleotide của nó, nên sau một lúc nó tự tắt mà không cần trợ giúp từ bên ngoài.'
},
{
id: 'bo4', step: 4, enzyme: 'gbg', substrates: ['bagdp'], products: ['gstrimer', 'acbasal'], ins: [], outs: [], avoid: ['galpha', 'gprot', 'gsalpha', 'gialpha', 'acinh'],
arrows: [{ from: 'bagdp', to: 'gstrimer' }, { from: 'bagdp', to: 'acbasal' }],
type: 'Return to the resting state', irreversible: false,
equation: 'Gs alpha-GDP + G beta-gamma → Gs trimer ở trạng thái nghỉ, và adenylate cyclase không còn được kích hoạt nữa.',
hint: 'Tiểu đơn vị bất hoạt thả enzyme nó đang giữ ra — khiến enzyme ngừng tạo sản phẩm — rồi quay lại với cặp tiểu đơn vị đang chờ ở thụ thể: hệ thống trở về trạng thái nghỉ.'
},
{
id: 'bo5', step: 5, enzyme: 'pde', substrates: ['camp'], products: ['ampmol'], ins: ['h2o'], outs: [],
arrows: [{ from: 'camp', to: 'ampmol' }], cof: WEST_EAST,
type: 'Hydrolysis of the ring', irreversible: true,
equation: 'cAMP + H₂O → AMP + H⁺',
hint: 'Một enzyme mở vòng của chất truyền tin bằng cách thủy phân một trong hai liên kết phosphat của nó, để lại một nucleotide mạch thẳng không có hoạt tính truyền tin, làm nồng độ chất truyền tin giảm xuống.'
},
{
id: 'bo6', step: 6, enzyme: 'pka', substrates: ['pkaon'], products: ['pkaoff'], ins: [], outs: [],
arrows: [{ from: 'pkaon', to: 'pkaoff' }, { from: 'ampmol', to: 'pkaoff', via: [{ x: 1670, y: 1020 }] }],
type: 'Reassembly of the inactive kinase', irreversible: false,
equation: 'R₂(cAMP)₄ + 2 C → R₂C₂ + 4 cAMP, khi nồng độ cAMP giảm xuống.',
hint: 'Khi nồng độ chất truyền tin đã giảm xuống, các phần điều hòa gắn lại với các phần xúc tác, đưa kinase về trạng thái bất hoạt và ngừng phosphoryl hóa các đích của nó.'
}
];
var badroff = {
title: 'Tắt tín hiệu beta-adrenergic', subtitle: 'Thụ thể, protein G và cAMP', tag: 'BOF',
location: 'Màng sinh chất và chất nguyên sinh của tế bào cơ hoặc tế bào gan', color: '#E3A7B9', big: true, terms: { enz: 'protein' },
nodes: oNodes, reactions: oReactions, order: oReactions.map(function (r) { return r.id; }),
start: ['boact', 'bagtp', 'camp', 'pkaon'],
regions: [
{ type: 'rect', label: 'Thụ thể và protein G, màng tế bào chất', color: '#F3E6FB', x: 20, y: 20, w: 1460, h: 880 },
{ type: 'rect', label: 'cAMP và PKA, tế bào chất', color: '#FBE0D6', x: 1540, y: 20, w: 660, h: 1180 }
],
notes: [note('Mức độ trại giảm', 1690, 985, 'start', 18)],
summary: [
'Tín hiệu bị tắt ở bốn vị trí: thụ thể, protein G, cAMP và PKA.',
'Một kinase thụ thể liên kết với protein G phosphoryl hóa đuôi thụ thể và arrestin liên kết với nó.',
'G alpha phân cắt GTP của chính nó và cùng với GDP, rời khỏi adenylate cyclase và tái hợp với G beta-gamma; phosphodiesterase tạo ra AMP từ cAMP, nồng độ cAMP giảm xuống, và PKA lại trở nên không hoạt động.',
'Caffeine ức chế phosphodiesterase và do đó giữ cho nồng độ cAMP cao hơn, nhưng với liều lượng của một tách cà phê, nó chủ yếu tác động lên các thụ thể adenosine.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Tắt tín hiệu beta-adrenergic', 'BOF')
};
var gNodes = {
glucagon: node('glucagon', 910, 150), glact: node('glact', 910, 440), bagtp: node('bagtp', 910, 730),
atp: node('etcatp', 530, 1020), camp: node('camp', 910, 1020), pkaoff: node('pkaoff', 530, 1310), pkaon: node('pkaon', 910, 1310),
pfk2on: node('pfk2on', 150, 1600), pfk2p: node('pfk2p', 530, 1600), f26hi: node('f26hi', 910, 1600), fbp2p: node('fbp2p', 1290, 1600), fbp2off: node('fbp2off', 1670, 1600),
f26lo: node('f26lo', 910, 1890), pfkact: node('pfkact', 150, 2180), glysupp: node('glysupp', 530, 2180), fbpoff: node('fbpoff', 1670, 2180), gngup: node('gngup', 1290, 2180)
};
var gReactions = [
{
id: 'gl1', step: 1, enzyme: 'gpcrp', substrates: ['glucagon'], products: ['glact'], ins: [], outs: [], avoid: ['badr', 'a2r', 'gpbound', 'gpchg'],
arrows: [{ from: 'glucagon', to: 'glact' }], cof: WEST_EAST,
type: 'Binding of glucagon', irreversible: false,
equation: 'Glucagon + Thụ thể → Thụ thể glucagon với Gs liên kết',
hint: 'Một hormone peptide báo hiệu đường huyết thấp khớp vào vị trí gắn của protein 7 vòng xoắn xuyên màng trên màng tế bào gan, làm protein thay đổi cấu hình ở mặt trong.'
},
{
id: 'gl2', step: 2, enzyme: 'gsalpha', substrates: ['glact'], products: ['bagtp'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['galpha', 'gprot', 'gpgtp', 'gpfree', 'plgact'],
arrows: [{ from: 'glact', to: 'bagtp' }], cof: WEST_EAST,
type: 'GDP replaced by GTP', irreversible: false,
equation: 'Gs alpha-GDP + GTP → Gs alpha-GTP + GDP',
hint: 'Một protein bên cạnh thụ thể đang bị kích thích trao đổi nucleotide nó nắm giữ: diphosphate rời đi và triphosphate gắn vào, tách một phần protein đó khỏi các đối tác và bật nó lên.'
},
{
id: 'gl3', step: 3, enzyme: 'adcyc', substrates: ['atp'], products: ['camp'], ins: [], outs: ['ppi'],
arrows: [{ from: 'atp', to: 'camp' }, { from: 'bagtp', to: 'camp' }],
type: 'Synthesis of the second messenger', irreversible: true,
equation: 'ATP → cAMP + PPᵢ',
hint: 'Một enzyme trên màng được tiểu đơn vị hoạt động bật lên biến đồng tiền năng lượng thành chất truyền tin thứ hai dạng vòng và giải phóng hai phosphat thành một cặp.'
},
{
id: 'gl4', step: 4, enzyme: 'pka', substrates: ['pkaoff'], products: ['pkaon'], ins: [], outs: [],
arrows: [{ from: 'pkaoff', to: 'pkaon' }, { from: 'camp', to: 'pkaon' }],
type: 'Release of the catalytic subunits', irreversible: false,
equation: 'R₂C₂ + 4 cAMP → R₂(cAMP)₄ + 2 C',
hint: 'Bốn phân tử chất truyền tin thứ hai gắn vào các phần điều hòa của một kinase bất hoạt, và các phần xúc tác được giải phóng ở dạng enzyme hoạt động.'
},
{
id: 'gl5', step: 5, enzyme: 'pka', substrates: ['pfk2on'], products: ['pfk2p'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'pfk2on', to: 'pfk2p' }, { from: 'pkaon', to: 'pfk2p' }],
type: 'Phosphorylation (activity decreased)', irreversible: false,
equation: 'PFK-2 + ATP → PFK-2-P + ADP',
hint: 'Kinase hoạt động gắn một nhóm phosphat lên enzyme tổng hợp một phân tử đường bisphosphate điều hòa, khiến enzyme đó giảm hoạt tính.'
},
{
id: 'gl6', step: 6, enzyme: 'pka', substrates: ['fbp2off'], products: ['fbp2p'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'fbp2off', to: 'fbp2p' }, { from: 'pkaon', to: 'fbp2p' }],
type: 'Phosphorylation (activity increased)', irreversible: false,
equation: 'FBPase-2 + ATP → FBPase-2-P + ADP',
hint: 'Chính kinase đó gắn một nhóm phosphat lên enzyme thứ hai — enzyme phân giải phân tử đường bisphosphate điều hòa đó — khiến enzyme này tăng hoạt tính.'
},
{
id: 'gl7', step: 7, enzyme: 'fbpase2', substrates: ['f26hi'], products: ['f26lo'], ins: [], outs: [], avoid: ['pfk2'],
arrows: [{ from: 'f26hi', to: 'f26lo' }, { from: 'pfk2p', to: 'f26lo' }, { from: 'fbp2p', to: 'f26lo' }],
type: 'Fall of the regulator', irreversible: false,
equation: 'F2,6P (mức bình thường) → Mức F2,6P thấp hơn: PFK-2-P tạo ra ít hơn và FBPase-2-P phân giải nhiều hơn.',
hint: 'Khi một enzyme tạo ra ít đường bisphosphate điều hòa hơn còn enzyme kia phân giải nhiều hơn, nồng độ chất này trong tế bào giảm xuống.'
},
{
id: 'gl8', step: 8, enzyme: 'pfk1', substrates: ['pfkact'], products: ['glysupp'], ins: [], outs: [],
arrows: [{ from: 'pfkact', to: 'glysupp' }, { from: 'f26lo', to: 'glysupp' }],
type: 'Lack of allosteric activation', irreversible: false,
equation: 'Phosphofructokinase + F2,6P thấp hơn → Phosphofructokinase không có chất hoạt hóa: quá trình đường phân bị ức chế',
hint: 'Khi thiếu chất hoạt hóa dị lập thể của mình, enzyme điều hòa chính của con đường phân giải đường chạy chậm lại, nên tế bào tiêu thụ ít glucose hơn.'
},
{
id: 'gl9', step: 9, enzyme: 'fbpase', substrates: ['fbpoff'], products: ['gngup'], ins: [], outs: [],
arrows: [{ from: 'fbpoff', to: 'gngup' }, { from: 'f26lo', to: 'gngup' }],
type: 'Release of the brake', irreversible: false,
equation: 'Fructose bisphosphatase bị ức chế bởi F2,6P + nồng độ F2,6P thấp hơn → Fructose bisphosphatase được giải phóng: tăng cường quá trình tân tạo glucose.',
hint: 'Khi nồng độ chất điều hòa giảm xuống, enzyme vòng tránh bước quyết định của con đường phân giải đường được tháo phanh ức chế, nên tế bào tổng hợp nhiều glucose hơn.'
}
];
var glucagon = {
title: 'Glucagon: Quá trình đường phân tắt, quá trình tân tạo đường bật.', subtitle: 'Từ glucagon đến hai loại enzyme', tag: 'GLC',
location: 'Màng sinh chất và bào tương của tế bào gan', color: '#E8C79F', big: true, terms: { enz: 'protein' },
nodes: gNodes, reactions: gReactions, order: gReactions.map(function (r) { return r.id; }),
start: ['glucagon', 'atp', 'pkaoff', 'pfk2on', 'fbp2off', 'f26hi', 'pfkact', 'fbpoff'],
regions: [
{ type: 'rect', label: 'Màng sinh chất', color: '#F3E6FB', x: 540, y: 20, w: 740, h: 860 },
{ type: 'rect', label: 'Bào tương của tế bào gan', color: '#FBE0D6', x: 20, y: 920, w: 1800, h: 1410 }
],
notes: [],
summary: [
'Glucagon liên kết với thụ thể của nó và, thông qua protein G kích thích, adenylate cyclase và cAMP, kích hoạt PKA.',
'PKA phosphoryl hóa hai enzyme: phosphofructokinase-2 bị phosphoryl hóa và giảm hoạt tính, còn fructose-bisphosphatase-2 bị phosphoryl hóa và tăng hoạt tính, do đó nồng độ fructose 2,6-bisphosphate giảm xuống.',
'Nồng độ F2,6P thấp hơn có nghĩa là phosphofructokinase thiếu chất hoạt hóa dị lập thể (ức chế quá trình đường phân) và fructose bisphosphatase được giải phóng khỏi cơ chế ức chế (tăng quá trình tân tạo glucose).',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Chuỗi phản ứng glucagon', 'GLC'),
entityNotes: ATP_NOTE
};
var eNodes = {
egf: node('egf', 1290, 150), egfrmono: node('egfrmono', 910, 440), egfrdimer: node('egfrdimer', 1290, 440),
tyr: node('tyrosine', 910, 730), ptyr: node('phosphotyrosine', 1290, 730),
grb2sos: node('grb2sos', 910, 1020), egfrcx: node('egfrcx', 1290, 1020),
rasgdp: node('rasgdp', 910, 1310), rasgtp: node('rasgtp', 1290, 1310),
rafoff: node('rafoff', 910, 1600), rafon: node('rafon', 1290, 1600),
mekoff: node('mekoff', 910, 1890), mekon: node('mekon', 1290, 1890),
mapkoff: node('mapkoff', 910, 2180), mapkon: node('mapkon', 1290, 2180),
mnkoff: node('mnkoff', 150, 2540), mnkon: node('mnkon', 530, 2540), rskoff: node('rskoff', 910, 2540), rskon: node('rskon', 1290, 2540),
mycoff: node('mycoff', 1670, 2540), mycon: node('mycon', 2050, 2540),
creboff: node('creboff', 150, 2830), crebon: node('crebon', 530, 2830), s6off: node('s6off', 910, 2830), s6on: node('s6on', 1290, 2830),
gexpr: node('gexpr', 530, 3120)
};
var eReactions = [
{
id: 'eg1', step: 1, enzyme: 'egfrp', substrates: ['egfrmono', 'egf'], products: ['egfrdimer'], ins: [], outs: [], avoid: ['insr', 'rtkp', 'rtkdimer'],
arrows: [{ from: 'egfrmono', to: 'egfrdimer' }, { from: 'egf', to: 'egfrdimer' }],
type: 'Binding of EGF and dimerization', irreversible: false,
equation: '2 EGFR + 2 EGF → Dimer EGFR liên kết với EGF',
hint: 'Một tín hiệu tăng trưởng nhỏ từ bên ngoài tế bào khớp vào phần ngoài của các protein màng, và hai phân tử tiến lại gần nhau trong màng để hai phần kinase ở mặt trong nằm sát nhau.'
},
{
id: 'eg2', step: 2, enzyme: 'egfrp', substrates: ['tyr'], products: ['ptyr'], ins: ['atp'], outs: ['adp'], avoid: ['rtkp', 'insr'],
arrows: [{ from: 'tyr', to: 'ptyr' }, { from: 'egfrdimer', to: 'ptyr' }],
type: 'Autophosphorylation of tyrosines', irreversible: false,
equation: 'Tyrosine + ATP → Phosphotyrosine + ADP + H⁺ (mỗi phần kinase phosphoryl hóa phần đuôi của phần kia)',
hint: 'Mỗi phần bên trong hoạt động chuyển nhóm phosphat tận cùng của đồng tiền năng lượng lên nhóm hydroxyl vòng của một amino acid trên đuôi đối tác, khiến cả hai đuôi đều mang các nhóm phosphat.'
},
{
id: 'eg3', step: 3, enzyme: 'grb2', substrates: ['grb2sos'], products: ['egfrcx'], ins: [], outs: [], avoid: ['sh2p', 'sos', 'sigcomplex', 'sh2prot'],
arrows: [{ from: 'grb2sos', to: 'egfrcx' }, { from: 'ptyr', to: 'egfrcx' }],
type: 'Assembly of the signaling complex', irreversible: false,
equation: 'GRB2 và SOS + Phosphotyrosine của đuôi → phức hợp GRB2-SOS trên thụ thể',
hint: 'Một protein tiếp hợp trong bào tương nhận diện các dấu phosphat mới trên đuôi thụ thể và gắn vào đó, kéo theo một protein đối tác, tạo thành một phức hợp nhỏ lắp ráp trên đuôi thụ thể.'
},
{
id: 'eg4', step: 4, enzyme: 'sos', substrates: ['rasgdp'], products: ['rasgtp'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['rasp'],
arrows: [{ from: 'rasgdp', to: 'rasgtp' }, { from: 'egfrcx', to: 'rasgtp' }],
type: 'Exchange of GDP for GTP on RAS', irreversible: false,
equation: 'RAS-GDP + GTP → RAS-GTP + GDP',
hint: 'Một protein của phức hợp vừa lắp ráp khiến một protein G nhỏ bên cạnh nhả nucleotide diphosphate của nó ra và nhận nucleotide triphosphate, bật protein đó lên.'
},
{
id: 'eg5', step: 5, enzyme: 'rasp', substrates: ['rafoff'], products: ['rafon'], ins: [], outs: [],
arrows: [{ from: 'rafoff', to: 'rafon' }, { from: 'rasgtp', to: 'rafon' }],
type: 'Activation of the first kinase of the chain', irreversible: false,
equation: 'RAF + RAS-GTP → RAF (đang hoạt động)',
hint: 'Protein hoạt động của công tắc gắn vào một kinase trong bào tương và bật nó lên, truyền tín hiệu tăng trưởng sang kinase tiếp theo của chuỗi.'
},
{
id: 'eg6', step: 6, enzyme: 'rafp', substrates: ['mekoff'], products: ['mekon'], ins: ['atp'], outs: ['adp'], avoid: ['rasp'],
arrows: [{ from: 'mekoff', to: 'mekon' }, { from: 'rafon', to: 'mekon' }],
type: 'Phosphorylation (activation of the second kinase)', irreversible: false,
equation: 'MEK + ATP → MEK-P + ADP',
hint: 'Kinase đầu tiên của chuỗi gắn một nhóm phosphat lên kinase thứ hai và bật nó lên, đưa tín hiệu xuống một tầng.'
},
{
id: 'eg7', step: 7, enzyme: 'mekp', substrates: ['mapkoff'], products: ['mapkon'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'mapkoff', to: 'mapkon' }, { from: 'mekon', to: 'mapkon' }],
type: 'Phosphorylation (activation of the third kinase)', irreversible: false,
equation: 'MAPK + ATP → MAPK-P + ADP',
hint: 'Kinase thứ hai gắn một nhóm phosphat lên kinase thứ ba để bật nó lên; mỗi kinase trong chuỗi có thể hoạt hóa nhiều phân tử ở bước kế tiếp, nên tín hiệu được khuếch đại.'
},
{
id: 'eg8', step: 8, enzyme: 'mapkp', substrates: ['mnkoff'], products: ['mnkon'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'mnkoff', to: 'mnkon' }, { from: 'mapkon', to: 'mnkon' }],
type: 'Phosphorylation of a kinase one level down', irreversible: false,
equation: 'MNK + ATP → MNK-P + ADP',
hint: 'Kinase thứ ba của chuỗi gắn một nhóm phosphat lên một kinase ở tầng dưới kế tiếp và bật nó lên.'
},
{
id: 'eg9', step: 9, enzyme: 'mapkp', substrates: ['rskoff'], products: ['rskon'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'rskoff', to: 'rskon' }, { from: 'mapkon', to: 'rskon' }],
type: 'Phosphorylation of a second kinase at that level', irreversible: false,
equation: 'RSK + ATP → RSK-P + ADP',
hint: 'Chính kinase đó gắn một nhóm phosphat lên một kinase thứ hai khác ở cùng tầng đó và cũng bật nó lên.'
},
{
id: 'eg10', step: 10, enzyme: 'mapkp', substrates: ['mycoff'], products: ['mycon'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 'mycoff', to: 'mycon' }, { from: 'mapkon', to: 'mycon' }],
type: 'Phosphorylation of a transcription factor', irreversible: false,
equation: 'MYC + ATP → MYC-P + ADP',
hint: 'Chính kinase đó cũng gắn trực tiếp một nhóm phosphat lên một protein kiểm soát việc đọc gen, làm bật protein đó lên.'
},
{
id: 'eg11', step: 11, enzyme: 'mnkp', substrates: ['creboff'], products: ['crebon'], ins: ['atp'], outs: ['adp'], avoid: ['rskp'],
arrows: [{ from: 'creboff', to: 'crebon' }, { from: 'mnkon', to: 'crebon' }],
type: 'Phosphorylation of a second transcription factor', irreversible: false,
equation: 'CREB + ATP → CREB-P + ADP',
hint: 'Một trong hai kinase ở tầng đó truyền tín hiệu tiếp bằng cách gắn một nhóm phosphat lên một protein kiểm soát việc đọc gen.'
},
{
id: 'eg12', step: 12, enzyme: 'rskp', substrates: ['s6off'], products: ['s6on'], ins: ['atp'], outs: ['adp'],
arrows: [{ from: 's6off', to: 's6on' }, { from: 'rskon', to: 's6on' }],
type: 'Phosphorylation of a ribosomal protein', irreversible: false,
equation: 'S6 + ATP → S6-P + ADP',
hint: 'Kinase còn lại ở tầng đó truyền tín hiệu tiếp bằng cách gắn một nhóm phosphat lên một protein của ribosome.'
},
{
id: 'eg13', step: 13, enzyme: 'tfp', substrates: ['crebon', 'mycon'], products: ['gexpr'], ins: [], outs: [],
arrows: [{ from: 'crebon', to: 'gexpr' }, { from: 'mycon', to: 'gexpr', via: [{ x: 2050, y: 3120 }] }],
type: 'Activation of the target genes', irreversible: false,
equation: 'CREB-P và MYC-P → Biểu hiện gen (phiên mã các gen mục tiêu)',
hint: 'Khi đã mang các nhóm phosphat, các protein kiểm soát việc đọc gen sẽ bật quá trình sao chép (phiên mã) các gen đích của chúng trong nhân.'
}
];
var egfr = {
title: 'Thụ thể EGF đến MAP Kinase', subtitle: 'Từ EGF đến biểu hiện gen', tag: 'EGF',
location: 'màng sinh chất, tế bào chất và nhân tế bào', color: '#A7C7E3', big: true, terms: { enz: 'protein' },
nodes: eNodes, reactions: eReactions, order: eReactions.map(function (r) { return r.id; }),
start: ['egf', 'egfrmono', 'tyr', 'grb2sos', 'rasgdp', 'rafoff', 'mekoff', 'mapkoff', 'mnkoff', 'rskoff', 'mycoff', 'creboff', 's6off'],
regions: [
{ type: 'rect', label: 'Không gian ngoại bào', color: '#FFF0C9', x: 20, y: 20, w: 2160, h: 300 },
{ type: 'rect', label: 'Tế bào chất', color: '#E2F0F9', x: 20, y: 340, w: 2160, h: 2640 },
{ type: 'rect', label: 'Hạt nhân', color: '#E7DDF3', x: 20, y: 3000, w: 2160, h: 240 }
],
notes: [],
summary: [
'EGF liên kết với thụ thể EGF và thụ thể tạo thành dimer; các đuôi của nó được tự phosphoryl hóa, và GRB2 cùng SOS tập hợp trên các phosphotyrosine.',
'Tín hiệu SOS khiến RAS trao đổi GDP lấy GTP; RAS-GTP kích hoạt RAF, RAF kích hoạt MEK, và MEK kích hoạt MAP kinase.',
'MAPK phosphoryl hóa MNK, RSK và MYC; MNK truyền tín hiệu đến CREB và RSK truyền đến S6; các yếu tố phiên mã được phosphoryl hóa sẽ kích hoạt biểu hiện gen. S6 là một protein ribosome, không phải là yếu tố phiên mã.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('EGFR thành MAP kinase', 'EGF')
};
var rNodes = {
rasgdp: node('rasgdp', 150, 440), rasgtp: node('rasgtp', 530, 440), divide: node('divide', 530, 150),
rasgdp2: node('rasgdp', 530, 730), rasmutgtp: node('rasmutgtp', 910, 440)
};
var rReactions = [
{
id: 'rs1', step: 1, enzyme: 'rasp', substrates: ['rasgdp'], products: ['rasgtp'], ins: ['gtp'], outs: ['gdp'], exactAnswers: true, avoid: ['sos'],
arrows: [{ from: 'rasgdp', to: 'rasgtp' }],
type: 'Binding of GTP switches the protein on', irreversible: false,
equation: 'RAS-GDP + GTP → RAS-GTP + GDP',
hint: 'Protein nhỏ nhả nucleotide diphosphate đang giữ và nhận nucleotide triphosphate thế chỗ, chuyển nó từ trạng thái nghỉ sang trạng thái hoạt động.'
},
{
id: 'rs2', step: 2, enzyme: 'rasp', substrates: ['rasgtp'], products: ['rasgdp2'], ins: ['h2o'], outs: ['pi'],
arrows: [{ from: 'rasgtp', to: 'rasgdp2' }], cof: WEST_EAST,
type: 'Slow GTPase action switches it off', irreversible: true,
equation: 'RAS-GTP + H₂O → RAS-GDP + Pᵢ',
hint: 'Công tắc đang hoạt động từ từ cắt nhóm cuối cùng khỏi chính nucleotide của nó, nên sau một lúc nó tự tắt.'
},
{
id: 'rs3', step: 3, enzyme: 'rasp', substrates: ['rasgtp'], products: ['divide'], ins: [], outs: [], avoid: ['rasmut'],
arrows: [{ from: 'rasgtp', to: 'divide' }],
type: 'The active switch stimulates the next event', irreversible: false,
equation: 'RAS-GTP → Phân chia tế bào',
hint: 'Công tắc đang hoạt động truyền thông điệp của nó tới bộ máy phân chia một tế bào thành hai.'
},
{
id: 'rs4', step: 4, enzyme: 'rasmut', substrates: ['rasgtp'], products: ['rasmutgtp'], ins: [], outs: [], avoid: ['rasp'],
arrows: [{ from: 'rasgtp', to: 'rasmutgtp' }],
type: 'A mutation at codon 12, 13 or 61 slows the GTPase', irreversible: true,
equation: 'RAS-GTP → RAS-GTP đột biến (RAS được tạo ra từ một gen bị đột biến ở codon 12, 13 hoặc 61, gen này phân giải GTP quá chậm và do đó vẫn còn gắn kết)',
hint: 'Sự thay đổi một amino acid tại một trong ba vị trí gần vùng gắn nucleotide khiến protein cắt phosphat khỏi nucleotide quá chậm, nên công tắc luôn ở trạng thái bật và liên tục phát tín hiệu.'
}
];
var ras = {
title: 'Công tắc RAS', subtitle: 'Bật, tắt và bị kẹt ở trạng thái bật.', tag: 'RAS',
location: 'Tế bào chất, tại màng sinh chất', color: '#D7B3A0', terms: { enz: 'protein' },
nodes: rNodes, reactions: rReactions, order: rReactions.map(function (r) { return r.id; }),
start: ['rasgdp'],
regions: [{ type: 'rect', label: 'Công tắc RAS', color: '#F6E4D8', x: 20, y: 20, w: 1000, h: 880 }],
notes: [],
summary: [
'RAS là một protein G đơn phân tử giống như tiểu đơn vị alpha của protein G: RAS-GDP ở trạng thái không hoạt động, việc liên kết với GTP sẽ kích hoạt nó, và một GTPase chậm của chính nó sẽ phân cắt GTP thành GDP và tắt nó đi.',
'RAS được hoạt hóa sẽ kích thích sự phân chia tế bào.',
'Đột biến tại codon 12, 13 hoặc 61 làm cho GTPase hoạt động quá chậm và RAS vẫn tiếp tục hoạt động; RAS đột biến được tìm thấy trong 90% trường hợp ung thư tuyến tụy và 20% tổng số các loại ung thư, mặc dù TP53 bị đột biến trong nhiều loại ung thư hơn.',
'Trong trò chơi này, protein của một bước là protein làm thay đổi hoặc tác động lên mũi tên.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Công tắc RAS', 'RAS')
};
var tNodes = {
sthormout: node('sthormout', 150, 150), sthormin: node('sthormin', 530, 150), nrhsp: node('nrhsp', 530, 440), nrhsph: node('nrhsph', 910, 440),
nrhorm: node('nrhorm', 910, 730), hspfree: node('hspfree', 1290, 730), nrdimer: node('nrdimer', 910, 1020), nrdimernuc: node('nrdimernuc', 910, 1310),
hre: node('hre', 530, 1600), hrecomplex: node('hrecomplex', 910, 1600), mrna: node('mrna', 910, 1890), mrnacyt: node('mrnacyt', 910, 2180), newprot: node('newprot', 910, 2470)
};
var tReactions = [
{
id: 'st1', step: 1, enzyme: 'diffp', terms: { enz: 'process' }, substrates: ['sthormout'], products: ['sthormin'], ins: [], outs: [],
arrows: [{ from: 'sthormout', to: 'sthormin' }],
type: 'Hormone entry across the lipid bilayer', irreversible: false,
equation: 'Hormone steroid (trong máu) → Hormone steroid (trong tế bào)',
hint: 'Hormone không phân cực hòa tan vào lớp kép lipid và đi xuyên qua nó, nên không cần chất vận chuyển cũng không cần thụ thể ở mặt ngoài tế bào.'
},
{
id: 'st2', step: 2, enzyme: 'nr', substrates: ['nrhsp', 'sthormin'], products: ['nrhsph'], ins: [], outs: [],
arrows: [{ from: 'nrhsp', to: 'nrhsph' }, { from: 'sthormin', to: 'nrhsph' }],
type: 'Binding of the hormone to the receptor', irreversible: false,
equation: 'Phức hợp NR/HSP + Hormone steroid → Phức hợp NR/HSP với hormone',
hint: 'Hormone khớp vào vị trí gắn phối tử của một protein bên trong tế bào vốn đang được một protein trợ giúp giữ ở trạng thái nghỉ.'
},
{
id: 'st3', step: 3, enzyme: 'hsp', substrates: ['nrhsph'], products: ['nrhorm', 'hspfree'], ins: [], outs: [],
arrows: [{ from: 'nrhsph', to: 'nrhorm' }, { from: 'nrhsph', to: 'hspfree' }],
type: 'Release from the resting complex', irreversible: false,
equation: 'Phức hợp NR/HSP với hormone → Phức hợp NR/hormone + HSP',
hint: 'Sự thay đổi cấu hình do hormone gây ra khiến protein trợ giúp nhả ra, giúp thụ thể được tự do di chuyển và gắn vào DNA.'
},
{
id: 'st4', step: 4, enzyme: 'nr', substrates: ['nrhorm'], products: ['nrdimer'], ins: [], outs: [],
arrows: [{ from: 'nrhorm', to: 'nrdimer' }],
type: 'Sự nhị hợp', irreversible: false,
equation: '2 Phức hợp NR/hormone → Dimer NR',
hint: 'Hai protein đã gắn hormone kết hợp cạnh nhau, tạo thành cặp đôi sẽ đọc trình tự đích trên DNA.'
},
{
id: 'st5', step: 5, enzyme: 'nucpore', substrates: ['nrdimer'], products: ['nrdimernuc'], ins: [], outs: [],
arrows: [{ from: 'nrdimer', to: 'nrdimernuc' }],
type: 'Movement to the nucleus', irreversible: false,
equation: 'Dimer NR (tế bào chất) → Dimer NR (nhân tế bào)',
hint: 'Cặp đôi này đi qua một kênh trên màng kép bao quanh DNA để vào khoang chứa các gen đích.'
},
{
id: 'st6', step: 6, enzyme: 'nr', substrates: ['hre'], products: ['hrecomplex'], ins: [], outs: [],
arrows: [{ from: 'hre', to: 'hrecomplex' }, { from: 'nrdimernuc', to: 'hrecomplex' }],
type: 'Binding to the HRE with a coactivator and RNA polymerase', irreversible: false,
equation: 'NR dimer + HRE + Chất hoạt hóa + RNA polymerase → Phức hợp phiên mã trên HRE',
hint: 'Cặp đôi gắn vào một đoạn trình tự DNA ngắn cạnh gen đích và tập hợp các protein trợ giúp bên cạnh nó.'
},
{
id: 'st7', step: 7, enzyme: 'rnapol', substrates: ['hrecomplex'], products: ['mrna'], ins: [], outs: [],
arrows: [{ from: 'hrecomplex', to: 'mrna' }],
type: 'Transcription activation', irreversible: false,
equation: 'Phức hợp phiên mã trên HRE → mRNA',
hint: 'Enzyme tại phức hợp vừa lắp ráp sao chép gen thành một bản tin mạch đơn, từng nucleotide một.'
},
{
id: 'st8', step: 8, enzyme: 'nucpore', substrates: ['mrna'], products: ['mrnacyt'], ins: [], outs: [],
arrows: [{ from: 'mrna', to: 'mrnacyt' }],
type: 'Movement of the mRNA to the cytoplasm', irreversible: false,
equation: 'mRNA (nhân tế bào) → mRNA (tế bào chất)',
hint: 'Bản tin hoàn chỉnh rời khỏi khoang chứa DNA qua cùng loại kênh trên màng kép và đi ra tế bào chất.'
},
{
id: 'st9', step: 9, enzyme: 'ribosomep', substrates: ['mrnacyt'], products: ['newprot'], ins: [], outs: [],
arrows: [{ from: 'mrnacyt', to: 'newprot' }],
type: 'Translation and changed cell function', irreversible: false,
equation: 'mRNA (trong tế bào chất) → Protein mới, và chức năng của tế bào thay đổi.',
hint: 'Một hạt lớn trong tế bào chất đọc bản tin theo từng bộ ba nucleotide và nối các amino acid thành một chuỗi, làm thay đổi cách hoạt động của tế bào.'
}
];
var steroid = {
title: 'Tín hiệu hormone steroid', subtitle: 'Từ hormone đến sự thay đổi chức năng tế bào', tag: 'STR',
location: 'Máu, tế bào chất và nhân tế bào', color: '#C9B38F', big: true, terms: { enz: 'protein' },
nodes: tNodes, reactions: tReactions, order: tReactions.map(function (r) { return r.id; }),
start: ['sthormout', 'nrhsp', 'hre'],
regions: [
{ type: 'rect', label: 'Máu', color: '#FBE0D6', x: 20, y: 20, w: 310, h: 280 },
{ type: 'rect', label: 'Tế bào chất', color: '#E2F0F9', x: 345, y: 20, w: 1195, h: 2580 },
{ type: 'rect', label: '', color: '#E7DDF3', x: 450, y: 1165, w: 950, h: 870 }
],
membranes: [
{ x1: 340, y1: 40, x2: 340, y2: 2580 }, { x1: 450, y1: 1165, x2: 1400, y2: 1165 }, { x1: 450, y1: 2035, x2: 1400, y2: 2035 }
],
notes: [note('Hạt nhân', 475, 1222, 'start', 24), note('Vỏ hạt nhân', 1395, 1150, 'end', 16)],
summary: [
'Hormone steroid là các chất không phân cực: chúng xuyên qua lớp màng lipid, liên kết với thụ thể nội bào (NR) mà một protein hỗ trợ giữ ở trạng thái nghỉ, và protein hỗ trợ này được giải phóng khi hormone liên kết.',
'Các thụ thể gắn hormone tạo thành dimer, di chuyển qua lỗ màng nhân vào nhân tế bào và liên kết với yếu tố đáp ứng hormone (HRE) cùng với chất hoạt hóa và RNA polymerase, từ đó kích hoạt quá trình phiên mã.',
'mRNA rời khỏi nhân tế bào qua lỗ màng nhân, ribosome tổng hợp protein, và chức năng của tế bào thay đổi; các hormone này chủ yếu tác động lên sự biểu hiện gen, do đó tác dụng của chúng thường chậm hơn so với các hormone truyền tín hiệu qua chất trung gian thứ cấp.',
'Các phối tử của thụ thể nội bào không phải tất cả đều là steroid theo đúng nghĩa: axit retinoic và T3 không phải là steroid, và calcitriol là một secosteroid (một steroid có vòng mở). Các thụ thể của chúng thuộc cùng một siêu họ thụ thể hạt nhân, nhưng chúng đã nằm trong nhân và không cần giải phóng HSP.'
],
region: ['sig', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Tín hiệu hormone steroid', 'STR')
};
P.pathways.gsgi = gsgi;
P.pathways.badroff = badroff;
P.pathways.glucagon = glucagon;
P.pathways.egfr = egfr;
P.pathways.ras = ras;
P.pathways.steroid = steroid;
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs || !MG.everything || !MG.everything._tools) { return; }
var P = MG.packs.pack('advanced');
var numbered = MG.everything._tools.numbered;
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var WEST_EAST = { 'in': 'west', out: 'east' };
var PROCESS = { enz: 'process' };
var NO_CHIP = ['mg', 'hplus', 'gtp', 'gdp', 'coa', 'fad', 'fadh2', 'q', 'qh2', 'cytcox', 'o2', 'hco3', 'utp', 'udp', 'ump', 'photon', 'thf', 'fthf'];
var cNodes = {
glcm: node('glucose', 150, 150), pyrm: node('pyruvate', 150, 440), lacm: node('lactate', 150, 730),
glcl: node('glucose', 1290, 150), pyrl: node('pyruvate', 1290, 440), lacl: node('lactate', 1290, 730)
};
var cReactions = [
{
id: 'cr1', step: 1, enzyme: 'procglycolysis', terms: PROCESS, substrates: ['glcm'], products: ['pyrm'], ins: [], outs: [],
arrows: [{ from: 'glcm', to: 'pyrm' }],
type: 'Breakdown of the sugar (in the muscle)', irreversible: true,
equation: 'Glucose → 2 Pyruvate',
hint: 'Trong cơ đang hoạt động, phân tử đường 6 carbon bị phân cắt thành hai acid keto 3 carbon qua một con đường dài trong bào tương.'
},
{
id: 'cr2', step: 2, enzyme: 'ldh', substrates: ['pyrm'], products: ['lacm'], ins: ['nadh'], outs: ['nad'], avoid: ['hplus'],
arrows: [{ from: 'pyrm', to: 'lacm' }], cof: WEST_EAST,
type: 'Reduction (the carrier of glycolysis is regenerated)', irreversible: false,
equation: '2 Pyruvate + 2 NADH + 2 H⁺ → 2 Lactate + 2 NAD⁺',
hint: 'Nhóm ketone của acid 3 carbon bị khử thành rượu bởi chất mang dạng khử của đường phân, tạo thành hydroxy acid có thể rời khỏi tế bào và trả lại chất mang dạng oxi hóa mà đường phân cần.',
hl: { sub: { pyrm: ['ket'] }, prod: { lacm: ['choh'] } }
},
{
id: 'cr3', step: 3, enzyme: 'procblood', terms: PROCESS, substrates: ['lacm'], products: ['lacl'], ins: [], outs: [],
arrows: [{ from: 'lacm', to: 'lacl' }],
type: 'Transport from the muscle to the liver', irreversible: false,
equation: '2 Lactate (cơ bắp) → 2 Lactate (gan)',
hint: 'Hydroxy acid rời khỏi tế bào cơ và được dịch tuần hoàn chảy qua mọi mô vận chuyển tới cơ quan khác. Không có gì được tạo ra hay bẻ gãy trên đường đi.'
},
{
id: 'cr4', step: 4, enzyme: 'ldh', substrates: ['lacl'], products: ['pyrl'], ins: ['nad'], outs: ['nadh'], avoid: ['hplus'],
arrows: [{ from: 'lacl', to: 'pyrl' }], cof: WEST_EAST,
type: 'Oxidation (the muscle step run backwards)', irreversible: false,
equation: '2 Lactate + 2 NAD⁺ → 2 Pyruvate + 2 NADH + 2 H⁺',
hint: 'Trong gan, nhóm rượu của hydroxy acid bị oxi hóa ngược lại thành ketone và chất mang dạng oxi hóa thu nhận các electron. Đây là chiều ngược lại của bước xảy ra ở cơ.',
hl: { sub: { lacl: ['choh'] }, prod: { pyrl: ['ket'] } }
},
{
id: 'cr5', step: 5, enzyme: 'procgng', terms: PROCESS, substrates: ['pyrl'], products: ['glcl'], ins: [], outs: [],
arrows: [{ from: 'pyrl', to: 'glcl' }],
type: 'Synthesis of the sugar (in the liver)', irreversible: true,
equation: '2 Pyruvate → Glucose',
hint: 'Gan tổng hợp đường 6 carbon từ hai acid keto 3 carbon qua một con đường dài tiêu tốn năng lượng. Nhiều bước là chiều đảo ngược của con đường ở cơ, cùng với một vài bước vòng tránh.'
},
{
id: 'cr6', step: 6, enzyme: 'procblood', terms: PROCESS, substrates: ['glcl'], products: ['glcm'], ins: [], outs: [],
arrows: [{ from: 'glcl', to: 'glcm' }],
type: 'Transport from the liver to the muscle', irreversible: false,
equation: 'Glucose (gan) → Glucose (cơ bắp)',
hint: 'Phân tử đường rời khỏi tế bào gan và được vận chuyển qua cơ thể trở lại mô đang hoạt động, nơi nó có thể bị phân giải tiếp. Không có gì được tạo ra hay bẻ gãy trên đường đi.'
}
];
var cori = {
title: 'Xe đạp Cori', subtitle: 'Axit lactic từ cơ bắp đến gan, glucose quay trở lại cơ bắp.', tag: 'COR',
location: 'Cơ xương, máu và gan', color: '#E49A9A', terms: { enz: 'enzyme' },
nodes: cNodes, reactions: cReactions, order: cReactions.map(function (r) { return r.id; }), start: ['glcm'],
regions: [
{ type: 'rect', label: 'Cơ bắp', color: '#F8DEDE', x: -20, y: 20, w: 340, h: 870 },
{ type: 'rect', label: 'Máu', color: '#FBE9E9', x: 350, y: 20, w: 740, h: 870 },
{ type: 'rect', label: 'Gan', color: '#E6D3C2', x: 1120, y: 20, w: 340, h: 870 }
],
notes: [],
summary: [
'Trong cơ bắp, glucose chuyển hóa thành 2 phân tử pyruvate và sau đó là 2 phân tử lactate. Lactate đi vào máu đến gan, tại đó nó chuyển hóa thành 2 phân tử pyruvate và sau đó là glucose, rồi glucose quay trở lại cơ bắp.',
'Lactate dehydrogenase với NADH và NAD⁺ là enzyme của hai chu trình pyruvate-lactate, và các quá trình glycolysis, gluconeogenesis và tạo máu được gọi tên như vậy.',
'Với mỗi phân tử glucose, cơ bắp tạo ra 2 ATP và gan tiêu tốn 6 liên kết phosphate năng lượng cao (4 ATP và 2 GTP), do đó một chu kỳ chuyển hóa tiêu tốn 4 ATP tương đương, do gan chi trả.',
'Chu trình Cori vận chuyển carbon (lactate và glucose); chu trình glucose-alanine cũng vận chuyển các nhóm amino của cơ đến gan.'
],
region: ['nitro', 'gly', 'both', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Chu trình Cori', 'COR'),
entityNotes: {
ldh: 'Enzyme này chuyển hóa pyruvate và lactate bằng NADH và NAD⁺. Trong cơ, nó tạo ra lactate, còn trong gan, nó lại tạo ra pyruvate.',
glucose: 'Đường sáu carbon của chu trình. Cơ bắp phân giải nó thành pyruvate và lactate, và gan tái tạo nó từ lactate rồi trả lại.',
pyruvate: 'Axit keto ba carbon là trung tâm của chu trình: quá trình đường phân tạo ra nó từ glucose, lactate dehydrogenase chuyển hóa nó thành lactate, và gan chuyển hóa nó trở lại thành glucose.',
lactate: 'Glucocorticoid là sản phẩm của quá trình đường phân trong cơ bắp đang hoạt động khi pyruvate không thể được oxy hóa hoàn toàn. Máu sẽ vận chuyển nó đến gan, nơi nó trở thành nguồn carbon cho quá trình tân tạo glucose.'
}
};
var hNodes = {
mprot: node('mprot', 530, 150), maa: node('maa', 530, 440), mnh4: node('ammonium', 530, 730), mglu: node('glutamate', 530, 1020), makg: node('akg', 530, 1310),
mpyr: node('pyruvate', 910, 1020), mala: node('alanine', 910, 1310), mglc: node('glucose', 910, 730),
lala: node('alanine', 1860, 1310), lakg: node('akg', 2240, 1310), lpyr: node('pyruvate', 1860, 1020), lglu: node('glutamate', 2240, 1020),
lglc: node('glucose', 1860, 730), lnh4: node('ammonium', 2240, 730), lurea: node('urea', 2240, 440)
};
var hReactions = [
{
id: 'ch1', step: 1, enzyme: 'procprot', terms: PROCESS, substrates: ['mprot'], products: ['maa'], ins: [], outs: [],
arrows: [{ from: 'mprot', to: 'maa' }], cof: WEST_EAST,
type: 'Hydrolysis of peptide bonds', irreversible: true,
equation: 'Protein cơ bắp → Axit amin',
hint: 'Các enzyme cắt liên kết peptide phân cắt các polymer lớn của mô thành các đơn vị cấu tạo của chúng, giải phóng vào trong tế bào.'
},
{
id: 'ch2', step: 2, enzyme: 'procdeam', terms: PROCESS, substrates: ['maa'], products: ['mnh4'], ins: [], outs: [],
arrows: [{ from: 'maa', to: 'mnh4' }], cof: WEST_EAST,
type: 'Removal of the nitrogen group', irreversible: false,
equation: 'Axit amin → NH₄⁺ + khung cacbon',
hint: 'Nhóm mang nitơ bị tách khỏi bộ khung carbon và rời đi dưới dạng một ion dương nhỏ, trong khi bộ khung carbon được giữ lại để sinh năng lượng.'
},
{
id: 'ch3', step: 3, enzyme: 'gdh', substrates: ['mnh4'], products: ['mglu'], ins: ['nadph', 'akgc'], outs: ['nadp', 'h2o'], avoid: ['nad', 'nadh', 'hplus', 'akg', 'ammonium'],
arrows: [{ from: 'mnh4', to: 'mglu' }], cof: WEST_EAST,
type: 'Reductive amination', irreversible: false,
equation: 'NH₄⁺ + α-Ketoglutarate + NADPH + H⁺ → Glutamate + NADP⁺ + H₂O',
hint: 'Ion nitơ tự do được gắn vào một acid keto 5 carbon của chu trình TCA bằng phản ứng khử với các electron của chất mang dạng khử. Phản ứng này tạo ra amino acid chuyên thu gom các nhóm amin của mô.'
},
{
id: 'ch4', step: 4, enzyme: 'alt', substrates: ['mglu', 'mpyr'], products: ['mala', 'makg'], ins: [], outs: [], avoid: ['alanine'],
arrows: [{ from: 'mpyr', to: 'mala' }, { from: 'mglu', to: 'makg' }],
type: 'Transamination (in the muscle)', irreversible: false,
equation: 'Glutamate + Pyruvate ⇌ α-Ketoglutarate + Alanine',
hint: 'Một coenzyme dẫn xuất từ vitamin B6 chuyển nhóm amin từ amino acid thu gom sang acid keto 3 carbon của đường phân. Kết quả tạo ra một amino acid 3 carbon và một acid keto 5 carbon, không có sự oxi hóa hay khử nào.'
},
{
id: 'ch5', step: 5, enzyme: 'procblood', terms: PROCESS, substrates: ['mala'], products: ['lala'], ins: [], outs: [],
arrows: [{ from: 'mala', to: 'lala' }],
type: 'Transport from the muscle to the liver', irreversible: false,
equation: 'Alanine (cơ bắp) → Alanine (gan)',
hint: 'Amino acid tạo ra ở cơ được dịch tuần hoàn chảy qua các mô vận chuyển tới cơ quan khác. Đây là cách các nhóm amin từ cơ đi tới cơ quan tổng hợp ure.'
},
{
id: 'ch6', step: 6, enzyme: 'alt', substrates: ['lala', 'lakg'], products: ['lpyr', 'lglu'], ins: [], outs: [],
arrows: [{ from: 'lala', to: 'lpyr' }, { from: 'lakg', to: 'lglu' }],
type: 'Transamination (in the liver)', irreversible: false,
equation: 'Alanine + α-Ketoglutarate ⇌ Pyruvate + Glutamate',
hint: 'Ở gan, cùng phản ứng chuyển amin đó chạy theo chiều ngược lại: amino acid 3 carbon nhường nhóm amin cho acid keto 5 carbon, tái tạo acid keto 3 carbon của đường phân.'
},
{
id: 'ch7', step: 7, enzyme: 'procgng', terms: PROCESS, substrates: ['lpyr'], products: ['lglc'], ins: [], outs: [],
arrows: [{ from: 'lpyr', to: 'lglc' }],
type: 'Synthesis of the sugar (in the liver)', irreversible: true,
equation: '2 Pyruvate → Glucose',
hint: 'Acid keto 3 carbon được tổng hợp thành đường 6 carbon qua một con đường dài tiêu tốn năng lượng diễn ra ở gan.'
},
{
id: 'ch8', step: 8, enzyme: 'procblood', terms: PROCESS, substrates: ['lglc'], products: ['mglc'], ins: [], outs: [],
arrows: [{ from: 'lglc', to: 'mglc' }],
type: 'Transport from the liver to the muscle', irreversible: false,
equation: 'Glucose (gan) → Glucose (cơ bắp)',
hint: 'Phân tử đường rời khỏi gan và được vận chuyển qua cơ thể tới cơ, nơi nó có thể được phân giải lại để tạo năng lượng.'
},
{
id: 'ch9', step: 9, enzyme: 'procglycolysis', terms: PROCESS, substrates: ['mglc'], products: ['mpyr'], ins: [], outs: [],
arrows: [{ from: 'mglc', to: 'mpyr' }],
type: 'Breakdown of the sugar (in the muscle)', irreversible: true,
equation: 'Glucose → 2 Pyruvate',
hint: 'Trong cơ, phân tử đường bị phân cắt thành hai acid keto 3 carbon qua một con đường dài trong bào tương. Một trong hai phân tử lại nhận nhóm amin, khép kín chu trình.'
},
{
id: 'ch10', step: 10, enzyme: 'gdh', substrates: ['lglu'], products: ['lnh4'], ins: ['nad', 'h2o'], outs: ['nadh'], avoid: ['nadp', 'nadph', 'hplus', 'akg', 'ammonium'],
arrows: [{ from: 'lglu', to: 'lnh4' }], cof: WEST_EAST,
type: 'Oxidative deamination', irreversible: false,
equation: 'Glutamate + NAD⁺ + H₂O → α-Ketoglutarate + NH₄⁺ + NADH + H⁺',
hint: 'Amino acid chuyên thu gom nhóm amin bị oxi hóa ở gan: nhóm amin của nó tách ra dưới dạng ion tự do, chất mang dạng oxi hóa thu nhận electron, và để lại một acid keto 5 carbon.'
},
{
id: 'ch11', step: 11, enzyme: 'procurea', terms: PROCESS, substrates: ['lnh4'], products: ['lurea'], ins: [], outs: [],
arrows: [{ from: 'lnh4', to: 'lurea' }], cof: WEST_EAST,
type: 'Nitrogen disposal (in the liver)', irreversible: true,
equation: 'NH₄⁺ → Urê',
hint: 'Ion nitơ tự do được chuyển hóa thành hợp chất trung hòa để cơ thể bài tiết, thông qua một chu trình ở gan bắt đầu trong ty thể và kết thúc ở bào tương.'
}
];
var cahill = {
title: 'Chu trình Glucose-Alanine (Cahill)', subtitle: 'Các nhóm amino từ cơ đến gan, glucose trở lại', tag: 'CAH',
location: 'Cơ xương, máu và gan', color: '#E3A987', terms: { enz: 'enzyme' }, big: true,
nodes: hNodes, reactions: hReactions, order: hReactions.map(function (r) { return r.id; }), start: ['mprot'],
regions: [
{ type: 'rect', label: 'Cơ bắp', color: '#F8DEDE', x: 330, y: 20, w: 710, h: 1450 },
{ type: 'rect', label: 'Máu', color: '#FBE9E9', x: 1080, y: 20, w: 440, h: 1450 },
{ type: 'rect', label: 'Gan', color: '#E6D3C2', x: 1560, y: 20, w: 880, h: 1450 }
],
notes: [],
summary: [
'Cơ bắp gửi các nhóm amino của nó đến gan: ALT gắn nhóm amino của glutamate vào pyruvate để tạo thành alanine, và trong gan, ALT lại gắn nhóm amino đó vào α-ketoglutarate. Chu trình này vận chuyển nitơ dưới dạng alanine chứ không phải dưới dạng NH₄⁺ tự do.',
'Pyruvate mà gan chuyển hóa thành glucose giúp khép kín chu trình: cơ bắp nhận được glucose để phân giải, và gan nhận được nitơ cần thiết cho quá trình tổng hợp urê.',
'Trong gan, glutamate nhường nitơ của nó dưới dạng NH₄⁺ cho chu trình urê. Glutamate dehydrogenase xúc tác quá trình amin hóa và khử amin.',
'Glutamine là chất vận chuyển thứ hai, với thận là nơi enzyme glutaminase tạo ra NH₄⁺ (xem Glutamate và Alanine).'
],
region: ['nitro', 'urea', 'tca', 'gly', 'both', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Chu trình glucose-alanin', 'CAH'),
entityNotes: {
alt: 'Enzyme này di chuyển nhóm amino giữa alanin và glutamat, cùng với các axit keto pyruvat và α-ketoglutarat. Nó hoạt động trong cơ bắp (tạo ra alanin) và trong gan (tạo ra pyruvat).',
alanine: 'Axit amin ba carbon này mang các nhóm amino của cơ đến gan. Nó được tạo ra từ pyruvate bởi ALT và được chuyển hóa trở lại thành pyruvate bởi ALT trong gan.',
glutamate: 'Axit amin thu thập các nhóm amino trong cơ (từ NH₄⁺ và α-ketoglutarate) và trong gan lại giải phóng chúng dưới dạng NH₄⁺ cho chu trình urê.',
pyruvate: 'Axit keto ba cacbon của quá trình đường phân. Trong cơ, ALT chuyển hóa nó thành alanin; trong gan, ALT tạo ra nó từ alanin và quá trình tân tạo glucose chuyển hóa nó thành glucose.',
glucose: 'Đường sáu carbon của chu trình: gan tạo ra nó từ pyruvate và chuyển đến cơ bắp, nơi quá trình đường phân tạo ra pyruvate một lần nữa từ đó.',
akg: 'Axit keto năm carbon của chu trình TCA. Trong cơ bắp, nó là sản phẩm của glutamate khi nhường nhóm amino của mình cho pyruvate; trong gan, nó nhận nhóm amino của alanine và trở thành glutamate.',
gdh: 'Enzyme này liên kết NH₄⁺ với α-ketoglutarate để tạo thành glutamate, và giải phóng NH₄⁺ từ glutamate. Nó hoạt động trong bước thu thập nitơ ở cơ bắp và trong bước cung cấp nitơ cho chu trình urê ở gan.',
ammonium: 'Ion nitơ tự do. Trong cơ bắp, nó liên kết với glutamate; trong gan, nó được giải phóng khỏi glutamate và chuyển hóa thành urê.',
urea: 'Hợp chất nitơ trung tính mà gan tạo ra từ NH₄⁺ và bài tiết ra ngoài.'
}
};
var tNodes = {
asp: node('aspartate', 910, 150), oaa: node('oaa', 1670, 150),
plp: node('plp', 150, 440), eplp: node('plplys', 530, 440), ext: node('extald', 910, 440), quin: node('quin', 1290, 440), ket: node('ket', 1670, 440),
pmp: node('pmp', 1670, 730), eplp2: node('plplys', 1290, 730), akg: node('akg', 1670, 1020), glu: node('glutamate', 1290, 1020)
};
var tReactions = [
{
id: 'tr1', step: 1, enzyme: 'ast', substrates: ['plp'], products: ['eplp'], ins: [], outs: ['h2o'], avoid: ['alt'],
arrows: [{ from: 'plp', to: 'eplp' }],
type: 'Condensation of an aldehyde with an amine (steps 1a and 1b)', irreversible: false,
equation: 'PLP + Lys-NH₂ (enzyme) → PLP-Lys Schiff base (aldimine nội phân tử) + H₂O',
hint: 'Nhóm aldehyde của coenzyme phản ứng với nhóm amin của một gốc lysine ở trung tâm hoạt động, tạo liên kết C=N kèm tách một phân tử nhỏ. Coenzyme lúc này được neo giữ trong trung tâm hoạt động.',
hl: { sub: { plp: ['ald'] } }
},
{
id: 'tr2', step: 2, enzyme: 'ast', substrates: ['eplp', 'asp'], products: ['ext'], ins: [], outs: [],
arrows: [{ from: 'eplp', to: 'ext' }, { from: 'asp', to: 'ext' }],
type: 'Transaldimination (steps 2a to 2c)', irreversible: false,
equation: 'Aldimine nội bào + Aspartate → Aldimine ngoại bào + Lys-NH₂ (lysine được giải phóng)',
hint: 'Cơ chất tấn công vào liên kết C=N: nhóm amin của chính nó thế chỗ cho gốc lysine, và lysine được giải phóng tự do. Nhóm amin của cơ chất giờ đây liên kết với coenzyme qua liên kết C=N.'
},
{
id: 'tr3', step: 3, enzyme: 'ast', substrates: ['ext'], products: ['quin'], ins: [], outs: [], avoid: ['alt'],
arrows: [{ from: 'ext', to: 'quin' }],
type: 'Loss of the α-proton (step 3)', irreversible: false,
equation: 'Aldimine ngoại bào ⇌ Quinonoid + H⁺',
hint: 'Một proton bị tách khỏi carbon kế cận nhóm carboxylate của cơ chất đang gắn, và các electron chảy vào vòng của coenzyme đóng vai trò "bể hút electron" (electron sink). Kết quả tạo thành một dạng phẳng có hệ liên hợp mạnh.'
},
{
id: 'tr4', step: 4, enzyme: 'ast', substrates: ['quin'], products: ['ket'], ins: [], outs: [], avoid: ['alt'],
arrows: [{ from: 'quin', to: 'ket' }],
type: 'Protonation at C4′ (step 4)', irreversible: false,
equation: 'Quinonoid + H⁺ ⇌ Ketimine',
hint: 'Một proton được cộng vào carbon của coenzyme vốn từng là carbon aldehyde của nó. Điều này dịch chuyển liên kết C=N sang carbon α cũ của cơ chất, khiến bộ khung carbon của cơ chất trở thành acid keto vẫn đang gắn với coenzyme.'
},
{
id: 'tr5', step: 5, enzyme: 'ast', substrates: ['ket'], products: ['pmp', 'oaa'], ins: ['h2o'], outs: [], avoid: ['pmp'],
arrows: [{ from: 'ket', to: 'pmp' }, { from: 'ket', to: 'oaa' }], cof: WEST_EAST,
type: 'Hydrolysis of a C=N bond (step 5)', irreversible: false,
equation: 'Ketimine + H₂O → PMP + Oxaloacetate',
hint: 'Phản ứng thủy phân cắt liên kết C=N tại carbon α cũ. Bộ khung carbon rời đi dưới dạng acid keto, còn coenzyme giữ lại nhóm amin ở dạng CH₂-NH₃⁺.',
hl: { prod: { pmp: ['amine'] } }
},
{
id: 'tr6', step: 6, enzyme: 'ast', substrates: ['pmp', 'akg'], products: ['eplp2', 'glu'], ins: [], outs: ['h2o'], avoid: ['alt', 'glutamate', 'plplys'],
arrows: [{ from: 'pmp', to: 'eplp2' }, { from: 'akg', to: 'glu' }],
type: 'Second half-reaction (the first half run backwards)', irreversible: false,
equation: 'PMP + α-Ketoglutarate + Lys-NH₂ → PLP-Lys Schiff base + Glutamate + H₂O',
hint: 'Một acid keto thứ hai — loại 5 carbon của chu trình TCA — nhận lại nhóm amin từ coenzyme qua đúng các bước chạy ngược lại. Quá trình này tạo ra amino acid thu gom nhóm amin và khôi phục liên kết giữa coenzyme với lysine, giúp enzyme sẵn sàng cho vòng tiếp theo.',
hl: { sub: { pmp: ['amine'] } }
}
];
var transam = {
title: 'Phản ứng chuyển amin với PLP', subtitle: 'Aspartate aminotransferase, từng bước một', tag: 'TRA',
location: 'Vị trí hoạt động của transaminase (trong tế bào chất và chất nền ty thể)', color: '#C9B4E0', big: true,
nodes: tNodes, reactions: tReactions, order: tReactions.map(function (r) { return r.id; }), start: ['plp'],
regions: [{ type: 'rect', label: 'vị trí hoạt động của transaminase', color: '#EDE3F6', x: 20, y: 20, w: 1800, h: 1140 }],
notes: [
note('Phần đầu: chất nền nhường nhóm amino của nó', 150, 345, 'start', 18),
note('Nửa sau: nhóm amino chuyển thành axit keto', 910, 640, 'start', 18),
note('Enzyme đã trở lại trạng thái nghỉ ngơi.', 1290, 840, 'middle', 18)
],
summary: [
'Cơ chế aspartate aminotransferase diễn ra theo các bước 1a đến 5: PLP và lysine tạo thành aldimine nội phân tử, aspartate chuyển hóa nó thành aldimine ngoại phân tử, proton α bị mất đi (quinonoid), một proton được thêm vào C4′ (ketimine), và quá trình thủy phân giải phóng oxaloacetate và để lại PMP.',
'Alanine aminotransferase có cấu trúc hóa học tương tự (alanine và pyruvate); ở nửa sau, PMP truyền nhóm amino của nó cho một axit keto thứ hai, α-ketoglutarate, và glutamate rời đi trong khi liên kết Schiff của lysine được phục hồi.',
'Các gốc amino acid quan trọng là Lys258 (lysine liên kết Schiff), Asp222 (nhóm carboxylate của nó nằm cạnh vòng N-H) và Arg292 cùng Arg386 (chúng giữ hai nhóm carboxylate); cách đánh số tương ứng với enzyme trong tế bào chất.',
'Nhóm amino của chất nền chỉ gắn vào carbon aldehyde của PLP sau khi nó đã thay thế lysine. Phản ứng chuyển nhóm amin di chuyển một nhóm amino; nó không giải phóng NH₄⁺, điều mà glutamate dehydrogenase thực hiện sau đó.'
],
region: ['nitro', 'urea', 'tca', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Phản ứng chuyển amin với PLP', 'TRA'),
entityNotes: {
ast: 'Aspartate aminotransferase: aspartate và α-ketoglutarate tạo ra oxaloacetate và glutamate thông qua coenzyme PLP. Alanine aminotransferase hoạt động theo cách tương tự với alanine và pyruvate.',
aspartate: 'Chất nền của phản ứng bán phần đầu tiên. Nó nhường nhóm amino của mình cho coenzyme và tách ra dưới dạng oxaloacetate; hai nhóm carboxylate của nó được giữ bởi Arg292 và Arg386.',
oaa: 'Axit keto là dạng mà aspartate chuyển hóa thành khi nhóm amino của nó chuyển sang coenzyme.',
akg: 'Axit keto nhận lại nhóm amino từ PMP trong phản ứng bán phần thứ hai và trở thành glutamate.',
glutamate: 'Axit amin rời khỏi vị trí hoạt động khi α-ketoglutarate lấy nhóm amino từ PMP; nó là chất vận chuyển thu thập các nhóm amino trong tế bào.'
}
};
P.pathways.cori = cori;
P.pathways.cahill = cahill;
P.pathways.transam = transam;
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs || !MG.everything || !MG.everything._tools) { return; }
var P = MG.packs.pack('advanced');
var numbered = MG.everything._tools.numbered;
function node(mol, x, y) { return { mol: mol, x: x, y: y }; }
function note(text, x, y, anchor, size) { return { text: text, x: x, y: y, size: size || 20, color: '#6b5d3a', anchor: anchor || 'start' }; }
var WEST_EAST = { 'in': 'west', out: 'east' };
var UP_DOWN = { 'in': 'up', out: 'down' };
var NO_CHIP = ['mg', 'hplus', 'coa', 'fad', 'fadh2', 'cytcox', 'o2', 'utp', 'udp', 'ump', 'photon'];
var pNodes = {
g6p: node('g6p', 150, 150), lac: node('pglactone', 530, 150), pg6: node('pgluconate', 910, 150), ru5p: node('ru5p', 1290, 150), xu5p: node('xu5p', 1670, 150),
r5p: node('r5p', 1290, 440),
s7p: node('s7p', 1290, 730), g3p: node('g3p', 1670, 730),
e4p: node('e4p', 1290, 1020), f6p: node('f6p', 1670, 1020),
xu5p2: node('xu5p', 910, 1020), f6p2: node('f6p', 1290, 1310), g3p2: node('g3p', 910, 1310),
prpp: node('prpp', 910, 440)
};
var pReactions = [
{
id: 'pp1', step: 1, enzyme: 'g6pdh', substrates: ['g6p'], products: ['lac'], ins: ['nadp'], outs: ['nadph'], avoid: ['hplus'],
arrows: [{ from: 'g6p', to: 'lac' }], cof: UP_DOWN,
type: 'Oxidation (the committed step, NADPH made)', irreversible: true,
equation: 'Glucose 6-phosphate + NADP⁺ → 6-Phosphoglucono-δ-lactone + NADPH + H⁺',
hint: 'Đường phosphate dạng vòng bị oxi hóa tại carbon 1 (carbon hemiacetal của nó) bởi chất mang dạng oxi hóa của các phản ứng sinh tổng hợp. Một ester nội phân tử hình thành và chất mang bị khử. Đây là bước đầu tiên của con đường.',
hl: { prod: { lac: ['lac'] } }
},
{
id: 'pp2', step: 2, enzyme: 'pglase', substrates: ['lac'], products: ['pg6'], ins: ['h2o'], outs: [],
arrows: [{ from: 'lac', to: 'pg6' }], cof: UP_DOWN,
type: 'Hydrolysis of the ring ester', irreversible: true,
equation: '6-Phosphoglucono-δ-lacton + H₂O → 6-Phosphogluconat + H⁺',
hint: 'Vòng của ester nội phân tử được mở ra nhờ thủy phân, tạo thành một acid đường mạch hở có nhóm phosphat ở đầu xa.',
hl: { sub: { lac: ['lac'] }, prod: { pg6: ['coo'] } }
},
{
id: 'pp3', step: 3, enzyme: 'pgdh', substrates: ['pg6'], products: ['ru5p'], ins: ['nadp'], outs: ['nadph', 'co2'], avoid: ['hplus'],
arrows: [{ from: 'pg6', to: 'ru5p' }], cof: UP_DOWN,
type: 'Oxidative decarboxylation (NADPH and CO₂)', irreversible: true,
equation: '6-Phosphogluconate + NADP⁺ → Ribulose 5-phosphate + CO₂ + NADPH',
hint: 'Acid mạch hở bị oxi hóa tại carbon 3 bởi cùng chất mang dạng oxi hóa như ở bước đầu, còn carbon carboxyl của nó thoát ra dưới dạng khí. Kết quả để lại một ketose phosphate 5 carbon.',
hl: { sub: { pg6: ['coo', 'c3'] }, prod: { ru5p: ['ket'] } }
},
{
id: 'pp4', step: 4, enzyme: 'rpi', substrates: ['ru5p'], products: ['r5p'], ins: [], outs: [],
arrows: [{ from: 'ru5p', to: 'r5p' }], twoWay: true,
type: 'Isomerization (ketose to aldose)', irreversible: false,
equation: 'Ribulose 5-phosphate ⇌ Ribose 5-phosphate',
hint: 'Một ketose phosphate được đồng phân hóa thành aldose phosphate dùng làm nền tổng hợp nucleotide: nhóm carbonyl chuyển từ carbon 2 sang carbon 1 qua chất trung gian enediol.',
hl: { sub: { ru5p: ['ket'] } }
},
{
id: 'pp5', step: 5, enzyme: 'rpe', substrates: ['ru5p'], products: ['xu5p'], ins: [], outs: [],
arrows: [{ from: 'ru5p', to: 'xu5p' }], twoWay: true,
type: 'Epimerization at carbon 3', irreversible: false,
equation: 'Ribulose 5-phosphate ⇌ Xylulose 5-phosphate',
hint: 'Chính ketose phosphate đó được epimer hóa tại carbon 3, xoay đảo cấu hình carbon này và tạo thành ketose phosphate 5 carbon còn lại. Sản phẩm được dùng cùng ribose 5-phosphate ở bước kế tiếp.'
},
{
id: 'pp6', step: 6, enzyme: 'tkt', substrates: ['r5p', 'xu5p'], products: ['s7p', 'g3p'], ins: [], outs: [], avoid: ['s7p', 'g3p'],
arrows: [{ from: 'r5p', to: 's7p' }, { from: 'xu5p', to: 'g3p' }], twoWay: true,
type: 'Transfer of two carbons', irreversible: false,
equation: 'Ribose 5-phosphate + Xylulose 5-phosphate ⇌ Sedoheptulose 7-phosphate + Glyceraldehyde 3-phosphate',
hint: 'Một đơn vị 2 carbon được chuyển từ ketose phosphate sang aldose phosphate, nên hai đường 5 carbon tạo thành một ketose phosphate 7 carbon và một aldehyde phosphate 3 carbon.'
},
{
id: 'pp7', step: 7, enzyme: 'talase', substrates: ['s7p', 'g3p'], products: ['e4p', 'f6p'], ins: [], outs: [], avoid: ['e4p'],
arrows: [{ from: 's7p', to: 'e4p' }, { from: 'g3p', to: 'f6p' }], twoWay: true,
type: 'Transfer of three carbons', irreversible: false,
equation: 'Sedoheptulose 7-phosphate + Glyceraldehyde 3-phosphate ⇌ Erythrose 4-phosphate + Fructose 6-phosphate',
hint: 'Một đơn vị 3 carbon được chuyển từ ketose phosphate 7 carbon sang aldehyde phosphate 3 carbon, tạo thành một aldose phosphate 4 carbon và một ketose phosphate 6 carbon.'
},
{
id: 'pp8', step: 8, enzyme: 'tkt', substrates: ['xu5p2', 'e4p'], products: ['f6p2', 'g3p2'], ins: [], outs: [], avoid: ['f6p', 'g3p'],
arrows: [{ from: 'e4p', to: 'f6p2' }, { from: 'xu5p2', to: 'g3p2' }], twoWay: true,
type: 'Transfer of two carbons', irreversible: false,
equation: 'Xylulose 5-phosphate + Erythrose 4-phosphate ⇌ Fructose 6-phosphate + Glyceraldehyde 3-phosphate',
hint: 'Một đơn vị 2 carbon lại được chuyển lần nữa, lần này từ ketose phosphate 5 carbon sang aldose phosphate 4 carbon, tạo ra một ketose phosphate 6 carbon và một aldehyde phosphate 3 carbon.'
},
{
id: 'pp9', step: 9, enzyme: 'prpps', substrates: ['r5p'], products: ['prpp'], ins: ['atp'], outs: ['amp'],
arrows: [{ from: 'r5p', to: 'prpp' }], cof: UP_DOWN,
type: 'Pyrophosphoryl transfer (the sugar is activated)', irreversible: true,
equation: 'Ribose 5-phosphate + ATP → PRPP + AMP (Mg²⁺; Pᵢ là chất hoạt hóa, không phải chất phản ứng)',
hint: 'Đường phosphate dạng vòng nhận cặp hai phosphat tận cùng của đồng tiền năng lượng vào carbon 1 của nó, khiến chất cho mất nguyên cụm hai phosphat chứ không phải một. Bước này tạo ra phân tử đường hoạt hóa dùng cho tổng hợp nucleotide.',
hl: { prod: { prpp: ['pp'] } }
}
];
var ppp = {
title: 'Tổng hợp Ribose: PPP và PRPP', subtitle: 'Con đường pentose phosphate và PRPP', tag: 'PPP',
location: 'Tế bào chất', color: '#E7B0B0', big: true, terms: { enz: 'enzyme' },
nodes: pNodes, reactions: pReactions, order: pReactions.map(function (r) { return r.id; }), start: ['g6p'],
regions: [{ type: 'rect', label: 'Con đường pentose phosphate', color: '#F8E0E0', x: 20, y: 20, w: 1800, h: 1430 }],
notes: [
note('Giai đoạn oxy hóa: các bước 1 đến 3 (NADPH và CO₂)', 150, 330, 'start', 18),
note('Giai đoạn không oxy hóa: các bước 4 đến 8 (sự sắp xếp lại)', 150, 362, 'start', 18),
note('tổng hợp nucleotide', 910, 540, 'middle', 18),
note('quay lại quá trình đường phân', 1670, 1130, 'middle', 18)
],
summary: [
'Trong chu trình này, các bước 1 đến 3 (giai đoạn oxy hóa) chuyển hóa glucose 6-phosphate thành ribulose 5-phosphate và tạo ra hai NADPH và một CO₂; các bước 4 đến 8 sắp xếp lại các đường để tế bào có thể tạo ra ribose 5-phosphate hoặc trả lại các nguyên tử carbon cho quá trình đường phân dưới dạng fructose 6-phosphate và glyceraldehyde 3-phosphate.',
'Transketolase chuyển hai nguyên tử carbon và transaldolase chuyển ba nguyên tử carbon; con đường này tạo ra NADPH cho quá trình sinh tổng hợp và ribose 5-phosphate cho nucleotide.',
'Enzyme PRPP synthetase tạo ra PRPP: nó chuyển nhóm pyrophosphate của ATP lên carbon 1 của ribose 5-phosphate, do đó ATP trở thành AMP; nhóm pyrophosphate là nhóm tách ra khi một bazơ được gắn vào.',
'Transketolase, ribose-5-phosphate isomerase và ribulose-5-phosphate epimerase là các enzyme giống như trong giai đoạn tái tạo của chu trình Calvin, nhưng hoạt động theo chiều ngược lại. Transaldolase không phải là một phần của chu trình Calvin, mà chu trình này sử dụng aldolase và sedoheptulose bisphosphatase thay thế.'
],
region: ['nitro', 'carbon', 'gly', 'both', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Con đường pentose phosphate', 'PPP'),
entityNotes: {
g6pdh: 'Enzyme của bước 1 ("glucose-6-phosphate dehydrogenase"): nó oxy hóa carbon 1 của glucose 6-phosphate thành một este vòng và khử NADP⁺ thành NADPH.',
g6p: 'Glucose 6-phosphate, điểm khởi đầu của chu trình pentose phosphate: nguyên tử carbon 1 của nó bị oxy hóa ở bước 1.',
ru5p: 'Ketose photphat năm cacbon được tạo ra bởi 6-phosphogluconate dehydrogenase. Isomerase chuyển nó thành ribose 5-phosphate (bước 4) và epimerase chuyển thành xylulose 5-phosphate (bước 5).',
r5p: 'Aldose phosphate năm carbon là thành phần cấu tạo nên nucleotide. Isomerase tạo ra nó từ ribulose 5-phosphate, transketolase sử dụng nó (bước 6) và PRPP synthetase kích hoạt nó.',
xu5p: 'Ketose photphat năm cacbon mà enzyme epimerase tạo ra từ ribulose 5-phosphate (bước 5). Enzyme transketolase sử dụng nó hai lần: với ribose 5-phosphate (bước 6) và với erythrose 4-phosphate (bước 8).',
s7p: 'Ketose photphat bảy carbon được transketolase tạo ra từ ribose 5-phosphate (bước 6). Transaldolase chuyển ba carbon từ đó sang glyceraldehyde 3-phosphate (bước 7).',
e4p: 'Aldose phosphate bốn carbon được transaldolase tạo ra từ sedoheptulose 7-phosphate (bước 7); sau đó transketolase thêm hai carbon vào đó (bước 8). Nó cũng là tiền chất của các axit amin thơm.',
g3p: 'Đây là anđehit photphat ba cacbon mà transketolase giải phóng từ xylulose 5-phosphat (bước 6 và 8) và được transaldolase sử dụng (bước 7). Nó cũng là một chất trung gian của quá trình đường phân.',
f6p: 'Đường photphat sáu cacbon mà pha không oxy hóa trả lại cho quá trình đường phân (bước 7 và 8).',
tkt: 'Transketolase chuyển một đơn vị hai carbon từ ketose phosphate sang aldose phosphate. Nó cần thiamine pyrophosphate. Đây là cùng một loại enzyme như trong chu trình Calvin.',
rpe: 'Ribulose-5-phosphate 3-epimerase: enzyme này chuyển hóa ribulose 5-phosphate thành xylulose 5-phosphate. Đây là cùng một enzyme như trong chu trình Calvin, nhưng chu trình này diễn ra theo chiều ngược lại.',
rpi: 'Ribose-5-phosphate isomerase: enzyme này chuyển hóa ribulose 5-phosphate thành ribose 5-phosphate. Đây là cùng một loại enzyme như trong chu trình Calvin, nhưng chu trình này diễn ra theo chiều ngược lại.'
}
};
var uNodes = {
prpp: node('prpp', 150, 150), pra: node('pra', 530, 150), gar: node('gar', 910, 150), fgar: node('fgar', 1290, 150), fgam: node('fgam', 1670, 150),
air: node('air', 1670, 440), cair: node('cair', 1290, 440), saicar: node('saicar', 910, 440), aicar: node('aicar', 530, 440), faicar: node('faicar', 150, 440),
imp: node('imp', 150, 730)
};
var uReactions = [
{
id: 'pu1', step: 1, enzyme: 'gprat', substrates: ['prpp'], products: ['pra'], ins: ['glnc', 'h2o'], outs: ['glutc', 'ppi'], avoid: ['hplus'],
arrows: [{ from: 'prpp', to: 'pra' }], cof: UP_DOWN,
type: 'Amidotransfer (the rate-limiting step)', irreversible: true,
equation: 'PRPP + Glutamine + H₂O → Phosphoribosylamine + PPᵢ + Glutamate',
hint: 'Nitơ amide của một amino acid thay thế nhóm hoạt hóa trên carbon 1 của đường — nhóm này được giải phóng dưới dạng cặp phosphat — đồng thời đường chuyển từ dạng α sang dạng β. Đây là bước quyết định của con đường và bị tắt bởi các sản phẩm cuối.',
hl: { sub: { prpp: ['pp'] }, prod: { pra: ['amine'] } }
},
{
id: 'pu2', step: 2, enzyme: 'garsyn', substrates: ['pra'], products: ['gar'], ins: ['atp', 'glyc'], outs: ['adp', 'pi'],
arrows: [{ from: 'pra', to: 'gar' }], cof: UP_DOWN,
type: 'Amide bond formation (spends ATP)', irreversible: false,
equation: 'Phosphoribosylamine + Glycine + ATP → GAR + ADP + Pᵢ',
hint: 'Nhóm carboxyl của một amino acid được đồng tiền năng lượng hoạt hóa rồi nối vào nhóm amin trên đường bằng liên kết amid. Amino acid lúc này gắn trên phân tử đường và sẽ cung cấp bộ khung cho vòng.',
hl: { sub: { pra: ['amine'] }, prod: { gar: ['gly'] } }
},
{
id: 'pu3', step: 3, enzyme: 'gartf', substrates: ['gar'], products: ['fgar'], ins: ['fthf'], outs: ['thf'],
arrows: [{ from: 'gar', to: 'fgar' }], cof: UP_DOWN,
type: 'Transfer of a formyl group', irreversible: false,
equation: 'GAR + N10-Formyl-THF → FGAR + THF + H⁺',
hint: 'Một đơn vị 1 carbon ở mức oxi hóa của acid formic được chuyển từ coenzyme folate sang nhóm amin tự do của đơn vị amino acid. Carbon mới này sẽ trở thành C8 của vòng.',
hl: { prod: { fgar: ['formyl'] } }
},
{
id: 'pu4', step: 4, enzyme: 'fgamsyn', substrates: ['fgar'], products: ['fgam'], ins: ['glnc', 'atp', 'h2o'], outs: ['glutc', 'adp', 'pi'], avoid: ['hplus'],
arrows: [{ from: 'fgar', to: 'fgam' }], cof: UP_DOWN,
type: 'Amidation (spends ATP)', irreversible: false,
equation: 'FGAR + Glutamine + ATP + H₂O → FGAM + Glutamate + ADP + Pᵢ + 2 H⁺',
hint: 'Oxy của nhóm amide được đồng tiền năng lượng hoạt hóa và thay thế bằng một nitơ imine lấy từ nhóm amide của một amino acid, biến amide thành amidine. Nitơ này sẽ trở thành N3 của vòng.',
hl: { sub: { fgar: ['amide'] }, prod: { fgam: ['amidine'] } }
},
{
id: 'pu5', step: 5, enzyme: 'airsyn', substrates: ['fgam'], products: ['air'], ins: ['atp'], outs: ['adp', 'pi'], avoid: ['hplus', 'h2o'],
arrows: [{ from: 'fgam', to: 'air' }], cof: WEST_EAST,
type: 'Ring closure (the imidazole ring)', irreversible: false,
equation: 'FGAM + ATP → AIR + ADP + Pᵢ + H⁺',
hint: 'Đồng tiền năng lượng hoạt hóa oxy của nhóm formyl, oxy này tách ra khi nitơ ở đầu kia của chuỗi tấn công vào carbon formyl, làm khép kín một vòng 5 cạnh: vòng đầu tiên của purine.',
hl: { prod: { air: ['ring'] } }
},
{
id: 'pu6', step: 6, enzyme: 'aircarb', substrates: ['air'], products: ['cair'], ins: ['co2'], outs: [], avoid: ['hco3', 'hplus'],
arrows: [{ from: 'air', to: 'cair' }], cof: UP_DOWN,
type: 'cacboxyl hóa', irreversible: false,
equation: 'KHÔNG KHÍ + CO₂ → CAIR + H⁺',
hint: 'Một đơn vị 1 carbon ở mức oxi hóa cao nhất của carbon được gắn vào carbon 4 của vòng mới dưới dạng nhóm carboxylate. Carbon này sẽ trở thành C6 của purine.',
hl: { prod: { cair: ['coo'] } }
},
{
id: 'pu7', step: 7, enzyme: 'saicarsyn', substrates: ['cair'], products: ['saicar'], ins: ['atp', 'aspc'], outs: ['adp', 'pi'],
arrows: [{ from: 'cair', to: 'saicar' }], cof: UP_DOWN,
type: 'Amide bond formation (spends ATP)', irreversible: false,
equation: 'CAIR + Aspartate + ATP → SAICAR + ADP + Pᵢ',
hint: 'Nhóm carboxylate trên vòng được đồng tiền năng lượng hoạt hóa và nối với nhóm amin của một amino acid dicarboxylic bằng liên kết amid. Nitơ của amino acid đó sẽ trở thành N1 của vòng.',
hl: { sub: { cair: ['coo'] }, prod: { saicar: ['asp'] } }
},
{
id: 'pu8', step: 8, enzyme: 'adsl', substrates: ['saicar'], products: ['aicar'], ins: [], outs: ['fumc'],
arrows: [{ from: 'saicar', to: 'aicar' }], cof: UP_DOWN,
type: 'Elimination (a lyase removes the carbon skeleton)', irreversible: false,
equation: 'SAICAR → AICAR + Fumarate',
hint: 'Bộ khung carbon của amino acid bị cắt rời dưới dạng một acid dicarboxylic 4 carbon có liên kết đôi có thể đi vào chu trình TCA, chỉ để lại nguyên tử nitơ của nó dưới dạng nhóm amide.',
hl: { sub: { saicar: ['asp'] }, prod: { aicar: ['amide'] } }
},
{
id: 'pu9', step: 9, enzyme: 'aicartf', substrates: ['aicar'], products: ['faicar'], ins: ['fthf'], outs: ['thf'],
arrows: [{ from: 'aicar', to: 'faicar' }], cof: UP_DOWN,
type: 'Transfer of a formyl group', irreversible: false,
equation: 'AICAR + N10-Formyl-THF → FAICAR + THF',
hint: 'Đơn vị 1 carbon thứ hai được chuyển từ coenzyme folate lên nhóm amin trên vòng. Carbon này sẽ trở thành C2 của purine.',
hl: { prod: { faicar: ['formyl'] } }
},
{
id: 'pu10', step: 10, enzyme: 'impch', substrates: ['faicar'], products: ['imp'], ins: [], outs: ['h2o'],
arrows: [{ from: 'faicar', to: 'imp' }], cof: WEST_EAST,
type: 'Ring closure (the second ring)', irreversible: false,
equation: 'FAICAR → IMP + H₂O',
hint: 'Carbon formyl bị nitơ amide tấn công kèm tách một phân tử nhỏ, làm khép kín vòng 6 cạnh và hoàn thiện nhân purine.',
hl: { prod: { imp: ['six'] } }
}
];
var purine = {
title: 'Tổng hợp Purin: Từ PRPP đến IMP', subtitle: 'Mười bước từ PRPP đến nucleotide purine đầu tiên', tag: 'PUR',
location: 'Tế bào chất', color: '#A9C8E8', big: true, terms: { enz: 'enzyme' },
nodes: uNodes, reactions: uReactions, order: uReactions.map(function (r) { return r.id; }), start: ['prpp'],
regions: [{ type: 'rect', label: 'Vòng purin được cấu tạo trên phosphat ribose.', color: '#E4EEF8', x: 20, y: 20, w: 1800, h: 870 }],
notes: [
note('N9 từ glutamine', 530, 66, 'middle', 16),
note('C4, C5 và N7 từ glycine', 910, 66, 'middle', 16),
note('C8 từ formyl-THF', 1290, 66, 'middle', 16),
note('N3 từ glutamine', 1670, 66, 'middle', 16),
note('C6 từ CO₂', 1290, 356, 'middle', 16),
note('N1 từ aspartate', 910, 356, 'middle', 16),
note('C2 từ formyl-THF', 150, 356, 'middle', 16)
],
summary: [
'Quá trình chuyển hóa từ ribose 5-phosphate thành IMP: PRPP, sau đó là mười chất trung gian, với vòng được hình thành từng bước trên đường.',
'Các nguyên tử của vòng đến từ các vị trí khác nhau: glycine cung cấp C4, C5 và N7; hai glutamine cung cấp N3 và N9; aspartate cung cấp N1; hai N10-formyl-THF cung cấp C2 và C8; và CO₂ cung cấp C6. Vòng có 9 nguyên tử, 5 nguyên tử carbon và 4 nguyên tử nitơ.',
'Bốn bước tiêu tốn ATP (bước 2, 4, 5 và 7), và glutamine, glycine và aspartate được sử dụng hết. THF được tạo ra từ folate (vitamin B9), và vitamin B12 tái chế nó. Quá trình cacboxyl hóa ở bước 6 sử dụng chính CO₂ trong cơ thể người, không giống như CPS II của quá trình tổng hợp pyrimidine, vốn sử dụng bicarbonate.',
'Bước đầu tiên là bước giới hạn tốc độ và bị ức chế bởi GMP và AMP.'
],
region: ['nitro', 'urea', 'tca', 'both', 'all'], noDistractor: NO_CHIP, stepNames: numbered('Tổng hợp purin', 'PUR'),
entityNotes: {
prpp: 'Đường hoạt hóa khởi đầu quá trình tổng hợp purin: pyrophosphate của nó tách ra khi nitơ amide của glutamine gắn vào carbon 1.',
glutc: 'Sản phẩm mà glutamine tạo thành khi nitơ amide của nó được sử dụng (bước 1 và 4).',
fumc: 'Axit dicarboxylic bốn cacbon được tạo ra khi adenylosuccinate lyase cắt khung aspartate ra khỏi SAICAR (bước 8).'
}
};
var yNodes = {
gln: node('glutamine', 150, 150), cp: node('carbamoylp', 530, 150), casp: node('carbamoylasp', 910, 150), dho: node('dihydroorotate', 1290, 150), oro: node('orotate', 1670, 150),
asp: node('aspartate', 910, 440), prpp: node('prpp', 1290, 440), omp: node('omp', 1670, 440), ump: node('umpmol', 1670, 730)
};
var yReactions = [
{
id: 'py1', step: 1, enzyme: 'cps2', substrates: ['gln'], products: ['cp'], ins: ['hco3', 'atp', 'h2o'], outs: ['glutc', 'adp', 'pi'], avoid: ['hplus'],
arrows: [{ from: 'gln', to: 'cp' }], cof: UP_DOWN,
type: 'Carboxylation and phosphorylation (the rate-limiting step)', irreversible: true,
equation: 'HCO₃⁻ + Glutamine + 2 ATP + H₂O → Carbamoyl phosphate + Glutamate + 2 ADP + Pᵢ',
hint: 'Một carbon vô cơ được hoạt hóa bởi một phân tử đồng tiền năng lượng, nitơ amide của một amino acid tấn công vào nó, và phân tử đồng tiền năng lượng thứ hai phosphoryl hóa sản phẩm. Enzyme bào tương này khác với enzyme của chu trình ure (vốn dùng ammonium tự do).',
hl: { prod: { cp: ['carb'] } }
},
{
id: 'py2', step: 2, enzyme: 'atcase', substrates: ['cp', 'asp'], products: ['casp'], ins: [], outs: ['pi'],
arrows: [{ from: 'cp', to: 'casp' }, { from: 'asp', to: 'casp' }], cof: UP_DOWN,
type: 'Carbamoyl transfer', irreversible: true,
equation: 'Carbamoyl phosphate + Aspartate → Carbamoyl aspartate + Pᵢ',
hint: 'Nhóm carbamoyl được chuyển từ chất mang hoạt hóa sang nhóm amin của một amino acid dicarboxylic, tạo thành nhóm ureido và giải phóng một oxyanion vô cơ nhỏ. Amino acid này sẽ cung cấp bộ khung cho vòng.'
},
{
id: 'py3', step: 3, enzyme: 'dhoase', substrates: ['casp'], products: ['dho'], ins: [], outs: ['h2o'],
arrows: [{ from: 'casp', to: 'dho' }], cof: UP_DOWN,
type: 'Ring closure (a condensation)', irreversible: false,
equation: 'Carbamoyl aspartate → Dihydroorotate + H₂O',
hint: 'Nhóm amin tự do của đơn vị ureido tấn công vào carbon carboxyl ở mạch bên kèm tách một phân tử nhỏ, làm khép kín vòng 6 cạnh. Vòng lúc này vẫn ở trạng thái bão hòa.',
hl: { prod: { dho: ['ring'] } }
},
{
id: 'py4', step: 4, enzyme: 'dhodh', substrates: ['dho'], products: ['oro'], ins: ['q'], outs: ['qh2'],
arrows: [{ from: 'dho', to: 'oro' }], cof: UP_DOWN,
type: 'Oxidation (the ring gets its double bond)', irreversible: true,
equation: 'Dihydroorotate + Coenzyme Q → Orotate + Coenzyme QH₂',
hint: 'Vòng bão hòa bị oxi hóa và hình thành liên kết đôi: bước này tạo ra pyrimidine thực thụ đầu tiên của con đường. Các electron đi tới một chất mang tan trong lipid vốn cũng thuộc chuỗi hô hấp.',
hl: { sub: { dho: ['c56'] }, prod: { oro: ['cc'] } }
},
{
id: 'py5', step: 5, enzyme: 'oprt', substrates: ['oro', 'prpp'], products: ['omp'], ins: [], outs: ['ppi'],
arrows: [{ from: 'oro', to: 'omp' }, { from: 'prpp', to: 'omp' }], cof: WEST_EAST,
type: 'Transfer of the ribose phosphate (N-glycosidic bond)', irreversible: false,
equation: 'Orotate + PRPP → OMP + PPᵢ',
hint: 'Phân tử đường hoạt hóa trao phần ribose phosphate của nó cho một nitơ trong vòng của base và giải phóng cặp phosphat, lần đầu tiên ghép nối một base với một đường trong con đường này.'
},
{
id: 'py6', step: 6, enzyme: 'ompdc', substrates: ['omp'], products: ['ump'], ins: [], outs: ['co2'],
arrows: [{ from: 'omp', to: 'ump' }], cof: WEST_EAST,
type: 'Khử cacbon', irreversible: true,
equation: 'OMP → UMP + CO₂',
hint: 'Nhóm carboxylate trên vòng bị tách ra dưới dạng khí, để lại pyrimidine nucleotide đầu tiên — tiền chất gốc của các pyrimidine nucleotide khác.',
hl: { sub: { omp: ['coo'] }, prod: { ump: ['c6'] } }
}
];
var pyrimidine = {
title: 'Tổng hợp Pyrimidine: đến UMP', subtitle: 'Sáu bước từ carbamoyl phosphate đến UMP', tag: 'PYR',
location: 'Dịch bào (DHODH trong màng trong của ty thể)', color: '#B8D8A8', big: true, terms: { enz: 'enzyme' },
nodes: yNodes, reactions: yReactions, order: yReactions.map(function (r) { return r.id; }), start: ['gln', 'asp', 'prpp'],
regions: [{ type: 'rect', label: 'Vòng pyrimidine được hình thành trước, sau đó đường được thêm vào.', color: '#E9F3E1', x: 20, y: 20, w: 1860, h: 870 }],
notes: [
note('Vòng cacbon: N3 từ glutamine, C2 từ CO₂', 530, 285, 'middle', 16),
note('N1 và C4 đến C6 từ aspartate', 1100, 285, 'middle', 16)
],
summary: [
'Sáu bước tạo nên UMP: carbamoyl phosphate synthetase II (CPS II) tạo ra carbamoyl phosphate từ bicarbonate, glutamine và 2 ATP; ATCase thêm aspartate; dihydroorotase đóng vòng; DHO dehydrogenase tạo ra orotate với coenzyme Q; orotate phosphoribosyltransferase thêm ribose phosphate từ PRPP; OMP decarboxylase tạo ra UMP.',
'Các nguyên tử vòng: N3 từ glutamine (thông qua carbamoyl phosphate), C2 từ CO₂, và N1 cùng C4 đến C6 từ aspartate. CO₂ được CPS II hấp thụ dưới dạng bicarbonate, HCO₃⁻.',
'Quá trình tổng hợp pyrimidine tạo ra vòng trước rồi mới đến đường, trong khi quá trình tổng hợp purine tạo ra vòng trên đường. Enzyme giới hạn tốc độ là CPS II, bị ức chế bởi UTP và được hoạt hóa bởi PRPP.',
'Quá trình đóng vòng tại dihydroorotase giải phóng H₂O. CPS II hoạt động trong bào tương và sử dụng glutamine, trong khi CPS I của chu trình urê hoạt động trong chất nền ty thể và sử dụng NH₄⁺.'
],
region: ['nitro', 'urea', 'tca', 'both', 'all'], noDistractor: NO_CHIP.filter(function (id) { return id !== 'q'; }), stepNames: numbered('Tổng hợp pyrimidine', 'PYR'),
entityNotes: {
cps2: 'Carbamoyl phosphate synthetase II, enzyme của phản ứng đầu tiên: nó tạo ra carbamoyl phosphate từ bicarbonate, nitơ amide của glutamine và hai ATP. Đây là enzyme giới hạn tốc độ của quá trình tổng hợp pyrimidine, bị ức chế bởi UTP và được hoạt hóa bởi PRPP.',
atcase: 'Aspartate transcarbamylase (ATCase): enzyme này thêm aspartate vào carbamoyl phosphate để tạo thành carbamoyl aspartate.',
carbamoylp: 'Chất cho carbamoyl hoạt hóa. Ở đây, nó được tạo ra từ glutamine và bicarbonate bởi CPS II và được sử dụng bởi ATCase; trong chu trình urê, CPS I tạo ra nó từ NH₄⁺ trong ty thể.',
carbamoylasp: 'Carbamoyl aspartate (N-carbamoylaspartate): carbamoyl phosphate liên kết với aspartate. Dihydroorotase đóng vòng của nó.',
aspartate: 'Axit amin cung cấp N1 và các nguyên tử cacbon từ 4 đến 6 của vòng pyrimidine.',
glutamine: 'Axit amin có nitơ amit trở thành N3 của vòng pyrimidine thông qua carbamoyl photphat.',
prpp: 'Đường hoạt hóa cung cấp ribose phosphate cho orotate: pyrophosphate tách ra.'
}
};
var iNodes = {
amp: node('ampmol', 150, 150), adsucc: node('adsucc', 530, 150), imp: node('imp', 910, 150), xmp: node('xmp', 1290, 150), gmp: node('gmp', 1670, 150)
};
var iReactions = [
{
id: 'ia1', step: 1, enzyme: 'adss', substrates: ['imp'], products: ['adsucc'], ins: ['aspc', 'gtp'], outs: ['gdp', 'pi'], exactAnswers: true,
arrows: [{ from: 'imp', to: 'adsucc' }], cof: UP_DOWN,
type: 'Amide bond formation (spends GTP)', irreversible: false,
equation: 'IMP + Aspartate + GTP → Adenylosuccinate + GDP + Pᵢ (Mg²⁺)',
hint: 'Nhóm oxo ở carbon 6 của purine hoàn chỉnh đầu tiên được hoạt hóa bằng đồng tiền năng lượng chứa guanine (không phải loại chứa adenine), và nhóm amin của một amino acid dicarboxylic thay thế vào đó. Toàn bộ amino acid tạm thời vẫn gắn lại.',
hl: { sub: { imp: ['oxo'] }, prod: { adsucc: ['succ'] } }
},
{
id: 'ia2', step: 2, enzyme: 'adsl', substrates: ['adsucc'], products: ['amp'], ins: [], outs: ['fumc'],
arrows: [{ from: 'adsucc', to: 'amp' }], cof: UP_DOWN,
type: 'Elimination (a lyase removes the carbon skeleton)', irreversible: false,
equation: 'Adenylosuccinate → AMP + Fumarate',
hint: 'Enzyme lyase từng hoạt động một lần khi xây vòng lại cắt bộ khung carbon ra dưới dạng một acid 4 carbon có liên kết đôi, chỉ để lại nguyên tử nitơ trên vòng. Từ đây base là adenine.',
hl: { sub: { adsucc: ['succ'] } }
},
{
id: 'ia3', step: 3, enzyme: 'impdh', substrates: ['imp'], products: ['xmp'], ins: ['nad', 'h2o'], outs: ['nadh'], avoid: ['hplus'],
arrows: [{ from: 'imp', to: 'xmp' }], cof: UP_DOWN,
type: 'Oxidation (the committed step of its branch)', irreversible: false,
equation: 'IMP + NAD⁺ + H₂O → XMP + NADH + H⁺',
hint: 'Nhánh còn lại oxi hóa carbon 2 của cùng vòng đó, khiến base có hai nhóm oxo thay vì một. Chất mang dạng oxi hóa của dị hóa thu nhận electron, và sản phẩm cuối của nhánh này ức chế chính bước này.',
hl: { prod: { xmp: ['oxo2'] } }
},
{
id: 'ia4', step: 4, enzyme: 'gmps', substrates: ['xmp'], products: ['gmp'], ins: ['glnc', 'atp', 'h2o'], outs: ['glutc', 'amp', 'ppi'], exactAnswers: true,
arrows: [{ from: 'xmp', to: 'gmp' }], cof: UP_DOWN,
type: 'Amidation (spends ATP to AMP and PPᵢ)', irreversible: false,
equation: 'XMP + Glutamine + ATP + H₂O → GMP + Glutamate + AMP + PPᵢ',
hint: 'Nhóm oxo mới ở carbon 2 được thay bằng một nguyên tử nitơ lấy từ nhóm amide của một amino acid, hoàn thiện base purine thứ hai. Trong bước này, đồng tiền năng lượng mất nguyên cụm hai phosphat nên còn lại ở dạng monophosphate.',
hl: { sub: { xmp: ['oxo2'] }, prod: { gmp: ['amino'] } }
}
];
var impamp = {
title: 'IMP đến AMP và GMP', subtitle: 'Điểm phân nhánh của purin', tag: 'IMP',
location: 'Tế bào chất', color: '#8FB4DC', big: true, terms: { enz: 'enzyme' },
nodes: iNodes, reactions: iReactions, order: iReactions.map(function (r) { return r.id; }), start: ['imp'],
regions: [{ type: 'rect', label: 'Một chiếc nhẫn, hai đế', color: '#E4EEF8', x: 20, y: 20, w: 1800, h: 280 }],
notes: [
note('Aspartate cung cấp nitơ', 150, 430, 'middle', 18),
note('và lá dưới dạng fumarat', 150, 462, 'middle', 18),
note('Glutamine cung cấp nitơ', 1670, 430, 'middle', 18),
note('và ATP chuyển hóa thành AMP', 1670, 462, 'middle', 18)
],
summary: [
'IMP là điểm phân nhánh của quá trình tổng hợp purine: hai bước dẫn đến AMP (adenylosuccinate synthetase, sau đó là adenylosuccinate lyase) và hai bước dẫn đến GMP (IMP dehydrogenase, sau đó là GMP synthetase).',
'Nitơ của adenin đến từ aspartat, khung cacbon của aspartat lại tách ra dưới dạng fumarat, còn nitơ của guanin đến từ amit của glutamin.',
'Mỗi nhánh sử dụng nucleotide của nhánh kia: con đường đến AMP sử dụng GTP (đến GDP và Pᵢ) và con đường đến GMP sử dụng ATP (đến AMP và PPᵢ), vì vậy sự thiếu hụt một purine sẽ ưu tiên tạo ra purine đó.',
'Cả hai sản phẩm đều tác động ngược trở lại vào chu trình: AMP và GMP ức chế bước đầu tiên, và GMP cũng ức chế IMP dehydrogenase. Enzyme của bước cuối cùng đôi khi được gọi bằng tên cũ là transamidinase.'
],
region: ['nitro', 'urea', 'tca', 'both', 'all'], noDistractor: NO_CHIP, stepNames: numbered('IMP đến AMP và GMP', 'IMP'),
entityNotes: {
imp: 'Nucleotide purine hoàn chỉnh đầu tiên và điểm phân nhánh của chu trình: hai bước dẫn đến AMP và hai bước dẫn đến GMP.',
ampmol: 'Nucleotide adenine mà nhánh bên trái tạo ra, với nitơ của aspartate ở vị trí carbon 6 của vòng.',
aspc: 'Axit amin này cung cấp nitơ ở vị trí cacbon số 6 của adenine; khung cacbon của nó lại tách ra dưới dạng fumarat.',
fumc: 'Axit bốn cacbon có liên kết đôi này được tạo ra khi lyase cắt khung aspartate ra khỏi adenylosuccinate. Nó có thể tham gia vào chu trình TCA.',
glnc: 'Axit amin có nitơ amit trở thành nhóm amin tại cacbon số 2 của guanine.',
glutc: 'Glutamine sẽ trở thành gì khi nguyên tử nitơ amide của nó được sử dụng.'
}
};
var bNodes = {
ump: node('umpmol', 150, 150), udp: node('udpmol', 530, 150), utp: node('utpmol', 910, 150), ctp: node('ctpmol', 1290, 150),
dump: node('dump', 150, 730), dtmp: node('dtmp', 530, 730),
mthf: node('mthf', 150, 1020), dhf: node('dhf', 530, 1020), thf: node('thfmol', 910, 1020)
};
var bReactions = [
{
id: 'pb1', step: 1, enzyme: 'umpk', substrates: ['ump'], products: ['udp'], ins: ['atp'], outs: ['adp'], exactAnswers: true,
arrows: [{ from: 'ump', to: 'udp' }], cof: UP_DOWN,
type: 'Phosphoryl transfer', irreversible: false,
equation: 'UMP + ATP → UDP + ADP',
hint: 'Một kinase chuyển nhóm phosphat tận cùng của đồng tiền năng lượng lên pyrimidine nucleotide đầu tiên, giúp nó mang hai phosphat. Đây là mức mà nhánh tạo đường deoxy tách ra, vì enzyme khử loại bỏ nhóm 2′-hydroxyl hoạt động ở mức này.',
hl: { prod: { udp: ['pp'] } }
},
{
id: 'pb2', step: 2, enzyme: 'ndpk', substrates: ['udp'], products: ['utp'], ins: ['atp'], outs: ['adp'], exactAnswers: true,
arrows: [{ from: 'udp', to: 'utp' }], cof: UP_DOWN,
type: 'Phosphoryl transfer', irreversible: false,
equation: 'UDP + ATP → UTP + ADP',
hint: 'Một kinase thứ hai — loại phục vụ mọi nucleoside diphosphate trong tế bào — gắn thêm nhóm phosphat thứ ba. Nucleotide lúc này có thể được lắp vào RNA, đồng thời ở gan và cơ nó còn dùng để hoạt hóa đường tổng hợp glycogen.',
hl: { prod: { utp: ['ppp'] } }
},
{
id: 'pb3', step: 3, enzyme: 'ctps', substrates: ['utp'], products: ['ctp'], ins: ['glnc', 'atp', 'h2o'], outs: ['glutc', 'adp', 'pi'], avoid: ['hplus'],
arrows: [{ from: 'utp', to: 'ctp' }], cof: UP_DOWN,
type: 'Amidation (spends ATP)', irreversible: false,
equation: 'UTP + Glutamine + ATP + H₂O → CTP + Glutamate + ADP + Pᵢ',
hint: 'Nhóm oxo ở carbon 4 của vòng được hoạt hóa (có tiêu tốn năng lượng) rồi thay thế bằng nitơ từ nhóm amide của một amino acid, biến một base pyrimidine thành base pyrimidine kia. Phản ứng xảy ra ở mức triphosphate chứ không phải monophosphate.',
hl: { sub: { utp: ['c4'] }, prod: { ctp: ['amino'] } }
},
{
id: 'pb4', step: 4, enzyme: 'tsase', substrates: ['dump', 'mthf'], products: ['dtmp', 'dhf'], ins: [], outs: [], avoid: ['thf', 'fthf'],
arrows: [{ from: 'dump', to: 'dtmp' }, { from: 'mthf', to: 'dhf' }],
type: 'Methyl transfer (the one route to thymidylate)', irreversible: true,
equation: 'dUMP + N5,N10-Methylene-THF → dTMP + 7,8-Dihydrofolate',
hint: 'Đơn vị 1 carbon nối cầu giữa hai nitơ vòng của coenzyme được chuyển lên carbon 5 của base, đồng thời coenzyme cũng cung cấp hai hydro để biến carbon đó thành nhóm methyl. Kết quả làm coenzyme chuyển sang dạng oxi hóa — điều không phản ứng nào khác trong tế bào làm.',
hl: { sub: { dump: ['c5'], mthf: ['bridge'] }, prod: { dtmp: ['methyl'], dhf: ['cn'] } }
},
{
id: 'pb5', step: 5, enzyme: 'dhfr', substrates: ['dhf'], products: ['thf'], ins: ['nadph'], outs: ['nadp'], avoid: ['hplus', 'nad', 'nadh'],
arrows: [{ from: 'dhf', to: 'thf' }], cof: UP_DOWN,
type: 'Reduction (the coenzyme is restored)', irreversible: false,
equation: '7,8-Dihydrofolate + NADPH + H⁺ → Tetrahydrofolate + NADP⁺',
hint: 'Coenzyme dạng oxi hóa từ bước trước được khử lại nhờ chất mang dạng khử của sinh tổng hợp. Nếu không có bước này, bể chất mang 1 carbon sẽ cạn kiệt chỉ sau một vòng và không thể tổng hợp thêm thymine nucleotide nào nữa.',
hl: { prod: { thf: ['n5'] } }
}
];
var pyrbranch = {
title: 'UMP đến CTP và dTMP', subtitle: 'Các nhánh pyrimidine và chu trình folate', tag: 'PYB',
location: 'Tế bào chất', color: '#9CC98A', big: true, terms: { enz: 'enzyme' },
nodes: bNodes, reactions: bReactions, order: bReactions.map(function (r) { return r.id; }), start: ['ump', 'dump', 'mthf'],
regions: [
{ type: 'rect', label: 'Ribonucleotide cho RNA', color: '#E9F3E1', x: 20, y: 20, w: 1440, h: 280 },
{ type: 'rect', label: 'Thymidylate cho DNA và chu trình folate', color: '#EDEBF6', x: 20, y: 560, w: 1100, h: 640 }
],
notes: [
note('Dãy deoxy phân nhánh tại diphosphate:', 1220, 700),
note('Ribonucleotide reductase tạo ra dUDP, sau đó là dUMP.', 1220, 732),
note('Một nucleotide thymine mang một deoxyribose,', 1220, 1000),
note('không bao giờ là ribose', 1220, 1032)
],
summary: [
'UMP là tiền thân của các nucleotide pyrimidine khác: một kinase tạo ra UDP, một kinase khác tạo ra UTP, và CTP synthetase thay thế nhóm oxo ở carbon 4 của UTP bằng nitơ từ glutamine, tạo ra CTP.',
'Nucleotide thymine được tạo ra trên đường deoxy: thymidylate synthase methyl hóa carbon 5 của dUMP với đơn vị một carbon của N5,N10-methylene-THF, tạo ra dTMP và để lại dihydrofolate; sau đó các kinase tạo ra dTDP và dTTP.',
'Thymidylate synthase là phản ứng duy nhất để lại coenzyme folate ở trạng thái oxy hóa, vì vậy dihydrofolate reductase phải khử nó trở lại bằng NADPH trước khi có thể tạo ra nhóm methyl khác; serine hydroxymethyltransferase gắn một đơn vị carbon mới vào tetrahydrofolate, lấy nó từ serine.',
'Các đường deoxy được tạo ra từ ribonucleotide reductase, enzyme này tác động lên các diphosphate (UDP thành dUDP); dUMP được tạo thành từ dUDP, và từ đó thymidylate synthase tạo ra dTMP.'
],
region: ['nitro', 'urea', 'both', 'all'], noDistractor: NO_CHIP.filter(function (id) { return id !== 'ump' && id !== 'utp' && id !== 'udp'; }),
stepNames: numbered('UMP đến CTP và dTMP', 'PYB'),
entityNotes: {
umpmol: 'Nucleotide pyrimidine đầu tiên và là nguồn gốc của các nucleotide khác: các kinase tạo ra UDP và UTP từ nó, và thông qua chuỗi deoxy, nó cũng dẫn đến nucleotide thymine.',
glnc: 'Axit amin có nitơ amit trở thành nhóm amin tại cacbon số 4 của cytosine.',
glutc: 'Glutamine sẽ trở thành gì khi nguyên tử nitơ amide của nó được sử dụng.'
}
};
P.pathways.ppp = ppp;
P.pathways.purine = purine;
P.pathways.impamp = impamp;
P.pathways.pyrimidine = pyrimidine;
P.pathways.pyrbranch = pyrbranch;
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var SUB2 = '₂';
var G_PHOTO = 'Quang hợp';
var G_AMINO = 'Axit amin';
var G_NUC = 'Pentose và nucleotide';
function molecule(id, name, carbons, facts) {
return { kind: 'molecule', mol: id, carbons: carbons, doubleBonds: 0, name: name, blind: name, facts: facts };
}
function readCarbons(name, n, hints) {
return { text: 'Hãy nhìn vào cấu trúc. Nó có bao nhiêu nguyên tử cacbon? ' + name + ' have?', fields: [{ key: 'carbons', label: 'Cacbon', answer: n }], hints: hints, working: n + ' carbons' };
}
function calvinStages(withRuns, unit) {
var red = {
id: 'red', title: 'Sự khử 3-phosphoglycerate', where: 'Mô đệm', runs: 2, per: 'turn',
each: [{ kind: 'atp', n: 6 }, { kind: 'nadph', n: 6 }],
tallyText: 'Sự khử 3-phosphoglycerate: tính toán lượng ATP và NADPH mà phản ứng tiêu hao. ' + unit + 'Nó chạy 2 lần.',
rule: 'Hãy xem xét giai đoạn 2: 3-phosphoglycerate được phosphoryl hóa rồi khử, vì vậy hãy đếm lượng ATP và NADPH ở giai đoạn đó.',
text: 'Sáu phân tử 3-phosphoglycerate của một vòng được phosphoryl hóa bởi ATP (phosphoglycerate kinase) và khử bởi NADPH (NADP-dependent G3P dehydrogenase) thành sáu phân tử G3P: 6 ATP và 6 NADPH cho mỗi vòng.'
};
if (withRuns) {
red.runsText = 'Chu trình này cố định 3 CO' + SUB2 + ' mỗi lượt. Một phân tử glucose cần bao nhiêu lượt?';
red.runsLabel = 'turns';
red.runsHint = 'Glucose có sáu nguyên tử carbon, và mỗi vòng quay gắn ba phân tử CO2.' + SUB2 + '.';
}
return [
{
id: 'fix', title: 'Cố định cacbon', where: 'Mô đệm', runs: 2, per: '', each: [],
rule: 'RuBisCO bổ sung CO' + SUB2 + ' đến RuBP.',
text: 'RuBisCO bổ sung mỗi CO' + SUB2 + ' chuyển thành RuBP năm carbon và sản phẩm sáu carbon tách thành hai 3-phosphoglycerate. Giai đoạn này không cần ATP hay NADPH.'
},
red,
{
id: 'reg', title: 'Sự tái tạo của RuBP', where: 'Mô đệm', runs: 2, per: 'turn', each: [{ kind: 'atp', n: 3 }],
tallyText: 'Tái tạo RuBP: tính toán lượng ATP mà nó tiêu hao. ' + unit + 'Nó chạy 2 lần.',
rule: 'Hãy xem giai đoạn 3: các phân tử đường phosphate còn lại trong chu trình được sắp xếp lại, và một bước tiêu tốn ATP trên đường quay trở lại RuBP.',
text: 'Năm trong số sáu G3P vẫn ở lại trong chu trình. Các phản ứng sắp xếp lại và phosphoribulokinase biến chúng thành ba RuBP với 3 ATP mỗi vòng.'
}
];
}
P.scenarios.push({
id: 'calvincost', type: 'ledger', group: G_PHOTO, title: 'Chu trình Calvin', subtitle: 'ATP và NADPH cần cho một phân tử glucose', options: [],
drill: false,
explainer: {
id: 'calvin', title: 'Chu trình Calvin', subtitle: 'ATP và NADPH cho một phân tử glucose', noCounting: true,
intro: 'Phản ứng quang hợp tạo ra ATP và NADPH, và chu trình Calvin sử dụng chúng để chuyển hóa CO2 thành CO2.' + SUB2 + ' thành đường. Ví dụ này tính toán chi phí của một phân tử glucose, qua ba giai đoạn.',
readText: 'Glucose là sản phẩm của chu trình. Năm đỉnh của vòng là các nguyên tử carbon (đỉnh thứ sáu là nguyên tử oxy của vòng) và nguyên tử carbon thứ sáu là nhóm CH.' + SUB2 + 'nhóm OH, vậy sáu CO' + SUB2 + ' Đã được sửa chữa.',
countText: 'Chu trình này cố định 3 CO' + SUB2 + ' mỗi lượt, vậy một phân tử glucose cần 6 / 3 = 2 lượt.',
totalText: 'Thêm các giai đoạn, ATP với ATP và NADPH với NADPH. Hai loại chất vận chuyển này không chuyển hóa lẫn nhau.'
},
ledger: function (o) {
return {
mode: 'counts', unit: 'một glucose',
intro: 'Chu trình Calvin tiêu thụ ATP và NADPH, và hai chất này được tính riêng. Hãy tính chúng cho sáu CO₂.' + SUB2 + ' Glucose được tạo thành từ những thành phần đó.',
structure: molecule('glucose', 'Glucose', 6, ['6 nguyên tử cacbon']),
read: readCarbons('glucose', 6, [
'Trong vòng, mỗi góc đều là một nguyên tử carbon ngoại trừ nguyên tử được đánh dấu O, và có thêm một nguyên tử carbon nữa nằm bên ngoài vòng ở vị trí CH.' + SUB2 + 'Nhóm OH.',
'CO' + SUB2 + ' Nguồn cung cấp cố định đó cung cấp mọi nguyên tử carbon cho đường.'
]),
readLines: ['Glucose có 6 nguyên tử carbon, vậy nên có 6 CO₂.' + SUB2 + ' Họ quyết tâm làm điều đó.'],
counts: ['Mỗi vòng quay của chu trình sẽ cố định 3 CO.' + SUB2 + ', vậy 6 CO' + SUB2 + ' Cần 6 ÷ 3 = 2 lượt.'],
stages: calvinStages(true, 'một glucose'),
note: 'Tổng tiêu thụ cho toàn chu trình là 18 ATP và 12 NADPH cho mỗi phân tử glucose; một vòng gồm 3 CO' + SUB2 + ' tiêu tốn 9 ATP và 6 NADPH.'
};
}
});
P.scenarios.push({
id: 'c4cost', type: 'ledger', group: G_PHOTO, title: 'Con đường C4', subtitle: 'Lượng ATP bổ sung cần cho quá trình vận chuyển CO' + SUB2, options: [],
ledger: function (o) {
var calvin = calvinStages(false, 'một phân tử glucose được tạo ra bởi cây C4');
return {
mode: 'counts', unit: 'một phân tử glucose được tạo ra bởi cây C4',
intro: 'Một cây C4 mang mọi CO' + SUB2 + ' đi vào tế bào bao bó trước khi chu trình Calvin sửa chữa nó, và chất vận chuyển phải được tái tạo mỗi lần. Tính toán lượng ATP và NADPH cho một phân tử glucose, bao gồm cả chất vận chuyển.',
structure: molecule('glucose', 'Glucose', 6, ['6 nguyên tử cacbon']),
read: readCarbons('glucose', 6, [
'Trong vòng, mỗi góc đều là một nguyên tử carbon ngoại trừ nguyên tử được đánh dấu O, và có thêm một nguyên tử carbon nữa nằm bên ngoài vòng ở vị trí CH.' + SUB2 + 'Nhóm OH.',
'Mỗi nguyên tử carbon trong phân tử đường đều từng là một nguyên tử CO₂.' + SUB2 + ' mà tế bào mang vào.'
]),
readLines: ['Glucose có 6 nguyên tử carbon, vậy nên có 6 CO₂.' + SUB2 + ' được mang vào và cố định.'],
counts: ['Mỗi CO' + SUB2 + ' Quá trình này chỉ diễn ra một lần, do đó PEP được tái tạo 6 lần; chu trình Calvin sau đó chạy 6 ÷ 3 = 2 vòng.'],
stages: [
{
id: 'pep', title: 'Tái thiết PEP', where: 'Tế bào mô lá', runs: 6, per: 'CO' + SUB2, each: [{ kind: 'atp', n: 2, label: 'lượng ATP tương đương' }],
runsText: 'Mỗi CO' + SUB2 + ' Một phân tử glucose được vận chuyển bởi một PEP. Hỏi tế bào phải tái tạo PEP bao nhiêu lần cho mỗi phân tử glucose?', runsLabel: 'lần',
runsHint: 'Đếm số nguyên tử carbon của glucose: mỗi nguyên tử đều bắt nguồn từ CO₂.' + SUB2 + ' PEP của chính nó đã được mang theo.',
tallyText: 'Tái tạo PEP: tính số lượng ATP tương đương mà nó tiêu hao cho một phân tử glucose như một điểm cộng (tổng số trong trường hợp này là chi phí).',
rule: 'Pyruvate phosphate dikinase chuyển hóa ATP thành AMP và pyrophosphate. Hãy đếm số liên kết năng lượng cao bị tiêu hao mỗi lần phản ứng.',
text: 'Pyruvate phosphate dikinase tái tạo PEP từ pyruvate với ATP → AMP + PPᵢ. Hai liên kết năng lượng cao bị tiêu hao, do đó chi phí là 2 đơn vị ATP tương đương cho mỗi CO₂.' + SUB2 + '.'
},
calvin[1], calvin[2]
],
note: 'Với 2 đương lượng ATP cho mỗi phân tử trong số 6 CO' + SUB2 + ', một phân tử glucose tiêu tốn 30 đương lượng ATP và 12 NADPH ở thực vật C4 loại enzyme NADP-malic. Lượng NADPH do malic enzyme tạo ra trong tế bào bao bó mạch chính là lượng NADPH mà tế bào thịt lá đã dùng cho malate, nên không làm thay đổi tổng số.'
};
}
});
function nitrogenStage() {
return {
id: 'nitrogen', title: 'Loại bỏ nitơ', where: 'Chất nền ty thể và bào tương của gan', runs: 1, per: 'nhóm amin',
each: [{ kind: 'nadh', n: 1 }, { kind: 'atp', n: -2, label: 'lượng ATP tương đương' }],
tallyText: 'Loại bỏ nitơ: tính lượng NADH mà mô hình cung cấp cho một nhóm amino và lượng ATP tương đương cần thiết để thực hiện quá trình này, chi phí được biểu thị dưới dạng số âm.',
rule: 'Glutamate dehydrogenase giải phóng NH₄⁺ và khử một chất mang. Chia sẻ chi phí của chu trình urê giữa các nguyên tử nitơ mà một phân tử urê mang theo.',
text: 'Nhóm amino kết thúc ở glutamat. Glutamate dehydrogenase giải phóng nó dưới dạng NH₄⁺ và tạo ra 1 NADH, và chu trình urê sau đó sử dụng 4 liên kết năng lượng cao cho mỗi urê, mang 2 nguyên tử nitơ: 2 cho mỗi nguyên tử nitơ.'
};
}
var NITROGEN_NOTE = ' Lượng nitơ được xác định bằng một mô hình: mỗi nhóm amino tạo ra 1 NADH từ glutamate dehydrogenase và tiêu tốn 2 đơn vị ATP, vì chu trình urê sử dụng 4 liên kết năng lượng cao trên một phân tử urê mang 2 nguyên tử nitơ. Một phân tử urê lấy một nguyên tử nitơ từ NH₄⁺ và một từ aspartate, và fumarat của nhánh aspartate tạo ra một NADH riêng, vì vậy mô hình này tính toán được 2 NADH cho mỗi phân tử urê. Glutamate dehydrogenase lấy NAD⁺ hoặc NADP⁺: với NADPH thì không có NADH nào để tính, và tổng số giảm đi 2,5 (3 trong cách tính cổ điển). Các sách tính toán nitơ theo những cách khác nhau.';
function oaaStage() {
return {
id: 'oaa', title: 'Oxaloacetate thành pyruvate', where: 'Tế bào chất', runs: 1, per: 'oxaloacetate',
each: [{ kind: 'atp', n: -1, label: 'GTP' }, { kind: 'atp', n: 1, label: 'ATP' }],
tallyText: 'Chuyển hóa oxaloacetate thành pyruvate: tính toán lượng ATP được tạo ra trực tiếp, ròng, cho một phân tử oxaloacetate.',
rule: 'Hai enzyme vận chuyển oxaloacetate đến pyruvate là PEP carboxykinase và pyruvate kinase. Hãy xem mỗi enzyme làm gì với một nucleoside triphosphate, sau đó tính tổng sản phẩm.',
text: 'Trong bào tương, PEP carboxykinase chuyển hóa oxaloacetate thành PEP và CO.' + SUB2 + ' và tiêu tốn 1 GTP, và pyruvate kinase chuyển PEP thành pyruvate và tạo ra 1 ATP. Tổng cộng là 0. Oxaloacetate được tạo ra trong ty thể đi vào tế bào chất dưới dạng malate, quá trình này tiêu tốn một NADH từ chất nền và trả lại cho tế bào chất một NADH, vì vậy quá trình xuất khẩu không tạo ra thêm gì.'
};
}
function aminoLedger(name, mol, carbons, enzymeText, stagesBefore, note) {
return function (o) {
var link = MG.atp.parts.link(1, false);
link.text = 'Pyruvate đi vào ty thể và pyruvate dehydrogenase tạo ra acetyl-CoA, CO₂.' + SUB2 + ' và 1 NADH.';
var tca = MG.atp.parts.tca(1, false);
tca.text = 'Acetyl-CoA tham gia một chu trình TCA: 3 NADH, 1 FADH' + SUB2 + ' và 1 GTP.';
return {
mode: 'atp', unit: 'one ' + name.toLowerCase(),
intro: enzymeText + ' Đếm lượng ATP của khung carbon, sau đó tính toán lượng nitơ bằng mô hình: glutamate dehydrogenase giải phóng từng nhóm amino và khử một chất mang, và chu trình urê sử dụng bốn liên kết năng lượng cao trên mỗi phân tử urê, mang theo hai nguyên tử nitơ.',
structure: molecule(mol, name, carbons, [carbons + ' cacbon', '1 nhóm amino']),
read: readCarbons(name.toLowerCase(), carbons, [
'Một góc hoặc một đầu không có nhãn là một nguyên tử carbon, và mỗi nhóm carboxylate đều có một nguyên tử carbon riêng.',
'Nhóm amino là nguyên tử nitơ; nó không phải là nguyên tử carbon.'
]),
readLines: [name + ' có ' + carbons + ' các nguyên tử carbon và 1 nhóm amino.'],
counts: [enzymeText],
stages: stagesBefore.concat([link, tca, nitrogenStage()]),
note: note + NITROGEN_NOTE
};
};
}
P.scenarios.push({
id: 'alanineox', type: 'ledger', group: G_AMINO, title: 'Oxy hóa hoàn toàn alanine', subtitle: 'Phản ứng chuyển amin, chu trình TCA và chu trình urea', options: [],
drill: 'Một phân tử alanin có giá trị bao nhiêu ATP khi bị oxy hóa hoàn toàn, tính cả lượng nitơ tiêu hao?',
explainer: {
id: 'aminoacid', title: 'Một axit amin', subtitle: 'Alanine, bị oxy hóa hoàn toàn',
intro: 'Một axit amin có hai phần cần lưu ý: khung carbon, được đốt cháy giống như bất kỳ nhiên liệu nào khác, và nhóm amino, mà gan chuyển hóa thành urê. Ví dụ này dựa trên alanin.',
readText: 'Alanine là axit amin có chuỗi bên metyl: nhóm metyl, nguyên tử cacbon alpha mang nhóm amin và nhóm cacboxylat.',
countText: 'Alanine chuyển hóa thành pyruvate, do đó khung xương trải qua phản ứng liên kết và một vòng của chu trình TCA.',
totalText: 'Thêm khung xương và nitơ. Nitơ tiêu tốn 2 đơn vị ATP và tạo ra 1 NADH, vì vậy lượng thu được là nhỏ.'
},
ledger: aminoLedger('Alanine', 'alanine', 3,
'Alanine aminotransferase (ALT) chuyển nhóm amino của alanine sang alpha-ketoglutarate, chất này tách ra khỏi pyruvate và tạo thành glutamate, và không có chất nào được tạo ra hoặc tiêu hao.',
[], 'Alanine chuyển hóa thành pyruvate, có giá trị tương đương với trường hợp pyruvate đã nêu ở trên.')
});
P.scenarios.push({
id: 'aspartateox', type: 'ledger', group: G_AMINO, title: 'Oxy hóa hoàn toàn aspartate', subtitle: 'Thông qua oxaloacetate và pyruvate', options: [],
drill: 'Một phân tử aspartate có giá trị bao nhiêu ATP khi bị oxy hóa hoàn toàn, tính cả lượng nitơ tiêu hao?',
ledger: aminoLedger('Aspartate', 'aspartate', 4,
'Aspartate aminotransferase (AST) chuyển nhóm amino của aspartate sang alpha-ketoglutarate, chất này tách ra khỏi oxaloacetate và tạo thành glutamate, và không có chất nào được tạo ra hoặc tiêu hao.',
[oaaStage()], 'Aspartate chuyển hóa thành oxaloacetate, chất này sau đó được chuyển hóa thành pyruvate trong bào tương.')
});
P.scenarios.push({
id: 'glutamateox', type: 'ledger', group: G_AMINO, title: 'Oxy hóa hoàn toàn glutamate', subtitle: 'Thông qua alpha-ketoglutarate', options: [],
drill: 'Một phân tử glutamate có giá trị bao nhiêu ATP khi bị oxy hóa hoàn toàn, tính cả chi phí của nitơ?',
ledger: aminoLedger('Glutamate', 'glutamate', 5,
'Glutamate dehydrogenase giải phóng nhóm amino của glutamate dưới dạng NH₄⁺ và tạo ra alpha-ketoglutarate; NADH của bước này được tính cùng với nitơ.',
[{
id: 'akg', title: 'Alpha-ketoglutarate thành oxaloacetate', where: 'Chất nền ty thể', runs: 1, per: 'alpha-ketoglutarate',
each: [{ kind: 'nadh', n: 2 }, { kind: 'fadh2', n: 1 }, { kind: 'atp', n: 1, label: 'GTP' }],
tallyText: 'Từ alpha-ketoglutarate đến oxaloacetate: đếm số sản phẩm tạo ra trong các bước của chu trình TCA từ alpha-ketoglutarate đến oxaloacetate.',
rule: 'Đếm số bước khử NAD+, bước khử FAD và bước tạo ra nucleoside triphosphate, từ alpha-ketoglutarate thành oxaloacetate.',
text: 'Từ alpha-ketoglutarate, chu trình diễn ra thông qua alpha-ketoglutarate dehydrogenase (1 NADH), succinyl-CoA synthetase (1 GTP), succinate dehydrogenase (1 FADH' + SUB2 + ') và malate dehydrogenase (1 NADH) thành oxaloacetate.'
}, oaaStage()], 'Glutamate chuyển hóa thành alpha-ketoglutarate, chất này được vận chuyển trong chu trình TCA để tạo thành oxaloacetate và sau đó là pyruvate.')
});
P.scenarios.push({
id: 'ureacost', type: 'ledger', group: G_AMINO, title: 'Một phân tử urea', subtitle: 'Năng lượng tiêu hao trong chu trình urea', options: [],
ledger: function (o) {
return {
mode: 'atp', unit: 'một urê',
intro: 'Chu trình urê tiêu thụ ATP hai lần, ở hai bước khác nhau. Hãy đếm số liên kết năng lượng cao cho một phân tử urê.',
structure: molecule('urea', 'Urê', 1, ['1 cacbon', '2 nguyên tử nitơ']),
read: { text: 'Hãy nhìn vào cấu trúc. Urê có bao nhiêu nguyên tử nitơ?', fields: [{ key: 'nitrogens', label: 'Nitơ', answer: 2 }], hints: [
'Mỗi nguyên tử nitơ được ký hiệu là N và mang theo các nguyên tử hydro của nó.',
'Cacbon và oxy không phải là nitơ: chỉ đếm các nhãn N.'
], working: '2 nguyên tử nitơ' },
readLines: ['Urê có 1 nguyên tử cacbon và 2 nguyên tử nitơ.'],
counts: ['Các nguyên tử nitơ đến từ NH₄⁺ (thông qua carbamoyl phosphate) và từ aspartate (thông qua argininosuccinate).'],
stages: [
{
id: 'cps', title: 'Carbamoyl phosphate (CPS I)', where: 'Chất nền ty thể', runs: 1, per: 'urea', each: [{ kind: 'atp', n: -2, label: 'ATP' }],
tallyText: 'Carbamoyl phosphate: tính lượng ATP tiêu hao trong bước này cho một phân tử urê là số âm.',
rule: 'Hãy nhìn vào mũi tên của CPS I và đếm số lượng ATP và ADP mà nó chỉ ra.',
text: 'CPS I tạo ra carbamoyl phosphate từ NH₄⁺ và bicarbonate và tiêu tốn 2 ATP.'
},
{
id: 'ass', title: 'Argininosuccinate (ASS)', where: 'Tế bào chất', runs: 1, per: 'urea', each: [{ kind: 'atp', n: -2, label: 'lượng ATP tương đương' }],
tallyText: 'Argininosuccinate: tính số ATP tương đương mà bước này tiêu tốn cho một urê là số âm.',
rule: ' ATP được phân tách thành AMP và pyrophosphate: hãy đếm số liên kết năng lượng cao mà quá trình này tiêu tốn.',
text: 'Argininosuccinate synthetase phân tách 1 ATP thành AMP và PPᵢ, sử dụng 2 liên kết năng lượng cao.'
}
],
totalText: 'Thêm các giai đoạn: Cân bằng ATP của một phân tử urê là bao nhiêu? Nhập chi phí dưới dạng số âm.',
note: 'Bốn liên kết phosphat giàu năng lượng bị tiêu tốn cho mỗi phân tử ure. Sách thường ghi 3 ATP vì tổng cộng có ba phân tử ATP bị phân cắt, trong đó một phân tử chuyển thành AMP và PPᵢ làm tiêu tốn hai liên kết. Fumarate do argininosuccinate lyase giải phóng có thể tạo 1 NADH (qua fumarase và malate dehydrogenase ở bào tương); phần này không tính ở đây và các kịch bản amino acid hạch toán nó trong mô hình nitơ của chúng.'
};
}
});
P.scenarios.push({
id: 'pentoseox', type: 'ledger', group: G_NUC, title: 'Oxy hóa hoàn toàn ba phân tử pentose', subtitle: 'Từ con đường pentose phosphate đi vào đường phân', options: ['shuttle'],
drill: 'Ba phân tử pentose phosphate này có giá trị bao nhiêu ATP khi chúng được oxy hóa hoàn toàn?',
explainer: {
id: 'pentose', title: 'Một đường pentose', subtitle: 'Ba đường pentose, bị oxy hóa hoàn toàn',
intro: 'Giai đoạn không oxy hóa của chu trình pentose phosphate chuyển hóa ba pentose phosphate thành hai fructose 6-phosphate và một glyceraldehyde 3-phosphate, sau đó được sử dụng trong quá trình đường phân và chu trình TCA. Số liệu được tính toán dựa trên các bước này.',
readText: 'Hãy nhìn vào hình vẽ của một pentose phosphate: năm nguyên tử carbon và một nhóm phosphate.',
countText: 'Ba đường pentose có 15 nguyên tử carbon: 2 fructose 6-phosphate (12 carbon) và 1 glyceraldehyde 3-phosphate (3 carbon). Hai đường hexose tạo ra 4 triose phosphate, vậy tổng cộng có 5 triose phosphate.',
totalText: 'Cộng các giai đoạn lại. Quá trình sắp xếp lại tốn chi phí và không tạo ra gì, vì vậy tổng số là lượng ATP mà quá trình đường phân, phản ứng liên kết và chu trình TCA tạo ra, trừ đi lượng ATP của phosphofructokinase.'
},
ledger: function (o) {
var link = MG.atp.parts.link(5, false);
link.text = 'Mỗi một trong 5 phân tử pyruvate đi vào ty thể và tạo ra acetyl-CoA, CO₂.' + SUB2 + ' và 1 NADH.';
var tca = MG.atp.parts.tca(5, false);
tca.text = 'Mỗi phân tử acetyl-CoA trong số 5 phân tử tham gia một chu trình TCA: 3 NADH, 1 FADH' + SUB2 + ' và 1 GTP.';
return {
mode: 'atp', unit: 'ba pentose phosphat',
intro: 'Ba phân tử pentose phosphate được sắp xếp lại thành hexose và triose phosphate, và chúng được đốt cháy giống như các loại đường trong quá trình đường phân. Hãy đếm bằng phương pháp vận chuyển mà bạn chọn.',
structure: molecule('r5p', 'Ribose 5-phosphate', 5, ['5 nguyên tử cacbon', '1 nhóm phosphat']),
read: readCarbons('đường pentose này', 5, [
'Trong vòng, mỗi góc đều là một nguyên tử carbon ngoại trừ nguyên tử được đánh dấu O, và có thêm một nguyên tử carbon nữa nằm bên ngoài vòng ở vị trí CH.' + SUB2 + 'Nhóm O mang nhóm phosphate.',
'Nhóm photphat không có nguyên tử carbon, vì vậy chỉ tính phần đường.'
]),
readLines: ['Ribose 5-phosphate có 5 nguyên tử carbon và 1 nhóm phosphate; các pentose phosphate khác (ribulose và xylulose 5-phosphate) cũng có 5 nguyên tử carbon.'],
counts: [
'Ba đường pentose có 15 nguyên tử carbon. Transketolase và transaldolase chuyển chúng thành 2 fructose 6-phosphate (12 nguyên tử carbon) và 1 glyceraldehyde 3-phosphate (3 nguyên tử carbon).',
'Mỗi fructose 6-phosphate tạo ra 2 triose phosphate, vì vậy có 2 × 2 + 1 = 5 triose phosphate, 5 pyruvate và 5 acetyl-CoA.'
],
stages: [
{
id: 'resh', title: 'Sắp xếp lại các pentose', where: 'Tế bào chất', runs: 1, per: '', each: [],
rule: 'Transketolase và transaldolase chuyển các nguyên tử carbon từ đường này sang đường khác.',
text: 'Các enzyme isomerase, epimerase, transketolase và transaldolase sắp xếp lại 3 phân tử pentose thành 2 phân tử fructose 6-phosphate và 1 phân tử glyceraldehyde 3-phosphate. Chúng không tạo ra và không tiêu thụ ATP cũng như không cần chất vận chuyển.'
},
{
id: 'pfk', title: 'Fructose 6-phosphate thành hai triose phosphate', where: 'Tế bào chất', runs: 2, per: 'fructose 6-phosphate', each: [{ kind: 'atp', n: -1 }],
runsText: 'Ba đường pentose được chuyển hóa thành bao nhiêu phân tử fructose 6-phosphate?', runsLabel: 'fructose 6-phosphate',
runsHint: 'Mười lăm nguyên tử cacbon tạo thành đường sáu cacbon và một đường ba cacbon; hãy đếm số đường sáu cacbon đó.',
tallyText: 'Chuyển hóa fructose 6-phosphate thành hai triose phosphate: tính lượng ATP mà phosphofructokinase tiêu thụ là số âm.',
rule: 'Phosphofructokinase gắn thêm một nhóm phosphate thứ hai vào mỗi phân tử fructose 6-phosphate bằng ATP.',
text: 'Mỗi phân tử fructose 6-phosphate được phosphoryl hóa bởi phosphofructokinase (1 ATP) và bị phân cắt bởi aldolase thành 2 triose phosphate.'
},
{
id: 'trio', title: 'Triose phosphate thành pyruvate', where: 'Tế bào chất', runs: 5, per: 'triose phosphate', each: [{ kind: 'atp', n: 2, label: 'ATP' }, { kind: 'nadhc', n: 1 }],
runsText: 'Tổng cộng có bao nhiêu phân tử triose phosphate?', runsLabel: 'triose phosphat',
runsHint: 'Mỗi phân tử fructose 6-phosphate tạo ra hai phân tử triose phosphate, và phân tử glyceraldehyde 3-phosphate được tạo thành trong quá trình này sẽ tạo ra thêm một phân tử triose phosphate nữa.',
rule: 'Glyceraldehyde 3-phosphate dehydrogenase tạo ra NADH trong bào tương, và hai kinase tạo ra ATP. NADH đó cần một chất vận chuyển.',
text: 'Mỗi triose phosphate cung cấp 2 ATP (phosphoglycerate kinase và pyruvate kinase) và 1 NADH trong tế bào chất, sau đó được vận chuyển vào ty thể.'
},
link, tca
],
note: function (total) {
return 'Được suy ra từ các bước và số lượng của quá trình đường phân và chu trình TCA: khoảng ' + MG.atp.format(Math.round(total / 3 * 10) / 10) + ' Mỗi phân tử pentose được tạo ra bằng cách đếm và vận chuyển như vậy. Nhánh oxy hóa của con đường pentose phosphate tạo ra NADPH, chứ không phải ATP.';
}
};
}
});
P.scenarios.push({
id: 'purinecost', type: 'ledger', group: G_NUC, title: 'Một phân tử IMP', subtitle: 'Năng lượng cần để tổng hợp một nucleotide purine', options: [],
ledger: function (o) {
return {
mode: 'atp', unit: 'một IMP được tạo thành từ ribose 5-phosphate',
intro: 'Quá trình xây dựng IMP tiêu tốn ATP ở hai vị trí: để hoạt hóa đường và ở một số trong mười bước của vòng. Hãy tính số lượng ATP tương đương. Các axit amin, CO₂ và N10-formyl-THF được coi là đã cho.',
structure: molecule('imp', 'Inosine monophosphate', 9, ['9 nguyên tử trong hai vòng', '5 nguyên tử cacbon và 4 nguyên tử nitơ']),
read: { text: 'Hãy nhìn vào cấu trúc. Có bao nhiêu nguyên tử cacbon và bao nhiêu nguyên tử nitơ trong vòng purin (hai vòng nối liền nhau, không bao gồm đường)?', fields: [
{ key: 'carbons', label: 'Các nguyên tử cacbon trong vòng', answer: 5 }, { key: 'nitrogens', label: 'Các nguyên tử nitơ trong vòng', answer: 4 }
], hints: [
'Chiếc vòng này là một vòng sáu cạnh được gắn kết với một vòng năm cạnh, tổng cộng có chín nguyên tử.',
'Các nguyên tử nitơ được ký hiệu là N; các góc không có ký hiệu là các nguyên tử carbon.'
], working: '5 nguyên tử cacbon và 4 nguyên tử nitơ' },
readLines: ['Vòng purin của IMP có 9 nguyên tử: 5 nguyên tử cacbon và 4 nguyên tử nitơ.'],
counts: ['PRPP được tạo ra đầu tiên từ ribose 5-phosphate; mười bước từ PRPP đến IMP sau đó sẽ tạo thành vòng trên đường.'],
stages: [
{
id: 'prpp', title: 'Kích hoạt đường (PRPP synthetase)', where: 'Tế bào chất', runs: 1, per: 'PRPP', each: [{ kind: 'atp', n: -2, label: 'lượng ATP tương đương' }],
tallyText: 'Kích hoạt đường: tính số lượng ATP tương đương mà PRPP synthetase tiêu thụ, coi đó là số âm.',
rule: ' ATP chuyển hóa thành AMP: hãy đếm số liên kết năng lượng cao mà quá trình này tiêu hao.',
text: 'Enzyme PRPP synthetase chuyển nhóm pyrophosphate của ATP lên ribose 5-phosphate, do đó ATP trở thành AMP: 2 liên kết năng lượng cao.'
},
{
id: 'ring', title: 'Xây dựng vòng tròn trên PRPP', where: 'Tế bào chất', runs: 4, per: 'Bước tiêu thụ ATP', each: [{ kind: 'atp', n: -1 }],
runsText: 'Trong mười bước từ PRPP đến IMP, có bao nhiêu bước tiêu tốn một ATP?', runsLabel: 'các bước',
runsHint: 'Hãy tìm ATP, ADP và Pᵢ bên cạnh các mũi tên. Không phải mọi bước cần ATP đều hiển thị nó ở đó.',
tallyText: 'Xây dựng vòng: tính tổng lượng ATP tiêu hao trong tất cả các bước này là số âm.',
rule: 'Mỗi bước trong quy trình này tiêu tốn một ATP (ADP và Pᵢ được giải phóng).',
text: 'Bốn trong mười bước tiêu tốn 1 ATP: GAR synthetase (bước 2), FGAM synthetase (bước 4), AIR synthetase và SAICAR synthetase (bước 7). Số thứ tự các bước tính từ PRPP đến phosphoribosylamine là bước 1, và tên enzyme là tên tiêu chuẩn.'
}
],
totalText: 'Cộng các giai đoạn lại: Cân bằng ATP của một IMP là bao nhiêu? Nhập chi phí dưới dạng số âm.',
note: 'ATP bị tiêu tốn ở ba bước 2, 4 và 7 (tính từ PRPP thành phosphoribosylamine là bước 1). Bước đóng vòng ở bước 5 cũng cần ATP. Các amino acid, CO₂ và N10-formyl-THF được xem là có sẵn nên chi phí của chúng không được tính. Chuyển IMP thành AMP tốn một GTP và thành GMP tốn một ATP chuyển thành AMP.'
};
}
});
P.scenarios.push({
id: 'pyrimidinecost', type: 'ledger', group: G_NUC, title: 'Một phân tử UMP', subtitle: 'Năng lượng cần để tổng hợp một nucleotide pyrimidine', options: [],
ledger: function (o) {
return {
mode: 'atp', unit: 'một UMP được cấu tạo từ bicarbonate, glutamine, aspartate và ribose 5-phosphate',
intro: 'Quá trình tổng hợp UMP tiêu tốn ATP ở hai vị trí: tại enzyme carbamoyl phosphate synthetase II và để hoạt hóa đường. Hãy đếm số lượng ATP tương đương.',
structure: molecule('umpmol', 'Uridine monophosphate', 6, ['6 nguyên tử trong vòng', '4 nguyên tử cacbon và 2 nguyên tử nitơ']),
read: { text: 'Hãy nhìn vào cấu trúc. Có bao nhiêu nguyên tử cacbon và bao nhiêu nguyên tử nitơ trong vòng pyrimidine (vòng đơn, không bao gồm đường)?', fields: [
{ key: 'carbons', label: 'Các nguyên tử cacbon trong vòng', answer: 4 }, { key: 'nitrogens', label: 'Các nguyên tử nitơ trong vòng', answer: 2 }
], hints: [
'Chiếc nhẫn là một chiếc nhẫn đơn có sáu cạnh.',
'Các nguyên tử nitơ được ký hiệu là N hoặc NH; các góc không có ký hiệu là các nguyên tử carbon.'
], working: '4 nguyên tử cacbon và 2 nguyên tử nitơ' },
readLines: ['Vòng pyrimidine của UMP có 6 nguyên tử: 4 nguyên tử carbon và 2 nguyên tử nitơ.'],
counts: ['Vòng được hình thành trước tiên từ carbamoyl phosphate và aspartate, sau đó đường được thêm vào từ PRPP.'],
stages: [
{
id: 'cps2', title: 'Carbamoyl phosphate (CPS II)', where: 'Tế bào chất', runs: 1, per: 'carbamoyl phosphate', each: [{ kind: 'atp', n: -2, label: 'ATP' }],
tallyText: 'Carbamoyl phosphate: tính lượng ATP mà CPS II tiêu thụ là số âm.',
rule: 'Hãy nhìn vào mũi tên của CPS II và đếm số lượng ATP và ADP mà nó hiển thị.',
text: 'CPS II tạo ra carbamoyl phosphate từ bicarbonate, nitơ amide của glutamine và 2 ATP.'
},
{
id: 'prpp', title: 'Kích hoạt đường (PRPP synthetase)', where: 'Tế bào chất', runs: 1, per: 'PRPP', each: [{ kind: 'atp', n: -2, label: 'lượng ATP tương đương' }],
tallyText: 'Kích hoạt đường: tính số lượng ATP tương đương mà PRPP synthetase tiêu thụ, coi đó là số âm.',
rule: ' ATP chuyển hóa thành AMP: hãy đếm số liên kết năng lượng cao mà quá trình này tiêu hao.',
text: 'PRPP synthetase chuyển nhóm pyrophosphate của ATP lên ribose 5-phosphate, do đó ATP trở thành AMP: 2 liên kết năng lượng cao. Sau đó, orotate phosphoribosyltransferase sử dụng PRPP.'
}
],
totalText: 'Cộng các giai đoạn lại: Cân bằng ATP của một UMP là bao nhiêu? Nhập chi phí dưới dạng số âm.',
note: 'Các bước khác (ATCase, dihydroorotase, DHO dehydrogenase, orotate phosphoribosyltransferase và OMP decarboxylase) không tiêu tốn ATP. DHO dehydrogenase có truyền electron sang coenzyme Q, tương đương khoảng 1,5 ATP trong chuỗi hô hấp theo giá trị hiện đại; phần này không được tính ở đây. Chuyển UMP thành UTP và CTP sẽ tiêu tốn thêm ATP.'
};
}
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
P.groups.push({ into: 'carbs', pathways: ['ppp', 'cori'] });
P.groups.push({ into: 'aminoacids', pathways: ['transam', 'cahill'] });
P.groups.push({
id: 'photosynthesis', title: 'Quang hợp', color: '#86C79A',
pathways: ['zscheme', 'thylakoid', 'cyclic', 'lightsugar', 'calvinsimple', 'calvin', 'c4']
});
P.groups.push({
id: 'signaling', title: 'Truyền tín hiệu tế bào', color: '#E3A7C9',
pathways: ['gpcr', 'gsgi', 'camp', 'badrenergic', 'glucagon', 'badroff', 'plc', 'rtk', 'insulin', 'egfr', 'ras', 'steroid']
});
P.groups.push({
id: 'nucleotides', title: 'Nucleotide', color: '#8BC5D8',
pathways: ['purine', 'impamp', 'pyrimidine', 'pyrbranch']
});
P.courses.advanced = {
id: 'advanced', title: 'Trình độ cao', color: '#C9A0DC', everythingPick: true,
subtitle: 'Quang hợp, truyền tín hiệu tế bào và chuyển hóa nitơ',
sections: ['zscheme', 'thylakoid', 'cyclic', 'lightsugar', 'calvinsimple', 'calvin', 'c4', 'gpcr', 'gsgi', 'camp', 'badrenergic', 'glucagon', 'badroff', 'plc', 'rtk', 'insulin', 'egfr', 'ras', 'steroid',
'cori', 'transam', 'cahill', 'gluala', 'urea', 'ppp', 'purine', 'impamp', 'pyrimidine', 'pyrbranch']
};
})(typeof window !== 'undefined' ? window : globalThis);
