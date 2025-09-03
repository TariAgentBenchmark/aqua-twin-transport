import { getGrowthTabPanels } from './GrowthTab';
import { getEnvironmentTabPanels } from './EnvironmentTab';
import { getMaterialsTabPanels } from './MaterialsTab';
import { getNutritionTabPanels } from './NutritionTab';
import { getFeedingTabPanels } from './FeedingTab';
import { getWaterTabPanels } from './WaterTab';
import { PanelConfig } from '../components/PanelComponents';

export interface TabConfig {
  id: string;
  label: string;
  getPanels: () => { leftPanels: PanelConfig[], rightPanels: PanelConfig[] };
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const createRandomizedPanels = (basePanels: { leftPanels: PanelConfig[], rightPanels: PanelConfig[] }) => {
  return {
    leftPanels: shuffleArray(basePanels.leftPanels),
    rightPanels: shuffleArray(basePanels.rightPanels)
  };
};

export const tabConfigs: TabConfig[] = [
  {
    id: 'growth',
    label: '生长指标',
    getPanels: () => createRandomizedPanels(getGrowthTabPanels())
  },
  {
    id: 'environment',
    label: '环境指标',
    getPanels: () => createRandomizedPanels(getEnvironmentTabPanels())
  },
  {
    id: 'materials',
    label: '物料投入',
    getPanels: () => createRandomizedPanels(getMaterialsTabPanels())
  },
  {
    id: 'nutrition',
    label: '营养健康',
    getPanels: () => createRandomizedPanels(getNutritionTabPanels())
  },
  {
    id: 'feeding',
    label: '摄食强度',
    getPanels: () => createRandomizedPanels(getFeedingTabPanels())
  },
  {
    id: 'water',
    label: '水质检测',
    getPanels: () => createRandomizedPanels(getWaterTabPanels())
  }
];

export const getTabConfig = (tabId: string): TabConfig | undefined => {
  return tabConfigs.find(config => config.id === tabId);
};