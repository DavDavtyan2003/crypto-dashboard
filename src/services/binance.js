const BASE_URL = 'https://api.binance.com/api/v3';

// Fetch candle (kline) data for the chart
export async function getCandles(symbol, interval = '4h', limit = 100) {
  const response = await fetch(
    `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch candles for ${symbol}`);
  }

  const data = await response.json();

  // Binance returns arrays, we convert to objects the chart library expects
  return data.map((candle) => ({
    time: candle[0] / 1000, // convert ms to seconds
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }));
}

// Fetch current price + 24h stats
export async function getTicker(symbol) {
  const response = await fetch(`${BASE_URL}/ticker/24hr?symbol=${symbol}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ticker for ${symbol}`);
  }

  const data = await response.json();

  return {
    symbol: data.symbol,
    price: parseFloat(data.lastPrice),
    change24h: parseFloat(data.priceChangePercent),
    high24h: parseFloat(data.highPrice),
    low24h: parseFloat(data.lowPrice),
    volume24h: parseFloat(data.volume),
  };
}