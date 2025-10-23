import { User, Wallet, TrendingUp, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/TonWalletContext';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { GameHistory } from '@/components/GameHistory';

export function Profile() {
  const { connected, address, balance } = useWallet();
  const [tonConnectUI] = useTonConnectUI();

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Profile
              </span>
            </h1>
          </div>
        </div>

        {!connected ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your TON wallet to view your profile and game history
            </p>
            <Button
              onClick={() => tonConnectUI.openModal()}
              size="lg"
              className="w-full"
              data-testid="button-connect-wallet"
            >
              Connect TON Wallet
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                    <p className="text-lg font-mono font-semibold" data-testid="text-wallet-address">
                      {formatAddress(address)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Balance</p>
                    <p className="text-2xl font-bold font-mono" data-testid="text-balance">
                      {balance.toFixed(2)} TON
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <History className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Total Games</p>
                    <p className="text-2xl font-bold font-mono" data-testid="text-total-games">
                      0
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Games
              </h2>
              <GameHistory />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
