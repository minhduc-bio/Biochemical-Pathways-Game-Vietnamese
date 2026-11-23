# Kế Hoạch Triển Khai & Cài Đặt Sinh Tổng Hợp Lipid Vào pathway_quiz.html

Tài liệu này xác định chi tiết thiết kế, quy chuẩn định danh (ID schema), cấu trúc đồ thị, logic hóa sinh và quy trình tích hợp các chu trình sinh tổng hợp lipid từ `sinh_tong_hop_lipid_mermaid.md` vào `pathway_quiz.html` theo chuẩn kiến trúc `infrastructure.md`.

---

## I. Kết quả kiểm tra mã nguồn `pathway_quiz.html` (Bước 1)

1. **Entity IDs hiện có**:
   - `acetylcoa`, `dhap`, `tag`: Đã có trong `molecule`.
   - `g3p`: Đã có trong `molecule` nhưng là *Glyceraldehyde 3-phosphate* (đường phân). **Bắt buộc dùng `gly3p` cho L-Glycerol 3-phosphate**.
   - `dag`: Bổ sung trực tiếp vào `lipidMolecules` trong nhóm lipid.
   - `acc`, `cpt1`: Đã có trong `enzyme` (`cpt1` có alias `cat1`).
   - `atp`, `adp`, `amp`, `coa`, `co2`, `h2o`, `pi`, `ppi`, `nadph`, `nadp`, `nadh`, `nad`, `hco3`, `o2`, `fad`, `fadh2`: Đã có đầy đủ trong `cofactor`.
2. **Cơ chế Fallback**:
   - `structureSvg(mol)`: An toàn trả về `null` nếu không có trong `MG.geometry`, tự động vẽ text card với `short` và `name`.
   - `note`: Tự fallback về `''` nếu thiếu, không gây lỗi runtime.
3. **Mũi tên & Liên kết**:
   - Engine chỉ vẽ mũi tên giữa các Node trong `p.nodes` (`L.cards`). Không trỏ trực tiếp vào `L.pills`.
   - Điều hòa/ức chế (Malonyl-CoA ức chế CAT I) được thể hiện bằng mũi tên `link: true` đến node đại diện và `notes` trực quan.
4. **Cơ chế đăng ký chuẩn**:
   - Đăng ký trực tiếp vào `MG.pathways` và danh mục `lipids` trong `MG.categories` (hiển thị ngay trên menu chính).
   - Sử dụng `compose()` cho bản đồ tổng thể `lipidssynth` và `everything-lipids`.

---

## II. Chuẩn hóa Schema & Quy ước Kỹ thuật (Bước 2)

1. **Chuẩn hóa ID**:
   - Regex bắt buộc: `/^[a-z0-9]+$/` (chỉ chữ thường và chữ số, KHÔNG dấu gạch dưới `_`).
   - Pathway IDs: `fas`, `faelong`, `tag`, `lipidsreg`, `lipidssynth`.
   - Reaction IDs: `acc1`, `mat1`, `kr1`, `dh1`, `er1`, `loop1`, `te1`, `des9a`, `elo1`, `des9b`, `elo2`, `des12`, `des15`, `pufastep`, `des6`, `elo3`, `des5`, `pcdes1`, `pcdes2`, `etcchain`, `gpdh1`, `gk1`, `facs1`, `gpat1`, `agpat1`, `pap1`, `dgat1`, `gpl1`, `regacc1`, `regacc2`, `regacc3`, `regcpt1`, `regcact`, `regbeta`.
2. **Tránh xung đột `g3p`**:
   - `gly3p`: L-Glycerol 3-phosphate.
3. **Tách bạch Molecule và Cofactor**:
   - `ins`/`outs` chỉ chứa keys từ `MG.entities.cofactor`.
   - `acetylcoa`, `malonylcoa`, `palmitate`... đặt ở `substrates`/`products` và `arrows`.
4. **Pathway Object chuẩn**:
   - Đầy đủ 14 trường: `id`, `title`, `subtitle`, `tag`, `location`, `color`, `nodes`, `reactions`, `order`, `start`, `regions`, `membranes`, `notes`, `summary`.
5. **Quy chuẩn tọa độ & Khoảng cách (Tránh chồng lấn)**:
   - Kích thước phần tử engine: Thẻ card $140 \times 152\text{ px}$, enzyme pill cao $34\text{ px}$, cofactor chip $30\text{ px}$, lề an toàn $14\text{ px}$.
   - Bước lưới chuẩn:
     - Ngang $\Delta x = 380\text{ px}$ (khoảng hở giữa các mép card: $240\text{ px}$, arrow nhìn thấy rõ ràng $70 - 90\text{ px}$).
     - Dọc $\Delta y = 320\text{ px}$ (khoảng hở giữa các mép card: $168\text{ px}$, đủ chỗ cho enzyme pill và stack cofactor chip).
   - `twoWay: true` cho phản ứng thuận nghịch `⇌`.
   - Bổ sung `cof: LEFT_RIGHT` hoặc `TOP_BOTTOM` và `hint` giáo khoa ngắn gọn cho mỗi phản ứng.

---

## III. Thiết kế Chi tiết 4 Phân đoạn & 1 Bản đồ Tổng (Bước 3)

### 1. `fas` — Tổng hợp Palmitate & Phức hệ FAS
- **Nodes**:
  - `acetylcoa` (350, 150), `malonylcoa` (350, 470)
  - `acetoacetylacp` (850, 340), `hydroxybutyrylacp` (1120, 610), `butenoylacp` (850, 880), `butyrylacp` (580, 610)
  - `palmitoylacp` (580, 930), `palmitate` (580, 1250)
- **Reactions**:
  - `acc1`: Acetyl-CoA + ATP + HCO₃⁻ → Malonyl-CoA + ADP + Pᵢ (Enzyme: `acc`).
  - `mat1`: Acetyl-CoA + Malonyl-CoA → β-Ketobutyryl-ACP + CO₂ + 2 CoA-SH (Enzyme: `mat`).
  - `kr1`: β-Ketobutyryl-ACP + NADPH + H⁺ ⇌ D-β-Hydroxybutyryl-ACP + NADP⁺ (Enzyme: `kr`, `twoWay: true`).
  - `dh1`: D-β-Hydroxybutyryl-ACP ⇌ trans-Δ²-Butenoyl-ACP + H₂O (Enzyme: `dhfas`, `twoWay: true`).
  - `er1`: trans-Δ²-Butenoyl-ACP + NADPH + H⁺ → Butyryl-ACP + NADP⁺ (Enzyme: `er`).
  - `loop1`: Butyryl-ACP (C4) tái nạp Malonyl-CoA lặp 7 vòng → Palmitoyl-ACP (C16) (Enzyme: `ks`). Có liên kết lặp `link: true` quay về ACP.
  - `te1`: Palmitoyl-ACP + H₂O → Palmitate + ACP (Enzyme: `te`).

### 2. `faelong` — Kéo dài mạch, Khử bão hòa & Hệ Acyl-CoA Desaturase
- **Nodes (bố trí dạng lưới ma trận 5 hàng, $\Delta x = 380\text{px}$, $\Delta y = 320\text{px}$)**:
  - Hàng 0 (Màng Phosphatidylcholine, $y = 100$): `pcoleate` (960, 100), `pclinoleate` (1340, 100), `pclinolenate` (1720, 100).
  - Hàng 1 (Trục chính, $y = 420$): `palmitate` (200, 420), `stearate` (580, 420), `oleate` (960, 420), `linoleate` (1340, 420), `alinolenate` (1720, 420), `pufa` (2100, 420).
  - Hàng 2 (Nhánh phân nhánh, $y = 740$): `palmitoleate` (200, 740), `lsf` (580, 740), `glinolenate` (1340, 740).
  - Hàng 3 (Nhánh Arachidonate, $y = 1060$): `eicosatrienoate` (1340, 1060), `arachidonate` (1720, 1060).
  - Hàng 4 (Chuỗi truyền e⁻ Desaturase, $y = 1380$): `cytb5red` (960, 1380), `cytb5` (1340, 1380), `desatcomp` (1720, 1380).
- **Reactions (13 phản ứng)**:
  - `des9a`: Palmitate → Palmitoleate (Enzyme: `desat9`).
  - `elo1`: Palmitate → Stearate (Enzyme: `elongase`).
  - `des9b`: Stearate → Oleate (Enzyme: `desat9`).
  - `elo2`: Stearate → LSF (Enzyme: `elongase`).
  - `des12`: Oleate → Linoleate (Enzyme: `desat12`, chỉ có ở thực vật).
  - `des15`: Linoleate → α-Linolenate (Enzyme: `desat15`, chỉ có ở thực vật).
  - `pufastep`: α-Linolenate → Other PUFAs (EPA, DHA).
  - `des6`: Linoleate → γ-Linolenate (Enzyme: `desat6`, động vật).
  - `elo3`: γ-Linolenate → Eicosatrienoate (Enzyme: `elongase`).
  - `des5`: Eicosatrienoate → Arachidonate (Enzyme: `desat5`).
  - `pcdes1`: PC-Oleate → PC-Linoleate (Enzyme: `desat12`).
  - `pcdes2`: PC-Linoleate → PC-Linolenate (Enzyme: `desat15`).
  - `etcchain`: NADPH → Cyt b₅ reductase (FAD) → 2 Cyt b₅ (Fe³⁺/Fe²⁺) → Desaturase (Enzyme: `cb5r`).

### 3. `tag` — Sinh tổng hợp Triacylglycerol & Glycerophospholipid
- **Nodes**:
  - Nhánh Glycerol bên trái: `glycerol` (150, 150), `dhap` (530, 150), `gly3p` (340, 470).
  - Nhánh Acid béo hoạt hóa bên phải: `fattyacid` (910, 150), `fattyacylcoa` (910, 470).
  - Trục trung tâm gắn Acyl: `lysopa` (340, 790), `pa` (340, 1110).
  - Rẽ nhánh đôi ở đáy: `dag` (200, 1430), `tag` (200, 1750), `gpl` (580, 1430).
