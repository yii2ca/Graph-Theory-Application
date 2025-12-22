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
  
  // State cho thuật toán MST (Kruskal hoặc Prim)
  const [algorithm, setAlgorithm] = useState('kruskal');
  
  // State cho tỷ lệ chuyển đổi pixel → km (tỷ lệ = km/pixel)
  // Mặc định: 1 pixel = 0.05 km (tăng từ 0.5 lên để giảm số km hiển thị)
  const [distanceScale, setDistanceScale] = useState(0.05);

  // State cho background image
  const [backgroundImage, setBackgroundImage] = useState(null);

  // State cho chế độ thêm đường ray
  const [isAddEdgeMode, setIsAddEdgeMode] = useState(false);
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState(null);

  // State cho các chế độ thao tác khác
  const [isDeleteNodeMode, setIsDeleteNodeMode] = useState(false);
  const [isDeleteEdgeMode, setIsDeleteEdgeMode] = useState(false);
  const [isEditEdgeMode, setIsEditEdgeMode] = useState(false);
  const [isMarkRequiredMode, setIsMarkRequiredMode] = useState(false);

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
      label: `Trạm ${nodes.length + 1}`
    };
    
    // Không tự động tạo cạnh - người dùng sẽ tự kéo đường nối
    setNodes([...nodes, newNode]);
  };

  /**
   * Xóa một node theo ID
   * @param {number} nodeId - ID của node cần xóa
   */
  const removeNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    // Cũng xóa tất cả edges liên quan đến node này
    setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
    setMstEdges(mstEdges.filter(e => e.from !== nodeId && e.to !== nodeId));
  };

  /**
   * Cập nhật trọng số/độ dài của cạnh
   * @param {number} fromId - ID của đỉnh xuất phát
   * @param {number} toId - ID của đỉnh đích
   * @param {number} newWeight - Trọng số mới
   */
  const updateEdgeWeight = (fromId, toId, newWeight) => {
    setEdges(edges.map(edge => {
      if ((edge.from === fromId && edge.to === toId) || 
          (edge.from === toId && edge.to === fromId)) {
        return { ...edge, weight: newWeight };
      }
      return edge;
    }));
  };

  /**
   * Đánh dấu/bỏ đánh dấu cạnh là bắt buộc (phải đi qua)
   * @param {number} fromId - ID của đỉnh xuất phát
   * @param {number} toId - ID của đỉnh đích
   */
  const toggleEdgeRequired = (fromId, toId) => {
    console.log('toggleEdgeRequired called:', fromId, toId);
    setEdges(prevEdges => {
      const newEdges = prevEdges.map(edge => {
        if ((edge.from === fromId && edge.to === toId) || 
            (edge.from === toId && edge.to === fromId)) {
          console.log('Found edge to toggle:', edge, 'isRequired was:', edge.isRequired);
          return { ...edge, isRequired: !edge.isRequired };
        }
        return edge;
      });
      console.log('New edges after toggle:', newEdges);
      return newEdges;
    });
  };

  /**
   * Xóa một cạnh theo ID của 2 đỉnh
   * @param {number} fromId - ID của đỉnh xuất phát
   * @param {number} toId - ID của đỉnh đích
   */
  const removeEdge = (fromId, toId) => {
    // Xóa cạnh (kiểm tra cả 2 chiều vì đồ thị vô hướng)
    setEdges(edges.filter(e => 
      !((e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId))
    ));
    setMstEdges(mstEdges.filter(e => 
      !((e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId))
    ));
  };

  /**
   * Thêm một cạnh mới
   * @param {number} fromId - ID của đỉnh xuất phát
   * @param {number} toId - ID của đỉnh đích
   */
  const addEdge = (fromId, toId) => {
    // Kiểm tra cạnh đã tồn tại chưa
    const edgeExists = edges.some(e => 
      (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    );
    
    if (!edgeExists && fromId !== toId) {
      const edgeId = `${fromId}-${toId}`;
      setEdges([...edges, { from: fromId, to: toId, id: edgeId, controlPoint: null }]);
    }
  };

  /**
   * Cập nhật điểm điều khiển của cạnh (để làm cong)
   * @param {string} edgeId - ID của cạnh
   * @param {Object} controlPoint - Điểm điều khiển {x, y}
   */
  const updateEdgeControlPoint = (edgeId, controlPoint) => {
    setEdges(edges.map(edge => 
      edge.id === edgeId ? { ...edge, controlPoint } : edge
    ));
  };

  /**
   * Cập nhật tên (label) của node
   * @param {number} nodeId - ID của node
   * @param {string} newLabel - Tên mới
   */
  const updateNodeLabel = (nodeId, newLabel) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, label: newLabel } : node
    ));
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
    // Tạo tất cả các cạnh có thể cho đồ thị đầy đủ
    const allEdges = [];
    
    for (let i = 0; i < sampleNodes.length; i++) {
      for (let j = i + 1; j < sampleNodes.length; j++) {
        allEdges.push({
          from: sampleNodes[i].id,
          to: sampleNodes[j].id,
          isCurved: false
        });
      }
    }
    
    setNodes(sampleNodes);
    setEdges(allEdges);
    setMstEdges([]);
    setTotalCost(0);
  };

  /**
   * Bật/tắt chế độ thêm đường ray
   */
  const toggleAddEdgeMode = () => {
    // Tắt các chế độ khác
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    // Toggle chế độ thêm edge
    setIsAddEdgeMode(!isAddEdgeMode);
    setSelectedNodeForEdge(null);
  };

  /**
   * Bật/tắt chế độ xóa trạm
   */
  const toggleDeleteNodeMode = () => {
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsDeleteNodeMode(!isDeleteNodeMode);
  };

  /**
   * Bật/tắt chế độ xóa đường ray
   */
  const toggleDeleteEdgeMode = () => {
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsDeleteEdgeMode(!isDeleteEdgeMode);
  };

  /**
   * Bật/tắt chế độ sửa độ dài đường ray
   */
  const toggleEditEdgeMode = () => {
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsEditEdgeMode(!isEditEdgeMode);
  };

  /**
   * Bật/tắt chế độ đánh dấu đường ray bắt buộc
   */
  const toggleMarkRequiredMode = () => {
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(!isMarkRequiredMode);
  };

  /**
   * Xử lý click vào node khi ở chế độ thêm edge
   */
  const handleNodeClickForEdge = (nodeId) => {
    if (!isAddEdgeMode) return;

    if (selectedNodeForEdge === null) {
      // Chọn node đầu tiên
      setSelectedNodeForEdge(nodeId);
    } else {
      // Chọn node thứ hai, tạo edge
      if (selectedNodeForEdge !== nodeId) {
        addEdge(selectedNodeForEdge, nodeId);
      }
      // Reset để tiếp tục thêm edge khác (không tắt mode)
      setSelectedNodeForEdge(null);
    }
  };

  const value = {
    nodes,
    edges,
    mstEdges,
    isAnimating,
    totalCost,
    isMenuOpen,
    algorithm,
    distanceScale,
    backgroundImage,
    isAddEdgeMode,
    selectedNodeForEdge,
    isDeleteNodeMode,
    isDeleteEdgeMode,
    isEditEdgeMode,
    isMarkRequiredMode,
    setNodes,
    setEdges,
    setMstEdges,
    setIsAnimating,
    setTotalCost,
    setIsMenuOpen,
    setAlgorithm,
    setDistanceScale,
    setBackgroundImage,
    addNode,
    removeNode,
    removeEdge,
    addEdge,
    updateEdgeControlPoint,
    updateNodeLabel,
    clearGraph,
    loadSampleGraph,
    updateNodePosition,
    rearrangeNodes,
    toggleAddEdgeMode,
    handleNodeClickForEdge,
    toggleDeleteNodeMode,
    toggleDeleteEdgeMode,
    toggleEditEdgeMode,
    toggleMarkRequiredMode,
    updateEdgeWeight,
    toggleEdgeRequired
  };

  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  );
};