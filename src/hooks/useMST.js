import { useState } from 'react';
import { kruskalMST, primMST } from '../algorithms/mst';

/**
 * Custom hook để xử lý MST algorithm
 */
export const useMST = (nodes, setMstEdges, setTotalCost) => {
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Tìm MST với animation
   * @param {string} algorithm - 'kruskal' hoặc 'prim'
   */
  const findMST = async (algorithm = 'kruskal') => {
    if (nodes.length < 2) {
      console.warn('Cần ít nhất 2 đỉnh để tính MST');
      return;
    }

    setIsAnimating(true);
    setMstEdges([]);
    setTotalCost(0);

    try {
      // Chọn thuật toán
      const result = algorithm === 'prim' 
        ? primMST(nodes) 
        : kruskalMST(nodes);

      // Kiểm tra kết quả
      if (!result || !result.mstEdges) {
        console.error('Thuật toán trả về kết quả không hợp lệ');
        setIsAnimating(false);
        return;
      }

      console.log(`${algorithm.toUpperCase()} MST:`, {
        edges: result.mstEdges.length,
        totalCost: result.totalCost,
        expectedEdges: nodes.length - 1
      });

      // Animation: hiển thị từng cạnh dần dần
      for (let i = 0; i < result.mstEdges.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setMstEdges(prev => [...prev, result.mstEdges[i]]);
      }

      setTotalCost(result.totalCost);
    } catch (error) {
      console.error('Lỗi khi tính MST:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  return {
    findMST,
    isAnimating
  };
};