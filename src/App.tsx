import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SwapCard } from './components/SwapCard';
import { RightSidebar } from './components/RightSidebar';
import { TokenSearchModal } from './components/TokenSearchModal';
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
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Sidebar - Fixed to right edge */}
      <div className="fixed right-0 top-14 h-[calc(100vh-56px)] w-72 border-l border-[#25252b] p-4 overflow-y-auto">
        <RightSidebar />
      </div>

      {/* Main content - between sidebars */}
      <div className="ml-60 mr-72">
        <Header />
        <main className="p-8">
          {activeTab === 'swap' && (
            <div className="flex justify-center">
              <SwapCard />
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

      {/* Token Search Modal */}
      <TokenSearchModal />
    </div>
  );
}
