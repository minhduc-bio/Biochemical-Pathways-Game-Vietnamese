# Đặc Tả Thuộc Tính Hệ Thống UI Components (Biochemical Pathways Game)

Tài liệu này tổng hợp và khai báo toàn bộ các thuộc tính, trạng thái, thẻ DOM, lớp CSS (theo chuẩn BEM), Design Tokens, Data Attributes, ARIA Accessibility và cơ chế xử lý sự kiện của tất cả các UI Components trong dự án **Biochemical Pathways Game** (`pathway_quiz.html`).

---

## 1. Kiến Trúc Giao Diện Tổng Thể (UI Architecture)

- **Mô hình triển khai:** Single Page Application (SPA), Pure HTML5 / CSS3 / Vanilla JavaScript (chuẩn ES5/ES6, zero external dependencies).
- **Cơ chế Virtual DOM / Helper:** Khởi tạo phần tử giao diện qua hàm `el(tag, attrs, ...children)` và `h(tag, attrs, ...children)` (`MG.ui.el`).
- **Hệ thống tiền tố BEM:**
  - `mg-*`: Main Game — Khung shell, bố cục chung, menu, modal, settings, các primitive controls.
  - `mgq-*`: Quiz Engine — Các thành phần câu hỏi, ô khuyết, chooser popup, thanh tiến trình, feedback.
  - `mgc-*`: Metabolic Chart Canvas — SVG Node, mũi tên phản ứng, chip cofactors, màng sinh học, điều khiển pan/zoom.
  - `mg-atp-*`: ATP Calculator & Ledger — Bộ tính toán và sổ cái cân bằng năng lượng ATP/NADH.
  - `mg-dw-*`: Molecule Drawer — Công cụ vẽ cấu trúc hóa học, bảng chọn liên kết và nguyên tử.
  - `mg-gm-*`: Comparison & Mechanism — Giao diện so sánh hai enzyme/phân tử và cơ chế phản ứng từng bước.
  - `is-*`: State Modifiers — Các lớp thể hiện trạng thái động (`is-active`, `is-correct`, `is-wrong`,...).

---

## 2. Hệ Thống Design Tokens (CSS Custom Properties)

Tất cả các biến CSS được khai báo tại `:root` và tự động ghi đè qua `[data-theme="dark"]`.

### 2.0 Thang Phân Cấp Viền & Bóng Đổ (Border & Shadow Hierarchy - Refactored Phase 1)

| Biến CSS | Giá trị mặc định | Phân cấp & Mục đích áp dụng |
| :--- | :--- | :--- |
| `--mg-border-strong` | `3px` | Cấp 1: Nút hành động chính (`Start Quiz`), Thẻ câu hỏi active |
| `--mg-border-mid` | `2px` | Cấp 2: Các phần tử bấm được (Buttons, Active ptile, Chooser options) |
| `--mg-border-thin` | `1px` | Cấp 3: Thành phần thụ động (Cards, Panels, Inactive ptiles, Dividers) |
| `--mg-hairline` | `rgba(20, 20, 20, 0.14)` | Đường ngăn cách cực mảnh |
| `--mg-shadow-strong` | `3px 4px 0 var(--mg-shadow-color)` | Bóng đổ đậm duy nhất cho nút Start Quiz và Active question |
| `--mg-shadow-soft` | `1px 2px 0 var(--mg-shadow-color)` | Bóng đổ nhẹ cho active card |
| `--mg-shadow-none` | `none` | Triệt tiêu bóng đổ cho các nút/card thông thường để chống quá tải thị giác |
| `--mg-border` | `var(--mg-border-mid)` | *(Alias tương thích ngược)* Trỏ về 2px |
| `--mg-shadow` | `var(--mg-shadow-none)` | *(Alias tương thích ngược)* Mặc định phẳng |
| `--mg-shadow-sm` | `var(--mg-shadow-none)` | *(Alias tương thích ngược)* Mặc định phẳng |
| `--mg-radius-lg` | `14px` | Bo góc modal và container lớn |
| `--mg-radius-md` | `10px` | Bo góc card và panels |
| `--mg-radius-sm` | `6px` | Bo góc nút bấm, chips, tiles |
| `--mg-radius` | `var(--mg-radius-md)` | *(Alias tương thích ngược)* 10px |

### 2.1 Bảng màu cốt lõi & Bề mặt (Core Surfaces & Typography)

| Biến CSS | Giá trị Light Theme (`:root`) | Giá trị Dark Theme (`[data-theme="dark"]`) | Mục đích áp dụng |
| :--- | :--- | :--- | :--- |
| `--mg-bg` | `#FBF8EA` | `#282A36` | Màu nền trang chính |
| `--mg-ink` | `#141414` | `#F4F4F0` | Màu chữ chính (độ tương phản cao) |
| `--mg-ink-soft` | `#55554C` | `#B3B9D2` | Màu chữ phụ, subtitle, gợi ý |
| `--mg-line` | `#141414` | `#6272A4` | Viền khung, đường liên kết, trục phản ứng |
| `--mg-panel` | `#EBE9DC` | `#21222C` | Màu nền sidebar, panel điều khiển |
| `--mg-surface` | `#FFFFFF` | `#343746` | Nền thẻ (card), hộp thoại modal |
| `--mg-surface-alpha`| `rgba(255, 255, 255, 0.8)` | `rgba(52, 55, 70, 0.88)` | Bề mặt bán trong suốt |
| `--mg-paper` | `#FFFFFF` | `#282A36` | Nền trang vẽ / khung sơ đồ |
| `--mg-chartpaper` | `rgba(255, 255, 255, 0.72)` | `#21222C` | Nền canvas bản đồ chuyển hóa |
| `--mg-hairline` | `rgba(20, 20, 20, 0.12)` | `rgba(244, 244, 240, 0.12)` | Đường phân cách mảnh giữa các hàng |
| `--mg-scrim` | `rgba(20, 20, 20, 0.28)` | `rgba(25, 26, 33, 0.7)` | Lớp phủ mờ nền khi bật modal |
| `--mg-placeholder` | `#9A998E` | `#8A91B4` | Màu chữ placeholder cho ô nhập liệu |

### 2.2 Trạng thái tương tác & Quiz Feedback

| Biến CSS | Giá trị Light Theme | Giá trị Dark Theme | Mục đích áp dụng |
| :--- | :--- | :--- | :--- |
| `--mg-question` | `#FFF3B8` | `#464263` | Màu nền nổi bật của ô đang hỏi (Active Question) |
| `--mg-option` | `#EEF9E9` | `#384670` | Màu nền nút lựa chọn |
| `--mg-option-hover`| `#E1F5D4` | `#435385` | Hover vào nút lựa chọn |
| `--mg-start` | `#CDF3B0` | `#535CA8` | Nút hành động chính (Start / Play) |
| `--mg-start-hover` | `#B9EB94` | `#5E67B4` | Hover nút hành động chính |
| `--mg-correct` | `#8FF06B` | `#67E789` | Trạng thái trả lời đúng |
| `--mg-wrong` | `#F97B6B` | `#F0788C` | Trạng thái trả lời sai |
| `--mg-missed-line` | `#9A3300` | `#FFA877` | Viền hiển thị các bước làm hỏng/bỏ lỡ |
| `--mg-missed-fill` | `#9A3300` | `#B5532A` | Nền highlight bước làm hỏng |
| `--mg-error-bg` | `#FFF0EC` | `#52323C` | Nền thông báo lỗi |
| `--mg-error-ink` | `#7A1F10` | `#FFB8C6` | Chữ thông báo lỗi |

### 2.3 Phân loại sinh học (Biochemical Chips & Cofactors)

| Biến CSS | Giá trị Light Theme | Giá trị Dark Theme | Nhóm phân loại |
| :--- | :--- | :--- | :--- |
| `--mg-chip-adenylate` | `#FFD166` | `#6F4D2A` | Adenylate (ATP, ADP, AMP, cAMP) |
| `--mg-chip-redox` | `#8ED1FC` | `#2D5A6B` | Vận chuyển điện tử (NADH, FADH₂, NADPH) |
| `--mg-chip-carrier` | `#FFB88C` | `#6B3A5B` | Vận chuyển nhóm (CoA, TPP, Lipoamide, Biotin) |
| `--mg-chip-ink` | `#141414` | `#F4F4F0` | Màu chữ trên chip sinh hóa |
| `--mg-map-small` | `#FFFFFF` | `#3E4155` | Phân tử vô cơ nhỏ ($H_2O, CO_2, P_i, PP_i$) |
| `--mg-enzyme-bg` | `#DFF5D8` | `#384670` | Nền hiển thị tên Enzyme |

### 2.4 Kích thước, Bo góc & Bóng đổ (Layout & Metrics)

| Biến CSS | Giá trị | Ý nghĩa |
| :--- | :--- | :--- |
| `--mg-border` | `3px` | Độ dày đường viền mặc định |
| `--mg-radius` | `18px` | Bán kính bo góc card và container |
| `--mg-shadow` | `4px 5px 0 var(--mg-shadow-color)` | Hiệu ứng bóng đổ phẳng cứng (Brutalism/Retro style) |
| `--mg-shadow-sm` | `3px 4px 0 var(--mg-shadow-color)` | Bóng đổ nhỏ cho chip/nút |
| `--mg-tap` | `44px` | Chiều cao tối thiểu vùng chạm (Accessible touch target) |
| `--mg-max` | `1100px` | Độ rộng tối đa của view ứng dụng |
| `--mg-font` | `"Avenir Next", "Nunito", system-ui, sans-serif` | Phông chữ bo tròn dễ đọc |

---

## 3. Danh Mục Chi Tiết Toàn Bộ UI Components

### 3.1 App Shell & Container Layout

#### `#app` (Root Mount Point)
- **Tag:** `<div>`
- **ID:** `app`
- **Mục đích:** Điểm mount duy nhất của toàn bộ cây ứng dụng do Virtual DOM renderer quản lý.

#### `.mg-app` (Main Wrapper)
- **Tag:** `<main>` hoặc `<div>`
- **Classes:** `mg-app`
- **Data Attributes:**
  - `data-screen`: `"menu"` | `"play"` | `"atp"` | `"draw"` | `"games"` | `"results"`
  - `data-theme`: `"light"` | `"dark"`
- **Thuộc tính & CSS:**
  - `min-height: 100vh`, `display: flex`, `flex-direction: column`, `align-items: center`

#### `.mg-screen` (Screen Viewport)
- **Tag:** `<section>`
- **Classes:** `mg-screen`, `mg-screen--atp`, `mg-screen--draw`, `mg-screen--games`, `mg-screen--quiz`
- **State Modifiers:** `is-entering`, `is-leaving`
- **Mục đích:** Đóng gói view cho từng màn hình chơi hoặc tiện ích.

#### `.mg-lock` (Scroll Locker)
- **Áp dụng lên:** `document.documentElement` (`<html>`)
- **Mục đích:** Khóa cuộn trang khi modal/dialog đang mở (`overflow: hidden`).

---

### 3.2 Menu & Course Catalog Components

#### `.mg-menu` (Home Hub)
- **Tag:** `<section>`
- **Classes:** `mg-menu`
- **Cấu trúc con:**
  - `.mg-brand`: Khối logo & tiêu đề.
    - `.mg-brand__mascot`: Hình linh vật SVG/ảnh.
    - `.mg-brand__title`: Tiêu đề chính "Pathway Quiz".
    - `.mg-brand__sr`: Nhãn trợ năng cho Screen Reader.
  - `.mg-section` / `.mg-category`: Từng nhóm con đường (Carbohydrates, TCA, Lipids, Amino acids, Mitochondrial, Advanced).
  - `.mg-advanced`: Khối mở rộng con đường nâng cao (Photosynthesis, Cell Signaling, Nucleotides).
    - `.mg-advanced__text`: Nhãn mô tả tính năng.

#### `.mg-card` / `.mg-course` (Pathway Selection Card)
- **Tag:** `<div>` hoặc `<button>`
- **Classes:** `mg-card`, `mg-course`, `mg-card--option`, `mg-card--question`
- **Data Attributes:**
  - `data-key`: `"course:<courseId>"` | `"pathway:<pathwayId>"`
- **Thuộc tính ARIA:**
  - `role="button"`, `tabindex="0"`, `aria-label="<Pathway Name>"`
- **Cấu trúc nội dung:**
  - `.mg-card__tag`: Nhãn viết tắt (e.g. "GLY", "TCA", "ETC").
  - `.mg-card__title`: Tên chính thức con đường.
  - `.mg-card__sub`: Mô tả tóm tắt quá trình (e.g. "Glucose to pyruvate").
  - `.mg-mastery` / `.mg-badge`: Vòng tròn hiển thị mức độ thuần thục (%) hoặc số bước hoàn thành.

---

### 3.3 Quiz Engine Components (`mgq-*`)

#### `.mgq-bar` & `.mgq-head` (Quiz Header Bar)
- **Tag:** `<header>`
- **Classes:** `mgq-bar`, `mgq-head`
- **Thuộc tính & Thành phần:**
  - `.mgq-back`: Nút quay về menu (`aria-label="Back to menu"`).
  - `.mgq-head__context`: Hiển thị tên con đường đang thi.
  - `.mgq-score`: Bộ đếm điểm đúng/sai trực tiếp.

#### `.mgq-banner` (Prompt / Guidance Box)
- **Tag:** `<div>`
- **Classes:** `mgq-banner`, `mgq-banner--top`
- **Thành phần:**
  - `.mgq-banner__mascot`: Icon minh họa cảm xúc mascot (thành công, gợi ý, cảnh báo).
  - `.mgq-banner__title`: Câu hỏi hiện tại (ví dụ: *"What molecule comes next?"*).
  - `.mgq-banner__lead`: Gợi ý bổ sung hoặc điều kiện phản ứng.
  - `.mgq-banner__why`: Giải thích cơ chế sau khi người dùng trả lời sai.
  - `.mgq-banner__go`: Nút tiếp tục sang bước kế tiếp.

#### `.mgq-box` (Target Step Container)
- **Tag:** `<div>`
- **Classes:** `mgq-box`
- **Modifiers:**
  - `.mgq-box--unknown`: Ô khuyết cần điền.
  - `.is-asked`: Ô đang là mục tiêu câu hỏi hiện tại.
  - `.is-known`: Ô đã được giải đúng.
  - `.is-missed`: Ô làm sai (hiển thị viền `--mg-missed-line`).
  - `.is-correct`: Ô hiển thị kết quả đúng (`--mg-correct`).
- **Data Attributes:**
  - `data-step`: Mã định danh bước (e.g. `"hk"`, `"pfk"`, `"cs"`).
  - `data-slot`: Loại thành phần (`"substrate"` | `"product"` | `"enzyme"` | `"cofactor"`).
- **Events:**
  - `click`: Mở bảng chọn chooser cho ô đó (khi ở chế độ Fill the Map).

#### `.mgq-chooser` (Option Chooser Bottom Sheet / Popover)
- **Tag:** `<div>`
- **Classes:** `mgq-chooser`, `mgq-chooser--pop`, `mgq-chooser--sheet`
- **Thuộc tính ARIA:**
  - `role="dialog"`, `aria-modal="true"`, `aria-label="Select answer"`
- **Cấu trúc:**
  - `.mgq-chooser__head`: Tiêu đề bảng chọn & gợi ý họ enzyme/nhóm phân tử.
  - `.mgq-chooser__body`: Lưới 6 lựa chọn (`.mgq-chooser__grid`).
  - `.mgq-chooser__foot`: Nút Close / Reveal answer.

#### `.mgq-chip` (Answer Choice Chip)
- **Tag:** `<button>`
- **Classes:** `mgq-chip`
- **Modifiers:**
  - `.mgq-chip--unknown`: Chip dạng dấu hỏi.
  - `.is-selected`: Đang được chọn.
  - `.is-eliminated`: Bị loại bỏ sau khi chọn sai.
  - `.is-correct`: Lựa chọn chính xác.
- **Data Attributes:**
  - `data-id`: ID phân tử hoặc enzyme (e.g. `"g6p"`, `"hexokinase"`).
  - `data-family`: Nhóm sinh hóa (e.g. `"sugar"`, `"kinase"`).
- **Events:**
  - `click`: Xác nhận câu trả lời.

#### `.mgq-input` (Text Input Field - Type Mode)
- **Tag:** `<input>`
- **Classes:** `mgq-input`
- **Thuộc tính HTML:**
  - `type="text"`, `autocapitalize="none"`, `autocomplete="off"`, `spellcheck="false"`
- **Modifiers:**
  - `.is-error`: Báo lỗi gõ sai chính tả hoặc sai tên.
