import { PanelConfig } from '../components/ComponentRegistry';

export const getFeedingTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => ({
  leftPanels: [
    {
      id: 'pond-control',
      component: {
        type: 'FishPondControl',
        className: 'fish-pond-control-floating'
      }
    },
    {
      id: 'feeding-chart',
      component: {
        type: 'DualAxisChart',
        className: 'dual-axis-chart-floating',
        props: {
          defaultTab: '摄食强度',
          chartData: {
            primary: { label: '摄食频率', color: '#00d4ff' },
            secondary: { label: '摄食量', color: '#00ff88' }
          }
        }
      }
    }
  ],
  rightPanels: [
    {
      id: 'feeding-behavior',
      component: {
        type: 'FeedingWaterChart',
        className: 'feeding-water-chart-floating',
        props: {
          defaultTab: '摄食强度'
        }
      }
    },
    {
      id: 'feeding-statistics',
      component: {
        type: 'StatisticsPanel',
        className: 'statistics-panel-floating',
        props: {
          title: '摄食统计汇总',
          metrics: {
            feedEfficiency: { enabled: true, title: '摄食效率' },
            survivalRate: { enabled: true, title: '活跃度≈92.1%' },
            pollution: { enabled: true, title: '摄食行为分析' }
          }
        }
      }
    }
  ]
});