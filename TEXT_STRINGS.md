# Khai Báo Toàn Bộ Chuỗi Text Tiếng Anh (English Text Strings & i18n Catalog)

Tài liệu này tổng hợp và khai báo toàn bộ các chuỗi văn bản (English text strings) trong toàn bộ dự án `Biochemical Pathways Game` (`pathway_quiz.html`), phục vụ công tác đối soát, dịch thuật, bản địa hóa (i18n/l10n) sang Tiếng Việt hoặc các ngôn ngữ khác.

---

## 1. Giao Diện Người Dùng, Điều Hướng & Thông Báo Hệ Thống (UI Labels & System Strings)

### 1.1 Thương hiệu & Tiêu đề chung (Brand & Headers)
| Khóa / Ngữ cảnh | Chuỗi Text Tiếng Anh | Ghi chú ngữ nghĩa |
| :--- | :--- | :--- |
| `app.title` | `Pathway Quiz` | Tên ứng dụng trên thanh tab & header |
| `app.author` | `Benjamin E. Peterson` | Tác giả |
| `app.copyright` | `Copyright (c) 2026 Benjamin E. Peterson. All rights reserved.` | Thông tin bản quyền |
| `app.license_notice` | `Free to use for personal study and teaching; see LICENSE.` | Điều khoản sử dụng |
| `brand.tagline` | `Learn metabolic pathways by building them.` | Khẩu hiệu trên menu |
| `menu.advanced_btn` | `Advanced` | Nút kích hoạt con đường nâng cao |
| `menu.advanced_desc` | `Photosynthesis, cell signaling and nucleotides with quizzes of their own, and Everything then holds every pathway.` | Mô tả con đường nâng cao |

### 1.2 Chế độ chơi & Định dạng Quiz (Game Modes & Formats)
| Khóa chế độ | Tên hiển thị (Display Name) | Mô tả cách chơi |
| :--- | :--- | :--- |
| `mode.build` | `Build` | Dựng bản đồ từng bước, trả lời một câu hỏi mỗi lần |
| `mode.pick` | `Fill the Map` | Bản đồ khuyết với 6 phương án trắc nghiệm cho mỗi ô |
| `mode.type` | `Fill in the Blank` | Bản đồ khuyết tự gõ bàn phím chính xác tên chất |
| `mode.practice` | `Practice weak steps` | Chế độ luyện tập chuyên biệt các bước hay làm sai |
| `format.names` | `names` | Hiển thị tên văn bản của phân tử |
| `format.structures` | `structures` | Hiển thị công thức cấu tạo hóa học 2D |
| `format.mixed` | `mixed` | Kết hợp cả tên và cấu trúc |

### 1.3 Nút bấm & Điều khiển điều hướng (Buttons & Action Controls)
| Vị trí / Component | Text hiển thị (English) | Chức năng |
| :--- | :--- | :--- |
| Main Menu | `Play` | Bắt đầu chơi con đường đã chọn |
| Navigation | `Back to Menu` / `Back to menu` | Thoát về màn hình danh mục chính |
| Navigation | `Course overview` | Xem tổng quan các chặng trong lộ trình |
| Results Screen | `Play Again` | Chơi lại con đường vừa xong |
| Results Screen | `Try a Harder Mode` | Thử thách mức độ khó hơn (Build -> Pick -> Type) |
| Results Screen | `Practice missed steps` | Ôn lại chỉ những bước vừa làm sai |
| Results Screen | `Review the Map` | Xem lại toàn bộ bản đồ hoàn chỉnh kèm chú giải |
| Quiz Controls | `Hint` | Yêu cầu một gợi ý |
| Quiz Controls | `Reveal` | Tiết lộ đáp án (tính là một lỗi sai) |
| Quiz Controls | `Clear` | Xóa nét vẽ hoặc ô nhập liệu |
| Quiz Controls | `Submit` | Nộp câu trả lời |
| Canvas Controls | `Zoom in` | Phóng to bản đồ |
| Canvas Controls | `Zoom out` | Thu nhỏ bản đồ |
| Canvas Controls | `Reset view` | Đưa bản đồ về vị trí trung tâm |
| Modal | `Close` | Đóng hộp thoại |

### 1.4 Thiết lập ứng dụng (Settings & Preferences)
| Mục cài đặt | Nhãn / Tùy chọn (English) | Mô tả tính năng |
| :--- | :--- | :--- |
| Settings Title | `Settings` | Tiêu đề hộp thoại cài đặt |
| Theme Option 1 | `Light` | Giao diện nền sáng |
| Theme Option 2 | `Dark` | Giao diện nền tối bảo vệ mắt |
| Theme Option 3 | `Auto` | Tự động thích ứng theo hệ điều hành thiết bị |
| Cofactors Setting | `Cofactors` | Bật/tắt việc hỏi ATP, ADP, NAD⁺, H₂O trong bài thi |
| Animations Setting | `Reduced motion` | Giảm các hiệu ứng chuyển động rung lắc |

