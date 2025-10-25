import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/TonWalletContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface CoinFlipProps {
  onBack: () => void;
}

export function CoinFlip({ onBack }: CoinFlipProps) {
  const { appBalance, updateAppBalance } = useWallet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState('1');
  const [prediction, setPrediction] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const createGameMutation = useMutation({
    mutationFn: async (data: { gameType: string; betAmount: number; prediction: string }) => {
      const res = await apiRequest('POST', '/api/games/create', data);
      return await res.json();
    },
  });

  const playGameMutation = useMutation({
    mutationFn: async (data: { sessionId: string }) => {
      const res = await apiRequest('POST', '/api/games/play', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games/history'] });
    },
  });

  const handlePlay = async () => {
    const amount = parseFloat(betAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Bet',
        description: 'Please enter a valid bet amount',
        variant: 'destructive',
      });
      return;
    }

    if (amount > appBalance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You don\'t have enough TON for this bet',
        variant: 'destructive',
      });
      return;
    }

    setIsFlipping(true);
    setShowResult(false);
    
    // Deduct bet immediately
    updateAppBalance(-amount);
    
    try {
      // Create game session
      const session = await createGameMutation.mutateAsync({
        gameType: 'coinflip',
        betAmount: amount,
        prediction,
      });
      
      // Simulate coin flip animation
      setTimeout(async () => {
        try {
          // Play the game
          const gameResult = await playGameMutation.mutateAsync({ sessionId: session.id });
          
          const outcome = gameResult.result as 'heads' | 'tails';
          setResult(outcome);
          setIsFlipping(false);
          
          const won = gameResult.won;
          // Add winnings if won (bet already deducted)
          const payout = won ? amount * 2 : 0;
          
          updateAppBalance(payout);
          
          setTimeout(() => {
            setShowResult(true);
            toast({
              title: won ? '🎉 You Won!' : 'Better Luck Next Time',
              description: won 
                ? `You won ${amount.toFixed(2)} TON!` 
                : `You lost ${amount.toFixed(2)} TON`,
              variant: won ? 'default' : 'destructive',
            });
          }, 500);
        } catch (playError) {
          console.error('Play error:', playError);
          setIsFlipping(false);
          // Refund the bet on error
          updateAppBalance(amount);
          toast({
            title: 'Error',
            description: 'Failed to play game. Bet refunded.',
            variant: 'destructive',
          });
        }
      }, 2000);
    } catch (error) {
      console.error('Game error:', error);
      setIsFlipping(false);
      // Refund the bet on error
      updateAppBalance(amount);
      toast({
        title: 'Error',
        description: 'Failed to create game. Bet refunded.',
        variant: 'destructive',
      });
    }
  };

  const resetGame = () => {
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="button-back-coinflip"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>

        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Coins className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-mono">Coin Flip</h2>
            </div>
            <p className="text-muted-foreground">Choose heads or tails and double your bet!</p>
            <Badge variant="secondary" className="mx-auto">50% Win Rate • 2x Payout</Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Coin Animation */}
            <div className="relative h-64 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isFlipping ? (
                  <motion.div
                    key="flipping"
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-lg shadow-primary/50"
                    animate={{
                      rotateY: [0, 360, 720, 1080, 1440, 1800],
                      scale: [1, 1.1, 1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  >
                    ?
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key={result}
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    exit={{ scale: 0 }}
                    className={`w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ${
                      result === prediction
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/50'
                        : 'bg-gradient-to-br from-destructive to-red-600 text-white shadow-destructive/50'
                    }`}
                  >
                    {result.toUpperCase()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-2xl font-bold text-muted-foreground border-4 border-border"
                  >
                    {prediction.toUpperCase()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-center"
                >
                  <p className={`text-xl font-bold ${
                    result === prediction ? 'text-green-500' : 'text-destructive'
                  }`}>
                    {result === prediction ? '🎉 You Won!' : '😔 You Lost'}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    The coin landed on {result}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bet Controls */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setPrediction('heads')}
                  variant={prediction === 'heads' ? 'default' : 'outline'}
                  disabled={isFlipping}
                  className="h-16"
                  data-testid="button-select-heads"
                >
                  Heads
                </Button>
                <Button
                  onClick={() => setPrediction('tails')}
                  variant={prediction === 'tails' ? 'default' : 'outline'}
                  disabled={isFlipping}
                  className="h-16"
                  data-testid="button-select-tails"
                >
                  Tails
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bet-amount">Bet Amount (TON)</Label>
                <Input
                  id="bet-amount"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={appBalance}
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={isFlipping}
                  className="text-lg font-mono"
                  data-testid="input-bet-amount"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Balance: {appBalance.toFixed(2)} TON</span>
                  <span>Potential Win: {(parseFloat(betAmount) * 2 || 0).toFixed(2)} TON</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {showResult ? (
              <Button
                onClick={resetGame}
                size="lg"
                className="w-full"
                data-testid="button-play-again"
              >
                Play Again
              </Button>
            ) : (
              <Button
                onClick={handlePlay}
                disabled={isFlipping}
                size="lg"
                className="w-full"
                data-testid="button-flip-coin"
              >
                {isFlipping ? 'Flipping...' : 'Flip Coin'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
