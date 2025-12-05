import { UnionFind } from './unionFind';
import { calculateDistance } from '../utils/calculations';

/**
 * Thuật toán Kruskal để tìm Minimum Spanning Tree
 * Độ phức tạp: O(E log E) với E là số cạnh
 * 
 * @param {Array} nodes - Mảng các đỉnh
 * @returns {Object} - { mstEdges: Array, totalCost: number }
 */
export const kruskalMST = (nodes) => {
  if (nodes.length < 2) {
    return { mstEdges: [], totalCost: 0 };
  }

  // Bước 1: Tạo tất cả các cạnh có thể giữa các đỉnh
  const allEdges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = calculateDistance(nodes[i], nodes[j]);
      allEdges.push({
        from: i,
        to: j,
        weight: distance,
        fromNode: nodes[i],
        toNode: nodes[j]
      });
    }
  }

  // Bước 2: Sắp xếp các cạnh theo trọng số tăng dần
  allEdges.sort((a, b) => a.weight - b.weight);

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
 * @returns {Object} - { mstEdges: Array, totalCost: number }
 */
export const primMST = (nodes) => {
  if (nodes.length < 2) {
    return { mstEdges: [], totalCost: 0 };
  }

  const visited = new Set();
  const mstEdges = [];
  let totalCost = 0;

  // Bắt đầu từ đỉnh đầu tiên
  visited.add(0);

  while (visited.size < nodes.length) {
    let minEdge = null;
    let minWeight = Infinity;

    // Tìm cạnh nhỏ nhất nối đỉnh đã thăm với đỉnh chưa thăm
    for (const fromIdx of visited) {
      for (let toIdx = 0; toIdx < nodes.length; toIdx++) {
        if (!visited.has(toIdx)) {
          const weight = calculateDistance(nodes[fromIdx], nodes[toIdx]);
          if (weight < minWeight) {
            minWeight = weight;
            minEdge = {
              from: fromIdx,
              to: toIdx,
              weight,
              fromNode: nodes[fromIdx],
              toNode: nodes[toIdx]
            };
          }
        }
      }
    }

    if (minEdge) {
      mstEdges.push(minEdge);
      totalCost += minWeight;
      visited.add(minEdge.to);
    }
  }

  return { mstEdges, totalCost };
};
