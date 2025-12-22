import React, { useState } from 'react';

/**
 * Node component - Đại diện cho một đỉnh trong đồ thị (kiểu Railway Station)
 * Phong cách: Blueprint Railway Map
 */
const Node = ({ node, isHovered, isMstNode, isDragging, isStartNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Kích thước node
  const outerRadius = isHovered || isDragging ? 16 : 12;
  const innerRadius = isHovered || isDragging ? 8 : 6;
  
  // Màu sắc Railway Theme
  const outerColor = isStartNode ? '#ffa502' : isMstNode ? '#2ed573' : '#00d4ff';
  const innerColor = isStartNode ? '#ffc048' : isMstNode ? '#7bed9f' : '#ffffff';
  const glowColor = isStartNode ? 'rgba(255, 165, 2, 0.6)' : isMstNode ? 'rgba(46, 213, 115, 0.6)' : 'rgba(0, 212, 255, 0.5)';

  return (
    <g 
      className="node-group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Outer glow effect */}
      <circle
        cx={node.x}
        cy={node.y}
        r={outerRadius + 4}
        fill="none"
        stroke={glowColor}
        strokeWidth="2"
        opacity={isHovered || isDragging ? 0.8 : 0.4}
        style={{
          filter: `blur(3px)`,
        }}
      />

      {/* Outer circle - Station marker */}
      <circle
        cx={node.x}
        cy={node.y}
        r={outerRadius}
        fill={outerColor}
        stroke="#ffffff"
        strokeWidth="2"
        style={{
          filter: isDragging 
            ? `drop-shadow(0 0 12px ${glowColor})` 
            : `drop-shadow(0 0 6px ${glowColor})`,
          transition: 'all 0.15s ease'
        }}
      />

      {/* Inner circle - Station center */}
      <circle
        cx={node.x}
        cy={node.y}
        r={innerRadius}
        fill={innerColor}
        opacity="0.95"
      />

      {/* Node ID label (small number) */}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isMstNode ? '#0a1628' : '#0a1628'}
        fontSize="8"
        fontWeight="700"
        fontFamily="monospace"
        className="pointer-events-none select-none"
      >
        {node.id + 1}
      </text>

      {/* Tooltip hiện khi hover */}
      {showTooltip && (
        <g>
          {/* Background tooltip */}
          <rect
            x={node.x - 55}
            y={node.y - outerRadius - 38}
            width="110"
            height="28"
            rx="4"
            fill="rgba(10, 22, 40, 0.95)"
            stroke={outerColor}
            strokeWidth="1"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
            }}
          />
          {/* Mũi tên tooltip */}
          <polygon
            points={`${node.x - 6},${node.y - outerRadius - 10} ${node.x + 6},${node.y - outerRadius - 10} ${node.x},${node.y - outerRadius - 4}`}
            fill="rgba(10, 22, 40, 0.95)"
            stroke={outerColor}
            strokeWidth="1"
          />
          {/* Text tooltip */}
          <text
            x={node.x}
            y={node.y - outerRadius - 24}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize="12"
            fontWeight="600"
            fontFamily="'Inter', sans-serif"
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
