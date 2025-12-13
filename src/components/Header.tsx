import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useUIStore } from '../lib/store';

const headerTabs = [
  { id: 'swap', label: 'Trade' },
  { id: 'strategies', label: 'Auto Trading' },
  { id: 'positions', label: 'Profile' },
];

export const Header = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { activeTab, setActiveTab } = useUIStore();

  const short = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

  return (
    <header className="h-14 bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-between px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#9945FF] font-bold">V</div>
        <span className="text-xl font-bold text-white">Velocity</span>
      </div>

      {/* Center: Navigation tabs */}
      <nav className="flex items-center gap-1">
        {headerTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
              ? 'bg-white text-[#9945FF]'
              : 'text-white hover:bg-white/20'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right: Wallet */}
      <div>
        {connected && publicKey ? (
          <button onClick={() => disconnect()} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-[#9945FF] text-sm font-medium">{short(publicKey.toBase58())}</span>
          </button>
        ) : (
          <button onClick={() => setVisible(true)} className="px-4 py-2 bg-white text-[#9945FF] rounded-lg font-semibold hover:bg-gray-100 transition-colors">Connect</button>
        )}
      </div>
    </header>
  );
};
