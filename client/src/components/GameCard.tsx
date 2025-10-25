import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  minBet: string;
  maxWin: string;
  rtp: string;
  onPlay: () => void;
  testId?: string;
}

export function GameCard({
  title,
  description,
  image,
  minBet,
  maxWin,
  rtp,
  onPlay,
  testId,
}: GameCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 transform hover:scale-105 border-2 border-card-border">
      {/* Game Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Card Content */}
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl font-bold font-mono text-foreground" data-testid={`text-${testId}-title`}>
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs font-mono">
            {rtp}% RTP
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Min Bet</span>
          <span className="font-mono font-semibold text-foreground">{minBet} TON</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Max Win</span>
          <span className="font-mono font-semibold text-primary">{maxWin} TON</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={onPlay}
          className="w-full gap-2 group"
          size="lg"
          data-testid={`button-play-${testId}`}
        >
          Play Now
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