- **Reactions (8 phản ứng)**:
  - `gpdh1`: DHAP + NADH + H⁺ ⇌ gly3p + NAD⁺ (Enzyme: `gpdh`, `twoWay: true`).
  - `gk1`: Glycerol + ATP → gly3p + ADP (Enzyme: `gk`).
  - `facs1`: Fatty acid + ATP + CoA-SH → Fatty acyl-CoA + AMP + PPᵢ (Enzyme: `facs`).
  - `gpat1`: gly3p + Fatty acyl-CoA → Lysophosphatidic acid + CoA-SH (Enzyme: `gpat`).
  - `agpat1`: Lysophosphatidic acid + Fatty acyl-CoA → Phosphatidic acid + CoA-SH (Enzyme: `agpat`).
  - `pap1`: Phosphatidic acid + H₂O → 1,2-DAG + Pᵢ (Enzyme: `pap`).
  - `dgat1`: 1,2-DAG + Fatty acyl-CoA → Triacylglycerol + CoA-SH (Enzyme: `dgat`).
  - `gpl1`: Phosphatidic acid + Head group → Glycerophospholipid (Enzyme: `cdpdags`).

### 4. `lipidsreg` — Điều hòa đối kháng ACC – CAT I
- **Nodes**:
  - Trục nội tiết điều hòa: `insulin` (200, 200), `accact` (580, 200), `accinact` (580, 480), `glucagon` (960, 480).
  - Trục Bào tương: `acetylcoar` (200, 760), `malonylcoar` (580, 760), `facylcoacyt` (580, 1080).
  - Trục Ty thể: `facylcarn` (990, 1080), `facylcoamat` (1370, 1080), `acetylcoamat` (1750, 1080).
- **Membranes**:
  - Màng ngoài ty thể (nơi có CPT1 / CAT I): `{ x1: 790, y1: 80, x2: 790, y2: 1200 }`
  - Màng trong ty thể: `{ x1: 1180, y1: 80, x2: 1180, y2: 1200 }`
- **Reactions (6 phản ứng)**:
  - `regacc1`: accinact → accact (Phosphatase khử phosphate, kích hoạt bởi Insulin).
  - `regacc2`: accact → accinact (PKA gắn phosphate, kích hoạt bởi Glucagon).
  - `regacc3`: acetylcoar + ATP + HCO₃⁻ → malonylcoar + ADP + Pᵢ (Enzyme: `acc`).
  - `regcpt1`: facylcoacyt + Carnitine → facylcarn + CoA-SH (Enzyme: `cpt1`, bị `malonylcoar` ức chế qua `link: true` và ghi chú trực quan).
  - `regcact`: facylcarn → facylcoamat (Chuyển vị qua CACT và CPT2).
  - `regbeta`: facylcoamat → acetylcoamat (β-oxidation trong chất nền ty thể).

### 5. `lipidssynth` & `everything-lipids` — Ghép nối bằng `compose()`
- **`lipidssynth`**:
  - `fas`: `(0, 0)`
  - `faelong`: `dx: 380, dy: 830`, `share: { palmitate: 'palmitate' }` (Khớp tuyệt đối từng pixel tại điểm nút Palmitate (580, 1250)).
  - `tag`: `dy: 2350` (Tọa độ tự do, độc lập).
  - `lipidsreg`: `dx: 1200, dy: 2350` (Tọa độ tự do, độc lập).
- **`everything-lipids`**:
  - `betaox`: `(0, 0)`
  - `fas`: `dx: 1200, dy: 0`
  - `faelong`: `dx: 1580, dy: 830`, `share: { palmitate: 'palmitate' }`
  - `tag`: `dy: 1600`
  - `lipidsreg`: `dx: 1200, dy: 2450`

---

## IV. Kết quả Kiểm thử & Trạng thái Hoàn thành (Bước 4)

1. **Kiểm tra Schema Tĩnh (`tools/verify_installed_html.js`)**:
   - Toàn bộ 5 sơ đồ đơn và 2 bản đồ tổng đạt chuẩn 100%.
   - Mọi `pathway.id` và `reaction.id` khớp regex `/^[a-z0-9]+$/`.
   - Mọi `node.mol` $\in$ `MG.entities.molecule`.
   - Mọi `reaction.enzyme` $\in$ `MG.entities.enzyme`.
   - Mọi `ins`/`outs` $\in$ `MG.entities.cofactor`.
   - Mọi `substrates`, `products`, `arrows` $\in$ `pathway.nodes`.
2. **Kiểm tra Môi trường Trình duyệt Thực tế (`tools/test_browser_render.js`)**:
   - Chạy trên Google Chrome Headless qua giao thức CDP (Chrome DevTools Protocol).
   - `MG.chart.create` render thành công 100% SVG DOM cho cả 6 bản đồ (`fas`, `faelong`, `tag`, `lipidsreg`, `lipidssynth`, `everything-lipids`).
   - Khoảng cách các thẻ card đạt chuẩn không chồng lấn, các enzyme pills và cofactor chips nằm đúng rãnh hiển thị, không bị cắt mép.
