import React, { useState } from 'react';
import { getMidPoint, pixelsToKm } from '../../utils/calculations';

/**
 * Edge component - Đại diện cho một cạnh trong đồ thị
 * Hỗ trợ điểm điều khiển để làm cong đường
 */
const Edge = ({ 
  from, 
  to, 
  isMst, 
  isDefault, 
  controlPoint,
  onControlPointDrag,
  edgeId,
  weight, 
  distanceScale = 0.5, 
  animationDelay = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingControl, setIsDraggingControl] = useState(false);
  const midPoint = getMidPoint(from, to);
  
  // Điểm control - nếu có thì dùng, không thì dùng midpoint
  const ctrlPoint = controlPoint || midPoint;
  const hasCurve = controlPoint !== null && controlPoint !== undefined;
  
  // Điểm giữa TRÊN ĐƯỜNG CONG (Bezier t=0.5) - luôn nằm trên cạnh
  const curveMiddle = hasCurve ? {
    x: 0.25 * from.x + 0.5 * ctrlPoint.x + 0.25 * to.x,
    y: 0.25 * from.y + 0.5 * ctrlPoint.y + 0.25 * to.y
  } : midPoint;
  
  // Màu và độ dày
  const strokeColor = isMst ? '#10b981' : isDefault ? '#374151' : '#6b7280';
  const strokeWidth = isMst ? 4 : isDefault ? 1 : 2;
  const opacity = isMst ? 1 : isDefault ? 0.2 : 0.7;

  // Tính khoảng cách in km
  const distanceKm = weight ? pixelsToKm(weight, distanceScale) : null;
  
  // Điểm giữa của đường (cho text) - nếu có curve thì tính theo Bezier
  const labelPoint = hasCurve ? {
    x: (from.x + 2 * ctrlPoint.x + to.x) / 4,
    y: (from.y + 2 * ctrlPoint.y + to.y) / 4
  } : midPoint;

  // Handle kéo điểm control
  const handleControlMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingControl(true);
    
    const svg = e.target.closest('svg');
    const g = svg.querySelector('g'); // Group có transform
    
    const handleMouseMove = (moveEvent) => {
      if (onControlPointDrag) {
        const rect = svg.getBoundingClientRect();
        // Lấy transform từ group (zoom và pan)
        const transform = g.style.transform || '';
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
        const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        const translateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
        const translateY = translateMatch ? parseFloat(translateMatch[2]) : 0;
        
        // Tính toạ độ đã transform
        const x = (moveEvent.clientX - rect.left - translateX) / scale;
        const y = (moveEvent.clientY - rect.top - translateY) / scale;
        
        onControlPointDrag(edgeId, { x, y });
      }
    };
    
    const handleMouseUp = () => {
      setIsDraggingControl(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Kiểm tra xem đường có được uốn cong không
  const isCurved = hasCurve && (ctrlPoint.x !== midPoint.x || ctrlPoint.y !== midPoint.y);

  return (
    <g 
      className="edge-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Vùng hover rộng hơn để dễ bắt sự kiện */}
      {hasCurve ? (
        <path
          d={`M ${from.x} ${from.y} Q ${ctrlPoint.x} ${ctrlPoint.y} ${to.x} ${to.y}`}
          stroke="transparent"
          strokeWidth={20}
          fill="none"
        />
      ) : (
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="transparent"
          strokeWidth={20}
        />
      )}

      {/* Cạnh chính */}
      {hasCurve ? (
        <path
          d={`M ${from.x} ${from.y} Q ${ctrlPoint.x} ${ctrlPoint.y} ${to.x} ${to.y}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={opacity}
          className="transition-all duration-150"
          style={{
            filter: isMst ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'none',
            animation: isMst ? `drawLine 0.5s ease-out ${animationDelay}ms both` : 'none'
          }}
        />
      ) : (
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={opacity}
          className="transition-all duration-150"
          style={{
            filter: isMst ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'none',
            animation: isMst ? `drawLine 0.5s ease-out ${animationDelay}ms both` : 'none'
          }}
        />
      )}

      {/* Điểm điều khiển - hiện khi hover hoặc đang kéo - LUÔN nằm trên đường cong */}
      {!isMst && onControlPointDrag && (isHovered || isDraggingControl) && (
        <circle
          cx={curveMiddle.x}
          cy={curveMiddle.y}
          r={isDraggingControl ? 10 : 6}
          fill={isDraggingControl ? '#8b5cf6' : '#ffffff'}
          stroke="#8b5cf6"
          strokeWidth="2"
          style={{ 
            cursor: 'grab',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
          onMouseDown={handleControlMouseDown}
        />
      )}

      {/* Hiển thị khoảng cách chỉ khi hover */}
      {distanceKm && isHovered && (
        <g>
          {/* Background cho text */}
          <rect
            x={labelPoint.x - 32}
            y={labelPoint.y - 30}
            width="64"
            height="26"
            fill={isMst ? '#0f172a' : '#1e293b'}
            rx="6"
            opacity="0.95"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
            }}
          />
          
          {/* Text khoảng cách */}
          <text
            x={labelPoint.x}
            y={labelPoint.y - 17}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isMst ? '#10b981' : '#ffffff'}
            fontSize="12"
            fontWeight="600"
            className="pointer-events-none select-none"
          >
            {distanceKm} km
          </text>
        </g>
      )}
    </g>
  );
};

export default Edge;
