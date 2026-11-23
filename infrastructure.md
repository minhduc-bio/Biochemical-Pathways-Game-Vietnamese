Ran inspect line 7310-7325
Ran inspect pack registration lines 15150-15230
Ran find advanced pack pathways and groups
Ran find P.pathways assignments
Ran inspect ureaCyclePart
Ran inspect urea pathway export
Ran find .mgc- CSS classes

Qua việc xem xét và dịch ngược kiến trúc mã nguồn của ứng dụng đơn file HTML (`pathway_quiz.html`, ~32.500 dòng code, ~1.78 MB), dưới đây là phân tích toàn diện về **cấu trúc dữ liệu, nguyên lý dựng hình SVG, cơ chế tương tác và phương án tái sử dụng kiến trúc** để mở rộng thêm nhiều quá trình/chu trình chuyển hóa mới.

---

## 1. Tổng quan kiến trúc tổng thể (Architecture Overview)

Ứng dụng được thiết kế theo mô hình **Hướng dữ liệu (Data-Driven Architecture)** hoàn toàn bằng Vanilla JavaScript và SVG, không phụ thuộc vào bất kỳ thư viện hay framework bên ngoài nào.

Kiến trúc bao gồm **6 lớp tách biệt**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ENTITY REGISTRY (Từ điển Hóa sinh)                       │
│    MG.entities = { molecule, enzyme, cofactor }             │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. MOLECULAR GEOMETRY (Tọa độ 2D cấu trúc hóa học)          │
│    MG.geometry = { [molId]: { atoms, bonds } }              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. PATHWAY GRAPH DEFINITION (Đồ thị chuyển hóa)              │
│    { nodes, reactions, order, start, regions, membranes }   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 4. LAYOUT & COLLISION ENGINE (`layoutPathway`, `choosePill`)│
│    Tính toán tọa độ Card, Pill, Chip, Cắt xén mũi tên       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 5. SVG RENDERING ENGINE (`MG.chart.create`)                 │
│    Xuất các Layer SVG: regions, membranes, arrows, nodes... │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 6. INTERACTION & GAME MODES (`MG.slots`, `createGame`)      │
│    Build mode, Fill Map, Fill Blank, Quản lý trạng thái     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Chi tiết các cấu trúc dữ liệu cốt lõi (Data Schemas)

### 2.1. Lớp thực thể hóa sinh (Entity Layer)
Được lưu trong `MG.entities` (tại dòng ~6496–7317), gồm 3 từ điển:

1. **`molecule`**: Định nghĩa chất chuyển hóa (Metabolites)
   ```javascript
   glucose: {
     name: 'Glucose',
     short: 'Glc',
     family: 'sugar',               // Phân loại: sugar, c3, amino, lipid, adenylate...
     lines: ['Glucose'],            // Ngắt dòng hiển thị trên thẻ (Card)
     aliases: ['glucose', 'd-glucose', 'glc'], // Từ đồng nghĩa phục vụ chế độ gõ đáp án
     note: 'Phân tử đường 6 carbon...'         // Chú thích giáo khoa khi nhấp/hover
   }
   ```
2. **`enzyme`**: Định nghĩa enzyme xúc tác
   ```javascript
   hexokinase: {
     name: 'Hexokinase',
     short: 'HK',
     ec: '2.7.1.1',                 // Mã phân loại quốc tế Enzyme Commission
     family: 'kinase',              // kinase, isomerase, lyase, oxidoreductase...
     aliases: ['hexokinase', 'hk', 'glucokinase'],
     note: 'Phosphoryl hóa glucose...'
   }
   ```
3. **`cofactor`**: Định nghĩa đồng yếu tố / phân tử nhỏ ra vào
   ```javascript
   atp: {
     name: 'ATP',
     display: 'ATP',
     family: 'adenylate',           // adenylate, redox, carrier, small...
     aliases: ['atp', 'adenosine triphosphate'],
     note: 'Đồng tiền năng lượng của tế bào...'
   }
   ```

---

### 2.2. Lớp cấu trúc con đường (Pathway Specification)
Một con đường/chu trình hoàn chỉnh (như `glycolysis`, `tca`, `urea`) là một đối tượng chứa đầy đủ thông tin hình học và phản ứng:

```javascript
var myPathway = {
  id: 'tca',                           // ID duy nhất (chỉ gồm chữ thường và số)
  title: 'Chu trình TCA (TCA Cycle)',  // Tiêu đề hiển thị
  subtitle: 'Oxy hóa acetyl-CoA thành CO₂',
  tag: 'TCA',                          // Ký hiệu viết tắt 3 ký tự
  location: 'Mitochondrial matrix',     // Vị trí tế bào
  color: '#F0C987',                    // Màu sắc chủ đạo (Theme accent)
  nodes: {                             // Danh sách các điểm nút chất chuyển hóa
    citrate: { mol: 'citrate', x: 1000, y: 520 },
    isocitrate: { mol: 'isocitrate', x: 1340, y: 660 },
    // ...
  },
  reactions: [                         // Danh sách phản ứng (xem chi tiết mục 2.3)
    /* reaction 1, reaction 2, ... */
  ],
  order: ['cs', 'aconitase', 'idh', 'kgdh', 'scs', 'sdh', 'fumarase', 'mdh'], // Thứ tự chu trình
  start: ['acetylcoa'],                // Nút ban đầu được mở sẵn khi bắt đầu quiz
  regions: [                           // Khối hình học nền (khoang tế bào)
    { type: 'circle', label: 'Citric acid cycle', color: '#F7EAD5', cx: 1000, cy: 1000, r: 630 }
  ],
  membranes: [                         // Đường ranh giới màng sinh học (nếu có)
    { x1: 790, y1: 27, x2: 790, y2: 933 }
  ],
  notes: [                             // Các chú thích văn bản trên sơ đồ
    { text: 'Matrix ty thể', x: 1000, y: 1550, size: 20, anchor: 'middle' }
  ],
  summary: [                           // Tóm tắt lý thuyết hiển thị sau khi hoàn thành
    'Chu trình tạo 3 NADH, 1 FADH2 và 1 GTP trên mỗi Acetyl-CoA.'
  ]
};
```

---

### 2.3. Cấu trúc chi tiết một phản ứng (`reaction`)
Mỗi phản ứng trong mảng `reactions` kết nối các `nodes` lại với nhau:

```javascript
{
  id: 'cs',                            // ID phản ứng (bắt buộc: chữ thường + số)
  step: 1,                             // Số thứ tự bước hiển thị trên Badge tròn
  enzyme: 'cs',                        // Trỏ đến key trong MG.entities.enzyme
  substrates: ['acetylcoa', 'oaa'],    // ID các node đầu vào (Node IDs)
  products: ['citrate'],               // ID các node đầu ra (Node IDs)
  ins: ['h2o'],                        // Cofactor đi vào (mũi tên chỉ vào)
  outs: ['coa'],                       // Cofactor đi ra (mũi tên chỉ ra)
  arrows: [                            // Định nghĩa mũi tên nối các Card
    { from: 'oaa', to: 'citrate' },
    { from: 'acetylcoa', to: 'citrate', via: [{ x: 900, y: 600 }] } // 'via' tạo đường cong
  ],
  twoWay: false,                       // true: mũi tên hai chiều thuận nghịch ⇌
  irreversible: true,                  // true: phản ứng một chiều →
  cof: { in: 'west', out: 'east' },    // Hướng bố trí các Chip cofactor
  type: 'Condensation',                // Phân loại kiểu phản ứng hóa học
  equation: 'Acetyl-CoA + Oxaloacetate + H₂O → Citrate + CoA-SH + H⁺',
  hint: 'Đơn vị acetyl 2 carbon nối vào acid 4 carbon...', // Gợi ý cho người chơi
  hl: {                                // Tô màu thay đổi nhóm chức trên cấu trúc 2D
    sub: { acetylcoa: ['methyl'], oaa: ['ket'] },
    prod: { citrate: ['oh'] }
  }
}
```

---

## 3. Nguyên lý dựng hình và bố cục không gian (Spatial Layout Mechanics)

Codebase đã giải quyết rất thông minh bài toán bố cục sơ đồ thông qua hàm `layoutPathway(p, size)` (dòng ~25493) và `MG.chart.create`:

### 3.1. Phân loại 3 mô hình bố cục chính
1. **Dạng chu trình khép kín (Radial/Trigonometric Layout - ví dụ: Chu trình TCA, Chu trình Urea)**:
   - Các đỉnh được tính bằng hàm lượng giác quanh tâm $(c_x, c_y)$ với bán kính $R$:
   ```javascript
   var R = 480, d = R * Math.SQRT1_2; // Góc 45 độ
   function p(dx, dy) { return [Math.round(cx + dx), Math.round(cy + dy)]; }
   var pos = {
     citrate:    p(0, -R),      // 12 giờ
     isocitrate: p(d, -d),      // 1:30
     akg:        p(R, 0),       // 3 giờ
     succoa:     p(d, d),       // 4:30
     succinate:  p(0, R),       // 6 giờ
     fumarate:   p(-d, d),      // 7:30
     malate:     p(-R, 0),      // 9 giờ
     oaa:        p(-d, -d)      // 10:30
   };
   ```
2. **Dạng bậc thang / Phân nhánh tuyến tính (Grid-based Layout - ví dụ: Glycolysis, Đường phân)**:
   - Dùng lưới tọa độ hàng cột với biến bước nhảy: `ROW = 290, TOP = 150`, `row(k) = TOP + ROW * k`.
   - Các cột: `FORK = 460` (nhánh chính), `SIDE = 270` (nhánh phụ như DHAP), `COL = 650`.
3. **Dạng phân khoang đa bào quan (Compartmentalized Layout - ví dụ: Urea cycle, Malate shuttle)**:
   - Sử dụng một đường phân cách màng `membranes: [{ x1, y1, x2, y2 }]` chia đôi không gian thành Matrix ty thể và Bào tương (Cytosol). Các phản ứng vận chuyển (transporter/antiport) sẽ có mũi tên bắc ngang qua đường màng này.

### 3.2. Thuật toán tự động hóa hình học trong Engine
- **Tự động cắt xén mũi tên (`clipRoute`)**: Mũi tên không bao giờ đè lên viền hộp phân tử mà tự động dừng tại khoảng cách chuẩn `CARD_W/2 + ARROW_GAP`.
- **Tránh va chạm nhãn enzyme (`choosePill`)**: Nhãn enzyme (Pill hình viên con nhộng) tự động trượt dọc theo đoạn nối ($f \in [0.25, 0.75]$) và thử các độ rộng khác nhau để chọn vị trí **không đè lên bất kỳ phân tử nào**.
- **Tự động định vị Cofactor (`placeBadges` / `paintChip`)**: Các phân tử phụ (ATP, NADH, CO₂) được xếp hàng vuông góc với hướng phản ứng cùng dây nối mảnh (`connector`).
- **Tự tính toán Viewport (`bounds`)**: Tự động tính Bounding Box bao quanh toàn bộ các nút và vùng nền để gán `viewBox` cho SVG, giúp sơ đồ tự co giãn (responsive) trên mọi kích thước màn hình.

---

## 4. Hệ thống tương tác và Module hóa (Slots, Packs, Composition)

Hệ thống cung cấp sẵn các cơ chế trừu tượng hóa cực kỳ mạnh mẽ để bạn tái sử dụng:

### 4.1. Hệ thống Slots (`MG.slots.list(pathway)`)
Hàm này tự động phân tích đối tượng `pathway` thành danh sách các ô tương tác:
- `node:<nodeId>`: Vị trí chất chuyển hóa.
- `enz:<rxnId>`: Vị trí enzyme.
- `in:<rxnId>:<index>`: Vị trí cofactor đi vào.
- `out:<rxnId>:<index>`: Vị trí cofactor đi ra.

Toàn bộ game logic (ẩn slot, hiện slot, kiểm tra đúng/sai, gợi ý) chỉ giao tiếp với sơ đồ qua API:
```javascript
chart.setSlot('enz:hk', { state: 'revealed' });
chart.focus('node:citrate', { animate: true });
```

### 4.2. Hệ thống Pack mở rộng (`MG.packs`)
Không cần sửa trực tiếp vào mã nguồn cốt lõi, ứng dụng có cơ chế **Pack** (như pack `advanced`):
```javascript
var P = MG.packs.pack('my_cycle_pack');
P.title = 'My New Biochemical Cycles';
P.regions = ['chloroplast', 'peroxisome'];

// Đăng ký thực thể mới
P.entities.molecule['my_mol'] = { ... };
P.entities.enzyme['my_enz'] = { ... };

// Đăng ký con đường
P.pathways['my_pathway'] = myPathwayObject;

// Đăng ký vào Menu người dùng
P.groups = [{
  id: 'custom_cycles',
  title: 'Các chu trình mới',
  pathways: ['my_pathway']
}];
```

