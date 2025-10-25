import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/TonWalletContext';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

export function DepositModal({ open, onClose }: DepositModalProps) {
  const { address, updateAppBalance, walletBalance } = useWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [amount, setAmount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: "EQDkMPNjKkB3jqW5oBpB1TfJO3xVxLMh9mh3v7NqJcNGJxwb",
            amount: String(Math.floor(depositAmount * 1000000000)),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      if (result) {
        updateAppBalance(depositAmount);
        
        toast({
          title: 'Deposit Successful',
          description: `${depositAmount} TON deposited to your game balance`,
        });
        
        setAmount('1');
        onClose();
      }
    } catch (error: any) {
      console.error('Deposit error:', error);
      
      let errorMessage = 'Failed to process deposit';
      
      if (error.message) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction was cancelled';
        } else if (error.message.includes('Insufficient funds')) {
          errorMessage = 'Insufficient funds in your wallet';
        } else if (error.message.includes('address')) {
          errorMessage = 'Invalid address format. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Deposit Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Deposit</DialogTitle>
          <p className="text-sm text-gray-400">Top-up only in TON</p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Your connected wallet</p>
            <div className="flex items-center justify-center gap-2 text-white">
              <Wallet className="w-4 h-4 text-[#0088CC]" />
              <span className="font-mono">{formatAddress(address)}</span>
            </div>
          </div>

          <div className="text-center">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-center text-4xl font-bold border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
              min="0"
              step="0.1"
            />
            <span className="text-2xl text-gray-400 font-bold ml-2">TON</span>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full bg-[#0088CC] hover:bg-[#0099DD] text-white font-bold py-6 text-lg rounded-xl"
          >
            {isProcessing ? 'Processing...' : 'Deposit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
