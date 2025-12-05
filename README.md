# 🗺️ MST Road System - Hệ Thống Đường Tối Ưu

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.3.9-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

Ứng dụng web trực quan hóa **Minimum Spanning Tree (MST)** - Cây khung nhỏ nhất cho hệ thống đường giao thông. Hỗ trợ thuật toán **Kruskal** và **Prim** với animation đẹp mắt.

## ✨ Tính Năng

- 🎯 **Trực quan hóa MST** với animation mượt mà
- 🧮 **Hai thuật toán**: Kruskal và Prim
- 🗺️ **Tương tác**: Click để thêm điểm, xem kết quả real-time
- 📊 **Đồ thị mẫu**: 4+ đồ thị mẫu (nhỏ, trung bình, tròn, lưới)
- 🇻🇳 **Dữ liệu Việt Nam**: Bản đồ các thành phố lớn
- 🎨 **UI đẹp**: Gradient, glassmorphism, dark mode
- ⚡ **Hiệu năng cao**: React 18 + Vite
- 📱 **Responsive**: Hoạt động trên mọi thiết bị

## 🚀 Cài Đặt và Chạy

### Yêu cầu
- Node.js >= 16.x
- npm >= 8.x

### Bước 1: Clone hoặc tải project

```bash
cd c:\xampp\htdocs\LTDTUD
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ tự động mở tại `http://localhost:3000`

### Bước 4: Build production

```bash
npm run build
```

### Bước 5: Preview production build

```bash
npm run preview
```

## 📁 Cấu Trúc Dự Án

```
mst-road-system/
│
├── 📄 package.json                 # Dependencies và scripts
├── 📄 vite.config.js              # Cấu hình Vite
├── 📄 tailwind.config.js          # Cấu hình TailwindCSS
├── 📄 index.html                  # HTML entry point
│
└── 📁 src/                        # Source code chính
    │
    ├── 📄 main.jsx                # Entry point của React
    ├── 📄 App.jsx                 # Component chính
    ├── 📄 index.css               # Global styles
    │
    ├── 📁 components/             # React Components
    │   ├── 📁 Layout/             # Header, Sidebar
    │   ├── 📁 Map/                # MapCanvas, Node, Edge
    │   ├── 📁 Controls/           # ToolBar, InfoPanel
    │   └── 📁 UI/                 # Button, Card
    │
    ├── 📁 algorithms/             # Thuật toán MST
    │   ├── mst.js                 # Kruskal & Prim
    │   ├── unionFind.js           # Union-Find structure
    │   └── graphUtils.js          # Graph utilities
    │
    ├── 📁 data/                   # Dữ liệu mẫu
    │   ├── sampleGraphs.js        # Đồ thị mẫu
    │   └── vietnamCities.js       # Thành phố VN
    │
    ├── 📁 hooks/                  # Custom React Hooks
    │   ├── useGraph.js            # Hook quản lý đồ thị
    │   ├── useMST.js              # Hook cho MST
    │   └── useAnimation.js        # Hook animation
    │
    ├── 📁 utils/                  # Utility functions
    │   ├── calculations.js        # Tính toán khoảng cách
    │   ├── animations.js          # Animation helpers
    │   └── constants.js           # Hằng số
    │
    ├── 📁 contexts/               # React Context
    │   └── GraphContext.jsx       # Global state
    │
    └── 📁 styles/                 # CSS
        ├── variables.css          # CSS variables
        └── animations.css         # CSS animations
```

## 🎮 Hướng Dẫn Sử Dụng

### 1. Thêm điểm (Nodes)
- Click vào canvas để thêm điểm mới
- Hoặc chọn đồ thị mẫu từ sidebar

### 2. Tìm MST
- Nhấn nút **"Tìm MST"** trên header
- Xem animation vẽ từng cạnh của MST
- Tổng chi phí sẽ hiển thị sau khi hoàn thành

