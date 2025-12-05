import React from 'react';
import { Activity } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { pixelsToKm } from '../../utils/calculations';

/**
 * InfoPanel component - Hiển thị thông tin về đồ thị
 */
const InfoPanel = () => {
  const { nodes, mstEdges, totalCost } = useGraph();

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-70 backdrop-blur-md rounded-xl p-4 border border-purple-500/30 min-w-[250px]">
      <div className="flex items-center gap-2 mb-3 text-purple-300">
        <Activity size={20} />
        <h3 className="font-semibold">Thống Kê</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Số đỉnh:</span>
          <span className="text-white font-semibold bg-purple-500/20 px-3 py-1 rounded">
            {nodes.length}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Cạnh tối đa:</span>
          <span className="text-white font-semibold bg-blue-500/20 px-3 py-1 rounded">
            {nodes.length > 0 ? (nodes.length * (nodes.length - 1)) / 2 : 0}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Cạnh MST:</span>
          <span className="text-white font-semibold bg-green-500/20 px-3 py-1 rounded">
            {mstEdges.length}
          </span>
        </div>
        
        {totalCost > 0 && (
          <>
            <div className="border-t border-purple-500/30 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tổng chi phí:</span>
              <span className="text-green-400 font-bold text-lg">
                {pixelsToKm(totalCost)} km
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
