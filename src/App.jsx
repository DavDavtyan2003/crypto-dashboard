import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChartCard from './components/ChartCard';
import PriceBar from './components/PriceBar';
import AIAnalysis from './components/AIAnalysis';
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
            <div key={symbol} className="pair-card">
              <PriceBar symbol={symbol} />
              <div className="pair-card-body">
                <ChartCard symbol={symbol} interval="4h" />
                <AIAnalysis symbol={symbol} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activePage === 'journal' && <Journal />}
    </div>
  );
}

export default App;