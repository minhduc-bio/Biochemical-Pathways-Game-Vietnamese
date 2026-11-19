# Sơ Đồ Luồng Thao Tác Hệ Thống (FE & BE Architecture Flow)
### Biochemical Pathways Game (`pathway_quiz.html`)

Tài liệu này mô tả chi tiết toàn bộ kiến trúc và luồng thao tác giữa **Frontend (Giao diện người dùng / Presentation Layer)** và **Backend (Client-Side Business Logic, Engine tính toán & Data Persistence Layer)** của ứng dụng Single Page Application (SPA) thuần HTML5/CSS3/Vanilla JS.

---

## 1. Sơ Đồ Kiến Trúc Tổng Quan (System Architecture)

Dù là ứng dụng Zero-Dependency không phụ thuộc máy chủ web động, hệ thống phân tách nghiêm ngặt giữa tầng **Presentation (FE)** và tầng **Logic & Dữ Liệu (Client-Side BE)**.

```mermaid
flowchart TB
    subgraph FE["FRONTEND (Presentation & UI Layer)"]
        direction TB
        UI_Shell["App Shell & Navigation Router\n(MG.app: #app, .mg-app, [data-screen])"]
        
        subgraph FE_Screens["Màn Hình & Thành Phần Giao Diện (Screens & Views)"]
            MenuScreen["Màn hình Menu (Home Hub)\n(.mg-menu, .mg-brand, Accordion Groups)"]
            QuizScreen["Màn hình Quiz (3 Modes: Build / Pick / Type)\n(.mgq-head, .mgq-eq-card, .mgq-chooser, .mgq-hints)"]
            SVGCanvas["Bản đồ Sinh học Tương tác (SVG Canvas)\n(.mgc-host, .mgc-node, .mgc-arrow, Pan/Zoom)"]
            ATPScreen["Bộ Tính Toán ATP & Năng Lượng\n(.mg-atp-menu, .mg-atp-dock, .mg-atp-ex)"]
            DrawScreen["Bàn Vẽ Cấu Trúc Phân Tử\n(.mg-dw-editor, .mg-dw-choices, .mg-dw-key)"]
            GamesScreen["Mini-quiz So Sánh & Cơ Chế\n(.mg-gm-figures, .mg-gm-fields)"]
            SettingsModal["Hộp Thoại Cài Đặt & Trợ Giúp\n(.mg-modal, .mg-setting, .mg-switch)"]
        end
        
        VDOM["Virtual DOM Builder & Viewport Helpers\n(MG.ui.el, h, el, Focus Trap, Toast)"]
        EventHandlers["Bộ Xử Lý Sự Kiện Tương Tác\n(Click, Input, Pointer Pan/Zoom, Keydown)"]
    end

    subgraph BE["BACKEND (Logic Engines & Local Data Store)"]
        direction TB
        
        subgraph BE_Engines["Các Engine Nghiệp Vụ Cốt Lõi (Business Engines)"]
            GameEngine["Quiz Game Engine\n(MG.engine: createGame, Step Scheduler, Session State)"]
            QuizEvaluator["Bộ Chấm Điểm & Kiểm Tra Đáp Án\n(Answer Normalizer, Alias Matcher, Reveal Penalizer)"]
            MasteryCalc["Bộ Tính Toán Thuần Thục & Thống Kê\n(Exponential Moving Average, Streak Tracker)"]
            ATPEngine["ATP Stoichiometry & Ledger Engine\n(MG.atp: Modern vs Classic, P/O Ratio, Net Yield)"]
            DrawEngine["Chemical Graph & Structure Validator\n(MG.draw, MG.geometry: Valence, Atom/Bond Matrix)"]
            AudioSynth["Web Audio Synthesizer\n(MG.sound: Polyphonic Synthesis, Chords, Frequencies)"]
        end

        subgraph BE_Data["Kho Tri Thức Sinh Hóa (Biochemical Knowledgebase)"]
            PathwaysDB["Dữ Liệu Con Đường Chuyển Hóa\n(MG.pathways: 22+ Pathways, Steps, Coordinates)"]
            EntitiesDB["Từ Điển Phân Tử & Enzyme\n(MG.entities: Metabolites, EC Classes, Formulas)"]
            ScenariosDB["Kịch Bản Năng Lượng & Mini-Games\n(MG.courses, MG.categories, SCENARIOS, Comparisons)"]
        end

        subgraph BE_Storage["Bộ Nhớ Lưu Trữ Cục Bộ (State Persistence)"]
            StoreManager["Store Manager\n(MG.store: getSettings, setSettings, record, reset)"]
            LocalStorage["Browser Web Storage\n('mg.v1': Settings, Mastery, Progress, History)"]
            ATPStorage["ATP Storage Cache\n('mg.atp.v1': Best scores, Preferences)"]
        end
    end

    %% Tương tác giữa FE và BE
    EventHandlers -->|"Kích hoạt Action / Nộp bài"| GameEngine
    EventHandlers -->|"Tính toán năng lượng"| ATPEngine
    EventHandlers -->|"Kiểm tra công thức vẽ"| DrawEngine
    EventHandlers -->|"Lưu cấu hình / Reset tiến độ"| StoreManager
    
    GameEngine -->|"Truy vấn cấu trúc bước"| PathwaysDB
    GameEngine -->|"Tra cứu chi tiết chất"| EntitiesDB
    GameEngine -->|"Chấm đáp án"| QuizEvaluator
    QuizEvaluator -->|"Cập nhật điểm & độ thuần thục"| MasteryCalc
    QuizEvaluator -->|"Phát âm thanh phản hồi"| AudioSynth
    MasteryCalc -->|"Lưu kết quả học tập"| StoreManager
    
    StoreManager <-->|"Đọc / Ghi cấu hình & điểm"| LocalStorage
    ATPEngine <-->|"Đọc / Ghi kỷ lục ATP"| ATPStorage
    
    GameEngine -->|"Cập nhật trạng thái lượt chơi"| VDOM
    VDOM -->|"Render DOM & SVG Nodes"| FE_Screens
    UI_Shell -->|"Điều hướng chuyển màn hình"| FE_Screens
```