- **Events:**
  - `input`: Lọc autocomplete danh sách gợi ý.
  - `keydown`: Bắt phím `Enter` nộp bài, `ArrowUp`/`ArrowDown` duyệt gợi ý, `Escape` đóng.

#### `.mgq-hints` (Hint / Action Bar)
- **Tag:** `<div>`
- **Classes:** `mgq-hints`, `mgq-hints__bar`, `mgq-hints--bare`
- **Nút bấm:**
  - Hint button: Hiện gợi ý từng mức (`data-key="hint"`).
  - Reveal button: Bật đáp án và ghi nhận là 1 lỗi sai (`data-key="reveal"`).
  - Weak Step Practice button: Ôn tập riêng các bước đã sai.

---

### 3.4 Interactive Metabolic Chart Canvas (`mgc-*`)

Toàn bộ bản đồ con đường chuyển hóa được render bằng SVG tương tác hỗ trợ kéo-thả (pan) và phóng to/thu nhỏ (zoom).

#### `.mgc-host` (SVG Canvas Viewport)
- **Tag:** `<svg>` hoặc `<div class="mgc-host">`
- **Thuộc tính viewBox:** Điều chỉnh tỷ lệ kích thước bản đồ tự động.
- **Events:**
  - `pointerdown`, `pointermove`, `pointerup`, `pointercancel`: Xử lý kéo trượt bản đồ (Pan gesture).
  - `wheel`: Xử lý cuộn phóng to / thu nhỏ (Zoom gesture).
  - `dblclick`: Reset góc nhìn bản đồ về mặc định.

#### `.mgc-controls` (Floating Viewport Controls)
- **Tag:** `<div>`
- **Classes:** `mgc-controls`, `mgc-controls--narrow`
- **Thành phần nút (`.mgc-btn`):**
  - Zoom In (`+`): Tăng tỷ lệ zoom.
  - Zoom Out (`-`): Giảm tỷ lệ zoom.
  - Reset View: Căn chỉnh bản đồ vào giữa màn hình.

#### `.mgc-node` (Reaction Metabolite / Enzyme Node)
- **Tag:** `<g>` (SVG Group)
- **Classes:** `mgc-node`, `mgc-clickable`
- **Cấu trúc con:**
  - `.mgc-node-shadow`: Lớp đổ bóng giả lập 3D phẳng của node SVG.
  - `.mgc-node-body`: Hình chữ nhật bo góc (`<rect>`) làm nền node.
  - `.mgc-node-name`: Tên đầy đủ của chất (`<text>`).
  - `.mgc-node-short`: Tên viết tắt hiển thị lớn (`<text>`).
  - `.mgc-node-q`: Ký hiệu dấu `?` hiển thị khi ở chế độ câu hỏi.
- **Data Attributes:**
  - `data-id`: Mã phân tử (e.g. `"citrate"`, `"oaa"`, `"pep"`).
  - `data-state`: `"active"` | `"known"` | `"unknown"` | `"missed"`
- **Events:**
  - `click`: Mở thẻ thông tin chi tiết cấu trúc phân tử (`openDetail('molecule', id)`).

#### `.mgc-arrow` & `.mgc-conn` (Reaction Vectors & Pathways)
- **Tag:** `<path>` hoặc `<line>`
- **Classes:** `mgc-arrow-line`, `mgc-arrow-head`, `mgc-conn-line`, `mgc-conn-head`, `mgc-arrow--link`
- **Thuộc tính:**
  - `stroke: var(--mg-line)`
  - `stroke-width: 3`
  - `marker-end`: Đầu mũi tên chỉ hướng phản ứng thuận/nghịch.

#### `.mgc-chip` (Cofactor Chips on Pathways)
- **Tag:** `<g>`
- **Classes:** `mgc-chip-body`, `mgc-chip-hint`, `mgc-chip-text`
- **Mục đích:** Gắn nhãn các đồng yếu tố đi vào / đi ra khỏi phản ứng ($ATP \rightarrow ADP + P_i$).

#### `.mgc-membrane` (Biological Membrane Separator)
- **Tag:** `<rect>` hoặc `<path>`
- **Classes:** `mgc-membrane`
- **Mục đích:** Thể hiện ranh giới màng ty thể / bào tương (Mitochondrial inner membrane, intermembrane space, cytosol).

