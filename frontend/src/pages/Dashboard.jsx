import React, { useState, useEffect } from 'react';

/**
 * M9 Terminal Dashboard — Modern Card-Based Design
 * Professional monochrome theme with responsive columns and premium spacing
 */

const Dashboard = () => {
  const [profile, setProfile] = useState('SHARP');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState('MLB');
  const [showSportDropdown, setShowSportDropdown] = useState(false);

  // Sports available
  const sports = [
    { id: 'MLB', label: 'MLB', fullName: 'Major League Baseball' },
    { id: 'NBA', label: 'NBA', fullName: 'National Basketball Association' },
    { id: 'NFL', label: 'NFL', fullName: 'National Football League' },
    { id: 'NHL', label: 'NHL', fullName: 'National Hockey League' },
    { id: 'NCAAB', label: 'NCAAB', fullName: 'NCAA Basketball' },
    { id: 'NCAAF', label: 'NCAAF', fullName: 'NCAA Football' },
    { id: 'MLS', label: 'MLS', fullName: 'Major League Soccer' },
    { id: 'WNBA', label: 'WNBA', fullName: 'Women\'s Basketball' },
    { id: 'MMA', label: 'MMA', fullName: 'Mixed Martial Arts' },
    { id: 'TENNIS', label: 'TENNIS', fullName: 'Professional Tennis' }
  ];

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

  // Menu items for bottom navigation
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'markets', label: 'Markets' },
    { id: 'bet-log', label: 'Bet Log' },
    { id: 'bankroll', label: 'Bankroll' },
    { id: 'daily-debrief', label: 'Daily Debrief' },
    { id: 'news', label: 'News' },
    { id: 'settings', label: 'Settings' }
  ];

  // Sample data for dashboard
  const currentBets = [
    { id: 1, sport: 'MLB', game: 'NYY vs BOS', market: 'Moneyline', pick: '↑ AWAY', amount: '$2,800', odds: '-100', status: 'Pending', time: '2:30 PM' },
    { id: 2, sport: 'MLB', game: 'ATL vs NYM', market: 'Spread', pick: '↑ AWAY -1.5', amount: '$1,200', odds: '-110', status: 'Pending', time: '1:10 PM' },
    { id: 3, sport: 'NBA', game: 'LAL vs BOS', market: 'Over/Under', pick: '⬆ OVER 220', amount: '$1,500', odds: '-110', status: 'Pending', time: '7:30 PM' }
  ];

  const activityLog = [
    { timestamp: '02:45:33 PM', action: 'Placed bet', details: 'NYY vs BOS Moneyline $2,800', type: 'bet' },
    { timestamp: '02:30:15 PM', action: 'Signal detected', details: 'MLB: 3 high-confidence opportunities', type: 'signal' },
    { timestamp: '02:15:45 PM', action: 'API connected', details: 'SportsData.io connected', type: 'api' },
    { timestamp: '02:00:00 PM', action: 'Market data refreshed', details: 'Updated odds from 5 books', type: 'data' },
    { timestamp: '01:45:22 PM', action: 'Profile changed', details: 'Switched from ACTIVE to SHARP', type: 'profile' }
  ];

  const apiStatus = [
    { name: 'SportsData.io', status: 'Connected', ping: '45ms', lastSync: '1 min ago' },
    { name: 'The Odds API', status: 'Connected', ping: '62ms', lastSync: '2 min ago' },
    { name: 'Database', status: 'Connected', ping: '12ms', lastSync: '30 sec ago' },
    { name: 'Cache', status: 'Connected', ping: '8ms', lastSync: 'Real-time' }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.sport-dropdown')) {
        setShowSportDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Format time and date
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Card wrapper component
  const Card = ({ children, className = '' }) => (
    <div style={{
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '1.75rem',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      ...className.style
    }} className={className.className}>
      {children}
    </div>
  );

  const TeamLogo = ({ teamCode }) => {
    const team = teams[teamCode];
    return (
      <div
        style={{
          width: '80px',
          height: '80px',
          background: team.bgColor,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          fontWeight: 'bold',
          color: team.textColor,
          border: '1px solid #404040',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          fontFamily: 'Courier New, monospace',
          transition: 'all 0.3s ease'
        }}
      >
        {teamCode}
      </div>
    );
  };

  // Render page content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'markets':
        return (
          <>
            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {[
                { label: 'GAMES TODAY', value: '15' },
                { label: 'OPPORTUNITIES', value: '3' },
                { label: 'AVG CONFIDENCE', value: '76%' },
                { label: 'TOTAL EDGE', value: '+47%' }
              ].map((stat, i) => (
                <Card key={i}>
                  <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 1rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>{stat.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: '800', margin: 0, letterSpacing: '-1px', color: '#8FDC23', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{stat.value}</p>
                </Card>
              ))}
            </div>

            {/* Main Game */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 2rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Featured Matchup</h2>

              {games.map(game => (
                <Card key={game.id}>
                  {/* Game Header with Logos */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Away Team */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minWidth: '150px' }}>
                      <TeamLogo teamCode={game.away} />
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.away].name}</p>
                        <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', letterSpacing: '1px', fontWeight: '700', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.away].code}</p>
                        <p style={{ fontSize: '10px', color: '#808080', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.away].ballpark}</p>
                      </div>
                    </div>

                    {/* VS */}
                    <div style={{ fontSize: '28px', fontWeight: '300', color: '#404040', marginTop: '2rem', letterSpacing: '1px' }}>VS</div>

                    {/* Home Team */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minWidth: '150px' }}>
                      <TeamLogo teamCode={game.home} />
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.home].name}</p>
                        <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', letterSpacing: '1px', fontWeight: '700', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.home].code}</p>
                        <p style={{ fontSize: '10px', color: '#808080', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.home].ballpark}</p>
                      </div>
                    </div>

                    {/* Game Info */}
                    <div style={{ textAlign: 'right', marginTop: '1rem', minWidth: '140px' }}>
                      <p style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px', color: '#8FDC23', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{game.time}</p>
                      <p style={{ fontSize: '11px', color: '#808080', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{game.date}</p>
                    </div>
                  </div>

                  {/* Markets */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {game.markets.map((m, i) => (
                      <div key={i} style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1.5rem', transition: 'all 0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                          <div>
                            <p style={{ fontSize: '10px', fontWeight: '700', color: '#8FDC23', margin: '0 0 0.75rem 0', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>{m.type}</p>
                            <p style={{ fontSize: '36px', fontWeight: '800', margin: 0, letterSpacing: '-1px', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{m.confidence}%</p>
                          </div>
                          <div style={{ background: '#2a2a2a', color: '#8FDC23', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: '1px solid #3a3a3a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textAlign: 'center' }}>
                            {m.rating}
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '11px', color: '#8FDC23', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Pick</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{m.pick}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '11px', color: '#8FDC23', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>EV</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#8FDC23', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{m.edge}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '11px', color: '#8FDC23', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Odds</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{m.odds}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '11px', color: '#8FDC23', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Book</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{m.book}</span>
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #2a2a2a' }}>
                          <p style={{ fontSize: '10px', color: '#8FDC23', margin: '0 0 0.75rem 0', fontWeight: '700', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>Kelly Size</p>
                          <p style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#8FDC23', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{m.size}</p>
                        </div>

                        <button style={{ width: '100%', background: 'linear-gradient(135deg, #8FDC23 0%, #7ac520 100%)', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', color: '#000000', transition: 'all 0.3s', letterSpacing: '0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>
                          Place Bet →
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Other Games */}
            <div style={{ marginBottom: '6rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: '0 0 2rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Other Games Today</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {otherGames.map((game, i) => (
                  <Card key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        <TeamLogo teamCode={game.away} />
                        <div>
                          <p style={{ fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0', fontSize: '12px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.away].name}</p>
                          <p style={{ fontSize: '10px', color: '#8FDC23', margin: 0, letterSpacing: '0.5px', fontWeight: '700', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.away].code}</p>
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#808080', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{game.time}</div>
                    </div>
                    <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        <TeamLogo teamCode={game.home} />
                        <div>
                          <p style={{ fontWeight: '600', color: '#ffffff', margin: '0 0 0.25rem 0', fontSize: '12px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.home].name}</p>
                          <p style={{ fontSize: '10px', color: '#8FDC23', margin: 0, letterSpacing: '0.5px', fontWeight: '700', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{teams[game.home].code}</p>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#8FDC23', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{game.opps}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        );

      case 'bet-log':
      case 'bankroll':
      case 'daily-debrief':
      case 'news':
      case 'settings':
        return (
          <Card>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', margin: '0 0 2rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1).replace('-', ' ')}
            </h2>
            <div style={{ color: '#808080', textAlign: 'center', padding: '3rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              <p style={{ fontSize: '16px', margin: '0 0 1rem 0' }}>Page coming soon</p>
              <p style={{ fontSize: '14px', color: '#606060' }}>Feature in development...</p>
            </div>
          </Card>
        );

      default:
        return (
          <>
            {/* Top Row: Summary Stats (3 columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {/* Summary Cards */}
              {[
                { label: 'ACCOUNT BALANCE', value: '$50,000', subtext: 'Available', color: '#8FDC23', icon: '💰' },
                { label: 'TOTAL WAGERED', value: '$5,200', subtext: 'Today', color: '#ffffff', icon: '📊' },
                { label: 'ROI', value: '+8.4%', subtext: 'This Month', color: '#8FDC23', icon: '📈' }
              ].map((stat, i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 0.75rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>{stat.label}</p>
                      <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-1px', color: stat.color, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{stat.value}</p>
                      <p style={{ fontSize: '12px', color: '#606060', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{stat.subtext}</p>
                    </div>
                    <div style={{ fontSize: '36px' }}>{stat.icon}</div>
                  </div>
                </Card>
              ))}

              {/* Active Bets Count Card */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 0.75rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>ACTIVE BETS</p>
                    <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-1px', color: '#8FDC23', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>3</p>
                    <p style={{ fontSize: '12px', color: '#606060', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Pending resolution</p>
                  </div>
                  <div style={{ fontSize: '36px' }}>🎯</div>
                </div>
              </Card>
            </div>

            {/* Middle Row: Current Bets (Left) + Activity & API (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
              {/* LEFT COLUMN: Current Bets */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Current Bets</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {currentBets.map((bet) => (
                    <Card key={bet.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <p style={{ fontSize: '11px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textTransform: 'uppercase' }}>{bet.sport}</p>
                          <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0 0 0.5rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{bet.game}</p>
                          <p style={{ fontSize: '12px', color: '#808080', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{bet.market}</p>
                        </div>
                        <div style={{ fontSize: '12px', color: '#606060', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{bet.time}</div>
                      </div>
                      <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '12px', color: '#808080', margin: '0 0 0.75rem 0', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Pick: <span style={{ color: '#8FDC23', fontWeight: '700' }}>{bet.pick}</span></p>
                        <p style={{ fontSize: '12px', color: '#808080', margin: '0 0 0.75rem 0', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Amount: <span style={{ color: '#8FDC23', fontWeight: '700', fontSize: '14px' }}>{bet.amount}</span></p>
                        <p style={{ fontSize: '12px', color: '#808080', margin: '0 0 0.75rem 0', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Odds: <span style={{ color: '#ffffff', fontWeight: '700' }}>{bet.odds}</span></p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: '#8FDC23', fontWeight: '700' }}>●</span>
                          <span style={{ fontSize: '12px', color: '#8FDC23', fontWeight: '700', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{bet.status}</span>
                        </div>
                      </div>
                    </Card>
                  ))}</div>
              </div>

              {/* RIGHT COLUMN: Activity Log & API Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Activity Log */}
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Activity Log</h2>
                  <Card>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {activityLog.map((log, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: i < activityLog.length - 1 ? '1px solid #2a2a2a' : 'none' }}>
                          <div style={{ fontSize: '24px', minWidth: '28px', textAlign: 'center' }}>
                            {log.type === 'bet' && '💰'}
                            {log.type === 'signal' && '⚡'}
                            {log.type === 'api' && '🔗'}
                            {log.type === 'data' && '📊'}
                            {log.type === 'profile' && '👤'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', margin: '0 0 0.5rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{log.action}</p>
                            <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 0.75rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{log.details}</p>
                            <p style={{ fontSize: '10px', color: '#606060', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{log.timestamp}</p>
                          </div>
                        </div>
                      ))}</div>
                  </Card>
                </div>

                {/* API Status */}
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>API Status</h2>
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
                      ))}</div>
                  </Card>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', background: '#000000', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '1.25rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          {/* Left: Logo & Title */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* M9 Logo */}
            <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 240 120" style={{ width: '100%', height: '100%' }}>
                {/* M */}
                <text x="20" y="85" fontSize="72" fontWeight="bold" fill="#ffffff" fontFamily="Arial, sans-serif">M</text>
                {/* 9 */}
                <rect x="110" y="30" width="40" height="40" rx="6" fill="#8FDC23" />
                <text x="140" y="70" fontSize="42" fontWeight="bold" fill="#000000" textAnchor="middle" fontFamily="Arial, sans-serif">9</text>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '400', margin: 0, letterSpacing: '-0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>M9 TERMINAL</h1>
              <p style={{ fontSize: '12px', color: '#808080', margin: '4px 0 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>MARKET INTELLIGENCE</p>
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

          {/* Right: Sports Dropdown, Profile Tabs & Settings */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {/* Sports Dropdown */}
            <div className="sport-dropdown" style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSportDropdown(!showSportDropdown)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid #8FDC23',
                  background: 'transparent',
                  color: '#8FDC23',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#8FDC23';
                  e.target.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#8FDC23';
                }}
              >
                {selectedSport}
                <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
              </button>

              {/* Dropdown Menu */}
              {showSportDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  zIndex: 1000,
                  minWidth: '220px',
                  overflow: 'hidden'
                }}>
                  {sports.map((sport) => (
                    <button
                      key={sport.id}
                      onClick={() => {
                        setSelectedSport(sport.id);
                        setShowSportDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: selectedSport === sport.id ? '#2a2a2a' : 'transparent',
                        color: selectedSport === sport.id ? '#8FDC23' : '#b0b0b0',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: selectedSport === sport.id ? '600' : '400',
                        textAlign: 'left',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        transition: 'all 0.2s',
                        borderLeft: selectedSport === sport.id ? '3px solid #8FDC23' : '3px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSport !== sport.id) {
                          e.target.style.background = '#0f0f0f';
                          e.target.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSport !== sport.id) {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#b0b0b0';
                        }
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>{sport.label}</div>
                      <div style={{ fontSize: '10px', color: selectedSport === sport.id ? '#8FDC23' : '#606060' }}>{sport.fullName}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['SHARP', 'ACTIVE', 'RESEARCH'].map(p => (
                <button
                  key={p}
                  onClick={() => setProfile(p)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '400',
                    border: profile === p ? '1px solid #ffffff' : '1px solid #333333',
                    background: profile === p ? '#1a1a1a' : 'transparent',
                    color: '#ffffff',
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Settings Icon */}
            <div style={{ fontSize: '20px', cursor: 'pointer' }}>⚙</div>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div style={{ background: '#1a1a1a', borderBottom: '1px solid #333333', padding: '1rem' }}>
          <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>⚠</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#ffffff', margin: '0 0 0.25rem 0', fontWeight: '500', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Disclaimer</p>
              <p style={{ fontSize: '12px', color: '#b0b0b0', margin: 0, lineHeight: '1.5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                M9 Terminal provides analytical insights only. Past performance does not guarantee future results. Sports betting involves risk. Must be 21+. Gamble responsibly.
              </p>
            </div>
            <button onClick={() => setShowDisclaimer(false)} style={{ fontSize: '16px', background: 'none', border: 'none', color: '#808080', cursor: 'pointer', padding: 0, marginTop: '2px' }}>✕</button>
          </div>
        </div>
      )}

      {/* Main Content - Flex to push bottom nav down */}
      <main style={{ flex: 1, maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem', overflowY: 'auto', width: '100%' }}>
        {renderContent()}
      </main>

      {/* Combined Footer Navigation Bar */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0a0a0a', borderTop: '1px solid #1a1a1a', zIndex: 100, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(10, 10, 10, 0.95)' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '2rem', padding: '1rem', overflowX: 'auto' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'transparent',
                color: activeMenu === item.id ? '#8FDC23' : '#606060',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '400',
                transition: 'all 0.2s ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                whiteSpace: 'nowrap',
                position: 'relative',
                paddingBottom: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item.id) {
                  e.target.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.id) {
                  e.target.style.color = '#606060';
                }
              }}
            >
              {item.label}
              {activeMenu === item.id && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#8FDC23',
                  borderRadius: '1px'
                }} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Spacer for fixed bottom nav */}
      <div style={{ height: '70px' }} />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '2rem',
            width: '50px',
            height: '50px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            border: '1px solid #333333',
            color: '#8FDC23',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s ease',
            zIndex: 40,
            opacity: 0.9
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '1';
            e.target.style.background = 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '0.9';
            e.target.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)';
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Dashboard;
