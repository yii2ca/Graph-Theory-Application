import React, { useState } from 'react';
import { Activity, Plus, Map, MapPin, HelpCircle, GitBranch, Trash2, Edit3, Lock, Play } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { pixelsToKm } from '../../utils/calculations';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import './Sidebar.css';

const Sidebar = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const {
    nodes,
    mstEdges,
    totalCost,
    isMenuOpen,
    distanceScale,
    backgroundImage,
    algorithm = 'kruskal',
    isAddEdgeMode,
    isDeleteNodeMode,
    isDeleteEdgeMode,
    isEditEdgeMode,
    isMarkRequiredMode,
    primStartNode,
    isSelectStartNodeMode,
    setAlgorithm,
    setDistanceScale,
    setBackgroundImage,
    clearGraph,
    addNode,
    toggleAddEdgeMode,
    toggleDeleteNodeMode,
    toggleDeleteEdgeMode,
    toggleEditEdgeMode,
    toggleMarkRequiredMode,
    toggleSelectStartNodeMode,
    setExecutionLogs,
    edges: allEdges = [],
  } = useGraph();

  // Thêm trạm mới ở vị trí ngẫu nhiên trên map
  const handleAddStation = () => {
    // Tạo vị trí ngẫu nhiên trong vùng map (tránh vị trí quá gần biên)
    const minX = 100;
    const maxX = 800;
    const minY = 100;
    const maxY = 500;
    
    const x = Math.floor(Math.random() * (maxX - minX) + minX);
    const y = Math.floor(Math.random() * (maxY - minY) + minY);
    
    addNode(x, y);
  };

  if (!isMenuOpen) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar__content">
        {/* Algorithm Selection */}
        <Card
          title="Thuật Toán"
          icon={Activity}
          variant="primary"
          collapsible
          defaultOpen
        >
          <div className="sidebar__settings">
            <div className="sidebar__input-group">
              <label className="sidebar__input-label">
                Chọn thuật toán:
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm?.(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all var(--transition-base)'
                }}
              >
                <option value="kruskal">Kruskal</option>
                <option value="prim">Prim</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card
          title="Thao Tác"
          icon={Plus}
          variant="secondary"
          collapsible
          defaultOpen
        >
          <div className="sidebar__settings">
            <Button
              variant="primary"
              size="md"
              onClick={handleAddStation}
              className="sidebar__full-btn"
              icon={MapPin}
            >
              Thêm Trạm
            </Button>

            <Button
              variant={isAddEdgeMode ? "success" : "secondary"}
              size="md"
              onClick={toggleAddEdgeMode}
              className="sidebar__full-btn"
              icon={GitBranch}
            >
              {isAddEdgeMode ? "Đang chọn trạm..." : "Thêm Đường Ray"}
            </Button>

            <Button
              variant={isDeleteNodeMode ? "danger" : "secondary"}
              size="md"
              onClick={toggleDeleteNodeMode}
              className="sidebar__full-btn"
              icon={Trash2}
            >
              {isDeleteNodeMode ? "Đang xóa trạm..." : "Xóa Trạm"}
            </Button>

            <Button
              variant={isDeleteEdgeMode ? "danger" : "secondary"}
              size="md"
              onClick={toggleDeleteEdgeMode}
              className="sidebar__full-btn"
              icon={Trash2}
            >
              {isDeleteEdgeMode ? "Đang xóa đường..." : "Xóa Đường Ray"}
            </Button>

            <Button
              variant={isEditEdgeMode ? "warning" : "secondary"}
              size="md"
              onClick={toggleEditEdgeMode}
              className="sidebar__full-btn"
              icon={Edit3}
            >
              {isEditEdgeMode ? "Đang sửa..." : "Sửa Độ Dài"}
            </Button>

            <Button
              variant={isMarkRequiredMode ? "success" : "secondary"}
              size="md"
              onClick={toggleMarkRequiredMode}
              className="sidebar__full-btn"
              icon={Lock}
            >
              {isMarkRequiredMode ? "Đang đánh dấu..." : "Đánh Dấu Bắt Buộc"}
            </Button>

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
              variant="danger"
              size="md"
              onClick={() => {
                clearGraph();
                setExecutionLogs([]);
              }}
              className="sidebar__full-btn"
            >
              Xóa Tất Cả
            </Button>
          </div>
        </Card>

        {/* Import Image */}
        <Card
          title="Import Bản Đồ"
          icon={Map}
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
                Chọn Ảnh
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
          </div>
        </Card>

        {/* Help Button */}
        <Button
          variant="secondary"
          size="md"
          icon={HelpCircle}
          onClick={() => setIsHelpOpen(true)}
          className="sidebar__full-btn"
        >
          Hướng dẫn
        </Button>
      </div>

      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="📖 Hướng Dẫn Sử Dụng"
        size="lg"
      >
        <div className="help-content">
          <div className="help-section">
            <h3>🗺️ Import Ảnh Bản Đồ:</h3>
            <ul>
              <li><strong>Chọn ảnh:</strong> Click "📁 Chọn Ảnh" ở Sidebar để import ảnh bản đồ</li>
              <li><strong>Xóa ảnh:</strong> Click "🗑️ Xóa Ảnh" để xóa background</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>📥 Thêm Đỉnh (Trạm):</h3>
            <ul>
              <li><strong>Click chuột trái:</strong> Click vào bất kỳ đâu trên map để thêm một đỉnh mới</li>
              <li><strong>Kéo thả đỉnh:</strong> Click và kéo để di chuyển vị trí</li>
              <li><strong>Xóa đỉnh:</strong> Click chuột phải (Right-click) vào đỉnh</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>⛓ Thêm Cạnh (Đường Ray):</h3>
            <ul>
              <li><strong>Ké đường nối:</strong> Nhấn giữ Shift + Kéo từ đỉnh này sang đỉnh khác</li>
              <li><strong>Uốn cạnh:</strong> Hover vào cạnh để hiển điểm điều khiển, kéo để uốn cong</li>
              <li><strong>Xem khoảng cách:</strong> Hover vào cạnh để xem khoảng cách tính bằng km</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>⚙️ Cài Đặt:</h3>
            <ul>
              <li><strong>Tỷ lệ (km/pixel):</strong> Điều chỉnh tỷ lệ chuyển đổi pixel sang km</li>
              <li><strong>Thuật toán:</strong> Chọn giữa Kruskal và Prim</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>🌟 Chạy Thuật Toán MST:</h3>
            <ul>
              <li><strong>Thực thi:</strong> Click nút "▶ Thực thi" ở Header</li>
              <li><strong>Kết quả:</strong> Các cạnh MST sẽ được tô màu xanh lá</li>
              <li><strong>Tổng chi phí:</strong> Hiển thị trong bảng "Thông Tin"</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>🛠 Công cụ:</h3>
            <ul>
              <li><strong>Zoom:</strong> Sử dụng các nút +/- hoặc con lăn chuột</li>
              <li><strong>Pan:</strong> Kéo thả map bằng chuột hoặc dùng mũi tên</li>
              <li><strong>Fit Screen:</strong> Tự động zoom vừa vặn toàn bộ đồ thị</li>
            </ul>
          </div>
        </div>
      </Modal>
    </aside>
  );
};

export default Sidebar;
