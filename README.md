# Narra Health — Social Media Command Center

Multi-platform social media analytics dashboard for Narra Health.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Add New Project → Import your repo
3. Vercel auto-detects Vite — click Deploy
4. Done. Your dashboard is live.

## Features

- **Multi-platform CSV upload** — Facebook, Instagram, LinkedIn, YouTube, TikTok, Blog
- **Smart column detection** — auto-maps CSV columns regardless of platform export format
- **Overview dashboard** — KPIs, reach trends, engagement rate, format breakdown
- **Sortable post table** — click any column header to sort, search by keyword
- **Content calendar** — see posting gaps and plan upcoming content
- **AI Strategy Insights** — Claude-powered analysis of your cross-platform performance
- **Date range filtering** — All / 7 days / 30 days / 90 days
- **Persistent data** — uploaded data saved in localStorage across sessions

## Project Structure

```
narra-social-hub/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── public/
│   └── favicon.png     # Narra logo favicon
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Full dashboard component
```
