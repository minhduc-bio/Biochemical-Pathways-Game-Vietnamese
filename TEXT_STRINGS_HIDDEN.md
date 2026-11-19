# Khai Báo Catalog Các Chuỗi Text Ẩn & Kiến Thức Sinh Học (Hidden Text Strings & Entity Knowledgebase)

Tài liệu này tổng hợp và khai báo toàn bộ các chuỗi văn bản mô tả ẩn, hệ thống gợi ý động (`MG.hints`), các nhãn popup chi tiết (`detailCard`), màn hình kết quả và cơ sở dữ liệu ghi chú sinh học (`note`) chưa có trong catalog ban đầu của dự án `Biochemical Pathways Game` (`pathway_quiz.html`).

---

## 1. Thẻ Thông Tin Chi Tiết & Độ Thuần Thục (Detail Card & Mastery Popup)

Xuất hiện khi người dùng chạm vào một ô phân tử, enzyme hoặc đồng yếu tố trên bản đồ hoặc trong danh sách "Cần xem lại".

| Mã khóa (Key ID) | Vị trí code | Chuỗi Tiếng Anh gốc | Đề xuất Tiếng Việt | Ghi chú ngữ cảnh |
| :--- | :--- | :--- | :--- | :--- |
| `detail.formula` | `L31173` | `Formula` | **Công thức** | Tiêu đề công thức phân tử |
| `detail.charge` | `L31174` | `Charge` | **Điện tích** | Tiêu đề điện tích |
| `detail.charge_neutral` | `L30642` | `Neutral` | **Trung hòa điện** | Giá trị khi điện tích bằng 0 |
| `detail.ec_number` | `L31178` | `EC number` | **Mã số EC** | Tiêu đề mã Enzyme Commission |
| `detail.class` | `L31180` | `Class` | **Lớp enzyme** | Tiêu đề phân loại enzyme |
| `detail.family` | `L31182` | `Family` | **Họ** | Tiêu đề họ đồng yếu tố |
| `detail.also_counts` | `L31184` | `Also counts` | **Chấp nhận cả** | Các dạng đồng yếu tố tương đương |
| `detail.reaction` | `L31190` | `Reaction` | **Phản ứng** | Tên bước và loại phản ứng |
| `detail.mastery` | `L31239` | `Mastery` | **Độ thuần thục** | Thanh đo mức độ thành thạo bước |
| `ec_class.1` | `L30523` | `Oxidoreductase` | **Oxidoreductase (Oxi hóa - khử)** | Lớp EC 1 |
| `ec_class.2` | `L30523` | `Transferase` | **Transferase (Chuyển nhóm)** | Lớp EC 2 |
| `ec_class.3` | `L30523` | `Hydrolase` | **Hydrolase (Thủy phân)** | Lớp EC 3 |
| `ec_class.4` | `L30523` | `Lyase` | **Lyase (Phân cắt)** | Lớp EC 4 |
| `ec_class.5` | `L30524` | `Isomerase` | **Isomerase (Đồng phân hóa)** | Lớp EC 5 |
| `ec_class.6` | `L30524` | `Ligase` | **Ligase (Tổng hợp / Nối)** | Lớp EC 6 |
| `ec_class.7` | `L30524` | `Translocase` | **Translocase (Vận chuyển màng)** | Lớp EC 7 |

## 2. Chuỗi Giao Diện Tương Tác & Luồng Kết Thúc Bài (Interactive Prompts & Results Flow)

| Mã khóa (Key ID) | Vị trí code | Chuỗi Tiếng Anh gốc | Đề xuất Tiếng Việt | Ghi chú ngữ cảnh |
| :--- | :--- | :--- | :--- | :--- |
| `prompt.enz_carry` | `L26798` | `Which {enzWord} carries out this step?` | **{enzWord} nào xúc tác cho bước này?** | Câu hỏi tìm enzyme khi enzWord != 'enzyme' |
| `prompt.product_used` | `L26834` | `Product of {made}, used in {used}` | **Sản phẩm của {made}, được dùng trong {used}** | Gợi ý ngữ cảnh vị trí phân tử |
| `prompt.fill_map` | `L27438` | `Fill the Map` | **Điền vào bản đồ** | Tiêu đề chế độ pick trên header |
| `prompt.fill_blank` | `L27438` | `Fill in the Blank` | **Điền vào chỗ trống** | Tiêu đề chế độ type trên header |
| `prompt.tap_map_details` | `L27447` | `Tap a molecule, an enzyme or a protein on the map for its details.` | **Chạm vào phân tử, enzyme hoặc protein trên bản đồ để xem chi tiết.** | Hướng dẫn tương tác bản đồ |
| `prompt.tap_map_enz` | `L27448` | `Tap a molecule or an enzyme on the map for its details.` | **Chạm vào phân tử hoặc enzyme trên bản đồ để xem chi tiết.** | Hướng dẫn tương tác bản đồ (bản ngắn) |
| `prompt.wrong_position` | `L28035` | `, but it does not go here.` | **, nhưng không nằm ở vị trí này.** | Phản hồi khi chọn đúng chất trong pathway nhưng sai bước |
| `prompt.confirm_quit` | `L28233` | `Your progress in this round will be lost.` | **Tiến trình của vòng chơi này sẽ bị mất.** | Xác nhận thoát giữa chừng |
| `results.link_rxn` | `L32090` | `Link reaction` | **Phản ứng nối** | Bước nối pyruvate sang acetyl-CoA |
| `results.not_played` | `L32108` | `not played` | **chưa học** | Chặng trong khóa học chưa thực hiện |
| `results.course_accuracy` | `L32112` | `: accuracy in each section.` | **: độ chính xác ở từng phần.** | Phụ đề thẻ hoàn thành khóa học |
| `results.mode_prefix` | `L32128` | `Mode: ` | **Chế độ: ** | Tiền tố hiển thị chế độ |
| `results.complete_suffix` | `L32129` | ` complete` | ** hoàn thành** | Hậu tố tiêu đề hoàn thành bài thi |
| `results.every_section` | `L32131` | `Every section of {course}. ` | **Toàn bộ các phần của {course}. ** | Phụ đề khi làm hết các chặng |
| `results.last_section` | `L32131` | `Last section: {section}. ` | **Phần cuối cùng: {section}. ** | Phụ đề chặng cuối |
| `results.section_x_of_y` | `L32131` | `Section {X} of {Y} in {Z}. ` | **Phần {X}/{Y} trong {Z}. ** | Phụ đề tiến trình chặng |
| `results.tap_missed` | `L32137` | `Tap an item to read about it.` | **Chạm vào một mục để xem thông tin chi tiết.** | Hướng dẫn danh sách cần xem lại |
| `results.course_overview` | `L32151` | `Course overview` | **Tổng quan khóa học** | Nút xem lại lộ trình khóa |
| `results.practice_round_title` | `L32163` | `A {mode} round of the {N} step(s) you missed` | **Vòng luyện tập {mode} gồm {N} bước bạn đã làm sai** | Tooltip nút luyện tập bước sai |
| `settings.theme_tooltip` | `L31823` | `Light or dark. Auto follows your device.` | **Giao diện sáng hoặc tối. Tự động theo thiết bị.** | Tooltip tùy chọn theme |
| `toast.atp_not_loaded` | `L31923` | `ATP Calculator not loaded` | **Chưa tải được Bộ tính ATP** | Thông báo toast khi lỗi |
| `toast.draw_not_loaded` | `L31955` | `Draw molecules not loaded` | **Chưa tải được mô-đun Vẽ phân tử** | Thông báo toast khi lỗi |

## 3. Hệ Thống Sinh Gợi Ý Động (Ladder Hints Generator)

Các mẫu câu và quy tắc được engine tự động phân tích và sinh ra khi người dùng bấm "Gợi ý" trong bài làm.

### 3.1 Tiêu đề bậc gợi ý & Định hướng tìm kiếm
| Mã khóa | Vị trí code | Chuỗi Tiếng Anh gốc | Đề xuất Tiếng Việt |
| :--- | :--- | :--- | :--- |
| `hint.ladder.happening` | `L26339` | `What is happening` | **Diễn biến phản ứng** |
| `hint.ladder.look_for` | `L26342` | `What to look for` | **Đặc điểm cần tìm** |
| `hint.ladder.clue` | `L26344` | `A clue` | **Manh mối gợi ý** |
| `hint.ladder.last_clue` | `L26345` | `Last clue` | **Gợi ý then chốt** |
| `hint.find.enzyme` | `L26216` | `You are looking for the enzyme.` | **Bạn đang tìm kiếm enzyme.** |
| `hint.find.in` | `L26217` | `You are looking for something this step consumes.` | **Bạn đang tìm chất bị tiêu thụ ở bước này.** |
| `hint.find.out` | `L26218` | `You are looking for something this step releases or produces.` | **Bạn đang tìm chất được giải phóng hoặc tạo ra ở bước này.** |
| `hint.find.product` | `L26274` | `You are looking for the product of this step.` | **Bạn đang tìm sản phẩm của bước này.** |
| `hint.find.substrate` | `L26275` | `You are looking for the missing substrate of this step.` | **Bạn đang tìm cơ chất còn thiếu của bước này.** |
| `hint.find.multiple` | `L26278` | `There are {N} to find here, in any order.` | **Có {N} chất cần tìm ở đây, theo thứ tự bất kỳ.** |
| `hint.clue.ec_class` | `L26301` | `Its EC number starts with {cls} ({name}).` | **Mã số EC của enzyme bắt đầu bằng {cls} ({name}).** |
| `hint.clue.irreversible` | `L26302` | `This step is irreversible in cells.` | **Bước này là phản ứng không thuận nghịch trong tế bào.** |
| `hint.clue.carbon` | `L26292` | `{N} carbon(s)` | **{N} nguyên tử carbon** |
| `hint.clue.phosphorus` | `L26293` | `{N} phosphorus atom(s)` | **{N} nguyên tử phospho** |
| `hint.clue.has_atoms` | `L26294` | `It has {parts}.` | **Chất này có {parts}.** |
| `hint.clue.name_stats` | `L26316` | `Its name has {w} word(s) and {l} letter(s).` | **Tên của chất gồm {w} từ và {l} chữ cái.** |

### 3.2 Manh mối họ chất (`FAMILY_HINT` & `P.familyHints`)
| Mã họ chất | Chuỗi Tiếng Anh gốc | Đề xuất Tiếng Việt |
| :--- | :--- | :--- |
| `family.sugar` | `a sugar, a sugar phosphate or a glucose polymer` | **đường, đường phosphat hoặc polyme của glucose** |
| `family.lipid` | `a fat, a fatty acid or a fatty acyl-CoA` | **chất béo, acid béo hoặc acyl-CoA** |
| `family.c3` | `a small three-carbon (or similar) intermediate` | **chất trung gian 3-carbon (hoặc tương đương)** |
| `family.acid` | `a carboxylic acid, such as a TCA cycle intermediate or an amino acid made from one` | **acid carboxylic, như chất trung gian chu trình TCA hoặc amino acid tạo từ đó** |
| `family.coa` | `a thioester of a sulfur-containing acyl carrier` | **thioester mang gốc acyl chứa lưu huỳnh** |
| `family.etc_carrier` | `a carrier or substrate of the electron transport chain` | **chất mang hoặc cơ chất của chuỗi truyền electron** |
| `family.aminoacid` | `an amino acid or a derivative of one` | **amino acid hoặc dẫn xuất của nó** |
| `family.nitrogen` | `a small nitrogen-containing molecule` | **phân tử nhỏ chứa nitơ** |
| `family.kinase` | `a kinase: it transfers a phosphate group` | **kinase: enzyme chuyển nhóm phosphat** |
| `family.isomerase` | `an isomerase or mutase: it rearranges atoms within one molecule` | **isomerase hoặc mutase: enzyme sắp xếp lại các nguyên tử trong phân tử** |
| `family.dehydrogenase` | `a dehydrogenase: it passes electrons and hydrogens between its substrate and a carrier` | **dehydrogenase: enzyme vận chuyển electron và hydro giữa cơ chất và chất mang** |
| `family.lyase` | `a lyase: it splits or forms bonds, usually without a redox change` | **lyase: enzyme phân cắt hoặc tạo liên kết mà không thay đổi số oxi hóa** |
| `family.ligase` | `a ligase or synthetase: it joins molecules using an energy-rich bond` | **ligase hoặc synthetase: enzyme nối các phân tử nhờ liên kết giàu năng lượng** |
| `family.transferase` | `a transferase: it moves a group from one molecule to another` | **transferase: enzyme chuyển một nhóm chức từ phân tử này sang phân tử khác** |
| `family.phosphatase` | `a phosphatase: it removes a phosphate group with water` | **phosphatase: enzyme loại bỏ nhóm phosphat nhờ nước** |
| `family.hydrolase` | `a hydrolase: it cleaves bonds by adding the elements of a small molecule across them` | **hydrolase: enzyme phân cắt liên kết bằng cách cộng các thành phần của một phân tử nhỏ** |
| `family.translocase` | `a carrier protein of the inner mitochondrial membrane that swaps one molecule for another` | **translocase: protein vận chuyển màng trong ty thể giúp trao đổi chất qua lại** |
| `family.poreformer` | `a protein that makes pores in a membrane` | **protein tạo lỗ thủng trên màng** |
| `family.receptor` | `a receptor in the plasma membrane` | **thụ thể trên màng sinh chất** |
| `family.redox` | `an electron carrier` | **chất mang electron** |
| `family.adenylate` | `a nucleotide that carries energy` | **nucleotide mang năng lượng** |
| `family.carrier` | `a carrier of acyl groups` | **chất mang nhóm acyl** |
| `family.small` | `a small molecule or ion` | **phân tử nhỏ hoặc ion** |

### 3.3 Mẫu câu động từ diễn giải phản ứng (`VERBS`)
| Mẫu động từ gốc (English) | Đề xuất Tiếng Việt | Ghi chú phản ứng |
| :--- | :--- | :--- |
| `phosphorylates {S} to {P}` | **phosphoryl hóa {S} thành {P}** | Chuyển nhóm phosphat |
| `rearranges {S} into {P}` | **sắp xếp lại cấu trúc {S} thành {P}** | Đồng phân hóa, chuyển vị |
| `oxidizes {S} to {P}` | **oxi hóa {S} thành {P}** | Oxi hóa khử 1:1 |
| `oxidizes {S} to {P1} and {P2}` | **oxi hóa {S} thành {P1} và {P2}** | Oxi hóa khử 1:2 |
| `reduces {S} to {P}` | **khử {S} thành {P}** | Khử |
| `removes water from {S}, giving {P}` | **tách nước từ {S}, tạo ra {P}** | Khử nước (dehydration) |
| `adds water to {S}, giving {P}` | **cộng nước vào {S}, tạo ra {P}** | Hydrat hóa (hydration) |
| `takes a carbon off {S} as CO₂, giving {P}` | **tách một carbon từ {S} dưới dạng CO₂, tạo ra {P}** | Khử carboxyl |
| `adds a carbon from CO₂ to {S}, making {P}` | **cộng một carbon từ CO₂ vào {S}, tạo thành {P}** | Carboxyl hóa |
| `adds a carbon from HCO₃⁻ to {S}, making {P}` | **cộng một carbon từ HCO₃⁻ vào {S}, tạo thành {P}** | Carboxyl hóa với HCO₃⁻ |
| `moves the amino group of {S1} onto {S2}, giving {P1} and {P2}` | **chuyển nhóm amin từ {S1} sang {S2}, tạo ra {P1} và {P2}** | Chuyển amin (transamination) |
| `swaps an amino group for a keto group, turning {S} into {P}` | **đổi nhóm amin lấy nhóm ceto, biến {S} thành {P}** | Chuyển amin 1:1 |
| `hydrolyzes {S} into {P1} and {P2}` | **thủy phân {S} thành {P1} và {P2}** | Thủy phân 1:2 |
| `hydrolyzes {S}, giving {P}` | **thủy phân {S}, tạo ra {P}** | Thủy phân 1:1 |
| `splits {S} with phosphate, giving {P}` | **phân cắt {S} bằng phosphat, tạo ra {P}** | Phosphorolysis |
| `splits {S} with CoA-SH into {P1} and {P2}` | **phân cắt {S} bằng CoA-SH thành {P1} và {P2}** | Thiolysis |
| `splits {S} into {P1} and {P2}` | **phân cắt {S} thành {P1} và {P2}** | Phân cắt aldol / lyase |
| `joins {S1} and {S2} into {P}` | **ngưng tụ / nối {S1} và {S2} thành {P}** | Ngưng tụ / tạo liên kết |
| `carries {S} across the membrane` | **vận chuyển {S} qua màng** | Vận chuyển màng |

### 3.4 Giải thích nhiệt động & cơ chế (`reasonSentence`)
| Mẫu giải thích (English) | Đề xuất Tiếng Việt |
| :--- | :--- |
| `It is irreversible in cells: the energy of {spent} drives it one way.` | **Phản ứng không thuận nghịch trong tế bào: năng lượng từ {spent} thúc đẩy phản ứng đi theo một chiều.** |
| `It is irreversible in cells: the energy-rich bond of {subs} pays for the {made}.` | **Phản ứng không thuận nghịch trong tế bào: liên kết giàu năng lượng của {subs} cung cấp năng lượng để tạo {made}.** |
| `It is irreversible in cells: the CO₂ that escapes is not put back.` | **Phản ứng không thuận nghịch trong tế bào: khí CO₂ thoát ra không thể hoàn nguyên lại.** |
| `It is irreversible in cells: the pyrophosphate released is broken down, which pulls it forward.` | **Phản ứng không thuận nghịch trong tế bào: pyrophosphat giải phóng bị thủy phân ngay lập tức, kéo phản ứng dịch chuyển về phía trước.** |
| `It is irreversible in cells: hydrolysis of the thioester pulls it forward.` | **Phản ứng không thuận nghịch trong tế bào: sự thủy phân liên kết thioester kéo phản ứng dịch chuyển về phía trước.** |
| `It is irreversible in cells: splitting off the phosphate is strongly downhill.` | **Phản ứng không thuận nghịch trong tế bào: sự giải phóng nhóm phosphat giải phóng thế năng rất lớn.** |
| `It is irreversible in cells: a bond is hydrolyzed, and that is not undone.` | **Phản ứng không thuận nghịch trong tế bào: một liên kết đã bị thủy phân và không thể tự đảo ngược.** |
| `It is irreversible in cells, so it runs one way only.` | **Phản ứng không thuận nghịch trong tế bào, vì vậy nó chỉ xảy ra theo một chiều.** |
| `It is reversible: it runs the way the concentrations on each side push it.` | **Phản ứng thuận nghịch: chiều phản ứng phụ thuộc vào sự chênh lệch nồng độ chất ở hai phía.** |
| `Protons flowing back down their gradient turn the enzyme, and that pays for the ATP.` | **Dòng proton chảy xuôi gradient nồng độ làm quay enzyme, cung cấp năng lượng để tổng hợp ATP.** |
| `The electrons go downhill in energy: each carrier holds them more tightly than the one before.` | **Electron dịch chuyển theo chiều giảm thế năng: mỗi chất mang giữ electron chặt hơn chất mang đứng trước.** |
| `{reduced} supplies the electrons and is left as {rem}.` | **{reduced} cung cấp electron và trở thành {rem}.** |
| `The electrons taken from {subs} leave on {carrier}.` | **Electron tách ra từ {subs} được chuyển sang chất mang {carrier}.** |
| `The energy of {spent} hydrolysis powers it.` | **Năng lượng giải phóng từ sự thủy phân {spent} cung cấp cho phản ứng.** |
| `The proton gradient across the membrane drives it.` | **Gradient nồng độ proton qua màng là động lực thúc đẩy phản ứng.** |
| `Nothing is made or broken: one molecule crosses as the other goes the opposite way.` | **Không có liên kết nào bị tạo ra hay bẻ gãy: một phân tử đi qua màng khi một phân tử khác đi theo chiều ngược lại.** |

## 4. Danh Mục Thuật Ngữ Loại Phản Ứng (`rxn.type`)

Tập hợp ~120 thuật ngữ phân loại phản ứng hóa sinh xuất hiện trong thuộc tính `type` của các bước phản ứng.

