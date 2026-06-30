import { useEffect, useState } from 'react';
import { getTicker } from '../services/binance';

function PriceBar({ symbol }) {
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    async function loadTicker() {
      try {
        const data = await getTicker(symbol);
        setTicker(data);
      } catch (error) {
        console.error(`Failed to load ticker for ${symbol}:`, error);
      }
    }

    loadTicker();

    // Refresh every 10 seconds
    const interval = setInterval(loadTicker, 10000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (!ticker) return <div style={{ color: '#888' }}>Loading {symbol}...</div>;

  const isUp = ticker.change24h >= 0;

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '10px 0',
        color: 'white',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
        ${ticker.price.toLocaleString()}
      </span>
      <span style={{ color: isUp ? '#26a69a' : '#ef5350' }}>
        {isUp ? '▲' : '▼'} {ticker.change24h.toFixed(2)}%
      </span>
      <span style={{ color: '#888' }}>
        H: ${ticker.high24h.toLocaleString()} L: ${ticker.low24h.toLocaleString()}
      </span>
    </div>
  );
}

export default PriceBar;