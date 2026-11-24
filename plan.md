# Kế Hoạch Triển Khai & Cài Đặt Sinh Tổng Hợp Lipid Vào `pathway_quiz_vi_final.html`

Tài liệu này xác định chi tiết thiết kế, quy chuẩn định danh (ID schema), cấu trúc đồ thị, logic hóa sinh và quy trình tích hợp đầy đủ **5 sơ đồ chi tiết + 2 sơ đồ tổng hợp** từ [`final_mermaid.md`](final_mermaid.md) (Chương 11: Trao đổi Lipid, trang 15–28) vào [`pathway_quiz_vi_final.html`](pathway_quiz_vi_final.html) theo chuẩn kiến trúc [`infrastructure.md`](infrastructure.md).

---

## I. Kết quả kiểm tra mã nguồn `pathway_quiz_vi_final.html` (Bước 1)

1. **Entity IDs cốt lõi**:
   - `glucose`, `acetylcoa`, `dhap`, `glycerol`, `tag`, `palmitate`, `malonylcoa`: Đã có trong `MG.entities.molecule`.
   - `g3p`: Dành cho *Glyceraldehyde 3-phosphate* (đường phân). **Bắt buộc dùng `gly3p` cho L-Glycerol 3-phosphate**.
   - **Molecules bổ sung theo `final_mermaid.md`**: `fascharged` (*Phức hệ FAS đã nạp*), `acylks` (*Acyl-KS + ACP-SH tự do*), `satfacylcoa` (*Acyl-CoA bão hòa*), `monounsatfacylcoa` (*Acyl-CoA không bão hòa đơn*), `nadphnode` (*NADPH + H⁺*), `dietcarb` (*Carbohydrate thức ăn*), `highglc` (*Đường huyết cao*), `lowglc` (*Đường huyết thấp*).
   - **Cofactors bổ sung**: `carnitine` (`Carnitine`), `acpsh` (`ACP-SH`), cùng đầy đủ cofactor có sẵn (`atp`, `adp`, `amp`, `coa`, `co2`, `h2o`, `pi`, `ppi`, `nadph`, `nadp`, `nadh`, `nad`, `hco3`, `o2`, `fad`, `fadh2`).
   - **Enzymes bổ sung**: `glycpdh` (*Đường phân + PDH complex*), `glycolysisenz` (*Đường phân*), `fascomp` (*Phức hệ FAS (7 vòng)*), `desatcompenz` (*Fatty acyl-CoA desaturase*).
2. **Cơ chế Fallback & Ngắt dòng tiếng Việt**:
   - `structureSvg(mol)` tự động fallback sang text card khi không có tọa độ 2D trong `MG.geometry`.
   - Mọi phân tử tên dài (`pufa`, `apoptosis`, `fascharged`, `satfacylcoa`, `monounsatfacylcoa`) đều có `lines` ngắn gọn vừa khung `140 × 152 px` để không bị nén méo chữ (`fitText`).
3. **Cơ chế đăng ký chuẩn**:
   - Đăng ký trực tiếp vào `MG.pathways` và danh mục `lipids` (*Chất béo*) trong `MG.categories`.
   - Sử dụng `compose()` cho 2 sơ đồ tổng hợp (`faoverview`, `lipidssynth`) và siêu bản đồ `everything-lipids`.

---

## II. Chuẩn hóa Schema & Quy ước Kỹ thuật (Bước 2)

1. **Chuẩn hóa ID**:
   - Regex bắt buộc: `/^[a-z0-9]+$/` (chỉ chữ thường và chữ số, KHÔNG dấu gạch dưới `_`).
   - **Pathway IDs (5 chi tiết + 2 tổng hợp + 1 siêu bản đồ)**:
     - Chi tiết: `fas`, `faelong`, `desatmech`, `tag`, `lipidsreg`.
     - Tổng hợp: `faoverview` (Gộp 1+2+3+5), `lipidssynth` (Gộp 1–5), `everything-lipids` (Toàn bộ Chất béo).
   - **Reaction IDs**:
     - `fas`: `acc1`, `mat1`, `ks1`, `kr1`, `dh1`, `er1`, `trans1`, `rechg1`, `loop1`, `te1`.
     - `faelong`: `des9a`, `elo1`, `des9b`, `elo2`, `des12`, `des15`, `pufastep`, `des6`, `elo3`, `des5`, `pcdes1`, `pcdes2`.
     - `desatmech`: `etcred`, `etccyt`, `desatrxn`.
     - `tag`: `glyc2dhap`, `gpdh1`, `gk1`, `facs1`, `gpat1`, `agpat1`, `pap1`, `dgat1`, `gpl1`.
     - `lipidsreg`: `carb2glc`, `glc2accoa`, `regacc1`, `regacc2`, `regacc3`, `regfas`, `regcpt1`, `regcact`, `regbeta`.
