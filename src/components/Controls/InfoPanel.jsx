import React from 'react';
import { Activity } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import { pixelsToKm } from '../../utils/calculations';
import Card from '../UI/Card';
import './InfoPanel.css';

/**
 * InfoPanel component - Hiển thị thông tin về đồ thị
 */
const InfoPanel = () => {
  const { nodes, edges = [], totalCost, animationTime } = useGraph();

  return (
    <div className="info-panel">
      <Card
        title="Thống Kê"
        icon={Activity}
        variant="primary"
      >
        <div className="info-panel__stats">
          <div className="info-panel__stat">
            <span className="info-panel__stat-label">Số trạm:</span>
            <span className="info-panel__stat-value">{nodes.length}</span>
          </div>

          <div className="info-panel__stat">
            <span className="info-panel__stat-label">Số đường ray:</span>
            <span className="info-panel__stat-value">{edges.length}</span>
          </div>

          {animationTime > 0 && (
            <div className="info-panel__stat">
              <span className="info-panel__stat-label">Thời gian:</span>
              <span className="info-panel__stat-value">{animationTime} ms</span>
            </div>
          )}

          {totalCost > 0 && (
            <>
              <div className="info-panel__divider"></div>
              <div className="info-panel__stat highlight">
                <span className="info-panel__stat-label">Tổng chi phí:</span>
                <span className="info-panel__stat-value cost">
                  {pixelsToKm(totalCost)} km
                </span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InfoPanel;
