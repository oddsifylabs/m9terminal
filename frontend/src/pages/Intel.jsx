import React, { useState } from 'react';
import Header from '../components/Header';

const Intel = ({ setActiveMenu }) => {
  const [activeTab, setActiveTab] = useState('news');

  // Sample data for each tab
  const newsData = [
    {
      id: 1,
      title: 'Yankees Activate Rodon for Series vs Orioles',
      date: '2026-06-01',
      source: 'MLB.com',
      impact: 'Positive',
    },
    {
      id: 2,
      title: 'Red Sox Manager Comments on Recent Lineup Changes',
      date: '2026-06-01',
      source: 'ESPN',
      impact: 'Neutral',
    },
  ];

  const injuriesData = [
    {
      id: 1,
      player: 'Aaron Judge',
      team: 'NYY',
      injury: 'Shoulder Soreness',
      status: 'Day-to-Day',
      severity: 'Low',
    },
    {
      id: 2,
      player: 'Mookie Betts',
      team: 'LAD',
      injury: 'Hamstring',
      status: 'Out',
      severity: 'High',
    },
  ];

  const statsData = [
    {
      type: 'Team',
      team: 'NYY',
      stat: 'Run Differential',
      value: '+45',
      rank: '1st AL East',
    },
    {
      type: 'Player',
      player: 'Shohei Ohtani',
      stat: 'Batting Average',
      value: '.301',
      rank: 'Top 10 MLB',
    },
  ];

  const weatherData = [
    {
      id: 1,
      stadium: 'Yankee Stadium (NYY)',
      date: '2026-06-01',
      condition: 'Partly Cloudy',
      temp: '72°F',
      windSpeed: '8 mph',
      windDirection: 'NW',
      humidity: '65%',
    },
    {
      id: 2,
      stadium: 'Fenway Park (BOS)',
      date: '2026-06-01',
      condition: 'Sunny',
      temp: '70°F',
      windSpeed: '5 mph',
      windDirection: 'E',
      humidity: '58%',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <Header setAppMenu={setActiveMenu} title="Intel" icon="🔍" />

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['news', 'injuries', 'weather', 'stats'].map((tab) => (
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
      <div className="px-4 py-6 max-w-4xl mx-auto">

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">MLB News</h2>
            {newsData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.impact === 'Positive' ? 'bg-green-100 text-green-700' :
                    item.impact === 'Negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.date} · {item.source}</p>
              </div>
            ))}
          </div>
        )}

        {/* INJURIES TAB */}
        {activeTab === 'injuries' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Injury Report</h2>
            {injuriesData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{item.player}</p>
                    <p className="text-sm text-gray-600">{item.team}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.severity === 'High' ? 'bg-red-100 text-red-700' :
                    item.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{item.injury}</p>
              </div>
            ))}
          </div>
        )}

        {/* WEATHER TAB */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Stadium Weather</h2>
            {weatherData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">{item.stadium}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Condition</p>
                    <p className="font-bold text-gray-900">{item.condition}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Temperature</p>
                    <p className="font-bold text-gray-900">{item.temp}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Wind</p>
                    <p className="font-bold text-gray-900">{item.windSpeed} {item.windDirection}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Humidity</p>
                    <p className="font-bold text-gray-900">{item.humidity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Team & Player Stats</h2>
            {statsData.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">{item.type}</p>
                    {item.team && <p className="font-bold text-gray-900">{item.team}</p>}
                    {item.player && <p className="font-bold text-gray-900">{item.player}</p>}
                  </div>
                  <p className="text-lg font-bold text-green-600">{item.value}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">{item.stat}</p>
                  <p className="text-gray-700 font-medium">{item.rank}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Intel;
