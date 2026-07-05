function IndicatorBadges({ indicators }) {
  if (!indicators) return (
    <div className="indicator-badges">
      <div className="badge badge--loading">Loading indicators...</div>
    </div>
  );

  const { rsi, ema200, macd } = indicators;

  function getRSILabel(rsi) {
    if (rsi >= 70) return { label: `RSI ${rsi}`, type: 'danger', hint: 'Overbought' };
    if (rsi <= 30) return { label: `RSI ${rsi}`, type: 'warning', hint: 'Oversold' };
    return { label: `RSI ${rsi}`, type: 'neutral', hint: 'Neutral' };
  }

  function getEMALabel(macdData) {
    if (!macdData) return null;
    return macdData.trend === 'bullish'
      ? { label: 'MACD Bullish', type: 'bull' }
      : { label: 'MACD Bearish', type: 'bear' };
  }

  const rsiInfo = getRSILabel(rsi);
  const macdInfo = getEMALabel(macd);

  return (
    <div className="indicator-badges">
      {/* RSI Badge */}
      <div className={`badge badge--${rsiInfo.type}`}>
        <span className="badge-label">{rsiInfo.label}</span>
        <span className="badge-hint">{rsiInfo.hint}</span>
      </div>

      {/* MACD Badge */}
      {macdInfo && (
        <div className={`badge badge--${macdInfo.type}`}>
          <span className="badge-label">{macdInfo.label}</span>
          <span className="badge-hint">
            H: {macd.histogram > 0 ? '+' : ''}{macd.histogram}
          </span>
        </div>
      )}

      {/* EMA200 Badge */}
      {ema200 && (
        <div className="badge badge--neutral">
          <span className="badge-label">EMA 200</span>
          <span className="badge-hint">${ema200.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

export default IndicatorBadges;