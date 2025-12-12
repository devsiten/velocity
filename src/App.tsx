import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { InfoPanels } from './components/InfoPanels';
import { TokenSearch } from './components/TokenSearch';
import { TradePage } from './pages/TradePage';
import { StakePage } from './pages/StakePage';
import { LendPage } from './pages/LendPage';
import { BorrowPage } from './pages/BorrowPage';
import { useUIStore } from './lib/store';
import { api } from './lib/api';

const App: FC = () => {
  const { publicKey } = useWallet();
  const { activeTab } = useUIStore();

  useEffect(() => {
    api.setPublicKey(publicKey?.toBase58() || null);
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-[#010409] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ffa3]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00d4aa]/5 rounded-full blur-3xl" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <Header />

          {/* Main layout with info panels */}
          <main className="relative flex justify-center gap-6 px-4 lg:px-8 py-8">
            {/* Center content */}
            <div className="flex-1 max-w-lg">
              {activeTab === 'swap' && <TradePage />}
              {activeTab === 'stake' && <StakePage />}
              {activeTab === 'lend' && <LendPage />}
              {activeTab === 'borrow' && <BorrowPage />}
            </div>

            {/* Right info panels */}
            <InfoPanels />
          </main>
        </div>
      </div>

      {/* Token Search Modal */}
      <TokenSearch />
    </div>
  );
};

export default App;
