import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRADES_FILE = path.join(__dirname, 'trades.json');

// Create trades file if it doesn't exist
if (!fs.existsSync(TRADES_FILE)) {
  fs.writeFileSync(TRADES_FILE, JSON.stringify([]));
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { symbol, price, change24h, high24h, low24h } = req.body;

    const prompt = `You are an expert trading analyst. I will give you data about a specific asset, and you will help me make a trading decision.

Asset: ${symbol}
Timeframe: 4H chart
Current price: $${price}
24h change: ${change24h}%
24h high: $${high24h}
24h low: $${low24h}

Based on this data, give me:
1. Your market bias (bullish / bearish / neutral) and why
2. A potential trade setup (entry, stop loss, take profit)
3. The main risk to this trade
4. Confidence level (low / medium / high)

Keep it concise and structured.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const analysis = message.content[0].text;
    res.json({ analysis });
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

const COIN_KEYWORDS = {
  BTCUSDT: 'bitcoin',
  ETHUSDT: 'ethereum',
  SOLUSDT: 'solana',
  BNBUSDT: 'binance',
};

app.get('/api/news/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const keyword = COIN_KEYWORDS[symbol];

    if (!keyword) {
      return res.status(400).json({ error: 'Unknown symbol' });
    }

    const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&q=${keyword}&language=en&category=business,technology&size=8`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NewsData error: ${response.status}`);
    }

    const data = await response.json();

    const news = data.results.map((item) => ({
      title: item.title,
      url: item.link,
      source: item.source_name,
      publishedAt: item.pubDate,
      description: item.description,
    }));

    res.json({ news });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get all trades
app.get('/api/trades', (req, res) => {
  try {
    const trades = JSON.parse(fs.readFileSync(TRADES_FILE, 'utf-8'));
    res.json({ trades });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load trades' });
  }
});

// Save a new trade
app.post('/api/trades', (req, res) => {
  try {
    const trades = JSON.parse(fs.readFileSync(TRADES_FILE, 'utf-8'));
    const trade = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    trades.unshift(trade);
    fs.writeFileSync(TRADES_FILE, JSON.stringify(trades, null, 2));
    res.json({ trade });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save trade' });
  }
});

// Delete a trade
app.delete('/api/trades/:id', (req, res) => {
  try {
    const trades = JSON.parse(fs.readFileSync(TRADES_FILE, 'utf-8'));
    const filtered = trades.filter((t) => t.id !== parseInt(req.params.id));
    fs.writeFileSync(TRADES_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trade' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});