import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SwapCard } from './components/SwapCard';
import { RightSidebar } from './components/RightSidebar';
import { useUIStore } from './lib/store';
import { api } from './lib/api';

export default function App() {
  const { activeTab } = useUIStore();
  const { publicKey } = useWallet();

  useEffect(() => {
    api.setPublicKey(publicKey?.toBase58() || null);
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-[#0b0b0e]">
      <Sidebar />
      <div className="ml-60">
        <Header />
        <main className="p-8">
          {activeTab === 'swap' && (
            <div className="flex justify-center gap-8">
              <SwapCard />
              <RightSidebar />
            </div>
          )}
          {activeTab !== 'swap' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-4xl mb-4">🚧</div>
                <h2 className="text-xl font-semibold text-white">Coming Soon</h2>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
