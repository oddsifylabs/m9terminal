import React from 'react';

const BottomNav = ({ activeMenu, setActiveMenu }) => {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'markets', label: 'Markets', icon: '⚾' },
    { id: 'intel', label: 'Intel', icon: '🔍' },
    { id: 'tracker', label: 'Tracker', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav style={{
      background: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      padding: '0.75rem 1rem',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      gap: '0.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      flexShrink: 0,
    }}>
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveMenu(item.id)}
          style={{
            background: 'none',
            border: 'none',
            color: activeMenu === item.id ? '#16a34a' : '#6b7280',
            fontSize: '11px',
            fontWeight: activeMenu === item.id ? '700' : '600',
            cursor: 'pointer',
            padding: '8px 12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderRadius: '6px',
            backgroundColor: activeMenu === item.id ? '#f0fdf4' : 'transparent',
            paddingBottom: activeMenu === item.id ? '6px' : '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (activeMenu !== item.id) {
              e.target.style.color = '#374151';
            }
          }}
          onMouseLeave={(e) => {
            if (activeMenu !== item.id) {
              e.target.style.color = '#6b7280';
            }
          }}
          title={item.label}
        >
          <span style={{ fontSize: '18px' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
