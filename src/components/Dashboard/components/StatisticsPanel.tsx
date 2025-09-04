import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsPanelProps {
  className?: string;
  title?: string;
  metrics?: {
    feedEfficiency: { enabled: boolean; title: string };
    survivalRate: { enabled: boolean; title: string };
    pollution: { enabled: boolean; title: string };
  };
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ 
  className, 
  title = '统计汇总',
  metrics = {
    feedEfficiency: { enabled: true, title: '饲料产出效率' },
    survivalRate: { enabled: true, title: '成活率≈90.9%' },
    pollution: { enabled: true, title: '污染物排放量(kg)' }
  }
}) => {
  // Bar chart data for feed efficiency
  const barData = {
    labels: ['饲料产量', '饲料投入'],
    datasets: [
      {
        data: [320, 380],
        backgroundColor: ['#4A90E2', '#4A90E2'],
        borderRadius: 4,
        barThickness: 40,
      }
    ]
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 9 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 9 } },
        max: 400
      }
    }
  };

  // Survival rate doughnut chart
  const survivalData = {
    datasets: [
      {
        data: [90.9, 9.1],
        backgroundColor: ['#4A90E2', 'rgba(255, 255, 255, 0.2)'],
        borderWidth: 0,
        cutout: '70%',
      }
    ]
  };

  const survivalOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  // Pollution emission pie chart
  const pollutionData = {
    datasets: [
      {
        data: [3.76, 4.8, 0.75],
        backgroundColor: ['#4A90E2', '#FF6B47', '#FFA500'],
        borderWidth: 1,
        borderColor: '#ffffff',
      }
    ]
  };

  const pollutionOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 30, 60, 0.9)',
        titleColor: '#00d4ff',
        bodyColor: '#ffffff',
        borderColor: '#00d4ff',
        borderWidth: 1,
      }
    }
  };

  return (
    <div className={`statistics-panel ${className || ''}`}>
      {/* Statistics Summary Title */}
      <div className="stats-header">
        <h3 className="stats-title">{title}</h3>
      </div>
      
      <div className="stats-grid">
        {/* Feed Efficiency Section */}
        {metrics.feedEfficiency.enabled && (
        <div className="stat-section">
          <div className="stat-title">{metrics.feedEfficiency.title}</div>
          <div className="bar-chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="stat-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{backgroundColor: '#4A90E2'}}></div>
              <span>饲料产量</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{backgroundColor: '#4A90E2'}}></div>
              <span>饲料投入</span>
            </div>
          </div>
        </div>
        )}

        {/* Survival Rate Section */}
        {metrics.survivalRate.enabled && (
        <div className="stat-section">
          <div className="stat-title">{metrics.survivalRate.title}</div>
          <div className="survival-chart-container">
            <div className="survival-chart-wrapper">
              <Doughnut data={survivalData} options={survivalOptions} />
              <div className="survival-center">
                <div className="survival-number">499</div>
                <div className="survival-total">5001</div>
              </div>
            </div>
          </div>
          <div className="stat-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{backgroundColor: '#4A90E2'}}></div>
              <span>当前尾数</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)'}}></div>
              <span>死亡尾数</span>
            </div>
          </div>
        </div>
        )}

        {/* Pollution Emission Section */}
        {metrics.pollution.enabled && (
        <div className="stat-section">
          <div className="stat-title">{metrics.pollution.title}</div>
          <div className="pollution-chart-container">
            <div className="pollution-chart-wrapper">
              <Doughnut data={pollutionData} options={pollutionOptions} />
              <div className="pollution-values">
                <div className="pollution-main">3.76</div>
                <div className="pollution-secondary">
                  <span>4.8</span>
                  <span>0.75</span>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{backgroundColor: '#4A90E2'}}></div>
              <span>总C</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{backgroundColor: '#FF6B47'}}></div>
              <span>总P</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{backgroundColor: '#FFA500'}}></div>
              <span>总N</span>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPanel;