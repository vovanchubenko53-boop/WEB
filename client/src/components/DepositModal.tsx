import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/TonWalletContext';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

export function DepositModal({ open, onClose }: DepositModalProps) {
  const { address, refreshBalance } = useWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [amount, setAmount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositId, setDepositId] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (depositId && !isConfirmed) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/deposits/status/${depositId}`);
          const deposit = await response.json();
          
          if (deposit.status === 'confirmed') {
            setIsConfirmed(true);
            clearInterval(interval);
            refreshBalance();
            toast({
              title: 'Deposit Confirmed',
              description: `${amount} TON has been credited to your balance`,
            });
            setTimeout(() => {
              onClose();
              setDepositId(null);
              setIsConfirmed(false);
              setAmount('1');
            }, 2000);
          }
        } catch (error) {
          console.error('Error checking deposit status:', error);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [depositId, isConfirmed, amount, refreshBalance, toast, onClose]);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid deposit amount',
        variant: 'destructive',
      });
      return;
    }

    if (!address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your TON wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const res = await apiRequest('POST', '/api/deposits/initiate', {
        tonAddress: address,
        amount: depositAmount,
      });
      const deposit = await res.json();

      setDepositId(deposit.id);

      const casinoWallet = import.meta.env.VITE_CASINO_WALLET_ADDRESS;
      
      if (!casinoWallet) {
        toast({
          title: 'Configuration Error',
          description: 'Casino wallet address not configured. Please contact support.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }
      
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: casinoWallet,
            amount: String(Math.floor(depositAmount * 1000000000)),
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);
      
      toast({
        title: 'Transaction Sent',
        description: 'Waiting for confirmation...',
      });
      
    } catch (error: any) {
      console.error('Deposit error:', error);
      
      let errorMessage = 'Failed to process deposit';
      
      if (error?.message) {
        if (error.message.includes('User rejected') || error.message.includes('rejected')) {
          errorMessage = 'Transaction was cancelled';
        } else if (error.message.includes('Insufficient funds') || error.message.includes('insufficient')) {
          errorMessage = 'Insufficient funds in your wallet';
        } else if (error.message.includes('WalletAlreadyConnectedError')) {
          errorMessage = 'Wallet already connected. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Deposit Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setDepositId(null);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-gray-800" aria-describedby="deposit-description" data-testid="dialog-deposit">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white" data-testid="text-deposit-title">Deposit</DialogTitle>
          <p id="deposit-description" className="text-sm text-gray-400">Top-up only in TON</p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Your connected wallet</p>
            <div className="flex items-center justify-center gap-2 text-white">
              <Wallet className="w-4 h-4 text-[#0088CC]" />
              <span className="font-mono" data-testid="text-wallet-address">{formatAddress(address)}</span>
            </div>
          </div>

          {isConfirmed ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">Deposit Confirmed!</p>
              <p className="text-gray-400 mt-2">Your balance has been updated</p>
            </div>
          ) : depositId && isProcessing ? (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-[#0088CC] mx-auto mb-4 animate-spin" />
              <p className="text-white text-lg font-semibold">Processing Transaction...</p>
              <p className="text-gray-400 mt-2">Please wait while we confirm your deposit</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-center text-4xl font-bold border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  data-testid="input-deposit-amount"
                />
                <span className="text-2xl text-gray-400 font-bold ml-2">TON</span>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={isProcessing}
                className="w-full bg-[#0088CC] hover:bg-[#0099DD] text-white font-bold py-6 text-lg rounded-xl"
                data-testid="button-deposit"
              >
                {isProcessing ? 'Processing...' : 'Deposit'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