### 3. Đồ thị mẫu
- **Đồ thị nhỏ**: 5 đỉnh đơn giản
- **Đồ thị trung bình**: 8 đỉnh
- **Đồ thị tròn**: 12 đỉnh xếp thành hình tròn
- **Đồ thị lưới**: 9 đỉnh xếp dạng grid
- **Thành phố VN**: 10 thành phố lớn

### 4. Xóa và Reset
- Nhấn **"Xóa hết"** để xóa toàn bộ đồ thị
- Bắt đầu lại từ đầu

## 🧮 Thuật Toán

### Kruskal's Algorithm
**Độ phức tạp**: O(E log E)

```javascript
1. Sắp xếp tất cả các cạnh theo trọng số tăng dần
2. Khởi tạo Union-Find structure
3. Với mỗi cạnh (u, v):
   - Nếu u và v chưa kết nối:
     - Thêm cạnh vào MST
     - Union(u, v)
4. Dừng khi có n-1 cạnh
```

### Prim's Algorithm
**Độ phức tạp**: O(E log V)

```javascript
1. Bắt đầu từ đỉnh bất kỳ
2. Đánh dấu đỉnh đã thăm
3. Trong khi chưa thăm hết:
   - Tìm cạnh nhỏ nhất nối đỉnh đã thăm với đỉnh chưa thăm
   - Thêm cạnh vào MST
   - Đánh dấu đỉnh mới
```

## 🎨 Công Nghệ

- **React 18**: UI framework
- **Vite**: Build tool cực nhanh
- **TailwindCSS**: Utility-first CSS
- **Lucide React**: Beautiful icons
- **SVG**: Vẽ đồ thị vector
- **Context API**: State management

## 📊 Demo Screenshots

### Giao diện chính
![Main Interface](https://via.placeholder.com/800x500?text=MST+Road+System)

### Animation MST
![MST Animation](https://via.placeholder.com/800x500?text=MST+Animation)

### Đồ thị Việt Nam
![Vietnam Cities](https://via.placeholder.com/800x500?text=Vietnam+Cities+Map)

## 🔧 Customization

### Thay đổi màu sắc
Chỉnh sửa file `src/utils/constants.js`:

```javascript
export const COLORS = {
  node: {
    default: '#8b5cf6',  // Màu tím
    mst: '#10b981'       // Màu xanh lá
  }
};
```

### Thay đổi tốc độ animation
Chỉnh sửa file `src/hooks/useMST.js`:

```javascript
await new Promise(resolve => setTimeout(resolve, 500)); // 500ms
```

### Thêm đồ thị mẫu mới
Chỉnh sửa file `src/data/sampleGraphs.js`:

```javascript
export const myCustomGraph = [
  { id: 0, x: 100, y: 100, label: 'A' },
  { id: 1, x: 200, y: 200, label: 'B' },
  // ... thêm nodes
];
```

## 📝 Scripts

```bash
# Development
npm run dev        # Chạy dev server (localhost:3000)

# Production
npm run build      # Build cho production
npm run preview    # Preview production build

# Linting (optional)
npm run lint       # Check code quality
```

## 🐛 Troubleshooting

### Lỗi: `Cannot find module 'react'`
```bash
npm install
```

### Lỗi: Port 3000 đã được sử dụng
Chỉnh sửa `vite.config.js`:
```javascript
server: {
  port: 3001  // Đổi port
}
```

### Lỗi CSS không load
```bash
npm install tailwindcss postcss autoprefixer
```

## 🤝 Contributing

Contributions luôn được chào đón! 

1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License - Tự do sử dụng cho mọi mục đích.

## 👨‍💻 Tác Giả

**MST Road System**
- 📧 Email: your.email@example.com
- 🌐 Website: https://your-website.com
- 💼 LinkedIn: your-linkedin

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Lucide Icons](https://lucide.dev/) - Icon Library

## 📚 Tài Liệu Tham Khảo

- [Kruskal's Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm)
- [Prim's Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Prim%27s_algorithm)
- [Minimum Spanning Tree - GeeksforGeeks](https://www.geeksforgeeks.org/minimum-spanning-tree/)
- [Union-Find Data Structure](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)

---

⭐ Nếu project này hữu ích, hãy cho một star nhé! ⭐
