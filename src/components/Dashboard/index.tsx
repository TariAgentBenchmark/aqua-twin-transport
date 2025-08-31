import React, { useState } from 'react';
import './Dashboard.css';
import FloatingPanels from './FloatingPanels';
import Scene from '../Scene';

interface TabItem {
  id: string;
  label: string;
}

const Dashboard: React.FC = () => {
  const [leftActiveTab, setLeftActiveTab] = useState('growth');
  const [rightActiveTab, setRightActiveTab] = useState('feeding');
  const [currentScene, setCurrentScene] = useState<'exterior' | 'interior' | 'transitioning'>('exterior');

  const leftTabs: TabItem[] = [
    { id: 'growth', label: '生长指标' },
    { id: 'environment', label: '环境指标' },
    { id: 'materials', label: '物料投入' },
    { id: 'nutrition', label: '营养健康' },
  ];

  const rightTabs: TabItem[] = [
    { id: 'feeding', label: '摄食强度' },
    { id: 'water', label: '水质检测' },
  ];

  const handleSceneChange = (scene: 'exterior' | 'interior' | 'transitioning') => {
    setCurrentScene(scene);
  };

  return (
    <div className="dashboard">
      {/* 3D Scene Component */}
      <Scene onSceneChange={handleSceneChange} />
      
      {/* Top Navigation */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="left-tab-section">
            <h4 className="section-title">历史统计与预测</h4>
            <nav className="left-tab-navigation">
              {leftTabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn small ${leftActiveTab === tab.id ? 'active' : ''}`}
                  onClick={() => setLeftActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="header-center">
          <h1 className="title">水产品无水保活运输数字孪生系统</h1>
          <p className="subtitle">Digital Twin System for Waterless Live Aquatic Product Transportation</p>
        </div>
        
        <div className="header-right">
          <div className="right-tab-section">
            <h4 className="section-title">实时监控</h4>
            <nav className="right-tab-navigation">
              {rightTabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn small ${rightActiveTab === tab.id ? 'active' : ''}`}
                  onClick={() => setRightActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <FloatingPanels leftActiveTab={leftActiveTab} rightActiveTab={rightActiveTab} />
    </div>
  );
};

export default Dashboard;
