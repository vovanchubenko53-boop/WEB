# Solana Casino - Provably Fair Gaming Platform

## Project Overview
A stunning web-based casino gaming platform featuring Coin Flip, Dice, and Roulette games with a futuristic Solana-inspired design. The MVP focuses on beautiful UI/UX with simulated gameplay that can be extended to real blockchain integration.

## Features Implemented
- ✅ Wallet connection interface (simulated)
- ✅ Three casino games:
  - Coin Flip: 50/50 odds, 2x payout
  - Dice: Predict number 1-6, 6x payout
  - Roulette: Bet on colors (2x) or numbers (36x)
- ✅ Game history tracking
- ✅ Balance management
- ✅ Statistics dashboard
- ✅ Responsive design for all devices
- ✅ Dark casino theme with purple/blue neon accents
- ✅ Smooth animations and interactions
- ✅ FAQ section
- ✅ Complete backend API with game logic

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Express.js, Node.js
- **Storage**: In-memory storage (MemStorage)
- **Styling**: Custom casino theme with dark backgrounds and neon accents

## Design System
- **Primary Color**: Purple (#a855f7) - used for main CTAs and accents
- **Secondary Color**: Cyan (#06b6d4) - used for highlights
- **Typography**: Poppins (sans), Rajdhani (mono/gaming)
- **Dark Mode**: Default theme with sophisticated dark backgrounds

## API Endpoints
- `POST /api/games/create` - Create a new game session
- `POST /api/games/play` - Execute game logic and get results
- `GET /api/games/:id` - Get specific game session
- `GET /api/games/history` - Get recent game history
- `GET /api/games` - Get all games (for statistics)

## Component Structure
```
client/src/
  ├── components/
  │   ├── Navigation.tsx - Top navigation with wallet connection
  │   ├── Hero.tsx - Landing hero section
  │   ├── GameCard.tsx - Reusable game card component
  │   ├── Stats.tsx - Live statistics dashboard
  │   ├── GameHistory.tsx - Recent plays feed
  │   ├── HowItWorks.tsx - Feature showcase
  │   ├── FAQ.tsx - Frequently asked questions
  │   ├── Footer.tsx - Site footer
  │   └── games/
  │       ├── CoinFlip.tsx - Coin flip game
  │       ├── Dice.tsx - Dice roll game
  │       └── Roulette.tsx - Roulette game
  ├── contexts/
  │   └── WalletContext.tsx - Wallet state management
  └── pages/
      └── Home.tsx - Main home page
```

## Game Logic
All games use provably fair random number generation on the backend:
- **Coin Flip**: 50% chance for heads or tails
- **Dice**: 16.7% chance for each number (1-6)
- **Roulette**: 2.7% for each number (0-36), ~48.6% for red/black

## Future Enhancements
- Real Solana blockchain integration
- Actual wallet connection (Phantom, Solflare)
- On-chain game verification
- Jackpot game mode
- User statistics and leaderboards
- Progressive jackpot pool
- Sound effects and music
- More game varieties

## Recent Changes (October 23, 2025)
- Implemented complete MVP with all three games
- Integrated backend API for game logic
- Added game history tracking
- Created beautiful casino-themed UI
- Implemented responsive design
- Added smooth animations throughout

## Development
The application runs on port 5000 with a single Express server serving both frontend and backend.

Start the application: `npm run dev`
