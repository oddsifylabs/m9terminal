import React, { useState, useEffect } from 'react';

/**
 * M9 Terminal Settings Page
 * Activity Log & API Status monitoring
 */

const Settings = ({ setActiveMenu }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Card Component
  const Card = ({ children }) => (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      {children}
    </div>
  );

  // Activity Log Data
  const activityLog = [
    { type: 'bet', action: 'Placed bet on NYY vs BOS', details: '+250 EV | 2.4% better than consensus', timestamp: '2:43 PM, 4 min ago' },
    { type: 'signal', action: 'Signal detected (Sharp Action)', details: 'NYY -3.0 → -5.0 detected', timestamp: '2:31 PM, 16 min ago' },
    { type: 'api', action: 'API connected (SportsData.io)', details: '1000 games updated, 45ms response', timestamp: '2:15 PM, 32 min ago' },
    { type: 'data', action: 'Market data refreshed', details: 'All odds synced with live feeds', timestamp: '1:58 PM, 49 min ago' },
    { type: 'profile', action: 'Profile changed to SHARP', details: 'Filter: 80+ confidence only', timestamp: '1:32 PM, 1h 15m ago' },
  ];

  // API Status Data
  const apiStatus = [
    { name: 'SportsData.io', status: 'Connected', ping: '45ms', lastSync: '12 seconds ago' },
    { name: 'The Odds API', status: 'Connected', ping: '62ms', lastSync: '18 seconds ago' },
    { name: 'Database', status: 'Connected', ping: '12ms', lastSync: '5 seconds ago' },
    { name: 'Cache Layer', status: 'Connected', ping: '8ms', lastSync: '2 seconds ago' },
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{ flex: 1, background: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', background: '#000000', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '1.25rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          {/* Left: Title */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '400', margin: 0, letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>⚙️ SETTINGS</h1>
              <p style={{ fontSize: '12px', color: '#808080', margin: '4px 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>System Monitoring & Activity</p>
            </div>
          </div>

          {/* Center: Time & Date */}
          <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a', paddingLeft: '2rem', paddingRight: '2rem' }}>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#8FDC23', margin: '0 0 0.25rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              {formatTime(currentTime)}
            </p>
            <p style={{ fontSize: '12px', color: '#808080', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              {formatDate(currentTime)}
            </p>
          </div>

          {/* Right: Status Indicator */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#8FDC23', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>● ONLINE</p>
              <p style={{ fontSize: '10px', color: '#606060', margin: '4px 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>All systems active</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto', width: '100%', minHeight: 0, overflowY: 'auto' }}>
        {/* System Status Summary - MOVED TO TOP */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>🔍 System Status</h2>
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Backend</p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>● Healthy</p>
                <p style={{ fontSize: '11px', color: '#606060', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Uptime: 99.9%</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Database</p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>● Healthy</p>
                <p style={{ fontSize: '11px', color: '#606060', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Response: 12ms</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Cache</p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>● Healthy</p>
                <p style={{ fontSize: '11px', color: '#606060', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Hit rate: 94%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 2-Column Layout: Left Column (Activity Log + API Status) and Right Column (About) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
          {/* Left Column: Activity Log and API Status stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Activity Log */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>◆ Activity Log</h2>
              <Card>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {activityLog.map((log, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: i < activityLog.length - 1 ? '1px solid #2a2a2a' : 'none' }}>
                      <div style={{ fontSize: '24px', minWidth: '28px', textAlign: 'center', marginTop: '2px' }}>
                        {log.type === 'bet' && '◆'}
                        {log.type === 'signal' && '✦'}
                        {log.type === 'api' && '⊕'}
                        {log.type === 'data' && '⟳'}
                        {log.type === 'profile' && '⬚'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', margin: '0 0 0.5rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{log.action}</p>
                        <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 0.75rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{log.details}</p>
                        <p style={{ fontSize: '10px', color: '#606060', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* API Status */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>⊕ API Status</h2>
              <Card>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {apiStatus.map((api, i) => (
                    <div key={i} style={{ paddingBottom: '1.5rem', borderBottom: i < apiStatus.length - 1 ? '1px solid #2a2a2a' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{api.name}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: '#8FDC23', fontWeight: '700' }}>●</span>
                          <span style={{ fontSize: '11px', color: '#8FDC23', fontWeight: '700', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{api.status}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '11px', color: '#808080', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Ping</span>
                        <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{api.ping}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: '#808080', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Last sync</span>
                        <span style={{ fontSize: '11px', color: '#606060', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{api.lastSync}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column: About */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>ℹ️ About</h2>
            <Card>
              <div style={{ display: 'grid', gap: '2rem' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Application</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>M9 Terminal</p>
                  <p style={{ fontSize: '12px', color: '#808080', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', lineHeight: '1.5' }}>Sports Market Intelligence Platform</p>
                </div>

                <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
                  <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Version</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>2.0.0</p>
                  <p style={{ fontSize: '12px', color: '#808080', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Latest Release</p>
                </div>

                <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
                  <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Build Date</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>June 3, 2026</p>
                  <p style={{ fontSize: '12px', color: '#808080', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Last Updated</p>
                </div>

                <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
                  <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Data Sources</p>
                  <div style={{ fontSize: '12px', color: '#808080', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>• SportsData.io - Live game data & statistics</p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>• The Odds API - Multi-book odds aggregation</p>
                    <p style={{ margin: 0 }}>• Claude API - Advanced game analysis</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
                  <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>License & Terms</p>
                  <p style={{ fontSize: '12px', color: '#808080', margin: '0.5rem 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', lineHeight: '1.5' }}>M9 Terminal provides analytical insights for sports betting markets. Past performance does not guarantee future results. Must be 21+. Gamble responsibly.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