### 1.5 Kết quả, Đánh giá & Thống kê (Results & Feedback Metrics)
| Nhãn thống kê | Chuỗi Text Tiếng Anh | Ý nghĩa |
| :--- | :--- | :--- |
| Score Ring | `Score` | Điểm số phần trăm độ chính xác (%) |
| Stat Right | `right` | Số bước trả lời đúng |
| Stat Wrong | `wrong` | Số bước trả lời sai |
| Stat Time | `time` | Thời gian hoàn thành (mm:ss) |
| Stat Hints | `hints` | Số lần người dùng bấm trợ giúp Gợi ý |
| Stat Revealed | `revealed` | Số lần người dùng bấm Tiết lộ đáp án |
| Feedback Toast | `Nothing to show for that yet` | Thông báo khi chưa có dữ liệu chi tiết |

## 2. Câu Hỏi Quiz & Mẫu Gợi Ý (Prompts & Hint Templates)

| Mã Prompt | Chuỗi Text Tiếng Anh (English Prompt) | Ngữ cảnh sử dụng |
| :--- | :--- | :--- |
| `product` | `What is the product?` | Hỏi chất sản phẩm chính của bước |
| `productOne` | `Name one product of this step.` | Hỏi 1 trong nhiều sản phẩm |
| `productOther` | `Name the other product.` | Hỏi sản phẩm còn lại |
| `substrate` | `What is the missing substrate?` | Hỏi chất phản ứng / cơ chất đầu vào |
| `consumeOne` | `Name one thing this step consumes.` | Hỏi chất bị tiêu thụ |
| `consumeMore` | `What else does this step consume?` | Hỏi chất phụ bị tiêu thụ thêm |
| `enz` | `Which enzyme catalyzes this step?` | Hỏi tên enzyme xúc tác |
| `cof` | `Which cofactor is needed?` | Hỏi coenzyme hoặc đồng yếu tố |
| `direction` | `Does this reaction run forward, reverse, or both?` | Hỏi tính thuận nghịch của phản ứng |

## 3. Danh Mục 22+ Con Đường Chuyển Hóa & Khóa Học (Pathways & Courses)

| Mã ID | Tiêu đề (English Title) | Tag | Phụ đề (Subtitle / Description) |
| :--- | :--- | :--- | :--- |
| `glycolysis` | **Glycolysis** | `GLY` | Glucose to pyruvate |
| `lactate` | **Lactic Acid Fermentation** | `LAC` | Glucose to lactate without oxygen |
| `glycogen` | **Glycogen Metabolism** | `GLG` | Glycogen synthesis and breakdown |
| `gluconeogenesis` | **Gluconeogenesis** | `GNG` | Pyruvate back to glucose |
| `ethanol` | **Alcohol Fermentation** | `ETH` | Glucose to ethanol without oxygen |
| `pdhtca` | **Pyruvate to CO₂** | `PDH` | Pyruvate dehydrogenase and the TCA cycle |
| `betaox` | **Beta-Oxidation** | `FAO` | Fat to acetyl-CoA |
| `boxsimple` | **Beta-Oxidation, Simple** | `BOS` | The four-step cycle that cuts fat into acetyl-CoA |
| `etc` | **Electron Transport Chain** | `ETC` | NADH and FADH\u2082 to oxygen and ATP |
| `etcsimple` | **Electron Transport, Simple** | `ETS` | NADH and FADH₂ to oxygen, then ATP |
| `tca` | **TCA Cycle** | `TCA` | Acetyl-CoA to CO₂ |
| `full` | **Glucose to CO₂** | `FULL` | Glycolysis, link reaction and TCA cycle |
| `etcpath` | **Electron Carriers in Order** | `ETP` | NADH to oxygen, carrier by carrier |
| `gpshuttle` | **Glycerol Phosphate Shuttle** | `GPS` | Cytosolic NADH electrons to ubiquinone |
| `masshuttle` | **Malate-Aspartate Shuttle** | `MAS` | Cytosolic NADH electrons to matrix NADH |
| `antport` | **ATP Synthesis and Export** | `ANT` | ATP synthase and the ATP-ADP translocase |
| `pyrentry` | **Pyruvate Entry and Link Reaction** | `PYE` | Through two membranes to acetyl-CoA |
| `mitodyn` | **Mitochondrial Fission and Fusion** | `MDY` | How mitochondria divide and join |
| `apopint` | **Apoptosis: Intrinsic Pathway** | `AIN` | The mitochondrial route to cell death |
| `apopext` | **Apoptosis: Extrinsic Pathway** | `AEX` | The death receptor route to cell death |
| `urea` | **Urea Cycle** | `URE` | Ammonia to urea |
| `gluala` | **Glutamate and Alanine** | `GLA` | Ammonium capture and release, and the transaminases |
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
| `gly` | **Glycolysis** | `` |  |
| `link` | **Pyruvate to acetyl-CoA** | `` |  |
| `act` | **Activation** | `` |  |
| `box` | **Beta-oxidation** | `` |  |
| `db` | **Double bonds** | `` |  |
| `read` | **Read the structure** | `` |  |

## 4. Tóm Tắt & Cân Bằng Chuyển Hóa (Pathway Net Summaries)

### SUMMARY_GLY
- Net per glucose: 2 pyruvate, 2 ATP, 2 NADH, 2 H₂O',
- ATP: 2 spent (steps 1 and 3), 4 made (steps 7 and 10, once per triose)',
- Glucose + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 Pyruvate + 2 NADH + 2 ATP + 2 H⁺ + 2 H₂O',
- Control points: hexokinase, phosphofructokinase-1 and pyruvate kinase catalyze the three irreversible steps. They are regulated by allosteric effectors, covalent modification and gene transcription, and ATP is the master regulator

