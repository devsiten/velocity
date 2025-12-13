import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SwapCard } from './components/SwapCard';
import { TokenSearchModal } from './components/TokenSearchModal';
import { StakePage } from './components/StakePage';
import { LendPage } from './components/LendPage';
import { useUIStore } from './lib/store';
import { api } from './lib/api';

export default function App() {
  const { activeTab } = useUIStore();
  const { publicKey } = useWallet();

  useEffect(() => {
    api.setPublicKey(publicKey?.toBase58() || null);
  }, [publicKey]);

  const renderPage = () => {
    switch (activeTab) {
      case 'swap':
        return (
          <div className="flex justify-center">
            <SwapCard />
          </div>
        );
      case 'stake':
        return <StakePage />;
      case 'lend':
        return <LendPage />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h2 className="text-xl font-semibold text-white">Coming Soon</h2>
              <p className="text-[#6b7280] mt-2">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="ml-60">
        <Header />
        <main className="p-8">
          {renderPage()}
        </main>
      </div>

      {/* Token Search Modal */}
      <TokenSearchModal />
    </div>
  );
}

