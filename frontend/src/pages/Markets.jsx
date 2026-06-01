import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Markets = ({ setAppMenu }) => {
  const [activeMenu, setActiveMenu] = useState('markets');
  const [selectedSport, setSelectedSport] = useState('baseball_mlb');
  const [searchQuery, setSearchQuery] = useState('');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  const sportLogos = {
    MLB: '⚾',
    NBA: '🏀',
    NFL: '🏈',
    NHL: '🏒',
    SOCCER: '⚽'
  };

  const sportOptions = [
    { value: 'baseball_mlb', label: 'MLB', logo: '⚾' },
    { value: 'basketball_nba', label: 'NBA', logo: '🏀' },
    { value: 'americanfootball_nfl', label: 'NFL', logo: '🏈' },
    { value: 'ALL', label: 'All Sports', logo: '🎯' }
  ];

  // Fetch live markets data
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`📊 Fetching ${selectedSport} markets...`);

        const response = await fetch(
          selectedSport === 'ALL'
            ? '/api/markets/multi-sport'
            : `/api/markets/live?sport=${selectedSport}`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Format the data
        let formattedMarkets = [];
        if (selectedSport === 'ALL' && data.results) {
          // Multi-sport results
          Object.values(data.results).forEach(sportGames => {
            if (Array.isArray(sportGames)) {
              formattedMarkets = [...formattedMarkets, ...sportGames];
            }
          });
        } else if (data.games) {
          formattedMarkets = data.games;
        } else if (Array.isArray(data)) {
          formattedMarkets = data;
        }

        setMarkets(formattedMarkets);
        setSource(data.source || 'api');

        console.log(`✅ Loaded ${formattedMarkets.length} games from ${data.source || 'api'}`);
      } catch (err) {
        console.error('❌ Error fetching markets:', err);
        setError(err.message);
        setMarkets([]); // Clear any old data
        setSource('error');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarkets, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedSport]);

  // Filter markets based on search
  const filteredMarkets = markets.filter(market => {
    if (!searchQuery) return true;
    const matchup = market.matchup || `${market.away || ''} vs ${market.home || ''}`;
    return matchup.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <Header setAppMenu={setAppMenu} title="Markets" icon="📊" />

      {/* Sport Selector */}
      <div className="sticky top-16 z-40 bg-slate-800/90 backdrop-blur border-b border-slate-700 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sportOptions.map(sport => (
            <button
              key={sport.value}
              onClick={() => setSelectedSport(sport.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedSport === sport.value
                  ? 'bg-cyan-500 text-slate-900'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {sport.logo} {sport.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mt-3 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none"
        />

        {/* Status */}
        <div className="text-xs text-slate-400 mt-2">
          {loading ? '⏳ Loading...' : `✅ ${filteredMarkets.length} games · Source: ${source}`}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {error && (
          <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-4">
            <p className="text-red-200">⚠️ Error: {error}</p>
            <p className="text-sm text-red-300 mt-1">Showing: Demo data (click refresh to retry)</p>
          </div>
        )}

        {loading && markets.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin text-cyan-400 text-3xl">⏳</div>
            <p className="text-slate-400 mt-3">Loading live markets...</p>
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No games found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMarkets.map((game) => (
              <div
                key={game.id}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-cyan-500 transition-all"
              >
                {/* Matchup Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white">
                      {game.matchup || `${game.away || '?'} vs ${game.home || '?'}`}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {game.time} {game.stadium && `· ${game.stadium}`}
                    </p>
                  </div>
                </div>

                {/* Odds Section */}
                {game.odds && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {/* Moneyline */}
                    <div className="bg-slate-800 rounded p-2">
                      <p className="text-xs text-slate-400">Moneyline</p>
                      <p className="text-sm font-bold text-cyan-400">
                        {game.odds.moneyline?.best || game.odds.moneyline?.away || '-'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {game.odds.moneyline?.book || 'Best'}
                      </p>
                    </div>

                    {/* Spread */}
                    <div className="bg-slate-800 rounded p-2">
                      <p className="text-xs text-slate-400">Spread</p>
                      <p className="text-sm font-bold text-cyan-400">
                        {game.odds.spread?.line || game.line || '-'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {game.odds.spread?.odds ? `${game.odds.spread.odds}` : ''}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="bg-slate-800 rounded p-2">
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="text-sm font-bold text-cyan-400">
                        {game.odds.total?.line || '-'}
                      </p>
                      <p className="text-xs text-slate-500">
                        O/U
                      </p>
                    </div>
                  </div>
                )}

                {/* Market Data */}
                {(game.volume || game.movement || game.sharpBooks) && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {game.volume && (
                      <div>
                        <p className="text-slate-400">Volume</p>
                        <p className="text-green-400 font-bold">
                          ${(game.volume / 1000).toFixed(0)}k
                        </p>
                      </div>
                    )}
                    {game.movement && (
                      <div>
                        <p className="text-slate-400">Movement</p>
                        <p className={game.movement.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                          {game.movement}
                        </p>
                      </div>
                    )}
                    {game.sharpBooks && (
                      <div>
                        <p className="text-slate-400">Sharp Books</p>
                        <p className="text-blue-400 font-bold">{game.sharpBooks}/10</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Signals */}
                {game.signals && game.signals.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {game.signals.map((signal, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Markets;
