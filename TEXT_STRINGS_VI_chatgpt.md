# Khai Báo Toàn Bộ Chuỗi Text Tiếng Anh (English Text Strings & i18n Catalog)

Tài liệu này tổng hợp và khai báo toàn bộ các chuỗi văn bản (English text strings) trong toàn bộ dự án `Biochemical Pathways Game` (`pathway_quiz.html`), phục vụ công tác đối soát, dịch thuật, bản địa hóa (i18n/l10n) sang Tiếng Việt hoặc các ngôn ngữ khác.

---

## 1. Giao Diện Người Dùng, Điều Hướng & Thông Báo Hệ Thống (UI Labels & System Strings)

### 1.1 Thương hiệu & Tiêu đề chung (Brand & Headers)
| Khóa / Ngữ cảnh | Chuỗi Text Tiếng Anh | Ghi chú ngữ nghĩa |
| :--- | :--- | :--- |
| `app.title` | `Trắc nghiệm Con đường Chuyển hóa` | Tên ứng dụng trên thanh tab & header |
| `app.author` | `Benjamin E. Peterson` | Tác giả |
| `app.copyright` | `Bản quyền © 2026 Benjamin E. Peterson. Bảo lưu mọi quyền.` | Thông tin bản quyền |
| `app.license_notice` | `Được phép sử dụng miễn phí cho mục đích tự học và giảng dạy; xem LICENSE.` | Điều khoản sử dụng |
| `brand.tagline` | `Học các con đường chuyển hóa bằng cách tự xây dựng chúng.` | Khẩu hiệu trên menu |
| `menu.advanced_btn` | `Nâng cao` | Nút kích hoạt con đường nâng cao |
| `menu.advanced_desc` | `Quang hợp, truyền tín hiệu tế bào và nucleotide có các bài quiz riêng; mục “Tất cả” tập hợp mọi con đường chuyển hóa.` | Mô tả con đường nâng cao |

### 1.2 Chế độ chơi & Định dạng Quiz (Game Modes & Formats)
| Khóa chế độ | Tên hiển thị (Display Name) | Mô tả cách chơi |
| :--- | :--- | :--- |
| `mode.build` | `Xây dựng` | Dựng bản đồ từng bước, trả lời một câu hỏi mỗi lần |
| `mode.pick` | `Điền vào sơ đồ` | Bản đồ khuyết với 6 phương án trắc nghiệm cho mỗi ô |
| `mode.type` | `Điền vào chỗ trống` | Bản đồ khuyết tự gõ bàn phím chính xác tên chất |
| `mode.practice` | `Luyện tập các bước còn yếu` | Chế độ luyện tập chuyên biệt các bước hay làm sai |
| `format.names` | `tên chất` | Hiển thị tên văn bản của phân tử |
| `format.structures` | `cấu trúc` | Hiển thị công thức cấu tạo hóa học 2D |
| `format.mixed` | `kết hợp` | Kết hợp cả tên và cấu trúc |

### 1.3 Nút bấm & Điều khiển điều hướng (Buttons & Action Controls)
| Vị trí / Component | Text hiển thị (English) | Chức năng |
| :--- | :--- | :--- |
| Main Menu | `Chơi` | Bắt đầu chơi con đường đã chọn |
| Navigation | `Về menu` / `Về menu` | Thoát về màn hình danh mục chính |
| Navigation | `Tổng quan khóa học` | Xem tổng quan các chặng trong lộ trình |
| Results Screen | `Chơi lại` | Chơi lại con đường vừa xong |
| Results Screen | `Thử chế độ khó hơn` | Thử thách mức độ khó hơn (Build -> Pick -> Type) |
| Results Screen | `Luyện tập các bước đã sai` | Ôn lại chỉ những bước vừa làm sai |
| Results Screen | `Xem lại sơ đồ` | Xem lại toàn bộ bản đồ hoàn chỉnh kèm chú giải |
| Quiz Controls | `Gợi ý` | Yêu cầu một gợi ý |
| Quiz Controls | `Hiện đáp án` | Tiết lộ đáp án (tính là một lỗi sai) |
| Quiz Controls | `Xóa` | Xóa nét vẽ hoặc ô nhập liệu |
| Quiz Controls | `Nộp` | Nộp câu trả lời |
| Canvas Controls | `Phóng to` | Phóng to bản đồ |
| Canvas Controls | `Thu nhỏ` | Thu nhỏ bản đồ |
| Canvas Controls | `Đặt lại khung nhìn` | Đưa bản đồ về vị trí trung tâm |
| Modal | `Đóng` | Đóng hộp thoại |

### 1.4 Thiết lập ứng dụng (Settings & Preferences)
| Mục cài đặt | Nhãn / Tùy chọn (English) | Mô tả tính năng |
| :--- | :--- | :--- |
| Settings Title | `Cài đặt` | Tiêu đề hộp thoại cài đặt |
| Theme Option 1 | `Sáng` | Giao diện nền sáng |
| Theme Option 2 | `Tối` | Giao diện nền tối bảo vệ mắt |
| Theme Option 3 | `Tự động` | Tự động thích ứng theo hệ điều hành thiết bị |
| Cofactors Setting | `Đồng yếu tố` | Bật/tắt việc hỏi ATP, ADP, NAD⁺, H₂O trong bài thi |
| Animations Setting | `Giảm chuyển động` | Giảm các hiệu ứng chuyển động rung lắc |

### 1.5 Kết quả, Đánh giá & Thống kê (Results & Feedback Metrics)
| Nhãn thống kê | Chuỗi Text Tiếng Anh | Ý nghĩa |
| :--- | :--- | :--- |
| Score Ring | `Điểm` | Điểm số phần trăm độ chính xác (%) |
| Stat Right | `đúng` | Số bước trả lời đúng |
| Stat Wrong | `sai` | Số bước trả lời sai |
| Stat Time | `thời gian` | Thời gian hoàn thành (mm:ss) |
| Stat Hints | `gợi ý` | Số lần người dùng bấm trợ giúp Gợi ý |
| Stat Revealed | `đã hiện đáp án` | Số lần người dùng bấm Tiết lộ đáp án |
| Feedback Toast | Chưa có dữ liệu để hiển thị. | Thông báo khi chưa có dữ liệu chi tiết |

## 2. Câu Hỏi Quiz & Mẫu Gợi Ý (Prompts & Hint Templates)

| Mã Prompt | Chuỗi Text Tiếng Anh (English Prompt) | Ngữ cảnh sử dụng |
| :--- | :--- | :--- |
| `product` | `Sản phẩm là gì?` | Hỏi chất sản phẩm chính của bước |
| `productOne` | `Hãy nêu một sản phẩm của bước này.` | Hỏi 1 trong nhiều sản phẩm |
| `productOther` | `Hãy nêu sản phẩm còn lại.` | Hỏi sản phẩm còn lại |
| `substrate` | `Cơ chất còn thiếu là gì?` | Hỏi chất phản ứng / cơ chất đầu vào |
| `consumeOne` | `Hãy nêu một chất được tiêu thụ ở bước này.` | Hỏi chất bị tiêu thụ |
| `consumeMore` | `Bước này còn tiêu thụ chất nào khác?` | Hỏi chất phụ bị tiêu thụ thêm |
| `enz` | `Enzyme nào xúc tác cho bước này?` | Hỏi tên enzyme xúc tác |
| `cof` | `Cần đồng yếu tố nào?` | Hỏi coenzyme hoặc đồng yếu tố |
| `direction` | `Phản ứng này diễn ra theo chiều thuận, chiều nghịch hay cả hai chiều?` | Hỏi tính thuận nghịch của phản ứng |

