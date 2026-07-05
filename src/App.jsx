import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import PairCard from './components/PairCard';
import Journal from './components/Journal';

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="app-header">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          <span />
          <span />
          <span />
        </button>
        <div className="dot" />
        <h1>Crypto Dashboard</h1>
      </div>

      {activePage === 'dashboard' && (
        <div className="pairs-grid">
          {PAIRS.map((symbol) => (
            <PairCard key={symbol} symbol={symbol} />
          ))}
        </div>
      )}

      {activePage === 'journal' && <Journal />}
    </div>
  );
}

export default App;