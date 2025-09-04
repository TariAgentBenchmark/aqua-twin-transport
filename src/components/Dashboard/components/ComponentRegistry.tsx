import React from 'react';
import FishPondControl from './FishPondControl';
import DualAxisChart from './DualAxisChart';
import FeedingWaterChart from './FeedingWaterChart';
import StatisticsPanel from './StatisticsPanel';

// Component configuration interface
export interface ComponentConfig {
  type: string;
  props?: Record<string, any>;
  className?: string;
}

export interface PanelConfig {
  id: string;
  title?: string;
  component: ComponentConfig;
}

// Component registry - maps component types to actual components
const ComponentRegistry = {
  FishPondControl,
  DualAxisChart,
  FeedingWaterChart,
  StatisticsPanel,
};

export type ComponentType = keyof typeof ComponentRegistry;

// Component renderer that takes a config and renders the appropriate component
export const ComponentRenderer: React.FC<{ config: ComponentConfig }> = ({ config }) => {
  const Component = ComponentRegistry[config.type as ComponentType];
  
  if (!Component) {
    console.warn(`Component type "${config.type}" not found in registry`);
    return <div>Unknown component type: {config.type}</div>;
  }

  const combinedProps = {
    ...config.props,
    className: config.className,
  };

  return <Component {...combinedProps} />;
};

export default ComponentRegistry;