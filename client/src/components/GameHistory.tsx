import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { GameSession } from '@shared/schema';

export function GameHistory() {
  const { data: history, isLoading } = useQuery<GameSession[]>({
    queryKey: ['/api/games/history'],
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Recent Plays</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted/30 rounded-md animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  const recentGames = history?.slice(0, 10) || [];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Recent Plays
      </h3>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {recentGames.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No games played yet</p>
              <p className="text-xs mt-2">Start playing to see your history</p>
            </div>
          ) : (
            recentGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card border border-card-border hover-elevate transition-all"
                data-testid={`game-history-${game.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {game.gameType.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(game.createdAt!).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Bet: </span>
                    <span className="font-mono font-semibold">{game.betAmount} TON</span>
                  </div>
                </div>
                
                <div className="text-right">
                  {game.won ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <Trophy className="w-4 h-4" />
                      <span className="font-mono font-bold">+{game.payout} TON</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-destructive">
                      <TrendingDown className="w-4 h-4" />
                      <span className="font-mono font-bold">-{game.betAmount} TON</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
