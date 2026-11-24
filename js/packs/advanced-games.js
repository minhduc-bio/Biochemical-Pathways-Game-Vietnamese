(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
function E() { return MG.gameEngine; }
var GROUP = 'Truyền tín hiệu tế bào';
function mol(id) { return MG.entities.molecule[id]; }
function enz(id) { return MG.entities.enzyme[id]; }
function drawn(id) { return !!(MG.geometry && MG.geometry[id] && mol(id)); }
function pickN(correct, lookalikes, pool, n, rand) {
var chosen = [correct];
lookalikes.forEach(function (id) { if (chosen.indexOf(id) < 0 && chosen.length < n) { chosen.push(id); } });
E().shuffle(pool, rand).forEach(function (id) { if (chosen.indexOf(id) < 0 && chosen.length < n) { chosen.push(id); } });
return chosen;
}
var DRAWN = ['camp', 'cgmp', 'ampmol', 'ip3', 'pip2', 'dag', 'epinephrine'];
var LOOK = {
camp: ['ampmol', 'cgmp'], cgmp: ['camp', 'ampmol'], ampmol: ['camp', 'cgmp'], ip3: ['pip2'], pip2: ['ip3', 'dag'], dag: ['pip2'], epinephrine: []
};
var FACE = {
camp: {
hints: ['Hãy nhìn vào cấu trúc cơ bản: một purin với nhóm amino, cùng loại cơ bản như trong ATP.', 'Hãy nhìn vào nhóm phosphate: nó liên kết với đường hai lần, do đó tạo thành một vòng khép kín.'],
explain: 'Cyclic AMP: adenine, ribose và một nhóm phosphate khép kín thành vòng giữa oxy ở vị trí 3′ và 5′. AMP có cùng gốc và đường, nhưng nhóm phosphate của nó không được gắn kết.'
},
cgmp: {
hints: ['Hãy nhìn vào cấu trúc cơ bản: một purin với nhóm C=O trong vòng sáu cạnh, điều mà adenin trong các hình vẽ khác không có.', 'Hãy nhìn vào nhóm phosphate: nó liên kết với đường hai lần, do đó tạo thành một vòng khép kín.'],
explain: 'GMP vòng: cùng loại phosphate như cAMP, nhưng gắn trên guanosine.'
},
ampmol: {
hints: ['Hãy nhìn vào cấu trúc cơ bản: một purin với một nhóm amino.', 'Hãy nhìn vào nhóm phosphate: chỉ có một nhóm duy nhất, và nó không tạo thành vòng khép kín.'],
explain: 'AMP: adenosine với một nhóm phosphate trên carbon 5′. Đây là sản phẩm mà phosphodiesterase tạo ra khi mở vòng cAMP, và nó không phải là chất truyền tin.'
},
ip3: {
hints: ['Hãy tìm một vòng gồm sáu nguyên tử carbon, mỗi nguyên tử có một nguyên tử oxy, và không có nguyên tử nitơ nào.', 'Trên vòng chỉ có các nguyên tử oxy và phosphat bám vào: không có glycerol và không có chuỗi R.'],
explain: 'Inositol 1,4,5-trisphosphate: một vòng inositol với các nhóm phosphate trên các nguyên tử carbon 1, 4 và 5. Đây là phần đầu hòa tan trong nước của PIP2, được giải phóng bởi phospholipase C.'
},
pip2: {
hints: ['Hãy tìm một vòng có các nhóm phosphat được nối với một nhóm phosphat khác thông qua một nhóm phosphat nữa với một phân tử glycerol.', 'Glycerol mang hai chuỗi acyl dài (được vẽ ở đây là R).'],
explain: 'PIP2: một vòng inositol với các nhóm phosphate trên carbon 4 và 5, được nối với diacylglycerol thông qua liên kết phosphodiester. Nó là tiền chất mà phospholipase C cắt, chứ không phải là một chất truyền tin.'
},
dag: {
hints: ['Phân tử này không có vòng và hoàn toàn không có phốt pho.', 'Cấu trúc xương sống ba nguyên tử carbon mang hai nhóm este và một nhóm hydroxyl tự do.'],
explain: 'Diacylglycerol: một loại glycerol có hai chuỗi axit béo (được ký hiệu là R) và một nhóm hydroxyl tự do. Nó là phần không phân cực của PIP2 và nằm trong màng tế bào.'
},
epinephrine: {
hints: ['Hãy tìm một vòng benzen có hai nhóm hydroxyl nằm cạnh nhau.', 'Một chuỗi ngắn gồm nhóm amin bậc hai và nhóm hydroxyl gắn vào vòng.'],
explain: 'Epinephrine: một vòng catechol với chuỗi bên amino alcohol, được tạo thành từ tyrosine. Nó liên kết với thụ thể beta-adrenergic.'
}
};
function structuresBuild(opts) {
var rand = E().rng((opts.seed || 1) + 11);
var ids = DRAWN.filter(drawn);
var prompts = [];
var order = E().shuffle(['camp', 'cgmp', 'ip3', 'pip2', 'dag', 'ampmol', 'epinephrine'].filter(drawn), rand);
order.forEach(function (id) {
var face = FACE[id];
var opts5 = pickN(id, LOOK[id].filter(drawn), ids, 5, rand);
prompts.push({
id: 'ms.' + id, kind: 'pick', group: 'Cấu trúc', text: 'Đây là phân tử gì?', figure: { mol: id },
options: opts5.map(function (o) { return { id: o, label: mol(o).name }; }), answer: id, optionStyle: 'text',
hints: face.hints.slice(), explain: face.explain
});
var opts4 = pickN(id, LOOK[id].filter(drawn), ids, 4, rand);
prompts.push({
id: 'md.' + id, kind: 'pick', group: 'Bản vẽ', text: 'Bức vẽ nào là ' + mol(id).name + '?', figure: null,
options: opts4.map(function (o) { return { id: o, label: mol(o).name, mol: o }; }), answer: id, optionStyle: 'figure', leakCheck: false,
hints: face.hints.slice(), explain: face.explain
});
});
return { intro: 'Đặt tên cho mỗi hình vẽ, sau đó chọn hình vẽ của một phân tử đã được đặt tên.', prompts: prompts };
}
var FACTS = [
{
id: 'f.makecamp', text: 'Enzyme nào tạo ra cAMP từ ATP?', answer: 'adcyc', pool: ['plcp', 'pde', 'pka', 'pkc', 'camk'],
hints: ['Phản ứng này khép kín nhóm phosphate của ATP thành một vòng và giải phóng hai nhóm phosphate còn lại thành từng cặp.', 'Protein G kích hoạt enzyme màng này.'],
explain: 'Adenylate cyclase chuyển hóa ATP thành cAMP và pyrophosphate. Gs alpha-GTP kích hoạt enzyme này.'
},
{
id: 'f.breakcamp', text: 'Enzyme nào chuyển hóa cAMP thành AMP và do đó kết thúc tín hiệu?', answer: 'pde', pool: ['adcyc', 'plcp', 'pka', 'pkc', 'camk'],
hints: ['Nó mở vòng bảo vệ của sứ giả bằng phản ứng thủy phân.', 'Caffeine ức chế quá trình này trong ống nghiệm.'],
explain: 'Enzyme cAMP phosphodiesterase thủy phân vòng adenosine thành 5′ AMP. Ở liều lượng tương đương một tách cà phê, caffeine chủ yếu hoạt động bằng cách ngăn chặn các thụ thể adenosine.'
},
{
id: 'f.campkinase', text: 'Bốn phân tử cAMP kích hoạt loại enzyme nào?', answer: 'pka', pool: ['pkc', 'camk', 'adcyc', 'pde', 'plcp'],
hints: ['Bốn trong số chúng liên kết với hai tiểu đơn vị điều hòa của một enzyme không hoạt động.', 'Các tiểu đơn vị xúc tác được giải phóng sẽ gắn nhóm phosphate vào các gốc serine và threonine.'],
explain: 'cAMP liên kết với các tiểu đơn vị điều hòa của PKA (R2C2); hai tiểu đơn vị xúc tác được giải phóng và hoạt động.'
},
{
id: 'f.cutpip2', text: 'Enzyme nào phân cắt PIP2 thành IP3 và DAG?', answer: 'plcp', pool: ['adcyc', 'pde', 'pka', 'pkc', 'camk'],
hints: ['Nó thủy phân liên kết phosphodiester giữa một nhóm phosphate và một nhóm glycerol của lipid màng.', 'Một loại protein G sẽ kích hoạt nó sau khi hormone liên kết với thụ thể của nó.'],
explain: 'Phospholipase C thủy phân PIP2 thành IP3 và diacylglycerol.'
},
{
id: 'f.ip3opens', text: 'IP3 liên kết và mở protein nào?', answer: 'ip3r', pool: ['pkc', 'calm', 'plcp', 'camk', 'glut4'],
hints: ['Nó nằm trong màng của một kho chứa bên trong tế bào.', 'Khi màng này mở ra, một ion được lưu trữ phía sau màng sẽ chảy ra ngoài vào tế bào chất.'],
explain: 'Thụ thể IP3 là một kênh canxi của lưới nội chất: sự giải phóng Ca2+ từ lưới nội chất được kích thích bởi IP3.'
},
{
id: 'f.dagkinase', text: 'Diacylglycerol kích hoạt loại kinase nào?', answer: 'pkc', pool: ['pka', 'camk', 'calm', 'pde', 'plcp'],
hints: ['Enzyme kinase này nằm ở màng tế bào chất, sát bên cạnh chất truyền tin lipid.', 'Nó phosphoryl hóa các protein kênh điều khiển dòng ion đi vào và ra khỏi tế bào.'],
explain: 'DAG là chất không phân cực và nằm trong màng tế bào, nơi nó kích hoạt protein kinase C, chất này sẽ phosphoryl hóa các kênh canxi.'
},
{
id: 'f.cabinder', text: 'Các ion canxi liên kết với loại protein nhỏ nào trước khi kinase được kích hoạt?', answer: 'calm', pool: ['pkc', 'camk', 'ip3r', 'pka', 'plcp'],
hints: ['Nó không có hoạt tính enzyme riêng.', 'Nó truyền tín hiệu canxi đến một loại kinase.'],
explain: 'Calmodulin liên kết với Ca2+; phức hợp Ca2+-calmodulin kích hoạt một protein kinase trong tế bào chất, protein này sẽ phosphoryl hóa một enzyme mục tiêu.'
}
];
var STATEMENTS = [
{
id: 'f.castore', text: 'IP3 giải phóng Ca2+ từ đâu?', answer: 'er',
options: [
{ id: 'er', label: 'Lòng ống của lưới nội chất' }, { id: 'out', label: 'Chất lỏng bên ngoài tế bào' },
{ id: 'pm', label: 'Mặt trong của màng sinh chất' }, { id: 'nuc', label: 'Hạt nhân' }
],
hints: ['IP3 không ở lại màng tế bào: nó khuếch tán qua bào tương trước.', 'Kho dự trữ là một ngăn được bao bọc bởi màng bên trong tế bào.'],
explain: 'IP3 khuếch tán vào lưới nội chất và kích thích giải phóng Ca2+ từ lòng lưới nội chất vào bào tương. Ca2+ từ bên ngoài tế bào đi vào qua các kênh màng sinh chất.'
},
{
id: 'f.precursor', text: 'Trong số này, yếu tố nào là tiền thân của hai sứ giả chứ không phải chỉ là một sứ giả?', answer: 'pip2',
options: [
{ id: 'pip2', label: 'PIP2', names: ['phosphatidylinositol 4,5-bisphosphate'] }, { id: 'ip3', label: 'IP3' }, { id: 'dag', label: 'DAG' },
{ id: 'camp', label: 'cAMP' }, { id: 'cgmp', label: 'cGMP' }
],
hints: ['Nó là một loại lipid của màng tế bào.', 'Phospholipase C cắt nó thành hai mảnh.'],
explain: 'PIP2 là chất nền của phospholipase C. IP3 và DAG là các chất truyền tin.'
},
{
id: 'f.cgmp', text: 'Trong số các chất truyền tín hiệu thứ cấp này, chất nào được cấu tạo từ guanine thay vì adenine?', answer: 'cgmp',
options: [{ id: 'camp', label: 'cAMP' }, { id: 'cgmp', label: 'cGMP' }, { id: 'ip3', label: 'IP3' }, { id: 'dag', label: 'DAG' }, { id: 'ca', label: 'Ca2+' }],
hints: ['Nó là một nucleotide vòng, giống như một trong bốn nucleotide còn lại.', 'Cấu trúc cơ bản của nó có nhóm C=O trong vòng sáu cạnh, điều mà adenine không có.'],
explain: 'cGMP là đồng phân guanine của cAMP. Trong tế bào, enzyme guanylate cyclase tạo ra nó.'
},
{
id: 'f.fourcamp', text: 'Có bao nhiêu phân tử cAMP liên kết với một tetramer PKA không hoạt động (R2C2)?', answer: 'four',
options: [{ id: 'one', label: 'Một' }, { id: 'two', label: 'Hai' }, { id: 'four', label: 'Bốn' }, { id: 'six', label: 'Sáu' }],
hints: ['Mỗi trong hai tiểu đơn vị điều hòa đều có nhiều hơn một vị trí liên kết với phân tử truyền tin.'],
explain: 'Bốn phân tử cAMP liên kết với một tetramer R2C2 và giải phóng hai tiểu đơn vị xúc tác.'
}
];
function factsBuild(opts) {
var rand = E().rng((opts.seed || 1) + 23);
var prompts = [];
FACTS.forEach(function (f) {
if (!enz(f.answer)) { return; }
var ids = [f.answer].concat(E().shuffle(f.pool.filter(function (x) { return !!enz(x); }), rand).slice(0, 4));
prompts.push({
id: f.id, kind: 'pick', group: 'Sự thật', text: f.text, figure: null, optionStyle: 'text', answer: f.answer,
options: ids.map(function (id) { return { id: id, label: enz(id).name }; }), hints: f.hints.slice(), explain: f.explain
});
});
STATEMENTS.forEach(function (s) {
prompts.push({
id: s.id, kind: 'pick', group: 'Sự thật', text: s.text, figure: null, optionStyle: 'text', answer: s.answer,
options: s.options.map(function (o) { return { id: o.id, label: o.label, names: o.names }; }), hints: s.hints.slice(), explain: s.explain
});
});
return { intro: 'Điều gì tạo nên, phá vỡ, mở ra và kích hoạt các chất truyền tin thứ cấp?', prompts: prompts };
}
var WHO_OPTIONS = [
{ id: 'camp', label: 'cAMP', names: ['cyclic amp', 'cyclic adenosine monophosphate'] },
{ id: 'cgmp', label: 'cGMP', names: ['cyclic gmp', 'cyclic guanosine monophosphate'] },
{ id: 'ip3', label: 'IP3', names: ['inositol trisphosphate', 'inositol 1,4,5-trisphosphate'] },
{ id: 'dag', label: 'DAG', names: ['diacylglycerol'] },
{ id: 'ca', label: 'Ca2+', names: ['calcium'] },
{ id: 'pip2', label: 'PIP2', names: ['phosphatidylinositol 4,5-bisphosphate'] }
];
var WHO = [
{
id: 'w.camp', answer: 'camp', clue: 'Tôi được tạo thành từ ATP tại màng tế bào và được giải phóng vào tế bào chất.',
hints: ['Bốn phân tử trong số tôi liên kết với một protein kinase A không hoạt động.', 'Một loại enzyme mở vòng của tôi bằng nước và tôi biến thành AMP.'],
explain: 'cAMP: được tạo ra bởi adenylate cyclase từ ATP, bốn phân tử liên kết với các tiểu đơn vị điều hòa của PKA, và phosphodiesterase tạo ra AMP từ đó.'
},
{
id: 'w.cgmp', answer: 'cgmp', clue: 'Tôi là một nucleotide vòng và là một chất truyền tin thứ cấp, nhưng enzyme adenylate cyclase không tạo ra tôi.',
hints: ['Phân tử phosphate của tôi tạo thành một vòng khép kín, giống như vòng của một sứ giả khác.', 'Chất nền của tôi là guanine.'],
explain: 'cGMP: cùng một loại phosphate vòng như cAMP, nhưng gắn trên guanosine. Trong tế bào, enzyme guanylate cyclase tạo ra nó.'
},
{
id: 'w.ip3', answer: 'ip3', clue: 'Tôi được tạo ra khi một loại enzyme cắt phospholipid màng tế bào và hòa tan trong nước.',
hints: ['Tôi rời khỏi màng tế bào và khuếch tán qua bào tương đến kho dự trữ bên trong tế bào.', 'Tôi mở một kênh ở đó và một ion chảy ra.'],
explain: 'IP3: phần đầu hòa tan trong nước của PIP2, được giải phóng bởi phospholipase C; nó mở kênh canxi của lưới nội chất.'
},
{
id: 'w.dag', answer: 'dag', clue: 'Tôi được tạo ra khi một loại enzyme cắt phospholipid màng, nhưng tôi là chất trung tính.',
hints: ['Tôi ở lại trong màng sinh chất.', 'Tôi kích hoạt một loại kinase của màng tế bào.'],
explain: 'DAG: phần không phân cực của PIP2; nó nằm trong màng tế bào và kích hoạt protein kinase C.'
},
{
id: 'w.ca', answer: 'ca', clue: 'Tôi là một ion, không phải là một phân tử, và tôi được lưu trữ bên trong mạng lưới nội chất.',
hints: ['Một chất truyền tin từ màng tế bào mở một kênh cho phép tôi đi vào bào tương.', 'Một loại protein nhỏ liên kết với tôi và phức hợp này kích hoạt một loại kinase.'],
explain: 'Ca2+: được giải phóng từ khoang ER bởi IP3, nó liên kết với calmodulin, và phức hợp này kích hoạt một kinase trong bào tương.'
},
{
id: 'w.pip2', answer: 'pip2', clue: 'Tôi là một phospholipid nằm ở lớp trong cùng của màng tế bào.',
hints: ['Một loại enzyme cắt tôi giữa phosphate và glycerol.', 'Tôi là người tiền nhiệm của hai sứ giả, chứ không phải là sứ giả.'],
explain: 'PIP2: chất nền của phospholipase C, enzyme này thủy phân PIP2 thành IP3 và DAG. Nó là tiền chất, không phải là chất truyền tin: IP3 mới là chất truyền tin thứ cấp thực sự.'
}
];
function whoBuild() {
var prompts = WHO.map(function (w) {
return {
id: w.id, kind: 'pick', group: 'Tôi là ai?', text: 'Tôi là ai? ' + w.clue, figure: null, optionStyle: 'text', answer: w.answer,
options: WHO_OPTIONS.map(function (o) { return { id: o.id, label: o.label, names: o.names }; }), hints: w.hints.slice(), explain: w.explain
};
});
return { intro: 'Manh mối đầu tiên nằm ngay trong câu hỏi. Mỗi gợi ý tiếp theo sẽ bổ sung thêm một manh mối.', prompts: prompts };
}
P.games.push({
id: 'msg-structures', title: 'Cấu trúc chất truyền tin thứ cấp', subtitle: 'cAMP, cGMP, AMP, IP3, PIP2, DAG và epinephrine: đặt tên cho hình vẽ, chọn hình vẽ.',
group: GROUP, count: 10, build: structuresBuild
});
P.games.push({
id: 'msg-facts', title: 'Những gì người đưa tin làm', subtitle: 'Các enzyme tạo ra và phân hủy chúng, và những gì chúng kích hoạt',
group: GROUP, count: 10, build: factsBuild
});
P.games.push({
id: 'msg-whoami', title: 'Tôi là ai?', subtitle: 'cAMP, cGMP, IP3, DAG, Ca2+ và PIP2 từ các manh mối', group: GROUP, count: 6, build: whoBuild
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Truyền tín hiệu tế bào';
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, group, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: group, text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
function order(id, group, text, items, hints, explain) {
return {
id: id, kind: 'order', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), answer: items.map(function (x) { return x[0]; }), hints: hints, explain: explain
};
}
function sort(id, group, text, items, buckets, answer, hints, explain) {
return {
id: id, kind: 'sort', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), buckets: buckets.map(function (b) { return { id: b[0], label: b[1] }; }),
answer: answer, hints: hints, explain: explain
};
}
function wireBuild() {
var G = 'Sắp xếp thác nước theo thứ tự';
var prompts = [];
prompts.push(order('w.gpcr', G, 'Hãy sắp xếp sáu hình ảnh của chu trình hoạt động GPCR theo đúng thứ tự.', [
['bind', 'Hormone này liên kết với thụ thể.'], ['shape', 'Thụ thể thay đổi hình dạng'], ['swap', 'GTP thay thế GDP trên tiểu đơn vị alpha'],
['leave', 'Tiểu đơn vị alpha chứa GTP tách khỏi hai tiểu đơn vị còn lại và kích hoạt một loại enzyme.'], ['gtpase', 'GTP của tiểu đơn vị alpha được chuyển hóa thành GDP'],
['back', 'Tiểu đơn vị alpha với GDP tái hợp với hai tiểu đơn vị còn lại: trạng thái nghỉ ngơi']
], [
'Chu kỳ này bắt đầu từ một yếu tố bên ngoài tế bào và kết thúc ở nơi nó bắt đầu.',
'Đầu tiên, nucleotide được hoán đổi, và chỉ sau đó tiểu đơn vị alpha mới tách ra.'
], 'Sáu bước đó là: sự gắn kết của hormone, sự thay đổi cấu trúc của thụ thể, sự thay thế GDP bằng GTP, sự hoạt hóa của enzyme (tiểu đơn vị alpha-GTP tách ra) và hoạt động của GTPase, sau đó chu trình trở lại trạng thái ban đầu.'));
prompts.push(order('w.epi', G, 'Hãy sắp xếp lại trình tự phản ứng của chuỗi epinephrine dẫn đến việc phân giải glycogen.', [
['bind', 'Epinephrine liên kết với thụ thể của nó'], ['swap', 'GDP được thay thế bằng GTP trên tiểu đơn vị alpha của Gs.'], ['cyc', 'Adenylate cyclase tạo ra cAMP'],
['pka', 'cAMP giải phóng các tiểu đơn vị xúc tác của PKA.'], ['phk', 'PKA phosphorylates phosphorylase kinase'],
['gp', 'Phosphorylase kinase phosphorylates glycogen phosphorylase'], ['g1p', 'Glycogen phosphorylase giải phóng glucose 1-phosphate từ glycogen']
], [
'Mỗi enzyme trong chuỗi sẽ kích hoạt enzyme tiếp theo, và enzyme cuối cùng là enzyme phân giải glycogen.',
'Chất truyền tin thứ hai được tạo ra trước khi kinase mà nó giải phóng có thể hoạt động.'
], 'Chuỗi phản ứng gồm bảy bước: kích thích hormone, chuyển hóa GDP thành GTP, tạo ra cAMP, cAMP giải phóng PKA, PKA phosphoryl hóa phosphorylase kinase, phosphorylase kinase phosphoryl hóa glycogen phosphorylase, và glycogen phosphorylase a giải phóng glucose 1-phosphate. Một nhánh phụ, trong đó PKA cũng tắt glycogen synthase, được lược bỏ ở đây.'));
prompts.push(order('w.ins', G, 'Sắp xếp lại con đường thụ thể insulin.', [
['bind', 'Insulin liên kết với dimer thụ thể.'], ['auto', 'Thụ thể tự phosphoryl hóa các đuôi của nó.'], ['irs', 'IRS-1 đã được kích hoạt'], ['pi3k', 'PI3 kinase được kích hoạt'],
['pip3', 'PIP2 được phosphoryl hóa thành PIP3.'], ['pdk', 'PDK1 được kích hoạt'], ['akt', 'Akt được kích hoạt'], ['glut', 'GLUT4 di chuyển đến màng tế bào.'],
['uptake', 'Tế bào hấp thụ glucose, do đó lượng đường trong máu giảm xuống.']
], [
'Mỗi protein trong chuỗi được kích hoạt bởi protein trước đó, và một lipid bị biến đổi ở giữa chuỗi.',
'Chất vận chuyển chỉ đến được bề mặt vào giai đoạn cuối, và glucose chỉ có thể đi vào sau đó.'
], 'Các bước bao gồm: liên kết insulin, tự phosphoryl hóa, hoạt hóa IRS-1, hoạt hóa PI3 kinase, hình thành PIP3, hoạt hóa PDK1, hoạt hóa Akt, di chuyển GLUT4 và hấp thụ glucose. Tín hiệu insulin đưa các túi GLUT4 đến màng tế bào.'));
prompts.push(order('w.plc', G, 'Hãy sắp xếp sáu bước đầu tiên của chu trình PIP2 theo đúng thứ tự, từ hormone đến enzyme đích.', [
['hormone', 'Một hormone liên kết với thụ thể của nó và kích hoạt protein G.'], ['plc', 'Protein G kích hoạt phospholipase C'],
['cut', 'Phospholipase C cắt PIP2 thành IP3 và DAG.'], ['er', 'IP3 mở kênh Ca2+ của lưới nội chất.'],
['cam', 'Ion Ca2+ liên kết với calmodulin'], ['kinase', 'Phức hợp Ca2+-calmodulin kích hoạt một kinase, chất này sẽ phosphoryl hóa một enzyme mục tiêu.']
], [
'Phân tử lipid bị cắt trước khi bất kỳ mảnh nào trong hai mảnh của nó có thể gây ra bất kỳ tác động nào.',
'Các ion được giải phóng khỏi kho dự trữ trước khi chúng có thể liên kết với protein.'
], 'Hormone và protein G kích hoạt phospholipase C, enzyme này thủy phân PIP2 thành IP3 và DAG; IP3 giải phóng Ca2+ từ lưới nội chất; Ca2+ liên kết với calmodulin, chất này kích hoạt một kinase trong bào tương. DAG, thành phần còn lại, vẫn nằm trong màng tế bào và kích hoạt protein kinase C.'));
prompts.push(order('w.egfr', G, 'Sắp xếp chuỗi phản ứng từ thụ thể EGF đến kinase MAP theo đúng thứ tự.', [
['dimer', 'EGF liên kết và thụ thể tạo thành dimer.'], ['auto', 'Các đuôi của dimer được tự phosphoryl hóa.'],
['complex', 'GRB2 và SOS liên kết với nhau trên các phosphotyrosine.'], ['ras', 'RAS quy đổi GDP lấy GTP'], ['raf', 'RAS-GTP kích hoạt RAF'],
['mek', 'Không quân Hoàng gia Anh kích hoạt MEK'], ['mapk', 'MEK kích hoạt MAP kinase'], ['targets', 'MAP kinase phosphorylates MNK, RSK và MYC']
], [
'Ba kinase lần lượt xuất hiện, mỗi kinase kích hoạt kinase tiếp theo, và một protein G nhỏ khởi động chúng.',
'Các protein thích ứng tập trung trên thụ thể trước khi protein G nhỏ có thể được kích hoạt.'
], 'EGF liên kết với dimer EGFR, các tyrosine được tự phosphoryl hóa, GRB2 và SOS tập hợp trên các phosphotyrosine, RAS-GDP trở thành RAS-GTP, RAS hoạt hóa RAF, RAF hoạt hóa MEK, MEK hoạt hóa MAPK, và MAPK phosphoryl hóa MNK, RSK và MYC (CREB và S6 theo sau, và các yếu tố phiên mã hoạt hóa biểu hiện gen).'));
prompts.push(order('w.steroid', G, 'Sắp xếp lại quá trình truyền tín hiệu hormone steroid, từ máu đến sự thay đổi chức năng tế bào.', [
['enter', 'Hormone này xuyên qua lớp màng lipid kép.'], ['bind', 'Hormone này liên kết với thụ thể, được giữ bởi HSP.'], ['hsp', 'HSP được phát hành'],
['dimer', 'Hai thụ thể tạo thành một dimer'], ['nucleus', 'Phân tử dimer di chuyển vào nhân tế bào thông qua lỗ màng nhân.'],
['hre', 'Phân tử dimer liên kết với HRE cùng với chất hoạt hóa và RNA polymerase.'], ['mrna', 'RNA polymerase tạo ra mRNA'],
['export', 'mRNA rời khỏi nhân tế bào qua lỗ màng nhân.'], ['protein', 'Ribosome tổng hợp protein và chức năng của tế bào thay đổi.']
], [
'Hormone phải đi vào tế bào trước khi gặp được thụ thể của nó, và thông điệp phải rời khỏi nhân tế bào trước khi được đọc.',
'Hai thụ thể kết nối với nhau sau khi người hỗ trợ buông tay và trước khi chúng di chuyển.'
], 'Các bước bao gồm: hormone đi vào tế bào, liên kết với phức hợp NR/HSP, giải phóng HSP, tạo dimer, di chuyển vào nhân, liên kết với HRE cùng với chất hoạt hóa và RNA polymerase (kích hoạt phiên mã), mRNA, lỗ màng nhân, ribosome, protein và sự thay đổi chức năng tế bào.'));
return { intro: 'Trong một chuỗi liên tiếp, mỗi bước sẽ kích hoạt bước tiếp theo, vì vậy thứ tự chính là logic.', prompts: prompts };
}
function offBuild() {
var G = 'Tắt tín hiệu';
var prompts = [];
prompts.push(pick('s.galpha', G, 'Điều gì làm tắt tiểu đơn vị alpha hoạt động của Gs?', [
['gtpase', 'Hoạt động GTPase của chính nó'], ['pde', 'Phosphodiesterase', ['pde']], ['arr', 'Arrestin'], ['pp', 'Phosphoprotein phosphatase', ['pp1']]
], 'gtpase', [
'Nó không cần bất kỳ loại protein nào khác: tiểu đơn vị này tự thực hiện điều đó.',
'Quá trình này diễn ra chậm và tách một nhóm phosphate ra khỏi nucleotide mà tiểu đơn vị mang theo.'
], 'G alpha có hoạt động riêng của nó, từ từ chuyển hóa GTP thành GDP. Sau đó, tiểu đơn vị alpha-GDP tách khỏi adenylate cyclase và tái hợp với G beta-gamma, do đó không còn cAMP được tạo ra nữa.'));
prompts.push(pick('s.camp', G, 'Điều gì loại bỏ cAMP sau khi tín hiệu đã hoàn thành nhiệm vụ của nó?', [
['pde', 'Phosphodiesterase', ['pde']], ['ac', 'Adenylate cyclase'], ['pka', 'Protein kinase A', ['pka']], ['plc', 'Phospholipase C', ['plc']]
], 'pde', [
'Nó mở chiếc nhẫn của người đưa tin.',
'Nó thêm nước vào một trong hai liên kết của vòng phosphate và tạo ra một nucleotide mạch thẳng.'
], 'Phosphodiesterase tạo ra AMP từ cAMP. Adenylate cyclase tạo ra cAMP, còn PKA và phospholipase C có những nhiệm vụ khác.'));
prompts.push(pick('s.receptor', G, 'Cơ chế tự tắt của thụ thể beta-adrenergic đã được kích hoạt diễn ra như thế nào?', [
['grk', 'Một kinase thụ thể phosphoryl hóa đuôi của nó và arrestin liên kết với nó.'], ['hydro', 'Phosphodiesterase phân giải hormone.'],
['gtpase', 'Thụ thể tự thủy phân một phân tử GTP của chính nó.'], ['pp', 'Một loại phosphatase loại bỏ hormone.']
], 'grk', [
'Hai loại protein hoạt động cùng nhau; loại protein đầu tiên gắn nhóm phosphate vào thụ thể.',
'Chất thứ hai liên kết với phần đuôi mang nhóm phosphate và ngăn cản thụ thể tác động lên protein G của nó.'
], 'Kinase thụ thể liên kết với protein G sử dụng ATP để phosphoryl hóa thụ thể, và arrestin liên kết với nó. Arrestin ngăn chặn thụ thể liên kết với protein G của nó, và thụ thể được đưa vào bên trong tế bào.'));
prompts.push(pick('s.pka', G, 'Tại sao PKA ngừng hoạt động khi nồng độ cAMP giảm?', [
['rejoin', 'Các tiểu đơn vị điều hòa liên kết lại với các tiểu đơn vị xúc tác.'], ['cut', 'Các tiểu đơn vị xúc tác được cắt thành từng mảnh.'],
['leave', 'Các tiểu đơn vị xúc tác rời khỏi tế bào.'], ['cgmp', 'cAMP được chuyển hóa thành cGMP']
], 'rejoin', [
'Enzyme này được cấu tạo từ bốn phần, chúng sẽ tách rời nhau khi chất truyền tin liên kết.',
'Khi sứ giả rời đi, các bộ phận sẽ làm những việc mà chúng đã làm trước khi sứ giả đến.'
], 'PKA trở nên không hoạt động. Nó tái tạo lại tetramer R2C2 không hoạt động: khi cAMP biến mất, các tiểu đơn vị điều hòa lại liên kết với các tiểu đơn vị xúc tác.'));
prompts.push(pick('s.phospho', G, 'Điều gì làm đảo ngược quá trình phosphoryl hóa protein bởi kinase?', [
['pp', 'Phosphoprotein phosphatase', ['pp1']], ['ac', 'Adenylate cyclase'], ['g', 'Protein G'], ['cam', 'Calmodulin']
], 'pp', [
'Nó sử dụng nước để loại bỏ nhóm mà kinase đã thêm vào.',
'Nhóm này tách ra dưới dạng ion vô cơ, và protein trở lại trạng thái ban đầu.'
], 'Một phosphoprotein phosphatase loại bỏ nhóm phosphate bằng nước. Tín hiệu insulin kích hoạt enzyme này, làm cho phosphorylase kinase và glycogen phosphorylase không hoạt động và glycogen synthase hoạt động.'));
prompts.push(pick('s.ras', G, 'Làm thế nào để tắt RAS-GTP?', [
['gtpase', 'Nó từ từ phân tách GTP của chính nó thành GDP.'], ['sos', 'SOS bổ sung thêm GTP thứ hai'], ['raf', 'Không quân Hoàng gia Anh (RAF) loại bỏ phốt phát khỏi nó.'], ['mek', 'MEK liên kết nó']
], 'gtpase', [
'Hãy so sánh nó với tiểu đơn vị alpha của protein G.',
'Nó tự thực hiện công việc, nhưng khá chậm.'
], 'RAS là một protein G đơn phân tử giống như tiểu đơn vị alpha: nó trao đổi GDP lấy GTP khi được kích hoạt và từ từ phân cắt GTP thành GDP, điều này làm tắt hoạt động của nó.'));
prompts.push(pick('s.stuck', G, 'Đột biến tại codon 12, 13 hoặc 61 của gen RAS gây ra tác động gì?', [
['block', 'Nó ngăn chặn GTPase, do đó RAS vẫn hoạt động.'], ['nogtp', 'Nó ngăn RAS liên kết với GTP.'], ['sos', 'Nó tắt chế độ SOS.'], ['leave', 'Nó cho phép RAS rời khỏi màng tế bào.']
], 'block', [
'Nó làm thay đổi một axit amin gần nucleotide của công tắc.',
'Công tắc vẫn có thể được bật, nhưng không thể tự tắt được nữa.'
], 'Đột biến này ức chế GTPase và kích hoạt RAS, từ đó kích thích sự phân chia tế bào liên tục. RAS đột biến được tìm thấy ở 90% trường hợp ung thư tuyến tụy và 20% tổng số các loại ung thư. Các điểm nóng thường gặp là 12, 13 và 61.'));
prompts.push(pick('s.coffee', G, 'Một lời giải thích phổ biến cho rằng cà phê làm tăng nhẹ lượng đường trong máu vì caffeine ức chế một loại enzyme của con đường cAMP. Đó là loại enzyme nào?', [
['pde', 'Phosphodiesterase', ['pde']], ['ac', 'Adenylate cyclase'], ['gp', 'Glycogen phosphorylase'], ['arr', 'Arrestin']
], 'pde', [
'Enzyme được đề cập sẽ chấm dứt tín hiệu của chất truyền tin.',
'Nếu tốc độ truyền tín hiệu chậm lại, nồng độ chất truyền tin sẽ duy trì ở mức cao hơn trong thời gian dài hơn.'
], 'Phosphodiesterase, do đó nồng độ cAMP luôn cao hơn. Đó là một sự đơn giản hóa: caffeine có ức chế enzyme này trong ống nghiệm, nhưng ở liều lượng của một tách cà phê, nó chủ yếu hoạt động bằng cách ngăn chặn các thụ thể adenosine, và cần một lượng lớn hơn nhiều để ức chế enzyme này.'));
prompts.push(sort('s.sort', G, 'Mỗi công tắc tắt tác động lên phần nào của tín hiệu?', [
['gtpase', 'GTPase của G alpha'], ['pde', 'Phosphodiesterase'], ['grk', 'GRK và arrestin'], ['pp', 'Phosphoprotein phosphatase']
], [['g', 'Protein G'], ['m', 'Người đưa tin cAMP'], ['r', 'Thụ thể'], ['p', 'Một protein được phosphoryl hóa']], {
gtpase: 'g', pde: 'm', grk: 'r', pp: 'p'
}, [
'Mỗi công tắc tắt sẽ kết thúc một phần khác nhau của tín hiệu.',
'Hãy nghĩ xem mỗi chất tác động lên cái gì: một tiểu đơn vị mang nucleotide, một phân tử hình vòng, một protein của màng tế bào, một nhóm phosphate trên protein.'
], 'GTPase của G alpha kết thúc tín hiệu protein G; phosphodiesterase kết thúc tín hiệu cAMP; GRK và arrestin kết thúc tín hiệu tại thụ thể; phosphoprotein phosphatase loại bỏ những gì mà các kinase đã thêm vào.'));
return { intro: 'Một tín hiệu không thể tắt được là một căn bệnh. Hãy tìm công tắc tắt của từng phần trong tín hiệu đó.', prompts: prompts };
}
function epiBuild() {
var G = 'Hai hormone, một kho dự trữ glycogen';
var prompts = [];
var TWO = [['epi', 'Epinephrine'], ['ins', 'Insulin'], ['both', 'Cả hai người họ'], ['none', 'Không ai trong số họ']];
prompts.push(pick('e.raise', G, 'Loại hormone nào làm tăng lượng đường trong máu?', TWO, 'epi', [
'Một trong số đó là tín hiệu của sự căng thẳng, và nó hoạt động thông qua một chất truyền tin thứ cấp.',
'Nó phân giải glycogen.'
], 'Epinephrine: cAMP, PKA, phosphorylase kinase và glycogen phosphorylase phân giải glycogen thành glucose 1-phosphate, làm tăng lượng đường trong máu. Insulin làm giảm lượng đường trong máu (bên phải).'));
prompts.push(pick('e.fall', G, 'Loại hormone nào làm giảm lượng đường trong máu?', TWO, 'ins', [
'Một trong số đó báo cho các tế bào biết rằng máu chứa rất nhiều glucose.',
'Nó giúp các tế bào hấp thụ glucose và dự trữ dưới dạng glycogen.'
], 'Insulin: GLUT4 di chuyển đến màng tế bào và các tế bào hấp thụ glucose, sau đó nhánh phosphatase tạo ra glycogen.'));
prompts.push(pick('e.gs', G, 'Hormone nào kích hoạt enzyme tổng hợp glycogen?', TWO, 'ins', [
'Enzyme tổng hợp glycogen bị ức chế bởi hormone phân giải glycogen.',
'Nó được kích hoạt bằng cách loại bỏ một nhóm phosphate, chứ không phải bằng cách thêm một nhóm phosphate.'
], 'Insulin: phosphatase phosphoprotein mà nó kích hoạt sẽ lấy nhóm phosphate từ glycogen synthase, làm cho nó hoạt động và tạo ra glycogen. Ngược lại, PKA lại phosphoryl hóa nó và tắt hoạt động của glycogen synthase.'));
prompts.push(pick('e.glut4', G, 'Hormone nào đưa GLUT4 đến màng tế bào?', TWO, 'ins', [
'Chất vận chuyển được lưu trữ trong các túi nhỏ bên trong tế bào cho đến khi có tín hiệu.',
'Tín hiệu truyền qua một kinase lipid và sau đó qua Akt.'
], 'Insulin, thông qua IRS-1, PI3 kinase, PIP3, PDK1 và Akt, vận chuyển các túi GLUT4 vào màng tế bào.'));
prompts.push(pick('e.pp', G, 'Phosphoprotein phosphatase của con đường tín hiệu insulin tác động như thế nào đến phosphorylase kinase và glycogen phosphorylase a?', [
['off', 'Nó loại bỏ các nhóm phosphate của chúng và vô hiệu hóa chúng.'], ['on', 'Nó bổ sung các nhóm phosphat và kích hoạt chúng.'],
['cut', 'Nó cắt chúng thành từng mảnh.'], ['nothing', 'Không có tác dụng gì: nó chỉ tác động lên glycogen synthase.']
], 'off', [
'Nó hoạt động ngược lại với những gì PKA và phosphorylase kinase đã làm.',
'Việc loại bỏ nhóm phosphate khỏi hai enzyme này sẽ chấm dứt hoạt động của chúng.'
], 'Insulin kích hoạt phosphatase phosphoprotein, làm cho PK và GP-a không hoạt động và GS hoạt động.'));
prompts.push(sort('e.sort.epi', G, 'Với epinephrine, những chức năng nào đang hoạt động và những chức năng nào đang tắt?', [
['pka', 'PKA'], ['phk', 'Phosphorylase kinase'], ['gp', 'Glycogen phosphorylase a'], ['gs', 'Glycogen synthase']
], [['on', 'Đang bật (hoạt động)'], ['off', 'Tắt (không hoạt động)']], { pka: 'on', phk: 'on', gp: 'on', gs: 'off' }, [
'Ba trong số chúng tham gia vào quá trình phân giải glycogen, và một loại tham gia vào quá trình tổng hợp glycogen.',
'PKA phosphoryl hóa cả ba chất còn lại, và điều đó kích hoạt những chất tham gia vào quá trình phân giải.'
], 'PKA hoạt động; nó kích hoạt phosphorylase kinase, từ đó kích hoạt glycogen phosphorylase, và nó phosphoryl hóa glycogen synthase, làm tắt enzyme này.'));
prompts.push(sort('e.sort.ins', G, 'Với insulin, những chức năng nào đang hoạt động và những chức năng nào đang tắt?', [
['akt', 'Akt'], ['pp', 'Phosphoprotein phosphatase'], ['phk', 'Phosphorylase kinase'], ['gp', 'Glycogen phosphorylase a'], ['gs', 'Glycogen synthase']
], [['on', 'Đang bật (hoạt động)'], ['off', 'Tắt (không hoạt động)']], { akt: 'on', pp: 'on', phk: 'off', gp: 'off', gs: 'on' }, [
'Hai protein của con đường insulin đang hoạt động, và cả enzyme tạo ra glycogen cũng vậy.',
'Hai loại enzyme phân giải glycogen hiện đang ngừng hoạt động.'
], 'Insulin kích hoạt Akt (thông qua IRS-1, PI3 kinase và PDK1) và phosphoprotein phosphatase, làm cho PK và GP-a không hoạt động và GS hoạt động, do đó glycogen được tạo ra.'));
return { intro: 'Epinephrine và insulin tác động lên cùng một kho dự trữ glycogen nhưng theo cơ chế ngược chiều nhau.', prompts: prompts };
}
P.games.push({
id: 'wire-cascade', title: 'Nối dây tầng', subtitle: 'Sắp xếp các bước của một chuỗi tín hiệu theo đúng thứ tự.',
group: GROUP, count: 5, build: wireBuild
});
P.games.push({
id: 'switch-it-off', title: 'Tắt nó đi', subtitle: 'Điều gì làm tắt từng tín hiệu, với tấm thẻ cà phê',
group: GROUP, count: 9, fixedOrder: true, build: offBuild
});
P.games.push({
id: 'epi-vs-insulin', title: 'Epinephrine so với insulin', subtitle: 'Loại protein nào được kích hoạt hoặc vô hiệu hóa dưới tác động của từng loại hormone, và điều gì xảy ra với lượng đường trong máu?',
group: GROUP, count: 7, fixedOrder: true, build: epiBuild
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Quang hợp';
function pick(id, group, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: group, text: text, figure: null, optionStyle: 'text', options: options, answer: answer, hints: hints, explain: explain };
}
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function build() {
var prompts = [];
prompts.push({
id: 'z.order.carriers', kind: 'order', group: 'Đường đi của các electron',
text: 'Sắp xếp các chất mang theo thứ tự electron đi qua chúng, từ nước đến NADPH.', figure: null,
items: [
{ id: 'mn', label: 'Phức hợp Mn (phức hợp giải phóng oxy)' }, { id: 'p680', label: 'P680 (hệ thống quang hợp II)' }, { id: 'pheo', label: 'Pheophytin' },
{ id: 'pq', label: 'Plastoquinone (PQ)' }, { id: 'b6f', label: 'Cytochrome b6f' }, { id: 'pc', label: 'Plastocyanin (PC)' },
{ id: 'p700', label: 'P700 (hệ thống quang hợp I)' }, { id: 'fd', label: 'Ferredoxin (Fd)' }, { id: 'fnr', label: 'Ferredoxin-NADP⁺ reductase (FP, FAD)' }
],
answer: ['mn', 'p680', 'pheo', 'pq', 'b6f', 'pc', 'p700', 'fd', 'fnr'],
hints: [
'Các electron bắt đầu từ nước và kết thúc ở NADP⁺.',
'Hệ thống quang hợp II xuất hiện trước, hệ thống quang hợp I thứ hai, và một chuỗi các bộ phận mang quang hợp nối chúng lại với nhau.',
'Giữa hai hệ thống quang hợp là bể quinone, phức hợp cytochrome và một loại protein đồng nhỏ.'
],
explain: 'Nước cung cấp electron cho phức hợp Mn, phức hợp này bổ sung lại electron cho P680. P680 ở trạng thái kích thích sẽ truyền các electron này cho pheophytin và nhóm quinone, sau đó thông qua cytochrome b6f đến plastocyanin, chất này lại bổ sung electron cho P700. P700 ở trạng thái kích thích sẽ truyền các electron này thông qua A0, A1 và các trung tâm sắt-lưu huỳnh đến ferredoxin, và enzyme FAD (FNR) sử dụng chúng để khử NADP⁺ thành NADPH.'
});
prompts.push({
id: 'z.sort.where', kind: 'sort', group: 'Nơi mọi thứ',
text: 'Mỗi chất mang nằm ở vị trí nào: phía lòng ống, bên trong màng, hay phía mô đệm?', figure: null,
items: [
{ id: 'pc', label: 'Plastocyanin (PC)' }, { id: 'mn', label: 'phức hợp Mn' }, { id: 'pq', label: 'Plastoquinone (PQ)' },
{ id: 'b6f', label: 'Cytochrome b6f' }, { id: 'fd', label: 'Ferredoxin (Fd)' }, { id: 'fnr', label: 'FNR (FP, FAD)' }
],
buckets: [{ id: 'lumen', label: 'Lumen' }, { id: 'mem', label: 'Màng' }, { id: 'stroma', label: 'Mô đệm' }],
answer: { pc: 'lumen', mn: 'lumen', pq: 'mem', b6f: 'mem', fd: 'stroma', fnr: 'stroma' },
hints: [
'Nước được phân tách ở một bên màng thylakoid và NADP⁺ bị khử ở phía bên kia.',
'Hai chất mang di động nhỏ không nằm trong màng tế bào sống ở hai phía khác nhau.'
],
explain: 'Phức hợp Mn và plastocyanin nằm ở phía lòng ống của màng thylakoid, plastoquinone và cytochrome b6f nằm trong màng, còn ferredoxin và enzyme FAD nằm ở phía chất nền, nơi NADP⁺ lấy H⁺ từ chất nền.'
});
prompts.push(pick('z.where.water', 'Nơi mọi thứ', 'Nước bị phân tách thành O₂ và H⁺ ở đâu?', opts([
['psii', 'Tại hệ thống quang hợp II, ở phía lòng ống.'], ['psi', 'Tại hệ thống quang hợp I, ở phía mô đệm.'],
['b6f', 'Tại cytochrome b6f, bên trong màng tế bào'], ['atps', 'Tại ATP synthase, ở phía mô đệm']
]), 'psii', [
'Hệ thống quang hợp khởi đầu con đường truyền electron là hệ thống có các electron được thay thế từ nước.',
'Các proton được giải phóng sẽ ở lại bên trong màng thylakoid.'
], 'Phức hợp Mn của hệ thống quang hợp II oxy hóa 2 H₂O thành O₂ và giải phóng 4 H⁺ vào khoang lumen.'));
prompts.push(pick('z.where.nadph', 'Nơi mọi thứ', 'Các proton được lấy từ phía nào khi NADP⁺ bị khử thành NADPH?', opts([
['stroma', 'Mô đệm'], ['lumen', 'Khoang thylakoid'], ['cyto', 'Chất tế bào bên ngoài lục lạp'], ['matrix', 'Chất nền ty thể']
]), 'stroma', [
'Enzyme tạo ra NADPH nằm cạnh ferredoxin.',
'Đây là phía mà enzyme ATP synthase tạo ra ATP.'
], 'Enzyme FAD (FNR) khử NADP⁺ bằng H⁺ từ chất nền. Sự hấp thụ H⁺ từ chất nền này là một trong những nguồn tạo ra gradient.'));
prompts.push(pick('z.where.b6f', 'Nơi mọi thứ', 'Cytochrome b6f xử lý proton như thế nào?', opts([
['up', 'Nó hấp thụ các proton từ mô đệm và giải phóng chúng vào lòng ống.'], ['down', 'Nó hấp thụ các proton từ lòng ống và giải phóng chúng vào mô đệm.'],
['make', 'Tạo ra proton bằng cách phân tách nước.'], ['none', 'Không di chuyển bất kỳ proton nào cả.']
]), 'up', [
'Phức hợp này tạo ra sự chênh lệch nồng độ chất lỏng trên màng thylakoid; nó không tiêu hao sự chênh lệch đó.',
'Số lượng proton được hấp thụ không giống với số lượng proton được giải phóng.'
], 'Cytochrome b6f hấp thụ 2 H⁺ từ chất nền và giải phóng 4 H⁺ vào lòng ống, do đó lòng ống trở nên có tính axit.'));
prompts.push(pick('z.where.atps', 'Nơi mọi thứ', 'Các proton di chuyển theo hướng nào qua enzyme ATP synthase của màng thylakoid?', opts([
['ls', 'Từ lòng mạch đến mô đệm'], ['sl', 'Từ mô đệm đến lòng mạch'],
['sc', 'Từ chất nền đến tế bào chất bên ngoài lục lạp'], ['out', 'Ra khỏi lục lạp qua màng ngoài của nó.']
]), 'ls', [
'Các proton di chuyển theo hướng dốc của chúng.',
'Các proton tích tụ ở phía mà phức hợp phân tách nước và cytochrome chiếm giữ.'
], 'Ion H⁺ di chuyển từ lòng ống đến mô đệm qua CF0-CF1 và thúc đẩy quá trình tổng hợp ADP + Pi thành ATP. Chỉ riêng sự chênh lệch nồng độ ion cũng đủ tạo ra ATP trong điều kiện tối.'));
prompts.push({
id: 'z.order.energy', kind: 'order', group: 'Mức năng lượng',
text: 'Sắp xếp chúng theo thứ tự E0′, từ giá trị âm nhất đến giá trị dương nhất (phía dưới).', figure: null,
items: [
{ id: 'p700s', label: 'P700* (hệ thống quang hợp I ở trạng thái kích thích)' }, { id: 'fd', label: 'Ferredoxin (Fd)' }, { id: 'pq', label: 'Plastoquinone (PQ)' },
{ id: 'pc', label: 'Plastocyanin (PC)' }, { id: 'p700', label: 'P700 (trạng thái cơ bản)' }, { id: 'p680', label: 'P680 (trạng thái cơ bản)' }
],
answer: ['p700s', 'fd', 'pq', 'pc', 'p700', 'p680'],
hints: [
'Trục này chạy từ -1,20 V ở phía trên đến +1,60 V ở phía dưới.',
'Electron vừa hấp thụ ánh sáng nằm gần phía trên, còn chất oxy hóa mạnh nhất nằm ở phía dưới.'
],
explain: 'Các giá trị xấp xỉ: P700* khoảng −1,1 V, ferredoxin khoảng −0,6, plastoquinone khoảng 0 đến +0,2, plastocyanin khoảng +0,5, P700 khoảng +0,7 và P680 khoảng +1,2 V (các giá trị trong sách giáo khoa đưa ra thứ tự tương tự). Electron di chuyển xuống dốc giữa các chất mang; chỉ có hai bước ánh sáng di chuyển lên dốc.'
});
prompts.push(pick('z.energy.red', 'Mức năng lượng', 'Trong số này, chất nào là chất khử mạnh nhất, chất nào có giá trị E0′ âm nhất?', opts([
['p700s', 'P700* (hệ thống quang hợp I ở trạng thái kích thích)'], ['p680s', 'P680* (hệ thống quang hợp II ở trạng thái kích thích)'],
['p700', 'P700 (trạng thái cơ bản)'], ['p680', 'P680 (trạng thái cơ bản)']
]), 'p700s', [
'Nó phải đẩy các electron đến ferredoxin và sau đó đến NADP⁺.',
'Nó được vẽ ở vị trí cao nhất của trục.'
], 'Trạng thái kích thích của P700 được vẽ phía trên trạng thái kích thích của P680 (các giá trị xấp xỉ: khoảng -1,1 đến -1,2 V so với khoảng -0,3 đến -0,4 V; các giá trị trong sách giáo khoa cho thấy trạng thái kích thích của P680 nằm gần -0,7 đến -0,8 V, vì vậy thứ tự vẫn đúng trong cả hai trường hợp). Nó là chất khử mạnh hơn: nó có thể khử ferredoxin và sau đó là NADP⁺.'));
prompts.push(pick('z.energy.ox', 'Mức năng lượng', 'Trong số này, điểm nào nằm thấp nhất trên trục, điểm nào có giá trị E0′ dương nhất?', opts([
['p680', 'P680 (hệ thống quang hợp II)'], ['p700', 'P700 (hệ thống quang hợp I)'], ['pq', 'Plastoquinone (PQ)'], ['pc', 'Plastocyanin (PC)']
]), 'p680', [
'Nó phải lấy electron từ nước, một chất khó bị oxy hóa.',
'Nó thuộc về hệ thống quang hợp khởi đầu con đường truyền electron.'
], 'P680 được vẽ ở mức điện thế thấp nhất (khoảng +1,2 V, xấp xỉ). Dạng oxy hóa của nó, P680⁺, có thể hút electron từ nước, trong khi P700⁺ (khoảng +0,7 V như trong hình) chỉ lấy electron từ plastocyanin.'));
prompts.push(pick('z.energy.light', 'Mức năng lượng', 'Sơ đồ Z cần ánh sáng ở hai bước nào?', opts([
['pp', 'P680 đến P680* và P700 đến P700*'], ['pheo', 'Pheophytin gửi đến QA và QA gửi đến QB'],
['pq', 'Plastoquinone chuyển hóa thành cytochrome b6f và cytochrome f chuyển hóa thành plastocyanin'], ['fd', 'Ferredoxin thành FNR và FNR thành NADPH']
]), 'pp', [
'Hầu hết các chặng đường giữa các hãng vận chuyển đều đi xuống dốc, nhưng hai chặng đường được liệt kê ở đây thì không.',
'Mỗi quá trình trong hai quá trình này đều đưa một electron từ vị trí thấp lên vị trí cao.'
], 'Ánh sáng tác động ở P680 và P700: mỗi hệ thống quang hợp nâng một electron từ trạng thái cơ bản lên trạng thái kích thích. Mọi bước trung gian khác giữa các hạt tải điện đều diễn ra theo chiều thuận.'));
prompts.push(pick('z.cyclic.route', 'Tuyến đường xe đạp', 'Con đường nào tạo ra ATP nhưng không tạo ra NADPH và O₂?', opts([
['cyc', 'Sự vận chuyển electron tuần hoàn xung quanh hệ thống quang hợp I'], ['non', 'Vận chuyển electron không tuần hoàn (sơ đồ Z)'],
['calvin', 'Chu trình Calvin'], ['kok', 'Chu trình Kok của phức hợp giải phóng oxy']
]), 'cyc', [
'Trong lộ trình này, electron quay trở lại chất mang mà nó đã sử dụng trước đó.',
'Nó liên quan đến hệ thống quang hợp I nhưng không liên quan đến hệ thống quang hợp II.'
], 'Các electron rời khỏi hệ thống quang hợp I quay trở lại phức hợp cytochrome b6, do đó các proton được bơm và ATP được tạo ra, nhưng không có gì khử NADP⁺ và không có nước nào bị phân tách.'));
prompts.push(pick('z.cyclic.return', 'Tuyến đường xe đạp', 'Trong quá trình vận chuyển electron tuần hoàn, các electron sẽ đi đâu sau khi rời khỏi các trung tâm sắt-lưu huỳnh của hệ quang hợp I?', opts([
['b6f', 'Trở lại cytochrome b6f'], ['nadp', 'Đến NADP⁺'], ['water', 'Để tưới nước'], ['psii', 'Đến hệ thống quang hợp II']
]), 'b6f', [
'Mũi tên nét đứt chỉ hướng đi.',
'Quá trình này kết thúc tại khu phức hợp bơm proton.'
], 'Mũi tên đứt đoạn chạy từ trung tâm sắt-lưu huỳnh FB của hệ thống quang hợp I đến cytochrome b6 và vùng Fe-S của cytochrome b6f.'));
prompts.push(pick('z.kok.light', 'Đường đi của các electron', 'Chu trình Kok cần bao nhiêu mũi tên ánh sáng trước khi một nguyên tử O₂ được giải phóng?', opts([
['four', 'Bốn'], ['one', 'Một'], ['two', 'Hai'], ['eight', 'Tám']
]), 'four', [
'Mỗi mũi tên ánh sáng loại bỏ một electron khỏi cụm mangan.',
'Hãy đếm số electron phải rời khỏi hai phân tử nước để tạo ra một nguyên tử O₂.'
], 'Chu trình diễn ra từ S0 đến S4 với bốn mũi tên sáng, mỗi mũi tên mang một electron. Bước tối sau đó giải phóng O₂ và 4 H⁺ từ 2 H₂O.'));
return { intro: 'Sơ đồ Z: đường đi của các electron, vị trí của các vật thể, độ cao của chúng và lộ trình tuần hoàn.', prompts: prompts };
}
P.games.push({
id: 'zscheme-test', title: 'Kiểm tra lược đồ Z', subtitle: 'Đường đi của các electron, vị trí của chúng, mức năng lượng và chu trình tuần hoàn.',
group: GROUP, count: 13, fixedOrder: true, build: build
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Quang hợp';
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: 'So sánh hai chuỗi', text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
function build() {
var prompts = [];
prompts.push(pick('c.pick.start', 'Chất nào là chất cho electron đầu tiên trong chuỗi chloroplast?', [
['water', 'Nước'], ['nadph', 'NADPH'], ['nadh', 'NADH'], ['fadh2', 'FADH₂']
], 'water', [
'Đây là một phân tử nhỏ rất phổ biến và khó bị oxy hóa.',
'Quá trình oxy hóa của nó giải phóng O₂ và proton.'
], 'Nước nhường electron của nó cho phức hợp Mn của hệ quang hợp II. Chuỗi ty thể bắt đầu từ NADH tại phức hợp I.'));
prompts.push(pick('c.pick.end', 'Các electron trong chuỗi lục lạp sẽ đi về đâu?', [
['nadph', 'Trong NADPH'], ['o2', 'Trong O₂'], ['atp', 'Trong ATP'], ['nadh', 'Trong NADH']
], 'nadph', [
'Các chất vận chuyển cuối cùng là ferredoxin và một loại enzyme FAD.',
'Sản phẩm là chất khử cần thiết cho chu trình Calvin.'
], 'Ferredoxin chuyển chúng đến enzyme FAD (FNR), enzyme này khử NADP⁺ bằng H⁺ từ chất nền thành NADPH. Sau đó, chu trình Calvin sử dụng NADPH.'));
prompts.push(pick('c.pick.acceptor', 'Chất nhận electron cuối cùng của chuỗi ty thể là gì?', [
['o2', 'O₂'], ['nadp', 'NADP⁺'], ['water', 'Nước'], ['co2', 'CO₂']
], 'o2', [
'Phức hợp IV truyền các electron từ không khí cho một phân tử nhỏ.',
'Sản phẩm là nước.'
], 'Phức hợp IV khử ½ O₂ với 2 e⁻ và 2 H⁺ thành H₂O. NADP⁺ là chất nhận cuối cùng của chuỗi trong lục lạp.'));
prompts.push(pick('c.pick.drive', 'Điều gì khiến các electron di chuyển qua chuỗi lục lạp mà không di chuyển qua chuỗi ty thể?', [
['light', 'Ánh sáng được hấp thụ bởi các hệ thống quang hợp'], ['nadh', 'NADH từ chu trình TCA'], ['o2', 'O₂ từ không khí'], ['atp', 'ATP từ ATP synthase']
], 'light', [
'Một chuỗi phản ứng bắt đầu với một chất cho khó bị oxy hóa, và cần có một chất khác phải trả giá cho điều đó.',
'Phản ứng tổng thể là phản ứng thu năng lượng.'
], 'Ánh sáng nâng một electron tại P680 và P700, bù lại việc lấy electron từ nước; bước tổng thể để tạo ra NADPH là phản ứng thu năng lượng. Chuỗi ty thể diễn ra theo hướng giảm năng lượng từ NADH đến O₂ khi không có ánh sáng.'));
prompts.push(pick('c.pick.space', 'Trong lục lạp, không gian nào chứa đầy proton?', [
['lumen', 'Khoang thylakoid'], ['stroma', 'Mô đệm'], ['ims', 'Khoảng không gian giữa màng của ty thể'], ['matrix', 'Chất nền ty thể']
], 'lumen', [
'Có nhiều quá trình bổ sung proton vào không gian này.',
'Nước bị phân tách ở phía này, và phức hợp cytochrome giải phóng các proton tại đây.'
], 'Quá trình phân tách nước giải phóng H⁺ vào khoang thylakoid và cytochrome b6f giải phóng thêm H⁺ ở đó; các proton quay trở lại chất nền thông qua ATP synthase. Trong ty thể, các proton tích tụ trong không gian giữa màng.'));
prompts.push({
id: 'c.sort.carriers', kind: 'sort', group: 'So sánh hai chuỗi',
text: 'Mỗi thành phần này thuộc chuỗi nào: chuỗi lục lạp hay chuỗi ty thể?', figure: null,
items: [
{ id: 'pq', label: 'Plastoquinone' }, { id: 'coq', label: 'Ubiquinone' }, { id: 'pc', label: 'Plastocyanin' }, { id: 'cytc', label: 'Cytochrome c' },
{ id: 'b6f', label: 'Phức hợp Cytochrome b6f' }, { id: 'c3', label: 'Phức hợp III' }, { id: 'psii', label: 'Hệ thống quang hợp II' }, { id: 'c1', label: 'Khu phức hợp I' }
],
buckets: [{ id: 'chl', label: 'Chuỗi lục lạp' }, { id: 'mit', label: 'Chuỗi ty thể' }],
answer: { pq: 'chl', coq: 'mit', pc: 'chl', cytc: 'mit', b6f: 'chl', c3: 'mit', psii: 'chl', c1: 'mit' },
hints: [
'Ba cặp như vậy thực hiện cùng một chức năng trong hai chuỗi.',
'Hệ thống quang hợp II là hệ thống cần ánh sáng.'
],
explain: 'Chuỗi lục lạp: plastoquinone, plastocyanin, phức hợp cytochrome b6f và hệ thống quang hợp II. Chuỗi ty thể: ubiquinone (CoQ), cytochrome c, phức hợp III và phức hợp I. Plastoquinone kết hợp với ubiquinone, plastocyanin với cytochrome c và cytochrome b6f với phức hợp III.'
});
prompts.push({
id: 'c.sort.processes', kind: 'sort', group: 'So sánh hai chuỗi',
text: 'Liệu mỗi quá trình này diễn ra trong chuỗi lục lạp, trong chuỗi ty thể, hay ở cả hai?', figure: null,
items: [
{ id: 'split', label: 'Nước bị phân tách và O₂ được tạo thành.' }, { id: 'o2', label: 'O₂ bị khử thành nước' }, { id: 'nadph', label: 'NADP⁺ bị khử thành NADPH' },
{ id: 'nadh', label: 'NADH bị oxy hóa' }, { id: 'light', label: 'Ánh sáng bị hấp thụ' }, { id: 'pump', label: 'Các proton được bơm qua màng.' },
{ id: 'synth', label: 'Sự chênh lệch nồng độ proton thúc đẩy quá trình tổng hợp ATP.' }, { id: 'quin', label: 'Quinone mang electron giữa các phức chất.' }
],
buckets: [{ id: 'chl', label: 'Chuỗi lục lạp' }, { id: 'mit', label: 'Chuỗi ty thể' }, { id: 'both', label: 'Cả hai chuỗi' }],
answer: { split: 'chl', o2: 'mit', nadph: 'chl', nadh: 'mit', light: 'chl', pump: 'both', synth: 'both', quin: 'both' },
hints: [
'Hãy nghĩ xem các electron đến từ đâu và chúng sẽ đi đến đâu trong mỗi chuỗi.',
'Một số phần của hai chuỗi này có cùng ý tưởng ở hai vị trí khác nhau.'
],
explain: 'Chuỗi ATP trong lục lạp bắt đầu từ nước và kết thúc ở NADPH, được thúc đẩy bởi ánh sáng. Chuỗi ATP trong ty thể bắt đầu từ NADH (Phức hợp I) và kết thúc ở O₂. Cả hai đều tạo ra ATP từ gradient proton và cả hai đều truyền electron qua quinone. (Câu hỏi đề cập đến hai chuỗi này: tế bào cũng khử NADP⁺ trong ty thể và O₂ trong lục lạp bằng các con đường khác.)'
});
return { intro: 'Chuỗi (màng thylakoid) đối diện với chuỗi (màng trong ty thể).', prompts: prompts };
}
P.games.push({
id: 'chloroplast-mito', title: 'Lục lạp hoặc ty thể', subtitle: 'Từng người vận chuyển một: chuỗi này đấu với chuỗi khác.',
group: GROUP, count: 7, fixedOrder: true, build: build
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Quang hợp';
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: 'Chu kỳ', text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
function field(key, label, answer, max) { return { key: key, label: label, answer: answer, step: 1, min: 0, max: max || 60 }; }
function number(id, group, text, fields, hints, explain) {
return { id: id, kind: 'number', group: group, text: text, figure: null, fields: fields, hints: hints, explain: explain };
}
function build() {
var prompts = [];
prompts.push(pick('l.pick.fix', 'Enzyme nào cố định CO₂ trong chu trình Calvin?', [
['rubisco', 'RuBisCO (ribulose bisphosphate carboxylase/oxygenase)', ['rubisco']], ['pgk', 'Phosphoglycerate kinase'], ['prk', 'Phosphoribulose kinase'], ['tk', 'Transketolase']
], 'rubisco', [
'Đây là bước 1 của Bảng 22.1.',
'Nó bổ sung CO₂ vào một loại đường bisphosphate có năm nguyên tử carbon.'
], 'RuBisCO thực hiện phản ứng cacboxyl hóa ribulose 1,5-bisphosphate và sản phẩm của nó tách thành hai phân tử 3-phosphoglycerate. Đây là bước đầu tiên trong Bảng 22.1.'));
prompts.push({
id: 'l.sort.spend', kind: 'sort', group: 'Bước nào tốn bao nhiêu chi phí?',
text: 'Bước nào trong chu trình Calvin sử dụng ATP, bước nào sử dụng NADPH, và bước nào không sử dụng cả hai?', figure: null,
items: [
{ id: 'pgk', label: 'Phosphoglycerate kinase (bước 2)' }, { id: 'gapdh', label: 'G3P dehydrogenase, phụ thuộc NADP (bước 3)' },
{ id: 'prk', label: 'Phosphoribulose kinase (bước 15)' }, { id: 'rubisco', label: 'RuBisCO (bước 1)' },
{ id: 'ald', label: 'Aldolase (bước 5)' }, { id: 'tk', label: 'Transketolase (bước 9)' }, { id: 'fbp', label: 'Fructose bisphosphatase (bước 6)' }
],
buckets: [{ id: 'atp', label: 'Sử dụng ATP' }, { id: 'nadph', label: 'Sử dụng NADPH' }, { id: 'none', label: 'Không sử dụng' }],
answer: { pgk: 'atp', gapdh: 'nadph', prk: 'atp', rubisco: 'none', ald: 'none', tk: 'none', fbp: 'none' },
hints: [
'Hai kinase và một dehydrogenase chịu toàn bộ chi phí của chu trình.',
'Bước cố định CO₂ không sử dụng cả hai chất đó.'
],
explain: 'Bảng 22.1: 3-phosphoglycerate được phosphoryl hóa bằng ATP (bước 2), 1,3-bisphosphoglycerate được khử bằng NADPH (bước 3) và ribulose 5-phosphate được phosphoryl hóa bằng ATP (bước 15). Quá trình carboxyl hóa, các aldolase, transketolase và phosphatase không sử dụng ATP.'
});
prompts.push({
id: 'l.order.cycle', kind: 'order', group: 'Chu kỳ',
text: 'Hãy sắp xếp các bước của chu trình Calvin theo đúng thứ tự, từ CO₂ đến chất nhận được tái tạo.', figure: null,
items: [
{ id: 'rubisco', label: 'RuBisCO cố định CO₂ trên RuBP' }, { id: 'pgk', label: 'Phosphoglycerate kinase: 3-PG + ATP tạo ra 1,3-BPG' },
{ id: 'gapdh', label: 'G3P dehydrogenase: 1,3-BPG + NADPH tạo ra G3P' }, { id: 'tk', label: 'Transketolase sắp xếp lại các nhóm phosphate đường.' },
{ id: 'epi', label: 'Phosphopentose epimerase tạo ra ribulose 5-phosphate' }, { id: 'prk', label: 'Phosphoribulose kinase: Ru5P + ATP tạo ra RuBP' }
],
answer: ['rubisco', 'pgk', 'gapdh', 'tk', 'epi', 'prk'],
hints: [
'Bước cố định diễn ra trước, sau đó là các bước tạo ra triose phosphate.',
'Chu trình kết thúc bằng việc tạo ra lại phân tử ban đầu.'
],
explain: 'Bảng 22.1: RuBisCO (bước 1), phosphoglycerate kinase (2), G3P dehydrogenase (3), các transketolase (9 và 12), phosphopentose epimerase (13) và phosphoribulose kinase (15), chất này lại tạo ra RuBP.'
});
prompts.push(number('l.num.pga', 'Sổ cái', 'Sáu phân tử RuBP hấp thụ một phân tử CO₂. Hỏi có bao nhiêu phân tử 3-phosphoglycerate?', [
field('n', '3-PG', 12)
], [
'Một phản ứng cacboxyl hóa tách chất trung gian sáu carbon mới thành hai phần bằng nhau.',
'Nhân số lượng phản ứng cacboxyl hóa với số lượng sản phẩm mà mỗi phản ứng tạo ra.'
], 'RuBP + CO₂ + H₂O tạo ra hai 3-phosphoglycerate, do đó sáu phản ứng cacboxyl hóa tạo ra mười hai (bước 1 của Bảng 22.1: 6 CO₂ + 6 RuBP tạo ra 12 3-PG).'));
prompts.push(number('l.num.regen', 'Sổ cái', 'Mười hai phân tử G3P được tạo ra từ một phân tử glucose (từ 6 phân tử CO₂). Hỏi có bao nhiêu phân tử được sử dụng để tái tạo RuBP, và bao nhiêu phân tử rời đi để tạo ra glucose?', [
field('regen', 'Tái tạo RuBP', 10), field('leave', 'Để tạo glucose', 2)
], [
'Đếm số nguyên tử carbon: chất nhận có năm nguyên tử carbon, trong khi cần sáu nguyên tử.',
'Glucose có sáu nguyên tử carbon, còn G3P có ba.'
], 'Trong số 12 G3P, 10 (30 nguyên tử carbon) tái tạo 6 RuBP (30 nguyên tử carbon) và 2 (6 nguyên tử carbon) tạo ra một phân tử glucose.'));
prompts.push(number('l.num.glucose', 'Sổ cái', 'Chu trình Calvin sử dụng bao nhiêu ATP và bao nhiêu NADPH để tạo ra một phân tử glucose từ 6 CO₂?', [
field('atp', 'ATP', 18), field('nadph', 'NADPH', 12)
], [
'Đếm số lần mỗi bước tiêu tốn năng lượng được thực hiện trong toàn bộ chu kỳ.',
'Bảng 22.1 đưa ra phương trình tổng quát cho một phân tử glucose.'
], 'Để tạo ra một phân tử glucose, phản ứng gồm 6 CO₂ + 18 ATP + 12 NADPH + 12 H⁺ + 12 H₂O sẽ tạo ra glucose + 18 ADP + 18 Pi + 12 NADP⁺. Mười hai ATP và mười hai NADPH được sử dụng ở bước 2 và 3, và sáu ATP được sử dụng ở bước 15.'));
prompts.push(number('l.num.half', 'Sổ cái', 'Hãy xem xét chu trình trao đổi 3 CO₂. Chu trình này tiêu thụ bao nhiêu ATP và bao nhiêu NADPH?', [
field('atp', 'ATP', 9), field('nadph', 'NADPH', 6)
], [
'Đó là một nửa chu trình hoàn chỉnh của glucose.',
'Cộng lượng ATP thu được ở giai đoạn khử với lượng ATP thu được ở giai đoạn tái tạo.'
], 'Với 3 CO₂, 6 ATP ở giai đoạn khử (bao gồm bước 2, quá trình phosphoryl hóa nhờ ATP, và bước 3, quá trình khử nhờ NADPH) cộng với 3 ATP ở giai đoạn tái tạo tạo thành 9 ATP, với 6 NADPH. Nhân đôi tất cả sẽ cho 18 ATP và 12 NADPH trên mỗi phân tử glucose, như Bảng 22.1 đã nêu.'));
prompts.push(number('l.num.co2', 'Sổ cái', 'Với mỗi phân tử CO₂ được cố định, chu trình sử dụng bao nhiêu ATP và bao nhiêu NADPH?', [
field('atp', 'ATP', 3), field('nadph', 'NADPH', 2)
], [
'Chia chi phí sản xuất một phân tử glucose cho lượng CO₂ cần thiết để sản xuất ra nó.',
'Chi phí thường được tính trên mỗi phân tử glucose, chứ không phải trên mỗi phân tử CO₂.'
], 'Tính theo CO₂: 18 ÷ 6 = 3 ATP và 12 ÷ 6 = 2 NADPH.'));
return { intro: 'Chu trình Calvin trong Bảng 22.1: chất nào cố định CO₂, chất nào tiêu thụ ATP và NADPH, thứ tự các bước và số lượng chất tham gia.', prompts: prompts };
}
P.games.push({
id: 'calvin-ledger', title: 'Chu trình Calvin: máy phân loại và sổ cái', subtitle: 'Các bước nào tiêu tốn ATP và NADPH, thứ tự thực hiện và số lượng cho mỗi phân tử glucose.',
group: GROUP, count: 8, fixedOrder: true, build: build
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Quang hợp';
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: 'Con đường C4', text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
var ENZYMES = [
['pepc', 'PEP carboxylase'], ['mdh', 'Malate dehydrogenase'], ['me', 'Enzyme malic'], ['ppdk', 'Pyruvate phosphate dikinase']
];
function build() {
var prompts = [];
prompts.push(pick('r.pick.pepc', 'Enzyme nào tạo ra oxaloacetate từ PEP và CO₂?', ENZYMES, 'pepc', [
'Nó gắn CO₂ vào chất nhận ba nguyên tử carbon mà không cần ATP.',
'Sản phẩm của nó có bốn nguyên tử carbon và một nhóm phosphat được giải phóng.'
], 'PEP carboxylase: PEP + CO₂ tạo ra oxaloacetate + Pi.'));
prompts.push(pick('r.pick.mdh', 'Enzyme nào khử oxaloacetate thành malate với sự có mặt của NADPH?', ENZYMES, 'mdh', [
'Nó sử dụng chất mang bị khử và trả lại dạng bị oxy hóa.',
'Sản phẩm của nó là axit bốn cacbon có khả năng xuyên qua thành tế bào.'
], 'Malate dehydrogenase: oxaloacetate + NADPH + H⁺ tạo ra L-malate + NADP⁺.'));
prompts.push(pick('r.pick.me', 'Enzyme nào giải phóng CO₂ mà chu trình Calvin sử dụng trong thực vật C4?', ENZYMES, 'me', [
'Nó hoạt động bên trong tế bào và tạo ra chất mang bị khử trong quá trình hoạt động.',
'Nó biến đổi axit bốn cacbon thành axit ba cacbon.'
], 'Enzyme malic: L-malate + NADP⁺ tạo ra pyruvate + CO₂ + NADPH + H⁺. NADPH được tạo ra sẽ tham gia vào chu trình Calvin.'));
prompts.push(pick('r.pick.ppdk', 'Enzyme nào tổng hợp PEP từ pyruvate và do đó tiêu tốn ATP?', ENZYMES, 'ppdk', [
'Nó hoạt động ở tế bào ngoài, sau khi pyruvate đã quay trở lại.',
'Nó phân giải ATP thành AMP và pyrophosphate.'
], 'Pyruvate phosphate dikinase: pyruvate + ATP + Pi tạo ra PEP + AMP + PPi. Sau khi pyrophosphate bị phân tách, lượng ATP thu được tương đương khoảng hai phân tử, đây là chi phí phát sinh thêm của con đường C4.'));
prompts.push(pick('r.pick.carrier', 'Phân tử nào vận chuyển cacbon cố định từ tế bào mô lá đến tế bào bao bó mạch?', [
['malate', 'L-malate'], ['oaa', 'Oxaloacetate'], ['pep', 'PEP'], ['rubp', 'Ribulose 1,5-bisphosphate']
], 'malate', [
'Đây là một axit bốn cacbon vừa được khử.',
'Quá trình oxy hóa của nó trong tế bào bên trong giải phóng CO₂.'
], 'Malate đi qua thành tế bào, và enzyme malic sau đó khử carboxyl nó. Oxaloacetate được khử thành malate trước khi đi qua thành tế bào.'));
prompts.push({
id: 'r.sort.cells', kind: 'sort', group: 'Con đường C4',
text: 'Mỗi bước diễn ra ở tế bào nào của lá C4?', figure: null,
items: [
{ id: 'pepc', label: 'PEP carboxylase tạo ra oxaloacetate' }, { id: 'mdh', label: 'Malate dehydrogenase tạo ra malate' },
{ id: 'me', label: 'Enzyme malic giải phóng CO₂ từ malate' }, { id: 'calvin', label: 'RuBisCO và chu trình Calvin sử dụng CO₂' },
{ id: 'ppdk', label: 'Pyruvate phosphate dikinase tạo ra PEP' }
],
buckets: [{ id: 'meso', label: 'Tế bào mô lá' }, { id: 'bs', label: 'Tế bào bao bó' }],
answer: { pepc: 'meso', mdh: 'meso', me: 'bs', calvin: 'bs', ppdk: 'meso' },
hints: [
'Các tế bào bên ngoài tiếp xúc với không khí; các tế bào bên trong giữ chu trình Calvin.',
'Malate được tạo ra trong một tế bào và bị phân giải trong tế bào khác.'
],
explain: 'CO₂ từ không khí đi vào PEP trong tế bào mô mềm (PEP carboxylase), oxaloacetate được khử thành malate ở đó (malate dehydrogenase), và malate đi vào tế bào bao bó mạch. Tại đó, enzyme malic giải phóng CO₂ cho chu trình Calvin và tạo ra pyruvate, chất này quay trở lại tế bào mô mềm nơi pyruvate phosphate dikinase tạo ra PEP một lần nữa. Do đó, tế bào mô mềm cố định CO₂ thành các axit bốn carbon và tái tạo PEP; tế bào bao bó mạch duy trì chu trình Calvin.'
});
prompts.push({
id: 'r.order.relay', kind: 'order', group: 'Con đường C4',
text: 'Đặt rơle C4 theo đúng thứ tự, từ CO₂ trong không khí trở lại PEP.', figure: null,
items: [
{ id: 'in', label: 'CO₂ đi vào tế bào mô lá' }, { id: 'pepc', label: 'PEP carboxylase: PEP + CO₂ tạo ra oxaloacetate' },
{ id: 'mdh', label: 'Malate dehydrogenase: oxaloacetate + NADPH tạo ra malate' }, { id: 'cross', label: 'Malate di chuyển vào tế bào bao bó mạch.' },
{ id: 'me', label: 'Enzyme malic: malate tạo ra pyruvate + CO₂' }, { id: 'back', label: 'Pyruvate di chuyển trở lại tế bào mô lá.' },
{ id: 'ppdk', label: 'Pyruvate phosphate dikinase: pyruvate + ATP + Pi tạo ra PEP' }
],
answer: ['in', 'pepc', 'mdh', 'cross', 'me', 'back', 'ppdk'],
hints: [
'Quá trình chuyển tiếp bắt đầu với CO₂ trong không khí và kết thúc ở nơi nó bắt đầu: với chất nhận ba nguyên tử carbon.',
'Axit đi qua có bốn nguyên tử cacbon, còn axit quay trở lại có ba nguyên tử cacbon.'
],
explain: 'Chu trình diễn ra theo thứ tự sau: CO₂ đi vào, PEP carboxylase, malate dehydrogenase, malate vận chuyển qua thành tế bào, malic enzyme (CO₂ được giải phóng sẽ đi vào chu trình Calvin), pyruvate vận chuyển ngược trở lại, và pyruvate phosphate dikinase, enzyme này tạo ra PEP, AMP và pyrophosphate.'
});
prompts.push(pick('r.pick.gain', 'Trong điều kiện nào thì con đường C4 hoạt động tốt hơn con đường C3?', [
['hot', 'Hạn hán, nắng nóng hoặc nồng độ CO₂ thấp'], ['cold', 'Thời tiết lạnh và ẩm ướt'], ['dark', 'Bóng tối'], ['same', 'Nó hoạt động tốt hơn trong mọi điều kiện.']
], 'hot', [
'Bộ phận chuyển tiếp này cung cấp CO₂ cho chu trình Calvin thay vì để nó khuếch tán.',
'Hãy nghĩ xem khí khổng hoạt động như thế nào khi nguồn nước khan hiếm.'
], 'Chu trình C4 (Hatch-Slack) vận chuyển CO₂ đến chu trình Calvin trong tế bào bao bó mạch và hoạt động tốt hơn trong điều kiện hạn hán, nhiệt độ cao và nồng độ CO₂ thấp. Chu trình này cần ATP, được sử dụng để tái tạo PEP, chứ không phải để vận chuyển CO₂. Tên gọi C3 và C4 đề cập đến sản phẩm đầu tiên có ba carbon và bốn carbon.'));
return { intro: 'Chu trình C4: hai loại tế bào, bốn enzyme và sự chuyển tiếp carbon.', prompts: prompts };
}
P.games.push({
id: 'c4-relay', title: 'Rơle C4', subtitle: 'Loại enzyme nào, tế bào nào, theo thứ tự nào, và thực vật C4 thu được lợi ích gì?',
group: GROUP, count: 8, fixedOrder: true, build: build
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Nitơ và nucleotide';
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, group, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: group, text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
function order(id, group, text, items, hints, explain) {
return {
id: id, kind: 'order', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), answer: items.map(function (x) { return x[0]; }), hints: hints, explain: explain
};
}
function sort(id, group, text, items, buckets, answer, hints, explain) {
return {
id: id, kind: 'sort', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), buckets: buckets.map(function (b) { return { id: b[0], label: b[1] }; }),
answer: answer, hints: hints, explain: explain
};
}
function number(id, group, text, fields, hints, explain) {
return { id: id, kind: 'number', group: group, text: text, figure: null, fields: fields, hints: hints, explain: explain };
}
function wireBuild() {
var G = 'Sắp xếp lại lối đi';
var prompts = [];
prompts.push(order('w.cori', G, 'Hãy sắp xếp các bước của chu trình Cori theo đúng thứ tự, bắt đầu từ nhóm cơ đang hoạt động.', [
['gly', 'Quá trình đường phân chuyển hóa glucose thành pyruvate trong cơ bắp.'], ['red', 'Pyruvate được khử thành lactate trong cơ bắp.'],
['up', 'Lactate di chuyển qua máu đến gan.'], ['ox', 'Lactate được oxy hóa thành pyruvate trong gan.'],
['gng', 'Quá trình tân tạo glucose chuyển hóa pyruvate thành glucose trong gan.'], ['down', 'Glucose di chuyển qua máu trở lại cơ bắp.']
], [
'Chu trình bắt đầu với glucose trong cơ bắp và kết thúc cũng với glucose trong cơ bắp.',
'Axit lactic phải đến gan thì gan mới có thể xử lý nó.'
], 'Trong cơ bắp, glucose chuyển hóa thành 2 pyruvate và sau đó là 2 lactate. Lactate đi vào máu đến gan, nơi nó chuyển hóa thành 2 pyruvate và sau đó là glucose, rồi glucose quay trở lại cơ bắp. Lactate dehydrogenase là enzyme tham gia vào hai bước chuyển hóa pyruvate-lactate này.'));
prompts.push(order('w.cahill', G, 'Sắp xếp các bước của chu trình glucose-alanine theo đúng thứ tự, bắt đầu từ protein cơ bắp.', [
['prot', 'Protein cơ bắp được phân giải thành các axit amin.'], ['glu', 'Các nhóm amino được tập hợp trên glutamate.'],
['alt1', 'ALT trong cơ bắp chuyển nhóm amino của glutamate sang pyruvate, tạo ra alanine.'], ['ala', 'Alanine di chuyển qua máu đến gan.'],
['alt2', 'ALT trong gan chuyển nhóm amino trở lại alpha-ketoglutarate, tạo ra glutamate và pyruvate.'],
['gng', 'Quá trình tân tạo glucose chuyển hóa pyruvate thành glucose.'], ['glc', 'Glucose di chuyển qua máu trở lại cơ bắp.']
], [
'Các nhóm amino di chuyển trước và glucose di chuyển trở lại sau cùng.',
'Pyruvate phải được chuyển hóa thành alanine trong cơ bắp trước khi alanine có thể rời khỏi cơ thể.'
], 'Protein cung cấp axit amin và glutamate, ALT tạo ra alanine và alpha-ketoglutarate trong cơ bắp, alanine đi đến gan, nơi ALT lại tạo ra pyruvate và glutamate, pyruvate chuyển hóa thành glucose thông qua quá trình tân tạo glucose, và glucose quay trở lại cơ bắp. Trong gan, glutamate cũng cung cấp NH4+ cho chu trình urê.'));
prompts.push(order('w.transam', G, 'Sắp xếp các bước của phản ứng chuyển hóa amin với PLP theo đúng thứ tự.', [
['int', 'PLP và một lysine tại vị trí hoạt động tạo thành aldimine nội tại, một bazơ Schiff.'], ['ext', 'Chất nền thay thế cho lysine: aldimine ngoại bào.'],
['quin', 'Nguyên tử alpha bị mất đi và chất trung gian quinonoid được hình thành.'], ['ket', 'Một proton được thêm vào vị trí C4′ và ketimine được hình thành.'],
['pmp', 'Quá trình thủy phân giải phóng axit keto và tạo ra PMP.'], ['glu', 'PMP cung cấp nhóm amino của nó cho alpha-ketoglutarate, tạo ra glutamate và khôi phục aldimine nội tại.']
], [
'Enzyme này bắt đầu với coenzyme liên kết với lysine và kết thúc cũng theo cách tương tự.',
'Chất nền phải liên kết với coenzyme trước khi một proton có thể rời khỏi nguyên tử carbon alpha của nó.'
], 'Theo sơ đồ thông thường, các bước 1a và 1b (aldimine nội), 2a đến 2c (aldimine ngoại), 3 (quinonoid), 4 (ketimine) và 5 (thủy phân thành PMP và axit keto). Ở nửa sau, alpha-ketoglutarate lấy nhóm amino từ PMP (các bước tương tự nhưng ngược lại).'));
prompts.push(order('w.ppp', G, 'Hãy sắp xếp các bước của chu trình pentose phosphate theo đúng thứ tự, bắt đầu từ glucose 6-phosphate.', [
['ox1', 'Glucose 6-phosphate bị oxy hóa thành este vòng và NADPH đầu tiên được tạo thành.'], ['lac', 'Este vòng được thủy phân thành 6-phosphogluconate'],
['ox3', '6-Phosphogluconate mất CO2 và tạo thành ribulose 5-phosphate và NADPH thứ hai.'],
['iso', 'Ribulose 5-phosphate được đồng phân hóa thành ribose 5-phosphate và đồng phân lập thể thành xylulose 5-phosphate.'],
['tk1', 'Transketolase tạo ra sedoheptulose 7-phosphate và glyceraldehyde 3-phosphate'], ['ta', 'Transaldolase tạo ra erythrose 4-phosphate và fructose 6-phosphate'],
['tk2', 'Transketolase tạo ra fructose 6-phosphate và glyceraldehyde 3-phosphate từ xylulose 5-phosphate và erythrose 4-phosphate.']
], [
'Hai phân tử NADPH được tạo ra trước khi bất kỳ đường nào được sắp xếp lại.',
'Đường có bảy nguyên tử carbon được tạo ra trước đường có bốn nguyên tử carbon.'
], 'Theo sơ đồ thông thường, các bước 1 đến 3 là pha oxy hóa (hai NADPH và một CO2), bước 4 và 5 tạo ra ribose 5-phosphate và xylulose 5-phosphate, bước 6 là transketolase (hai nguyên tử carbon), bước 7 là transaldolase (ba nguyên tử carbon) và bước 8 lại là transketolase.'));
prompts.push(order('w.purine', G, 'Sắp xếp các chất trung gian của quá trình tổng hợp purine theo thứ tự, bắt đầu từ PRPP và kết thúc bằng nucleotide purine đầu tiên.', [
['pra', 'Phosphoribosylamine (PRA)'], ['gar', 'Glycinamide ribonucleotide (GAR)'], ['fgar', 'Formylglycinamide ribonucleotide (FGAR)'],
['fgam', 'Ribonucleotide formylglycinamidine (FGAM)'], ['air', '5-Aminoimidazole ribonucleotide (AIR)'], ['cair', 'Carboxyaminoimidazole ribonucleotide (CAIR)'],
['saicar', 'SAICAR'], ['aicar', 'AICAR'], ['faicar', 'FAICAR'], ['imp', 'Inosine monophosphate (IMP)']
], [
'Vòng được xây dựng trên đường, từng mảnh một, và mảnh đầu tiên là một nguyên tử nitơ đơn lẻ.',
'Vòng năm thành viên khép lại trước vòng sáu thành viên.'
], 'PRPP tạo ra PRA, GAR, FGAR, FGAM, AIR (vòng imidazole đóng lại), CAIR, SAICAR, AICAR (fumarate tách ra), FAICAR và IMP (vòng thứ hai đóng lại).'));
prompts.push(order('w.pyr', G, 'Sắp xếp các chất trung gian của quá trình tổng hợp pyrimidine theo thứ tự từ carbamoyl phosphate đến UMP.', [
['cp', 'Carbamoyl phosphate'], ['casp', 'Carbamoyl aspartate'], ['dho', 'Dihydroorotate'], ['oro', 'Orotate'], ['omp', 'Orotidine 5′-monophosphate (OMP)'], ['ump', 'Uridine monophosphate (UMP)']
], [
'Vòng được tạo hình trước khi cho đường vào.',
'Nguyên tử bazơ có liên kết đôi nhờ quá trình oxy hóa, còn đường được tạo ra từ PRPP.'
], 'CPS II tạo ra carbamoyl phosphate, ATCase thêm aspartate, dihydroorotase đóng vòng (dihydroorotate), DHO dehydrogenase tạo ra orotate, orotate phosphoribosyltransferase thêm ribose phosphate từ PRPP (OMP), và OMP decarboxylase tạo ra UMP.'));
prompts.push(order('w.urea', G, 'Sắp xếp các bước của chu trình urê theo đúng thứ tự, từ NH4+ đến urê.', [
['cps', 'CPS I tạo ra carbamoyl phosphate từ NH4+, bicarbonate và hai ATP.'], ['otc', 'Ornithine transcarbamylase tạo ra citrulline từ carbamoyl phosphate và ornithine.'],
['carrier', 'Citrulline rời khỏi chất nền ty thể và ornithine đi vào đó.'], ['ass', 'Argininosuccinate synthetase kết hợp với citrulline và aspartate, cùng với ATP.'],
['asl', 'Argininosuccinate lyase phân giải argininosuccinate thành arginine và fumarate.'], ['arg', 'Arginase thủy phân arginine thành urê và ornithine.']
], [
'Hai bước đầu tiên diễn ra trong chất nền ty thể và ba bước cuối cùng diễn ra trong bào tương.',
'Axit amin rời khỏi ma trận là sản phẩm của bước thứ hai.'
], 'Chu trình urê diễn ra thông qua CPS I, ornithine transcarbamylase, các chất vận chuyển, argininosuccinate synthetase (bước 2a và 2b), argininosuccinate lyase (bước 3) và arginase (bước 4).'));
return { intro: 'Những con đường này là các chu kỳ và chuỗi các bước nhỏ. Hãy sắp xếp từng bước theo đúng thứ tự.', prompts: prompts };
}
function ringBuild() {
var G = 'Các nguyên tử của vòng purin và pyrimidin';
var prompts = [];
var SRC = [
['gly', 'Glycine'], ['asp', 'Aspartate'], ['gln', 'Glutamine (nitơ amit của nó)', ['glutamine']],
['co2', 'CO2 (bicarbonat)', ['co2', 'bicarbonate', 'hco3']], ['fthf', 'N10-formyl-THF', ['formyl-thf']]
];
prompts.push(pick('r.c6', G, 'Phân tử nào cung cấp nguyên tử cacbon số 6 của vòng purin?', SRC, 'co2', [
'Nó mang một nguyên tử carbon duy nhất.',
'Nó được thêm vào vòng đầu tiên dưới dạng nhóm carboxylate, ở bước sau khi vòng đóng lại.'
], 'CO2 tạo ra C6. Đối với vòng purin, enzyme của người (AIR carboxylase) tự lấy CO2, trong khi vòng pyrimidin lấy bicarbonate thông qua CPS II.'));
prompts.push(pick('r.n1', G, 'Phân tử nào cung cấp nguyên tử nitơ số 1 của vòng purin?', SRC, 'asp', [
'Đây là một axit amin có hai nhóm carboxyl.',
'Bộ khung cacbon của nó lại tách ra dưới dạng fumarat.'
], 'Aspartate cung cấp N1. Khung carbon của nó bị cắt đứt dưới dạng fumarate trong bước tạo ra AICAR.'));
prompts.push(pick('r.n3', G, 'Phân tử nào cung cấp nitơ số 3 và số 9 của vòng purin?', SRC, 'gln', [
'Nó cung cấp nguyên tử nitơ của một amit, và nó làm như vậy hai lần.',
'Nó là một trong những axit amin vận chuyển nitơ từ mô này sang mô khác.'
], 'Nitơ amit của glutamine tạo ra N3 và N9, và glutamine tách ra dưới dạng glutamat.'));
prompts.push(pick('r.c4', G, 'Phân tử nào cung cấp các nguyên tử cacbon 4 và 5 và nguyên tử nitơ 7 của vòng purin?', SRC, 'gly', [
'Cả ba nguyên tử đều xuất phát từ một phân tử nhỏ, nằm liền kề nhau.',
'Nó là axit amin nhỏ nhất.'
], 'Glycine cung cấp C4, C5 và N7. Nó là khung chính của vòng benzen.'));
prompts.push(pick('r.c2', G, 'Coenzyme nào cung cấp cacbon số 2 và số 8 của vòng purin?', SRC, 'fthf', [
'Nó mang các đơn vị cacbon một ở mức độ oxy hóa của axit fomic.',
'Nó được sử dụng hai lần, trong các bước gắn nhóm formyl vào chuỗi.'
], 'N10-formyl-THF cung cấp C2 và C8. THF có nguồn gốc từ folate, và vitamin B12 tái chế nó.'));
prompts.push(pick('r.pc2', G, 'Phân tử nào cung cấp nguyên tử cacbon số 2 của vòng pyrimidine?', SRC, 'co2', [
'Nó tham gia vào bước đầu tiên của chu trình, cùng với glutamine và hai phân tử ATP.',
'Đó là cùng một loại cacbon vô cơ tạo nên C6 của vòng purin.'
], 'CO2 tạo ra C2 thông qua carbamoyl phosphate.'));
prompts.push(pick('r.pn3', G, 'Phân tử nào cung cấp nitơ số 3 của vòng pyrimidine, thông qua carbamoyl phosphate?', SRC, 'gln', [
'Bước đầu tiên là nó cung cấp nguyên tử nitơ của một amit.',
'CPS II sử dụng nó, còn CPS I của chu trình urê thì không.'
], 'Glutamine cung cấp một nhóm amin. Nó tham gia vào phản ứng đầu tiên (CPS II), đánh số nó là N3 trong carbamoyl phosphate, và cuối cùng nó trở thành N3 của vòng.'));
prompts.push(pick('r.pasp', G, 'Axit amin nào là thành phần chính tạo nên vòng pyrimidine?', SRC, 'asp', [
'Đây cũng là axit amin cung cấp nguyên tử nitơ thứ hai của urê.',
'Nó kết hợp với carbamoyl phosphate ở bước thứ hai.'
], 'Aspartate là khung chính: nó cung cấp N1 và các nguyên tử carbon từ 4 đến 6 của vòng.'));
prompts.push(number('r.count.purine', G, 'Vòng purin có bao nhiêu nguyên tử cacbon và bao nhiêu nguyên tử nitơ?', [
{ key: 'c', label: 'Cacbon', answer: 5, step: 1, min: 0, max: 12 }, { key: 'n', label: 'Nitơ', answer: 4, step: 1, min: 0, max: 12 }
], [
'Chiếc vòng này có chín nguyên tử nằm trong hai vòng liên kết với nhau.',
'Có nhiều nguyên tử carbon hơn nguyên tử nitơ, nhưng không nhiều lắm.'
], 'Vòng này có chín nguyên tử: năm nguyên tử cacbon (C2, C4, C5, C6 và C8) và bốn nguyên tử nitơ (N1, N3, N7 và N9).'));
prompts.push(number('r.count.pyr', G, 'Vòng pyrimidine có bao nhiêu nguyên tử carbon và bao nhiêu nguyên tử nitơ?', [
{ key: 'c', label: 'Cacbon', answer: 4, step: 1, min: 0, max: 12 }, { key: 'n', label: 'Nitơ', answer: 2, step: 1, min: 0, max: 12 }
], [
'Vòng này có sáu nguyên tử trong một vòng duy nhất.',
'Số lượng nguyên tử carbon gấp đôi số lượng nguyên tử nitơ.'
], 'Vòng này có sáu nguyên tử: bốn nguyên tử cacbon (C2 và C4 đến C6) và hai nguyên tử nitơ (N1 và N3).'));
prompts.push(sort('r.sort', G, 'Trong số này, chất nào cung cấp nguyên tử chỉ cho vòng purin, chỉ cho vòng pyrimidin, hay cho cả hai vòng?', [
['gly', 'Glycine'], ['fthf', 'N10-formyl-THF'], ['cp', 'Carbamoyl phosphate'], ['gln', 'Glutamine'], ['asp', 'Aspartate'], ['co2', 'CO2']
], [['pur', 'Chỉ có vòng purin'], ['pyr', 'Chỉ có vòng pyrimidine'], ['both', 'Cả hai chiếc nhẫn']], {
gly: 'pur', fthf: 'pur', cp: 'pyr', gln: 'both', asp: 'both', co2: 'both'
}, [
'Chỉ cần hai trong số chúng khi chiếc vòng được xây trên đường.',
'Ba trong số chúng cung cấp nguyên tử cho cả hai vòng.'
], 'Glycine và các nhóm formyl của N10-formyl-THF chỉ thuộc vòng purine; carbamoyl phosphate chỉ là phần khởi đầu của vòng pyrimidine; glutamine, aspartate và CO2 cung cấp nguyên tử cho cả hai vòng.'));
return { intro: 'Vòng purin được cấu tạo từ đường gồm năm nguồn khác nhau, vòng pyrimidin từ ba nguồn. Hãy tìm nguồn gốc của mỗi nguyên tử.', prompts: prompts };
}
function enzymeBuild() {
var G = 'Năm loại enzyme quan trọng trong quá trình chuyển hóa axit amin';
var prompts = [];
var FIVE = [
['alt', 'Alanine aminotransferase (ALT)'], ['ast', 'Aspartate aminotransferase (AST)'], ['gdh', 'Glutamate dehydrogenase (GDH)'],
['gs', 'Glutamine synthetase'], ['gln', 'Glutaminase']
];
prompts.push(pick('e.alt', G, 'Enzyme nào chuyển nhóm amino của alanin sang alpha-ketoglutarat, chất tạo ra pyruvat và glutamat?', FIVE, 'alt', [
'Nó hoạt động nhờ một loại coenzyme được tạo ra từ vitamin B6.',
'Enzyme chị em của nó cũng thực hiện điều tương tự với axit amin bốn carbon có hai nhóm carboxyl.'
], 'ALT thực hiện việc hoán đổi nhóm C=O và nhóm NH2 giữa alanine và alpha-ketoglutarate, với PLP ở vị trí hoạt động. Nồng độ ALT huyết thanh cao (bình thường từ 7 đến 56 IU/L) cho thấy gan bị tổn thương.'));
prompts.push(pick('e.ast', G, 'Enzyme nào chuyển nhóm amino của aspartate sang alpha-ketoglutarate, tạo ra oxaloacetate và glutamate?', FIVE, 'ast', [
'Nó hoạt động với cùng một coenzyme như enzyme xử lý alanine.',
'Lysine tại vị trí hoạt động của nó là Lys258.'
], 'AST chuyển nhóm amino từ aspartate sang alpha-ketoglutarate thông qua PLP và PMP. Nó cũng cung cấp aspartate cho chu trình urê và tham gia vào quá trình vận chuyển malate-aspartate. Giá trị bình thường của nó trong huyết thanh là từ 5 đến 40 IU/L.'));
prompts.push(pick('e.gdh', G, 'Enzyme nào giải phóng NH4+ tự do từ glutamate và tạo ra alpha-ketoglutarate?', FIVE, 'gdh', [
'Nó oxy hóa nguyên tử carbon mang nhóm amino, do đó coenzyme nicotinamide sẽ nhận các electron.',
'Quá trình này cũng diễn ra theo chiều ngược lại, và sau đó nó tạo ra một axit amin từ NH4+ và một axit keto.'
], 'Glutamate dehydrogenase tạo ra glutamate từ NH4+, alpha-ketoglutarate và NADPH, và giải phóng NH4+ từ glutamate theo chiều ngược lại. Enzyme này chấp nhận NAD+ hoặc NADP+.'));
prompts.push(pick('e.gs', G, 'Enzyme nào kết hợp NH4+ với glutamate để tạo thành glutamine?', FIVE, 'gs', [
'Nó tiêu hao nguồn năng lượng của tế bào.',
'Nhóm carboxyl của chuỗi bên được hoạt hóa trước, sau đó NH4+ sẽ thay thế nhóm hoạt hóa.'
], 'Enzyme glutamine synthetase tạo ra glutamine từ NH4+, glutamate và ATP (ADP và Pi được giải phóng), thông qua gamma-glutamyl phosphate. Chín chất ức chế phản hồi tác động lên enzyme này.'));
prompts.push(pick('e.gln', G, 'Enzyme nào cắt liên kết amide của glutamine và giải phóng NH3 và glutamate?', FIVE, 'gln', [
'Nó không cần ATP.',
'Nó sử dụng một phân tử nước để phá vỡ liên kết amit.'
], 'Glutaminase thủy phân amit (glutamine + H2O tạo ra glutamate + NH3).'));
prompts.push(pick('e.plp', G, 'ALT và AST cần loại coenzyme nào?', [
['plp', 'Pyridoxal phosphate (PLP)', ['plp', 'vitamin B6']], ['tpp', 'Thiamine pyrophosphate (TPP)'], ['biotin', 'Biotin'], ['fad', 'FAD'], ['nad', 'NAD+']
], 'plp', [
'Nó được tạo ra từ vitamin nhóm B và mang các nhóm amino.',
'Nhóm aldehyde của nó được khoanh tròn, và nó tạo thành liên kết Schiff với một lysine của enzyme.'
], 'Các transaminase cần pyridoxal phosphate, dạng hoạt động của vitamin B6. Nhóm amino của chất nền sẽ gắn vào aldehyde của nó sau khi lysine tại vị trí hoạt động bị thay thế.'));
prompts.push(pick('e.liver', G, 'Kết quả xét nghiệm máu cho thấy chỉ số ALT và AST cao. Điều này gợi ý điều gì?', [
['liver', 'Tổn thương gan hoặc tim'], ['kidney', 'Sỏi thận'], ['iron', 'Thiếu sắt'], ['normal', 'Không có gì: đây là các giá trị bình thường.']
], 'liver', [
'Cả hai loại enzyme này đều nằm bên trong tế bào và rò rỉ vào máu khi tế bào bị tổn thương.',
'Giá trị bình thường trong huyết thanh là khoảng 56 và 40 IU/L.'
], 'Nồng độ ALT hoặc AST cao cho thấy tổn thương gan hoặc tim; giá trị bình thường là từ 7 đến 56 IU/L đối với ALT và từ 5 đến 40 IU/L đối với AST, và tỷ lệ AST/ALT giúp phân biệt các bệnh khác nhau.'));
prompts.push(pick('e.ratio', G, 'Tỷ lệ AST/ALT nào cho thấy bệnh gan do rượu?', [
['gt2', 'Trên 2'], ['one', 'Khoảng 1'], ['lt05', 'Dưới 0,5'], ['zero', 'Chính xác là 0']
], 'gt2', [
'Tỷ lệ này có giá trị khác nhau tùy thuộc vào từng loại bệnh.',
'Tỷ lệ này là giá trị AST chia cho giá trị ALT, tức là nó cho biết giá trị nào trong hai giá trị đó tăng nhiều hơn.'
], 'Tỷ lệ AST/ALT trên 2 cho thấy bệnh gan do rượu (trên 0,8 đến 1 trong trường hợp xơ gan hoặc xơ hóa gan, trên 2,2 trong bệnh Wilson thể tối cấp và trên 3 ở giai đoạn đầu của bệnh lý cơ xương khớp).'));
prompts.push(sort('e.sort', G, 'Mỗi trong năm loại enzyme cần loại coenzyme hoặc chất mang năng lượng nào?', [
['alt', 'ALT'], ['ast', 'AST'], ['gdh', 'Glutamate dehydrogenase'], ['gs', 'Glutamine synthetase'], ['gln', 'Glutaminase']
], [['plp', 'PLP (vitamin B6)'], ['nad', 'NAD+ hoặc NADP+'], ['atp', 'ATP'], ['none', 'Không có coenzyme, chỉ có nước.']], {
alt: 'plp', ast: 'plp', gdh: 'nad', gs: 'atp', gln: 'none'
}, [
'Hai trong số chúng cần cùng một loại coenzyme, và ba loại còn lại cần một loại khác nhau.',
'Một trong số đó là một loại hydrolase thông thường.'
], 'Hai enzyme transaminase cần PLP; glutamate dehydrogenase cần NAD+ hoặc NADP+; glutamine synthetase cần ATP; glutaminase thủy phân amide bằng nước.'));
return { intro: 'Năm loại enzyme vận chuyển nitơ: hai enzyme chuyển hóa amin, hai enzyme xử lý glutamine và một enzyme giải phóng NH4+.', prompts: prompts };
}
function ureaBuild() {
var G = 'Rối loạn chu trình urê';
var prompts = [];
var CYCLE = [
['cps1', 'Carbamoyl phosphate synthetase I (CPS I)'], ['otc', 'Ornithine transcarbamylase (OTC)'], ['ass', 'Argininosuccinate synthetase (ASS)'],
['asl', 'Argininosuccinate lyase (ASL)'], ['arg', 'Arginase']
];
prompts.push(pick('u.cps1', G, 'Trẻ sơ sinh không thể tạo ra carbamoyl phosphate: NH4+ tích tụ và trẻ bú kém, bị co giật. Enzyme nào bị khiếm khuyết?', CYCLE, 'cps1', [
'Đây là enzyme đầu tiên của chu trình và hoạt động trong chất nền ty thể.',
'Nó sử dụng hai phân tử ATP và được kích hoạt bởi N-acetylglutamate.'
], 'Carbamoyl phosphate là điểm khởi đầu của quá trình đưa nitơ vào chu trình, vì vậy khiếm khuyết ở CPS I cho phép NH4+ tích tụ.'));
prompts.push(pick('u.otc', G, 'Khiếm khuyết nào khiến carbamoyl phosphate không thể truyền nhóm carbamoyl của nó cho ornithine?', CYCLE, 'otc', [
'Nó hoạt động trong chất nền ty thể, giống như enzyme đầu tiên.',
'Tên gọi của nó cho cả nhóm biết rằng nó di chuyển.'
], 'Đột biến gen OTC ngăn cản quá trình chuyển nitơ vào chu trình, do đó NH4+ tích tụ. Thiếu hụt OTC là bệnh liên kết nhiễm sắc thể X và carbamoyl phosphate tràn vào quá trình tổng hợp pyrimidine, gây ra bệnh orotic aciduria.'));
prompts.push(pick('u.ass', G, 'Enzyme nào bị khiếm khuyết trong bệnh citrullinemia loại I?', CYCLE, 'ass', [
'Nó kết hợp với citrulline và aspartate và tiêu thụ ATP.',
'Nó hoạt động trong bào tương và đi qua citrullyl-AMP.'
], 'Đột biến ASS (từ bố mẹ) gây tích tụ NH4+, ăn uống kém, nôn mửa và tử vong nếu không được điều trị; các phương pháp điều trị bao gồm chế độ ăn ít protein, lọc máu và ghép gan. Bước 2a và 2b tạo ra citrullyl-AMP và sau đó là argininosuccinate.'));
prompts.push(pick('u.citrin', G, 'Bệnh citrullinemia loại II có khiếm khuyết gì?', [
['citrin', 'Citrin, một loại protein vận chuyển ty thể'], ['ass', 'Argininosuccinate synthetase'], ['otc', 'Ornithine transcarbamylase'], ['arg', 'Arginase']
], 'citrin', [
'Loại protein bị lỗi này không phải là một enzyme của chu trình.',
'Nó vận chuyển một chất nào đó qua màng ty thể.'
], 'Khiếm khuyết này là do đột biến ở protein citrin, một protein tham gia vào quá trình vận chuyển trong ty thể. Citrin là chất vận chuyển aspartate-glutamate của màng trong ty thể.'));
prompts.push(pick('u.asl', G, 'Enzyme nào bị thiếu khi argininosuccinate không thể bị phân giải thành arginine và fumarate?', CYCLE, 'asl', [
'Nó là một loại lyase, và nó hoạt động trong bào tương.',
'Trẻ sơ sinh hay nôn trớ, và trẻ lớn hơn có thể bị tóc dễ gãy rụng.'
], 'Đột biến gen ASL ngăn cản sự hình thành arginine; trẻ sơ sinh bị nôn mửa và có khuyết tật về trí tuệ, trẻ lớn hơn có sự phát triển tóc bất thường (tóc dễ gãy) và chậm phát triển, phương pháp điều trị là chế độ ăn ít protein và benzoate.'));
prompts.push(pick('u.benz', G, 'Natri benzoat giúp ích như thế nào trong các rối loạn chu trình urê?', [
['hip', 'Nó kết hợp với glycine để tạo thành hippurate, chất này vận chuyển nitơ ra ngoài qua nước tiểu.'], ['gut', 'Nó ngăn chặn ruột sản sinh ra NH4+'],
['act', 'Nó kích hoạt enzyme carbamoyl phosphate synthetase.'], ['urea', 'Nó chuyển NH4+ thành urê']
], 'hip', [
'Ngựa bài tiết nitơ theo cách này.',
'Nguyên tử nitơ thoát ra là một trong những axit amin nhỏ nhất.'
], 'Benzoat được gắn vào glycin, tạo ra axit hippuric, sản phẩm bài tiết nitơ trong nước tiểu ngựa. Trong cơ thể, benzoyl-CoA kết hợp với glycin.'));
prompts.push(pick('u.treat', G, 'Những phương pháp điều trị nào được sử dụng cho bệnh thiếu hụt carbamoyl phosphate synthetase I?', [
['diet', 'Chế độ ăn ít protein và lọc máu'], ['abx', 'Thuốc kháng sinh và phẫu thuật'], ['iron', 'Sắt và vitamin B12'], ['ins', 'Insulin']
], 'diet', [
'Cả hai phương pháp điều trị đều làm giảm lượng nitơ trong cơ thể.',
'Một trong số chúng có chức năng lọc máu.'
], 'Chế độ ăn uống và lọc máu là hai phương pháp điều trị chính. Thuốc loại bỏ nitơ (benzoat và phenylaxetat) và ghép gan cũng được sử dụng.'));
prompts.push(sort('u.sort', G, 'Mỗi enzyme trong chu trình urê hoạt động ở đâu?', [
['cps1', 'CPS I'], ['otc', 'OTC'], ['ass', 'ASS'], ['asl', 'ASL'], ['arg', 'Arginase']
], [['mat', 'Trong chất nền ty thể'], ['cyt', 'Trong bào tương']], { cps1: 'mat', otc: 'mat', ass: 'cyt', asl: 'cyt', arg: 'cyt' }, [
'Chu trình bắt đầu từ nơi nitơ đi vào và kết thúc ở nơi urê được tạo ra.',
'Hai trong số năm người đó nằm trong ma trận.'
], 'CPS I và OTC hoạt động trong chất nền ty thể; ASS, ASL và arginase hoạt động trong bào tương. Citrulline và ornithine đi qua màng trong nhờ các chất vận chuyển.'));
return { intro: 'Chu trình urê là cách gan loại bỏ nitơ. Khi một loại enzyme bị lỗi, NH4+ sẽ tích tụ.', prompts: prompts };
}
P.games.push({
id: 'wire-nitrogen', title: 'Nối dây điện cho đường dẫn', subtitle: 'Sắp xếp các bước của chu trình nitơ hoặc nucleotide theo đúng thứ tự.',
group: GROUP, count: 5, build: wireBuild
});
P.games.push({
id: 'ring-atoms', title: 'Các nguyên tử của vòng', subtitle: 'Nguồn gốc của mỗi nguyên tử trong vòng purin và vòng pyrimidin đến từ đâu?',
group: GROUP, count: 11, fixedOrder: true, build: ringBuild
});
P.games.push({
id: 'five-enzymes', title: 'Năm loại enzyme quan trọng', subtitle: 'ALT, AST, GDH, glutamine synthetase và glutaminase',
group: GROUP, count: 9, fixedOrder: true, build: enzymeBuild
});
P.games.push({
id: 'urea-disorders', title: 'Rối loạn chu trình urê', subtitle: 'Enzyme nào bị lỗi, natri benzoat và các phương pháp điều trị',
group: GROUP, count: 8, fixedOrder: true, build: ureaBuild
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Truyền tín hiệu tế bào';
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, group, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: group, text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
function order(id, group, text, items, hints, explain) {
return {
id: id, kind: 'order', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), answer: items.map(function (x) { return x[0]; }), hints: hints, explain: explain
};
}
function sort(id, group, text, items, buckets, answer, hints, explain) {
return {
id: id, kind: 'sort', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), buckets: buckets.map(function (b) { return { id: b[0], label: b[1] }; }),
answer: answer, hints: hints, explain: explain
};
}
function number(id, group, text, fields, hints, explain) {
return { id: id, kind: 'number', group: group, text: text, figure: null, fields: fields, hints: hints, explain: explain };
}
function wildBuild() {
var G = 'Hệ thống tín hiệu hoạt động hỗn loạn';
var prompts = [];
prompts.push(pick('g.proto', G, 'Proto-oncogene là gì?', [
['normal', 'Gen bình thường có protein thúc đẩy sự tăng trưởng hoặc phân chia; đột biến có thể biến nó thành gen gây ung thư.'],
['always', 'Một gen gây ung thư trong mọi tế bào mang gen đó.'], ['stop', 'Một gen có protein ngăn chặn sự phân chia tế bào.'],
['virus', 'Một gen chỉ có ở virus.']
], 'normal', [
'Mỗi tế bào khỏe mạnh đều có những gen này và cần chúng.',
'Tiền tố này có nghĩa là trước: đó là trạng thái của gen trước khi có bất kỳ sự cố nào xảy ra.'
], 'Gen tiền ung thư là gen bình thường mã hóa protein tín hiệu thúc đẩy sự tăng trưởng hoặc phân chia tế bào (RAS, Src, HER2 và ABL là những ví dụ). Các chất gây ung thư, bức xạ hoặc virus làm tổn thương DNA, và phiên bản đột biến hoặc biểu hiện quá mức, gọi là gen ung thư, sẽ thúc đẩy sự phát triển của tế bào ung thư.'));
prompts.push(pick('g.change', G, 'Những loại thay đổi nào có thể biến một tiền gen gây ung thư thành một gen gây ung thư?', [
['three', 'Sự thay đổi về cấu trúc hoặc chức năng của protein, sự biểu hiện quá mức của protein, hoặc sự sắp xếp lại như sự hợp nhất gen.'],
['loss', 'Chỉ khi mất toàn bộ gen thì mới xảy ra hiện tượng này.'], ['methyl', 'Chỉ có sự methyl hóa DNA của nó'], ['telo', 'Chỉ có telomere dài hơn']
], 'three', [
'Hãy nghĩ đến RAS, HER2 và BCR-ABL: mỗi loại đều gặp trục trặc theo một cách khác nhau.',
'Bản thân protein có thể thay đổi, lượng protein có thể thay đổi, hoặc gen có thể được kết hợp với một gen khác.'
], 'Có ba loại thay đổi: đột biến làm biến đổi protein (RAS, Src), thay đổi biểu hiện dẫn đến sản sinh quá nhiều protein bình thường (HER2), và sự sắp xếp lại nhiễm sắc thể làm hợp nhất hai gen (BCR-ABL).'));
prompts.push(pick('g.ras', G, 'Loại đột biến nào khiến RAS trở thành gen gây ung thư?', [
['point', 'Đột biến điểm làm thay đổi một axit amin tại codon 12, 13 hoặc 61 và ngăn chặn hoạt động của GTPase.'],
['fusion', 'Một sự chuyển vị làm hợp nhất gen RAS với một gen khác.'], ['copies', 'Bản sao bổ sung của gen'], ['del', 'Sự xóa bỏ gen']
], 'point', [
'Protein vẫn được sản xuất với số lượng bình thường; chỉ có một axit amin gần nucleotide bị sai.',
'Công tắc vẫn có thể được bật, nhưng không thể tự tắt được nữa.'
], 'RAS gây ung thư mang một sự thay đổi axit amin duy nhất tại codon 12, 13 hoặc 61 (các điểm nóng; glycine 12 là phổ biến nhất). Khi đó, GTPase bị chặn, RAS vẫn liên kết với GTP và tiếp tục truyền tín hiệu phân chia tế bào: đây là sự thay đổi về cấu trúc và chức năng, chứ không phải về số lượng.'));
prompts.push(pick('g.srcoff', G, 'Src là một tyrosine kinase chứ không phải là một thụ thể. Điều gì khiến Src bình thường bị tắt?', [
['ctail', 'Sự phosphoryl hóa tyrosine ở đầu C của nó, nơi mà miền SH2 của chính nó liên kết, làm cho kinase bị đóng lại.'],
['gtp', 'Thủy phân GTP của nó'], ['dimer', 'Sự dimer hóa với Src thứ hai'], ['camp', 'Mức độ cAMP cao']
], 'ctail', [
'Src không có cơ chế chuyển đổi nucleotide và không có phối tử bên ngoài tế bào.',
'Trạng thái tắt được duy trì bởi một nhóm phosphate trên đuôi ở một đầu của protein, liên kết với một miền của cùng một protein đó.'
], 'Một kinase (Csk) phosphoryl hóa tyrosine điều hòa ở đầu C (Tyr527 trong Src gà, Tyr530 trong Src người); miền SH2 liên kết với phosphotyrosine đó và kinase gập lại. Sự phosphoryl hóa tyrosine còn lại, trong vòng hoạt hóa (Tyr416), bật Src, vì vậy "sự phosphoryl hóa làm tắt Src" chỉ đúng với tyrosine ở đuôi.'));
prompts.push(pick('g.srcon', G, 'Sự thay đổi nào khiến Src trở thành một gen gây ung thư?', [
['tail', 'Mất hoặc đột biến tyrosine điều hòa ở đầu C, do đó Src không thể bị tắt nữa.'],
['kd', 'Mất đi miền kinase của nó'], ['atp', 'Một đột biến khiến nó không thể liên kết với ATP.'], ['more', 'Một miền SH2 thứ hai']
], 'tail', [
'Dạng gây ung thư luôn hoạt động, chứ không phải là không bao giờ hoạt động.',
'Dạng virus của gen này thiếu phần đuôi mang công tắc tắt.'
], 'Nếu thiếu tyrosine điều hòa (v-Src của virus gây ung thư Rous thiếu toàn bộ đuôi C-terminal), miền SH2 sẽ không có gì để giữ, kinase vẫn mở và hoạt động, và quá trình phân chia được kích thích liên tục.'));
prompts.push(pick('g.her2', G, 'HER2 là một họ hàng của thụ thể EGF. Điều gì khiến nó có khả năng gây ung thư trong một số trường hợp ung thư vú, ung thư buồng trứng và ung thư dạ dày?', [
['expr', 'Biểu hiện quá mức: có quá nhiều bản sao của một thụ thể bình thường, chúng kết cặp và truyền tín hiệu mà không cần yếu tố tăng trưởng.'],
['point', 'Một đột biến điểm làm tắc nghẽn GTPase'], ['fusion', 'Sự kết hợp với BCR'], ['loss', 'Mất gen']
], 'expr', [
'Bản thân protein đó bình thường.',
'Với số lượng thụ thể rất lớn trên màng tế bào, chúng tự gặp nhau và ghép cặp.'
], 'HER2 được khuếch đại và biểu hiện quá mức ở khoảng 1/5 trường hợp ung thư vú và ở một số trường hợp ung thư buồng trứng, dạ dày và tử cung. Nó không có phối tử riêng; khi lượng HER2 quá nhiều, các thụ thể sẽ kết hợp thành dimer mà không cần EGF và tiếp tục phát tín hiệu phân chia tế bào. Đây là sự thay đổi về biểu hiện, chứ không phải về protein.'));
prompts.push(pick('g.herceptin', G, 'Herceptin (trastuzumab) là gì và nó liên kết với vị trí nào trên cơ thể?', [
['mab', 'Một kháng thể đơn dòng liên kết với phần HER2 nằm bên ngoài tế bào.'],
['small', 'Một phân tử nhỏ ngăn chặn vị trí gắn ATP của HER2.'], ['egf', 'Một kháng thể hấp thụ EGF'], ['pde', 'Một loại thuốc ức chế phosphodiesterase']
], 'mab', [
'Nó là một loại protein, không phải là một phân tử nhỏ, vì vậy nó không thể đi vào bên trong tế bào.',
'Nó được sử dụng để chống lại thụ thể được sản xuất với số lượng quá nhiều.'
], 'Trastuzumab là một kháng thể đơn dòng chống lại miền ngoại bào (phân vùng IV) của HER2. Người ta thường nói rằng nó ngăn ngừa sự dimer hóa, nhưng đó là nhiệm vụ của một kháng thể thứ hai, pertuzumab (phân vùng II); trastuzumab hoạt động chủ yếu bằng cách chặn tín hiệu HER2, kéo thụ thể ra khỏi bề mặt tế bào và đánh dấu tế bào đó cho hệ thống miễn dịch.'));
prompts.push(pick('g.chrom', G, 'Hai nhiễm sắc thể nào trao đổi các đoạn gen để tạo thành gen hợp nhất BCR-ABL?', [
['922', '9 và 22'], ['921', '9 và 21'], ['22x', '22 và X'], ['1114', '11 và 14']
], '922', [
'Một trong hai nhiễm sắc thể đó là nhiễm sắc thể thường nhỏ thứ hai của con người.',
'ABL xuất phát từ nhiễm sắc thể dài hơn trong hai nhiễm sắc thể, còn BCR xuất phát từ nhiễm sắc thể ngắn hơn.'
], 'Sự chuyển đoạn Philadelphia nối gen ABL từ nhiễm sắc thể 9 với gen BCR trên nhiễm sắc thể 22; nhiễm sắc thể 22 bị rút ngắn mang gen BCR-ABL chính là nhiễm sắc thể Philadelphia, dấu hiệu của bệnh bạch cầu tủy mãn tính (CML).'));
prompts.push(pick('g.imatinib', G, 'Imatinib (Gleevec) điều trị bệnh bạch cầu tủy mãn tính như thế nào?', [
['atp', 'Đó là một phân tử nhỏ chiếm vị trí liên kết ATP của kinase BCR-ABL.'],
['mab', 'Đây là kháng thể chống lại protein dung hợp.'], ['cut', 'Nó cắt nhiễm sắc thể Philadelphia thành hai phần.'], ['ras', 'Nó ngăn chặn GTPase của RAS.']
], 'atp', [
'Enzyme kinase không thể phosphoryl hóa bất cứ thứ gì nếu không có ATP.',
'Thuốc này đủ nhỏ để đi vào tế bào và nằm gọn trong một khoang của enzyme.'
], 'Imatinib là một chất ức chế tyrosine kinase: nó liên kết với vị trí gắn ATP của kinase ABL ở dạng không hoạt động, do đó protein dung hợp không thể phosphoryl hóa các mục tiêu của nó. Thuốc này đã biến bệnh bạch cầu mãn tính (CML) từ một căn bệnh gây tử vong thành một căn bệnh có thể kiểm soát được; sự kháng thuốc đến từ các đột biến trong vị trí gắn ATP.'));
prompts.push(order('g.order.cml', G, 'Hãy sắp xếp câu chuyện về bệnh bạch cầu tủy mãn tính theo trình tự, từ nhiễm sắc thể đến thuốc điều trị.', [
['break', 'Nhiễm sắc thể số 9 và số 22 bị đứt và hoán đổi đầu mút cho nhau.'],
['fusion', 'Gen BCR của nhiễm sắc thể 22 được nối với gen ABL của nhiễm sắc thể 9: nhiễm sắc thể Philadelphia.'],
['protein', 'Protein lai vẫn giữ lại tyrosine kinase ABL nhưng mất đi cơ chế điều hòa bình thường của nó.'],
['signal', 'Kinase liên tục phát tín hiệu phân chia, khiến các tế bào bạch cầu nhân lên không kiểm soát.'],
['drug', 'Imatinib ngăn chặn vị trí ATP của kinase hợp nhất và tín hiệu bị dừng lại.']
], [
'Hãy bắt đầu từ DNA, sau đó là protein, rồi đến tế bào, và cuối cùng là phương pháp điều trị.',
'Một loại kinase chỉ có thể hoạt động tự do khi protein lai đã hình thành.'
], 'Sự chuyển vị tương hỗ giữa nhiễm sắc thể 9 và 22 tạo ra nhiễm sắc thể Philadelphia với gen hợp nhất BCR-ABL; protein của nó là một tyrosine kinase luôn hoạt động, thúc đẩy bệnh bạch cầu; imatinib (Gleevec) nằm trong vị trí liên kết ATP của kinase ABL và làm tắt hoạt động của nó.'));
prompts.push(number('g.num', G, 'Tỷ lệ phần trăm ung thư tuyến tụy mang đột biến RAS là bao nhiêu, và tỷ lệ phần trăm bệnh bạch cầu tủy mãn tính mang đột biến BCR-ABL là bao nhiêu?', [
{ key: 'ras', label: 'Tỷ lệ phần trăm các trường hợp ung thư tuyến tụy có đột biến gen RAS', answer: 90, step: 1, min: 0, max: 100 },
{ key: 'bcr', label: '% bệnh nhân CML có BCR-ABL', answer: 95, step: 1, min: 0, max: 100 }
], [
'Cả hai đều là đa số lớn: trong mỗi bệnh, gần như mọi trường hợp đều mang đột biến đó.',
'Cả hai tỷ lệ đều trên 85%, và tỷ lệ mắc bệnh bạch cầu còn cao hơn.'
], 'Đột biến RAS (KRAS) được tìm thấy ở khoảng 90% trường hợp ung thư tuyến tụy và khoảng một phần năm tổng số các loại ung thư; BCR-ABL được tìm thấy ở khoảng 95% trường hợp bệnh bạch cầu tủy mãn tính.'));
prompts.push(sort('g.sort.kind', G, 'Sự thay đổi nào đã biến mỗi gen này thành gen gây ung thư?', [
['ras', 'RAS với đột biến codon 12'], ['src', 'Src không có tyrosine ở đầu C của nó'], ['her2', 'HER2 trong tế bào ung thư vú'], ['bcr', 'BCR-ABL trong bệnh bạch cầu tủy mãn tính']
], [['struct', 'Protein bị biến đổi (về cấu trúc hoặc chức năng)'], ['expr', 'Quá nhiều một loại protein bình thường (biểu hiện)'], ['fusion', 'Hai gen hợp nhất do sự chuyển vị']], {
ras: 'struct', src: 'struct', her2: 'expr', bcr: 'fusion'
}, [
'Hai trong số bốn protein này có một axit amin bị sai hoặc thiếu.',
'Một trong số đó là một loại protein bình thường nhưng lại có số lượng bản sao quá nhiều.'
], 'RAS và Src là các protein bị biến đổi (một axit amin sai, một tyrosine bị thiếu); HER2 là một thụ thể bình thường được tạo ra với số lượng bản sao quá nhiều; BCR-ABL là sự hợp nhất của hai gen được tạo ra bởi một sự chuyển vị.'));
prompts.push(sort('g.sort.proto', G, 'Gen tiền ung thư hay gen ung thư?', [
['ras0', 'Hệ thống renin-angiotensin (RAS) thủy phân GTP và tự tắt.'], ['ras1', 'RAS với glycine 12 được thay thế không có khả năng thủy phân GTP'],
['src0', 'Src với tyrosine ở đuôi được phosphoryl hóa và gập lại.'], ['src1', 'Src đã mất tyrosine ở đuôi.'],
['her0', 'HER2 ở mức bình thường trong màng tế bào'], ['her1', 'HER2 có quá nhiều bản sao, tự ghép đôi với nhau.'],
['abl0', 'ABL trên nhiễm sắc thể 9, dưới sự điều hòa riêng của nó.'], ['abl1', 'BCR-ABL trên nhiễm sắc thể Philadelphia']
], [['proto', 'Gen tiền ung thư (bình thường)'], ['onco', 'Gen gây ung thư']], {
ras0: 'proto', ras1: 'onco', src0: 'proto', src1: 'onco', her0: 'proto', her1: 'onco', abl0: 'proto', abl1: 'onco'
}, [
'Proto-oncogene là phiên bản bình thường; protein của nó có thể bị vô hiệu hóa.',
'Bất cứ thứ gì không thể tắt đi, hoặc tồn tại với số lượng quá nhiều, đều là gen gây ung thư.'
], 'Các phiên bản bình thường có thể được tắt: RAS bằng GTPase của nó, Src bằng nhóm phosphate ở đuôi, HER2 bằng cách thiếu đối tác, ABL bằng vùng điều hòa riêng của nó. Các phiên bản gây ung thư đã mất đi sự kiểm soát đó: RAS không có GTPase, Src không có đuôi, HER2 biểu hiện quá mức và sự hợp nhất BCR-ABL.'));
return { intro: 'Các protein thúc đẩy sự tăng trưởng và phân chia là những protein gây ra ung thư khi chúng không thể bị ức chế.', prompts: prompts };
}
P.games.push({
id: 'gone-wild', title: 'Hệ thống tín hiệu hoạt động hỗn loạn', subtitle: 'Các gen gây ung thư: RAS, Src, HER2 kết hợp với Herceptin và BCR-ABL kết hợp với imatinib',
group: GROUP, count: 13, fixedOrder: true, build: wildBuild
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Truyền tín hiệu tế bào';
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, group, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: group, text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
function order(id, group, text, items, hints, explain) {
return {
id: id, kind: 'order', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), answer: items.map(function (x) { return x[0]; }), hints: hints, explain: explain
};
}
function sort(id, group, text, items, buckets, answer, hints, explain) {
return {
id: id, kind: 'sort', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), buckets: buckets.map(function (b) { return { id: b[0], label: b[1] }; }),
answer: answer, hints: hints, explain: explain
};
}
function number(id, group, text, fields, hints, explain) {
return { id: id, kind: 'number', group: group, text: text, figure: null, fields: fields, hints: hints, explain: explain };
}
function networkBuild() {
var G = 'Thụ thể và hormone';
var prompts = [];
var RECEPTORS = [
['gpcr', 'Một thụ thể liên kết với protein G', ['gpcr', 'thụ thể liên kết protein g']], ['rtk', 'Một thụ thể tyrosine kinase', ['rtk']],
['cyt', 'Một thụ thể cytokine'], ['int', 'Một integrin'], ['nr', 'Một thụ thể hạt nhân']
];
prompts.push(order('h.order.axis', G, 'Hãy điều chỉnh lại trục tuyến thượng thận, từ não bộ đến hệ thống phản hồi.', [
['cns', 'Tín hiệu căng thẳng từ hệ thần kinh truyền đến vùng dưới đồi.'],
['crf', 'Vùng dưới đồi giải phóng CRF (yếu tố giải phóng corticotropin).'],
['acth', 'Tuyến yên trước đáp lại bằng cách tiết ra ACTH.'],
['adrenal', 'ACTH kích thích vỏ thượng thận tiết ra glucocorticoid.'],
['target', 'Các glucocorticoid tác động lên gan và cơ bắp.'],
['fb', 'Các glucocorticoid tác động ngược trở lại và làm chậm hoạt động của vùng dưới đồi và tuyến yên.']
], [
'Chuỗi phản ứng này bắt đầu từ não bộ, đi qua hai tuyến nội tiết đến các mô.',
'Tuyến yên cần một yếu tố kích hoạt trước khi có thể tiết ra hormone của chính nó, và phản hồi ngược là bước cuối cùng.'
], 'Hệ thần kinh, vùng dưới đồi (CRF), tuyến yên trước (ACTH), vỏ thượng thận (cortisol và các glucocorticoid khác), các mô đích và phản hồi âm tính lên vùng dưới đồi và tuyến yên. Trục tuyến giáp (TRF, TSH, thyroxine) và trục tuyến sinh dục (GnRF, FSH và LH, androgen và estrogen) hoạt động theo cùng một cách.'));
prompts.push(pick('h.anterior', G, 'Tuyến yên trước tiết ra những hormone nào?', [
['ant', 'ACTH, TSH, FSH, LH và hormone tăng trưởng'], ['post', 'Vasopressin và oxytocin'], ['hyp', 'CRF, TRF, GnRF và GRF'], ['end', 'Cortisol, thyroxine và estrogen']
], 'ant', [
'Chúng là các hormone tác động lên các tuyến khác (vỏ thượng thận, tuyến giáp, tuyến sinh dục) và xương.',
'Mỗi chất được giải phóng để đáp ứng với một yếu tố kích hoạt từ vùng dưới đồi.'
], 'Tuyến yên trước tiết ra ACTH (đến vỏ thượng thận), TSH (đến tuyến giáp), FSH và LH (đến buồng trứng và tinh hoàn) và hormone tăng trưởng (đến xương và các mô khác); prolactin cũng nằm trong danh sách này. Các yếu tố giải phóng CRF, TRF, GnRF và GRF đến từ vùng dưới đồi, còn vasopressin và oxytocin đến từ tuyến yên sau.'));
prompts.push(pick('h.posterior', G, 'Hai loại hormone nào được giải phóng từ thùy sau tuyến yên, được truyền đến bởi các xung thần kinh từ vùng dưới đồi?', [
['vo', 'Vasopressin và oxytocin'], ['at', 'ACTH và TSH'], ['fl', 'FSH và LH'], ['eg', 'Epinephrine và glucagon']
], 'vo', [
'Chúng được tạo ra ngay trong vùng dưới đồi và di chuyển dọc theo các sợi thần kinh.',
'Một cơ quan điều chỉnh cân bằng nước, cơ quan còn lại điều hòa tiết sữa và co bóp tử cung.'
], 'Vasopressin (điều hòa cân bằng nước) và oxytocin (kích thích tiết sữa, co thắt tử cung) được sản xuất bởi các tế bào thần kinh của vùng dưới đồi và được giải phóng từ các đầu tận cùng của chúng ở thùy sau tuyến yên; không có yếu tố giải phóng nào tham gia vào quá trình này.'));
prompts.push(pick('h.steroidwhy', G, 'Tại sao hormone steroid có thể sử dụng thụ thể bên trong tế bào, trong khi insulin cần thụ thể ở màng tế bào?', [
['lipid', 'Steroid là lipid và có thể xuyên qua màng lipid; insulin là một polypeptide và không thể xuyên qua màng lipid.'],
['size', 'Steroid có kích thước lớn hơn insulin.'], ['charge', 'Insulin không mang điện tích, còn steroid thì mang điện tích.'], ['pump', 'Một cái bơm vận chuyển steroid vào tế bào.']
], 'lipid', [
'Hãy nghĩ xem lớp màng lipid kép cho phép những chất nào đi qua.',
'Một trong hai loại hormone này được tạo ra từ cholesterol.'
], 'Steroid (và hormone tuyến giáp) có kích thước nhỏ và kỵ nước, do đó chúng khuếch tán qua màng tế bào đến các thụ thể trong bào tương hoặc nhân tế bào, hoạt động như các yếu tố phiên mã. Polypeptide và catecholamine tan trong nước và nằm bên ngoài, vì vậy các thụ thể của chúng nằm ở màng sinh chất và truyền tín hiệu vào bên trong thông qua các chất truyền tin thứ cấp.'));
prompts.push(pick('h.gpcr', G, 'Loại thụ thể nào khởi đầu con đường tín hiệu thông qua protein G, adenylate cyclase, PKA và CREB?', RECEPTORS, 'gpcr', [
'Hormone, chemokine và chất dẫn truyền thần kinh đều sử dụng nó.',
'Nó là một bó các xoắn ốc xuyên màng truyền tín hiệu đến một phức hợp ba tiểu đơn vị alpha, beta và gamma.'
], 'Các thụ thể liên kết với protein G (ví dụ như thụ thể beta-adrenergic và glucagon) kích hoạt protein G; Gs alpha kích hoạt adenylate cyclase, cAMP giải phóng PKA, và PKA phosphoryl hóa CREB, một yếu tố phiên mã, cũng như các enzyme chuyển hóa.'));
prompts.push(pick('h.jak', G, 'Các cytokine liên kết với các thụ thể không có miền kinase riêng. Cặp nào sẽ truyền tín hiệu của chúng đến nhân tế bào?', [
['jak', 'Các kinase JAK và các yếu tố phiên mã STAT', ['jak', 'stat', 'jak stat']], ['ras', 'RAS và RAF'], ['pka', 'PKA và CREB'],
['plc', 'Phospholipase C và protein kinase C'], ['gli', 'Mịn màng và trơn bóng']
], 'jak', [
'Thụ thể này mượn một loại kinase liên kết với phần đuôi của nó.',
'Yếu tố phiên mã được phosphoryl hóa tại màng tế bào, kết cặp và di chuyển vào nhân.'
], 'Các thụ thể cytokine thu hút các kinase JAK, chúng phosphoryl hóa thụ thể và sau đó là các protein STAT; các dimer STAT đi vào nhân tế bào và điều hòa gen (STAT3 và STAT5 cũng làm tăng Bcl-xL, chất này ngăn chặn quá trình apoptosis).'));
prompts.push(pick('h.wnt', G, 'Tín hiệu nào liên kết với thụ thể Frizzled và kết thúc bằng beta-catenin và TCF trong nhân tế bào?', [
['wnt', 'Wnt'], ['hh', 'Nhím'], ['egf', 'EGF'], ['ins', 'Insulin'], ['cyt', 'Một cytokine']
], 'wnt', [
'Đây là một loại protein được tiết ra trong quá trình phát triển, chứ không phải là hormone trong máu.',
'Cơ chế hoạt động của nó là ngăn chặn GSK-3beta đánh dấu beta-catenin để phân hủy.'
], 'Wnt liên kết với Frizzled; Dishevelled ức chế GSK-3beta, do đó beta-catenin không còn bị phân hủy, tích tụ và đi vào nhân tế bào cùng với TCF để điều hòa gen. Hedgehog sử dụng Patched, Smoothened và Gli trong cùng vai trò.'));
prompts.push(pick('h.arach', G, 'Prostaglandin, prostacyclin và thromboxane được tạo ra từ loại axit béo nào?', [
['ara', 'Axit arachidonic', ['arachidonate']], ['palm', 'Axit palmitic'], ['oleic', 'Axit oleic'], ['chol', 'Cholesterol'], ['acac', 'Acetoacetate']
], 'ara', [
'Nó có hai mươi nguyên tử carbon và bốn liên kết đôi.',
'Một loại phospholipase sẽ giải phóng nó khỏi phospholipid màng.'
], 'Các prostanoid được tạo ra từ axit arachidonic (20:4), được giải phóng từ phospholipid màng bởi phospholipase A2; cyclooxygenase tạo ra prostaglandin H2, tiền chất của các prostaglandin, prostacyclin và thromboxane A2. Chúng hoạt động gần nơi chúng được tạo ra, vì vậy chúng là các chất trung gian tại chỗ chứ không phải là hormone.'));
prompts.push(pick('h.nsaid', G, 'Aspirin và ibuprofen ngăn chặn bước nào trong quá trình tổng hợp prostanoid?', [
['cox', 'Cyclooxygenase, enzyme chuyển hóa axit arachidonic thành prostaglandin H2.', ['cyclooxygenase', 'cox']],
['pla2', 'Phospholipase A2, sự giải phóng axit arachidonic'], ['tx', 'Chỉ có thromboxane synthase'], ['rec', 'Các thụ thể prostaglandin']
], 'cox', [
'Chúng tác động lên enzyme đầu tiên trong chu trình từ axit béo tự do, chứ không phải lên quá trình giải phóng axit béo đó.',
'Aspirin acetyl hóa một serine trong vị trí hoạt động của enzyme đó.'
], 'Thuốc kháng viêm không steroid (NSAID) ức chế cyclooxygenase (COX-1 và COX-2); aspirin làm điều này một cách không thuận nghịch bằng cách acetyl hóa một serine tại vị trí hoạt động. Glucocorticoid tác động ở giai đoạn trước đó, trên sự giải phóng axit arachidonic, vì vậy steroid và NSAID ngăn chặn các bước khác nhau.'));
prompts.push(number('h.num.helices', G, 'Một thụ thể liên kết với protein G đi qua màng tế bào bao nhiêu lần, và một chuỗi của kinase tyrosine thụ thể đi qua màng tế bào bao nhiêu lần?', [
{ key: 'gpcr', label: 'Các xoắn ốc GPCR', answer: 7, step: 1, min: 0, max: 20 }, { key: 'rtk', label: 'Các xoắn ốc RTK', answer: 1, step: 1, min: 0, max: 20 }
], [
'GPCR là một bó xoắn ốc với đầu N nằm bên ngoài và đầu C nằm bên trong; RTK có miền kinase nằm bên trong trên một cuống ngắn.',
'Chuỗi RTK chỉ bắt chéo một lần; GPCR có số lượng xoắn ốc lẻ, đó là lý do tại sao hai đầu của nó nằm ở hai phía đối diện của màng tế bào.'
], 'Thụ thể liên kết với protein G có bảy xoắn ốc xuyên màng (đầu N ở bên ngoài, đầu C ở bên trong); monome tyrosine kinase thụ thể có một xoắn ốc xuyên màng, với miền liên kết phối tử ở bên ngoài và miền kinase ở bên trong.'));
prompts.push(sort('h.sort.class', G, 'Mỗi loại hormone thuộc nhóm hóa học nào?', [
['ins', 'Insulin'], ['glg', 'Glucagon'], ['acth', 'ACTH'], ['oxy', 'Oxytocin'], ['cort', 'Cortisol'], ['e2', 'Estradiol'], ['test', 'Testosterone'],
['epi', 'Epinephrine'], ['ne', 'Norepinephrine'], ['t4', 'Thyroxine']
], [['pep', 'Polypeptide'], ['ster', 'Steroid'], ['aa', 'Dẫn xuất axit amin']], {
ins: 'pep', glg: 'pep', acth: 'pep', oxy: 'pep', cort: 'ster', e2: 'ster', test: 'ster', epi: 'aa', ne: 'aa', t4: 'aa'
}, [
'Steroid được tạo ra từ cholesterol; các dẫn xuất axit amin đến từ tyrosine.',
'Bất cứ chất nào được tạo ra trong tuyến từ một chuỗi axit amin đều được gọi là polypeptide, bất kể chuỗi đó ngắn đến đâu.'
], 'Polypeptide: insulin, glucagon, ACTH, oxytocin (và vasopressin, TSH, FSH, LH và các yếu tố giải phóng). Steroid: cortisol và các glucocorticoid khác, mineralocorticoid, estrogen và androgen. Các dẫn xuất axit amin, tất cả đều từ tyrosine: epinephrine, norepinephrine và thyroxine.'));
prompts.push(sort('h.sort.where', G, 'Thụ thể của mỗi loại hormone nằm ở đâu?', [
['ins', 'Insulin'], ['epi', 'Epinephrine'], ['glg', 'Glucagon'], ['cort', 'Cortisol'], ['e2', 'Estradiol'], ['test', 'Testosterone'], ['t4', 'Thyroxine']
], [['mem', 'Trong màng tế bào'], ['in', 'Bên trong tế bào']], {
ins: 'mem', epi: 'mem', glg: 'mem', cort: 'in', e2: 'in', test: 'in', t4: 'in'
}, [
'Hãy hỏi xem hormone đó có thể xuyên qua lớp màng lipid hay không.',
'Thyroxine là một dẫn xuất của axit amin, nhưng nó có kích thước nhỏ và đủ tính kỵ nước để đi vào tế bào, giống như một loại steroid.'
], 'Insulin, glucagon và epinephrine là các chất tan trong nước và liên kết với các thụ thể màng (một thụ thể tyrosine kinase và hai thụ thể liên kết với protein G). Cortisol, estradiol và testosterone là các steroid, còn thyroxine là một dẫn xuất axit amin kỵ nước nhỏ: cả bốn chất này đều đi vào tế bào và liên kết với các thụ thể hạt nhân điều chỉnh quá trình phiên mã.'));
prompts.push(sort('h.sort.pathway', G, 'Loại thụ thể nào khởi đầu mỗi con đường tín hiệu?', [
['camp', 'Adenylate cyclase, cAMP, PKA và CREB'], ['plc', 'Phospholipase C, IP3, Ca2+ và protein kinase C'],
['ras', 'GRB2 và SOS, RAS, RAF, MEK và MAPK'], ['pi3k', 'PI3 kinase, PIP3 và Akt'], ['jak', 'Các kinase JAK và STAT']
], [['gpcr', 'thụ thể liên kết protein G'], ['rtk', 'Tyrosine kinase thụ thể'], ['cyt', 'Thụ thể cytokine']], {
camp: 'gpcr', plc: 'gpcr', ras: 'rtk', pi3k: 'rtk', jak: 'cyt'
}, [
'Hai con đường bắt đầu bằng protein G, hai con đường khác bắt đầu bằng phosphotyrosine trên dimer thụ thể, và một con đường bắt đầu bằng kinase mượn.',
'Cả RAS và PI3 kinase đều được huy động đến các phosphotyrosine của cùng một loại thụ thể.'
], 'Các thụ thể liên kết với protein G khởi đầu con đường cAMP (thông qua Gs) và con đường phospholipase C (thông qua Gq); các kinase tyrosine thụ thể khởi đầu con đường RAS thành MAPK và PI3 kinase thành Akt; các thụ thể cytokine khởi đầu con đường JAK và STAT.'));
return { intro: 'Từ não bộ đến tuyến nội tiết đến tế bào: hormone nào, thụ thể nào, con đường nào?', prompts: prompts };
}
P.games.push({
id: 'network-hormones', title: 'Thụ thể và hormone', subtitle: 'Trục nội tiết, các loại hormone và thụ thể nào khởi phát con đường nào.',
group: GROUP, count: 13, fixedOrder: true, build: networkBuild
});
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
var GROUP = 'Nitơ và nucleotide';
function mol(id) { return MG.entities.molecule[id]; }
function molLabel(id) { return mol(id) ? mol(id).name : id; }
function molNames(id) { var m = mol(id); return m ? (m.aliases || m.alias || []).slice() : []; }
function opts(list) { return list.map(function (o) { return { id: o[0], label: o[1], names: o[2] }; }); }
function pick(id, group, text, options, answer, hints, explain) {
return { id: id, kind: 'pick', group: group, text: text, figure: null, optionStyle: 'text', options: opts(options), answer: answer, hints: hints, explain: explain };
}
function pickMols(id, group, text, figureMol, molIds, answer, hints, explain) {
return {
id: id, kind: 'pick', group: group, text: text, figure: figureMol ? { mol: figureMol } : null, optionStyle: 'text',
options: molIds.map(function (m) { return { id: m, label: molLabel(m), names: molNames(m) }; }), answer: answer, hints: hints, explain: explain
};
}
function pickDraw(id, group, text, molIds, answer, hints, explain) {
return {
id: id, kind: 'pick', group: group, text: text, figure: null, optionStyle: 'figure', leakCheck: false,
options: molIds.map(function (m) { return { id: m, label: molLabel(m), mol: m, names: molNames(m) }; }), answer: answer, hints: hints, explain: explain
};
}
function order(id, group, text, items, hints, explain) {
return {
id: id, kind: 'order', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), answer: items.map(function (x) { return x[0]; }), hints: hints, explain: explain
};
}
function sort(id, group, text, items, buckets, answer, hints, explain) {
return {
id: id, kind: 'sort', group: group, text: text, figure: null,
items: items.map(function (x) { return { id: x[0], label: x[1] }; }), buckets: buckets.map(function (b) { return { id: b[0], label: b[1] }; }),
answer: answer, hints: hints, explain: explain
};
}
function number(id, group, text, fields, hints, explain) {
return { id: id, kind: 'number', group: group, text: text, figure: null, fields: fields, hints: hints, explain: explain };
}
function spotBuild() {
var G = 'Tìm điểm khác biệt';
var prompts = [];
prompts.push(pickMols('sd.name.ala', G, 'Đây là phân tử gì?', 'alanine', ['alanine', 'pyruvate', 'glutamate', 'aspartate', 'glutamine'], 'alanine', [
'Hãy nhìn vào nguyên tử carbon nằm cạnh nhóm carboxylate: nó mang một nguyên tử nitơ, vì vậy đây là một axit amin chứ không phải là một axit keto.',
'Nó là phân tử nhỏ nhất trong bảy phân tử, với ba nguyên tử carbon, và chất đồng hành keto-acid của nó là sản phẩm cuối cùng của quá trình đường phân.'
], 'Alanine: có ba nguyên tử carbon, một nhóm carboxylate ở một đầu và nhóm NH3+ ở carbon số 2. Loại bỏ nguyên tử nitơ và thay thế bằng nhóm C=O, ta có pyruvate, đó chính là tác dụng của ALT.'));
prompts.push(pickMols('sd.name.akg', G, 'Đây là phân tử gì?', 'akg', ['akg', 'glutamate', 'oaa', 'pyruvate', 'glutamine'], 'akg', [
'Hãy nhìn vào nguyên tử carbon nằm cạnh nhóm carboxylate: nó mang nhóm C=O, vì vậy đây là một axit keto.',
'Nó có năm nguyên tử carbon và hai nhóm carboxylate, và là một chất trung gian của chu trình TCA.'
], 'Alpha-ketoglutarate: có năm nguyên tử carbon, hai nhóm carboxylate và một nhóm C=O ở carbon số 2. Nó là axit keto của glutamate, và mỗi phản ứng chuyển nhóm amin đều cung cấp một nhóm amino cho nó.'));
prompts.push(pickMols('sd.name.gln', G, 'Đây là phân tử gì?', 'glutamine', ['glutamine', 'glutamate', 'akg', 'aspartate', 'alanine'], 'glutamine', [
'Hãy nhìn vào đầu cuối của chuỗi bên: đó là một amit, chứ không phải là một cacboxylat.',
'Đó là axit amin mang hai nguyên tử nitơ và cung cấp một trong số chúng cho vòng purin và vòng pyrimidin.'
], 'Glutamine: glutamate có nhóm carboxylate ở chuỗi bên đã trở thành amide (CONH2). Glutamine synthetase tạo ra nó với ATP và NH4+, và glutaminase thủy phân nó trở lại.'));
prompts.push(pickDraw('sd.draw.pyr', G, 'Hình nào thể hiện pyruvate?', ['pyruvate', 'alanine', 'oaa', 'akg'], 'pyruvate', [
'Pyruvate là một axit keto: hãy tìm nhóm C=O bên cạnh nhóm carboxylate và không có nitơ.',
'Nó chỉ có ba nguyên tử cacbon và một nhóm carboxylate.'
], 'Pyruvate: một nhóm carboxylate, một nhóm C=O và một nhóm methyl. Alanine có nhóm NH3+ thay thế cho nhóm C=O; oxaloacetate và alpha-ketoglutarate dài hơn và có hai nhóm carboxylate.'));
prompts.push(pickDraw('sd.draw.glu', G, 'Hình nào thể hiện glutamate?', ['glutamate', 'akg', 'glutamine', 'aspartate'], 'glutamate', [
'Glutamate là một axit amin: hãy tìm nhóm NH3+ trên nguyên tử carbon nằm cạnh nhóm carboxylate.',
'Nó có năm nguyên tử cacbon và hai nhóm cacboxylat, và không có nhóm amit.'
], 'Glutamate: có năm nguyên tử carbon, nhóm NH3+ ở carbon số 2 và các nhóm carboxylate ở cả hai đầu. Alpha-ketoglutarate có nhóm C=O ở vị trí của nhóm NH3+, glutamine có nhóm amide ở đầu kia, và aspartate ngắn hơn một nguyên tử carbon.'));
prompts.push(pickDraw('sd.draw.asp', G, 'Hình nào thể hiện aspartate?', ['aspartate', 'oaa', 'glutamate', 'alanine'], 'aspartate', [
'Aspartate là một axit amin có hai nhóm carboxylate.',
'Nó có bốn nguyên tử carbon: ít hơn một so với glutamate.'
], 'Aspartate: bốn nguyên tử carbon, nhóm NH3+ trên carbon số 2 và hai nhóm carboxylate. Oxaloacetate là axit keto của nó (một nhóm C=O thay thế cho nhóm NH3+), glutamate dài hơn một nguyên tử carbon, và alanine có một nhóm carboxylate.'));
prompts.push({
id: 'sd.diff.alapyr', kind: 'pick', group: G, text: 'Hình vẽ này thể hiện alanin. Điểm khác biệt duy nhất giữa alanin và pyruvat là gì?', figure: { mol: 'alanine' }, optionStyle: 'text',
options: opts([
['amino', 'Alanine có nhóm amino ở carbon số 2, trong khi pyruvate có nhóm C=O.'], ['carbon', 'Alanine có nhiều hơn pyruvate một nguyên tử carbon.'],
['cooh', 'Alanine có nhóm carboxylate thứ hai'], ['phos', 'Pyruvate mang nhóm phosphate còn alanine thì không.']
]), answer: 'amino',
hints: ['Cả hai đều có ba nguyên tử cacbon và một nhóm cacboxylat; hãy đếm số nguyên tử oxy và tìm nguyên tử nitơ.', 'Sự thay đổi xảy ra ở nguyên tử carbon liền kề với nhóm carboxylate, nguyên tử mà enzyme transaminase tác động lên.'],
explain: 'Alanine và pyruvate có chung khung carbon ba nguyên tử với một nhóm carboxylate ở một đầu; alanine mang nhóm NH3+ trên carbon số 2 và pyruvate mang nhóm C=O. Phản ứng ALT hoán đổi hai chất này: alanine + alpha-ketoglutarate <-> pyruvate + glutamate.'
});
prompts.push({
id: 'sd.diff.gluakg', kind: 'pick', group: G, text: 'Hình vẽ thể hiện glutamate. Chỉ cần một thay đổi nhỏ nào đó sẽ biến nó thành alpha-ketoglutarate?', figure: { mol: 'glutamate' }, optionStyle: 'text',
options: opts([
['keto', 'NH3+ trên cacbon 2 trở thành C=O'], ['fewer', 'Một nhóm carboxylate bị mất'], ['longer', 'Một nguyên tử carbon được thêm vào.'], ['amide', 'Chuỗi bên thu được một nhóm amide']
]), answer: 'keto',
hints: ['Cả hai đều có năm nguyên tử carbon và hai nhóm carboxylate.', 'Đó là sự thay đổi tương tự như giữa alanin và pyruvat, trên nguyên tử carbon nằm cạnh nhóm carboxylat alpha.'],
explain: 'Glutamate và alpha-ketoglutarate là cặp năm nguyên tử carbon của các transaminase: NH3+ trên carbon 2 trong glutamate, C=O trong alpha-ketoglutarate. Mỗi phản ứng chuyển nhóm amin đều chuyển nhóm amino của nó cho alpha-ketoglutarate, và glutamate dehydrogenase sau đó giải phóng nó dưới dạng NH4+.'
});
prompts.push({
id: 'sd.diff.glngln', kind: 'pick', group: G, text: 'Phân tử glutamine được vẽ ở đây. Điểm khác biệt duy nhất giữa glutamine và glutamate là gì?', figure: { mol: 'glutamine' }, optionStyle: 'text',
options: opts([
['amide', 'Nhóm carboxylate ở mạch nhánh của glutamat là một amit trong glutamin.'], ['carbon', 'Glutamine có thêm một nguyên tử carbon.'],
['noamino', 'Glutamine không có nhóm alpha-amino.'], ['keto', 'Glutamine mang nhóm C=O ở cacbon số 2']
]), answer: 'amide',
hints: ['Cả hai đều có năm nguyên tử carbon và cùng một nguyên tử carbon alpha với NH3+.', 'Hãy nhìn vào đầu cuối của chuỗi bên, nơi glutamine mang một nguyên tử nitơ thứ hai.'],
explain: 'Glutamine là glutamate với nhóm carboxylate ở mạch nhánh được chuyển hóa thành amide (CONH2). Glutamine synthetase tạo ra nó với ATP và NH4+; glutaminase thủy phân nó trở lại. Nitơ của nhóm amide là nguyên tử đi vào vòng purine và pyrimidine.'
});
prompts.push(pickMols('sd.asp2oaa', G, 'Aspartate được vẽ ở đây. Nó sẽ trở thành axit keto nào khi AST lấy đi nhóm amino của nó?', 'aspartate', ['oaa', 'pyruvate', 'akg', 'fumarate', 'succinate'], 'oaa', [
'Axit keto giữ nguyên bốn nguyên tử carbon và cả hai nhóm carboxylate của aspartate.',
'Đây là chất trung gian của chu trình TCA, tham gia phản ứng kết hợp với acetyl-CoA để tạo thành citrate.'
], 'Oxaloacetate: aspartate với nhóm C=O thay thế cho nhóm NH3+. AST chuyển nhóm amino sang alpha-ketoglutarate (aspartate + alpha-ketoglutarate <-> oxaloacetate + glutamate), phản ứng này cũng cung cấp nguyên liệu cho chu trình urê và chu trình malate-aspartate.'));
prompts.push(pick('sd.amino', G, 'Điều gì xảy ra với nhóm amino của alanin khi ALT chuyển hóa alanin thành pyruvat?', [
['akg', 'Nó chuyển hóa thành alpha-ketoglutarate, chất này sau đó trở thành glutamate.'], ['free', 'Nó được giải phóng ngay lập tức dưới dạng NH4+ miễn phí.'],
['urea', 'Nó được chuyển hóa thành urê trong cùng một bước.'], ['gas', 'Nó thoát ra dưới dạng khí nitơ.']
], 'akg', [
'Transaminase không bao giờ giải phóng amoniac tự do: nó chuyển nhóm này sang một axit keto.',
'Axit keto tham gia phản ứng là axit keto năm carbon của chu trình TCA.'
], 'Phản ứng chuyển nhóm amin chuyển nhóm amin sang alpha-ketoglutarate, tạo ra glutamate; ion NH4+ tự do xuất hiện sau đó, khi glutamate dehydrogenase oxy hóa glutamate. Nói rằng chính phản ứng chuyển nhóm amin giải phóng NH4+ là một lỗi thường gặp.'));
prompts.push(sort('sd.sort.class', G, 'Axit amin hay axit alpha-keto?', [
['alanine', 'Alanine'], ['pyruvate', 'Pyruvat'], ['glutamate', 'Glutamate'], ['akg', 'Alpha-ketoglutarate'], ['glutamine', 'Glutamine'], ['aspartate', 'Aspartate'], ['oaa', 'Oxaloacetate']
], [['amino', 'Axit amin'], ['keto', 'Axit alpha-keto']], {
alanine: 'amino', pyruvate: 'keto', glutamate: 'amino', akg: 'keto', glutamine: 'amino', aspartate: 'amino', oaa: 'keto'
}, [
'Axit amin mang NH3+ trên nguyên tử cacbon alpha; axit keto mang C=O ở vị trí đó.',
'Ba trong số bảy chất đó là axit keto.'
], 'Alanine, glutamat, glutamin và aspartat là các axit amin; pyruvat, alpha-ketoglutarat và oxaloaxetat là các axit alpha-keto mà ba trong số chúng tạo thành trong phản ứng chuyển nhóm amin. Glutamin là một axit amin có nhóm amit ở chuỗi bên.'));
prompts.push(sort('sd.sort.partner', G, 'Mỗi axit amin sẽ trở thành loại alpha-keto acid nào khi transaminase lấy nhóm amino của nó?', [
['alanine', 'Alanine'], ['glutamate', 'Glutamate'], ['aspartate', 'Aspartate']
], [['pyruvate', 'Pyruvat'], ['akg', 'Alpha-ketoglutarate'], ['oaa', 'Oxaloacetate']], {
alanine: 'pyruvate', glutamate: 'akg', aspartate: 'oaa'
}, [
'Phản ứng chuyển nhóm amin giữ nguyên cấu trúc khung cacbon: hãy đếm số nguyên tử cacbon và nhóm cacboxylat.',
'Ba nguyên tử cacbon, năm nguyên tử cacbon, bốn nguyên tử cacbon.'
], 'Alanine và pyruvate (ba nguyên tử carbon), glutamate và alpha-ketoglutarate (năm nguyên tử carbon), aspartate và oxaloacetate (bốn nguyên tử carbon): mỗi cặp chỉ khác nhau ở nhóm NH3+ so với nhóm C=O trên carbon số 2. ALT xử lý cặp đầu tiên và AST xử lý cặp thứ ba, cả hai đều có alpha-ketoglutarate và glutamate là cặp đối tác.'));
prompts.push(number('sd.num.carbons', G, 'Alanin, aspartat và glutamat có bao nhiêu nguyên tử cacbon?', [
{ key: 'ala', label: 'Alanine', answer: 3, step: 1, min: 0, max: 12 }, { key: 'asp', label: 'Aspartate', answer: 4, step: 1, min: 0, max: 12 },
{ key: 'glu', label: 'Glutamate', answer: 5, step: 1, min: 0, max: 12 }
], [
'Đếm số nguyên tử cacbon trong chuỗi, bao gồm cả các nguyên tử cacbon của nhóm carboxyl.',
'Mỗi thành phần axit keto (pyruvate, oxaloacetate, alpha-ketoglutarate) có số lượng bằng với axit amin tương ứng.'
], 'Alanine có ba nguyên tử carbon (giống như pyruvate), aspartate có bốn (giống như oxaloacetate) và glutamate có năm (giống như alpha-ketoglutarate). Glutamine cũng có năm nguyên tử carbon.'));
return { intro: 'Bảy phân tử nhỏ trông giống nhau: một nhóm amino hoặc một nhóm C=O, một nhóm amide hoặc một nhóm carboxylate, có thể nhiều hơn hoặc ít hơn một nguyên tử carbon.', prompts: prompts };
}
function glucoBuild() {
var G = 'Sinh glucose hoặc sinh ketone';
var prompts = [];
var ENTRY = [
['pyr', 'Pyruvat'], ['akg', 'α-Ketoglutarate', ['alpha-ketoglutarate', 'akg']], ['succ', 'Succinyl-CoA'], ['fum', 'Fumarate'], ['oaa', 'Oxaloacetate']
];
prompts.push(pick('k.meaning', G, 'Điều gì khiến một axit amin có khả năng sinh đường?', [
['tca', 'Khung carbon của nó trở thành pyruvate hoặc chất trung gian của chu trình TCA, mà quá trình tân tạo glucose có thể chuyển hóa thành glucose.'],
['glc', 'Nó được làm từ glucose'], ['acet', 'Các nguyên tử cacbon của nó chỉ trở thành acetyl-CoA hoặc acetoacetyl-CoA.'], ['urea', 'Nitơ của nó chuyển hóa thành urê.']
], 'tca', [
'Hãy nghĩ về những gì mà các nguyên tử carbon có thể được tạo thành, chứ không phải chúng đến từ đâu.',
'Quá trình tân tạo glucose bắt đầu từ pyruvate hoặc oxaloacetate.'
], 'Axit amin sinh glucose phân giải thành pyruvate hoặc chất trung gian của chu trình TCA (alpha-ketoglutarate, succinyl-CoA, fumarate, oxaloacetate); những chất này tạo ra oxaloacetate và sau đó là glucose thông qua quá trình tân tạo glucose. Axit amin sinh ketone tạo ra acetyl-CoA hoặc acetoacetyl-CoA, có thể tạo ra thể ketone hoặc axit béo nhưng không tạo ra glucose.'));
prompts.push(pick('k.keto', G, 'Hai axit amin nào hoàn toàn có tính chất sinh thể ketone?', [
['leulys', 'Leucine và lysine'], ['alagly', 'Alanine và glycine'], ['phetyr', 'Phenylalanine và tyrosine'], ['valmet', 'Valine và methionine']
], 'leulys', [
'Cả hai đều là axit amin thiết yếu, và một trong số đó là axit amin phổ biến nhất trong protein.',
'Một loại là axit amin mạch nhánh; loại kia có chuỗi bên dài kết thúc bằng nhóm amino.'
], 'Leucine và lysine là hai axit amin duy nhất mà nguyên tử carbon của chúng hoàn toàn chuyển hóa thành acetyl-CoA hoặc acetoacetate: leucine tạo ra acetyl-CoA và acetoacetate, lysine tạo ra acetoacetyl-CoA.'));
prompts.push(pick('k.both', G, 'Những axit amin nào vừa có tác dụng sinh glucose vừa có tác dụng sinh ketone?', [
['four', 'Isoleucine, phenylalanine, tryptophan và tyrosine'], ['two', 'Leucine và lysine'], ['small', 'Alanine, serine, glycine và cysteine'], ['acid', 'Aspartate và asparagine']
], 'four', [
'Mỗi phân tử trong số đó phân hủy thành hai phần: một phần có thể chuyển hóa thành glucose và một phần chuyển hóa thành acetyl-CoA hoặc acetoacetate.',
'Ba trong số bốn chất này có vòng thơm.'
], 'Isoleucine tạo ra succinyl-CoA (thông qua propionyl-CoA) và acetyl-CoA; phenylalanine và tyrosine tạo ra fumarate và acetoacetate; tryptophan tạo ra pyruvate (thông qua alanine) và acetoacetyl-CoA. Threonine được tính là chất sinh glucose ở đây; một số sách cũng tính nó là chất sinh ketone.'));
prompts.push(pick('k.leu', G, 'Tại sao leucine không thể được sử dụng để tạo ra glucose?', [
['acet', 'Các nguyên tử cacbon của nó tách ra dưới dạng acetyl-CoA và acetoacetate, và acetyl-CoA không thể chuyển hóa ngược lại thành pyruvate hoặc oxaloacetate.'],
['nitro', 'Nitơ của nó không thể bị loại bỏ.'], ['skel', 'Sau quá trình chuyển hóa amin, nó không còn khung carbon nào nữa.'], ['fast', 'Nó bị hỏng quá nhanh']
], 'acet', [
'Hãy nghĩ về bước chuyển hóa từ pyruvate sang acetyl-CoA: nó chỉ diễn ra theo một chiều.',
'Hai nguyên tử carbon của acetyl-CoA đi vào chu trình TCA sẽ rời đi dưới dạng CO2, do đó chu trình không thu được thêm oxaloacetate nào.'
], 'Enzyme pyruvate dehydrogenase là không thuận nghịch, và acetyl-CoA không mang lại carbon ròng nào cho oxaloacetate (hai carbon đi vào chu trình, hai carbon rời đi dưới dạng CO2), vì vậy acetyl-CoA và acetoacetate không thể cung cấp năng lượng cho quá trình tân tạo glucose. Đó chính là ý nghĩa của chế độ ăn ketogenic.'));
prompts.push(pick('k.akg', G, 'Glutamate, glutamine, proline, arginine và histidine đều tham gia vào chu trình TCA với vai trò là chất trung gian nào?', ENTRY, 'akg', [
'Cả năm chất này đều được chuyển hóa thành glutamate trước tiên.',
'Sau đó, glutamate dehydrogenase tách nhóm amino khỏi glutamate và để lại axit keto năm carbon.'
], 'Cả năm chất này đều tạo ra glutamate, và glutamate dehydrogenase (hoặc transaminase) chuyển hóa glutamate thành alpha-ketoglutarate.'));
prompts.push(pick('k.oaa', G, 'Aspartate và asparagine tham gia vào quá trình với vai trò là chất trung gian nào?', ENTRY, 'oaa', [
'Asparaginase trước tiên chuyển hóa asparagine thành aspartate.',
'Sau đó, AST chuyển nhóm amino của aspartate sang alpha-ketoglutarate, tạo thành một axit keto bốn carbon.'
], 'Asparaginase thủy phân asparagine thành aspartate, và AST chuyển aspartate thành oxaloacetate, chất này có thể rời khỏi chu trình dưới dạng phosphoenolpyruvate trên đường đến glucose.'));
prompts.push(pick('k.succ', G, 'Valine, methionine, isoleucine và threonine cung cấp chất trung gian nào?', ENTRY, 'succ', [
'Tất cả chúng đều đi qua propionyl-CoA trước tiên.',
'Propionyl-CoA được cacboxyl hóa và sắp xếp lại thành thioeste CoA bốn carbon của vòng.'
], 'Valine, methionine, isoleucine và threonine tạo ra propionyl-CoA, chất này được carboxyl hóa thành methylmalonyl-CoA và sắp xếp lại (với vitamin B12) thành succinyl-CoA. Isoleucine cũng tạo ra acetyl-CoA, vì vậy nó được tính là cả chất sinh glucose và chất sinh ketone.'));
prompts.push(pick('k.fum', G, 'Phenylalanine và tyrosine tạo ra acetoacetate và chất trung gian nào trong chu trình TCA?', ENTRY, 'fum', [
'Phenylalanine chuyển hóa thành tyrosine trước, sau đó vòng benzen bị mở ra và cắt làm đôi.',
'Mảnh bốn carbon có liên kết đôi trans giữa hai nhóm carboxylate.'
], 'Phenylalanine hydroxylase tạo ra tyrosine; chu trình này đi qua homogentisate đến fumarylacetoacetate, chất này sau đó bị phân cắt thành fumarate và acetoacetate. Đó là lý do tại sao cả hai đều được coi là có tính sinh glucose và sinh ketone.'));
prompts.push(sort('k.sort.class', G, 'Sinh glucose, sinh ketone hay cả hai?', [
['ala', 'Alanine'], ['glu', 'Glutamate'], ['val', 'Valine'], ['met', 'Methionin'], ['asp', 'Aspartate'],
['leu', 'Leucine'], ['lys', 'Lysine'], ['ile', 'Isoleucine'], ['phe', 'Phenylalanine'], ['trp', 'Tryptophan']
], [['g', 'Sinh đường'], ['k', 'Chế độ ăn ketogenic'], ['b', 'Cả hai']], {
ala: 'g', glu: 'g', val: 'g', met: 'g', asp: 'g', leu: 'k', lys: 'k', ile: 'b', phe: 'b', trp: 'b'
}, [
'Chỉ có hai axit amin hoàn toàn thuộc nhóm ketone, và cả hai đều có ở đây.',
'Cả hai nhóm đều chứa axit amin mạch nhánh và axit amin thơm.'
], 'Chế độ sinh glucose: alanin, glutamat, valin, methionine và aspartate. Chế độ sinh ketone: leucine và lysine. Cả hai: isoleucine, phenylalanin và tryptophan (và tyrosine).'));
prompts.push(sort('k.sort.entry', G, 'Khung carbon của mỗi axit amin đi vào đâu?', [
['ala', 'Alanine'], ['ser', 'Serine'], ['gln', 'Glutamine'], ['pro', 'Proline'], ['asn', 'Asparagine'], ['asp', 'Aspartate'],
['val', 'Valine'], ['met', 'Methionin'], ['tyr', 'Tyrosin'], ['phe', 'Phenylalanine']
], [['pyr', 'Pyruvat'], ['akg', 'α-Ketoglutarate'], ['succ', 'Succinyl-CoA'], ['fum', 'Fumarate'], ['oaa', 'Oxaloacetate']], {
ala: 'pyr', ser: 'pyr', gln: 'akg', pro: 'akg', asn: 'oaa', asp: 'oaa', val: 'succ', met: 'succ', tyr: 'fum', phe: 'fum'
}, [
'Bốn trong năm điểm vào là các chất trung gian của chu trình TCA; chỉ có một điểm vào trước chu trình.',
'Hai axit amin có nhóm amide (asparagine, glutamine) sẽ xuất hiện ở vị trí tương ứng với axit gốc của chúng: aspartate ở axit keto bốn carbon, glutamate ở axit keto năm carbon.'
], 'Alanine và serine tạo ra pyruvate; glutamine và proline tạo ra glutamate và sau đó là alpha-ketoglutarate; asparagine và aspartate tạo ra oxaloacetate; valine và methionine tạo ra propionyl-CoA và sau đó là succinyl-CoA; tyrosine và phenylalanine tạo ra fumarate (và acetoacetate).'));
prompts.push(number('k.num.table', G, 'Trong số hai mươi axit amin tiêu chuẩn, có bao nhiêu axit amin chỉ sinh glucose, bao nhiêu axit amin chỉ sinh ketone và bao nhiêu axit amin vừa sinh glucose vừa sinh ketone?', [
{ key: 'g', label: 'Chỉ sinh glucose', answer: 14, step: 1, min: 0, max: 20 }, { key: 'k', label: 'Chỉ ăn ketogenic', answer: 2, step: 1, min: 0, max: 20 },
{ key: 'b', label: 'Cả hai', answer: 4, step: 1, min: 0, max: 20 }
], [
'Ba phép tính cộng lại thành hai mươi.',
'Nhóm ăn kiêng ketogenic là nhóm nhỏ nhất, còn nhóm ăn kiêng hỗn hợp (cả hai) có số lượng gấp đôi.'
], 'Mười bốn loại chỉ sinh glucose (Asp, Asn, Ala, Gly, Ser, Thr, Cys, Glu, Gln, Arg, Pro, His, Val, Met), hai loại chỉ sinh ketone (Leu, Lys) và bốn loại sinh cả hai (Ile, Phe, Trp, Tyr).'));
return { intro: 'Vị trí của khung carbon trong axit amin quyết định liệu nó có thể chuyển hóa thành glucose hay không.', prompts: prompts };
}
function salvageBuild() {
var G = 'Tái sử dụng hoặc phát triển mới';
var prompts = [];
var FIRST = [
['sugar', 'Đường photphat: vòng được hình thành từng bước trên PRPP'], ['ring', 'Vòng: nó được hoàn thiện trước rồi mới được gắn vào PRPP.'],
['both', 'Cả hai cùng một lúc, từ một tiền thân'], ['none', 'Không cái nào đúng: nguyên nhân cơ bản đến từ chế độ ăn uống.']
];
prompts.push(pick('v.salvage', G, 'Quá trình tái sử dụng nucleotide trong tổng hợp có tác dụng gì?', [
['recycle', 'Nó kết hợp một nhóm cơ sở được giải phóng nhờ sự phân giải nucleotide với PRPP, chất này lại tạo thành một nucleotide.'],
['denovo', 'Nó xây dựng vòng từng nguyên tử một từ các axit amin, CO2 và các đơn vị một cacbon.'],
['strip', 'Nó loại bỏ các nhóm phosphate khỏi nucleotide.'], ['deoxy', 'Nó chuyển hóa ribose thành deoxyribose.']
], 'recycle', [
'Từ ngữ đã nói lên tất cả: một thứ gì đó được lưu giữ và sử dụng lại.',
'Phần nền đã hoàn thành; chỉ cần thêm đường photphat vào nữa thôi.'
], 'Công nghệ Salvage tái chế các bazơ tự do từ quá trình phân hủy nucleotide (hypoxanthine, guanine, adenine, uracil) bằng cách kết hợp chúng với PRPP trong một bước duy nhất, giúp giảm chi phí đáng kể so với việc xây dựng lại vòng nucleotide.'));
prompts.push(pick('v.denovo', G, 'Quá trình tổng hợp nucleotide de novo bắt đầu từ đâu?', [
['blocks', 'Các khối cấu tạo nhỏ: axit amin, CO2, đơn vị một cacbon và PRPP'], ['base', 'Một base tự do và PRPP'],
['dna', 'Các nucleotide bị cắt ra từ DNA cũ'], ['diet', 'Các chất kiềm được hấp thụ từ thực phẩm']
], 'blocks', [
'De novo có nghĩa là từ đầu.',
'Glycine, glutamine, aspartate và CO2 là một trong những nguyên liệu ban đầu.'
], 'Quá trình tổng hợp de novo tạo ra chất nền từ các phân tử nhỏ: glycine, glutamine, aspartate, CO2 và N10-formyl-THF cho vòng purine, carbamoyl phosphate và aspartate cho vòng pyrimidine, và PRPP cho đường phosphate.'));
prompts.push(pick('v.prpp', G, 'Loại đường photphat hoạt hóa nào tạo ra ribose 5-photphat trong cả hai con đường?', [
['prpp', 'Phosphoribosyl pyrophosphate (PRPP)', ['prpp', 'phosphoribosyl pyrophosphate']], ['atp', 'ATP'], ['g6p', 'Glucose 6-phosphate'],
['r5p', 'Ribose 5-phosphate'], ['udpg', 'UDP-glucose']
], 'prpp', [
'Nó được tạo thành từ ribose 5-phosphate và ATP, và nhóm trên nguyên tử carbon số 1 của nó là một nhóm dễ tách ra.',
'Một bazơ tấn công cacbon số 1 của ribose và một pyrophosphate tách ra.'
], 'Enzyme PRPP synthetase tạo ra PRPP từ ribose 5-phosphate và ATP. Quá trình tổng hợp purine de novo dựa trên đó, orotate được kết hợp với nó để tạo thành OMP, và các enzyme tái chế kết hợp một base tự do với nó trong một bước duy nhất.'));
prompts.push(pick('v.first.pur', G, 'Trong quá trình tổng hợp purin từ đầu, vòng purin hay đường photphat được tạo ra trước?', FIRST, 'sugar', [
'Nguyên tử vòng đầu tiên, một nguyên tử nitơ từ glutamine, thay thế cho pyrophosphate của PRPP.',
'Mọi chất trung gian từ phosphoribosylamine đến IMP đều đã là ribonucleotide.'
], 'Vòng purine được lắp ráp trên đường: glutamine-PRPP amidotransferase gắn N9 vào PRPP (phosphoribosylamine), và chín bước nữa sẽ tạo thành hai vòng để hình thành IMP.'));
prompts.push(pick('v.first.pyr', G, 'Trong quá trình tổng hợp pyrimidine từ đầu, vòng pyrimidine hay đường phosphate được tạo ra trước?', FIRST, 'ring', [
'Carbamoyl phosphate và aspartate khép kín thành một vòng trước khi bất kỳ phân tử đường nào xuất hiện.',
'Orotate phosphoribosyltransferase là bước thêm nhóm phosphate vào đường.'
], 'Carbamoyl phosphate và aspartate tạo ra carbamoyl aspartate, dihydroorotase đóng vòng, dihydroorotate bị oxy hóa thành orotate, và chỉ sau đó orotate phosphoribosyltransferase mới gắn vòng vào PRPP (OMP), mà OMP decarboxylase chuyển hóa thành UMP.'));
prompts.push(pick('v.reg.pur', G, 'Enzyme nào là bước đầu tiên được điều chỉnh và quyết định trong quá trình tổng hợp purine de novo, và yếu tố nào ức chế nó?', [
['gpat', 'Glutamine-PRPP amidotransferase, bị ức chế bởi AMP, GMP và IMP'], ['cps2', 'CPS II, bị ức chế bởi UTP'],
['prpps', 'Enzyme PRPP synthetase bị ức chế bởi glucose'], ['ompd', 'OMP decarboxylase, bị ức chế bởi CO2']
], 'gpat', [
'Bước này đưa nguyên tử vòng đầu tiên lên PRPP.',
'Sản phẩm cuối cùng của chu trình này, các nucleotide purine, sẽ tắt nó đi.'
], 'Enzyme glutamine-PRPP amidotransferase tạo ra phosphoribosylamine và bị ức chế ngược bởi các nucleotide purine AMP, GMP và IMP. Enzyme PRPP synthetase cũng được điều hòa bởi ADP và GDP.'));
prompts.push(pick('v.reg.pyr', G, 'Enzyme nào là bước được điều hòa trong quá trình tổng hợp pyrimidine ở động vật?', [
['cps2', 'Carbamoyl phosphate synthetase II, bị ức chế bởi UTP và được hoạt hóa bởi PRPP.'], ['atcase', 'Aspartate transcarbamoylase, bị ức chế bởi CTP'],
['gpat', 'Glutamine-PRPP amidotransferase, bị ức chế bởi AMP và GMP'], ['ts', 'Thymidylate synthase, bị ức chế bởi dTMP']
], 'cps2', [
'Đây là bước đầu tiên của chu trình, và nó tạo ra carbamoyl phosphate trong bào tương.',
'Sản phẩm cuối cùng là UTP sẽ tắt nó đi; chất cho đường mà con đường này sẽ cần sau đó sẽ bật nó lên.'
], 'Ở động vật, CPS II là bước được điều hòa: UTP ức chế nó và PRPP (và ATP) kích hoạt nó. Ở vi khuẩn, enzyme được điều hòa là aspartate transcarbamoylase, bị ức chế bởi CTP. CPS II nằm trong tế bào chất và sử dụng glutamine, khác với CPS I của chu trình urê.'));
prompts.push(pick('v.thf', G, 'Chất mang một nguyên tử carbon nào cung cấp nhóm metyl cho dTMP trong phản ứng tổng hợp thymidylate?', [
['methylene', 'N5,N10-Methylene-THF', ['methylene-thf', 'methylene tetrahydrofolate']], ['formyl', 'N10-Formyl-THF'], ['sam', 'S-Adenosylmethionine'],
['biotin', 'Biotin'], ['b12', 'Vitamin B12']
], 'methylene', [
'Nó là một loại folate, nhưng không phải là loại cung cấp các nguyên tử carbon số 2 và 8 của vòng purine.',
'Đơn vị một carbon của nó liên kết hai nguyên tử nitơ của folate, và folate tách ra dưới dạng dihydrofolate.'
], 'Enzyme thymidylate synthase chuyển đơn vị một carbon của N5,N10-methylene-THF lên dUMP và khử nó thành nhóm methyl, tạo ra dihydrofolate; enzyme dihydrofolate reductase tái tạo THF với NADPH. Vòng purine lấy C2 và C8 từ N10-formyl-THF.'));
prompts.push(order('v.order.pur', G, 'Sắp xếp lại quy trình tổng hợp ATP từ đầu.', [
['prpp', 'Ribose 5-phosphate được hoạt hóa bằng ATP: PRPP'], ['pra', 'Glutamine thay thế pyrophosphate bằng nitơ vòng đầu tiên: phosphoribosylamine'],
['imp', 'Thêm chín bước nữa để hoàn thành hai vòng: IMP'], ['amp', 'Aspartate (kết hợp với GTP) gắn nhóm amino vào carbon số 6: AMP'],
['atp', 'Hai kinase thêm nhóm phosphate: ADP và sau đó là ATP.']
], [
'Đường được hoạt hóa trước khi bất kỳ chất nào được xây dựng trên nó, và nucleotide hoàn chỉnh đầu tiên không có adenine hay guanine làm chất nền.',
'Các hợp chất photphat được thêm vào sau cùng.'
], 'PRPP synthetase tạo ra PRPP, glutamine-PRPP amidotransferase tạo ra phosphoribosylamine, chín bước nữa tạo ra IMP, adenylosuccinate synthetase và adenylosuccinate lyase chuyển IMP thành AMP (IMP dehydrogenase và GMP synthetase tạo ra GMP), và các kinase tạo ra ADP và ATP.'));
prompts.push(order('v.order.pyr', G, 'Sắp xếp lại lộ trình phát triển CTP từ đầu.', [
['cp', 'CPS II tạo ra carbamoyl phosphate từ bicarbonate, glutamine và hai ATP.'], ['oro', 'Aspartate được thêm vào, vòng khép kín và bị oxy hóa: orotate'],
['omp', 'Orotate được kết hợp với PRPP: OMP'], ['ump', 'OMP thải CO2: UMP'], ['utp', 'Các kinase tạo ra UDP và UTP'],
['ctp', 'CTP synthetase gắn nhóm amino từ glutamine vào UTP: CTP']
], [
'Vòng này được hoàn thiện trước khi đường photphat liên kết với nó.',
'CTP được tạo ra từ triphosphate, chứ không phải từ UMP.'
], 'Carbamoyl phosphate, carbamoyl aspartate, dihydroorotate và orotate tạo thành vòng; orotate phosphoribosyltransferase thêm PRPP (OMP); OMP decarboxylase tạo ra UMP; các kinase tạo ra UDP và UTP; CTP synthetase amin hóa UTP với glutamine và ATP. dTMP được tạo ra từ dUMP bởi thymidylate synthase.'));
prompts.push(sort('v.sort.route', G, 'Sáng tạo mới, tái sử dụng, hay cả hai?', [
['hgprt', 'Hypoxanthine hoặc guanine kết hợp với PRPP trong một bước: IMP hoặc GMP'], ['ten', 'Mười bước từ PRPP đến IMP'],
['recycle', 'Sử dụng các bazơ được giải phóng khi các nucleotide bị phân giải.'], ['blocks', 'Cần glycine, glutamine, aspartate, CO2 và N10-formyl-THF'],
['prpp', 'Sử dụng PRPP làm chất cho ribose 5-phosphate'], ['ntp', 'Kết thúc bằng các NTP và dNTP cho RNA và DNA']
], [['denovo', 'De novo'], ['salvage', 'Cứu hộ'], ['both', 'Cả hai tuyến đường']], {
hgprt: 'salvage', ten: 'denovo', recycle: 'salvage', blocks: 'denovo', prpp: 'both', ntp: 'both'
}, [
'Cả hai con đường đều kết thúc ở cùng một loại nucleotide và đều lấy nhóm phosphate đường từ cùng một chất cho.',
'Salvage cần một nền tảng hoàn chỉnh; de novo tạo ra một nền tảng như vậy.'
], 'Tổng hợp de novo xây dựng chất nền từ các phân tử nhỏ qua nhiều bước; phương pháp tái sử dụng kết hợp chất nền đã tồn tại với PRPP trong một bước duy nhất (hypoxanthine-guanine phosphoribosyltransferase cho purine). Cả hai phương pháp đều sử dụng PRPP và đều tạo ra triphosphat.'));
prompts.push(sort('v.sort.ring', G, 'Con đường purine hay con đường pyrimidine?', [
['gly', 'Glycine cung cấp ba nguyên tử vòng'], ['cp', 'Carbamoyl phosphate là chất trung gian đầu tiên'], ['onsugar', 'Cấu trúc vòng được hình thành trên đường photphat.'],
['ringfirst', 'Vòng được hoàn thiện trước khi thêm PRPP.'], ['cps2', 'CPS II là enzyme được điều hòa'], ['gpat', 'Glutamine-PRPP amidotransferase là enzyme được điều hòa.'],
['asp', 'Aspartate tạo nên phần lớn vòng.'], ['fthf', 'N10-formyl-THF cung cấp hai nguyên tử cacbon vòng.']
], [['pur', 'Purin (IMP, AMP, GMP)'], ['pyr', 'Các dẫn xuất pyrimidine (UMP, CTP, dTMP)']], {
gly: 'pur', cp: 'pyr', onsugar: 'pur', ringfirst: 'pyr', cps2: 'pyr', gpat: 'pur', asp: 'pyr', fthf: 'pur'
}, [
'Vòng purin có chín nguyên tử từ năm nguồn; vòng pyrimidin có sáu nguyên tử từ ba nguồn.',
'Chỉ có con đường chuyển hóa purine mới sử dụng glycine và các nguyên tử carbon của folate.'
], 'Purin: vòng được hình thành trên PRPP từ glycin, glutamin, aspartat, CO2 và N10-formyl-THF, và glutamin-PRPP amidotransferase là bước được điều hòa. Pyrimidin: carbamoyl phosphate và aspartat tạo thành vòng trước, PRPP được thêm vào orotat, và CPS II là bước được điều hòa.'));
prompts.push(number('v.num.steps', G, 'Cần bao nhiêu bước enzyme để tạo ra IMP từ PRPP, và cần bao nhiêu bước enzyme để tạo ra UMP từ bicarbonate và glutamine?', [
{ key: 'imp', label: 'PRPP đến IMP', answer: 10, step: 1, min: 0, max: 20 }, { key: 'ump', label: 'Bicarbonate đến UMP', answer: 6, step: 1, min: 0, max: 20 }
], [
'Con đường purine là con đường dài hơn: nó thêm chín nguyên tử vòng từng cái một hoặc ba cái một lúc và đóng hai vòng.',
'Phương pháp tổng hợp pyrimidine tạo ra vòng trong bốn bước, sau đó cần thêm hai bước nữa để thêm đường phosphate và loại bỏ nhóm carboxylate.'
], 'Mười bước từ PRPP đến IMP (phosphoribosylamine, GAR, FGAR, FGAM, AIR, CAIR, SAICAR, AICAR, FAICAR, IMP) và sáu bước từ bicarbonate đến UMP (CPS II, ATCase, dihydroorotase, dihydroorotate dehydrogenase, orotate phosphoribosyltransferase, OMP decarboxylase).'));
return { intro: 'Có hai cách để tạo ra một nucleotide: xây dựng base từ đầu hoặc tái sử dụng base đã có sẵn.', prompts: prompts };
}
P.games.push({
id: 'spot-difference', title: 'Tìm điểm khác biệt', subtitle: 'Alanine và pyruvate, glutamate và alpha-ketoglutarate, glutamine và glutamate, aspartate và oxaloacetate',
group: GROUP, count: 14, fixedOrder: true, build: spotBuild
});
P.games.push({
id: 'gluco-keto', title: 'Sinh glucose hoặc sinh ketone', subtitle: 'Hai loại phân giải axit amin và vị trí mỗi bộ khung đi vào chu trình TCA.',
group: GROUP, count: 11, fixedOrder: true, build: glucoBuild
});
P.games.push({
id: 'salvage-denovo', title: 'Tái sử dụng hoặc phát triển mới', subtitle: 'Có hai cách để tạo ra một nucleotide: xây dựng vòng hoặc tái chế một bazơ, với các bước được quy định.',
group: GROUP, count: 13, fixedOrder: true, build: salvageBuild
});
})(typeof window !== 'undefined' ? window : globalThis);
