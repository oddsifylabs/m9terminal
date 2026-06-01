import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Markets = ({ setAppMenu }) => {
  const [activeTab, setActiveTab] = useState('signals');
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

  // Sample data for different tabs
  const signalsData = [
    { id: 1, game: 'NYY vs BOS', signal: 'SHARP_MONEY', confidence: 85, amount: '$1.2M', direction: 'Under' },
    { id: 2, game: 'LAD vs SF', signal: 'STEAM', confidence: 72, amount: '$800K', direction: 'Over' },
  ];

  const propsData = [
    { id: 1, player: 'Aaron Judge', prop: 'Home Runs', line: 1.5, odds: '-110', trend: '+2.5%' },
    { id: 2, player: 'Mookie Betts', prop: 'Hits', line: 1.5, odds: '-110', trend: '+1.2%' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <Header setAppMenu={setAppMenu} title="Markets" icon="⚾" />

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['signals', 'props', 'gameexplorer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'gameexplorer' ? 'Game Explorer' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-4xl mx-auto">

        {/* SIGNALS TAB */}
        {activeTab === 'signals' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Market Signals</h2>
            <p className="text-sm text-gray-600 mb-4">⚾ MLB Model Active • Sharp money detection and market anomalies</p>
            
            {signalsData.map((signal) => (
              <div key={signal.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{signal.game}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-1">
                      {signal.signal}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{signal.confidence}%</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Amount: <span className="font-bold">{signal.amount}</span></p>
                  <p className="text-gray-600">Direction: <span className="font-bold">{signal.direction}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROPS TAB */}
        {activeTab === 'props' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Player Props</h2>
            <p className="text-sm text-gray-600 mb-4">⚾ MLB Model Active • Individual player prop opportunities</p>
            
            {propsData.map((prop) => (
              <div key={prop.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{prop.player}</p>
                    <p className="text-sm text-gray-600">{prop.prop}</p>
                  </div>
                  <span className={`text-sm font-bold ${prop.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {prop.trend}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Line: <span className="font-bold">{prop.line}</span></p>
                  <p className="text-gray-600">Odds: <span className="font-bold">{prop.odds}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GAME EXPLORER TAB */}
        {activeTab === 'gameexplorer' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Game Explorer</h2>
            <p className="text-sm text-gray-600 mb-4">⚾ MLB Model Active • Detailed game-level analysis</p>

            {/* Sport Selector */}
            <div className="flex gap-2 mb-4">
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

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search MLB games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
            />

            {/* Status */}
            <div className="text-xs text-gray-600">
              {loading ? '⏳ Loading MLB games...' : `✅ ${filteredMarkets.length} MLB games · Source: ${source}`}
            </div>

            {/* Games List */}
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
                      <div className="grid grid-cols-3 gap-3 text-sm">
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Markets;
