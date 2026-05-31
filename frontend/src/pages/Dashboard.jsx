import React, { useState } from 'react';

/**
 * M9 Terminal Dashboard — With Visible Team Logos
 * Simple div-based logos that work perfectly on localhost
 */

const Dashboard = () => {
  const [profile, setProfile] = useState('SHARP');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Team data with colors
  const teams = {
    NYY: { name: 'New York Yankees', code: 'NYY', ballpark: 'Yankee Stadium', color: '#0C2C56', letter: 'Y' },
    BOS: { name: 'Boston Red Sox', code: 'BOS', ballpark: 'Fenway Park', color: '#BD3039', letter: 'B' },
    ATL: { name: 'Atlanta Braves', code: 'ATL', ballpark: 'Truist Park', color: '#CE1141', letter: 'A' },
    NYM: { name: 'New York Mets', code: 'NYM', ballpark: 'Citi Field', color: '#002D72', letter: 'M' },
    LAD: { name: 'Los Angeles Dodgers', code: 'LAD', ballpark: 'Dodger Stadium', color: '#005A9C', letter: 'L' },
    ARI: { name: 'Arizona Diamondbacks', code: 'ARI', ballpark: 'Chase Field', color: '#A71930', letter: 'D' }
  };

  const games = [
    {
      id: 1,
      away: 'NYY',
      home: 'BOS',
      time: '7:05 PM ET',
      date: 'June 3, 2026',
      markets: [
        { type: 'MONEYLINE', confidence: 84, rating: 'A+', pick: '↑ AWAY', edge: '+28%', odds: '-100', book: 'DraftKings', size: '$2,800' },
        { type: 'SPREAD', confidence: 72, rating: 'A', pick: '↑ AWAY -5.5', edge: '+7%', odds: '-110', book: 'BetMGM', size: '$1,400' },
        { type: 'OVER/UNDER', confidence: 75, rating: 'A', pick: '⬆ OVER 8.5', edge: '+12%', odds: '-110', book: 'FanDuel', size: '$1,750' }
      ]
    }
  ];

  const otherGames = [
    { away: 'ATL', home: 'NYM', time: '1:10 PM', opps: '+2' },
    { away: 'LAD', home: 'ARI', time: '4:10 PM', opps: '+1' }
  ];

  const TeamLogo = ({ teamCode }) => {
    const team = teams[teamCode];
    return (
      <div
        style={{
          width: '80px',
          height: '80px',
          background: `linear-gradient(135deg, ${team.color} 0%, ${team.color}dd 100%)`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}
      >
        {team.letter}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(100, 116, 139, 0.5)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
              M9
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>M9 Terminal</h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>Sports Market Intelligence</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['SHARP', 'ACTIVE', 'RESEARCH'].map(p => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: profile === p ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(100, 116, 139, 0.5)',
                  background: profile === p ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: profile === p ? '#6ee7b7' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '24px' }}>⚙️</div>
        </div>
      </header>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div style={{ background: 'rgba(217, 119, 6, 0.1)', borderBottom: '1px solid rgba(217, 119, 6, 0.3)', padding: '1rem' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', color: '#fef08a', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Disclaimer</p>
              <p style={{ fontSize: '12px', color: '#fef3c7', margin: 0, lineHeight: '1.5' }}>
                M9 Terminal provides analytical insights only. Past performance does not guarantee future results. Sports betting involves risk. Must be 21+. Gamble responsibly. This is not financial advice.
              </p>
            </div>
            <button onClick={() => setShowDisclaimer(false)} style={{ fontSize: '18px', background: 'none', border: 'none', color: '#fcd34d', cursor: 'pointer', padding: 0 }}>✕</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Games Today', value: '15' },
            { label: 'Opportunities', value: '3' },
            { label: 'Avg Confidence', value: '76%' },
            { label: 'Total Edge', value: '+47%' }
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(100, 116, 139, 0.5)', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 0.5rem 0' }}>{stat.label}</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Game */}
        <div style={{ background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(100, 116, 139, 0.5)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: '0 0 2rem 0' }}>Today's Featured Matchup</h2>

          {games.map(game => (
            <div key={game.id}>
              {/* Game Header with Logos */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '2rem' }}>
                {/* Away Team */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <TeamLogo teamCode={game.away} />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', margin: 0 }}>{teams[game.away].name}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>{teams[game.away].code}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>{teams[game.away].ballpark}</p>
                  </div>
                </div>

                {/* VS */}
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#64748b', marginTop: '2rem' }}>VS</div>

                {/* Home Team */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <TeamLogo teamCode={game.home} />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', margin: 0 }}>{teams[game.home].name}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>{teams[game.home].code}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>{teams[game.home].ballpark}</p>
                  </div>
                </div>

                {/* Game Info */}
                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>{game.time}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>{game.date}</p>
                </div>
              </div>

              {/* Markets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {game.markets.map((m, i) => (
                  <div key={i} style={{ background: m.confidence >= 80 ? 'rgba(16, 185, 129, 0.1)' : m.confidence >= 70 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(217, 119, 6, 0.1)', border: m.confidence >= 80 ? '1px solid rgba(16, 185, 129, 0.3)' : m.confidence >= 70 ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', margin: 0, textTransform: 'uppercase' }}>{m.type}</p>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0.5rem 0 0 0' }}>{m.confidence}%</p>
                      </div>
                      <div style={{ background: m.confidence >= 80 ? 'rgba(16, 185, 129, 0.2)' : m.confidence >= 70 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(217, 119, 6, 0.2)', color: m.confidence >= 80 ? '#6ee7b7' : m.confidence >= 70 ? '#93c5fd' : '#fcd34d', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {m.rating}
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid rgba(100, 116, 139, 0.5)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Pick</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>{m.pick}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Expected Value</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>{m.edge}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Best Odds</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{m.odds}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Book</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>{m.book}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 0.25rem 0' }}>Kelly Sizing</p>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: 0 }}>{m.size}</p>
                    </div>

                    <button style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                      ⚡ Place Bet
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Other Games */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: '0 0 1.5rem 0' }}>Other Games Today</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {otherGames.map((game, i) => (
              <div key={i} style={{ background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(100, 116, 139, 0.5)', borderRadius: '8px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <TeamLogo teamCode={game.away} />
                    <div>
                      <p style={{ fontWeight: 'bold', color: 'white', margin: 0, fontSize: '14px' }}>{teams[game.away].name}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{teams[game.away].code}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{game.time}</div>
                </div>
                <div style={{ borderTop: '1px solid rgba(100, 116, 139, 0.5)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <TeamLogo teamCode={game.home} />
                    <div>
                      <p style={{ fontWeight: 'bold', color: 'white', margin: 0, fontSize: '14px' }}>{teams[game.home].name}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{teams[game.home].code}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>{game.opps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(100, 116, 139, 0.5)', background: 'rgba(15, 23, 42, 0.5)', marginTop: '3rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>About M9 Terminal</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>Professional sports market intelligence for serious bettors. Data-driven analysis, no picks. Process over emotion.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>Legal Notice</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>Past performance ≠ future results. Gambling involves risk. Must be 21+. Gamble responsibly.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>Data Sources</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>Real-time odds via the-odds-api.com • Game data via SportsData.io</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(100, 116, 139, 0.5)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          © 2026 M9 Terminal by Oddsify Labs. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