### SUMMARY_TCA
- Per acetyl-CoA: 2 CO₂, 3 NADH, 1 FADH₂, 1 GTP',
- CO₂ leaves at isocitrate dehydrogenase and α-ketoglutarate dehydrogenase; water is used at citrate synthase and fumarase',
- Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pᵢ + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + 2 H⁺ + CoA-SH',
- Five of the nine reactions, counting the link reaction, are catalyzed by dehydrogenases. Control points: the pyruvate dehydrogenase complex, citrate synthase, isocitrate dehydrogenase and the α-ketoglutarate dehydrogenase complex; ATP and NADH inhibit them, and ADP and NAD⁺ stimulate isocitrate dehydrogenase

### SUMMARY_GLYCOGEN
- Synthesis: glucose 6-phosphate → glucose 1-phosphate → UDP-glucose → glycogen. Each glucose added costs one UTP, an ATP equivalent (the UDP is re-phosphorylated by nucleoside diphosphate kinase, and splitting the pyrophosphate pulls the activation step forward).',
- Breakdown: glycogen phosphorylase uses Pᵢ, so each glucose leaves as glucose 1-phosphate without spending ATP',
- Synthesis and breakdown use different enzymes, so they can be regulated separately

### SUMMARY_GNG
- Net: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺',
- Seven glycolytic enzymes work in both directions; four bypass enzymes (pyruvate carboxylase, PEP carboxykinase, fructose-1,6-bisphosphatase, glucose-6-phosphatase) get round the irreversible steps',
- Six high-energy phosphate bonds are spent per glucose, against two gained in glycolysis

### SUMMARY_ETOH
- Net per glucose: 2 ethanol, 2 CO₂ and 2 ATP (4 made, 2 spent)',
- Glucose + 2 ADP + 2 Pᵢ + 2 H⁺ → 2 Ethanol + 2 CO₂ + 2 ATP + 2 H₂O',
- Alcohol dehydrogenase re-oxidizes the 2 NADH made at the glyceraldehyde 3-phosphate dehydrogenase step, so glycolysis can keep running without oxygen

### SUMMARY_PDHTCA
- Per pyruvate: 3 CO₂, 4 NADH, 1 FADH₂ and 1 GTP (1 NADH comes from the link reaction)',
- Per glucose, which gives 2 pyruvate: 6 CO₂, 8 NADH, 2 FADH₂ and 2 GTP from this part of the pathway

### SUMMARY_BETAOX
- Each turn of the spiral gives 1 FADH₂, 1 NADH and 1 acetyl-CoA and shortens the fatty acyl-CoA by 2 carbons',
- Palmitoyl-CoA (16 carbons) needs 7 turns: 7 FADH₂, 7 NADH and 8 acetyl-CoA',
- Activation costs two high-energy phosphate bonds (ATP is cleaved to AMP and PPᵢ)

### SUMMARY_LAC
- Net per glucose: 2 lactate and 2 ATP (4 made, 2 spent)',
- Glucose + 2 ADP + 2 P\u1D62 \u2192 2 Lactate + 2 ATP + 2 H₂O',
- Lactate dehydrogenase turns the 2 NADH made at the glyceraldehyde 3-phosphate dehydrogenase step back into NAD⁺, so glycolysis can keep running without oxygen

### SUMMARY_ETC
- Per NADH: about 10 H⁺ pumped (4 at Complex I, 4 at Complex III, 2 at Complex IV), enough for about 2.5 ATP',
- Per FADH₂: about 6 H⁺ pumped (Complex II pumps none), enough for about 1.5 ATP',
- Overall: NADH + H⁺ + \u00BD O₂ \u2192 NAD⁺ + H₂O, with about 4 H⁺ flowing through ATP synthase for each ATP made

### SUMMARY_ETCSIMPLE
- Electrons enter at Complex I (from NADH) or at Complex II (from FADH₂), reach ubiquinone, then pass through Complex III, cytochrome c and Complex IV to oxygen, which becomes water',
- Per NADH about 10 H⁺ are pumped out of the matrix (4 at Complex I, 4 at Complex III, 2 at Complex IV); Complex II pumps none, so FADH₂ gives about 6',
- ATP synthase lets the protons back in and makes ATP: about 2.5 ATP per NADH and 1.5 per FADH₂ (the P/O ratios)

### SUMMARY_BOXSIMPLE
- Every lap of the cycle is four steps: oxidize (FAD), add water, oxidize again (NAD⁺), then cut off two carbons as acetyl-CoA',
- Each lap gives 1 FADH₂, 1 NADH and 1 acetyl-CoA and makes the chain 2 carbons shorter',
- Palmitic acid (16 carbons) needs 7 laps: 7 FADH₂, 7 NADH and 8 acetyl-CoA',
- Activation costs 2 ATP equivalents (ATP becomes AMP and PPᵢ); the ATP Calculator adds it all up (106 ATP for palmitic acid)

### SUMMARY_FULL
- Glucose is completely oxidized to 6 CO₂',
- Per glucose: 10 NADH, 2 FADH₂ and 4 ATP or GTP net from substrate-level phosphorylation (glycolysis makes 4 and spends 2, the cycle makes 2 GTP)',
- Glycolysis gives 2 pyruvate, the link reaction gives 2 acetyl-CoA, and the cycle turns twice',
- With the round numbers 3 ATP per NADH and 2 per FADH₂, the yield is 36 ATP in a cell that moves the two cytosolic NADH in with the glycerol phosphate shuttle (38 with the malate-aspartate shuttle, and 38 in bacteria, which need no shuttle)',
- With the more realistic 2.5 ATP per NADH and 1.5 per FADH₂ it is about 30 ATP with the glycerol phosphate shuttle and about 32 with the malate-aspartate shuttle (10 H⁺ per NADH and about 4 H⁺ per ATP give 2.5, and leaks and other uses of the gradient lower the yield further)

