import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTonAddress, useTonWallet } from '@tonconnect/ui-react';

interface TonWalletContextType {
  connected: boolean;
  address: string | null;
  balance: number;
  updateBalance: (amount: number) => void;
}

const TonWalletContext = createContext<TonWalletContextType | undefined>(undefined);

export function TonWalletProvider({ children }: { children: ReactNode }) {
  const tonAddress = useTonAddress();
  const tonWallet = useTonWallet();
  const [balance, setBalance] = useState(1000);

  const connected = !!tonWallet;

  useEffect(() => {
    const savedBalance = localStorage.getItem('ton_wallet_balance');
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
  }, []);

  const updateBalance = (amount: number) => {
    setBalance(prev => {
      const newBalance = prev + amount;
      localStorage.setItem('ton_wallet_balance', newBalance.toString());
      return newBalance;
    });
  };

  return (
    <TonWalletContext.Provider
      value={{
        connected,
        address: tonAddress || null,
        balance,
        updateBalance,
      }}
    >
      {children}
    </TonWalletContext.Provider>
  );
}

export function useTonWallet() {
  const context = useContext(TonWalletContext);
  if (context === undefined) {
    throw new Error('useTonWallet must be used within a TonWalletProvider');
  }
  return context;
}
