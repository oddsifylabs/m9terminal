import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate';

const Intel = ({ setActiveMenu }) => {
  const [activeTab, setActiveTab] = useState('news');

  const tabs = [
    { id: 'news', label: 'News' },
    { id: 'injuries', label: 'Injuries' },
    { id: 'weather', label: 'Weather' },
    { id: 'stats', label: 'Stats' }
  ];

  const newsData = [
    {
      id: 1,
      title: 'Yankees Activate Rodon',
      source: 'MLB.com',
      date: '6/1/26',
      impact: 'Positive'
    },
    {
      id: 2,
      title: 'Red Sox Lineup Changes',
      source: 'ESPN',
      date: '6/1/26',
      impact: 'Neutral'
    },
  ];

  const injuriesData = [
    {
      id: 1,
      player: 'Aaron Judge',
      team: 'NYY',
      injury: 'Shoulder Soreness',
      status: 'Day-to-Day',
      severity: 'Low'
    },
    {
      id: 2,
      player: 'Mookie Betts',
      team: 'LAD',
      injury: 'Hamstring',
      status: 'Out',
      severity: 'High'
    },
  ];

  const weatherData = [
    {
      id: 1,
      stadium: 'Yankee Stadium',
      condition: 'Partly Cloudy',
      temp: '72°F',
      wind: '8 mph NW',
      humidity: '65%'
    },
    {
      id: 2,
      stadium: 'Fenway Park',
      condition: 'Sunny',
      temp: '70°F',
      wind: '5 mph E',
      humidity: '58%'
    },
  ];

  const statsData = [
    {
      id: 1,
      name: 'Yankees',
      type: 'Team',
      stat: 'Run Differential',
      value: '+45',
      rank: '1st AL East'
    },
    {
      id: 2,
      name: 'Shohei Ohtani',
      type: 'Player',
      stat: 'Batting Average',
      value: '.301',
      rank: 'Top 10 MLB'
    },
  ];

  return (
    <PageTemplate
      title="Intel"
      icon="🔍"
      subtitle="MLB Information"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* NEWS TAB */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Latest News</h3>
          {newsData.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.source} • {item.date}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ml-2 ${
                  item.impact === 'Positive' ? 'bg-green-100 text-green-700' :
                  item.impact === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INJURIES TAB */}
      {activeTab === 'injuries' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Player Injuries</h3>
          {injuriesData.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900">{item.player}</p>
                  <p className="text-xs text-gray-600">{item.team}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  item.severity === 'High' ? 'bg-red-100 text-red-700' :
                  item.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
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
          <h3 className="text-sm font-bold text-gray-900">Stadium Weather</h3>
          {weatherData.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <p className="font-bold text-gray-900 mb-3">{item.stadium}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Condition</p>
                  <p className="font-bold text-gray-900 mt-1">{item.condition}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Temp</p>
                  <p className="font-bold text-gray-900 mt-1">{item.temp}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Wind</p>
                  <p className="font-bold text-gray-900 mt-1">{item.wind}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Humidity</p>
                  <p className="font-bold text-gray-900 mt-1">{item.humidity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STATS TAB */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900">MLB Statistics</h3>
          {statsData.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.type}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
                  {item.rank}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">{item.stat}</p>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTemplate>
  );
};

export default Intel;
