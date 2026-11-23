# Sơ đồ Mermaid: Các Chu Trình Sinh Tổng Hợp Lipid (Chương 11 — Từ Trang 15)

Tài liệu tổng hợp các sơ đồ Mermaid bám sát nội dung **Chương 11: Trao đổi Lipid** (từ trang 15 đến trang 28), gồm **5 sơ đồ chi tiết từng chu trình** và **2 sơ đồ tổng hợp** liên kết các con đường có quan hệ trực tiếp với nhau.

---

## Phần I. Các sơ đồ chi tiết từng chu trình

### 1. Tổng hợp Malonyl-CoA & Chu trình tổng hợp Palmitate (Trang 16–22)

*(Xảy ra ở tế bào chất, xúc tác bởi Acetyl-CoA Carboxylase và phức hệ Fatty Acid Synthase — FAS)*

```mermaid
flowchart TD
    subgraph Prep ["Giai đoạn 1: Tạo tiền chất Malonyl-CoA (Trang 17)"]
        A1["Acetyl-CoA + ATP + HCO3-"] -->|"Acetyl-CoA Carboxylase (ACC)<br/>Giải phóng: ADP + Pi + H+"| M1["Malonyl-CoA"]
    end

    subgraph Charge ["Giai đoạn 2: Nạp phức hệ FAS (Trang 18–19, 21)"]
        A2["Acetyl-CoA"] -->|"AT / MAT (-CoA-SH)"| FAS["Phức hệ FAS đã nạp:<br/>Gốc Acetyl gắn trên KS (-SH)<br/>Gốc Malonyl gắn trên ACP (-SH)"]
        M1 -->|"MT / MAT (-CoA-SH)"| FAS
    end

    subgraph Cycle ["Giai đoạn 3: Chu trình kéo dài mạch — Lặp 7 vòng (Trang 20–21)"]
        FAS -->|"1. Condensation (KS)<br/>-CO2"| B1["β-Ketobutyryl-ACP"]
        B1 -->|"2. Reduction (KR)<br/>NADPH + H+ → NADP+"| B2["β-Hydroxybutyryl-ACP"]
        B2 -->|"3. Dehydration (DH / HD)<br/>-H2O"| B3["trans-Δ²-Butenoyl-ACP"]
        B3 -->|"4. Reduction (ER)<br/>NADPH + H+ → NADP+"| B4["Butyryl-ACP"]
        B4 -->|"5. Translocation (KS)<br/>Chuyển gốc acyl từ ACP sang Cys của KS"| B5["Acyl-KS + ACP tự do"]
        B5 -->|"6. Recharging (MAT / MT)<br/>+Malonyl-CoA, -CoA-SH"| FAS
    end

    B4 -->|"Hoàn tất 7 vòng (C16)"| Pal["Palmitate (16:0)<br/>Tổng: 8 Acetyl-CoA + 7 ATP + 14 NADPH →<br/>Palmitate + 7 ADP + 7 Pi + 14 NADP+ + 8 CoASH + 6 H2O"]
```

### 2. Tổng hợp các axit béo no và không no khác (Trang 16, 23 & 27)

*(Kéo dài chuỗi xảy ra ở mạng lưới nội chất & ty thể; tạo nối đôi xảy ra ở mạng lưới nội chất)*

```mermaid
flowchart TD
    subgraph Main ["Kéo dài chuỗi & khử bão hòa từ Palmitate (Trang 23)"]
        P["Palmitate 16:0"] -->|"desaturation"| Po["Palmitoleate 16:1(Δ⁹)"]
        P -->|"elongation"| S["Stearate 18:0"]
        S -->|"elongation"| LSF["Longer saturated fatty acids"]
        S -->|"desaturation"| O["Oleate 18:1(Δ⁹)"]
        O -->|"desaturation<br/>(chỉ ở thực vật)"| Lin["Linoleate 18:2(Δ⁹,¹²)"]
        Lin -->|"desaturation<br/>(chỉ ở thực vật)"| aLin["α-Linolenate 18:3(Δ⁹,¹²,¹⁵)"]
        aLin --> PUFA["Other polyunsaturated fatty acids"]
        Lin -->|"desaturation"| gLin["γ-Linolenate 18:3(Δ⁶,⁹,¹²)"]
        gLin -->|"elongation"| Eic["Eicosatrienoate 20:3(Δ⁸,¹¹,¹⁴)"]
        Eic -->|"desaturation"| Ara["Arachidonate 20:4(Δ⁵,⁸,¹¹,¹⁴)"]
    end

    subgraph PC ["Tạo axit béo nhiều nối đôi ngay trong lipid màng (Trang 27)"]
        PC1["Phosphatidylcholine<br/>chứa Oleate 18:1(Δ⁹)"] -->|"desaturase"| PC2["Phosphatidylcholine<br/>chứa Linoleate 18:2(Δ⁹,¹²)"]
        PC2 -->|"desaturase"| PC3["Phosphatidylcholine<br/>chứa Linolenate 18:3(Δ⁹,¹²,¹⁵)"]
    end
```

### 3. Cơ chế tạo nối đôi bởi hệ Acyl-CoA desaturase (Trang 24)

```mermaid
flowchart LR
    subgraph ElectronChain ["Chuỗi truyền electron ghép cặp"]
        NADPH["NADPH + H+"] -->|"→ NADP+"| Red1["Cyt b5 reductase<br/>(FAD → FADH2)"]
        Red1 -->|"FADH2 → FAD"| Cyt["2 Cyt b5<br/>(Fe³⁺ → Fe²⁺)"]
    end

    subgraph Reaction ["Phản ứng khử bão hòa"]
        Sat["Saturated fatty acyl-CoA<br/>+ O2 + 2 H+"] -->|"fatty acyl-CoA desaturase"| Unsat["Monounsaturated fatty acyl-CoA<br/>+ 2 H2O"]
    end

    Cyt -->|"2 Cyt b5 (Fe²⁺ → Fe³⁺)<br/>Cung cấp electron"| Reaction
```

### 4. Sinh tổng hợp Triacylglycerol & Glycerophospholipid (Trang 25–26)

```mermaid
flowchart TD
    subgraph Step1 ["1. Tổng hợp L-Glycerol 3-phosphate (Trang 25)"]
        Glu["Glucose"] -->|"glycolysis"| DHAP["Dihydroxyacetone phosphate"]
        DHAP -->|"glycerol 3-phosphate dehydrogenase<br/>NADH + H+ → NAD+"| G3P["L-Glycerol 3-phosphate"]
        Gly["Glycerol"] -->|"glycerol kinase<br/>ATP → ADP"| G3P
    end

    subgraph Step2 ["2. Tổng hợp Phosphatidic acid & rẽ nhánh (Trang 26)"]
        FA1["R1-COO- + CoA-SH + ATP"] -->|"acyl-CoA synthetase<br/>-AMP, -PPi"| Acyl1["R1-CO-S-CoA"]
        FA2["R2-COO- + CoA-SH + ATP"] -->|"acyl-CoA synthetase<br/>-AMP, -PPi"| Acyl2["R2-CO-S-CoA"]

        G3P -->|"acyl transferase (-CoA-SH)"| Mid["Trung gian gắn gốc R1"]
        Acyl1 --> Mid
        Mid -->|"acyl transferase (-CoA-SH)"| PA["Phosphatidic acid"]
        Acyl2 --> PA

        PA -->|"phosphatidic acid phosphatase"| DAG["1,2-Diacylglycerol"]
        DAG -->|"acyl transferase<br/>+R3-CO-S-CoA, -CoA-SH"| TAG["Triacylglycerol"]

        PA -->|"Gắn nhóm đầu<br/>(serine, choline, ethanolamine...)"| GPL["Glycerophospholipid"]
    end
```

### 5. Điều hòa trao đổi axit béo thông qua ACC và CAT I (Trang 28)

```mermaid
flowchart TD
    subgraph Synth ["Tế bào chất: Tổng hợp axit béo (Fatty acid synthesis)"]
        Carb["Dietary carbohydrate"] -.-> HighG["High blood glucose"]
        Carb --> Glu["Glucose"]
        Glu -->|"glycolysis,<br/>pyruvate dehydrogenase complex"| AcCoA["Acetyl-CoA"]

        HighG -->|"1"| Ins["↑ Insulin"]
        Ins -->|"2"| Phos["Hoạt hóa Phosphatase"]
        Phos -->|"Khử Pi"| ACC_Act["ACC (Active)"]
        ACC_Inact["ACC (Inactive - có P)"] -->|"Phosphatase (-Pi)"| ACC_Act

        LowG["Low blood glucose"] -->|"5"| Glc["↑ Glucagon"]
        Glc --> PKA["Hoạt hóa PKA"]
        ACC_Act -->|"6. PKA phosphoryl hóa"| ACC_Inact

        AcCoA -->|"3. ACC (Active)"| Mal["Malonyl-CoA"]
        Mal -->|"multistep"| FA["Fatty acids"]
    end

    subgraph BetaOx ["Ty thể: β-oxy hóa axit béo (Fatty acid β-oxidation)"]
        FA_CoA1["Fatty acyl-CoA"] -->|"carnitine acyltransferase I (CAT I)"| FA_Carn["Fatty acyl-carnitine"]
        FA_Carn -->|"7. Vận chuyển vào Mitochondrion<br/>+CoASH, -Carnitine"| FA_CoA2["Fatty acyl-CoA (trong ty thể)"]
        FA_CoA2 -->|"8. β-oxidation<br/>Sinh FADH2, NADH"| AcCoA_M["Acetyl-CoA"]
    end

    Mal -.->|"4. ✖ Ức chế CAT I"| FA_CoA1
```

