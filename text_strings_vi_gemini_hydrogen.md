# Khai Báo Toàn Bộ Chuỗi Text Tiếng Anh (Bản Dịch Tiếng Việt - Giữ Thuật Ngữ Chuyên Ngành)

Tài liệu này tổng hợp và dịch các chuỗi văn bản trong dự án `Biochemical Pathways Game` (`pathway_quiz.html`) sang Tiếng Việt, đồng thời giữ nguyên các thuật ngữ chuyên ngành hóa sinh để phục vụ đối soát và bản địa hóa (i18n/l10n).

---

## 1. Giao Diện Người Dùng, Điều Hướng & Thông Báo Hệ Thống (UI Labels & System Strings)

### 1.1 Thương hiệu & Tiêu đề chung (Brand & Headers)
| Khóa / Ngữ cảnh | Bản dịch Tiếng Việt | Ghi chú ngữ nghĩa |
| :--- | :--- | :--- |
| `app.title` | `Pathway Quiz` | Tên ứng dụng trên thanh tab & header |
| `app.author` | `Benjamin E. Peterson` | Tác giả |
| `app.copyright` | `Bản quyền (c) 2026 Benjamin E. Peterson. Bảo lưu mọi quyền.` | Thông tin bản quyền |
| `app.license_notice` | `Miễn phí sử dụng cho mục đích tự học và giảng dạy; xem LICENSE.` | Điều khoản sử dụng |
| `brand.tagline` | `Học các metabolic pathways bằng cách tự xây dựng chúng.` | Khẩu hiệu trên menu |
| `menu.advanced_btn` | `Nâng cao` | Nút kích hoạt con đường nâng cao |
| `menu.advanced_desc` | `Photosynthesis, cell signaling và nucleotides với các bài kiểm tra riêng, và mục Everything sẽ tổng hợp mọi pathway.` | Mô tả con đường nâng cao |

### 1.2 Chế độ chơi & Định dạng Quiz (Game Modes & Formats)
| Khóa chế độ | Tên hiển thị (Display Name) | Mô tả cách chơi |
| :--- | :--- | :--- |
| `mode.build` | `Xây dựng (Build)` | Dựng bản đồ từng bước, trả lời một câu hỏi mỗi lần |
| `mode.pick` | `Điền vào bản đồ` | Bản đồ khuyết với 6 phương án trắc nghiệm cho mỗi ô |
| `mode.type` | `Điền vào chỗ trống` | Bản đồ khuyết tự gõ bàn phím chính xác tên chất |
| `mode.practice` | `Luyện tập các bước yếu` | Chế độ luyện tập chuyên biệt các bước hay làm sai |
| `format.names` | `tên chất` | Hiển thị tên văn bản của phân tử |
| `format.structures` | `công thức cấu tạo` | Hiển thị công thức cấu tạo hóa học 2D |
| `format.mixed` | `kết hợp` | Kết hợp cả tên và cấu trúc |

### 1.3 Nút bấm & Điều khiển điều hướng (Buttons & Action Controls)
| Vị trí / Component | Text hiển thị (Tiếng Việt) | Chức năng |
| :--- | :--- | :--- |
| Main Menu | `Chơi` | Bắt đầu chơi con đường đã chọn |
| Navigation | `Quay lại Menu` / `Quay lại menu` | Thoát về màn hình danh mục chính |
| Navigation | `Tổng quan khóa học` | Xem tổng quan các chặng trong lộ trình |
| Results Screen | `Chơi lại` | Chơi lại con đường vừa xong |
| Results Screen | `Thử chế độ khó hơn` | Thử thách mức độ khó hơn (Build -> Pick -> Type) |
| Results Screen | `Luyện tập các bước làm sai` | Ôn lại chỉ những bước vừa làm sai |
| Results Screen | `Xem lại bản đồ` | Xem lại toàn bộ bản đồ hoàn chỉnh kèm chú giải |
| Quiz Controls | `Gợi ý` | Yêu cầu một gợi ý |
| Quiz Controls | `Tiết lộ` | Tiết lộ đáp án (tính là một lỗi sai) |
| Quiz Controls | `Xóa` | Xóa nét vẽ hoặc ô nhập liệu |
| Quiz Controls | `Nộp bài` | Nộp câu trả lời |
| Canvas Controls | `Phóng to` | Phóng to bản đồ |
| Canvas Controls | `Thu nhỏ` | Thu nhỏ bản đồ |
| Canvas Controls | `Đặt lại góc nhìn` | Đưa bản đồ về vị trí trung tâm |
| Modal | `Đóng` | Đóng hộp thoại |

### 1.4 Thiết lập ứng dụng (Settings & Preferences)
| Mục cài đặt | Nhãn / Tùy chọn (Tiếng Việt) | Mô tả tính năng |
| :--- | :--- | :--- |
| Settings Title | `Cài đặt` | Tiêu đề hộp thoại cài đặt |
| Theme Option 1 | `Sáng` | Giao diện nền sáng |
| Theme Option 2 | `Tối` | Giao diện nền tối bảo vệ mắt |
| Theme Option 3 | `Tự động` | Tự động thích ứng theo hệ điều hành thiết bị |
| Cofactors Setting | `Cofactors` | Bật/tắt việc hỏi ATP, ADP, NAD⁺, H₂O trong bài thi |
| Animations Setting | `Giảm chuyển động` | Giảm các hiệu ứng chuyển động rung lắc |

### 1.5 Kết quả, Đánh giá & Thống kê (Results & Feedback Metrics)
| Nhãn thống kê | Chuỗi Text Tiếng Việt | Ý nghĩa |
| :--- | :--- | :--- |
| Score Ring | `Điểm` | Điểm số phần trăm độ chính xác (%) |
| Stat Right | `đúng` | Số bước trả lời đúng |
| Stat Wrong | `sai` | Số bước trả lời sai |
| Stat Time | `thời gian` | Thời gian hoàn thành (mm:ss) |
| Stat Hints | `gợi ý` | Số lần người dùng bấm trợ giúp Gợi ý |
| Stat Revealed | `đã tiết lộ` | Số lần người dùng bấm Tiết lộ đáp án |
| Feedback Toast | `Chưa có dữ liệu để hiển thị` | Thông báo khi chưa có dữ liệu chi tiết |

## 2. Câu Hỏi Quiz & Mẫu Gợi Ý (Prompts & Hint Templates)

| Mã Prompt | Chuỗi Text Tiếng Việt | Ngữ cảnh sử dụng |
| :--- | :--- | :--- |
| `product` | `Product của bước này là gì?` | Hỏi chất sản phẩm chính của bước |
| `productOne` | `Nêu tên một product của bước này.` | Hỏi 1 trong nhiều sản phẩm |
| `productOther` | `Nêu tên product còn lại.` | Hỏi sản phẩm còn lại |
| `substrate` | `Substrate còn thiếu là gì?` | Hỏi chất phản ứng / cơ chất đầu vào |
| `consumeOne` | `Nêu tên một chất mà bước này tiêu thụ.` | Hỏi chất bị tiêu thụ |
| `consumeMore` | `Bước này còn tiêu thụ thêm chất nào khác?` | Hỏi chất phụ bị tiêu thụ thêm |
| `enz` | `Enzyme nào xúc tác bước này?` | Hỏi tên enzyme xúc tác |
| `cof` | `Cần cofactor nào?` | Hỏi coenzyme hoặc đồng yếu tố |
| `direction` | `Phản ứng này diễn ra theo chiều thuận, chiều nghịch, hay cả hai chiều?` | Hỏi tính thuận nghịch của phản ứng |

