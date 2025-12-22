import { UnionFind } from './unionFind';
import { calculateDistance } from '../utils/calculations';

/**
 * Thuật toán Kruskal để tìm Minimum Spanning Tree
 * Độ phức tạp: O(E log E) với E là số cạnh
 * 
 * @param {Array} nodes - Mảng các đỉnh
 * @param {Array} edges - Mảng các cạnh từ graph
 * @returns {Object} - { mstEdges: Array, totalCost: number }
 */
export const kruskalMST = (nodes, edges = []) => {
  if (nodes.length < 2) {
    return { mstEdges: [], totalCost: 0 };
  }

  // Bước 1: Chuyển đổi edges sang format phù hợp và tính weight
  const allEdges = edges.map(edge => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;
    
    // Sử dụng weight tùy chỉnh nếu có, nếu không thì tính từ tọa độ
    const weight = edge.weight !== undefined 
      ? edge.weight 
      : calculateDistance(fromNode, toNode);
    
    return {
      from: edge.from,
      to: edge.to,
      weight,
      fromNode,
      toNode,
      isRequired: edge.isRequired || false
    };
  }).filter(e => e !== null);

  // Bước 2: Sắp xếp các cạnh - cạnh bắt buộc lên đầu, sau đó theo trọng số
  allEdges.sort((a, b) => {
    // Ưu tiên cạnh bắt buộc
    if (a.isRequired && !b.isRequired) return -1;
    if (!a.isRequired && b.isRequired) return 1;
    // Nếu cùng loại, sắp xếp theo trọng số
    return a.weight - b.weight;
  });

  // Bước 3: Sử dụng Union-Find để tránh tạo chu trình
  const uf = new UnionFind(nodes.length);
  const mstEdges = [];
  let totalCost = 0;

  // Bước 4: Duyệt qua các cạnh và chọn cạnh không tạo chu trình
  for (const edge of allEdges) {
    // Nếu 2 đỉnh chưa kết nối, thêm cạnh vào MST
    if (uf.union(edge.from, edge.to)) {
      mstEdges.push(edge);
      totalCost += edge.weight;
      
      // Dừng khi đã có đủ n-1 cạnh
      if (mstEdges.length === nodes.length - 1) {
        break;
      }
    }
  }

  return { mstEdges, totalCost };
};

/**
 * Thuật toán Prim để tìm Minimum Spanning Tree
 * Độ phức tạp: O(E log V) với E là số cạnh, V là số đỉnh
 * 
 * @param {Array} nodes - Mảng các đỉnh
 * @param {Array} edges - Mảng các cạnh từ graph
 * @param {number} startNodeId - ID của đỉnh khởi đầu (optional)
 * @returns {Object} - { mstEdges: Array, totalCost: number }
 */
export const primMST = (nodes, edges = [], startNodeId = null) => {
  if (nodes.length < 2) {
    return { mstEdges: [], totalCost: 0 };
  }

  // Tạo adjacency map từ edges
  const edgeMap = new Map();
  edges.forEach(edge => {
    const key1 = `${edge.from}-${edge.to}`;
    const key2 = `${edge.to}-${edge.from}`;
    
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return;
    
    const weight = edge.weight !== undefined 
      ? edge.weight 
      : calculateDistance(fromNode, toNode);
    
    const edgeData = {
      from: edge.from,
      to: edge.to,
      weight,
      fromNode,
      toNode,
      isRequired: edge.isRequired || false
    };
    
    edgeMap.set(key1, edgeData);
    edgeMap.set(key2, { ...edgeData, from: edge.to, to: edge.from, fromNode: toNode, toNode: fromNode });
  });

  const visited = new Set();
  const mstEdges = [];
  let totalCost = 0;

  // Bắt đầu từ đỉnh được chọn hoặc đỉnh đầu tiên
  const actualStartNodeId = startNodeId !== null && nodes.find(n => n.id === startNodeId)
    ? startNodeId
    : nodes[0].id;
  visited.add(actualStartNodeId);

  while (visited.size < nodes.length) {
    let minEdge = null;
    let minWeight = Infinity;
    let isRequiredEdge = false;

    // Tìm cạnh tốt nhất nối đỉnh đã thăm với đỉnh chưa thăm
    for (const fromId of visited) {
      for (const node of nodes) {
        const toId = node.id;
        if (!visited.has(toId)) {
          const key = `${fromId}-${toId}`;
          const edge = edgeMap.get(key);
          
          if (edge) {
            // Ưu tiên cạnh bắt buộc
            if (edge.isRequired && !isRequiredEdge) {
              minEdge = edge;
              minWeight = edge.weight;
              isRequiredEdge = true;
            } else if (edge.isRequired && isRequiredEdge && edge.weight < minWeight) {
              minEdge = edge;
              minWeight = edge.weight;
            } else if (!edge.isRequired && !isRequiredEdge && edge.weight < minWeight) {
              minEdge = edge;
              minWeight = edge.weight;
            }
          }
        }
      }
    }

    if (minEdge) {
      mstEdges.push(minEdge);
      totalCost += minWeight;
      visited.add(minEdge.to);
    } else {
      // Không tìm thấy cạnh, đồ thị không liên thông
      break;
    }
  }

  return { mstEdges, totalCost };
};