---

## 2. Luồng Khởi Động & Nạp Trạng Thái (Bootstrap & Hydration Flow)

Sơ đồ trình tự quá trình tải trang ban đầu, đọc cấu hình từ `localStorage` và hiển thị màn hình chính không gây chớp nháy giao diện (FOUC).

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant HTML as Trình duyệt (HTML Document)
    participant PreScript as Pre-paint Inline Script
    participant Store as MG.store (BE)
    participant Storage as localStorage ['mg.v1']
    participant App as MG.app (FE Router)
    participant DOM as Virtual DOM & UI View

    User->>HTML: Truy cập trang pathway_quiz.html
    HTML->>PreScript: Thực thi script đồng bộ trước khi render (Head)
    PreScript->>Storage: Đọc 'mg.v1' kiểm tra theme lưu trữ
    alt Có theme 'dark' hoặc hệ thống 'prefers-color-scheme: dark'
        PreScript-->>HTML: Gán html[data-theme='dark'] & meta[theme-color]
    else Mặc định light
        PreScript-->>HTML: Gán html[data-theme='light']
    end
    HTML->>DOM: Parse body & tạo mount point #app
    HTML->>App: Khởi chạy MG.app.start()
    App->>Store: getSettings(), persists()
    Store->>Storage: Lấy cấu hình (Theme, Cofactors, Sound, Last Pathway/Mode)
    Storage-->>Store: Trả về JSON cấu hình người dùng
    Store-->>App: Trả về object Settings
    App->>Store: masteryAll() (Lấy tiến độ thuần thục các con đường)
    Store->>Storage: Đọc mastery map
    Storage-->>Store: Trả về điểm % từng bước
    Store-->>App: Trả về bảng mastery
    App->>DOM: Render Menu View (.mg-menu)
    DOM->>DOM: Hiển thị nhóm con đường, chế độ, chip tóm tắt & nút Bắt đầu Quiz
    DOM-->>User: Giao diện sẵn sàng tương tác (< 50ms)
```

---

## 3. Luồng Chơi Quiz Cốt Lõi (Core Quiz Gameplay Loop)

Chi tiết tương tác 3 chế độ (**Xây dựng / Điền vào bản đồ / Điền vào chỗ trống**), xử lý logic Gợi ý (Hint), Tiết lộ (Reveal) và Chấm đáp án.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as Màn hình Quiz (FE)
    participant Engine as MG.engine & MG.quiz (BE)
    participant Eval as Bộ Chấm & Gợi Ý (BE)
    participant Sound as MG.sound (Audio Synth)
    participant Store as MG.store (Persistence)

    User->>UI: Chọn Pathway, Mode (Build/Pick/Type) & bấm "Bắt đầu Quiz"
    UI->>Engine: startQuiz(pathwayId, mode, format, cofactors)
    Engine->>Engine: createGame(): Khởi tạo danh sách bước, shuffle câu hỏi, reset đếm wrong
    Engine->>UI: Render Quiz Screen (Header, SVG Canvas, Question Card, Chooser/Input)
    
    loop Vòng lặp từng câu hỏi cho đến khi hoàn thành
        Engine->>UI: Hiển thị câu hỏi hiện tại (Highlight ô khuyết '?')
        
        alt Trường hợp 1: Người dùng yêu cầu Gợi ý (Hint)
            User->>UI: Bấm nút "Gợi ý" (.mgq-hint-btn)
            UI->>Eval: getHint(step, level)
            Eval-->>UI: Trả về manh mối theo bậc (Loại chất / Công thức / Loại bỏ phương án sai)
            UI-->>User: Hiển thị dòng gợi ý trên panel (.mgq-hints)
        
        else Trường hợp 2: Người dùng yêu cầu Tiết lộ (Reveal)
            User->>UI: Bấm nút "Tiết lộ" (.mgq-reveal-btn)
            UI->>Eval: revealAnswer(step)
            Eval->>Engine: Ghi nhận 1 lỗi (wrongCounter++)
            Eval-->>UI: Trả về đáp án đúng & trạng thái 'is-missed'
            UI->>Sound: Phát âm thanh cảnh báo lỗi
            UI-->>User: Đổi viền ô sang màu cam (.is-missed), hiện đáp án & nút "Tiếp"
        
        else Trường hợp 3: Người dùng nộp câu trả lời (Pick / Type)
            alt Chế độ Build hoặc Pick
                User->>UI: Click chọn 1 trong 6 phương án (.mgq-opt / .mgq-chip)
            else Chế độ Type
                User->>UI: Gõ tên chất/enzyme bằng bàn phím & nhấn Enter (.mgq-input)
            end
            
            UI->>Eval: validateAnswer(input, targetStep)
            alt Đáp án ĐÚNG
                Eval->>Sound: synthesize(NOTE.C6, NOTE.G6) (Âm sắc du dương)
                Eval->>Engine: Đánh dấu bước đã giải (step.solved = true)
                Eval->>Store: record(pathwayId, stepId, 'right')
                UI->>UI: Đổi màu node sang xanh lá (.is-correct / .is-known)
                UI->>UI: Cập nhật thanh tiến trình (.mgq-bar)
                UI->>Engine: Chuyển sang bước tiếp theo (sau 700ms)
            else Đáp án SAI
                Eval->>Sound: synthesize(NOTE.wrong) (Âm sắc cảnh báo)
                Eval->>Engine: wrongCounter++
                Eval->>Store: record(pathwayId, stepId, 'wrong')
                UI->>UI: Kích hoạt animation rung lắc (.shake)
                UI->>UI: Đổi màu cảnh báo đỏ (.is-wrong / .mg-error-bg)
                UI->>UI: Loại trừ phương án sai (.is-eliminated) hoặc báo lỗi chính tả
                UI-->>User: Cho phép chọn/gõ lại
            end
        end
    end

    Engine->>Store: saveMastery(pathwayId, summaryStats)
    Store->>Store: Tính tỷ lệ hoàn thành & độ thuần thục mới (%)
    Engine->>UI: Chuyển sang Màn hình Kết Quả (.mg-results)
    UI-->>User: Hiển thị bảng tổng kết điểm, thời gian, số lỗi, huy hiệu & nút ôn tập
```

---

## 4. Luồng Nghiệp Vụ Các Tiện Ích Phụ (ATP Calculator, Drawer & Comparisons)

