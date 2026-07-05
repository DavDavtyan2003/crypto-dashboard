import { useState, useEffect } from 'react';
import { getCandles } from '../services/binance';
import { getAllIndicators } from '../services/indicators';
import PriceBar from './PriceBar';
import ChartCard from './ChartCard';
import AIAnalysis from './AIAnalysis';
import IndicatorBadges from './IndicatorBadges';

function PairCard({ symbol }) {
  const [candles, setCandles] = useState([]);
  const [indicators, setIndicators] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCandles(symbol, '4h', 250);
        setCandles(data);
        setIndicators(getAllIndicators(data));
      } catch (error) {
        console.error(`Failed to load candles for ${symbol}:`, error);
      }
    }
    load();
  }, [symbol]);

  return (
    <div className="pair-card">
      <PriceBar symbol={symbol} />
      <div className="pair-card-body">
        <IndicatorBadges indicators={indicators} />
        <ChartCard symbol={symbol} candles={candles} />
        <AIAnalysis symbol={symbol} indicators={indicators} />
      </div>
    </div>
  );
}

export default PairCard;