## 3. Danh Mục 22+ Con Đường Chuyển Hóa & Khóa Học (Pathways & Courses)

| Mã ID | Tiêu đề (English Title) | Tag | Phụ đề (Subtitle / Description) |
| :--- | :--- | :--- | :--- |
| `glycolysis` | **Đường phân (Glycolysis)** | `GLY` | Glucose thành pyruvate |
| `lactate` | **Lên men lactic** | `LAC` | Glucose thành lactate trong điều kiện thiếu oxygen |
| `glycogen` | **Chuyển hóa glycogen** | `GLG` | Tổng hợp và phân giải glycogen |
| `gluconeogenesis` | **Tân tạo glucose (Gluconeogenesis)** | `GNG` | Chuyển pyruvate ngược trở lại thành glucose |
| `ethanol` | **Lên men rượu** | `ETH` | Glucose thành ethanol trong điều kiện thiếu oxygen |
| `pdhtca` | **Pyruvate thành CO₂₂** | `PDH` | Pyruvate dehydrogenase và chu trình TCA |
| `betaox` | **Beta-oxidation** | `FAO` | Chuyển hóa chất béo thành acetyl-CoA |
| `boxsimple` | **Beta-oxidation (cơ bản)** | `BOS` | Chu trình bốn bước phân cắt acid béo thành acetyl-CoA |
| `etc` | **Chuỗi vận chuyển electron** | `ETC` | NADH and FADH\u2082 to oxygen and ATP |
| `etcsimple` | **Vận chuyển electron (cơ bản)** | `ETS` | Truyền electron từ NADH và FADH₂ đến oxygen, sau đó tạo ATP |
| `tca` | **Chu trình TCA** | `TCA` | Acetyl-CoA thành CO₂ |
| `full` | **Từ glucose đến CO₂** | `FULL` | Đường phân, phản ứng chuyển tiếp và chu trình TCA |
| `etcpath` | **Thứ tự các chất mang electron** | `ETP` | Truyền electron từ NADH đến oxygen qua từng chất mang electron |
| `gpshuttle` | **Glycerol phosphate shuttle** | `GPS` | Truyền electron từ NADH trong bào tương đến ubiquinone |
| `masshuttle` | **Malate-aspartate shuttle** | `MAS` | Chuyển electron từ NADH trong bào tương thành NADH trong chất nền ty thể |
| `antport` | **Tổng hợp và vận chuyển ATP ra ngoài** | `ANT` | ATP synthase và protein chuyển vị ATP-ADP |
| `pyrentry` | **Sự vận chuyển pyruvate vào ty thể và phản ứng chuyển tiếp** | `PYE` | Đi qua hai lớp màng để tạo acetyl-CoA |
| `mitodyn` | **Phân chia và hợp nhất ty thể** | `MDY` | Cách ty thể phân chia và hợp nhất |
| `apopint` | **Apoptosis: con đường nội sinh** | `AIN` | Con đường gây chết tế bào qua ty thể |
| `apopext` | **Apoptosis: con đường ngoại sinh** | `AEX` | Con đường gây chết tế bào thông qua thụ thể chết |
| `urea` | **Chu trình urea** | `URE` | Chuyển ammonia thành urea |
| `gluala` | **Glutamate và alanine** | `GLA` | Thu nhận và giải phóng ammonium, cùng các enzyme transaminase |
| `carbs` | **Carbohydrates** | `` |  |
| `lipids` | **Lipids** | `` |  |
| `aminoacids` | **Amino acids** | `` |  |
| `cellbio` | **Mitochondrial dynamics and apoptosis** | `` |  |
| `everything-carbs` | **Everything: Carbohydrates** | `ALL` | Glycolysis, fermentation, gluconeogenesis and glycogen on one map |
| `fermentations` | **Glycolysis and fermentation** | `FER` |  |
| `everything-tca` | **Everything: TCA cycle** | `ALL` | Glucose to CO₂ and the pyruvate entry on one map |
| `everything-etc` | **Everything: Electron transport chain** | `ALL` | The chain, the electron carriers, ATP export and the two shuttles on one map |
| `everything-lipids` | **Everything: Lipids** | `ALL` | Beta-oxidation on one map |
| `everything-aminoacids` | **Everything: Amino acids** | `ALL` | Glutamate and alanine and the urea cycle on one map |
| `everything-cellbio` | **Everything: Mitochondrial dynamics and apoptosis** | `ALL` | Fission and fusion and the two pathways of apoptosis on one map |
| `everything-all` | **Everything: All pathways** | `ALL` | All twenty pathways on one map |
| `gly` | **Đường phân (Glycolysis)** | `` |  |
| `link` | **Pyruvate to acetyl-CoA** | `` |  |
| `act` | **Activation** | `` |  |
| `box` | **Beta-oxidation** | `` |  |
| `db` | **Double bonds** | `` |  |
| `read` | **Read the structure** | `` |  |

## 4. Tóm Tắt & Cân Bằng Chuyển Hóa (Pathway Net Summaries)

### SUMMARY_GLY
- Tính trên mỗi glucose: thu được 2 pyruvate, 2 ATP, 2 NADH và 2 H₂O',
- ATP: tiêu tốn 2 ATP (ở bước 1 và 3), tạo ra 4 ATP (ở bước 7 và 10, tính cho mỗi triose)',
- Glucose + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 Pyruvate + 2 NADH + 2 ATP + 2 H⁺ + 2 H₂O',
- Các điểm điều hòa: hexokinase, phosphofructokinase-1 và pyruvate kinase xúc tác ba bước không thuận nghịch. Hoạt tính của chúng được điều hòa bởi các chất hiệu ứng dị lập thể, biến đổi cộng hóa trị và phiên mã gene; ATP là yếu tố điều hòa chủ chốt

### SUMMARY_TCA
- Tính trên mỗi acetyl-CoA: tạo ra 2 CO₂, 3 NADH, 1 FADH₂ và 1 GTP',
- CO₂ được giải phóng tại các phản ứng do isocitrate dehydrogenase và α-ketoglutarate dehydrogenase xúc tác; H₂O được sử dụng tại citrate synthase và fumarase',
- Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pᵢ + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + 2 H⁺ + CoA-SH',
- Trong chín phản ứng nếu tính cả phản ứng chuyển tiếp, có năm phản ứng được xúc tác bởi dehydrogenase. Các điểm điều hòa gồm phức hợp pyruvate dehydrogenase, citrate synthase, isocitrate dehydrogenase và phức hợp α-ketoglutarate dehydrogenase. ATP và NADH ức chế các enzyme này; ADP và NAD⁺ kích thích isocitrate dehydrogenase

### SUMMARY_GLYCOGEN
- Tổng hợp: glucose 6-phosphate → glucose 1-phosphate → UDP-glucose → glycogen. Mỗi glucose được bổ sung tiêu tốn một UTP, tương đương một ATP (UDP được phosphoryl hóa trở lại bởi nucleoside diphosphate kinase; sự phân giải pyrophosphate thúc đẩy phản ứng hoạt hóa theo chiều thuận).',
- Phân giải: glycogen phosphorylase sử dụng Pᵢ, vì vậy mỗi glucose được giải phóng dưới dạng glucose 1-phosphate mà không tiêu tốn ATP',
- Quá trình tổng hợp và phân giải sử dụng các enzyme khác nhau, do đó có thể được điều hòa độc lập

### SUMMARY_GNG
- Net: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺',
- Bảy enzyme đường phân có thể hoạt động theo cả hai chiều; bốn enzyme обход qua (pyruvate carboxylase, PEP carboxykinase, fructose-1,6-bisphosphatase và glucose-6-phosphatase) giúp vượt qua các bước không thuận nghịch',
- Mỗi glucose tiêu tốn sáu liên kết phosphate giàu năng lượng, trong khi đường phân chỉ thu được hai liên kết

### SUMMARY_ETOH
- Tính trên mỗi glucose: thu được 2 ethanol, 2 CO₂ và 2 ATP (tạo 4 ATP, tiêu tốn 2 ATP)',
- Glucose + 2 ADP + 2 Pᵢ + 2 H⁺ → 2 Ethanol + 2 CO₂ + 2 ATP + 2 H₂O',
- Alcohol dehydrogenase oxy hóa trở lại 2 NADH được tạo ra ở bước glyceraldehyde 3-phosphate dehydrogenase, nhờ đó đường phân có thể tiếp tục diễn ra khi thiếu oxygen

### SUMMARY_PDHTCA
- Tính trên mỗi pyruvate: tạo ra 3 CO₂, 4 NADH, 1 FADH₂ và 1 GTP (trong đó 1 NADH đến từ phản ứng chuyển tiếp)',
- Với mỗi glucose tạo ra 2 pyruvate: phần con đường này tạo ra 6 CO₂, 8 NADH, 2 FADH₂ và 2 GTP

### SUMMARY_BETAOX
- Mỗi vòng của chu trình tạo ra 1 FADH₂, 1 NADH và 1 acetyl-CoA, đồng thời rút ngắn fatty acyl-CoA đi 2 carbon',
- Palmitoyl-CoA (16 carbon) cần 7 vòng: tạo ra 7 FADH₂, 7 NADH và 8 acetyl-CoA',
- Quá trình hoạt hóa tiêu tốn hai liên kết phosphate giàu năng lượng (ATP bị phân cắt thành AMP và PPᵢ)

### SUMMARY_LAC
- Tính trên mỗi glucose: thu được 2 lactate và 2 ATP (tạo 4 ATP, tiêu tốn 2 ATP)',
- Glucose + 2 ADP + 2 P\u1D62 \u2192 2 Lactate + 2 ATP + 2 H₂O',
- Lactate dehydrogenase chuyển 2 NADH được tạo ra ở bước glyceraldehyde 3-phosphate dehydrogenase trở lại thành NAD⁺, nhờ đó đường phân có thể tiếp tục diễn ra khi thiếu oxygen

### SUMMARY_ETC
- Với mỗi NADH: khoảng 10 H⁺ được bơm qua màng (4 tại Complex I, 4 tại Complex III và 2 tại Complex IV), đủ để tạo khoảng 2,5 ATP',
- Với mỗi FADH₂: khoảng 6 H⁺ được bơm qua màng (Complex II không bơm proton), đủ để tạo khoảng 1,5 ATP',
- Overall: NADH + H⁺ + \u00BD O₂ \u2192 NAD⁺ + H₂O, with about 4 H⁺ flowing through ATP synthase for each ATP made

### SUMMARY_ETCSIMPLE
- Electron đi vào chuỗi tại Complex I (từ NADH) hoặc Complex II (từ FADH₂), đến ubiquinone, sau đó lần lượt đi qua Complex III, cytochrome c và Complex IV để đến oxygen, chất được khử thành nước',
- Với mỗi NADH, khoảng 10 H⁺ được bơm ra khỏi chất nền ty thể (4 tại Complex I, 4 tại Complex III và 2 tại Complex IV); Complex II không bơm proton nên FADH₂ chỉ tạo ra mức bơm khoảng 6 H⁺',
- ATP synthase cho proton đi trở lại và tổng hợp ATP: khoảng 2,5 ATP trên mỗi NADH và 1,5 ATP trên mỗi FADH₂ (tỷ lệ P/O)

### SUMMARY_BOXSIMPLE
- Mỗi vòng của chu trình gồm bốn bước: oxy hóa (FAD), cộng nước, tiếp tục oxy hóa (NAD⁺), sau đó cắt bỏ hai carbon dưới dạng acetyl-CoA',
- Mỗi vòng tạo ra 1 FADH₂, 1 NADH và 1 acetyl-CoA, đồng thời làm mạch ngắn đi 2 carbon',
- Palmitic acid (16 carbon) cần 7 vòng: tạo ra 7 FADH₂, 7 NADH và 8 acetyl-CoA',
- Quá trình hoạt hóa tiêu tốn lượng năng lượng tương đương 2 ATP (ATP chuyển thành AMP và PPᵢ); bộ tính ATP sẽ cộng toàn bộ mức tiêu hao và sản lượng (106 ATP đối với palmitic acid)

### SUMMARY_FULL
- Glucose được oxy hóa hoàn toàn thành 6 CO₂',
- Tính trên mỗi glucose: thu được 10 NADH, 2 FADH₂ và ròng 4 ATP hoặc GTP từ phosphoryl hóa mức cơ chất (đường phân tạo 4 ATP và tiêu tốn 2 ATP; chu trình tạo 2 GTP)',
- Đường phân tạo 2 pyruvate, phản ứng chuyển tiếp tạo 2 acetyl-CoA và chu trình TCA diễn ra hai vòng',
- Nếu quy ước mỗi NADH tạo 3 ATP và mỗi FADH₂ tạo 2 ATP, tổng sản lượng là 36 ATP ở tế bào sử dụng glycerol phosphate shuttle để chuyển electron từ hai NADH bào tương vào ty thể (38 ATP nếu sử dụng malate-aspartate shuttle; vi khuẩn cũng đạt 38 ATP vì không cần hệ shuttle)',
- Với quy ước thực tế hơn là 2,5 ATP/NADH và 1,5 ATP/FADH₂, sản lượng đạt khoảng 30 ATP khi dùng glycerol phosphate shuttle và khoảng 32 ATP khi dùng malate-aspartate shuttle (mỗi NADH bơm 10 H⁺ và cần khoảng 4 H⁺ để tạo một ATP, tương ứng 2,5 ATP; sự rò rỉ proton và các mục đích sử dụng gradient khác còn làm giảm sản lượng)

### SUMMARY_ETCPATH
- Electrons pass through the carriers in roughly increasing order of redox potential, from NADH (about \u22120.32 V) to oxygen (about +0.82 V)',
- Complex I, III và IV bơm proton: 4 H⁺ tại Complex I, 4 H⁺ tại Complex III và 2 H⁺ tại Complex IV, tổng cộng 10 H⁺ cho mỗi NADH',
- Flavin và ubiquinone mang hai electron cùng hai proton; các trung tâm iron-sulfur mang một electron; cytochrome truyền một electron thông qua sắt trong heme (Fe³⁺ thành Fe²⁺)',
- Rotenone ức chế Complex I, antimycin A ức chế Complex III, còn cyanide và carbon monoxide ức chế Complex IV

### SUMMARY_GPSHUTTLE
- NADH không thể đi qua màng trong ty thể, vì vậy electron của nó được đưa vào nhờ một hệ shuttle',
- Trong glycerol phosphate shuttle, electron cuối cùng được chuyển cho FADH₂ và đi vào chuỗi tại ubiquinone, bỏ qua Complex I; do đó mỗi NADH trong bào tương chỉ tạo khoảng 1,5 ATP thay vì 2,5 ATP

