import React from 'react';
import { MapPin, Network, Activity, Settings, Info } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { sampleGraphs, vietnamCities } from '../../data';
import { pixelsToKm } from '../../utils/calculations';

/**
 * Sidebar component với menu và thông tin
 */
const Sidebar = () => {
  const {
    nodes,
    mstEdges,
    totalCost,
    isMenuOpen,
    loadSampleGraph
  } = useGraph();

  if (!isMenuOpen) return null;

  return (
    <aside className="w-80 bg-black bg-opacity-40 backdrop-blur-md border-r border-purple-500/30 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Thông tin đồ thị */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="text-purple-400" size={20} />
            <h3 className="text-lg font-semibold text-purple-300">Thông Tin</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Số đỉnh:</span>
              <span className="text-white font-semibold">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cạnh MST:</span>
              <span className="text-white font-semibold">{mstEdges.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tổng chi phí:</span>
              <span className="text-green-400 font-bold">
                {pixelsToKm(totalCost)} km
              </span>
            </div>
          </div>
        </div>

        {/* Đồ thị mẫu */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Network className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-blue-300">Đồ Thị Mẫu</h3>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => loadSampleGraph(sampleGraphs.small)}
              className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm"
            >
              Đồ thị nhỏ (5 đỉnh)
            </button>
            <button
              onClick={() => loadSampleGraph(sampleGraphs.medium)}
              className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm"
            >
              Đồ thị trung bình (8 đỉnh)
            </button>
            <button
              onClick={() => loadSampleGraph(sampleGraphs.circle)}
              className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm"
            >
              Đồ thị tròn (12 đỉnh)
            </button>
            <button
              onClick={() => loadSampleGraph(sampleGraphs.grid)}
              className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm"
            >
              Đồ thị lưới (9 đỉnh)
            </button>
          </div>
        </div>

        {/* Thành phố Việt Nam */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-emerald-400" size={20} />
            <h3 className="text-lg font-semibold text-emerald-300">Việt Nam</h3>
          </div>
          
          <button
            onClick={() => loadSampleGraph(vietnamCities)}
            className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-all text-sm"
          >
            Các thành phố lớn
          </button>
        </div>

        {/* Hướng dẫn */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Info className="text-amber-400" size={20} />
            <h3 className="text-lg font-semibold text-amber-300">Hướng Dẫn</h3>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span>Click vào canvas để thêm điểm</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span>Nhấn "Tìm MST" để tìm đường tối ưu</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span>Chọn đồ thị mẫu để xem demo</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
