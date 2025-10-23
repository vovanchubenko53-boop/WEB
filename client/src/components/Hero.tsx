import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Lock } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import heroImage from '@assets/generated_images/Futuristic_casino_hero_background_f612e360.png';

export function Hero() {
  const { connected, connect } = useWallet();

  const scrollToGames = () => {
    const gamesSection = document.getElementById('games');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Futuristic casino"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
            Solana Casino
          </span>
          <br />
          <span className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Provably Fair Gaming
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto">
          Experience the future of online gaming with instant blockchain payouts, 
          transparent odds, and lightning-fast transactions on Solana.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {!connected ? (
            <Button
              onClick={connect}
              size="lg"
              className="text-lg px-8 py-6 gap-2 shadow-lg shadow-primary/20"
              data-testid="button-hero-connect"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={scrollToGames}
              size="lg"
              className="text-lg px-8 py-6 gap-2 shadow-lg shadow-primary/20"
              data-testid="button-hero-play"
            >
              Start Playing
            </Button>
          )}
          <Button
            onClick={scrollToGames}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 backdrop-blur-sm bg-background/20 border-foreground/20"
            data-testid="button-hero-explore"
          >
            Explore Games
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-background/40 border-primary/30">
            <Shield className="w-4 h-4 mr-2" />
            Provably Fair
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-background/40 border-secondary/30">
            <Zap className="w-4 h-4 mr-2" />
            Instant Payouts
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-background/40 border-accent/30">
            <Lock className="w-4 h-4 mr-2" />
            Secure & Transparent
          </Badge>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
