import { PanelConfig } from '../components/ComponentRegistry';
import { getGrowthTabPanels } from './GrowthTab';
import { getEnvironmentTabPanels } from './EnvironmentTab';
import { getMaterialsTabPanels } from './MaterialsTab';
import { getNutritionTabPanels } from './NutritionTab';
import { getFeedingTabPanels } from './FeedingTab';
import { getWaterTabPanels } from './WaterTab';

export interface TabConfig {
  id: string;
  label: string;
  getPanels: () => { leftPanels: PanelConfig[], rightPanels: PanelConfig[] };
}

export const tabConfigs: TabConfig[] = [
  {
    id: 'growth',
    label: '生长指标',
    getPanels: getGrowthTabPanels
  },
  {
    id: 'environment',
    label: '环境指标',
    getPanels: getEnvironmentTabPanels
  },
  {
    id: 'materials',
    label: '物料投入',
    getPanels: getMaterialsTabPanels
  },
  {
    id: 'nutrition',
    label: '营养健康',
    getPanels: getNutritionTabPanels
  },
  {
    id: 'feeding',
    label: '摄食强度',
    getPanels: getFeedingTabPanels
  },
  {
    id: 'water',
    label: '水质检测',
    getPanels: getWaterTabPanels
  }
];

export const getTabConfig = (tabId: string): TabConfig | undefined => {
  return tabConfigs.find(config => config.id === tabId);
};