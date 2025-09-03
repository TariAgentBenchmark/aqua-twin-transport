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
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

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

export interface TableData {
  time: string;
  location: string;
  status: string;
  value: string;
}

export interface ChartData {
  labels: string[];
  datasets: any[];
}

export interface CircularData {
  center: { icon: string; percentage: number };
  stats: { label: string; value: string; unit: string }[];
}

export interface MetricData {
  label: string;
  value: string;
  unit?: string;
}

export interface MixedData {
  imageUrl?: string;
  chartData: ChartData;
}

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

export const TablePanel: React.FC<{ data: TableData[] }> = ({ data }) => (
  <div className="table-container">
    <div className="table-header">
      <span>时间</span>
      <span>运输地点</span>
      <span>入港地</span>
      <span>入港时间</span>
    </div>
    {data.map((row, index) => (
      <div key={index} className="table-row">
        <span className="table-time">{row.time}</span>
        <span className="table-location">{row.location}</span>
        <span className="table-status">{row.status}</span>
        <span className="table-value">{row.value}</span>
      </div>
    ))}
  </div>
);

export const LineChartPanel: React.FC<{ data: ChartData }> = ({ data }) => (
  <Line data={data} options={commonOptions} />
);

export const BarChartPanel: React.FC<{ data: ChartData }> = ({ data }) => (
  <Bar data={data} options={commonOptions} />
);

export const PieChartPanel: React.FC<{ data: ChartData }> = ({ data }) => (
  <Pie data={data} options={commonOptions} />
);

export const CircularPanel: React.FC<{ data: CircularData }> = ({ data }) => (
  <div className="circular-panel">
    <div className="circular-chart">
      <div className="circular-center">
        <div className="center-icon">{data.center.icon}</div>
        <div className="center-percentage">{data.center.percentage}%</div>
      </div>
    </div>
    <div className="stats-list">
      {data.stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="stat-indicator">◆</div>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">
            {stat.value}<span className="stat-unit">{stat.unit}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const MetricsPanel: React.FC<{ data: MetricData[] }> = ({ data }) => (
  <div className="metrics-container">
    {data.map((metric, index) => (
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

export const MixedPanel: React.FC<{ data: MixedData }> = ({ data }) => (
  <div className="mixed-panel">
    <div className="panel-image">
      <div className="placeholder-image">
        📷 监控画面
      </div>
    </div>
    <div className="chart-container">
      <Bar data={data.chartData} options={commonOptions} />
    </div>
  </div>
);

export interface PanelConfig {
  title: string;
  type: 'table' | 'line' | 'bar' | 'pie' | 'circular' | 'metrics' | 'mixed';
  data: any;
}

export const PanelRenderer: React.FC<{ panel: PanelConfig }> = ({ panel }) => {
  switch (panel.type) {
    case 'table':
      return <TablePanel data={panel.data} />;
    case 'line':
      return <LineChartPanel data={panel.data} />;
    case 'bar':
      return <BarChartPanel data={panel.data} />;
    case 'pie':
      return <PieChartPanel data={panel.data} />;
    case 'circular':
      return <CircularPanel data={panel.data} />;
    case 'metrics':
      return <MetricsPanel data={panel.data} />;
    case 'mixed':
      return <MixedPanel data={panel.data} />;
    default:
      return null;
  }
};