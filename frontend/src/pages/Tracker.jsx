import React, { useState } from 'react';
import Header from '../components/Header';

const Tracker = ({ setActiveMenu }) => {
  const [activeTab, setActiveTab] = useState('betlog');

  // Comprehensive bet log data - COMPLETE BET HISTORY
  const betLogData = [
    // Recent Session
    {
      id: 25,
      date: '2026-06-01',
      time: '10:15 PM',
      game: 'SD vs COL',
      betType: 'Spread',
      selection: 'SD -2.5',
      odds: '-110',
      amount: 600,
      result: 'Win',
      profit: 545,
      session: 'S_001',
      confidence: 85,
    },
    {
      id: 24,
      date: '2026-06-01',
      time: '9:45 PM',
      game: 'SEA vs OAK',
      betType: 'Total',
      selection: 'Over 8.5',
      odds: '-110',
      amount: 400,
      result: 'Win',
      profit: 364,
      session: 'S_001',
      confidence: 78,
    },
    {
      id: 23,
      date: '2026-06-01',
      time: '9:20 PM',
      game: 'TB vs NYY',
      betType: 'Moneyline',
      selection: 'TB',
      odds: '+105',
      amount: 500,
      result: 'Loss',
      profit: -500,
      session: 'S_001',
      confidence: 72,
    },
    {
      id: 22,
      date: '2026-06-01',
      time: '8:50 PM',
      game: 'MIA vs ATL',
      betType: 'Spread',
      selection: 'ATL -1.5',
      odds: '-110',
      amount: 400,
      result: 'Win',
      profit: 364,
      session: 'S_001',
      confidence: 88,
    },
    {
      id: 21,
      date: '2026-06-01',
      time: '8:10 PM',
      game: 'NYY vs BOS',
      betType: 'Moneyline',
      selection: 'NYY',
      odds: '-110',
      amount: 500,
      result: 'Win',
      profit: 455,
      session: 'S_001',
      confidence: 90,
    },
    // Earlier Session
    {
      id: 20,
      date: '2026-06-01',
      time: '7:40 PM',
      game: 'LAD vs SF',
      betType: 'Over',
      selection: 'Total 8.5',
      odds: '-110',
      amount: 300,
      result: 'Loss',
      profit: -300,
      session: 'S_002',
      confidence: 75,
    },
    {
      id: 19,
      date: '2026-06-01',
      time: '7:15 PM',
      game: 'HOU vs LAA',
      betType: 'Spread',
      selection: 'HOU -1.5',
      odds: '-110',
      amount: 400,
      result: 'Win',
      profit: 364,
      session: 'S_002',
      confidence: 82,
    },
    {
      id: 18,
      date: '2026-05-31',
      time: '10:30 PM',
      game: 'PHI vs WSH',
      betType: 'Moneyline',
      selection: 'PHI',
      odds: '-120',
      amount: 600,
      result: 'Win',
      profit: 500,
      session: 'S_010',
      confidence: 87,
    },
    {
      id: 17,
      date: '2026-05-31',
      time: '10:00 PM',
      game: 'STL vs MIL',
      betType: 'Spread',
      selection: 'STL +1.5',
      odds: '-110',
      amount: 350,
      result: 'Loss',
      profit: -350,
      session: 'S_010',
      confidence: 68,
    },
    {
      id: 16,
      date: '2026-05-31',
      time: '9:30 PM',
      game: 'CIN vs PIT',
      betType: 'Total',
      selection: 'Under 8.0',
      odds: '-110',
      amount: 450,
      result: 'Win',
      profit: 409,
      session: 'S_010',
      confidence: 81,
    },
    {
      id: 15,
      date: '2026-05-31',
      time: '9:00 PM',
      game: 'ARI vs SLC',
      betType: 'Spread',
      selection: 'ARI -3.0',
      odds: '-110',
      amount: 500,
      result: 'Win',
      profit: 455,
      session: 'S_010',
      confidence: 85,
    },
    {
      id: 14,
      date: '2026-05-30',
      time: '10:15 PM',
      game: 'KC vs MIN',
      betType: 'Moneyline',
      selection: 'KC',
      odds: '+110',
      amount: 400,
      result: 'Loss',
      profit: -400,
      session: 'S_009',
      confidence: 70,
    },
    {
      id: 13,
      date: '2026-05-30',
      time: '9:45 PM',
      game: 'DET vs CWS',
      betType: 'Spread',
      selection: 'DET -0.5',
      odds: '-110',
      amount: 350,
      result: 'Win',
      profit: 318,
      session: 'S_009',
      confidence: 79,
    },
    {
      id: 12,
      date: '2026-05-30',
      time: '9:15 PM',
      game: 'TOR vs BAL',
      betType: 'Total',
      selection: 'Over 9.0',
      odds: '-110',
      amount: 500,
      result: 'Win',
      profit: 455,
      session: 'S_009',
      confidence: 84,
    },
    {
      id: 11,
      date: '2026-05-30',
      time: '8:45 PM',
      game: 'BOS vs TB',
      betType: 'Moneyline',
      selection: 'TB',
      odds: '-105',
      amount: 600,
      result: 'Win',
      profit: 571,
      session: 'S_009',
      confidence: 88,
    },
    {
      id: 10,
      date: '2026-05-29',
      time: '10:00 PM',
      game: 'LAA vs SEA',
      betType: 'Spread',
      selection: 'LAA +1.5',
      odds: '-110',
      amount: 400,
      result: 'Loss',
      profit: -400,
      session: 'S_008',
      confidence: 72,
    },
    {
      id: 9,
      date: '2026-05-29',
      time: '9:30 PM',
      game: 'OAK vs HOU',
      betType: 'Total',
      selection: 'Under 8.0',
      odds: '-110',
      amount: 450,
      result: 'Win',
      profit: 409,
      session: 'S_008',
      confidence: 80,
    },
    {
      id: 8,
      date: '2026-05-29',
      time: '8:50 PM',
      game: 'NYY vs BAL',
      betType: 'Moneyline',
      selection: 'NYY',
      odds: '-115',
      amount: 575,
      result: 'Win',
      profit: 500,
      session: 'S_008',
      confidence: 91,
    },
    {
      id: 7,
      date: '2026-05-28',
      time: '10:30 PM',
      game: 'LAD vs SD',
      betType: 'Spread',
      selection: 'LAD -2.5',
      odds: '-110',
      amount: 600,
      result: 'Win',
      profit: 545,
      session: 'S_007',
      confidence: 86,
    },
    {
      id: 6,
      date: '2026-05-28',
      time: '10:00 PM',
      game: 'SF vs COL',
      betType: 'Total',
      selection: 'Over 9.0',
      odds: '-110',
      amount: 500,
      result: 'Loss',
      profit: -500,
      session: 'S_007',
      confidence: 73,
    },
    {
      id: 5,
      date: '2026-05-28',
      time: '9:30 PM',
      game: 'PHI vs ATL',
      betType: 'Moneyline',
      selection: 'PHI',
      odds: '-125',
      amount: 625,
      result: 'Win',
      profit: 500,
      session: 'S_007',
      confidence: 89,
    },
    {
      id: 4,
      date: '2026-05-27',
      time: '10:15 PM',
      game: 'STL vs MIL',
      betType: 'Spread',
      selection: 'MIL -1.5',
      odds: '-110',
      amount: 450,
      result: 'Win',
      profit: 409,
      session: 'S_006',
      confidence: 83,
    },
    {
      id: 3,
      date: '2026-05-27',
      time: '9:45 PM',
      game: 'CIN vs PIT',
      betType: 'Total',
      selection: 'Under 7.5',
      odds: '-110',
      amount: 400,
      result: 'Win',
      profit: 364,
      session: 'S_006',
      confidence: 81,
    },
    {
      id: 2,
      date: '2026-05-26',
      time: '10:00 PM',
      game: 'KC vs TB',
      betType: 'Moneyline',
      selection: 'KB',
      odds: '+105',
      amount: 300,
      result: 'Loss',
      profit: -300,
      session: 'S_005',
      confidence: 65,
    },
    {
      id: 1,
      date: '2026-05-26',
      time: '9:00 PM',
      game: 'NYY vs BOS',
      betType: 'Spread',
      selection: 'NYY -1.0',
      odds: '-110',
      amount: 500,
      result: 'Win',
      profit: 455,
      session: 'S_005',
      confidence: 92,
    },
  ];

  // Calculate totals
  const totalBets = betLogData.length;
  const totalWins = betLogData.filter(b => b.result === 'Win').length;
  const totalLosses = betLogData.filter(b => b.result === 'Loss').length;
  const totalStaked = betLogData.reduce((sum, b) => sum + b.amount, 0);
  const totalProfit = betLogData.reduce((sum, b) => sum + b.profit, 0);
  const winRate = ((totalWins / totalBets) * 100).toFixed(1);

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
          {['betlog', 'clv', 'bankroll', 'credits'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'betlog' ? 'Bet Log' : tab === 'clv' ? 'CLV' : tab === 'bankroll' ? 'Bankroll' : 'Credits'}
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
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Bet Log</h2>
              <p className="text-sm text-gray-600 mt-1">Complete MLB bet history</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium">Total Bets</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{totalBets}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium">Wins</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{totalWins}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium">Losses</p>
                <p className="text-2xl font-bold text-red-700 mt-1">{totalLosses}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium">Win Rate</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{winRate}%</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium">Total P/L</p>
                <p className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalProfit >= 0 ? '+' : ''}{totalProfit}
                </p>
              </div>
            </div>

            {/* Bet List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {betLogData.map((bet) => (
                <div key={bet.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{bet.game}</p>
                      <p className="text-xs text-gray-600">{bet.date} {bet.time}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className={`font-bold text-sm ${bet.result === 'Win' ? 'text-green-600' : 'text-red-600'}`}>
                        {bet.result === 'Win' ? '+' : '-'}${Math.abs(bet.profit)}
                      </p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded inline-block ${
                        bet.result === 'Win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {bet.result}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 flex justify-between">
                    <span>{bet.betType} • {bet.selection}</span>
                    <span>${bet.amount} @ {bet.odds}</span>
                  </div>
                </div>
              ))}
            </div>
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

        {/* CREDITS TAB */}
        {activeTab === 'credits' && (
          <div className="space-y-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Credits</h2>
              <p className="text-sm text-gray-600 mt-2">M9 Terminal is built by dedicated sports betting professionals</p>
            </div>

            {/* Core Team */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Core Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">👔</div>
                    <div>
                      <p className="font-bold text-gray-900">Jesse J. Collins</p>
                      <p className="text-sm text-gray-600">CTO & Operations</p>
                      <p className="text-xs text-gray-500 mt-2">Vision & Strategy</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">💼</div>
                    <div>
                      <p className="font-bold text-gray-900">Parris Collins</p>
                      <p className="text-sm text-gray-600">CEO & CFO</p>
                      <p className="text-xs text-gray-500 mt-2">Business & Finance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership Team */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🌐</div>
                    <div>
                      <p className="font-bold text-gray-900">Miah</p>
                      <p className="text-xs text-gray-600">Webmaster</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">💻</div>
                    <div>
                      <p className="font-bold text-gray-900">Ruth</p>
                      <p className="text-xs text-gray-600">Software Developer & Programmer</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">📢</div>
                    <div>
                      <p className="font-bold text-gray-900">Markus</p>
                      <p className="text-xs text-gray-600">Social Media</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">✍️</div>
                    <div>
                      <p className="font-bold text-gray-900">Octavia</p>
                      <p className="text-xs text-gray-600">Writer & Admin</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🤝</div>
                    <div>
                      <p className="font-bold text-gray-900">Mitch</p>
                      <p className="text-xs text-gray-600">Sales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Organization</h3>
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
                <p className="font-bold text-gray-900">OddifyLabs</p>
                <p className="text-sm text-gray-600 mt-1">Queen Creek, Arizona</p>
                <p className="text-sm text-gray-600">Parent: Collins & Collins Technologies</p>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Website:</strong> www.oddsifylabs.com
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Technologies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-3">Frontend</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>⚛️ React</li>
                    <li>🎨 Tailwind CSS</li>
                    <li>📱 Modern Minimalist Design</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-3">Backend</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🟢 Node.js & Express</li>
                    <li>🐘 PostgreSQL</li>
                    <li>⚡ Async/Non-blocking</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-3">APIs</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>📊 The Odds API</li>
                    <li>⚾ SportsData.io</li>
                    <li>🔄 Real-time Updates</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-3">Deployment</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🚀 Railway.app</li>
                    <li>🔧 Auto-rebuild on Push</li>
                    <li>🌍 Production Ready</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Version */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600">M9 Terminal</p>
              <p className="font-bold text-gray-900 text-lg mt-1">Version 1.0</p>
              <p className="text-xs text-gray-500 mt-2">June 1, 2026</p>
              <p className="text-xs text-gray-500 mt-4">MLB Model Active • Built with ❤️ for serious bettors</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;
