import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useWallet } from '@/contexts/TonWalletContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface RouletteProps {
  onBack: () => void;
}

type BetType = 'number' | 'color';
type Color = 'red' | 'black';

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export function Roulette({ onBack }: RouletteProps) {
  const { appBalance, updateAppBalance } = useWallet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState('1');
  const [betType, setBetType] = useState<BetType>('color');
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color>('red');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const getNumberColor = (num: number): Color | 'green' => {
    if (num === 0) return 'green';
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const createGameMutation = useMutation({
    mutationFn: async (data: { gameType: string; betAmount: number; prediction: string | number }) => {
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

    setIsSpinning(true);
    setShowResult(false);
    
    // Deduct bet immediately
    updateAppBalance(-amount);
    
    try {
      const predictionValue = betType === 'number' ? selectedNumber : selectedColor;
      
      // Create game session
      const session = await createGameMutation.mutateAsync({
        gameType: 'roulette',
        betAmount: amount,
        prediction: predictionValue,
      });
      
      // Simulate roulette spin
      setTimeout(async () => {
        try {
          // Play the game
          const gameResult = await playGameMutation.mutateAsync({ sessionId: session.id });
          
          const outcome = parseInt(gameResult.result);
          setResult(outcome);
          setIsSpinning(false);
          
          const won = gameResult.won;
          const multiplier = betType === 'number' ? 36 : 2;
          // Add winnings if won (bet already deducted)
          const payout = won ? amount * multiplier : 0;
          
          updateAppBalance(payout);
          
          setTimeout(() => {
            setShowResult(true);
            toast({
              title: won ? '🎉 You Won!' : 'Better Luck Next Time',
              description: won 
                ? `You won ${(amount * (multiplier - 1)).toFixed(2)} TON!` 
                : `You lost ${amount.toFixed(2)} TON`,
              variant: won ? 'default' : 'destructive',
            });
          }, 500);
        } catch (playError) {
          console.error('Play error:', playError);
          setIsSpinning(false);
          // Refund the bet on error
          updateAppBalance(amount);
          toast({
            title: 'Error',
            description: 'Failed to play game. Bet refunded.',
            variant: 'destructive',
          });
        }
      }, 3000);
    } catch (error) {
      console.error('Game error:', error);
      setIsSpinning(false);
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
          data-testid="button-back-roulette"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>

        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-mono">Roulette</h2>
            <p className="text-muted-foreground">Bet on colors or numbers for big wins!</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary">Color: 48.6% • 2x</Badge>
              <Badge variant="secondary">Number: 2.7% • 36x</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Roulette Wheel Animation */}
            <div className="relative h-64 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isSpinning ? (
                  <motion.div
                    key="spinning"
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/50 border-8 border-foreground/10"
                    animate={{
                      rotate: [0, 360, 720, 1080, 1440, 1800, 2160],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                  >
                    <div className="text-4xl font-bold text-primary-foreground">
                      ?
                    </div>
                  </motion.div>
                ) : result !== null ? (
                  <motion.div
                    key={result}
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-lg border-8"
                    style={{
                      backgroundColor: 
                        getNumberColor(result) === 'red' ? '#ef4444' :
                        getNumberColor(result) === 'black' ? '#1f2937' :
                        '#22c55e',
                      borderColor: 
                        betType === 'number'
                          ? (result === selectedNumber ? '#22c55e' : '#ef4444')
                          : (getNumberColor(result) === selectedColor ? '#22c55e' : '#ef4444'),
                    }}
                  >
                    <span className="text-6xl font-bold text-white">{result}</span>
                    <span className="text-sm text-white/80 uppercase mt-1">
                      {getNumberColor(result)}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-4xl font-bold text-muted-foreground border-8 border-border"
                  >
                    <div className="text-center">
                      {betType === 'number' ? (
                        <div className="text-5xl">{selectedNumber}</div>
                      ) : (
                        <div className={`w-16 h-16 rounded-full ${
                          selectedColor === 'red' ? 'bg-red-500' : 'bg-gray-800'
                        }`} />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {showResult && result !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-center"
                >
                  <p className={`text-xl font-bold ${
                    (betType === 'number' && result === selectedNumber) ||
                    (betType === 'color' && getNumberColor(result) === selectedColor)
                      ? 'text-green-500'
                      : 'text-destructive'
                  }`}>
                    {(betType === 'number' && result === selectedNumber) ||
                    (betType === 'color' && getNumberColor(result) === selectedColor)
                      ? '🎉 You Won!'
                      : '😔 You Lost'}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Result: {result} ({getNumberColor(result)})
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bet Controls */}
            <div className="space-y-4 pt-6 border-t border-border">
              <Tabs value={betType} onValueChange={(v) => setBetType(v as BetType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="color" data-testid="tab-color">Color Bet</TabsTrigger>
                  <TabsTrigger value="number" data-testid="tab-number">Number Bet</TabsTrigger>
                </TabsList>
                
                <TabsContent value="color" className="space-y-3 mt-4">
                  <Label>Choose a Color</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setSelectedColor('red')}
                      variant={selectedColor === 'red' ? 'default' : 'outline'}
                      disabled={isSpinning}
                      className="h-16 bg-red-500 hover:bg-red-600 text-white border-red-600"
                      data-testid="button-select-red"
                    >
                      Red
                    </Button>
                    <Button
                      onClick={() => setSelectedColor('black')}
                      variant={selectedColor === 'black' ? 'default' : 'outline'}
                      disabled={isSpinning}
                      className="h-16 bg-gray-800 hover:bg-gray-900 text-white border-gray-900"
                      data-testid="button-select-black"
                    >
                      Black
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="number" className="space-y-3 mt-4">
                  <Label>Choose a Number (0-36)</Label>
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 37 }, (_, i) => i).map((num) => (
                      <Button
                        key={num}
                        onClick={() => setSelectedNumber(num)}
                        variant={selectedNumber === num ? 'default' : 'outline'}
                        disabled={isSpinning}
                        size="sm"
                        className="h-10 text-xs font-bold"
                        style={{
                          backgroundColor: selectedNumber === num ? undefined :
                            getNumberColor(num) === 'red' ? '#ef4444' :
                            getNumberColor(num) === 'black' ? '#1f2937' :
                            '#22c55e',
                          color: selectedNumber === num ? undefined : 'white',
                        }}
                        data-testid={`button-select-number-${num}`}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

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
                  disabled={isSpinning}
                  className="text-lg font-mono"
                  data-testid="input-bet-amount"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Balance: {appBalance.toFixed(2)} TON</span>
                  <span>
                    Potential Win: {(parseFloat(betAmount) * (betType === 'number' ? 36 : 2) || 0).toFixed(2)} TON
                  </span>
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
                disabled={isSpinning}
                size="lg"
                className="w-full"
                data-testid="button-spin-roulette"
              >
                {isSpinning ? 'Spinning...' : 'Spin Roulette'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
