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
  const { nodes, edges = [], mstEdges, totalCost, animationTime } = useGraph();

  const maxEdges = nodes.length > 0 ? (nodes.length * (nodes.length - 1)) / 2 : 0;

  return (
    <div className="info-panel">
      <Card
        title="Thống Kê"
        icon={Activity}
        variant="primary"
      >
        <div className="info-panel__stats">
          <div className="info-panel__stat">
            <span className="info-panel__stat-label">Số đỉnh:</span>
            <span className="info-panel__stat-value">{nodes.length}</span>
          </div>

          <div className="info-panel__stat">
            <span className="info-panel__stat-label">Số cạnh:</span>
            <span className="info-panel__stat-value">{edges.length} / {maxEdges}</span>
          </div>

          <div className="info-panel__stat">
            <span className="info-panel__stat-label">Cạnh MST:</span>
            <span className="info-panel__stat-value success">{mstEdges.length}</span>
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

      {mstEdges.length > 0 && (
        <Card
          title="Cạnh MST"
          variant="success"
          collapsible
          defaultOpen
        >
          <div className="info-panel__edges">
            {mstEdges.map((edge, idx) => (
              <div key={idx} className="info-panel__edge">
                <span className="info-panel__edge-label">
                  {edge.from} → {edge.to}
                </span>
                <span className="info-panel__edge-weight">
                  {pixelsToKm(edge.weight)} km
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default InfoPanel;
