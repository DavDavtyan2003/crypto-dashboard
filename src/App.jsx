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

  return (
    <div style={{ padding: '20px', background: '#121212', minHeight: '100vh' }}>
      <h1 style={{ color: 'white' }}>Crypto Dashboard</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {PAIRS.map((symbol) => (
          <div key={symbol}>
            <PriceBar symbol={symbol} />
            <ChartCard symbol={symbol} interval="4h" />
            <AIAnalysis symbol={symbol} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;