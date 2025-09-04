import React from 'react';
import { ComponentRenderer } from './ComponentRegistry';
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
      {/* Left Panels */}
      <div className="left-panels-group">
        {tabContent.leftPanels.map((panel, index) => (
          <div key={panel.id} className={`floating-panel left-panel-${index + 1}`}>
            {panel.title && (
              <div className="panel-header">
                <div className="header-icon">▤</div>
                <span className="panel-title">{panel.title}</span>
              </div>
            )}
            <div className="panel-content">
              <ComponentRenderer config={panel.component} />
            </div>
          </div>
        ))}
      </div>

      {/* Right Panels */}
      <div className="right-panels-group">
        {tabContent.rightPanels.map((panel, index) => (
          <div key={panel.id} className={`floating-panel right-panel-${index + 1}`}>
            {panel.title && (
              <div className="panel-header">
                <div className="header-icon">▤</div>
                <span className="panel-title">{panel.title}</span>
              </div>
            )}
            <div className="panel-content">
              <ComponentRenderer config={panel.component} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingPanels;