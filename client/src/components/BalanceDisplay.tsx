import { useWallet } from '@/contexts/TonWalletContext';
import { useLocation } from 'wouter';
import { Plus } from 'lucide-react';

export function BalanceDisplay() {
  const { appBalance } = useWallet();
  const [, setLocation] = useLocation();

  return (
    <button
      onClick={() => setLocation('/profile')}
      className="flex items-center gap-2 bg-gradient-to-r from-[#0088CC] to-[#33CCFF] hover:from-[#0099DD] hover:to-[#44DDFF] text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <img 
        src="/ton-icon.png" 
        alt="TON" 
        className="w-6 h-6"
      />
      <span className="font-bold text-lg">
        {appBalance.toFixed(0)} TON
      </span>
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <Plus className="w-4 h-4 text-[#0088CC]" />
      </div>
    </button>
  );
}
