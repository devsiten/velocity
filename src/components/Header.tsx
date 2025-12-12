import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useBalance } from '../hooks/useBalance';
import { useUIStore } from '../lib/store';
import { shortenAddress } from '../lib/constants';

export const Header: FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { solBalance } = useBalance();
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <header className="sticky top-0 z-30 glass border-b border-border-primary">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/velocity.svg" alt="Velocity" className="w-8 h-8" />
            <span className="text-xl font-bold text-gradient">Velocity</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {(['trade', 'strategies', 'leaderboard'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize
                  ${activeTab === tab 
                    ? 'text-accent-primary bg-accent-primary/10' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {connected && publicKey ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block px-3 py-1.5 bg-bg-elevated rounded-lg">
                <span className="text-sm text-text-muted">
                  {solBalance.toFixed(4)} <span className="text-accent-primary">SOL</span>
                </span>
              </div>
              
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-4 py-2 bg-bg-elevated hover:bg-border-primary 
                  rounded-lg border border-border-primary transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                <span className="mono text-sm text-text-secondary group-hover:text-text-primary">
                  {shortenAddress(publicKey.toBase58())}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setVisible(true)}
              className="btn btn-primary"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="md:hidden flex border-t border-border-primary">
        {(['trade', 'strategies', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors capitalize
              ${activeTab === tab 
                ? 'text-accent-primary border-b-2 border-accent-primary' 
                : 'text-text-muted'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
};
