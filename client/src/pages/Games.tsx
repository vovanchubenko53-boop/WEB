import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { CoinFlip } from '@/components/games/CoinFlip';
import { Dice } from '@/components/games/Dice';
import { Roulette } from '@/components/games/Roulette';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Games() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Casino Games
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your game and test your luck on TON blockchain
          </p>
        </div>

        <Tabs defaultValue="coinflip" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="coinflip" data-testid="tab-coinflip">
              Coin Flip
            </TabsTrigger>
            <TabsTrigger value="dice" data-testid="tab-dice">
              Dice
            </TabsTrigger>
            <TabsTrigger value="roulette" data-testid="tab-roulette">
              Roulette
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coinflip">
            <CoinFlip onBack={() => {}} />
          </TabsContent>

          <TabsContent value="dice">
            <Dice onBack={() => {}} />
          </TabsContent>

          <TabsContent value="roulette">
            <Roulette onBack={() => {}} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
