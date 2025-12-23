import { useState } from 'react';
import { kruskalMST, primMST } from '../algorithms/mst';
import { pixelsToKm } from '../utils/calculations';
import { validateGraphForMST } from '../algorithms/graphUtils';

/**
 * Custom hook để xử lý MST algorithm
 */
export const useMST = (nodes, edges, setMstEdges, setTotalCost, setExecutionLogs, distanceScale, primStartNode, showToast, setAnimationTime) => {
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Tìm MST với animation
   * @param {string} algorithm - 'kruskal' hoặc 'prim'
   */
  const findMST = async (algorithm = 'kruskal') => {
    // Validation đầu vào
    const validation = validateGraphForMST(nodes, edges);
    if (!validation.valid) {
      if (showToast) {
        showToast(validation.error, 'error');
      } else {
        console.error(validation.error);
      }
      return;
    }

    setIsAnimating(true);
    setMstEdges([]);
    setTotalCost(0);
    
    const startTime = performance.now();
    
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
        const errorMsg = 'Thuật toán trả về kết quả không hợp lệ';
        console.error(errorMsg);
        if (showToast) {
          showToast(errorMsg, 'error');
        }
        setIsAnimating(false);
        return;
      }

      // Kiểm tra xem có tìm được MST đầy đủ không
      if (result.mstEdges.length < nodes.length - 1) {
        const errorMsg = `Không thể tạo MST hoàn chỉnh! Chỉ tìm được ${result.mstEdges.length}/${nodes.length - 1} cạnh. Đồ thị có thể không liên thông.`;
        console.warn(errorMsg);
        if (showToast) {
          showToast(errorMsg, 'warning');
        }
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
      const endTime = performance.now();
      const executionTimeMs = Math.round(endTime - startTime);
      
      if (setAnimationTime) {
        setAnimationTime(executionTimeMs);
      }
      
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
      
      // Hiển thị thông báo thành công
      if (showToast) {
        showToast(`MST hoàn thành! Tổng chi phí: ${totalCostInKm.toFixed(2)} km`, 'success');
      }
    } catch (error) {
      console.error('Lỗi khi tính MST:', error);
      
      if (showToast) {
        showToast('Có lỗi xảy ra khi tính toán MST', 'error');
      }
      
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