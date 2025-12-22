import React, { useState } from 'react';

/**
 * Node component - Đại diện cho một đỉnh trong đồ thị (kiểu Railway Station)
 * Phong cách: Train Station Icon
 */
const Node = ({ node, isHovered, isMstNode, isDragging, isStartNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Kích thước node
  const size = isHovered || isDragging ? 28 : 24;
  const halfSize = size / 2;
  
  // Màu sắc Railway Theme
  const bgColor = isStartNode ? '#ffa502' : isMstNode ? '#2ed573' : '#00d4ff';
  const iconColor = '#ffffff';
  const glowColor = isStartNode ? 'rgba(255, 165, 2, 0.6)' : isMstNode ? 'rgba(46, 213, 115, 0.6)' : 'rgba(0, 212, 255, 0.5)';

  return (
    <g 
      className="node-group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Outer glow effect */}
      <rect
        x={node.x - halfSize - 3}
        y={node.y - halfSize - 3}
        width={size + 6}
        height={size + 6}
        rx="6"
        fill="none"
        stroke={glowColor}
        strokeWidth="2"
        opacity={isHovered || isDragging ? 0.8 : 0.4}
        style={{
          filter: `blur(3px)`,
        }}
      />

      {/* Main station background - rounded square */}
      <rect
        x={node.x - halfSize}
        y={node.y - halfSize}
        width={size}
        height={size}
        rx="5"
        fill={bgColor}
        stroke="#ffffff"
        strokeWidth="2"
        style={{
          filter: isDragging 
            ? `drop-shadow(0 0 12px ${glowColor})` 
            : `drop-shadow(0 0 6px ${glowColor})`,
          transition: 'all 0.15s ease'
        }}
      />

      {/* Train icon - simple train shape */}
      {/* Train body */}
      <rect
        x={node.x - 7}
        y={node.y - 5}
        width={14}
        height={8}
        rx="2"
        fill={iconColor}
      />
      {/* Train roof */}
      <rect
        x={node.x - 5}
        y={node.y - 8}
        width={10}
        height={4}
        rx="1"
        fill={iconColor}
      />
      {/* Train wheels */}
      <circle cx={node.x - 4} cy={node.y + 5} r="2" fill={iconColor} />
      <circle cx={node.x + 4} cy={node.y + 5} r="2" fill={iconColor} />
      {/* Rail line */}
      <line
        x1={node.x - 9}
        y1={node.y + 7}
        x2={node.x + 9}
        y2={node.y + 7}
        stroke={iconColor}
        strokeWidth="1.5"
      />

      {/* Node number badge */}
      <circle
        cx={node.x + halfSize - 2}
        cy={node.y - halfSize + 2}
        r="7"
        fill="#0a1628"
        stroke={bgColor}
        strokeWidth="1"
      />
      <text
        x={node.x + halfSize - 2}
        y={node.y - halfSize + 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="8"
        fontWeight="700"
        fontFamily="monospace"
        className="pointer-events-none select-none"
      >
        {node.id + 1}
      </text>

      {/* Tên trạm - luôn hiển thị */}
      <g>
        {/* Background cho tên */}
        <rect
          x={node.x - 40}
          y={node.y + halfSize + 4}
          width="80"
          height="20"
          rx="4"
          fill="rgba(10, 22, 40, 0.85)"
          stroke={bgColor}
          strokeWidth="1"
        />
        {/* Text tên trạm */}
        <text
          x={node.x}
          y={node.y + halfSize + 14}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize="10"
          fontWeight="600"
          fontFamily="'Inter', sans-serif"
          className="pointer-events-none select-none"
        >
          {node.label}
        </text>
      </g>
    </g>
  );
};

export default Node;
