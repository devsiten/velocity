import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { Token } from '../types/shared';
import { useUIStore, useTradeStore } from '../lib/store';
import { api } from '../lib/api';
import { useBalance } from '../hooks/useBalance';

export const TokenSearch: FC = () => {
  const { isTokenSearchOpen, tokenSearchMode, closeTokenSearch } = useUIStore();
  const { setInputToken, setOutputToken, inputToken, outputToken } = useTradeStore();
  const { getFormattedBalance } = useBalance();
  
  const [query, setQuery] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentTokens, setRecentTokens] = useState<Token[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTokenSearchOpen) {
      inputRef.current?.focus();
      const stored = localStorage.getItem('recentTokens');
      if (stored) {
        try {
          setRecentTokens(JSON.parse(stored).slice(0, 5));
        } catch {}
      }
    } else {
      setQuery('');
      setTokens([]);
    }
  }, [isTokenSearchOpen]);

  const searchTokens = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 1) {
      setTokens([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await api.searchTokens(searchQuery);
      setTokens(results);
    } catch (error) {
      console.error('Token search failed:', error);
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= 1) {
      debounceRef.current = window.setTimeout(() => {
        searchTokens(query);
      }, 300);
    } else {
      setTokens([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchTokens]);

  const selectToken = (token: Token) => {
    if (tokenSearchMode === 'input') {
      if (outputToken?.address === token.address) {
        setOutputToken(inputToken);
      }
      setInputToken(token);
    } else {
      if (inputToken?.address === token.address) {
        setInputToken(outputToken);
      }
      setOutputToken(token);
    }

    const recent = [token, ...recentTokens.filter(t => t.address !== token.address)].slice(0, 5);
    setRecentTokens(recent);
    localStorage.setItem('recentTokens', JSON.stringify(recent));

    closeTokenSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeTokenSearch();
    }
  };

  if (!isTokenSearchOpen) return null;

  const displayTokens = query ? tokens : recentTokens;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeTokenSearch}
      />
      
      <div className="relative w-full max-w-md card p-0 animate-slide-up overflow-hidden">
        <div className="p-4 border-b border-border-primary">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name or paste address"
              className="input pr-10"
              autoComplete="off"
              spellCheck={false}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!query && recentTokens.length > 0 && (
            <div className="px-4 py-2 text-xs text-text-muted uppercase tracking-wider">
              Recent
            </div>
          )}

          {displayTokens.length === 0 && query && !isLoading && (
            <div className="p-8 text-center text-text-muted">
              No tokens found
            </div>
          )}

          {displayTokens.map((token) => (
            <button
              key={token.address}
              onClick={() => selectToken(token)}
              className="w-full flex items-center gap-3 p-4 hover:bg-bg-elevated transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-bg-tertiary overflow-hidden flex-shrink-0">
                {token.logoURI ? (
                  <img 
                    src={token.logoURI} 
                    alt={token.symbol}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted font-bold">
                    {token.symbol[0]}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary">
                    {token.symbol}
                  </span>
                </div>
                <div className="text-sm text-text-muted truncate">
                  {token.name}
                </div>
              </div>
              
              <div className="text-right text-sm">
                <div className="text-text-secondary mono">
                  {getFormattedBalance(token.address, token.decimals)}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-border-primary bg-bg-tertiary/50">
          <p className="text-xs text-text-muted text-center">
            Press <kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-text-secondary">ESC</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};
