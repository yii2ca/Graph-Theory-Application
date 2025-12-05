/**
 * Constants và configurations cho ứng dụng
 */

// Màu sắc cho nodes và edges
export const COLORS = {
  node: {
    default: '#8b5cf6',
    hover: '#a78bfa',
    selected: '#ec4899',
    mst: '#10b981'
  },
  edge: {
    default: '#6b7280',
    hover: '#9ca3af',
    mst: '#10b981',
    active: '#fbbf24'
  },
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#7c3aed'
  }
};

// Kích thước
export const SIZES = {
  node: {
    radius: 20,
    radiusHover: 25,
    radiusSelected: 30
  },
  edge: {
    width: 2,
    widthHover: 3,
    widthMst: 4
  },
  label: {
    fontSize: 14,
    fontSizeLarge: 16
  }
};

// Animation timing
export const ANIMATION = {
  duration: {
    short: 300,
    medium: 500,
    long: 1000
  },
  delay: {
    mst: 500,
    node: 100,
    edge: 200
  }
};

// Thuật toán
export const ALGORITHMS = {
  KRUSKAL: 'kruskal',
  PRIM: 'prim'
};

// Grid settings
export const GRID = {
  enabled: true,
  size: 50,
  color: 'rgba(139, 92, 246, 0.1)'
};

// Canvas settings
export const CANVAS = {
  minZoom: 0.5,
  maxZoom: 2,
  zoomStep: 0.1
};

// Node generation
export const NODE_GEN = {
  minDistance: 40,
  padding: 50,
  maxAttempts: 100
};