### SUMMARY_ETCPATH
- Electrons pass through the carriers in roughly increasing order of redox potential, from NADH (about \u22120.32 V) to oxygen (about +0.82 V)',
- Complexes I, III and IV pump protons: 4 H⁺ at Complex I, 4 at Complex III and 2 at Complex IV, so 10 H⁺ for each NADH',
- Flavins and ubiquinone carry two electrons and two protons, iron-sulfur centers carry one electron, and cytochromes carry one electron through the heme iron (Fe³⁺ to Fe²⁺)',
- Rotenone blocks Complex I, antimycin A blocks Complex III, and cyanide and carbon monoxide block Complex IV

### SUMMARY_GPSHUTTLE
- NADH cannot cross the inner membrane, so its electrons are moved in by a shuttle',
- In the glycerol phosphate shuttle the electrons end up on FADH₂ and enter the chain at ubiquinone, skipping Complex I, so each cytosolic NADH yields about 1.5 ATP instead of 2.5

### SUMMARY_MASHUTTLE
- The malate-aspartate shuttle returns the electrons of cytosolic NADH as NADH in the matrix, so they enter at Complex I (about 2.5 ATP for each NADH)',
- It needs malate dehydrogenase and aspartate aminotransferase in the matrix and on the other side of the inner membrane (the cytosol and the intermembrane space), a malate-α-ketoglutarate antiporter and a glutamate-aspartate antiporter',
- The glutamate-aspartate antiporter is driven by the membrane potential, so the shuttle runs in one direction only

### SUMMARY_ANTPORT
- ATP and ADP do not diffuse across the inner membrane: the ATP-ADP translocase exchanges them one for one',
- ATP carries one more negative charge than ADP, so the positive membrane potential makes ATP leave the matrix about 30 times faster than ADP does',
- About a quarter of the energy of the chain is spent keeping the membrane potential that drives this exchange

### SUMMARY_PYRENTRY
- Pyruvate crosses the outer membrane through porin channels and the inner membrane on the H\u207a/pyruvate symporter, which is driven by the proton gradient of the electron transport chain',
- The link reaction in the matrix makes acetyl-CoA, CO₂ and NADH; coenzyme A is built from the vitamin pantothenic acid (vitamin B5), and its sulfur carries the acetyl group',
- Per glucose, which gives 2 pyruvate, this makes 2 acetyl-CoA, 2 CO₂ and 2 NADH

### SUMMARY_MITODYN
- Fission raises the number of mitochondria and lets a damaged piece be cut off and removed (mitophagy); fusion lets a damaged mitochondrion share its contents with a healthy one, and is stimulated by energy demand and stress',
- Drp1, the mitofusins and Opa1 are GTPases, so every step spends GTP. The order is outer membranes by the mitofusins, then inner membranes by Opa1',
- Mitochondria always arise from pre-existing mitochondria: biogenesis (which PGC-1α switches on) adds new mitochondrial material, and fission divides it into more organelles

### SUMMARY_APOINT
- Severe DNA damage switches on Bax, which makes pores in the outer mitochondrial membrane, and cytochrome c escapes into the cytosol',
- Cytochrome c, Apaf-1 and dATP form the apoptosome, which activates procaspase-9; caspase-9 activates the executioner procaspases (procaspase-3), and caspase-3 cuts the cellular proteins',
- Severe damage also inhibits the anti-apoptotic factors that would hold Bax back',
- In this game the protein of a step is the part of the complex that acts at the arrow

### SUMMARY_APOEXT
- TNF brings three TNFR1 chains together; the death domains recruit TRADD, TRADD recruits FADD, and FADD recruits procaspase-8',
- Procaspase-8 molecules held close together activate each other; caspase-8 activates the executioner procaspases, and the executioner caspases cut the cellular proteins',
- The extrinsic and the intrinsic pathway meet at the executioner caspases',
- In this game the protein of a step is the part of the complex that acts at the arrow

### SUMMARY_GLUALA
- Ammonium is captured in two ways: glutamate dehydrogenase adds it to α-ketoglutarate with NADPH to make glutamate, and glutamine synthetase adds a second nitrogen to glutamate with ATP to make glutamine, the safe carrier of ammonia in the blood',
- The nitrogen is released again where it is needed: glutaminase frees the amide nitrogen of glutamine in the liver and kidney, and glutamate dehydrogenase removes the amino group of glutamate as NH₄⁺ with NAD⁺, which gives back α-ketoglutarate. The NH₄⁺ goes to the urea cycle',
- The transaminases ALT and AST (vitamin B6) move amino groups between amino acids and α-ketoglutarate with no net change of nitrogen: alanine gives pyruvate and aspartate gives oxaloacetate, and glutamate collects the amino groups',
- Muscle sends amino groups to the liver as alanine (the glucose-alanine cycle): ALT gives pyruvate, which gluconeogenesis turns into glucose for the muscle, and glutamate, whose nitrogen enters the urea cycle

