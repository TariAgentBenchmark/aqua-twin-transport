import { PanelConfig } from '../components/PanelComponents';

export const getGrowthTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => {
  return {
    leftPanels: [
      {
        title: '生长监测记录',
        type: 'table',
        data: [
          { time: '2024.12.30 14:23', location: '养殖-A区域', status: '生长正常', value: '7h' },
          { time: '2024.12.30 14:24', location: '养殖-B区域', status: '生长正常', value: '8h' },
          { time: '2024.12.30 14:20', location: '养殖-C区域', status: '生长正常', value: '4h' },
          { time: '2024.12.30 14:21', location: '养殖-D区域', status: '生长正常', value: '5h' }
        ]
      },
      {
        title: '体重增长趋势图',
        type: 'line',
        data: {
          labels: ['15日', '16日', '17日', '18日', '19日', '20日', '21日'],
          datasets: [{
            data: [750, 850, 950, 900, 1000, 750, 650],
            borderColor: '#00d4ff',
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#00d4ff',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        }
      },
      {
        title: '生长设备运行状态',
        type: 'circular',
        data: {
          center: { icon: '🐟', percentage: 85 },
          stats: [
            { label: '孵化箱数', value: '85', unit: '%' },
            { label: '增氧头数', value: '92', unit: '%' },
            { label: '投料机', value: '78', unit: '%' }
          ]
        }
      }
    ],
    rightPanels: [
      {
        title: '生长数据概览',
        type: 'metrics',
        data: [
          { label: '在池鱼苗总数', value: '2500', unit: '尾' },
          { label: '平均体重增长', value: '168', unit: 'g' }
        ]
      },
      {
        title: '生长环境综合分析',
        type: 'mixed',
        data: {
          imageUrl: '/api/placeholder/400/200',
          chartData: {
            labels: ['pH值', '溶解氧', '氨氮浓度', '硝酸盐', '水温稳定'],
            datasets: [{
              data: [4.8, 4.2, 3.5, 1.8, 1.2],
              backgroundColor: '#00d4ff',
              borderColor: '#00d4ff',
              borderWidth: 1
            }]
          }
        }
      }
    ]
  };
};