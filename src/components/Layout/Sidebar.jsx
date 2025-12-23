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
                 Xóa Ảnh
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
        title="Hướng Dẫn Sử Dụng"
        size="lg"
      >
        <div className="help-content">
          <div className="help-section">
            <h3>Import Ảnh Bản Đồ</h3>
            <ul>
              <li><strong>Chọn ảnh:</strong> Click nút "Chọn Ảnh" trong mục "Import Bản Đồ" ở Sidebar</li>
              <li><strong>Xóa ảnh:</strong> Click "Xóa Ảnh" để xóa background</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Thao Tác Với Trạm (Node)</h3>
            <ul>
              <li><strong>Thêm trạm tự động:</strong> Click nút "Thêm Trạm" ở Sidebar (tạo trạm ở vị trí ngẫu nhiên)</li>
              <li><strong>Thêm trạm thủ công:</strong> Click trái vào bất kỳ đâu trên canvas</li>
              <li><strong>Di chuyển trạm:</strong> Kéo thả trạm bằng chuột trái</li>
              <li><strong>Đổi tên trạm:</strong> Double-click vào trạm → nhập tên → Enter hoặc click bên ngoài</li>
              <li><strong>Xóa trạm cách 1:</strong> Click chuột phải (Right-click) vào trạm</li>
              <li><strong>Xóa trạm cách 2:</strong> Bật chế độ "Xóa Trạm" ở Sidebar → click vào trạm cần xóa</li>
              <li><strong>Xem tên:</strong> Hover vào trạm để hiển thị tooltip</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Thao Tác Với Đường Ray (Edge)</h3>
            <ul>
              <li><strong>Thêm đường ray cách 1:</strong> Nhấn giữ <kbd>Shift</kbd> + kéo từ trạm A sang trạm B</li>
              <li><strong>Thêm đường ray cách 2:</strong> Click nút "Thêm Đường Ray" ở Sidebar → click trạm đầu → click trạm cuối</li>
              <li><strong>Uốn cong đường:</strong> Hover vào đường → kéo chấm tròn trắng ở giữa</li>
              <li><strong>Sửa độ dài:</strong> Click nút "Sửa Độ Dài" ở Sidebar → click vào đường → nhập giá trị mới</li>
              <li><strong>Xóa đường ray:</strong> Click nút "Xóa Đường Ray" ở Sidebar → click vào đường cần xóa</li>
              <li><strong>Đánh dấu bắt buộc:</strong> Click nút "Đánh Dấu Bắt Buộc" → click vào đường (đường bắt buộc sẽ có màu đỏ)</li>
              <li><strong>Xem khoảng cách:</strong> Hover vào đường để xem số km</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Các Nút Chức Năng (Sidebar)</h3>
            <ul>
              <li><strong>Thêm Trạm:</strong> Tạo trạm mới ở vị trí ngẫu nhiên</li>
              <li><strong>Thêm Đường Ray:</strong> Chế độ chọn 2 trạm để nối đường</li>
              <li><strong>Xóa Trạm:</strong> Chế độ xóa trạm (click vào trạm để xóa)</li>
              <li><strong>Xóa Đường Ray:</strong> Chế độ xóa đường (click vào đường để xóa)</li>
              <li><strong>Sửa Độ Dài:</strong> Chế độ chỉnh sửa khoảng cách của đường</li>
              <li><strong>Đánh Dấu Bắt Buộc:</strong> Đánh dấu đường phải có trong kết quả MST</li>
              <li><strong>Xóa Tất Cả:</strong> Xóa toàn bộ đồ thị và kết quả</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Cài Đặt</h3>
            <ul>
              <li><strong>Thuật toán:</strong> Chọn giữa Kruskal hoặc Prim</li>
              <li><strong>Tỷ lệ (km/pixel):</strong> Điều chỉnh từ 0.1 đến 2.0 (mặc định 0.5)</li>
              <li><em>Ví dụ: 0.5 km/pixel nghĩa là 100 pixel = 50 km</em></li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Chạy Thuật Toán MST</h3>
            <ul>
              <li><strong>Thực thi:</strong> Click nút "Thực thi" ở Header (phía trên cùng)</li>
              <li><strong>Kết quả:</strong> Các đường ray MST sẽ được tô màu xanh lá</li>
              <li><strong>Tổng chi phí:</strong> Hiển thị ở bảng "Thống Kê" bên phải</li>
              <li><strong>Thời gian thực thi:</strong> Hiển thị ở bảng "Thống Kê"</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Công Cụ Toolbar (Góc Trái Màn Hình)</h3>
            <ul>
              <li><strong>Phóng to:</strong> Click nút + hoặc cuộn chuột lên</li>
              <li><strong>Thu nhỏ:</strong> Click nút - hoặc cuộn chuột xuống</li>
              <li><strong>Vừa màn hình:</strong> Click nút maximize để tự động zoom vừa vặn</li>
              <li><strong>Di chuyển map:</strong> Sử dụng các nút mũi tên</li>
              <li><strong>Tải ảnh:</strong> Click nút download để lưu đồ thị dạng PNG</li>
              <li><strong>Kéo toolbar:</strong> Kéo biểu tượng grip để di chuyển toolbar</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Phím Tắt</h3>
            <ul>
              <li><kbd>Shift</kbd> + Kéo chuột: Tạo đường nối giữa 2 trạm</li>
              <li><kbd>Ctrl</kbd> + Scroll chuột: Zoom in/out</li>
              <li><strong>Double-click</strong> vào trạm: Đổi tên trạm</li>
              <li><strong>Right-click</strong> vào trạm: Xóa trạm</li>
              <li><strong>Click trái</strong> vào canvas: Thêm trạm mới</li>
              <li><strong>Kéo thả</strong> trạm: Di chuyển vị trí</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>MST (Minimum Spanning Tree) là gì?</h3>
            <p>
              Cây khung nhỏ nhất - kết nối tất cả trạm với tổng chiều dài đường ray ngắn nhất:
            </p>
            <ul>
              <li>Không tạo vòng lặp (chu trình)</li>
              <li>Tổng km nhỏ nhất có thể</li>
              <li>Kết nối được mọi trạm</li>
              <li>Tối ưu chi phí xây dựng đường sắt</li>
            </ul>
          </div>
        </div>
      </Modal>
    </aside>
  );
};

export default Sidebar;