```mermaid
flowchart TD
    subgraph UserActions["Thao tác người dùng (User Actions)"]
        A1["Mở ATP Calculator"]
        A2["Mở Bàn Vẽ Cấu Trúc (Draw)"]
        A3["Mở Mini-Games So Sánh/Cơ Chế"]
        A4["Mở Cài Đặt (Settings)"]
    end

    subgraph FE_Handling["Điều Phối Giao Diện (FE Presentation)"]
        B1["MG.app.showAtp()\nRender .mg-atp-menu"]
        B2["MG.app.showDraw()\nRender .mg-dw-editor"]
        B3["MG.app.showGames()\nRender .mg-gm-figures"]
        B4["MG.app.openSettings()\nRender .mg-modal dialog"]
    end

    subgraph BE_Processing["Xử Lý Nghiệp Vụ Cục Bộ (BE Processing)"]
        C1{"Chọn kịch bản &\nQuy ước tính toán"}
        C1_Mod["Quy ước Hiện đại\n(1 NADH = 2.5 ATP, 1 FADH2 = 1.5 ATP)"]
        C1_Cla["Quy ước Cổ điển\n(1 NADH = 3 ATP, 1 FADH2 = 2 ATP)"]
        C1_Calc["MG.atp.calculateNetYield()\nCân bằng phương trình phân rã"]

        C2{"Thao tác vẽ hóa học"}
        C2_Tool["Chọn công cụ: C, H, O, N, P, S\nhoặc liên kết đơn/đôi/thơm"]
        C2_Eval["MG.draw.validateStructure()\nSo khớp ma trận liên kết & hóa trị"]

        C3{"Chế độ Mini-Games"}
        C3_Cmp["So sánh cặp enzyme (cmp-*)\nĐối chiếu Km, vị trí, cơ quan"]
        C3_Mech["Cơ chế phản ứng (mech-*)\nVẽ mũi tên tấn công ái nhân"]

        C4{"Thay đổi thiết lập"}
        C4_Theme["Đổi Theme Light / Dark"]
        C4_Cof["Bật / Tắt hỏi Cofactors"]
        C4_Snd["Bật / Tắt âm thanh Web Audio"]
        C4_Reset["Xóa toàn bộ lịch sử học tập"]
    end

    subgraph PersistenceLayer["Lưu Trữ Bền Vững (Local Storage)"]
        D1[("localStorage ['mg.atp.v1']\nLưu điểm kỷ lục")]
        D2[("localStorage ['mg.v1']\nCập nhật settings & mastery")]
    end

    %% Rẽ nhánh luồng
    A1 --> B1 --> C1
    C1 -->|"Chọn Hiện đại"| C1_Mod --> C1_Calc
    C1 -->|"Chọn Cổ điển"| C1_Cla --> C1_Calc
    C1_Calc -->|"Hiển thị phương trình & tổng ATP"| B1
    C1_Calc --> D1

    A2 --> B2 --> C2
    C2 --> C2_Tool --> C2_Eval
    C2_Eval -->|"Phản hồi đúng/sai cấu trúc"| B2

    A3 --> B3 --> C3
    C3 -->|"Chọn bài so sánh"| C3_Cmp
    C3 -->|"Chọn bài cơ chế"| C3_Mech
    C3_Cmp & C3_Mech -->|"Chấm điểm & giải thích why"| B3
    C3_Cmp & C3_Mech --> D2

    A4 --> B4 --> C4
    C4 --> C4_Theme -->|"Gán html[data-theme]"| D2
    C4 --> C4_Cof --> D2
    C4 --> C4_Snd --> D2
    C4 --> C4_Reset -->|"MG.store.reset()"| D2
```

---

## 5. Máy Trạng Thái Của Ứng Dụng (Application State Machine)

Sơ đồ trạng thái mô tả vòng đời của màn hình SPA và các chuyển dịch trạng thái (`data-screen` & `data-mode`).

```mermaid
stateDiagram-v2
    [*] --> Screen_Select: Tải trang & Khởi động (MG.app.start)
    
    state Screen_Select {
        [*] --> Browsing_Menu
        Browsing_Menu --> Selecting_Pathway: Chọn con đường chuyển hóa
        Selecting_Pathway --> Selecting_Mode: Chọn Xây dựng / Điền bản đồ / Điền chỗ trống
        Selecting_Mode --> Browsing_Menu: Xem tóm tắt & lưới phản ứng
    }

    Screen_Select --> Screen_Quiz: Click "Bắt đầu Quiz" (data-key="start")
    
    state Screen_Quiz {
        [*] --> Question_Active: Sinh bước phản ứng mục tiêu
        Question_Active --> Waiting_Answer: Chờ thao tác người dùng
        Waiting_Answer --> Showing_Hint: Click "Gợi ý" (Hiển thị manh mối)
        Showing_Hint --> Waiting_Answer
        Waiting_Answer --> Showing_Reveal: Click "Tiết lộ" (Tính 1 lỗi, mở đáp án)
        Waiting_Answer --> Validating_Answer: Nộp lựa chọn / Gõ phím
        Validating_Answer --> Answer_Wrong: Sai (Rung lắc, cảnh báo, trừ điểm)
        Answer_Wrong --> Waiting_Answer: Thử lại
        Validating_Answer --> Answer_Correct: Đúng (Âm thanh thành công, đổi màu xanh)
        Showing_Reveal --> Step_Transition: Click "Tiếp"
        Answer_Correct --> Step_Transition: Trễ 700ms
        Step_Transition --> Question_Active: Còn ô trống tiếp theo
        Step_Transition --> [*]: Đã điền hết tất cả các ô
    }

    Screen_Quiz --> Screen_Results: Hoàn thành toàn bộ các bước
    Screen_Quiz --> Screen_Select: Click nút Quay lại (.mgq-back)
    
    state Screen_Results {
        [*] --> Viewing_Stats: Xem % chính xác, thời gian, số lỗi
        Viewing_Stats --> Retrying_Quiz: Click "Chơi lại"
        Viewing_Stats --> Practicing_Weak: Click "Luyện bước yếu"
    }
    
    Retrying_Quiz --> Screen_Quiz
    Practicing_Weak --> Screen_Quiz
    Screen_Results --> Screen_Select: Click "Về menu chính"

    Screen_Select --> Screen_ATP: Click "ATP Calculator"
    Screen_ATP --> Screen_Select: Click nút Back
    
    Screen_Select --> Screen_Draw: Click "Vẽ phân tử"
    Screen_Draw --> Screen_Select: Click nút Back

    Screen_Select --> Screen_Games: Click "So sánh & Cơ chế"
    Screen_Games --> Screen_Select: Click nút Back

    Screen_Select --> Modal_Settings: Click icon ⚙ (Settings)
    Modal_Settings --> Screen_Select: Bấm phím Escape hoặc nút Đóng
```

