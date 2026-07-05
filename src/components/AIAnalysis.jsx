import { useState } from 'react';
import { getCandles } from '../services/binance';
import { getAllIndicators } from '../services/indicators';
import { getNews } from '../services/news';
import AnalysisModal from './AnalysisModal';
import NewsModal from './NewsModal';

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
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const [news, setNews] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);

  async function handleAnalyze() {
    setAnalysisOpen(true);
    setAnalysisLoading(true);
    setAnalysis(null);

    try {
      const candles = await getCandles(symbol, '4h', 250);
      const indicators = getAllIndicators(candles);
      console.log('Indicators:', indicators);

      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnalysis(MOCK_RESPONSE);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function handleNews() {
    setNewsOpen(true);
    setNewsLoading(true);
    setNews(null);

    try {
      const data = await getNews(symbol);
      setNews(data);
    } catch (error) {
      console.error('News failed:', error);
    } finally {
      setNewsLoading(false);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button onClick={handleAnalyze} className="analyze-btn">
          Analyze {symbol}
        </button>
        <button onClick={handleNews} className="analyze-btn news-btn">
          News {symbol}
        </button>
      </div>

      {analysisOpen && (
        <AnalysisModal
          symbol={symbol}
          analysis={analysis}
          loading={analysisLoading}
          onClose={() => { setAnalysisOpen(false); setAnalysis(null); }}
        />
      )}

      {newsOpen && (
        <NewsModal
          symbol={symbol}
          news={news}
          loading={newsLoading}
          onClose={() => { setNewsOpen(false); setNews(null); }}
        />
      )}
    </>
  );
}

export default AIAnalysis;