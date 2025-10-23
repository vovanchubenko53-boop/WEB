# Design Guidelines: Solana Casino Gaming Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium crypto casino platforms (Stake.com, Rollbit) combined with modern gaming UI aesthetics (Riot Games, esports platforms). This creates a high-energy, trustworthy gaming experience that balances excitement with security.

## Core Design Principles

1. **Dark Gaming Aesthetic**: Sophisticated dark theme with vibrant accent highlights
2. **Visual Hierarchy Through Contrast**: Critical information and CTAs pop against dark backgrounds
3. **Trust Through Polish**: Premium finishes and micro-interactions build credibility
4. **Energy and Motion**: Strategic use of subtle animations to maintain excitement without distraction

## Typography System

**Primary Font**: Inter or Poppins (Google Fonts)
- Display/Hero: 600-700 weight, 48-72px
- Game Titles: 600 weight, 32-40px  
- Section Headers: 600 weight, 24-32px
- Body Text: 400-500 weight, 16-18px
- UI Labels/Stats: 500-600 weight, 14-16px
- Small Text/Captions: 400 weight, 12-14px

**Accent Font**: Rajdhani or Orbitron for crypto/gaming elements
- Use sparingly for: Token amounts, game statistics, blockchain addresses

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (within components): 2, 4
- Component internal padding: 6, 8  
- Section padding: 12, 16, 20
- Large section spacing: 24

**Grid Structure**:
- Max container width: max-w-7xl
- Game grid: 3 columns desktop (lg:grid-cols-3), 2 tablet (md:grid-cols-2), 1 mobile
- Statistics/Features: 4 columns desktop, 2 tablet, 1 mobile

## Component Library

### Navigation
**Top Navigation Bar**:
- Sticky/fixed position
- Logo left, wallet connection right
- Game category links center
- Height: h-16 to h-20
- Backdrop blur effect (backdrop-blur-md)

### Hero Section  
**Full-Width Immersive Hero** (h-screen or min-h-[600px]):
- Large hero image: Futuristic casino/gaming environment with neon elements
- Gradient overlay from transparent to dark at bottom
- Centered content with maximum width max-w-4xl
- Headline emphasizing "Solana-Powered Casino Gaming"
- Dual CTAs: Primary "Connect Wallet" + Secondary "Explore Games"
- Buttons on hero: Backdrop blur with semi-transparent backgrounds
- Trust indicators below CTAs: "Provably Fair" badge, "Instant Payouts" text, Solana logo

### Game Cards
**Interactive Game Modules**:
- Card structure with hover lift effect (transform scale 1.02)
- Game preview image/animation at top
- Game title and brief description
- Key stats (Min bet, Max win, RTP)
- Play button with glow effect
- Rounded corners: rounded-xl to rounded-2xl
- Border treatment: subtle 1px border with gradient or glow

### Wallet Integration Section
**Connection Module**:
- Prominent "Connect Wallet" button when disconnected
- When connected: Display address (truncated), balance, disconnect option
- Wallet icons for Phantom, Solflare, other Solana wallets
- Quick balance display for SOL and tokens

### Statistics Dashboard
**Live Stats Section**:
- 4-column grid for: Total Volume, Active Players, Games Played, Total Winnings
- Large numbers with small labels
- Animated counter effect implied
- Icon for each stat category

### Game Category Sections
**Organized by Game Type**:
- Section headers with icon
- Horizontal scrolling on mobile, grid on desktop
- Categories: Coin Flip, Dice, Roulette, Jackpot
- Each section: 3-4 game variants

### How It Works / Features
**Trust-Building Section**:
- 3-column feature grid
- Icons: Blockchain (provably fair), Lightning (instant), Shield (secure)
- Titles: "Provably Fair Gaming", "Instant Blockchain Payouts", "Secure & Transparent"
- Short descriptions for each

### Recent Wins / Activity Feed
**Live Activity Stream**:
- Scrolling list or ticker of recent wins
- Each entry: Player (anonymous ID), Game, Win amount
- Creates FOMO and social proof
- Optional: auto-refresh animation

### FAQ Section
**Accordion-Style Questions**:
- Common questions about gameplay, payouts, fairness
- Expandable answers
- Clean dividers between questions

### Footer
**Comprehensive Footer**:
- Links: Games, How to Play, Provably Fair, Terms, Privacy
- Social media icons (Twitter, Discord, Telegram)
- Solana ecosystem badges
- Copyright and licensing info
- Newsletter signup optional

## Visual Elements

### Gradients & Effects
- Glow effects on active game cards and CTAs
- Gradient borders using border-gradient patterns
- Glassmorphism for overlays and modals (backdrop-blur with semi-transparent backgrounds)

### Icons
**Icon Library**: Heroicons (via CDN)
- Use outline style for general UI
- Use solid style for active/selected states
- Size: 20px (w-5 h-5) for standard, 24px (w-6 h-6) for emphasis

### Game Interfaces
**Interactive Game Screens**:
- Central game area with clear visual focus
- Betting controls in dedicated panel (bottom or side)
- Result animations area
- History/statistics sidebar
- Clear win/loss feedback with appropriate visual treatment

## Images

**Hero Section**: 
- Large background image (1920x1080): Futuristic neon-lit casino floor with Solana branding elements, purple/blue color scheme, high-tech atmosphere
- Should convey: Premium, modern, crypto-native aesthetic

**Game Preview Images**:
- Coin Flip: 3D rotating coin with heads/tails
- Dice: 3D dice with glowing pips
- Roulette: Spinning roulette wheel in action
- Jackpot: Progressive jackpot display with large numbers

**Feature Section Icons/Illustrations**:
- Blockchain visualization for provably fair
- Lightning bolt for instant payouts  
- Shield with checkmark for security

## Interaction Patterns

- **Hover states**: Scale transforms, glow intensification, border color changes
- **Active game**: Pulsing border or glow to indicate selection
- **Loading states**: Skeleton screens or subtle pulse animations
- **Win celebrations**: Confetti effect, number count-up, success modal
- **Loss feedback**: Subtle shake animation, try again prompt

## Mobile Considerations

- Hero height reduced to min-h-[500px]
- Stack navigation into hamburger menu
- Game grid switches to single column with horizontal scroll
- Stats dashboard stacks to 2x2 grid
- Simplified game interfaces with collapsible panels
- Bottom navigation bar for quick access to games, wallet, profile

## Accessibility

- Sufficient contrast ratios on dark backgrounds (WCAG AA minimum)
- Focus indicators on all interactive elements
- Keyboard navigation support
- ARIA labels for game controls
- Screen reader friendly labels for statistics and amounts

## Performance Priorities

- Lazy load game images below the fold
- Optimize hero image with next-gen formats
- Minimize animation complexity on lower-end devices
- Use CSS transforms for animations (hardware accelerated)