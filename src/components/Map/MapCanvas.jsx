import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useGraph } from '../../contexts/GraphContext';
import { calculateDistance } from '../../utils/calculations';
import Node from './Node';
import Edge from './Edge';
import './MapCanvas.css';

/**
 * MapCanvas component - Canvas chính để vẽ đồ thị
 */
const MapCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const { nodes, edges, mstEdges, distanceScale, addNode, updateNodePosition, removeNode, removeEdge, addEdge, updateNodeLabel } = useGraph();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCreatingEdge, setIsCreatingEdge] = useState(false);
  const [edgeStartNode, setEdgeStartNode] = useState(null);
  const [edgeEndPosition, setEdgeEndPosition] = useState(null);
  const [selectedNodeForRename, setSelectedNodeForRename] = useState(null);
  const [newLabel, setNewLabel] = useState('');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  /**
   * Đảm bảo SVG luôn có đúng kích thước
   */
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (!parent) return;
        
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        
        if (width > 0 && height > 0) {
          canvasRef.current.setAttribute('width', width);
          canvasRef.current.setAttribute('height', height);
          console.log('SVG size updated:', width, 'x', height);
        }
      }
    };

    // Delay để đảm bảo DOM đã render xong
    const timer = setTimeout(updateCanvasSize, 500);
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  /**
   * Zoom vào (phóng to)
   */
  const handleZoomIn = () => {
    setZoom(prev => prev + 0.2); // Không giới hạn tối đa
  };

  /**
   * Zoom ra (thu nhỏ)
   */
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.1)); // Tối thiểu 0.1x
  };

  /**
   * Fit screen - phù hợp toàn bộ đồ thị
   */
  const handleFitScreen = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  /**
   * Di chuyển canvas lên
   */
  const handlePanUp = () => {
    setPanY(prev => prev + 50);
  };

  /**
   * Di chuyển canvas xuống
   */
  const handlePanDown = () => {
    setPanY(prev => prev - 50);
  };

  /**
   * Di chuyển canvas sang trái
   */
  const handlePanLeft = () => {
    setPanX(prev => prev + 50);
  };

  /**
   * Di chuyển canvas sang phải
   */
  const handlePanRight = () => {
    setPanX(prev => prev - 50);
  };

  /**
   * Xử lý mouse wheel để zoom
   */
  const handleWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  /**
   * Expose zoom methods thông qua ref
   */
  useImperativeHandle(ref, () => ({
    handleZoomIn,
    handleZoomOut,
    handleFitScreen,
    handlePanUp,
    handlePanDown,
    handlePanLeft,
    handlePanRight
  }));

  /**
   * Xử lý double-click để mở dialog đổi tên
   */
  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Tìm node được double-click
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 20;
    });

    if (clickedNode) {
      setSelectedNodeForRename(clickedNode);
      setNewLabel(clickedNode.label);
    }
  };

  /**
   * Lưu tên mới cho node
   */
  const handleSaveLabel = () => {
    if (selectedNodeForRename && newLabel.trim()) {
      updateNodeLabel(selectedNodeForRename.id, newLabel.trim());
      setSelectedNodeForRename(null);
      setNewLabel('');
    }
  };

  /**
   * Hủy đổi tên
   */
  const handleCancelRename = () => {
    setSelectedNodeForRename(null);
    setNewLabel('');
  };

  /**
   * Xử lý right-click (context menu) để xoá node
   */
  /**
   * Tính toán bán kính click area dựa trên zoom level
   * Khi zoom out, click area sẽ tự động lớn hơn để dễ click
   */
  const getClickRadius = () => {
    return Math.max(25, 30 / zoom); // Tối thiểu 25px, thay đổi theo zoom
  };

  /**
   * Chuyển đổi tọa độ màn hình sang tọa độ canvas (tính zoom/pan)
   */
  const getCanvasCoordinates = (screenX, screenY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = screenX - rect.left;
    const relativeY = screenY - rect.top;
    
    // Chuyển đổi từ screen coords sang canvas coords dựa trên zoom/pan
    const canvasX = (relativeX - panX) / zoom;
    const canvasY = (relativeY - panY) / zoom;
    
    return { canvasX, canvasY };
  };

  /**
   * Tính khoảng cách từ điểm đến đoạn thẳng
   */
  const pointToLineDistance = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    
    const { canvasX: x, canvasY: y } = getCanvasCoordinates(e.clientX, e.clientY);

    // Tìm node được right-click
    const clickRadius = getClickRadius();
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= clickRadius;
    });

    if (clickedNode) {
      removeNode(clickedNode.id);
      return;
    }

    // Kiểm tra click vào cạnh
    const edgeClickRadius = 15; // Bán kính nhận diện cạnh
    
    // Kiểm tra tất cả các cạnh
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const fromNode = nodes[i];
        const toNode = nodes[j];
        
        // Tính khoảng cách từ điểm click đến đoạn thẳng
        const distance = pointToLineDistance(x, y, fromNode.x, fromNode.y, toNode.x, toNode.y);
        
        if (distance <= edgeClickRadius) {
          removeEdge(fromNode.id, toNode.id);
          return;
        }
      }
    }
  };

  /**
   * Xử lý click trên canvas để thêm node
   */
  const handleCanvasClick = (e) => {
    // Không thêm node nếu vừa kéo thả
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    const { canvasX: x, canvasY: y } = getCanvasCoordinates(e.clientX, e.clientY);

    // Kiểm tra có click vào node nào không
    const clickRadius = getClickRadius();
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= clickRadius;
    });

    // Nếu không click vào node nào, kiểm tra và thêm node mới
    if (!clickedNode) {
      const NODE_RADIUS = 20;
      // Khoảng cách tối thiểu giữa 2 tâm = 2.5 * bán kính
      const minDistance = NODE_RADIUS * 2.5;
      
      // Kiểm tra khoảng cách từ tâm điểm mới đến tâm các điểm hiện có
      const isTooClose = nodes.some(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance < minDistance;
      });

      // Chỉ thêm nếu không quá gần các điểm khác
      if (!isTooClose) {
        addNode(x, y);
      }
    }
  };

  /**
   * Xử lý hover trên canvas
   */
  const handleCanvasMouseMove = (e) => {
    const { canvasX: x, canvasY: y } = getCanvasCoordinates(e.clientX, e.clientY);

    // Nếu đang tạo cạnh, cập nhật vị trí đích
    if (isCreatingEdge) {
      setEdgeEndPosition({ x, y });
      return;
    }

    // Nếu đang kéo node, cập nhật vị trí
    if (draggedNode !== null) {
      setIsDragging(true);
      updateNodePosition(draggedNode, x, y);
      return;
    }

    // Tìm node đang hover
    const clickRadius = getClickRadius();
    const node = nodes.find(n => {
      const distance = Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2);
      return distance <= clickRadius;
    });

    setHoveredNode(node?.id ?? null);
  };

  /**
   * Bắt đầu kéo node hoặc tạo cạnh
   */
  const handleMouseDown = (e) => {
    const { canvasX: x, canvasY: y } = getCanvasCoordinates(e.clientX, e.clientY);
    const clickRadius = getClickRadius();

    // Tìm node được click
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= clickRadius;
    });

    if (clickedNode) {
      // Nếu giữ Shift hoặc Ctrl, tạo cạnh
      if (e.shiftKey || e.ctrlKey) {
        setIsCreatingEdge(true);
        setEdgeStartNode(clickedNode);
        setEdgeEndPosition({ x, y });
        e.preventDefault();
      } else {
        // Ngược lại, kéo node
        setDraggedNode(clickedNode.id);
        setIsDragging(false);
        e.preventDefault();
      }
    }
  };

  /**
   * Kết thúc kéo node hoặc tạo cạnh
   */
  const handleMouseUp = (e) => {
    // Nếu đang tạo cạnh
    if (isCreatingEdge && edgeStartNode) {
      const { canvasX: x, canvasY: y } = getCanvasCoordinates(e.clientX, e.clientY);
      const clickRadius = getClickRadius();
      
      // Tìm node đích
      const targetNode = nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance <= clickRadius;
      });
      
      // Nếu tìm thấy node đích và khác node xuất phát, tạo cạnh cong
      if (targetNode && targetNode.id !== edgeStartNode.id) {
        addEdge(edgeStartNode.id, targetNode.id, true); // true = isCurved
      }
      
      setIsCreatingEdge(false);
      setEdgeStartNode(null);
      setEdgeEndPosition(null);
    }
    
    setDraggedNode(null);
  };

  return (
    <div className="map-canvas">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* SVG Canvas */}
      <svg
        ref={canvasRef}
        className={`w-full h-full ${draggedNode !== null ? 'cursor-grabbing' : 'cursor-crosshair'}`}
        onClick={handleCanvasClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ userSelect: 'none', display: 'block' }}
      >
        {/* Group để áp dụng zoom và pan */}
        <g style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: 'transform 0.2s ease-out'
        }}>
          {/* Đường cong khi đang tạo cạnh */}
          {isCreatingEdge && edgeStartNode && edgeEndPosition && (
            <g>
              <path
                d={`M ${edgeStartNode.x} ${edgeStartNode.y} Q ${(edgeStartNode.x + edgeEndPosition.x) / 2} ${(edgeStartNode.y + edgeEndPosition.y) / 2 - 50} ${edgeEndPosition.x} ${edgeEndPosition.y}`}
                stroke="#8b5cf6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
                opacity="0.8"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))'
                }}
              />
              <circle
                cx={edgeEndPosition.x}
                cy={edgeEndPosition.y}
                r="8"
                fill="#8b5cf6"
                opacity="0.6"
              />
            </g>
          )}

          {/* Vẽ các cạnh (màu xám nhạt) */}
          {edges.map((edge) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            const distance = calculateDistance(fromNode, toNode);
            return (
              <Edge
                key={`edge-${edge.from}-${edge.to}`}
                from={fromNode}
                to={toNode}
                isMst={false}
                isDefault={!edge.isCurved}
                isCurved={edge.isCurved || false}
                curveDirection={edge.curveDirection || 1}
                weight={distance}
                distanceScale={distanceScale}
              />
            );
          })}

          {/* Vẽ các cạnh MST (màu xanh lá) */}
          {mstEdges.map((edge, index) => (
            <Edge
              key={`mst-${index}`}
              from={edge.fromNode}
              to={edge.toNode}
              isMst={true}
              weight={edge.weight}
              distanceScale={distanceScale}
              animationDelay={index * 100}
            />
          ))}

          {/* Vẽ các nodes */}
          {nodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              isHovered={hoveredNode === node.id}
              isMstNode={mstEdges.some(e => e.from === node.id || e.to === node.id)}
              isDragging={draggedNode === node.id}
            />
          ))}
        </g>
      </svg>

      {/* Helper text */}
      {nodes.length === 0 && (
        <div className="map-canvas__empty">
          <div className="map-canvas__empty-content">
            <div className="map-canvas__empty-icon">🗺️</div>
            <p className="map-canvas__empty-title">
              Click vào canvas để thêm điểm
            </p>
            <p className="map-canvas__empty-subtitle">
              Hoặc chọn đồ thị mẫu từ menu bên trái
            </p>
          </div>
        </div>
      )}

      {/* Dialog đổi tên node */}
      {selectedNodeForRename && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }} onClick={handleCancelRename}>
          <div style={{
            backgroundColor: '#1e1b4b',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            border: '1px solid #8b5cf6',
            minWidth: '300px',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              margin: '0 0 16px 0',
              color: '#c4b5fd',
              fontSize: '20px',
              fontWeight: '600',
            }}>
              Đổi tên đỉnh
            </h2>
            
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSaveLabel();
              }}
              placeholder="Nhập tên mới..."
              autoFocus
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                backgroundColor: '#312e81',
                border: '1px solid #8b5cf6',
                borderRadius: '6px',
                color: '#e9d5ff',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />

            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={handleCancelRename}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4b5563',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveLabel}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MapCanvas.displayName = 'MapCanvas';

export default MapCanvas;