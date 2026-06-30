import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});