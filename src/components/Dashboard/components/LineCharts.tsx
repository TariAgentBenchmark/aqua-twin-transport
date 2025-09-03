import React, { useEffect, useRef } from 'react';
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

const LineCharts: React.FC = () => {
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      },
      title: {
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
          color: 'rgba(0, 150, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 150, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        hoverRadius: 6
      }
    }
  };

  const dissolvedOxygenData = {
    labels: ['2024/10/31', '2024/11/28', '2024/12/26', '2025/1/23'],
    datasets: [
      {
        label: '溶解氧(左)',
        data: [6.5, 6.2, 6.3, 6.1, 6.2, 6.0, 6.1],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y',
        pointRadius: 4,
        pointBackgroundColor: '#00d4ff'
      },
      {
        label: '亚盐(右)',
        data: [4.5, 4.2, 4.4, 4.1, 4.3, 4.0, 4.2],
        borderColor: '#ff6b35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
        pointRadius: 4,
        pointBackgroundColor: '#ff6b35'
      }
    ]
  };

  const feedingData = {
    labels: ['12:45:01', '12:45:05', '12:45:10', '12:45:15', '12:45:20', '12:45:25'],
    datasets: [
      {
        label: '溶解氧',
        data: [6, 6.2, 5.8, 6.1, 6.0, 5.9],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#00d4ff'
      }
    ]
  };

  const enhancedOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="panel-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">防虫统计与预测</h3>
            <p className="panel-subtitle">生长指标 环境指标 物料投入</p>
          </div>
          <div className="status-indicator"></div>
        </div>
        <div className="panel-content">
          <Line data={dissolvedOxygenData} options={enhancedOptions} />
        </div>
      </div>

      <div className="panel large-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">投食强度/水质监测</h3>
            <p className="panel-subtitle">增氧机控制</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00ff88' }}>自动</span>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#00ff88' }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#888' }}>开</span>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#444' }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#888' }}>关</span>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#444' }}></div>
            </div>
          </div>
        </div>
        <div className="panel-content">
          <Line data={feedingData} options={chartOptions} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">统计汇总</h3>
            <p className="panel-subtitle">饲料出效率</p>
          </div>
        </div>
        <div className="panel-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
            <div>
              <div className="metric-value">90.9%</div>
              <div className="metric-label">成活率</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="metric-value" style={{ color: '#ff6b35' }}>3.76</div>
              <div className="metric-label">污染物排放量(kg)</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#00d4ff', fontSize: '24px', fontWeight: 'bold' }}>400 Kg</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>总产量</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>350 Kg</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>饲料投入</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">港口信息显示</h3>
        </div>
        <div className="panel-content" style={{ flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="metric-value" style={{ color: '#00d4ff' }}>1500</div>
              <div className="metric-label">在港装载货物总量</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="metric-value" style={{ color: '#00ff88' }}>899</div>
              <div className="metric-label">港口电子围栏总数</div>
            </div>
          </div>
          <div style={{ width: '100%', height: '60px', backgroundColor: 'rgba(0,50,100,0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>港口安全监察情况</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">入港时间</h3>
        </div>
        <div className="panel-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ width: '100%' }}>
            {[
              { time: '2020.10.1 14:44', location: '灵泊站点', type: '杂货入港', duration: '7h' },
              { time: '2020.10.1 14:44', location: '灵泊站点', type: '杂货入港', duration: '8h' },
              { time: '2020.10.1 14:20', location: '灵泊站点', type: '杂货入港', duration: '4h' },
              { time: '2020.10.1 14:21', location: '灵泊站点', type: '杂货入港', duration: '5h' }
            ].map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0', 
                borderBottom: index < 3 ? '1px solid rgba(0,150,255,0.1)' : 'none',
                fontSize: '12px'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.time}</span>
                <span style={{ color: '#00d4ff' }}>{item.location}</span>
                <span style={{ color: '#00ff88' }}>{item.type}</span>
                <span style={{ color: '#ff6b35' }}>{item.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineCharts;