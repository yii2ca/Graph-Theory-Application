/**
 * Utility functions cho đồ thị
 * Bao gồm các hàm kiểm tra, validate và helper
 */

/**
 * Kiểm tra đồ thị có liên thông không
 * @param {Array} nodes - Mảng các đỉnh
 * @param {Array} edges - Mảng các cạnh
 * @returns {boolean}
 */
export const isConnected = (nodes, edges) => {
  if (nodes.length === 0) return true;
  if (nodes.length === 1) return true;
  
  // BFS để kiểm tra connectivity
  const visited = new Set();
  const queue = [0];
  visited.add(0);
  
  // Tạo adjacency list
  const adj = {};
  nodes.forEach(node => adj[node.id] = []);
  edges.forEach(edge => {
    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];
    adj[edge.from].push(edge.to);
    adj[edge.to].push(edge.from);
  });
  
  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = adj[current] || [];
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visited.size === nodes.length;
};

/**
 * Tạo complete graph (đồ thị đầy đủ)
 * @param {Array} nodes - Mảng các đỉnh
 * @returns {Array} - Mảng tất cả các cạnh có thể
 */
export const createCompleteGraph = (nodes) => {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push({
        from: nodes[i].id,
        to: nodes[j].id,
        fromNode: nodes[i],
        toNode: nodes[j]
      });
    }
  }
  return edges;
};

/**
 * Tính số cạnh tối đa của đồ thị vô hướng
 * @param {number} n - Số đỉnh
 * @returns {number}
 */
export const maxEdges = (n) => {
  return (n * (n - 1)) / 2;
};

/**
 * Kiểm tra có cạnh giữa 2 đỉnh không
 * @param {Array} edges - Mảng các cạnh
 * @param {number} from - Đỉnh từ
 * @param {number} to - Đỉnh đến
 * @returns {boolean}
 */
export const hasEdge = (edges, from, to) => {
  return edges.some(e => 
    (e.from === from && e.to === to) || 
    (e.from === to && e.to === from)
  );
};

/**
 * Lấy degree (bậc) của một đỉnh
 * @param {Array} edges - Mảng các cạnh
 * @param {number} nodeId - ID của đỉnh
 * @returns {number}
 */
export const getDegree = (edges, nodeId) => {
  return edges.filter(e => e.from === nodeId || e.to === nodeId).length;
};
