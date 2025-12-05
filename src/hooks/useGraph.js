import { useState, useEffect } from 'react';

/**
 * Custom hook để quản lý đồ thị
 * Bao gồm thêm/xóa nodes, edges và các operations
 */
export const useGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  /**
   * Thêm node mới
   */
  const addNode = (x, y, label) => {
    const newNode = {
      id: nodes.length,
      x,
      y,
      label: label || `V${nodes.length}`
    };
    setNodes([...nodes, newNode]);
    return newNode;
  };

  /**
   * Xóa node theo id
   */
  const removeNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
  };

  /**
   * Update vị trí node
   */
  const updateNodePosition = (nodeId, x, y) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, x, y } : n
    ));
  };

  return {
    nodes,
    edges,
    selectedNode,
    setNodes,
    setEdges,
    setSelectedNode,
    addNode,
    removeNode,
    updateNodePosition
  };
};
