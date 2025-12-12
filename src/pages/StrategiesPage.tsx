import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Strategy } from '../types/shared';
import { useUserStore } from '../lib/store';
import { api } from '../lib/api';
import { formatAmount, shortenAddress, getExplorerUrl } from '../lib/constants';
import toast from 'react-hot-toast';

export const StrategiesPage: FC = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { strategies, setStrategies, updateStrategy, removeStrategy, isLoading, setIsLoading } = useUserStore();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      api.setPublicKey(publicKey.toBase58());
      loadStrategies();
    }
  }, [connected, publicKey]);

  const loadStrategies = async () => {
    setIsLoading(true);
    try {
      const data = await api.getStrategies();
      setStrategies(data);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (strategy: Strategy) => {
    const newStatus = strategy.status === 'active' ? 'paused' : 'active';
    try {
      await api.updateStrategyStatus(strategy.id, newStatus);
      updateStrategy(strategy.id, { status: newStatus });
      toast.success(`Strategy ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      toast.error('Failed to update strategy');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this strategy?')) return;
    
    try {
      await api.deleteStrategy(id);
      removeStrategy(id);
      toast.success('Strategy deleted');
    } catch (error) {
      toast.error('Failed to delete strategy');
    }
  };

  if (!connected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-bg-secondary flex items-center justify-center">
          <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-3">Auto-Trading Strategies</h2>
        <p className="text-text-secondary mb-6">
          Set up automated buy/sell triggers based on price movements.
          <br />Connect your wallet to get started.
        </p>
        <button onClick={() => setVisible(true)} className="btn btn-primary">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Auto-Trading</h2>
          <p className="text-text-muted text-sm mt-1">
            Create price-triggered buy/sell strategies
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn btn-primary"
        >
          + New Strategy
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 shimmer h-24" />
          ))}
        </div>
      ) : strategies.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
            <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No strategies yet</h3>
          <p className="text-text-muted text-sm mb-4">
            Create your first auto-trading strategy to get started
          </p>
          <button onClick={() => setIsCreating(true)} className="btn btn-secondary">
            Create Strategy
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              onToggle={() => handleToggleStatus(strategy)}
              onDelete={() => handleDelete(strategy.id)}
            />
          ))}
        </div>
      )}

      {isCreating && (
        <CreateStrategyModal
          onClose={() => setIsCreating(false)}
          onCreated={() => {
            setIsCreating(false);
            loadStrategies();
          }}
        />
      )}
    </div>
  );
};

const StrategyCard: FC<{
  strategy: Strategy;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ strategy, onToggle, onDelete }) => {
  const statusColors = {
    active: 'badge-success',
    paused: 'badge-warning',
    triggered: 'badge-info',
    executed: 'badge-success',
    failed: 'badge-danger',
  };

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center
            ${strategy.type === 'buy_dip' ? 'bg-accent-primary/20' : 'bg-accent-danger/20'}`}>
            <svg 
              className={`w-5 h-5 ${strategy.type === 'buy_dip' ? 'text-accent-primary' : 'text-accent-danger'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {strategy.type === 'buy_dip' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              )}
            </svg>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary">{strategy.tokenSymbol}</span>
              <span className={`badge ${statusColors[strategy.status]}`}>
                {strategy.status}
              </span>
            </div>
            <p className="text-sm text-text-muted">
              {strategy.type === 'buy_dip' ? 'Buy when price drops to' : 'Sell when price reaches'}{' '}
              <span className="mono text-text-secondary">{strategy.triggerPrice} SOL</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(strategy.status === 'active' || strategy.status === 'paused') && (
            <button
              onClick={onToggle}
              className={`btn btn-ghost text-sm ${strategy.status === 'active' ? 'text-accent-warning' : 'text-accent-primary'}`}
            >
              {strategy.status === 'active' ? 'Pause' : 'Activate'}
            </button>
          )}
          
          {strategy.txSignature && (
            <a
              href={getExplorerUrl(strategy.txSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost text-sm text-accent-info"
            >
              View TX
            </a>
          )}
          
          <button onClick={onDelete} className="btn btn-ghost text-sm text-accent-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-primary grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-text-muted block">Amount</span>
          <span className="mono text-text-primary">
            {formatAmount(strategy.amount, 9)} SOL
          </span>
        </div>
        <div>
          <span className="text-text-muted block">Slippage</span>
          <span className="mono text-text-primary">{strategy.slippageBps / 100}%</span>
        </div>
        <div>
          <span className="text-text-muted block">Created</span>
          <span className="text-text-primary">
            {new Date(strategy.createdAt * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const CreateStrategyModal: FC<{
  onClose: () => void;
  onCreated: () => void;
}> = ({ onClose, onCreated }) => {
  const [type, setType] = useState<'buy_dip' | 'take_profit'>('buy_dip');
  const [tokenMint, setTokenMint] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amountLamports = Math.floor(parseFloat(amount) * 1e9).toString();
      
      await api.createStrategy({
        tokenMint,
        tokenSymbol: tokenSymbol || 'Unknown',
        type,
        triggerPrice: parseFloat(triggerPrice),
        amount: amountLamports,
        slippageBps: Math.floor(parseFloat(slippage) * 100),
      });

      toast.success('Strategy created');
      onCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create strategy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative card p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-primary">New Strategy</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Strategy Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('buy_dip')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors
                  ${type === 'buy_dip' 
                    ? 'bg-accent-primary text-bg-primary' 
                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated'
                  }`}
              >
                Buy the Dip
              </button>
              <button
                type="button"
                onClick={() => setType('take_profit')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors
                  ${type === 'take_profit' 
                    ? 'bg-accent-danger text-white' 
                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated'
                  }`}
              >
                Take Profit
              </button>
            </div>
          </div>

          <div>
            <label className="label">Token Mint Address</label>
            <input
              type="text"
              value={tokenMint}
              onChange={(e) => setTokenMint(e.target.value)}
              placeholder="Paste token address"
              className="input mono text-sm"
              required
            />
          </div>

          <div>
            <label className="label">Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              placeholder="e.g. BONK"
              className="input"
            />
          </div>

          <div>
            <label className="label">Trigger Price (SOL)</label>
            <input
              type="text"
              inputMode="decimal"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              placeholder="0.00"
              className="input mono"
              required
            />
            <p className="text-xs text-text-muted mt-1">
              {type === 'buy_dip' ? 'Buy when price drops to this level' : 'Sell when price reaches this level'}
            </p>
          </div>

          <div>
            <label className="label">Amount (SOL)</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input mono"
              required
            />
          </div>

          <div>
            <label className="label">Slippage (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              placeholder="1"
              className="input mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary py-3"
          >
            {isSubmitting ? 'Creating...' : 'Create Strategy'}
          </button>
        </form>
      </div>
    </div>
  );
};
