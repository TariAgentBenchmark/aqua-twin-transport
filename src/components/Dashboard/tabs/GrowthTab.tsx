import { PanelConfig } from '../components/ComponentRegistry';

export const getGrowthTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => ({
  leftPanels: [
    {
      id: 'pond-control',
      component: {
        type: 'FishPondControl',
        className: 'fish-pond-control-floating'
      }
    },
    {
      id: 'growth-chart',
      component: {
        type: 'DualAxisChart',
        className: 'dual-axis-chart-floating',
        props: {
          defaultTab: '生长指标',
          chartData: {
            primary: { label: '体重增长', color: '#00d4ff' },
            secondary: { label: '体长增长', color: '#00ff88' }
          }
        }
      }
    }
  ],
  rightPanels: [
    {
      id: 'feeding-monitoring',
      component: {
        type: 'FeedingWaterChart',
        className: 'feeding-water-chart-floating',
        props: {
          defaultTab: '摄食强度'
        }
      }
    },
    {
      id: 'growth-statistics',
      component: {
        type: 'StatisticsPanel',
        className: 'statistics-panel-floating',
        props: {
          title: '生长统计汇总',
          metrics: {
            feedEfficiency: { enabled: true, title: '饲料转化效率' },
            survivalRate: { enabled: true, title: '成活率≈95.2%' },
            pollution: { enabled: true, title: '生长环境指标' }
          }
        }
      }
    }
  ]
});