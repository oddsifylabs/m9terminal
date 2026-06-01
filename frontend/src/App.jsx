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
import './styles/responsive.css';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard setAppMenu={setActiveMenu} />;
      case 'markets':
        return <Markets setAppMenu={setActiveMenu} />;
      case 'betlog':
        return <BetLog setActiveMenu={setActiveMenu} />;
      case 'bankroll':
        return <Bankroll setActiveMenu={setActiveMenu} />;
      case 'daily':
        return <DailyDebrief setActiveMenu={setActiveMenu} />;
      case 'news':
        return <News setActiveMenu={setActiveMenu} />;
      case 'weather':
        return <Weather setActiveMenu={setActiveMenu} />;
      case 'settings':
        return <Settings setActiveMenu={setActiveMenu} />;
      default:
        return <Dashboard setAppMenu={setActiveMenu} />;
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#0F1115',
        flex: 1,
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, height: '100%' }}>
        {renderPage()}
      </div>
      <BottomNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </div>
  );
}

export default App;
