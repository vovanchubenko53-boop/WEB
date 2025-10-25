import { useState } from 'react';
import { useWallet } from '@/contexts/TonWalletContext';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { DepositModal } from '@/components/DepositModal';
import { WithdrawModal } from '@/components/WithdrawModal';
import { Plus, ArrowUp, SlidersHorizontal, Wallet } from 'lucide-react';
import { GameHistory } from '@/components/GameHistory';

export function Profile() {
  const { connected, address, appBalance, walletBalance } = useWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDeposit = () => {
    if (!connected) {
      tonConnectUI.openModal();
    } else {
      setDepositModalOpen(true);
    }
  };

  const handleWithdraw = () => {
    if (!connected) {
      tonConnectUI.openModal();
    } else {
      setWithdrawModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-black">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!connected ? (
            <button
              onClick={() => tonConnectUI.openModal()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Wallet className="w-5 h-5" />
              <span className="text-sm">Wallet not connected</span>
            </button>
          ) : (
            <div className="flex-1"></div>
          )}
          
          <button 
            onClick={() => tonConnectUI.openModal()}
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Connect +
          </button>
        </div>

        {/* Wallet Info Above Card */}
        {connected && (
          <button
            onClick={() => tonConnectUI.openModal()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 w-full"
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm">
              Your wallet {formatAddress(address)} | {walletBalance.toFixed(1)} TON
            </span>
            <span className="text-xs ml-auto">&gt;</span>
          </button>
        )}

        {/* Main Wallet Card */}
        <div className="bg-gradient-to-br from-[#0088CC] to-[#33CCFF] rounded-3xl p-8 mb-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-white text-6xl">🏠</div>
            <div className="absolute top-4 right-4 text-white text-6xl">🏠</div>
            <div className="absolute bottom-4 left-4 text-white text-6xl">🏠</div>
            <div className="absolute bottom-4 right-4 text-white text-6xl">🏠</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl">🏠</div>
          </div>

          <div className="relative z-10">
            <p className="text-white/80 text-sm text-center mb-2">Portals wallet balance</p>
            <div className="text-center mb-6">
              <span className="text-white text-5xl font-bold">{appBalance.toFixed(0)} TON</span>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDeposit}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <span>Deposit</span>
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={handleWithdraw}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <span>Withdraw</span>
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Recent Actions</h2>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">
              <span className="text-sm">Filter</span>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl">
            <GameHistory />
          </div>

          {/* Empty State */}
          {!connected && (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0088CC] to-[#33CCFF] rounded-full flex items-center justify-center">
                  <span className="text-4xl">🎰</span>
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">Make first transaction</h3>
              <p className="text-gray-400">And start trading</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DepositModal open={depositModalOpen} onClose={() => setDepositModalOpen(false)} />
      <WithdrawModal open={withdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} />
    </div>
  );
}
