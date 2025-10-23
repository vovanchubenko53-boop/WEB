import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  balance: number;
  connect: () => void;
  disconnect: () => void;
  updateBalance: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(1000); // Starting balance for simulation

  useEffect(() => {
    // Load saved wallet state from localStorage
    const savedAddress = localStorage.getItem('wallet_address');
    const savedBalance = localStorage.getItem('wallet_balance');
    
    if (savedAddress) {
      setAddress(savedAddress);
      setConnected(true);
    }
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
  }, []);

  const connect = () => {
    // Simulate wallet connection
    const simulatedAddress = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setAddress(simulatedAddress);
    setConnected(true);
    localStorage.setItem('wallet_address', simulatedAddress);
  };

  const disconnect = () => {
    setAddress(null);
    setConnected(false);
    localStorage.removeItem('wallet_address');
  };

  const updateBalance = (amount: number) => {
    setBalance(prev => {
      const newBalance = prev + amount;
      localStorage.setItem('wallet_balance', newBalance.toString());
      return newBalance;
    });
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        balance,
        connect,
        disconnect,
        updateBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
