# Sơ đồ Mermaid: Các Chu Trình Sinh Tổng Hợp Lipid (Chương 11 — Từ Trang 15)

Tài liệu tổng hợp các sơ đồ Mermaid theo chuẩn chuyển hóa hóa sinh, bám sát nội dung **Chương 11: Trao đổi Lipid** (từ trang 15 đến trang 28), gồm **5 sơ đồ chi tiết từng chu trình** và **2 sơ đồ tổng hợp**.

**Quy ước ký hiệu trong toàn bộ tài liệu:**
* **Hình chữ nhật `[...]`**: Chất nền, chất trung gian, sản phẩm hoặc tín hiệu hormone.
* **Hình viên thuốc `([...])`**: Enzyme xúc tác hoặc enzyme điều hòa trọng tâm.
* **Mũi tên nét liền `-->`**: Chiều biến đổi hóa học / vận chuyển vật chất.
* **Mũi tên nét đứt `-.->`**: Tác động điều hòa (`[+]` Hoạt hóa, `[-]` Ức chế) hoặc vai trò xúc tác của enzyme.

---

## Phần I. Các sơ đồ chi tiết từng chu trình

### 1. Tổng hợp Malonyl-CoA & Chu trình tổng hợp Palmitate (Trang 16–22)

*(Xảy ra ở tế bào chất, xúc tác bởi Acetyl-CoA Carboxylase và phức hệ Fatty Acid Synthase — FAS)*

```mermaid
flowchart TD
    subgraph Prep ["Giai đoạn 1: Tạo tiền chất Malonyl-CoA (Trang 17)"]
        A1["Acetyl-CoA + ATP + HCO3-"] --> ACC(["Acetyl-CoA Carboxylase (ACC)"])
        ACC -->|"Giải phóng: ADP + Pi + H+"| M1["Malonyl-CoA"]
    end

    subgraph Charge ["Giai đoạn 2: Nạp phức hệ FAS (Trang 18–19, 21)"]
        A2["Acetyl-CoA (gốc khởi đầu)"] -->|"AT / MAT (-CoA-SH)"| FAS["Phức hệ FAS đã nạp:<br/>Gốc Acetyl/Acyl gắn trên Cys của KS (-SH)<br/>Gốc Malonyl gắn trên ACP (-SH)"]
        M1 -->|"MT / MAT (-CoA-SH)"| FAS
    end

    subgraph Cycle ["Giai đoạn 3: Chu trình kéo dài mạch — Lặp 7 vòng (Trang 20–21)"]
        FAS -->|"1. Condensation (KS)<br/>-CO2"| B1["β-Ketoacyl-ACP<br/>(Vòng 1: β-Ketobutyryl-ACP)"]
        B1 -->|"2. Reduction (KR)<br/>NADPH + H+ → NADP+"| B2["D-β-Hydroxyacyl-ACP<br/>(Vòng 1: D-β-Hydroxybutyryl-ACP)"]
        B2 -->|"3. Dehydration (DH)<br/>-H2O"| B3["trans-Δ²-Enoyl-ACP<br/>(Vòng 1: trans-Δ²-Butenoyl-ACP)"]
        B3 -->|"4. Reduction (ER)<br/>NADPH + H+ → NADP+"| B4["Acyl-ACP bão hòa<br/>(Vòng 1: Butyryl-ACP, 4C)"]

        B4 -->|"5. Translocation (KS)<br/>Chuyển gốc acyl từ ACP sang Cys của KS"| B5["Acyl-KS + ACP-SH tự do"]
        B5 -->|"6. Recharging (MAT / MT)<br/>+Malonyl-CoA, -CoA-SH (lặp vòng 2 → 7)"| FAS
    end

    subgraph Term ["Giai đoạn 4: Giải phóng sản phẩm (Trang 22)"]
        B4 -->|"Hoàn tất 7 vòng (đạt 16C)"| PalACP["Palmitoyl-ACP (16:0)"]
        PalACP --> TE(["Thioesterase"])
        TE -->|"+H2O, -ACP-SH"| Pal["Palmitate (16:0)<br/>Tổng phương trình:<br/>8 Acetyl-CoA + 7 ATP + 14 NADPH + 14 H+ →<br/>Palmitate + 7 ADP + 7 Pi + 14 NADP+ + 8 CoA-SH + 6 H2O"]
    end
```

---

### 2. Tổng hợp các axit béo no và không no khác (Trang 16, 23 & 27)

*(Kéo dài chuỗi xảy ra ở mạng lưới nội chất & ty thể; tạo nối đôi xảy ra ở mạng lưới nội chất, cơ chất ở dạng hoạt hóa Acyl-CoA hoặc gắn trong lipid màng)*

```mermaid
flowchart TD
    subgraph Main ["Kéo dài chuỗi & khử bão hòa từ Palmitate — dạng Acyl-CoA (Trang 23)"]
        P["Palmitate 16:0 (Palmitoyl-CoA)"] -->|"Desaturation"| Po["Palmitoleate 16:1(Δ⁹)"]
        P -->|"Elongation"| S["Stearate 18:0"]
        S -->|"Elongation"| LSF["Các axit béo no mạch dài hơn"]
        S -->|"Desaturation"| O["Oleate 18:1(Δ⁹)"]
        O -->|"Desaturation<br/>(chỉ ở thực vật)"| Lin["Linoleate 18:2(Δ⁹,¹²)"]
        Lin -->|"Desaturation<br/>(chỉ ở thực vật)"| aLin["α-Linolenate 18:3(Δ⁹,¹²,¹⁵)"]
        aLin -->|"Elongation / Desaturation"| PUFA["Các axit béo không no nhiều nối đôi (PUFA) khác"]
        Lin -->|"Desaturation"| gLin["γ-Linolenate 18:3(Δ⁶,⁹,¹²)"]
        gLin -->|"Elongation"| Eic["Eicosatrienoate 20:3(Δ⁸,¹¹,¹⁴)"]
        Eic -->|"Desaturation"| Ara["Arachidonate 20:4(Δ⁵,⁸,¹¹,¹⁴)"]
    end

    subgraph PC ["Tạo axit béo nhiều nối đôi ngay trong lipid màng (Trang 27)"]
        PC1["Phosphatidylcholine<br/>chứa Oleate 18:1(Δ⁹)"] -->|"Desaturase"| PC2["Phosphatidylcholine<br/>chứa Linoleate 18:2(Δ⁹,¹²)"]
        PC2 -->|"Desaturase"| PC3["Phosphatidylcholine<br/>chứa Linolenate 18:3(Δ⁹,¹²,¹⁵)"]
    end
```

---

### 3. Cơ chế tạo nối đôi bởi hệ Acyl-CoA Desaturase (Trang 24)

*(Xảy ra ở màng lưới nội chất — ghép cặp chuỗi truyền electron với phản ứng khử bão hòa)*

```mermaid
flowchart LR
    subgraph ElectronChain ["Chuỗi truyền electron ghép cặp"]
        NADPH["NADPH + H+"] -->|"→ NADP+"| Red1(["Cyt b5 reductase<br/>(FAD → FADH2)"])
        Red1 -->|"FADH2 → FAD"| Cyt["2 Cyt b5<br/>(Fe³⁺ → Fe²⁺)"]
    end

    subgraph Reaction ["Phản ứng khử bão hòa"]
        Sat["Saturated fatty acyl-CoA<br/>+ O2 + 2 H+"] --> Desat(["Fatty acyl-CoA desaturase"])
        Desat --> Unsat["Monounsaturated fatty acyl-CoA<br/>+ 2 H2O"]
    end

    Cyt -.->|"Cung cấp 2 e-<br/>2 Cyt b5 (Fe²⁺ → Fe³⁺)"| Desat
```

---

### 4. Sinh tổng hợp Triacylglycerol & Glycerophospholipid (Trang 25–26)

```mermaid
flowchart TD
    subgraph Step1 ["1. Tổng hợp khung L-Glycerol 3-phosphate (Trang 25)"]
        Glu["Glucose"] -->|"Glycolysis"| DHAP["Dihydroxyacetone phosphate (DHAP)"]
        DHAP -->|"Glycerol 3-phosphate dehydrogenase<br/>NADH + H+ → NAD+"| G3P["L-Glycerol 3-phosphate"]
        Gly["Glycerol"] -->|"Glycerol kinase<br/>ATP → ADP"| G3P
    end

    subgraph Step2 ["2. Hoạt hóa axit béo & Tổng hợp Phosphatidic acid (Trang 26)"]
        FA1["R1-COO- + CoA-SH + ATP"] -->|"Acyl-CoA synthetase<br/>-AMP, -PPi"| Acyl1["R1-CO-S-CoA"]
        FA2["R2-COO- + CoA-SH + ATP"] -->|"Acyl-CoA synthetase<br/>-AMP, -PPi"| Acyl2["R2-CO-S-CoA"]

        G3P --> AT1(["Acyl transferase 1"])
        Acyl1 --> AT1
        AT1 -->|"-CoA-SH"| LPA["Lysophosphatidic acid<br/>(Trung gian gắn gốc R1)"]

        LPA --> AT2(["Acyl transferase 2"])
        Acyl2 --> AT2
        AT2 -->|"-CoA-SH"| PA["Phosphatidic acid"]
    end

    subgraph Step3 ["3. Rẽ nhánh tạo lipid dự trữ và lipid màng (Trang 26)"]
        PA --> PAP(["Phosphatidic acid phosphatase"])
        PAP -->|"+H2O, -Pi"| DAG["1,2-Diacylglycerol"]
        DAG -->|"Acyl transferase 3<br/>+R3-CO-S-CoA, -CoA-SH"| TAG["Triacylglycerol (Dự trữ)"]

        PA -->|"Gắn nhóm đầu phân cực<br/>(serine, choline, ethanolamine...)"| GPL["Glycerophospholipid (Lipid màng)"]
    end
```

---

### 5. Điều hòa trao đổi axit béo thông qua trục ACC & CAT I (Trang 28)

```mermaid
flowchart TD
    subgraph Synth ["Tế bào chất: Điều hòa ACC & Tổng hợp axit béo"]
        Carb["Dietary carbohydrate"] -.-> HighG["High blood glucose"]
        Carb --> Glu["Glucose"]
        Glu -->|"Glycolysis + PDH complex"| AcCoA["Acetyl-CoA"]

        HighG -->|"1"| Ins["Tăng Insulin"]
        Ins -.->|"2. [+] Hoạt hóa"| Phos(["Protein Phosphatase"])
        Phos -.->|"Khử phosphoryl (-Pi)"| ACC_Inact["ACC (Inactive — dạng gắn P)"]

        LowG["Low blood glucose"] -->|"5"| Glc["Tăng Glucagon"]
        Glc -.->|"6. [+] Hoạt hóa"| PKA(["Protein Kinase A (PKA)"])
        PKA -.->|"Phosphoryl hóa (ATP → ADP)"| ACC_Act["ACC (Active — dạng khử P)"]

        ACC_Inact -->|"Khử P"| ACC_Act
        ACC_Act -->|"Gắn P"| ACC_Inact

        AcCoA --> ACC_Rxn(["Acetyl-CoA Carboxylase"])
        ACC_Act -.->|"3. Xúc tác phản ứng"| ACC_Rxn
        ACC_Rxn -->|"+ATP, +HCO3-<br/>-ADP, -Pi, -H+"| Mal["Malonyl-CoA"]
        Mal -->|"Phức hệ FAS (nhiều bước)"| FA["Fatty acids (Palmitate)"]
    end

    subgraph BetaOx ["Màng ty thể & Matrix ty thể: β-oxy hóa axit béo"]
        FA_CoA1["Fatty acyl-CoA (Tế bào chất)<br/>+ Carnitine"] --> CAT1(["Carnitine acyltransferase I (CAT I)<br/>Màng ngoài ty thể"])
        CAT1 -->|"-CoA-SH"| FA_Carn["Fatty acyl-carnitine"]
        FA_Carn -->|"7. Translocase & CAT II (Màng trong)<br/>+CoA-SH, -Carnitine"| FA_CoA2["Fatty acyl-CoA (Matrix ty thể)"]
        FA_CoA2 -->|"8. β-oxidation<br/>Sinh FADH2, NADH"| AcCoA_M["Acetyl-CoA (Matrix)"]
    end

    Mal -.->|"4. [-] Ức chế dị lập thể CAT I<br/>(Khóa β-oxy hóa khi đang tổng hợp)"| CAT1
```

---

## Phần II. Các sơ đồ tổng hợp (Gộp các chu trình liên quan)

