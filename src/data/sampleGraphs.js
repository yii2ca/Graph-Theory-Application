/**
 * Dữ liệu các đồ thị mẫu để test
 */

// Đồ thị nhỏ - 5 đỉnh
export const smallGraph = [
  { id: 0, x: 200, y: 150, label: 'A' },
  { id: 1, x: 400, y: 100, label: 'B' },
  { id: 2, x: 600, y: 150, label: 'C' },
  { id: 3, x: 300, y: 300, label: 'D' },
  { id: 4, x: 500, y: 300, label: 'E' }
];

// Đồ thị trung bình - 8 đỉnh
export const mediumGraph = [
  { id: 0, x: 150, y: 100, label: 'Trạm 1' },
  { id: 1, x: 350, y: 100, label: 'Trạm 2' },
  { id: 2, x: 550, y: 100, label: 'Trạm 3' },
  { id: 3, x: 700, y: 100, label: 'Trạm 4' },
  { id: 4, x: 150, y: 300, label: 'Trạm 5' },
  { id: 5, x: 350, y: 300, label: 'Trạm 6' },
  { id: 6, x: 550, y: 300, label: 'Trạm 7' },
  { id: 7, x: 700, y: 300, label: 'Trạm 8' }
];

// Đồ thị lớn - hình tròn
export const circleGraph = (n = 12, centerX = 400, centerY = 250, radius = 180) => {
  const nodes = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    nodes.push({
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      label: `Trạm ${i + 1}`
    });
  }
  return nodes;
};

// Đồ thị grid
export const gridGraph = (rows = 3, cols = 3, spacing = 150, offsetX = 200, offsetY = 150) => {
  const nodes = [];
  let id = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      nodes.push({
        id: id++,
        x: offsetX + j * spacing,
        y: offsetY + i * spacing,
        label: `Trạm ${id}`
      });
    }
  }
  return nodes;
};

// Export tất cả
export const sampleGraphs = {
  small: smallGraph,
  medium: mediumGraph,
  circle: circleGraph(),
  grid: gridGraph()
};

export default sampleGraphs;