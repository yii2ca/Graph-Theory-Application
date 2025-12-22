/**
 * Tính khoảng cách Euclidean giữa 2 điểm
 * @param {Object} node1 - Điểm thứ nhất {x, y}
 * @param {Object} node2 - Điểm thứ hai {x, y}
 * @returns {number} - Khoảng cách
 */
export const calculateDistance = (node1, node2) => {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Tính điểm giữa của 2 điểm (để hiển thị label)
 * @param {Object} node1 - Điểm thứ nhất {x, y}
 * @param {Object} node2 - Điểm thứ hai {x, y}
 * @returns {Object} - Điểm giữa {x, y}
 */
export const getMidPoint = (node1, node2) => {
  return {
    x: (node1.x + node2.x) / 2,
    y: (node1.y + node2.y) / 2
  };
};

/**
 * Tạo điểm ngẫu nhiên trong khu vực cho trước
 * @param {number} width - Chiều rộng
 * @param {number} height - Chiều cao
 * @param {number} padding - Padding từ viền
 * @returns {Object} - Điểm {x, y}
 */
export const generateRandomPoint = (width, height, padding = 50) => {
  return {
    x: padding + Math.random() * (width - 2 * padding),
    y: padding + Math.random() * (height - 2 * padding)
  };
};

/**
 * Kiểm tra 2 điểm có quá gần nhau không
 * @param {Object} point1 - Điểm thứ nhất
 * @param {Object} point2 - Điểm thứ hai
 * @param {number} minDistance - Khoảng cách tối thiểu
 * @returns {boolean}
 */
export const isTooClose = (point1, point2, minDistance = 40) => {
  return calculateDistance(point1, point2) < minDistance;
};

/**
 * Format số thập phân
 * @param {number} num - Số cần format
 * @param {number} decimals - Số chữ số thập phân
 * @returns {string}
 */
export const formatNumber = (num, decimals = 2) => {
  return num.toFixed(decimals);
};

/**
 * Chuyển đổi pixel sang km với tỷ lệ tùy chỉnh
 * @param {number} pixels - Khoảng cách pixel
 * @param {number} scale - Tỷ lệ chuyển đổi (km/pixel), mặc định 0.05
 * @returns {number} - Khoảng cách km
 */
export const pixelsToKm = (pixels, scale = 0.05) => {
  return (pixels * scale).toFixed(1);
};

/**
 * Bán kính của node (điểm)
 */
export const NODE_RADIUS = 20;

/**
 * Tạo điểm ngẫu nhiên không trùng với các điểm khác
 * Khoảng cách giữa 2 tâm phải >= 2.5 * bán kính (có khoảng trống giữa các điểm)
 * @param {number} width - Chiều rộng vùng
 * @param {number} height - Chiều cao vùng
 * @param {Array} existingNodes - Mảng các điểm đã có
 * @param {number} padding - Padding từ viền
 * @param {number} maxAttempts - Số lần thử tối đa
 * @returns {Object|null} - Điểm mới hoặc null nếu không tìm được
 */
export const generateNonOverlappingPoint = (width, height, existingNodes, paddingTop = 80, paddingSide = 60, maxAttempts = 100) => {
  // Khoảng cách tối thiểu giữa 2 tâm = 2.5 * bán kính (có khoảng trống)
  const minDistance = NODE_RADIUS * 2.5;
  
  for (let i = 0; i < maxAttempts; i++) {
    const point = {
      x: paddingSide + Math.random() * (width - 2 * paddingSide),
      y: paddingTop + Math.random() * (height - paddingTop - paddingSide)
    };

    // Kiểm tra khoảng cách từ tâm này đến tâm các điểm khác
    const isFarEnough = existingNodes.every(node => 
      calculateDistance(point, node) >= minDistance
    );

    if (isFarEnough) {
      return point;
    }
  }

  // Nếu không tìm được, trả về null
  return null;
};