### A. Sơ đồ gộp: Điều hòa, Tổng hợp & Biến đổi Axit béo (Gộp Sơ đồ 1 + 2 + 3 + 5)

Sơ đồ liên kết toàn bộ trục chuyển hóa axit béo: từ nguồn glucose, qua điểm kiểm soát ACC–CAT I, vào phức hệ FAS tạo Palmitate, rồi tiếp tục kéo dài mạch và khử bão hòa nhờ hệ Acyl-CoA desaturase.

```mermaid
flowchart TD
    subgraph Reg ["1. Điều hòa & Khởi tạo tiền chất (Trang 17, 28)"]
        Carb["Dietary carbohydrate"] --> Glu["Glucose"]
        Carb -.-> HighG["High blood glucose → Tăng Insulin → Phosphatase (-Pi)"]
        LowG["Low blood glucose → Tăng Glucagon → PKA (+P)"] -.->|"[-] Bất hoạt"| ACC(["Acetyl-CoA Carboxylase (ACC)"])
        HighG -.->|"[+] Hoạt hóa"| ACC

        Glu -->|"Glycolysis + PDH complex"| AcCoA["Acetyl-CoA"]
        AcCoA --> ACC
        ACC -->|"+ATP, +HCO3-<br/>-ADP, -Pi, -H+"| Mal["Malonyl-CoA"]
    end

    subgraph BetaBlock ["Đối trọng phân giải ở Ty thể (Trang 28)"]
        FA_CoA["Fatty acyl-CoA + Carnitine"] --> CAT1(["CAT I (Màng ngoài ty thể)"])
        CAT1 -->|"-CoA-SH"| Carn["Fatty acyl-carnitine → Matrix ty thể → β-oxidation"]
    end
    Mal -.->|"[-] Ức chế CAT I<br/>Ngăn β-oxy hóa đồng thời"| CAT1

    subgraph FAS_Sys ["2. Phức hệ Fatty Acid Synthase — Tế bào chất (Trang 18–22)"]
        AcCoA -->|"AT / MAT (-CoA-SH)"| FAS["Phức hệ FAS (Acyl-KS + Malonyl-ACP)"]
        Mal -->|"MT / MAT (-CoA-SH)"| FAS
        FAS -->|"Lặp 7 vòng: KS (-CO2) → KR (NADPH)<br/>→ DH (-H2O) → ER (NADPH) → Translocation"| PalACP["Palmitoyl-ACP (16:0)"]
        PalACP -->|"Thioesterase (+H2O, -ACP-SH)"| Pal["Palmitate (16:0)"]
    end

    subgraph DesatMech ["3. Cơ chế khử bão hòa — Mạng lưới nội chất (Trang 24)"]
        NADPH["NADPH + H+"] --> Red(["Cyt b5 reductase (FAD/FADH2)"])
        Red --> Cyt["2 Cyt b5 (Fe³⁺/Fe²⁺)"]
        Cyt -.->|"Cấp 2 e- cùng O2 + 2 H+ → 2 H2O"| Desat(["Hệ Acyl-CoA desaturase"])
    end

    subgraph Mod ["4. Kéo dài chuỗi (ER & Ty thể) & Tạo nối đôi (ER) — dạng Acyl-CoA (Trang 16, 23)"]
        Pal -->|"Desaturation"| Po["Palmitoleate 16:1(Δ⁹)"]
        Pal -->|"Elongation"| Ste["Stearate 18:0"]
        Ste -->|"Elongation"| LSF["Axit béo no mạch dài hơn"]
        Ste -->|"Desaturation"| Ole["Oleate 18:1(Δ⁹)"]
        Ole -->|"Desaturation (thực vật)"| Lin["Linoleate 18:2(Δ⁹,¹²)"]
        Lin -->|"Desaturation (thực vật)"| aLin["α-Linolenate 18:3(Δ⁹,¹²,¹⁵) → PUFA khác"]
        Lin -->|"Desaturation → Elongation → Desaturation"| Ara["γ-Linolenate → Eicosatrienoate → Arachidonate 20:4"]
    end

    Desat -.->|"Xúc tác tạo nối đôi"| Po
    Desat -.->|"Xúc tác tạo nối đôi"| Ole
```

---

### B. Bản đồ tổng thể Sinh tổng hợp Lipid (Gộp toàn bộ Sơ đồ 1–5)

Sơ đồ toàn cảnh kết nối tất cả các chu trình từ trang 15 đến trang 28: **Glucose** vừa là nguồn tạo **Acetyl-CoA** (tổng hợp axit béo), vừa tạo **DHAP → L-Glycerol 3-phosphate** (khung glycerol); sau đó axit béo hoạt hóa (**Acyl-CoA**) ghép với khung glycerol tạo **Phosphatidic acid**, rẽ nhánh thành **Triacylglycerol** (dự trữ) và **Glycerophospholipid** (lipid màng).

```mermaid
flowchart TD
    Carb["Dietary carbohydrate"] --> Glu["Glucose"]
    Carb -.->|"Tăng Insulin → Phosphatase"| ACC_Ctrl["Tín hiệu hoạt hóa ACC (-Pi)"]
    Fast["Low blood glucose → Tăng Glucagon → PKA"] -.->|"Phosphoryl hóa"| ACC_Off["Tín hiệu bất hoạt ACC (+P)"]

    subgraph FA_Path ["A. Sinh tổng hợp & Biến đổi Axit béo (Trang 16–24, 28)"]
        Glu -->|"Glycolysis + PDH complex"| AcCoA["Acetyl-CoA"]
        AcCoA --> ACC(["Acetyl-CoA Carboxylase (ACC)"])
        ACC_Ctrl -.->|"[+] Hoạt hóa"| ACC
        ACC_Off -.->|"[-] Bất hoạt"| ACC

        ACC -->|"+ATP, +HCO3-"| Mal["Malonyl-CoA"]
        Mal -.->|"[-] Ức chế dị lập thể"| CAT1(["CAT I — Khóa β-oxidation ở ty thể"])

        AcCoA -->|"Nạp gốc khởi đầu"| FAS["Phức hệ FAS (Tế bào chất)<br/>7 vòng: KS → KR → DH → ER"]
        Mal -->|"Cung cấp đơn vị 2C"| FAS
        FAS -->|"Thioesterase (+H2O)"| Pal["Palmitate (16:0)"]
        Pal -->|"Elongation (ER & Ty thể)<br/>Desaturation (ER — Desaturase + Cyt b5 + NADPH + O2)"| FAs["Kho axit béo no & không no<br/>(Stearate, Oleate, Linoleate, Arachidonate...)"]
        FAs -->|"Acyl-CoA synthetase<br/>+CoA-SH + ATP (-AMP, -PPi)"| AcylCoA["Fatty acyl-CoA (R-CO-S-CoA)"]
    end

    subgraph Gly_Path ["B. Tạo khung Glycerol (Trang 25)"]
        Glu -->|"Glycolysis"| DHAP["Dihydroxyacetone phosphate (DHAP)"]
        DHAP -->|"Glycerol 3-phosphate dehydrogenase<br/>(NADH + H+ → NAD+)"| G3P["L-Glycerol 3-phosphate"]
        Gly["Glycerol"] -->|"Glycerol kinase<br/>(ATP → ADP)"| G3P
    end

    subgraph Lipid_Path ["C. Sinh tổng hợp Triacylglycerol & Glycerophospholipid (Trang 26–27)"]
        G3P -->|"2 bước Acyl transferase (-2 CoA-SH)"| PA["Phosphatidic acid"]
        AcylCoA -->|"Cung cấp R1-CO-S-CoA & R2-CO-S-CoA"| PA

        PA -->|"Phosphatidic acid phosphatase<br/>(+H2O, -Pi)"| DAG["1,2-Diacylglycerol"]
        AcylCoA -->|"Cung cấp R3-CO-S-CoA<br/>(Acyl transferase, -CoA-SH)"| TAG["Triacylglycerol (Dự trữ)"]
        DAG --> TAG

        PA -->|"Gắn nhóm đầu phân cực<br/>(serine, choline, ethanolamine...)"| GPL["Glycerophospholipid (Lipid màng)"]
        GPL -->|"Ví dụ: Phosphatidylcholine (18:1)<br/>Desaturase (Trang 27)"| PC_PUFA["Phosphatidylcholine chứa PUFA<br/>18:2(Δ⁹,¹²) → 18:3(Δ⁹,¹²,¹⁵)"]
    end
```