import ChartCard from './components/ChartCard';
import PriceBar from './components/PriceBar';
import AIAnalysis from './components/AIAnalysis';

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

function App() {
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