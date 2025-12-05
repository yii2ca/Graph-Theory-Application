import React from 'react';
import { getMidPoint, pixelsToKm } from '../../utils/calculations';

/**
 * Edge component - Đại diện cho một cạnh trong đồ thị
 */
const Edge = ({ from, to, isMst, isDefault, weight, animationDelay = 0 }) => {
  const midPoint = getMidPoint(from, to);
  
  // Màu và độ dày
  const strokeColor = isMst ? '#10b981' : isDefault ? '#374151' : '#6b7280';
  const strokeWidth = isMst ? 4 : isDefault ? 1 : 2;
  const opacity = isMst ? 1 : isDefault ? 0.2 : 0.5;

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

      {/* Hiển thị trọng số cho MST edges */}
      {isMst && weight && (
        <g>
          {/* Background cho text */}
          <rect
            x={midPoint.x - 30}
            y={midPoint.y - 12}
            width="60"
            height="24"
            fill="#0f172a"
            rx="4"
            opacity="0.9"
            className="animate-fade-in"
            style={{
              animationDelay: `${animationDelay + 300}ms`
            }}
          />
          
          {/* Text trọng số */}
          <text
            x={midPoint.x}
            y={midPoint.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#10b981"
            fontSize="12"
            fontWeight="bold"
            className="pointer-events-none select-none animate-fade-in"
            style={{
              animationDelay: `${animationDelay + 300}ms`
            }}
          >
            {pixelsToKm(weight)} km
          </text>
        </g>
      )}
    </g>
  );
};

export default Edge;
