import { PanelConfig } from '../components/ComponentRegistry';

export const getWaterTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => ({
  leftPanels: [
    {
      id: 'pond-control',
      component: {
        type: 'FishPondControl',
        className: 'fish-pond-control-floating'
      }
    },
    {
      id: 'water-chart',
      component: {
        type: 'DualAxisChart',
        className: 'dual-axis-chart-floating',
        props: {
          defaultTab: '水质检测',
          chartData: {
            primary: { label: 'pH值', color: '#00d4ff' },
            secondary: { label: '溶解氧', color: '#00ff88' }
          }
        }
      }
    }
  ],
  rightPanels: [
    {
      id: 'water-quality',
      component: {
        type: 'FeedingWaterChart',
        className: 'feeding-water-chart-floating',
        props: {
          defaultTab: '水质监测'
        }
      }
    },
    {
      id: 'water-statistics',
      component: {
        type: 'StatisticsPanel',
        className: 'statistics-panel-floating',
        props: {
          title: '水质统计汇总',
          metrics: {
            feedEfficiency: { enabled: true, title: '水质稳定性' },
            survivalRate: { enabled: true, title: '达标率≈97.8%' },
            pollution: { enabled: true, title: '水质污染监控' }
          }
        }
      }
    }
  ]
});