---

### 3.5 ATP Calculator & Ledger Subsystem (`mg-atp-*`)

Công cụ tính toán năng lượng ATP và hạch toán số phân tử chất mang điện tử ($NADH, FADH_2$).

#### `.mg-atp-menu` & `.mg-atp-head`
- **Tag:** `<section>`, `<header>`
- **Classes:** `mg-atp-menu`, `mg-atp-head`
- **Thành phần:**
  - `.mg-atp-back`: Nút quay lại menu chính.
  - `.mg-atp-seg`: Cụm nút gạt (Segmented buttons) chọn quy ước tính:
    - Modern convention ($1\ NADH = 2.5\ ATP$, $1\ FADH_2 = 1.5\ ATP$).
    - Classic convention ($1\ NADH = 3\ ATP$, $1\ FADH_2 = 2\ ATP$).
    - Chế độ Guided vs Recall.

#### `.mg-atp-dock` & `.mg-atp-count` (Ledger Counter)
- **Tag:** `<div>`
- **Classes:** `mg-atp-dock`, `mg-atp-count`, `mg-atp-area-count`
- **Mục đích:** Hiển thị tổng số lượng ATP thực nhận / tiêu tốn theo thời gian thực.

#### `.mg-atp-ex` & `.mg-atp-ex-math` (Stoichiometry Breakdown)
- **Tag:** `<div>`
- **Classes:** `mg-atp-ex`, `mg-atp-ex-step`, `mg-atp-ex-math`, `mg-atp-ex-math__line`
- **Mục đích:** Khối hiển thị phương trình phân rã từng bước và giải thích công thức năng lượng.

---

### 3.6 Molecule Drawer & Structural Editor (`mg-dw-*`)

Công cụ luyện vẽ hoặc nhận diện cấu trúc hóa học của các chất trung gian.

#### `.mg-dw-editor` & `.mg-dw-figure`
- **Tag:** `<div>`, `<svg>`
- **Classes:** `mg-dw-editor`, `mg-dw-figure`, `mg-dw-art`
- **Mục đích:** Bàn vẽ nguyên tử (C, H, O, N, P, S) và các loại liên kết (đơn, đôi, thơm, este, thioester, phosphat).

#### `.mg-dw-choices` & `.mg-dw-key` (Chemical Toolbox)
- **Tag:** `<div>`, `<button>`
- **Classes:** `mg-dw-choices`, `mg-dw-choice`, `mg-dw-key`, `mg-dw-key--wide`
- **Data Attributes:**
  - `data-tool`: Loại công cụ chọn (nguyên tử, loại liên kết, tẩy xoá).
- **Thao tác:**
  - `.mg-dw-clear`: Xóa sạch bàn vẽ để vẽ lại.
  - `.mg-dw-actions`: Thanh nộp bài kiểm tra cấu trúc.

---

### 3.7 Comparison & Biochemical Mechanism Viewers (`mg-gm-*`)

#### `.mg-gm-figures` (Side-by-Side Comparison)
- **Tag:** `<div>`
- **Classes:** `mg-gm-figures`, `mg-gm-figures__item`, `mg-gm-figures__art`
- **Mục đích:** Hiển thị 2 phân tử hoặc 2 enzyme cạnh nhau để so sánh điểm tương đồng và khác biệt (ví dụ: Hexokinase vs Glucokinase).

#### `.mg-gm-fields` & `.mg-gm-field`
- **Tag:** `<div>`
- **Classes:** `mg-gm-fields`, `mg-gm-field`, `mg-gm-field__label`, `mg-gm-field__mark`
- **Mục đích:** Các câu hỏi đối chiếu thuộc tính (Ái lực $K_m$, cơ quan hoạt động, chất ức chế dị lập thể).

---

### 3.8 Modals, Dialogs, Inspector & Settings (`mg-modal`, `mg-setting`)

#### `.mg-modal` (Accessible Modal Dialog Container)
- **Tag:** `<div>`
- **Classes:** `mg-modal`
- **Cấu trúc con:**
  - `.mg-modal__panel`: Hộp nội dung chính.
    - Modifiers: `.mg-modal__panel--wide` (cho thẻ chi tiết lớn).
    - ARIA: `role="dialog"`, `aria-modal="true"`, `tabindex="-1"`.
  - `.mg-modal__close`: Nút đóng icon X (`aria-label="Close"`).
  - `.mg-modal__title`: Tiêu đề dialog (`<h2>`).
