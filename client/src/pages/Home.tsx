import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { GameCard } from '@/components/GameCard';
import { Stats } from '@/components/Stats';
import { HowItWorks } from '@/components/HowItWorks';
import { GameHistory } from '@/components/GameHistory';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { CoinFlip } from '@/components/games/CoinFlip';
import { Dice } from '@/components/games/Dice';
import { Roulette } from '@/components/games/Roulette';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';

import coinFlipImage from '@assets/generated_images/Coin_flip_game_preview_c60b993a.png';
import diceImage from '@assets/generated_images/Dice_game_preview_image_6ac44415.png';
import rouletteImage from '@assets/generated_images/Roulette_wheel_game_preview_c24ac4af.png';

type GameView = 'home' | 'coinflip' | 'dice' | 'roulette';

export default function Home() {
  const [currentView, setCurrentView] = useState<GameView>('home');
  const { connected } = useWallet();
  const { toast } = useToast();

  const handlePlayGame = (game: GameView) => {
    if (!connected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to start playing',
        variant: 'destructive',
      });
      return;
    }
    setCurrentView(game);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'coinflip') {
    return <CoinFlip onBack={handleBackToHome} />;
  }

  if (currentView === 'dice') {
    return <Dice onBack={handleBackToHome} />;
  }

  if (currentView === 'roulette') {
    return <Roulette onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Statistics */}
      <Stats />
      
      {/* Games Section */}
      <section id="games" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Choose Your Game
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your luck with our provably fair casino games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <GameCard
              title="Coin Flip"
              description="Classic heads or tails. Double your bet with a 50/50 chance!"
              image={coinFlipImage}
              minBet="0.1"
              maxWin="200"
              rtp="98"
              onPlay={() => handlePlayGame('coinflip')}
              testId="coinflip"
            />
            <GameCard
              title="Dice Roll"
              description="Predict the number and win big with 6x multiplier!"
              image={diceImage}
              minBet="0.1"
              maxWin="600"
              rtp="97.3"
              onPlay={() => handlePlayGame('dice')}
              testId="dice"
            />
            <GameCard
              title="Roulette"
              description="Bet on colors or numbers for massive 36x payouts!"
              image={rouletteImage}
              minBet="0.1"
              maxWin="3600"
              rtp="97.3"
              onPlay={() => handlePlayGame('roulette')}
              testId="roulette"
            />
          </div>

          {/* Game History */}
          {connected && (
            <div className="max-w-2xl mx-auto mt-16">
              <GameHistory />
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* FAQ */}
      <FAQ />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
