import { PanelConfig } from '../components/ComponentRegistry';

export const getEnvironmentTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => ({
  leftPanels: [
    {
      id: 'pond-control',
      component: {
        type: 'FishPondControl',
        className: 'fish-pond-control-floating'
      }
    },
    {
      id: 'environment-chart',
      component: {
        type: 'DualAxisChart',
        className: 'dual-axis-chart-floating',
        props: {
          defaultTab: '环境指标',
          chartData: {
            primary: { label: '温度(°C)', color: '#ff6b35' },
            secondary: { label: '湿度(%)', color: '#00d4ff' }
          }
        }
      }
    }
  ],
  rightPanels: [
    {
      id: 'water-monitoring',
      component: {
        type: 'FeedingWaterChart',
        className: 'feeding-water-chart-floating',
        props: {
          defaultTab: '水质监测'
        }
      }
    },
    {
      id: 'environment-statistics',
      component: {
        type: 'StatisticsPanel',
        className: 'statistics-panel-floating',
        props: {
          title: '环境统计汇总',
          metrics: {
            feedEfficiency: { enabled: true, title: '环境稳定性' },
            survivalRate: { enabled: true, title: '水质合格率≈98.7%' },
            pollution: { enabled: true, title: '污染物控制' }
          }
        }
      }
    }
  ]
});