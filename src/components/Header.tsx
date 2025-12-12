import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { usePriceStore } from '../lib/store';
import { useLivePrices } from '../hooks/useLiveData';

export const Header = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { prices, isLoading } = usePriceStore();

  useLivePrices(2000);

  const sol = prices['So11111111111111111111111111111111111111112'];
  const jup = prices['JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'];

  const fmt = (p?: number) => (p ? (p >= 1 ? `$${p.toFixed(2)}` : `$${p.toFixed(5)}`) : '--');
  const fmtChg = (c?: number) => (c !== undefined ? `${c >= 0 ? '+' : ''}${c.toFixed(2)}%` : '');
  const short = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

  return (
    <header className="h-14 bg-[#0b0b0e] border-b border-[#25252b] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1b1b1f]">
          <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" className="w-5 h-5 rounded-full" />
          <span className="text-white font-medium text-sm">SOL</span>
          {isLoading ? <span className="text-[#6b7280] animate-pulse">...</span> : (
            <>
              <span className="text-white text-sm">{fmt(sol?.price)}</span>
              <span className={`text-sm ${(sol?.change24h || 0) >= 0 ? 'text-[#c7f284]' : 'text-[#ff6b6b]'}`}>{fmtChg(sol?.change24h)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c7f284] animate-pulse" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1b1b1f]">
          <span>🐱</span>
          <span className="text-white font-medium text-sm">JUP</span>
          {isLoading ? <span className="text-[#6b7280] animate-pulse">...</span> : (
            <>
              <span className="text-white text-sm">{fmt(jup?.price)}</span>
              <span className={`text-sm ${(jup?.change24h || 0) >= 0 ? 'text-[#c7f284]' : 'text-[#ff6b6b]'}`}>{fmtChg(jup?.change24h)}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 max-w-md mx-4">
        <input type="text" placeholder="Search token or wallet..." className="w-full px-4 py-2 bg-[#1b1b1f] rounded-lg text-sm text-white placeholder-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#c7f284]" />
      </div>
      <div>
        {connected && publicKey ? (
          <button onClick={() => disconnect()} className="flex items-center gap-2 px-4 py-2 bg-[#1b1b1f] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#c7f284] animate-pulse" />
            <span className="text-white text-sm">{short(publicKey.toBase58())}</span>
          </button>
        ) : (
          <button onClick={() => setVisible(true)} className="px-4 py-2 bg-[#c7f284] text-[#0b0b0e] rounded-lg font-semibold hover:bg-[#a8d96f]">Connect</button>
        )}
      </div>
    </header>
  );
};
