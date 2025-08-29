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

const FloatingPanels: React.FC<FloatingPanelsProps> = ({ leftActiveTab, rightActiveTab }) => {
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

  // Left panel data based on leftActiveTab  
  const getLeftChartData = () => {
    switch (leftActiveTab) {
      case 'growth':
        return {
          title: '生长指标统计',
          subtitle: '鱼类成长数据监测',
          type: 'line' as const,
          data: {
            labels: ['2024/10/31', '2024/11/28', '2024/12/26', '2025/1/23'],
            datasets: [
              {
                label: '体重增长(g)',
                data: [120, 135, 148, 162],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4
              },
              {
                label: '体长增长(cm)',
                data: [8.5, 9.2, 9.8, 10.3],
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderWidth: 2,
                tension: 0.4
              }
            ]
          }
        };

      case 'environment':
        return {
          title: '环境指标监测',
          subtitle: '溶解氧 & 亚硝酸盐',
          type: 'line' as const,
          data: {
            labels: ['2024/10/31', '2024/11/28', '2024/12/26', '2025/1/23'],
            datasets: [
              {
                label: '溶解氧(mg/L)',
                data: [6.5, 6.2, 6.8, 6.1],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4
              },
              {
                label: '亚硝酸盐(mg/L)',
                data: [0.45, 0.42, 0.44, 0.41],
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderWidth: 2,
                tension: 0.4
              }
            ]
          }
        };

      case 'materials':
        return {
          title: '物料投入统计',
          subtitle: '饲料与添加剂投入量',
          type: 'bar' as const,
          data: {
            labels: ['饲料', '维生素', '矿物质', '益生菌', '免疫增强剂'],
            datasets: [
              {
                label: '投入量(kg)',
                data: [400, 12, 8, 15, 5],
                backgroundColor: [
                  'rgba(0, 212, 255, 0.8)',
                  'rgba(0, 255, 136, 0.8)',
                  'rgba(255, 193, 0, 0.8)',
                  'rgba(255, 107, 53, 0.8)',
                  'rgba(138, 43, 226, 0.8)'
                ],
                borderColor: ['#00d4ff', '#00ff88', '#ffc100', '#ff6b35', '#8a2be2'],
                borderWidth: 2
              }
            ]
          }
        };

      case 'nutrition':
        return {
          title: '营养健康分析',
          subtitle: '营养成分与健康指标',
          type: 'pie' as const,
          data: {
            labels: ['蛋白质', '脂肪', '碳水化合物', '维生素', '矿物质'],
            datasets: [
              {
                data: [35, 15, 25, 15, 10],
                backgroundColor: [
                  'rgba(0, 212, 255, 0.8)',
                  'rgba(0, 255, 136, 0.8)',
                  'rgba(255, 193, 0, 0.8)',
                  'rgba(255, 107, 53, 0.8)',
                  'rgba(138, 43, 226, 0.8)'
                ],
                borderColor: ['#00d4ff', '#00ff88', '#ffc100', '#ff6b35', '#8a2be2'],
                borderWidth: 2
              }
            ]
          }
        };

      default:
        return {
          title: '生长指标统计',
          subtitle: '鱼类成长数据监测',
          type: 'line' as const,
          data: {
            labels: ['2024/10/31', '2024/11/28', '2024/12/26', '2025/1/23'],
            datasets: [
              {
                label: '体重增长(g)',
                data: [120, 135, 148, 162],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4
              }
            ]
          }
        };
    }
  };

  // Right panel data based on rightActiveTab
  const getRightChartData = () => {
    switch (rightActiveTab) {
      case 'feeding':
        return {
          title: '摄食强度监测',
          subtitle: '实时摄食行为分析',
          type: 'line' as const,
          data: {
            labels: ['12:45:01', '12:45:05', '12:45:10', '12:45:15', '12:45:20'],
            datasets: [
              {
                label: '摄食强度',
                data: [6, 6.2, 5.8, 6.1, 6.0],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4
              }
            ]
          }
        };

      case 'water':
        return {
          title: '水质检测数据',
          subtitle: '多项水质指标监测',
          type: 'bar' as const,
          data: {
            labels: ['pH值', '温度', '溶解氧', '氨氮', '亚硝酸盐'],
            datasets: [
              {
                label: '当前值',
                data: [7.2, 24.5, 6.8, 0.25, 0.15],
                backgroundColor: [
                  'rgba(0, 212, 255, 0.8)',
                  'rgba(0, 255, 136, 0.8)',
                  'rgba(255, 193, 0, 0.8)',
                  'rgba(255, 107, 53, 0.8)',
                  'rgba(138, 43, 226, 0.8)'
                ],
                borderColor: ['#00d4ff', '#00ff88', '#ffc100', '#ff6b35', '#8a2be2'],
                borderWidth: 2
              }
            ]
          }
        };

      default:
        return {
          title: '摄食强度监测',
          subtitle: '实时摄食行为分析',
          type: 'line' as const,
          data: {
            labels: ['12:45:01', '12:45:05', '12:45:10', '12:45:15', '12:45:20'],
            datasets: [
              {
                label: '摄食强度',
                data: [6, 6.2, 5.8, 6.1, 6.0],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4
              }
            ]
          }
        };
    }
  };

  const leftChartData = getLeftChartData();
  const rightChartData = getRightChartData();

  const renderChart = (chartInfo: any) => {
    switch (chartInfo.type) {
      case 'line':
        return <Line data={chartInfo.data} options={commonOptions} />;
      case 'bar':
        return <Bar data={chartInfo.data} options={commonOptions} />;
      case 'pie':
        return <Pie data={chartInfo.data} options={pieOptions} />;
      case 'doughnut':
        return <Doughnut data={chartInfo.data} options={pieOptions} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Left Floating Panel */}
      <div className="floating-panel left-panel">
        <div className="floating-panel-header">
          <h3>{leftChartData.title}</h3>
          <p className="chart-subtitle">{leftChartData.subtitle}</p>
        </div>
        <div className="chart-container">
          {renderChart(leftChartData)}
        </div>
      </div>

      {/* Right Floating Panel */}
      <div className="floating-panel right-panel">
        <div className="floating-panel-header">
          <h3>{rightChartData.title}</h3>
          <p className="chart-subtitle">{rightChartData.subtitle}</p>
        </div>
        <div className="chart-container">
          {renderChart(rightChartData)}
        </div>
      </div>
    </>
  );
};

export default FloatingPanels;