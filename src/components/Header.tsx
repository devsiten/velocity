import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { usePriceStore, useUIStore } from '../lib/store';
import { useLivePrices } from '../hooks/useLiveData';

const headerTabs = [
  { id: 'swap', label: 'Trade' },
  { id: 'strategies', label: 'Auto Trading' },
  { id: 'positions', label: 'Profile' },
];

export const Header = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { prices, isLoading } = usePriceStore();
  const { activeTab, setActiveTab } = useUIStore();

  useLivePrices(10000);

  const sol = prices['So11111111111111111111111111111111111111112'];
  const jup = prices['JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'];

  const fmt = (p?: number) => (p ? (p >= 1 ? `$${p.toFixed(2)}` : `$${p.toFixed(5)}`) : '--');
  const fmtChg = (c?: number) => (c !== undefined ? `${c >= 0 ? '+' : ''}${c.toFixed(2)}%` : '');
  const short = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

  return (
    <header className="h-14 bg-[#0b0b0e] border-b border-[#25252b] flex items-center justify-between px-4">
      {/* Left: Price tickers */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1b1b1f]">
          <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" className="w-5 h-5 rounded-full" />
          <span className="text-white font-medium text-sm">SOL</span>
          {isLoading ? <span className="text-[#6b7280] animate-pulse">...</span> : (
            <>
              <span className="text-white text-sm">{fmt(sol?.price)}</span>
              <span className={`text-sm ${(sol?.change24h || 0) >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>{fmtChg(sol?.change24h)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1b1b1f]">
          <span>🐱</span>
          <span className="text-white font-medium text-sm">JUP</span>
          {isLoading ? <span className="text-[#6b7280] animate-pulse">...</span> : (
            <>
              <span className="text-white text-sm">{fmt(jup?.price)}</span>
              <span className={`text-sm ${(jup?.change24h || 0) >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>{fmtChg(jup?.change24h)}</span>
            </>
          )}
        </div>
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