### 4.3. Động cơ ghép nối bản đồ (`compose`)
Hàm `compose(spec)` cho phép kết hợp nhiều chu trình riêng lẻ thành một siêu bản đồ liên hoàn (như `everything-all`):
- Cho phép tịnh tiến tọa độ qua `dx`, `dy`.
- Cho phép hợp nhất các chất chung qua thuộc tính `share: { pyr: 'pyr', oaa: 'oaa' }`.

---

## 5. Hướng dẫn từng bước để xây dựng một chu trình chuyển hóa mới

Để thêm một chu trình mới (ví dụ: **Chu trình Glyoxylate** hoặc **Chu trình Calvin**), quy trình chuẩn gồm 5 bước:

### Bước 1: Khai báo các phân tử và enzyme mới (nếu chưa có)
Kiểm tra trong `MG.entities.molecule` và `MG.entities.enzyme`. Nếu chất mới chưa tồn tại, bổ sung vào:
```javascript
var newMolecules = {
  isocitrate: { /* đã có sẵn */ },
  glyoxylate: {
    name: 'Glyoxylate', short: 'Glyox', family: 'c2', lines: ['Glyoxylate'],
    aliases: ['glyoxylate', 'glyoxylic acid'],
    note: 'Sản phẩm 2-carbon của phản ứng phân cắt isocitrate.'
  }
};
var newEnzymes = {
  isocitrate_lyase: {
    name: 'Isocitrate lyase', short: 'ICL', ec: '4.1.3.1', family: 'lyase',
    aliases: ['isocitrate lyase', 'icl'],
    note: 'Phân cắt isocitrate thành succinate và glyoxylate.'
  },
  malate_synthase: {
    name: 'Malate synthase', short: 'MS', ec: '2.3.3.9', family: 'transferase',
    aliases: ['malate synthase', 'ms'],
    note: 'Ngưng tụ glyoxylate với acetyl-CoA tạo thành malate.'
  }
};
```

### Bước 2: Viết hàm sinh đồ thị chu trình (Part function)
Dùng phương pháp tọa độ lượng giác cho chu trình khép kín:
```javascript
function glyoxylateCyclePart(cx, cy) {
  var R = 400; // Bán kính vòng tròn
  // Tính tọa độ 5 đỉnh của chu trình
  var nodes = {
    isocitrate: node('isocitrate', cx + R * Math.cos(0),               cy + R * Math.sin(0)),
    succinate:  node('succinate',  cx + R * Math.cos(0.4 * Math.PI),   cy + R * Math.sin(0.4 * Math.PI)),
    glyoxylate: node('glyoxylate', cx + R * Math.cos(0.8 * Math.PI),   cy + R * Math.sin(0.8 * Math.PI)),
    malate:     node('malate',     cx + R * Math.cos(1.2 * Math.PI),   cy + R * Math.sin(1.2 * Math.PI)),
    oaa:        node('oaa',        cx + R * Math.cos(1.6 * Math.PI),   cy + R * Math.sin(1.6 * Math.PI))
  };

  var reactions = [
    {
      id: 'icl', step: 1, enzyme: 'isocitrate_lyase',
      substrates: ['isocitrate'], products: ['succinate', 'glyoxylate'],
      ins: [], outs: [],
      arrows: [{ from: 'isocitrate', to: 'glyoxylate' }, { from: 'isocitrate', to: 'succinate' }],
      twoWay: false, irreversible: true, type: 'Lyase',
      equation: 'Isocitrate → Succinate + Glyoxylate',
      hint: 'Cắt đứt mạch phân tử giải phóng một acid 4-carbon và một aldehyde 2-carbon.'
    },
    {
      id: 'ms', step: 2, enzyme: 'malate_synthase',
      substrates: ['glyoxylate'], products: ['malate'],
      ins: ['acetylcoa', 'h2o'], outs: ['coa'],
      arrows: [{ from: 'glyoxylate', to: 'malate' }],
      twoWay: false, irreversible: true, type: 'Condensation',
      equation: 'Glyoxylate + Acetyl-CoA + H₂O → Malate + CoA-SH',
      hint: 'Ngưng tụ phân tử 2-carbon với acetyl-CoA tạo dicarboxylic acid 4-carbon.'
    }
    // Các phản ứng nối tiếp malate -> oaa -> citrate -> isocitrate
  ];

  return {
    nodes: nodes,
    reactions: reactions,
    order: ['icl', 'ms', 'mdh', 'cs', 'aconitase'],
    regions: [{ type: 'circle', label: 'Chu trình Glyoxylate', color: '#E2F0F9', cx: cx, cy: cy, r: R + 140 }]
  };
}
```

