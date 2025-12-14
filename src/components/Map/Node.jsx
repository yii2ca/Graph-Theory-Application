import React, { useState } from 'react';

/**
 * Node component - Đại diện cho một đỉnh trong đồ thị (dạng pin/marker)
 */
const Node = ({ node, isHovered, isMstNode, isDragging }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Kích thước pin
  const pinHeight = isHovered || isDragging ? 40 : 35;
  const pinWidth = isHovered || isDragging ? 28 : 24;
  const circleRadius = pinWidth * 0.35;
  
  // Màu sắc
  const fillColor = isMstNode ? '#10b981' : '#6b7280';
  const strokeColor = isHovered || isDragging ? '#fbbf24' : '#ffffff';

  // Vị trí đáy pin (điểm nhọn)
  const pinTipY = node.y;
  const pinTopY = node.y - pinHeight;
  const circleCenterY = pinTopY + circleRadius + 4;

  return (
    <g 
      className="node-group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Bóng đổ */}
      <ellipse
        cx={node.x + 2}
        cy={node.y + 3}
        rx={pinWidth * 0.4}
        ry={4}
        fill="rgba(0,0,0,0.2)"
      />

      {/* Pin shape - SVG path */}
      <path
        d={`
          M ${node.x} ${pinTipY}
          C ${node.x - pinWidth * 0.3} ${pinTipY - pinHeight * 0.3}
            ${node.x - pinWidth * 0.5} ${pinTipY - pinHeight * 0.5}
            ${node.x - pinWidth * 0.5} ${pinTopY + pinHeight * 0.35}
          A ${pinWidth * 0.5} ${pinWidth * 0.5} 0 1 1 ${node.x + pinWidth * 0.5} ${pinTopY + pinHeight * 0.35}
          C ${node.x + pinWidth * 0.5} ${pinTipY - pinHeight * 0.5}
            ${node.x + pinWidth * 0.3} ${pinTipY - pinHeight * 0.3}
            ${node.x} ${pinTipY}
          Z
        `}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        className="transition-all duration-150"
        style={{
          filter: isDragging 
            ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' 
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}
      />

      {/* Vòng tròn trắng bên trong */}
      <circle
        cx={node.x}
        cy={circleCenterY}
        r={circleRadius}
        fill="white"
        opacity="0.9"
      />

      {/* Tooltip hiện khi hover */}
      {showTooltip && (
        <g>
          {/* Background tooltip */}
          <rect
            x={node.x - 50}
            y={pinTopY - 35}
            width="100"
            height="28"
            rx="6"
            fill="#1e293b"
            opacity="0.95"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
            }}
          />
          {/* Mũi tên tooltip */}
          <polygon
            points={`${node.x - 6},${pinTopY - 7} ${node.x + 6},${pinTopY - 7} ${node.x},${pinTopY}`}
            fill="#1e293b"
          />
          {/* Text tooltip */}
          <text
            x={node.x}
            y={pinTopY - 17}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="13"
            fontWeight="600"
            className="pointer-events-none select-none"
          >
            {node.label}
          </text>
        </g>
      )}
    </g>
  );
};

export default Node;
