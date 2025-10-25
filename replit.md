# TON Casino - Telegram Mini App

## Project Overview
A Telegram Mini App casino gaming platform featuring Coin Flip, Dice, and Roulette games with TON blockchain integration. Built as a multi-page application with bottom navigation for seamless mobile experience.

## Features Implemented
- ✅ TON Connect wallet integration
- ✅ Telegram Mini App compatibility
- ✅ Multi-page navigation (Games, Profile, Stats, FAQ)
- ✅ Bottom navigation bar for mobile-first UX
- ✅ Three casino games:
  - Coin Flip: 50/50 odds, 2x payout
  - Dice: Predict number 1-6, 6x payout
  - Roulette: Bet on colors (2x) or numbers (36x)
- ✅ Game history tracking
- ✅ Balance management
- ✅ Statistics dashboard
- ✅ Profile page with wallet info
- ✅ Responsive design for all devices
- ✅ Dark casino theme with TON blue/cyan accents
- ✅ Smooth animations and interactions
- ✅ FAQ section
- ✅ Complete backend API with game logic

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Express.js, Node.js
- **Blockchain**: TON Connect UI React
- **Storage**: In-memory storage (MemStorage)
- **Routing**: Wouter (client-side routing)
- **Styling**: Custom casino theme with TON-inspired colors

## Design System
- **Primary Color**: TON Blue (#0088CC / hsl(204 100% 50%)) - main CTAs and accents
- **Secondary Color**: Cyan (#33CCFF / hsl(188 100% 60%)) - highlights
- **Typography**: Poppins (sans), Rajdhani (mono/gaming)
- **Dark Mode**: Default theme with sophisticated dark backgrounds
- **Theme**: TON-inspired blue/cyan gradient scheme

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
  │   ├── Navigation.tsx - Top navigation with TON Connect button
  │   ├── BottomNav.tsx - Bottom navigation for mobile (Games, Stats, Profile, FAQ)
  │   ├── GameHistory.tsx - Recent plays feed
  │   └── games/
  │       ├── CoinFlip.tsx - Coin flip game
  │       ├── Dice.tsx - Dice roll game
  │       └── Roulette.tsx - Roulette game
  ├── contexts/
  │   └── TonWalletContext.tsx - TON wallet state management
  └── pages/
      ├── Games.tsx - Games page with tabs (Coin Flip, Dice, Roulette)
      ├── Profile.tsx - User profile with wallet info and history
      ├── StatsPage.tsx - Live statistics dashboard
      ├── FAQPage.tsx - Frequently asked questions
      └── not-found.tsx - 404 page
```

## Game Logic
All games use provably fair random number generation on the backend:
- **Coin Flip**: 50% chance for heads or tails
- **Dice**: 16.7% chance for each number (1-6)
- **Roulette**: 2.7% for each number (0-36), ~48.6% for red/black

## Pages & Navigation
- **/games** - Main games page with tabbed interface (Coin Flip, Dice, Roulette)
- **/profile** - User profile displaying wallet address, balance, and game history
- **/stats** - Live statistics showing total volume, active players, games played
- **/faq** - Frequently asked questions about the platform

## TON Integration
- **TON Connect**: Wallet connection via TON Connect UI React
- **Wallet Support**: All TON Connect compatible wallets (Tonkeeper, OpenMask, MyTonWallet)
- **Manifest**: Located at `/tonconnect-manifest.json`
- **Return URL**: Configured for Telegram Mini App integration

## Future Enhancements
- Real TON blockchain transactions
- On-chain game verification with smart contracts
- TON payment processing for bets and payouts
- Jackpot game mode
- User statistics and leaderboards
- Progressive jackpot pool
- Sound effects and music
- More game varieties
- Telegram notifications for wins

## Recent Changes
### October 25, 2025 (Latest)
- ✅ **Fixed TON Connect Transactions**: Changed to raw address format (0:...) for proper TON SDK compatibility
- ✅ **Security Improvements**: Added mandatory casino wallet address configuration with validation
- ✅ **Transaction Timeout**: Fixed validUntil from 360 to 300 seconds (TON SDK 5-minute limit)
- ✅ **Error Handling**: Comprehensive error messages for all transaction failure scenarios
- ✅ **Environment Variables**: Added VITE_CASINO_WALLET_ADDRESS for secure wallet configuration
- ✅ **Accessibility**: Fixed dialog aria-describedby warnings
- ✅ **Updated Manifest**: Configured TON Connect manifest with correct Replit domain
- ✅ **Fixed API Routes**: Corrected route order to prevent 404 errors on game history endpoint

### October 23, 2025
- ✅ Migrated from Solana to TON blockchain
- ✅ Integrated TON Connect for wallet connection
- ✅ Converted to Telegram Mini App format
- ✅ Implemented multi-page navigation with bottom nav bar
- ✅ Created separate pages: Games, Profile, Stats, FAQ
- ✅ Updated color scheme to TON blue/cyan theme
- ✅ Added mobile-first bottom navigation
- ✅ Restructured app for better UX in Telegram

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

**VITE_CASINO_WALLET_ADDRESS** - Casino wallet address in raw format where deposits will be sent
- Format: `workchain:account_id` (e.g., `0:e430f363...`)
- Convert from user-friendly format using https://ton-address-converter.com/
- **CRITICAL**: Without this variable, deposits will be blocked for security

## Development
The application runs on port 5000 with a single Express server serving both frontend and backend.

Start the application: `npm run dev`
