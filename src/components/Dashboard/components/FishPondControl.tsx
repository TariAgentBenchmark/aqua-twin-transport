import React, { useState } from 'react';

interface FishPondControlProps {
  className?: string;
}

const FishPondControl: React.FC<FishPondControlProps> = ({ className }) => {
  const [selectedPond, setSelectedPond] = useState('鱼池1');
  const [oxygenatorMode, setOxygenatorMode] = useState<'自动' | '开' | '关'>('自动');

  const ponds = ['鱼池1', '鱼池2', '鱼池3', '鱼池4', '鱼池5'];

  const handlePondChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPond(event.target.value);
  };

  const handleOxygenatorControl = (mode: '自动' | '开' | '关') => {
    setOxygenatorMode(mode);
  };

  return (
    <div className={`fish-pond-control ${className || ''}`}>
      {/* Top Section: Pond Selection */}
      <div className="pond-selection-section">
        <select 
          className="pond-dropdown" 
          value={selectedPond} 
          onChange={handlePondChange}
        >
          {ponds.map(pond => (
            <option key={pond} value={pond}>{pond}</option>
          ))}
        </select>
      </div>

      {/* Bottom Section: Horizontal Layout */}
      <div className="bottom-section">
        {/* Left: Oxygenator Control */}
        <div className="control-section">
          <div className="control-title">增氧机控制</div>
          <div className="control-buttons">
            <button 
              className={`control-btn ${oxygenatorMode === '自动' ? 'active' : ''}`}
              onClick={() => handleOxygenatorControl('自动')}
            >
              自动
            </button>
            <button 
              className={`control-btn ${oxygenatorMode === '开' ? 'active' : ''}`}
              onClick={() => handleOxygenatorControl('开')}
            >
              开
            </button>
            <button 
              className={`control-btn ${oxygenatorMode === '关' ? 'active' : ''}`}
              onClick={() => handleOxygenatorControl('关')}
            >
              关
            </button>
          </div>
        </div>

        {/* Right: Monitoring Interface Display */}
        <div className="monitoring-interface">
          <div className="interface-content">
            <div className="pond-info">
              <span className="pond-name">{selectedPond}</span>
              <span className="pond-status">
                增氧机: <span className={`status-indicator ${oxygenatorMode === '开' ? 'active' : oxygenatorMode === '自动' ? 'auto' : 'inactive'}`}>
                  {oxygenatorMode}
                </span>
              </span>
            </div>
            <div className="monitoring-placeholder">
              <div className="camera-icon">📹</div>
              <div className="monitoring-text">实时监控画面</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishPondControl;