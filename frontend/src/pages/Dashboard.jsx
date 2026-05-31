import React, { useState, useEffect } from 'react';

/**
 * M9 Terminal Dashboard — Modern Monochrome Theme
 * Clean, professional black/white/gray design
 */

const Dashboard = () => {
  const [profile, setProfile] = useState('SHARP');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Team data with monochrome styling
  const teams = {
    NYY: { name: 'New York Yankees', code: 'NYY', ballpark: 'Yankee Stadium', bgColor: '#1a1a1a', textColor: '#ffffff' },
    BOS: { name: 'Boston Red Sox', code: 'BOS', ballpark: 'Fenway Park', bgColor: '#2d2d2d', textColor: '#ffffff' },
    ATL: { name: 'Atlanta Braves', code: 'ATL', ballpark: 'Truist Park', bgColor: '#1a1a1a', textColor: '#ffffff' },
    NYM: { name: 'New York Mets', code: 'NYM', ballpark: 'Citi Field', bgColor: '#2d2d2d', textColor: '#ffffff' },
    LAD: { name: 'Los Angeles Dodgers', code: 'LAD', ballpark: 'Dodger Stadium', bgColor: '#1a1a1a', textColor: '#ffffff' },
    ARI: { name: 'Arizona Diamondbacks', code: 'ARI', ballpark: 'Chase Field', bgColor: '#2d2d2d', textColor: '#ffffff' }
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

  // Handle scroll to show/hide scroll top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const TeamLogo = ({ teamCode }) => {
    const team = teams[teamCode];
    return (
      <div
        style={{
          width: '100px',
          height: '100px',
          background: team.bgColor,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          color: team.textColor,
          border: '1px solid #404040',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          fontFamily: 'Courier New, monospace'
        }}
      >
        {teamCode}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', background: '#000000', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '1.25rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '18px', border: '1px solid #333333' }}>
              M9
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px' }}>M9 TERMINAL</h1>
              <p style={{ fontSize: '12px', color: '#808080', margin: '4px 0 0 0' }}>MARKET INTELLIGENCE</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['SHARP', 'ACTIVE', 'RESEARCH'].map(p => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: profile === p ? '1px solid #ffffff' : '1px solid #333333',
                  background: profile === p ? '#1a1a1a' : 'transparent',
                  color: '#ffffff',
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '20px', cursor: 'pointer' }}>⚙️</div>
        </div>
      </header>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div style={{ background: '#1a1a1a', borderBottom: '1px solid #333333', padding: '1rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#ffffff', margin: '0 0 0.25rem 0', fontWeight: '600' }}>DISCLAIMER</p>
              <p style={{ fontSize: '12px', color: '#b0b0b0', margin: 0, lineHeight: '1.5' }}>
                M9 Terminal provides analytical insights only. Past performance does not guarantee future results. Sports betting involves risk. Must be 21+. Gamble responsibly.
              </p>
            </div>
            <button onClick={() => setShowDisclaimer(false)} style={{ fontSize: '16px', background: 'none', border: 'none', color: '#808080', cursor: 'pointer', padding: 0, marginTop: '2px' }}>✕</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: '90rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'GAMES TODAY', value: '15' },
            { label: 'OPPORTUNITIES', value: '3' },
            { label: 'AVG CONFIDENCE', value: '76%' },
            { label: 'TOTAL EDGE', value: '+47%' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '1.25rem', transition: 'all 0.2s' }}>
              <p style={{ fontSize: '11px', color: '#606060', margin: '0 0 0.75rem 0', fontWeight: '600', letterSpacing: '0.5px' }}>{stat.label}</p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-1px' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Game */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '2.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: '0 0 2.5rem 0', letterSpacing: '-0.5px' }}>TODAY'S FEATURED MATCHUP</h2>

          {games.map(game => (
            <div key={game.id}>
              {/* Game Header with Logos */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', gap: '3rem', flexWrap: 'wrap' }}>
                {/* Away Team */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minWidth: '160px' }}>
                  <TeamLogo teamCode={game.away} />
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0' }}>{teams[game.away].name}</p>
                    <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 0.5rem 0', letterSpacing: '1px' }}>{teams[game.away].code}</p>
                    <p style={{ fontSize: '10px', color: '#606060', margin: 0 }}>{teams[game.away].ballpark}</p>
                  </div>
                </div>

                {/* VS */}
                <div style={{ fontSize: '32px', fontWeight: '300', color: '#404040', marginTop: '2rem', letterSpacing: '2px' }}>VS</div>

                {/* Home Team */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minWidth: '160px' }}>
                  <TeamLogo teamCode={game.home} />
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0' }}>{teams[game.home].name}</p>
                    <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 0.5rem 0', letterSpacing: '1px' }}>{teams[game.home].code}</p>
                    <p style={{ fontSize: '10px', color: '#606060', margin: 0 }}>{teams[game.home].ballpark}</p>
                  </div>
                </div>

                {/* Game Info */}
                <div style={{ textAlign: 'right', marginTop: '1rem', minWidth: '140px' }}>
                  <p style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>{game.time}</p>
                  <p style={{ fontSize: '11px', color: '#808080', margin: 0 }}>{game.date}</p>
                </div>
              </div>

              {/* Markets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {game.markets.map((m, i) => (
                  <div key={i} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '1.5rem', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#808080', margin: '0 0 0.5rem 0', letterSpacing: '1px' }}>{m.type}</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', margin: 0, letterSpacing: '-1px' }}>{m.confidence}%</p>
                      </div>
                      <div style={{ background: '#2a2a2a', color: '#ffffff', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', border: '1px solid #3a3a3a' }}>
                        {m.rating}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '11px', color: '#808080', fontWeight: '500' }}>Pick</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>{m.pick}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '11px', color: '#808080', fontWeight: '500' }}>EV</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>{m.edge}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '11px', color: '#808080', fontWeight: '500' }}>Odds</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>{m.odds}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: '#808080', fontWeight: '500' }}>Book</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>{m.book}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #2a2a2a' }}>
                      <p style={{ fontSize: '10px', color: '#808080', margin: '0 0 0.5rem 0', fontWeight: '500' }}>KELLY SIZE</p>
                      <p style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{m.size}</p>
                    </div>

                    <button style={{ width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a', borderRadius: '6px', padding: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', color: '#ffffff', transition: 'all 0.2s', letterSpacing: '0.5px' }}>
                      PLACE BET →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Other Games */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px' }}>OTHER GAMES TODAY</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {otherGames.map((game, i) => (
              <div key={i} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <TeamLogo teamCode={game.away} />
                    <div>
                      <p style={{ fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0', fontSize: '12px' }}>{teams[game.away].name}</p>
                      <p style={{ fontSize: '10px', color: '#808080', margin: 0, letterSpacing: '0.5px' }}>{teams[game.away].code}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#808080', fontWeight: '500' }}>{game.time}</div>
                </div>
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <TeamLogo teamCode={game.home} />
                    <div>
                      <p style={{ fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0', fontSize: '12px' }}>{teams[game.home].name}</p>
                      <p style={{ fontSize: '10px', color: '#808080', margin: 0, letterSpacing: '0.5px' }}>{teams[game.home].code}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>{game.opps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', background: '#0f0f0f', marginTop: '4rem' }}>
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ fontWeight: '700', color: '#ffffff', margin: '0 0 0.75rem 0', fontSize: '12px', letterSpacing: '0.5px' }}>ABOUT</h4>
            <p style={{ fontSize: '11px', color: '#808080', margin: 0, lineHeight: '1.6' }}>Professional sports market intelligence. Data-driven analysis. No picks. Process over emotion.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', color: '#ffffff', margin: '0 0 0.75rem 0', fontSize: '12px', letterSpacing: '0.5px' }}>LEGAL</h4>
            <p style={{ fontSize: '11px', color: '#808080', margin: 0, lineHeight: '1.6' }}>Past performance ≠ future results. Gambling involves risk. Must be 21+. Gamble responsibly.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', color: '#ffffff', margin: '0 0 0.75rem 0', fontSize: '12px', letterSpacing: '0.5px' }}>DATA</h4>
            <p style={{ fontSize: '11px', color: '#808080', margin: 0, lineHeight: '1.6' }}>Real-time odds via the-odds-api.com • Game data via SportsData.io</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem', textAlign: 'center', fontSize: '11px', color: '#606060' }}>
          © 2026 M9 Terminal by Oddsify Labs. All rights reserved.
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '50px',
            height: '50px',
            borderRadius: '8px',
            background: '#1a1a1a',
            border: '1px solid #333333',
            color: '#ffffff',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s ease',
            zIndex: 40,
            opacity: 0.9,
            hover: { opacity: 1, background: '#2a2a2a' }
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '1';
            e.target.style.background = '#2a2a2a';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '0.9';
            e.target.style.background = '#1a1a1a';
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Dashboard;
