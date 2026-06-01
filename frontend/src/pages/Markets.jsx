import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Markets = ({ setAppMenu }) => {
  const [selectedSport, setSelectedSport] = useState('baseball_mlb');
  const [searchQuery, setSearchQuery] = useState('');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  // ONLY MLB IS ACTIVE - OTHER SPORTS DISABLED
  const sportOptions = [
    { value: 'baseball_mlb', label: 'MLB', logo: '⚾', active: true },
    { value: 'basketball_nba', label: 'NBA', logo: '🏀', active: false, disabled: true },
    { value: 'americanfootball_nfl', label: 'NFL', logo: '🏈', active: false, disabled: true },
  ];

  // Fetch live markets data - ONLY FOR MLB
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        setError(null);

        // FORCE MLB ONLY
        if (selectedSport !== 'baseball_mlb') {
          setSelectedSport('baseball_mlb');
          return;
        }

        console.log(`📊 Fetching MLB markets...`);

        const response = await fetch(`/api/markets/live?sport=baseball_mlb`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Format the data
        let formattedMarkets = [];
        if (data.games) {
          formattedMarkets = data.games;
        } else if (Array.isArray(data)) {
          formattedMarkets = data;
        }

        setMarkets(formattedMarkets);
        setSource(data.source || 'api');

        console.log(`✅ Loaded ${formattedMarkets.length} MLB games from ${data.source || 'api'}`);
      } catch (err) {
        console.error('❌ Error fetching MLB markets:', err);
        setError(err.message);
        setMarkets([]);
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
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <Header setAppMenu={setAppMenu} title="Markets" icon="📊" />

      {/* Sport Selector - MLB ONLY */}
      <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200 px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {sportOptions.map(sport => (
            <button
              key={sport.value}
              disabled={sport.disabled}
              onClick={() => !sport.disabled && setSelectedSport(sport.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                sport.disabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                  : selectedSport === sport.value
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              title={sport.disabled ? 'Coming soon - MLB only for now' : ''}
            >
              {sport.logo} {sport.label} {sport.disabled ? '🔒' : ''}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-3 font-medium">
          ⚾ MLB Model Active • NBA & NFL Coming Soon
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search MLB games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
        />

        {/* Status */}
        <div className="text-xs text-gray-600 mt-3">
          {loading ? '⏳ Loading MLB games...' : `✅ ${filteredMarkets.length} MLB games · Source: ${source}`}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-medium">⚠️ Error: {error}</p>
            <p className="text-sm text-red-600 mt-1">Trying to fetch live MLB data...</p>
          </div>
        )}

        {loading && markets.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-green-600 text-4xl">⏳</div>
            <p className="text-gray-600 mt-4">Loading live MLB games...</p>
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No MLB games found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMarkets.map((game) => (
              <div
                key={game.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition-all"
              >
                {/* Matchup Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      ⚾ {game.matchup || `${game.away || '?'} vs ${game.home || '?'}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {game.time} {game.stadium && `· ${game.stadium}`}
                    </p>
                  </div>
                </div>

                {/* Odds Section */}
                {game.odds && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* Moneyline */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 font-medium">MONEYLINE</p>
                      <p className="text-lg font-bold text-green-600">
                        {game.odds.moneyline?.best || game.odds.moneyline?.away || '-'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {game.odds.moneyline?.book || 'Best odds'}
                      </p>
                    </div>

                    {/* Spread */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 font-medium">SPREAD</p>
                      <p className="text-lg font-bold text-green-600">
                        {game.odds.spread?.line || game.line || '-'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {game.odds.spread?.odds ? `${game.odds.spread.odds}` : 'vs'}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 font-medium">TOTAL</p>
                      <p className="text-lg font-bold text-green-600">
                        {game.odds.total?.line || '-'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">O/U</p>
                    </div>
                  </div>
                )}

                {/* Market Data */}
                {(game.volume || game.movement || game.sharpBooks) && (
                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    {game.volume && (
                      <div>
                        <p className="text-gray-600 font-medium">Volume</p>
                        <p className="text-green-600 font-bold">
                          ${(game.volume / 1000).toFixed(0)}k
                        </p>
                      </div>
                    )}
                    {game.movement && (
                      <div>
                        <p className="text-gray-600 font-medium">Movement</p>
                        <p className={game.movement.startsWith('+') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {game.movement}
                        </p>
                      </div>
                    )}
                    {game.sharpBooks && (
                      <div>
                        <p className="text-gray-600 font-medium">Sharp Books</p>
                        <p className="text-green-600 font-bold">{game.sharpBooks}/10</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Signals */}
                {game.signals && game.signals.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {game.signals.map((signal, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200"
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

        {/* MLB Only Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📊 MLB Model Active:</strong> Currently showing live MLB games only. NBA and NFL models coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Markets;
