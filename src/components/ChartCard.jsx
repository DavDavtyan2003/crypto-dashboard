import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { getCandles } from '../services/binance';

function ChartCard({ symbol, interval = '4h' }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 220,
      layout: {
        background: { color: '#1e1e1e' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2b2b2b' },
        horzLines: { color: '#2b2b2b' },
      },
      timeScale: {
        timeVisible: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;

    // Fetch and set data
    async function loadData() {
      try {
        const candles = await getCandles(symbol, interval, 100);
        candleSeries.setData(candles);
        chart.timeScale().fitContent();
      } catch (error) {
        console.error(`Failed to load chart for ${symbol}:`, error);
      }
    }

    loadData();

    // Handle resize
    function handleResize() {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, interval]);

  return (
    <div>
      <h3>{symbol}</h3>
      <div className="chart-wrapper" ref={chartContainerRef} />
    </div>
  );
}

export default ChartCard;