### SUMMARY_UREA
- Each turn converts one ammonium nitrogen and one aspartate nitrogen into one urea: NH₄⁺ + HCO₃⁻ + aspartate + 3 ATP + H₂O → urea + fumarate + 2 ADP + AMP + 2 Pᵢ + PPᵢ + 2 H⁺. Counting the ATP to AMP + PPᵢ step as two bonds, because its PPᵢ is split, four high-energy phosphate bonds are spent per urea: two at carbamoyl phosphate synthetase I and two at argininosuccinate synthetase',
- The two nitrogens of urea come from ammonium (through carbamoyl phosphate) and from aspartate (through argininosuccinate); its carbon comes from bicarbonate',
- Steps 1 and 2 are in the mitochondrial matrix and steps 4 to 6 in the cytosol; the carrier between them brings ornithine in for citrulline going out. Carbamoyl phosphate synthetase I is the committed step, switched on by N-acetylglutamate',
- The fumarate made by argininosuccinate lyase joins the TCA cycle (fumarate to malate to oxaloacetate, and back to aspartate by transamination), which links the urea cycle to the TCA cycle

### SUMMARY_CARBS
- Glycolysis: net 2 pyruvate, 2 ATP (4 made, 2 spent) and 2 NADH per glucose',
- Fermentation re-oxidizes the 2 NADH so glycolysis can run without oxygen: lactate dehydrogenase makes 2 lactate, or pyruvate decarboxylase and alcohol dehydrogenase make 2 ethanol and 2 CO₂',
- Gluconeogenesis: 2 Pyruvate + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucose + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺ + 2 H⁺. Seven glycolytic enzymes run backwards (the arrows with two heads) and four bypass enzymes get round the irreversible steps',
- Glucose 6-phosphate is the hub between glucose and glycogen. Glycogen synthase and glycogen phosphorylase are different enzymes, so storage and breakdown are regulated separately

### SUMMARY_TCA
- Glucose is completely oxidized to 6 CO₂: glycolysis, the link reaction and the TCA cycle make 10 NADH, 2 FADH₂ and 4 ATP or GTP net per glucose',
- Pyruvate crosses the outer membrane through porin and the inner membrane on the H⁺/pyruvate symporter, and the link reaction makes acetyl-CoA, CO₂ and NADH in the matrix

### SUMMARY_ETC
- The electron transport chain passes the electrons of NADH and FADH₂ to oxygen: about 10 H⁺ pumped per NADH and 6 per FADH₂, enough for about 2.5 and 1.5 ATP',
- The shuttles carry the electrons of cytosolic NADH into the matrix, and ATP synthase and the ATP-ADP translocase make and export ATP

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
- **Modern Convention:** `NADH 2.5, FADH₂ 1.5` — *NADH is worth 2.5 ATP and FADH₂ 1.5 ATP, so one glucose gives 30 or 32 ATP.*
- **Classic Convention:** `NADH 3, FADH₂ 2` — *NADH is worth 3 ATP and FADH₂ 2 ATP, so one glucose gives 36 or 38 ATP.*
- **Chế độ Guided:** *Shows what each step makes while you count.*
- **Chế độ Recall:** *Nothing is shown. Use Hint or Reveal when you are stuck.*

### 5.2 Các kịch bản tính ATP (Scenarios)
| Mã Scenario | Tiêu đề Kịch bản (English Title) | Phụ đề & Mục tiêu |
| :--- | :--- | :--- |
| `tca` | **One turn of the TCA cycle** | One acetyl-CoA to CO |
| `pyruvate` | **Pyruvate to CO** | None |
| `glycolysis` | **Glycolysis with oxygen** | Glucose to pyruvate, then the shuttle |
| `glucose` | **One glucose, completely oxidized** | Glycolysis, link reaction and TCA cycle |
| `fermentation` | **One glucose without oxygen** | Fermentation to lactate or ethanol |
| `uncoupled` | **One glucose with an uncoupler** | Electrons still flow, ATP synthase makes nothing |
| `fattyacid` | **A fatty acid** | Activation, beta-oxidation and the TCA cycle |
| `calvincost` | **The Calvin cycle** | ATP and NADPH for one glucose |
| `c4cost` | **The C4 pathway** | The extra ATP of carrying CO |
| `alanineox` | **Alanine, completely oxidized** | Transamination, the TCA cycle and the urea cycle |
| `aspartateox` | **Aspartate, completely oxidized** | Through oxaloacetate and pyruvate |
| `glutamateox` | **Glutamate, completely oxidized** | Through alpha-ketoglutarate |
| `ureacost` | **One urea** | What the urea cycle spends |
| `pentoseox` | **Three pentoses, completely oxidized** | The pentose phosphate pathway into glycolysis |
| `purinecost` | **One IMP** | What building a purine nucleotide spends |
| `pyrimidinecost` | **One UMP** | What building a pyrimidine nucleotide spends |

## 6. Bộ Câu Hỏi So Sánh Tương Đồng & Phân Biệt (Comparison Quizzes - `cmp-*`)

