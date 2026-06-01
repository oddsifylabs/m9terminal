import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';

const Dashboard = ({ setAppMenu }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m Claude. Ask me anything about today\'s games, signals, or betting strategy.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Sport logos (emoji for now, can be replaced with actual images)
  const sportLogos = {
    MLB: '⚾',
    NBA: '🏀',
    NFL: '🏈',
    NHL: '🏒',
    SOCCER: '⚽',
    COLLEGE_FB: '🏈',
    COLLEGE_BB: '🏀',
    TENNIS: '🎾'
  };

  // Summary stats with logos
  const summaryStats = [
    { label: 'Total Games', value: '24', color: '#4A90E2' },
    { label: 'Sharp Signals', value: '7', color: '#7ED321' },
    { label: 'Avg Confidence', value: '82%', color: '#F5A623' },
    { label: 'ROI Today', value: '+2.3%', color: '#50E3C2' }
  ];

  const currentBets = [
    {
      id: 1,
      sport: 'MLB',
      matchup: 'NYY vs BOS',
      bet: 'NYY -1.5',
      confidence: 86,
      status: 'pending',
      signal: 'SHARP_MONEY'
    },
    {
      id: 2,
      sport: 'NFL',
      matchup: 'KC vs LAC',
      bet: 'KC -3',
      confidence: 78,
      status: 'pending',
      signal: 'STEAM'
    },
    {
      id: 3,
      sport: 'NBA',
      matchup: 'LAL vs GSW',
      bet: 'LAL +5.5',
      confidence: 72,
      status: 'pending',
      signal: 'LINE_VALUE'
    }
  ];

  const oddsMovement = [
    { sport: 'MLB', game: 'HOU vs SEA', line: 'HOU -2.5', movement: '+0.5', direction: '↑', books: '8/10' },
    { sport: 'NBA', game: 'MIA vs BOS', line: 'MIA +3', movement: '+1.0', direction: '↑', books: '9/10' },
    { sport: 'NFL', game: 'DAL vs PHI', line: 'DAL -2', movement: '-0.5', direction: '↓', books: '6/10' }
  ];

  const topGames = [
    {
      id: 1,
      sport: 'MLB',
      home: 'New York Yankees',
      away: 'Boston Red Sox',
      time: '7:05 PM ET',
      homeOdds: -110,
      awayOdds: -110,
      signals: 2,
      confidence: 86
    },
    {
      id: 2,
      sport: 'NBA',
      home: 'Lakers',
      away: 'Warriors',
      time: '10:00 PM ET',
      homeOdds: -105,
      awayOdds: -115,
      signals: 3,
      confidence: 79
    },
    {
      id: 3,
      sport: 'NFL',
      home: 'Kansas City Chiefs',
      away: 'Los Angeles Chargers',
      time: '1:00 PM ET',
      homeOdds: -160,
      awayOdds: +140,
      signals: 2,
      confidence: 73
    }
  ];

  // Send message to Claude API via backend proxy
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', text: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/claude-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          context: {
            currentBets,
            games: topGames,
            stats: summaryStats
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          text: `Sorry, I couldn't analyze that: ${data.error}. Try asking about specific games or signals.`
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          text: data.response || 'I understood your question but couldn\'t generate a response.'
        }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Connection error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch(activeMenu) {
      case 'dashboard':
        return (
          <>
            {/* Summary Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {summaryStats.map((stat, idx) => (
                <div key={idx} style={{
                  background: '#1a1a1a',
                  border: `2px solid ${stat.color}`,
                  borderRadius: '8px',
                  padding: '1.5rem 1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>
                    {stat.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Current Bets Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                📍 Current Bets
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {currentBets.map(bet => (
                  <div key={bet.id} style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '24px' }}>{sportLogos[bet.sport] || '🎯'}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#fff' }}>
                          {bet.matchup}
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '12px', color: '#999' }}>
                          {bet.bet} • {bet.signal}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: `${bet.confidence > 80 ? '#7ED321' : bet.confidence > 70 ? '#F5A623' : '#E74C3C'}80`,
                      color: '#fff',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {bet.confidence}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Odds Movement Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                📊 Odds Movement
              </h3>
              <div style={{
                overflowX: 'auto',
                background: '#1a1a1a',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.5rem', color: '#999', fontSize: '12px', fontWeight: '600' }}>Sport</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem', color: '#999', fontSize: '12px', fontWeight: '600' }}>Game</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem', color: '#999', fontSize: '12px', fontWeight: '600' }}>Line</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem', color: '#999', fontSize: '12px', fontWeight: '600' }}>Movement</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem', color: '#999', fontSize: '12px', fontWeight: '600' }}>Books</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oddsMovement.map((row, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid #333' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '14px' }}>
                          <span style={{ marginRight: '0.5rem' }}>{sportLogos[row.sport]}</span>
                          {row.sport}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '14px', color: '#ddd' }}>{row.game}</td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '14px', color: '#ddd' }}>{row.line}</td>
                        <td style={{
                          padding: '0.75rem 0.5rem',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: row.movement.includes('+') ? '#7ED321' : '#E74C3C',
                          textAlign: 'right'
                        }}>
                          {row.direction} {row.movement}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '14px', textAlign: 'right', color: '#999' }}>
                          {row.books}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Games by Confidence */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                🎯 Top Games by Confidence
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {topGames.map(game => (
                  <div key={game.id} style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '24px' }}>{sportLogos[game.sport]}</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', color: '#fff' }}>
                            {game.away} @ {game.home}
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '12px', color: '#999' }}>
                            {game.time}
                          </p>
                        </div>
                      </div>
                      <div style={{
                        background: '#7ED321',
                        color: '#000',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}>
                        {game.confidence}% ({game.signals} signals)
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      color: '#ddd',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid #333'
                    }}>
                      <span>Home: {game.homeOdds > 0 ? '+' : ''}{game.homeOdds}</span>
                      <span>Away: {game.awayOdds > 0 ? '+' : ''}{game.awayOdds}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0a0a0a',
      color: '#fff'
    }}>
      <Header setAppMenu={setAppMenu} />

      {/* Main content area */}
      <main style={{
        flex: 1,
        minHeight: 0,
        padding: '2.5rem 1.5rem',
        overflowY: 'auto',
        width: '100%',
        maxWidth: '100%'
      }}>
        {renderContent()}
      </main>

    </div>
  );
};

export default Dashboard;
