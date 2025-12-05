import React, { createContext, useContext, useState } from 'react';

/**
 * Context để quản lý state toàn cục của đồ thị
 * Bao gồm: nodes, edges, MST edges, và các methods
 */
const GraphContext = createContext();

export const useGraph = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph phải được sử dụng trong GraphProvider');
  }
  return context;
};

export const GraphProvider = ({ children }) => {
  // State quản lý nodes (đỉnh)
  const [nodes, setNodes] = useState([]);
  
  // State quản lý edges (cạnh)
  const [edges, setEdges] = useState([]);
  
  // State quản lý MST edges (cạnh của cây khung nhỏ nhất)
  const [mstEdges, setMstEdges] = useState([]);
  
  // State cho animation
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State cho tổng chi phí
  const [totalCost, setTotalCost] = useState(0);
  
  // State cho menu
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  /**
   * Thêm node mới vào đồ thị
   * @param {number} x - Tọa độ x
   * @param {number} y - Tọa độ y
   */
  const addNode = (x, y) => {
    const NODE_RADIUS = 20;
    // Khoảng cách tối thiểu giữa 2 tâm = 2.5 * bán kính
    const minDistance = NODE_RADIUS * 2.5;
    
    // Kiểm tra khoảng cách từ tâm điểm mới đến tâm các điểm hiện có
    const isTooClose = nodes.some(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < minDistance;
    });

    if (isTooClose) {
      console.warn('Không thể thêm điểm quá gần các điểm khác (khoảng cách < ' + minDistance + 'px)');
      return;
    }

    const newNode = {
      id: nodes.length,
      x,
      y,
      label: `V${nodes.length}`
    };
    setNodes([...nodes, newNode]);
  };

  /**
   * Cập nhật vị trí node
   * @param {number} nodeId - ID của node
   * @param {number} x - Tọa độ x mới
   * @param {number} y - Tọa độ y mới
   */
  const updateNodePosition = (nodeId, x, y) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  };

  /**
   * Xóa tất cả nodes và edges
   */
  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setMstEdges([]);
    setTotalCost(0);
  };

  /**
   * Sắp xếp lại các điểm tránh trùng nhau
   */
  const rearrangeNodes = () => {
    const NODE_RADIUS = 20;
    // Khoảng cách tối thiểu giữa 2 tâm = 2.5 * bán kính
    const minDistance = NODE_RADIUS * 2.5;
    const newNodes = [...nodes];
    
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const dx = newNodes[i].x - newNodes[j].x;
        const dy = newNodes[i].y - newNodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          // Dịch chuyển node thứ 2 đi một khoảng
          const angle = Math.atan2(dy, dx);
          newNodes[j].x = newNodes[i].x - Math.cos(angle) * minDistance;
          newNodes[j].y = newNodes[i].y - Math.sin(angle) * minDistance;
        }
      }
    }
    
    setNodes(newNodes);
  };

  /**
   * Load dữ liệu đồ thị mẫu
   * @param {Array} sampleNodes - Mảng nodes mẫu
   */
  const loadSampleGraph = (sampleNodes) => {
    setNodes(sampleNodes);
    setMstEdges([]);
    setTotalCost(0);
  };

  const value = {
    nodes,
    edges,
    mstEdges,
    isAnimating,
    totalCost,
    isMenuOpen,
    setNodes,
    setEdges,
    setMstEdges,
    setIsAnimating,
    setTotalCost,
    setIsMenuOpen,
    addNode,
    clearGraph,
    loadSampleGraph,
    updateNodePosition,
    rearrangeNodes
  };

  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  );
};
