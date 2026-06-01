import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Bankroll = ({ setActiveMenu }) => {
  // State Management
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'history'
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showAddSession, setShowAddSession] = useState(false);
  const [expandedSession, setExpandedSession] = useState(null);
  const [allocationMode, setAllocationMode] = useState('kelly'); // 'kelly', 'flat', 'custom'

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Bankroll Data Structure
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

  // Detailed Risk Allocation
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

  // Bankroll Growth History
  const growthHistory = [
    { date: '2026-01-01', balance: 44500, sessions: 0, roi: 0 },
    { date: '2026-02-15', balance: 46200, sessions: 28, roi: 3.8 },
    { date: '2026-03-01', balance: 48100, sessions: 52, roi: 8.1 },
    { date: '2026-04-15', balance: 49800, sessions: 98, roi: 11.9 },
    { date: '2026-05-20', balance: 50000, sessions: 134, roi: 12.4 },
    { date: '2026-06-01', balance: 50000, sessions: 156, roi: 12.4 },
  ];

  // Performance by Sport
  const performanceBySport = [
    { sport: 'MLB', bets: 45, wins: 27, losses: 18, roi: 18.5, units: 8.3, winRate: 60.0, clv: 2.4 },
    { sport: 'NBA', bets: 38, wins: 22, losses: 16, roi: 12.3, units: 4.7, winRate: 57.9, clv: 1.8 },
    { sport: 'NFL', bets: 32, wins: 18, losses: 14, roi: 8.9, units: 2.9, winRate: 56.3, clv: 1.2 },
    { sport: 'NHL', bets: 28, wins: 16, losses: 12, roi: 6.4, units: 1.8, winRate: 57.1, clv: 0.9 },
    { sport: 'Soccer', bets: 13, wins: 7, losses: 6, roi: 2.1, units: 0.5, winRate: 53.8, clv: 0.3 },
  ];

  // Session Details (Active & Recent)
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
      endTime: null,
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
      endTime: null,
      notes: 'Tracking RLM patterns',
      confidence: 72,
    },
    {
      id: 'S_003',
      date: '2026-05-31',
      sport: 'NFL',
      allocation: 1200,
      bets: 6,
      wins: 4,
      losses: 2,
      profit: 210,
      roi: 17.5,
      status: 'closed',
      startTime: '1:00 PM ET',
      endTime: '11:45 PM ET',
      notes: 'Excellent CLV, closed with profit',
      confidence: 88,
    },
  ];

  // Risk Metrics & Warnings
  const riskMetrics = {
    maxDrawdown: -8.5,
    currentDrawdown: -2.1,
    volatility: 3.2,
    sharpeRatio: 1.87,
    profitFactor: 2.15,
    winRate: 57.4,
    clv: 1.65,
    warnings: [
      { level: 'caution', message: 'Current session confidence slightly low (72%)', type: 'confidence' },
      { level: 'info', message: 'Daily risk limit 30% utilized ($4,500 / $15,000)', type: 'limit' },
    ],
  };

  // Session Allocation Rules
  const allocationRules = {
    kelly: {
      name: 'Kelly Criterion',
      description: 'Mathematically optimal allocation based on win rate and CLV',
      formula: '(Win Rate × CLV - Loss Rate) / CLV',
      current: '5.2%',
      recommended: '2.5% (Conservative)',
      pros: ['Optimal growth', 'Mathematically proven'],
      cons: ['Can be aggressive', 'Requires accurate metrics'],
    },
    flat: {
      name: 'Flat Betting',
      description: 'Fixed % of bankroll per session',
      formula: 'Fixed 3% per session',
      current: '3.0%',
      recommended: '2-3%',
      pros: ['Simple', 'Predictable', 'Easy to track'],
      cons: ['Not adaptive', 'Less efficient'],
    },
    custom: {
      name: 'Custom Allocation',
      description: 'Manually define per-sport or per-session allocation',
      formula: 'Manual assignment',
      current: 'Varies',
      recommended: 'Depends on confidence',
      pros: ['Full control', 'Flexible'],
      cons: ['Requires discipline', 'Emotional decisions'],
    },
  };

  // Formatting Helpers
  const formatCurrency = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const formatPercent = (value) => `${(value).toFixed(1)}%`;
  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#00D27A'; // Signal Green
      case 'closed': return '#2B7FFF'; // Data Blue
      case 'paused': return '#F59E0B'; // Amber
      default: return '#94A3B8'; // Slate
    }
  };

  const getROIColor = (roi) => {
    if (roi > 15) return '#10B981'; // Emerald
    if (roi > 5) return '#00D27A'; // Green
    if (roi > 0) return '#2B7FFF'; // Blue
    if (roi > -5) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F1115] text-white overflow-hidden">
      <Header activeMenu="bankroll" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#131A24] to-[#0F1115] border-b border-white/10 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Bankroll Management</h1>
            <p className="text-slate-400">Track, allocate, and optimize your betting capital</p>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="bg-[#0F1115] border-b border-white/5 p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Bankroll */}
            <div className="bg-[#131A24] border border-white/10 rounded-lg p-4 hover:border-[#00D27A]/50 transition-all">
              <div className="text-slate-400 text-sm font-medium mb-2">Total Bankroll</div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(bankrollData.totalBankroll)}</div>
              <div className="text-xs text-slate-500">Started Jan 1, 2026</div>
            </div>

            {/* Available Balance */}
            <div className="bg-[#131A24] border border-white/10 rounded-lg p-4 hover:border-[#2B7FFF]/50 transition-all">
              <div className="text-slate-400 text-sm font-medium mb-2">Available Balance</div>
              <div className="text-3xl font-bold mb-2 text-[#00D27A]">{formatCurrency(bankrollData.availableBalance)}</div>
              <div className="text-xs text-slate-500">{formatPercent((bankrollData.availableBalance / bankrollData.totalBankroll) * 100)} of total</div>
            </div>

            {/* At Risk */}
            <div className="bg-[#131A24] border border-white/10 rounded-lg p-4 hover:border-[#F59E0B]/50 transition-all">
              <div className="text-slate-400 text-sm font-medium mb-2">Currently at Risk</div>
              <div className="text-3xl font-bold mb-2 text-[#F59E0B]">{formatCurrency(bankrollData.activeRisked)}</div>
              <div className="text-xs text-slate-500">{formatPercent((bankrollData.activeRisked / bankrollData.totalBankroll) * 100)} of total</div>
            </div>

            {/* Lifetime ROI */}
            <div className="bg-[#131A24] border border-white/10 rounded-lg p-4 hover:border-[#10B981]/50 transition-all">
              <div className="text-slate-400 text-sm font-medium mb-2">Lifetime ROI</div>
              <div className="text-3xl font-bold mb-2" style={{ color: getROIColor(bankrollData.roi) }}>
                {bankrollData.roi > 0 ? '+' : ''}{formatPercent(bankrollData.roi)}
              </div>
              <div className="text-xs text-slate-500">Over {bankrollData.sessions} sessions</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0F1115] border-b border-white/5 px-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex gap-1">
            {['overview', 'allocation', 'history', 'performance', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-[#00D27A] text-[#00D27A]'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Active Sessions */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">Active Sessions</h2>
                        <p className="text-sm text-slate-400 mt-1">{activeSessions.filter(s => s.status === 'active').length} sessions currently running</p>
                      </div>
                      <button
                        onClick={() => setShowAddSession(!showAddSession)}
                        className="bg-[#00D27A] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D27A]/90 transition-all text-sm"
                      >
                        + New Session
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 hover:bg-white/5 transition-all cursor-pointer border-l-4"
                        style={{ borderColor: getStatusColor(session.status) }}
                        onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                      >
                        {/* Session Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-mono font-bold">{session.sport}</div>
                            <div className="flex-1">
                              <div className="font-medium">{session.sport} Session {session.id}</div>
                              <div className="text-sm text-slate-400">{formatDateTime(session.date + ' ' + session.startTime)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold" style={{ color: getStatusColor(session.status) }}>
                              {session.status === 'active' ? '🟢' : '🔵'} {session.status.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {/* Session Stats Row */}
                        <div className="grid grid-cols-5 gap-4 mt-3 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs">Allocation</div>
                            <div className="font-bold">{formatCurrency(session.allocation)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Bets (W/L)</div>
                            <div className="font-bold">{session.bets} ({session.wins}/{session.losses})</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Profit</div>
                            <div className="font-bold" style={{ color: session.profit >= 0 ? '#00D27A' : '#EF4444' }}>
                              {session.profit >= 0 ? '+' : ''}{formatCurrency(session.profit)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">ROI</div>
                            <div className="font-bold" style={{ color: getROIColor(session.roi) }}>
                              {session.roi > 0 ? '+' : ''}{formatPercent(session.roi)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Confidence</div>
                            <div className="font-bold text-[#2B7FFF]">{session.confidence}%</div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedSession === session.id && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-slate-500 text-xs mb-1">Win Rate</div>
                                <div className="font-bold">{((session.wins / session.bets) * 100).toFixed(1)}%</div>
                              </div>
                              <div>
                                <div className="text-slate-500 text-xs mb-1">Avg Bet</div>
                                <div className="font-bold">{formatCurrency(session.allocation / session.bets)}</div>
                              </div>
                              <div>
                                <div className="text-slate-500 text-xs mb-1">Session Duration</div>
                                <div className="font-bold">{session.endTime ? 'Closed' : 'Ongoing'}</div>
                              </div>
                            </div>
                            <div className="text-sm text-slate-300 bg-[#1a2332] px-3 py-2 rounded border border-white/5">
                              <strong>Notes:</strong> {session.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Closed Sessions */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Recent Closed Sessions</h2>
                    <p className="text-sm text-slate-400 mt-1">Last 5 completed sessions</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {activeSessions.filter(s => s.status === 'closed').map((session) => (
                      <div key={session.id} className="p-4 hover:bg-white/5 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{session.sport} Session {session.id}</div>
                            <div className="text-sm text-slate-400">{formatDateTime(session.date)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#2B7FFF]">{formatCurrency(session.profit)}</div>
                            <div className="text-sm text-slate-400">{((session.wins / session.bets) * 100).toFixed(1)}% WR</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ALLOCATION TAB */}
            {activeTab === 'allocation' && (
              <div className="space-y-6">
                {/* Allocation Strategy */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Allocation Strategy</h2>
                    <p className="text-sm text-slate-400 mt-1">Choose your bankroll allocation method</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {['kelly', 'flat', 'custom'].map((mode) => (
                      <div
                        key={mode}
                        onClick={() => setAllocationMode(mode)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          allocationMode === mode
                            ? 'border-[#00D27A] bg-[#00D27A]/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {allocationMode === mode ? (
                              <div className="w-4 h-4 bg-[#00D27A] rounded-full"></div>
                            ) : (
                              <div className="w-4 h-4 border-2 border-white/30 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{allocationRules[mode].name}</h3>
                            <p className="text-sm text-slate-400 mt-1">{allocationRules[mode].description}</p>
                            <div className="mt-3 text-sm font-mono bg-[#1a2332] px-3 py-2 rounded border border-white/5">
                              {allocationRules[mode].formula}
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-slate-500 text-xs">Current</div>
                                <div className="font-bold">{allocationRules[mode].current}</div>
                              </div>
                              <div>
                                <div className="text-slate-500 text-xs">Recommended</div>
                                <div className="font-bold text-[#00D27A]">{allocationRules[mode].recommended}</div>
                              </div>
                              <div>
                                <div className="text-slate-500 text-xs">Type</div>
                                <div className="font-bold">{allocationRules[mode].pros[0]}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Limits */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Risk Limits</h2>
                    <p className="text-sm text-slate-400 mt-1">Maximum exposure per bet and session</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-3">Min Bet</div>
                        <div className="text-2xl font-bold mb-1">{formatCurrency(riskAllocation.limits.perBet.min)}</div>
                        <div className="text-xs text-slate-500">Minimum per wager</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-3">Max Bet</div>
                        <div className="text-2xl font-bold mb-1">{formatCurrency(riskAllocation.limits.perBet.max)}</div>
                        <div className="text-xs text-slate-500">Maximum per wager</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-3">Recommended</div>
                        <div className="text-2xl font-bold mb-1 text-[#00D27A]">{formatCurrency(riskAllocation.limits.perBet.recommended)}</div>
                        <div className="text-xs text-slate-500">Optimal per wager</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-3">Per Session</div>
                        <div className="text-2xl font-bold mb-1">{formatCurrency(riskAllocation.limits.perSession.recommended)}</div>
                        <div className="text-xs text-slate-500">Recommended allocation</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-3">Daily Max</div>
                        <div className="text-2xl font-bold mb-1 text-[#F59E0B]">{formatCurrency(riskAllocation.limits.dailyMax)}</div>
                        <div className="text-xs text-slate-500">Maximum daily risk</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-3">Weekly Max</div>
                        <div className="text-2xl font-bold mb-1 text-[#EF4444]">{formatCurrency(riskAllocation.limits.weeklyMax)}</div>
                        <div className="text-xs text-slate-500">Maximum weekly risk</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Allocations */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Current Allocations</h2>
                    <p className="text-sm text-slate-400 mt-1">Risk distributed across active sessions</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Session</th>
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Sport</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Allocation</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">% of Bank</th>
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Status</th>
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {riskAllocation.bySession.map((session) => (
                          <tr key={session.sessionId} className="hover:bg-white/5 transition-all">
                            <td className="px-6 py-3 font-medium">{session.sessionId}</td>
                            <td className="px-6 py-3">{session.sport}</td>
                            <td className="px-6 py-3 text-right font-bold">{formatCurrency(session.allocation)}</td>
                            <td className="px-6 py-3 text-right">{formatPercent(session.percentOfBank)}</td>
                            <td className="px-6 py-3">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{
                                  backgroundColor: getStatusColor(session.status) + '20',
                                  color: getStatusColor(session.status),
                                }}
                              >
                                {session.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#00D27A] to-[#2B7FFF]"
                                  style={{ width: `${session.percentOfBank}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Bankroll Growth Chart</h2>
                    <p className="text-sm text-slate-400 mt-1">Cumulative balance over time</p>
                  </div>

                  <div className="p-6">
                    {/* Simple ASCII-style chart */}
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4 font-mono text-xs">
                      <div className="text-right mb-2 text-slate-500">
                        <span>$52K</span>
                      </div>
                      <svg viewBox="0 0 600 200" className="w-full" style={{ minHeight: '200px' }}>
                        {/* Grid lines */}
                        <line x1="50" y1="0" x2="50" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                        {/* Data line */}
                        <polyline
                          points="50,100 150,80 250,60 350,50 450,50 550,50"
                          fill="none"
                          stroke="#00D27A"
                          strokeWidth="2"
                        />

                        {/* Data points */}
                        <circle cx="50" cy="100" r="4" fill="#00D27A" />
                        <circle cx="150" cy="80" r="4" fill="#00D27A" />
                        <circle cx="250" cy="60" r="4" fill="#00D27A" />
                        <circle cx="350" cy="50" r="4" fill="#00D27A" />
                        <circle cx="450" cy="50" r="4" fill="#00D27A" />
                        <circle cx="550" cy="50" r="4" fill="#00D27A" />

                        {/* Axis labels */}
                        <text x="50" y="180" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="middle">Jan</text>
                        <text x="550" y="180" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="middle">Jun</text>
                      </svg>
                      <div className="text-right mt-2 text-slate-500">
                        <span>$44K</span>
                      </div>
                    </div>

                    {/* Growth Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-2">Starting Balance</div>
                        <div className="text-xl font-bold">$44,500</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-2">Current Balance</div>
                        <div className="text-xl font-bold text-[#00D27A]">$50,000</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-2">Total Profit</div>
                        <div className="text-xl font-bold text-[#00D27A]">+$5,500</div>
                      </div>
                      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                        <div className="text-slate-500 text-xs font-medium mb-2">Profit Factor</div>
                        <div className="text-xl font-bold">2.15x</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historical Data Table */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Monthly Summary</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Date</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Balance</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Change</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Sessions</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">ROI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {growthHistory.map((entry, idx) => {
                          const prevBalance = idx > 0 ? growthHistory[idx - 1].balance : entry.balance;
                          const change = entry.balance - prevBalance;
                          return (
                            <tr key={entry.date} className="hover:bg-white/5 transition-all">
                              <td className="px-6 py-3 font-medium">{entry.date}</td>
                              <td className="px-6 py-3 text-right font-bold">{formatCurrency(entry.balance)}</td>
                              <td className="px-6 py-3 text-right">
                                <span style={{ color: change >= 0 ? '#00D27A' : '#EF4444' }}>
                                  {change >= 0 ? '+' : ''}{formatCurrency(change)}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-right">{entry.sessions}</td>
                              <td className="px-6 py-3 text-right" style={{ color: getROIColor(entry.roi) }}>
                                {entry.roi > 0 ? '+' : ''}{formatPercent(entry.roi)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Performance by Sport</h2>
                    <p className="text-sm text-slate-400 mt-1">Detailed statistics across all sports</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Sport</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Bets</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Win/Loss</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Win Rate</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">Units Won</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">ROI</th>
                          <th className="px-6 py-3 text-right text-slate-400 font-medium">CLV</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {performanceBySport.map((sport) => (
                          <tr key={sport.sport} className="hover:bg-white/5 transition-all">
                            <td className="px-6 py-3 font-bold text-lg">{sport.sport}</td>
                            <td className="px-6 py-3 text-right">{sport.bets}</td>
                            <td className="px-6 py-3 text-right">
                              <span className="text-[#00D27A]">{sport.wins}</span> / <span className="text-[#EF4444]">{sport.losses}</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold">{formatPercent(sport.winRate)}</td>
                            <td className="px-6 py-3 text-right font-bold text-[#00D27A]">+{sport.units.toFixed(1)}</td>
                            <td className="px-6 py-3 text-right font-bold" style={{ color: getROIColor(sport.roi) }}>
                              +{formatPercent(sport.roi)}
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-[#2B7FFF]">{sport.clv.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Risk Metrics */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Risk Metrics</h2>
                    <p className="text-sm text-slate-400 mt-1">Key performance indicators</p>
                  </div>

                  <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <div className="text-slate-500 text-xs font-medium mb-3">Sharpe Ratio</div>
                      <div className="text-2xl font-bold text-[#10B981]">{riskMetrics.sharpeRatio.toFixed(2)}</div>
                      <div className="text-xs text-slate-500 mt-1">Risk-adjusted return</div>
                    </div>
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <div className="text-slate-500 text-xs font-medium mb-3">Profit Factor</div>
                      <div className="text-2xl font-bold text-[#00D27A]">{riskMetrics.profitFactor.toFixed(2)}x</div>
                      <div className="text-xs text-slate-500 mt-1">Total wins / total losses</div>
                    </div>
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <div className="text-slate-500 text-xs font-medium mb-3">Win Rate</div>
                      <div className="text-2xl font-bold text-[#2B7FFF]">{formatPercent(riskMetrics.winRate)}</div>
                      <div className="text-xs text-slate-500 mt-1">Percentage of winning bets</div>
                    </div>
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <div className="text-slate-500 text-xs font-medium mb-3">Max Drawdown</div>
                      <div className="text-2xl font-bold text-[#EF4444]">{formatPercent(riskMetrics.maxDrawdown)}</div>
                      <div className="text-xs text-slate-500 mt-1">Worst peak-to-trough</div>
                    </div>
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <div className="text-slate-500 text-xs font-medium mb-3">Current Drawdown</div>
                      <div className="text-2xl font-bold text-[#F59E0B]">{formatPercent(riskMetrics.currentDrawdown)}</div>
                      <div className="text-xs text-slate-500 mt-1">From recent peak</div>
                    </div>
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <div className="text-slate-500 text-xs font-medium mb-3">Average CLV</div>
                      <div className="text-2xl font-bold text-[#10B981]">{riskMetrics.clv.toFixed(2)}</div>
                      <div className="text-xs text-slate-500 mt-1">Closing line value</div>
                    </div>
                  </div>
                </div>

                {/* Warnings & Alerts */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Alerts & Warnings</h2>
                    <p className="text-sm text-slate-400 mt-1">System notifications and recommendations</p>
                  </div>

                  <div className="divide-y divide-white/5">
                    {riskMetrics.warnings.length > 0 ? (
                      riskMetrics.warnings.map((warning, idx) => (
                        <div key={idx} className="p-4 flex items-start gap-3">
                          <div className="mt-1">
                            {warning.level === 'caution' && <div className="text-[#F59E0B] text-xl">⚠️</div>}
                            {warning.level === 'info' && <div className="text-[#2B7FFF] text-xl">ℹ️</div>}
                            {warning.level === 'danger' && <div className="text-[#EF4444] text-xl">🚨</div>}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{warning.message}</div>
                            <div className="text-xs text-slate-500 mt-1">Type: {warning.type}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-400">
                        <div className="text-2xl mb-2">✅</div>
                        <div>All systems normal. No warnings or alerts.</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-[#131A24] border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a2332] to-[#131A24] px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold">Recommendations</h2>
                    <p className="text-sm text-slate-400 mt-1">AI-generated suggestions based on your performance</p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="bg-[#1a2332] border-l-4 border-[#00D27A] rounded p-4">
                      <h3 className="font-bold text-sm mb-1">🎯 Optimize Allocation</h3>
                      <p className="text-xs text-slate-400">MLB shows 18.5% ROI. Consider increasing allocation to 6% instead of 5%.</p>
                    </div>
                    <div className="bg-[#1a2332] border-l-4 border-[#2B7FFF] rounded p-4">
                      <h3 className="font-bold text-sm mb-1">📊 Monitor Variance</h3>
                      <p className="text-xs text-slate-400">Volatility at 3.2%. Consider reducing unit size during high-variance sports.</p>
                    </div>
                    <div className="bg-[#1a2332] border-l-4 border-[#F59E0B] rounded p-4">
                      <h3 className="font-bold text-sm mb-1">⚡ Current Session Review</h3>
                      <p className="text-xs text-slate-400">NBA session confidence at 72%. Review signal quality before adding units.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#131A24] border-t border-white/10 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-slate-400">
          <div>Last updated: {currentTime.toLocaleTimeString()}</div>
          <div className="flex gap-4">
            <button className="hover:text-white transition-all">Export Data</button>
            <button className="hover:text-white transition-all">Settings</button>
            <button className="hover:text-white transition-all">Help</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bankroll;