### Bước 3: Đóng gói và đăng ký vào Menu
```javascript
var glyoxParts = glyoxylateCyclePart(800, 800);
var glyoxylateCycle = {
  id: 'glyoxylate',
  title: 'Chu trình Glyoxylate (Glyoxylate Cycle)',
  subtitle: 'Chuyển hóa Acetyl-CoA thành carbohydrate ở thực vật và vi khuẩn',
  tag: 'GLX',
  location: 'Glyoxysome / Cytosol',
  color: '#8FC1E3',
  nodes: glyoxParts.nodes,
  reactions: glyoxParts.reactions,
  order: glyoxParts.order,
  start: ['isocitrate'],
  regions: glyoxParts.regions,
  summary: ['Bỏ qua hai bước khử carboxyl của chu trình TCA, giữ lại carbon để tổng hợp glucose.']
};

// Đăng ký vào hệ thống
MG.pathways['glyoxylate'] = glyoxylateCycle;

// Thêm vào danh mục hiển thị trên Menu
MG.categories.push({
  id: 'plant_microbe',
  title: 'Chuyển hóa Thực vật & Vi sinh',
  color: '#8FC1E3',
  pathways: ['glyoxylate']
});
```

---

## 6. Đánh giá kiến trúc & Đề xuất tối ưu hóa (Recommendations)

### 6.1. Điểm mạnh nổi bật
1. **Kiến trúc phân tách tuyệt vời (Separation of Concerns)**: Dữ liệu hóa sinh hoàn toàn độc lập với việc dựng hình DOM. Bạn chỉ cần khai báo JSON/Object, hệ thống tự lo phần vẽ SVG.
2. **Khả năng tự động định tuyến và căn chỉnh tốt**: Thuật toán `clipRoute` và `choosePill` tự tránh đè chữ lên hình, giảm tối đa công sức căn chỉnh thủ công từng pixel.
3. **Cơ chế tái sử dụng cao (`MG.chart` & `MG.slots`)**: Một sơ đồ có thể dùng cho mọi chế độ: học tập tự do, làm bài trắc nghiệm nhiều lựa chọn, kiểm tra gõ chữ, phóng to thu nhỏ (Zoom/Pan).

### 6.2. Các điểm nghẽn hiện tại và Giải pháp khắc phục

| Điểm nghẽn hiện tại | Phân tích vấn đề | Đề xuất giải pháp kiến trúc |
| :--- | :--- | :--- |
| **File nguyên khối (Monolith ~1.78 MB)** | Code logic, CSS, dữ liệu hàng trăm chất và con đường gộp chung trong 1 file, rất khó bảo trì hoặc làm việc theo nhóm. | **Module hóa mã nguồn**: Tách thành các file nhỏ (`entities/`, `pathways/`, `engine/`). Dùng Vite hoặc một script bundle nhỏ (như Rollup/Python script) để tự động xuất ra 1 file HTML duy nhất khi release. |
| **Tọa độ nút vẫn phải tính thủ công** | Mỗi khi tạo chu trình mới, lập trình viên vẫn phải tự viết hàm tính $(x, y)$ hoặc nhẩm tọa độ. | **Xây dựng Factory Helper**: Tạo các hàm tiện ích chuẩn hóa như `createCircularLayout({ center, radius, steps, metabolites })` hoặc `createPathwayBuilder()` để chỉ cần truyền mảng các chất theo thứ tự vòng tròn, vị trí sẽ tự động phát sinh. |
| **Xác thực dữ liệu (Validation)** | Nếu một phản ứng gõ nhầm tên substrate không có trong danh sách nodes, app có thể bị crash khi chạy mà không báo lỗi sớm. | **Schema Validator**: Tạo một script kiểm thử ngắn (chạy trên Node.js hoặc Python) duyệt qua `MG.pathways`, kiểm tra tính toàn vẹn tham chiếu giữa `reactions.substrates` và `nodes`, cũng như giữa `nodes.mol` và `MG.entities.molecule`. |

Với kiến trúc này, bạn hoàn toàn có thể mở rộng thêm hàng chục quá trình chuyển hóa khác (chu trình Calvin, thoái hóa/tổng hợp purine/pyrimidine, chu trình Cori, chuyển hóa lipid...) một cách nhất quán, bền vững và tận dụng trọn vẹn toàn bộ các chế độ tương tác học tập đã có sẵn trong ứng dụng.