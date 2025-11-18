# Chirp Deck

Production-ready TweetDeck-style web app using Twitter (X) API v2.

## How to run

### Prerequisites
- Node.js 18+
- PostgreSQL and Redis running locally
- Twitter/X developer app with OAuth 2.0 client credentials

### Setup
1. Copy `.env.example` to `.env` and fill in secrets.
2. Install root dependencies: `npm install`.
3. Install server and generate Prisma client: `npm --prefix server run prisma:generate`.
4. Run migrations: `npm --prefix server run prisma:migrate`.
5. Start backend dev server: `npm --prefix server run dev`.
6. Start frontend dev server: `npm --prefix client run dev`.
7. Visit `http://localhost:5173`.

### Services
- PostgreSQL for persistence (see `server/prisma/schema.prisma`).
- Redis is optional for future queueing; scheduler runs via cron in this starter.

## Project structure
- `server/`: Express + Prisma + cron scheduler for tweets and columns.
- `client/`: React + Vite + Tailwind multi-column dashboard and tools.

## Notes
- OAuth flow uses the standard Twitter OAuth2 endpoints; set redirect URI in your Twitter app to the callback.
- Media upload and DM endpoints require elevated access; stubs and comments indicate where to extend.
