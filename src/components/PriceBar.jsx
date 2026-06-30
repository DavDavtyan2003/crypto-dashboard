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

  if (!ticker) return (
    <div className="pair-card-top" style={{ height: '3px', background: '#222' }} />
  );

  const isUp = ticker.change24h >= 0;

  return (
    <>
      <div className={`pair-card-top ${isUp ? 'up' : 'down'}`} />
      <div className="pair-card-body">
        <div className="price-bar">
          <span className="symbol">{ticker.symbol}</span>
          <span className="price">${ticker.price.toLocaleString()}</span>
          <span className={`change ${isUp ? 'up' : 'down'}`}>
            {isUp ? '▲' : '▼'} {ticker.change24h.toFixed(2)}%
          </span>
          <span className="hl">
            H: ${ticker.high24h.toLocaleString()} &nbsp; L: ${ticker.low24h.toLocaleString()}
          </span>
        </div>
      </div>
    </>
  );
}

export default PriceBar;