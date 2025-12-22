import React, { useState } from 'react';
import { getMidPoint, pixelsToKm } from '../../utils/calculations';

/**
 * Edge component - Đại diện cho một cạnh trong đồ thị
 * Phong cách: Blueprint Railway Lines với màu sắc đa dạng
 */
const Edge = ({ 
  from, 
  to, 
  isMst, 
  isDefault,
  isRequired,
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
  
  // Railway Line Colors - đa dạng màu sắc như bản đồ metro
  const lineColors = ['#ff4757', '#ffa502', '#00d4ff', '#ff7f50', '#3742fa', '#2ed573'];
  // edgeId có thể là string "0-1", lấy số đầu tiên hoặc dùng index 0
  const edgeIndex = typeof edgeId === 'number' ? edgeId : (typeof edgeId === 'string' ? parseInt(edgeId.split('-')[0], 10) : 0);
  const baseLineColor = lineColors[edgeIndex % lineColors.length] || '#00d4ff';
  
  // Màu và độ dày
  // Ưu tiên: MST (xanh lá) > Required (vàng cam) > Normal (xanh cyan)
  const strokeColor = isMst ? '#2ed573' : (isRequired ? '#ffa502' : '#00d4ff');
  const strokeWidth = isMst ? 5 : (isRequired ? 4 : 3);
  const opacity = isMst ? 1 : (isRequired ? 0.9 : 0.8);
  const glowColor = isMst ? 'rgba(46, 213, 115, 0.6)' : (isRequired ? 'rgba(255, 165, 2, 0.5)' : 'rgba(0, 212, 255, 0.4)');

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
        const transform = g.style.transform || '';
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
        const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        const translateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
        const translateY = translateMatch ? parseFloat(translateMatch[2]) : 0;
        
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

      {/* Glow effect cho MST edges */}
      {isMst && (
        hasCurve ? (
          <path
            d={`M ${from.x} ${from.y} Q ${ctrlPoint.x} ${ctrlPoint.y} ${to.x} ${to.y}`}
            stroke={glowColor}
            strokeWidth={strokeWidth + 6}
            fill="none"
            opacity={0.5}
            style={{ filter: 'blur(4px)' }}
          />
        ) : (
          <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={glowColor}
            strokeWidth={strokeWidth + 6}
            opacity={0.5}
            style={{ filter: 'blur(4px)' }}
          />
        )
      )}

      {/* Cạnh chính */}
      {hasCurve ? (
        <path
          d={`M ${from.x} ${from.y} Q ${ctrlPoint.x} ${ctrlPoint.y} ${to.x} ${to.y}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={opacity}
          strokeLinecap="round"
          className="transition-all duration-150"
          style={{
            filter: isMst ? `drop-shadow(0 0 8px ${glowColor})` : 'none',
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
          strokeLinecap="round"
          className="transition-all duration-150"
          style={{
            filter: isMst ? `drop-shadow(0 0 8px ${glowColor})` : 'none',
            animation: isMst ? `drawLine 0.5s ease-out ${animationDelay}ms both` : 'none'
          }}
        />
      )}

      {/* Điểm điều khiển - hiện khi hover hoặc đang kéo */}
      {!isMst && onControlPointDrag && (isHovered || isDraggingControl) && (
        <circle
          cx={curveMiddle.x}
          cy={curveMiddle.y}
          r={isDraggingControl ? 10 : 6}
          fill={isDraggingControl ? '#00d4ff' : '#ffffff'}
          stroke="#00d4ff"
          strokeWidth="2"
          style={{ 
            cursor: 'grab',
            filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.6))'
          }}
          onMouseDown={handleControlMouseDown}
        />
      )}

      {/* Hiển thị khoảng cách - luôn hiển thị */}
      {distanceKm && (
        <g>
          {/* Background cho text */}
          <rect
            x={labelPoint.x - 28}
            y={labelPoint.y - 26}
            width="56"
            height="18"
            fill="rgba(10, 22, 40, 0.85)"
            rx="3"
            stroke={isMst ? '#2ed573' : (isRequired ? '#ffa502' : '#00d4ff')}
            strokeWidth="1"
          />
          
          {/* Text khoảng cách */}
          <text
            x={labelPoint.x}
            y={labelPoint.y - 17}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isMst ? '#2ed573' : (isRequired ? '#ffa502' : '#00d4ff')}
            fontSize="10"
            fontWeight="700"
            fontFamily="monospace"
            className="pointer-events-none select-none"
          >
            {typeof distanceKm === 'number' ? distanceKm.toFixed(2) : distanceKm} km
          </text>
        </g>
      )}
    </g>
  );
};

export default Edge;
