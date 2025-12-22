import { useState } from 'react';
import { kruskalMST, primMST } from '../algorithms/mst';
import { pixelsToKm } from '../utils/calculations';

/**
 * Custom hook để xử lý MST algorithm
 */
export const useMST = (nodes, edges, setMstEdges, setTotalCost, setExecutionLogs, distanceScale, primStartNode) => {
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

    if (!edges || edges.length === 0) {
      console.warn('Cần ít nhất 1 cạnh để tính MST');
      return;
    }

    setIsAnimating(true);
    setMstEdges([]);
    setTotalCost(0);
    
    // Reset execution logs
    const logs = [];
    if (setExecutionLogs) {
      setExecutionLogs([]);
    }

    try {
      // Chọn thuật toán - truyền edges vào
      const result = algorithm === 'prim' 
        ? primMST(nodes, edges, primStartNode) 
        : kruskalMST(nodes, edges);

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

      // Log bắt đầu
      const startLog = {
        step: 0,
        type: 'start',
        message: `Bắt đầu thuật toán ${algorithm === 'prim' ? 'Prim' : 'Kruskal'}`,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      };
      logs.push(startLog);
      if (setExecutionLogs) {
        setExecutionLogs([startLog]);
      }

      // Animation: hiển thị từng cạnh dần dần với log
      for (let i = 0; i < result.mstEdges.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const edge = result.mstEdges[i];
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        // Thêm log cho mỗi cạnh được chọn
        // Đảm bảo edge.weight là số hợp lệ
        const edgeWeight = typeof edge.weight === 'number' && !isNaN(edge.weight) ? edge.weight : 0;
        const weightInKm = pixelsToKm(edgeWeight, distanceScale);
        
        // Message khác nhau cho từng thuật toán
        const fromLabel = fromNode?.label || `Node ${edge.from}`;
        const toLabel = toNode?.label || `Node ${edge.to}`;
        const message = algorithm === 'prim'
          ? `Thêm đỉnh ${toLabel} vào cây (qua ${fromLabel})`
          : `Chọn cạnh: ${fromLabel} → ${toLabel}`;
        
        const edgeLog = {
          step: i + 1,
          type: 'edge',
          from: fromLabel,
          to: toLabel,
          weight: typeof weightInKm === 'number' ? weightInKm.toFixed(2) : '0.00',
          message: message,
          timestamp: new Date().toLocaleTimeString('vi-VN')
        };
        
        logs.push(edgeLog);
        if (setExecutionLogs) {
          setExecutionLogs([...logs]);
        }
        
        setMstEdges(prev => [...prev, edge]);
      }

      // Log kết thúc
      const resultTotalCost = typeof result.totalCost === 'number' && !isNaN(result.totalCost) ? result.totalCost : 0;
      const totalCostInKm = pixelsToKm(resultTotalCost, distanceScale);
      const endLog = {
        step: result.mstEdges.length + 1,
        type: 'end',
        message: `Hoàn thành! Tổng: ${typeof totalCostInKm === 'number' ? totalCostInKm.toFixed(2) : '0.00'} km`,
        totalCost: typeof totalCostInKm === 'number' ? totalCostInKm.toFixed(2) : '0.00',
        timestamp: new Date().toLocaleTimeString('vi-VN')
      };
      logs.push(endLog);
      if (setExecutionLogs) {
        setExecutionLogs([...logs]);
      }

      setTotalCost(result.totalCost);
    } catch (error) {
      console.error('Lỗi khi tính MST:', error);
      
      // Log lỗi
      const errorLog = {
        step: logs.length,
        type: 'error',
        message: `Lỗi: ${error.message}`,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      };
      if (setExecutionLogs) {
        setExecutionLogs([...logs, errorLog]);
      }
    } finally {
      setIsAnimating(false);
    }
  };

  return {
    findMST,
    isAnimating
  };
};