| Mã ID | Tiêu đề so sánh (Comparison Title) | Nội dung & Cặp đối chiếu (Subtitle) |
| :--- | :--- | :--- |
| `cmp-hk-gk` | **Hexokinase or glucokinase** | One reaction, two isozymes: affinity, product inhibition and where each works |
| `cmp-pfk-fbpase` | **PFK-1 or FBPase-1** | The kinase of glycolysis against the phosphatase of gluconeogenesis, and the signals that choose between them |
| `cmp-gly-gng` | **Glycolysis or gluconeogenesis** | Where each runs, what each costs, the shared enzymes and the three bypasses |
| `cmp-lactate-ethanol` | **Lactate or ethanol fermentation** | Two ways to get NAD⁺ back without oxygen: who uses which, and what each releases |
| `cmp-nadh-fadh2` | **NADH or FADH** | None |
| `cmp-complex1-2` | **Complex I or Complex II** | The two entry points of the chain: what each oxidizes, which pumps protons, which is a TCA enzyme |
| `cmp-slp-oxphos` | **Substrate-level or oxidative phosphorylation** | Two ways to make ATP: straight from an intermediate, or from a proton gradient |
| `cmp-pdc-kgdh` | **PDC or α-KG dehydrogenase** | Two complexes built the same way: what each takes in, what each gives out, what they share |
| `cmp-phosphorylase-synthase` | **Glycogen phosphorylase or synthase** | Breaking down or building up glycogen: the substrates, the cofactor and what phosphorylation does to each |
| `cmp-betaox-fas` | **Beta-oxidation or fatty acid synthesis** | Breaking down and building up fatty acids: compartments, carriers, electron carriers and the two-carbon unit |
| `cmp-sat-unsat` | **Saturated or unsaturated fatty acid** | Stearic acid against oleic acid: the same 18 carbons, one double bond, and what it does to the ATP count |
| `cmp-g3p-glycerol3p` | **Glyceraldehyde 3-P or glycerol 3-P** | Two three-carbon phosphates with almost the same name: the aldehyde of glycolysis and the backbone of fats |
| `cmp-shuttles` | **Glycerol phosphate or malate-aspartate shuttle** | Two ways to bring the electrons of cytosolic NADH into the mitochondrion, and why they are not worth the same |
| `cmp-apoptosis` | **Intrinsic or extrinsic apoptosis** | The mitochondrial route and the death receptor route: where each starts, its initiator caspase, and where they meet |
| `cmp-fission-fusion` | **Fission or fusion** | How mitochondria divide and join: the GTPases, the membranes and what each process is for |
| `cmp-q-cytc` | **Ubiquinone or cytochrome c** | The two mobile carriers of the chain: a lipid in the membrane and a heme protein beside it |

## 7. Cơ Chế Phản Ứng Từng Bước (Detailed Enzyme Mechanisms - `mech-*`)

| Mã ID | Tên Enzyme & Cơ chế (Title) | Mô tả chi tiết các bước hóa sinh |
| :--- | :--- | :--- |
| `mech-aldolase` | **Aldolase: the Schiff base** | How a lysine of the enzyme lets a six-carbon sugar break into two three-carbon pieces |
| `mech-tpi` | **Triose phosphate isomerase: the enediol** | How the carbonyl moves from carbon 2 to carbon 1 through a cis-enediol |
| `mech-gapdh` | **GAPDH: thioester, then acyl phosphate** | How an oxidation is made to pay for a high-energy phosphate |
| `mech-pdc` | **Pyruvate dehydrogenase complex: E1, E2, E3** | Five cofactors in order: TPP, lipoamide, coenzyme A, FAD and NAD⁺ |
| `mech-aconitase` | **Aconitase: through cis-aconitate** | How a hydroxyl moves from one carbon to the next, on an iron-sulfur cluster that does no redox chemistry |
| `mech-atpsynthase` | **ATP synthase: the binding-change cycle** | Open, loose and tight: how a turning shaft makes three sites take turns |
| `mech-qcycle` | **Complex III: the Q cycle** | How the two electrons of one ubiquinol are split, one to cytochrome c and one back onto a quinone |
| `mech-betaox` | **Beta-oxidation: the first steps** | From a free fatty acid to the first acetyl-CoA: activation, the carnitine shuttle and the four steps of a round |

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
| `g1p` | **Glucose 1-phosphate** | `G1P` | `sugar` | Made from glycogen breakdown. Not a glycolytic intermediate until it is isomerized to glucose 6-phosphate. |
| `r5p` | **Ribose 5-phosphate** | `R5P` | `sugar` | A product of the pentose phosphate pathway, used to build nucleotides. |
| `glycerol3p` | **Glycerol 3-phosphate** | `G3P (glycerol)` | `c3` | Made from DHAP in lipid synthesis and the glycerol phosphate shuttle. Easy to confuse with glyceraldehyde 3-phosphate. |
| `lactate` | **Lactate** | `Lac` | `c3` | L-Lactate, the end product of anaerobic glycolysis in working muscle and red blood cells. The liver can turn it back into pyruvate and glucose (the Cori cycle). |
| `alanine` | **Alanine** | `Ala` | `c3` | Made from pyruvate by transamination. Muscle sends it to the liver, where it gives pyruvate back for gluconeogenesis (the glucose-alanine cycle). |
| `acetaldehyde` | **Acetaldehyde** | `AcH` | `c3` | An intermediate of alcoholic fermentation. |
| `ethanol` | **Ethanol** | `EtOH` | `c3` | The end product of alcoholic fermentation in yeast. |
| `glutamate` | **Glutamate** | `Glu` | `acid` | Becomes alpha-ketoglutarate when its amino group is removed. It is the collecting point of amino groups: transaminases hand them to alpha-ketoglutarate, and glutamine synthetase adds a second nitrogen to make glutamine. |
| `aspartate` | **Aspartate** | `Asp` | `acid` | Becomes oxaloacetate when its amino group is removed. |
| `malonate` | **Malonate** | `Malon` | `acid` | A three-carbon dicarboxylate. A classic competitive inhibitor of succinate dehydrogenase. |
| `glyoxylate` | **Glyoxylate** | `Glyox` | `acid` | An intermediate of the glyoxylate cycle in plants and bacteria. |
| `glutamine` | **Glutamine** | `Gln` | `aminoacid` | The safe carrier of ammonia in the blood: it holds an amide nitrogen that the liver and kidney release again with glutaminase. |
| `lysine` | **Lysine** | `Lys` | `aminoacid` | A basic amino acid with a four-carbon side chain ending in an amino group; it looks like ornithine with one more carbon. |
| `proline` | **Proline** | `Pro` | `aminoacid` | An amino acid with a ring that can be made from ornithine (and from glutamate). |
| `nacglu` | **N-Acetylglutamate** | `NAG` | `aminoacid` | The allosteric activator of carbamoyl phosphate synthetase I, made from glutamate and acetyl-CoA and switched on by arginine. |
| `carbamoylasp` | **N-Carbamoylaspartate** | `CAA` | `aminoacid` | The product of aspartate transcarbamoylase in pyrimidine synthesis: the same carbamoyl chemistry as the urea cycle, but on aspartate instead of ornithine. |

