# Goals V2 Prototype

Interactive UI/UX prototype for a patient goals management system. Built with Next.js + Tailwind CSS, deployed on Vercel.

## What is this?

A clickable prototype for testing goal management interfaces -- no backend, no database, just mock data and interactive components. Share the Vercel URL with anyone to get feedback.

## Features

- **Patient Goals Tab** -- view all goals with filtering by status (active, met, discontinued, pending)
- **Goal hierarchy** -- long-term goals with nested short-term goals, plus standalone goals
- **Multiple measurement types** -- percentage progress bars, assistance level scales, custom units
- **Status history** -- expandable audit trail per goal
- **Responsive** -- works on desktop, tablet, and mobile

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com), import the repo
3. Click Deploy -- that's it

Every push to `main` auto-deploys.

[Deployed page](https://goals-v2-prototype.vercel.app/)

## Mock data

All data lives in `src/data/mockData.ts`. Edit it to test different scenarios (more goals, different statuses, different measurement types).
