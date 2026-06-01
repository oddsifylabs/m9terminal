import React, { useState, useEffect, useRef } from 'react';

const Dashboard = ({ setAppMenu }) => {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m Claude. Ask me anything about today\'s games, signals, or betting strategy.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const summaryStats = [
    { label: 'Total Games', value: '24', color: 'blue' },
    { label: 'Sharp Signals', value: '7', color: 'green' },
    { label: 'Avg Confidence', value: '82%', color: 'amber' },
    { label: 'ROI Today', value: '+2.3%', color: 'emerald' }
  ];

  const currentBets = [
    {
      id: 1,
      sport: 'MLB',
      matchup: 'NYY vs BOS',
      bet: 'NYY -1.5',
      confidence: 86,
      status: 'pending',
      signal: 'SHARP_MONEY'
    },
    {
      id: 2,
      sport: 'MLB',
      matchup: 'LAD vs SF',
      bet: 'Over 8.5',
      confidence: 78,
      status: 'pending',
      signal: 'STEAM'
    },
  ];

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', text: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setLoading(true);

    // Simulate API response
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        text: 'That\'s a great question! Based on today\'s signals and market movement, I\'d recommend focusing on the sharp money detections in the Markets tab.'
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'from-blue-50 border-blue-200',
      green: 'from-green-50 border-green-200',
      amber: 'from-amber-50 border-amber-200',
      emerald: 'from-emerald-50 border-emerald-200'
    };
    return colors[color] || colors.blue;
  };

  const getTextColor = (color) => {
    const colors = {
      blue: 'text-blue-700',
      green: 'text-green-700',
      amber: 'text-amber-700',
      emerald: 'text-emerald-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Page Title */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">📊 Dashboard</h2>
        <p className="text-xs text-gray-600 mt-1">MLB Model Overview</p>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">

          {/* Summary Stats */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {summaryStats.map((stat, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${getColorClass(stat.color)} to-white border rounded-lg p-4`}>
                  <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold ${getTextColor(stat.color)} mt-2`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Bets */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Active Bets</h3>
            <div className="space-y-3">
              {currentBets.map((bet) => (
                <div key={bet.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{bet.matchup}</p>
                      <p className="text-xs text-gray-600">{bet.bet}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">{bet.signal}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Confidence</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${bet.confidence}%` }}></div>
                    </div>
                    <span className="font-bold text-gray-900">{bet.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Claude AI Chat */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Ask Claude AI</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col h-64">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about games, signals..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