| Thuật ngữ Tiếng Anh | Đề xuất Tiếng Việt | Ghi chú hóa sinh |
| :--- | :--- | :--- |
| `rect` | *rect* | Xuất hiện 88 lần |
| `ledger` | *ledger* | Xuất hiện 16 lần |
| `Electron transfer` | **Truyền electron** | Xuất hiện 9 lần |
| `Phosphoryl transfer` | **Chuyển nhóm phosphoryl** | Xuất hiện 6 lần |
| `category` | *category* | Xuất hiện 6 lần |
| `Isomerization` | **Đồng phân hóa** | Xuất hiện 5 lần |
| `Hydrolysis` | **Thủy phân** | Xuất hiện 5 lần |
| `Oxidative decarboxylation` | **Khử carboxyl oxi hóa** | Xuất hiện 4 lần |
| `Oxidation (FAD)` | **Oxi hóa (dùng FAD)** | Xuất hiện 4 lần |
| `Oxidation (NAD⁺)` | **Oxi hóa (dùng NAD⁺)** | Xuất hiện 4 lần |
| `Reduction (NADH)` | *Reduction (NADH)* | Xuất hiện 4 lần |
| `Electron transfer and proton pumping` | **Truyền electron kèm bơm proton** | Xuất hiện 4 lần |
| `Antiport (exchange)` | **Vận chuyển đối vận (trao đổi)** | Xuất hiện 4 lần |
| `Transamination` | **Chuyển amin** | Xuất hiện 4 lần |
| `Substrate-level phosphorylation` | **Phosphoryl hóa ở mức cơ chất** | Xuất hiện 3 lần |
| `Hydration` | **Cộng nước (Hydrat hóa)** | Xuất hiện 3 lần |
| `ATP synthesis (chemiosmosis)` | **Tổng hợp ATP (hóa thẩm thấu)** | Xuất hiện 3 lần |
| `Electron transfer (heme to heme)` | *Electron transfer (heme to heme)* | Xuất hiện 3 lần |
| `Amidation (spends ATP)` | **Amid hóa (tiêu tốn ATP)** | Xuất hiện 3 lần |
| `Synthesis of the second messenger` | *Synthesis of the second messenger* | Xuất hiện 3 lần |
| `Phosphorylation` | *Phosphorylation* | Xuất hiện 3 lần |
| `Phosphoryl shift` | **Chuyển vị nhóm phosphoryl** | Xuất hiện 2 lần |
| `circle` | *circle* | Xuất hiện 2 lần |
| `Electron transfer (no proton pumping)` | *Electron transfer (no proton pumping)* | Xuất hiện 2 lần |
| `Electron transfer to O₂ and proton pumping` | *Electron transfer to O₂ and proton pumping* | Xuất hiện 2 lần |
| `Isomerization (reverse of glycolysis)` | **Đồng phân hóa (ngược đường phân)** | Xuất hiện 2 lần |
| `Decarboxylation` | *Decarboxylation* | Xuất hiện 2 lần |
| `Activation (thioester formation)` | **Hoạt hóa (tạo thioester)** | Xuất hiện 2 lần |
| `Electron transfer (2 e⁻ and 2 H⁺)` | *Electron transfer (2 e⁻ and 2 H⁺)* | Xuất hiện 2 lần |
| `Carbamoyl transfer` | **Chuyển nhóm carbamoyl** | Xuất hiện 2 lần |
| `Reductive amination` | **Amin hóa khử** | Xuất hiện 2 lần |
| `Oxidative deamination` | **Khử amin oxi hóa** | Xuất hiện 2 lần |
| `Proteolytic activation` | *Proteolytic activation* | Xuất hiện 2 lần |
| `Proteolysis of cell proteins` | *Proteolysis of cell proteins* | Xuất hiện 2 lần |
| `Photoexcitation` | *Photoexcitation* | Xuất hiện 2 lần |
| `Electron transfer (charge separation)` | *Electron transfer (charge separation)* | Xuất hiện 2 lần |
| `Reduction of NADP⁺` | *Reduction of NADP⁺* | Xuất hiện 2 lần |
| `Reduction (NADPH)` | *Reduction (NADPH)* | Xuất hiện 2 lần |
| `Aldol condensation` | **Ngưng tụ aldol** | Xuất hiện 2 lần |
| `Two-carbon transfer` | **Chuyển 2 carbon** | Xuất hiện 2 lần |
| `Carboxylation` | **Carboxyl hóa** | Xuất hiện 2 lần |
| `Hydrolysis of the ring` | *Hydrolysis of the ring* | Xuất hiện 2 lần |
| `GDP replaced by GTP` | *GDP replaced by GTP* | Xuất hiện 2 lần |
| `Release of the catalytic subunits` | *Release of the catalytic subunits* | Xuất hiện 2 lần |
| `Dimerization` | *Dimerization* | Xuất hiện 2 lần |
| `Autophosphorylation of tyrosines` | *Autophosphorylation of tyrosines* | Xuất hiện 2 lần |
| `Assembly of the signaling complex` | *Assembly of the signaling complex* | Xuất hiện 2 lần |
| `Breakdown of the sugar (in the muscle)` | *Breakdown of the sugar (in the muscle)* | Xuất hiện 2 lần |
| `Transport from the muscle to the liver` | *Transport from the muscle to the liver* | Xuất hiện 2 lần |
| `Synthesis of the sugar (in the liver)` | *Synthesis of the sugar (in the liver)* | Xuất hiện 2 lần |
| `Transport from the liver to the muscle` | *Transport from the liver to the muscle* | Xuất hiện 2 lần |
| `Transfer of two carbons` | *Transfer of two carbons* | Xuất hiện 2 lần |
| `Amide bond formation (spends ATP)` | **Tạo liên kết amid (tiêu tốn ATP)** | Xuất hiện 2 lần |
| `Transfer of a formyl group` | *Transfer of a formyl group* | Xuất hiện 2 lần |
| `Elimination (a lyase removes the carbon skeleton)` | *Elimination (a lyase removes the carbon skeleton)* | Xuất hiện 2 lần |
| `Aldol cleavage` | **Phân cắt aldol** | Xuất hiện 1 lần |
| `Oxidation + phosphorylation` | **Oxi hóa kèm phosphoryl hóa** | Xuất hiện 1 lần |
| `Dehydration` | **Tách nước** | Xuất hiện 1 lần |
| `Condensation` | **Ngưng tụ** | Xuất hiện 1 lần |
| `Isomerization (dehydration, then rehydration)` | *Isomerization (dehydration, then rehydration)* | Xuất hiện 1 lần |
| `Electron transfer and proton pumping (quinone cycle)` | **Truyền electron và bơm proton (chu trình quinone)** | Xuất hiện 1 lần |
| `Nucleotidyl transfer (activation)` | *Nucleotidyl transfer (activation)* | Xuất hiện 1 lần |
| `Glycosyl transfer` | *Glycosyl transfer* | Xuất hiện 1 lần |
| `Phosphorolysis` | **Phân giải bằng phosphat (Phosphorolysis)** | Xuất hiện 1 lần |
| `Carboxylation (bypass of pyruvate kinase)` | **Carboxyl hóa (vượt qua pyruvate kinase)** | Xuất hiện 1 lần |
| `Decarboxylation and phosphorylation (bypass of pyruvate kinase)` | **Khử carboxyl kèm phosphoryl hóa** | Xuất hiện 1 lần |
| `Hydration (reverse of glycolysis)` | **Cộng nước (ngược đường phân)** | Xuất hiện 1 lần |
| `Phosphoryl shift (reverse of glycolysis)` | **Chuyển vị nhóm phosphoryl (ngược đường phân)** | Xuất hiện 1 lần |
| `Phosphoryl transfer (reverse of glycolysis)` | **Chuyển nhóm phosphoryl (ngược đường phân)** | Xuất hiện 1 lần |
| `Reduction (reverse of glycolysis)` | *Reduction (reverse of glycolysis)* | Xuất hiện 1 lần |
| `Aldol condensation (reverse of glycolysis)` | **Ngưng tụ aldol (ngược đường phân)** | Xuất hiện 1 lần |
| `Hydrolysis (bypass of phosphofructokinase)` | **Thủy phân (vượt qua PFK-1)** | Xuất hiện 1 lần |
| `Hydrolysis (bypass of hexokinase)` | **Thủy phân (vượt qua hexokinase)** | Xuất hiện 1 lần |
| `Thiolysis` | **Phân cắt bằng thiol (Thiolysis)** | Xuất hiện 1 lần |
| `Cleavage (thiolysis)` | **Phân cắt (thiolysis)** | Xuất hiện 1 lần |
| `Electron transfer (1 e⁻ at a time)` | *Electron transfer (1 e⁻ at a time)* | Xuất hiện 1 lần |
| `Electron transfer (heme iron Fe³⁺ to Fe²⁺)` | *Electron transfer (heme iron Fe³⁺ to Fe²⁺)* | Xuất hiện 1 lần |
| `Electron transfer (copper and heme)` | *Electron transfer (copper and heme)* | Xuất hiện 1 lần |
| `Reduction of O₂ (4 e⁻)` | *Reduction of O₂ (4 e⁻)* | Xuất hiện 1 lần |
| `ATP synthesis (binding change)` | *ATP synthesis (binding change)* | Xuất hiện 1 lần |
| `Carboxylation and phosphorylation (committed step)` | *Carboxylation and phosphorylation (committed step)* | Xuất hiện 1 lần |
| `Condensation (activated by ATP)` | **Ngưng tụ (hoạt hóa bởi ATP)** | Xuất hiện 1 lần |
| `Elimination (lyase)` | *Elimination (lyase)* | Xuất hiện 1 lần |
| `Hydrolysis of an amide` | *Hydrolysis of an amide* | Xuất hiện 1 lần |
| `Facilitated diffusion through a channel` | *Facilitated diffusion through a channel* | Xuất hiện 1 lần |
| `Symport with H\u207a` | *Symport with H\u207a* | Xuất hiện 1 lần |
| `Fission, spends GTP` | *Fission, spends GTP* | Xuất hiện 1 lần |
| `Outer membrane fusion, spends GTP` | *Outer membrane fusion, spends GTP* | Xuất hiện 1 lần |
| `Inner membrane fusion, spends GTP` | *Inner membrane fusion, spends GTP* | Xuất hiện 1 lần |
| `Pore formation and release` | *Pore formation and release* | Xuất hiện 1 lần |
| `Complex assembly` | *Complex assembly* | Xuất hiện 1 lần |
| `Activation of a precursor by proximity` | *Activation of a precursor by proximity* | Xuất hiện 1 lần |
| `Receptor activation` | *Receptor activation* | Xuất hiện 1 lần |
| `Recruitment and activation of a precursor` | *Recruitment and activation of a precursor* | Xuất hiện 1 lần |
| `all` | *all* | Xuất hiện 1 lần |
| `custom` | *custom* | Xuất hiện 1 lần |
| `facts` | *facts* | Xuất hiện 1 lần |
| `structure` | *structure* | Xuất hiện 1 lần |
| `Water oxidation (4 e⁻)` | **Oxi hóa nước (4 e⁻)** | Xuất hiện 1 lần |
| `Release into the quinone pool` | *Release into the quinone pool* | Xuất hiện 1 lần |
| `Electron transfer and proton release` | *Electron transfer and proton release* | Xuất hiện 1 lần |
| `Water oxidation and quinone reduction` | *Water oxidation and quinone reduction* | Xuất hiện 1 lần |
| `Photoexcitation and electron transfer` | **Kích thích quang học và truyền electron** | Xuất hiện 1 lần |
| `Light reactions: NADP⁺ reduced, water oxidized` | *Light reactions: NADP⁺ reduced, water oxidized* | Xuất hiện 1 lần |
| `Photophosphorylation` | **Quang phosphoryl hóa** | Xuất hiện 1 lần |
| `Carbon fixation (net equation of the Calvin cycle)` | *Carbon fixation (net equation of the Calvin cycle)* | Xuất hiện 1 lần |
| `Electron transfer out of the reaction center` | *Electron transfer out of the reaction center* | Xuất hiện 1 lần |
| `Electron return and proton pumping` | *Electron return and proton pumping* | Xuất hiện 1 lần |
| `The ring closes: the hole is refilled and the pair is excited again` | *The ring closes: the hole is refilled and the pair is excited again* | Xuất hiện 1 lần |
| `ATP synthesis (the only product of the loop)` | *ATP synthesis (the only product of the loop)* | Xuất hiện 1 lần |
| `Carboxylation (carbon fixation)` | *Carboxylation (carbon fixation)* | Xuất hiện 1 lần |
| `Epimerization` | **Epimer hóa** | Xuất hiện 1 lần |
| `Stage 1: carbon fixation` | *Stage 1: carbon fixation* | Xuất hiện 1 lần |
| `Stage 2: reduction` | *Stage 2: reduction* | Xuất hiện 1 lần |
| `Stage 3: regeneration` | *Stage 3: regeneration* | Xuất hiện 1 lần |
| `Carboxylation (the Calvin cycle starts)` | *Carboxylation (the Calvin cycle starts)* | Xuất hiện 1 lần |
| `Phosphorylation (regenerates PEP)` | *Phosphorylation (regenerates PEP)* | Xuất hiện 1 lần |
| `Binding of the hormone` | *Binding of the hormone* | Xuất hiện 1 lần |
| `Structural change of the receptor` | *Structural change of the receptor* | Xuất hiện 1 lần |
| `Replacement of GDP by GTP` | *Replacement of GDP by GTP* | Xuất hiện 1 lần |
| `Dissociation and activation of an enzyme` | *Dissociation and activation of an enzyme* | Xuất hiện 1 lần |
| `GTPase action` | **Hoạt tính GTPase** | Xuất hiện 1 lần |
| `Return to the original state` | *Return to the original state* | Xuất hiện 1 lần |
| `Cyclization` | **Đóng vòng** | Xuất hiện 1 lần |
| `Binding of cAMP to the regulatory subunits` | *Binding of cAMP to the regulatory subunits* | Xuất hiện 1 lần |
| `Phosphorylation of a Ser/Thr protein` | *Phosphorylation of a Ser/Thr protein* | Xuất hiện 1 lần |
| `Dephosphorylation` | **Khử phosphat** | Xuất hiện 1 lần |
| `Reassembly of inactive PKA` | *Reassembly of inactive PKA* | Xuất hiện 1 lần |
| `Hormone stimulation` | *Hormone stimulation* | Xuất hiện 1 lần |
| `Phosphorolysis of glycogen` | **Phân giải glycogen bằng phosphat** | Xuất hiện 1 lần |
| `Hormone binding and activation of a G protein` | *Hormone binding and activation of a G protein* | Xuất hiện 1 lần |
| `Activation of an enzyme by the G protein` | *Activation of an enzyme by the G protein* | Xuất hiện 1 lần |
| `Hydrolysis of a phospholipid` | *Hydrolysis of a phospholipid* | Xuất hiện 1 lần |
| `Release of Ca²⁺ from the endoplasmic reticulum` | *Release of Ca²⁺ from the endoplasmic reticulum* | Xuất hiện 1 lần |
| `Binding of Ca²⁺` | *Binding of Ca²⁺* | Xuất hiện 1 lần |
| `Phosphorylation of a target enzyme` | *Phosphorylation of a target enzyme* | Xuất hiện 1 lần |
| `Activation of a membrane kinase` | *Activation of a membrane kinase* | Xuất hiện 1 lần |
| `Phosphorylation of channels` | *Phosphorylation of channels* | Xuất hiện 1 lần |
| `Binding of the ligand` | *Binding of the ligand* | Xuất hiện 1 lần |
| `The message is passed on` | *The message is passed on* | Xuất hiện 1 lần |
| `Binding of insulin` | *Binding of insulin* | Xuất hiện 1 lần |
| `Autophosphorylation` | *Autophosphorylation* | Xuất hiện 1 lần |
| `Activation of the docking protein` | *Activation of the docking protein* | Xuất hiện 1 lần |
| `Activation of a lipid kinase` | *Activation of a lipid kinase* | Xuất hiện 1 lần |
| `Phosphorylation of a lipid` | *Phosphorylation of a lipid* | Xuất hiện 1 lần |
| `Activation of PDK1` | *Activation of PDK1* | Xuất hiện 1 lần |
| `Activation of Akt` | *Activation of Akt* | Xuất hiện 1 lần |
| `Movement of GLUT4 to the plasma membrane` | *Movement of GLUT4 to the plasma membrane* | Xuất hiện 1 lần |
| `Uptake of glucose` | *Uptake of glucose* | Xuất hiện 1 lần |
| `Activation of phosphoprotein phosphatase` | *Activation of phosphoprotein phosphatase* | Xuất hiện 1 lần |
| `Binding of the effector to the stimulatory receptor` | *Binding of the effector to the stimulatory receptor* | Xuất hiện 1 lần |
| `GTP-GDP exchange on Gs` | *GTP-GDP exchange on Gs* | Xuất hiện 1 lần |
| `Stimulation of adenylate cyclase (the green plus)` | *Stimulation of adenylate cyclase (the green plus)* | Xuất hiện 1 lần |
| `Binding of the effector to the inhibitory receptor` | *Binding of the effector to the inhibitory receptor* | Xuất hiện 1 lần |
| `GTP-GDP exchange on Gi` | *GTP-GDP exchange on Gi* | Xuất hiện 1 lần |
| `Inhibition of the enzyme` | *Inhibition of the enzyme* | Xuất hiện 1 lần |
| `Inhibition of the stimulatory arm` | *Inhibition of the stimulatory arm* | Xuất hiện 1 lần |
| `Phosphorylation of the receptor tail` | *Phosphorylation of the receptor tail* | Xuất hiện 1 lần |
| `Binding to the phosphorylated tail (blocks and favors endocytosis)` | *Binding to the phosphorylated tail (blocks and favors endocytosis)* | Xuất hiện 1 lần |
| `GTPase action (the switch turns itself off)` | *GTPase action (the switch turns itself off)* | Xuất hiện 1 lần |
| `Return to the resting state` | *Return to the resting state* | Xuất hiện 1 lần |
| `Reassembly of the inactive kinase` | *Reassembly of the inactive kinase* | Xuất hiện 1 lần |
| `Binding of glucagon` | *Binding of glucagon* | Xuất hiện 1 lần |
| `Phosphorylation (activity decreased)` | *Phosphorylation (activity decreased)* | Xuất hiện 1 lần |
| `Phosphorylation (activity increased)` | *Phosphorylation (activity increased)* | Xuất hiện 1 lần |
| `Fall of the regulator` | *Fall of the regulator* | Xuất hiện 1 lần |
| `Lack of allosteric activation` | *Lack of allosteric activation* | Xuất hiện 1 lần |
| `Release of the brake` | *Release of the brake* | Xuất hiện 1 lần |
| `Binding of EGF and dimerization` | *Binding of EGF and dimerization* | Xuất hiện 1 lần |
| `Exchange of GDP for GTP on RAS` | *Exchange of GDP for GTP on RAS* | Xuất hiện 1 lần |
| `Activation of the first kinase of the chain` | *Activation of the first kinase of the chain* | Xuất hiện 1 lần |
| `Phosphorylation (activation of the second kinase)` | *Phosphorylation (activation of the second kinase)* | Xuất hiện 1 lần |
| `Phosphorylation (activation of the third kinase)` | *Phosphorylation (activation of the third kinase)* | Xuất hiện 1 lần |
| `Phosphorylation of a kinase one level down` | *Phosphorylation of a kinase one level down* | Xuất hiện 1 lần |
| `Phosphorylation of a second kinase at that level` | *Phosphorylation of a second kinase at that level* | Xuất hiện 1 lần |
| `Phosphorylation of a transcription factor` | *Phosphorylation of a transcription factor* | Xuất hiện 1 lần |
| `Phosphorylation of a second transcription factor` | *Phosphorylation of a second transcription factor* | Xuất hiện 1 lần |
| `Phosphorylation of a ribosomal protein` | *Phosphorylation of a ribosomal protein* | Xuất hiện 1 lần |
| `Activation of the target genes` | *Activation of the target genes* | Xuất hiện 1 lần |
| `Binding of GTP switches the protein on` | *Binding of GTP switches the protein on* | Xuất hiện 1 lần |
| `Slow GTPase action switches it off` | *Slow GTPase action switches it off* | Xuất hiện 1 lần |
| `The active switch stimulates the next event` | *The active switch stimulates the next event* | Xuất hiện 1 lần |
| `A mutation at codon 12, 13 or 61 slows the GTPase` | *A mutation at codon 12, 13 or 61 slows the GTPase* | Xuất hiện 1 lần |
| `Hormone entry across the lipid bilayer` | *Hormone entry across the lipid bilayer* | Xuất hiện 1 lần |
| `Binding of the hormone to the receptor` | *Binding of the hormone to the receptor* | Xuất hiện 1 lần |
| `Release from the resting complex` | *Release from the resting complex* | Xuất hiện 1 lần |
| `Movement to the nucleus` | *Movement to the nucleus* | Xuất hiện 1 lần |
| `Binding to the HRE with a coactivator and RNA polymerase` | *Binding to the HRE with a coactivator and RNA polymerase* | Xuất hiện 1 lần |
| `Transcription activation` | *Transcription activation* | Xuất hiện 1 lần |
| `Movement of the mRNA to the cytoplasm` | *Movement of the mRNA to the cytoplasm* | Xuất hiện 1 lần |
| `Translation and changed cell function` | *Translation and changed cell function* | Xuất hiện 1 lần |
| `Reduction (the carrier of glycolysis is regenerated)` | *Reduction (the carrier of glycolysis is regenerated)* | Xuất hiện 1 lần |
| `Oxidation (the muscle step run backwards)` | *Oxidation (the muscle step run backwards)* | Xuất hiện 1 lần |
| `Hydrolysis of peptide bonds` | *Hydrolysis of peptide bonds* | Xuất hiện 1 lần |
| `Removal of the nitrogen group` | *Removal of the nitrogen group* | Xuất hiện 1 lần |
| `Transamination (in the muscle)` | **Chuyển amin (ở cơ)** | Xuất hiện 1 lần |
| `Transamination (in the liver)` | **Chuyển amin (ở gan)** | Xuất hiện 1 lần |
| `Nitrogen disposal (in the liver)` | *Nitrogen disposal (in the liver)* | Xuất hiện 1 lần |
| `Condensation of an aldehyde with an amine (steps 1a and 1b)` | *Condensation of an aldehyde with an amine (steps 1a and 1b)* | Xuất hiện 1 lần |
| `Transaldimination (steps 2a to 2c)` | *Transaldimination (steps 2a to 2c)* | Xuất hiện 1 lần |
| `Loss of the α-proton (step 3)` | *Loss of the α-proton (step 3)* | Xuất hiện 1 lần |
| `Protonation at C4′ (step 4)` | *Protonation at C4′ (step 4)* | Xuất hiện 1 lần |
| `Hydrolysis of a C=N bond (step 5)` | *Hydrolysis of a C=N bond (step 5)* | Xuất hiện 1 lần |
| `Second half-reaction (the first half run backwards)` | *Second half-reaction (the first half run backwards)* | Xuất hiện 1 lần |
| `Oxidation (the committed step, NADPH made)` | **Oxi hóa (bước quyết định, tạo NADPH)** | Xuất hiện 1 lần |
| `Hydrolysis of the ring ester` | *Hydrolysis of the ring ester* | Xuất hiện 1 lần |
| `Oxidative decarboxylation (NADPH and CO₂)` | **Khử carboxyl oxi hóa (tạo NADPH và CO₂)** | Xuất hiện 1 lần |
| `Isomerization (ketose to aldose)` | **Đồng phân hóa (cetose sang aldose)** | Xuất hiện 1 lần |
| `Epimerization at carbon 3` | *Epimerization at carbon 3* | Xuất hiện 1 lần |
| `Transfer of three carbons` | **Chuyển 3 carbon** | Xuất hiện 1 lần |
| `Pyrophosphoryl transfer (the sugar is activated)` | *Pyrophosphoryl transfer (the sugar is activated)* | Xuất hiện 1 lần |
| `Amidotransfer (the rate-limiting step)` | *Amidotransfer (the rate-limiting step)* | Xuất hiện 1 lần |
| `Ring closure (the imidazole ring)` | *Ring closure (the imidazole ring)* | Xuất hiện 1 lần |
| `Ring closure (the second ring)` | *Ring closure (the second ring)* | Xuất hiện 1 lần |
| `Carboxylation and phosphorylation (the rate-limiting step)` | *Carboxylation and phosphorylation (the rate-limiting step)* | Xuất hiện 1 lần |
| `Ring closure (a condensation)` | *Ring closure (a condensation)* | Xuất hiện 1 lần |
| `Oxidation (the ring gets its double bond)` | *Oxidation (the ring gets its double bond)* | Xuất hiện 1 lần |
| `Transfer of the ribose phosphate (N-glycosidic bond)` | *Transfer of the ribose phosphate (N-glycosidic bond)* | Xuất hiện 1 lần |
| `Amide bond formation (spends GTP)` | *Amide bond formation (spends GTP)* | Xuất hiện 1 lần |
| `Oxidation (the committed step of its branch)` | *Oxidation (the committed step of its branch)* | Xuất hiện 1 lần |
| `Amidation (spends ATP to AMP and PPᵢ)` | *Amidation (spends ATP to AMP and PPᵢ)* | Xuất hiện 1 lần |
| `Methyl transfer (the one route to thymidylate)` | *Methyl transfer (the one route to thymidylate)* | Xuất hiện 1 lần |
| `Reduction (the coenzyme is restored)` | *Reduction (the coenzyme is restored)* | Xuất hiện 1 lần |

## 5. Gợi Ý Chi Tiết Từng Bước Phản Ứng (`rxn.hint`)

Tổng hợp toàn bộ 304 câu gợi ý cụ thể gắn liền với từng phản ứng trong các con đường chuyển hóa.

