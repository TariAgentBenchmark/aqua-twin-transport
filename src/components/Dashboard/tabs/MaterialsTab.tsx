import { PanelConfig } from '../components/ComponentRegistry';

export const getMaterialsTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => ({
  leftPanels: [
    {
      id: 'pond-control',
      component: {
        type: 'FishPondControl',
        className: 'fish-pond-control-floating'
      }
    },
    {
      id: 'materials-chart',
      component: {
        type: 'DualAxisChart',
        className: 'dual-axis-chart-floating',
        props: {
          defaultTab: '物料投入',
          chartData: {
            primary: { label: '饲料投入量', color: '#ffc100' },
            secondary: { label: '添加剂用量', color: '#00ff88' }
          }
        }
      }
    }
  ],
  rightPanels: [
    {
      id: 'feeding-efficiency',
      component: {
        type: 'FeedingWaterChart',
        className: 'feeding-water-chart-floating',
        props: {
          defaultTab: '摄食强度'
        }
      }
    },
    {
      id: 'materials-statistics',
      component: {
        type: 'StatisticsPanel',
        className: 'statistics-panel-floating',
        props: {
          title: '物料统计汇总',
          metrics: {
            feedEfficiency: { enabled: true, title: '饲料利用效率' },
            survivalRate: { enabled: true, title: '投料准确率≈96.8%' },
            pollution: { enabled: true, title: '物料消耗分析' }
          }
        }
      }
    }
  ]
});