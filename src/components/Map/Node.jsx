import React from 'react';

/**
 * Node component - Đại diện cho một đỉnh trong đồ thị
 */
const Node = ({ node, isHovered, isMstNode, isDragging }) => {
  const radius = isHovered || isDragging ? 25 : 20;
  const fillColor = isMstNode ? '#10b981' : '#8b5cf6';
  const strokeColor = isHovered || isDragging ? '#fbbf24' : '#a78bfa';

  return (
    <g className="node-group">
      {/* Halo effect khi hover */}
      {isHovered && (
        <circle
          cx={node.x}
          cy={node.y}
          r={radius + 10}
          fill={fillColor}
          opacity="0.2"
          className="animate-pulse"
        />
      )}

      {/* Node circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="3"
        className={`transition-all duration-150 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          filter: isDragging ? 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.8))' : 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))'
        }}
      />

      {/* Label */}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {node.label}
      </text>

      {/* Name nếu có */}
      {node.name && (
        <text
          x={node.x}
          y={node.y + radius + 20}
          textAnchor="middle"
          fill="#a78bfa"
          fontSize="12"
          fontWeight="500"
          className="pointer-events-none select-none"
        >
          {node.name}
        </text>
      )}
    </g>
  );
};

export default Node;