## 3. Danh Mục 22+ Con Đường Chuyển Hóa & Khóa Học (Pathways & Courses)

| Mã ID | Tiêu đề (Title) | Tag | Phụ đề (Subtitle / Description) |
| :--- | :--- | :--- | :--- |
| `glycolysis` | **Glycolysis** | `GLY` | Glucose thành pyruvate |
| `lactate` | **Lactic Acid Fermentation** | `LAC` | Glucose thành lactate không cần oxygen |
| `glycogen` | **Glycogen Metabolism** | `GLG` | Tổng hợp và phân giải glycogen |
| `gluconeogenesis` | **Gluconeogenesis** | `GNG` | Pyruvate quay lại thành glucose |
| `ethanol` | **Alcohol Fermentation** | `ETH` | Glucose thành ethanol không cần oxygen |
| `pdhtca` | **Pyruvate to CO₂** | `PDH` | Pyruvate dehydrogenase và TCA cycle |
| `betaox` | **Beta-Oxidation** | `FAO` | Chất béo thành acetyl-CoA |
| `boxsimple` | **Beta-Oxidation, Simple** | `BOS` | Chu trình bốn bước cắt chất béo thành acetyl-CoA |
| `etc` | **Electron Transport Chain** | `ETC` | NADH và FADH₂ tạo oxygen và ATP |
| `etcsimple` | **Electron Transport, Simple** | `ETS` | NADH và FADH₂ tới oxygen, sau đó tạo ATP |
| `tca` | **TCA Cycle** | `TCA` | Acetyl-CoA thành CO₂ |
| `full` | **Glucose to CO₂** | `FULL` | Glycolysis, link reaction và TCA cycle |
| `etcpath` | **Electron Carriers in Order** | `ETP` | NADH tới oxygen, lần lượt qua từng electron carrier |
| `gpshuttle` | **Glycerol Phosphate Shuttle** | `GPS` | Electron từ cytosolic NADH tới ubiquinone |
| `masshuttle` | **Malate-Aspartate Shuttle** | `MAS` | Electron từ cytosolic NADH thành matrix NADH |
| `antport` | **ATP Synthesis and Export** | `ANT` | ATP synthase và ATP-ADP translocase |
| `pyrentry` | **Pyruvate Entry and Link Reaction** | `PYE` | Qua hai lớp màng để tạo acetyl-CoA |
| `mitodyn` | **Mitochondrial Fission and Fusion** | `MDY` | Cách ty thể phân chia và dung hợp |
| `apopint` | **Apoptosis: Intrinsic Pathway** | `AIN` | Con đường ty thể dẫn đến chết tế bào |
| `apopext` | **Apoptosis: Extrinsic Pathway** | `AEX` | Con đường death receptor dẫn đến chết tế bào |
| `urea` | **Urea Cycle** | `URE` | Ammonia thành urea |
| `gluala` | **Glutamate and Alanine** | `GLA` | Bắt giữ và giải phóng ammonium, cùng các transaminases |
| `carbs` | **Carbohydrates** | `` |  |
| `lipids` | **Lipids** | `` |  |
| `aminoacids` | **Amino acids** | `` |  |
| `cellbio` | **Mitochondrial dynamics and apoptosis** | `` |  |
| `everything-carbs` | **Everything: Carbohydrates** | `ALL` | Glycolysis, fermentation, gluconeogenesis và glycogen trên một bản đồ |
| `fermentations` | **Glycolysis and fermentation** | `FER` |  |
| `everything-tca` | **Everything: TCA cycle** | `ALL` | Glucose thành CO₂ và quá trình pyruvate đi vào ty thể trên một bản đồ |
| `everything-etc` | **Everything: Electron transport chain** | `ALL` | Chuỗi vận chuyển, các electron carriers, xuất khẩu ATP và hai shuttles trên một bản đồ |
| `everything-lipids` | **Everything: Lipids** | `ALL` | Beta-oxidation trên một bản đồ |
| `everything-aminoacids` | **Everything: Amino acids** | `ALL` | Glutamate, alanine và urea cycle trên một bản đồ |
| `everything-cellbio` | **Everything: Mitochondrial dynamics and apoptosis** | `ALL` | Fission, fusion và hai con đường apoptosis trên một bản đồ |
| `everything-all` | **Everything: All pathways** | `ALL` | Tất cả hai mươi pathways trên một bản đồ |
| `gly` | **Glycolysis** | `` |  |
| `link` | **Pyruvate to acetyl-CoA** | `` |  |
| `act` | **Activation** | `` |  |
| `box` | **Beta-oxidation** | `` |  |
| `db` | **Double bonds** | `` |  |
| `read` | **Đọc cấu trúc** | `` |  |

## 4. Tóm Tắt & Cân Bằng Chuyển Hóa (Pathway Net Summaries)

### SUMMARY_GLY
- Thu được ròng trên mỗi glucose: 2 pyruvate, 2 ATP, 2 NADH, 2 H₂O',
- ATP: tiêu tốn 2 (bước 1 và 3), tạo ra 4 (bước 7 và 10, mỗi triose một lần)',
- Glucose + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 Pyruvate + 2 NADH + 2 ATP + 2 H⁺ + 2 H₂O',
- Các điểm kiểm soát: hexokinase, phosphofructokinase-1 và pyruvate kinase xúc tác ba bước bất thuận nghịch. Chúng được điều hòa bởi allosteric effectors, covalent modification và gene transcription, trong đó ATP là chất điều hòa chính

### SUMMARY_TCA
- Trên mỗi acetyl-CoA: 2 CO₂, 3 NADH, 1 FADH₂, 1 GTP',
- CO₂ tách ra tại isocitrate dehydrogenase và α-ketoglutarate dehydrogenase; nước được sử dụng tại citrate synthase và fumarase',
- Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pᵢ + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + 2 H⁺ + CoA-SH',
- Năm trong số chín phản ứng, tính cả link reaction, được xúc tác bởi các dehydrogenases. Các điểm kiểm soát: pyruvate dehydrogenase complex, citrate synthase, isocitrate dehydrogenase và α-ketoglutarate dehydrogenase complex; ATP và NADH ức chế chúng, còn ADP và NAD⁺ kích thích isocitrate dehydrogenase

### SUMMARY_GLYCOGEN
- Tổng hợp: glucose 6-phosphate → glucose 1-phosphate → UDP-glucose → glycogen. Mỗi phân tử glucose gắn thêm tiêu tốn một UTP, tương đương một ATP (UDP được tái phosphoryl hóa bởi nucleoside diphosphate kinase, và sự phân cắt pyrophosphate kéo bước hoạt hóa tiến về phía trước).',
- Phân giải: glycogen phosphorylase sử dụng Pᵢ, nên mỗi glucose tách ra ở dạng glucose 1-phosphate mà không tốn ATP',
- Tổng hợp và phân giải sử dụng các enzymes khác nhau, nhờ đó chúng có thể được điều hòa độc lập

### SUMMARY_GNG
- Phương trình tổng: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺',
- Bảy enzymes của glycolysis hoạt động theo cả hai chiều; bốn bypass enzymes (pyruvate carboxylase, PEP carboxykinase, fructose-1,6-bisphosphatase, glucose-6-phosphatase) đi vòng qua các bước bất thuận nghịch',
- Sáu liên kết phosphate giàu năng lượng bị tiêu tốn cho mỗi glucose, so với hai liên kết thu được trong glycolysis

### SUMMARY_ETOH
- Thu được ròng trên mỗi glucose: 2 ethanol, 2 CO₂ và 2 ATP (tạo ra 4, tiêu tốn 2)',
- Glucose + 2 ADP + 2 Pᵢ + 2 H⁺ → 2 Ethanol + 2 CO₂ + 2 ATP + 2 H₂O',
- Alcohol dehydrogenase tái oxy hóa 2 NADH được tạo ra ở bước glyceraldehyde 3-phosphate dehydrogenase, giúp glycolysis tiếp tục diễn ra mà không cần oxygen

### SUMMARY_PDHTCA
- Trên mỗi pyruvate: 3 CO₂, 4 NADH, 1 FADH₂ và 1 GTP (1 NADH đến từ link reaction)',
- Trên mỗi glucose, vốn tạo ra 2 pyruvate: thu được 6 CO₂, 8 NADH, 2 FADH₂ và 2 GTP từ phần này của pathway

### SUMMARY_BETAOX
- Mỗi vòng xoắn tạo ra 1 FADH₂, 1 NADH và 1 acetyl-CoA, đồng thời rút ngắn fatty acyl-CoA đi 2 carbons',
- Palmitoyl-CoA (16 carbons) cần 7 vòng: thu được 7 FADH₂, 7 NADH và 8 acetyl-CoA',
- Quá trình hoạt hóa tiêu tốn hai liên kết phosphate giàu năng lượng (ATP bị cắt thành AMP và PPᵢ)

### SUMMARY_LAC
- Thu được ròng trên mỗi glucose: 2 lactate và 2 ATP (tạo ra 4, tiêu tốn 2)',
- Glucose + 2 ADP + 2 Pᵢ → 2 Lactate + 2 ATP + 2 H₂O',
- Lactate dehydrogenase chuyển 2 NADH được tạo ra ở bước glyceraldehyde 3-phosphate dehydrogenase trở lại thành NAD⁺, giúp glycolysis tiếp tục chạy mà không cần oxygen

### SUMMARY_ETC
- Trên mỗi NADH: khoảng 10 H⁺ được bơm (4 tại Complex I, 4 tại Complex III, 2 tại Complex IV), đủ cho khoảng 2.5 ATP',
- Trên mỗi FADH₂: khoảng 6 H⁺ được bơm (Complex II không bơm proton), đủ cho khoảng 1.5 ATP',
- Tổng quát: NADH + H⁺ + ½ O₂ → NAD⁺ + H₂O, với khoảng 4 H⁺ đi qua ATP synthase cho mỗi ATP được tổng hợp

### SUMMARY_ETCSIMPLE
- Electrons đi vào tại Complex I (từ NADH) hoặc tại Complex II (từ FADH₂), tới ubiquinone, rồi đi qua Complex III, cytochrome c và Complex IV tới oxygen để tạo thành nước',
- Trên mỗi NADH có khoảng 10 H⁺ được bơm ra khỏi matrix (4 tại Complex I, 4 tại Complex III, 2 tại Complex IV); Complex II không bơm, nên FADH₂ tạo ra khoảng 6 H⁺',
- ATP synthase cho các protons quay trở lại và tổng hợp ATP: khoảng 2.5 ATP trên mỗi NADH và 1.5 ATP trên mỗi FADH₂ (chỉ số P/O ratios)

### SUMMARY_BOXSIMPLE
- Mỗi vòng của chu trình gồm bốn bước: oxy hóa (FAD), cộng nước, oxy hóa lần nữa (NAD⁺), sau đó cắt bỏ hai carbons dưới dạng acetyl-CoA',
- Mỗi vòng tạo ra 1 FADH₂, 1 NADH và 1 acetyl-CoA, làm mạch carbon ngắn đi 2 carbons',
- Palmitic acid (16 carbons) cần 7 vòng: thu được 7 FADH₂, 7 NADH và 8 acetyl-CoA',
- Quá trình hoạt hóa tốn 2 ATP tương đương (ATP thành AMP và PPᵢ); ATP Calculator sẽ cộng tất cả lại (106 ATP cho palmitic acid)

### SUMMARY_FULL
- Glucose bị oxy hóa hoàn toàn thành 6 CO₂',
- Trên mỗi glucose: thu được 10 NADH, 2 FADH₂ và 4 ATP hoặc GTP ròng từ substrate-level phosphorylation (glycolysis tạo 4 và tiêu tốn 2, chu trình tạo 2 GTP)',
- Glycolysis cho 2 pyruvate, link reaction cho 2 acetyl-CoA, và chu trình quay hai lần',
- Theo các con số làm tròn 3 ATP trên mỗi NADH và 2 trên mỗi FADH₂, hiệu suất là 36 ATP ở tế bào vận chuyển hai cytosolic NADH vào trong bằng glycerol phosphate shuttle (38 ATP với malate-aspartate shuttle, và 38 ATP ở vi khuẩn vì không cần shuttle)',
- Theo con số thực tế hơn là 2.5 ATP trên mỗi NADH và 1.5 trên mỗi FADH₂, hiệu suất là khoảng 30 ATP với glycerol phosphate shuttle và khoảng 32 ATP với malate-aspartate shuttle (10 H⁺ trên mỗi NADH và khoảng 4 H⁺ trên mỗi ATP cho 2.5, đồng thời rò rỉ và các mục đích sử dụng gradient khác làm giảm hiệu suất thêm nữa)

### SUMMARY_ETCPATH
- Electrons đi qua các carriers theo thứ tự redox potential nhìn chung tăng dần, từ NADH (khoảng −0.32 V) tới oxygen (khoảng +0.82 V)',
- Các Complexes I, III và IV bơm protons: 4 H⁺ tại Complex I, 4 tại Complex III và 2 tại Complex IV, tổng cộng 10 H⁺ cho mỗi NADH',
- Flavins và ubiquinone vận chuyển hai electrons và hai protons, các iron-sulfur centers vận chuyển một electron, và cytochromes vận chuyển một electron qua sắt của nhân heme (Fe³⁺ sang Fe²⁺)',
- Rotenone ức chế Complex I, antimycin A ức chế Complex III, còn cyanide và carbon monoxide ức chế Complex IV

### SUMMARY_GPSHUTTLE
- NADH không thể đi qua màng trong (inner membrane), nên electrons của nó được đưa vào bằng một shuttle',
- Trong glycerol phosphate shuttle, electrons kết thúc trên FADH₂ và đi vào chuỗi tại ubiquinone, bỏ qua Complex I, nên mỗi cytosolic NADH chỉ tạo khoảng 1.5 ATP thay vì 2.5

### SUMMARY_MASHUTTLE
- Malate-aspartate shuttle trả lại electrons của cytosolic NADH dưới dạng NADH trong matrix, nên chúng đi vào tại Complex I (khoảng 2.5 ATP cho mỗi NADH)',
- Shuttle này cần malate dehydrogenase và aspartate aminotransferase ở cả trong matrix lẫn phía bên kia màng trong (cytosol và intermembrane space), cùng một malate-α-ketoglutarate antiporter và một glutamate-aspartate antiporter',
- Glutamate-aspartate antiporter được thúc đẩy bởi điện thế màng (membrane potential), nên shuttle chỉ chạy theo một chiều duy nhất

### SUMMARY_ANTPORT
- ATP và ADP không khuếch tán tự do qua màng trong: ATP-ADP translocase trao đổi chúng theo tỉ lệ một đổi một',
- ATP mang nhiều hơn ADP một điện tích âm, nên điện thế màng dương làm ATP rời khỏi matrix nhanh hơn khoảng 30 lần so với ADP',
- Khoảng một phần tư năng lượng của chuỗi vận chuyển được dùng để duy trì điện thế màng thúc đẩy sự trao đổi này

### SUMMARY_PYRENTRY
- Pyruvate đi qua màng ngoài qua các kênh porin và đi qua màng trong trên H⁺/pyruvate symporter, được thúc đẩy bởi proton gradient của electron transport chain',
- Link reaction trong matrix tạo ra acetyl-CoA, CO₂ và NADH; coenzyme A được cấu tạo từ vitamin pantothenic acid (vitamin B5), và nguyên tử lưu huỳnh của nó mang nhóm acetyl',
- Trên mỗi glucose, vốn tạo ra 2 pyruvate, quá trình này tạo 2 acetyl-CoA, 2 CO₂ và 2 NADH

### SUMMARY_MITODYN
- Fission làm tăng số lượng ty thể và cho phép cắt bỏ phần bị hư hỏng để loại thải (mitophagy); fusion cho phép một ty thể bị tổn thương chia sẻ thành phần với một ty thể khỏe mạnh, và được kích thích bởi nhu cầu năng lượng và stress',
- Drp1, các mitofusins và Opa1 đều là GTPases, nên mỗi bước đều tiêu tốn GTP. Thứ tự diễn ra là màng ngoài hợp nhất bởi các mitofusins, sau đó màng trong hợp nhất bởi Opa1',
- Ty thể luôn sinh ra từ các ty thể có sẵn: quá trình biogenesis (được PGC-1α bật lên) bổ sung vật chất ty thể mới, và fission chia nó thành nhiều bào quan hơn

### SUMMARY_APOINT
- Tổn thương DNA nghiêm trọng kích hoạt Bax, tạo lỗ trên màng ngoài ty thể, khiến cytochrome c thoát ra cytosol',
- Cytochrome c, Apaf-1 và dATP kết hợp tạo thành apoptosome, giúp hoạt hóa procaspase-9; caspase-9 hoạt hóa các executioner procaspases (procaspase-3), và caspase-3 cắt các protein tế bào',
- Tổn thương nghiêm trọng cũng ức chế các yếu tố anti-apoptotic vốn kìm giữ Bax',
- Trong trò chơi này, protein của một bước là thành phần của phức hợp trực tiếp tác động tại mũi tên

### SUMMARY_APOEXT
- TNF kéo ba chuỗi TNFR1 lại gần nhau; các death domains huy động TRADD, TRADD huy động FADD, và FADD huy động procaspase-8',
- Các phân tử procaspase-8 được giữ sát nhau sẽ tự hoạt hóa lẫn nhau; caspase-8 hoạt hóa các executioner procaspases, và các executioner caspases cắt các protein tế bào',
- Con đường extrinsic và intrinsic gặp nhau tại các executioner caspases',
- Trong trò chơi này, protein của một bước là thành phần của phức hợp trực tiếp tác động tại mũi tên

### SUMMARY_GLUALA
- Ammonium được bắt giữ theo hai cách: glutamate dehydrogenase gắn nó vào α-ketoglutarate cùng NADPH để tạo glutamate, và glutamine synthetase gắn nguyên tử nitơ thứ hai vào glutamate cùng ATP để tạo glutamine, chất vận chuyển ammonia an toàn trong máu',
- Nitơ được giải phóng trở lại ở nơi cần thiết: glutaminase giải phóng amide nitrogen của glutamine tại gan và thận, còn glutamate dehydrogenase tách nhóm amino của glutamate dưới dạng NH₄⁺ cùng NAD⁺, trả lại α-ketoglutarate. NH₄⁺ sau đó đi vào urea cycle',
- Các transaminases ALT và AST (vitamin B6) chuyển nhóm amino qua lại giữa amino acids và α-ketoglutarate mà không làm thay đổi tổng lượng nitơ: alanine cho pyruvate và aspartate cho oxaloacetate, còn glutamate thu nhận các nhóm amino',
- Cơ gửi các nhóm amino tới gan dưới dạng alanine (glucose-alanine cycle): ALT tạo ra pyruvate, được gluconeogenesis chuyển thành glucose cho cơ, và tạo glutamate có nitơ đi vào urea cycle

### SUMMARY_UREA
- Mỗi vòng chuyển hóa một ammonium nitrogen và một aspartate nitrogen thành một phân tử urea: NH₄⁺ + HCO₃⁻ + aspartate + 3 ATP + H₂O → urea + fumarate + 2 ADP + AMP + 2 Pᵢ + PPᵢ + 2 H⁺. Tính bước ATP thành AMP + PPᵢ là hai liên kết, vì PPᵢ của nó bị thủy phân, nên bốn liên kết phosphate giàu năng lượng bị tiêu tốn cho mỗi urea: hai tại carbamoyl phosphate synthetase I và hai tại argininosuccinate synthetase',
- Hai nguyên tử nitơ của urea đến từ ammonium (qua carbamoyl phosphate) và từ aspartate (qua argininosuccinate); nguyên tử carbon của nó đến từ bicarbonate',
- Bước 1 và 2 diễn ra trong mitochondrial matrix, còn bước 4 đến 6 ở cytosol; chất vận chuyển giữa hai nơi đưa ornithine vào để đổi lấy citrulline đi ra. Carbamoyl phosphate synthetase I là bước cam kết (committed step), được kích hoạt bởi N-acetylglutamate',
- Fumarate được tạo ra bởi argininosuccinate lyase tham gia vào TCA cycle (fumarate thành malate rồi thành oxaloacetate, và quay lại aspartate qua transamination), giúp kết nối urea cycle với TCA cycle

### SUMMARY_CARBS
- Glycolysis: thu ròng 2 pyruvate, 2 ATP (tạo 4, tốn 2) và 2 NADH trên mỗi glucose',
- Fermentation tái oxy hóa 2 NADH để glycolysis có thể chạy không cần oxygen: lactate dehydrogenase tạo 2 lactate, hoặc pyruvate decarboxylase và alcohol dehydrogenase tạo 2 ethanol và 2 CO₂',
- Gluconeogenesis: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺. Bảy enzymes của glycolysis chạy ngược (các mũi tên hai đầu) và bốn bypass enzymes đi vòng qua các bước bất thuận nghịch',
- Glucose 6-phosphate là ngã ba trung tâm giữa glucose và glycogen. Glycogen synthase và glycogen phosphorylase là hai enzymes khác nhau, nên quá trình dự trữ và phân giải được điều hòa riêng biệt

### SUMMARY_TCA
- Glucose bị oxy hóa hoàn toàn thành 6 CO₂: glycolysis, link reaction và TCA cycle tạo tổng cộng 10 NADH, 2 FADH₂ và 4 ATP hoặc GTP ròng trên mỗi glucose',
- Pyruvate đi qua màng ngoài qua porin và màng trong trên H⁺/pyruvate symporter, rồi link reaction tạo acetyl-CoA, CO₂ và NADH trong matrix

### SUMMARY_ETC
- Electron transport chain truyền electrons của NADH và FADH₂ tới oxygen: khoảng 10 H⁺ được bơm trên mỗi NADH và 6 trên mỗi FADH₂, đủ cho khoảng 2.5 và 1.5 ATP',
- Các shuttles đưa electrons của cytosolic NADH vào matrix, còn ATP synthase và ATP-ADP translocase tổng hợp và xuất khẩu ATP

