import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/TonWalletContext';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

const TRANSACTION_LIMIT = 1500;
const DAILY_LIMIT = 7500;

export function WithdrawModal({ open, onClose }: WithdrawModalProps) {
  const { address, appBalance, updateAppBalance } = useWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dailyWithdrawn, setDailyWithdrawn] = useState(0);
  const [error, setError] = useState('');

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleMaxClick = () => {
    const maxAmount = Math.min(appBalance, TRANSACTION_LIMIT, DAILY_LIMIT - dailyWithdrawn);
    setAmount(maxAmount.toString());
    setError('');
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const withdrawAmount = parseFloat(value);
    
    if (!value || isNaN(withdrawAmount)) {
      setError('');
      return;
    }

    if (withdrawAmount > appBalance) {
      setError('Not enough funds on the balance');
    } else if (withdrawAmount > TRANSACTION_LIMIT) {
      setError(`Transaction limit is ${TRANSACTION_LIMIT} TON`);
    } else if (withdrawAmount > (DAILY_LIMIT - dailyWithdrawn)) {
      setError(`Daily limit exceeded`);
    } else {
      setError('');
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawAmount > appBalance) {
      setError('Not enough funds on the balance');
      return;
    }

    if (withdrawAmount > TRANSACTION_LIMIT) {
      toast({
        title: 'Transaction Limit Exceeded',
        description: `Maximum ${TRANSACTION_LIMIT} TON per transaction`,
        variant: 'destructive',
      });
      return;
    }

    if (withdrawAmount > (DAILY_LIMIT - dailyWithdrawn)) {
      toast({
        title: 'Daily Limit Exceeded',
        description: `Daily limit is ${DAILY_LIMIT} TON`,
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      updateAppBalance(-withdrawAmount);
      setDailyWithdrawn(prev => prev + withdrawAmount);
      
      toast({
        title: 'Withdrawal Successful',
        description: `${withdrawAmount} TON withdrawn successfully`,
      });
      
      setAmount('');
      setError('');
      onClose();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      updateAppBalance(withdrawAmount);
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Failed to process withdrawal',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-gray-800" aria-describedby="withdraw-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Withdraw</DialogTitle>
          <p id="withdraw-description" className="text-sm text-gray-400">Using TON connect</p>
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
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`text-center text-4xl font-bold border-0 bg-transparent ${
                  error ? 'text-red-500' : 'text-white'
                } focus-visible:ring-0 focus-visible:ring-offset-0`}
                placeholder="0."
                min="0"
                step="0.1"
              />
              <span className="text-2xl text-gray-400 font-bold ml-2">TON</span>
            </div>
            <button
              onClick={handleMaxClick}
              className="text-[#0088CC] font-semibold mt-2 hover:text-[#0099DD] transition-colors"
            >
              Max
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Transaction limit</span>
              <span className="text-white">{TRANSACTION_LIMIT} TON</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Daily limit</span>
              <span className="text-white">{dailyWithdrawn} / {DAILY_LIMIT} TON</span>
            </div>
          </div>

          <Button
            onClick={handleWithdraw}
            disabled={isProcessing || !!error || !amount}
            className="w-full bg-[#0088CC] hover:bg-[#0099DD] text-white font-bold py-6 text-lg rounded-xl disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Withdraw'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
