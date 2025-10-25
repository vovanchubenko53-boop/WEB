import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTonAddress, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';

interface TonWalletContextType {
  connected: boolean;
  address: string | null;
  walletBalance: number;
  appBalance: number;
  updateAppBalance: (amount: number) => void;
  setAppBalance: (amount: number) => void;
}

const TonWalletContext = createContext<TonWalletContextType | undefined>(undefined);

export function TonWalletProvider({ children }: { children: ReactNode }) {
  const tonAddress = useTonAddress();
  const tonWallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [appBalance, setAppBalanceState] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  const connected = !!tonWallet;

  useEffect(() => {
    const savedBalance = localStorage.getItem('ton_app_balance');
    if (savedBalance) {
      setAppBalanceState(parseFloat(savedBalance));
    }
  }, []);

  useEffect(() => {
    if (connected && tonAddress) {
      fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${tonAddress}`)
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            const balance = parseInt(data.result) / 1000000000;
            setWalletBalance(balance);
          }
        })
        .catch(() => {
          setWalletBalance(0);
        });
    } else {
      setWalletBalance(0);
    }
  }, [connected, tonAddress]);

  const updateAppBalance = (amount: number) => {
    setAppBalanceState(prev => {
      const newBalance = prev + amount;
      localStorage.setItem('ton_app_balance', newBalance.toString());
      return newBalance;
    });
  };

  const setAppBalance = (amount: number) => {
    setAppBalanceState(amount);
    localStorage.setItem('ton_app_balance', amount.toString());
  };

  return (
    <TonWalletContext.Provider
      value={{
        connected,
        address: tonAddress || null,
        walletBalance,
        appBalance,
        updateAppBalance,
        setAppBalance,
      }}
    >
      {children}
    </TonWalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(TonWalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a TonWalletProvider');
  }
  return context;
}