---

## Phần II. Các sơ đồ tổng hợp (Gộp các chu trình liên quan)

### A. Sơ đồ gộp: Điều hòa, Tổng hợp & Biến đổi Axit béo (Gộp Sơ đồ 1 + 2 + 3 + 5)

Sơ đồ này liên kết trục chuyển hóa axit béo từ nguồn carbohydrate/glucose, qua điểm kiểm soát ACC–CAT I, vào phức hệ FAS tạo Palmitate, rồi tiếp tục kéo dài mạch và khử bão hòa nhờ hệ Acyl-CoA desaturase.

```mermaid
flowchart TD
    subgraph Reg ["1. Điều hòa & Khởi tạo tiền chất (Trang 17, 28)"]
        Carb["Dietary carbohydrate"] --> Glu["Glucose"]
        Carb -.-> HighG["High blood glucose → ↑ Insulin → Phosphatase (-Pi)"]
        LowG["Low blood glucose → ↑ Glucagon → PKA (+P)"] -.->|"Ức chế (bất hoạt)"| ACC["Acetyl-CoA Carboxylase (ACC)"]
        HighG -.->|"Hoạt hóa"| ACC
        Glu -->|"glycolysis + PDH complex"| AcCoA["Acetyl-CoA"]
        AcCoA -->|"ACC (+ATP, +HCO3-)<br/>-ADP, -Pi, -H+"| Mal["Malonyl-CoA"]
    end

    subgraph BetaBlock ["Đối trọng phân giải ở Ty thể (Trang 28)"]
        FA_CoA["Fatty acyl-CoA"] -->|"CAT I"| Carn["Fatty acyl-carnitine → Ty thể → β-oxidation"]
    end
    Mal -.->|"✖ Ức chế CAT I<br/>Ngăn β-oxy hóa đồng thời"| FA_CoA

    subgraph FAS_Sys ["2. Phức hệ Fatty Acid Synthase — Tế bào chất (Trang 18–22)"]
        AcCoA -->|"AT / MAT"| FAS["FAS (KS-Acetyl + ACP-Malonyl)"]
        Mal -->|"MT / MAT"| FAS
        FAS -->|"Lặp 7 vòng: KS (-CO2) → KR (NADPH)<br/>→ DH (-H2O) → ER (NADPH) → Translocation"| Pal["Palmitate (16:0)"]
    end

    subgraph DesatMech ["3. Cơ chế khử bão hòa — Mạng lưới nội chất (Trang 24)"]
        NADPH["NADPH + H+"] --> Red["Cyt b5 reductase (FAD/FADH2)"]
        Red --> Cyt["2 Cyt b5 (Fe³⁺/Fe²⁺)"]
        Cyt -->|"Cấp e- cùng O2 + 2H+ → 2H2O"| Desat["Hệ Acyl-CoA desaturase"]
    end

    subgraph Mod ["4. Kéo dài chuỗi (ER & Ty thể) & Tạo nối đôi (ER) (Trang 16, 23)"]
        Pal -->|"Desaturation"| Po["Palmitoleate 16:1(Δ⁹)"]
        Pal -->|"Elongation"| Ste["Stearate 18:0"]
        Ste -->|"Elongation"| LSF["Longer saturated fatty acids"]
        Ste -->|"Desaturation"| Ole["Oleate 18:1(Δ⁹)"]
        Ole -->|"Desaturation (thực vật)"| Lin["Linoleate 18:2(Δ⁹,¹²)"]
        Lin -->|"Desaturation (thực vật)"| aLin["α-Linolenate 18:3(Δ⁹,¹²,¹⁵) → PUFA khác"]
        Lin -->|"Desaturation → Elongation → Desaturation"| Ara["γ-Linolenate → Eicosatrienoate → Arachidonate 20:4"]
    end

    Desat -.->|"Xúc tác tạo nối đôi"| Mod
```