## 10. Danh Mục Enzyme & Đồng Yếu Tố (Enzymes & Cofactors Catalog)

### 10.1 Danh Mục Enzyme
| Mã ID | Tên Enzyme (Name) | Viết tắt | Mã EC | Chú giải cơ chế & điều hòa (Note) |
| :--- | :--- | :--- | :--- | :--- |
| `g6pase` | **Glucose-6-phosphatase** | `G6Pase` | `3.1.3.9` | Gluconeogenic enzyme that removes the phosphate from glucose 6-phosphate. |
| `fbpase` | **Fructose-1,6-bisphosphatase** | `FBPase` | `3.1.3.11` | Gluconeogenic enzyme that opposes PFK-1. |
| `pglucomutase` | **Phosphoglucomutase** | `PGluM` | `5.4.2.2` | Interconverts glucose 1-phosphate and glucose 6-phosphate. |
| `g6pdh` | **Glucose-6-phosphate dehydrogenase** | `G6PD` | `` | First enzyme of the pentose phosphate pathway. |
| `ldh` | **Lactate dehydrogenase** | `LDH` | `1.1.1.27` | Reduces pyruvate to lactate and regenerates NAD⁺, which the glyceraldehyde 3-phosphate dehydrogenase step needs, so glycolysis can keep running without oxygen. In the liver and heart the reaction runs mostly in the other direction. |
| `pc` | **Pyruvate carboxylase** | `PC` | `6.4.1.1` | Makes oxaloacetate from pyruvate, the first step of gluconeogenesis. Needs biotin. |
| `pepck` | **PEP carboxykinase** | `PEPCK` | `4.1.1.32` | Converts oxaloacetate to PEP in gluconeogenesis. |
| `adh` | **Alcohol dehydrogenase** | `ADH` | `1.1.1.1` | Reduces acetaldehyde to ethanol in fermentation. |
| `pyrdecarb` | **Pyruvate decarboxylase** | `PDC (yeast)` | `4.1.1.1` | Yeast enzyme that turns pyruvate into acetaldehyde. |
| `glycerol3pdh` | **Glycerol-3-phosphate dehydrogenase** | `GPDH` | `1.1.1.8` | The NAD-linked enzyme of the cytosol. It reduces dihydroxyacetone phosphate to glycerol 3-phosphate with electrons from cytosolic NADH, the first step of the glycerol phosphate shuttle; it also links glycolysis to lipid synthesis. |
| `gdh` | **Glutamate dehydrogenase** | `GDH` | `1.4.1.3` | The enzyme that joins amino acid metabolism to the TCA cycle: it removes the amino group of glutamate as ammonium (oxidative deamination) and, run the other way, adds ammonium to alpha-ketoglutarate to make glutamate. It uses NAD⁺ for the deamination and NADPH for the amination, and it works in the mitochondria of the liver. |
| `alt` | **Alanine aminotransferase** | `ALT` | `2.6.1.2` | A vitamin B6 enzyme that moves an amino group between alanine and glutamate: alanine gives its amino group to alpha-ketoglutarate, which makes pyruvate and glutamate. In the glucose-alanine cycle it runs in the muscle toward alanine and in the liver back toward pyruvate; a high level of ALT in the blood is a sign of liver damage. |
| `ast` | **Aspartate aminotransferase** | `AST` | `2.6.1.1` | A vitamin B6 enzyme that moves an amino group between aspartate and glutamate. One isoform in the matrix and one in the cytosol run the two transamination steps of the malate-aspartate shuttle. |
| `ndpk` | **Nucleoside diphosphate kinase** | `NDPK` | `` | Moves a terminal phosphate between nucleoside diphosphates and triphosphates, for example GTP + ADP to GDP + ATP. |
| `malic` | **Malic enzyme** | `ME` | `` | Decarboxylates malate to pyruvate. |
| `mdh1` | **Cytosolic malate dehydrogenase** | `MDH1` | `1.1.1.37` | The NAD-linked enzyme of the cytosol that works on four-carbon acids. It reduces oxaloacetate to malate with the electrons of cytosolic NADH, the first step of the malate-aspartate shuttle. |
| `gpd2` | **Mitochondrial glycerol phosphate dehydrogenase** | `GPD2` | `1.1.5.3` | Feeds electrons into ubiquinol, bypassing Complex I (the glycerol phosphate shuttle). |
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
| `nos` | **Nitric oxide synthase** | `NOS` | `1.14.13.39` | Uses arginine, NADPH and oxygen to make nitric oxide and citrulline: another fate of arginine. |
| `urease` | **Urease** | `Urease` | `3.5.1.5` | A nickel enzyme of bacteria and plants (not of humans) that splits urea into ammonia and CO₂. |
| `nags` | **N-Acetylglutamate synthase** | `NAGS` | `2.3.1.1` | Makes N-acetylglutamate from glutamate and acetyl-CoA; arginine switches it on, and its product activates carbamoyl phosphate synthetase I. |
| `gs` | **Glutamine synthetase** | `GS` | `6.3.1.2` | Traps ammonium as glutamine with the help of ATP; brain and muscle export ammonia as glutamine (muscle also as alanine). |
| `odc` | **Ornithine decarboxylase** | `ODC` | `4.1.1.17` | Turns ornithine into putrescine, the first step of polyamine synthesis: a different fate of ornithine. |
| `glnase` | **Glutaminase** | `GLS` | `3.5.1.2` | Releases ammonium from the amide group of glutamine, in the liver, where it feeds the urea cycle, and in the kidney, where it is excreted. |

