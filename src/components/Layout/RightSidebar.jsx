import React, { useRef } from 'react';
import { Download, Play, Activity, ListOrdered, Trash2 } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { useMST } from '../../hooks/useMST';
import { pixelsToKm } from '../../utils/calculations';
import Button from '../UI/Button';
import Card from '../UI/Card';
import './RightSidebar.css';

const RightSidebar = ({ mapCanvasRef }) => {
  const {
    nodes,
    edges,
    algorithm,
    totalCost,
    animationTime,
    distanceScale,
    executionLogs,
    primStartNode,
    setMstEdges,
    setTotalCost,
    setAnimationTime,
    setExecutionLogs,
    showToast,
  } = useGraph();

  const { findMST, isAnimating } = useMST(
    nodes, 
    edges, 
    setMstEdges, 
    setTotalCost, 
    setExecutionLogs, 
    distanceScale, 
    primStartNode,
    showToast,
    setAnimationTime
  );

  /**
   * Xóa log thực thi
   */
  const handleClearLogs = () => {
    setExecutionLogs([]);
  };

  /**
   * Xuất đồ thị thành file ảnh PNG
   */
  const handleExportImage = () => {
    const svg = document.querySelector('.map-canvas svg');
    if (!svg) {
      alert('Không tìm thấy đồ thị để xuất!');
      return;
    }

    try {
      // Clone SVG để không ảnh hưởng đến bản gốc
      const clonedSvg = svg.cloneNode(true);
      
      // Lấy kích thước SVG
      const bbox = svg.getBBox();
      const width = bbox.width + 100;
      const height = bbox.height + 100;
      
      // Set viewBox và kích thước cho SVG clone
      clonedSvg.setAttribute('width', width);
      clonedSvg.setAttribute('height', height);
      clonedSvg.setAttribute('viewBox', `${bbox.x - 50} ${bbox.y - 50} ${width} ${height}`);
      
      // Thêm background trắng
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');
      clonedSvg.insertBefore(rect, clonedSvg.firstChild);
      
      // Convert SVG sang string
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Tạo canvas để convert sang PNG
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Load SVG vào image
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(svgUrl);
        
        // Download PNG
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `railway-graph-${new Date().getTime()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      };
      
      img.src = svgUrl;
    } catch (error) {
      console.error('Lỗi khi xuất ảnh:', error);
      alert('Có lỗi xảy ra khi xuất ảnh!');
    }
  };

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar__content">
        {/* Graph Information */}
        <Card
          title="Thông Tin"
          icon={Activity}
          variant="primary"
          collapsible
          defaultOpen
        >
          <div className="right-sidebar__stats">
            <div className="right-sidebar__stat-item">
              <span className="right-sidebar__stat-label">Số trạm:</span>
              <span className="right-sidebar__stat-value">{nodes.length}</span>
            </div>
            <div className="right-sidebar__stat-item">
              <span className="right-sidebar__stat-label">Số đường ray:</span>
              <span className="right-sidebar__stat-value">{edges.length}</span>
            </div>
            <div className="right-sidebar__stat-item highlight">
              <span className="right-sidebar__stat-label">Tổng:</span>
              <span className="right-sidebar__stat-value cost">
                {pixelsToKm(totalCost, distanceScale).toFixed(2)} km
              </span>
            </div>
          </div>
        </Card>

        {/* Execution Logs */}
        <Card
          title="Lịch Sử Thực Thi"
          icon={ListOrdered}
          variant="info"
          collapsible
          defaultOpen
        >
          <div className="execution-logs">
            {executionLogs && executionLogs.length > 0 && (
              <>
                <div className="execution-logs__header">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleClearLogs}
                    icon={Trash2}
                  >
                    Xóa log
                  </Button>
                </div>
                <div className="execution-logs__list">
                  {executionLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`execution-log-item execution-log-item--${log.type}`}
                    >
                      <div className="execution-log-item__header">
                        <span className="execution-log-item__step">
                          {log.type === 'start' ? '🚀' : 
                           log.type === 'end' ? '✓' : 
                           log.type === 'error' ? '✗' : 
                           `#${log.step}`}
                        </span>
                        <span className="execution-log-item__time">{log.timestamp}</span>
                      </div>
                      <div className="execution-log-item__content">
                        <p className="execution-log-item__message">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Execute Algorithm Button */}
        <Button
          variant="success"
          size="lg"
          onClick={() => findMST(algorithm)}
          loading={isAnimating}
          className="right-sidebar__execute-btn"
          icon={Play}
        >
          {isAnimating ? 'Đang chạy...' : 'Thực thi'}
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleExportImage}
          className="right-sidebar__export-btn"
          icon={Download}
          disabled={nodes.length === 0}
        >
          Xuất ảnh PNG
        </Button>
      </div>
    </aside>
  );
};

export default RightSidebar;
