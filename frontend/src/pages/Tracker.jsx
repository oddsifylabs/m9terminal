import React, { useState } from 'react';
import Header from '../components/Header';

const Tracker = ({ setActiveMenu }) => {
  const [activeTab, setActiveTab] = useState('betlog');

  // Sample bet log data
  const betLogData = [
    {
      id: 1,
      date: '2026-06-01',
      game: 'NYY vs BOS',
      betType: 'Moneyline',
      selection: 'NYY',
      odds: '-110',
      amount: 500,
      result: 'Win',
      profit: 455,
    },
    {
      id: 2,
      date: '2026-06-01',
      game: 'LAD vs SF',
      betType: 'Over',
      selection: 'Total 8.5',
      odds: '-110',
      amount: 300,
      result: 'Loss',
      profit: -300,
    },
    {
      id: 3,
      date: '2026-05-31',
      game: 'HOU vs LAA',
      betType: 'Spread',
      selection: 'HOU -1.5',
      odds: '-110',
      amount: 400,
      result: 'Win',
      profit: 364,
    },
  ];

  // Sample CLV data
  const clvData = [
    {
      id: 1,
      date: '2026-06-01',
      game: 'NYY vs BOS',
      bookmakerLine: '-110',
      closeingLine: '-120',
      clv: '+2.4%',
      result: 'Win',
    },
    {
      id: 2,
      date: '2026-06-01',
      game: 'LAD vs SF',
      bookmakerLine: '-110',
      closeingLine: '-105',
      clv: '-1.8%',
      result: 'Loss',
    },
    {
      id: 3,
      date: '2026-05-31',
      game: 'HOU vs LAA',
      bookmakerLine: '-110',
      closeingLine: '-125',
      clv: '+3.1%',
      result: 'Win',
    },
  ];

  // Sample bankroll data
  const bankrollMetrics = {
    totalBankroll: 50000,
    availableBalance: 42350,
    activeRisked: 7650,
    roi: 12.4,
    totalSessions: 156,
    activeSessions: 2,
    winRate: 60.0,
  };

  const recentSessions = [
    {
      id: 1,
      date: '2026-06-01',
      startTime: '7:00 PM ET',
      allocation: 2500,
      bets: 12,
      wins: 8,
      losses: 4,
      profit: 420,
      roi: 16.8,
      status: 'active',
    },
    {
      id: 2,
      date: '2026-06-01',
      startTime: '8:30 PM ET',
      allocation: 1800,
      bets: 8,
      wins: 5,
      losses: 3,
      profit: 145,
      roi: 8.1,
      status: 'active',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <Header setAppMenu={setActiveMenu} title="Tracker" icon="📈" />

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['betlog', 'clv', 'bankroll'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'betlog' ? 'Bet Log' : tab === 'clv' ? 'CLV' : 'Bankroll'}
            </button>
          ))}
        </div>
      </div>

      {/* MLB Only Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <p className="text-sm text-blue-800">
          <strong>⚾ MLB Model Only:</strong> All tracking data is for MLB trades only.
        </p>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-4xl mx-auto">

        {/* BET LOG TAB */}
        {activeTab === 'betlog' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Bet Log</h2>
              <p className="text-sm text-gray-600 mt-1">All MLB bets placed and their outcomes</p>
            </div>

            {betLogData.map((bet) => (
              <div key={bet.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{bet.game}</p>
                    <p className="text-sm text-gray-600">{bet.betType} · {bet.selection}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${bet.result === 'Win' ? 'text-green-600' : 'text-red-600'}`}>
                      {bet.result === 'Win' ? '+' : '-'}${Math.abs(bet.profit)}
                    </p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      bet.result === 'Win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {bet.result}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>{bet.date}</p>
                  <p>{bet.odds} · ${bet.amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLV TAB */}
        {activeTab === 'clv' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Closing Line Value (CLV)</h2>
              <p className="text-sm text-gray-600 mt-1">How well you beat the closing line on each bet</p>
            </div>

            {clvData.map((clv) => (
              <div key={clv.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{clv.game}</p>
                    <p className="text-sm text-gray-600">{clv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${clv.clv.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {clv.clv}
                    </p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      clv.result === 'Win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {clv.result}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Your Line</p>
                    <p className="font-bold text-gray-900">{clv.bookmakerLine}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Closing Line</p>
                    <p className="font-bold text-gray-900">{clv.closeingLine}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Movement</p>
                    <p className={clv.clv.startsWith('+') ? 'font-bold text-green-600' : 'font-bold text-red-600'}>
                      {clv.clv}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BANKROLL TAB */}
        {activeTab === 'bankroll' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Total Bankroll</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${bankrollMetrics.totalBankroll.toLocaleString()}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Available Balance</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${bankrollMetrics.availableBalance.toLocaleString()}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Active Risk</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  ${bankrollMetrics.activeRisked.toLocaleString()}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">ROI</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {bankrollMetrics.roi}%
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Total Sessions</p>
                <p className="text-4xl font-bold text-green-700 mt-2">{bankrollMetrics.totalSessions}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Active Sessions</p>
                <p className="text-4xl font-bold text-blue-700 mt-2">{bankrollMetrics.activeSessions}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Win Rate</p>
                <p className="text-4xl font-bold text-purple-700 mt-2">{bankrollMetrics.winRate}%</p>
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg text-gray-900">Session #{session.id}</p>
                        <p className="text-sm text-gray-600">{session.date} · {session.startTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">${session.profit}</p>
                        <p className="text-sm text-green-600 font-medium">{session.roi}% ROI</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Allocation</p>
                        <p className="font-bold text-gray-900 mt-1">${session.allocation.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bets</p>
                        <p className="font-bold text-gray-900 mt-1">{session.bets}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Record</p>
                        <p className="font-bold text-gray-900 mt-1">{session.wins}-{session.losses}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 mt-1 inline-block">
                          {session.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;
