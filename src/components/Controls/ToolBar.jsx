import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, GripVertical } from 'lucide-react';
import './ToolBar.css';

/**
 * ToolBar component - Công cụ bổ sung nổi trên canvas
 */
const ToolBar = ({ onZoomIn, onZoomOut, onFitScreen, onDownload, onPanUp, onPanDown, onPanLeft, onPanRight }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Load position from localStorage
  const getInitialPosition = () => {
    try {
      const saved = localStorage.getItem('toolbar-position');
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  };
  
  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef(null);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem('toolbar-position', JSON.stringify(position));
    }
  }, [position]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <div 
      ref={toolbarRef}
      className="toolbar"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: position.x === 0 && position.y === 0 ? 'none' : 'translate(0, 0)'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <button
        className="toolbar__btn toolbar__grip"
        title="Kéo để di chuyển"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={16} />
      </button>

      <button
        className="toolbar__btn"
        title="Phóng to"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
      >
        <ZoomIn size={20} />
      </button>

      <button
        className="toolbar__btn"
        title="Thu nhỏ"
        onClick={(e) => {
          e.stopPropagation();
          onZoomOut();
        }}
      >
        <ZoomOut size={20} />
      </button>

      <div className="toolbar__divider"></div>

      <button
        className="toolbar__btn"
        title="Vừa với màn hình"
        onClick={(e) => {
          e.stopPropagation();
          onFitScreen();
        }}
      >
        <Maximize2 size={20} />
      </button>

      <div className="toolbar__divider"></div>

      <div className="toolbar__pan-group" onClick={(e) => e.stopPropagation()}>
        <button
          className="toolbar__btn toolbar__btn--small"
          title="Di chuyển lên"
          onClick={onPanUp}
        >
          <ArrowUp size={16} />
        </button>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="toolbar__btn toolbar__btn--small"
            title="Di chuyển trái"
            onClick={onPanLeft}
          >
            <ArrowLeft size={16} />
          </button>
          
          <button
            className="toolbar__btn toolbar__btn--small"
            title="Di chuyển xuống"
            onClick={onPanDown}
          >
            <ArrowDown size={16} />
          </button>
          
          <button
            className="toolbar__btn toolbar__btn--small"
            title="Di chuyển phải"
            onClick={onPanRight}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="toolbar__divider"></div>

      <button
        className="toolbar__btn"
        title="Tải ảnh"
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
      >
        <Download size={20} />
      </button>
    </div>
  );
};

export default ToolBar;
