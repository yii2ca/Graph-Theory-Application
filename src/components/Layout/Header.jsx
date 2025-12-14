import React, { useState } from 'react';
import { Menu, X, HelpCircle, Train } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { useMST } from '../../hooks/useMST';
import { Button } from '../UI';
import Modal from '../UI/Modal';
import './Header.css';

const Header = () => {
  const {
    nodes,
    isMenuOpen,
    setIsMenuOpen,
    algorithm = 'kruskal',
    setAlgorithm,
    setMstEdges,
    setTotalCost,
  } = useGraph();

  const { findMST, isAnimating } = useMST(nodes, setMstEdges, setTotalCost);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header__left">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="header__menu-btn"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="header__logo">
            <Train size={28} />
            <div className="header__branding">
              <h1 className="header__title">Hệ Thống Đường Sắt Tối Ưu</h1>
              <p className="header__subtitle">Minimum Spanning Tree Visualization</p>
            </div>
          </div>
        </div>

        <div className="header__center">
          <div className="header__algorithm-group">
            <label className="header__label">Thuật toán:</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm?.(e.target.value)}
              className="header__select"
            >
              <option value="kruskal">Kruskal</option>
              <option value="prim">Prim</option>
            </select>
          </div>
        </div>

        <div className="header__right">
          <Button
            variant="success"
            size="md"
            onClick={() => {
              findMST(algorithm);
            }}
            loading={isAnimating}
          >
            ▶ Thực thi
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={HelpCircle}
            onClick={() => setIsHelpOpen(true)}
          >
            Hướng dẫn
          </Button>
        </div>
      </header>

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
            <h3>📍 Thao Tác Với Trạm (Node):</h3>
            <ul>
              <li><strong>Thêm trạm:</strong> Click vào canvas để đặt trạm mới</li>
              <li><strong>Di chuyển trạm:</strong> Kéo thả trạm bằng chuột trái</li>
              <li><strong>Đổi tên trạm:</strong> Double-click vào trạm → nhập tên → Lưu</li>
              <li><strong>Xóa trạm:</strong> Right-click vào trạm</li>
              <li><strong>Xem tên:</strong> Hover vào trạm để hiển thị tooltip</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>🔗 Thao Tác Với Đường Nối (Edge):</h3>
            <ul>
              <li><strong>Tạo đường nối:</strong> Shift + Kéo từ trạm A sang trạm B</li>
              <li><strong>Uốn cong đường:</strong> Hover vào đường → kéo chấm tròn trắng</li>
              <li><strong>Xem khoảng cách:</strong> Hover vào đường để hiển thị số km</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>🚂 Chạy Thuật Toán MST:</h3>
            <ul>
              <li><strong>Chọn thuật toán:</strong> Kruskal hoặc Prim từ dropdown</li>
              <li><strong>Thực thi:</strong> Click "▶ Thực thi" để tìm đường sắt tối ưu</li>
              <li><strong>Kết quả:</strong> Đường xanh lá = đường sắt tối ưu (MST)</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>❓ MST (Minimum Spanning Tree) là gì?</h3>
            <p>
              Cây khung nhỏ nhất - kết nối tất cả trạm với tổng chiều dài đường ray ngắn nhất:
            </p>
            <ul>
              <li>✓ Không tạo vòng lặp</li>
              <li>✓ Tổng km nhỏ nhất</li>
              <li>✓ Kết nối mọi trạm</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>⌨️ Phím Tắt:</h3>
            <ul>
              <li><strong>Shift + Kéo:</strong> Tạo đường nối</li>
              <li><strong>Ctrl + Scroll:</strong> Zoom in/out</li>
              <li><strong>Double-click:</strong> Đổi tên trạm</li>
              <li><strong>Right-click:</strong> Xóa trạm</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;