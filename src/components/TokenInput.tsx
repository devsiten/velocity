import { FC } from 'react';
import { Token } from '../types/shared';
import { useUIStore } from '../lib/store';
import { useBalance } from '../hooks/useBalance';
import { formatAmount } from '../lib/constants';

interface TokenInputProps {
  token: Token | null;
  amount: string;
  onAmountChange?: (value: string) => void;
  mode: 'input' | 'output';
  label: string;
  readonly?: boolean;
  isLoading?: boolean;
}

export const TokenInput: FC<TokenInputProps> = ({
  token,
  amount,
  onAmountChange,
  mode,
  label,
  readonly = false,
  isLoading = false,
}) => {
  const { openTokenSearch } = useUIStore();
  const { getBalance } = useBalance();

  const balance = token ? getBalance(token.address) : '0';
  const formattedBalance = token ? formatAmount(balance, token.decimals) : '0';

  const handleMaxClick = () => {
    if (token && onAmountChange && mode === 'input') {
      const maxAmount = Number(balance) / Math.pow(10, token.decimals);
      const adjustedMax = token.symbol === 'SOL' ? Math.max(0, maxAmount - 0.01) : maxAmount;
      onAmountChange(adjustedMax.toString());
    }
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        {token && (
          <button
            onClick={handleMaxClick}
            disabled={readonly}
            className="text-sm text-text-secondary hover:text-accent-primary transition-colors disabled:opacity-50"
          >
            Balance: <span className="mono">{formattedBalance}</span>
            {!readonly && mode === 'input' && (
              <span className="ml-1 text-accent-primary">(MAX)</span>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          {isLoading ? (
            <div className="h-10 shimmer rounded-lg" />
          ) : (
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  onAmountChange?.(value);
                }
              }}
              placeholder="0.00"
              disabled={readonly}
              className="w-full bg-transparent text-3xl font-mono font-semibold text-text-primary 
                placeholder-text-muted focus:outline-none disabled:cursor-default"
            />
          )}
        </div>

        <button
          onClick={() => openTokenSearch(mode)}
          className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated hover:bg-border-primary 
            rounded-xl transition-colors border border-border-primary"
        >
          {token ? (
            <>
              <div className="w-7 h-7 rounded-full bg-bg-tertiary overflow-hidden">
                {token.logoURI ? (
                  <img 
                    src={token.logoURI} 
                    alt={token.symbol}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                    {token.symbol[0]}
                  </div>
                )}
              </div>
              <span className="font-semibold">{token.symbol}</span>
            </>
          ) : (
            <span className="text-accent-primary font-medium">Select token</span>
          )}
          <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
