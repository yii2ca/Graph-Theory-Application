import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

/**
 * Toast Component - Hiển thị thông báo tạm thời
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại: success, error, warning, info
 * @param {number} duration - Thời gian hiển thị (ms)
 * @param {function} onClose - Callback khi đóng
 */
const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__icon">
        {getIcon()}
      </div>
      <div className="toast__message">
        {message}
      </div>
      <button className="toast__close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
