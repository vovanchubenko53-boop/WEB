import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTonAddress, useTonWallet } from '@tonconnect/ui-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface TonWalletContextType {
  connected: boolean;
  address: string | null;
  walletBalance: number;
  appBalance: number;
  isLoadingBalance: boolean;
  refreshBalance: () => void;
}

const TonWalletContext = createContext<TonWalletContextType | undefined>(undefined);

export function TonWalletProvider({ children }: { children: ReactNode }) {
  const tonAddress = useTonAddress();
  const tonWallet = useTonWallet();
  const [walletBalance, setWalletBalance] = useState(0);

  const connected = !!tonWallet;

  const { data: user, isLoading: isLoadingBalance, refetch: refreshBalance } = useQuery<User>({
    queryKey: ['/api/users/me', tonAddress],
    enabled: connected && !!tonAddress,
    queryFn: async () => {
      const response = await fetch(`/api/users/me?address=${tonAddress}`);
      if (!response.ok) {
        if (response.status === 404) {
          const registerResponse = await apiRequest('/api/users/register', {
            method: 'POST',
            body: JSON.stringify({ tonAddress }),
          });
          return registerResponse;
        }
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
    refetchInterval: 5000,
  });

  const appBalance = user ? parseFloat(user.balance) : 0;

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

  return (
    <TonWalletContext.Provider
      value={{
        connected,
        address: tonAddress || null,
        walletBalance,
        appBalance,
        isLoadingBalance,
        refreshBalance,
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
