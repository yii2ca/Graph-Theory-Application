import { useState } from 'react';
import { kruskalMST, primMST } from '../algorithms/mst';

/**
 * Custom hook để xử lý MST algorithm
 */
export const useMST = (nodes, setMstEdges, setTotalCost) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [algorithm, setAlgorithm] = useState('kruskal');

  /**
   * Tìm MST với animation
   */
  const findMST = async () => {
    if (nodes.length < 2) return;

    setIsAnimating(true);
    setMstEdges([]);

    // Chọn thuật toán
    const result = algorithm === 'kruskal' 
      ? kruskalMST(nodes) 
      : primMST(nodes);

    // Animation: hiển thị từng cạnh dần dần
    for (let i = 0; i < result.mstEdges.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMstEdges(prev => [...prev, result.mstEdges[i]]);
    }

    setTotalCost(result.totalCost);
    setIsAnimating(false);
  };

  return {
    findMST,
    isAnimating,
    algorithm,
    setAlgorithm
  };
};
