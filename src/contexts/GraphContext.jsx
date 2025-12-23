import React, { createContext, useContext, useState } from 'react';
import { isSelfLoop, isDuplicateEdge } from '../algorithms/graphUtils';

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
  
  // State cho animation time
  const [animationTime, setAnimationTime] = useState(0);
  
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
  const [isAddNodeMode, setIsAddNodeMode] = useState(false);
  const [isDeleteNodeMode, setIsDeleteNodeMode] = useState(false);
  const [isDeleteEdgeMode, setIsDeleteEdgeMode] = useState(false);
  const [isEditEdgeMode, setIsEditEdgeMode] = useState(false);
  const [isMarkRequiredMode, setIsMarkRequiredMode] = useState(false);

  // State cho execution logs (lịch sử thực thi thuật toán)
  const [executionLogs, setExecutionLogs] = useState([]);

  // State cho đỉnh khởi đầu của thuật toán Prim
  const [primStartNode, setPrimStartNode] = useState(null);
  const [isSelectStartNodeMode, setIsSelectStartNodeMode] = useState(false);

  // State cho Toast notifications
  const [toasts, setToasts] = useState([]);

  // State cho Undo/Redo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 50; // Giới hạn lịch sử để tránh tốn bộ nhớ

  /**
   * Hiển thị toast notification
   * @param {string} message - Nội dung thông báo
   * @param {string} type - Loại: success, error, warning, info
   */
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  /**
   * Xóa toast notification
   * @param {number} id - ID của toast cần xóa
   */
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  /**
   * Lưu trạng thái hiện tại vào history
   */
  const saveToHistory = () => {
    const currentState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };

    // Xóa các state sau historyIndex hiện tại (khi undo rồi thực hiện hành động mới)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);

    // Giới hạn kích thước history
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  /**
   * Hoàn tác (Undo)
   */
  const undo = () => {
    if (historyIndex <= 0) {
      showToast('Không còn thao tác để hoàn tác', 'info');
      return;
    }

    const newIndex = historyIndex - 1;
    const previousState = history[newIndex];
    
    setNodes(JSON.parse(JSON.stringify(previousState.nodes)));
    setEdges(JSON.parse(JSON.stringify(previousState.edges)));
    setHistoryIndex(newIndex);
    
    showToast('Đã hoàn tác', 'success');
  };

  /**
   * Làm lại (Redo)
   */
  const redo = () => {
    if (historyIndex >= history.length - 1) {
      showToast('Không còn thao tác để làm lại', 'info');
      return;
    }

    const newIndex = historyIndex + 1;
    const nextState = history[newIndex];
    
    setNodes(JSON.parse(JSON.stringify(nextState.nodes)));
    setEdges(JSON.parse(JSON.stringify(nextState.edges)));
    setHistoryIndex(newIndex);
    
    showToast('Đã làm lại', 'success');
  };

  /**
   * Thêm node mới vào đồ thị
   * @param {number} x - Tọa độ x
   * @param {number} y - Tọa độ y
   * @param {string} label - Tên trạm (optional)
   */
  const addNode = (x, y, label = null) => {
    const MAX_NODES = 50;
    
    // Kiểm tra giới hạn số lượng node
    if (nodes.length >= MAX_NODES) {
      showToast(`Đã đạt giới hạn tối đa ${MAX_NODES} trạm!`, 'error');
      return false;
    }
    
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
      return false;
    }

    const newNode = {
      id: nodes.length,
      x,
      y,
      label: label || `Trạm ${nodes.length + 1}`
    };
    
    // Không tự động tạo cạnh - người dùng sẽ tự kéo đường nối
    setNodes([...nodes, newNode]);
    saveToHistory(); // Lưu vào history sau khi thêm node
    return true;
  };

  /**
   * Thêm nhiều node cùng lúc với vị trí ngẫu nhiên
   * @param {number} count - Số lượng node cần thêm
   * @param {Array} names - Mảng tên cho các node (optional)
   */
  const addMultipleNodes = (count, names = null) => {
    const MAX_NODES = 50;
    
    // Kiểm tra giới hạn tổng số node
    if (nodes.length >= MAX_NODES) {
      showToast(`Đã đạt giới hạn tối đa ${MAX_NODES} trạm!`, 'error');
      return 0;
    }
    
    // Giới hạn số lượng có thể thêm
    const maxCanAdd = MAX_NODES - nodes.length;
    if (count > maxCanAdd) {
      showToast(`Chỉ có thể thêm thêm ${maxCanAdd} trạm nữa (đang có ${nodes.length}/${MAX_NODES})`, 'warning');
      count = maxCanAdd;
    }
    
    const newNodes = [];
    const NODE_RADIUS = 20;
    const minDistance = NODE_RADIUS * 2.5;
    
    // Vùng canvas để tạo nodes (tránh quá sát biên)
    const minX = 100;
    const maxX = 1000;
    const minY = 100;
    const maxY = 600;
    
    let attempts = 0;
    const maxAttempts = count * 100; // Giới hạn số lần thử

    for (let i = 0; i < count && attempts < maxAttempts; attempts++) {
      // Tạo vị trí ngẫu nhiên
      const x = Math.floor(Math.random() * (maxX - minX) + minX);
      const y = Math.floor(Math.random() * (maxY - minY) + minY);
      
      // Kiểm tra khoảng cách với nodes hiện có và nodes mới
      const allNodes = [...nodes, ...newNodes];
      const isTooClose = allNodes.some(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });

      if (!isTooClose) {
        const nodeId = nodes.length + newNodes.length;
        const label = names && names[newNodes.length] ? names[newNodes.length] : `Trạm ${nodeId + 1}`;
        
        newNodes.push({
          id: nodeId,
          x,
          y,
          label
        });
        
        // Đã thêm đủ số lượng
        if (newNodes.length >= count) break;
      }
    }

    if (newNodes.length < count) {
      showToast(`Chỉ có thể thêm ${newNodes.length}/${count} trạm do không đủ không gian`, 'warning');
    } else {
      showToast(`Đã thêm ${newNodes.length} trạm mới`, 'success');
    }

    setNodes([...nodes, ...newNodes]);
    saveToHistory(); // Lưu vào history sau khi thêm nhiều node
    return newNodes.length;
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
    saveToHistory(); // Lưu vào history sau khi xóa node
  };

  /**
   * Cập nhật trọng số/độ dài của cạnh
   * @param {number} fromId - ID của đỉnh xuất phát
   * @param {number} toId - ID của đỉnh đích
   * @param {number} newWeight - Trọng số mới
   */
  const updateEdgeWeight = (fromId, toId, newWeight) => {
    console.log('updateEdgeWeight called with:', fromId, toId, newWeight);
    setEdges(prevEdges => {
      const updatedEdges = prevEdges.map(edge => {
        if ((edge.from === fromId && edge.to === toId) || 
            (edge.from === toId && edge.to === fromId)) {
          console.log('Found edge to update:', edge);
          return { ...edge, weight: newWeight };
        }
        return edge;
      });
      console.log('Updated edges:', updatedEdges);
      return updatedEdges;
    });
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
    saveToHistory(); // Lưu vào history sau khi xóa cạnh
  };

  /**
   * Thêm một cạnh mới
   * @param {number} fromId - ID của đỉnh xuất phát
   * @param {number} toId - ID của đỉnh đích
   */
  const addEdge = (fromId, toId) => {
    // Kiểm tra self-loop
    if (isSelfLoop(fromId, toId)) {
      showToast('Không thể tạo đường nối từ trạm đến chính nó!', 'error');
      return false;
    }

    // Kiểm tra duplicate edge
    if (isDuplicateEdge(fromId, toId, edges)) {
      showToast('Đường nối này đã tồn tại!', 'warning');
      return false;
    }

    const edgeId = `${fromId}-${toId}`;
    const newEdge = {
      from: fromId,
      to: toId,
      id: edgeId,
      controlPoint: null,
      isRequired: false
    };

    setEdges([...edges, newEdge]);
    saveToHistory(); // Lưu vào history sau khi thêm cạnh
    showToast('Đã thêm đường ray mới', 'success');
    return true;
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
   * Bật/tắt chế độ thêm trạm
   */
  const toggleAddNodeMode = () => {
    // Tắt các chế độ khác
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsSelectStartNodeMode(false);
    // Toggle chế độ thêm node
    setIsAddNodeMode(!isAddNodeMode);
  };

  /**
   * Bật/tắt chế độ thêm đường ray
   */
  const toggleAddEdgeMode = () => {
    // Tắt các chế độ khác
    setIsAddNodeMode(false);
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsSelectStartNodeMode(false);
    // Toggle chế độ thêm edge
    setIsAddEdgeMode(!isAddEdgeMode);
    setSelectedNodeForEdge(null);
  };

  /**
   * Bật/tắt chế độ xóa trạm
   */
  const toggleDeleteNodeMode = () => {
    setIsAddNodeMode(false);
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsSelectStartNodeMode(false);
    setIsDeleteNodeMode(!isDeleteNodeMode);
  };

  /**
   * Bật/tắt chế độ xóa đường ray
   */
  const toggleDeleteEdgeMode = () => {
    setIsAddNodeMode(false);
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsSelectStartNodeMode(false);
    setIsDeleteEdgeMode(!isDeleteEdgeMode);
  };

  /**
   * Bật/tắt chế độ sửa độ dài đường ray
   */
  const toggleEditEdgeMode = () => {
    setIsAddNodeMode(false);
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsSelectStartNodeMode(false);
    setIsEditEdgeMode(!isEditEdgeMode);
  };

  /**
   * Bật/tắt chế độ đánh dấu đường ray bắt buộc
   */
  const toggleMarkRequiredMode = () => {
    setIsAddNodeMode(false);
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsSelectStartNodeMode(false);
    setIsMarkRequiredMode(!isMarkRequiredMode);
  };

  /**
   * Bật/tắt chế độ chọn đỉnh khởi đầu cho Prim
   */
  const toggleSelectStartNodeMode = () => {
    setIsAddNodeMode(false);
    setIsAddEdgeMode(false);
    setSelectedNodeForEdge(null);
    setIsDeleteNodeMode(false);
    setIsDeleteEdgeMode(false);
    setIsEditEdgeMode(false);
    setIsMarkRequiredMode(false);
    setIsSelectStartNodeMode(!isSelectStartNodeMode);
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

  /**
   * Xử lý click vào node khi ở chế độ chọn đỉnh khởi đầu
   */
  const handleNodeClickForStartNode = (nodeId) => {
    if (!isSelectStartNodeMode) return;
    setPrimStartNode(nodeId);
    setIsSelectStartNodeMode(false);
  };

  const value = {
    nodes,
    edges,
    mstEdges,
    isAnimating,
    totalCost,
    animationTime,
    isMenuOpen,
    algorithm,
    distanceScale,
    backgroundImage,
    isAddNodeMode,
    isAddEdgeMode,
    selectedNodeForEdge,
    isDeleteNodeMode,
    isDeleteEdgeMode,
    isEditEdgeMode,
    isMarkRequiredMode,
    executionLogs,
    primStartNode,
    isSelectStartNodeMode,
    toasts,
    history,
    historyIndex,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setNodes,
    setEdges,
    setMstEdges,
    setIsAnimating,
    setTotalCost,
    setAnimationTime,
    setIsMenuOpen,
    setAlgorithm,
    setDistanceScale,
    setBackgroundImage,
    setExecutionLogs,
    showToast,
    removeToast,
    undo,
    redo,
    addNode,
    addMultipleNodes,
    removeNode,
    removeEdge,
    addEdge,
    updateEdgeControlPoint,
    updateNodeLabel,
    clearGraph,
    loadSampleGraph,
    updateNodePosition,
    rearrangeNodes,
    toggleAddNodeMode,
    toggleAddEdgeMode,
    handleNodeClickForEdge,
    toggleDeleteNodeMode,
    toggleDeleteEdgeMode,
    toggleEditEdgeMode,
    toggleMarkRequiredMode,
    updateEdgeWeight,
    toggleEdgeRequired,
    toggleSelectStartNodeMode,
    handleNodeClickForStartNode,
    setPrimStartNode
  };

  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  );
};