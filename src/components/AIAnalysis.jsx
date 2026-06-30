import { useState } from 'react';

// Temporary mock response — will be replaced with real API call later
const MOCK_RESPONSE = `1. Market Bias: Bullish

Price is holding above the 200 EMA with RSI at 62, showing healthy momentum without being overbought. The bullish MACD crossover supports continued upside.

2. Trade Setup:
- Entry: $107,500
- Stop Loss: $104,800 (below support)
- Take Profit: $110,000 (at resistance)

3. Main Risk: 
A rejection at the $110,000 resistance level could trigger a pullback. Fed comments could also shift market sentiment quickly.

4. Confidence Level: Medium`;

function AIAnalysis({ symbol, price, change24h, high24h, low24h }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    setAnalysis(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setAnalysis(MOCK_RESPONSE);
    setLoading(false);
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