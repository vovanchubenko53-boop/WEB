import { Wallet, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';

export function Navigation() {
  const { connected, address, balance, connect, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#games', label: 'Games' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer">
              <div className="text-2xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SOLANA CASINO
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover-elevate active-elevate-2 transition-colors"
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Wallet Section */}
          <div className="flex items-center gap-3">
            {connected && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-card-border">
                <span className="text-sm font-mono font-semibold text-primary" data-testid="text-balance">
                  {balance.toFixed(2)} SOL
                </span>
              </div>
            )}
            
            {connected ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block px-3 py-2 rounded-md bg-muted/50 border border-border">
                  <span className="text-xs font-mono text-muted-foreground" data-testid="text-wallet-address">
                    {truncateAddress(address!)}
                  </span>
                </div>
                <Button
                  onClick={disconnect}
                  variant="outline"
                  size="sm"
                  data-testid="button-disconnect-wallet"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connect}
                variant="default"
                size="sm"
                className="gap-2"
                data-testid="button-connect-wallet"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover-elevate active-elevate-2"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover-elevate active-elevate-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </a>
              ))}
              {connected && (
                <div className="px-3 py-2 text-sm font-mono text-muted-foreground">
                  Balance: <span className="text-primary font-semibold">{balance.toFixed(2)} SOL</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