| Dòng code | Tên bước / Phản ứng | Gợi ý Tiếng Anh gốc (`rxn.hint`) | Đề xuất Tiếng Việt |
| :--- | :--- | :--- | :--- |
| `L9367` | `` | A phosphate group is transferred from a high-energy donor onto the sugar\ | *(Bản dịch bước )* |
| `L9375` | `hl` | The six-membered ring opens, the carbonyl moves from carbon 1 to carbon 2 (an aldose becomes a ketose), and the sugar closes again as a five-membered ring. No cofactor is needed, and the step is freely reversible. | *(Bản dịch bước hl)* |
| `L9383` | `hl` | A second phosphate group is transferred from a high-energy donor, this time onto carbon 1 of the five-membered ring. This is the committed step and the main control point of the pathway, and it is irreversible. | *(Bản dịch bước hl)* |
| `L9392` | `hl` | The six-carbon sugar is cleaved between carbons 3 and 4, giving two three-carbon pieces: one built around a ketone and one around an aldehyde. Nothing else is consumed or released. | *(Bản dịch bước hl)* |
| `L9400` | `hl` | The ketone-containing triose is converted into its aldehyde isomer by moving the carbonyl, so both halves of the original sugar can continue down the pathway. No cofactors are involved. | *(Bản dịch bước hl)* |
| `L9409` | `hl` | The aldehyde is oxidized while a bond with a high free energy of hydrolysis is formed at the same carbon, using an inorganic ion from solution. The electrons removed are captured by an electron carrier. This is the first energy-conserving step, and it happens twice per glucose. | *(Bản dịch bước hl)* |
| `L9418` | `hl` | The high-energy group at carbon 1 is transferred to a nucleotide diphosphate, forming a triphosphate. This is substrate-level phosphorylation, and it repays the investment made in the first half of the pathway. | *(Bản dịch bước hl)* |
| `L9426` | `hl` | A phosphate group shifts from carbon 3 to carbon 2 of the same molecule. Nothing is added or removed; the molecule is only rearranged. | *(Bản dịch bước hl)* |
| `L9435` | `hl` | A small molecule is eliminated from the substrate, creating a double bond and a very high-energy enol phosphate. The step needs a magnesium ion. | *(Bản dịch bước hl)* |
| `L9443` | `hl` | The enol phosphate passes its phosphate group to a nucleotide diphosphate, and the leftover enol turns into a ketone. This is the second substrate-level phosphorylation, and it is irreversible. | *(Bản dịch bước hl)* |
| `L9471` | `` | The keto acid loses one carbon as a gas, the remaining two-carbon unit is attached to a sulfur-containing carrier as a thioester, and electrons are captured by an electron carrier. A multienzyme complex with five cofactors does this, and it is irreversible. | *(Bản dịch bước )* |
| `L9494` | `cof` | The two-carbon acetyl unit is joined to the carbonyl carbon of a four-carbon acid, and hydrolysis of the thioester releases the carrier and drives the step strongly forward. The product has six carbons and three carboxyl groups. | *(Bản dịch bước cof)* |
| `L9502` | `hl` | The hydroxyl group moves from the tertiary carbon to a neighboring carbon, through an unsaturated intermediate, turning an alcohol that cannot be oxidized into one that can. No cofactors change. | *(Bản dịch bước hl)* |
| `L9510` | `hl` | A secondary alcohol is oxidized to a ketone and, in the same enzyme, a carboxyl group is lost as a gas. The electrons are captured by an electron carrier. This is the first oxidative decarboxylation of the cycle and a key control point. | *(Bản dịch bước hl)* |
| `L9518` | `hl` | A five-carbon keto acid is oxidatively decarboxylated: one carbon leaves as a gas, a thioester forms with a sulfur-containing carrier, and electrons are captured by an electron carrier. The enzyme is a multienzyme complex built like the one in the link reaction. | *(Bản dịch bước hl)* |
| `L9526` | `hl` | The energy of the thioester bond is used to join an inorganic ion to a nucleotide diphosphate, making a nucleotide triphosphate while the carrier is released. It is the only substrate-level phosphorylation in the cycle. | *(Bản dịch bước hl)* |
| `L9534` | `hl` | Two hydrogens are removed from the saturated carbon-carbon bond, creating a trans double bond. The electrons go to a flavin cofactor that is covalently bound to the enzyme, which sits in the inner mitochondrial membrane. | *(Bản dịch bước hl)* |
| `L9542` | `hl` | A small molecule adds across the carbon-carbon double bond, placing a hydroxyl group on one carbon with the correct (L) stereochemistry. There is no change in oxidation state. | *(Bản dịch bước hl)* |
| `L9550` | `hl` | A secondary alcohol is oxidized to a ketone and the electrons are captured by an electron carrier. The product is the four-carbon acceptor that starts the next turn of the cycle. | *(Bản dịch bước hl)* |
| `L9570` | `` | The ketone is reduced to an alcohol using electrons from an electron carrier. That carrier returns to its oxidized form, which lets the oxidation step earlier in the pathway keep running without oxygen. | *(Bản dịch bước )* |
| `L9591` | `` | Electrons from a reduced nucleotide carrier pass through a flavin and a chain of iron-sulfur clusters to a lipid-soluble carrier that diffuses in the membrane. The energy released is used to move ions across the inner membrane. | *(Bản dịch bước )* |
| `L9601` | `cof` | Electrons from a covalently bound flavin pass to the same lipid-soluble carrier, but this complex does not move any ions across the membrane. | *(Bản dịch bước cof)* |
| `L9610` | `hl` | The reduced lipid-soluble carrier hands electrons, one at a time, to a small mobile heme protein in the intermembrane space (the quinone cycle), and ions are moved across the membrane. Antimycin A blocks this step. | *(Bản dịch bước hl)* |
| `L9619` | `hl` | The small heme protein is re-oxidized as four electrons are delivered, through copper and heme centres, to the final electron acceptor of aerobic respiration, which is completely reduced. Ions are pumped across the membrane. Cyanide and carbon monoxide block this step. | *(Bản dịch bước hl)* |
| `L9628` | `hl` | Ions flow back across the membrane through a rotary motor, and the rotation drives a catalytic head that joins a nucleotide diphosphate to an inorganic ion, making a nucleotide triphosphate. | *(Bản dịch bước hl)* |
| `L9659` | `` | A carrier that is full of electrons hands them to the first big protein in the membrane. The protein passes them on to a small carrier that floats inside the membrane, and it uses the energy to push four protons out of the matrix. | *(Bản dịch bước )* |
| `L9669` | `cof` | A second way in: electrons from a different carrier join the same floating carrier and skip the first big protein. This protein is also an enzyme of the TCA cycle, and it pumps no protons at all. | *(Bản dịch bước cof)* |
| `L9678` | `hl` | The floating carrier hands its electrons, one at a time, to a small heme protein that rides on the outer face of the membrane. This protein complex pushes four more protons out as it works. | *(Bản dịch bước hl)* |
| `L9687` | `hl` | The last protein of the chain hands the electrons, with protons from the matrix, to the final acceptor of aerobic life, which is completely reduced. Poisons such as cyanide stop the chain at this step. | *(Bản dịch bước hl)* |
| `L9696` | `hl` | Protons flow back into the matrix through a spinning protein motor. The turning drives a catalytic head that joins a nucleotide diphosphate and an inorganic ion into a triphosphate, so this is where the gradient pays off. | *(Bản dịch bước hl)* |
| `L9728` | `` | A phosphoryl group moves from carbon 6 to carbon 1 of the same sugar, through a bisphosphorylated intermediate. Nothing is added or removed, and the step is freely reversible. | *(Bản dịch bước )* |
| `L9737` | `hl` | The sugar phosphate attacks a nucleotide triphosphate, which hands its nucleoside monophosphate unit to the sugar and releases the other two phosphoryl groups together. The sugar is now activated for polymer synthesis. Splitting the released pair pulls the step forward. | *(Bản dịch bước hl)* |
| `L9746` | `cof` | The activated sugar is transferred onto the non-reducing end of a growing storage polymer, forming an alpha-1,4 glycosidic bond and releasing the nucleoside diphosphate. This is the key regulated step of storage. | *(Bản dịch bước cof)* |
| `L9754` | `hl` | The polymer is cleaved from its non-reducing end by attack of an inorganic ion instead of water, so the released sugar already carries a phosphoryl group and no ATP is spent. | *(Bản dịch bước hl)* |
| `L9777` | `` | A one-carbon unit from bicarbonate is attached to the three-carbon keto acid as a new carboxyl group, using the energy of a nucleotide triphosphate, making a four-carbon acid. The enzyme needs biotin, works in the mitochondrion, and is the first bypass step of the reverse pathway. | *(Bản dịch bước )* |
| `L9785` | `hl` | The four-carbon acid loses a carboxyl group as a gas while a nucleotide triphosphate donates a phosphoryl group, forming the high-energy enol phosphate. Together with the previous step this completes the bypass of the last glycolytic step. | *(Bản dịch bước hl)* |
| `L9793` | `hl` | A small molecule adds across the double bond of the enol phosphate. The same enzyme that works in glycolysis runs here in the opposite direction. | *(Bản dịch bước hl)* |
| `L9801` | `hl` | A phosphate group shifts from carbon 2 to carbon 3 of the same molecule. Nothing is added or removed. The same enzyme as in glycolysis, running backwards. | *(Bản dịch bước hl)* |
| `L9810` | `hl` | A phosphoryl group is transferred from a nucleotide triphosphate onto the carboxyl group, forming the high-energy acyl phosphate. This is the third of the three high-energy bonds spent per three-carbon unit, after the two spent in the bypass of pyruvate kinase. | *(Bản dịch bước hl)* |
| `L9819` | `hl` | The high-energy acyl group is reduced to an aldehyde by electrons from an electron carrier, and an inorganic ion is released. The same enzyme as in glycolysis runs in the opposite direction. | *(Bản dịch bước hl)* |
| `L9828` | `cof` | The aldehyde-containing triose is converted into its ketone isomer by moving the carbonyl, so the two three-carbon pieces can be joined. No cofactors are involved. | *(Bản dịch bước cof)* |
| `L9836` | `hl` | Two three-carbon pieces, one built around a ketone and one around an aldehyde, are joined between carbons 3 and 4 to make the six-carbon sugar bisphosphate. Nothing else is consumed or released. | *(Bản dịch bước hl)* |
| `L9844` | `hl` | The phosphoryl group on carbon 1 is removed by hydrolysis and released as an inorganic ion, giving the monophosphate. This bypasses the main control step of glycolysis and is a key regulated step of the reverse pathway. | *(Bản dịch bước hl)* |
| `L9852` | `hl` | The five-membered ketose ring opens, the carbonyl moves from carbon 2 to carbon 1, and the sugar closes again as a six-membered ring. No cofactor is needed. | *(Bản dịch bước hl)* |
| `L9860` | `hl` | The phosphoryl group on carbon 6 is removed by hydrolysis and released as an inorganic ion, giving back the free sugar that can leave the cell. This bypasses the first step of glycolysis and occurs mainly in the liver and kidney. | *(Bản dịch bước hl)* |
| `L9883` | `` | The three-carbon keto acid loses its carboxyl group as a gas, leaving a two-carbon aldehyde. The enzyme needs thiamine pyrophosphate and is found in yeast and some bacteria, not in animals. | *(Bản dịch bước )* |
| `L9891` | `hl` | The aldehyde is reduced to an alcohol using electrons from an electron carrier, which returns to its oxidized form so that glycolysis can keep running without oxygen. | *(Bản dịch bước hl)* |
| `L9908` | `` | The ester bonds that hold three acyl chains on a three-carbon alcohol backbone are cleaved by hydrolysis, releasing the free chains as acids and the backbone alcohol. In adipocytes this step is switched on by hormones such as epinephrine and glucagon. | *(Bản dịch bước )* |
| `L9916` | `hl` | The free acid is activated: it is joined to a sulfur-containing carrier through a thioester bond, using a nucleotide triphosphate that is cleaved to the monophosphate with two phosphoryl groups released together. This costs two high-energy bonds, and the activated chain is then carried into the mitochondrion. | *(Bản dịch bước hl)* |
| `L9924` | `hl` | Two hydrogens are removed from the carbons next to the thioester, creating a trans double bond. The electrons go to a flavin cofactor bound to the enzyme. | *(Bản dịch bước hl)* |
| `L9933` | `hl` | A small molecule adds across the trans double bond, putting a hydroxyl group on the beta carbon with L stereochemistry. There is no change in oxidation state. | *(Bản dịch bước hl)* |
| `L9942` | `hl` | The beta-hydroxyl group is oxidized to a ketone and the electrons are captured by an electron carrier. | *(Bản dịch bước hl)* |
| `L9951` | `hl` | A second sulfur-containing carrier attacks the beta-keto carbon and cleaves the chain between the alpha and beta carbons. A two-carbon unit leaves as the entry molecule of the TCA cycle, and the chain, two carbons shorter, returns to the start of the spiral. | *(Bản dịch bước hl)* |
| `L9975` | `` | A free long chain with an acid end cannot enter the cycle yet. It is first tied to a sulfur-containing carrier built from a B vitamin, and the energy for the tie-up comes from a nucleotide that is cleaved all the way down, which costs the same as spending two of them. | *(Bản dịch bước )* |
| `L9983` | `hl` | The cycle begins with an oxidation: two hydrogens are taken from the second and third carbons of the chain, which leaves a trans double bond. The electrons are caught by a flavin carrier, and from there they go on to the electron transport chain. | *(Bản dịch bước hl)* |
| `L9991` | `hl` | A small molecule from the surroundings adds across the new double bond and puts a hydroxyl group on the third carbon. Nothing is oxidized or reduced in this step. | *(Bản dịch bước hl)* |
| `L9999` | `hl` | The hydroxyl group on the third carbon is oxidized to a ketone, and this time the electrons are taken by a free-floating carrier that can carry them to the electron transport chain. | *(Bản dịch bước hl)* |
| `L10007` | `hl` | Another sulfur-containing carrier attacks the ketone carbon and snaps the chain between the second and third carbons. Two carbons leave as the fuel of the TCA cycle, and the rest of the chain, two carbons shorter, goes back to the start of the cycle. | *(Bản dịch bước hl)* |
| `L10032` | `` | The reduced nucleotide carrier gives up two electrons and a proton (together a hydride ion) to a flavin held inside the first membrane complex, and the nucleotide leaves in its oxidized form. | *(Bản dịch bước )* |
| `L10040` | `hl` | The flavin hands its two electrons, one at a time, to metal clusters that are held in the protein by cysteines, so from here the electrons travel singly. | *(Bản dịch bước hl)* |
| `L10048` | `hl` | The metal centers that carry single electrons pass them to a lipid-soluble carrier that never leaves the membrane, and the carrier takes up two hydrogens from the matrix as it is reduced. The complex also pumps four ions across the membrane, using the energy released. Rotenone stops the chain here by blocking the binding site of the carrier. | *(Bản dịch bước hl)* |
| `L10056` | `hl` | The reduced membrane carrier gives its electrons to a heme protein of the next pumping complex, and it is released in its oxidized form while the positive charges it carried appear on the intermembrane side. Antimycin A binds the complex next to this heme protein and stops it. | *(Bản dịch bước hl)* |
| `L10064` | `hl` | The electron moves on within the same complex to a second heme protein, the last one of the complex, which faces the intermembrane space. | *(Bản dịch bước hl)* |
| `L10071` | `hl` | The last heme of the complex gives its electron to a small soluble heme protein, which then carries one electron at a time through the intermembrane space to the next complex. The complex as a whole moves four ions across the membrane for each ubiquinol it oxidizes. | *(Bản dịch bước hl)* |
| `L10079` | `hl` | The mobile heme protein delivers its electron to the last pumping complex of the chain, where it goes first to a pair of copper atoms and then to a heme of that complex, and the carrier is released in its oxidized form. | *(Bản dịch bước hl)* |
| `L10087` | `hl` | The electron passes within the complex to a second heme that is paired with a copper atom, and together they form the site where the final electron acceptor will bind. | *(Bản dịch bước hl)* |
| `L10094` | `hl` | Four electrons arrive one after another and are handed to the final electron acceptor, a gas that is split and combines with positive charges from the matrix to form the end product of the chain. The complex also pumps four more ions across the membrane. Cyanide and carbon monoxide stop the chain here. | *(Bản dịch bước hl)* |
| `L10120` | `` | In the cytosol the ketone of a three-carbon phosphate is reduced to an alcohol with the electrons of the carrier made in glycolysis, so the carrier returns to its oxidized form and the electrons now sit on a molecule that can reach the mitochondrion. | *(Bản dịch bước )* |
| `L10128` | `hl` | On the outer face of the inner membrane an enzyme with a tightly bound cofactor takes two hydrogens from the alcohol, restoring the ketone, and passes the electrons straight to the lipid-soluble carrier of the chain, so they enter at the same level as those from succinate and skip the first complex. | *(Bản dịch bước hl)* |
| `L10154` | `` | The ketone of a four-carbon acid in the cytosol is reduced to an alcohol with the electrons of the carrier made in glycolysis, which puts the electrons onto a molecule that the inner membrane can transport. | *(Bản dịch bước )* |
| `L10162` | `hl` | A carrier in the inner membrane moves the dicarboxylate into the matrix and, in exchange, moves a five-carbon keto acid out to the cytosol. Nothing is oxidized or reduced in this step. | *(Bản dịch bước hl)* |
| `L10169` | `hl` | Inside the matrix the alcohol is oxidized back to a ketone by the oxidized carrier, which is how the electrons of the cytosolic carrier finally reach the pool of reduced carriers that feeds the first complex. | *(Bản dịch bước hl)* |
| `L10177` | `hl` | An amino group is moved from one amino acid onto the ketone of a four-carbon acid, with the help of vitamin B6, giving a different amino acid and a five-carbon keto acid. There is no net oxidation or reduction. | *(Bản dịch bước hl)* |
| `L10184` | `hl` | A second carrier of the inner membrane exports the amino acid made in the matrix to the cytosol and brings the other amino acid in. The membrane potential drives this exchange, which is why the cycle runs in one direction in cells. | *(Bản dịch bước hl)* |
| `L10191` | `` | In the cytosol the same kind of enzyme reverses the amino group transfer, which restores the four-carbon keto acid the cycle started with and the amino acid that goes back into the matrix. | *(Bản dịch bước )* |
| `L10213` | `` | Three catalytic sites in the head take turns in three shapes as a central stalk is turned by the flow of ions: one shape binds the substrates loosely, one holds them tightly while the product forms, and one lets the product go. | *(Bản dịch bước )* |
| `L10221` | `hl` | A carrier in the inner membrane sends the energy currency out and brings a different nucleotide in, one for one, so the two travel in opposite directions. Because the currency carries one more negative charge, the positive membrane potential favors its export, which costs about a quarter of the energy of the chain. | *(Bản dịch bước hl)* |
| `L10247` | `` | A carbon from the cell\ | *(Bản dịch bước )* |
| `L10255` | `hl` | A carbamoyl group is handed from an activated carrier to the side-chain amino group of a basic five-carbon amino acid, forming a ureido group and releasing a small inorganic oxyanion. | *(Bản dịch bước hl)* |
| `L10264` | `terms` | A transporter of the inner mitochondrial membrane swaps two amino acids one for one: the one made in the matrix leaves for the cytosol, and the one made in the cytosol enters the matrix. Nothing is spent. | *(Bản dịch bước terms)* |
| `L10272` | `hl` | A nucleotide triphosphate activates the carbonyl oxygen of the ureido group and is itself split into two smaller products. An amino group from an acidic amino acid then displaces that oxygen, adding the second nitrogen. A pyrophosphatase that splits the second released product pulls the step forward. | *(Bản dịch bước hl)* |
| `L10280` | `hl` | A four-carbon dicarboxylic acid with a C=C double bond is cut off the amino acid added in the last cytosolic step; it is also a TCA-cycle intermediate. The nitrogen-bearing part stays behind as the guanidino group of the product. | *(Bản dịch bước hl)* |
| `L10288` | `hl` | A hydrolysis splits off the guanidino group by adding the elements of a small molecule across its bond. The released group leaves as a small, neutral, nitrogen-containing product that is excreted, and the rest of the amino acid returns to the start of the cycle. | *(Bản dịch bước hl)* |
| `L10320` | `` | The five-carbon keto acid of the TCA cycle takes up free nitrogen and the electrons of a reduced carrier, so that its carbonyl group becomes an amino group. This is one of the two ways in which free nitrogen is built into an amino acid. | *(Bản dịch bước )* |
| `L10328` | `` | A second nitrogen is attached to the amino acid at the carboxyl group of its side chain. The energy currency first activates that group, and free nitrogen then replaces the activated group, which makes a harmless amide that can travel in the blood. | *(Bản dịch bước )* |
| `L10336` | `` | Far from the place where it was made, in tissues such as the liver and the kidney, the amide group of the traveling amino acid is cut by hydrolysis. The nitrogen is freed as an ion again and the carboxyl group of the side chain is left. | *(Bản dịch bước )* |
| `L10344` | `` | The amino acid is oxidized: its amino group leaves as a free ion while a carbonyl group takes its place, and an oxidized carrier takes the electrons. The carbon skeleton that is left is a keto acid of the TCA cycle. | *(Bản dịch bước )* |
| `L10351` | `` | A three-carbon amino acid hands its amino group to a five-carbon keto acid, with a vitamin B6 coenzyme carrying the group in the active site. The three-carbon molecule becomes a keto acid of glycolysis, and nothing is oxidized or reduced. | *(Bản dịch bước )* |
| `L10358` | `` | A four-carbon amino acid with two carboxyl groups hands its amino group to a five-carbon keto acid, with a vitamin B6 coenzyme in the active site, and becomes the four-carbon keto acid that sits in the TCA cycle. | *(Bản dịch bước )* |
| `L10388` | `` | A water-filled pore built from a barrel of beta strands lets small molecules slip through the outer membrane in either direction, so no energy is spent and nothing is oxidized or reduced. | *(Bản dịch bước )* |
| `L10395` | `` | The inner membrane does not let this acid through by itself. A carrier moves it across together with a small positive ion that is more concentrated between the two membranes, so the movement is powered by the gradient that the electron transport chain builds. Nothing is oxidized or reduced. | *(Bản dịch bước )* |
| `L10426` | `` | A ring of a large soluble protein assembles on the outer membrane at a site where a tubule of the endoplasmic reticulum has already squeezed the organelle. It tightens as the energy of a nucleotide triphosphate is spent, until one long structure is pinched into two. | *(Bản dịch bước )* |
| `L10433` | `` | Proteins in the outer membrane of two neighbors reach out and bind each other, and the energy of a nucleotide triphosphate pulls the two outer bilayers together until they merge into one, while the inner membranes stay separate. | *(Bản dịch bước )* |
| `L10440` | `` | After the outer membranes have joined, a protein of the inner membrane uses a nucleotide triphosphate to bring the two inner membranes together too, so the contents of the two organelles mix and one continuous compartment results. | *(Bản dịch bước )* |
| `L10457` | `` | Damage that the cell cannot repair switches on a protein of the Bcl-2 family. It moves to the outer membrane of the mitochondrion and assembles into pores, so a small electron-carrying protein from the space between the two membranes escapes into the cell interior. | *(Bản dịch bước )* |
| `L10464` | `` | In the cytosol the escaped carrier binds a large adaptor protein together with a nucleotide, and seven of these adaptor molecules join into a wheel-shaped complex with a central hub. | *(Bản dịch bước )* |
| `L10471` | `` | Several inactive precursors of a protease are recruited to the hub of the complex made in the previous step. Held close together, they cut and activate each other, which gives the first active protease of the pathway. | *(Bản dịch bước )* |
| `L10478` | `` | The first active protease cuts the inactive precursors of a second group of proteases at specific aspartate residues, turning them into the active enzymes that will carry out the final destruction. | *(Bản dịch bước )* |
| `L10485` | `` | The active proteases of the last group cut hundreds of structural and regulatory proteins, including the nuclear lamina, the cytoskeleton, a DNA repair enzyme and the inhibitor of a DNA-cutting enzyme. The cell shrinks and breaks into membrane-bound pieces. | *(Bản dịch bước )* |
| `L10515` | `` | A signaling protein released by other cells binds a receptor in the plasma membrane and brings three receptor chains together, so that a protein-binding region in their tails (the death domain) is exposed on the inside of the cell. | *(Bản dịch bước )* |
| `L10522` | `` | A chain of adaptor proteins binds the exposed region on one side, and the last one binds the inactive precursor of a protease on the other. Several precursors are held close together, so they cut and activate each other. | *(Bản dịch bước )* |
| `L10529` | `` | The first active protease cuts the inactive precursors of a second group of proteases at specific aspartate residues, turning them into the active enzymes that will carry out the final destruction. | *(Bản dịch bước )* |
| `L10536` | `` | The active proteases of the last group cut hundreds of structural and regulatory proteins, including the nuclear lamina, the cytoskeleton, a DNA repair enzyme and the inhibitor of a DNA-cutting enzyme. The cell shrinks and breaks into membrane-bound pieces. | *(Bản dịch bước )* |
| `L19551` | `` | A metal cluster on the inner face of the membrane pulls electrons out of an abundant small molecule, one at a time, through five oxidation states, and hands them to the pigment pair that lost them. After four rounds a gas is released and acid builds up inside the sac. | *(Bản dịch bước )* |
| `L19558` | `` | The special pair of pigments in the reaction center absorbs a quantum of radiant energy, and one of its electrons jumps to a much higher energy level. The pair is now a strong electron donor instead of a strong electron taker. | *(Bản dịch bước )* |
| `L19565` | `` | The excited pair gives its electron to a neighboring green pigment molecule, and a positive charge stays behind on the donor. This is the first step of the charge separation across the membrane. | *(Bản dịch bước )* |
| `L19572` | `` | The electron moves on to a second pigment, which is a chlorin ring that has lost its central metal ion. It holds the electron for an instant and keeps it from falling back to the donor. | *(Bản dịch bước )* |
| `L19580` | `` | The electron goes to the first of two quinones bound in the reaction center, which can hold one electron at a time. From here the electron is far from the donor and cannot easily return. | *(Bản dịch bước )* |
| `L19588` | `` | The first quinone hands its electron to the second one. When this second quinone has collected two electrons and two positive charges from the stroma, it leaves its site as a fully reduced carrier. | *(Bản dịch bước )* |
| `L19595` | `` | The reduced quinone leaves the reaction center and joins a mobile pool of lipid-soluble carriers in the middle of the membrane, ready to deliver its two electrons to the next complex. | *(Bản dịch bước )* |
| `L19602` | `` | The mobile carrier is oxidized at the next complex: its electrons go to a small protein with a metal cluster, and two positively charged ions are released into the space inside the sac. This is where much of the gradient across the membrane is built. | *(Bản dịch bước )* |
| `L19609` | `` | The electron moves from that small metal-cluster protein to a heme protein of the same complex that faces the inside of the thylakoid sac. | *(Bản dịch bước )* |
| `L19616` | `` | The electron leaves the complex on a small copper protein that floats in the space inside the sac and carries one electron at a time toward the second reaction center. | *(Bản dịch bước )* |
| `L19623` | `` | The soluble carrier docks on the second reaction center and gives its electron to the pigment pair that lost one there, which makes the pair ready to absorb another quantum of radiant energy. | *(Bản dịch bước )* |
| `L19630` | `` | The second pigment pair absorbs a quantum of radiant energy and one electron jumps to an even higher energy level than in the first reaction center. This gives the highest reducing power of the whole chain. | *(Bản dịch bước )* |
| `L19637` | `` | The excited pair gives its electron to the first acceptor of the second reaction center, which is a pigment molecule, and a positive charge stays behind in the pair. | *(Bản dịch bước )* |
| `L19644` | `` | The electron moves to a quinone bound in the same reaction center, one more step away from the pigment pair. | *(Bản dịch bước )* |
| `L19652` | `` | The electron leaves the quinone and moves along a short wire of three small metal clusters at the stromal edge of the reaction center. | *(Bản dịch bước )* |
| `L19660` | `` | The last cluster hands the electron to a small soluble protein in the stroma, which carries one electron at a time away from the membrane. | *(Bản dịch bước )* |
| `L19667` | `` | A flavin enzyme in the stroma collects the electrons of two small soluble carriers and gives the pair to an oxidized nucleotide carrier together with a positive ion from the stroma. This makes the reduced carrier that the Calvin cycle needs. | *(Bản dịch bước )* |
| `L19702` | `` | Absorbed radiant energy lets a large complex in the membrane pull electrons from an abundant small molecule in the inner space and give them to a mobile lipid carrier, which also takes up positive ions from the other side. A gas is released and acid builds up inside. | *(Bản dịch bước )* |
| `L19709` | `` | The reduced mobile carrier is oxidized by a complex that sits between the two reaction centers. It gives its electrons to a small copper protein in the inner space and moves positive ions across the membrane into that space. | *(Bản dịch bước )* |
| `L19716` | `` | A second large complex absorbs radiant energy and lifts an electron from the copper protein of the inner space to a small iron-sulfur protein on the outer side of the membrane. | *(Bản dịch bước )* |
| `L19723` | `` | A flavin enzyme on the outer side takes the electrons of two of the small iron-sulfur carriers and gives them to an oxidized nucleotide carrier together with a positive ion. | *(Bản dịch bước )* |
| `L19730` | `` | Positive ions that built up inside the sac flow back out through a rotary complex, and the turning of its central stalk drives the head to join a nucleotide diphosphate to an inorganic ion from solution, which makes the energy currency. The same flow also works in the dark if a gradient is imposed. | *(Bản dịch bước )* |
| `L19764` | `` | Two linked protein assemblies in the thylakoid membrane use absorbed radiant energy to push electrons from the most abundant small molecule of the cell onto an oxidized nucleotide carrier, and a gas is released. | *(Bản dịch bước )* |
| `L19772` | `` | The flow of positively charged ions out of the thylakoid sac, down their gradient, drives the joining of a nucleotide diphosphate and an inorganic ion, which makes the energy currency. This needs the gradient but not the light itself. | *(Bản dịch bước )* |
| `L19779` | `` | In the stroma the reduced carrier and the energy currency are used up to fix a gas from the air into a six-carbon sugar, and the spent forms go back to the thylakoid membrane to be recharged. | *(Bản dịch bước )* |
| `L19816` | `` | The excited pigment pair of the second reaction center gives its electron to the chain of acceptors in the complex, and the electron ends up on a small soluble iron-sulfur protein in the stroma, the same one that feeds the reductase in the non-cyclic path. | *(Bản dịch bước )* |
| `L19823` | `` | Instead of reducing the nucleotide carrier, the soluble iron-sulfur protein hands its electron back to the mobile quinone pool in the membrane. The complex between the two reaction centers oxidizes the quinol again, pushes positive ions into the inner space and passes the electron to the copper protein of the lumen. | *(Bản dịch bước )* |
| `L19830` | `` | The copper protein docks on the second reaction center and gives the electron back to the pigment pair that lost it. A new quantum of radiant energy lifts that electron again, so the same electron can go round once more. Nothing is taken from water in this loop. | *(Bản dịch bước )* |
| `L19837` | `` | The positive ions pumped into the sac by the loop flow back out through the rotary complex, and its head joins a nucleotide diphosphate to an inorganic ion. This is all the loop makes: no reduced carrier and no gas. | *(Bản dịch bước )* |
| `L19895` | `` | A five-carbon sugar with a phosphate group at each end accepts a gas from the air, and the unstable six-carbon product splits at once into two identical three-carbon acids. This is the step where inorganic carbon enters the cycle. | *(Bản dịch bước )* |
| `L19903` | `hl` | A phosphate group is moved from the energy currency onto the carboxyl group of the acid, which makes a compound with a very high phosphate transfer potential. This is the reaction of glycolysis run in the opposite direction. | *(Bản dịch bước hl)* |
| `L19911` | `hl` | The activated carboxyl group is reduced to an aldehyde by the electrons of the reduced carrier of the chloroplast, and the group on that carbon is released as an inorganic ion. This is the reduction stage, with a different carrier than in glycolysis. | *(Bản dịch bước hl)* |
| `L19919` | `hl` | The aldehyde form of a three-carbon sugar phosphate is converted into its ketone form by moving the carbonyl, so that both forms are available in the right amounts for the next step. No carrier is needed. | *(Bản dịch bước hl)* |
| `L19927` | `hl` | A ketone and an aldehyde, each a three-carbon sugar with one phosphate, are joined by a new carbon-carbon bond into a six-carbon sugar with a phosphate at each end. Nothing else is consumed. | *(Bản dịch bước hl)* |
| `L19934` | `hl` | The group on carbon 1 is removed by hydrolysis as an inorganic ion, which makes the step one-way and leaves a six-carbon sugar that can be used in two different ways. | *(Bản dịch bước hl)* |
| `L19942` | `hl` | The ketose ring opens, the carbonyl moves from carbon 2 to carbon 1, and the sugar closes again as a six-membered ring. No carrier is involved and the step is freely reversible. | *(Bản dịch bước hl)* |
| `L19949` | `hl` | The group left on carbon 6 is removed by hydrolysis as an inorganic ion, which releases the free six-carbon sugar, the product of the net equation, although this sugar is rarely the final product of a plant. | *(Bản dịch bước hl)* |
| `L19957` | `hl` | An enzyme lifts a two-carbon unit off the top of a six-carbon ketose phosphate and puts it on the aldehyde of a three-carbon sugar. This leaves a four-carbon aldose and makes a five-carbon ketose. | *(Bản dịch bước hl)* |
| `L19964` | `hl` | A four-carbon aldose phosphate and a three-carbon ketose phosphate are joined by a new carbon-carbon bond, which makes a seven-carbon sugar with a phosphate at each end. | *(Bản dịch bước hl)* |
| `L19971` | `` | The group on carbon 1 of the seven-carbon sugar is removed by hydrolysis as an inorganic ion, and the step is irreversible. | *(Bản dịch bước )* |
| `L19979` | `hl` | The seven-carbon ketose phosphate gives its top two carbons to a three-carbon aldehyde, which leaves a five-carbon aldose and makes another five-carbon ketose. | *(Bản dịch bước hl)* |
| `L19986` | `hl` | The hydroxyl on carbon 3 is turned around, which changes one ketose phosphate into the isomer that can be phosphorylated at the end of the cycle. | *(Bản dịch bước hl)* |
| `L19994` | `hl` | The aldose phosphate is converted into its ketose isomer, the same kind of rearrangement as in the first half of glycolysis, and no carrier is needed. | *(Bản dịch bước hl)* |
| `L20001` | `hl` | The energy currency is spent to put a phosphate group on carbon 1 of the five-carbon ketose phosphate, which rebuilds the acceptor that started the cycle. This last step is irreversible. | *(Bản dịch bước hl)* |
| `L20056` | `` | Each of three five-carbon sugars with a phosphate group at each end accepts a gas from the air, and every six-carbon product splits at once into two three-carbon acids, so three carbons go in and six acids come out. | *(Bản dịch bước )* |
| `L20064` | `hl` | The six acids are first phosphorylated with the energy currency and then reduced by the electrons of the reduced carrier of the chloroplast; of the six three-carbon sugar phosphates this gives, one leaves the cycle to make sugar and the other five stay. | *(Bản dịch bước hl)* |
| `L20071` | `hl` | The five sugar phosphates that stayed are rearranged by a long series of shuffling reactions, with a little more of the energy currency, until three molecules of the five-carbon acceptor are rebuilt and the cycle can start again. | *(Bản dịch bước hl)* |
| `L20104` | `` | In the outer cell a gas from the air is added to a three-carbon enol, which makes a four-carbon acid, and an inorganic ion is released. The first stable product has four carbons, which names the pathway. | *(Bản dịch bước )* |
| `L20111` | `` | The ketone of the four-carbon acid is reduced to an alcohol by the reduced carrier of the chloroplast, which makes the form that can travel into the next cell. | *(Bản dịch bước )* |
| `L20118` | `` | In the inner cell the four-carbon acid is oxidized and loses a carbon as a gas, which leaves a three-carbon keto acid and reduces the oxidized carrier. The gas is released right next to the carbon-fixing enzyme. | *(Bản dịch bước )* |
| `L20125` | `` | The gas released in the inner cell is attached to a five-carbon sugar with two phosphate groups, and the six-carbon product splits into two three-carbon acids, so the carbon enters the Calvin cycle at its first step. | *(Bản dịch bước )* |
| `L20133` | `hl` | An enzyme in the outer cell rebuilds the three-carbon enol from the keto acid that came back from the inner cell. It spends the energy currency in an unusual way: the nucleotide loses two groups and keeps only one, and an inorganic ion is used up as well. | *(Bản dịch bước hl)* |
| `L20192` | `` | A messenger from outside the cell fits into the binding site of a seven-helix protein in the membrane, which has its partner protein waiting on the inside. No bond is made or broken. | *(Bản dịch bước )* |
| `L20199` | `` | The bound signal acts on the membrane protein, and the effect runs down its helices to the side that faces the cytoplasm, where the partner protein is held. Nothing is made or broken. | *(Bản dịch bước )* |
| `L20206` | `` | The receptor, now acting on the partner protein beside it, makes that protein let go of the nucleotide it carries, and a triphosphate nucleotide takes the place of the diphosphate. | *(Bản dịch bước )* |
| `L20213` | `` | The subunit that now carries the triphosphate lets go of its two partners and moves along the inner face of the membrane to switch on an enzyme there. | *(Bản dịch bước )* |
| `L20220` | `` | The subunit slowly splits the last group off its own nucleotide, so after a while the active form switches itself off. | *(Bản dịch bước )* |
| `L20227` | `` | The inactive subunit lets go of its target and goes back to the partners that stayed at the receptor, so the whole system is ready for the next signal. | *(Bản dịch bước )* |
| `L20255` | `` | A membrane enzyme that a G protein has switched on joins the first phosphate of the energy currency to the 3′ hydroxyl of its own sugar, which closes a ring and releases the other two phosphates as a pair. | *(Bản dịch bước )* |
| `L20262` | `` | Four molecules of the ring-shaped messenger bind the two regulatory parts of an inactive tetramer, so that its two catalytic parts are let go. The released parts are the active enzyme. | *(Bản dịch bước )* |
| `L20269` | `` | A free catalytic part of the kinase moves the end phosphate of the energy currency onto a serine or threonine hydroxyl of another protein, and the activity of that protein is changed. | *(Bản dịch bước )* |
| `L20276` | `` | A hydrolysis removes the added group from the modified protein and releases it as an inorganic ion, which gives back the unmodified protein and ends the effect of the kinase. | *(Bản dịch bước )* |
| `L20283` | `` | A hydrolysis opens the ring of the messenger at its 3′ bond, which leaves a nucleotide in a straight chain with no messenger activity, so the signal ends. | *(Bản dịch bước )* |
| `L20290` | `` | When the messenger has been removed and its level falls, the regulatory parts bind the catalytic parts again, so the enzyme becomes inactive again. | *(Bản dịch bước )* |
| `L20321` | `` | The stress hormone fits into its seven-helix receptor in the plasma membrane, and the receptor changes shape on its inner face so that it can act on the G protein beside it. | *(Bản dịch bước )* |
| `L20328` | `` | A protein beside the stimulated receptor trades the nucleotide it holds: the diphosphate leaves and a triphosphate binds, which switches part of that protein on and frees it from its partners. | *(Bản dịch bước )* |
| `L20335` | `` | An enzyme in the membrane that the active G protein subunit has switched on turns the energy currency into a ring-shaped second messenger and releases two phosphates as a pair. | *(Bản dịch bước )* |
| `L20342` | `` | Four molecules of the second messenger bind the regulatory parts of an inactive kinase, and the catalytic parts are released as the active enzyme. | *(Bản dịch bước )* |
| `L20349` | `` | The active kinase puts a phosphate group on the enzyme that builds glycogen and switches it off, so that no glycogen is made while the cell is breaking it down. | *(Bản dịch bước )* |
| `L20356` | `` | The same kinase also phosphorylates a second kinase and switches that one on, so that the signal passes down the cascade and is made larger at each step. | *(Bản dịch bước )* |
| `L20363` | `` | The second kinase puts a phosphate group on the enzyme that breaks down glycogen, which changes it from the form with little activity into the active form. | *(Bản dịch bước )* |
| `L20370` | `` | The active enzyme uses a small inorganic ion instead of water to split one glucose unit off the end of the polymer, so the unit leaves with that ion already attached. | *(Bản dịch bước )* |
| `L20407` | `` | A signal from another tissue binds a seven-helix receptor, which changes shape and makes the partner protein beside it swap the diphosphate on its alpha subunit for a triphosphate, so that the partner becomes active. | *(Bản dịch bước )* |
| `L20414` | `` | The active partner protein of the receptor binds an enzyme that lies against the inner face of the membrane and switches it on. | *(Bản dịch bước )* |
| `L20421` | `` | The active enzyme cuts a membrane phospholipid by hydrolysis, between its phosphate and its glycerol, so that a soluble head with several phosphate groups is set free and a nonpolar part stays in the membrane. | *(Bản dịch bước )* |
| `L20428` | `` | The messenger that left the membrane travels through the cytosol to a membrane inside the cell and binds a protein there, which lets something stored behind that membrane out into the cytosol. | *(Bản dịch bước )* |
| `L20435` | `` | A small protein of the cytosol that binds several of the released ions changes shape when they bind, and the complex it forms is the active signal. | *(Bản dịch bước )* |
| `L20442` | `` | A cytosolic kinase that the complex has switched on moves the end phosphate of the energy currency onto another enzyme, and the activity of that enzyme is changed. | *(Bản dịch bước )* |
| `L20449` | `` | The nonpolar half that stayed in the membrane binds a kinase of the membrane and switches it on. | *(Bản dịch bước )* |
| `L20456` | `` | The active membrane kinase puts phosphate groups on proteins of the plasma membrane that let an ion through, which changes how much of that ion crosses the membrane. | *(Bản dịch bước )* |
| `L20504` | `` | A messenger from outside the cell fits into the binding site on the outer part of a membrane protein that crosses the membrane once, whose inner part is a kinase that is still inactive. | *(Bản dịch bước )* |
| `L20511` | `` | Two of the membrane proteins that carry a ligand come together in the membrane, which brings their two inner kinase parts close to each other so that each can act on the other. | *(Bản dịch bước )* |
| `L20518` | `` | Each of the two active inner parts moves the end phosphate of the energy currency onto the ring hydroxyl of an amino acid in the tail of its partner, so that both tails carry phosphate groups. | *(Bản dịch bước )* |
| `L20525` | `` | Proteins of the cytosol that read the new phosphate marks on the tails bind there and gather side by side. | *(Bản dịch bước )* |
| `L20532` | `` | The proteins gathered on the tails pass the signal into the cell, usually by phosphorylating other proteins, and the cell responds. | *(Bản dịch bước )* |
| `L20567` | `` | A hormone that tells the cells the blood holds plenty of glucose fits into a membrane receptor that always sits in the membrane as a pair of chains. | *(Bản dịch bước )* |
| `L20574` | `` | The two inner kinase parts of the receptor move the end phosphate of the energy currency onto tyrosines of each other and of their tails, so the receptor is now an active tyrosine kinase. | *(Bản dịch bước )* |
| `L20581` | `` | A docking protein of the cytosol binds the phosphorylated receptor and is activated there; from it the message goes on along this pathway and also branches to other signaling pathways. | *(Bản dịch bước )* |
| `L20588` | `` | The active docking protein recruits a kinase that acts on membrane lipids to the plasma membrane and switches it on there. | *(Bản dịch bước )* |
| `L20595` | `` | The active lipid kinase moves the end phosphate of the energy currency onto the 3 position of the inositol ring of a phospholipid of the membrane, which gives a lipid with one more phosphate. | *(Bản dịch bước )* |
| `L20602` | `` | The new lipid with three phosphates collects a kinase of the cytosol at the plasma membrane, and the kinase becomes active there. | *(Bản dịch bước )* |
| `L20609` | `` | The active kinase at the membrane phosphorylates a second kinase that is also held there by the lipid, and that second kinase becomes active. | *(Bản dịch bước )* |
| `L20616` | `` | The signal that has travelled down the chain reaches its end: vesicles stored inside the cell are brought to its surface and join the membrane there. | *(Bản dịch bước )* |
| `L20623` | `` | A protein of the surface membrane opens a way through it for the sugar of the blood, which moves down its gradient to the other side. | *(Bản dịch bước )* |
| `L20630` | `` | Insulin signaling also switches on an enzyme that removes phosphate groups, which undoes the effect of the kinases of the stress hormone on the enzymes of glycogen. | *(Bản dịch bước )* |
| `L20678` | `` | A small signal from outside the cell fits into a membrane protein whose inner face holds a partner that switches an enzyme on, and the protein changes shape. Nothing is made or broken. | *(Bản dịch bước )* |
| `L20685` | `` | The activated receptor makes the partner protein beside it trade the nucleotide on one of its subunits: the diphosphate leaves and a triphosphate takes its place, which switches that subunit on. | *(Bản dịch bước )* |
| `L20692` | `` | The subunit that now carries the triphosphate binds an enzyme in the membrane and switches it on, and it stays active for as long as the triphosphate stays on it. | *(Bản dịch bước )* |
| `L20699` | `` | The switched-on enzyme joins one phosphate of the energy currency to the sugar of the same molecule, which closes a ring, and the other two phosphates leave as a pair. | *(Bản dịch bước )* |
| `L20706` | `` | A second kind of small signal fits into a different membrane protein, one whose inner face holds the partner that turns the same enzyme down, and the protein changes shape. | *(Bản dịch bước )* |
| `L20713` | `` | The activated receptor makes its partner protein trade the nucleotide on one subunit, the diphosphate out and a triphosphate in, and the protein comes apart into the subunit that carries the nucleotide and a pair of subunits that stay together. | *(Bản dịch bước )* |
| `L20720` | `` | The subunit that carries the triphosphate binds the same membrane enzyme that the first arm switched on, but its effect is the opposite: the enzyme then makes less of its product. | *(Bản dịch bước )* |
| `L20727` | `` | The pair of subunits freed in the inhibitory arm travels to the stimulatory protein and blocks it, so the stimulatory arm passes on its signal less well. | *(Bản dịch bước )* |
| `L20757` | `` | A kinase that acts on activated receptors puts the end phosphate of the energy currency on the tail that sticks into the cytoplasm, which marks the membrane protein for the next protein. | *(Bản dịch bước )* |
| `L20764` | `` | A protein of the cytosol binds the tail that now carries the phosphate group, so the receptor can no longer pass the signal to its partner, and the complex is later taken into the cell. | *(Bản dịch bước )* |
| `L20771` | `` | The active subunit slowly splits the last group off its own nucleotide, so after a while it switches itself off, with no help from outside. | *(Bản dịch bước )* |
| `L20778` | `` | The inactive subunit lets go of the enzyme it was holding, which stops making its product, and goes back to the pair of subunits that waited at the receptor: the system is at rest again. | *(Bản dịch bước )* |
| `L20785` | `` | An enzyme opens the ring of the messenger by hydrolysis at one of its two phosphate bonds, which leaves a straight-chain nucleotide with no signaling activity, so the level of the messenger falls. | *(Bản dịch bước )* |
| `L20792` | `` | When the level of the messenger has fallen, the regulatory parts bind the catalytic parts again, so the kinase is inactive and stops phosphorylating its targets. | *(Bản dịch bước )* |
| `L20825` | `` | A peptide hormone that signals low blood glucose fits the binding site of a seven-helix protein in the membrane of a liver cell, and the protein changes shape on its inner face. | *(Bản dịch bước )* |
| `L20832` | `` | A protein beside the stimulated receptor trades the nucleotide it holds: the diphosphate leaves and a triphosphate binds, which frees part of that protein from its partners and switches it on. | *(Bản dịch bước )* |
| `L20839` | `` | An enzyme in the membrane that the active subunit has switched on turns the energy currency into a ring-shaped second messenger and releases two phosphates as a pair. | *(Bản dịch bước )* |
| `L20846` | `` | Four molecules of the second messenger bind the regulatory parts of an inactive kinase, and the catalytic parts are released as the active enzyme. | *(Bản dịch bước )* |
| `L20853` | `` | The active kinase puts a phosphate group on the enzyme that makes a regulatory sugar bisphosphate, and that enzyme becomes less active. | *(Bản dịch bước )* |
| `L20860` | `` | The same kinase puts a phosphate group on a second enzyme, the one that breaks that regulatory sugar bisphosphate down, and this one becomes more active. | *(Bản dịch bước )* |
| `L20867` | `` | With one enzyme making less of the regulatory sugar bisphosphate and the other breaking down more of it, its level in the cell falls. | *(Bản dịch bước )* |
| `L20874` | `` | Without its allosteric activator, the main control enzyme of the sugar-burning pathway runs slower, so the cell burns less glucose. | *(Bản dịch bước )* |
| `L20881` | `` | With less of the regulator around, the enzyme that bypasses the committed step of the sugar-burning pathway is released from its brake, so the cell makes more glucose. | *(Bản dịch bước )* |
| `L20922` | `` | A small growth signal from outside the cell fits the outer part of membrane proteins, and two of them come together in the membrane so that the kinase parts on their inner sides lie close to each other. | *(Bản dịch bước )* |
| `L20929` | `` | Each of the two active inner parts moves the end phosphate of the energy currency onto the ring hydroxyl of an amino acid in the tail of its partner, so both tails carry phosphate groups. | *(Bản dịch bước )* |
| `L20936` | `` | An adaptor of the cytosol reads the new phosphate marks on the receptor tail and binds there, bringing a partner protein with it, so that a small complex assembles on the tail. | *(Bản dịch bước )* |
| `L20943` | `` | A protein of the assembled complex makes a small G protein beside it let go of its diphosphate nucleotide and take up a triphosphate one, which switches that protein on. | *(Bản dịch bước )* |
| `L20950` | `` | The active protein of the switch binds a kinase of the cytosol and switches it on, which passes the growth signal to the next kinase of the chain. | *(Bản dịch bước )* |
| `L20957` | `` | The first kinase of the chain puts a phosphate group on the second one and switches it on, so the signal moves one level down. | *(Bản dịch bước )* |
| `L20964` | `` | The second kinase puts a phosphate group on the third one, which switches it on; each kinase of the chain can activate many molecules of the next, so the signal grows. | *(Bản dịch bước )* |
| `L20971` | `` | The third kinase of the chain puts a phosphate group on a kinase one level further down and switches it on. | *(Bản dịch bước )* |
| `L20978` | `` | The same kinase puts a phosphate group on a second kinase at that level, a different one, and switches that one on as well. | *(Bản dịch bước )* |
| `L20985` | `` | The same kinase also puts a phosphate group directly on a protein that controls the reading of genes, which switches that protein on. | *(Bản dịch bước )* |
| `L20992` | `` | One of the two kinases at that level passes the signal on by putting a phosphate group on a protein that controls the reading of genes. | *(Bản dịch bước )* |
| `L20999` | `` | The other kinase at that level passes the signal on by putting a phosphate group on a protein of the ribosome. | *(Bản dịch bước )* |
| `L21006` | `` | Once they carry phosphate groups, the proteins that control the reading of genes switch on the copying of their target genes in the nucleus. | *(Bản dịch bước )* |
| `L21038` | `` | The small protein lets go of the diphosphate nucleotide it holds and a triphosphate nucleotide takes its place, which switches it from its resting form to its active form. | *(Bản dịch bước )* |
| `L21045` | `` | The active switch slowly splits the last group off its own nucleotide, so after a while it turns itself off. | *(Bản dịch bước )* |
| `L21052` | `` | The active switch passes its message on to the machinery that makes two cells from one. | *(Bản dịch bước )* |
| `L21059` | `` | A change of one amino acid at one of three positions near the nucleotide site makes the protein far too slow at splitting the phosphate off its nucleotide, so the switch stays on and keeps sending its signal. | *(Bản dịch bước )* |
| `L21088` | `` | The nonpolar hormone dissolves in the lipid bilayer and passes through it, so it needs no carrier and no receptor on the outside of the cell. | *(Bản dịch bước )* |
| `L21095` | `` | The hormone fits the ligand-binding site of a protein inside the cell that a helper protein holds at rest. | *(Bản dịch bước )* |
| `L21102` | `` | The change of shape that the hormone causes makes the helper protein let go, so the receptor is free to move and to bind DNA. | *(Bản dịch bước )* |
| `L21109` | `` | Two hormone-bound proteins join side by side, which gives the pair that will read the DNA site. | *(Bản dịch bước )* |
| `L21116` | `` | The pair travels through a channel in the double membrane around the DNA to the compartment where the target genes are. | *(Bản dịch bước )* |
| `L21123` | `` | The pair binds a short DNA sequence next to its target gene and gathers helper proteins beside it. | *(Bản dịch bước )* |
| `L21130` | `` | The enzyme at the assembled complex copies the gene into a single-stranded message, one nucleotide at a time. | *(Bản dịch bước )* |
| `L21137` | `` | The finished message leaves the compartment of the DNA through the same kind of channel in the double membrane and reaches the cytoplasm. | *(Bản dịch bước )* |
| `L21144` | `` | A large particle of the cytoplasm reads the message three nucleotides at a time and joins amino acids into a chain, which changes how the cell works. | *(Bản dịch bước )* |
| `L21197` | `` | In the working muscle the six-carbon sugar is split into two three-carbon keto acids by a long pathway of the cytosol. | *(Bản dịch bước )* |
| `L21204` | `` | The ketone of the three-carbon acid is reduced to an alcohol by the reduced carrier of glycolysis, which makes the hydroxy acid that can leave the cell and gives back the oxidized carrier that glycolysis needs. | *(Bản dịch bước )* |
| `L21212` | `hl` | The hydroxy acid leaves the muscle cell and is carried to another organ by the fluid that flows through all the tissues. Nothing is made or broken on the way. | *(Bản dịch bước hl)* |
| `L21219` | `hl` | In the liver the alcohol of the hydroxy acid is oxidized back to a ketone, and an oxidized carrier takes the electrons. It is the reverse of what the muscle did. | *(Bản dịch bước hl)* |
| `L21227` | `hl` | The liver builds the six-carbon sugar from two three-carbon keto acids by a long pathway that spends energy. Many of its steps are the reverse of those the muscle used, and a few are bypasses. | *(Bản dịch bước hl)* |
| `L21234` | `hl` | The sugar leaves the liver cell and is carried back through the body to the working tissue, where it can be broken down again. Nothing is made or broken on the way. | *(Bản dịch bước hl)* |
| `L21273` | `` | Enzymes that cut peptide bonds split the large polymers of the tissue into their building blocks, which are released into the cell. | *(Bản dịch bước )* |
| `L21280` | `` | The nitrogen-bearing group is taken off the carbon skeleton and leaves as a small positive ion, while the carbon skeleton is kept for energy. | *(Bản dịch bước )* |
| `L21287` | `` | The free nitrogen ion is attached to a five-carbon keto acid of the TCA cycle by a reductive reaction with the electrons of a reduced carrier. This makes the amino acid that collects the amino groups of the tissue. | *(Bản dịch bước )* |
| `L21294` | `` | A coenzyme derived from vitamin B6 passes an amino group from the amino acid that collects them to the three-carbon keto acid of glycolysis. A three-carbon amino acid and a five-carbon keto acid result, and nothing is oxidized or reduced. | *(Bản dịch bước )* |
| `L21301` | `` | The amino acid made in the muscle is carried to another organ by the fluid that flows through all the tissues. This is how the amino groups of the muscle reach the organ that makes urea. | *(Bản dịch bước )* |
| `L21308` | `` | In the liver the same transamination runs the other way: the three-carbon amino acid gives its amino group to the five-carbon keto acid, and the three-carbon keto acid of glycolysis is made again. | *(Bản dịch bước )* |
| `L21315` | `` | The three-carbon keto acid is built up into the six-carbon sugar by a long pathway that spends energy and runs in the liver. | *(Bản dịch bước )* |
| `L21322` | `` | The sugar leaves the liver and is carried through the body to the muscle, where it can be broken down again for energy. | *(Bản dịch bước )* |
| `L21329` | `` | In the muscle the sugar is split into two three-carbon keto acids by a long pathway of the cytosol. One of them picks up an amino group again, which closes the cycle. | *(Bản dịch bước )* |
| `L21336` | `` | The amino acid that collects the amino groups is oxidized in the liver: its amino group leaves as a free ion, an oxidized carrier takes the electrons, and a five-carbon keto acid is left. | *(Bản dịch bước )* |
| `L21343` | `` | The free nitrogen ion is made into the neutral compound that the body excretes, by a cycle of the liver that starts in the mitochondrion and ends in the cytosol. | *(Bản dịch bước )* |
| `L21386` | `` | The aldehyde group of the coenzyme reacts with the amino group of an active-site lysine, and a C=N bond is made with the loss of a small molecule. The coenzyme is now held in the active site. | *(Bản dịch bước )* |
| `L21394` | `hl` | The substrate attacks the C=N bond: its own amino group takes the place of the lysine\ | *(Bản dịch bước hl)* |
| `L21401` | `hl` | A proton is taken from the carbon next to the carboxylate of the bound substrate, and the electrons flow into the ring of the coenzyme, which acts as an electron sink. The result is a flat, strongly conjugated species. | *(Bản dịch bước hl)* |
| `L21408` | `` | A proton is added at the carbon of the coenzyme that was its aldehyde carbon. This moves the C=N bond to the old α-carbon of the substrate, whose carbon skeleton is now a keto acid still bound to the coenzyme. | *(Bản dịch bước )* |
| `L21415` | `` | A hydrolysis splits the C=N bond at the old α-carbon. The carbon skeleton leaves as a keto acid, and the coenzyme keeps the amino group in the form of CH₂-NH₃⁺. | *(Bản dịch bước )* |
| `L21423` | `hl` | A second keto acid, the five-carbon one of the TCA cycle, takes the amino group back from the coenzyme by the same steps run in reverse. This makes the amino acid that collects amino groups and restores the link between the coenzyme and the lysine, so the enzyme is ready again. | *(Bản dịch bước hl)* |
| `L21481` | `` | The ring-form sugar phosphate is oxidized at carbon 1, the carbon of its hemiacetal, by the oxidized carrier of biosynthetic reactions. An internal ester forms and the carrier is reduced. This is the first step of the pathway. | *(Bản dịch bước )* |
| `L21489` | `hl` | The ring of the internal ester is opened by a hydrolysis, which gives an open-chain sugar acid with the phosphate at its far end. | *(Bản dịch bước hl)* |
| `L21497` | `hl` | The open-chain acid is oxidized at carbon 3 by the same oxidized carrier as in the first step, and its carboxyl carbon leaves as a gas. A five-carbon ketose phosphate is left. | *(Bản dịch bước hl)* |
| `L21505` | `hl` | A ketose phosphate is isomerized to the aldose phosphate on which nucleotides are built: the carbonyl moves from carbon 2 to carbon 1 through an enediol. | *(Bản dịch bước hl)* |
| `L21513` | `hl` | The same ketose phosphate is epimerized at carbon 3, which turns that carbon around and gives the other five-carbon ketose phosphate. The product is used together with ribose 5-phosphate in the next step. | *(Bản dịch bước hl)* |
| `L21520` | `hl` | A two-carbon unit is moved from a ketose phosphate to an aldose phosphate, so the two five-carbon sugars give a seven-carbon ketose phosphate and a three-carbon aldehyde phosphate. | *(Bản dịch bước hl)* |
| `L21527` | `` | A three-carbon unit is moved from the seven-carbon ketose phosphate to the three-carbon aldehyde phosphate, which gives a four-carbon aldose phosphate and a six-carbon ketose phosphate. | *(Bản dịch bước )* |
| `L21534` | `` | A two-carbon unit is moved again, now from the five-carbon ketose phosphate to the four-carbon aldose phosphate, which gives a six-carbon ketose phosphate and a three-carbon aldehyde phosphate. | *(Bản dịch bước )* |
| `L21541` | `` | The ring-form sugar phosphate takes the end pair of phosphates of the energy currency on its carbon 1, so that the donor loses two phosphates in one piece and not one. This makes the activated sugar that nucleotide synthesis uses. | *(Bản dịch bước )* |
| `L21589` | `` | The amide nitrogen of an amino acid takes the place of the activating group on carbon 1 of the sugar, which is released as a pair of phosphates, and the sugar changes from the α to the β form. This is the committed step of the pathway, and the final products of the pathway switch it off. | *(Bản dịch bước )* |
| `L21597` | `hl` | The carboxyl group of an amino acid is activated by the energy currency and then joined to the amine on the sugar by an amide bond. The amino acid now stands on the sugar and will give the backbone of the ring. | *(Bản dịch bước hl)* |
| `L21605` | `hl` | A one-carbon unit at the oxidation level of formic acid is moved from a folate coenzyme onto the free amino group of the amino acid unit. The new carbon will become C8 of the ring. | *(Bản dịch bước hl)* |
| `L21613` | `hl` | The oxygen of an amide is activated by the energy currency and replaced by an imine nitrogen taken from the amide of an amino acid, so the amide becomes an amidine. This nitrogen will become N3 of the ring. | *(Bản dịch bước hl)* |
| `L21621` | `hl` | The energy currency activates the oxygen of the formyl group, which then leaves as the nitrogen at the other end of the chain attacks the formyl carbon, so a five-membered ring closes: the first ring of the purine. | *(Bản dịch bước hl)* |
| `L21629` | `hl` | A one-carbon unit at the highest oxidation level of carbon is added to carbon 4 of the new ring as a carboxylate. This carbon will become C6 of the purine. | *(Bản dịch bước hl)* |
| `L21637` | `hl` | The carboxylate on the ring is activated by the energy currency and joined to the amino group of a dicarboxylic amino acid by an amide bond. The nitrogen of that amino acid will become N1 of the ring. | *(Bản dịch bước hl)* |
| `L21645` | `hl` | The carbon skeleton of the amino acid is cut off as a four-carbon dicarboxylic acid with a double bond, which can enter the TCA cycle, and only its nitrogen stays behind as an amide. | *(Bản dịch bước hl)* |
| `L21653` | `hl` | A second one-carbon unit is moved from the folate coenzyme onto the amino group on the ring. This carbon will become C2 of the purine. | *(Bản dịch bước hl)* |
| `L21661` | `hl` | The formyl carbon is attacked by the amide nitrogen and a small molecule is lost, which closes the six-membered ring and completes the purine. | *(Bản dịch bước hl)* |
| `L21702` | `` | An inorganic carbon is activated by one energy currency molecule, the amide nitrogen of an amino acid attacks it, and a second energy currency molecule phosphorylates the result. This cytosolic enzyme is not the one of the urea cycle, which takes free ammonium. | *(Bản dịch bước )* |
| `L21710` | `hl` | The carbamoyl group is handed from its activated carrier to the amino group of a dicarboxylic amino acid, which forms a ureido group and releases a small inorganic oxyanion. The amino acid will give the backbone of the ring. | *(Bản dịch bước hl)* |
| `L21717` | `hl` | The free amino group of the ureido unit attacks the carboxyl carbon in the side chain, and a small molecule is lost, so the six-membered ring closes. The ring is still saturated. | *(Bản dịch bước hl)* |
| `L21725` | `hl` | The saturated ring is oxidized and gets its double bond: this makes the first true pyrimidine of the pathway. The electrons go to a lipid-soluble carrier that is also part of the respiratory chain. | *(Bản dịch bước hl)* |
| `L21733` | `hl` | The activated sugar gives its ribose phosphate to a ring nitrogen of the base and releases its pair of phosphates, so a base and a sugar are joined for the first time in the pathway. | *(Bản dịch bước hl)* |
| `L21740` | `hl` | The carboxylate on the ring is removed as a gas, which leaves the first pyrimidine nucleotide, the parent of the other pyrimidine nucleotides. | *(Bản dịch bước hl)* |
| `L21779` | `` | The oxo group at carbon 6 of the first complete purine is activated by the guanine-containing energy currency, not the adenine one, and the amino group of a dicarboxylic amino acid takes its place. The whole amino acid stays attached for now. | *(Bản dịch bước )* |
| `L21787` | `hl` | The lyase that already acted once in the building of the ring cuts the carbon skeleton off again as a four-carbon acid with a double bond, and only the nitrogen stays behind on the ring. The base is adenine from here on. | *(Bản dịch bước hl)* |
| `L21795` | `hl` | The other branch oxidizes carbon 2 of the same ring, so the base ends up with two oxo groups instead of one. The oxidized carrier of catabolism takes the electrons, and the final product of this branch inhibits the step. | *(Bản dịch bước hl)* |
| `L21803` | `hl` | The new oxo group at carbon 2 is replaced by a nitrogen taken from the amide of an amino acid, which completes the second purine base. The energy currency loses two phosphates in one piece in this step, so it is left as a monophosphate. | *(Bản dịch bước hl)* |
| `L21845` | `` | A kinase moves the end phosphate of the energy currency onto the first pyrimidine nucleotide, which now carries two. This is the level at which the route to the deoxy sugars branches off, because the reductase that removes the 2′ hydroxyl works here. | *(Bản dịch bước )* |
| `L21853` | `hl` | A second kinase, the one that serves every nucleoside diphosphate of the cell, adds a third phosphate. The nucleotide can now be built into RNA, and in liver and muscle it also activates sugars for glycogen. | *(Bản dịch bước hl)* |
| `L21861` | `hl` | The oxo group at carbon 4 of the ring is activated, at an energy cost, and then replaced by a nitrogen from the amide of an amino acid, which turns one pyrimidine base into the other. It happens at the triphosphate level, not at the monophosphate. | *(Bản dịch bước hl)* |
| `L21869` | `hl` | The one-carbon unit bridging two ring nitrogens of the coenzyme is moved onto carbon 5 of the base, and the coenzyme gives the two hydrogens that turn that carbon into a methyl group as well. This leaves the coenzyme oxidized, which no other reaction of the cell does. | *(Bản dịch bước hl)* |
| `L21877` | `hl` | The oxidized coenzyme of the step before is reduced again by the reduced carrier of biosynthesis. Without this step the pool of one-carbon carriers would be used up after a single round and no more thymine nucleotide could be made. | *(Bản dịch bước hl)* |

