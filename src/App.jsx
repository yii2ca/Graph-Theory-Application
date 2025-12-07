import React, { useRef } from 'react';
import { GraphProvider } from './contexts/GraphContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MapCanvas from './components/Map/MapCanvas';
import ToolBar from './components/Controls/ToolBar';
import './App.css';

/**
 * Component chính của ứng dụng
 * Kết hợp Layout, Sidebar và Map
 */
function App() {
  const mapCanvasRef = useRef(null);

  const handleZoomIn = () => {
    mapCanvasRef.current?.handleZoomIn();
  };

  const handleZoomOut = () => {
    mapCanvasRef.current?.handleZoomOut();
  };

  const handleFitScreen = () => {
    mapCanvasRef.current?.handleFitScreen();
  };

  const handlePanUp = () => {
    mapCanvasRef.current?.handlePanUp();
  };

  const handlePanDown = () => {
    mapCanvasRef.current?.handlePanDown();
  };

  const handlePanLeft = () => {
    mapCanvasRef.current?.handlePanLeft();
  };

  const handlePanRight = () => {
    mapCanvasRef.current?.handlePanRight();
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download');
  };

  return (
    <GraphProvider>
      <div className="app">
        <Header />

        <div className="app__container">
          <Sidebar />
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            <MapCanvas ref={mapCanvasRef} />
            <ToolBar 
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitScreen={handleFitScreen}
              onDownload={handleDownload}
              onPanUp={handlePanUp}
              onPanDown={handlePanDown}
              onPanLeft={handlePanLeft}
              onPanRight={handlePanRight}
            />
          </div>
        </div>
      </div>
    </GraphProvider>
  );
}

export default App;