### B. Bản đồ tổng thể Sinh tổng hợp Lipid (Gộp toàn bộ Sơ đồ 1–5)

Sơ đồ toàn cảnh kết nối tất cả các chu trình từ trang 15 đến trang 28: **Glucose** vừa là nguồn tạo **Acetyl-CoA** (tổng hợp axit béo), vừa tạo **DHAP → L-Glycerol 3-phosphate** (khung glycerol); sau đó axit béo hoạt hóa (**Acyl-CoA**) ghép với khung glycerol tạo **Phosphatidic acid**, rẽ nhánh thành **Triacylglycerol** (dự trữ) và **Glycerophospholipid** (lipid màng, nơi diễn ra phản ứng khử bão hòa tiếp theo trên Phosphatidylcholine).

```mermaid
flowchart TD
    Carb["Dietary carbohydrate"] --> Glu["Glucose"]
    Carb -.->|"↑ Insulin → Phosphatase"| ACC_Ctrl["Hoạt hóa ACC"]
    Fast["Low blood glucose → ↑ Glucagon → PKA"] -.->|"Phosphoryl hóa"| ACC_Off["Bất hoạt ACC"]

    subgraph FA_Path ["A. Sinh tổng hợp & Biến đổi Axit béo (Trang 16–24, 28)"]
        Glu -->|"glycolysis + PDH complex"| AcCoA["Acetyl-CoA"]
        ACC_Ctrl -.-> AcCoA
        ACC_Off -.-> AcCoA
        AcCoA -->|"ACC (+ATP, +HCO3-)"| Mal["Malonyl-CoA"]
        Mal -.->|"✖ Ức chế CAT I<br/>(Khóa β-oxidation ở ty thể)"| Beta["Ty thể: β-oxidation bị ức chế"]
        AcCoA -->|"Nạp gốc khởi đầu"| FAS["Phức hệ FAS (Tế bào chất)<br/>7 vòng: KS → KR → DH → ER"]
        Mal -->|"Cung cấp đơn vị 2C"| FAS
        FAS --> Pal["Palmitate (16:0)"]
        Pal -->|"Elongation (ER & Ty thể)<br/>Desaturation (ER — Acyl-CoA desaturase + Cyt b5 + NADPH + O2)"| FAs["Kho axit béo no & không no<br/>(Stearate, Oleate, Linoleate, Arachidonate...)"]
        FAs -->|"acyl-CoA synthetase<br/>+CoA-SH + ATP (-AMP, -PPi)"| AcylCoA["Fatty acyl-CoA (R-CO-S-CoA)"]
    end

    subgraph Gly_Path ["B. Tạo khung Glycerol (Trang 25)"]
        Glu -->|"glycolysis"| DHAP["Dihydroxyacetone phosphate (DHAP)"]
        DHAP -->|"glycerol 3-phosphate dehydrogenase<br/>(NADH + H+ → NAD+)"| G3P["L-Glycerol 3-phosphate"]
        Gly["Glycerol"] -->|"glycerol kinase<br/>(ATP → ADP)"| G3P
    end

    subgraph Lipid_Path ["C. Sinh tổng hợp Triacylglycerol & Glycerophospholipid (Trang 26–27)"]
        G3P -->|"2 bước acyl transferase (-2 CoA-SH)"| PA["Phosphatidic acid"]
        AcylCoA -->|"Cung cấp R1-CO-S-CoA & R2-CO-S-CoA"| PA

        PA -->|"phosphatidic acid phosphatase"| DAG["1,2-Diacylglycerol"]
        AcylCoA -->|"Cung cấp R3-CO-S-CoA<br/>(acyl transferase, -CoA-SH)"| TAG["Triacylglycerol (Dự trữ)"]
        DAG --> TAG

        PA -->|"Gắn nhóm đầu<br/>(serine, choline, ethanolamine...)"| GPL["Glycerophospholipid (Lipid màng)"]
        GPL -->|"Ví dụ: Phosphatidylcholine (18:1)<br/>desaturase (Trang 27)"| PC_PUFA["Phosphatidylcholine chứa PUFA<br/>18:2(Δ⁹,¹²) → 18:3(Δ⁹,¹²,¹⁵)"]
    end
```