## 6. Ghi Chú Kiến Thức Thực Thể Sinh Học (`MG.entities.*.note`)

Gồm ~430 đoạn văn mô tả sinh học chuyên sâu của từng enzyme, phân tử và đồng yếu tố trong cơ sở dữ liệu cốt lõi và các gói mở rộng.

| Dòng code | Loại | Mã thực thể | Ghi chú Tiếng Anh gốc (`note`) |
| :--- | :--- | :--- | :--- |
| `L6501` | `molecule` | `glucose` | The six-carbon sugar that enters glycolysis. Drawn here as the ring (pyranose) form that dominates in solution. |
| `L6506` | `molecule` | `g6p` | Glucose with a phosphate on carbon 6. The charge keeps it trapped inside the cell. It is also the entry point to the pentose phosphate pathway, and a branch point toward glycogen through glucose 1-phosphate. |
| `L6511` | `molecule` | `f6p` | A ketose. Phosphoglucose isomerase opens the six-membered ring of glucose 6-phosphate, moves the carbonyl from carbon 1 to carbon 2 through an enediol, and closes a five-membered furanose ring. |
| `L6516` | `molecule` | `f16bp` | Two phosphates, one on each end of the six-carbon chain. Splitting it in the next step gives two three-carbon pieces. |
| `L6521` | `molecule` | `dhap` | A ketose. It cannot be used directly by the payoff phase, so triose phosphate isomerase converts it to glyceraldehyde 3-phosphate. |
| `L6526` | `molecule` | `g3p` | An aldehyde. Each glucose gives two of these, so everything after this point happens twice per glucose. |
| `L6531` | `molecule` | `bpg13` | Contains an acyl phosphate, a high-energy bond whose transfer energy exceeds that of ATP. That is what lets the next step make ATP. |
| `L6536` | `molecule` | `pg3` | A carboxylate with a phosphate on carbon 3. It is the product of the first ATP-generating step. |
| `L6541` | `molecule` | `pg2` | The phosphate has moved to carbon 2, setting up the dehydration that creates the enol phosphate. |
| `L6546` | `molecule` | `pep` | Holds the highest phosphoryl transfer potential of any glycolytic intermediate, because the enol form of pyruvate it locks in is unstable. |
| `L6551` | `molecule` | `pyruvate` | The end product of glycolysis. With oxygen it is carried into the mitochondrion and becomes acetyl-CoA; without oxygen it is fermented, for example to lactate. |
| `L6556` | `molecule` | `acetylcoa` | A two-carbon acetyl group on a thioester (the carrier part is drawn as a label). The fuel the TCA cycle burns. |
| `L6561` | `molecule` | `citrate` | Six carbons: the acetyl group has been added to oxaloacetate. A tertiary alcohol, so it cannot be oxidized until aconitase moves the hydroxyl. |
| `L6566` | `molecule` | `isocitrate` | The hydroxyl now sits on a secondary carbon, which can be oxidized by isocitrate dehydrogenase. |
| `L6571` | `molecule` | `akg` | Five carbons. It is also the carbon skeleton of glutamate, linking the cycle to amino acid metabolism. |
| `L6576` | `molecule` | `succoa` | Four carbons on a thioester with coenzyme A. The thioester is the energy source for the next step. |
| `L6581` | `molecule` | `succinate` | A symmetric four-carbon dicarboxylate with no functional groups beyond the two carboxylates. |
| `L6586` | `molecule` | `fumarate` | The trans alkene produced by succinate dehydrogenase. Its cis isomer is maleate, which the cycle does not use. |
| `L6591` | `molecule` | `malate` | L-Malate, made by adding water across the double bond of fumarate. The last hydroxyl to be oxidized in the cycle. |
| `L6596` | `molecule` | `oaa` | The four-carbon acceptor. Each turn of the cycle regenerates it, which is why the pathway is a cycle. |
| `L6601` | `molecule` | `ammonium` | The toxic nitrogen waste of amino acid breakdown. At cell pH almost all of it is in the protonated form, which is how it is drawn; the liver turns it into urea before it can build up in the blood. |
| `L6606` | `molecule` | `carbamoylp` | An activated carbamoyl group (H₂N-CO-) held on a phosphate by an acyl phosphate bond, which gives it a high group transfer potential. It is made in the mitochondrial matrix and hands its carbamoyl group on. |
| `L6611` | `molecule` | `ornithine` | An amino acid that is not found in proteins and is recycled each turn, so a small pool keeps the cycle running. It is arginine without its guanidino group, which leaves as urea in the last step. |
| `L6616` | `molecule` | `citrulline` | Ornithine with a carbamoyl group on its side-chain nitrogen, which makes a ureido group. It is also a by-product of nitric oxide synthesis and, like ornithine, is not found in proteins. |
| `L6621` | `molecule` | `argsucc` | Citrulline joined to aspartate by a new C-N bond. It keeps the guanidino group of arginine and the whole carbon skeleton of aspartate. |
| `L6626` | `molecule` | `arginine` | The amino acid with the guanidino group on its side chain. The liver makes it in the urea cycle, but it is also taken in with protein and used for nitric oxide, creatine and proteins. |
| `L6631` | `molecule` | `urea` | A small, neutral, very soluble molecule with two nitrogens, one from ammonium and one from aspartate, and one carbon from bicarbonate. It leaves the liver in the blood and the kidneys excrete it in urine. |
| `L6633` | `molecule` | `urea` | Tạo thành từ quá trình phân giải glycogen. Chưa phải là glycolytic intermediate cho đến khi được đồng phân hóa thành glucose 6-phosphate. |
| `L6634` | `molecule` | `g1p` | Sản phẩm của pentose phosphate pathway, được dùng để tổng hợp nucleotides. |
| `L6635` | `molecule` | `r5p` | Tạo thành từ DHAP trong quá trình tổng hợp lipid và glycerol phosphate shuttle. Rất dễ nhầm lẫn với glyceraldehyde 3-phosphate. |
| `L6636` | `molecule` | `glycerol3p` | L-Lactate, sản phẩm cuối của anaerobic glycolysis trong cơ đang hoạt động và hồng cầu. Gan có thể chuyển nó ngược lại thành pyruvate và glucose (Cori cycle). |
| `L6637` | `molecule` | `lactate` | Tạo thành từ pyruvate qua transamination. Cơ gửi nó tới gan, nơi nó trả lại pyruvate cho gluconeogenesis (glucose-alanine cycle). |
| `L6638` | `molecule` | `alanine` | Một chất trung gian của alcoholic fermentation. |
| `L6639` | `molecule` | `acetaldehyde` | Sản phẩm cuối của alcoholic fermentation ở nấm men. |
| `L6640` | `molecule` | `ethanol` | Trở thành alpha-ketoglutarate khi nhóm amino bị tách ra. Đây là điểm tập trung các nhóm amino: các transaminases chuyển chúng tới alpha-ketoglutarate, và glutamine synthetase gắn thêm nguyên tử nitơ thứ hai để tạo glutamine. |
| `L6641` | `molecule` | `glutamate` | Trở thành oxaloacetate khi nhóm amino bị tách ra. |
| `L6642` | `molecule` | `aspartate` | Một dicarboxylate ba carbon. Chất ức chế cạnh tranh (competitive inhibitor) kinh điển của succinate dehydrogenase. |
| `L6643` | `molecule` | `malonate` | Một chất trung gian của glyoxylate cycle ở thực vật và vi khuẩn. |
| `L6644` | `molecule` | `glyoxylate` | Chất vận chuyển ammonia an toàn trong máu: mang một amide nitrogen mà gan và thận sẽ giải phóng lại nhờ glutaminase. |
| `L6645` | `molecule` | `glutamine` | Một amino acid kiềm có mạch bên bốn carbon kết thúc bằng một nhóm amino; trông giống ornithine nhưng nhiều hơn một carbon. |
| `L6646` | `molecule` | `lysine` | Một amino acid có cấu trúc vòng có thể được tổng hợp từ ornithine (và từ glutamate). |
| `L6647` | `molecule` | `proline` | Chất hoạt hóa dị lập thể (allosteric activator) của carbamoyl phosphate synthetase I, tạo thành từ glutamate và acetyl-CoA và được bật lên bởi arginine. |
| `L6648` | `molecule` | `nacglu` | Sản phẩm của aspartate transcarbamoylase trong quá trình tổng hợp pyrimidine: cùng cơ chế hóa học gắn nhóm carbamoyl như urea cycle, nhưng thực hiện trên aspartate thay vì ornithine. |
| `L6652` | `molecule` | `etcnadh` | The reduced electron carrier made by glycolysis, the link reaction and the TCA cycle. It hands its two electrons to Complex I. It is drawn as its reduced nicotinamide ring; the R stands for the ADP-ribose part. |
| `L6657` | `molecule` | `etcfadh2` | The reduced flavin made by succinate dehydrogenase. Its electrons enter the chain at Complex II, below Complex I, so each FADH\u2082 yields less ATP than an NADH (about 1.5 against 2.5). It is drawn as its reduced flavin ring; the R stands for the ribityl-ADP part. |
| `L6662` | `molecule` | `ubiquinol` | The reduced form of coenzyme Q (head group drawn, the long isoprenoid tail is the R). A lipid-soluble carrier that diffuses in the inner membrane, collects electrons from Complexes I and II and delivers them to Complex III. |
| `L6667` | `molecule` | `cytcred` | A small heme protein that shuttles one electron at a time through the intermembrane space from Complex III to Complex IV. Its iron cycles between Fe\u00b2\u207a (reduced) and Fe\u00b3\u207a (oxidized). It is drawn as its heme group (an iron in a porphyrin ring); the rest of the molecule is protein. |
| `L6672` | `molecule` | `etcwater` | The end product of the chain: oxygen, the final electron acceptor, is reduced to water. |
| `L6677` | `molecule` | `etcadp` | The substrate of ATP synthase, together with inorganic phosphate. A high ADP level tells the cell that energy is needed and speeds the chain up (respiratory control). It is drawn as adenine on a ribose, with the diphosphate on carbon 5. |
| `L6682` | `molecule` | `etcatp` | The product of ATP synthase, made as protons flow back into the matrix. About 2.5 ATP are made per NADH and about 1.5 per FADH\u2082. It is drawn as adenine on a ribose, with the triphosphate on carbon 5. |
| `L6687` | `molecule` | `ubiquinone` | The oxidized form of coenzyme Q, the electron acceptor at Complexes I and II. |
| `L6692` | `molecule` | `cytcoxm` | Cytochrome c with its iron as Fe\u00b3\u207a, ready to accept an electron from Complex III. It is drawn as its heme group (an iron in a porphyrin ring); the rest of the molecule is protein. |
| `L6697` | `molecule` | `etcnad` | The oxidized form, regenerated at Complex I. It is drawn as its oxidized nicotinamide ring; the R stands for the ADP-ribose part. |
| `L6702` | `molecule` | `etcfad` | The oxidized flavin, regenerated at Complex II. It is drawn as its oxidized flavin ring; the R stands for the ribityl-ADP part. |
| `L6707` | `molecule` | `etco2` | The final electron acceptor of aerobic respiration. |
| `L6712` | `molecule` | `fmn` | Flavin mononucleotide, a derivative of riboflavin (vitamin B2) bound in Complex I. It is the first acceptor: it takes two electrons and two H\u207a from NADH and passes the electrons, one at a time, to iron-sulfur centers. It is drawn as FMNH\u2082, the form that has taken the electrons; the R stands for the ribityl phosphate. |
| `L6717` | `molecule` | `fes` | A metal cluster held to the protein by cysteines, not by heme, in a [2Fe-2S] or [4Fe-4S] form. Its iron is linked to inorganic sulfur. Each center accepts or donates only one electron at a time. Several of them carry the electrons of Complex I from the flavin to ubiquinone. It is drawn here as a [2Fe-2S] center, each iron held by two cysteines. |
| `L6722` | `molecule` | `cytb` | A heme protein of Complex III that receives electrons from ubiquinol. Its heme iron cycles between Fe\\u00b3\\u207a and Fe\\u00b2\\u207a. Antimycin A binds beside the b hemes and blocks the complex. |
| `L6727` | `molecule` | `cytc1` | The last heme protein of Complex III. It sits on the intermembrane side and hands its electron to the mobile carrier cytochrome c. The straight-line order used here is the textbook simplification: in the quinone cycle the iron-sulfur (Rieske) protein of the complex takes one electron from ubiquinol and gives it to this heme, while the two b hemes carry the other electron back to ubiquinone. |
| `L6732` | `molecule` | `cyta` | A heme a center of Complex IV (cytochrome c oxidase). It receives electrons from cytochrome c by way of the pair of copper atoms called CuA and passes them to cytochrome a\\u2083. |
| `L6737` | `molecule` | `cyta3` | The second heme of the last pumping complex of the chain. It belongs to Complex IV (cytochrome c oxidase), and with the copper CuB it forms the binuclear center where oxygen binds and is reduced to water; four electrons are needed for each O\\u2082. |
| `L6742` | `molecule` | `udpg` | Glucose activated by a uridine diphosphate group. It is the glucose donor for glycogen synthase. |
| `L6747` | `molecule` | `glycogen` | A branched polymer of glucose (alpha-1,4 chains with alpha-1,6 branches), stored in liver and muscle. |
| `L6752` | `molecule` | `tag` | The storage form of fat: glycerol esterified to three fatty acids. It is drawn as glycerol with three fatty acid esters; each R is a fatty acid chain. |
| `L6757` | `molecule` | `fattyacid` | A long hydrocarbon chain with a carboxyl group (drawn with R for the rest of the chain). Released from fat by lipases. |
| `L6762` | `molecule` | `acylcoa` | A fatty acid joined to coenzyme A by a thioester. It is the substrate of each round of beta-oxidation; every round returns an acyl-CoA two carbons shorter. |
| `L6767` | `molecule` | `enoylcoa` | The acyl-CoA with a trans double bond between the alpha and beta carbons, made by acyl-CoA dehydrogenase. |
| `L6772` | `molecule` | `hydroxyacylcoa` | Water has been added across the double bond, putting a hydroxyl group (L configuration) on the beta carbon. |
| `L6777` | `molecule` | `ketoacylcoa` | The beta-hydroxyl group has been oxidized to a ketone. The bond between the alpha and beta carbons is now ready to be cleaved by thiolase. |
| `L6782` | `molecule` | `glycerol` | The three-carbon backbone of triacylglycerol. In the liver it enters glycolysis (through glycerol 3-phosphate and DHAP) or gluconeogenesis. |
| `L6787` | `molecule` | `mtfused` | Long, joined mitochondria that share their contents (proteins, lipids and mtDNA). Fusion is stimulated by energy demand and by stress. |
| `L6792` | `molecule` | `mtfissioned` | Small, separate mitochondria. Fission raises the number of mitochondria, makes new organelles and helps quality control: a damaged piece can be cut off and removed by mitophagy. |
| `L6797` | `molecule` | `mtouterfused` | Two mitochondria whose outer membranes have joined while their inner membranes are still separate. |
| `L6802` | `molecule` | `mtdamaged` | Mitochondria that have lost their membrane potential. They are cut off by fission and removed by mitophagy (PINK1 and Parkin). |
| `L6807` | `molecule` | `mtphagosome` | A double membrane that has engulfed a damaged mitochondrion and will fuse with a lysosome. |
| `L6812` | `molecule` | `mtnew` | Made by growth and division of existing mitochondria (biogenesis), which PGC-1\u03b1 switches on. |
| `L6817` | `molecule` | `mtperinuclear` | Mitochondria clustered around the nucleus, as under hypoxia, oxidative stress or calcium changes. It is a change of position, not of how the organelle is divided or joined. |
| `L6822` | `molecule` | `mtswollen` | Mitochondria that have opened the permeability transition pore (mPTP) and lost their membrane potential: a sign of damage, not of division or fusion. |
| `L6827` | `molecule` | `mtapoptotic` | Mitochondria whose outer membrane has been permeabilized in apoptosis, so that cytochrome c, Diablo and AIF escape. |
| `L6832` | `molecule` | `dnadmg` | Damage to the genome that the cell cannot repair. It switches on pro-apoptotic factors and switches off anti-apoptotic ones, which starts the intrinsic pathway. |
| `L6837` | `molecule` | `cytcrel` | The small heme protein that normally carries electrons in the space between the two mitochondrial membranes. When pores open in the outer membrane it escapes into the cytosol, where it becomes a death signal. |
| `L6842` | `molecule` | `procasp9` | An inactive protease precursor (a zymogen) that is recruited to a protein platform and activated there. |
| `L6847` | `molecule` | `apoptosome` | A wheel-shaped complex that forms in the cytosol and is the platform for the first protease. It holds seven Apaf-1 molecules, each bound to a cytochrome c and a dATP. Procaspase-9 joins the wheel in the next step. |
| `L6852` | `molecule` | `casp9a` | The first active protease of the intrinsic pathway, made when its precursor is activated at the platform of the previous step. |
| `L6857` | `molecule` | `procexec` | Inactive precursors of the proteases that dismantle the cell, mainly procaspase-3, with procaspases-6 and -7. An initiator caspase cuts procaspase-3 once, between its two subunits, which activates it; procaspase-6 is mostly activated by active caspase-3. |
| `L6862` | `molecule` | `execcasp` | The active proteases that dismantle the cell. Both the extrinsic and the intrinsic pathway end by activating them. |
| `L6867` | `molecule` | `cellprot` | The many proteins that the last group of proteases cuts: nuclear lamins, cytoskeletal proteins, DNA repair enzymes such as PARP, and the inhibitor of a DNA-cutting enzyme. Cutting them dismantles the cell. |
| `L6872` | `molecule` | `apoptosis` | The cell shrinks, its DNA is cut, and it breaks into membrane-bound pieces that neighbors clear away without inflammation. Both pathways end here, at the same executioner caspases. |
| `L6877` | `molecule` | `tnf` | Tumor necrosis factor, a signaling protein released by other cells. It is a death ligand: it binds receptors on the target cell. |
| `L6882` | `molecule` | `deathrc` | Three receptor chains brought together by their ligand. The death domains in their tails face the inside of the cell and are ready to bind adaptor proteins. |
| `L6887` | `molecule` | `procasp8` | An inactive protease precursor that an adaptor carries to the receptor and that is activated there. |
| `L6892` | `molecule` | `casp8a` | The first active protease of the extrinsic pathway, made when its precursor molecules are brought together at the platform of the previous step. |
| `L6899` | `enzyme` | `hexokinase` | Phosphorylates glucose, trapping it in the cell. Irreversible. Muscle hexokinase is inhibited by its product glucose 6-phosphate; liver glucokinase, a low-affinity isoform, is not. Like every kinase here it needs Mg²⁺ bound to ATP. |
| `L6904` | `enzyme` | `pgi` | Converts the aldose glucose 6-phosphate into the ketose fructose 6-phosphate. Freely reversible. |
| `L6909` | `enzyme` | `pfk1` | The committed step and main control point of glycolysis. Irreversible. Activated by AMP and fructose 2,6-bisphosphate, inhibited by ATP and citrate. |
| `L6914` | `enzyme` | `aldolase` | Splits fructose 1,6-bisphosphate between carbons 3 and 4 in a reverse aldol reaction, giving DHAP and glyceraldehyde 3-phosphate. |
| `L6919` | `enzyme` | `tpi` | Interconverts DHAP and glyceraldehyde 3-phosphate so both halves of glucose can be used. A catalytically perfect enzyme, limited only by diffusion. |
| `L6924` | `enzyme` | `gapdh` | Oxidizes the aldehyde and adds inorganic phosphate, reducing NAD⁺ to NADH and making the high-energy acyl phosphate 1,3-BPG. The first energy-conserving step; it runs twice per glucose. |
| `L6929` | `enzyme` | `pgk` | Substrate-level phosphorylation: moves the acyl phosphate of 1,3-BPG onto ADP. This repays the two ATP spent in the investment phase. |
| `L6934` | `enzyme` | `pgm` | Shifts the phosphate from carbon 3 to carbon 2, through a phospho-histidine on the enzyme primed by a little 2,3-bisphosphoglycerate. |
| `L6939` | `enzyme` | `enolase` | Dehydrates 2-phosphoglycerate, creating the enol phosphate PEP. Needs Mg²⁺ and is inhibited by fluoride. |
| `L6944` | `enzyme` | `pk` | Substrate-level phosphorylation: PEP gives its phosphate to ADP. Irreversible. Fructose 1,6-bisphosphate activates it in a feed-forward loop; ATP and alanine inhibit it. |
| `L6949` | `enzyme` | `pdc` | Three enzymes (E1, E2, E3) and five cofactors, among them TPP, lipoamide and FAD. Irreversible link between glycolysis and the TCA cycle; inhibited by acetyl-CoA, NADH and ATP. |
| `L6954` | `enzyme` | `cs` | Condenses acetyl-CoA with oxaloacetate. Hydrolysis of the thioester releases CoA and pulls this step strongly forward. A control point of the cycle: ATP, NADH, succinyl-CoA and citrate inhibit it. |
| `L6959` | `enzyme` | `aconitase` | Isomerizes citrate to isocitrate by removing water to form cis-aconitate, then adding it back at a different carbon. Contains an iron-sulfur cluster. |
| `L6964` | `enzyme` | `idh` | The first oxidative decarboxylation: releases CO₂ and reduces NAD⁺. A key control point, activated by ADP and Ca²⁺, inhibited by ATP and NADH. |
| `L6969` | `enzyme` | `kgdh` | The second oxidative decarboxylation. Built like the pyruvate dehydrogenase complex and uses the same five cofactors. Inhibited by succinyl-CoA, NADH and ATP. |
| `L6974` | `enzyme` | `scs` | Substrate-level phosphorylation in the cycle: the thioester energy of succinyl-CoA makes GTP (or ATP, depending on the isoform). |
| `L6979` | `enzyme` | `sdh` | The only cycle enzyme embedded in the inner mitochondrial membrane (Complex II of the electron transport chain). Its FAD is covalently bound and passes electrons to ubiquinone; unlike Complexes I, III and IV it pumps no protons. Competitively inhibited by malonate. |
| `L6984` | `enzyme` | `fumarase` | Adds water across the double bond of fumarate, producing L-malate stereospecifically. |
| `L6989` | `enzyme` | `mdh` | Oxidizes malate to oxaloacetate. The reaction is uphill under standard conditions and is pulled forward by citrate synthase consuming oxaloacetate. |
| `L6991` | `enzyme` | `mdh` | Enzyme của gluconeogenesis giúp tách nhóm phosphate khỏi glucose 6-phosphate. |
| `L6992` | `enzyme` | `g6pase` | Enzyme của gluconeogenesis đối kháng với PFK-1. |
| `L6993` | `enzyme` | `fbpase` | Chuyển hóa qua lại giữa glucose 1-phosphate và glucose 6-phosphate. |
| `L6994` | `enzyme` | `pglucomutase` | Enzyme đầu tiên của pentose phosphate pathway. |
| `L6995` | `enzyme` | `g6pdh` | Khử pyruvate thành lactate và tái tạo NAD⁺ cho bước glyceraldehyde 3-phosphate dehydrogenase, giúp glycolysis tiếp tục chạy khi không có oxygen. Ở gan và tim, phản ứng chủ yếu diễn ra theo chiều ngược lại. |
| `L6996` | `enzyme` | `ldh` | Tạo oxaloacetate từ pyruvate, bước đầu tiên của gluconeogenesis. Cần biotin. |
| `L6997` | `enzyme` | `pc` | Chuyển oxaloacetate thành PEP trong gluconeogenesis. |
| `L6998` | `enzyme` | `pepck` | Khử acetaldehyde thành ethanol trong fermentation. |
| `L6999` | `enzyme` | `adh` | Enzyme của nấm men biến đổi pyruvate thành acetaldehyde. |
| `L7000` | `enzyme` | `pyrdecarb` | Enzyme phụ thuộc NAD của cytosol. Khử dihydroxyacetone phosphate thành glycerol 3-phosphate bằng electrons từ cytosolic NADH, là bước đầu của glycerol phosphate shuttle; đồng thời kết nối glycolysis với tổng hợp lipid. |
| `L7001` | `enzyme` | `glycerol3pdh` | Enzyme kết nối chuyển hóa amino acid với TCA cycle: tách nhóm amino của glutamate dưới dạng ammonium (oxidative deamination) và theo chiều ngược lại, gắn ammonium vào alpha-ketoglutarate để tạo glutamate. Dùng NAD⁺ cho deamination và NADPH cho amination, hoạt động trong ty thể của gan. |
| `L7002` | `enzyme` | `gdh` | Enzyme dùng vitamin B6 chuyển nhóm amino giữa alanine và glutamate: alanine nhường nhóm amino cho alpha-ketoglutarate, tạo pyruvate và glutamate. Trong glucose-alanine cycle, nó chạy theo chiều tạo alanine ở cơ và quay lại tạo pyruvate ở gan; nồng độ ALT cao trong máu là dấu hiệu tổn thương gan. |
| `L7003` | `enzyme` | `alt` | Enzyme dùng vitamin B6 chuyển nhóm amino giữa aspartate và glutamate. Một isoform trong matrix và một isoform ở cytosol thực hiện hai bước transamination của malate-aspartate shuttle. |
| `L7004` | `enzyme` | `ast` | Glyoxylate cycle enzyme that bypasses the decarboxylation steps. |
| `L7005` | `enzyme` | `icl` | Regenerates cytosolic acetyl-CoA by cleaving citrate that was exported from the mitochondria. |
| `L7006` | `enzyme` | `acl` | Chuyển nhóm phosphate tận cùng giữa các nucleoside diphosphates và triphosphates, ví dụ GTP + ADP thành GDP + ATP. |
| `L7007` | `enzyme` | `ndpk` | Khử carboxyl (decarboxylates) malate thành pyruvate. |
| `L7011` | `enzyme` | `complex1` | The largest complex of the chain, with 45 subunits in mammals. NADH passes its electrons through FMN and a chain of iron-sulfur clusters to ubiquinone, and the enzyme pumps 4 H\\u207a from the matrix to the intermembrane space for every 2 electrons. Rotenone and amytal block it. |
| `L7016` | `enzyme` | `complex3` | Made of 11 different subunits in mammals. The quinone cycle passes electrons from ubiquinol, one at a time, to cytochrome c and moves 4 H\\u207a into the intermembrane space for each ubiquinol oxidized. Antimycin A blocks it. |
| `L7021` | `enzyme` | `complex4` | Made of 13 subunits in mammals, with two hemes and three copper ions. It passes electrons from cytochrome c through copper and heme centers to O\\u2082, which becomes water, and pumps 4 H\\u207a per O\\u2082 (2 per pair of electrons). Cyanide, azide and carbon monoxide block it. |
| `L7026` | `enzyme` | `atpsynthase` | F\\u2081F\\u2080 ATP synthase. Protons flowing down their gradient through the F\\u2080 ring turn a rotor, and the F\\u2081 head makes ATP from ADP and inorganic phosphate (about 4 H\\u207a per ATP: the c ring takes 12 protons per turn and each turn makes 3 ATP). Oligomycin blocks F\\u2080; uncouplers such as DNP let protons bypass it. |
| `L7028` | `enzyme` | `atpsynthase` | Lets protons leak back across the inner membrane of brown fat, so the energy is released as heat instead of ATP. |
| `L7029` | `enzyme` | `ucp1` | Found in plants and fungi. Passes electrons from ubiquinol straight to O\u2082, bypassing Complexes III and IV. |
| `L7030` | `enzyme` | `aox` | An antiporter that makes up about 14 percent of the protein of the inner membrane. It exchanges ATP made in the matrix for ADP from the cytosol, one for one, and the membrane potential favors ATP leaving (ATP carries one more negative charge). The exchange costs about a quarter of the energy of the chain. |
| `L7031` | `enzyme` | `ant` | Enzyme phụ thuộc NAD ở cytosol tác động lên các axit bốn carbon. Khử oxaloacetate thành malate bằng electrons của cytosolic NADH, bước đầu của malate-aspartate shuttle. |
| `L7032` | `enzyme` | `mdh1` | A carrier of the inner membrane that moves malate into the matrix in exchange for \u03b1-ketoglutarate going out. Nothing is oxidized or reduced in this step. |
| `L7033` | `enzyme` | `mkat` | A carrier of the inner membrane that exports aspartate from the matrix and imports glutamate. It is driven by the membrane potential, which makes the malate-aspartate shuttle work in one direction only. |
| `L7034` | `enzyme` | `gaa` | Đưa electrons vào ubiquinol, bỏ qua Complex I (glycerol phosphate shuttle). |
| `L7035` | `enzyme` | `gpd2` | Gắn glucose từ UDP-glucose vào đầu không khử (non-reducing end) của chuỗi glycogen (liên kết alpha-1,4). Đây là enzyme điều hòa chính của quá trình tổng hợp glycogen, bị ức chế bởi phosphorylation. |
| `L7036` | `enzyme` | `glycogensynthase` | Phân giải glycogen từ các đầu không khử bằng phosphorolysis: inorganic phosphate (chứ không phải nước) cắt liên kết, nên glucose được giải phóng ở dạng đã phosphoryl hóa (glucose 1-phosphate) mà không tốn ATP. Cần pyridoxal phosphate. |
| `L7037` | `enzyme` | `glycogenphosphorylase` | Gắn glucose 1-phosphate vào phần UMP của UTP, giải phóng pyrophosphate. Sự phân giải pyrophosphate bởi pyrophosphatase kéo phản ứng tiến về phía trước. Đơn vị UMP được chuyển lên đường chứ không bị giải phóng. |
| `L7038` | `enzyme` | `ugpase` | Thủy phân các liên kết ester của triacylglycerol, giải phóng free fatty acids và glycerol. Trong tế bào mỡ, hormone-sensitive lipase được bật lên bởi epinephrine và glucagon. |
| `L7039` | `enzyme` | `lipase` | Hoạt hóa một fatty acid bằng cách nối nó với coenzyme A. ATP bị cắt thành AMP và pyrophosphate (tiêu tốn hai liên kết giàu năng lượng), sau đó chuỗi đã hoạt hóa được đưa vào ty thể qua carnitine shuttle. Lipases giải phóng axit từ chất béo, còn enzyme này hoạt hóa chúng. |
| `L7040` | `enzyme` | `acs` | Bước đầu tiên của mỗi vòng beta-oxidation: loại bỏ hai hydro khỏi các carbon alpha và beta, tạo thành một trans double bond. FAD của nó truyền electrons tới electron transport chain (qua ETF). |
| `L7041` | `enzyme` | `acadh` | Cộng nước vào trans double bond, gắn một nhóm L-hydroxyl vào beta carbon. |
| `L7042` | `enzyme` | `enoylh` | Oxy hóa nhóm beta-hydroxyl thành ketone bằng NAD⁺, tạo thành beta-ketoacyl-CoA. |
| `L7043` | `enzyme` | `hadh` | Cắt beta-ketoacyl-CoA giữa carbon alpha và beta bằng một coenzyme A mới: acetyl-CoA được giải phóng và acyl-CoA, ngắn đi hai carbons, quay lại đầu vòng xoắn. |
| `L7044` | `enzyme` | `thiolase` | Bước cam kết (committed step) của quá trình TỔNG HỢP fatty acid (acetyl-CoA thành malonyl-CoA), ngược chiều với beta-oxidation. |
| `L7045` | `enzyme` | `acc` | Chuyển các nhóm acyl mạch dài lên carnitine để chúng có thể đi vào ty thể; là điểm kiểm soát chính của beta-oxidation. |
| `L7046` | `enzyme` | `cpt1` | Loại bỏ các nhánh alpha-1,6 để glycogen phosphorylase có thể tiếp tục hoạt động. |
| `L7047` | `enzyme` | `debranch` | Tạo các nhánh alpha-1,6 của glycogen. |
| `L7051` | `enzyme` | `porin` | A barrel of beta strands that forms a water-filled channel in the outer mitochondrial membrane. Small molecules such as pyruvate, ADP and ATP pass through it freely, so the outer membrane is no barrier to them. It does not catalyze a reaction. |
| `L7056` | `enzyme` | `pyrsym` | The inner membrane is impermeable to this acid, so a carrier moves it into the matrix together with a small positive ion, using the gradient built by the electron transport chain. The carrier is made of two small proteins, MPC1 and MPC2. |
| `L7061` | `enzyme` | `drp1` | Dynamin-related protein 1, a GTPase of the cytosol. Adaptors on the outer membrane recruit it to sites where the endoplasmic reticulum has already squeezed the mitochondrion. It assembles into a ring, and hydrolysis of GTP tightens the ring until the organelle divides. |
| `L7066` | `enzyme` | `mfn` | GTPases in the outer membrane. Mitofusins on two neighboring mitochondria bind each other and, using the energy of GTP, pull the two outer membranes together until they fuse. Mfn2 also tethers mitochondria to the endoplasmic reticulum. |
| `L7071` | `enzyme` | `opa1` | A GTPase of the inner membrane that fuses the inner membranes once the outer membranes have joined. It also shapes the cristae, and its cleavage helps release cytochrome c during apoptosis. |
| `L7076` | `enzyme` | `mff` | Mitochondrial fission factor, an adaptor in the outer membrane that recruits Drp1 (Fis1 and the MiD proteins do the same). It is not a GTPase itself. |
| `L7081` | `enzyme` | `fis1` | Mitochondrial fission protein 1, an outer-membrane adaptor that helps recruit Drp1. It is not a GTPase itself. |
| `L7086` | `enzyme` | `pink1` | A kinase that builds up on the outer membrane of a depolarized mitochondrion and recruits Parkin, which marks the organelle for mitophagy. |
| `L7091` | `enzyme` | `parkin` | An E3 ubiquitin ligase that is recruited by PINK1 and puts ubiquitin on outer-membrane proteins of a damaged mitochondrion, the signal for mitophagy. |
| `L7096` | `enzyme` | `mid49` | Mitochondrial dynamics protein of 49 kDa, an outer-membrane adaptor that recruits Drp1 (as MiD51 and Mff do). It is not a GTPase itself. |
| `L7101` | `enzyme` | `mid51` | Mitochondrial dynamics protein of 51 kDa, an outer-membrane adaptor that recruits Drp1 (as MiD49 and Mff do). It is not a GTPase itself. |
| `L7106` | `enzyme` | `tradd` | An adaptor that binds the exposed death domains of TNFR1 and in turn binds FADD; the first complex of the receptor also holds RIP1 and TRAF2. |
| `L7111` | `enzyme` | `bax` | A pro-apoptotic member of the Bcl-2 family. Once severe damage has switched it on, it moves to the outer mitochondrial membrane and assembles into pores (together with its relative Bak). Anti-apoptotic Bcl-2 proteins hold it back until they are inhibited. |
| `L7116` | `enzyme` | `apaf1` | A large adaptor protein of the cytosol that is switched on by a small heme protein and a nucleotide, and that assembles into a ring of seven molecules. |
| `L7121` | `enzyme` | `apoptosomeenz` | A wheel of seven adaptor molecules that recruits inactive protease precursors to its hub; held close together, they cut and activate each other. |
| `L7126` | `enzyme` | `casp9` | The initiator caspase of the intrinsic pathway: a protease that cuts after aspartate residues. Activated at the apoptosome, it cuts and activates procaspase-3, the main executioner. |
| `L7131` | `enzyme` | `casp8` | The initiator caspase of the extrinsic pathway. Inactive precursors that are brought together at the receptor complex cut each other and become active; the active protease then activates the executioner procaspases. |
| `L7136` | `enzyme` | `casp3` | The main protease that dismantles the cell, which it does by cutting hundreds of proteins. Caspases-6 and -7 act in the same way. |
| `L7141` | `enzyme` | `tnfr1` | A receptor protein of the plasma membrane with a death domain in its tail. TNF brings three receptor chains together, and their death domains are exposed to adaptor proteins. In many cells TNF mainly switches on survival signaling and causes apoptosis only when that signaling fails; Fas and TRAIL receptors are the classic death receptors. |
| `L7146` | `enzyme` | `fadd` | An adaptor with a death domain at one end and a second binding region at the other. For TNFR1 it binds TRADD, which binds the death domains of the receptor, and its other end binds procaspase-8, bringing several procaspase-8 molecules close enough to activate each other. |
| `L7151` | `enzyme` | `cps1` | The committed step of the urea cycle, in the liver\ |
| `L7156` | `enzyme` | `otc` | Moves a carbamoyl group onto the side-chain amino group of a basic five-carbon amino acid, in the matrix. OTC deficiency, the most common urea cycle disorder, is X-linked and causes high blood ammonia. |
| `L7161` | `enzyme` | `ornt1` | An antiporter of the inner mitochondrial membrane. It brings cytosolic ornithine into the matrix in exchange for citrulline, one for one, and a defect causes HHH syndrome (high blood ammonia and ornithine, and homocitrulline in the urine). |
| `L7166` | `enzyme` | `ass` | In the cytosol, it joins two substrates using the energy of a nucleotide triphosphate, with two high-energy bonds spent. A pyrophosphatase that splits the released PPi pulls the step forward, and a defect of this enzyme causes citrullinemia type I. |
| `L7171` | `enzyme` | `asl` | Cuts a carbon-nitrogen bond in the cytosol to release a four-carbon dicarboxylic acid, with no redox change. The released fumarate joins the TCA cycle, so the two cycles are linked. |
| `L7176` | `enzyme` | `arg1` | The last step, in the cytosol of liver cells: a manganese enzyme that hydrolyzes the guanidino group of its substrate. Humans also have arginase 2, in the kidney and other tissues, which is not part of the urea cycle. |
| `L7178` | `enzyme` | `arg1` | Isoform ở cytosol của quá trình tổng hợp pyrimidine. Tạo carbamoyl phosphate từ glutamine thay vì ammonium và không được hoạt hóa bởi N-acetylglutamate. |
| `L7179` | `enzyme` | `cps2` | Enzyme cam kết đầu tiên của quá trình tổng hợp pyrimidine: chuyển nhóm carbamoyl của carbamoyl phosphate lên aspartate thay vì ornithine. |
| `L7180` | `enzyme` | `atcase` | Sử dụng arginine, NADPH và oxygen để tạo nitric oxide và citrulline: một số phận khác của arginine. |
| `L7181` | `enzyme` | `nos` | Một nickel enzyme của vi khuẩn và thực vật (không có ở người) phân cắt urea thành ammonia và CO₂. |
| `L7182` | `enzyme` | `urease` | Tổng hợp N-acetylglutamate từ glutamate và acetyl-CoA; arginine kích hoạt nó, và sản phẩm của nó hoạt hóa carbamoyl phosphate synthetase I. |
| `L7183` | `enzyme` | `nags` | Bắt giữ ammonium dưới dạng glutamine với sự trợ giúp của ATP; não và cơ xuất khẩu ammonia dưới dạng glutamine (cơ cũng xuất khẩu dưới dạng alanine). |
| `L7184` | `enzyme` | `gs` | Biến đổi ornithine thành putrescine, bước đầu của quá trình tổng hợp polyamine: một số phận khác của ornithine. |
| `L7185` | `enzyme` | `odc` | Giải phóng ammonium từ nhóm amide của glutamine tại gan (nơi nó cấp liệu cho urea cycle) và tại thận (nơi nó được bài tiết). |
| `L7188` | `cofactor` | `glnase` | Đồng tiền năng lượng chính của tế bào, truyền năng lượng hóa học qua các liên kết phosphate giàu năng lượng. |
| `L7189` | `cofactor` | `atp` | Cơ chất để tổng hợp ATP, nhận nhóm phosphate trong substrate-level và oxidative phosphorylation. |
| `L7190` | `cofactor` | `adp` | Allosteric activator báo hiệu mức năng lượng tế bào thấp. |
| `L7193` | `cofactor` | `gdp` | Chất oxy hóa / chất nhận electron chính trong dị hóa (glycolysis, TCA, beta-oxidation). |
| `L7194` | `cofactor` | `nad` | Mang hai electrons giàu năng lượng tới Complex I của chuỗi hô hấp. |
| `L7195` | `cofactor` | `nadh` | Chất nhận electron trong pha oxy hóa của pentose phosphate pathway. |
| `L7196` | `cofactor` | `nadp` | Nguồn cung cấp lực khử cho các con đường sinh tổng hợp (tổng hợp fatty acid, cholesterol) và tái tạo glutathione. |
| `L7197` | `cofactor` | `nadph` | Chất nhận electron nhóm ngoại (prosthetic) cho succinate dehydrogenase và acyl-CoA dehydrogenase. |
| `L7198` | `cofactor` | `fad` | Truyền electrons trực tiếp tới ubiquinone qua Complex II / ETF. |
| `L7199` | `cofactor` | `fadh2` | Chất mang nhóm acyl tạo liên kết thioester giàu năng lượng (acetyl-CoA, succinyl-CoA). |
| `L7200` | `cofactor` | `coa` | Sản phẩm một carbon của phản ứng decarboxylation hoàn toàn và là cơ chất cho phản ứng carboxylation. |
| `L7201` | `cofactor` | `co2` | Dung môi, chất tham gia trong các phản ứng thủy phân và hydrat hóa, đồng thời là sản phẩm phụ của quá trình vận chuyển electron. |
| `L7202` | `cofactor` | `h2o` | Ion orthophosphate vô cơ tham gia vào phản ứng phosphorylation và phosphorolysis. |
| `L7203` | `cofactor` | `pi` | Diphosphate được giải phóng khi hoạt hóa nucleic acid và acyl-CoA, nhanh chóng bị thủy phân để kéo phản ứng tiến về phía trước. |
| `L13069` | `pack` | `` | Up to 8 atoms |
| `L13070` | `pack` | `` | Up to 12 atoms |
| `L13071` | `pack` | `` | Every drawing |
| `L13074` | `pack` | `` | Some pieces are missing. Choose what belongs there. |
| `L13075` | `pack` | `` | Build the molecule from atoms on an empty page. |
| `L13076` | `pack` | `` | Both kinds, in turn. |
| `L17942` | `pack` | `` | The five-carbon sugar with a phosphate on each end that takes up CO₂ in the first step of the Calvin cycle. Each turn of the cycle regenerates it, which is why the pathway is a cycle. |
| `L17947` | `pack` | `` | A five-carbon ketose phosphate, the last molecule before the CO₂ acceptor is rebuilt. The epimerase makes it from Xu5P, the isomerase makes it from R5P, and phosphoribulokinase adds the second phosphate with ATP. |
| `L17952` | `pack` | `` | A five-carbon ketose phosphate that both transketolase reactions of the cycle make. The epimerase changes it into Ru5P by turning carbon 3 around. |
| `L17957` | `pack` | `` | A four-carbon aldose phosphate. Transketolase makes it from F6P, and aldolase then joins it with DHAP to make the seven-carbon SBP. |
| `L17962` | `pack` | `` | The seven-carbon sugar with a phosphate on each end, made when aldolase joins E4P and DHAP. Sedoheptulose bisphosphatase removes the phosphate on carbon 1, and that step runs one way only. |
| `L17967` | `pack` | `` | A seven-carbon ketose phosphate. Transketolase takes two carbons from it and gives them to G3P, which leaves R5P and Xu5P. |
| `L17972` | `pack` | `` | The cluster of four manganese ions on the lumen side of photosystem II that takes electrons from water, the oxygen-evolving complex. It steps through five oxidation states, S0 to S4 (the Kok cycle), and after four light steps it releases O₂ and 4 H⁺ from 2 H₂O. |
| `L17977` | `pack` | `` | The special pair of chlorophyll a molecules in the reaction center of photosystem II, the electron donor that the Mn complex refills. Its name is the wavelength of 680 nm that it absorbs best, and photosystem II excites it. |
| `L17982` | `pack` | `` | The state of the special pair in which one electron has jumped to a higher energy level, which makes it a very strong electron donor. P680 reaches it by absorbing a photon, and in it the pair gives an electron to the next acceptor, which leaves P680⁺ behind. |
| `L17987` | `pack` | `` | The green pigment with a magnesium ion at the center of a ring of four pyrroles and a long phytol tail that anchors it in the membrane. In the Z scheme a chlorophyll a beside P680 takes the electron from P680* first. |
| `L17992` | `pack` | `` | Chlorophyll without its magnesium ion, the stable acceptor that takes the electron from the accessory chlorophyll a. |
| `L17997` | `pack` | `` | The first of the two bound quinones of the reaction center, which holds one electron at a time and hands it to the second one. In plants it is a plastoquinone like PQ. |
| `L18002` | `pack` | `` | The second of the two bound quinones of the reaction center, which takes two electrons one after the other and then leaves its site as a fully reduced carrier to join the PQ pool. It also takes up 2 H⁺ from the stroma. In plants it is a plastoquinone. |
| `L18007` | `pack` | `` | A small lipid-soluble quinone that moves freely in the thylakoid membrane and carries electrons from photosystem II to the cytochrome b6f complex. It is the chloroplast counterpart of ubiquinone, and it takes up 2 H⁺ from the stroma when it is reduced. |
| `L18012` | `pack` | `` | A protein of the cytochrome b6f complex with a small metal cluster that takes one electron from the reduced mobile carrier and passes it on to cytochrome f. The cluster is a [2Fe-2S] center. |
| `L18017` | `pack` | `` | The heme protein of the cytochrome b6f complex that faces the lumen. It takes the electron from the Rieske protein and hands it to plastocyanin, and it is a c-type cytochrome. |
| `L18022` | `pack` | `` | A small copper protein in the lumen that carries one electron at a time from the cytochrome b6f complex to photosystem I. Its copper switches between Cu²⁺ and Cu⁺. |
| `L18027` | `pack` | `` | The special pair of chlorophyll a molecules in the reaction center of photosystem I, the electron donor that plastocyanin refills after each excitation. Its name is the wavelength of 700 nm that it absorbs best. |
| `L18032` | `pack` | `` | The state of the special pair in which one electron has jumped to an even higher energy level, which makes it the strongest electron donor of the Z scheme. P700 reaches it by absorbing a photon, and it sends an electron to the first acceptor of photosystem I, A0. |
| `L18037` | `pack` | `` | The first electron acceptor of the second reaction center of the Z scheme. It is a chlorophyll a molecule, and it passes the electron to A1. |
| `L18042` | `pack` | `` | The second electron acceptor of the second reaction center of the Z scheme. It is a phylloquinone (vitamin K1), a menaquinone-type quinone, and it passes the electron to the iron-sulfur centers FX, FA and FB. |
| `L18047` | `pack` | `` | A short wire of three clusters of iron and sulfur atoms at the stromal edge of the second reaction center. They pass the electron from A1 along FX, FA and FB to ferredoxin. |
| `L18052` | `pack` | `` | A small iron-sulfur protein in the stroma that takes one electron at a time from photosystem I. Two reduced ferredoxins give their electrons to the enzyme that reduces NADP⁺. |
| `L18057` | `pack` | `` | The reduced carrier that takes the electrons of the light reactions to the Calvin cycle. It is the phosphorylated relative of NADH, and the cell keeps the two pools apart. |
| `L18062` | `pack` | `` | The large protein complex of the thylakoid membrane that uses the energy of a photon to split water and pass electrons to plastoquinone. Its P680 reaction center, the Mn complex and the quinones QA and QB all sit in it. |
| `L18067` | `pack` | `` | The protein complex of the thylakoid membrane that uses the energy of a photon to lift electrons from plastocyanin to ferredoxin. Its P700 reaction center and the acceptors A0, A1, FX, FA and FB all sit in it. |
| `L18072` | `pack` | `` | The protein complex between the two photosystems that passes electrons from plastoquinol to plastocyanin and moves protons from the stroma into the lumen. It is the chloroplast counterpart of Complex III. |
| `L18077` | `pack` | `` | The rotary enzyme of the thylakoid membrane: the flow of ions through its membrane part turns a stalk, and its head joins a nucleotide diphosphate to an inorganic ion. In detail, protons flow from the lumen to the stroma through CF0, and the CF1 head makes ATP from ADP and Pi. |
| `L18082` | `pack` | `` | The flavoprotein (with FAD) in the stroma that takes electrons from the small soluble carrier of photosystem I and gives them to the oxidized nucleotide carrier, which makes the reduced one. It reduces NADP⁺ to NADPH; the names FP (FAD) and FNR both mean this one enzyme. |
| `L18087` | `pack` | `` | The enzyme that fixes carbon from the air by attaching it to a five-carbon sugar bisphosphate, whose six-carbon product splits into two three-carbon acids. It attaches CO₂ to RuBP and makes two 3-phosphoglycerate. The small subunit is coded in the nucleus and the large one in the chloroplast, and the whole enzyme has 8 of each. |
| `L18092` | `pack` | `` | The chloroplast dehydrogenase that reduces 1,3-bisphosphoglycerate to glyceraldehyde 3-phosphate with NADPH and releases phosphate. It is a different enzyme from the NAD-dependent GAPDH of glycolysis, and Table 22.1 prints its name as NADP-glyceraldehyde-3-phosphate dehydrogenase. |
| `L18097` | `pack` | `` | The transferase that moves a two-carbon unit from a ketose phosphate to an aldose phosphate. It acts twice in the Calvin cycle. |
| `L18102` | `pack` | `` | The phosphatase that removes the phosphate on carbon 1 of sedoheptulose 1,7-bisphosphate. Like the other phosphatases of the cycle it is irreversible. |
| `L18107` | `pack` | `` | The epimerase that changes Xu5P into Ru5P by inverting carbon 3, so only one carbon is rearranged. |
| `L18112` | `pack` | `` | The isomerase that turns the aldose R5P into the ketose Ru5P, the same kind of rearrangement as glucose 6-phosphate to fructose 6-phosphate. |
| `L18117` | `pack` | `` | The kinase that spends ATP to put a phosphate on carbon 1 of Ru5P and make RuBP, the last step of the cycle. It completes the rebuilding of the CO₂ acceptor. |
| `L18122` | `pack` | `` | The enzyme of the mesophyll cell that adds carbon from the air to a three-carbon enol phosphate and makes a four-carbon acid, which gives the C4 pathway its name. It adds CO₂ to PEP, makes oxaloacetate and releases the phosphate of PEP as Pi. In the cell the form it takes up is HCO₃⁻, which is in equilibrium with CO₂. |
| `L18127` | `pack` | `` | The chloroplast dehydrogenase that reduces oxaloacetate to malate with NADPH in the mesophyll cell of C4 plants. Unlike the NAD-dependent malate dehydrogenase of the TCA cycle, it uses NADPH. |
| `L18132` | `pack` | `` | The enzyme of the bundle-sheath cell that oxidizes the four-carbon acid and releases a carbon as a gas right beside RuBisCO. It turns malate and NADP⁺ into pyruvate, CO₂ and NADPH, and is called malic enzyme (NADP-dependent). |
| `L18137` | `pack` | `` | The kinase that rebuilds PEP from pyruvate in the mesophyll cell. It spends ATP and splits off two phosphates, giving AMP and PPi, so about two ATP equivalents go into each PEP. |
| `L18142` | `pack` | `` | The electron flow of the thylakoid membrane, in which two photosystems and the cytochrome b6f complex move electrons from water to the oxidized nucleotide carrier while a gas is released. The carrier is NADP⁺ and the gas is O₂, and together with photophosphorylation this flow makes up the light reactions. |
| `L18147` | `pack` | `` | The making of ATP from ADP and Pi with the energy of the proton gradient across the thylakoid membrane. The gradient is built by the light reactions, but the ATP can be made in the dark as long as the gradient is there. |
| `L18152` | `pack` | `` | The cycle in the stroma that fixes carbon from the air into sugar, using what the light reactions make. It uses ATP and NADPH to fix CO₂, is also called the dark reactions, and gives ADP and NADP⁺ back to the thylakoid. |
| `L18157` | `pack` | `` | Stage 2: 3-phosphoglycerate is phosphorylated with ATP and then reduced with NADPH to G3P (steps 2 and 3 of Table 22.1: phosphoglycerate kinase and the NADP-dependent G3P dehydrogenase). The box of the stage also holds the ATP step, so its name is loose. |
| `L18162` | `pack` | `` | Stage 3: five G3P and three ATP are turned back into three RuBP by the sugar shuffle of Table 22.1 (transketolase, aldolase, the phosphatases, the epimerase and isomerase, and phosphoribulose kinase), so the cycle can start again. |
| `L18167` | `pack` | `` | The pathway in the cytosol that breaks glucose down to pyruvate and makes a little ATP and NADH. |
| `L18172` | `pack` | `` | The making of ATP in the mitochondrion from the proton gradient that the respiratory chain builds. |
| `L18177` | `pack` | `` | The cycle in the mitochondrial matrix that burns acetyl-CoA to CO₂ and makes NADH, FADH₂ and a little GTP. |
| `L18181` | `pack` | `` | A packet of radiant energy that a pigment absorbs, which lifts one of its electrons to a higher energy level. |
| `L18210` | `pack` | `` | The second messenger of the beta-adrenergic and glucagon pathways: AMP with its phosphate closed into a ring between the 3′ and the 5′ hydroxyl of the ribose. Adenylate cyclase makes it from ATP, four of them bind the regulatory subunits of protein kinase A, and phosphodiesterase opens the ring to make AMP. |
| `L18215` | `pack` | `` | The guanine counterpart of the cyclic AMP ring among the second messengers. |
| `L18220` | `pack` | `` | Adenosine with one phosphate on the 5′ carbon, the product when phosphodiesterase opens the ring of cAMP. It has no messenger activity, so the signal ends. |
| `L18225` | `pack` | `` | An amino acid derivative made from tyrosine, released into the blood as the hormone of the stress response. It binds the beta-adrenergic receptor, which starts the cascade that breaks down glycogen. |
| `L18230` | `pack` | `` | An amino acid with a phenol ring. Epinephrine is made from it, and a receptor tyrosine kinase puts a phosphate group on the ring hydroxyl of a tyrosine residue in a protein. |
| `L18235` | `pack` | `` | A tyrosine with a phosphate on its ring hydroxyl. In the cell it is a residue of a protein, made when a receptor tyrosine kinase moves the phosphate of ATP onto it. The SH2 domains of other signaling proteins bind to it. |
| `L18240` | `pack` | `` | The water-soluble head of PIP2, with phosphates on carbons 1, 4 and 5. It is the actual second messenger: it leaves the membrane, diffuses through the cytosol to the endoplasmic reticulum and opens a channel there. |
| `L18245` | `pack` | `` | A phospholipid of the plasma membrane, in its inner layer: an inositol ring with phosphates on carbons 4 and 5, joined through a phosphodiester to diacylglycerol. Here the two acyl chains are drawn as R. It is not a receptor and not itself a messenger: it is a precursor, and what is made from it depends on the pathway. |
| `L18250` | `pack` | `` | The nonpolar half of PIP2 after phospholipase C has cut it. It stays in the plasma membrane, where it activates protein kinase C. Here the two acyl chains are drawn as R. |
| `L18426` | `pack` | `` | A receptor protein of the plasma membrane with seven transmembrane helices. Almost 800 human genes code for such receptors. Binding of a hormone changes the shape of its cytoplasmic side, which then acts on a G protein. |
| `L18431` | `pack` | `` | A protein of three different subunits, alpha, beta and gamma, held at the receptor on the inner face of the membrane. Its alpha subunit binds GDP at rest and GTP when active, so the whole protein works as a switch. |
| `L18437` | `pack` | `` | The subunit of the G protein that binds GDP or GTP. With GTP bound it leaves the beta and gamma subunits and switches on an enzyme, and its own GTPase activity slowly turns the GTP into GDP, which switches it off again. |
| `L18442` | `pack` | `` | The beta and gamma subunits of the G protein, which stay together. They hold the alpha subunit while it carries GDP, and the alpha-GDP subunit rejoins them at the end of the cycle. |
| `L18447` | `pack` | `` | The GPCR that binds epinephrine with its seven helices numbered. Its stimulatory G protein (Gs) switches on adenylate cyclase. |
| `L18452` | `pack` | `` | A membrane enzyme that turns ATP into cyclic AMP and pyrophosphate. Active Gs alpha-GTP stimulates it and Gi alpha-GTP inhibits it, and it switches off when the G alpha subunit has turned its GTP into GDP. |
| `L18457` | `pack` | `` | A kinase that rests as R2C2, two regulatory and two catalytic subunits, until four cAMP bind the regulatory subunits and free the catalytic subunits. These put the phosphate of ATP onto serine and threonine residues of other proteins, and the enzyme is also called the cAMP-dependent protein kinase. |
| `L18462` | `pack` | `` | The enzyme that opens the ring of cAMP with water and makes AMP, which ends the signal. Caffeine can inhibit this enzyme, which is sometimes given as the reason coffee raises blood glucose; at the dose of a cup of coffee caffeine acts mainly by blocking adenosine receptors, and it takes far more to inhibit the enzyme. |
| `L18467` | `pack` | `` | The phosphatase that removes the phosphate group of a phosphoprotein with water, which undoes what a kinase did. Insulin signaling switches it on. In glycogen metabolism it is usually protein phosphatase 1, PP1. |
| `L18472` | `pack` | `` | The kinase that PKA switches on. It puts a phosphate group on glycogen phosphorylase b and turns it into the active phosphorylase a. |
| `L18477` | `pack` | `` | The enzyme that a G protein switches on to hydrolyze PIP2 into IP3 and diacylglycerol. |
| `L18482` | `pack` | `` | A channel in the membrane of the endoplasmic reticulum that opens when IP3 binds, so that Ca2+ flows from the lumen of the ER into the cytosol. |
| `L18487` | `pack` | `` | A small calcium-binding protein of the cytosol. Ca2+ ions bind it, and the Ca2+-calmodulin complex then activates a cytosolic protein kinase. |
| `L18492` | `pack` | `` | The cytosolic kinase that the Ca2+-calmodulin complex activates. It phosphorylates a target enzyme. |
| `L18497` | `pack` | `` | A membrane-bound kinase that diacylglycerol activates. It phosphorylates channel proteins that control the flow of Ca2+ into and out of the cell. |
| `L18502` | `pack` | `` | A membrane receptor whose cytoplasmic domain is a tyrosine kinase. Binding of the ligand brings two receptors together, and each one phosphorylates tyrosines on the tail of the other (autophosphorylation). |
| `L18507` | `pack` | `` | The class II receptor tyrosine kinase. It is always a dimer in the membrane, two chains linked by disulfide bonds, each with a kinase domain, and insulin binding activates the autophosphorylation of its tails. |
| `L18512` | `pack` | `` | A signaling protein with an SH2 domain, a region that binds phosphotyrosine. Several of them gather on the phosphorylated tails of a receptor tyrosine kinase and form the signaling complex. |
| `L18517` | `pack` | `` | The docking protein of the insulin receptor. It binds the phosphorylated receptor and is activated there, and from it the message branches to PI3 kinase and to other signaling pathways. |
| `L18522` | `pack` | `` | The kinase that adds a phosphate to carbon 3 of the inositol ring of PIP2 and so makes PIP3 in the membrane. IRS-1 switches it on. |
| `L18527` | `pack` | `` | A kinase that PIP3 brings to the membrane and activates. It activates Akt. |
| `L18532` | `pack` | `` | The kinase at the end of the insulin chain: PDK1 activates it, and it stimulates the movement of GLUT4 to the plasma membrane. |
| `L18537` | `pack` | `` | The glucose transporter of muscle and fat cells. Insulin makes the vesicles that carry it fuse with the plasma membrane, so the cells take up glucose and the level of glucose in the blood falls. |
| `L18759` | `pack` | `` | The alpha subunit of the stimulatory G protein, Gs. With GTP bound it stimulates adenylate cyclase; its own GTPase activity turns the GTP into GDP and switches it off. |
| `L18764` | `pack` | `` | The alpha subunit of the inhibitory G protein, Gi. With GTP bound it inhibits adenylate cyclase. |
| `L18769` | `pack` | `` | The inhibitory receptor. Its effector activates Gi, which turns adenylate cyclase down; the stimulatory beta receptor, in contrast, activates Gs. |
| `L18774` | `pack` | `` | The kinase that uses ATP to put a phosphate on the cytoplasmic tail of the activated receptor. |
| `L18779` | `pack` | `` | The protein that binds the phosphorylated receptor. It blocks the receptor from acting on its G protein and favors the uptake of the receptor into the cell. |
| `L18784` | `pack` | `` | The enzyme that makes fructose 2,6-bisphosphate from fructose 6-phosphate and ATP. PKA phosphorylates it and lowers its activity. It is not phosphofructokinase-1, the enzyme of glycolysis that F2,6P activates. |
| `L18789` | `pack` | `` | The enzyme that breaks fructose 2,6-bisphosphate down to fructose 6-phosphate. PKA phosphorylates it and raises its activity. It is not fructose 1,6-bisphosphatase, the enzyme of gluconeogenesis. |
| `L18794` | `pack` | `` | A class I receptor tyrosine kinase with two cysteine-rich domains. It dimerizes when EGF binds and autophosphorylates tyrosines on its tail. |
| `L18799` | `pack` | `` | The adaptor protein that binds a phosphotyrosine of the EGF receptor and brings SOS to it. It binds through an SH2 domain. |
| `L18804` | `pack` | `` | SOS is carried to the receptor by GRB2 and makes RAS swap GDP for GTP, the role of a guanine nucleotide exchange factor. |
| `L18809` | `pack` | `` | A monomeric G protein like the G alpha subunit. RAS-GDP is inactive, GTP binding activates it, and it slowly cleaves GTP to GDP. Active RAS activates RAF and stimulates cell division. |
| `L18814` | `pack` | `` | The kinase that active RAS-GTP switches on. It activates MEK. |
| `L18819` | `pack` | `` | The kinase that RAF activates. It phosphorylates MAP kinase. |
| `L18824` | `pack` | `` | The kinase that MEK activates. It phosphorylates MNK, RSK and MYC. It is also called ERK. |
| `L18829` | `pack` | `` | A kinase that MAPK phosphorylates. In many diagrams it passes the signal to CREB; other references name MSK or RSK as the CREB kinases and give MNK the translation factor eIF4E. |
| `L18834` | `pack` | `` | A kinase that MAPK phosphorylates. In many diagrams it passes the signal to S6. |
| `L18839` | `pack` | `` | A protein that, once phosphorylated, switches on the expression of genes. CREB and MYC are transcription factors; S6 is not. |
| `L18844` | `pack` | `` | RAS with a point mutation at codon 12, 13 or 61, near its nucleotide site, which makes its GTPase far too slow and unable to respond to the proteins that speed it up. RAS is the most frequently mutated oncogene, but TP53 is mutated in more cancers. |
| `L18849` | `pack` | `` | Steroid hormones are nonpolar, so they cross the lipid bilayer by simple diffusion, with no carrier and no receptor on the outside. |
| `L18854` | `pack` | `` | The intracellular receptor of steroid hormones, labelled NR, which draws the glucocorticoid receptor (with a ligand-binding domain, LBD, and a DNA-binding domain, DBD). It rests in the cytoplasm bound to HSP; the hormone changes its shape, it dimerizes and, in the nucleus, it works as a transcription factor that binds the HRE. |
| `L18859` | `pack` | `` | The heat shock protein chaperone that holds the receptor in the cytoplasm. It is released when the hormone binds, and many diagrams label it Hsp70 or simply HSP. For the cytoplasmic steroid receptors the chaperone that is released is usually Hsp90, and Hsp70 helps to load it, so both names are accepted. |
| `L18864` | `pack` | `` | A large protein complex that forms a gateway through the double membrane of the nuclear envelope. The receptor dimer goes in through it and the mRNA comes out through it. |
| `L18869` | `pack` | `` | The enzyme that copies the target gene into mRNA. it assembles at the HRE with the receptor dimer and a coactivator (transcription activation). |
| `L18874` | `pack` | `` | The particle that reads the mRNA and joins amino acids into the new protein. |
| `L18902` | `pack` | `` | The coenzyme form of vitamin B6 and the group that carries amino groups in every transaminase. Its aldehyde on carbon 4 joins the amino group of an active-site lysine in a Schiff base. |
| `L18907` | `pack` | `` | The amino form of the coenzyme: it holds the amino group between the two halves of a transamination. The aldehyde of PLP has become CH₂-NH₃⁺. |
| `L18930` | `pack` | `` | The ring ester that glucose 6-phosphate dehydrogenase makes by oxidizing carbon 1 of glucose 6-phosphate. It is the first product of the pathway, and the lactonase opens its ring next. |
| `L18935` | `pack` | `` | The open-chain sugar acid with a phosphate on carbon 6. The next enzyme oxidizes it on carbon 3 and removes the carboxyl carbon as CO₂. |
| `L18940` | `pack` | `` | Ribose 5-phosphate with a pyrophosphate group on carbon 1, in the α form. The pyrophosphate is the leaving group when a base is attached by an N-glycosidic bond, in purine and pyrimidine synthesis and in the salvage of bases. |
| `L18945` | `pack` | `` | The simplest amino acid, with only a hydrogen as its side chain. In purine synthesis it supplies the backbone of the ring: C4, C5 and N7. |
| `L18950` | `pack` | `` | Ribose 5-phosphate with an amine on carbon 1, in the β form: the amide nitrogen of glutamine has replaced the pyrophosphate of PRPP. It is the first intermediate of purine synthesis and the source of N9 of the ring. |
| `L18955` | `pack` | `` | PRA with glycine joined to its amine through an amide bond. Glycine now stands on the sugar and will give C4, C5 and N7 of the ring. |
| `L18960` | `pack` | `` | GAR with a formyl group on the amino group of its glycine unit. The formyl carbon becomes C8 of the ring. |
| `L18965` | `pack` | `` | FGAR in which the amide oxygen has been replaced by an imine nitrogen, an amidine. That nitrogen comes from a second glutamine and becomes N3 of the ring. |
| `L18970` | `pack` | `` | The first ring of the purine: the five-membered imidazole ring closes when the formyl carbon is attacked by the amino nitrogen and water is lost. The sugar is on N9 of the final purine. |
| `L18975` | `pack` | `` | AIR with a carboxylate on carbon 4 of the imidazole ring. The carbon comes from CO₂ and becomes C6 of the purine. |
| `L18980` | `pack` | `` | CAIR with aspartate joined to its carboxylate by an amide bond. The aspartate nitrogen is N1 of the ring, and the rest of the aspartate leaves as fumarate in the next step. |
| `L18985` | `pack` | `` | The imidazole ring with a carboxamide on carbon 4 and an amino group on carbon 5, what is left when fumarate has been removed from SAICAR. The carboxamide nitrogen is N1 of the purine. |
| `L18990` | `pack` | `` | AICAR with a formyl group on its amino group. The formyl carbon becomes C2 of the ring, and the last ring closure follows. |
| `L18995` | `pack` | `` | The first complete purine nucleotide, with the base hypoxanthine on ribose 5-phosphate. IMP is the branch point: it becomes AMP through adenylosuccinate or GMP through xanthosine monophosphate. |
| `L19000` | `pack` | `` | The six-membered ring closed from carbamoyl aspartate by loss of water. It is a saturated ring, and dehydrogenation turns it into orotate. |
| `L19005` | `pack` | `` | The first true pyrimidine of the pathway: the ring has its double bond. Orotate is a base with a carboxylate and no sugar yet, and PRPP supplies the sugar next. |
| `L19010` | `pack` | `` | Orotate on ribose 5-phosphate, made when PRPP gives its sugar to orotate and the pyrophosphate leaves. The carboxylate of the orotate is lost in the next step. |
| `L19015` | `pack` | `` | The first pyrimidine nucleotide, uracil on ribose 5-phosphate. It is the parent of UTP, CTP and, through dUMP, thymidylate. |
| `L19020` | `pack` | `` | Proteases cut the proteins of a tissue into amino acids. |
| `L19025` | `pack` | `` | The removal of the amino group of an amino acid so that it leaves as NH₄⁺. In the cell this is mostly transamination to α-ketoglutarate followed by glutamate dehydrogenase. |
| `L19030` | `pack` | `` | The blood carries molecules from one tissue to another: lactate from muscle to liver and glucose back, alanine from muscle to liver. It is a movement and not a reaction, so no enzyme acts. |
| `L19035` | `pack` | `` | The pathway of the liver that builds glucose from pyruvate, lactate, alanine and glycerol. It spends six high-energy phosphate bonds per glucose, 4 ATP and 2 GTP. |
| `L19040` | `pack` | `` | The pathway of the liver that turns NH₄⁺ into urea for excretion. It starts with carbamoyl phosphate in the mitochondrial matrix and ends with arginase in the cytosol. |
| `L19045` | `pack` | `` | The enzyme that opens the ring ester of 6-phosphoglucono-δ-lactone with water and gives 6-phosphogluconate. |
| `L19050` | `pack` | `` | The enzyme of step 3: it oxidizes 6-phosphogluconate on carbon 3 and removes the carboxyl carbon as CO₂, which makes ribulose 5-phosphate and the second NADPH of the oxidative phase. |
| `L19055` | `pack` | `` | The enzyme that moves a three-carbon unit from sedoheptulose 7-phosphate to glyceraldehyde 3-phosphate. It makes erythrose 4-phosphate and fructose 6-phosphate. |
| `L19060` | `pack` | `` | The enzyme that moves the whole pyrophosphate group of ATP onto carbon 1 of ribose 5-phosphate, so that ATP becomes AMP and not ADP. It needs Mg²⁺. Pᵢ is an activator of the enzyme and not a reactant. |
| `L19065` | `pack` | `` | The enzyme of the first step of purine synthesis and its rate-limiting step, inhibited by GMP and AMP. It replaces the pyrophosphate of PRPP with the amide nitrogen of glutamine. |
| `L19070` | `pack` | `` | The enzyme that spends ATP to join glycine to the amine of PRA. |
| `L19075` | `pack` | `` | The enzyme that takes the formyl group of N10-formyl-THF and puts it on GAR. |
| `L19080` | `pack` | `` | The enzyme that uses ATP to turn the amide oxygen of FGAR into an imine with the amide nitrogen of glutamine. |
| `L19085` | `pack` | `` | The enzyme that closes the imidazole ring of AIR. ATP activates the formyl oxygen, which leaves as Pᵢ, so no free water is released. |
| `L19090` | `pack` | `` | The enzyme that adds CO₂ to carbon 4 of AIR. In humans it is one protein with SAICAR synthetase. |
| `L19095` | `pack` | `` | The enzyme that spends ATP to join aspartate to the carboxylate of CAIR. |
| `L19100` | `pack` | `` | The lyase that removes fumarate from SAICAR in purine synthesis and from adenylosuccinate on the way to AMP. It is one enzyme for both reactions. |
| `L19105` | `pack` | `` | The enzyme that takes the formyl group of N10-formyl-THF and puts it on AICAR. |
| `L19110` | `pack` | `` | The enzyme that closes the second ring of the purine with loss of water, which makes IMP. |
| `L19115` | `pack` | `` | The enzyme that closes the ring of carbamoyl aspartate in a condensation that releases H₂O. |
| `L19120` | `pack` | `` | The enzyme also called "DHO dehydrogenase". It oxidizes dihydroorotate to orotate with coenzyme Q as the electron acceptor; in humans it sits in the inner mitochondrial membrane. |
| `L19125` | `pack` | `` | The enzyme that puts the ribose phosphate of PRPP onto orotate and releases the pyrophosphate. |
| `L19130` | `pack` | `` | The enzyme that removes the carboxylate of OMP as CO₂ and makes UMP. |
| `L19135` | `pack` | `` | The amino acid whose amide nitrogen is the donor in the amidotransferase steps of purine and pyrimidine synthesis. It leaves as glutamate. |
| `L19140` | `pack` | `` | The amino acid that supplies the backbone of the purine ring (C4, C5 and N7). |
| `L19145` | `pack` | `` | The amino acid that gives N1 of the purine ring, and the backbone of the pyrimidine ring. |
| `L19150` | `pack` | `` | The four-carbon dicarboxylate that leaves when the lyases remove the carbon skeleton of aspartate; it can enter the TCA cycle. |
| `L19155` | `pack` | `` | The folate coenzyme that carries one-carbon units. It is made from the vitamin folate (B9) and recycled by vitamin B12. |
| `L19160` | `pack` | `` | THF carrying a formyl group on nitrogen 10. It gives the formyl carbons C2 and C8 of the purine ring. |
| `L19165` | `pack` | `` | The reduced form of coenzyme Q. Dihydroorotate dehydrogenase passes its electrons to coenzyme Q and makes QH₂, which the respiratory chain re-oxidizes. |
| `L19170` | `pack` | `` | IMP with the amino group of aspartate joined at C6 and the carbon skeleton of aspartate still hanging on it. Adenylosuccinate lyase cuts that skeleton off as fumarate, which leaves AMP. |
| `L19175` | `pack` | `` | IMP oxidized at C2: the base is xanthine, with oxo groups at C2 and C6. GMP synthetase replaces the new C2 oxo group with an amino group from glutamine. |
| `L19180` | `pack` | `` | The guanine nucleotide: XMP with an amino group at C2 in place of the oxo group. Kinases then make GDP and GTP from it, and GMP switches off the first step of purine synthesis. |
| `L19185` | `pack` | `` | UMP with a second phosphate, made by a kinase with ATP. It is the branch point towards the deoxy series: ribonucleotide reductase works on the diphosphate. |
| `L19190` | `pack` | `` | The uracil nucleotide ready for RNA synthesis and for glycogen synthesis (UDP-glucose). CTP synthetase turns it into CTP, and UTP switches off CPS II, the first enzyme of pyrimidine synthesis. |
| `L19195` | `pack` | `` | UTP with the C4 oxo group of uracil replaced by an amino group, which makes the base cytosine. The nitrogen comes from the amide of glutamine, and the step spends ATP. |
| `L19200` | `pack` | `` | UMP on a 2′-deoxyribose, with a hydrogen where the ribose has its 2′-OH. It is the substrate of thymidylate synthase, which puts a methyl group on C5 of the ring. |
| `L19205` | `pack` | `` | The thymine nucleotide of DNA: dUMP with a methyl group on C5 of the ring, on a deoxyribose. Kinases make dTDP and dTTP from it. A thymine nucleotide carries a deoxyribose, never a ribose. |
| `L19210` | `pack` | `` | THF carrying a one-carbon unit as a methylene bridge between N5 and N10. Thymidylate synthase takes that carbon, and two hydrogens of the pterin ring with it, to make the methyl of dTMP. Serine hydroxymethyltransferase makes it from THF and serine. |
| `L19215` | `pack` | `` | The oxidized folate left behind when the methylene group of N5,N10-methylene-THF has become the methyl group of dTMP: the pterin ring lost two hydrogens as well as the carbon. Dihydrofolate reductase makes THF from it again. |
| `L19220` | `pack` | `` | The reduced folate coenzyme, with the pterin ring saturated at N5, C6, C7 and N8. It is the form that can pick up a one-carbon unit again, from serine, and it is made from folate (vitamin B9) and from dihydrofolate by the same reductase. |
| `L19225` | `pack` | `` | The essential amino acid with a benzene ring in its side chain. Its breakdown starts with the hydroxylation of the ring, which makes tyrosine; when that step fails the amino acid builds up (phenylketonuria). |
| `L19230` | `pack` | `` | The keto acid of tyrosine: the amino group has gone to α-ketoglutarate, and the phenol ring and the pyruvate-like side chain are left. A dioxygenase rearranges it next. |
| `L19235` | `pack` | `` | A ring with two hydroxyl groups, para to each other, and an acetate side chain. The dioxygenase that made it also moved the side chain one position and lost the keto carbon as CO₂. It builds up and darkens the urine in alkaptonuria. |
| `L19240` | `pack` | `` | The ring of homogentisate opened by a second dioxygenase: an eight-carbon chain with two carboxylates, two ketones and a cis double bond. The isomerase turns that double bond trans. |
| `L19245` | `pack` | `` | The same chain as maleylacetoacetate with the double bond trans. A hydrolase cuts it between the two halves, which gives fumarate and acetoacetate. It builds up in tyrosinemia type I. |
| `L19250` | `pack` | `` | The four-carbon ketone body: a ketone at carbon 3 and a carboxylate. The breakdown of tyrosine and of leucine releases it, which is what makes those amino acids ketogenic. |
| `L19255` | `pack` | `` | The branched-chain amino acid with an isopropyl side chain (five carbons in all). Its breakdown ends in propionyl-CoA, so it is glucogenic. |
| `L19260` | `pack` | `` | The keto acid of valine: the carbon skeleton with a ketone where the amino group was. The branched-chain α-keto acid dehydrogenase complex removes its carboxyl carbon as CO₂ and puts the rest on coenzyme A. |
| `L19265` | `pack` | `` | The four-carbon branched thioester made from the keto acid of valine. It is dehydrogenated next, as an acyl-CoA is at the start of each round of beta-oxidation. |
| `L19270` | `pack` | `` | Isobutyryl-CoA with a double bond between its α carbon and the methylene carbon, made by an FAD dehydrogenase. Water adds across the double bond next. |
| `L19275` | `pack` | `` | The hydrated thioester: a hydroxyl group on the carbon that was the double-bond end. Unlike beta-oxidation, the pathway now takes the coenzyme A off, by hydrolysis, before the oxidation. |
| `L19280` | `pack` | `` | The free hydroxy acid of the valine route, the only intermediate of the three branched chains that is not on coenzyme A. An NAD⁺ dehydrogenase oxidizes its alcohol to an aldehyde. |
| `L19285` | `pack` | `` | A three-carbon chain with an aldehyde at one end, a carboxylate at the other and a methyl group in between. Its aldehyde is oxidized onto coenzyme A while the carboxyl carbon leaves as CO₂, which gives propionyl-CoA. |
| `L19290` | `pack` | `` | The three-carbon thioester at the end of the valine and isoleucine routes (and of odd-chain fatty acids). Propionyl-CoA carboxylase and methylmalonyl-CoA mutase turn it into succinyl-CoA, so these carbons can make glucose. |
| `L19295` | `pack` | `` | The branched-chain amino acid with a sec-butyl side chain (six carbons in all, two of them chiral). Its breakdown gives propionyl-CoA and acetyl-CoA, so it is both glucogenic and ketogenic. |
| `L19300` | `pack` | `` | The keto acid of isoleucine: a six-carbon chain with the ketone at carbon 2 and the methyl branch at carbon 3. The branched-chain α-keto acid dehydrogenase complex turns it into a five-carbon acyl-CoA. |
| `L19305` | `pack` | `` | The five-carbon branched thioester made from the keto acid of isoleucine, with the methyl branch on the α carbon. A dehydrogenase makes a double bond between carbons 2 and 3 next. |
| `L19310` | `pack` | `` | 2-Methylbutyryl-CoA with a trans double bond between carbons 2 and 3, the product of an FAD dehydrogenase. Water adds across the double bond next, as in beta-oxidation. |
| `L19315` | `pack` | `` | The hydrated thioester of the isoleucine route: a hydroxyl group on carbon 3 beside the methyl branch on carbon 2. An NAD⁺ dehydrogenase oxidizes the alcohol to a ketone next. |
| `L19320` | `pack` | `` | The β-keto thioester of the isoleucine route, with a methyl group on the α carbon. A thiolase cuts it between carbons 2 and 3 with a second coenzyme A, which gives acetyl-CoA and propionyl-CoA. |
| `L19325` | `pack` | `` | The branched-chain amino acid with an isobutyl side chain (six carbons in all). Its breakdown gives acetyl-CoA and acetoacetate and no glucose precursor, so it is purely ketogenic. |
| `L19330` | `pack` | `` | The keto acid of leucine: a six-carbon chain with the ketone at carbon 2 and the methyl branch at carbon 4. The branched-chain α-keto acid dehydrogenase complex turns it into isovaleryl-CoA. |
| `L19335` | `pack` | `` | The five-carbon branched thioester made from the keto acid of leucine, with the methyl branch on carbon 3. A dehydrogenase of its own makes a double bond between carbons 2 and 3 next; when that enzyme fails, isovaleric acid builds up (isovaleric acidemia). |
| `L19340` | `pack` | `` | Isovaleryl-CoA with a double bond between carbons 2 and 3, the product of an FAD dehydrogenase. Here the leucine route leaves the beta-oxidation pattern: the next step is a carboxylation, not a hydration. |
| `L19345` | `pack` | `` | 3-Methylcrotonyl-CoA with a carboxylate added to the methyl carbon, by a biotin carboxylase that spends ATP and takes up bicarbonate. The double bond stays, and water adds across it next. |
| `L19350` | `pack` | `` | The six-carbon thioester with a hydroxyl and a methyl group on carbon 3, made when water adds to the double bond of 3-methylglutaconyl-CoA. HMG-CoA lyase splits it into acetoacetate and acetyl-CoA; the same molecule is the branch point of ketone body and cholesterol synthesis. |
| `L19355` | `pack` | `` | The enzyme that joins the amino group of aspartate to C6 of IMP and spends GTP, not ATP, to do it: GTP becomes GDP and Pᵢ. The purine route to AMP is paid for with GTP and the route to GMP with ATP, which keeps the two nucleotides in balance. |
| `L19360` | `pack` | `` | The enzyme that oxidizes C2 of IMP with NAD⁺ and water, which makes XMP and NADH. It is the rate-limiting step towards GMP, and GMP inhibits it. |
| `L19365` | `pack` | `` | The enzyme that puts the amide nitrogen of glutamine on C2 of XMP and spends ATP to AMP and PPᵢ. An old name for it is transamidinase; GMP synthetase is the name in use. |
| `L19370` | `pack` | `` | The kinase that moves a phosphate from ATP onto UMP, which gives UDP (it does the same for CMP). A second kinase, nucleoside diphosphate kinase, then makes the triphosphate. |
| `L19375` | `pack` | `` | The enzyme that turns UTP into CTP: it spends ATP to activate C4 of the uracil ring and puts the amide nitrogen of glutamine there. The cytosine nucleotide is made at the triphosphate level, not from UMP. |
| `L19380` | `pack` | `` | The enzyme that methylates C5 of dUMP to make dTMP. The carbon comes from N5,N10-methylene-THF as a methylene group, and the folate also gives two hydrogens, so it leaves as dihydrofolate. It is the only reaction of the cell that makes thymidylate from scratch. |
| `L19385` | `pack` | `` | The enzyme that reduces 7,8-dihydrofolate back to tetrahydrofolate with NADPH. Without it the folate pool would be stuck as dihydrofolate after one round of thymidylate synthesis, and no new dTMP could be made. |
| `L19390` | `pack` | `` | The monooxygenase that puts one atom of O₂ on the ring of phenylalanine, para to the side chain, and makes tyrosine; the other oxygen atom ends up in water. Tetrahydrobiopterin gives the electrons and is oxidized to dihydrobiopterin. Its loss causes phenylketonuria. |
| `L19395` | `pack` | `` | The PLP transaminase that moves the amino group of tyrosine onto α-ketoglutarate, which gives glutamate and the keto acid 4-hydroxyphenylpyruvate. Its deficiency is tyrosinemia type II. |
| `L19400` | `pack` | `` | The dioxygenase that puts both atoms of O₂ into 4-hydroxyphenylpyruvate: it hydroxylates the ring, moves the side chain one position along it and releases the keto carbon as CO₂, which gives homogentisate. Its full name is 4-hydroxyphenylpyruvate dioxygenase (4-hydroxyphenylpyruvate, not phenylalaninepyruvate). Nitisinone blocks it to treat tyrosinemia type I. |
| `L19405` | `pack` | `` | The iron dioxygenase that opens the ring of homogentisate with O₂, which gives maleylacetoacetate. When it is missing, homogentisate is excreted and darkens on standing: alkaptonuria, the first disease traced to a single enzyme. |
| `L19410` | `pack` | `` | The glutathione-dependent isomerase that turns the cis double bond of maleylacetoacetate into the trans double bond of fumarylacetoacetate. It belongs to the glutathione transferase family (GSTZ1), and glutathione is its cofactor, not a reactant. |
| `L19415` | `pack` | `` | The hydrolase that cuts fumarylacetoacetate with water into fumarate and acetoacetate, the last step of the route. Its deficiency is tyrosinemia type I, in which fumarylacetoacetate and its by-product succinylacetone build up. |
| `L19420` | `pack` | `` | The PLP transaminase shared by valine, isoleucine and leucine: it moves their amino group onto α-ketoglutarate, which gives glutamate and the branched-chain α-keto acid. It works mostly in muscle, which is why the branched-chain amino acids escape the liver after a meal. |
| `L19425` | `pack` | `` | The multienzyme complex shared by the three keto acids: it removes the carboxyl carbon as CO₂, oxidizes the rest with NAD⁺ and puts it on coenzyme A, with the same five coenzymes (TPP, lipoate, FAD, NAD⁺, CoA) as pyruvate dehydrogenase. When it fails the keto acids spill into the urine, which smells of maple syrup (maple syrup urine disease). |
| `L19430` | `pack` | `` | The FAD dehydrogenase of the valine route: it takes two hydrogens from isobutyryl-CoA and makes the double bond of methacrylyl-CoA, as acyl-CoA dehydrogenase does at the start of a round of beta-oxidation. |
| `L19435` | `pack` | `` | The hydrolase that cuts the thioester of 3-hydroxyisobutyryl-CoA with water and sets coenzyme A free, so the next two oxidations of the valine route work on a free acid. It is the step that keeps the reactive methacrylyl-CoA from building up. |
| `L19440` | `pack` | `` | The NAD⁺ dehydrogenase that oxidizes the alcohol of 3-hydroxyisobutyrate to the aldehyde of methylmalonate semialdehyde. |
| `L19445` | `pack` | `` | The acylating aldehyde dehydrogenase at the end of the valine route: it oxidizes the aldehyde of methylmalonate semialdehyde onto coenzyme A with NAD⁺ and releases the carboxyl carbon as CO₂, which gives propionyl-CoA. |
| `L19450` | `pack` | `` | The FAD dehydrogenase of the isoleucine route: it takes two hydrogens from 2-methylbutyryl-CoA and makes the trans double bond of tiglyl-CoA. |
| `L19455` | `pack` | `` | The NAD⁺ dehydrogenase of the isoleucine route that oxidizes the alcohol of 2-methyl-3-hydroxybutyryl-CoA to the ketone of 2-methylacetoacetyl-CoA. It is the branched-chain counterpart of the 3-hydroxyacyl-CoA dehydrogenase of beta-oxidation, which is accepted here too. |
| `L19460` | `pack` | `` | The mitochondrial thiolase (T2, ACAT1) that cuts 2-methylacetoacetyl-CoA with a second coenzyme A into acetyl-CoA and propionyl-CoA, the end of the isoleucine route. It is the same thiolase that splits acetoacetyl-CoA when ketone bodies are used, and the β-ketoacyl-CoA thiolase of beta-oxidation is accepted here too. |
| `L19465` | `pack` | `` | The FAD dehydrogenase of the leucine route: it takes two hydrogens from isovaleryl-CoA and makes the double bond of 3-methylcrotonyl-CoA. Its deficiency is isovaleric acidemia. |
| `L19470` | `pack` | `` | The biotin enzyme of the leucine route: it spends ATP to fix bicarbonate onto the methyl carbon of 3-methylcrotonyl-CoA, which gives 3-methylglutaconyl-CoA. Like the other biotin carboxylases (pyruvate carboxylase, acetyl-CoA carboxylase, propionyl-CoA carboxylase) it carries the CO₂ on biotin. |
| `L19475` | `pack` | `` | The hydratase that adds water across the double bond of 3-methylglutaconyl-CoA, which gives HMG-CoA. The hydroxyl ends up on carbon 3, beside the methyl group. |
| `L19480` | `pack` | `` | The lyase that splits HMG-CoA into acetoacetate and acetyl-CoA, the end of the leucine route and also the last step of ketone body synthesis in the liver. Nothing is oxidized or reduced: a carbon-carbon bond is cut. |
| `L19485` | `pack` | `` | The reduced pterin that gives phenylalanine hydroxylase its two electrons. It is a cousin of tetrahydrofolate (the same pterin ring) and is oxidized to dihydrobiopterin in the reaction; dihydropteridine reductase restores it with NADH. |
| `L19490` | `pack` | `` | The oxidized pterin left after phenylalanine hydroxylase has used the electrons of tetrahydrobiopterin (it forms through a 4a-hydroxy intermediate). Dihydropteridine reductase reduces it back with NADH. |
| `L21980` | `pack` | `` | The totals for the whole cycle are 18 ATP and 12 NADPH per glucose; one turn of 3 CO |
| `L22009` | `pack` | `` | With 2 ATP equivalents for each of the 6 CO |
| `L22115` | `pack` | `` | Four high-energy phosphate bonds are spent for each urea. Books often say 3 ATP, because three ATP are split in all and one of them goes to AMP and PPᵢ, which spends two bonds. The fumarate that argininosuccinate lyase releases can give 1 NADH (fumarase and malate dehydrogenase, in the cytosol); it is not counted here, and the amino acid scenarios book it as part of their nitrogen model. |
| `L22208` | `pack` | `` | ATP is spent at three steps, 2, 4 and 7 (counting PRPP to phosphoribosylamine as step 1). The ring closure of step 5 needs ATP too. The amino acids, CO₂ and N10-formyl-THF are taken as given, so what they cost is not counted. Turning IMP into AMP spends a GTP and into GMP an ATP that becomes AMP. |
| `L22242` | `pack` | `` | The other steps (ATCase, dihydroorotase, DHO dehydrogenase, orotate phosphoribosyltransferase and OMP decarboxylase) spend no ATP. DHO dehydrogenase does pass electrons to coenzyme Q, which is worth about 1.5 ATP in the respiratory chain at the modern value; that is not counted here. Turning UMP into UTP and CTP spends more. |