---

## 6. Hợp Đồng Trao Đổi Dữ Liệu FE ↔ BE (Interface Contract)

| Tên Dịch Vụ / Module BE | Đầu Vào từ FE (Parameters) | Xử Lý Nghiệp Vụ (BE Responsibility) | Kết Quả Trả Về cho FE (Output / UI Effects) |
| :--- | :--- | :--- | :--- |
| `MG.app.startQuiz()` | `pathwayId`, `mode`, `format`, `cofactors` | Lấy dữ liệu phản ứng từ `MG.pathways`, lập lịch thứ tự bước, khởi tạo trạng thái game. | Kích hoạt `data-screen="play"`, mount bản đồ SVG và thanh câu hỏi. |
| `MG.engine.createGame()` | `steps`, `excluded`, `cofactors` | Lọc các bước bị loại trừ, tính toán số ô khuyết, gắn cờ cho từng chất. | Đối tượng phiên chơi (`game instance`) kèm các hàm điều khiển `step()`, `check()`, `reveal()`. |
| `MG.quiz.mount()` | `container`, `game`, `pathway` | Tạo Virtual DOM cho thẻ câu hỏi, lưới ô chọn, lắng nghe bàn phím và con trỏ. | DOM nodes được mount vào `#app`, khởi động timer và thanh tiến trình. |
| `MG.store.record()` | `pathwayId`, `stepId`, `'right'\|'wrong'` | Cập nhật bộ đếm thành công/thất bại, tính toán lại tỷ lệ thuần thục (Mastery %). | Lưu trữ trực tiếp vào `localStorage['mg.v1']`; cập nhật badge % trên thẻ menu. |
| `MG.store.setSettings()`| `{ theme, sound, cofactors, ... }` | Ghi đè thuộc tính cấu hình, đảm bảo tính toàn vẹn schema JSON. | Áp dụng tức thì biến CSS `[data-theme]`, cập nhật nhãn nút công tắc. |
| `MG.sound.play()` | `frequency`, `duration`, `chord` | Khởi tạo AudioContext, tổng hợp sóng âm dạng sin, làm mượt âm vực với bộ lọc low-pass. | Phát âm thanh phản hồi ra loa ngoài không làm nghẽn UI thread. |
| `MG.atp.calculate()` | `scenario`, `convention`, `shuttle` | Hạch toán số mol ATP từ quá trình đường phân, oxy hóa pyruvate, chu trình TCA và chuỗi chuyền điện tử. | Trả về tổng ATP thực nhận và công thức toán học phân rã từng bước. |
| `MG.chart.buildSvg()` | `pathway`, `mode`, `viewBox` | Tính toán tọa độ vector, đường bao màng sinh học, định tuyến mũi tên phản ứng và gắn chip cofactor. | Cây thẻ `<svg>` nhúng vào `.mgc-host`, kích hoạt tính năng kéo trượt (Pan) và phóng to (Zoom). |

---

*Tài liệu này là đặc tả chuẩn hóa kiến trúc luồng dữ liệu cho toàn bộ dự án Biochemical Pathways Game.*
