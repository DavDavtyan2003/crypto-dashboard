import { useState, useEffect } from 'react';
import { getTrades, saveTrade, deleteTrade } from '../services/journal';

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

const EMPTY_FORM = {
  pair: 'BTCUSDT',
  direction: 'Long',
  entry: '',
  stopLoss: '',
  takeProfit: '',
  result: 'Win',
  pnl: '',
  notes: '',
};

function Journal() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrades();
        setTrades(data);
      } catch (error) {
        console.error('Failed to load trades:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit() {
    if (!form.entry || !form.pnl) return;
    try {
      const trade = await saveTrade(form);
      setTrades([trade, ...trades]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save trade:', error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTrade(id);
      setTrades(trades.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete trade:', error);
    }
  }

  // Stats
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.result === 'Win').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
  const totalPnl = trades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);

  function formatDate(str) {
    return new Date(str).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  return (
    <div className="journal">
      {/* Stats Bar */}
      <div className="journal-stats">
        <div className="stat-card">
          <span className="stat-label">Total Trades</span>
          <span className="stat-value">{totalTrades}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value" style={{ color: '#26a69a' }}>{winRate}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total PnL</span>
          <span className="stat-value" style={{ color: totalPnl >= 0 ? '#26a69a' : '#ef5350' }}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} USDT
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Wins / Losses</span>
          <span className="stat-value">{wins} / {totalTrades - wins}</span>
        </div>
      </div>

      {/* Add Trade Button */}
      <div className="journal-toolbar">
        <button
          className="analyze-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Log Trade'}
        </button>
      </div>

      {/* Trade Form */}
      {showForm && (
        <div className="trade-form">
          <div className="form-row">
            <div className="form-group">
              <label>Pair</label>
              <select value={form.pair} onChange={(e) => setForm({ ...form, pair: e.target.value })}>
                {PAIRS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Direction</label>
              <select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
                <option>Long</option>
                <option>Short</option>
              </select>
            </div>
            <div className="form-group">
              <label>Result</label>
              <select value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}>
                <option>Win</option>
                <option>Loss</option>
                <option>Breakeven</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entry Price</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.entry}
                onChange={(e) => setForm({ ...form, entry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Stop Loss</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.stopLoss}
                onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Take Profit</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.takeProfit}
                onChange={(e) => setForm({ ...form, takeProfit: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>PnL (USDT)</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.pnl}
                onChange={(e) => setForm({ ...form, pnl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Why did you take this trade? What did you learn?"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>

          <button className="analyze-btn" onClick={handleSubmit}>
            Save Trade
          </button>
        </div>
      )}

      {/* Trades Table */}
      {loading ? (
        <div style={{ color: '#555', textAlign: 'center', marginTop: '40px' }}>
          Loading trades...
        </div>
      ) : trades.length === 0 ? (
        <div style={{ color: '#555', textAlign: 'center', marginTop: '60px' }}>
          No trades logged yet. Click "+ Log Trade" to add your first one.
        </div>
      ) : (
        <div className="trades-table-wrapper">
          <table className="trades-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Pair</th>
                <th>Direction</th>
                <th>Entry</th>
                <th>SL</th>
                <th>TP</th>
                <th>Result</th>
                <th>PnL</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td>{formatDate(trade.createdAt)}</td>
                  <td>{trade.pair}</td>
                  <td style={{ color: trade.direction === 'Long' ? '#26a69a' : '#ef5350' }}>
                    {trade.direction}
                  </td>
                  <td>${parseFloat(trade.entry).toLocaleString()}</td>
                  <td>${parseFloat(trade.stopLoss).toLocaleString()}</td>
                  <td>${parseFloat(trade.takeProfit).toLocaleString()}</td>
                  <td style={{
                    color: trade.result === 'Win' ? '#26a69a' : trade.result === 'Loss' ? '#ef5350' : '#888'
                  }}>
                    {trade.result}
                  </td>
                  <td style={{ color: parseFloat(trade.pnl) >= 0 ? '#26a69a' : '#ef5350' }}>
                    {parseFloat(trade.pnl) >= 0 ? '+' : ''}{parseFloat(trade.pnl).toFixed(2)}
                  </td>
                  <td className="notes-cell">{trade.notes || '—'}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(trade.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Journal;