### 10.2 Danh Mục Đồng Yếu Tố (Cofactors & Coenzymes)
| Mã ID | Tên Cofactor (Name) | Hiển thị | Họ nhóm | Chú giải chức năng (Note) |
| :--- | :--- | :--- | :--- | :--- |
| `atp` | **Adenosine triphosphate** | `ATP` | `adenylate` | The primary energy currency of the cell, transferring chemical energy through high-energy phosphate bonds. |
| `adp` | **Adenosine diphosphate** | `ADP` | `adenylate` | Substrate for ATP synthesis, accepts phosphate in substrate-level and oxidative phosphorylation. |
| `amp` | **Adenosine monophosphate** | `AMP` | `adenylate` | Allosteric activator indicating low cellular energy charge. |
| `nad` | **Nicotinamide adenine dinucleotide (oxidized)** | `NAD⁺` | `redox` | Major oxidizing agent / electron acceptor in catabolism (glycolysis, TCA, beta-oxidation). |
| `nadh` | **Nicotinamide adenine dinucleotide (reduced)** | `NADH` | `redox` | Carries two high-energy electrons to Complex I of the respiratory chain. |
| `fad` | **Flavin adenine dinucleotide (oxidized)** | `FAD` | `redox` | Prosthetic electron acceptor for succinate dehydrogenase and acyl-CoA dehydrogenase. |
| `fadh2` | **Flavin adenine dinucleotide (reduced)** | `FADH₂` | `redox` | Transfers electrons directly to ubiquinone via Complex II / ETF. |
| `nadp` | **NADP⁺ (oxidized)** | `NADP⁺` | `redox` | Electron acceptor in the oxidative pentose phosphate pathway. |
| `nadph` | **NADPH (reduced)** | `NADPH` | `redox` | Reductive power donor for biosynthetic pathways (fatty acid synthesis, cholesterol) and glutathione regeneration. |
| `coa` | **Coenzyme A** | `CoA-SH` | `carrier` | Acyl group carrier forming high-energy thioester bonds (acetyl-CoA, succinyl-CoA). |
| `tpp` | **Thiamine pyrophosphate** | `TPP` | `carrier` | Vitamin B₁ cofactor for oxidative decarboxylation of α-keto acids (PDC, α-KGDH). |
| `lipoamide` | **Lipoamide** | `Lip` | `carrier` | Swinging arm cofactor transferring acyl groups and electrons within pyruvate and α-ketoglutarate dehydrogenase complexes. |
| `biotin` | **Biotin** | `Biotin` | `carrier` | Vitamin B₇ cofactor for carboxylation reactions (Pyruvate carboxylase, Acetyl-CoA carboxylase). |
| `plp` | **Pyridoxal 5′-phosphate** | `PLP` | `carrier` | Vitamin B₆ coenzyme forming Schiff base in transamination, decarboxylation, and glycogen breakdown. |
| `pi` | **Inorganic phosphate** | `Pᵢ` | `small` | Inorganic orthophosphate ion involved in phosphorylation and phosphorolysis. |
| `ppi` | **Inorganic pyrophosphate** | `PPᵢ` | `small` | Diphosphate released during nucleic acid and acyl-CoA activation, rapidly hydrolyzed to drive reactions forward. |
| `co2` | **Carbon dioxide** | `CO₂` | `small` | One-carbon product of complete decarboxylation and substrate for carboxylation. |
| `h2o` | **Water** | `H₂O` | `small` | Solvent, reactant in hydrolysis and hydration reactions, and byproduct of electron transport. |

---
*Tài liệu được trích xuất và hệ thống hóa trực tiếp từ source code `pathway_quiz.html`.*