import React, { useState, useEffect } from 'react';

const Header = ({ title, icon }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-full px-4 py-3 flex justify-between items-center gap-4">
        {/* Left: Page Title with Icon */}
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Center: Spacer */}
        <div className="flex-1" />

        {/* Right: Current Time */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">{formatTime(currentTime)}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
