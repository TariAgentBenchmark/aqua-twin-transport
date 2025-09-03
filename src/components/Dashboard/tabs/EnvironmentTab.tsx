import { PanelConfig } from '../components/PanelComponents';

export const getEnvironmentTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => {
  return {
    leftPanels: [
      {
        title: '环境参数实时监控',
        type: 'circular',
        data: {
          center: { icon: '🌡️', percentage: 92 },
          stats: [
            { label: '温度传感器', value: '94', unit: '%' },
            { label: 'pH传感器', value: '88', unit: '%' },
            { label: '溶氧传感器', value: '96', unit: '%' }
          ]
        }
      },
      {
        title: '温度变化趋势',
        type: 'line',
        data: {
          labels: ['15日', '16日', '17日', '18日', '19日', '20日', '21日'],
          datasets: [{
            data: [450, 650, 750, 850, 650, 550, 450],
            borderColor: '#00ff88',
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#00ff88',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        }
      },
      {
        title: '环境参数分布',
        type: 'pie',
        data: {
          labels: ['温度适宜', 'pH正常', '溶氧充足', '光照充足', '湿度适中'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              '#00ff88',
              '#00d4ff', 
              '#ffc100',
              '#ff6b35',
              '#8a2be2'
            ],
            borderColor: ['#00ff88', '#00d4ff', '#ffc100', '#ff6b35', '#8a2be2'],
            borderWidth: 2
          }]
        }
      }
    ],
    rightPanels: [
      {
        title: '环境质量指标',
        type: 'metrics',
        data: [
          { label: '在线传感器总数', value: '1850', unit: '个' },
          { label: '环境预警数量', value: '12', unit: '次' }
        ]
      },
      {
        title: '环境监控综合评估',
        type: 'mixed',
        data: {
          imageUrl: '/api/placeholder/400/200',
          chartData: {
            labels: ['温度监控', 'pH监控', '溶氧监控', '浊度监控', '盐度监控'],
            datasets: [{
              data: [5, 4.5, 4, 2, 1],
              backgroundColor: '#00ff88',
              borderColor: '#00ff88',
              borderWidth: 1
            }]
          }
        }
      }
    ]
  };
};