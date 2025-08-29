import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarCharts: React.FC = () => {
  const chartOptions: ChartOptions<'bar'> = {
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
    }
  };

  const operationEfficiencyData = {
    labels: ['装载效率', '卸载效率', '运输效率', '维护效率', '安全指数'],
    datasets: [
      {
        label: '当前值',
        data: [85, 92, 78, 88, 95],
        backgroundColor: [
          'rgba(0, 212, 255, 0.8)',
          'rgba(0, 255, 136, 0.8)',
          'rgba(255, 107, 53, 0.8)',
          'rgba(255, 193, 0, 0.8)',
          'rgba(138, 43, 226, 0.8)'
        ],
        borderColor: [
          '#00d4ff',
          '#00ff88',
          '#ff6b35',
          '#ffc100',
          '#8a2be2'
        ],
        borderWidth: 2
      }
    ]
  };

  const equipmentStatusData = {
    labels: ['起重机1', '起重机2', '起重机3', '起重机4', '起重机5', '起重机6'],
    datasets: [
      {
        label: '运行时长(小时)',
        data: [168, 172, 156, 180, 164, 175],
        backgroundColor: 'rgba(0, 212, 255, 0.6)',
        borderColor: '#00d4ff',
        borderWidth: 2
      },
      {
        label: '维护时长(小时)',
        data: [12, 8, 24, 6, 16, 10],
        backgroundColor: 'rgba(255, 107, 53, 0.6)',
        borderColor: '#ff6b35',
        borderWidth: 2
      }
    ]
  };

  const cargoVolumeData = {
    labels: ['集装箱', '散货', '液体货物', '危险品', '重件货物'],
    datasets: [
      {
        label: '本月(万吨)',
        data: [450, 320, 180, 45, 125],
        backgroundColor: 'rgba(0, 255, 136, 0.6)',
        borderColor: '#00ff88',
        borderWidth: 2
      },
      {
        label: '上月(万吨)',
        data: [420, 340, 165, 38, 110],
        backgroundColor: 'rgba(255, 193, 0, 0.6)',
        borderColor: '#ffc100',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="panel-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">设备运行效率</h3>
            <p className="panel-subtitle">港口作业设备综合指标</p>
          </div>
          <div className="status-indicator"></div>
        </div>
        <div className="panel-content">
          <Bar data={operationEfficiencyData} options={chartOptions} />
        </div>
      </div>

      <div className="panel large-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">起重机运行状态监控</h3>
            <p className="panel-subtitle">设备运行时长与维护统计</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#00d4ff' }}></div>
              <span style={{ color: '#ffffff', fontSize: '12px' }}>运行</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ff6b35' }}></div>
              <span style={{ color: '#ffffff', fontSize: '12px' }}>维护</span>
            </div>
          </div>
        </div>
        <div className="panel-content">
          <Bar data={equipmentStatusData} options={chartOptions} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">设备状态统计</h3>
            <p className="panel-subtitle">实时监控</p>
          </div>
        </div>
        <div className="panel-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="metric-value" style={{ color: '#00ff88' }}>30</div>
              <div className="metric-label">系统数量</div>
              <div style={{ width: '80%', height: '8px', backgroundColor: 'rgba(0,255,136,0.2)', borderRadius: '4px', marginTop: '10px', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#00ff88', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="metric-value" style={{ color: '#ffc100' }}>55</div>
              <div className="metric-label">联动头</div>
              <div style={{ width: '80%', height: '8px', backgroundColor: 'rgba(255,193,0,0.2)', borderRadius: '4px', marginTop: '10px', position: 'relative' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: '#ffc100', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="metric-value" style={{ color: '#ff6b35' }}>56</div>
              <div className="metric-label">指标</div>
              <div style={{ width: '80%', height: '8px', backgroundColor: 'rgba(255,107,53,0.2)', borderRadius: '4px', marginTop: '10px', position: 'relative' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#ff6b35', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="metric-value" style={{ color: '#00d4ff' }}>56</div>
              <div className="metric-label">拾音</div>
              <div style={{ width: '80%', height: '8px', backgroundColor: 'rgba(0,212,255,0.2)', borderRadius: '4px', marginTop: '10px', position: 'relative' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#00d4ff', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">货物吞吐量对比</h3>
            <p className="panel-subtitle">月度统计</p>
          </div>
        </div>
        <div className="panel-content">
          <Bar data={cargoVolumeData} options={chartOptions} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">作业船舶数据变化趋势</h3>
        </div>
        <div className="panel-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#ffffff', fontSize: '14px' }}>历史数据</span>
              <span style={{ color: '#00d4ff', fontSize: '14px' }}>预测预测</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'rgba(0,150,255,0.3)', width: '100%', marginBottom: '15px' }}></div>
            
            {[
              { date: '2024/10/31', count: 1000, change: '+5%' },
              { date: '2024/11/28', count: 950, change: '-2%' },
              { date: '2024/12/26', count: 1100, change: '+8%' },
              { date: '2025/1/23', count: 1050, change: '+3%' }
            ].map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0',
                fontSize: '12px'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.date}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{item.count}</span>
                  <span style={{ 
                    color: item.change.includes('+') ? '#00ff88' : '#ff6b35',
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: item.change.includes('+') ? 'rgba(0,255,136,0.2)' : 'rgba(255,107,53,0.2)',
                    borderRadius: '3px'
                  }}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarCharts;