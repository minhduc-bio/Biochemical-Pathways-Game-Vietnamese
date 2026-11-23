# Kế Hoạch Triển Khai & Cài Đặt Sinh Tổng Hợp Lipid Vào pathway_quiz.html

Tài liệu này xác định chi tiết thiết kế, quy chuẩn định danh (ID schema), cấu trúc đồ thị, logic hóa sinh và quy trình tích hợp các chu trình sinh tổng hợp lipid từ `sinh_tong_hop_lipid_mermaid.md` vào `pathway_quiz.html` theo chuẩn kiến trúc `infrastructure.md`.

---

## I. Kết quả kiểm tra mã nguồn `pathway_quiz.html` (Bước 1)

1. **Entity IDs hiện có**:
   - `acetylcoa`, `dhap`, `tag`: Đã có trong `molecule`.
   - `g3p`: Đã có trong `molecule` nhưng là *Glyceraldehyde 3-phosphate* (đường phân). **Bắt buộc dùng `gly3p` cho L-Glycerol 3-phosphate**.
   - `dag`: Đã có trong `molecule` (tại pack `advanced` cho PLC pathway).
   - `acc`, `cpt1`: Đã có trong `enzyme` (`cpt1` có alias `cat1`).
   - `atp`, `adp`, `amp`, `coa`, `co2`, `h2o`, `pi`, `ppi`, `nadph`, `nadp`, `nadh`, `nad`, `hco3`: Đã có đầy đủ trong `cofactor`.
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
   - Reaction IDs: `acc1`, `mat1`, `ks1`, `kr1`, `dh1`, `er1`, `te1`, `des9a`, `elo1`, `des9b`, `des12`, `des15`, `des6`, `elo2`, `des5`, `despc1`, `despc2`, `gpdh1`, `gk1`, `facs1`, `gpat1`, `agpat1`, `pap1`, `dgat1`, `gpl1`, `ins1`, `glc1`, `cati1`...
2. **Tránh xung đột `g3p`**:
   - `gly3p`: L-Glycerol 3-phosphate.
3. **Tách bạch Molecule và Cofactor**:
   - `ins`/`outs` chỉ chứa keys từ `MG.entities.cofactor`.
   - `acetylcoa`, `malonylcoa`, `palmitate`... đặt ở `substrates`/`products` và `arrows`.
4. **Pathway Object chuẩn**:
   - Đầy đủ 14 trường: `id`, `title`, `subtitle`, `tag`, `location`, `color`, `nodes`, `reactions`, `order`, `start`, `regions`, `membranes`, `notes`, `summary`.
5. **Thuộc tính phản ứng**:
   - `twoWay: true` cho phản ứng thuận nghịch `⇌`.
   - Bổ sung `cof: { in: 'west', out: 'east' }` (hoặc hướng phù hợp) và `hint` giáo khoa ngắn gọn.

---

## III. Thiết kế Chi tiết 4 Phân đoạn & 1 Bản đồ Tổng (Bước 3)

### 1. `fas` — Tổng hợp Malonyl-CoA & Phức hệ FAS
- **Nodes**:
  - `acetylcoa` (400, 150), `malonylcoa` (400, 380)
  - `acetoacetylacp` (750, 380), `hydroxybutyrylacp` (1050, 530), `butenoylacp` (750, 680), `butyrylacp` (450, 530)
  - `palmitoylacp` (450, 780), `palmitate` (450, 960)
- **Reactions**:
  - `acc1`: Acetyl-CoA + ATP + HCO3- -> Malonyl-CoA + ADP + Pi (Enzyme: `acc`).
  - `mat1`: Acetyl-CoA + Malonyl-CoA -> Acetoacetyl-ACP + CO2 + 2 CoA-SH (Enzyme: `mat`).
  - `kr1`: Acetoacetyl-ACP + NADPH + H+ ⇌ D-β-Hydroxybutyryl-ACP + NADP+ (Enzyme: `kr`, `twoWay: true`).
  - `dh1`: D-β-Hydroxybutyryl-ACP ⇌ trans-Δ²-Butenoyl-ACP + H2O (Enzyme: `dhfas`, `twoWay: true`).
  - `er1`: trans-Δ²-Butenoyl-ACP + NADPH + H+ -> Butyryl-ACP + NADP+ (Enzyme: `er`).
  - `loop1`: Butyryl-ACP (C4) tái nạp Malonyl-CoA lặp 7 vòng -> Palmitoyl-ACP (C16) (Enzyme: `ks`).
  - `te1`: Palmitoyl-ACP + H2O -> Palmitate + ACP (Enzyme: `te`).

### 2. `faelong` — Kéo dài mạch, Khử bão hòa & Hệ Acyl-CoA Desaturase
- **Nodes**:
  - Cây phân nhánh: `palmitate` (200, 250), `palmitoleate` (200, 480), `stearate` (480, 250), `lsf` (480, 480), `oleate` (760, 250), `linoleate` (1040, 250), `alinolenate` (1320, 250), `pufa` (1580, 250), `glinolenate` (1040, 480), `eicosatrienoate` (1040, 700), `arachidonate` (1320, 700).
  - Chuỗi desaturase e-: `nadphd` (600, 950), `cytb5red` (850, 950), `cytb5` (1100, 950), `desatcomp` (1350, 950).
  - Khử bão hòa màng: `pcoleate` (760, 50), `pclinoleate` (1040, 50), `pclinolenate` (1320, 50).
- **Reactions**:
  - `des9a`: Palmitate -> Palmitoleate (Enzyme: `desat9`).
  - `elo1`: Palmitate -> Stearate (Enzyme: `elongase`).
  - `des9b`: Stearate -> Oleate (Enzyme: `desat9`).
  - `elo2`: Stearate -> LSF (Enzyme: `elongase`).
  - `des12`: Oleate -> Linoleate (Enzyme: `desat12`).
  - `des15`: Linoleate -> α-Linolenate (Enzyme: `desat15`).
  - `des6`: Linoleate -> γ-Linolenate (Enzyme: `desat6`).
  - `elo3`: γ-Linolenate -> Eicosatrienoate (Enzyme: `elongase`).
  - `des5`: Eicosatrienoate -> Arachidonate (Enzyme: `desat5`).
  - `pcdes1`: PC-Oleate -> PC-Linoleate (Enzyme: `desat12`).
  - `pcdes2`: PC-Linoleate -> PC-Linolenate (Enzyme: `desat15`).

### 3. `tag` — Sinh tổng hợp Triacylglycerol & Glycerophospholipid
- **Nodes**:
  - `dhap` (200, 150), `glycerol` (50, 380), `gly3p` (200, 380)
  - `fattyacid` (800, 150), `fattyacylcoa` (800, 380)
  - `lysopa` (500, 550), `pa` (500, 750)
  - `dag` (320, 950), `tag` (320, 1180)
  - `gpl` (680, 950)
- **Reactions**:
  - `gpdh1`: DHAP + NADH + H+ ⇌ gly3p + NAD+ (Enzyme: `gpdh`, `twoWay: true`).
  - `gk1`: Glycerol + ATP -> gly3p + ADP (Enzyme: `gk`).
  - `facs1`: Fatty acid + ATP + CoA-SH -> Fatty acyl-CoA + AMP + PPi (Enzyme: `facs`).
  - `gpat1`: gly3p + Fatty acyl-CoA -> Lysophosphatidic acid + CoA-SH (Enzyme: `gpat`).
  - `agpat1`: Lysophosphatidic acid + Fatty acyl-CoA -> Phosphatidic acid + CoA-SH (Enzyme: `agpat`).
  - `pap1`: Phosphatidic acid -> 1,2-DAG + Pi (Enzyme: `pap`).
  - `dgat1`: 1,2-DAG + Fatty acyl-CoA -> Triacylglycerol + CoA-SH (Enzyme: `dgat`).
  - `gpl1`: Phosphatidic acid + Head group -> Glycerophospholipid (Enzyme: `cdpdags`).

### 4. `lipidsreg` — Điều hòa đối kháng ACC – CAT I
- **Nodes**:
  - `glchigh` (200, 150), `insulin` (200, 300), `accact` (420, 300)
  - `glclow` (640, 150), `glucagon` (640, 300), `accinact` (420, 150)
  - `acetylcoar` (200, 480), `malonylcoar` (420, 480)
  - `facylcoacyt` (420, 680), `cpt1gate` (700, 680), `facylcarn` (950, 680), `facylcoamat` (1200, 680), `acetylcoamat` (1450, 680)
- **Membranes**:
  - Ranh giới màng ngoài ty thể: `{ x1: 700, y1: 580, x2: 700, y2: 800 }`
  - Ranh giới màng trong ty thể: `{ x1: 1070, y1: 580, x2: 1070, y2: 800 }`
- **Reactions**:
  - `regacc1`: accinact ⇌ accact (Insulin/Phosphatase hoạt hóa, Glucagon/PKA bất hoạt).
  - `regacc2`: acetylcoar -> malonylcoar (Enzyme: `acc`).
  - `regcpt1`: facylcoacyt -> facylcarn (Enzyme: `cpt1`, bị malonylcoar ức chế qua liên kết `link: true`).
  - `regbeta`: facylcoamat -> acetylcoamat (β-oxidation trong ty thể).

### 5. `lipidssynth` — Bản đồ tổng thể ghép nối bằng `compose()`
- Kết hợp `fas`, `faelong`, `tag`, `lipidsreg` qua các điểm nút dùng chung:
  - `share: { acetylcoa: 'acetylcoa', malonylcoa: 'malonylcoa', palmitate: 'palmitate', dhap: 'dhap', gly3p: 'gly3p' }`.

---

## IV. Quy trình Kiểm thử Tính toàn vẹn (Bước 4)
- Viết script `tools/validate_lipid_pathways.py` kiểm tra:
  1. Regex `/^[a-z0-9]+$/` cho mọi pathway và reaction ID.
  2. Toàn vẹn tham chiếu `node.mol` $\in$ `MG.entities.molecule`.
  3. Toàn vẹn tham chiếu `reaction.enzyme` $\in$ `MG.entities.enzyme`.
  4. Toàn vẹn tham chiếu `ins`/`outs` $\in$ `MG.entities.cofactor`.
  5. Toàn vẹn tham chiếu `substrates`, `products`, `arrows[].from`, `arrows[].to` $\in$ `pathway.nodes`.
  6. Kiểm tra render an toàn không lỗi qua Node.js / Playwright / Python layout run.
