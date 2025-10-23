import { TrendingUp, Users, Gamepad2, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  testId: string;
}

function StatCard({ icon, label, value, testId }: StatCardProps) {
  return (
    <Card className="p-6 hover-elevate transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono" data-testid={testId}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function Stats() {
  const [stats, setStats] = useState({
    volume: '0',
    players: '0',
    games: '0',
    winnings: '0',
  });

  useEffect(() => {
    // Simulate animated counter
    const timer = setTimeout(() => {
      setStats({
        volume: '1,234,567',
        players: '2,450',
        games: '18,932',
        winnings: '856,234',
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Live Statistics
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time data from our provably fair gaming platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Volume"
            value={`${stats.volume} SOL`}
            testId="stat-volume"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Active Players"
            value={stats.players}
            testId="stat-players"
          />
          <StatCard
            icon={<Gamepad2 className="w-6 h-6" />}
            label="Games Played"
            value={stats.games}
            testId="stat-games"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Winnings"
            value={`${stats.winnings} SOL`}
            testId="stat-winnings"
          />
        </div>
      </div>
    </section>
  );
}
