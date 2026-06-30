// Calculate RSI (Relative Strength Index) - default 14 period
export function calculateRSI(candles, period = 14) {
  if (candles.length < period + 1) return null;

  const closes = candles.map((c) => c.close);
  let gains = 0;
  let losses = 0;

  // Initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Smooth the rest using Wilder's method
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return parseFloat(rsi.toFixed(2));
}

// Calculate EMA (Exponential Moving Average) for a given period
function calculateEMASeries(closes, period) {
  const k = 2 / (period + 1);
  const emaArray = [closes[0]];

  for (let i = 1; i < closes.length; i++) {
    const ema = closes[i] * k + emaArray[i - 1] * (1 - k);
    emaArray.push(ema);
  }

  return emaArray;
}

// Get the latest EMA value for a given period
export function calculateEMA(candles, period = 200) {
  if (candles.length < period) return null;

  const closes = candles.map((c) => c.close);
  const emaSeries = calculateEMASeries(closes, period);

  return parseFloat(emaSeries[emaSeries.length - 1].toFixed(2));
}

// Calculate MACD (12, 26, 9 default settings)
export function calculateMACD(candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (candles.length < slowPeriod + signalPeriod) return null;

  const closes = candles.map((c) => c.close);

  const fastEMA = calculateEMASeries(closes, fastPeriod);
  const slowEMA = calculateEMASeries(closes, slowPeriod);

  // MACD line = fastEMA - slowEMA
  const macdLine = closes.map((_, i) => fastEMA[i] - slowEMA[i]);

  // Signal line = EMA of MACD line
  const signalLine = calculateEMASeries(macdLine, signalPeriod);

  const latestMACD = macdLine[macdLine.length - 1];
  const latestSignal = signalLine[signalLine.length - 1];
  const histogram = latestMACD - latestSignal;

  return {
    macd: parseFloat(latestMACD.toFixed(2)),
    signal: parseFloat(latestSignal.toFixed(2)),
    histogram: parseFloat(histogram.toFixed(2)),
    trend: histogram >= 0 ? 'bullish' : 'bearish',
  };
}

// Convenience function - get all indicators at once
export function getAllIndicators(candles) {
  return {
    rsi: calculateRSI(candles),
    ema200: calculateEMA(candles, 200),
    macd: calculateMACD(candles),
  };
}