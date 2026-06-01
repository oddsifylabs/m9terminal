import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Intel from './pages/Intel';
import Tracker from './pages/Tracker';
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
      case 'intel':
        return <Intel setActiveMenu={setActiveMenu} />;
      case 'tracker':
        return <Tracker setActiveMenu={setActiveMenu} />;
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
        backgroundColor: '#ffffff',
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