- **Xử lý phím:**
  - Bắt phím `Escape`: Đóng modal và trả focus về phần tử kích hoạt trước đó (`returnTo.focus()`).
  - Bắt phím `Tab`: Khóa vòng lặp focus bên trong modal (Focus Trap qua `trapTab()`).

#### `.mg-setting` & `.mg-switch` (Settings Modal)
- **Tag:** `<div class="mg-setting">`
- **Cấu trúc nút chuyển:**
  - `.mg-switch`: Nút bật/tắt (Toggle switch)
  - Thuộc tính ARIA: `role="switch"`, `aria-checked="true|false"`
  - Các tùy chọn chính:
    - **Theme:** Light / Dark / Auto (theo hệ điều hành).
    - **Cofactors Toggle:** Bật/tắt việc hỏi các chất phụ trợ ATP/NADH.
    - **Sound / Animations:** Bật/tắt hiệu ứng chuyển động.

#### `.mg-detail-card` (Molecule & Enzyme Detail Inspector)
- **Tag:** `<div>`
- **Classes:** `mg-detail-card`, `mg-card--option`
- **Cấu trúc nội dung:**
  - `.mg-detail__head`: Header chứa mã code và tên chất.
  - `.mg-detail__struct`: Khung hiển thị công thức cấu tạo 2D dạng vector SVG.
  - `.mg-detail__table`: Bảng liệt kê:
    - Công thức phân tử (Formula).
    - Điện tích sinh lý ở pH 7.4 (Net Charge).
    - Mã số Enzyme Commission (EC Number) & Enzyme Class.
    - Phản ứng tham gia (Associated Reactions).

---

### 3.9 Primitive UI Controls & Buttons

#### `.mg-btn` (Button Standard)
- **Tag:** `<button>`
- **Classes:** `mg-btn`
- **Modifiers:**
  - `.mg-btn--primary`: Nút nổi bật chính (Background `--mg-start`).
  - `.mg-btn--ghost`: Nút viền trong suốt hoặc nền nhạt.
  - `.mg-btn--icon`: Nút tròn chứa icon SVG.
  - `.mg-btn--wide`: Nút kéo dài 100% chiều rộng container.
- **Pseudo-classes & CSS:**
  - `:active:not(:disabled)`: Giảm bóng đổ và dịch chuyển `translate(2px, 3px)` tạo cảm giác nhấn thật.
  - `:disabled`: `opacity: 0.5; cursor: default;`

#### `.mg-chip` & `.mg-badge`
- **Tag:** `<span>` hoặc `<div>`
- **Classes:** `mg-chip`, `mg-badge`
- **Modifiers:** `.mg-chip--adenylate`, `.mg-chip--redox`, `.mg-chip--carrier`

#### `.mg-toast` & `.mg-toasts` (Notification Toasts)
- **Tag:** `<div>`
- **Classes:** `mg-toasts`, `mg-toast`
- **ARIA:** `aria-live="polite"`, `role="status"`
- **Modifiers:** `.is-leaving` (hiệu ứng mờ dần khi hết thời gian hiển thị `TOAST_MS`).

---

## 4. Bảng Tra Cứu Toàn Bộ State Modifiers (`is-*`)

| State Class | Thành phần áp dụng | Ý nghĩa & Hành vi giao diện |
| :--- | :--- | :--- |
| `is-active` | Button, Tab, Segment | Phần tử đang được chọn hoặc kích hoạt |
| `is-asked` | `.mgq-box`, `.mgc-node` | Đối tượng đang được đặt câu hỏi trong lượt quiz |
| `is-known` | `.mgq-box`, `.mgc-node` | Đã trả lời đúng; có thể click để xem thẻ thông tin |
| `is-missed` | `.mgq-box`, Reaction Step | Bước làm sai; chuyển viền thành màu cam cảnh báo |
| `is-correct` | `.mgq-chip`, Box, Field | Trả lời chính xác; chuyển màu xanh lá `--mg-correct` |
| `is-wrong` / `is-error` | Input, Chip, Field | Trả lời sai; rung lắc nhẹ (shake animation) và báo đỏ |
| `is-selected` | Chip, Choice, Option | Đang được đánh dấu chọn bởi người dùng |
| `is-disabled` | Button, Input | Vô hiệu hóa thao tác tương tác |
| `is-eliminated` | `.mgq-chip` | Lựa chọn sai đã bị loại bỏ khỏi bảng câu hỏi |
| `is-empty` | Input, Canvas | Ô nhập liệu hoặc khung vẽ chưa có dữ liệu |
| `is-entering` | Screen, Modal, Banner | Hiệu ứng xuất hiện (fade-in / slide-in) |
| `is-leaving` | Screen, Modal, Toast | Hiệu ứng biến mất (fade-out) |
| `is-done` | Pathway, Course | Con đường đã hoàn thành toàn bộ các bước |
| `is-locked` | Pathway Card | Con đường bị khóa khi chưa bật chế độ nâng cao |
| `is-open` | Chooser, Dropdown | Bảng chọn đang mở |
| `is-long` / `is-xlong`| Typography, Label | Tiêu đề tên chất quá dài, tự động co nhỏ font-size |

---

## 5. Bảng Thuộc Tính Dữ Liệu (`data-*`)

| Thuộc tính Data | Giá trị mẫu | Mục đích sử dụng |
| :--- | :--- | :--- |
| `data-theme` | `"light"` \| `"dark"` | Áp dụng chủ đề sáng/tối trên `<html>` |
| `data-screen` | `"menu"`, `"play"`, `"atp"` | Phân luồng điều hướng màn hình chính |
| `data-mode` | `"build"`, `"pick"`, `"type"` | Chế độ chơi quiz hiện hành |
| `data-key` | `"atp:home"`, `"practice"` | Định danh phím tắt và action định tuyến |
| `data-id` | `"atp"`, `"g6p"`, `"hexokinase"`| ID của phân tử, enzyme hoặc coenzyme |
| `data-step` | `"hk"`, `"pfk"`, `"cs"` | Mã định danh bước phản ứng sinh hóa |
| `data-slot` | `"substrate"`, `"enzyme"` | Vị trí thành phần phản ứng trong sơ đồ |
| `data-state` | `"active"`, `"known"`, `"missed"`| Trạng thái của node trên bản đồ SVG |
| `data-family` | `"sugar"`, `"kinase"`, `"redox"`| Nhóm phân loại phục vụ gợi ý và màu sắc |

---

## 6. Khả Năng Trợ Năng (Accessibility - a11y) & Xử Lý Sự Kiện

### 6.1 Bảng thuộc tính ARIA chuẩn hóa

- `role="button"`: Khai báo cho các thẻ div/svg có tương tác nhấp chuột.
- `role="dialog"` + `aria-modal="true"`: Khai báo cho modal cửa sổ bật lên.
- `role="status"` + `aria-live="polite"`: Dùng cho thanh Toast thông báo kết quả.
- `role="switch"` + `aria-checked="true|false"`: Nút công tắc bật tắt chế độ.
- `aria-label` / `aria-labelledby`: Mô tả nhãn âm thanh cho screen readers trên nút icon hoặc sơ đồ SVG.

### 6.2 Bản đồ sự kiện tương tác (Events Mapping)

| Sự kiện DOM | Vị trí lắng nghe | Chức năng thực hiện |
| :--- | :--- | :--- |
| `click` | Buttons, Nodes, Chips | Lựa chọn đáp án, điều hướng, mở modal |
| `keydown` | `document` | `Escape` để thoát modal; `Tab` duyệt phím tuần hoàn; `Enter` nộp bài |
| `pointerdown / move / up`| `.mgc-host` | Kéo trượt bản đồ chuyển hóa trực quan (Pan) |
| `wheel` | `.mgc-host` | Phóng to / thu nhỏ bản đồ (Zoom) |
| `resize` | `window` | Tính toán lại tỷ lệ SVG viewBox phù hợp màn hình thiết bị |
| `visibilitychange` | `document` | Tự động tạm dừng bộ đếm thời gian khi người dùng chuyển tab |

---

*Tài liệu này được biên soạn phục vụ phát triển, bảo trì và mở rộng các giao diện trong `Biochemical-Pathways-Game`.*
