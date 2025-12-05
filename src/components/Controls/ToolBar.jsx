import React from 'react';
import { Zap, Shuffle, Grid, Download } from 'lucide-react';

/**
 * ToolBar component - Thanh công cụ bổ sung
 */
const ToolBar = () => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-md rounded-xl p-2 border border-purple-500/30 flex gap-2">
      <button
        className="p-3 hover:bg-purple-500/20 rounded-lg transition-all group"
        title="Thuật toán nhanh"
      >
        <Zap className="text-yellow-400 group-hover:scale-110 transition-transform" size={20} />
      </button>
      
      <button
        className="p-3 hover:bg-purple-500/20 rounded-lg transition-all group"
        title="Tạo ngẫu nhiên"
      >
        <Shuffle className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
      </button>
      
      <button
        className="p-3 hover:bg-purple-500/20 rounded-lg transition-all group"
        title="Hiện lưới"
      >
        <Grid className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />
      </button>
      
      <button
        className="p-3 hover:bg-purple-500/20 rounded-lg transition-all group"
        title="Xuất ảnh"
      >
        <Download className="text-green-400 group-hover:scale-110 transition-transform" size={20} />
      </button>
    </div>
  );
};

export default ToolBar;
