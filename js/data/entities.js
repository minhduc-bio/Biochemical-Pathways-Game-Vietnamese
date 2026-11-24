(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var molecule = {
glucose: {
name: 'Glucose', short: 'Glc', family: 'sugar',
aliases: ['glucose', 'd-glucose', 'glc', 'dextrose', 'alpha-d-glucose', 'beta-d-glucose', 'glucopyranose'],
note: 'Phân tử đường 6 carbon đi vào con đường đường phân. Được vẽ ở đây dưới dạng vòng (pyranose) chiếm ưu thế trong dung dịch.'
},
g6p: {
name: 'Glucose 6-phosphate', short: 'G6P', family: 'sugar', lines: ['Glucose', '6-phosphate'],
aliases: ['glucose 6-phosphate', 'g6p', 'glc6p', 'glucose-6-p', 'glucose 6-p', 'glc-6-p', 'alpha-D-glucose 6-phosphate', 'glucose 6-phosphoric acid'],
note: 'Glucose gắn một nhóm phosphat ở carbon 6. Điện tích âm giữ nó bị giữ chặt bên trong tế bào. Đây cũng là điểm đầu vào của con đường pentose phosphate và là điểm rẽ nhánh sang glycogen thông qua glucose 1-phosphate.'
},
f6p: {
name: 'Fructose 6-phosphate', short: 'F6P', family: 'sugar', lines: ['Fructose', '6-phosphate'],
aliases: ['fructose 6-phosphate', 'f6p', 'fru6p', 'fructose-6-p', 'fructose 6-p'],
note: 'Một đường ketose. Phosphoglucose isomerase mở vòng 6 cạnh của glucose 6-phosphate, chuyển nhóm carbonyl từ carbon 1 sang carbon 2 qua chất trung gian enediol, rồi đóng lại thành vòng furanose 5 cạnh.'
},
f16bp: {
name: 'Fructose 1,6-bisphosphate', short: 'F1,6BP', family: 'sugar', lines: ['Fructose', '1,6-bisphosphate'],
aliases: ['fructose 1,6-bisphosphate', 'f1,6bp', 'f16bp', 'fbp', 'fructose 1,6-diphosphate', 'fructose 1,6-bp', 'fru-1,6-bp', 'Fru-1,6-P2', 'F1,6P2', 'fructose 1,6-P2'],
note: 'Hai nhóm phosphat, mỗi đầu của mạch 6 carbon gắn một nhóm. Sự phân cắt nó ở bước tiếp theo tạo ra hai mảnh 3 carbon.'
},
dhap: {
name: 'Dihydroxyacetone phosphate', short: 'DHAP', family: 'c3', lines: ['Dihydroxyacetone', 'phosphate'],
aliases: ['dihydroxyacetone phosphate', 'dhap', 'glycerone phosphate', 'dihydroxyacetone-p', 'dihydroxyacetone phosphate (dhap)'],
note: 'Một đường ketose. Nó không thể được dùng trực tiếp ở pha thu hoạch năng lượng, nên triose phosphate isomerase chuyển nó thành glyceraldehyde 3-phosphate.'
},
g3p: {
name: 'Glyceraldehyde 3-phosphate', short: 'G3P', family: 'c3', lines: ['Glyceraldehyde', '3-phosphate'],
aliases: ['glyceraldehyde 3-phosphate', 'g3p', 'gap', 'gadp', 'pgal', '3-phosphoglyceraldehyde', 'glyceraldehyde-3-p', 'glyceraldehyde phosphate', 'GA3P'],
note: 'Một đường aldehyde. Mỗi phân tử glucose tạo ra hai phân tử này, nên mọi bước từ đây trở đi đều xảy ra hai lần cho mỗi glucose.'
},
bpg13: {
name: '1,3-Bisphosphoglycerate', short: '1,3-BPG', family: 'c3', lines: ['1,3-Bisphospho-', 'glycerate'],
aliases: ['1,3-bisphosphoglycerate', '1,3-bpg', '13bpg', '1,3-diphosphoglycerate', '1,3-dpg', '1,3-bisphosphoglyceric acid', 'glycerate 1,3-bisphosphate', '1,3-BPGA', '1,3-bisPG'],
note: 'Chứa liên kết acyl phosphate — một liên kết giàu năng lượng có thế năng chuyển nhóm vượt cả ATP. Chính điều này cho phép bước kế tiếp tổng hợp ATP.'
},
pg3: {
name: '3-Phosphoglycerate', short: '3PG', family: 'c3', lines: ['3-Phospho-', 'glycerate'],
aliases: ['3-phosphoglycerate', '3pg', '3-pga', '3pga', '3-phosphoglyceric acid', 'glycerate 3-phosphate', 'glycerate 3-P'],
note: 'Một carboxylate có nhóm phosphat ở carbon 3. Đây là sản phẩm của bước tạo ATP đầu tiên.'
},
pg2: {
name: '2-Phosphoglycerate', short: '2PG', family: 'c3', lines: ['2-Phospho-', 'glycerate'],
aliases: ['2-phosphoglycerate', '2pg', '2-pga', '2pga', '2-phosphoglyceric acid', 'glycerate 2-phosphate', 'glycerate 2-P'],
note: 'Nhóm phosphat đã chuyển vị sang carbon 2, chuẩn bị cho phản ứng tách nước tạo enol phosphate.'
},
pep: {
name: 'Phosphoenolpyruvate', short: 'PEP', family: 'c3', lines: ['Phosphoenol-', 'pyruvate'],
aliases: ['phosphoenolpyruvate', 'pep', 'phosphoenol pyruvate', 'phosphoenolpyruvic acid', '2-phosphoenolpyruvate', 'phosphopyruvate'],
note: 'Sở hữu thế năng chuyển nhóm phosphoryl cao nhất trong tất cả các chất trung gian của đường phân, vì dạng enol của pyruvate bị khóa trong nó rất kém bền.'
},
pyruvate: {
name: 'Pyruvat', short: 'Pyr', family: 'c3',
aliases: ['pyruvate', 'pyruvic acid', 'pyr'],
note: 'Sản phẩm cuối cùng của đường phân. Khi có oxy, nó được vận chuyển vào ty thể và chuyển thành acetyl-CoA; khi không có oxy, nó trải qua lên men, ví dụ tạo thành lactate.'
},
acetylcoa: {
name: 'Acetyl-CoA', short: 'Ac-CoA', family: 'coa', formula: 'C23H38N7O17P3S',
aliases: ['acetyl-coa', 'acetylcoa', 'acetyl coenzyme a', 'acoa', 'ac-coa', 'acetyl-coenzyme a'],
note: 'Một nhóm acetyl 2 carbon gắn trên liên kết thioester (phần chất mang được vẽ dạng nhãn). Đây là nhiên liệu mà chu trình TCA đốt cháy.'
},
citrate: {
name: 'Citrate', short: 'Cit', family: 'acid',
aliases: ['citrate', 'citric acid', 'cit'],
note: 'Sáu carbon: nhóm acetyl đã được gắn vào oxaloacetate. Là một rượu bậc ba nên không thể bị oxi hóa cho đến khi aconitase dịch chuyển nhóm hydroxyl.'
},
isocitrate: {
name: 'Isocitrate', short: 'Isocit', family: 'acid',
aliases: ['isocitrate', 'isocitric acid', 'icit', 'd-isocitrate', 'threo-ds-isocitrate', 'D-threo-isocitrate'],
note: 'Nhóm hydroxyl lúc này nằm trên carbon bậc hai, có thể bị oxi hóa bởi isocitrate dehydrogenase.'
},
akg: {
name: 'α-Ketoglutarate', short: 'α-KG', family: 'acid', twin: { kind: 'cofactor', id: 'akgc' },
aliases: ['alpha-ketoglutarate', 'α-ketoglutarate', 'akg', 'α-kg', 'alpha-kg', '2-oxoglutarate', 'oxoglutarate', 'ketoglutarate', '2-ketoglutarate', 'a-ketoglutarate', 'alpha-ketoglutaric acid', '2-oxoglutaric acid', 'alpha-oxoglutarate', 'α-oxoglutarate', '2-OG', '2OG', 'oxoglutaric acid', '2-ketoglutaric acid', 'alpha-oxoglutaric acid', 'ketoglutaric acid'],
note: 'Năm carbon. Đây cũng là bộ khung carbon của glutamate, kết nối chu trình TCA với chuyển hóa amino acid.'
},
succoa: {
name: 'Succinyl-CoA', short: 'Succ-CoA', family: 'coa', formula: 'C25H40N7O19P3S',
aliases: ['succinyl-coa', 'succinylcoa', 'succinyl coenzyme a', 'succ-coa'],
note: 'Bốn carbon gắn trên liên kết thioester với coenzyme A. Liên kết thioester là nguồn năng lượng cho bước tiếp theo.'
},
succinate: {
name: 'Succinat', short: 'Succ', family: 'acid',
aliases: ['succinate', 'succinic acid', 'succ', 'succinic', 'butanedioic acid', 'butanedioate'],
note: 'Một dicarboxylate 4 carbon đối xứng không có nhóm chức nào khác ngoài hai nhóm carboxylate.'
},
fumarate: {
name: 'Fumarate', short: 'Fum', family: 'acid',
aliases: ['fumarate', 'fumaric acid', 'fum', 'trans-fumarate', 'trans-butenedioate'],
note: 'Alkene dạng trans do succinate dehydrogenase tạo ra. Đồng phân cis của nó là maleate, chất mà chu trình không sử dụng.'
},
malate: {
name: 'Malate', short: 'Mal', family: 'acid',
aliases: ['malate', 'l-malate', 'malic acid', 'mal', 'l-malic acid', 'malic', 'L-hydroxysuccinate', '(S)-malate'],
note: 'L-Malate, được tạo ra bằng cách cộng nước vào liên kết đôi của fumarate. Đây là nhóm hydroxyl cuối cùng bị oxi hóa trong chu trình.'
},
oaa: {
name: 'Oxaloacetate', short: 'OAA', family: 'acid',
aliases: ['oxaloacetate', 'oaa', 'oxaloacetic acid', 'oxalacetate', 'oxaloacetic', 'oxalo acetate'],
note: 'Chất nhận 4 carbon. Mỗi vòng của chu trình đều tái tạo chất này, đó là lý do con đường này khép kín thành chu trình.'
},
ammonium: {
name: 'Amoni', short: 'NH₄⁺', family: 'nitrogen',
aliases: ['ammonium', 'ammonium ion', 'nh4+', 'nh4', 'nh4 ion', 'ammonium cation', 'ammonia'],
note: 'Chất thải nitơ độc hại từ quá trình phân giải amino acid. Ở pH tế bào hầu như toàn bộ tồn tại ở dạng proton hóa (như hình vẽ); gan chuyển nó thành ure trước khi nó kịp tích tụ trong máu.'
},
carbamoylp: {
name: 'Carbamoyl phosphate', short: 'CP', family: 'nitrogen', lines: ['Carbamoyl', 'phosphate'],
aliases: ['carbamoyl phosphate', 'carbamyl phosphate', 'carbamoylphosphate', 'carbamoyl-p', 'carbamoyl phosphoric acid', 'carbamyl phosphoric acid', 'carbamyl-p'],
note: 'Một nhóm carbamoyl đã hoạt hóa (H₂N-CO-) giữ trên gốc phosphat qua liên kết acyl phosphate, mang lại thế năng chuyển nhóm cao. Nó được tổng hợp trong chất nền ty thể và chuyển nhóm carbamoyl cho bước tiếp theo.'
},
ornithine: {
name: 'Ornithine', short: 'Orn', family: 'aminoacid',
aliases: ['ornithine', 'orn', 'l-ornithine', '2,5-diaminopentanoic acid', '2,5-diaminopentanoate'],
note: 'Một amino acid không có mặt trong protein và được tái chế sau mỗi vòng, nên chỉ cần một lượng nhỏ cũng đủ duy trì chu trình hoạt động. Nó chính là arginine đã mất nhóm guanidino (nhóm tách ra thành ure ở bước cuối).'
},
citrulline: {
name: 'Citrulline', short: 'Citr', family: 'aminoacid',
aliases: ['citrulline', 'l-citrulline', 'citr', 'citrullin', '2-amino-5-ureidopentanoic acid', 'n5-carbamoylornithine'],
note: 'Ornithine gắn thêm một nhóm carbamoyl trên nitơ mạch bên, tạo thành nhóm ureido. Đây cũng là sản phẩm phụ của tổng hợp nitric oxide và giống như ornithine, không có trong protein.'
},
argsucc: {
name: 'Argininosuccinate', short: 'ArgSucc', family: 'aminoacid', lines: ['Arginino-', 'succinate'],
aliases: ['argininosuccinate', 'argininosuccinic acid', 'arginosuccinate', 'arginino succinate', 'l-argininosuccinate', 'argsucc', 'asa', 'n-(l-arginino)succinate', '2-(n(omega)-l-arginino)succinate'],
note: 'Citrulline nối với aspartate qua một liên kết C–N mới. Nó giữ nhóm guanidino của arginine cùng toàn bộ bộ khung carbon của aspartate.'
},
arginine: {
name: 'Arginine', short: 'Arg', family: 'aminoacid',
aliases: ['arginine', 'arg', 'l-arginine', '2-amino-5-guanidinopentanoic acid'],
note: 'Amino acid mang nhóm guanidino ở mạch bên. Gan tổng hợp nó trong chu trình ure, nhưng nó cũng được hấp thu từ protein thức ăn và dùng để tạo nitric oxide, creatine và protein.'
},
urea: {
name: 'Urê', short: 'Urê', family: 'nitrogen',
aliases: ['urea', 'carbamide', 'carbonyl diamide', 'methanediamide', 'nh2conh2', 'h2nconh2', 'co(nh2)2', 'ch4n2o'],
note: 'Một phân tử nhỏ, trung hòa, tan rất tốt với hai nguyên tử nitơ (một từ ammonium và một từ aspartate) và một carbon từ bicarbonate. Nó rời gan vào máu và được thận bài tiết qua nước tiểu.'
},
g1p: { name: 'Glucose 1-phosphate', short: 'G1P', family: 'sugar', aliases: ['glucose 1-phosphate', 'g1p', 'glc1p', 'glucose-1-p'], note: 'Tạo thành từ quá trình phân giải glycogen. Chưa phải là glycolytic intermediate cho đến khi được đồng phân hóa thành glucose 6-phosphate.' },
r5p: { name: 'Ribose 5-phosphate', short: 'R5P', family: 'sugar', decoy: true, aliases: ['ribose 5-phosphate', 'r5p', 'ribose-5-p'], note: 'Sản phẩm của pentose phosphate pathway, được dùng để tổng hợp nucleotides.' },
glycerol3p: { name: 'Glycerol 3-phosphate', short: 'G3P (glycerol)', family: 'c3', aliases: ['glycerol 3-phosphate', 'glycerol-3-phosphate', 'glycerol 3-p', 'sn-glycerol 3-phosphate'], note: 'Tạo thành từ DHAP trong quá trình tổng hợp lipid và glycerol phosphate shuttle. Rất dễ nhầm lẫn với glyceraldehyde 3-phosphate.' },
lactate: { name: 'Lactate', short: 'Lac', family: 'c3', aliases: ['lactate', 'lactic acid', 'l-lactate'], note: 'L-Lactate, sản phẩm cuối của anaerobic glycolysis trong cơ đang hoạt động và hồng cầu. Gan có thể chuyển nó ngược lại thành pyruvate và glucose (Cori cycle).' },
alanine: { name: 'Alanine', short: 'Ala', family: 'c3', aliases: ['alanine', 'ala', 'l-alanine'], note: 'Tạo thành từ pyruvate qua transamination. Cơ gửi nó tới gan, nơi nó trả lại pyruvate cho gluconeogenesis (glucose-alanine cycle).' },
acetaldehyde: { name: 'Acetaldehyde', short: 'AcH', family: 'c3', aliases: ['acetaldehyde', 'ethanal'], note: 'Một chất trung gian của alcoholic fermentation.' },
ethanol: { name: 'Ethanol', short: 'EtOH', family: 'c3', aliases: ['ethanol', 'etoh', 'ethyl alcohol'], note: 'Sản phẩm cuối của alcoholic fermentation ở nấm men.' },
glutamate: { name: 'Glutamate', short: 'Glu', family: 'acid', twin: { kind: 'cofactor', id: 'glutc' }, aliases: ['glutamate', 'glu', 'l-glutamate', 'glutamic acid'], note: 'Trở thành alpha-ketoglutarate khi nhóm amino bị tách ra. Đây là điểm tập trung các nhóm amino: các transaminases chuyển chúng tới alpha-ketoglutarate, và glutamine synthetase gắn thêm nguyên tử nitơ thứ hai để tạo glutamine.' },
aspartate: { name: 'Aspartate', short: 'Asp', family: 'acid', aliases: ['aspartate', 'asp', 'l-aspartate', 'aspartic acid'], note: 'Trở thành oxaloacetate khi nhóm amino bị tách ra.' },
malonate: { name: 'Malonate', short: 'Malon', family: 'acid', decoy: true, aliases: ['malonate', 'malonic acid'], note: 'Một dicarboxylate ba carbon. Chất ức chế cạnh tranh (competitive inhibitor) kinh điển của succinate dehydrogenase.' },
glyoxylate: { name: 'Glyoxylate', short: 'Glyox', family: 'acid', decoy: true, aliases: ['glyoxylate', 'glyoxylic acid'], note: 'Một chất trung gian của glyoxylate cycle ở thực vật và vi khuẩn.' },
glutamine: { name: 'Glutamine', short: 'Gln', family: 'aminoacid', aliases: ['glutamine', 'gln', 'l-glutamine'], note: 'Chất vận chuyển ammonia an toàn trong máu: mang một amide nitrogen mà gan và thận sẽ giải phóng lại nhờ glutaminase.' },
lysine: { name: 'Lysine', short: 'Lys', family: 'aminoacid', decoy: true, aliases: ['lysine', 'lys', 'l-lysine'], note: 'Một amino acid kiềm có mạch bên bốn carbon kết thúc bằng một nhóm amino; trông giống ornithine nhưng nhiều hơn một carbon.' },
proline: { name: 'Proline', short: 'Pro', family: 'aminoacid', decoy: true, aliases: ['proline', 'pro', 'l-proline'], note: 'Một amino acid có cấu trúc vòng có thể được tổng hợp từ ornithine (và từ glutamate).' },
nacglu: { name: 'N-Acetylglutamate', short: 'NAG', family: 'aminoacid', decoy: true, aliases: ['n-acetylglutamate', 'acetylglutamate', 'nag', 'n-acetyl-l-glutamate', 'n-acetylglutamic acid'], note: 'Chất hoạt hóa dị lập thể (allosteric activator) của carbamoyl phosphate synthetase I, tạo thành từ glutamate và acetyl-CoA và được bật lên bởi arginine.' },
carbamoylasp: { name: 'N-Carbamoylaspartate', short: 'CAA', family: 'aminoacid', decoy: true, aliases: ['n-carbamoylaspartate', 'carbamoylaspartate', 'carbamoyl aspartate', 'n-carbamoyl-l-aspartate', 'ureidosuccinate', 'carbamyl aspartate'], note: 'Sản phẩm của aspartate transcarbamoylase trong quá trình tổng hợp pyrimidine: cùng cơ chế hóa học gắn nhóm carbamoyl như urea cycle, nhưng thực hiện trên aspartate thay vì ornithine.' },
etcnadh: {
name: 'NADH', short: 'NADH', family: 'etc', formula: 'C21H29N7O14P2', twin: { kind: 'cofactor', id: 'nadh' },
aliases: ['nadh', 'nadh + h+', 'reduced nad', 'nicotinamide adenine dinucleotide (reduced)', 'nadh2'],
note: 'Chất mang electron dạng khử được tạo ra từ đường phân, phản ứng nối và chu trình TCA. Nó chuyển hai electron của mình cho Phức hợp I. Được vẽ dưới dạng vòng nicotinamide khử; R đại diện cho phần ADP-ribose.'
},
etcfadh2: {
name: 'FADH\u2082', short: 'FADH\u2082', family: 'etc', formula: 'C27H35N9O15P2', twin: { kind: 'cofactor', id: 'fadh2' },
aliases: ['fadh2', 'reduced fad', 'flavin adenine dinucleotide (reduced)'],
note: 'Flavin dạng khử do succinate dehydrogenase tạo ra. Các electron của nó đi vào chuỗi ở Phức hợp II, thấp hơn Phức hợp I, nên mỗi FADH₂ tạo ra ít ATP hơn NADH (khoảng 1,5 so với 2,5). Được vẽ dưới dạng vòng flavin khử; R đại diện cho phần ribityl-ADP.'
},
ubiquinol: {
name: 'Ubiquinol (QH\u2082)', short: 'QH\u2082', family: 'etc', formula: 'C9H11O4-R',
aliases: ['ubiquinol', 'qh2', 'coqh2', 'coenzyme q (reduced)', 'reduced coenzyme q', 'reduced ubiquinone', 'ubiquinol-10', 'coenzyme qh2', 'uqh2', 'ubiquinol (uqh2)'],
note: 'Dạng khử của coenzyme Q (vẽ phần đầu, đuôi isoprenoid dài là R). Là chất mang tan trong lipid khuếch tán trong màng trong ty thể, thu gom electron từ Phức hợp I và II rồi chuyển tới Phức hợp III.'
},
cytcred: {
name: 'Cytochrome c (dạng khử)', short: 'Cyt c', family: 'etc',
aliases: ['cytochrome c', 'cyt c', 'cytochrome c (fe2+)', 'reduced cytochrome c', 'ferrocytochrome c', 'cytochrome c reduced', 'cyt c red', 'cyt c (fe2+)'],
note: 'Một protein heme nhỏ vận chuyển từng electron một qua khoang gian màng từ Phức hợp III sang Phức hợp IV. Ion sắt của nó luân chuyển giữa Fe²⁺ (dạng khử) và Fe³⁺ (dạng oxi hóa). Được vẽ dưới dạng nhóm heme (sắt trong vòng porphyrin); phần còn lại của phân tử là protein.'
},
etcwater: {
name: 'Nước', short: 'H\u2082O', family: 'etc', twin: { kind: 'cofactor', id: 'h2o' },
aliases: ['water', 'h2o'],
note: 'Sản phẩm cuối cùng của chuỗi: oxy — chất nhận electron cuối cùng — bị khử thành nước.'
},
etcadp: {
name: 'ADP', short: 'ADP', family: 'etc', formula: 'C10H15N5O10P2', twin: { kind: 'cofactor', id: 'adp' },
aliases: ['adp', 'adenosine diphosphate'],
note: 'Cơ chất của ATP synthase, cùng với phosphat vô cơ. Nồng độ ADP cao báo hiệu tế bào đang cần năng lượng và tăng tốc độ chuỗi hô hấp (điều hòa hô hấp — respiratory control). Được vẽ dưới dạng adenine gắn trên ribose với nhóm diphosphate ở carbon 5.'
},
etcatp: {
name: 'ATP', short: 'ATP', family: 'etc', formula: 'C10H16N5O13P3', twin: { kind: 'cofactor', id: 'atp' },
aliases: ['atp', 'adenosine triphosphate'],
note: 'Sản phẩm của ATP synthase, được tổng hợp khi proton chảy ngược vào chất nền ty thể. Khoảng 2,5 ATP được tạo ra cho mỗi NADH và khoảng 1,5 cho mỗi FADH₂. Được vẽ dưới dạng adenine gắn trên ribose với nhóm triphosphate ở carbon 5.'
},
ubiquinone: {
name: 'Ubiquinone (Q)', short: 'Q', family: 'etc', twin: { kind: 'cofactor', id: 'q' }, decoy: true,
aliases: ['ubiquinone', 'coenzyme q', 'coq', 'coq10', 'coenzyme q10', 'q10', 'oxidized coenzyme q', 'oxidized ubiquinone', 'uq'],
note: 'Dạng oxi hóa của coenzyme Q, chất nhận electron tại Phức hợp I và II.'
},
cytcoxm: {
name: 'Cytochrome c (dạng oxy hóa)', short: 'Cyt c ox', family: 'etc', twin: { kind: 'cofactor', id: 'cytcox' }, decoy: true,
aliases: ['cytochrome c (fe3+)', 'cytochrome c oxidized', 'oxidized cytochrome c', 'ferricytochrome c', 'cyt c ox', 'cyt c (fe3+)'],
note: 'Cytochrome c với sắt ở trạng thái Fe³⁺, sẵn sàng nhận một electron từ Phức hợp III. Được vẽ dưới dạng nhóm heme (sắt trong vòng porphyrin); phần còn lại của phân tử là protein.'
},
etcnad: {
name: 'NAD\u207a', short: 'NAD\u207a', family: 'etc', formula: 'C21H28N7O14P2+', twin: { kind: 'cofactor', id: 'nad' }, decoy: true,
aliases: ['nad+', 'nad', 'nad(+)', 'oxidized nad', 'nicotinamide adenine dinucleotide'],
note: 'Dạng oxi hóa, được tái tạo tại Phức hợp I. Được vẽ dưới dạng vòng nicotinamide oxi hóa; R đại diện cho phần ADP-ribose.'
},
etcfad: {
name: 'FAD', short: 'FAD', family: 'etc', formula: 'C27H33N9O15P2', twin: { kind: 'cofactor', id: 'fad' }, decoy: true,
aliases: ['fad', 'oxidized fad', 'flavin adenine dinucleotide'],
note: 'Flavin dạng oxi hóa, được tái tạo tại Phức hợp II. Được vẽ dưới dạng vòng flavin oxi hóa; R đại diện cho phần ribityl-ADP.'
},
etco2: {
name: 'Oxy (O₂)', short: 'O\u2082', family: 'etc', twin: { kind: 'cofactor', id: 'o2' }, decoy: true,
aliases: ['o2', 'oxygen', 'molecular oxygen', 'dioxygen'],
note: 'Chất nhận electron cuối cùng của hô hấp hiếu khí.'
},
fmn: {
name: 'FMN', short: 'FMN', family: 'etc',
aliases: ['fmn', 'fmnh2', 'fmnh\u2082', 'flavin mononucleotide', 'reduced fmn', 'flavin mononucleotide (reduced)', 'riboflavin 5-phosphate', 'riboflavin phosphate'],
note: 'Flavin mononucleotide, dẫn xuất của riboflavin (vitamin B2) gắn trong Phức hợp I. Đây là chất nhận đầu tiên: nó nhận hai electron và hai H⁺ từ NADH rồi chuyển từng electron một tới các trung tâm sắt-lưu huỳnh. Được vẽ ở dạng FMNH₂ (dạng đã nhận electron); R đại diện cho phần ribityl phosphate.'
},
fes: {
name: 'Trung tâm sắt-lưu huỳnh (Fe-S)', short: 'Fe-S', family: 'etc',
aliases: ['iron-sulfur center', 'iron sulfur center', 'iron-sulfur cluster', 'iron sulfur cluster', 'fe-s', 'fes', 'fe-s center', 'fe-s cluster', 'fe-s protein', 'iron-sulfur protein', 'iron sulfur protein', '2fe-2s', '4fe-4s', '[2fe-2s]', '[4fe-4s]', 'iron-sulfur', 'iron sulfur', 'iron-sulphur', 'iron sulphur'],
note: 'Một cụm kim loại được gắn vào protein nhờ các gốc cysteine (không phải heme) dưới dạng [2Fe-2S] hoặc [4Fe-4S]. Sắt của nó liên kết với lưu huỳnh vô cơ. Mỗi trung tâm chỉ nhận hoặc nhường từng electron một. Nhiều trung tâm như vậy dẫn electron trong Phức hợp I từ flavin tới ubiquinone. Ở đây được vẽ là trung tâm [2Fe-2S], mỗi nguyên tử sắt được giữ bởi hai gốc cysteine.'
},
cytb: {
name: 'Cytochrome b', short: 'Cyt b', family: 'etc', noStructure: true,
aliases: ['cytochrome b', 'cyt b', 'cytb', 'cytochrome b (reduced)', 'cyt b (fe2+)', 'cytochrome b562', 'cytochrome b566', 'cyt bl', 'cyt bh', 'b562', 'b566'],
note: 'Một protein heme thuộc Phức hợp III nhận electron từ ubiquinol. Sắt trong heme của nó luân chuyển giữa Fe³⁺ và Fe²⁺. Antimycin A gắn ngay cạnh các heme b và phong bế phức hợp.'
},
cytc1: {
name: 'Cytochrome c\u2081', short: 'Cyt c\u2081', family: 'etc', noStructure: true,
aliases: ['cytochrome c1', 'cyt c1', 'cytc1', 'cytochrome c 1', 'cytochrome c1 (reduced)'],
note: 'Protein heme cuối cùng của Phức hợp III. Nó nằm phía khoang gian màng và trao electron cho chất mang di động cytochrome c. Thứ tự thẳng hàng dùng ở đây là cách đơn giản hóa trong sách giáo khoa: trong chu trình quinone, protein sắt-lưu huỳnh (Rieske) của phức hợp lấy một electron từ ubiquinol đưa sang heme này, trong khi hai heme b dẫn electron còn lại quay về ubiquinone.'
},
cyta: {
name: 'Cytochrome a', short: 'Cyt a', family: 'etc', noStructure: true,
aliases: ['cytochrome a', 'cyt a', 'cyta', 'cytochrome a (reduced)', 'cyt a (fe2+)', 'heme a', 'cytochrome a (fe2+)'],
note: 'Một trung tâm heme a của Phức hợp IV (cytochrome c oxidase). Nó nhận electron từ cytochrome c thông qua cặp nguyên tử đồng gọi là CuA rồi chuyển tới cytochrome a₃.'
},
cyta3: {
name: 'Cytochrome a\u2083', short: 'Cyt a\u2083', family: 'etc', noStructure: true,
aliases: ['cytochrome a3', 'cyt a3', 'cyta3', 'heme a3', 'cytochrome a3 (reduced)'],
note: 'Heme thứ hai của phức hợp bơm proton cuối cùng trong chuỗi. Thuộc Phức hợp IV (cytochrome c oxidase), cùng với nguyên tử đồng CuB tạo thành trung tâm hai nhân nơi oxy gắn vào và bị khử thành nước; cần bốn electron cho mỗi phân tử O₂.'
},
udpg: {
name: 'UDP-glucose', short: 'UDPG', family: 'sugar',
aliases: ['udp-glucose', 'udpg', 'uridine diphosphate glucose', 'udp glucose', 'uridine diphosphoglucose'],
note: 'Glucose được hoạt hóa bằng một nhóm uridine diphosphate. Đây là chất cho glucose của glycogen synthase.'
},
glycogen: {
name: 'Glycogen', short: 'Glycogen', family: 'sugar',
aliases: ['glycogen', 'glycogen (n)', 'glycogen n', 'animal starch'],
note: 'Một polymer phân nhánh của glucose (mạch alpha-1,4 với các nhánh alpha-1,6), được dự trữ trong gan và cơ.'
},
tag: {
name: 'Triacylglycerol', short: 'TAG', family: 'lipid',
aliases: ['triacylglycerol', 'triglyceride', 'triacylglycerols', 'triglycerides', 'tag', 'tg', 'fat', 'neutral fat', 'triacylglycerides'],
note: 'Dạng dự trữ của chất béo: glycerol được ester hóa với ba acid béo. Được vẽ là glycerol với ba gốc ester acid béo; mỗi R là một mạch acid béo.'
},
fattyacid: {
name: 'Axit béo', short: 'FA', family: 'lipid',
aliases: ['fatty acid', 'fatty acids', 'free fatty acid', 'free fatty acids', 'ffa', 'fa', 'long-chain fatty acid'],
note: 'Một mạch hydrocarbon dài có nhóm carboxyl (vẽ R đại diện cho phần còn lại của mạch). Được giải phóng từ chất béo nhờ các lipase.'
},
acylcoa: {
name: 'Axit béo acyl-CoA', short: 'Acyl-CoA', family: 'lipid',
aliases: ['fatty acyl-coa', 'acyl-coa', 'acyl coa', 'fatty acyl coa', 'acylcoa', 'acyl coenzyme a', 'fatty acyl coenzyme a'],
note: 'Acid béo nối với coenzyme A qua liên kết thioester. Là cơ chất của mỗi vòng beta-oxi hóa; sau mỗi vòng sẽ trả lại một acyl-CoA ngắn đi hai carbon.'
},
enoylcoa: {
name: 'trans-Δ²-Enoyl-CoA', short: 'Enoyl-CoA', family: 'lipid', lines: ['trans-Δ²-', 'Enoyl-CoA'],
aliases: ['trans-delta2-enoyl-coa', 'trans-δ2-enoyl-coa', 'enoyl-coa', 'enoyl coa', 'trans-2-enoyl-coa', 'trans enoyl-coa', '2-enoyl-coa', 'trans-delta-2-enoyl-coa', 'trans-d2-enoyl-coa'],
note: 'Acyl-CoA có một liên kết đôi trans giữa carbon alpha và carbon beta, do acyl-CoA dehydrogenase tạo ra.'
},
hydroxyacylcoa: {
name: 'L-β-Hydroxyacyl-CoA', short: 'OH-acyl-CoA', family: 'lipid', lines: ['L-β-Hydroxy-', 'acyl-CoA'],
aliases: ['l-beta-hydroxyacyl-coa', 'l-β-hydroxyacyl-coa', 'beta-hydroxyacyl-coa', 'β-hydroxyacyl-coa', 'hydroxyacyl-coa', '3-hydroxyacyl-coa', 'l-3-hydroxyacyl-coa', 'hydroxyacyl coa', 'l-hydroxyacyl-coa', 'l-hydroxyacyl coa'],
note: 'Nước đã được cộng vào liên kết đôi, gắn một nhóm hydroxyl (cấu hình L) lên carbon beta.'
},
ketoacylcoa: {
name: 'β-Ketoacyl-CoA', short: 'Keto-acyl-CoA', family: 'lipid', lines: ['β-Ketoacyl-', 'Giấy chứng nhận'],
aliases: ['beta-ketoacyl-coa', 'β-ketoacyl-coa', 'ketoacyl-coa', '3-ketoacyl-coa', 'ketoacyl coa', '3-oxoacyl-coa', 'beta-keto acyl-coa'],
note: 'Nhóm beta-hydroxyl đã bị oxi hóa thành ketone. Liên kết giữa carbon alpha và beta lúc này sẵn sàng bị thiolase cắt đứt.'
},
glycerol: {
name: 'Glycerol', short: 'Glycerol', family: 'lipid',
aliases: ['glycerol', 'glycerine', 'glycerin', '1,2,3-propanetriol', 'propane-1,2,3-triol'],
note: 'Khung 3 carbon của triacylglycerol. Ở gan nó đi vào đường phân (qua glycerol 3-phosphate và DHAP) hoặc tân tạo đường.'
},
mtfused: {
name: 'Ty thể hợp nhất', short: 'Hợp nhất', family: 'organelle', noStructure: true,
aliases: ['fused mitochondria', 'fused mitochondrion', 'fused mitochondrial network', 'mitochondrial network', 'elongated mitochondria', 'elongated mitochondrion', 'tubular mitochondria', 'long mitochondria'],
note: 'Các ty thể dài, nối liền nhau giúp chia sẻ thành phần bên trong (protein, lipid và mtDNA). Quá trình hợp nhất được kích thích bởi nhu cầu năng lượng và stress.'
},
mtfissioned: {
name: 'ty thể phân chia', short: 'Phân hạch', family: 'organelle', noStructure: true,
aliases: ['fissioned mitochondria', 'fissioned mitochondrion', 'fragmented mitochondria', 'fragmented mitochondrion', 'daughter mitochondria', 'two daughter mitochondria', 'divided mitochondria', 'small mitochondria', 'mitochondrial fragments'],
note: 'Các ty thể nhỏ, tách rời. Phân hạch làm tăng số lượng ty thể, tạo các bào quan mới và hỗ trợ kiểm soát chất lượng: phần bị tổn thương có thể bị cắt rời và loại bỏ qua tự thực ty thể (mitophagy).'
},
mtouterfused: {
name: 'Các màng ngoài hợp nhất', short: 'Bên ngoài hợp nhất', family: 'organelle', noStructure: true,
aliases: ['mitochondria with fused outer membranes', 'fused outer membranes', 'outer membranes fused', 'outer membrane fusion', 'outer-fused mitochondria', 'mitochondria joined at the outer membrane', 'OMM fusion', 'outer membrane fused mitochondria', 'mitochondria fused at the outer membrane'],
note: 'Hai ty thể có màng ngoài đã hợp nhất nhưng màng trong vẫn tách biệt.'
},
mtdamaged: {
name: 'Ty thể bị tổn thương', short: 'Bị hư hại', family: 'organelle', noStructure: true, decoy: true,
aliases: ['damaged mitochondria', 'damaged mitochondrion', 'depolarized mitochondria', 'depolarized mitochondrion', 'dysfunctional mitochondria'],
note: 'Các ty thể đã mất điện thế màng. Chúng bị cắt rời nhờ phân hạch và loại bỏ qua tự thực ty thể (PINK1 và Parkin).'
},
mtphagosome: {
name: 'Mitophagosome', short: 'Mitophagosome', family: 'organelle', noStructure: true, decoy: true,
aliases: ['mitophagosome', 'autophagosome', 'autophagosome with mitochondria', 'mitochondrion in an autophagosome'],
note: 'Túi màng kép đã bao bọc một ty thể bị tổn thương và sẽ hợp nhất với lysosome.'
},
mtnew: {
name: 'Các ty thể mới', short: 'Mới', family: 'organelle', noStructure: true, decoy: true,
aliases: ['new mitochondria', 'newly made mitochondria', 'nascent mitochondria', 'mitochondrial biogenesis product'],
note: 'Được tạo thành nhờ sự sinh trưởng và phân chia của các ty thể sẵn có (sinh tổng hợp ty thể — biogenesis), do PGC-1α kích hoạt.'
},
mtperinuclear: {
name: 'Ty thể quanh nhân', short: 'Vùng quanh nhân', family: 'organelle', noStructure: true, decoy: true,
aliases: ['perinuclear mitochondria', 'perinuclear clustering', 'perinuclear cluster', 'mitochondria around the nucleus', 'clustered mitochondria'],
note: 'Các ty thể tập trung quanh nhân tế bào, thường gặp khi thiếu oxy, stress oxi hóa hoặc biến đổi calci. Đây là sự thay đổi vị trí, không phải sự phân chia hay hợp nhất bào quan.'
},
mtswollen: {
name: 'Ty thể sưng phồng', short: 'Sưng lên', family: 'organelle', noStructure: true, decoy: true,
aliases: ['swollen mitochondria', 'swollen mitochondrion', 'mitochondria with an open permeability pore', 'mptp open mitochondria'],
note: 'Các ty thể đã mở lỗ chuyển tiếp tính thấm (mPTP) và mất điện thế màng: đây là dấu hiệu tổn thương, không phải phân hạch hay hợp nhất.'
},
mtapoptotic: {
name: 'Ty thể giải phóng cytochrome c', short: 'Giải phóng cyt c', family: 'organelle', noStructure: true, decoy: true,
aliases: ['mitochondria releasing cytochrome c', 'mitochondria that release cytochrome c', 'permeabilized mitochondria', 'apoptotic mitochondria'],
note: 'Các ty thể có màng ngoài bị thấm hóa trong quá trình apoptosis, khiến cytochrome c, Diablo và AIF thoát ra ngoài.'
},
dnadmg: {
name: 'Tổn thương DNA nghiêm trọng', short: 'Tổn thương DNA', family: 'apop', noStructure: true, lines: ['Nghiêm trọng', 'Tổn thương DNA'],
aliases: ['severe dna damage', 'dna damage', 'irreparable dna damage', 'severe damage to dna', 'damaged dna', 'genotoxic stress', 'unrepairable dna damage'],
note: 'Tổn thương hệ gen mà tế bào không thể sửa chữa. Nó bật các yếu tố thúc đẩy apoptosis và tắt các yếu tố ức chế apoptosis, khởi phát con đường nội sinh.'
},
cytcrel: {
name: 'Cytochrome c trong bào tương', short: 'Cyt c (bào tương)', family: 'apop', noStructure: true, lines: ['Cytochrome c', 'trong bào tương'],
aliases: ['cytochrome c in the cytosol', 'cytosolic cytochrome c', 'released cytochrome c', 'cytochrome c (released)', 'cytochrome c release', 'release of cytochrome c', 'cytochrome c', 'cyt c', 'cytochrome c released into the cytosol', 'cytochrome c in cytosol', 'cytosolic cyt c'],
note: 'Protein heme nhỏ bình thường làm nhiệm vụ vận chuyển electron trong khoang gian màng ty thể. Khi các lỗ mở trên màng ngoài, nó thoát vào bào tương và trở thành tín hiệu gây chết tế bào.'
},
procasp9: {
name: 'Procaspase-9', short: 'Procaspase-9', family: 'apop', noStructure: true,
aliases: ['procaspase-9', 'pro-caspase-9', 'procaspase 9', 'pro-caspase 9', 'procasp9', 'inactive caspase-9', 'caspase-9 zymogen', 'caspase-9 precursor'],
note: 'Một tiền chất protease bất hoạt (zymogen) được tuyển mộ tới một bệ đỡ protein và được hoạt hóa tại đó.'
},
apoptosome: {
name: 'Apoptosome', short: 'Apoptosome', family: 'apop', noStructure: true, twin: { kind: 'enzyme', id: 'apoptosomeenz' },
aliases: ['apoptosome', 'the apoptosome', 'apoptosome complex', 'apaf-1 apoptosome', 'apaf-1/cytochrome c complex'],
note: 'Một phức hợp hình bánh xe hình thành trong bào tương, đóng vai trò bệ đỡ cho protease đầu tiên. Nó gồm bảy phân tử Apaf-1, mỗi phân tử gắn một cytochrome c và một dATP. Procaspase-9 gắn vào bánh xe ở bước kế tiếp.'
},
casp9a: {
name: 'Caspase-9 hoạt động', short: 'Caspase-9', family: 'apop', noStructure: true, twin: { kind: 'enzyme', id: 'casp9' },
aliases: ['active caspase-9', 'caspase-9', 'caspase 9', 'activated caspase-9', 'casp9', 'caspase-9 (active)', 'cleaved caspase-9'],
note: 'Protease hoạt động đầu tiên của con đường nội sinh, tạo thành khi tiền chất của nó được hoạt hóa trên bệ đỡ ở bước trước.'
},
procexec: {
name: 'Thủ tục thi hành án', short: 'Procaspases', family: 'apop', noStructure: true, lines: ['Đao phủ', 'procaspases'],
aliases: ['executioner procaspases', 'executioner procaspase', 'procaspase-3', 'pro-caspase-3', 'procaspase 3', 'pro-caspase 3', 'procaspase-3/7', 'procaspases-3, -6 and -7', 'inactive executioner caspases', 'executioner pro-caspases', 'inactive caspase-3', 'effector procaspases', 'caspase-3 precursor'],
note: 'Các tiền chất bất hoạt của nhóm protease tháo dỡ tế bào, chủ yếu là procaspase-3 cùng procaspase-6 và -7. Caspase khởi phát cắt procaspase-3 một nhát giữa hai tiểu đơn vị để hoạt hóa nó; procaspase-6 chủ yếu do caspase-3 hoạt động hoạt hóa.'
},
execcasp: {
name: 'Kẻ hành quyết caspase', short: 'Caspase-3', family: 'apop', noStructure: true, twin: { kind: 'enzyme', id: 'casp3' }, lines: ['Đao phủ', 'caspases'],
aliases: ['executioner caspases', 'executioner caspase', 'caspase-3', 'caspase 3', 'active caspase-3', 'caspase-3/7', 'caspases-3, -6 and -7', 'effector caspases', 'effector caspase', 'caspase-7', 'active executioner caspases', 'activated caspase-3', 'casp3', 'executioner caspase-3', 'executioner caspase 3', 'caspase-3 (active)'],
note: 'Các protease hoạt động chịu trách nhiệm tháo dỡ tế bào. Cả con đường ngoại sinh và nội sinh đều kết thúc bằng việc hoạt hóa chúng.'
},
cellprot: {
name: 'Protein tế bào', short: 'Protein tế bào', family: 'apop', noStructure: true, lines: ['Tế bào', 'proteins'],
aliases: ['cellular proteins', 'cell proteins', 'cellular substrates', 'cell substrates', 'death substrates', 'proteins of the cell', 'structural proteins', 'target proteins', 'caspase substrates', 'lamins and cytoskeletal proteins'],
note: 'Hàng loạt protein bị nhóm protease cuối cùng cắt đứt: lamin nhân, protein bộ khung tế bào, các enzyme sửa chữa DNA như PARP và chất ức chế của enzyme cắt DNA. Việc cắt chúng sẽ tháo dỡ tế bào.'
},
apoptosis: {
name: 'Sự chết tế bào theo chương trình (Apoptosis)', short: 'Apoptosis', family: 'apop', noStructure: true, lines: ['Sự chết tế bào', '(Apoptosis)'],
aliases: ['apoptosis', 'programmed cell death', 'apoptotic cell death', 'genetically programmed cell death', 'pcd', 'cell suicide'],
note: 'Tế bào co rút, DNA bị cắt nhỏ và tế bào vỡ thành các mảnh có màng bao bọc được các tế bào lân cận dọn sạch mà không gây viêm. Cả hai con đường đều kết thúc tại đây, ở cùng nhóm caspase hành quyết.'
},
tnf: {
name: 'TNF', short: 'TNF', family: 'apop', noStructure: true,
aliases: ['tnf', 'tnf-alpha', 'tnf-\u03b1', 'tnf alpha', 'tnf-a', 'tumor necrosis factor', 'tumour necrosis factor', 'tumor necrosis factor alpha', 'tumor necrosis factor-alpha'],
note: 'Yếu tố hoại tử khối u (Tumor necrosis factor), một protein tín hiệu do các tế bào khác tiết ra. Đây là phối tử gây chết (death ligand) gắn vào các thụ thể trên tế bào đích.'
},
deathrc: {
name: 'phức hợp thụ thể chết', short: 'Phức hợp thụ thể', family: 'apop', noStructure: true, lines: ['thụ thể chết', 'complex'],
aliases: ['death receptor complex', 'death-domain complex', 'death domain complex', 'tnf-tnfr1 complex', 'tnfr1 complex', 'tnf receptor complex', 'receptor complex', 'tnf-bound receptor', 'activated death receptor', 'tnfr1 trimer', 'death receptor trimer', 'trimerized receptor', 'TNF-TNFR1', 'TNFR1-TNF', 'TNF/TNFR1', 'TNF-bound TNFR1', 'activated TNFR1'],
note: 'Ba chuỗi thụ thể được phối tử của chúng kéo lại với nhau. Các miền chết (death domain) ở đuôi của chúng hướng vào trong tế bào và sẵn sàng gắn các protein tiếp hợp.'
},
procasp8: {
name: 'Procaspase-8', short: 'Procaspase-8', family: 'apop', noStructure: true,
aliases: ['procaspase-8', 'pro-caspase-8', 'procaspase 8', 'pro-caspase 8', 'procasp8', 'inactive caspase-8', 'caspase-8 zymogen', 'caspase-8 precursor'],
note: 'Một tiền chất protease bất hoạt được protein tiếp hợp đưa tới thụ thể và được hoạt hóa tại đó.'
},
casp8a: {
name: 'Caspase-8 khởi phát', short: 'Caspase-8', family: 'apop', noStructure: true, twin: { kind: 'enzyme', id: 'casp8' },
aliases: ['initiator caspase-8', 'active caspase-8', 'caspase-8', 'caspase 8', 'activated caspase-8', 'casp8', 'caspase-8 (active)', 'cleaved caspase-8'],
note: 'Protease hoạt động đầu tiên của con đường ngoại sinh, tạo thành khi các phân tử tiền chất của nó được đưa lại gần nhau trên bệ đỡ ở bước trước.'
}
};
var enzyme = {
hexokinase: {
name: 'Hexokinase', short: 'HK', ec: '2.7.1.1', family: 'kinase',
aliases: ['hexokinase', 'hk', 'glucokinase', 'gck', 'hexokinase 1', 'HK1', 'HK2', 'HK4', 'hexokinase II', 'hexokinase IV', 'glucose kinase'],
note: 'Phosphoryl hóa glucose, giữ chặt nó trong tế bào. Không thuận nghịch. Hexokinase cơ bị ức chế bởi sản phẩm glucose 6-phosphate; glucokinase gan (đồng dạng có ái lực thấp) thì không. Giống mọi kinase ở đây, nó cần Mg²⁺ gắn với ATP.'
},
pgi: {
name: 'Glucosephosphate isomerase', short: 'PGI', ec: '5.3.1.9', family: 'isomerase',
aliases: ['phosphoglucose isomerase', 'pgi', 'glucose-6-phosphate isomerase', 'glucose phosphate isomerase', 'gpi', 'phosphohexose isomerase', 'phosphoglucoisomerase', 'G6P isomerase', 'G6PI', 'PHI', 'glucose-6-P isomerase', 'glucosephosphate isomerase', 'glucose-phosphate isomerase'],
note: 'Chuyển đổi đường aldose glucose 6-phosphate thành đường ketose fructose 6-phosphate. Hoàn toàn thuận nghịch.'
},
pfk1: {
name: 'Phosphofructokinase-1', short: 'PFK-1', ec: '2.7.1.11', family: 'kinase',
aliases: ['phosphofructokinase-1', 'pfk-1', 'pfk1', 'pfk', 'phosphofructokinase', '6-phosphofructo-1-kinase', '6-phosphofructokinase', 'phosphofructokinase 1 (PFK-1)', 'fructose-6-phosphate kinase', 'phosphofructokinase 1'],
note: 'Bước quyết định và điểm điều hòa chính của đường phân. Không thuận nghịch. Được hoạt hóa bởi AMP và fructose 2,6-bisphosphate, bị ức chế bởi ATP và citrate.'
},
aldolase: {
name: 'Aldolase', short: 'ALDO', ec: '4.1.2.13', family: 'lyase',
aliases: ['aldolase', 'fructose-bisphosphate aldolase', 'fructose bisphosphate aldolase', 'fructose-1,6-bisphosphate aldolase', 'aldo', 'fba', 'FBP aldolase', 'ALDOA'],
note: 'Phân cắt fructose 1,6-bisphosphate giữa carbon 3 và carbon 4 theo phản ứng aldol ngược, tạo DHAP và glyceraldehyde 3-phosphate.'
},
tpi: {
name: 'Triose phosphate isomerase', short: 'TPI', ec: '5.3.1.1', family: 'isomerase',
aliases: ['triose phosphate isomerase', 'triosephosphate isomerase', 'tpi', 'tim', 'TPI1', 'triose isomerase'],
note: 'Chuyển hóa qua lại giữa DHAP và glyceraldehyde 3-phosphate để cả hai nửa của glucose đều được sử dụng. Là một enzyme hoàn hảo về mặt xúc tác, tốc độ chỉ bị giới hạn bởi sự khuếch tán.'
},
gapdh: {
name: 'Glyceraldehyde-3-phosphate dehydrogenase', short: 'GAPDH', ec: '1.2.1.12', family: 'dehydrogenase',
aliases: ['glyceraldehyde-3-phosphate dehydrogenase', 'gapdh', 'gapd', 'glyceraldehyde phosphate dehydrogenase', 'triose phosphate dehydrogenase', 'GAP dehydrogenase', 'GA3PDH', 'glyceraldehyde-3-P dehydrogenase', 'glyceraldehyde 3-phosphate dehydrogenase (GAPDH)', 'glyceraldehyde-3-p dehydrogenase'],
note: 'Oxi hóa nhóm aldehyde và gắn phosphat vô cơ, khử NAD⁺ thành NADH và tạo acyl phosphate giàu năng lượng 1,3-BPG. Đây là bước bảo toàn năng lượng đầu tiên, xảy ra hai lần cho mỗi glucose.'
},
pgk: {
name: 'Phosphoglycerate kinase', short: 'PGK', ec: '2.7.2.3', family: 'kinase',
aliases: ['phosphoglycerate kinase', 'pgk', 'PGK1', '3-phosphoglycerate kinase', 'phosphoglyceric kinase'],
note: 'Phosphoryl hóa ở mức cơ chất: chuyển nhóm acyl phosphate của 1,3-BPG sang ADP. Bước này hoàn trả hai ATP đã tiêu tốn ở pha đầu tư.'
},
pgm: {
name: 'Phosphoglyceromutase', short: 'PGM', ec: '5.4.2.11', family: 'isomerase',
aliases: ['phosphoglycerate mutase', 'pgm', 'pgam', 'phosphoglyceromutase', 'PGAM1', 'phosphoglycerate phosphomutase', '2,3-bisphosphoglycerate-dependent phosphoglycerate mutase'],
note: 'Chuyển vị nhóm phosphat từ carbon 3 sang carbon 2 thông qua gốc phospho-histidine trên enzyme được mồi bởi một lượng nhỏ 2,3-bisphosphoglycerate.'
},
enolase: {
name: 'Enolase', short: 'ENO', ec: '4.2.1.11', family: 'lyase',
aliases: ['enolase', 'eno', 'phosphopyruvate hydratase', '2-phosphoglycerate dehydratase', 'ENO1', 'enolase 1', 'alpha-enolase', '2-phospho-D-glycerate hydro-lyase'],
note: 'Tách nước khỏi 2-phosphoglycerate, tạo thành enol phosphate là PEP. Cần Mg²⁺ và bị ức chế bởi fluoride.'
},
pk: {
name: 'Pyruvate kinase', short: 'PK', ec: '2.7.1.40', family: 'kinase',
aliases: ['pyruvate kinase', 'pk', 'pyk'],
note: 'Phosphoryl hóa ở mức cơ chất: PEP nhường nhóm phosphat cho ADP. Không thuận nghịch. Fructose 1,6-bisphosphate hoạt hóa nó theo cơ chế điều hòa xuôi (feed-forward); ATP và alanine ức chế nó.'
},
pdc: {
name: 'phức hợp pyruvate dehydrogenase', short: 'PDC', ec: '1.2.4.1', family: 'dehydrogenase',
aliases: ['pyruvate dehydrogenase complex', 'pyruvate dehydrogenase', 'pdh', 'pdc', 'pdh complex', 'pyruvate dehydrogenase multienzyme complex', 'PDHc', 'PDHC'],
note: 'Gồm ba enzyme (E1, E2, E3) và năm đồng yếu tố, trong đó có TPP, lipoamide và FAD. Cầu nối không thuận nghịch giữa đường phân và chu trình TCA; bị ức chế bởi acetyl-CoA, NADH và ATP.'
},
cs: {
name: 'Citrate synthase', short: 'CS', ec: '2.3.3.1', family: 'transferase',
aliases: ['citrate synthase', 'cs', 'citrate synthetase', 'condensing enzyme', 'citrate condensing enzyme'],
note: 'Ngưng tụ acetyl-CoA với oxaloacetate. Sự thủy phân liên kết thioester giải phóng CoA và kéo bước này tiến mạnh về phía trước. Là điểm điều hòa của chu trình: bị ức chế bởi ATP, NADH, succinyl-CoA và citrate.'
},
aconitase: {
name: 'Aconitase', short: 'ACO', ec: '4.2.1.3', family: 'lyase',
aliases: ['aconitase', 'aco', 'aconitate hydratase', 'aco2'],
note: 'Đồng phân hóa citrate thành isocitrate bằng cách tách nước tạo cis-aconitate rồi cộng nước lại tại một carbon khác. Chứa một cụm sắt-lưu huỳnh.'
},
idh: {
name: 'Isocitrate dehydrogenase', short: 'IDH', ec: '1.1.1.41', family: 'dehydrogenase',
aliases: ['isocitrate dehydrogenase', 'idh', 'idh3', 'nad-dependent isocitrate dehydrogenase', 'ICDH', 'isocitric dehydrogenase', 'NAD+-dependent isocitrate dehydrogenase', 'NAD isocitrate dehydrogenase', 'isocitrate dehydrogenase 3'],
note: 'Phản ứng khử carboxyl oxi hóa đầu tiên: giải phóng CO₂ và khử NAD⁺. Là điểm điều hòa then chốt, được hoạt hóa bởi ADP và Ca²⁺, bị ức chế bởi ATP và NADH.'
},
kgdh: {
name: 'phức hợp α-ketoglutarate dehydrogenase', short: 'KGDH', ec: '1.2.4.2', family: 'dehydrogenase',
aliases: ['alpha-ketoglutarate dehydrogenase complex', 'α-ketoglutarate dehydrogenase', 'alpha-ketoglutarate dehydrogenase', 'alpha ketoglutarate dehydrogenase', 'kgdh', 'akgdh', 'ogdh', '2-oxoglutarate dehydrogenase', '2-oxoglutarate dehydrogenase complex', 'akg dehydrogenase', 'alpha-kg dehydrogenase', 'α-kg dehydrogenase', 'αKGDH', 'alpha-KGDH', 'OGDC', 'KGDHC', 'ketoglutarate dehydrogenase', 'oxoglutarate dehydrogenase', 'oxoglutarate dehydrogenase complex', 'ketoglutarate dehydrogenase complex', 'a-ketoglutarate dehydrogenase', 'a-ketoglutarate dehydrogenase complex', '2-OGDH'],
note: 'Phản ứng khử carboxyl oxi hóa thứ hai. Có cấu trúc giống phức hợp pyruvate dehydrogenase và dùng cùng năm đồng yếu tố. Bị ức chế bởi succinyl-CoA, NADH và ATP.'
},
scs: {
name: 'Succinyl-CoA synthetase', short: 'SCS', ec: '6.2.1.4', family: 'ligase',
aliases: ['succinyl-coa synthetase', 'scs', 'succinate thiokinase', 'succinyl-coa ligase', 'sucla', 'sucg', 'succinyl coa synthase', 'succinyl-coa synthase', 'succinate-CoA ligase', 'succinate CoA ligase', 'SUCLA2', 'SUCLG1', 'SUCLG2', 'succinic thiokinase', 'succinyl thiokinase', 'succinate-CoA synthetase'],
note: 'Phosphoryl hóa ở mức cơ chất trong chu trình: năng lượng liên kết thioester của succinyl-CoA tạo ra GTP (hoặc ATP tùy đồng dạng enzyme).'
},
sdh: {
name: 'Phức hợp II (succinate dehydrogenase)', short: 'SDH', ec: '1.3.5.1', family: 'dehydrogenase',
aliases: ['succinate dehydrogenase', 'sdh', 'complex ii', 'complex 2', 'succinate-coq reductase', 'succinate ubiquinone oxidoreductase', 'succinic dehydrogenase', 'succinate dehydrogenase complex', 'SQR', 'SDHA', 'Respiratory complex II', 'succinate dehydrogenase (ubiquinone)'],
note: 'Enzyme duy nhất của chu trình gắn trong màng trong ty thể (Phức hợp II của chuỗi truyền electron). FAD của nó gắn cộng hóa trị và truyền electron cho ubiquinone; khác với Phức hợp I, III và IV, nó không bơm proton. Bị ức chế cạnh tranh bởi malonate.'
},
fumarase: {
name: 'Fumarase', short: 'FH', ec: '4.2.1.2', family: 'lyase',
aliases: ['fumarase', 'fumarate hydratase', 'fh'],
note: 'Cộng nước vào liên kết đôi của fumarate, tạo L-malate một cách đặc hiệu lập thể.'
},
mdh: {
name: 'Malate dehydrogenase', short: 'MDH', ec: '1.1.1.37', family: 'dehydrogenase',
aliases: ['malate dehydrogenase', 'mdh', 'mdh2', 'malic dehydrogenase', 'malic acid dehydrogenase', 'mitochondrial malate dehydrogenase', 'mdhm', 'mitochondrial mdh', 'malate dehydrogenase 2'],
note: 'Oxi hóa malate thành oxaloacetate. Phản ứng bất lợi về năng lượng ở điều kiện chuẩn nhưng được kéo về phía trước nhờ citrate synthase liên tục tiêu thụ oxaloacetate.'
},
g6pase: { name: 'Glucose-6-phosphatase', short: 'G6Pase', ec: '3.1.3.9', family: 'phosphatase', aliases: ['glucose-6-phosphatase', 'g6pase', 'glucose 6-phosphatase'], note: 'Enzyme của gluconeogenesis giúp tách nhóm phosphate khỏi glucose 6-phosphate.' },
fbpase: { name: 'Fructose-1,6-bisphosphatase', short: 'FBPase', ec: '3.1.3.11', family: 'phosphatase', aliases: ['fructose-1,6-bisphosphatase', 'fbpase', 'fbpase-1', 'fructose bisphosphatase'], note: 'Enzyme của gluconeogenesis đối kháng với PFK-1.' },
pglucomutase: { name: 'Phosphoglucomutase', short: 'PgluM', ec: '5.4.2.2', family: 'isomerase', aliases: ['phosphoglucomutase', 'pgluM', 'pgmu', 'pgm', 'pgm1'], note: 'Chuyển hóa qua lại giữa glucose 1-phosphate và glucose 6-phosphate.' },
g6pdh: { name: 'Glucose-6-phosphate dehydrogenase', short: 'G6PD', family: 'dehydrogenase', decoy: true, aliases: ['glucose-6-phosphate dehydrogenase', 'g6pd', 'g6pdh'], note: 'Enzyme đầu tiên của pentose phosphate pathway.' },
ldh: { name: 'Lactate dehydrogenase', short: 'LDH', ec: '1.1.1.27', family: 'dehydrogenase', aliases: ['lactate dehydrogenase', 'ldh'], note: 'Khử pyruvate thành lactate và tái tạo NAD⁺ cho bước glyceraldehyde 3-phosphate dehydrogenase, giúp glycolysis tiếp tục chạy khi không có oxygen. Ở gan và tim, phản ứng chủ yếu diễn ra theo chiều ngược lại.' },
pc: { name: 'Pyruvate carboxylase', short: 'PC', ec: '6.4.1.1', family: 'ligase', aliases: ['pyruvate carboxylase', 'pc'], note: 'Tạo oxaloacetate từ pyruvate, bước đầu tiên của gluconeogenesis. Cần biotin.' },
pepck: { name: 'PEP carboxykinase', short: 'PEPCK', ec: '4.1.1.32', family: 'lyase', aliases: ['pep carboxykinase', 'pepck', 'phosphoenolpyruvate carboxykinase'], note: 'Chuyển oxaloacetate thành PEP trong gluconeogenesis.' },
adh: { name: 'Dehydrogenase rượu', short: 'ADH', ec: '1.1.1.1', family: 'dehydrogenase', aliases: ['alcohol dehydrogenase', 'adh'], note: 'Khử acetaldehyde thành ethanol trong fermentation.' },
pyrdecarb: { name: 'Pyruvate decarboxylase', short: 'PDC (men)', ec: '4.1.1.1', family: 'lyase', aliases: ['pyruvate decarboxylase', 'pdc'], note: 'Enzyme của nấm men biến đổi pyruvate thành acetaldehyde.' },
glycerol3pdh: { name: 'Glycerol-3-phosphate dehydrogenase', short: 'GPDH', ec: '1.1.1.8', family: 'dehydrogenase', aliases: ['glycerol-3-phosphate dehydrogenase', 'gpdh', 'glycerol 3-phosphate dehydrogenase', 'cytosolic glycerol-3-phosphate dehydrogenase', 'gpd1', 'cytoplasmic glycerol-3-phosphate dehydrogenase', 'g3pdh', 'glycerol phosphate dehydrogenase', 'glycerol-3-p dehydrogenase', 'cytosolic glycerol-3-p dehydrogenase', 'cytosolic gpdh', 'gpdh1', 'nad-linked glycerol phosphate dehydrogenase'], note: 'Enzyme phụ thuộc NAD của cytosol. Khử dihydroxyacetone phosphate thành glycerol 3-phosphate bằng electrons từ cytosolic NADH, là bước đầu của glycerol phosphate shuttle; đồng thời kết nối glycolysis với tổng hợp lipid.' },
gdh: { name: 'Glutamate dehydrogenase', short: 'GDH', ec: '1.4.1.3', family: 'dehydrogenase', aliases: ['glutamate dehydrogenase', 'gdh', 'gdh1', 'glud1', 'glutamic dehydrogenase', 'glutamate dehydrogenase 1', 'glutamate dehydrogenase-1'], note: 'Enzyme kết nối chuyển hóa amino acid với TCA cycle: tách nhóm amino của glutamate dưới dạng ammonium (oxidative deamination) và theo chiều ngược lại, gắn ammonium vào alpha-ketoglutarate để tạo glutamate. Dùng NAD⁺ cho deamination và NADPH cho amination, hoạt động trong ty thể của gan.' },
alt: { name: 'Alanine aminotransferase', short: 'ALT', ec: '2.6.1.2', family: 'transferase', aliases: ['alanine aminotransferase', 'alt', 'alanine transaminase', 'gpt', 'glutamate-pyruvate transaminase', 'glutamic pyruvic transaminase', 'alat', 'sgpt'], note: 'Enzyme dùng vitamin B6 chuyển nhóm amino giữa alanine và glutamate: alanine nhường nhóm amino cho alpha-ketoglutarate, tạo pyruvate và glutamate. Trong glucose-alanine cycle, nó chạy theo chiều tạo alanine ở cơ và quay lại tạo pyruvate ở gan; nồng độ ALT cao trong máu là dấu hiệu tổn thương gan.' },
ast: { name: 'Aspartate aminotransferase', short: 'AST', ec: '2.6.1.1', family: 'transferase', aliases: ['aspartate aminotransferase', 'ast', 'aspartate transaminase', 'got', 'glutamate-oxaloacetate transaminase', 'got1', 'got2', 'astc', 'astm', 'cytosolic ast', 'mitochondrial ast'], note: 'Enzyme dùng vitamin B6 chuyển nhóm amino giữa aspartate và glutamate. Một isoform trong matrix và một isoform ở cytosol thực hiện hai bước transamination của malate-aspartate shuttle.' },
icl: { name: 'Isocitrate lyase', short: 'ICL', family: 'lyase', decoy: true, aliases: ['isocitrate lyase', 'icl'], note: 'Enzyme của chu trình glyoxylate giúp đi vòng qua các bước khử carboxyl.' },
acl: { name: 'ATP-citrate lyase', short: 'ACLY', family: 'lyase', decoy: true, aliases: ['atp-citrate lyase', 'acly', 'acl', 'atp citrate lyase'], note: 'Tái tạo acetyl-CoA trong bào tương bằng cách phân cắt citrate được xuất ra từ ty thể.' },
ndpk: { name: 'Nucleoside diphosphate kinase', short: 'NDPK', family: 'kinase', decoy: true, aliases: ['nucleoside diphosphate kinase', 'ndpk', 'ndk'], note: 'Chuyển nhóm phosphate tận cùng giữa các nucleoside diphosphates và triphosphates, ví dụ GTP + ADP thành GDP + ATP.' },
malic: { name: 'Enzyme malic', short: 'ME', family: 'dehydrogenase', decoy: true, aliases: ['malic enzyme', 'me', 'malate decarboxylase'], note: 'Khử carboxyl (decarboxylates) malate thành pyruvate.' },
complex1: {
name: 'Phức hợp I (NADH dehydrogenase)', short: 'Phức hợp I', ec: '7.1.1.2', family: 'etc',
aliases: ['complex i', 'complex 1', 'nadh dehydrogenase', 'nadh:ubiquinone oxidoreductase', 'nadh-ubiquinone oxidoreductase', 'nadh-q oxidoreductase', 'nadh:q oxidoreductase', 'nadh coq reductase', 'nadh-coq reductase', 'nadh ubiquinone reductase', 'nadh-q reductase', 'nadh dehydrogenase complex', 'respiratory complex i'],
note: 'Phức hợp lớn nhất của chuỗi, gồm 45 tiểu đơn vị ở động vật có vú. NADH truyền electron qua FMN và chuỗi cụm sắt-lưu huỳnh tới ubiquinone, đồng thời enzyme bơm 4 H⁺ từ chất nền ra khoang gian màng cho mỗi 2 electron. Rotenone và amytal ức chế phức hợp này.'
},
complex3: {
name: 'Phức hợp III (phức hợp cytochrome bc₁)', short: 'Phức hợp III', ec: '7.1.1.8', family: 'etc',
aliases: ['complex iii', 'complex 3', 'cytochrome bc1 complex', 'cytochrome bc1', 'bc1 complex', 'cytochrome b-c1 complex', 'coenzyme q-cytochrome c oxidoreductase', 'ubiquinol-cytochrome c oxidoreductase', 'ubiquinol:cytochrome c oxidoreductase', 'q-cytochrome c oxidoreductase', 'cytochrome c reductase', 'respiratory complex iii', 'ubiquinol cytochrome c reductase', 'ubiquinol-cytochrome c reductase', 'coenzyme q-cytochrome c reductase', 'bc1', 'qcr'],
note: 'Gồm 11 tiểu đơn vị khác nhau ở động vật có vú. Chu trình quinone truyền từng electron một từ ubiquinol sang cytochrome c và vận chuyển 4 H⁺ vào khoang gian màng cho mỗi ubiquinol bị oxi hóa. Antimycin A ức chế phức hợp này.'
},
complex4: {
name: 'Phức hợp IV (cytochrome c oxidase)', short: 'Phức hợp IV', ec: '7.1.1.9', family: 'etc',
aliases: ['complex iv', 'complex 4', 'cytochrome c oxidase', 'cytochrome oxidase', 'cox', 'cco', 'respiratory complex iv', 'cytochrome aa3', 'cyt aa3', 'cytochrome c oxidase complex'],
note: 'Gồm 13 tiểu đơn vị ở động vật có vú, với hai nhóm heme và ba ion đồng. Nó truyền electron từ cytochrome c qua các trung tâm đồng và heme tới O₂ để tạo nước, đồng thời bơm 4 H⁺ cho mỗi O₂ (2 H⁺ cho mỗi cặp electron). Cyanide, azide và carbon monoxide ức chế phức hợp này.'
},
atpsynthase: {
name: 'Phức hợp V (ATP synthase)', short: 'ATP synthase', ec: '7.1.2.2', family: 'etc',
aliases: ['atp synthase', 'complex v', 'complex 5', 'f1fo atp synthase', 'f0f1 atp synthase', 'f1f0 atp synthase', 'f1fo atpase', 'f0f1 atpase', 'f1f0 atpase', 'atp synthetase', 'f-type atpase'],
note: 'F₁F₀ ATP synthase. Dòng proton chảy xuôi gradient qua vòng F₀ làm quay rotor, và đầu F₁ tổng hợp ATP từ ADP và phosphat vô cơ (khoảng 4 H⁺ cho mỗi ATP: vòng c nhận 12 proton mỗi vòng quay và mỗi vòng quay tạo 3 ATP). Oligomycin phong bế F₀; các chất tách cặp như DNP cho phép proton đi vòng qua nó.'
},
ucp1: { name: 'Protein tách cặp 1', short: 'UCP1', family: 'etc', decoy: true, aliases: ['uncoupling protein 1', 'ucp1', 'thermogenin', 'uncoupling protein'], note: 'Cho phép proton rò rỉ ngược qua màng trong ty thể ở mô mỡ nâu, nên năng lượng được giải phóng dưới dạng nhiệt thay vì tạo ATP.' },
aox: { name: 'Oxitase thay thế', short: 'AOX', family: 'etc', decoy: true, aliases: ['alternative oxidase', 'aox', 'cyanide-resistant oxidase'], note: 'Có ở thực vật và nấm. Truyền electron từ ubiquinol thẳng tới O₂, bỏ qua Phức hợp III và IV.' },
ant: { name: 'Chất vận chuyển ADP/ATP', short: 'ANT', family: 'translocase', aliases: ['adp/atp translocase', 'adp atp translocase', 'ant', 'adenine nucleotide translocase', 'atp/adp carrier', 'atp-adp translocase', 'atp adp translocase', 'atp/adp translocase', 'atp-adp carrier', 'atp-adp antiporter', 'adp-atp antiporter', 'adenine nucleotide carrier', 'adenine nucleotide transporter', 'aac', 'mitochondrial adp/atp carrier', 'atp-adp exchanger', 'adp/atp exchanger', 'slc25a4'], note: 'Một protein đối vận chiếm khoảng 14% lượng protein của màng trong ty thể. Nó trao đổi ATP tạo ra trong chất nền với ADP từ bào tương theo tỉ lệ 1:1, và điện thế màng thuận lợi cho việc xuất ATP (ATP mang nhiều hơn một điện tích âm). Sự trao đổi này tiêu tốn khoảng một phần tư năng lượng của chuỗi.' },
mdh1: { name: 'Malate dehydrogenase trong tế bào chất', short: 'MDH1', ec: '1.1.1.37', family: 'dehydrogenase', acceptAlso: ['mdh'], aliases: ['cytosolic malate dehydrogenase', 'mdh1', 'cytoplasmic malate dehydrogenase', 'malate dehydrogenase (cytosolic)', 'malate dehydrogenase 1', 'mdhc', 'cytosolic mdh', 'cytoplasmic mdh'], note: 'Enzyme phụ thuộc NAD ở cytosol tác động lên các axit bốn carbon. Khử oxaloacetate thành malate bằng electrons của cytosolic NADH, bước đầu của malate-aspartate shuttle.' },
mkat: { name: 'Chất vận chuyển ngược malate-α-ketoglutarate', short: 'OGC', family: 'translocase', aliases: ['malate-alpha-ketoglutarate antiporter', 'malate-a-ketoglutarate antiporter', 'malate alpha-ketoglutarate antiporter', 'malate-ketoglutarate antiporter', 'malate/alpha-ketoglutarate antiporter', 'oxoglutarate carrier', 'ogc', 'malate-\u03b1-ketoglutarate antiporter', 'malate alpha ketoglutarate carrier', 'malate-alpha-ketoglutarate transporter', 'malate/alpha-ketoglutarate transporter', 'malate-oxoglutarate carrier', 'malate-oxoglutarate antiporter', 'alpha-ketoglutarate/malate antiporter', 'oxoglutarate/malate carrier', 'malate-alpha-ketoglutarate translocase', 'slc25a11'], note: 'Một chất mang trên màng trong vận chuyển malate vào chất nền ty thể để đổi lấy α-ketoglutarate đi ra. Không có sự oxi hóa hay khử nào trong bước này.' },
gaa: { name: 'Chất vận chuyển ngược glutamate-aspartate', short: 'AGC', family: 'translocase', aliases: ['glutamate-aspartate antiporter', 'glutamate aspartate antiporter', 'aspartate-glutamate carrier', 'aspartate glutamate carrier', 'agc', 'aralar', 'citrin', 'glutamate/aspartate antiporter', 'glutamate-aspartate transporter', 'glutamate-aspartate carrier', 'aspartate-glutamate antiporter', 'aspartate-glutamate transporter', 'glutamate-aspartate translocase', 'agc1', 'agc2', 'slc25a12', 'slc25a13'], note: 'Một chất mang trên màng trong xuất aspartate từ chất nền và nhập glutamate vào. Quá trình này do điện thế màng thúc đẩy, khiến con thoi malate-aspartate chỉ chạy theo một chiều.' },
gpd2: { name: 'Dehydrogenase glycerol phosphate ty thể', short: 'GPD2', ec: '1.1.5.3', family: 'dehydrogenase', acceptAlso: ['glycerol3pdh'], aliases: ['mitochondrial glycerol-3-phosphate dehydrogenase', 'mitochondrial glycerol phosphate dehydrogenase', 'gpd2', 'mitochondrial glycerol 3-phosphate dehydrogenase', 'glycerol phosphate shuttle enzyme', 'mitochondrial glycerol-3-p dehydrogenase', 'mgpdh', 'mitochondrial gpdh', 'fad-linked glycerol phosphate dehydrogenase', 'glycerol-3-phosphate dehydrogenase (mitochondrial)', 'glycerol-3-phosphate:ubiquinone oxidoreductase'], note: 'Đưa electrons vào ubiquinol, bỏ qua Complex I (glycerol phosphate shuttle).' },
glycogensynthase: { name: 'Glycogen synthase', short: 'GYS', ec: '2.4.1.11', family: 'transferase', aliases: ['glycogen synthase', 'gys', 'gys1', 'glycogen synthetase', 'udp-glucose glycogen glucosyltransferase'], note: 'Gắn glucose từ UDP-glucose vào đầu không khử (non-reducing end) của chuỗi glycogen (liên kết alpha-1,4). Đây là enzyme điều hòa chính của quá trình tổng hợp glycogen, bị ức chế bởi phosphorylation.' },
glycogenphosphorylase: { name: 'Glycogen phosphorylase', short: 'GP', ec: '2.4.1.1', family: 'transferase', aliases: ['glycogen phosphorylase', 'gp', 'phosphorylase', 'glycogen phosphorylase a', 'glycogen phosphorylase b', 'pygl', 'pygm', 'phosphorylase a', 'phosphorylase b'], note: 'Phân giải glycogen từ các đầu không khử bằng phosphorolysis: inorganic phosphate (chứ không phải nước) cắt liên kết, nên glucose được giải phóng ở dạng đã phosphoryl hóa (glucose 1-phosphate) mà không tốn ATP. Cần pyridoxal phosphate.' },
ugpase: { name: 'UDP-glucose pyrophosphorylase', short: 'UGP', ec: '2.7.7.9', family: 'transferase', aliases: ['udp-glucose pyrophosphorylase', 'ugp', 'ugpase', 'udp glucose pyrophosphorylase', 'udp-glucose phosphorylase', 'glucose-1-phosphate uridylyltransferase', 'udpg pyrophosphorylase', 'g1p uridylyltransferase', 'udp-glucose pyrophosphorylase (ugpase)'], note: 'Gắn glucose 1-phosphate vào phần UMP của UTP, giải phóng pyrophosphate. Sự phân giải pyrophosphate bởi pyrophosphatase kéo phản ứng tiến về phía trước. Đơn vị UMP được chuyển lên đường chứ không bị giải phóng.' },
lipase: { name: 'Lipase', short: 'Lipase', ec: '3.1.1.3', family: 'hydrolase', aliases: ['lipases', 'lipase', 'triacylglycerol lipase', 'triglyceride lipase', 'hormone-sensitive lipase', 'hsl', 'atgl', 'adipose triglyceride lipase', 'pancreatic lipase', 'lipoprotein lipase'], note: 'Thủy phân các liên kết ester của triacylglycerol, giải phóng free fatty acids và glycerol. Trong tế bào mỡ, hormone-sensitive lipase được bật lên bởi epinephrine và glucagon.' },
acs: { name: 'Fatty acyl-CoA synthetase', short: 'ACS', ec: '6.2.1.3', family: 'ligase', aliases: ['fatty acyl-coa synthetase', 'acyl-coa synthetase', 'acyl coa synthetase', 'acsl', 'long-chain acyl-coa synthetase', 'thiokinase', 'fatty acid thiokinase', 'fatty acid coa ligase', 'acyl-coa ligase', 'acyl-coa synthase', 'fatty acid activation enzyme', 'long chain fatty acid coa ligase'], note: 'Hoạt hóa một fatty acid bằng cách nối nó với coenzyme A. ATP bị cắt thành AMP và pyrophosphate (tiêu tốn hai liên kết giàu năng lượng), sau đó chuỗi đã hoạt hóa được đưa vào ty thể qua carnitine shuttle. Lipases giải phóng axit từ chất béo, còn enzyme này hoạt hóa chúng.' },
acadh: { name: 'Acyl-CoA dehydrogenase', short: 'ACAD', ec: '1.3.8.7', family: 'dehydrogenase', aliases: ['acyl-coa dehydrogenase', 'acad', 'acyl coa dehydrogenase', 'vlcad', 'lcad', 'mcad', 'scad', 'fatty acyl-coa dehydrogenase', 'acyl-coa dehydrogenase (fad)'], note: 'Bước đầu tiên của mỗi vòng beta-oxidation: loại bỏ hai hydro khỏi các carbon alpha và beta, tạo thành một trans double bond. FAD của nó truyền electrons tới electron transport chain (qua ETF).' },
enoylh: { name: 'Enoyl-CoA hydratase', short: 'ECH', ec: '4.2.1.17', family: 'lyase', aliases: ['enoyl-coa hydratase', 'ech', 'crotonase', 'enoyl coa hydratase', 'enoyl-coa hydrase', 'enoylcoa hydratase'], note: 'Cộng nước vào trans double bond, gắn một nhóm L-hydroxyl vào beta carbon.' },
hadh: { name: 'L-Hydroxyacyl-CoA dehydrogenase', short: 'HADH', ec: '1.1.1.35', family: 'dehydrogenase', aliases: ['l-hydroxyacyl-coa dehydrogenase', 'hadh', 'l-3-hydroxyacyl-coa dehydrogenase', '3-hydroxyacyl-coa dehydrogenase', 'beta-hydroxyacyl-coa dehydrogenase', 'β-hydroxyacyl-coa dehydrogenase', 'hydroxyacyl-coa dehydrogenase', 'l-hydroxyacyl coa dehydrogenase', 'hydroxyacyl coa dehydrogenase'], note: 'Oxy hóa nhóm beta-hydroxyl thành ketone bằng NAD⁺, tạo thành beta-ketoacyl-CoA.' },
thiolase: { name: 'β-Ketoacyl-CoA thiolase', short: 'Thiolase', ec: '2.3.1.16', family: 'transferase', aliases: ['thiolase', 'beta-ketoacyl-coa thiolase', 'β-ketoacyl-coa thiolase', 'ketoacyl-coa thiolase', 'acetyl-coa acyltransferase', 'acyl-coa acetyltransferase', '3-ketoacyl-coa thiolase', 'thiolase i', 'acaa', 'acaa2', 'beta-ketothiolase', 'β-ketothiolase', 'beta ketoacyl coa thiolase'], note: 'Cắt beta-ketoacyl-CoA giữa carbon alpha và beta bằng một coenzyme A mới: acetyl-CoA được giải phóng và acyl-CoA, ngắn đi hai carbons, quay lại đầu vòng xoắn.' },
acc: { name: 'Acetyl-CoA carboxylase', short: 'ACC', ec: '6.4.1.2', family: 'ligase', decoy: true, aliases: ['acetyl-coa carboxylase', 'acc', 'acc1', 'acc2'], note: 'Bước cam kết (committed step) của quá trình TỔNG HỢP fatty acid (acetyl-CoA thành malonyl-CoA), ngược chiều với beta-oxidation.' },
cpt1: { name: 'Carnitine palmitoyltransferase I', short: 'CPT1', ec: '2.3.1.21', family: 'transferase', decoy: true, aliases: ['carnitine palmitoyltransferase i', 'cpt1', 'cpt-1', 'carnitine acyltransferase i', 'cpt i'], note: 'Chuyển các nhóm acyl mạch dài lên carnitine để chúng có thể đi vào ty thể; là điểm kiểm soát chính của beta-oxidation.' },
debranch: { name: 'Enzyme phân nhánh glycogen', short: 'GDE', ec: '3.2.1.33', family: 'transferase', decoy: true, aliases: ['glycogen debranching enzyme', 'debranching enzyme', 'gde', 'agl'], note: 'Loại bỏ các nhánh alpha-1,6 để glycogen phosphorylase có thể tiếp tục hoạt động.' },
branching: { name: 'Enzyme phân nhánh glycogen', short: 'GBE', ec: '2.4.1.18', family: 'transferase', decoy: true, aliases: ['glycogen branching enzyme', 'branching enzyme', 'gbe', 'amylo-(1,4 to 1,6) transglycosylase'], note: 'Tạo các nhánh alpha-1,6 của glycogen.' },
porin: {
name: 'Porin (VDAC)', short: 'Porin', family: 'channel',
aliases: ['porin', 'porins', 'vdac', 'vdac1', 'voltage-dependent anion channel', 'voltage dependent anion channel', 'mitochondrial porin', 'outer membrane porin', 'outer membrane channel', 'outer mitochondrial membrane channel', 'mitochondrial outer membrane channel', 'outer membrane pore', 'porin channel', 'porin channels', 'voltage-dependent anion-selective channel', 'outer mitochondrial membrane porin'],
note: 'Một thùng gồm các sợi beta tạo kênh chứa nước trên màng ngoài ty thể. Các phân tử nhỏ như pyruvate, ADP và ATP đi qua tự do, nên màng ngoài không cản trở chúng. Protein này không xúc tác phản ứng hóa học.'
},
pyrsym: {
name: 'chất vận chuyển đồng thời H⁺/pyruvate', short: 'MPC', family: 'symporter',
aliases: ['h+/pyruvate symporter', 'h+ pyruvate symporter', 'pyruvate/h+ symporter', 'proton/pyruvate symporter', 'proton pyruvate symporter', 'pyruvate-proton symporter', 'h+/pyruvate cotransporter', 'pyruvate symporter', 'pyruvate carrier', 'mitochondrial pyruvate carrier', 'mpc', 'mpc1', 'mpc2', 'mpc1/mpc2', 'pyruvate transporter', 'mitochondrial pyruvate transporter', 'pyruvate translocase', 'hydrogen/pyruvate symporter', 'h+/pyruvate symport', 'proton/pyruvate symport'],
note: 'Màng trong không thấm với acid này, nên một chất mang vận chuyển nó vào chất nền cùng với một ion dương nhỏ nhờ gradient do chuỗi truyền electron tạo ra. Chất mang gồm hai protein nhỏ là MPC1 và MPC2.'
},
drp1: {
name: 'Drp1', short: 'Drp1', ec: '3.6.5.5', family: 'gtpase',
aliases: ['drp1', 'dnm1l', 'dynamin-related protein 1', 'dynamin related protein 1', 'dynamin-related protein', 'dynamin related protein', 'drp', 'dynamin-like protein 1', 'dlp1', 'dynamin-like protein'],
note: 'Dynamin-related protein 1, một GTPase trong bào tương. Các protein tiếp hợp trên màng ngoài tuyển mộ nó tới những vị trí mà lưới nội chất đã thắt hẹp ty thể. Nó lắp ráp thành vòng, và sự thủy phân GTP siết chặt vòng cho đến khi bào quan tách đôi.'
},
mfn: {
name: 'Mitofusin (Mfn1/2)', short: 'Mfn1/2', family: 'gtpase',
aliases: ['mfn1/2', 'mfn1', 'mfn2', 'mfn1/mfn2', 'mfn1 and mfn2', 'mfn1, mfn2', 'mitofusin', 'mitofusins', 'mitofusin 1', 'mitofusin 2', 'mitofusin1', 'mitofusin2', 'mfn', 'mitofusin 1/2', 'mitofusin1/2', 'mitofusin 1 and 2'],
note: 'Các GTPase trên màng ngoài. Các mitofusin trên hai ty thể kế cận gắn với nhau và dùng năng lượng GTP kéo hai màng ngoài áp sát đến khi hợp nhất. Mfn2 cũng neo giữ ty thể với lưới nội chất.'
},
opa1: {
name: 'Opa1', short: 'Opa1', family: 'gtpase',
aliases: ['opa1', 'opa-1', 'optic atrophy 1', 'optic atrophy protein 1', 'optic atrophy-1', 'optic atrophy1'],
note: 'Một GTPase trên màng trong có nhiệm vụ hợp nhất hai màng trong sau khi hai màng ngoài đã nối liền. Nó cũng định hình mào ty thể (cristae), và sự phân cắt nó góp phần giải phóng cytochrome c trong apoptosis.'
},
mff: {
name: 'Mff', short: 'Mff', family: 'adaptor', decoy: true,
aliases: ['mff', 'mitochondrial fission factor'],
note: 'Yếu tố phân hạch ty thể (Mitochondrial fission factor), một protein tiếp hợp trên màng ngoài có nhiệm vụ tuyển mộ Drp1 (Fis1 và các protein MiD có vai trò tương tự). Bản thân nó không phải GTPase.'
},
fis1: {
name: 'Fis1', short: 'Fis1', family: 'adaptor', decoy: true,
aliases: ['fis1', 'fission 1', 'mitochondrial fission 1 protein'],
note: 'Protein phân hạch ty thể 1 (Mitochondrial fission protein 1), một protein tiếp hợp màng ngoài giúp tuyển mộ Drp1. Bản thân nó không phải GTPase.'
},
pink1: {
name: 'PINK1', short: 'PINK1', ec: '2.7.11.1', family: 'kinase', decoy: true,
aliases: ['pink1', 'pink', 'pten-induced kinase 1', 'pten induced putative kinase 1'],
note: 'Một kinase tích tụ trên màng ngoài của ty thể bị khử cực và tuyển mộ Parkin, đánh dấu bào quan cho quá trình tự thực ty thể (mitophagy).'
},
parkin: {
name: 'Parkin', short: 'Parkin', ec: '2.3.2.31', family: 'ligase', decoy: true,
aliases: ['parkin', 'park2', 'prkn'],
note: 'Một E3 ubiquitin ligase được PINK1 tuyển mộ, gắn ubiquitin lên các protein màng ngoài của ty thể bị tổn thương để phát tín hiệu tự thực ty thể.'
},
mid49: {
name: 'MiD49', short: 'MiD49', family: 'adaptor', decoy: true,
aliases: ['mid49', 'mitochondrial dynamics protein of 49 kda', 'mief2'],
note: 'Protein động học ty thể 49 kDa, một protein tiếp hợp màng ngoài tuyển mộ Drp1 (tương tự MiD51 và Mff). Bản thân nó không phải GTPase.'
},
mid51: {
name: 'MiD51', short: 'MiD51', family: 'adaptor', decoy: true,
aliases: ['mid51', 'mitochondrial dynamics protein of 51 kda', 'mief1'],
note: 'Protein động học ty thể 51 kDa, một protein tiếp hợp màng ngoài tuyển mộ Drp1 (tương tự MiD49 và Mff). Bản thân nó không phải GTPase.'
},
tradd: {
name: 'TRADD', short: 'TRADD', family: 'adaptor', decoy: true,
aliases: ['tradd', 'tnf receptor-associated death domain', 'tnfr1-associated death domain protein'],
note: 'Một protein tiếp hợp gắn vào các miền chết bộc lộ của TNFR1 rồi tiếp tục gắn với FADD; phức hợp đầu tiên của thụ thể cũng chứa RIP1 và TRAF2.'
},
bax: {
name: 'Bax', short: 'Bax', family: 'poreformer',
aliases: ['bax', 'bcl-2-associated x protein', 'bcl2 associated x protein', 'bax protein', 'bax/bak', 'bax and bak', 'bak', 'pro-apoptotic factor', 'pro-apoptotic factors', 'pro-apoptotic protein', 'pro-apoptotic bcl-2 protein'],
note: 'Một thành viên thúc đẩy apoptosis của họ Bcl-2. Khi tổn thương nghiêm trọng kích hoạt nó, nó di chuyển tới màng ngoài ty thể và lắp ráp thành các lỗ (cùng người anh em Bak). Các protein Bcl-2 chống apoptosis kìm giữ nó cho đến khi chính chúng bị ức chế.'
},
apaf1: {
name: 'Apaf-1', short: 'Apaf-1', family: 'adaptor',
aliases: ['apaf-1', 'apaf1', 'apoptotic protease activating factor 1', 'apoptotic protease-activating factor 1', 'apoptotic protease activating factor-1'],
note: 'Một protein tiếp hợp lớn trong bào tương được bật lên bởi một protein heme nhỏ và một nucleotide, rồi lắp ráp thành một vòng gồm bảy phân tử.'
},
apoptosomeenz: {
name: 'Apoptosome', short: 'Apoptosome', family: 'platform',
aliases: ['apoptosome', 'the apoptosome', 'apoptosome complex', 'apaf-1 apoptosome', 'apaf-1/cytochrome c complex'],
note: 'Một bánh xe gồm bảy phân tử protein tiếp hợp tuyển mộ các tiền chất protease bất hoạt về trục của nó; khi bị giữ sát nhau, chúng tự cắt và hoạt hóa lẫn nhau.'
},
casp9: {
name: 'Caspase-9', short: 'Casp-9', ec: '3.4.22.62', family: 'protease',
aliases: ['caspase-9', 'caspase 9', 'casp9', 'casp-9', 'active caspase-9', 'initiator caspase-9'],
note: 'Caspase khởi phát của con đường nội sinh: một protease cắt sau các gốc aspartate. Được hoạt hóa tại apoptosome, nó cắt và hoạt hóa procaspase-3, enzyme hành quyết chính.'
},
casp8: {
name: 'Caspase-8', short: 'Casp-8', ec: '3.4.22.61', family: 'protease',
aliases: ['caspase-8', 'caspase 8', 'casp8', 'casp-8', 'active caspase-8', 'initiator caspase-8'],
note: 'Caspase khởi phát của con đường ngoại sinh. Các tiền chất bất hoạt được tập hợp tại phức hợp thụ thể sẽ tự cắt lẫn nhau và trở nên hoạt động; protease hoạt động sau đó hoạt hóa các procaspase hành quyết.'
},
casp3: {
name: 'Caspase-3', short: 'Casp-3', ec: '3.4.22.56', family: 'protease',
aliases: ['caspase-3', 'caspase 3', 'casp3', 'casp-3', 'executioner caspase', 'executioner caspases', 'effector caspase', 'effector caspases', 'caspase-3/7', 'active caspase-3', 'caspase-7', 'executioner caspase-3', 'executioner caspase 3', 'caspase-3 (active)'],
note: 'Protease chính đảm nhiệm việc tháo dỡ tế bào bằng cách cắt hàng trăm protein. Caspase-6 và -7 hoạt động theo cách tương tự.'
},
tnfr1: {
name: 'TNFR1', short: 'TNFR1', family: 'receptor',
aliases: ['tnfr1', 'tnf receptor 1', 'tnf receptor-1', 'tnf receptor type 1', 'tumor necrosis factor receptor 1', 'tumor necrosis factor receptor-1', 'tnfrsf1a', 'death receptor tnfr1', 'tnf-r1', 'p55', 'TNF receptor', 'TNFR', 'tumor necrosis factor receptor'],
note: 'Một protein thụ thể trên màng sinh chất có miền chết ở phần đuôi. TNF kéo ba chuỗi thụ thể lại với nhau làm bộc lộ miền chết cho các protein tiếp hợp. Ở nhiều tế bào, TNF chủ yếu bật tín hiệu sống sót và chỉ gây apoptosis khi tín hiệu đó thất bại; thụ thể Fas và TRAIL mới là các thụ thể chết kinh điển.'
},
fadd: {
name: 'FADD', short: 'FADD', family: 'adaptor',
aliases: ['fadd', 'fas-associated death domain', 'fas-associated death domain protein', 'fas associated death domain', 'fas associated protein with death domain', 'fadd/tradd', 'tradd/fadd', 'fadd and tradd', 'tradd and fadd', 'fadd, tradd', 'FADD protein'],
note: 'Một protein tiếp hợp có miền chết ở một đầu và vùng gắn thứ hai ở đầu kia. Với TNFR1, nó gắn vào TRADD (chất gắn vào miền chết của thụ thể), còn đầu kia gắn procaspase-8, đưa nhiều phân tử procaspase-8 lại đủ gần để hoạt hóa lẫn nhau.'
},
cps1: {
name: 'Carbamoyl phosphate synthetase I', short: 'CPS I', ec: '6.3.4.16', family: 'ligase',
aliases: ['carbamoyl phosphate synthetase i', 'cps1', 'cps i', 'carbamoyl phosphate synthetase 1', 'carbamoyl phosphate synthetase', 'carbamyl phosphate synthetase i', 'carbamoyl-phosphate synthase (ammonia)', 'carbamoylphosphate synthetase', 'carbamoyl phosphate synthase i', 'carbamyl phosphate synthetase'],
note: 'Bước quyết định của chu trình ure, diễn ra trong chất nền ty thể ở gan. Enzyme chỉ hoạt động khi có gắn N-acetylglutamate — một chất hoạt hóa được tạo ra khi glutamate và arginine dồi dào.'
},
otc: {
name: 'Ornithine transcarbamoylase', short: 'OTC', ec: '2.1.3.3', family: 'transferase',
aliases: ['ornithine transcarbamoylase', 'otc', 'ornithine carbamoyltransferase', 'ornithine transcarbamylase', 'ornithine carbamyltransferase'],
note: 'Chuyển một nhóm carbamoyl lên nhóm amin mạch bên của một amino acid kiềm 5 carbon trong chất nền ty thể. Thiếu hụt OTC là rối loạn chu trình ure phổ biến nhất, di truyền liên kết nhiễm sắc thể X và gây tăng amoniac máu.'
},
ornt1: {
name: 'Chất mang ornithine/citrulline', short: 'ORNT1', family: 'translocase',
aliases: ['ornithine/citrulline carrier', 'ornithine citrulline carrier', 'ornt1', 'ornithine translocase', 'ornithine/citrulline antiporter', 'ornithine citrulline antiporter', 'ornithine transporter', 'slc25a15', 'ornithine carrier', 'citrulline-ornithine antiporter', 'mitochondrial ornithine carrier', 'ornithine-citrulline carrier', 'orc1', 'citrulline/ornithine carrier', 'citrulline ornithine carrier', 'ornithine/citrulline transporter'],
note: 'Một protein đối vận trên màng trong ty thể. Nó đưa ornithine từ bào tương vào chất nền để đổi lấy citrulline theo tỉ lệ 1:1; khiếm khuyết ở protein này gây hội chứng HHH (tăng amoniac máu, tăng ornithine máu và homocitrulline niệu).'
},
ass: {
name: 'Argininosuccinate synthetase', short: 'ASS', ec: '6.3.4.5', family: 'ligase',
aliases: ['argininosuccinate synthetase', 'ass', 'ass1', 'argininosuccinate synthase', 'arginosuccinate synthetase', 'argininosuccinic acid synthetase', 'citrulline-aspartate ligase', 'argininosuccinate synthetase 1', 'argininosuccinate synthase 1'],
note: 'Trong bào tương, nó nối hai cơ chất nhờ năng lượng của một nucleotide triphosphate với hai liên kết giàu năng lượng bị tiêu tốn. Một pyrophosphatase phân cắt PPi giải phóng giúp kéo bước này về phía trước; khiếm khuyết enzyme này gây bệnh citrulline máu type I.'
},
asl: {
name: 'Argininosuccinate lyase', short: 'ASL', ec: '4.3.2.1', family: 'lyase',
aliases: ['argininosuccinate lyase', 'asl', 'argininosuccinase', 'arginosuccinase', 'argininosuccinate lyase 1'],
note: 'Cắt một liên kết carbon-nitơ trong bào tương để giải phóng một acid dicarboxylic 4 carbon mà không có thay đổi oxi hóa khử. Fumarate giải phóng đi vào chu trình TCA, kết nối hai chu trình với nhau.'
},
arg1: {
name: 'Arginase', short: 'ARG1', ec: '3.5.3.1', family: 'hydrolase',
aliases: ['arginase', 'arg1', 'arginase 1', 'arginase i', 'liver arginase', 'arginase-1', 'arginine amidinohydrolase'],
note: 'Bước cuối cùng, diễn ra trong bào tương tế bào gan: một enzyme chứa mangan thủy phân nhóm guanidino của cơ chất. Người cũng có arginase 2 ở thận và các mô khác nhưng không thuộc chu trình ure.'
},
cps2: { name: 'Carbamoyl phosphate synthetase II', short: 'CPS II', ec: '6.3.5.5', family: 'ligase', decoy: true, aliases: ['carbamoyl phosphate synthetase ii', 'cps2', 'cps ii', 'carbamoyl phosphate synthetase 2', 'cad'], note: 'Isoform ở cytosol của quá trình tổng hợp pyrimidine. Tạo carbamoyl phosphate từ glutamine thay vì ammonium và không được hoạt hóa bởi N-acetylglutamate.' },
atcase: { name: 'Aspartate transcarbamoylase', short: 'ATCase', ec: '2.1.3.2', family: 'transferase', decoy: true, aliases: ['aspartate transcarbamoylase', 'atcase', 'aspartate carbamoyltransferase', 'aspartate transcarbamylase', 'atc'], note: 'Enzyme cam kết đầu tiên của quá trình tổng hợp pyrimidine: chuyển nhóm carbamoyl của carbamoyl phosphate lên aspartate thay vì ornithine.' },
nos: { name: 'enzyme nitric oxide synthase', short: 'NOS', ec: '1.14.13.39', family: 'dehydrogenase', decoy: true, aliases: ['nitric oxide synthase', 'nos', 'nos2', 'inos', 'enos', 'nnos', 'nitric-oxide synthase'], note: 'Sử dụng arginine, NADPH và oxygen để tạo nitric oxide và citrulline: một số phận khác của arginine.' },
urease: { name: 'Urease', short: 'Urease', ec: '3.5.1.5', family: 'hydrolase', decoy: true, aliases: ['urease', 'urea amidohydrolase'], note: 'Một nickel enzyme của vi khuẩn và thực vật (không có ở người) phân cắt urea thành ammonia và CO₂.' },
nags: { name: 'N-Acetylglutamate synthase', short: 'NAGS', ec: '2.3.1.1', family: 'transferase', decoy: true, aliases: ['n-acetylglutamate synthase', 'nags', 'acetylglutamate synthase', 'n-acetylglutamate synthetase', 'amino acid acetyltransferase'], note: 'Tổng hợp N-acetylglutamate từ glutamate và acetyl-CoA; arginine kích hoạt nó, và sản phẩm của nó hoạt hóa carbamoyl phosphate synthetase I.' },
gs: { name: 'Glutamine synthetase', short: 'GS', ec: '6.3.1.2', family: 'ligase', aliases: ['glutamine synthetase', 'gs', 'glutamine synthase', 'glul'], note: 'Bắt giữ ammonium dưới dạng glutamine với sự trợ giúp của ATP; não và cơ xuất khẩu ammonia dưới dạng glutamine (cơ cũng xuất khẩu dưới dạng alanine).' },
odc: { name: 'Ornithine decarboxylase', short: 'ODC', ec: '4.1.1.17', family: 'lyase', decoy: true, aliases: ['ornithine decarboxylase', 'odc', 'odc1'], note: 'Biến đổi ornithine thành putrescine, bước đầu của quá trình tổng hợp polyamine: một số phận khác của ornithine.' },
glnase: { name: 'Glutaminase', short: 'GLS', ec: '3.5.1.2', family: 'hydrolase', aliases: ['glutaminase', 'gls', 'gls2', 'phosphate-activated glutaminase'], note: 'Giải phóng ammonium từ nhóm amide của glutamine tại gan (nơi nó cấp liệu cho urea cycle) và tại thận (nơi nó được bài tiết).' },
};
var cofactor = {
atp: { name: 'ATP', display: 'ATP', family: 'adenylate', aliases: ['atp', 'adenosine triphosphate', 'adenosine 5-triphosphate'] , note: 'Đồng tiền năng lượng chính của tế bào, truyền năng lượng hóa học qua các liên kết phosphate giàu năng lượng.' },
adp: { name: 'ADP', display: 'ADP', family: 'adenylate', aliases: ['adp', 'adenosine diphosphate', 'adenosine 5-diphosphate'] , note: 'Cơ chất để tổng hợp ATP, nhận nhóm phosphate trong substrate-level và oxidative phosphorylation.' },
amp: { name: 'AMP', display: 'AMP', family: 'adenylate', aliases: ['amp', 'adenosine monophosphate', 'adenosine 5-monophosphate'] , note: 'Allosteric activator báo hiệu mức năng lượng tế bào thấp.' },
gtp: { name: 'GTP', display: 'GTP', family: 'adenylate', acceptAlso: ['atp'], aliases: ['gtp', 'guanosine triphosphate', 'guanosine 5-triphosphate'] },
gdp: { name: 'GDP', display: 'GDP', family: 'adenylate', acceptAlso: ['adp'], aliases: ['gdp', 'guanosine diphosphate', 'guanosine 5-diphosphate'] },
nad: { name: 'NAD⁺', display: 'NAD⁺', family: 'redox', aliases: ['nad+', 'nad', 'nad(+)', 'nicotinamide adenine dinucleotide', 'oxidized nad', 'nad plus', 'NAD oxidized', 'NAD+ (oxidized)', 'NAD ox', 'NADox', 'DPN', 'beta-NAD', 'NAD positive'] , note: 'Chất oxy hóa / chất nhận electron chính trong dị hóa (glycolysis, TCA, beta-oxidation).' },
nadh: { name: 'NADH', display: 'NADH', family: 'redox', aliases: ['nadh', 'nadh + h+', 'nadh+h+', 'reduced nad', 'nadh, h+', 'NADH2', 'NADH H', 'NADH + H', 'reduced nicotinamide adenine dinucleotide'] , note: 'Mang hai electrons giàu năng lượng tới Complex I của chuỗi hô hấp.' },
nadp: { name: 'NADP⁺', display: 'NADP⁺', family: 'redox', decoy: true, aliases: ['nadp+', 'nadp', 'nadp(+)'] , note: 'Chất nhận electron trong pha oxy hóa của pentose phosphate pathway.' },
nadph: { name: 'NADPH', display: 'NADPH', family: 'redox', decoy: true, aliases: ['nadph'] , note: 'Nguồn cung cấp lực khử cho các con đường sinh tổng hợp (tổng hợp fatty acid, cholesterol) và tái tạo glutathione.' },
fad: { name: 'FAD', display: 'FAD', family: 'redox', aliases: ['fad', 'flavin adenine dinucleotide', 'oxidized fad'] , note: 'Chất nhận electron nhóm ngoại (prosthetic) cho succinate dehydrogenase và acyl-CoA dehydrogenase.' },
fadh2: { name: 'FADH₂', display: 'FADH₂', family: 'redox', aliases: ['fadh2', 'fadh 2', 'reduced fad', 'fadh₂', 'reduced flavin adenine dinucleotide'] , note: 'Truyền electrons trực tiếp tới ubiquinone qua Complex II / ETF.' },
coa: { name: 'CoA-SH', display: 'CoA-SH', family: 'carrier', aliases: ['coa-sh', 'coa', 'coash', 'coenzyme a', 'hs-coa', 'hscoa', 'co-a', 'free coa', 'coenzyme-a'] , note: 'Chất mang nhóm acyl tạo liên kết thioester giàu năng lượng (acetyl-CoA, succinyl-CoA).' },
co2: { name: 'CO₂', display: 'CO₂', family: 'small', aliases: ['co2', 'carbon dioxide'] , note: 'Sản phẩm một carbon của phản ứng decarboxylation hoàn toàn và là cơ chất cho phản ứng carboxylation.' },
h2o: { name: 'H₂O', display: 'H₂O', family: 'small', aliases: ['h2o', 'water', 'HOH'] , note: 'Dung môi, chất tham gia trong các phản ứng thủy phân và hydrat hóa, đồng thời là sản phẩm phụ của quá trình vận chuyển electron.' },
pi: { name: 'Pᵢ', display: 'Pᵢ', family: 'small', aliases: ['pi', 'phosphate', 'inorganic phosphate', 'orthophosphate', 'hpo4', 'hpo4 2-', 'po4', 'h2po4', 'phosphate ion', 'PO4 3-', 'PO43-', 'PO4(3-)'] , note: 'Ion orthophosphate vô cơ tham gia vào phản ứng phosphorylation và phosphorolysis.' },
ppi: { name: 'PPᵢ', display: 'PPᵢ', family: 'small', aliases: ['ppi', 'pyrophosphate', 'inorganic pyrophosphate', 'diphosphate', 'pyrophosphoric acid', 'diphosphoric acid'] , note: 'Diphosphate được giải phóng khi hoạt hóa nucleic acid và acyl-CoA, nhanh chóng bị thủy phân để kéo phản ứng tiến về phía trước.' },
hplus: { name: 'H⁺', display: 'H⁺', family: 'small', aliases: ['h+', 'proton', 'hydrogen ion', 'protons'] },
o2: { name: 'O₂', display: 'O₂', family: 'small', aliases: ['o2', 'oxygen', 'molecular oxygen'] },
mg: { name: 'Mg²⁺', display: 'Mg²⁺', family: 'small', decoy: true, noDistractor: true, aliases: ['mg2+', 'mg', 'magnesium', 'magnesium ion'] },
q: { name: 'Ubiquinone (Q)', display: 'Q', family: 'redox', aliases: ['q', 'ubiquinone', 'coenzyme q', 'coq', 'coq10', 'coenzyme q10', 'q10', 'oxidized coenzyme q', 'oxidized ubiquinone', 'coenzyme q (oxidized)', 'uq', 'ubiquinone (oxidized)', 'oxidized uq'] },
cytcox: { name: 'Cytochrome c (dạng oxy hóa)', display: 'Cyt c (ox)', family: 'redox', aliases: ['cytochrome c (fe3+)', 'cytochrome c oxidized', 'oxidized cytochrome c', 'ferricytochrome c', 'cyt c ox', 'cyt c (fe3+)'] },
utp: { name: 'UTP', display: 'UTP', family: 'adenylate', aliases: ['utp', 'uridine triphosphate'] },
udp: { name: 'UDP', display: 'UDP', family: 'adenylate', aliases: ['udp', 'uridine diphosphate'] },
ump: { name: 'UMP', display: 'UMP', family: 'adenylate', decoy: true, aliases: ['ump', 'uridine monophosphate'] },
glutc: { name: 'Glutamate', display: 'Glu', family: 'small', aliases: ['glutamate', 'glu', 'l-glutamate', 'glutamic acid'] },
akgc: { name: '\u03b1-Ketoglutarate', display: '\u03b1-KG', family: 'small', aliases: ['alpha-ketoglutarate', '\u03b1-ketoglutarate', 'akg', '\u03b1-kg', 'alpha-kg', '2-oxoglutarate', 'oxoglutarate', 'ketoglutarate', '2-ketoglutarate', 'a-ketoglutarate', 'alpha-ketoglutaric acid', '2-oxoglutaric acid', 'alpha-oxoglutarate', '\u03b1-oxoglutarate', '2-OG', '2OG', 'oxoglutaric acid', '2-ketoglutaric acid', 'alpha-oxoglutaric acid', 'ketoglutaric acid'] },
hco3: { name: 'HCO₃⁻', display: 'HCO₃⁻', family: 'small', acceptAlso: ['co2'], aliases: ['hco3-', 'hco3', 'bicarbonate', 'hydrogen carbonate', 'bicarbonate ion', 'hydrogencarbonate', 'bicarb', 'hydrogen carbonate ion', 'bicarbonate anion'] },
};
[['molecule', molecule], ['enzyme', enzyme], ['cofactor', cofactor]].forEach(function (pair) {
Object.keys(pair[1]).forEach(function (id) {
pair[1][id].id = id;
pair[1][id].kind = pair[0];
});
});
var REGION = {
moleculeByFamily: { sugar: 'gly', c3: 'gly', acid: 'tca', coa: 'tca', etc: 'etc', lipid: 'lipid', organelle: 'dyn', apop: 'apop', aminoacid: 'urea', nitrogen: 'urea' },
moleculeOverride: { pyruvate: 'both', acetylcoa: 'both', lactate: 'gly', alanine: 'both', glutamate: ['tca', 'urea'], aspartate: ['tca', 'urea'], fumarate: ['tca', 'urea'], akg: ['tca', 'urea'], udpg: 'glycogen', glycogen: 'glycogen' },
enzyme: {
hexokinase: 'gly', pgi: 'gly', pfk1: 'gly', aldolase: 'gly', tpi: 'gly', gapdh: 'gly', pgk: 'gly',
pgm: 'gly', enolase: 'gly', pk: 'gly', ldh: 'gly', g6pase: 'gly', fbpase: 'gly', pglucomutase: 'gly', g6pdh: 'gly',
ldh: 'gly', adh: 'gly', pyrdecarb: 'gly', glycerol3pdh: 'gly',
pc: 'both', pepck: 'both', pdc: 'both',
cs: 'tca', aconitase: 'tca', idh: 'tca', kgdh: 'tca', scs: 'tca', sdh: 'tca', fumarase: 'tca',
mdh: 'tca', gdh: ['tca', 'urea'], ast: ['tca', 'urea'], alt: ['tca', 'urea'], icl: 'tca', acl: 'tca', ndpk: 'tca', malic: 'both',
complex1: 'etc', complex3: 'etc', complex4: 'etc', atpsynthase: 'etc', ucp1: 'etc', aox: 'etc', ant: ['etc', 'mito'], gpd2: 'etc',
mdh1: 'tca', mkat: ['etc', 'mito'], gaa: ['etc', 'mito', 'urea'],
cps1: 'urea', otc: 'urea', ornt1: ['urea', 'mito'], ass: 'urea', asl: 'urea', arg1: 'urea',
cps2: 'urea', atcase: 'urea', nos: 'urea', urease: 'urea', nags: 'urea', gs: 'urea', odc: 'urea', glnase: 'urea',
porin: 'mito', pyrsym: 'mito', drp1: 'dyn', mfn: 'dyn', opa1: 'dyn', mff: 'dyn', fis1: 'dyn', pink1: 'dyn', parkin: 'dyn', mid49: 'dyn', mid51: 'dyn', tradd: 'apop',
bax: 'apop', apaf1: 'apop', apoptosomeenz: 'apop', casp9: 'apop', casp8: 'apop', casp3: 'apop', tnfr1: 'apop', fadd: 'apop',
glycogensynthase: 'glycogen', glycogenphosphorylase: 'glycogen', ugpase: 'glycogen', debranch: 'glycogen', branching: 'glycogen',
lipase: 'lipid', acs: 'lipid', acadh: 'lipid', enoylh: 'lipid', hadh: 'lipid', thiolase: 'lipid', acc: 'lipid', cpt1: 'lipid'
},
cofactor: { fad: ['tca', 'etc'], fadh2: ['tca', 'etc'], coa: 'tca', gtp: 'tca', gdp: 'tca', q: 'etc', cytcox: 'etc', utp: 'glycogen', udp: 'glycogen', ump: 'glycogen', glutc: ['tca', 'etc'], akgc: ['tca', 'etc'] }
};
Object.keys(molecule).forEach(function (id) {
molecule[id].region = REGION.moleculeOverride[id] || REGION.moleculeByFamily[molecule[id].family] || 'both';
});
Object.keys(enzyme).forEach(function (id) { enzyme[id].region = REGION.enzyme[id] || 'both'; });
Object.keys(cofactor).forEach(function (id) { cofactor[id].region = REGION.cofactor[id] || 'all'; });
enzyme.sdh.region = ['tca', 'etc'];
var CONFUSABLE = {
pdc: ['pyrdecarb', 'ldh', 'pc'], gapdh: ['glycerol3pdh', 'g6pdh'], pgi: ['pglucomutase'],
aconitase: ['icl'], idh: ['icl', 'gdh'], kgdh: ['gdh', 'ast'], mdh: ['malic', 'ldh'],
cs: ['acl', 'icl'], scs: ['ndpk'], pk: ['pepck', 'pc'],
complex1: ['sdh', 'gpd2'], complex3: ['complex4', 'aox'], complex4: ['complex3', 'aox'],
atpsynthase: ['ucp1', 'ant'], sdh: ['complex1', 'gpd2'],
glycogensynthase: ['glycogenphosphorylase', 'branching'], glycogenphosphorylase: ['debranch', 'glycogensynthase'],
acadh: ['sdh', 'hadh'], thiolase: ['acc', 'cpt1'], lipase: ['acs', 'cpt1'], acs: ['cpt1', 'lipase'],
drp1: ['mff', 'fis1', 'mid49', 'mid51'], mfn: ['opa1', 'parkin'], opa1: ['mfn', 'drp1'],
porin: ['pyrsym', 'ant'], pyrsym: ['porin', 'ant', 'mkat'], casp9: ['casp8', 'casp3'], casp8: ['casp9', 'casp3'], casp3: ['casp9', 'casp8'],
bax: ['apaf1', 'fadd'], apaf1: ['fadd', 'apoptosomeenz'], fadd: ['apaf1', 'tnfr1', 'tradd'], tnfr1: ['fadd'],
g6pase: ['hexokinase', 'fbpase'], fbpase: ['pfk1', 'g6pase'], pc: ['pepck', 'pk'], pepck: ['pc', 'pk'],
cps1: ['cps2', 'nags', 'gs'], otc: ['atcase'], ornt1: ['gaa'], ass: ['asl', 'gs'], asl: ['ass', 'arg1'], arg1: ['urease', 'nos', 'odc'],
gdh: ['kgdh', 'idh', 'ast'], gs: ['glnase', 'cps1', 'ass'], glnase: ['gs', 'urease', 'asl'], alt: ['ast', 'gdh', 'gs'], ast: ['alt', 'gdh', 'mdh']
};
Object.keys(CONFUSABLE).forEach(function (id) { enzyme[id].confusable = CONFUSABLE[id]; });
var NEVER_FUZZY = ['aconitate', 'maleate', 'maleicacid', 'enolate', 'complexi', 'complexiii', 'complexiv',
'fadplus', 'coenzymeq', 'coenzymeb', 'coenzymem', 'phosphite',
'dihydroxyacetone', 'nadpdependentisocitratedehydrogenase', 'hexokinasei', 'hexokinaseiii', 'hexokinasev',
'dlactate', 'd3hydroxyacylcoa', 'dbetahydroxyacylcoa', 'dhydroxyacylcoa', 'd3hydroxyacylcoadehydrogenase',
'dhydroxyacylcoadehydrogenase', 'adpglucose', 'gdpglucose', 'cdpglucose', 'methanol', 'glycogenin',
'diacylglycerol', 'diglyceride', 'diglycerides', 'dmalate', 'lglucose',
'cytochromea', 'cytochromeb', 'cytb', 'cyta'];
var FAMILY_HINT = {
molecule: {
sugar: 'đường, đường phosphat hoặc polyme của glucose',
lipid: 'chất béo, acid béo hoặc acyl-CoA',
c3: 'chất trung gian 3-carbon (hoặc tương đương)',
acid: 'acid carboxylic, như chất trung gian chu trình TCA hoặc amino acid tạo từ đó',
coa: 'thioester mang gốc acyl chứa lưu huỳnh',
etc: 'chất mang hoặc cơ chất của chuỗi truyền electron',
organelle: 'trạng thái của ty thể: liên kết hay phân tách',
apop: 'protein, phức hợp protein hoặc một sự kiện trong con đường này',
aminoacid: 'amino acid hoặc dẫn xuất của nó',
nitrogen: 'phân tử nhỏ chứa nitơ'
},
enzyme: {
kinase: 'kinase: enzyme chuyển nhóm phosphat',
isomerase: 'isomerase hoặc mutase: enzyme sắp xếp lại các nguyên tử trong phân tử',
dehydrogenase: 'dehydrogenase: enzyme vận chuyển electron và hydro giữa cơ chất và chất mang',
lyase: 'lyase: enzyme phân cắt hoặc tạo liên kết mà không thay đổi số oxi hóa',
ligase: 'ligase hoặc synthetase: enzyme nối các phân tử nhờ liên kết giàu năng lượng',
transferase: 'transferase: enzyme chuyển một nhóm chức từ phân tử này sang phân tử khác',
phosphatase: 'phosphatase: enzyme loại bỏ nhóm phosphat nhờ nước',
etc: 'phức hợp protein ở màng trong ty thể',
translocase: 'translocase: protein vận chuyển màng trong ty thể giúp trao đổi chất qua lại',
hydrolase: 'hydrolase: enzyme phân cắt liên kết bằng cách cộng các thành phần của một phân tử nhỏ',
channel: 'protein kênh cho các phân tử nhỏ đi qua màng',
symporter: 'protein đồng vận chuyển ở màng trong ty thể vận chuyển hai chất cùng lúc',
gtpase: 'protein sử dụng năng lượng từ nucleotide triphosphate để định hình lại màng',
poreformer: 'protein tạo lỗ thủng trên màng',
platform: 'phức hợp protein lớn lắp ráp khi các thành phần gặp nhau',
adaptor: 'protein nối liên kết protein truyền tín hiệu này với protein khác',
protease: 'caspase: protease cắt các protein khác sau gốc aspartate',
receptor: 'thụ thể trên màng sinh chất'
},
cofactor: {
adenylate: 'nucleotide mang năng lượng',
redox: 'chất mang electron',
carrier: 'chất mang nhóm acyl',
small: 'phân tử nhỏ hoặc ion'
}
};
var AMBIGUOUS_ALIASES = ['pgm', 'pdc', 'cytochromec', 'cytc'];
MG.entities = { molecule: molecule, enzyme: enzyme, cofactor: cofactor, neverFuzzy: NEVER_FUZZY, familyHint: FAMILY_HINT, ambiguousAliases: AMBIGUOUS_ALIASES };
})(typeof window !== 'undefined' ? window : globalThis);
