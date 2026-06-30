import { useState } from 'react';
import { getCandles } from '../services/binance';
import { getAllIndicators } from '../services/indicators';

const MOCK_RESPONSE = `1. Market Bias: Bearish

Price is below the 200 EMA with RSI in oversold territory, and MACD showing a bearish histogram. Momentum favors sellers right now.

2. Trade Setup:
- Entry: Wait for a bounce toward resistance
- Stop Loss: Above recent swing high
- Take Profit: Next support zone

3. Main Risk:
Oversold RSI can stay oversold longer than expected in strong downtrends — don't catch a falling knife.

4. Confidence Level: Medium`;

function AIAnalysis({ symbol, price, change24h, high24h, low24h }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    setAnalysis(null);

    try {
      // Fetch real candles and calculate real indicators
      const candles = await getCandles(symbol, '4h', 250);
      const indicators = getAllIndicators(candles);

      console.log('Real indicators for prompt:', indicators);

      // TODO: send {symbol, price, change24h, high24h, low24h, indicators}
      // to backend /api/analyze once AI credit is added

      // Simulate network delay for now
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnalysis(MOCK_RESPONSE);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          background: '#2962ff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Analyzing...' : `Analyze ${symbol}`}
      </button>

      {analysis && (
        <div
          style={{
            marginTop: '15px',
            padding: '15px',
            background: '#1e1e1e',
            borderRadius: '8px',
            color: '#d1d4dc',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
          }}
        >
          {analysis}
        </div>
      )}
    </div>
  );
}

export default AIAnalysis;