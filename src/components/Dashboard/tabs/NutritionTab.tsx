import { PanelConfig } from '../components/ComponentRegistry';

export const getNutritionTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => ({
  leftPanels: [
    {
      id: 'pond-control',
      component: {
        type: 'FishPondControl',
        className: 'fish-pond-control-floating'
      }
    },
    {
      id: 'nutrition-chart',
      component: {
        type: 'DualAxisChart',
        className: 'dual-axis-chart-floating',
        props: {
          defaultTab: '营养健康',
          chartData: {
            primary: { label: '蛋白质含量', color: '#8a2be2' },
            secondary: { label: '维生素水平', color: '#ff6b35' }
          }
        }
      }
    }
  ],
  rightPanels: [
    {
      id: 'health-monitoring',
      component: {
        type: 'FeedingWaterChart',
        className: 'feeding-water-chart-floating',
        props: {
          defaultTab: '摄食强度'
        }
      }
    },
    {
      id: 'nutrition-statistics',
      component: {
        type: 'StatisticsPanel',
        className: 'statistics-panel-floating',
        props: {
          title: '营养统计汇总',
          metrics: {
            feedEfficiency: { enabled: true, title: '营养吸收率' },
            survivalRate: { enabled: true, title: '健康指数≈94.3%' },
            pollution: { enabled: true, title: '营养平衡分析' }
          }
        }
      }
    }
  ]
});