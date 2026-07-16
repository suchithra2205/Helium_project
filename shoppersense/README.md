# ShopperSense 🛒

> AI-powered ecommerce personalization engine that classifies shopper intent in real time.

## Features

- 🧠 **AI Classification** — GPT-4o-mini classifies shoppers into 7 intent states
- 📊 **Behavioral Preprocessing** — Events are converted to derived signals before LLM call
- 🎛️ **Live Simulator** — Add/remove events and re-classify instantly
- `{}` **JSON Input** — Paste raw session JSON for instant analysis
- 📈 **Confidence Meter** — Animated score with evidence & reasoning
- 📋 **Insight Panel** — Session stats summary
- 📱 **Mobile Responsive**

## Shopper States

| State | Description |
|---|---|
| 🌐 Browser | Short session, no product focus |
| ⚖️ Comparer | Multiple similar product views |
| 🏷️ Discount Seeker | Coupon/sale hunting behavior |
| 🛒 Cart Abandoner | Cart filled but left before purchase |
| ⭐ Loyal Customer | High engagement, purchase history |
| 🚀 High Intent Buyer | Focused path to checkout |
| 🔄 Returning Visitor | Previous session signals |

## Setup

### 1. Clone & install

```bash
cd shoppersense
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key
```

### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npx vercel
# Follow prompts, then add env variable:
npx vercel env add OPENAI_API_KEY
```

### Option B — Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. In **Environment Variables**, add:
   - `OPENAI_API_KEY` = your OpenAI API key
4. Click Deploy ✅

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OpenAI GPT-4o-mini**

## Project Structure

```
shoppersense/
├── app/
│   ├── api/classify/route.ts   # OpenAI API route
│   ├── page.tsx                # Main page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── SessionEditor.tsx       # Event list + live simulator
│   ├── ResultPanel.tsx         # Classification results
│   ├── ConfidenceMeter.tsx     # Animated confidence bar
│   └── InsightPanel.tsx        # Behavioral summary stats
├── lib/
│   └── behaviorProcessor.ts   # Event → signal preprocessing
├── types/
│   └── index.ts               # TypeScript types & constants
├── .env.example
└── vercel.json
```
