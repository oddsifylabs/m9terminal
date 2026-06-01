import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Weather = ({ setActiveMenu }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather data for major sports venues
  const weatherData = [
    {
      id: 1,
      stadium: 'Yankee Stadium',
      city: 'New York, NY',
      sport: '⚾ MLB',
      temp: 68,
      condition: 'Partly Cloudy',
      humidity: 62,
      windSpeed: 8,
      windDirection: 'NW',
      visibility: 10,
      impact: 'Moderate',
      impactDetail: 'Wind may favor certain home runs'
    },
    {
      id: 2,
      stadium: 'Arrowhead Stadium',
      city: 'Kansas City, MO',
      sport: '🏈 NFL',
      temp: 72,
      condition: 'Sunny',
      humidity: 48,
      windSpeed: 5,
      windDirection: 'S',
      visibility: 10,
      impact: 'Low',
      impactDetail: 'Ideal conditions for passing game'
    },
    {
      id: 3,
      stadium: 'Crypto.com Arena',
      city: 'Los Angeles, CA',
      sport: '🏀 NBA',
      temp: 75,
      condition: 'Clear',
      humidity: 55,
      windSpeed: 3,
      windDirection: 'W',
      visibility: 10,
      impact: 'None',
      impactDetail: 'Indoor venue - weather irrelevant'
    },
    {
      id: 4,
      stadium: 'Fenway Park',
      city: 'Boston, MA',
      sport: '⚾ MLB',
      temp: 62,
      condition: 'Overcast',
      humidity: 72,
      windSpeed: 12,
      windDirection: 'NE',
      visibility: 9,
      impact: 'High',
      impactDetail: 'Strong wind will suppress fly balls'
    },
    {
      id: 5,
      stadium: 'TD Garden',
      city: 'Boston, MA',
      sport: '🏀 NBA',
      temp: 68,
      condition: 'N/A',
      humidity: 0,
      windSpeed: 0,
      windDirection: 'N/A',
      visibility: 10,
      impact: 'None',
      impactDetail: 'Indoor venue - weather irrelevant'
    },
    {
      id: 6,
      stadium: 'SoFi Stadium',
      city: 'Inglewood, CA',
      sport: '🏈 NFL',
      temp: 76,
      condition: 'Sunny',
      humidity: 52,
      windSpeed: 4,
      windDirection: 'W',
      visibility: 10,
      impact: 'None',
      impactDetail: 'Mostly covered stadium'
    }
  ];

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Sunny': '☀️',
      'Clear': '🌙',
      'Partly Cloudy': '⛅',
      'Overcast': '☁️',
      'Rainy': '🌧️',
      'Stormy': '⛈️',
      'Snowy': '❄️',
      'N/A': '🏟️'
    };
    return iconMap[condition] || '🌤️';
  };

  const getImpactColor = (impact) => {
    const colorMap = {
      'None': '#7ED321',
      'Low': '#4A90E2',
      'Moderate': '#F5A623',
      'High': '#E74C3C'
    };
    return colorMap[impact] || '#888';
  };

  return (
    <div style={{ flex: 1, background: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Header setActiveMenu={setActiveMenu} />

      <main style={{ flex: 1, maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: 0, overflowY: 'auto', width: '100%' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            🌤️ Stadium Weather
          </h1>
          <p style={{ fontSize: '14px', color: '#888', margin: '0' }}>
            Real-time weather conditions & betting impact analysis
          </p>
        </div>

        {/* Weather Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
        }}>
          {weatherData.map((venue) => (
            <div key={venue.id} style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#8FDC23';
              e.currentTarget.style.background = '#252525';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2a2a2a';
              e.currentTarget.style.background = '#1a1a1a';
            }}>
              {/* Venue Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 0.25rem 0', color: '#ffffff' }}>
                    {venue.stadium}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0' }}>
                    {venue.city} • {venue.sport}
                  </p>
                </div>
                <div style={{ fontSize: '28px' }}>
                  {getWeatherIcon(venue.condition)}
                </div>
              </div>

              {/* Main Weather Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Temperature */}
                <div style={{ background: '#0a0a0a', padding: '0.75rem', borderRadius: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
                    Temperature
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '600', margin: '0', color: '#50E3C2' }}>
                    {venue.temp}°F
                  </p>
                </div>

                {/* Condition */}
                <div style={{ background: '#0a0a0a', padding: '0.75rem', borderRadius: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
                    Condition
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#ffffff' }}>
                    {venue.condition}
                  </p>
                </div>

                {/* Humidity */}
                <div style={{ background: '#0a0a0a', padding: '0.75rem', borderRadius: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
                    Humidity
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: '600', margin: '0', color: '#4A90E2' }}>
                    {venue.humidity}%
                  </p>
                </div>

                {/* Wind */}
                <div style={{ background: '#0a0a0a', padding: '0.75rem', borderRadius: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
                    Wind
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', margin: '0', color: '#F5A623' }}>
                    {venue.windSpeed} mph {venue.windDirection}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '11px', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
                  Visibility
                </p>
                <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#ffffff' }}>
                  {venue.visibility} miles
                </p>
              </div>

              {/* Impact Badge */}
              <div style={{
                background: getImpactColor(venue.impact) + '20',
                border: `1px solid ${getImpactColor(venue.impact)}`,
                borderRadius: '6px',
                padding: '0.75rem',
              }}>
                <p style={{ fontSize: '11px', color: getImpactColor(venue.impact), margin: '0 0 0.25rem 0', fontWeight: '600', textTransform: 'uppercase' }}>
                  Betting Impact: {venue.impact}
                </p>
                <p style={{ fontSize: '12px', color: '#ffffff', margin: '0' }}>
                  {venue.impactDetail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Weather Tips Section */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 1rem 0', color: '#ffffff' }}>
            💡 Weather Betting Tips
          </h3>
          <ul style={{ margin: '0', paddingLeft: '1.25rem', color: '#bbb' }}>
            <li style={{ marginBottom: '0.75rem', fontSize: '14px' }}>
              <strong>Wind &amp; Ball Flight:</strong> Strong winds (12+ mph) suppress fly balls in baseball and affect field goal distance in football
            </li>
            <li style={{ marginBottom: '0.75rem', fontSize: '14px' }}>
              <strong>Cold Weather:</strong> Reduces ball carry distance and affects player performance, especially in outdoor sports
            </li>
            <li style={{ marginBottom: '0.75rem', fontSize: '14px' }}>
              <strong>Rain Impact:</strong> Increases turnovers in football, slows down play in baseball, reduces three-point shooting in outdoor venues
            </li>
            <li style={{ marginBottom: '0.75rem', fontSize: '14px' }}>
              <strong>Humidity:</strong> High humidity (70%+) slows down fly balls and reduces ball carry in baseball
            </li>
            <li style={{ fontSize: '14px' }}>
              <strong>Indoor Venues:</strong> Weather has no impact on basketball, hockey, or indoor soccer matches
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Weather;
