import React from 'react';
import { PanelRenderer } from './PanelComponents';
import { getTabConfig } from '../tabs/TabConfig';

interface FloatingPanelsProps {
  leftActiveTab: string;
  rightActiveTab: string;
  activeTab?: string;
}

const FloatingPanels: React.FC<FloatingPanelsProps> = ({ leftActiveTab, rightActiveTab, activeTab }) => {
  const currentTab = activeTab || leftActiveTab;

  // Get tab configuration
  const tabConfig = getTabConfig(currentTab);
  const tabContent = tabConfig ? tabConfig.getPanels() : { leftPanels: [], rightPanels: [] };


  return (
    <div className="floating-panels-container">
      {/* Left Panels (3) */}
      <div className="left-panels-group">
        {tabContent.leftPanels.map((panel, index) => (
          <div key={index} className={`floating-panel left-panel-${index + 1}`}>
            <div className="panel-header">
              <div className="header-icon">▤</div>
              <span className="panel-title">{panel.title}</span>
            </div>
            <div className="panel-content">
              <PanelRenderer panel={panel} />
            </div>
          </div>
        ))}
      </div>

      {/* Right Panels (2) */}
      <div className="right-panels-group">
        {tabContent.rightPanels.map((panel, index) => (
          <div key={index} className={`floating-panel right-panel-${index + 1}`}>
            <div className="panel-header">
              <div className="header-icon">▤</div>
              <span className="panel-title">{panel.title}</span>
            </div>
            <div className="panel-content">
              <PanelRenderer panel={panel} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingPanels;