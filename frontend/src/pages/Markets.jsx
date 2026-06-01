import React, { useState } from 'react';
import Header from '../components/Header';

const Markets = ({ setAppMenu }) => {
  const [activeMenu, setActiveMenu] = useState('markets');
  const [selectedSport, setSelectedSport] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const sportLogos = {
    MLB: '⚾',
    NBA: '🏀',
    NFL: '🏈',
    NHL: '🏒',
    SOCCER: '⚽'
  };

  const markets = [
    // MLB Games
    {
      id: 1,
      sport: 'MLB',
      matchup: 'NYY vs BOS',
      time: '7:05 PM ET',
      line: '-1.5',
      odds: '-110/-110',
      volume: 1200000,
      movement: '+0.5',
      sharpBooks: 8,
      publicPercent: 72,
      signals: ['SHARP_MONEY', 'STEAM']
    },
    {
      id: 2,
      sport: 'MLB',
      matchup: 'HOU vs SEA',
      time: '9:10 PM ET',
      line: '-2.5',
      odds: '-120/+100',
      volume: 850000,
      movement: '-0.5',
      sharpBooks: 6,
      publicPercent: 58,
      signals: ['LINE_VALUE']
    },
    {
      id: 3,
      sport: 'MLB',
      matchup: 'LAD vs SD',
      time: '8:40 PM PT',
      line: '+1.0',
      odds: '-105/-115',
      volume: 650000,
      movement: '+1.0',
      sharpBooks: 7,
      publicPercent: 65,
      signals: ['VOLUME_ANOMALY']
    },

    // NBA Games
    {
      id: 4,
      sport: 'NBA',
      matchup: 'LAL vs GSW',
      time: '10:00 PM ET',
      line: '+5.5',
      odds: '-110/-110',
      volume: 2100000,
      movement: '+1.5',
      sharpBooks: 9,
      publicPercent: 78,
      signals: ['STEAM', 'SHARP_MONEY']
    },
    {
      id: 5,
      sport: 'NBA',
      matchup: 'MIA vs BOS',
      time: '7:30 PM ET',
      line: '+3.0',
      odds: '-115/+95',
      volume: 1650000,
      movement: '+2.0',
      sharpBooks: 8,
      publicPercent: 72,
      signals: ['SHARP_MONEY']
    },
    {
      id: 6,
      sport: 'NBA',
      matchup: 'DEN vs LAL',
      time: '9:00 PM ET',
      line: '-2.0',
      odds: '-110/-110',
      volume: 1200000,
      movement: '-0.5',
      sharpBooks: 5,
      publicPercent: 52,
      signals: ['LINE_VALUE']
    },

    // NFL Games
    {
      id: 7,
      sport: 'NFL',
      matchup: 'KC vs LAC',
      time: '1:00 PM ET',
      line: '-3.0',
      odds: '-160/+140',
      volume: 3200000,
      movement: '-0.5',
      sharpBooks: 9,
      publicPercent: 68,
      signals: ['SHARP_MONEY', 'STEAM']
    },
    {
      id: 8,
      sport: 'NFL',
      matchup: 'DAL vs PHI',
      time: '4:25 PM ET',
      line: '-2.0',
      odds: '-110/-110',
      volume: 2800000,
      movement: '+0.5',
      sharpBooks: 7,
      publicPercent: 62,
      signals: ['VOLUME_ANOMALY']
    },
    {
      id: 9,
      sport: 'NFL',
      matchup: 'SF vs SEA',
      time: '8:20 PM ET',
      line: '+7.0',
      odds: '+300/-350',
      volume: 1900000,
      movement: '+1.0',
      sharpBooks: 4,
      publicPercent: 45,
      signals: ['LINE_VALUE']
    },

    // NHL Games
    {
      id: 10,
      sport: 'NHL',
      matchup: 'NYR vs BOS',
      time: '7:00 PM ET',
      line: '-1.5',
      odds: '-120/+100',
      volume: 450000,
      movement: '-0.5',
      sharpBooks: 5,
      publicPercent: 55,
      signals: ['SHARP_MONEY']
    },
    {
      id: 11,
      sport: 'NHL',
      matchup: 'LAK vs EDM',
      time: '10:00 PM ET',
      line: '+1.0',
      odds: '-110/-110',
      volume: 380000,
      movement: '+0.5',
      sharpBooks: 4,
      publicPercent: 52,
      signals: []
    },

    // Soccer
    {
      id: 12,
      sport: 'SOCCER',
      matchup: 'Man City vs Arsenal',
      time: '3:00 PM GMT',
      line: '-0.75',
      odds: '-150/+120',
      volume: 580000,
      movement: '-0.25',
      sharpBooks: 6,
      publicPercent: 61,
      signals: ['STEAM']
    }
  ];

  // Filter markets
  const filteredMarkets = markets.filter(m => {
    const sportMatch = selectedSport === 'ALL' || m.sport === selectedSport;
    const searchMatch = m.matchup.toLowerCase().includes(searchQuery.toLowerCase());
    return sportMatch && searchMatch;
  });

  // Get signal color
  const getSignalColor = (signal) => {
    const colors = {
      SHARP_MONEY: '#7ED321',
      STEAM: '#F5A623',
      LINE_VALUE: '#50E3C2',
      VOLUME_ANOMALY: '#D946EF'
    };
    return colors[signal] || '#999';
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

      <main style={{
        flex: 1,
        minHeight: 0,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        overflowY: 'auto',
        width: '100%'
      }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '28px', fontWeight: '700' }}>
            📊 Live Markets
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
            {filteredMarkets.length} games with live odds and signals
          </p>
        </div>

        {/* Search & Filter */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '250px',
              background: '#1a1a1a',
              border: '1px solid #333',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />

          {/* Sport Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'MLB', 'NBA', 'NFL', 'NHL', 'SOCCER'].map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                style={{
                  background: selectedSport === sport ? '#4A90E2' : '#1a1a1a',
                  color: '#fff',
                  border: `1px solid ${selectedSport === sport ? '#4A90E2' : '#333'}`,
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {sport !== 'ALL' ? `${sportLogos[sport]} ${sport}` : 'ALL'}
              </button>
            ))}
          </div>
        </div>

        {/* Markets Grid */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredMarkets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              color: '#999'
            }}>
              <p style={{ fontSize: '16px' }}>No games found matching your filters.</p>
            </div>
          ) : (
            filteredMarkets.map(market => (
              <div
                key={market.id}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {/* Matchup */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '20px' }}>{sportLogos[market.sport]}</span>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>
                      {market.matchup}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    {market.time}
                  </p>
                </div>

                {/* Odds & Line */}
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#999' }}>
                    SPREAD
                  </p>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>
                    {market.line}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '12px', color: '#ddd' }}>
                    {market.odds}
                  </p>
                </div>

                {/* Market Activity */}
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#999' }}>
                    MARKET
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Volume</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', fontSize: '14px' }}>
                        {(market.volume / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Movement</p>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: market.movement.includes('+') ? '#7ED321' : '#E74C3C'
                      }}>
                        {market.movement.includes('+') ? '↑' : '↓'} {market.movement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signals */}
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#999' }}>
                    SIGNALS ({market.signals.length})
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {market.signals.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>—</p>
                    ) : (
                      market.signals.slice(0, 2).map(signal => (
                        <span
                          key={signal}
                          style={{
                            background: getSignalColor(signal),
                            color: '#000',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}
                        >
                          {signal.split('_')[0]}
                        </span>
                      ))
                    )}
                    {market.signals.length > 2 && (
                      <span style={{
                        background: '#666',
                        color: '#fff',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        +{market.signals.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Books Aligned */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#999' }}>
                    SHARP BOOKS
                  </p>
                  <div style={{
                    background: '#333',
                    color: '#fff',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {market.sharpBooks}/10
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

    </div>
  );
};

export default Markets;
