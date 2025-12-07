import React, { useEffect } from 'react';
import './Modal.css';
import { X } from 'lucide-react';

/**
 * Modal Component
 * Props: isOpen, onClose, title, children, size (sm, md, lg)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeButton = true,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalClass = `modal modal--${size} ${className}`.trim();

  return (
    <div className="modal__backdrop" onClick={handleBackdropClick}>
      <div className={modalClass}>
        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          {closeButton && (
            <button
              className="modal__close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;