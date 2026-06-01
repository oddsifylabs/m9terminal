import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const News = ({ setActiveMenu }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // News articles
  const newsArticles = [
    {
      id: 1,
      sport: '⚾',
      title: 'Yankees announce roster changes ahead of crucial series',
      summary: 'New York Yankees made significant roster adjustments with three new pitchers added to the rotation for the upcoming Boston Red Sox series.',
      date: '2 hours ago',
      category: 'Breaking',
      impact: 'SHARP'
    },
    {
      id: 2,
      sport: '🏈',
      title: 'Chiefs defensive coordinator emphasizes stop-the-run strategy',
      summary: 'KC Chiefs defensive coordinator revealed their game plan focuses on shutting down the Chargers rushing attack while applying pressure upfield.',
      date: '4 hours ago',
      category: 'Strategy',
      impact: 'MEDIUM'
    },
    {
      id: 3,
      sport: '🏀',
      title: 'Lakers announce training facility upgrades for upcoming season',
      summary: 'LA Lakers revealed $15M investment in their training facility with new recovery and performance analytics equipment.',
      date: '6 hours ago',
      category: 'News',
      impact: 'LOW'
    },
    {
      id: 4,
      sport: '⚾',
      title: 'Houston Astros acquire relief pitcher in trade deadline move',
      summary: 'Astros strengthened their bullpen by acquiring a proven closer ahead of the stretch run. This move adds significant depth to their pitching rotation.',
      date: '8 hours ago',
      category: 'Trade',
      impact: 'SHARP'
    },
    {
      id: 5,
      sport: '🏈',
      title: 'Chargers announce practice squad additions for depth',
      summary: 'Los Angeles Chargers bolstered their practice squad with four new additions focusing on special teams and defensive depth.',
      date: '10 hours ago',
      category: 'Roster',
      impact: 'LOW'
    },
    {
      id: 6,
      sport: '🏀',
      title: 'Golden State Warriors sign development league talent to 10-day contract',
      summary: 'Warriors signed two G-League players to 10-day contracts as insurance for their backcourt rotation.',
      date: '12 hours ago',
      category: 'Roster',
      impact: 'MEDIUM'
    }
  ];

  // Injury reports
  const injuryReports = [
    {
      id: 1,
      sport: '⚾',
      player: 'Juan Soto',
      team: 'NYY',
      position: 'OF',
      status: 'Questionable',
      injury: 'Left hamstring strain',
      severity: 'Moderate',
      impact: 'HIGH',
      statusColor: '#F5A623'
    },
    {
      id: 2,
      sport: '🏈',
      player: 'Patrick Mahomes',
      team: 'KC',
      position: 'QB',
      status: 'Probable',
      injury: 'Right ankle soreness',
      severity: 'Minor',
      impact: 'LOW',
      statusColor: '#7ED321'
    },
    {
      id: 3,
      sport: '🏀',
      player: 'Anthony Davis',
      team: 'LAL',
      position: 'C/PF',
      status: 'Out',
      injury: 'Lower back strain',
      severity: 'Severe',
      impact: 'VERY HIGH',
      statusColor: '#E74C3C'
    },
    {
      id: 4,
      sport: '⚾',
      player: 'Isaac Paredes',
      team: 'HOU',
      position: 'DH',
      status: 'Day-to-Day',
      injury: 'Left knee contusion',
      severity: 'Mild',
      impact: 'MEDIUM',
      statusColor: '#F5A623'
    },
    {
      id: 5,
      sport: '🏈',
      player: 'Keenan Allen',
      team: 'LAC',
      position: 'WR',
      status: 'Out',
      injury: 'Hamstring injury',
      severity: 'Significant',
      impact: 'VERY HIGH',
      statusColor: '#E74C3C'
    },
    {
      id: 6,
      sport: '🏀',
      player: 'Steph Curry',
      team: 'GSW',
      position: 'PG',
      status: 'Probable',
      injury: 'Ankle soreness',
      severity: 'Minor',
      impact: 'LOW',
      statusColor: '#7ED321'
    }
  ];

  const handleInjuryTabClick = () => {
    setActiveTab('injuries');
  };

  const getImpactBadgeColor = (impact) => {
    const colorMap = {
      'SHARP': '#7ED321',
      'MEDIUM': '#F5A623',
      'LOW': '#4A90E2'
    };
    return colorMap[impact] || '#888';
  };

  const getSeverityColor = (severity) => {
    const colorMap = {
      'Minor': '#7ED321',
      'Mild': '#7ED321',
      'Moderate': '#F5A623',
      'Significant': '#F5A623',
      'Severe': '#E74C3C'
    };
    return colorMap[severity] || '#888';
  };

  return (
    <div style={{ flex: 1, background: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Header setActiveMenu={setActiveMenu} />

      <main style={{ flex: 1, maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: 0, overflowY: 'auto', width: '100%' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            📰 News & Updates
          </h1>
          <p style={{ fontSize: '14px', color: '#888', margin: '0' }}>
            Latest sports news, roster updates, and player injury reports
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid #2a2a2a',
          paddingBottom: '0'
        }}>
          <button
            onClick={() => setActiveTab('news')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'news' ? '#8FDC23' : '#888',
              fontSize: '16px',
              fontWeight: '600',
              padding: '0.75rem 0',
              paddingBottom: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'news' ? '2px solid #8FDC23' : '2px solid transparent',
              transition: 'all 0.2s ease',
              marginBottom: '-1px'
            }}
          >
            📰 News
          </button>
          <button
            onClick={handleInjuryTabClick}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'injuries' ? '#E74C3C' : '#888',
              fontSize: '16px',
              fontWeight: '600',
              padding: '0.75rem 0',
              paddingBottom: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'injuries' ? '2px solid #E74C3C' : '2px solid transparent',
              transition: 'all 0.2s ease',
              marginBottom: '-1px'
            }}
          >
            🏥 Injury Report
          </button>
        </div>

        {/* News Tab Content */}
        {activeTab === 'news' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {newsArticles.map((article) => (
              <div key={article.id} style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                gap: '1.5rem'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8FDC23';
                e.currentTarget.style.background = '#252525';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.background = '#1a1a1a';
              }}>
                {/* Sport Icon */}
                <div style={{ fontSize: '32px', minWidth: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {article.sport}
                </div>

                {/* Article Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: '#8FDC23',
                      background: '#8FDC2320',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px'
                    }}>
                      {article.category}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: getImpactBadgeColor(article.impact),
                      background: getImpactBadgeColor(article.impact) + '20',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px'
                    }}>
                      {article.impact}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#aaa', margin: '0 0 0.75rem 0', lineHeight: '1.5' }}>
                    {article.summary}
                  </p>

                  <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
                    {article.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Injury Report Tab Content */}
        {activeTab === 'injuries' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {injuryReports.map((injury) => (
              <div key={injury.id} style={{
                background: '#1a1a1a',
                border: `2px solid ${injury.statusColor}`,
                borderRadius: '10px',
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.background = '#252525';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1a1a1a';
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#ffffff' }}>
                      {injury.sport} {injury.player}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#888', margin: '0.25rem 0 0 0' }}>
                      {injury.team} • {injury.position}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: injury.statusColor,
                    background: injury.statusColor + '20',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    border: `1px solid ${injury.statusColor}`
                  }}>
                    {injury.status}
                  </span>
                </div>

                {/* Injury Details */}
                <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
                    Injury
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff', margin: '0 0 1rem 0' }}>
                    {injury.injury}
                  </p>

                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
                    Severity
                  </p>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: getSeverityColor(injury.severity),
                    background: getSeverityColor(injury.severity) + '20',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    border: `1px solid ${getSeverityColor(injury.severity)}`
                  }}>
                    {injury.severity}
                  </div>
                </div>

                {/* Impact */}
                <div style={{
                  background: injury.impact.includes('VERY') ? '#E74C3C20' : injury.impact === 'HIGH' ? '#F5A62320' : '#7ED32120',
                  border: `1px solid ${injury.impact.includes('VERY') ? '#E74C3C' : injury.impact === 'HIGH' ? '#F5A623' : '#7ED321'}`,
                  borderRadius: '6px',
                  padding: '0.75rem'
                }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    color: injury.impact.includes('VERY') ? '#E74C3C' : injury.impact === 'HIGH' ? '#F5A623' : '#7ED321',
                    margin: '0'
                  }}>
                    Betting Impact: {injury.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default News;
