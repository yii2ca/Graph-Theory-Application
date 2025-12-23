/**
 * Utility functions cho đồ thị
 * Bao gồm các hàm kiểm tra, validate và helper
 */

/**
 * Kiểm tra đồ thị có liên thông không (BFS)
 * @param {Array} nodes - Mảng các đỉnh
 * @param {Array} edges - Mảng các cạnh
 * @returns {boolean}
 */
export const isConnected = (nodes, edges) => {
  if (nodes.length === 0) return true;
  if (nodes.length === 1) return true;
  
  // BFS để kiểm tra connectivity
  const visited = new Set();
  const startNodeId = nodes[0].id;
  const queue = [startNodeId];
  visited.add(startNodeId);
  
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
 * Kiểm tra xem cạnh có phải là self-loop không
 * @param {number} fromId - ID đỉnh đầu
 * @param {number} toId - ID đỉnh cuối
 * @returns {boolean}
 */
export const isSelfLoop = (fromId, toId) => {
  return fromId === toId;
};

/**
 * Kiểm tra cạnh đã tồn tại chưa (duplicate edge)
 * @param {number} fromId - ID đỉnh đầu
 * @param {number} toId - ID đỉnh cuối
 * @param {Array} edges - Mảng các cạnh hiện có
 * @returns {boolean}
 */
export const isDuplicateEdge = (fromId, toId, edges) => {
  return edges.some(edge => 
    (edge.from === fromId && edge.to === toId) || 
    (edge.from === toId && edge.to === fromId)
  );
};

/**
 * Đếm số thành phần liên thông trong đồ thị
 * @param {Array} nodes - Mảng các đỉnh
 * @param {Array} edges - Mảng các cạnh
 * @returns {number} - Số thành phần liên thông
 */
export const countConnectedComponents = (nodes, edges) => {
  if (nodes.length === 0) return 0;
  
  const visited = new Set();
  let components = 0;
  
  // Tạo adjacency list
  const adj = {};
  nodes.forEach(node => adj[node.id] = []);
  edges.forEach(edge => {
    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];
    adj[edge.from].push(edge.to);
    adj[edge.to].push(edge.from);
  });
  
  // BFS cho từng thành phần
  const bfs = (startId) => {
    const queue = [startId];
    visited.add(startId);
    
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
  };
  
  // Duyệt qua tất cả các đỉnh
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      bfs(node.id);
      components++;
    }
  }
  
  return components;
};

/**
 * Kiểm tra đồ thị có đủ điều kiện để tìm MST không
 * @param {Array} nodes - Mảng các đỉnh
 * @param {Array} edges - Mảng các cạnh
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateGraphForMST = (nodes, edges) => {
  // Kiểm tra số đỉnh
  if (nodes.length === 0) {
    return { valid: false, error: 'Đồ thị trống! Vui lòng thêm ít nhất 2 trạm.' };
  }
  
  if (nodes.length === 1) {
    return { valid: false, error: 'Chỉ có 1 trạm! Cần ít nhất 2 trạm để tạo MST.' };
  }
  
  // Kiểm tra số cạnh tối thiểu
  if (edges.length === 0) {
    return { valid: false, error: 'Không có đường ray nào! Vui lòng thêm đường nối giữa các trạm.' };
  }
  
  if (edges.length < nodes.length - 1) {
    return { valid: false, error: `Không đủ đường ray! Cần ít nhất ${nodes.length - 1} đường ray để kết nối ${nodes.length} trạm.` };
  }
  
  // Kiểm tra tính liên thông
  const components = countConnectedComponents(nodes, edges);
  if (components > 1) {
    return { 
      valid: false, 
      error: `Đồ thị không liên thông! Có ${components} thành phần riêng biệt. Vui lòng thêm đường ray để kết nối tất cả các trạm.` 
    };
  }
  
  return { valid: true, error: null };
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
