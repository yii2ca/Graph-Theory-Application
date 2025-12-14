import React, { useState } from 'react';
import { getMidPoint, pixelsToKm } from '../../utils/calculations';

/**
 * Edge component - Đại diện cho một cạnh trong đồ thị
 */
const Edge = ({ from, to, isMst, isDefault, isCurved = false, curveDirection = 1, weight, distanceScale = 0.5, animationDelay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const midPoint = getMidPoint(from, to);
  
  // Màu và độ dày
  const strokeColor = isMst ? '#10b981' : isDefault ? '#374151' : isCurved ? '#8b5cf6' : '#6b7280';
  const strokeWidth = isMst ? 4 : isDefault ? 1 : isCurved ? 3 : 2;
  const opacity = isMst ? 1 : isDefault ? 0.2 : isCurved ? 0.9 : 0.5;

  // Tính khoảng cách in km
  const distanceKm = weight ? pixelsToKm(weight, distanceScale) : null;

  // Tính điểm control cho đường cong
  const controlOffset = 50; // Độ cong cơ bản
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Điểm control nằm phía trên/dưới của đường thẳng (tùy curveDirection)
  const controlX = (from.x + to.x) / 2 - (dy / distance) * controlOffset * curveDirection;
  const controlY = (from.y + to.y) / 2 + (dx / distance) * controlOffset * curveDirection;
  
  // Điểm giữa của đường cong (cho text)
  const curvedMidPoint = isCurved ? {
    x: (from.x + 2 * controlX + to.x) / 4,
    y: (from.y + 2 * controlY + to.y) / 4
  } : midPoint;

  return (
    <g 
      className="edge-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Vùng hover rộng hơn để dễ bắt sự kiện */}
      {isCurved ? (
        <path
          d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`}
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
      {isCurved ? (
        <path
          d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={opacity}
          className="transition-all duration-300"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))',
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
          className="transition-all duration-300"
          style={{
            filter: isMst ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'none',
            animation: isMst ? `drawLine 0.5s ease-out ${animationDelay}ms both` : 'none'
          }}
        />
      )}

      {/* Hiển thị khoảng cách chỉ khi hover */}
      {distanceKm && isHovered && (
        <g>
          {/* Background cho text */}
          <rect
            x={curvedMidPoint.x - 32}
            y={curvedMidPoint.y - 13}
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
            x={curvedMidPoint.x}
            y={curvedMidPoint.y}
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
