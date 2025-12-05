import React, { useRef, useEffect, useState } from 'react';
import { useGraph } from '../../contexts/GraphContext';
import Node from './Node';
import Edge from './Edge';

/**
 * MapCanvas component - Canvas chính để vẽ đồ thị
 */
const MapCanvas = () => {
  const canvasRef = useRef(null);
  const { nodes, mstEdges, addNode, updateNodePosition } = useGraph();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Xử lý click trên canvas để thêm node
   */
  const handleCanvasClick = (e) => {
    // Không thêm node nếu vừa kéo thả
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Kiểm tra có click vào node nào không
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 20;
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
    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Nếu đang kéo node, cập nhật vị trí
    if (draggedNode !== null) {
      setIsDragging(true);
      
      // Giới hạn trong canvas nhưng vẫn cho phép kéo tự do
      const padding = 20;
      x = Math.max(padding, Math.min(x, rect.width - padding));
      y = Math.max(padding, Math.min(y, rect.height - padding));
      
      updateNodePosition(draggedNode, x, y);
      return;
    }

    // Tìm node đang hover
    const node = nodes.find(n => {
      const distance = Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2);
      return distance <= 20;
    });

    setHoveredNode(node?.id ?? null);
  };

  /**
   * Bắt đầu kéo node
   */
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Tìm node được click
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 20;
    });

    if (clickedNode) {
      setDraggedNode(clickedNode.id);
      setIsDragging(false);
      e.preventDefault();
    }
  };

  /**
   * Kết thúc kéo node
   */
  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  return (
    <div className="flex-1 relative overflow-hidden">
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
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ userSelect: 'none' }}
      >
        {/* Vẽ tất cả các cạnh có thể (màu xám nhạt) */}
        {nodes.map((fromNode, i) =>
          nodes.slice(i + 1).map((toNode) => (
            <Edge
              key={`edge-${fromNode.id}-${toNode.id}`}
              from={fromNode}
              to={toNode}
              isMst={false}
              isDefault={true}
            />
          ))
        )}

        {/* Vẽ các cạnh MST (màu xanh lá) */}
        {mstEdges.map((edge, index) => (
          <Edge
            key={`mst-${index}`}
            from={edge.fromNode}
            to={edge.toNode}
            isMst={true}
            weight={edge.weight}
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
      </svg>

      {/* Helper text */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-purple-300 text-xl font-semibold">
              Click vào canvas để thêm điểm
            </p>
            <p className="text-purple-400 text-sm mt-2">
              Hoặc chọn đồ thị mẫu từ menu bên trái
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapCanvas;
