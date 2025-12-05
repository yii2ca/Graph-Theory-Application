import React from 'react';
import { GraphProvider } from './contexts/GraphContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MapCanvas from './components/Map/MapCanvas';

/**
 * Component chính của ứng dụng
 * Kết hợp Layout, Sidebar và Map
 */
function App() {
  return (
    <GraphProvider>
      <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MapCanvas />
        </div>
      </div>
    </GraphProvider>
  );
}

export default App;
