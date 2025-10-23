import { Shield, Zap, Lock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function HowItWorks() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Provably Fair Gaming',
      description: 'Every game result is verifiable on the Solana blockchain. Our smart contracts use cryptographic algorithms to ensure true randomness that cannot be manipulated by anyone - not even us.',
      color: 'from-primary to-primary/50',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Blockchain Payouts',
      description: 'Win and receive your SOL immediately. No waiting periods, no withdrawal limits, no processing delays. Solana\'s lightning-fast network ensures your winnings are in your wallet within seconds.',
      color: 'from-secondary to-secondary/50',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Secure & Transparent',
      description: 'Your funds never leave your wallet until you place a bet. All transactions are publicly verifiable on the blockchain. Complete transparency means complete trust.',
      color: 'from-accent to-accent/50',
    },
  ];

  const steps = [
    'Connect your Solana wallet (Phantom, Solflare, or any compatible wallet)',
    'Choose your favorite game: Coin Flip, Dice, or Roulette',
    'Place your bet and make your prediction',
    'Watch the outcome in real-time with smooth animations',
    'Winnings are instantly credited to your wallet!',
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose Solana Casino?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of online gaming with blockchain technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate transition-all duration-300 transform hover:scale-105"
              data-testid={`feature-${index}`}
            >
              <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* How to Play Steps */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">How to Play</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-card-border hover-elevate transition-all"
                data-testid={`step-${index}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="flex-1 pt-1">{step}</p>
                {index === steps.length - 1 && (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
