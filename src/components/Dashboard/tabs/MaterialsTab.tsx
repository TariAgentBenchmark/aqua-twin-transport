import { PanelConfig } from '../components/PanelComponents';

export const getMaterialsTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => {
  return {
    leftPanels: [
      {
        title: '物料库存管理',
        type: 'bar',
        data: {
          labels: ['饲料', '维生素', '矿物质', '益生菌', '免疫增强剂'],
          datasets: [{
            label: '库存量(kg)',
            data: [400, 12, 8, 15, 5],
            backgroundColor: [
              'rgba(255, 193, 0, 0.8)',
              'rgba(0, 255, 136, 0.8)',
              'rgba(255, 107, 53, 0.8)',
              'rgba(0, 212, 255, 0.8)',
              'rgba(138, 43, 226, 0.8)'
            ],
            borderColor: ['#ffc100', '#00ff88', '#ff6b35', '#00d4ff', '#8a2be2'],
            borderWidth: 2
          }]
        }
      },
      {
        title: '物料消耗记录表',
        type: 'table',
        data: [
          { time: '2024.12.30 14:23', location: '投料-A区域', status: '投料完成', value: '5h' },
          { time: '2024.12.30 14:24', location: '投料-B区域', status: '投料完成', value: '3h' },
          { time: '2024.12.30 14:20', location: '投料-C区域', status: '投料完成', value: '6h' },
          { time: '2024.12.30 14:21', location: '投料-D区域', status: '投料完成', value: '4h' }
        ]
      },
      {
        title: '物料供应链状态',
        type: 'circular',
        data: {
          center: { icon: '📦', percentage: 73 },
          stats: [
            { label: '饲料库存', value: '78', unit: '%' },
            { label: '添加剂库存', value: '65', unit: '%' },
            { label: '药品库存', value: '89', unit: '%' }
          ]
        }
      }
    ],
    rightPanels: [
      {
        title: '物料使用统计',
        type: 'metrics',
        data: [
          { label: '日均饲料消耗', value: '3500', unit: 'kg' },
          { label: '物料库存预警', value: '8', unit: '项' }
        ]
      },
      {
        title: '物料质量分析报告',
        type: 'mixed',
        data: {
          imageUrl: '/api/placeholder/400/200',
          chartData: {
            labels: ['饲料品质', '保存条件', '投料精度', '库存管理', '运输安全'],
            datasets: [{
              data: [4.5, 4, 3.8, 2.5, 1.5],
              backgroundColor: '#ffc100',
              borderColor: '#ffc100',
              borderWidth: 1
            }]
          }
        }
      }
    ]
  };
};