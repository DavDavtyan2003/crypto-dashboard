import './App.css';
import { useEffect } from 'react';
import { getCandles } from './services/binance';
import { getAllIndicators } from './services/indicators';
import ChartCard from './components/ChartCard';
import PriceBar from './components/PriceBar';
import AIAnalysis from './components/AIAnalysis';

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

function App() {
  useEffect(() => {
    async function testIndicators() {
      const candles = await getCandles('BTCUSDT', '4h', 250);
      const indicators = getAllIndicators(candles);
      console.log('First candle:', new Date(candles[0].time * 1000));
      console.log('Last candle:', new Date(candles[candles.length - 1].time * 1000));
      console.log('Last close price:', candles[candles.length - 1].close);
    }
    testIndicators();
  }, []);

  const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

  return (
    <div className="app">
      <div className="app-header">
        <div className="dot" />
        <h1>Crypto Dashboard</h1>
      </div>
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
    </div>
  );
}

export default App;