import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const BetLog = ({ setActiveMenu }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [expandedBet, setExpandedBet] = useState(null);

  // Demo bet history
  const demoBets = [
    {
      betId: 'BET_1005',
      teams: 'NYY @ BOS',
      betType: 'MONEYLINE',
      pick: '↑ AWAY',
      amount: 2800,
      odds: -100,
      book: 'DraftKings',
      status: 'WON',
      result: 'Won',
      payout: 5600,
      profit: 2800,
      placedAt: new Date(Date.now() - 3600000).toISOString(),
      settledAt: new Date(Date.now() - 1800000).toISOString(),
      roi: 100,
      ev: 2.4,
    },
    {
      betId: 'BET_1004',
      teams: 'ATL @ NYM',
      betType: 'SPREAD',
      pick: '↑ AWAY -1.5',
      amount: 1200,
      odds: -110,
      book: 'FanDuel',
      status: 'WON',
      result: 'Won',
      payout: 2191.82,
      profit: 991.82,
      placedAt: new Date(Date.now() - 7200000).toISOString(),
      settledAt: new Date(Date.now() - 5400000).toISOString(),
      roi: 82.65,
      ev: 1.8,
    },
    {
      betId: 'BET_1003',
      teams: 'LAL @ GSW',
      betType: 'TOTAL',
      pick: '⬆ OVER 220',
      amount: 1500,
      odds: -110,
      book: 'BetMGM',
      status: 'LOST',
      result: 'Lost',
      payout: 0,
      profit: -1500,
      placedAt: new Date(Date.now() - 86400000).toISOString(),
      settledAt: new Date(Date.now() - 84600000).toISOString(),
      roi: -100,
      ev: -0.5,
    },
    {
      betId: 'BET_1002',
      teams: 'HOU @ LAA',
      betType: 'MONEYLINE',
      pick: '↓ HOME',
      amount: 2000,
      odds: +150,
      book: 'DraftKings',
      status: 'WON',
      result: 'Won',
      payout: 5000,
      profit: 3000,
      placedAt: new Date(Date.now() - 172800000).toISOString(),
      settledAt: new Date(Date.now() - 171000000).toISOString(),
      roi: 150,
      ev: 3.2,
    },
    {
      betId: 'BET_1001',
      teams: 'TB @ BOS',
      betType: 'SPREAD',
      pick: '↑ AWAY +2.5',
      amount: 1800,
      odds: -110,
      book: 'FanDuel',
      status: 'PENDING',
      result: null,
      payout: null,
      profit: null,
      placedAt: new Date(Date.now() - 259200000).toISOString(),
      settledAt: null,
      roi: null,
      ev: null,
    },
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredBets = selectedFilter === 'ALL' 
    ? demoBets 
    : demoBets.filter(b => b.status === selectedFilter);

  // Calculate stats
  const wonBets = demoBets.filter(b => b.status === 'WON');
  const lostBets = demoBets.filter(b => b.status === 'LOST');
  const pendingBets = demoBets.filter(b => b.status === 'PENDING');

  const totalWagered = demoBets.reduce((sum, b) => sum + b.amount, 0);
  const totalWon = wonBets.reduce((sum, b) => sum + (b.profit || 0), 0);
  const winRate = demoBets.length > 0 ? ((wonBets.length / (wonBets.length + lostBets.length)) * 100).toFixed(1) : 0;
  const roi = totalWagered > 0 ? ((totalWon / totalWagered) * 100).toFixed(1) : 0;

  const Card = ({ children }) => (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '1.5rem',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ flex: 1, background: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Header setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto', width: '100%', minHeight: 0, overflowY: 'auto' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Card>
            <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Total Wagered
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              ${totalWagered.toLocaleString()}
            </p>
          </Card>

          <Card>
            <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Net Profit
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: totalWon >= 0 ? '#00FF41' : '#FF6B6B', margin: 0 }}>
              {totalWon >= 0 ? '+' : ''} ${totalWon.toLocaleString()}
            </p>
          </Card>

          <Card>
            <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ROI
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: roi >= 0 ? '#00FF41' : '#FF6B6B', margin: 0 }}>
              {roi >= 0 ? '+' : ''}{roi}%
            </p>
          </Card>

          <Card>
            <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Win Rate
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#8FDC23', margin: 0 }}>
              {winRate}%
            </p>
            <p style={{ fontSize: '10px', color: '#606060', margin: '0.25rem 0 0 0' }}>
              {wonBets.length}W - {lostBets.length}L
            </p>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'WON', 'LOST', 'PENDING'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedFilter === filter ? '#8FDC23' : '#1a1a1a',
                border: `1px solid ${selectedFilter === filter ? '#8FDC23' : '#2a2a2a'}`,
                color: selectedFilter === filter ? '#000000' : '#ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Bets List */}
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '4rem' }}>
          {filteredBets.map((bet) => (
            <Card key={bet.betId}>
              <div
                onClick={() => setExpandedBet(expandedBet === bet.betId ? null : bet.betId)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                {/* Bet Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0 0 0.25rem 0' }}>
                      {bet.teams}
                    </p>
                    <p style={{ fontSize: '11px', color: '#808080', margin: 0 }}>
                      {bet.betType} • {bet.book} • {getRelativeTime(bet.placedAt)}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: bet.status === 'WON' ? '#00FF41' : bet.status === 'LOST' ? '#FF6B6B' : '#FFD700', margin: '0 0 0.25rem 0' }}>
                      {bet.status === 'WON' ? '+' : ''}{bet.status === 'LOST' ? '-' : bet.status === 'PENDING' ? '' : ''} ${Math.abs(bet.profit || bet.amount).toLocaleString()}
                    </p>
                    <p style={{ fontSize: '11px', color: '#606060', margin: 0 }}>
                      ${bet.amount.toLocaleString()} @ {bet.odds > 0 ? '+' : ''}{bet.odds}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedBet === bet.betId && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #2a2a2a' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '12px' }}>
                      <div>
                        <p style={{ color: '#8FDC23', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Pick</p>
                        <p style={{ color: '#ffffff', margin: 0 }}>{bet.pick}</p>
                      </div>
                      <div>
                        <p style={{ color: '#8FDC23', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Status</p>
                        <p style={{ color: bet.status === 'WON' ? '#00FF41' : bet.status === 'LOST' ? '#FF6B6B' : '#FFD700', margin: 0, fontWeight: '700' }}>
                          {bet.status}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#8FDC23', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Placed</p>
                        <p style={{ color: '#ffffff', margin: 0 }}>
                          {new Date(bet.placedAt).toLocaleString()}
                        </p>
                      </div>
                      {bet.settledAt && (
                        <div>
                          <p style={{ color: '#8FDC23', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Settled</p>
                          <p style={{ color: '#ffffff', margin: 0 }}>
                            {new Date(bet.settledAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {bet.payout !== null && (
                        <div>
                          <p style={{ color: '#8FDC23', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Payout</p>
                          <p style={{ color: '#ffffff', margin: 0 }}>
                            ${bet.payout.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {bet.roi !== null && (
                        <div>
                          <p style={{ color: '#8FDC23', fontWeight: '700', margin: '0 0 0.25rem 0' }}>ROI</p>
                          <p style={{ color: bet.roi >= 0 ? '#00FF41' : '#FF6B6B', margin: 0 }}>
                            {bet.roi >= 0 ? '+' : ''}{bet.roi}%
                          </p>
                        </div>
                      )}
                      {bet.ev !== null && (
                        <div>
                          <p style={{ color: '#8FDC23', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Expected Value</p>
                          <p style={{ color: bet.ev >= 0 ? '#00FF41' : '#FF6B6B', margin: 0 }}>
                            {bet.ev >= 0 ? '+' : ''}{bet.ev}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BetLog;
