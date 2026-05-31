import React, { useState } from 'react';
import Icons from '../components/Icons';
import { MLBTeams, getTeamLogo, getTeamColor } from '../data/mlb-teams-with-images';

/**
 * M9 Terminal Dashboard
 * Modern, visual UI with real team logos
 */

const Dashboard = () => {
  const [profile, setProfile] = useState('ACTIVE');
  const [selectedMarket, setSelectedMarket] = useState('ML');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Sample data with real images
  const sampleGames = [
    {
      gameId: 'MLB_2026_NYY_BOS',
      awayTeam: 'NYY',
      homeTeam: 'BOS',
      commenceTime: '2026-06-03T19:05:00Z',
      opportunities: [
        {
          market: 'ML',
          recommendation: 'BET_AWAY',
          confidence: 84,
          rating: 'A+ (MAXIMUM)',
          edge: '+28%',
          bestOdds: -100,
          bestBook: 'DraftKings',
          betSize: 2800
        },
        {
          market: 'SPREAD',
          recommendation: 'BET_AWAY',
          confidence: 72,
          rating: 'A (HIGH)',
          edge: '+7%',
          bestOdds: -110,
          bestBook: 'BetMGM',
          betSize: 1400
        },
        {
          market: 'OVER_UNDER',
          recommendation: 'OVER',
          confidence: 75,
          rating: 'A (HIGH)',
          edge: '+12%',
          bestOdds: -110,
          bestBook: 'FanDuel',
          betSize: 1750
        }
      ]
    }
  ];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-emerald-500';
    if (confidence >= 70) return 'text-blue-500';
    if (confidence >= 55) return 'text-amber-500';
    return 'text-red-500';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 85) return 'bg-emerald-500/10 border border-emerald-500/30';
    if (confidence >= 70) return 'bg-blue-500/10 border border-blue-500/30';
    if (confidence >= 55) return 'bg-amber-500/10 border border-amber-500/30';
    return 'bg-red-500/10 border border-red-500/30';
  };

  const filteredGames = sampleGames.map(game => ({
    ...game,
    opportunities: game.opportunities.filter(opp => {
      if (profile === 'SHARP') return opp.confidence >= 80;
      if (profile === 'ACTIVE') return opp.confidence >= 55;
      return true;
    })
  })).filter(game => game.opportunities.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">M9 Terminal</h1>
                <p className="text-xs text-slate-400">Sports Market Intelligence</p>
              </div>
            </div>

            {/* Profile Selector */}
            <div className="flex gap-2">
              {['SHARP', 'ACTIVE', 'RESEARCH'].map(p => (
                <button
                  key={p}
                  onClick={() => setProfile(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    profile === p
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'text-slate-400 hover:text-slate-300 border border-slate-700/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="text-slate-400 text-lg">⚙️</div>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <div className="text-amber-500 flex-shrink-0 mt-0.5 text-xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-200 mb-1">Disclaimer</h3>
                <p className="text-xs text-amber-100/80 leading-relaxed">
                  M9 Terminal provides analytical insights only. Past performance does not guarantee future results. Sports betting involves significant risk. Please gamble responsibly. Must be 21+. Check local laws before betting. This is not financial advice. Always verify odds with your sportsbook.
                </p>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="text-amber-400 hover:text-amber-300 flex-shrink-0 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur">
            <p className="text-xs text-slate-400 mb-1">Games</p>
            <p className="text-2xl font-bold text-white">15</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur">
            <p className="text-xs text-slate-400 mb-1">Opportunities</p>
            <p className="text-2xl font-bold text-white">3</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur">
            <p className="text-xs text-slate-400 mb-1">Avg Confidence</p>
            <p className="text-2xl font-bold text-white">76%</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur">
            <p className="text-xs text-slate-400 mb-1">Total Edge</p>
            <p className="text-2xl font-bold text-white">+47%</p>
          </div>
        </div>

        {/* Games */}
        <div className="space-y-6">
          {filteredGames.map(game => {
            const awayTeam = MLBTeams[game.awayTeam];
            const homeTeam = MLBTeams[game.homeTeam];

            return (
              <div key={game.gameId}>
                {/* Game Header */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 backdrop-blur mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Away Team */}
                      <div className="flex items-center gap-3">
                        <img
                          src={awayTeam.logoUrl}
                          alt={awayTeam.name}
                          className="w-12 h-12 rounded-lg object-contain bg-slate-700/50 p-1"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-300">{awayTeam.name}</p>
                          <p className="text-xs text-slate-500">{game.awayTeam}</p>
                        </div>
                      </div>

                      <div className="text-slate-500 font-semibold">@</div>

                      {/* Home Team */}
                      <div className="flex items-center gap-3">
                        <img
                          src={homeTeam.logoUrl}
                          alt={homeTeam.name}
                          className="w-12 h-12 rounded-lg object-contain bg-slate-700/50 p-1"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-300">{homeTeam.name}</p>
                          <p className="text-xs text-slate-500">{game.homeTeam}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-300">7:05 PM ET</p>
                      <p className="text-xs text-slate-500">Today</p>
                    </div>
                  </div>
                </div>

                {/* Opportunity Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {game.opportunities.map((opp, idx) => {
                    const marketIcons = {
                      'ML': '⚡',
                      'SPREAD': '📊',
                      'OVER_UNDER': '📈'
                    };

                    return (
                      <div
                        key={idx}
                        className={`${getConfidenceBg(opp.confidence)} rounded-lg p-4 backdrop-blur`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{marketIcons[opp.market]}</span>
                            <span className="text-xs font-semibold text-slate-300">
                              {opp.market === 'OVER_UNDER' ? 'O/U' : opp.market}
                            </span>
                          </div>
                          <div className={`text-xs font-bold px-2 py-1 rounded ${getConfidenceColor(opp.confidence)}`}>
                            {opp.confidence}
                          </div>
                        </div>

                        <p className="text-2xl font-bold text-white mb-1">
                          {opp.recommendation === 'BET_AWAY' ? '↑' : opp.recommendation === 'BET_HOME' ? '↓' : '⬆'}
                          {opp.market === 'OVER_UNDER' ? (opp.recommendation === 'OVER' ? ' OVER' : ' UNDER') : ' ' + (opp.recommendation === 'BET_AWAY' ? 'AWAY' : 'HOME')}
                        </p>
                        <p className="text-xs text-slate-400 mb-4">{opp.rating}</p>

                        <div className="space-y-2 mb-4 pb-4 border-b border-slate-700/50">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Edge</span>
                            <span className="text-sm font-bold text-emerald-400">{opp.edge}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Best Odds</span>
                            <span className="text-sm font-bold text-white">{opp.bestOdds}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Book</span>
                            <span className="text-xs font-semibold text-slate-300">{opp.bestBook}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-slate-400 mb-1">Suggested Bet Size</p>
                          <p className="text-lg font-bold text-white">${opp.betSize.toLocaleString()}</p>
                        </div>

                        <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition">
                          ⚡ Place Bet
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">About</h4>
              <p className="text-xs text-slate-400">M9 Terminal provides sports market intelligence for serious bettors. Data-driven analysis, no picks.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Disclaimer</h4>
              <p className="text-xs text-slate-400">Past performance ≠ future results. Gambling involves risk. Gamble responsibly. 21+ only.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Data Sources</h4>
              <p className="text-xs text-slate-400">Odds via the-odds-api.com • Game data via SportsData.io • Real-time verified data</p>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-6 text-center text-xs text-slate-500">
            <p>© 2026 M9 Terminal by Oddsify Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
