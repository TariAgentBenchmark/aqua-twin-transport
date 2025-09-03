import { PanelConfig } from '../components/PanelComponents';

export const getNutritionTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => {
  return {
    leftPanels: [
      {
        title: '营养成分分析',
        type: 'pie',
        data: {
          labels: ['蛋白质', '脂肪', '碳水化合物', '维生素', '矿物质'],
          datasets: [{
            data: [35, 15, 25, 15, 10],
            backgroundColor: [
              'rgba(255, 107, 53, 0.8)',
              'rgba(0, 212, 255, 0.8)',
              'rgba(0, 255, 136, 0.8)',
              'rgba(255, 193, 0, 0.8)',
              'rgba(138, 43, 226, 0.8)'
            ],
            borderColor: ['#ff6b35', '#00d4ff', '#00ff88', '#ffc100', '#8a2be2'],
            borderWidth: 2
          }]
        }
      },
      {
        title: '营养指标变化',
        type: 'line',
        data: {
          labels: ['15日', '16日', '17日', '18日', '19日', '20日', '21日'],
          datasets: [{
            data: [600, 700, 800, 950, 850, 700, 600],
            borderColor: '#ff6b35',
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#ff6b35',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        }
      },
      {
        title: '营养检测设备状态',
        type: 'circular',
        data: {
          center: { icon: '🧪', percentage: 89 },
          stats: [
            { label: '蛋白质检测', value: '92', unit: '%' },
            { label: '维生素检测', value: '85', unit: '%' },
            { label: '矿物质检测', value: '91', unit: '%' }
          ]
        }
      }
    ],
    rightPanels: [
      {
        title: '营养配方数据',
        type: 'metrics',
        data: [
          { label: '营养配方总数', value: '15', unit: '套' },
          { label: '营养效果评价', value: '94', unit: '分' }
        ]
      },
      {
        title: '营养健康评估报告',
        type: 'mixed',
        data: {
          imageUrl: '/api/placeholder/400/200',
          chartData: {
            labels: ['蛋白含量', '脂肪含量', '维生素', '矿物质', '消化率'],
            datasets: [{
              data: [4.8, 4.2, 3.9, 3.2, 2.8],
              backgroundColor: '#ff6b35',
              borderColor: '#ff6b35',
              borderWidth: 1
            }]
          }
        }
      }
    ]
  };
};