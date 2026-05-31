import React, { useState, useEffect } from 'react';

const BottomNav = ({ activeMenu, setActiveMenu }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <>
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #1a1a1a',
        zIndex: 100,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        flexWrap: 'wrap',
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

        {/* Settings Icon */}
        <button
          onClick={() => setActiveMenu('settings')}
          style={{
            background: 'none',
            border: 'none',
            color: activeMenu === 'settings' ? '#8FDC23' : '#808080',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px 0',
            transition: 'all 0.2s ease',
            marginLeft: 'auto',
          }}
          onMouseEnter={(e) => {
            if (activeMenu !== 'settings') {
              e.target.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeMenu !== 'settings') {
              e.target.style.color = '#808080';
            }
          }}
        >
          ⚙️
        </button>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            style={{
              background: 'none',
              border: 'none',
              color: '#8FDC23',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px',
              transition: 'all 0.2s ease',
            }}
            title="Scroll to top"
          >
            ↑
          </button>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div style={{ height: '100px' }} />
    </>
  );
};

export default BottomNav;
