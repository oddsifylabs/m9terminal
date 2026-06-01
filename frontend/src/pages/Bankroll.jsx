import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Bankroll = ({ setActiveMenu }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Bankroll Data
  const bankrollData = {
    totalBankroll: 50000,
    availableBalance: 42350,
    activeRisked: 7650,
    currency: 'USD',
    startDate: '2026-01-01',
    sessions: 156,
    roi: 12.4,
    avgROI: 0.79,
  };

  const riskAllocation = {
    totalRisk: 7650,
    bySession: [
      { sessionId: 'S_001', date: '2024-06-01', allocation: 2500, percentOfBank: 5.0, status: 'active', sport: 'MLB' },
      { sessionId: 'S_002', date: '2024-06-01', allocation: 1800, percentOfBank: 3.6, status: 'active', sport: 'NBA' },
      { sessionId: 'S_003', date: '2024-05-31', allocation: 1200, percentOfBank: 2.4, status: 'active', sport: 'NFL' },
      { sessionId: 'S_004', date: '2024-05-30', allocation: 900, percentOfBank: 1.8, status: 'paused', sport: 'NHL' },
      { sessionId: 'S_005', date: '2024-05-30', allocation: 250, percentOfBank: 0.5, status: 'closed', sport: 'Soccer' },
    ],
    limits: {
      perBet: { min: 50, max: 5000, recommended: 500 },
      perSession: { min: 500, max: 10000, recommended: 2500 },
      dailyMax: 15000,
      weeklyMax: 75000,
    },
  };

  const performanceBySport = [
    { sport: 'MLB', bets: 45, wins: 27, losses: 18, roi: 18.5, units: 8.3, winRate: 60.0, clv: 2.4 },
    { sport: 'NBA', bets: 38, wins: 22, losses: 16, roi: 12.3, units: 4.7, winRate: 57.9, clv: 1.8 },
    { sport: 'NFL', bets: 32, wins: 18, losses: 14, roi: 8.9, units: 2.9, winRate: 56.3, clv: 1.2 },
    { sport: 'NHL', bets: 28, wins: 16, losses: 12, roi: 6.4, units: 1.8, winRate: 57.1, clv: 0.9 },
    { sport: 'Soccer', bets: 13, wins: 7, losses: 6, roi: 2.1, units: 0.5, winRate: 53.8, clv: 0.3 },
  ];

  const activeSessions = [
    {
      id: 'S_001',
      date: '2026-06-01',
      sport: 'MLB',
      allocation: 2500,
      bets: 12,
      wins: 8,
      losses: 4,
      profit: 420,
      roi: 16.8,
      status: 'active',
      startTime: '7:00 PM ET',
      notes: 'Strong signals from sharp money',
      confidence: 85,
    },
    {
      id: 'S_002',
      date: '2026-06-01',
      sport: 'NBA',
      allocation: 1800,
      bets: 8,
      wins: 5,
      losses: 3,
      profit: 145,
      roi: 8.1,
      status: 'active',
      startTime: '8:30 PM ET',
      notes: 'Tracking RLM patterns',
      confidence: 72,
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border-green-300',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return badges[status] || badges.closed;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <Header setAppMenu={setActiveMenu} title="Bankroll" icon="💰" />

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['overview', 'allocation', 'performance', 'sessions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-6xl mx-auto">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Total Bankroll</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${bankrollData.totalBankroll.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Since {bankrollData.startDate}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Available Balance</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${bankrollData.availableBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Ready to deploy</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Active Risk</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  ${bankrollData.activeRisked.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">{(bankrollData.activeRisked / bankrollData.totalBankroll * 100).toFixed(1)}% of bank</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Overall ROI</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {bankrollData.roi}%
                </p>
                <p className="text-xs text-gray-500 mt-2">Avg: {bankrollData.avgROI}% per session</p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Total Sessions</p>
                <p className="text-4xl font-bold text-green-700 mt-2">{bankrollData.sessions}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Active Sessions</p>
                <p className="text-4xl font-bold text-blue-700 mt-2">{activeSessions.filter(s => s.status === 'active').length}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 font-medium">Win Rate</p>
                <p className="text-4xl font-bold text-purple-700 mt-2">57.8%</p>
              </div>
            </div>
          </div>
        )}

        {/* ALLOCATION TAB */}
        {activeTab === 'allocation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Allocation by Sport</h3>
              <div className="space-y-3">
                {riskAllocation.bySession.map((session) => (
                  <div key={session.sessionId} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{session.sport}</p>
                        <p className="text-sm text-gray-600">{session.sessionId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${session.percentOfBank * 15}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-700 font-bold">${session.allocation.toLocaleString()}</p>
                      <p className="text-gray-600">{session.percentOfBank.toFixed(1)}% of bankroll</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limits */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Betting Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Per Bet</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ${riskAllocation.limits.perBet.min} - ${riskAllocation.limits.perBet.max}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Recommended: ${riskAllocation.limits.perBet.recommended}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Per Session</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ${riskAllocation.limits.perSession.min} - ${riskAllocation.limits.perSession.max}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Recommended: ${riskAllocation.limits.perSession.recommended}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Daily Maximum</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ${riskAllocation.limits.dailyMax.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Weekly Maximum</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ${riskAllocation.limits.weeklyMax.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Performance by Sport</h3>
            <div className="space-y-4">
              {performanceBySport.map((sport) => (
                <div key={sport.sport} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-gray-900">{sport.sport}</p>
                      <p className="text-sm text-gray-600">{sport.bets} total bets</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{sport.roi}% ROI</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Win Rate</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{sport.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Wins/Loss</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{sport.wins}/{sport.losses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Units Won</p>
                      <p className="text-xl font-bold text-green-600 mt-1">+{sport.units}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
                    <p className="text-gray-600">Closing Line Value (CLV): <span className="font-bold text-gray-900">{sport.clv}%</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Active Sessions</h3>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-gray-900">{session.sport} Session</p>
                      <p className="text-sm text-gray-600">{session.id} · {session.startTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${session.profit}</p>
                      <p className="text-sm text-green-600 font-medium">{session.roi}% ROI</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <p className="text-gray-600">Confidence</p>
                      <p className="font-bold text-gray-900">{session.confidence}%</p>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${session.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">Allocation</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">${session.allocation.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Record</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{session.wins}-{session.losses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Bets</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{session.bets}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    📌 {session.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bankroll;
