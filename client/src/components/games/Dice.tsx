import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Dices } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface DiceProps {
  onBack: () => void;
}

export function Dice({ onBack }: DiceProps) {
  const { balance, updateBalance } = useWallet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState('1');
  const [prediction, setPrediction] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const createGameMutation = useMutation({
    mutationFn: async (data: { gameType: string; betAmount: number; prediction: number }) => {
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

    if (amount > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You don\'t have enough SOL for this bet',
        variant: 'destructive',
      });
      return;
    }

    setIsRolling(true);
    setShowResult(false);
    
    // Deduct bet immediately
    updateBalance(-amount);
    
    try {
      // Create game session
      const session = await createGameMutation.mutateAsync({
        gameType: 'dice',
        betAmount: amount,
        prediction: prediction,
      });
      
      // Simulate dice roll animation
      setTimeout(async () => {
        try {
          // Play the game
          const gameResult = await playGameMutation.mutateAsync({ sessionId: session.id });
          
          const outcome = parseInt(gameResult.result);
          setResult(outcome);
          setIsRolling(false);
          
          const won = gameResult.won;
          // Add winnings if won (bet already deducted, 6x payout total)
          const payout = won ? amount * 6 : 0;
          
          updateBalance(payout);
          
          setTimeout(() => {
            setShowResult(true);
            toast({
              title: won ? '🎉 You Won!' : 'Better Luck Next Time',
              description: won 
                ? `You won ${(amount * 5).toFixed(2)} SOL!` 
                : `You lost ${amount.toFixed(2)} SOL`,
              variant: won ? 'default' : 'destructive',
            });
          }, 500);
        } catch (playError) {
          console.error('Play error:', playError);
          setIsRolling(false);
          // Refund the bet on error
          updateBalance(amount);
          toast({
            title: 'Error',
            description: 'Failed to play game. Bet refunded.',
            variant: 'destructive',
          });
        }
      }, 2000);
    } catch (error) {
      console.error('Game error:', error);
      setIsRolling(false);
      // Refund the bet on error
      updateBalance(amount);
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
          data-testid="button-back-dice"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>

        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Dices className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-mono">Dice Roll</h2>
            </div>
            <p className="text-muted-foreground">Guess the number and win 6x your bet!</p>
            <Badge variant="secondary" className="mx-auto">16.7% Win Rate • 6x Payout</Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Dice Animation */}
            <div className="relative h-64 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isRolling ? (
                  <motion.div
                    key="rolling"
                    className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl font-bold text-primary-foreground shadow-lg shadow-primary/50"
                    animate={{
                      rotateX: [0, 360, 720],
                      rotateY: [0, 360, 720],
                      scale: [1, 1.2, 1],
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
                    className={`w-32 h-32 rounded-xl flex items-center justify-center text-5xl font-bold shadow-lg ${
                      result === prediction
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/50'
                        : 'bg-gradient-to-br from-destructive to-red-600 text-white shadow-destructive/50'
                    }`}
                  >
                    {result}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 rounded-xl bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-5xl font-bold text-muted-foreground border-4 border-border"
                  >
                    {prediction}
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
                    {result === prediction ? '🎉 Perfect Guess!' : '😔 Wrong Number'}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    The dice rolled {result}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bet Controls */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="space-y-2">
                <Label>Choose Your Number (1-6)</Label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Button
                      key={num}
                      onClick={() => setPrediction(num)}
                      variant={prediction === num ? 'default' : 'outline'}
                      disabled={isRolling}
                      className="h-12 text-lg font-bold"
                      data-testid={`button-select-${num}`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bet-amount">Bet Amount (SOL)</Label>
                <Input
                  id="bet-amount"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={balance}
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={isRolling}
                  className="text-lg font-mono"
                  data-testid="input-bet-amount"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Balance: {balance.toFixed(2)} SOL</span>
                  <span>Potential Win: {(parseFloat(betAmount) * 6 || 0).toFixed(2)} SOL</span>
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
                disabled={isRolling}
                size="lg"
                className="w-full"
                data-testid="button-roll-dice"
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
