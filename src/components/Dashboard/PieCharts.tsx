import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieCharts: React.FC = () => {
  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          font: {
            size: 11
          },
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 30, 60, 0.9)',
        titleColor: '#00d4ff',
        bodyColor: '#ffffff',
        borderColor: '#00d4ff',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            size: 10
          },
          usePointStyle: true,
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
    cutout: '60%'
  };

  const securityIncidentData = {
    labels: ['当前危险', '死亡危险', '总计'],
    datasets: [
      {
        data: [5001, 499, 1],
        backgroundColor: [
          'rgba(0, 212, 255, 0.8)',
          'rgba(255, 107, 53, 0.8)',
          'rgba(255, 193, 0, 0.8)'
        ],
        borderColor: [
          '#00d4ff',
          '#ff6b35',
          '#ffc100'
        ],
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    ]
  };

  const pollutionData = {
    labels: ['污染物排放', '其他排放', '总计'],
    datasets: [
      {
        data: [3.76, 4.8, 0.75],
        backgroundColor: [
          'rgba(0, 255, 136, 0.8)',
          'rgba(138, 43, 226, 0.8)',
          'rgba(255, 20, 147, 0.8)'
        ],
        borderColor: [
          '#00ff88',
          '#8a2be2',
          '#ff1493'
        ],
        borderWidth: 2
      }
    ]
  };

  const accessControlData = {
    labels: ['已授权', '待审核', '被拒绝', '过期'],
    datasets: [
      {
        data: [1250, 180, 45, 25],
        backgroundColor: [
          'rgba(0, 255, 136, 0.8)',
          'rgba(255, 193, 0, 0.8)',
          'rgba(255, 107, 53, 0.8)',
          'rgba(138, 43, 226, 0.8)'
        ],
        borderColor: [
          '#00ff88',
          '#ffc100',
          '#ff6b35',
          '#8a2be2'
        ],
        borderWidth: 2
      }
    ]
  };

  const emergencyResponseData = {
    labels: ['消防', '医疗', '海上救援', '设备故障'],
    datasets: [
      {
        data: [15, 8, 12, 22],
        backgroundColor: [
          'rgba(255, 107, 53, 0.8)',
          'rgba(0, 212, 255, 0.8)',
          'rgba(0, 255, 136, 0.8)',
          'rgba(255, 193, 0, 0.8)'
        ],
        borderColor: [
          '#ff6b35',
          '#00d4ff',
          '#00ff88',
          '#ffc100'
        ],
        borderWidth: 2
      }
    ]
  };

  const cameraStatusData = {
    labels: ['正常', '离线', '维修中'],
    datasets: [
      {
        data: [145, 12, 8],
        backgroundColor: [
          'rgba(0, 255, 136, 0.8)',
          'rgba(255, 107, 53, 0.8)',
          'rgba(255, 193, 0, 0.8)'
        ],
        borderColor: [
          '#00ff88',
          '#ff6b35',
          '#ffc100'
        ],
        borderWidth: 2
      }
    ]
  };

  const personnelDistributionData = {
    labels: ['码头作业', '管理人员', '安保人员', '维护人员', '访客'],
    datasets: [
      {
        data: [320, 85, 45, 65, 28],
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

  return (
    <div className="panel-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">安全事件统计</h3>
            <p className="panel-subtitle">实时监控数据</p>
          </div>
          <div className="status-indicator"></div>
        </div>
        <div className="panel-content">
          <Pie data={securityIncidentData} options={chartOptions} />
        </div>
      </div>

      <div className="panel large-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">人员分布与权限管理</h3>
            <p className="panel-subtitle">港区人员实时统计</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00ff88', animation: 'pulse 2s infinite' }}></div>
              <span style={{ color: '#00ff88', fontSize: '12px' }}>在线: 543</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffc100' }}></div>
              <span style={{ color: '#ffc100', fontSize: '12px' }}>离线: 0</span>
            </div>
          </div>
        </div>
        <div className="panel-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h4 style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '14px' }}>人员分布</h4>
            <Pie data={personnelDistributionData} options={chartOptions} />
          </div>
          <div>
            <h4 style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '14px' }}>访问权限</h4>
            <Doughnut data={accessControlData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">环保监测</h3>
            <p className="panel-subtitle">污染物排放统计</p>
          </div>
        </div>
        <div className="panel-content">
          <Doughnut data={pollutionData} options={doughnutOptions} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">应急响应情况</h3>
            <p className="panel-subtitle">本月事件统计</p>
          </div>
        </div>
        <div className="panel-content">
          <Pie data={emergencyResponseData} options={chartOptions} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">监控设备状态</h3>
            <p className="panel-subtitle">摄像头运行状态</p>
          </div>
        </div>
        <div className="panel-content" style={{ flexDirection: 'column' }}>
          <div style={{ height: '60%', width: '100%' }}>
            <Doughnut data={cameraStatusData} options={doughnutOptions} />
          </div>
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '20px', fontWeight: 'bold' }}>145</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>正常</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff6b35', fontSize: '20px', fontWeight: 'bold' }}>12</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>离线</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ffc100', fontSize: '20px', fontWeight: 'bold' }}>8</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>维修</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">港口安全指数</h3>
        </div>
        <div className="panel-content" style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'conic-gradient(#00ff88 0deg 324deg, rgba(0,255,136,0.2) 324deg 360deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#0f1419',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#00ff88'
              }}>
                90%
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '10px' }}>综合安全指数</div>
          </div>
          
          <div style={{ width: '100%', paddingTop: '15px' }}>
            {[
              { label: '入侵检测', value: 95, color: '#00ff88' },
              { label: '火灾预警', value: 88, color: '#00d4ff' },
              { label: '设备安全', value: 92, color: '#ffc100' },
              { label: '环境监测', value: 87, color: '#ff6b35' }
            ].map((item, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.label}</span>
                  <span style={{ color: item.color }}>{item.value}%</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ 
                    width: `${item.value}%`, 
                    height: '100%', 
                    backgroundColor: item.color, 
                    borderRadius: '2px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieCharts;