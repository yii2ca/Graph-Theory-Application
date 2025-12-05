import React from 'react';
import { Menu, Play, Trash2, Plus } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { useMST } from '../../hooks/useMST';
import { sampleGraphs } from '../../data/sampleGraphs';

/**
 * Header component với controls chính
 */
const Header = () => {
  const {
    nodes,
    isMenuOpen,
    setIsMenuOpen,
    clearGraph,
    loadSampleGraph,
    setMstEdges,
    setTotalCost,
    setNodes,
    rearrangeNodes
  } = useGraph();

  const { findMST, isAnimating } = useMST(nodes, setMstEdges, setTotalCost);

  return (
    <header className="bg-black bg-opacity-40 backdrop-blur-md border-b border-purple-500/30 p-4 flex items-center justify-between">
      {/* Logo và Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-purple-500/20 rounded-lg transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="text-purple-300" size={24} />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Hệ Thống Đường Tối Ưu
          </h1>
          <p className="text-purple-300 text-sm">
            Minimum Spanning Tree Visualization
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const svg = document.querySelector('svg');
            if (svg) {
              const rect = svg.getBoundingClientRect();
              const NODE_RADIUS = 20;
              const paddingTop = 120;   // Tránh header (cao ~80px) + khoảng cách an toàn
              const paddingLeft = 120;  // Tránh sidebar (nếu có) + khoảng cách
              const paddingRight = 80;  // Tránh cạnh phải
              const paddingBottom = 80; // Tránh cạnh dưới
              // Khoảng cách tối thiểu giữa 2 tâm = 2.5 * bán kính
              const minDistance = NODE_RADIUS * 2.5;
              
              const generatePoint = () => {
                for (let i = 0; i < 100; i++) {
                  const point = {
                    x: paddingLeft + Math.random() * (rect.width - paddingLeft - paddingRight),
                    y: paddingTop + Math.random() * (rect.height - paddingTop - paddingBottom)
                  };
                  
                  // Kiểm tra khoảng cách từ tâm này đến tâm các điểm khác
                  const isFarEnough = nodes.every(node => {
                    const dx = point.x - node.x;
                    const dy = point.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    return distance >= minDistance;
                  });
                  
                  if (isFarEnough) return point;
                }
                return null;
              };
              
              const point = generatePoint();
              if (point) {
                const newNode = {
                  id: nodes.length,
                  x: point.x,
                  y: point.y,
                  label: `V${nodes.length}`
                };
                setNodes([...nodes, newNode]);
              } else {
                alert('Không tìm được vị trí phù hợp! Canvas đã quá đông.');
              }
            }
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm điểm
        </button>

        <button
          onClick={findMST}
          disabled={nodes.length < 2 || isAnimating}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={18} />
          {isAnimating ? 'Đang tính...' : 'Tìm MST'}
        </button>

        <button
          onClick={clearGraph}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex items-center gap-2"
        >
          <Trash2 size={18} />
          Xóa hết
        </button>
      </div>
    </header>
  );
};

export default Header;
