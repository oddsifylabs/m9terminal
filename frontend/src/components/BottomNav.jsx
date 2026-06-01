import React from 'react';

const BottomNav = ({ activeMenu, setActiveMenu }) => {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'markets', label: 'Markets' },
    { id: 'betlog', label: 'Bet Log' },
    { id: 'bankroll', label: 'Bankroll' },
    { id: 'daily', label: 'Daily Debrief' },
    { id: 'news', label: 'News' },
    { id: 'weather', label: 'Weather' },
  ];

  return (
    <nav style={{
      background: '#0a0a0a',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid #1a1a1a',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
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
            color: activeMenu === item.id ? '#8FDC23' : '#808080',
            fontSize: '12px',
            fontWeight: activeMenu === item.id ? '700' : '600',
            cursor: 'pointer',
            padding: '8px 0',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: activeMenu === item.id ? '2px solid #8FDC23' : 'none',
            paddingBottom: activeMenu === item.id ? '6px' : '8px',
          }}
          onMouseEnter={(e) => {
            if (activeMenu !== item.id) {
              e.target.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeMenu !== item.id) {
              e.target.style.color = '#808080';
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