### SUMMARY_MASHUTTLE
- Malate-aspartate shuttle chuyển electron của NADH bào tương vào chất nền ty thể dưới dạng NADH, nhờ đó electron đi vào chuỗi tại Complex I (khoảng 2,5 ATP cho mỗi NADH)',
- It needs malate dehydrogenase and aspartate aminotransferase in the matrix and on the other side of the inner membrane (the cytosol and the intermembrane space), a malate-α-ketoglutarate antiporter and a glutamate-aspartate antiporter',
- Glutamate-aspartate antiporter hoạt động nhờ điện thế màng, vì vậy hệ shuttle chỉ vận hành theo một chiều

### SUMMARY_ANTPORT
- ATP và ADP không thể tự khuếch tán qua màng trong ty thể; ATP-ADP translocase trao đổi chúng theo tỷ lệ một-một',
- ATP mang nhiều hơn ADP một điện tích âm, vì vậy điện thế màng dương khiến ATP rời chất nền ty thể nhanh hơn ADP khoảng 30 lần',
- Khoảng một phần tư năng lượng của chuỗi được dùng để duy trì điện thế màng thúc đẩy quá trình trao đổi này

### SUMMARY_PYRENTRY
- Pyruvate crosses the outer membrane through porin channels and the inner membrane on the H\u207a/pyruvate symporter, which is driven by the proton gradient of the electron transport chain',
- Phản ứng chuyển tiếp trong chất nền ty thể tạo acetyl-CoA, CO₂ và NADH; coenzyme A được cấu tạo từ vitamin pantothenic acid (vitamin B5), trong đó nguyên tử sulfur mang nhóm acetyl',
- Per glucose, which gives 2 pyruvate, this makes 2 acetyl-CoA, 2 CO₂ and 2 NADH

### SUMMARY_MITODYN
- Phân chia làm tăng số lượng ty thể và cho phép tách bỏ phần bị hư hại để loại bỏ (mitophagy); hợp nhất cho phép ty thể bị tổn thương chia sẻ thành phần với ty thể khỏe mạnh, đồng thời được kích thích bởi nhu cầu năng lượng và stress',
- Drp1, mitofusin và Opa1 là các GTPase, vì vậy mỗi bước đều tiêu tốn GTP. Trình tự diễn ra là màng ngoài được hợp nhất nhờ mitofusin, sau đó đến màng trong nhờ Opa1',
- Ty thể luôn hình thành từ ty thể có sẵn: quá trình sinh tổng hợp ty thể (được kích hoạt bởi PGC-1α) bổ sung vật chất ty thể mới, còn phân chia làm tăng số lượng bào quan

### SUMMARY_APOINT
- Tổn thương DNA nghiêm trọng hoạt hóa Bax; protein này tạo các lỗ trên màng ngoài ty thể, khiến cytochrome c thoát ra bào tương',
- Cytochrome c, Apaf-1 và dATP hình thành apoptosome, phức hợp này hoạt hóa procaspase-9; caspase-9 hoạt hóa các procaspase thực thi (procaspase-3), sau đó caspase-3 phân cắt các protein của tế bào',
- Tổn thương nghiêm trọng cũng ức chế các yếu tố chống apoptosis vốn có chức năng kìm hãm Bax',
- Trong trò chơi này, protein được gán cho một bước là thành phần của phức hợp trực tiếp tác động tại mũi tên phản ứng

### SUMMARY_APOEXT
- TNF làm ba chuỗi TNFR1 tập hợp lại; các death domain tuyển mộ TRADD, TRADD tuyển mộ FADD và FADD tuyển mộ procaspase-8',
- Các phân tử procaspase-8 được giữ gần nhau sẽ hoạt hóa lẫn nhau; caspase-8 hoạt hóa các procaspase thực thi, sau đó các caspase thực thi phân cắt protein của tế bào',
- Con đường ngoại sinh và nội sinh hội tụ tại các caspase thực thi',
- Trong trò chơi này, protein được gán cho một bước là thành phần của phức hợp trực tiếp tác động tại mũi tên phản ứng

### SUMMARY_GLUALA
- Ammonium được thu nhận theo hai cách: glutamate dehydrogenase gắn ammonium vào α-ketoglutarate với sự tham gia của NADPH để tạo glutamate; glutamine synthetase sử dụng ATP để bổ sung nitrogen thứ hai vào glutamate, tạo glutamine – dạng vận chuyển ammonia an toàn trong máu',
- Nitrogen được giải phóng trở lại tại nơi cần thiết: glutaminase giải phóng nitrogen của nhóm amide trong glutamine ở gan và thận; glutamate dehydrogenase sử dụng NAD⁺ để loại nhóm amino của glutamate dưới dạng NH₄⁺, đồng thời tái tạo α-ketoglutarate. NH₄⁺ sau đó đi vào chu trình urea',
- Các transaminase ALT và AST (phụ thuộc vitamin B6) chuyển nhóm amino giữa amino acid và α-ketoglutarate mà không làm thay đổi tổng lượng nitrogen: alanine tạo pyruvate, aspartate tạo oxaloacetate, còn glutamate thu nhận các nhóm amino',
- Cơ vận chuyển các nhóm amino đến gan dưới dạng alanine (chu trình glucose-alanine): ALT chuyển alanine thành pyruvate, chất này được dùng trong quá trình tân tạo glucose để tạo glucose đưa trở lại cơ; đồng thời tạo glutamate, nitrogen của glutamate đi vào chu trình urea

### SUMMARY_UREA
- Mỗi vòng chuyển hóa kết hợp một nitrogen từ ammonium và một nitrogen từ aspartate để tạo thành một phân tử urea: NH₄⁺ + HCO₃⁻ + aspartate + 3 ATP + H₂O → urea + fumarate + 2 ADP + AMP + 2 Pᵢ + PPᵢ + 2 H⁺. Counting the ATP to AMP + PPᵢ step as two bonds, because its PPᵢ is split, four high-energy phosphate bonds are spent per urea: two at carbamoyl phosphate synthetase I and two at argininosuccinate synthetase',
- Hai nguyên tử nitrogen của urea có nguồn gốc từ ammonium (thông qua carbamoyl phosphate) và aspartate (thông qua argininosuccinate); nguyên tử carbon có nguồn gốc từ bicarbonate',
- Bước 1 và 2 diễn ra trong chất nền ty thể, còn bước 4 đến 6 diễn ra trong bào tương; chất vận chuyển trung gian đưa ornithine vào và đưa citrulline ra. Carbamoyl phosphate synthetase I xúc tác bước cam kết của chu trình và được hoạt hóa bởi N-acetylglutamate',
- Fumarate do argininosuccinate lyase tạo ra đi vào chu trình TCA (fumarate chuyển thành malate, rồi oxaloacetate và được chuyển amin trở lại thành aspartate), qua đó liên kết chu trình urea với chu trình TCA

### SUMMARY_CARBS
- Glycolysis: net 2 pyruvate, 2 ATP (4 made, 2 spent) and 2 NADH per glucose',
- Fermentation re-oxidizes the 2 NADH so glycolysis can run without oxygen: lactate dehydrogenase makes 2 lactate, or pyruvate decarboxylase and alcohol dehydrogenase make 2 ethanol and 2 CO₂',
- Gluconeogenesis: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺. Seven glycolytic enzymes run backwards (the arrows with two heads) and four bypass enzymes get round the irreversible steps',
- Glucose 6-phosphate is the hub between glucose and glycogen. Glycogen synthase and glycogen phosphorylase are different enzymes, so storage and breakdown are regulated separately

### SUMMARY_TCA
- Glucose được oxy hóa hoàn toàn thành 6 CO₂: glycolysis, the link reaction and the TCA cycle make 10 NADH, 2 FADH₂ and 4 ATP or GTP net per glucose',
- Pyruvate crosses the outer membrane through porin and the inner membrane on the H⁺/pyruvate symporter, and the link reaction makes acetyl-CoA, CO₂ and NADH in the matrix

### SUMMARY_ETC
- The electron transport chain passes the electrons of NADH and FADH₂ to oxygen: about 10 H⁺ pumped per NADH and 6 per FADH₂, enough for about 2.5 and 1.5 ATP',
- The shuttles carry the electrons of cytosolic NADH into the matrix, and ATP synthase và protein chuyển vị ATP-ADP make and export ATP

### SUMMARY_CELLBIO
- Mitochondria divide and fuse (Drp1, the mitofusins, Opa1): fission cuts off a damaged piece and makes more organelles, fusion lets a damaged mitochondrion share its contents with a healthy one',
- Severe damage switches on Bax, which makes pores in the outer mitochondrial membrane, and cytochrome c escapes into the cytosol. Cytochrome c, Apaf-1 and dATP form the apoptosome, which activates procaspase-9, and caspase-9 activates the executioner procaspases (the intrinsic pathway)',
- TNF brings three TNFR1 chains together; TRADD, FADD and procaspase-8 are recruited, procaspase-8 molecules held close together activate each other, and caspase-8 activates the executioner procaspases (the extrinsic pathway)',
- The two pathways meet at the executioner caspases, and caspase-3 cuts the cellular proteins

### SUMMARY_ALL
- Glycolysis: net 2 pyruvate, 2 ATP and 2 NADH per glucose. Fermentation (lactate or ethanol) re-oxidizes the NADH so glycolysis can run without oxygen',
- Gluconeogenesis reverses glycolysis with four bypass enzymes. Glycogen is built and broken down by different enzymes, with glucose 6-phosphate as the hub',
- Per pyruvate the link reaction and the TCA cycle give 3 CO₂, 4 NADH, 1 FADH₂ and 1 GTP',
- Beta-oxidation: each turn of the spiral gives 1 FADH₂, 1 NADH and 1 acetyl-CoA and shortens the fatty acyl-CoA by 2 carbons',
- The electron transport chain passes the electrons of NADH and FADH₂ to oxygen: about 10 H\u207a pumped per NADH and 6 per FADH₂, enough for about 2.5 and 1.5 ATP
- ].concat(SUMMARY_CELLBIO, MG.pathways.gluala.summary, MG.pathways.urea.summary);
- var ENTRY = { x: 1600, y: 3150 };
- var ENTRY_DX = ENTRY.x - 150, ENTRY_DY = ENTRY.y - 150;
- var MATRIX_X = ENTRY_DX + 150 + 2 * 380;
- var HUB_X = ENTRY_DX + 150 + 3 * 380;
- var TCA_DX = MATRIX_X - 150, TCA_DY = ENTRY_DY + 40;
- function ringAt(x, y) { return [x + TCA_DX, y + TCA_DY

## 5. Bộ Tính Toán ATP & Sổ Cái Năng Lượng (ATP Calculator & Ledger Strings)

### 5.1 Quy ước tính toán (Conventions)
- **Modern Convention:** `NADH 2.5, FADH₂ 1.5` — *Mỗi NADH tương đương 2,5 ATP và mỗi FADH₂ tương đương 1,5 ATP; do đó, một glucose tạo ra 30 hoặc 32 ATP.*
- **Classic Convention:** `NADH 3, FADH₂ 2` — *Mỗi NADH tương đương 3 ATP và mỗi FADH₂ tương đương 2 ATP; do đó, một glucose tạo ra 36 hoặc 38 ATP.*
- **Chế độ Guided:** *Hiển thị sản phẩm tạo thành ở từng bước trong khi bạn tính toán.*
- **Chế độ Recall:** *Không hiển thị thông tin. Hãy dùng Gợi ý hoặc Hiện đáp án khi gặp khó khăn.*

### 5.2 Các kịch bản tính ATP (Scenarios)
| Mã Scenario | Tiêu đề Kịch bản (English Title) | Phụ đề & Mục tiêu |
| :--- | :--- | :--- |
| `tca` | **Một vòng của chu trình TCA** | Từ một acetyl-CoA đến CO₂ |
| `pyruvate` | **Pyruvate thành CO₂** | None |
| `glycolysis` | **Đường phân trong điều kiện có oxygen** | Glucose thành pyruvate, then the shuttle |
| `glucose` | **Oxy hóa hoàn toàn một phân tử glucose** | Đường phân, phản ứng chuyển tiếp và chu trình TCA |
| `fermentation` | **Một phân tử glucose trong điều kiện thiếu oxygen** | Lên men tạo lactate hoặc ethanol |
| `uncoupled` | **Một phân tử glucose khi có chất phá ghép cặp** | Electron vẫn được truyền nhưng ATP synthase không tổng hợp ATP |
| `fattyacid` | **Một acid béo** | Hoạt hóa, beta-oxidation và chu trình TCA |
| `calvincost` | **Chu trình Calvin** | ATP và NADPH cần cho một phân tử glucose |
| `c4cost` | **Con đường C4** | Lượng ATP bổ sung cần cho quá trình vận chuyển CO₂ |
| `alanineox` | **Oxy hóa hoàn toàn alanine** | Phản ứng chuyển amin, chu trình TCA và chu trình urea |
| `aspartateox` | **Oxy hóa hoàn toàn aspartate** | Thông qua oxaloacetate và pyruvate |
| `glutamateox` | **Oxy hóa hoàn toàn glutamate** | Thông qua alpha-ketoglutarate |
| `ureacost` | **Một phân tử urea** | Năng lượng tiêu hao trong chu trình urea |
| `pentoseox` | **Oxy hóa hoàn toàn ba phân tử pentose** | Từ con đường pentose phosphate đi vào đường phân |
| `purinecost` | **Một phân tử IMP** | Năng lượng cần để tổng hợp một nucleotide purine |
| `pyrimidinecost` | **Một phân tử UMP** | Năng lượng cần để tổng hợp một nucleotide pyrimidine |

## 6. Bộ Câu Hỏi So Sánh Tương Đồng & Phân Biệt (Comparison Quizzes - `cmp-*`)

| Mã ID | Tiêu đề so sánh (Comparison Title) | Nội dung & Cặp đối chiếu (Subtitle) |
| :--- | :--- | :--- |
| `cmp-hk-gk` | **Hexokinase or glucokinase** | Một phản ứng, hai isoenzyme: ái lực, sự ức chế bởi sản phẩm và vị trí hoạt động của mỗi enzyme |
| `cmp-pfk-fbpase` | **PFK-1 or FBPase-1** | So sánh kinase của đường phân với phosphatase của tân tạo glucose và các tín hiệu điều hòa quyết định hoạt động của chúng |
| `cmp-gly-gng` | **Glycolysis or gluconeogenesis** | Vị trí diễn ra, mức tiêu hao năng lượng, các enzyme dùng chung và ba phản ứng обход qua |
| `cmp-lactate-ethanol` | **Lactate or ethanol fermentation** | Hai cách tái tạo NAD⁺ khi thiếu oxygen: sinh vật nào sử dụng con đường nào và sản phẩm được giải phóng |
| `cmp-nadh-fadh2` | **NADH or FADH** | None |
| `cmp-complex1-2` | **Complex I or Complex II** | Hai điểm đi vào chuỗi: mỗi phức hợp oxy hóa chất nào, phức hợp nào bơm proton và phức hợp nào là enzyme của chu trình TCA |
| `cmp-slp-oxphos` | **Substrate-level or oxidative phosphorylation** | Hai cách tổng hợp ATP: trực tiếp từ một chất trung gian hoặc nhờ gradient proton |
| `cmp-pdc-kgdh` | **PDC or α-KG dehydrogenase** | Hai phức hợp có cấu trúc tương tự: cơ chất đầu vào, sản phẩm đầu ra và những thành phần chung |
| `cmp-phosphorylase-synthase` | **Glycogen phosphorylase or synthase** | Phân giải hoặc tổng hợp glycogen: cơ chất, đồng yếu tố và tác động của phosphoryl hóa lên mỗi enzyme |
| `cmp-betaox-fas` | **Beta-oxidation or fatty acid synthesis** | Phân giải và tổng hợp acid béo: các khoang tế bào, chất mang, chất mang electron và đơn vị hai carbon |
| `cmp-sat-unsat` | **Saturated or unsaturated fatty acid** | So sánh acid stearic và acid oleic: cùng có 18 carbon nhưng khác nhau một liên kết đôi, ảnh hưởng thế nào đến lượng ATP tạo ra |
| `cmp-g3p-glycerol3p` | **Glyceraldehyde 3-P or glycerol 3-P** | Hai hợp chất phosphate ba carbon có tên gần giống nhau: aldehyde trong đường phân và khung cấu trúc của chất béo |
| `cmp-shuttles` | **Glycerol phosphate or malate-aspartate shuttle** | Hai cách đưa electron của NADH trong bào tương vào ty thể và lý do chúng tạo ra lượng ATP khác nhau |
| `cmp-apoptosis` | **Intrinsic or extrinsic apoptosis** | Con đường qua ty thể và con đường qua thụ thể chết: vị trí khởi đầu, caspase khởi phát và điểm hội tụ của mỗi con đường |
| `cmp-fission-fusion` | **Fission or fusion** | Cách ty thể phân chia và hợp nhất: the GTPases, the membranes and what each process is for |
| `cmp-q-cytc` | **Ubiquinone or cytochrome c** | Hai chất mang di động trong chuỗi: một lipid nằm trong màng và một protein heme ở phía bên cạnh |

## 7. Cơ Chế Phản Ứng Từng Bước (Detailed Enzyme Mechanisms - `mech-*`)

| Mã ID | Tên Enzyme & Cơ chế (Title) | Mô tả chi tiết các bước hóa sinh |
| :--- | :--- | :--- |
| `mech-aldolase` | **Aldolase: the Schiff base** | Cách lysine tại enzyme giúp phân cắt đường sáu carbon thành hai phân tử ba carbon |
| `mech-tpi` | **Triose phosphate isomerase: the enediol** | Cách nhóm carbonyl chuyển từ carbon số 2 sang carbon số 1 thông qua cis-enediol |
| `mech-gapdh` | **GAPDH: thioester, then acyl phosphate** | Cách phản ứng oxy hóa cung cấp năng lượng để tạo liên kết phosphate giàu năng lượng |
| `mech-pdc` | **Pyruvate dehydrogenase complex: E1, E2, E3** | Năm đồng yếu tố theo thứ tự: TPP, lipoamide, coenzyme A, FAD và NAD⁺ |
| `mech-aconitase` | **Aconitase: through cis-aconitate** | Cách nhóm hydroxyl chuyển từ carbon này sang carbon kế tiếp trên cụm iron-sulfur không tham gia phản ứng oxy hóa-khử |
| `mech-atpsynthase` | **ATP synthase: the binding-change cycle** | Ba trạng thái open, loose và tight: cách trục quay khiến ba vị trí lần lượt thay đổi trạng thái |
| `mech-qcycle` | **Complex III: the Q cycle** | Cách hai electron từ một ubiquinol được phân chia: một electron chuyển cho cytochrome c, electron còn lại quay trở lại quinone |
| `mech-betaox` | **Beta-oxidation: the first steps** | Từ acid béo tự do đến acetyl-CoA đầu tiên: hoạt hóa, hệ vận chuyển carnitine và bốn bước của một chu kỳ |

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
| `g1p` | **Glucose 1-phosphate** | `G1P` | `sugar` | Được tạo ra khi glycogen bị phân giải. Chỉ trở thành chất trung gian của đường phân sau khi được đồng phân hóa thành glucose 6-phosphate. |
| `r5p` | **Ribose 5-phosphate** | `R5P` | `sugar` | Sản phẩm của con đường pentose phosphate, được sử dụng để tổng hợp nucleotide. |
| `glycerol3p` | **Glycerol 3-phosphate** | `G3P (glycerol)` | `c3` | Được tạo thành từ DHAP trong quá trình tổng hợp lipid và trong glycerol phosphate shuttle. Dễ nhầm lẫn với glyceraldehyde 3-phosphate. |
| `lactate` | **Lactate** | `Lac` | `c3` | L-lactate là sản phẩm cuối của đường phân kỵ khí ở cơ đang hoạt động và hồng cầu. Gan có thể chuyển lactate trở lại thành pyruvate rồi glucose (chu trình Cori). |
| `alanine` | **Alanine** | `Ala` | `c3` | Được tạo thành từ pyruvate qua phản ứng chuyển amin. Cơ vận chuyển alanine đến gan, tại đây alanine được chuyển lại thành pyruvate để tân tạo glucose (chu trình glucose-alanine). |
| `acetaldehyde` | **Acetaldehyde** | `AcH` | `c3` | Một chất trung gian của quá trình lên men rượu. |
| `ethanol` | **Ethanol** | `EtOH` | `c3` | Sản phẩm cuối của quá trình lên men rượu ở nấm men. |
| `glutamate` | **Glutamate** | `Glu` | `acid` | Chuyển thành alpha-ketoglutarate khi nhóm amino bị loại bỏ. Đây là điểm tập hợp các nhóm amino: transaminase chuyển nhóm amino cho alpha-ketoglutarate, còn glutamine synthetase bổ sung nitrogen thứ hai để tạo glutamine. |
| `aspartate` | **Aspartate** | `Asp` | `acid` | Chuyển thành oxaloacetate khi nhóm amino bị loại bỏ. |
| `malonate` | **Malonate** | `Malon` | `acid` | Một dicarboxylate có ba carbon. Đây là chất ức chế cạnh tranh kinh điển của succinate dehydrogenase. |
| `glyoxylate` | **Glyoxylate** | `Glyox` | `acid` | Một chất trung gian của chu trình glyoxylate ở thực vật và vi khuẩn. |
| `glutamine` | **Glutamine** | `Gln` | `aminoacid` | Dạng vận chuyển ammonia an toàn trong máu: glutamine mang một nitrogen ở nhóm amide, được gan và thận giải phóng trở lại nhờ glutaminase. |
| `lysine` | **Lysine** | `Lys` | `aminoacid` | Một amino acid base có mạch nhánh bốn carbon kết thúc bằng nhóm amino; cấu trúc tương tự ornithine nhưng nhiều hơn một carbon. |
| `proline` | **Proline** | `Pro` | `aminoacid` | Một amino acid có cấu trúc vòng, có thể được tổng hợp từ ornithine (và từ glutamate). |
| `nacglu` | **N-Acetylglutamate** | `NAG` | `aminoacid` | Chất hoạt hóa dị lập thể của carbamoyl phosphate synthetase I, được tạo thành từ glutamate và acetyl-CoA; quá trình tổng hợp được arginine kích hoạt. |
| `carbamoylasp` | **N-Carbamoylaspartate** | `CAA` | `aminoacid` | Sản phẩm của aspartate transcarbamoylase trong quá trình tổng hợp pyrimidine: có phản ứng hóa học carbamoyl tương tự chu trình urea, nhưng xảy ra trên aspartate thay vì ornithine. |

## 10. Danh Mục Enzyme & Đồng Yếu Tố (Enzymes & Cofactors Catalog)

### 10.1 Danh Mục Enzyme
| Mã ID | Tên Enzyme (Name) | Viết tắt | Mã EC | Chú giải cơ chế & điều hòa (Note) |
| :--- | :--- | :--- | :--- | :--- |
| `g6pase` | **Glucose-6-phosphatase** | `G6Pase` | `3.1.3.9` | Enzyme tham gia tân tạo glucose, loại bỏ nhóm phosphate khỏi glucose 6-phosphate. |
| `fbpase` | **Fructose-1,6-bisphosphatase** | `FBPase` | `3.1.3.11` | Enzyme của quá trình tân tạo glucose, hoạt động đối lập với PFK-1. |
| `pglucomutase` | **Phosphoglucomutase** | `PGluM` | `5.4.2.2` | Xúc tác chuyển đổi qua lại giữa glucose 1-phosphate và glucose 6-phosphate. |
| `g6pdh` | **Glucose-6-phosphate dehydrogenase** | `G6PD` | `` | Enzyme đầu tiên của con đường pentose phosphate. |
| `ldh` | **Lactate dehydrogenase** | `LDH` | `1.1.1.27` | Reduces pyruvate to lactate and regenerates NAD⁺, which the glyceraldehyde 3-phosphate dehydrogenase step needs, so glycolysis can keep running without oxygen. In the liver and heart the reaction runs mostly in the other direction. |
| `pc` | **Pyruvate carboxylase** | `PC` | `6.4.1.1` | Tạo oxaloacetate từ pyruvate, là bước đầu tiên của quá trình tân tạo glucose. Cần biotin. |
| `pepck` | **PEP carboxykinase** | `PEPCK` | `4.1.1.32` | Chuyển oxaloacetate thành PEP trong quá trình tân tạo glucose. |
| `adh` | **Alcohol dehydrogenase** | `ADH` | `1.1.1.1` | Khử acetaldehyde thành ethanol trong quá trình lên men. |
| `pyrdecarb` | **Pyruvate decarboxylase** | `PDC (yeast)` | `4.1.1.1` | Enzyme ở nấm men xúc tác chuyển pyruvate thành acetaldehyde. |
| `glycerol3pdh` | **Glycerol-3-phosphate dehydrogenase** | `GPDH` | `1.1.1.8` | The NAD-linked enzyme of the cytosol. It reduces dihydroxyacetone phosphate to glycerol 3-phosphate with electrons from cytosolic NADH, the first step of the glycerol phosphate shuttle; it also links glycolysis to lipid synthesis. |
| `gdh` | **Glutamate dehydrogenase** | `GDH` | `1.4.1.3` | The enzyme that joins amino acid metabolism to the TCA cycle: it removes the amino group of glutamate as ammonium (oxidative deamination) and, run the other way, adds ammonium to alpha-ketoglutarate to make glutamate. It uses NAD⁺ for the deamination and NADPH for the amination, and it works in the mitochondria of the liver. |
| `alt` | **Alanine aminotransferase** | `ALT` | `2.6.1.2` | A vitamin B6 enzyme that moves an amino group between alanine and glutamate: alanine gives its amino group to alpha-ketoglutarate, which makes pyruvate and glutamate. In the glucose-alanine cycle it runs in the muscle toward alanine and in the liver back toward pyruvate; a high level of ALT in the blood is a sign of liver damage. |
| `ast` | **Aspartate aminotransferase** | `AST` | `2.6.1.1` | A vitamin B6 enzyme that moves an amino group between aspartate and glutamate. One isoform in the matrix and one in the cytosol run the two transamination steps of the malate-aspartate shuttle. |
| `ndpk` | **Nucleoside diphosphate kinase** | `NDPK` | `` | Moves a terminal phosphate between nucleoside diphosphates and triphosphates, for example GTP + ADP to GDP + ATP. |
| `malic` | **Malic enzyme** | `ME` | `` | Xúc tác phản ứng khử carboxyl của malate để tạo pyruvate. |
| `mdh1` | **Cytosolic malate dehydrogenase** | `MDH1` | `1.1.1.37` | The NAD-linked enzyme of the cytosol that works on four-carbon acids. It reduces oxaloacetate to malate with the electrons of cytosolic NADH, the first step of the malate-aspartate shuttle. |
| `gpd2` | **Mitochondrial glycerol phosphate dehydrogenase** | `GPD2` | `1.1.5.3` | Đưa electron vào ubiquinol, bỏ qua Complex I (trong glycerol phosphate shuttle). |
| `glycogensynthase` | **Glycogen synthase** | `GYS` | `2.4.1.11` | Adds glucose from UDP-glucose to the non-reducing end of a glycogen chain (alpha-1,4 bonds). It is the key regulated enzyme of glycogen synthesis, inhibited by phosphorylation. |
| `glycogenphosphorylase` | **Glycogen phosphorylase** | `GP` | `2.4.1.1` | Breaks glycogen from its non-reducing ends by phosphorolysis: inorganic phosphate, not water, cleaves the bond, so the glucose is released already phosphorylated (glucose 1-phosphate) and no ATP is spent. Needs pyridoxal phosphate. |
| `ugpase` | **UDP-glucose pyrophosphorylase** | `UGP` | `2.7.7.9` | Joins glucose 1-phosphate to the UMP part of UTP, releasing pyrophosphate. Breakdown of the pyrophosphate by pyrophosphatase pulls the reaction forward. The UMP unit is transferred onto the sugar, not released. |
| `lipase` | **Lipases** | `Lipase` | `3.1.1.3` | Hydrolyze the ester bonds of triacylglycerol, releasing free fatty acids and glycerol. In fat cells hormone-sensitive lipase is switched on by epinephrine and glucagon. |
| `acs` | **Fatty acyl-CoA synthetase** | `ACS` | `6.2.1.3` | Activates a fatty acid by joining it to coenzyme A. ATP is cleaved to AMP and pyrophosphate (two high-energy bonds are used), and the activated chain is then carried into the mitochondrion by the carnitine shuttle. Lipases release the acids from fat, and this enzyme activates them. |
| `acadh` | **Acyl-CoA dehydrogenase** | `ACAD` | `1.3.8.7` | The first step of each round of beta-oxidation: it removes two hydrogens from the alpha and beta carbons, forming a trans double bond. Its FAD passes electrons to the electron transport chain (through ETF). |
| `enoylh` | **Enoyl-CoA hydratase** | `ECH` | `4.2.1.17` | Adds water across the trans double bond, putting an L-hydroxyl group on the beta carbon. |
| `hadh` | **L-Hydroxyacyl-CoA dehydrogenase** | `HADH` | `1.1.1.35` | Oxidizes the beta-hydroxyl group to a ketone with NAD⁺, giving a beta-ketoacyl-CoA. |
| `thiolase` | **β-Ketoacyl-CoA thiolase** | `Thiolase` | `2.3.1.16` | Cleaves the beta-ketoacyl-CoA between the alpha and beta carbons using a new coenzyme A: acetyl-CoA is released and the acyl-CoA, two carbons shorter, returns to the start of the spiral. |
| `acc` | **Acetyl-CoA carboxylase** | `ACC` | `6.4.1.2` | The committed step of fatty acid SYNTHESIS (acetyl-CoA to malonyl-CoA), the opposite direction from beta-oxidation. |
| `cpt1` | **Carnitine palmitoyltransferase I** | `CPT1` | `2.3.1.21` | Moves long-chain acyl groups onto carnitine so they can enter the mitochondrion; the main control point of beta-oxidation. |
| `debranch` | **Glycogen debranching enzyme** | `GDE` | `3.2.1.33` | Removes alpha-1,6 branches so glycogen phosphorylase can keep working. |
| `branching` | **Glycogen branching enzyme** | `GBE` | `2.4.1.18` | Makes the alpha-1,6 branches of glycogen. |
| `cps2` | **Carbamoyl phosphate synthetase II** | `CPS II` | `6.3.5.5` | The cytosolic isoform of pyrimidine synthesis. It makes carbamoyl phosphate from glutamine instead of ammonium and is not activated by N-acetylglutamate. |
| `atcase` | **Aspartate transcarbamoylase** | `ATCase` | `2.1.3.2` | The first committed enzyme of pyrimidine synthesis: it moves the carbamoyl group of carbamoyl phosphate onto aspartate instead of ornithine. |
| `nos` | **Nitric oxide synthase** | `NOS` | `1.14.13.39` | Sử dụng arginine, NADPH và oxygen để tạo nitric oxide và citrulline: một hướng chuyển hóa khác của arginine. |
| `urease` | **Urease** | `Urease` | `3.5.1.5` | Enzyme chứa nickel ở vi khuẩn và thực vật (không có ở người), xúc tác phân giải urea thành ammonia và CO₂. |
| `nags` | **N-Acetylglutamate synthase** | `NAGS` | `2.3.1.1` | Makes N-acetylglutamate from glutamate and acetyl-CoA; arginine switches it on, and its product activates carbamoyl phosphate synthetase I. |
| `gs` | **Glutamine synthetase** | `GS` | `6.3.1.2` | Giữ ammonium dưới dạng glutamine nhờ ATP; não và cơ vận chuyển ammonia ra ngoài dưới dạng glutamine (cơ còn vận chuyển dưới dạng alanine). |
| `odc` | **Ornithine decarboxylase** | `ODC` | `4.1.1.17` | Chuyển ornithine thành putrescine, bước đầu tiên của quá trình tổng hợp polyamine: một hướng chuyển hóa khác của ornithine. |
| `glnase` | **Glutaminase** | `GLS` | `3.5.1.2` | Releases ammonium from the amide group of glutamine, in the liver, where it feeds the urea cycle, and in the kidney, where it is excreted. |

### 10.2 Danh Mục Đồng Yếu Tố (Cofactors & Coenzymes)
| Mã ID | Tên Cofactor (Name) | Hiển thị | Họ nhóm | Chú giải chức năng (Note) |
| :--- | :--- | :--- | :--- | :--- |
| `atp` | **Adenosine triphosphate** | `ATP` | `adenylate` | Đồng tiền năng lượng chủ yếu của tế bào, truyền năng lượng hóa học thông qua các liên kết phosphate giàu năng lượng. |
| `adp` | **Adenosine diphosphate** | `ADP` | `adenylate` | Cơ chất để tổng hợp ATP, nhận nhóm phosphate trong phosphoryl hóa mức cơ chất và phosphoryl hóa oxy hóa. |
| `amp` | **Adenosine monophosphate** | `AMP` | `adenylate` | Chất hoạt hóa dị lập thể, báo hiệu trạng thái năng lượng của tế bào đang thấp. |
| `nad` | **Nicotinamide adenine dinucleotide (oxidized)** | `NAD⁺` | `redox` | Chất oxy hóa/chất nhận electron chủ yếu trong các quá trình dị hóa (đường phân, chu trình TCA, beta-oxidation). |
| `nadh` | **Nicotinamide adenine dinucleotide (reduced)** | `NADH` | `redox` | Mang hai electron giàu năng lượng đến Complex I của chuỗi hô hấp. |
| `fad` | **Flavin adenine dinucleotide (oxidized)** | `FAD` | `redox` | Nhóm ngoại nhận electron của succinate dehydrogenase và acyl-CoA dehydrogenase. |
| `fadh2` | **Flavin adenine dinucleotide (reduced)** | `FADH₂` | `redox` | Truyền electron trực tiếp đến ubiquinone thông qua Complex II/ETF. |
| `nadp` | **NADP⁺ (oxidized)** | `NADP⁺` | `redox` | Chất nhận electron trong pha oxy hóa của con đường pentose phosphate. |
| `nadph` | **NADPH (reduced)** | `NADPH` | `redox` | Nguồn cung cấp lực khử cho các con đường sinh tổng hợp (acid béo, cholesterol) và tái tạo glutathione. |
| `coa` | **Coenzyme A** | `CoA-SH` | `carrier` | Chất mang nhóm acyl, tạo các liên kết thioester giàu năng lượng (acetyl-CoA, succinyl-CoA). |
| `tpp` | **Thiamine pyrophosphate** | `TPP` | `carrier` | Đồng yếu tố có nguồn gốc vitamin B₁, tham gia phản ứng khử carboxyl oxy hóa của các α-keto acid (PDC, α-KGDH). |
| `lipoamide` | **Lipoamide** | `Lip` | `carrier` | Đồng yếu tố dạng cánh tay linh động, vận chuyển nhóm acyl và electron bên trong các phức hợp pyruvate dehydrogenase và α-ketoglutarate dehydrogenase. |
| `biotin` | **Biotin** | `Biotin` | `carrier` | Đồng yếu tố có nguồn gốc vitamin B₇ trong các phản ứng carboxyl hóa (pyruvate carboxylase, acetyl-CoA carboxylase). |
| `plp` | **Pyridoxal 5′-phosphate** | `PLP` | `carrier` | Coenzyme có nguồn gốc vitamin B₆, tạo Schiff base trong các phản ứng chuyển amin, khử carboxyl và phân giải glycogen. |
| `pi` | **Inorganic phosphate** | `Pᵢ` | `small` | Ion orthophosphate vô cơ tham gia phosphoryl hóa và phân giải bằng phosphate (phosphorolysis). |
| `ppi` | **Inorganic pyrophosphate** | `PPᵢ` | `small` | Diphosphate được giải phóng trong quá trình tổng hợp acid nucleic và hoạt hóa acyl-CoA; nhanh chóng bị thủy phân để thúc đẩy phản ứng theo chiều thuận. |
| `co2` | **Carbon dioxide** | `CO₂` | `small` | Sản phẩm một carbon của quá trình khử carboxyl hoàn toàn và là cơ chất cho phản ứng carboxyl hóa. |
| `h2o` | **Water** | `H₂O` | `small` | Dung môi, chất tham gia các phản ứng thủy phân và hydrat hóa, đồng thời là sản phẩm phụ của quá trình vận chuyển electron. |

---
*Tài liệu được trích xuất và hệ thống hóa trực tiếp từ source code `pathway_quiz.html`.*