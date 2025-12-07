import React from 'react';
import { getMidPoint, pixelsToKm } from '../../utils/calculations';

/**
 * Edge component - Đại diện cho một cạnh trong đồ thị
 */
const Edge = ({ from, to, isMst, isDefault, weight, distanceScale = 0.5, animationDelay = 0 }) => {
  const midPoint = getMidPoint(from, to);
  
  // Màu và độ dày
  const strokeColor = isMst ? '#10b981' : isDefault ? '#374151' : '#6b7280';
  const strokeWidth = isMst ? 4 : isDefault ? 1 : 2;
  const opacity = isMst ? 1 : isDefault ? 0.2 : 0.5;

  // Tính khoảng cách in km
  const distanceKm = weight ? pixelsToKm(weight, distanceScale) : null;

  return (
    <g className="edge-group">
      {/* Cạnh chính */}
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

      {/* Hiển thị khoảng cách cho tất cả cạnh */}
      {distanceKm && (
        <g>
          {/* Background cho text */}
          <rect
            x={midPoint.x - 32}
            y={midPoint.y - 13}
            width="64"
            height="26"
            fill={isMst ? '#0f172a' : '#1e1b4b'}
            rx="4"
            opacity={isMst ? 0.95 : 0.8}
            className={isMst ? 'animate-fade-in' : ''}
            style={{
              animationDelay: isMst ? `${animationDelay + 300}ms` : '0ms'
            }}
          />
          
          {/* Text khoảng cách */}
          <text
            x={midPoint.x}
            y={midPoint.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isMst ? '#10b981' : '#a78bfa'}
            fontSize={isMst ? '13' : '11'}
            fontWeight={isMst ? 'bold' : '500'}
            className="pointer-events-none select-none"
            style={{
              animation: isMst ? `fadeIn 0.5s ease-out ${animationDelay + 300}ms both` : 'none'
            }}
          >
            {distanceKm} km
          </text>
        </g>
      )}
    </g>
  );
};

export default Edge;
