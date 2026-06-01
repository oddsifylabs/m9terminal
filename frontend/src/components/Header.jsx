import React, { useState, useEffect } from 'react';

const Header = ({ setActiveMenu, setAppMenu }) => {
  // Use setAppMenu if provided, otherwise fall back to setActiveMenu
  const handleSettingsClick = () => {
    if (setAppMenu) {
      setAppMenu('settings');
    } else if (setActiveMenu) {
      setActiveMenu('settings');
    }
  };
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [setCurrentTime]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <header style={{
      borderBottom: '1px solid #1a1a1a',
      background: '#000000',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '1.25rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
      }}>
        {/* Left: M9 Logo */}
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#8FDC23',
          letterSpacing: '-0.5px',
        }}>
          M9
        </div>

        {/* Center: Time */}
        <div style={{
          flex: 1,
          textAlign: 'center',
          borderLeft: '1px solid #1a1a1a',
          borderRight: '1px solid #1a1a1a',
          paddingLeft: '2rem',
          paddingRight: '2rem',
        }}>
          <p style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#8FDC23',
            margin: '0',
            letterSpacing: '-0.5px',
          }}>
            {formatTime(currentTime)}
          </p>
        </div>

        {/* Right: Settings Button */}
        <button
          onClick={handleSettingsClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#8FDC23',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#8FDC23';
          }}
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};

export default Header;
