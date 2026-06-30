import { useState } from 'react';
import { getCandles } from '../services/binance';
import { getAllIndicators } from '../services/indicators';
import AnalysisModal from './AnalysisModal';

const MOCK_RESPONSE = `1. Market Bias: Bearish

Price is below the 200 EMA with RSI in oversold territory, and MACD showing a bearish histogram. Momentum favors sellers right now.

2. Trade Setup:
- Entry: Wait for a bounce toward resistance
- Stop Loss: Above recent swing high
- Take Profit: Next support zone

3. Main Risk:
Oversold RSI can stay oversold longer than expected in strong downtrends — don't catch a falling knife.

4. Confidence Level: Medium`;

function AIAnalysis({ symbol }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleAnalyze() {
    setModalOpen(true);
    setLoading(true);
    setAnalysis(null);

    try {
      const candles = await getCandles(symbol, '4h', 250);
      const indicators = getAllIndicators(candles);
      console.log('Indicators:', indicators);

      // Simulate delay — replace with real API call later
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnalysis(MOCK_RESPONSE);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setModalOpen(false);
    setAnalysis(null);
  }

  return (
    <>
      <button onClick={handleAnalyze} className="analyze-btn">
        Analyze {symbol}
      </button>

      {modalOpen && (
        <AnalysisModal
          symbol={symbol}
          analysis={analysis}
          loading={loading}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default AIAnalysis;