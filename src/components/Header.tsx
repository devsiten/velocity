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
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 bg-[#0d1117]/80 backdrop-blur-xl border-b border-[#1e2530]">
      <div className="px-4 lg:px-8 h-14 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-[#1e2530] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#0d1117] border border-[#1e2530] rounded-lg w-64">
            <svg className="w-4 h-4 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for any Token, Wallet or Feature"
              className="flex-1 bg-transparent text-sm text-white placeholder-[#8b949e] focus:outline-none"
            />
          </div>

          {/* Nav tabs - shown on larger screens */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {['Swap', 'Terminal', 'Perps', 'Lend', 'Predict', 'Portfolio', 'More'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                  ${tab === 'Swap'
                    ? 'text-white'
                    : 'text-[#8b949e] hover:text-white hover:bg-[#1e2530]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Rewards */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#8b949e] hover:text-white hover:bg-[#1e2530] rounded-lg transition-colors">
            🎁 Rewards
          </button>

          {/* Wallet */}
          {connected && publicKey ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block px-3 py-1.5 bg-[#1e2530] rounded-lg">
                <span className="text-sm text-[#8b949e]">
                  {solBalance.toFixed(4)} <span className="text-[#00ffa3]">SOL</span>
                </span>
              </div>

              <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1e2530] hover:bg-[#2d3748] 
                  rounded-lg border border-[#3d4450] transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse" />
                <span className="text-sm text-[#8b949e]">
                  {shortenAddress(publicKey.toBase58())}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setVisible(true)}
              className="px-4 py-2 bg-[#1e2530] hover:bg-[#2d3748] text-white text-sm font-medium rounded-lg border border-[#3d4450] transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
