import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import './AddMultipleNodesModal.css';

/**
 * Modal để thêm nhiều trạm cùng lúc
 */
const AddMultipleNodesModal = ({ isOpen, onClose, onAddNodes, currentNodeCount = 0 }) => {
  const [mode, setMode] = useState('count'); // 'count' hoặc 'names'
  const [nodeCount, setNodeCount] = useState(5);
  const [nodeNames, setNodeNames] = useState('');
  const [error, setError] = useState('');

  const MAX_NODES = 50;
  const maxCanAdd = MAX_NODES - currentNodeCount;

  const handleSubmit = () => {
    setError('');

    if (mode === 'count') {
      // Thêm theo số lượng
      const count = parseInt(nodeCount);
      
      if (isNaN(count) || count < 1) {
        setError('Vui lòng nhập số lượng hợp lệ (tối thiểu 1)');
        return;
      }

      if (count > maxCanAdd) {
        setError(`Chỉ có thể thêm thêm ${maxCanAdd} trạm nữa (đang có ${currentNodeCount}/${MAX_NODES})`);
        return;
      }

      onAddNodes(count, null);
    } else {
      // Thêm theo danh sách tên
      const names = nodeNames
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      if (names.length === 0) {
        setError('Vui lòng nhập ít nhất 1 tên trạm');
        return;
      }

      if (names.length > maxCanAdd) {
        setError(`Chỉ có thể thêm thêm ${maxCanAdd} trạm nữa (đang có ${currentNodeCount}/${MAX_NODES})`);
        return;
      }

      onAddNodes(names.length, names);
    }

    // Reset form
    setNodeCount(5);
    setNodeNames('');
    setError('');
    onClose();
  };

  const handleCancel = () => {
    setError('');
    setNodeCount(5);
    setNodeNames('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Thêm Nhiều Trạm"
      size="md"
    >
      <div className="add-multiple-nodes">
        {/* Chọn chế độ */}
        <div className="add-multiple-nodes__mode-selector">
          <label className="add-multiple-nodes__radio">
            <input
              type="radio"
              name="mode"
              value="count"
              checked={mode === 'count'}
              onChange={(e) => setMode(e.target.value)}
            />
            <span>Thêm theo số lượng</span>
          </label>

          <label className="add-multiple-nodes__radio">
            <input
              type="radio"
              name="mode"
              value="names"
              checked={mode === 'names'}
              onChange={(e) => setMode(e.target.value)}
            />
            <span>Nhập danh sách tên</span>
          </label>
        </div>

        {/* Nội dung theo chế độ */}
        {mode === 'count' ? (
          <div className="add-multiple-nodes__content">
            <label className="add-multiple-nodes__label">
              Số lượng trạm (1-{maxCanAdd}):
            </label>
            <input
              type="number"
              min="1"
              max={maxCanAdd}
              value={nodeCount}
              onChange={(e) => setNodeCount(e.target.value)}
              className="add-multiple-nodes__input"
              placeholder="Nhập số lượng..."
            />
            <p className="add-multiple-nodes__hint">
              Các trạm sẽ được đặt tên tự động: Trạm 1, Trạm 2, ... (Đang có {currentNodeCount}/{MAX_NODES} trạm)
            </p>
          </div>
        ) : (
          <div className="add-multiple-nodes__content">
            <label className="add-multiple-nodes__label">
              Danh sách tên trạm (cách nhau bằng dấu phẩy):
            </label>
            <input
              type="text"
              value={nodeNames}
              onChange={(e) => setNodeNames(e.target.value)}
              className="add-multiple-nodes__input"
              placeholder="Hà Nội, Hồ Chí Minh, Đà Nẵng, Cần Thơ, Hải Phòng"
            />
            <p className="add-multiple-nodes__hint">
              Nhập các tên trạm cách nhau bằng dấu phẩy (,). (Đang có {currentNodeCount}/{MAX_NODES} trạm)
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="add-multiple-nodes__error">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="add-multiple-nodes__actions">
          <Button
            variant="secondary"
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
          >
            Thêm Trạm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMultipleNodesModal;
