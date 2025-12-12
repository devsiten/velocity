import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Header } from './components/Header';
import { TokenSearch } from './components/TokenSearch';
import { TradePage } from './pages/TradePage';
import { StrategiesPage } from './pages/StrategiesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { useUIStore } from './lib/store';
import { api } from './lib/api';

const App: FC = () => {
  const { publicKey } = useWallet();
  const { activeTab } = useUIStore();

  useEffect(() => {
    api.setPublicKey(publicKey?.toBase58() || null);
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'trade' && <TradePage />}
        {activeTab === 'strategies' && <StrategiesPage />}
        {activeTab === 'leaderboard' && <LeaderboardPage />}
      </main>

      <TokenSearch />

      <footer className="relative border-t border-border-primary mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <img src="/velocity.svg" alt="Velocity" className="w-5 h-5" />
              <span>Velocity Trade</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <a href="#" className="hover:text-text-primary transition-colors">Docs</a>
              <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-text-primary transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
