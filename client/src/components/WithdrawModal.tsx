import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/TonWalletContext';
import { Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

const TRANSACTION_LIMIT = 1500;
const DAILY_LIMIT = 7500;

export function WithdrawModal({ open, onClose }: WithdrawModalProps) {
  const { address, appBalance, refreshBalance } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      const res = await apiRequest('POST', '/api/withdrawals/request', {
        tonAddress: address,
        amount: withdrawAmount,
      });
      const withdrawal = await res.json();

      setDailyWithdrawn(prev => prev + withdrawAmount);
      setIsSuccess(true);
      refreshBalance();
      
      toast({
        title: 'Withdrawal Successful',
        description: `${withdrawAmount} TON has been sent to your wallet`,
      });
      
      setTimeout(() => {
        setAmount('');
        setError('');
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Withdrawal error:', error);
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
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-gray-800" aria-describedby="withdraw-description" data-testid="dialog-withdraw">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white" data-testid="text-withdraw-title">Withdraw</DialogTitle>
          <p id="withdraw-description" className="text-sm text-gray-400">Using TON connect</p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Your connected wallet</p>
            <div className="flex items-center justify-center gap-2 text-white">
              <Wallet className="w-4 h-4 text-[#0088CC]" />
              <span className="font-mono" data-testid="text-wallet-address">{formatAddress(address)}</span>
            </div>
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">Withdrawal Successful!</p>
              <p className="text-gray-400 mt-2">TON sent to your wallet</p>
            </div>
          ) : isProcessing ? (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-[#0088CC] mx-auto mb-4 animate-spin" />
              <p className="text-white text-lg font-semibold">Processing Withdrawal...</p>
              <p className="text-gray-400 mt-2">Please wait...</p>
            </div>
          ) : (
            <>
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
                    data-testid="input-withdraw-amount"
                  />
                  <span className="text-2xl text-gray-400 font-bold ml-2">TON</span>
                </div>
                <button
                  onClick={handleMaxClick}
                  className="text-[#0088CC] font-semibold mt-2 hover:text-[#0099DD] transition-colors"
                  data-testid="button-max-amount"
                >
                  Max
                </button>
                {error && (
                  <p className="text-red-500 text-sm mt-2" data-testid="text-error">{error}</p>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Transaction limit</span>
                  <span className="text-white" data-testid="text-transaction-limit">{TRANSACTION_LIMIT} TON</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Daily limit</span>
                  <span className="text-white" data-testid="text-daily-limit">{dailyWithdrawn} / {DAILY_LIMIT} TON</span>
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={isProcessing || !!error || !amount}
                className="w-full bg-[#0088CC] hover:bg-[#0099DD] text-white font-bold py-6 text-lg rounded-xl disabled:opacity-50"
                data-testid="button-withdraw"
              >
                {isProcessing ? 'Processing...' : 'Withdraw'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
