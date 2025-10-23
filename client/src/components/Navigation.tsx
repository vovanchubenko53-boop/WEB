import { TonConnectButton } from '@tonconnect/ui-react';
import { useWallet } from '@/contexts/TonWalletContext';
import { Link } from 'wouter';

export function Navigation() {
  const { connected, balance } = useWallet();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/games" data-testid="link-home">
            <div className="flex items-center space-x-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer">
              <div className="text-xl sm:text-2xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TON CASINO
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {connected && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-card-border">
                <span className="text-sm font-mono font-semibold text-primary" data-testid="text-balance">
                  {balance.toFixed(2)} TON
                </span>
              </div>
            )}
            
            <div data-testid="ton-connect-button">
              <TonConnectButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
