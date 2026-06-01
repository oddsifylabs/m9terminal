import React, { useState, useEffect } from 'react';

const Markets = ({ setAppMenu }) => {
  const [activeTab, setActiveTab] = useState('signals');
  const [selectedSport, setSelectedSport] = useState('baseball_mlb');
  const [liveGames, setLiveGames] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample signals data
  const signalsData = [
    {
      id: 1,
      game: 'NYY vs BOS',
      signalType: 'SHARP_MONEY',
      confidence: 85,
      amount: '$1.2M',
      direction: 'Under',
      movement: '+2.5%'
    },
    {
      id: 2,
      game: 'LAD vs SF',
      signalType: 'STEAM',
      confidence: 72,
      amount: '$800K',
      direction: 'Over',
      movement: '+1.2%'
    },
  ];

  // Sample props data
  const propsData = [
    {
      id: 1,
      player: 'Aaron Judge',
      team: 'NYY',
      prop: 'Home Runs',
      line: 1.5,
      odds: '-110',
      trend: '+2.5%',
      value: 'High'
    },
    {
      id: 2,
      player: 'Mookie Betts',
      team: 'LAD',
      prop: 'Hits',
      line: 1.5,
      odds: '-110',
      trend: '+1.2%',
      value: 'Medium'
    },
  ];

  // Sample live games
  const gamesData = [
    {
      id: 1,
      sport: 'baseball_mlb',
      matchup: 'NYY vs BOS',
      time: '7:05 PM ET',
      moneyline: { away: '+110', home: '-130' },
      spread: { away: '+1.5', home: '-1.5', odds: '-110' },
      total: { line: 8.5, overOdds: '-110', underOdds: '-110' },
      volume: '$2.3M',
      movement: '+2.1%',
      sharpAction: 'Under'
    },
    {
      id: 2,
      sport: 'baseball_mlb',
      matchup: 'LAD vs SF',
      time: '8:15 PM PT',
      moneyline: { away: '+120', home: '-140' },
      spread: { away: '+2.0', home: '-2.0', odds: '-110' },
      total: { line: 7.5, overOdds: '-110', underOdds: '-110' },
      volume: '$1.8M',
      movement: '-1.5%',
      sharpAction: 'Over'
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Page Title */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">⚾ Markets</h2>
        <p className="text-xs text-gray-600 mt-1">MLB Live Data</p>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200">
        <div className="flex overflow-x-auto px-4">
          {['signals', 'props', 'gameexplorer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-all border-b-2 text-sm ${
                activeTab === tab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'signals' ? 'Signals' : tab === 'props' ? 'Props' : 'Game Explorer'}
            </button>
          ))}
        </div>
      </div>

      {/* MLB Only Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <p className="text-xs text-blue-800">⚾ MLB Model Only</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 max-w-4xl mx-auto">

          {/* SIGNALS TAB */}
          {activeTab === 'signals' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Sharp Money Signals</h3>
              {signalsData.map((signal) => (
                <div key={signal.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{signal.game}</p>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700 mt-1 inline-block">
                        {signal.signalType}
                      </span>
                    </div>
                    <p className={`text-lg font-bold ${signal.direction === 'Under' ? 'text-red-600' : 'text-green-600'}`}>
                      {signal.direction}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-gray-600">Confidence</p>
                      <p className="font-bold text-gray-900 mt-1">{signal.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-bold text-gray-900 mt-1">{signal.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Movement</p>
                      <p className="font-bold text-gray-900 mt-1">{signal.movement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROPS TAB */}
          {activeTab === 'props' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Player Props</h3>
              {propsData.map((prop) => (
                <div key={prop.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{prop.player}</p>
                      <p className="text-xs text-gray-600">{prop.team} • {prop.prop}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      prop.value === 'High' ? 'bg-green-100 text-green-700' :
                      prop.value === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {prop.value}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-gray-600">Line</p>
                      <p className="font-bold text-gray-900 mt-1">{prop.line}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Odds</p>
                      <p className="font-bold text-gray-900 mt-1">{prop.odds}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Trend</p>
                      <p className="font-bold text-green-600 mt-1">{prop.trend}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GAME EXPLORER TAB */}
          {activeTab === 'gameexplorer' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Live MLB Games</h3>
              {gamesData.map((game) => (
                <div key={game.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-gray-900">{game.matchup}</p>
                      <p className="text-xs text-gray-600">{game.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-600">Volume: {game.volume}</p>
                      <p className="text-sm font-bold text-green-600 mt-1">{game.movement}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Moneyline</p>
                        <div className="flex gap-2">
                          <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs text-gray-600">Away</p>
                            <p className="font-bold text-gray-900">{game.moneyline.away}</p>
                          </div>
                          <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs text-gray-600">Home</p>
                            <p className="font-bold text-gray-900">{game.moneyline.home}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Spread</p>
                        <div className="flex gap-2">
                          <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs text-gray-600">Away</p>
                            <p className="font-bold text-gray-900">{game.spread.away}</p>
                          </div>
                          <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs text-gray-600">Home</p>
                            <p className="font-bold text-gray-900">{game.spread.home}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Total</p>
                      <div className="flex gap-2">
                        <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs text-gray-600">Over</p>
                          <p className="font-bold text-gray-900">{game.total.line}</p>
                        </div>
                        <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs text-gray-600">Under</p>
                          <p className="font-bold text-gray-900">{game.total.line}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">Sharp Action:</p>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">
                        {game.sharpAction}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Markets;
