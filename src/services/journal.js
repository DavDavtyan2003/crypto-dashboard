const BASE = 'http://localhost:3001';

export async function getTrades() {
  const res = await fetch(`${BASE}/api/trades`);
  const data = await res.json();
  return data.trades;
}

export async function saveTrade(trade) {
  const res = await fetch(`${BASE}/api/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trade),
  });
  const data = await res.json();
  return data.trade;
}

export async function deleteTrade(id) {
  await fetch(`${BASE}/api/trades/${id}`, { method: 'DELETE' });
}