### SUMMARY_CELLBIO
- Ty thể phân chia và dung hợp (Drp1, các mitofusins, Opa1): fission cắt bỏ phần hư hỏng và tạo thêm bào quan, fusion cho phép ty thể tổn thương chia sẻ thành phần với ty thể khỏe mạnh',
- Tổn thương nghiêm trọng kích hoạt Bax, tạo lỗ trên màng ngoài ty thể, khiến cytochrome c thoát ra cytosol. Cytochrome c, Apaf-1 và dATP tạo thành apoptosome, hoạt hóa procaspase-9, và caspase-9 hoạt hóa các executioner procaspases (con đường intrinsic)',
- TNF kéo ba chuỗi TNFR1 lại nhau; TRADD, FADD và procaspase-8 được huy động, các phân tử procaspase-8 sát nhau tự hoạt hóa lẫn nhau, và caspase-8 hoạt hóa các executioner procaspases (con đường extrinsic)',
- Hai con đường gặp nhau tại các executioner caspases, và caspase-3 cắt các protein tế bào

### SUMMARY_ALL
- Glycolysis: thu ròng 2 pyruvate, 2 ATP và 2 NADH trên mỗi glucose. Fermentation (lactate hoặc ethanol) tái oxy hóa NADH để glycolysis chạy không cần oxygen',
- Gluconeogenesis đảo ngược glycolysis với bốn bypass enzymes. Glycogen được tổng hợp và phân giải bởi các enzymes khác nhau, với glucose 6-phosphate làm trung tâm',
- Trên mỗi pyruvate, link reaction và TCA cycle cho 3 CO₂, 4 NADH, 1 FADH₂ và 1 GTP',
- Beta-oxidation: mỗi vòng xoắn cho 1 FADH₂, 1 NADH và 1 acetyl-CoA, làm ngắn fatty acyl-CoA đi 2 carbons',
- Electron transport chain truyền electrons của NADH và FADH₂ tới oxygen: khoảng 10 H⁺ được bơm trên mỗi NADH và 6 trên mỗi FADH₂, đủ cho khoảng 2.5 và 1.5 ATP
- ].concat(SUMMARY_CELLBIO, MG.pathways.gluala.summary, MG.pathways.urea.summary);
- var ENTRY = { x: 1600, y: 3150 };
- var ENTRY_DX = ENTRY.x - 150, ENTRY_DY = ENTRY.y - 150;
- var MATRIX_X = ENTRY_DX + 150 + 2 * 380;
- var HUB_X = ENTRY_DX + 150 + 3 * 380;
- var TCA_DX = MATRIX_X - 150, TCA_DY = ENTRY_DY + 40;
- function ringAt(x, y) { return [x + TCA_DX, y + TCA_DY

## 5. Bộ Tính Toán ATP & Sổ Cái Năng Lượng (ATP Calculator & Ledger Strings)

### 5.1 Quy ước tính toán (Conventions)
- **Quy ước Hiện đại (Modern Convention):** `NADH 2.5, FADH₂ 1.5` — *NADH có giá trị 2.5 ATP và FADH₂ 1.5 ATP, nên một glucose tạo ra 30 hoặc 32 ATP.*
- **Quy ước Cổ điển (Classic Convention):** `NADH 3, FADH₂ 2` — *NADH có giá trị 3 ATP và FADH₂ 2 ATP, nên một glucose tạo ra 36 hoặc 38 ATP.*
- **Chế độ Có hướng dẫn (Guided):** *Hiển thị lượng tạo thành ở từng bước trong lúc bạn đếm.*
- **Chế độ Tự nhớ (Recall):** *Không hiển thị gì. Dùng Gợi ý hoặc Tiết lộ khi bạn bị bí.*

### 5.2 Các kịch bản tính ATP (Scenarios)
| Mã Scenario | Tiêu đề Kịch bản | Phụ đề & Mục tiêu |
| :--- | :--- | :--- |
| `tca` | **Một vòng của TCA cycle** | Một acetyl-CoA thành CO₂ |
| `pyruvate` | **Pyruvate thành CO₂** | Không có |
| `glycolysis` | **Glycolysis khi có oxygen** | Glucose thành pyruvate, sau đó qua shuttle |
| `glucose` | **Một phân tử glucose, oxy hóa hoàn toàn** | Glycolysis, link reaction và TCA cycle |
| `fermentation` | **Một phân tử glucose khi không có oxygen** | Fermentation thành lactate hoặc ethanol |
| `uncoupled` | **Một phân tử glucose với một uncoupler** | Electrons vẫn chảy, ATP synthase không tạo ra gì |
| `fattyacid` | **Một fatty acid** | Activation, beta-oxidation và TCA cycle |
| `calvincost` | **Calvin cycle** | Lượng ATP và NADPH cho một phân tử glucose |
| `c4cost` | **C4 pathway** | Lượng ATP phụ thêm để vận chuyển CO₂ |
| `alanineox` | **Alanine, oxy hóa hoàn toàn** | Transamination, TCA cycle và urea cycle |
| `aspartateox` | **Aspartate, oxy hóa hoàn toàn** | Qua oxaloacetate và pyruvate |
| `glutamateox` | **Glutamate, oxy hóa hoàn toàn** | Qua alpha-ketoglutarate |
| `ureacost` | **Một phân tử urea** | Năng lượng mà urea cycle tiêu tốn |
| `pentoseox` | **Ba phân tử pentose, oxy hóa hoàn toàn** | Pentose phosphate pathway đi vào glycolysis |
| `purinecost` | **Một phân tử IMP** | Năng lượng tiêu tốn để tổng hợp một purine nucleotide |
| `pyrimidinecost` | **Một phân tử UMP** | Năng lượng tiêu tốn để tổng hợp một pyrimidine nucleotide |

## 6. Bộ Câu Hỏi So Sánh Tương Đồng & Phân Biệt (Comparison Quizzes - `cmp-*`)

| Mã ID | Tiêu đề so sánh (Comparison Title) | Nội dung & Cặp đối chiếu (Subtitle) |
| :--- | :--- | :--- |
| `cmp-hk-gk` | **Hexokinase hay glucokinase** | Một phản ứng, hai isozymes: ái lực, sự ức chế bởi sản phẩm và vị trí hoạt động của từng loại |
| `cmp-pfk-fbpase` | **PFK-1 hay FBPase-1** | Kinase của glycolysis đối đầu phosphatase của gluconeogenesis, và các tín hiệu lựa chọn giữa chúng |
| `cmp-gly-gng` | **Glycolysis hay gluconeogenesis** | Nơi mỗi quá trình diễn ra, chi phí của từng quá trình, các enzymes dùng chung và ba bước bypass |
| `cmp-lactate-ethanol` | **Lactate hay ethanol fermentation** | Hai cách thu hồi NAD⁺ không cần oxygen: loài nào dùng cách nào, và sản phẩm giải phóng |
| `cmp-nadh-fadh2` | **NADH hay FADH₂** | Không có |
| `cmp-complex1-2` | **Complex I hay Complex II** | Hai điểm đi vào của chuỗi: chất mỗi phức hợp oxy hóa, phức hợp nào bơm protons, phức hợp nào là enzyme của TCA |
| `cmp-slp-oxphos` | **Substrate-level hay oxidative phosphorylation** | Hai cách tạo ATP: trực tiếp từ một chất trung gian, hoặc từ một proton gradient |
| `cmp-pdc-kgdh` | **PDC hay α-KG dehydrogenase** | Hai phức hợp có cấu tạo giống nhau: cơ chất đầu vào, sản phẩm đầu ra, và những điểm chung |
| `cmp-phosphorylase-synthase` | **Glycogen phosphorylase hay synthase** | Phân giải hay tổng hợp glycogen: các substrates, cofactor và tác động của phosphorylation lên mỗi enzyme |
| `cmp-betaox-fas` | **Beta-oxidation hay fatty acid synthesis** | Phân giải và tổng hợp fatty acids: các khoang tế bào, chất mang, electron carriers và đơn vị hai carbon |
| `cmp-sat-unsat` | **Saturated hay unsaturated fatty acid** | Stearic acid đối chiếu oleic acid: cùng 18 carbons, khác một liên kết đôi, và ảnh hưởng tới số lượng ATP |
| `cmp-g3p-glycerol3p` | **Glyceraldehyde 3-P hay glycerol 3-P** | Hai hợp chất ba carbon có tên gần giống nhau: aldehyde của glycolysis và khung xương của chất béo |
| `cmp-shuttles` | **Glycerol phosphate hay malate-aspartate shuttle** | Hai cách đưa electrons của cytosolic NADH vào ty thể, và lý do giá trị ATP không giống nhau |
| `cmp-apoptosis` | **Intrinsic hay extrinsic apoptosis** | Con đường ty thể và con đường death receptor: điểm khởi phát, initiator caspase của mỗi bên và nơi chúng gặp nhau |
| `cmp-fission-fusion` | **Fission hay fusion** | Cách ty thể phân chia và dung hợp: các GTPases, các lớp màng và mục đích của từng quá trình |
| `cmp-q-cytc` | **Ubiquinone hay cytochrome c** | Hai mobile carriers của chuỗi: một lipid trong màng và một heme protein nằm bên cạnh |

## 7. Cơ Chế Phản Ứng Từng Bước (Detailed Enzyme Mechanisms - `mech-*`)

| Mã ID | Tên Enzyme & Cơ chế (Title) | Mô tả chi tiết các bước hóa sinh |
| :--- | :--- | :--- |
| `mech-aldolase` | **Aldolase: Schiff base** | Cách một gốc lysine của enzyme giúp đường sáu carbon tách thành hai mảnh ba carbon |
| `mech-tpi` | **Triose phosphate isomerase: enediol** | Cách nhóm carbonyl dịch chuyển từ carbon 2 sang carbon 1 qua chất trung gian cis-enediol |
| `mech-gapdh` | **GAPDH: thioester, rồi đến acyl phosphate** | Cách một phản ứng oxy hóa chi trả cho việc tạo thành một phosphate giàu năng lượng |
| `mech-pdc` | **Pyruvate dehydrogenase complex: E1, E2, E3** | Năm cofactors theo đúng thứ tự: TPP, lipoamide, coenzyme A, FAD và NAD⁺ |
| `mech-aconitase` | **Aconitase: qua cis-aconitate** | Cách nhóm hydroxyl di chuyển từ carbon này sang carbon kế tiếp, trên một iron-sulfur cluster không thực hiện phản ứng oxy hóa-khử |
| `mech-atpsynthase` | **ATP synthase: binding-change cycle** | Mở (open), lỏng (loose) và chặt (tight): cách trục quay làm ba vị trí luân phiên nhau |
| `mech-qcycle` | **Complex III: Q cycle** | Cách hai electrons của một ubiquinol được tách ra, một tới cytochrome c và một quay lại gắn lên quinone |
| `mech-betaox` | **Beta-oxidation: những bước đầu tiên** | Từ một free fatty acid đến acetyl-CoA đầu tiên: hoạt hóa, carnitine shuttle và bốn bước của một vòng |

## 8. Phân Loại Quốc Tế (EC Classes & Biochemical Families)

### 8.1 7 Lớp Enzyme Quốc Tế (Enzyme Commission Classes)
| Mã số EC | Tên lớp tiếng Anh | Mô tả chức năng |
| :--- | :--- | :--- |
| `EC 1` | `Oxidoreductase` | Xúc tác các phản ứng oxy hóa - khử |
| `EC 2` | `Transferase` | Xúc tác vận chuyển các nhóm chức |
| `EC 3` | `Hydrolase` | Xúc tác phản ứng thủy phân liên kết |
| `EC 4` | `Lyase` | Cắt hoặc tạo liên kết đôi không cần ATP và nước |
| `EC 5` | `Isomerase` | Đồng phân hóa nội phân tử |
| `EC 6` | `Ligase` | Nối 2 phân tử sử dụng năng lượng ATP |
| `EC 7` | `Translocase` | Vận chuyển ion/phân tử qua màng tế bào |

## 9. Danh Mục Phân Tử Sinh Học & Chú Giải (Molecules Catalog & Notes)

| Mã ID | Tên chính thức (Name) | Viết tắt | Nhóm | Chú giải sinh học (Biological Note) |
| :--- | :--- | :--- | :--- | :--- |
| `g1p` | **Glucose 1-phosphate** | `G1P` | `sugar` | Tạo thành từ quá trình phân giải glycogen. Chưa phải là glycolytic intermediate cho đến khi được đồng phân hóa thành glucose 6-phosphate. |
| `r5p` | **Ribose 5-phosphate** | `R5P` | `sugar` | Sản phẩm của pentose phosphate pathway, được dùng để tổng hợp nucleotides. |
| `glycerol3p` | **Glycerol 3-phosphate** | `G3P (glycerol)` | `c3` | Tạo thành từ DHAP trong quá trình tổng hợp lipid và glycerol phosphate shuttle. Rất dễ nhầm lẫn với glyceraldehyde 3-phosphate. |
| `lactate` | **Lactate** | `Lac` | `c3` | L-Lactate, sản phẩm cuối của anaerobic glycolysis trong cơ đang hoạt động và hồng cầu. Gan có thể chuyển nó ngược lại thành pyruvate và glucose (Cori cycle). |
| `alanine` | **Alanine** | `Ala` | `c3` | Tạo thành từ pyruvate qua transamination. Cơ gửi nó tới gan, nơi nó trả lại pyruvate cho gluconeogenesis (glucose-alanine cycle). |
| `acetaldehyde` | **Acetaldehyde** | `AcH` | `c3` | Một chất trung gian của alcoholic fermentation. |
| `ethanol` | **Ethanol** | `EtOH` | `c3` | Sản phẩm cuối của alcoholic fermentation ở nấm men. |
| `glutamate` | **Glutamate** | `Glu` | `acid` | Trở thành alpha-ketoglutarate khi nhóm amino bị tách ra. Đây là điểm tập trung các nhóm amino: các transaminases chuyển chúng tới alpha-ketoglutarate, và glutamine synthetase gắn thêm nguyên tử nitơ thứ hai để tạo glutamine. |
| `aspartate` | **Aspartate** | `Asp` | `acid` | Trở thành oxaloacetate khi nhóm amino bị tách ra. |
| `malonate` | **Malonate** | `Malon` | `acid` | Một dicarboxylate ba carbon. Chất ức chế cạnh tranh (competitive inhibitor) kinh điển của succinate dehydrogenase. |
| `glyoxylate` | **Glyoxylate** | `Glyox` | `acid` | Một chất trung gian của glyoxylate cycle ở thực vật và vi khuẩn. |
| `glutamine` | **Glutamine** | `Gln` | `aminoacid` | Chất vận chuyển ammonia an toàn trong máu: mang một amide nitrogen mà gan và thận sẽ giải phóng lại nhờ glutaminase. |
| `lysine` | **Lysine** | `Lys` | `aminoacid` | Một amino acid kiềm có mạch bên bốn carbon kết thúc bằng một nhóm amino; trông giống ornithine nhưng nhiều hơn một carbon. |
| `proline` | **Proline** | `Pro` | `aminoacid` | Một amino acid có cấu trúc vòng có thể được tổng hợp từ ornithine (và từ glutamate). |
| `nacglu` | **N-Acetylglutamate** | `NAG` | `aminoacid` | Chất hoạt hóa dị lập thể (allosteric activator) của carbamoyl phosphate synthetase I, tạo thành từ glutamate và acetyl-CoA và được bật lên bởi arginine. |
| `carbamoylasp` | **N-Carbamoylaspartate** | `CAA` | `aminoacid` | Sản phẩm của aspartate transcarbamoylase trong quá trình tổng hợp pyrimidine: cùng cơ chế hóa học gắn nhóm carbamoyl như urea cycle, nhưng thực hiện trên aspartate thay vì ornithine. |

## 10. Danh Mục Enzyme & Đồng Yếu Tố (Enzymes & Cofactors Catalog)

### 10.1 Danh Mục Enzyme
| Mã ID | Tên Enzyme (Name) | Viết tắt | Mã EC | Chú giải cơ chế & điều hòa (Note) |
| :--- | :--- | :--- | :--- | :--- |
| `g6pase` | **Glucose-6-phosphatase** | `G6Pase` | `3.1.3.9` | Enzyme của gluconeogenesis giúp tách nhóm phosphate khỏi glucose 6-phosphate. |
| `fbpase` | **Fructose-1,6-bisphosphatase** | `FBPase` | `3.1.3.11` | Enzyme của gluconeogenesis đối kháng với PFK-1. |
| `pglucomutase` | **Phosphoglucomutase** | `PGluM` | `5.4.2.2` | Chuyển hóa qua lại giữa glucose 1-phosphate và glucose 6-phosphate. |
| `g6pdh` | **Glucose-6-phosphate dehydrogenase** | `G6PD` | `` | Enzyme đầu tiên của pentose phosphate pathway. |
| `ldh` | **Lactate dehydrogenase** | `LDH` | `1.1.1.27` | Khử pyruvate thành lactate và tái tạo NAD⁺ cho bước glyceraldehyde 3-phosphate dehydrogenase, giúp glycolysis tiếp tục chạy khi không có oxygen. Ở gan và tim, phản ứng chủ yếu diễn ra theo chiều ngược lại. |
| `pc` | **Pyruvate carboxylase** | `PC` | `6.4.1.1` | Tạo oxaloacetate từ pyruvate, bước đầu tiên của gluconeogenesis. Cần biotin. |
| `pepck` | **PEP carboxykinase** | `PEPCK` | `4.1.1.32` | Chuyển oxaloacetate thành PEP trong gluconeogenesis. |
| `adh` | **Alcohol dehydrogenase** | `ADH` | `1.1.1.1` | Khử acetaldehyde thành ethanol trong fermentation. |
| `pyrdecarb` | **Pyruvate decarboxylase** | `PDC (yeast)` | `4.1.1.1` | Enzyme của nấm men biến đổi pyruvate thành acetaldehyde. |
| `glycerol3pdh` | **Glycerol-3-phosphate dehydrogenase** | `GPDH` | `1.1.1.8` | Enzyme phụ thuộc NAD của cytosol. Khử dihydroxyacetone phosphate thành glycerol 3-phosphate bằng electrons từ cytosolic NADH, là bước đầu của glycerol phosphate shuttle; đồng thời kết nối glycolysis với tổng hợp lipid. |
| `gdh` | **Glutamate dehydrogenase** | `GDH` | `1.4.1.3` | Enzyme kết nối chuyển hóa amino acid với TCA cycle: tách nhóm amino của glutamate dưới dạng ammonium (oxidative deamination) và theo chiều ngược lại, gắn ammonium vào alpha-ketoglutarate để tạo glutamate. Dùng NAD⁺ cho deamination và NADPH cho amination, hoạt động trong ty thể của gan. |
| `alt` | **Alanine aminotransferase** | `ALT` | `2.6.1.2` | Enzyme dùng vitamin B6 chuyển nhóm amino giữa alanine và glutamate: alanine nhường nhóm amino cho alpha-ketoglutarate, tạo pyruvate và glutamate. Trong glucose-alanine cycle, nó chạy theo chiều tạo alanine ở cơ và quay lại tạo pyruvate ở gan; nồng độ ALT cao trong máu là dấu hiệu tổn thương gan. |
| `ast` | **Aspartate aminotransferase** | `AST` | `2.6.1.1` | Enzyme dùng vitamin B6 chuyển nhóm amino giữa aspartate và glutamate. Một isoform trong matrix và một isoform ở cytosol thực hiện hai bước transamination của malate-aspartate shuttle. |
| `ndpk` | **Nucleoside diphosphate kinase** | `NDPK` | `` | Chuyển nhóm phosphate tận cùng giữa các nucleoside diphosphates và triphosphates, ví dụ GTP + ADP thành GDP + ATP. |
| `malic` | **Malic enzyme** | `ME` | `` | Khử carboxyl (decarboxylates) malate thành pyruvate. |
| `mdh1` | **Cytosolic malate dehydrogenase** | `MDH1` | `1.1.1.37` | Enzyme phụ thuộc NAD ở cytosol tác động lên các axit bốn carbon. Khử oxaloacetate thành malate bằng electrons của cytosolic NADH, bước đầu của malate-aspartate shuttle. |
| `gpd2` | **Mitochondrial glycerol phosphate dehydrogenase** | `GPD2` | `1.1.5.3` | Đưa electrons vào ubiquinol, bỏ qua Complex I (glycerol phosphate shuttle). |
| `glycogensynthase` | **Glycogen synthase** | `GYS` | `2.4.1.11` | Gắn glucose từ UDP-glucose vào đầu không khử (non-reducing end) của chuỗi glycogen (liên kết alpha-1,4). Đây là enzyme điều hòa chính của quá trình tổng hợp glycogen, bị ức chế bởi phosphorylation. |
| `glycogenphosphorylase` | **Glycogen phosphorylase** | `GP` | `2.4.1.1` | Phân giải glycogen từ các đầu không khử bằng phosphorolysis: inorganic phosphate (chứ không phải nước) cắt liên kết, nên glucose được giải phóng ở dạng đã phosphoryl hóa (glucose 1-phosphate) mà không tốn ATP. Cần pyridoxal phosphate. |
| `ugpase` | **UDP-glucose pyrophosphorylase** | `UGP` | `2.7.7.9` | Gắn glucose 1-phosphate vào phần UMP của UTP, giải phóng pyrophosphate. Sự phân giải pyrophosphate bởi pyrophosphatase kéo phản ứng tiến về phía trước. Đơn vị UMP được chuyển lên đường chứ không bị giải phóng. |
| `lipase` | **Lipases** | `Lipase` | `3.1.1.3` | Thủy phân các liên kết ester của triacylglycerol, giải phóng free fatty acids và glycerol. Trong tế bào mỡ, hormone-sensitive lipase được bật lên bởi epinephrine và glucagon. |
| `acs` | **Fatty acyl-CoA synthetase** | `ACS` | `6.2.1.3` | Hoạt hóa một fatty acid bằng cách nối nó với coenzyme A. ATP bị cắt thành AMP và pyrophosphate (tiêu tốn hai liên kết giàu năng lượng), sau đó chuỗi đã hoạt hóa được đưa vào ty thể qua carnitine shuttle. Lipases giải phóng axit từ chất béo, còn enzyme này hoạt hóa chúng. |
| `acadh` | **Acyl-CoA dehydrogenase** | `ACAD` | `1.3.8.7` | Bước đầu tiên của mỗi vòng beta-oxidation: loại bỏ hai hydro khỏi các carbon alpha và beta, tạo thành một trans double bond. FAD của nó truyền electrons tới electron transport chain (qua ETF). |
| `enoylh` | **Enoyl-CoA hydratase** | `ECH` | `4.2.1.17` | Cộng nước vào trans double bond, gắn một nhóm L-hydroxyl vào beta carbon. |
| `hadh` | **L-Hydroxyacyl-CoA dehydrogenase** | `HADH` | `1.1.1.35` | Oxy hóa nhóm beta-hydroxyl thành ketone bằng NAD⁺, tạo thành beta-ketoacyl-CoA. |
| `thiolase` | **β-Ketoacyl-CoA thiolase** | `Thiolase` | `2.3.1.16` | Cắt beta-ketoacyl-CoA giữa carbon alpha và beta bằng một coenzyme A mới: acetyl-CoA được giải phóng và acyl-CoA, ngắn đi hai carbons, quay lại đầu vòng xoắn. |
| `acc` | **Acetyl-CoA carboxylase** | `ACC` | `6.4.1.2` | Bước cam kết (committed step) của quá trình TỔNG HỢP fatty acid (acetyl-CoA thành malonyl-CoA), ngược chiều với beta-oxidation. |
| `cpt1` | **Carnitine palmitoyltransferase I** | `CPT1` | `2.3.1.21` | Chuyển các nhóm acyl mạch dài lên carnitine để chúng có thể đi vào ty thể; là điểm kiểm soát chính của beta-oxidation. |
| `debranch` | **Glycogen debranching enzyme** | `GDE` | `3.2.1.33` | Loại bỏ các nhánh alpha-1,6 để glycogen phosphorylase có thể tiếp tục hoạt động. |
| `branching` | **Glycogen branching enzyme** | `GBE` | `2.4.1.18` | Tạo các nhánh alpha-1,6 của glycogen. |
| `cps2` | **Carbamoyl phosphate synthetase II** | `CPS II` | `6.3.5.5` | Isoform ở cytosol của quá trình tổng hợp pyrimidine. Tạo carbamoyl phosphate từ glutamine thay vì ammonium và không được hoạt hóa bởi N-acetylglutamate. |
| `atcase` | **Aspartate transcarbamoylase** | `ATCase` | `2.1.3.2` | Enzyme cam kết đầu tiên của quá trình tổng hợp pyrimidine: chuyển nhóm carbamoyl của carbamoyl phosphate lên aspartate thay vì ornithine. |
| `nos` | **Nitric oxide synthase** | `NOS` | `1.14.13.39` | Sử dụng arginine, NADPH và oxygen để tạo nitric oxide và citrulline: một số phận khác của arginine. |
| `urease` | **Urease** | `Urease` | `3.5.1.5` | Một nickel enzyme của vi khuẩn và thực vật (không có ở người) phân cắt urea thành ammonia và CO₂. |
| `nags` | **N-Acetylglutamate synthase** | `NAGS` | `2.3.1.1` | Tổng hợp N-acetylglutamate từ glutamate và acetyl-CoA; arginine kích hoạt nó, và sản phẩm của nó hoạt hóa carbamoyl phosphate synthetase I. |
| `gs` | **Glutamine synthetase** | `GS` | `6.3.1.2` | Bắt giữ ammonium dưới dạng glutamine với sự trợ giúp của ATP; não và cơ xuất khẩu ammonia dưới dạng glutamine (cơ cũng xuất khẩu dưới dạng alanine). |
| `odc` | **Ornithine decarboxylase** | `ODC` | `4.1.1.17` | Biến đổi ornithine thành putrescine, bước đầu của quá trình tổng hợp polyamine: một số phận khác của ornithine. |
| `glnase` | **Glutaminase** | `GLS` | `3.5.1.2` | Giải phóng ammonium từ nhóm amide của glutamine tại gan (nơi nó cấp liệu cho urea cycle) và tại thận (nơi nó được bài tiết). |

### 10.2 Danh Mục Đồng Yếu Tố (Cofactors & Coenzymes)
| Mã ID | Tên Cofactor (Name) | Hiển thị | Họ nhóm | Chú giải chức năng (Note) |
| :--- | :--- | :--- | :--- | :--- |
| `atp` | **Adenosine triphosphate** | `ATP` | `adenylate` | Đồng tiền năng lượng chính của tế bào, truyền năng lượng hóa học qua các liên kết phosphate giàu năng lượng. |
| `adp` | **Adenosine diphosphate** | `ADP` | `adenylate` | Cơ chất để tổng hợp ATP, nhận nhóm phosphate trong substrate-level và oxidative phosphorylation. |
| `amp` | **Adenosine monophosphate** | `AMP` | `adenylate` | Allosteric activator báo hiệu mức năng lượng tế bào thấp. |
| `nad` | **Nicotinamide adenine dinucleotide (oxidized)** | `NAD⁺` | `redox` | Chất oxy hóa / chất nhận electron chính trong dị hóa (glycolysis, TCA, beta-oxidation). |
| `nadh` | **Nicotinamide adenine dinucleotide (reduced)** | `NADH` | `redox` | Mang hai electrons giàu năng lượng tới Complex I của chuỗi hô hấp. |
| `fad` | **Flavin adenine dinucleotide (oxidized)** | `FAD` | `redox` | Chất nhận electron nhóm ngoại (prosthetic) cho succinate dehydrogenase và acyl-CoA dehydrogenase. |
| `fadh2` | **Flavin adenine dinucleotide (reduced)** | `FADH₂` | `redox` | Truyền electrons trực tiếp tới ubiquinone qua Complex II / ETF. |
| `nadp` | **NADP⁺ (oxidized)** | `NADP⁺` | `redox` | Chất nhận electron trong pha oxy hóa của pentose phosphate pathway. |
| `nadph` | **NADPH (reduced)** | `NADPH` | `redox` | Nguồn cung cấp lực khử cho các con đường sinh tổng hợp (tổng hợp fatty acid, cholesterol) và tái tạo glutathione. |
| `coa` | **Coenzyme A** | `CoA-SH` | `carrier` | Chất mang nhóm acyl tạo liên kết thioester giàu năng lượng (acetyl-CoA, succinyl-CoA). |
| `tpp` | **Thiamine pyrophosphate** | `TPP` | `carrier` | Cofactor từ vitamin B₁ cho phản ứng oxidative decarboxylation của các α-keto acids (PDC, α-KGDH). |
| `lipoamide` | **Lipoamide** | `Lip` | `carrier` | Cofactor cánh tay đòn (swinging arm) vận chuyển các nhóm acyl và electrons bên trong phức hợp pyruvate và α-ketoglutarate dehydrogenase. |
| `biotin` | **Biotin** | `Biotin` | `carrier` | Cofactor từ vitamin B₇ cho các phản ứng carboxylation (Pyruvate carboxylase, Acetyl-CoA carboxylase). |
| `plp` | **Pyridoxal 5′-phosphate** | `PLP` | `carrier` | Coenzyme từ vitamin B₆ tạo Schiff base trong các phản ứng transamination, decarboxylation, và phân giải glycogen. |
| `pi` | **Inorganic phosphate** | `Pᵢ` | `small` | Ion orthophosphate vô cơ tham gia vào phản ứng phosphorylation và phosphorolysis. |
| `ppi` | **Inorganic pyrophosphate** | `PPᵢ` | `small` | Diphosphate được giải phóng khi hoạt hóa nucleic acid và acyl-CoA, nhanh chóng bị thủy phân để kéo phản ứng tiến về phía trước. |
| `co2` | **Carbon dioxide** | `CO₂` | `small` | Sản phẩm một carbon của phản ứng decarboxylation hoàn toàn và là cơ chất cho phản ứng carboxylation. |
| `h2o` | **Water** | `H₂O` | `small` | Dung môi, chất tham gia trong các phản ứng thủy phân và hydrat hóa, đồng thời là sản phẩm phụ của quá trình vận chuyển electron. |

---
*Tài liệu được trích xuất và hệ thống hóa trực tiếp từ source code `pathway_quiz.html`.*
