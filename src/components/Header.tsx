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
    <header className="h-14 bg-[#0b0b0e] border-b border-[#25252b] flex items-center justify-between px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#00d4aa] flex items-center justify-center text-[#0b0b0e] font-bold">V</div>
        <span className="text-xl font-bold text-white">Velocity</span>
      </div>

      {/* Center: Navigation tabs */}
      <nav className="flex items-center gap-1">
        {headerTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
              ? 'bg-[#1b1b1f] text-[#00d4aa]'
              : 'text-[#9ca3af] hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right: Wallet */}
      <div>
        {connected && publicKey ? (
          <button onClick={() => disconnect()} className="flex items-center gap-2 px-4 py-2 bg-[#1b1b1f] rounded-lg hover:bg-[#25252b] transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
            <span className="text-white text-sm">{short(publicKey.toBase58())}</span>
          </button>
        ) : (
          <button onClick={() => setVisible(true)} className="px-4 py-2 bg-[#00d4aa] text-[#0b0b0e] rounded-lg font-semibold hover:bg-[#00c49a] transition-colors">Connect</button>
        )}
      </div>
    </header>
  );
};
