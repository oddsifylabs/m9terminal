import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import BetLog from './pages/BetLog';
import Bankroll from './pages/Bankroll';
import DailyDebrief from './pages/DailyDebrief';
import News from './pages/News';
import Weather from './pages/Weather';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import './styles/global.css';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'markets':
        return <Markets />;
      case 'betlog':
        return <BetLog />;
      case 'bankroll':
        return <Bankroll />;
      case 'daily':
        return <DailyDebrief />;
      case 'news':
        return <News />;
      case 'weather':
        return <Weather />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="antialiased" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {renderPage()}
      <BottomNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </div>
  );
}

export default App;
