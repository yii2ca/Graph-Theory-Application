import React, { useRef, useEffect } from 'react';
import { GraphProvider, useGraph } from './contexts/GraphContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import RightSidebar from './components/Layout/RightSidebar';
import MapCanvas from './components/Map/MapCanvas';
import ToolBar from './components/Controls/ToolBar';
import { Toast } from './components/UI';
import './App.css';

/**
 * Component nội dung chính (cần wrap trong GraphProvider)
 */
function AppContent() {
  const mapCanvasRef = useRef(null);
  const { toasts, removeToast, undo, redo, canUndo, canRedo } = useGraph();

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

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z for Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Shift+Z or Ctrl+Y for Redo
      else if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="app">
      <Header />

      <div className="app__container">
        <Sidebar />
        <div className="app__map-container">
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
        <RightSidebar mapCanvasRef={mapCanvasRef} />
      </div>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Component chính của ứng dụng
 */
function App() {
  return (
    <GraphProvider>
      <AppContent />
    </GraphProvider>
  );
}

export default App;
