import React, { useState, useEffect } from 'react';

interface TimeWeatherProps {
  className?: string;
}

const TimeWeather: React.FC<TimeWeatherProps> = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className={`time-weather-container ${className}`}>
      <div className="weather-time-info">
        天气：多云 {formatDateTime(currentTime)}
      </div>
    </div>
  );
};

export default TimeWeather;
