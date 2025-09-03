import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

interface FloatingPanelsProps {
  leftActiveTab: string;
  rightActiveTab: string;
  activeTab?: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FloatingPanels: React.FC<FloatingPanelsProps> = ({ leftActiveTab, rightActiveTab, activeTab }) => {
  const currentTab = activeTab || leftActiveTab;
  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: { size: 11 },
          boxWidth: 12,
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 30, 60, 0.9)',
        titleColor: '#00d4ff',
        bodyColor: '#ffffff',
        borderColor: '#00d4ff',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 150, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(0, 150, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: { size: 10 },
          usePointStyle: true,
          padding: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 30, 60, 0.9)',
        titleColor: '#00d4ff',
        bodyColor: '#ffffff',
        borderColor: '#00d4ff',
        borderWidth: 1,
      }
    }
  };

  // Generate tab-specific content
  const getTabContent = () => {
    switch (currentTab) {
      case 'growth':
        return {
          leftPanels: [
            {
              title: '实时监测记录',
              type: 'table',
              data: [
                { time: '2024.12.30 14:23', location: '养殖-A区域', status: '生长正常', value: '7h' },
                { time: '2024.12.30 14:24', location: '养殖-B区域', status: '生长正常', value: '8h' },
                { time: '2024.12.30 14:20', location: '养殖-C区域', status: '生长正常', value: '4h' },
                { time: '2024.12.30 14:21', location: '养殖-D区域', status: '生长正常', value: '5h' }
              ]
            },
            {
              title: '生长指标变化趋势',
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
              title: '生长设备数量',
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
              title: '生长信息展示',
              type: 'metrics',
              data: [
                { label: '在池鱼苗总数', value: '2500', unit: '尾' },
                { label: '平均体重增长', value: '168', unit: 'g' }
              ]
            },
            {
              title: '生长安全监管情况',
              type: 'mixed',
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
          ]
        };

      case 'environment':
        return {
          leftPanels: [
            {
              title: '环境检测记录',
              type: 'table',
              data: [
                { time: '2024.12.30 14:23', location: '检测-1号点', status: '环境优良', value: '8h' },
                { time: '2024.12.30 14:24', location: '检测-2号点', status: '环境优良', value: '6h' },
                { time: '2024.12.30 14:20', location: '检测-3号点', status: '环境优良', value: '9h' },
                { time: '2024.12.30 14:21', location: '检测-4号点', status: '环境优良', value: '7h' }
              ]
            },
            {
              title: '环境参数变化趋势',
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
              title: '环境设备数量',
              type: 'circular',
              data: {
                center: { icon: '🌡️', percentage: 92 },
                stats: [
                  { label: '温度传感器', value: '94', unit: '%' },
                  { label: 'pH传感器', value: '88', unit: '%' },
                  { label: '溶氧传感器', value: '96', unit: '%' }
                ]
              }
            }
          ],
          rightPanels: [
            {
              title: '环境信息展示',
              type: 'metrics',
              data: [
                { label: '在线传感器总数', value: '1850', unit: '个' },
                { label: '环境预警数量', value: '12', unit: '次' }
              ]
            },
            {
              title: '环境安全监管情况',
              type: 'mixed',
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
          ]
        };

      case 'materials':
        return {
          leftPanels: [
            {
              title: '物料投放记录',
              type: 'table',
              data: [
                { time: '2024.12.30 14:23', location: '投料-A区域', status: '投料完成', value: '5h' },
                { time: '2024.12.30 14:24', location: '投料-B区域', status: '投料完成', value: '3h' },
                { time: '2024.12.30 14:20', location: '投料-C区域', status: '投料完成', value: '6h' },
                { time: '2024.12.30 14:21', location: '投料-D区域', status: '投料完成', value: '4h' }
              ]
            },
            {
              title: '物料消耗变化趋势',
              type: 'line',
              data: {
                labels: ['15日', '16日', '17日', '18日', '19日', '20日', '21日'],
                datasets: [{
                  data: [350, 450, 550, 650, 750, 850, 650],
                  borderColor: '#ffc100',
                  backgroundColor: 'transparent',
                  borderWidth: 3,
                  tension: 0.4,
                  pointBackgroundColor: '#ffc100',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 6
                }]
              }
            },
            {
              title: '物料库存数量',
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
              title: '物料信息展示',
              type: 'metrics',
              data: [
                { label: '日均饲料消耗', value: '3500', unit: 'kg' },
                { label: '物料库存预警', value: '8', unit: '项' }
              ]
            },
            {
              title: '物料安全监管情况',
              type: 'mixed',
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
          ]
        };

      case 'nutrition':
        return {
          leftPanels: [
            {
              title: '营养检测记录',
              type: 'table',
              data: [
                { time: '2024.12.30 14:23', location: '营养-A组', status: '营养充足', value: '6h' },
                { time: '2024.12.30 14:24', location: '营养-B组', status: '营养充足', value: '7h' },
                { time: '2024.12.30 14:20', location: '营养-C组', status: '营养充足', value: '5h' },
                { time: '2024.12.30 14:21', location: '营养-D组', status: '营养充足', value: '8h' }
              ]
            },
            {
              title: '营养指标变化趋势',
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
              title: '营养监测设备',
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
              title: '营养信息展示',
              type: 'metrics',
              data: [
                { label: '营养配方总数', value: '15', unit: '套' },
                { label: '营养效果评价', value: '94', unit: '分' }
              ]
            },
            {
              title: '营养安全监管情况',
              type: 'mixed',
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
          ]
        };

      case 'feeding':
        return {
          leftPanels: [
            {
              title: '摄食监测记录',
              type: 'table',
              data: [
                { time: '2024.12.30 14:23', location: '摄食-A区', status: '摄食活跃', value: '9h' },
                { time: '2024.12.30 14:24', location: '摄食-B区', status: '摄食活跃', value: '7h' },
                { time: '2024.12.30 14:20', location: '摄食-C区', status: '摄食活跃', value: '8h' },
                { time: '2024.12.30 14:21', location: '摄食-D区', status: '摄食活跃', value: '6h' }
              ]
            },
            {
              title: '摄食强度变化趋势',
              type: 'line',
              data: {
                labels: ['15日', '16日', '17日', '18日', '19日', '20日', '21日'],
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
              title: '摄食监控设备',
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
              title: '摄食信息展示',
              type: 'metrics',
              data: [
                { label: '活跃摄食个体', value: '2280', unit: '尾' },
                { label: '平均摄食效率', value: '87', unit: '%' }
              ]
            },
            {
              title: '摄食安全监管情况',
              type: 'mixed',
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
          ]
        };
      case 'water':
        return {
          leftPanels: [
            {
              title: '水质检测记录',
              type: 'table',
              data: [
                { time: '2024.12.30 14:23', location: '水质-1号点', status: '水质良好', value: '4h' },
                { time: '2024.12.30 14:24', location: '水质-2号点', status: '水质良好', value: '5h' },
                { time: '2024.12.30 14:20', location: '水质-3号点', status: '水质良好', value: '3h' },
                { time: '2024.12.30 14:21', location: '水质-4号点', status: '水质良好', value: '6h' }
              ]
            },
            {
              title: '水质参数变化趋势',
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
              title: '水质信息展示',
              type: 'metrics',
              data: [
                { label: '检测点总数', value: '120', unit: '个' },
                { label: '水质合格率', value: '96.5', unit: '%' }
              ]
            },
            {
              title: '水质安全监管情况',
              type: 'mixed',
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
          ]
        };
      default:
        return {
          leftPanels: [
            {
              title: '实时监测记录',
              type: 'table',
              data: [
                { time: '2024.12.30 14:23', location: '系统-默认区域', status: '运行正常', value: '7h' },
                { time: '2024.12.30 14:24', location: '系统-备份区域', status: '运行正常', value: '8h' }
              ]
            },
            {
              title: '系统运行趋势',
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
              title: '系统设备状态',
              type: 'circular',
              data: {
                center: { icon: '⚙️', percentage: 85 },
                stats: [
                  { label: '在线设备', value: '85', unit: '%' },
                  { label: '数据完整', value: '92', unit: '%' },
                  { label: '响应正常', value: '88', unit: '%' }
                ]
              }
            }
          ],
          rightPanels: [
            {
              title: '系统信息展示',
              type: 'metrics',
              data: [
                { label: '在线设备总数', value: '1500', unit: '台' },
                { label: '系统运行时间', value: '8760', unit: '小时' }
              ]
            },
            {
              title: '系统监管情况',
              type: 'mixed',
              imageUrl: '/api/placeholder/400/200',
              chartData: {
                labels: ['设备状态', '网络连接', '数据采集', '异常处理', '维护保养'],
                datasets: [{
                  data: [4.8, 4.2, 3.5, 1.8, 1.2],
                  backgroundColor: '#00d4ff',
                  borderColor: '#00d4ff',
                  borderWidth: 1
                }]
              }
            }
          ]
        };
    }
  };

  const tabContent = getTabContent();

  const renderPanel = (panel: any) => {
    switch (panel.type) {
      case 'table':
        return (
          <div className="table-container">
            <div className="table-header">
              <span>时间</span>
              <span>运输地点</span>
              <span>入港地</span>
              <span>入港时间</span>
            </div>
            {panel.data.map((row: any, index: number) => (
              <div key={index} className="table-row">
                <span className="table-time">{row.time}</span>
                <span className="table-location">{row.location}</span>
                <span className="table-status">{row.status}</span>
                <span className="table-value">{row.value}</span>
              </div>
            ))}
          </div>
        );
      case 'line':
        return <Line data={panel.data} options={commonOptions} />;
      case 'circular':
        return (
          <div className="circular-panel">
            <div className="circular-chart">
              <div className="circular-center">
                <div className="center-icon">{panel.data.center.icon}</div>
                <div className="center-percentage">{panel.data.center.percentage}%</div>
              </div>
            </div>
            <div className="stats-list">
              {panel.data.stats.map((stat: any, index: number) => (
                <div key={index} className="stat-item">
                  <div className="stat-indicator">◆</div>
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}<span className="stat-unit">{stat.unit}</span></span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'metrics':
        return (
          <div className="metrics-container">
            {panel.data.map((metric: any, index: number) => (
              <div key={index} className="metric-card">
                <div className="metric-corners">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
                {metric.unit && <div className="metric-unit">{metric.unit}</div>}
              </div>
            ))}
          </div>
        );
      case 'mixed':
        return (
          <div className="mixed-panel">
            <div className="panel-image">
              <div className="placeholder-image">
                📷 监控画面
              </div>
            </div>
            <div className="chart-container">
              <Bar data={panel.chartData} options={commonOptions} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="floating-panels-container">
      {/* Left Panels (3) */}
      <div className="left-panels-group">
        {tabContent.leftPanels.map((panel, index) => (
          <div key={index} className={`floating-panel left-panel-${index + 1}`}>
            <div className="panel-header">
              <div className="header-icon">▤</div>
              <span className="panel-title">{panel.title}</span>
            </div>
            <div className="panel-content">
              {renderPanel(panel)}
            </div>
          </div>
        ))}
      </div>

      {/* Right Panels (2) */}
      <div className="right-panels-group">
        {tabContent.rightPanels.map((panel, index) => (
          <div key={index} className={`floating-panel right-panel-${index + 1}`}>
            <div className="panel-header">
              <div className="header-icon">▤</div>
              <span className="panel-title">{panel.title}</span>
            </div>
            <div className="panel-content">
              {renderPanel(panel)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingPanels;