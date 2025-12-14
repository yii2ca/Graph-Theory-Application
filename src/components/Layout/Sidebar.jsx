import React, { useState } from 'react';
import { Activity, Network, MapPin, Plus, Trash2 } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { sampleGraphs } from '../../data';
import { pixelsToKm } from '../../utils/calculations';
import Card from '../UI/Card';
import Button from '../UI/Button';
import './Sidebar.css';

const Sidebar = () => {
  const {
    nodes,
    edges,
    mstEdges,
    totalCost,
    isMenuOpen,
    distanceScale,
    backgroundImage,
    setDistanceScale,
    setBackgroundImage,
    loadSampleGraph,
    setNodes,
    setEdges,
    clearGraph,
    edges: allEdges = [],
  } = useGraph();

  const [nodeCount, setNodeCount] = useState(5);

  if (!isMenuOpen) return null;

  const createRandomGraph = () => {
    const newNodes = [];
    const canvas = document.querySelector('svg');
    if (!canvas) {
      alert('SVG canvas không tìm thấy!');
      return;
    }

    // Lấy kích thước từ parent container
    const parent = canvas.parentElement;
    let canvasWidth = parent?.clientWidth || 0;
    let canvasHeight = parent?.clientHeight || 0;
    
    console.log('Parent size:', canvasWidth, 'x', canvasHeight);
    console.log('Canvas attributes - width:', canvas.getAttribute('width'), 'height:', canvas.getAttribute('height'));
    
    // Nếu parent không có kích thước, lấy từ canvas element
    if (!canvasWidth || !canvasHeight) {
      const rect = canvas.getBoundingClientRect();
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      console.log('Using canvas BoundingClientRect:', canvasWidth, 'x', canvasHeight);
    }
    
    // Fallback - sử dụng window size
    if (!canvasWidth || canvasWidth <= 0) {
      canvasWidth = window.innerWidth - 350; // Trừ sidebar
    }
    if (!canvasHeight || canvasHeight <= 0) {
      canvasHeight = window.innerHeight - 100; // Trừ header
    }
    
    console.log('Final canvas size:', canvasWidth, 'x', canvasHeight);
    
    const NODE_RADIUS = 20;
    const padding = 50; // Lớn hơn để tránh mép
    
    // Kiểm tra vùng sinh điểm có hợp lệ không
    const availableWidth = canvasWidth - 2 * padding;
    const availableHeight = canvasHeight - 2 * padding;
    
    console.log('Available space for nodes:', availableWidth, 'x', availableHeight);
    
    if (availableWidth <= 0 || availableHeight <= 0) {
      console.error('Canvas quá nhỏ để sinh điểm!');
      alert('Canvas quá nhỏ! Vui lòng mở rộng cửa sổ trình duyệt.');
      return;
    }
    
    // Điều chỉnh minDistance dựa trên số lượng nodes
    let minDistance = NODE_RADIUS * 2.5;
    if (nodeCount > 10) minDistance = NODE_RADIUS * 1.8;
    if (nodeCount > 15) minDistance = NODE_RADIUS * 1.3;

    console.log('Creating', nodeCount, 'nodes with minDistance:', minDistance);

    const generatePoint = (attempts = 0) => {
      if (attempts > 500) {
        const point = {
          x: padding + Math.random() * availableWidth,
          y: padding + Math.random() * availableHeight,
        };
        console.log('Fallback point:', point);
        return point;
      }
      
      const point = {
        x: padding + Math.random() * availableWidth,
        y: padding + Math.random() * availableHeight,
      };

      const isFarEnough = newNodes.every((node) => {
        const dx = point.x - node.x;
        const dy = point.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance >= minDistance;
      });

      return isFarEnough ? point : generatePoint(attempts + 1);
    };

    for (let i = 0; i < nodeCount; i++) {
      const point = generatePoint();
      if (point) {
        newNodes.push({
          id: i,
          x: point.x,
          y: point.y,
          label: `Trạm ${i + 1}`,
        });
        console.log(`Node ${i}: x=${point.x.toFixed(0)}, y=${point.y.toFixed(0)}`);
      }
    }

    console.log('Total nodes created:', newNodes.length);
    
    // Tạo ngẫu nhiên các cạnh
    const newEdges = [];
    
    // Xác suất có cạnh giữa 2 đỉnh bất kỳ (40-60%)
    const edgeProbability = 0.4 + Math.random() * 0.2; // Random từ 0.4 đến 0.6
    
    console.log('Edge probability:', (edgeProbability * 100).toFixed(1) + '%');
    
    // Duyệt qua tất cả các cặp đỉnh
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        // Ngẫu nhiên quyết định có tạo cạnh hay không
        if (Math.random() < edgeProbability) {
          newEdges.push({
            from: newNodes[i].id,
            to: newNodes[j].id,
            isCurved: false
          });
        }
      }
    }
    
    // Đảm bảo đồ thị liên thông (mỗi đỉnh có ít nhất 1 cạnh)
    const connectedNodes = new Set();
    newEdges.forEach(edge => {
      connectedNodes.add(edge.from);
      connectedNodes.add(edge.to);
    });
    
    // Nếu có đỉnh cô lập, kết nối với đỉnh gần nhất
    newNodes.forEach(node => {
      if (!connectedNodes.has(node.id)) {
        // Tìm đỉnh gần nhất
        let nearestNode = null;
        let minDistance = Infinity;
        
        newNodes.forEach(otherNode => {
          if (otherNode.id !== node.id) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
              minDistance = distance;
              nearestNode = otherNode;
            }
          }
        });
        
        if (nearestNode) {
          newEdges.push({
            from: node.id,
            to: nearestNode.id,
            isCurved: false
          });
          console.log(`Connected isolated node ${node.id} to ${nearestNode.id}`);
        }
      }
    });
    
    console.log('Total edges created:', newEdges.length);
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__content">
        {/* Graph Information */}
        <Card
          title="Thông Tin"
          icon={Activity}
          variant="primary"
          collapsible
          defaultOpen
        >
          <div className="sidebar__stats">
            <div className="sidebar__stat-item">
              <span className="sidebar__stat-label">Số đỉnh:</span>
              <span className="sidebar__stat-value">{nodes.length}</span>
            </div>
            <div className="sidebar__stat-item">
              <span className="sidebar__stat-label">Số cạnh:</span>
              <span className="sidebar__stat-value">{allEdges.length}</span>
            </div>
            <div className="sidebar__stat-item">
              <span className="sidebar__stat-label">Cạnh MST:</span>
              <span className="sidebar__stat-value">{mstEdges.length}</span>
            </div>
            <div className="sidebar__stat-item highlight">
              <span className="sidebar__stat-label">Tổng chi phí:</span>
              <span className="sidebar__stat-value cost">
                {pixelsToKm(totalCost, distanceScale)} km
              </span>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card
          title="Cài Đặt Đồ Thị"
          icon={Plus}
          variant="secondary"
          collapsible
          defaultOpen
        >
          <div className="sidebar__settings">
            <div className="sidebar__input-group">
              <label className="sidebar__input-label">Số đỉnh:</label>
              <input
                type="number"
                min="3"
                max="20"
                value={nodeCount}
                onChange={(e) => setNodeCount(Math.max(3, parseInt(e.target.value) || 3))}
                className="sidebar__input"
              />
            </div>

            <div className="sidebar__input-group">
              <label className="sidebar__input-label">
                Tỷ lệ (km/pixel): {distanceScale}
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={distanceScale}
                onChange={(e) => setDistanceScale(parseFloat(e.target.value))}
                className="sidebar__input"
              />
              <small className="sidebar__helper">
                Ví dụ: 0.5 km/pixel = 1 pixel = 0.5 km
              </small>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={createRandomGraph}
              className="sidebar__full-btn"
            >
              Tạo Ngẫu Nhiên
            </Button>

            <Button
              variant="danger"
              size="md"
              onClick={clearGraph}
              className="sidebar__full-btn"
            >
              Xóa Tất Cả
            </Button>
          </div>
        </Card>

        {/* Import Image */}
        <Card
          title="📷 Import Ảnh Bản Đồ"
          variant="secondary"
          collapsible
          defaultOpen
        >
          <div className="sidebar__image-upload">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setBackgroundImage(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label htmlFor="image-upload">
              <Button
                variant="secondary"
                size="md"
                onClick={() => document.getElementById('image-upload').click()}
                className="sidebar__full-btn"
              >
                📁 Chọn Ảnh
              </Button>
            </label>
            {backgroundImage && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setBackgroundImage(null)}
                className="sidebar__full-btn"
                style={{ marginTop: '8px' }}
              >
                🗑️ Xóa Ảnh
              </Button>
            )}
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginTop: '12px',
              lineHeight: '1.5'
            }}>
              💡 Sau khi import ảnh, click trên ảnh để đặt các trạm (nodes), hệ thống sẽ tự động tạo kết nối.
            </p>
          </div>
        </Card>
      </div>
    </aside>
  );
};

export default Sidebar;
