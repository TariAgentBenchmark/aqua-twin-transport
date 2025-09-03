import { PanelConfig } from '../components/PanelComponents';

export const getFeedingTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => {
  return {
    leftPanels: [
      {
        title: '摄食行为分析',
        type: 'line',
        data: {
          labels: ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
          datasets: [{
            data: [500, 600, 700, 800, 900, 750, 650],
            borderColor: '#8a2be2',
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#8a2be2',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        }
      },
      {
        title: '摄食监控记录',
        type: 'table',
        data: [
          { time: '2024.12.30 14:23', location: '摄食-A区', status: '摄食活跃', value: '9h' },
          { time: '2024.12.30 14:24', location: '摄食-B区', status: '摄食活跃', value: '7h' },
          { time: '2024.12.30 14:20', location: '摄食-C区', status: '摄食活跃', value: '8h' },
          { time: '2024.12.30 14:21', location: '摄食-D区', status: '摄食活跃', value: '6h' }
        ]
      },
      {
        title: '摄食监控系统状态',
        type: 'circular',
        data: {
          center: { icon: '🎥', percentage: 96 },
          stats: [
            { label: '监控摄像头', value: '98', unit: '%' },
            { label: '行为分析', value: '94', unit: '%' },
            { label: '食量统计', value: '96', unit: '%' }
          ]
        }
      }
    ],
    rightPanels: [
      {
        title: '摄食效率统计',
        type: 'metrics',
        data: [
          { label: '活跃摄食个体', value: '2280', unit: '尾' },
          { label: '平均摄食效率', value: '87', unit: '%' }
        ]
      },
      {
        title: '摄食行为智能分析',
        type: 'mixed',
        data: {
          imageUrl: '/api/placeholder/400/200',
          chartData: {
            labels: ['摄食频率', '摄食时长', '摄食效率', '群体行为', '异常检测'],
            datasets: [{
              data: [4.5, 4.8, 4.2, 3.5, 2.8],
              backgroundColor: '#8a2be2',
              borderColor: '#8a2be2',
              borderWidth: 1
            }]
          }
        }
      }
    ]
  };
};