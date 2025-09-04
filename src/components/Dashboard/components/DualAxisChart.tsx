import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DualAxisChartProps {
  className?: string;
  defaultTab?: string;
  chartData?: {
    primary: { label: string; color: string };
    secondary: { label: string; color: string };
  };
}

const DualAxisChart: React.FC<DualAxisChartProps> = ({ 
  className, 
  defaultTab = '生长指标',
  chartData = {
    primary: { label: '溶解氧(左)', color: '#4A90E2' },
    secondary: { label: '亚盐(右)', color: '#D2691E' }
  }
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = ['生长指标', '环境指标', '物料投入', '营养健康'];

  // Chart data
  const chartDataConfig = {
    labels: ['2024/10/31', '2024/11/28', '2024/12/26', '2025/1/23'],
    datasets: [
      {
        label: chartData.primary.label,
        data: [6.2, 6.5, 6.3, 6.8, 6.1, 6.4, 6.6],
        borderColor: chartData.primary.color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointBackgroundColor: chartData.primary.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 4,
        yAxisID: 'y',
      },
      {
        label: chartData.secondary.label,
        data: [4.2, 4.8, 4.1, 4.6, 4.3, 4.5, 4.0],
        borderColor: chartData.secondary.color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointBackgroundColor: chartData.secondary.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 4,
        yAxisID: 'y1',
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: { size: 10 },
          boxWidth: 12,
          padding: 8,
          usePointStyle: true,
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
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 9 },
          maxRotation: 45,
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 9 },
        },
        min: 0,
        max: 10,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 9 },
        },
        min: 0,
        max: 1,
      },
    },
  };

  return (
    <div className={`dual-axis-chart ${className || ''}`}>
      {/* Tab Navigation */}
      <div className="chart-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`chart-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        <Line data={chartDataConfig} options={chartOptions} />
        
        {/* Historical Data / Prediction Divider */}
        <div className="data-divider">
          <div className="divider-line"></div>
          <div className="divider-labels">
            <span className="historical-label">历史数据</span>
            <span className="prediction-label">模拟预测</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualAxisChart;