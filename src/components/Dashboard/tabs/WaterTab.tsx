import { PanelConfig } from '../components/PanelComponents';

export const getWaterTabPanels = (): { leftPanels: PanelConfig[], rightPanels: PanelConfig[] } => {
  return {
    leftPanels: [
      {
        title: '水质检测数据表',
        type: 'table',
        data: [
          { time: '2024.12.30 14:23', location: '水质-1号点', status: '水质良好', value: '4h' },
          { time: '2024.12.30 14:24', location: '水质-2号点', status: '水质良好', value: '5h' },
          { time: '2024.12.30 14:20', location: '水质-3号点', status: '水质良好', value: '3h' },
          { time: '2024.12.30 14:21', location: '水质-4号点', status: '水质良好', value: '6h' }
        ]
      },
      {
        title: '水质参数趋势',
        type: 'line',
        data: {
          labels: ['15日', '16日', '17日', '18日', '19日', '20日', '21日'],
          datasets: [{
            data: [400, 500, 650, 750, 650, 550, 450],
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
        title: '水质检测设备',
        type: 'circular',
        data: {
          center: { icon: '💧', percentage: 91 },
          stats: [
            { label: '在线检测仪', value: '93', unit: '%' },
            { label: '自动采样器', value: '88', unit: '%' },
            { label: '数据传输', value: '95', unit: '%' }
          ]
        }
      }
    ],
    rightPanels: [
      {
        title: '水质检测概况',
        type: 'metrics',
        data: [
          { label: '检测点总数', value: '120', unit: '个' },
          { label: '水质合格率', value: '96.5', unit: '%' }
        ]
      },
      {
        title: '水质安全评估报告',
        type: 'mixed',
        data: {
          imageUrl: '/api/placeholder/400/200',
          chartData: {
            labels: ['pH稳定性', '溶氧充足', '氨氮控制', '重金属', '微生物'],
            datasets: [{
              data: [4.8, 4.5, 4.2, 3.8, 3.2],
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