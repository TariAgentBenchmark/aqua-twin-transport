import React, { useState, useRef, useImperativeHandle } from 'react';
import './Dashboard.css';
import FloatingPanels from './FloatingPanels';
import Scene, { SceneRef } from '../Scene';
import TimeWeather from './TimeWeather';

interface TabItem {
  id: string;
  label: string;
}

const Dashboard: React.FC = () => {
  const [leftActiveTab, setLeftActiveTab] = useState('growth');
  const [rightActiveTab, setRightActiveTab] = useState('feeding');
  const [activeTab, setActiveTab] = useState('growth');
  const [currentScene, setCurrentScene] = useState<'exterior' | 'interior' | 'transitioning'>('exterior');
  const [viewMode, setViewMode] = useState<'normal' | 'aerial' | 'interior'>('normal');
  const sceneRef = useRef<SceneRef>(null);

  const allTabs: TabItem[] = [
    { id: 'growth', label: '生长指标' },
    { id: 'environment', label: '环境指标' },
    { id: 'materials', label: '物料投入' },
    { id: 'nutrition', label: '营养健康' },
    { id: 'feeding', label: '摄食强度' },
    { id: 'water', label: '水质检测' },
  ];

  // 保持原有的activeTab状态逻辑，用于向下兼容FloatingPanels
  const leftTabs = allTabs.slice(0, 4);
  const rightTabs = allTabs.slice(4, 6);

  const handleSceneChange = (scene: 'exterior' | 'interior' | 'transitioning') => {
    setCurrentScene(scene);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // 保持原有的左右tab状态逻辑，用于FloatingPanels兼容性
    if (leftTabs.find(tab => tab.id === tabId)) {
      setLeftActiveTab(tabId);
    } else if (rightTabs.find(tab => tab.id === tabId)) {
      setRightActiveTab(tabId);
    }
  };

  const handleViewChange = (view: 'aerial' | 'interior') => {
    if (view === 'aerial') {
      if (viewMode === 'aerial') {
        // 如果已经是俯瞰模式，切换回正常视角
        setViewMode('normal');
        console.log('Switching to normal view...');
        if (sceneRef.current) {
          sceneRef.current.setNormalView();
        }
      } else {
        // 切换到空中俯瞰视角
        setViewMode(view);
        console.log('Switching to aerial view...');
        if (sceneRef.current) {
          sceneRef.current.setAerialView();
        }
      }
    } else if (view === 'interior') {
      // 触发进入内部视角
      setViewMode(view);
      console.log('Switching to interior view...');
      if (sceneRef.current) {
        sceneRef.current.triggerInteriorView();
      }
    }
  };

  return (
    <div className="dashboard">
      {/* 3D Scene Component */}
      <Scene ref={sceneRef} onSceneChange={handleSceneChange} />
      
      {/* Top Navigation */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="title-section">
            <h1 className="title">数字孪生·无水保活运输</h1>
            <p className="subtitle">Digital twin • waterless live transportation</p>
          </div>
        </div>

        <div className="header-center">
          <nav className="main-tab-navigation">
            {allTabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="header-right">
          <TimeWeather />
        </div>
      </header>

      <FloatingPanels leftActiveTab={leftActiveTab} rightActiveTab={rightActiveTab} activeTab={activeTab} />
      
      {/* View Control Buttons - Only show in exterior mode */}
      {currentScene === 'exterior' && (
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'aerial' ? 'active' : ''}`}
            onClick={() => handleViewChange('aerial')}
          >
            <span className="view-icon">✈</span>
            <span className="view-label">空中俯瞰</span>
            <span className="view-sublabel">俯瞰整个厂区</span>
          </button>
          <button
            className={`view-btn ${viewMode === 'interior' ? 'active' : ''}`}
            onClick={() => handleViewChange('interior')}
          >
            <span className="view-icon">🏭</span>
            <span className="view-label">厂房内部</span>
            <span className="view-sublabel">查看鱼池详情</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
