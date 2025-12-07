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
            <h3>🎯 Cách Sử Dụng:</h3>
            <ul>
              <li><strong>Tạo đồ thị mẫu:</strong> Chọn từ danh sách "Đồ Thị Mẫu" ở Sidebar</li>
              <li><strong>Tạo ngẫu nhiên:</strong> Nhập số đỉnh (3-20) và ấn "Tạo Ngẫu Nhiên"</li>
              <li><strong>Thêm đỉnh:</strong> Click trực tiếp lên canvas để thêm điểm</li>
              <li><strong>Kéo đỉnh:</strong> Click và kéo một đỉnh để di chuyển vị trí</li>
              <li><strong>Đổi tên đỉnh:</strong> Double-click vào đỉnh, nhập tên mới, ấn "Lưu"</li>
              <li><strong>Xóa đỉnh:</strong> Right-click vào đỉnh để xóa ngay lập tức</li>
              <li><strong>Xóa tất cả:</strong> Ấn nút "Xóa Tất Cả" ở Sidebar</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>🔄 Thuật Toán MST:</h3>
            <ul>
              <li><strong>Kruskal:</strong> Sắp xếp tất cả cạnh theo trọng số từ nhỏ đến lớn, lần lượt thêm cạnh nếu không tạo chu trình. Tốt cho đồ thị thưa.</li>
              <li><strong>Prim:</strong> Bắt đầu từ một đỉnh, lần lượt thêm cạnh nhỏ nhất từ cây hiện tại tới đỉnh chưa thêm. Tốt cho đồ thị dày đặc.</li>
              <li><strong>Kết quả:</strong> Cả hai thuật toán đều cho MST tối ưu với tổng trọng số nhỏ nhất</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>❓ Minimum Spanning Tree (MST) là gì?</h3>
            <p>
              MST là tập hợp cạnh kết nối tất cả đỉnh trong đồ thị với:
              <ul>
                <li>✓ Không tạo chu trình (Acyclic)</li>
                <li>✓ Tổng trọng số nhỏ nhất (Minimal)</li>
                <li>✓ Kết nối mọi đỉnh (Spanning)</li>
              </ul>
              <strong>Ứng dụng:</strong> Thiết kế mạng lưới, đường sắt, điện thoại với chi phí tối thiểu
            </p>
          </div>

          <div className="help-section">
            <h3>💡 Mẹo sử dụng:</h3>
            <ul>
              <li>Chọn "Kruskal" hoặc "Prim" từ dropdown "Thuật toán" trước khi thực thi</li>
              <li>Ấn "Thực thi" để chạy thuật toán và hiển thị MST (cạnh xanh lá)</li>
              <li>Xem "Thông Tin" ở Sidebar để theo dõi số đỉnh, cạnh, và tổng chi phí</li>
              <li>Double-click để đổi tên, Right-click để xóa - rất tiện!</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;