2. **Tách bạch Molecule và Cofactor**:
   - `ins`/`outs` chỉ chứa keys từ `MG.entities.cofactor` (như `atp`, `adp`, `nadph`, `nadp`, `carnitine`, `acpsh`).
   - Các chất nền/sản phẩm chính đặt ở `substrates`/`products` và `arrows`.
3. **Quy chuẩn tọa độ & Chống chồng lấn (Anti-Collision Engine v2)**:
   - Kích thước phần tử: Card `140 × 152 px`, Enzyme pill cao `34 px` (+14px mỗi dòng thêm), Cofactor chip cao `30 px`.
   - Bước lưới chuẩn: Ngang $\Delta x \ge 420\text{ px}$, Dọc $\Delta y \ge 320\text{ px}$, toàn bộ tọa độ dương ($x \ge 180, y \ge 160$).
   - Mọi hướng cofactor (`north`, `south`, `west`, `east`, `up`, `down`) được `resolveSide` và `placeChips` xử lý vuông góc chuẩn xác, kết hợp bộ giải va chạm đa lớp cho `pills`, `chips`, `badges`, `notes` và `regionLabel`.

---

## III. Thiết kế Chi tiết 5 Phân đoạn & 2 Bản đồ Tổng hợp (Bước 3)

### 1. `fas` — Tổng hợp Malonyl-CoA & Chu trình Palmitate (Trang 16–22)
- **Nodes (10)**:
  - Tiền chất & nạp phức hệ: `acetylcoa` (200, 160), `malonylcoa` (200, 520), `fascharged` (680, 340).
  - Chu trình 6 bước lặp 7 vòng: `acetoacetylacp` (1120, 160), `hydroxybutyrylacp` (1560, 340), `butenoylacp` (1560, 700), `butyrylacp` (1120, 880), `acylks` (680, 700).
  - Giải phóng sản phẩm: `palmitoylacp` (200, 1180), `palmitate` (200, 1520).
- **Reactions (10)**: `acc1` → `mat1` → `ks1` → `kr1` (`⇌`) → `dh1` (`⇌`) → `er1` → `trans1` → `rechg1` (`link: true` về `fascharged`) → `loop1` (7 vòng) → `te1` (`+H₂O, -ACP-SH`).

### 2. `faelong` — Tổng hợp các axit béo no & không no khác (Trang 16, 23 & 27)
- **Nodes (14, không trùng tọa độ, không tọa độ âm)**:
  - Hàng 0 (Màng Phosphatidylcholine, $y = 160$): `pcoleate` (640, 160), `pclinoleate` (1080, 160), `pclinolenate` (1520, 160).
  - Hàng 1 (Trục chính từ Palmitate, $y = 500$): `palmitate` (200, 500), `stearate` (640, 500), `oleate` (1080, 500), `linoleate` (1520, 500), `alinolenate` (1960, 500), `pufa` (2400, 500).
  - Hàng 2 ($y = 840$): `palmitoleate` (200, 840), `lsf` (640, 840), `glinolenate` (1520, 840).
  - Hàng 3 (Nhánh Arachidonate, $y = 1180$): `eicosatrienoate` (1520, 1180), `arachidonate` (1960, 1180).
- **Reactions (12)**: `des9a`, `elo1`, `des9b`, `elo2`, `des12`, `des15`, `pufastep`, `des6`, `elo3`, `des5`, `pcdes1`, `pcdes2`.

### 3. `desatmech` — Cơ chế tạo nối đôi bởi hệ Acyl-CoA Desaturase (Trang 24)
- **Nodes (5)**:
  - Chuỗi truyền electron ghép cặp (Màng ER): `nadphnode` (200, 180), `cytb5red` (660, 180), `cytb5` (1120, 180).
  - Phản ứng khử bão hòa: `satfacylcoa` (660, 540), `monounsatfacylcoa` (1120, 540).
- **Reactions (3)**: `etcred` (`NADPH + H⁺ → Cyt b₅ reductase`, `-NADP⁺`), `etccyt` (`Cyt b₅ reductase → 2 Cyt b₅`), `desatrxn` (`Saturated acyl-CoA + O₂ → Monounsaturated acyl-CoA + 2 H₂O`, kèm mũi tên `link: true` từ `cytb5`).

### 4. `tag` — Sinh tổng hợp Triacylglycerol & Glycerophospholipid (Trang 25–26)
- **Nodes (11)**:
  - Nhánh tạo khung Glycerol: `glucose` (620, 160), `glycerol` (180, 480), `dhap` (620, 480), `gly3p` (400, 820).
  - Nhánh hoạt hóa axit béo: `fattyacid` (1060, 480), `fattyacylcoa` (1060, 820).
  - Trục trung tâm & rẽ nhánh: `lysopa` (400, 1160), `pa` (400, 1500), `dag` (400, 1840), `tag` (400, 2180), `gpl` (800, 1500).
- **Reactions (9)**: `glyc2dhap`, `gpdh1` (`cof: east/east`), `gk1` (`cof: west/west`), `facs1`, `gpat1`, `agpat1`, `pap1`, `dgat1`, `gpl1`.

### 5. `lipidsreg` — Điều hòa trao đổi axit béo qua trục ACC & CAT I (Trang 28)
- **Nodes (15)**:
  - Hàng 0 (Tín hiệu): `dietcarb` (180, 160), `highglc` (600, 160), `insulin` (1020, 160), `lowglc` (1460, 160).
  - Hàng 1 (Glucose & ACC): `glucose` (180, 480), `accact` (1020, 480), `accinact` (1460, 480), `glucagon` (1900, 480).
  - Hàng 2 (Bào tương): `acetylcoar` (180, 820), `malonylcoar` (620, 820), `palmitate` (1020, 820).
  - Hàng 3 (Ty thể): `facylcoacyt` (620, 1180), `facylcarn` (1220, 1180), `facylcoamat` (1720, 1180), `acetylcoamat` (2200, 1180).
- **Membranes**: Màng ngoài ty thể OMM (`x = 930`), Màng trong ty thể IMM (`x = 1470`).
- **Reactions (9)**: `carb2glc`, `glc2accoa`, `regacc1` (`shift: [0, 36]`), `regacc2` (`shift: [0, -36]`), `regacc3`, `regfas`, `regcpt1` (bị `malonylcoar` ức chế qua `link: true`), `regcact`, `regbeta`.

### 6. Các Sơ Đồ Tổng Hợp (`faoverview`, `lipidssynth`, `everything-lipids`)
- **`faoverview` (Gộp 1 + 2 + 3 + 5)**: `fas` `(0, 0)` + `faelong` `(0, 1020, share: palmitate)` + `desatmech` `(0, 2540)` + `lipidsreg` `(2700, 0)`.
- **`lipidssynth` (Gộp 1–5)**: `fas` `(0, 0)` + `faelong` `(0, 1020, share: palmitate)` + `desatmech` `(0, 2540)` + `tag` `(2700, 1650)` + `lipidsreg` `(2700, 0)`.
- **`everything-lipids`**: `betaox` `(0, 0)` + `fas` `(1400, 0)` + `faelong` `(1400, 1020, share: palmitate)` + `desatmech` `(1400, 2540)` + `tag` `(0, 1850)` + `lipidsreg` `(4100, 0)`.

---

## IV. Quy Trình Kiểm Thử & Tiêu Chuẩn Nghiệm Thu (Bước 4)

1. **Kiểm tra Schema Tĩnh (`node tools/verify_installed_html.js`)**:
   - Kiểm tra 100% ID hợp lệ (`/^[a-z0-9]+$/`), tham chiếu `molecule`/`enzyme`/`cofactor`/`nodes`, `layoutPathway` và `MG.slots.list` trên toàn bộ 8 bản đồ lipid.
2. **Kiểm tra Chồng Lấn Hình Học Thực Tế (`node tools/audit_overlaps.js`)**:
   - Chạy trên Google Chrome Headless qua CDP, đo `getBBox()` thực tế của mọi `.mgc-node`, `.mgc-pill`, `.mgc-badge`, `.mgc-chip`, `.mgc-note`, `.mgc-region-tag` trên toàn bộ các sơ đồ.
   - Điều kiện đạt: **0 overlap** và **0 text overflow/squish** trên tất cả sơ đồ.
3. **Kiểm thử E2E Trình Duyệt (`node tools/test_browser_render.js`, `tests/test_all_modes_play.js`, `tests/verify_ui_flows.js`)**:
   - Xác minh render SVG DOM và tương tác các chế độ chơi hoạt động ổn định.
