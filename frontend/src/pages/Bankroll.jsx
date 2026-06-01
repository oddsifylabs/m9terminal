import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Bankroll = ({ setActiveMenu }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{ flex: 1, background: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Header setActiveMenu={setActiveMenu} />

      <main style={{ flex: 1, maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: 0, overflowY: 'auto', width: '100%' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ fontSize: '16px', color: '#808080', margin: '0' }}>💰 Bankroll Management Coming Soon</p>
        </div>
      </main>
    </div>
  );
};

export default Bankroll;
