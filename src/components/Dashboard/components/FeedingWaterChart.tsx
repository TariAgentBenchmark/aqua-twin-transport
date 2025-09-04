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

interface FeedingWaterChartProps {
  className?: string;
  defaultTab?: string;
}

const FeedingWaterChart: React.FC<FeedingWaterChartProps> = ({ className, defaultTab = '摄食强度' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = ['摄食强度', '水质监测'];

  // Different data for each tab
  const getChartData = () => {
    if (activeTab === '摄食强度') {
      return {
        labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [
          {
            label: '摄食强度',
            data: [2.5, 4.8, 7.2, 8.5, 6.8, 3.2],
            borderColor: '#00ff88',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: '#00ff88',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            tension: 0.4,
          }
        ]
      };
    } else {
      return {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
          {
            label: '水质指标',
            data: [7.2, 7.5, 7.8, 7.6, 7.4, 7.3],
            borderColor: '#00d4ff',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: '#00d4ff',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            tension: 0.4,
          }
        ]
      };
    }
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 10 },
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 10 },
        }
      }
    }
  };

  return (
    <div className={`feeding-water-chart ${className || ''}`}>
      {/* Tab Navigation */}
      <div className="feeding-water-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`feeding-water-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="feeding-water-chart-container">
        <Line data={getChartData()} options={chartOptions} />
      </div>
    </div>
  );
};

export default FeedingWaterChart;