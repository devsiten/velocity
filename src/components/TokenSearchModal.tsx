import { useState, useEffect, useRef } from 'react';
import { useTradeStore, useUIStore, Token } from '../lib/store';
import { api } from '../lib/api';

export const TokenSearchModal = () => {
    const { tokenSearchOpen, tokenSearchType, closeTokenSearch } = useUIStore();
    const { setInputToken, setOutputToken } = useTradeStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Token[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [popularTokens, setPopularTokens] = useState<Token[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Popular tokens for quick selection
    useEffect(() => {
        setPopularTokens([
            {
                address: 'So11111111111111111111111111111111111111112',
                symbol: 'SOL',
                name: 'Solana',
                decimals: 9,
                logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
            },
            {
                address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                symbol: 'USDC',
                name: 'USD Coin',
                decimals: 6,
                logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
            },
            {
                address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
                symbol: 'USDT',
                name: 'Tether USD',
                decimals: 6,
                logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
            },
            {
                address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
                symbol: 'JUP',
                name: 'Jupiter',
                decimals: 6,
                logoURI: 'https://static.jup.ag/jup/icon.png',
            },
            {
                address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
                symbol: 'BONK',
                name: 'Bonk',
                decimals: 5,
                logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
            },
        ]);
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (tokenSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [tokenSearchOpen]);

    // Search tokens
    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const search = async () => {
            setIsLoading(true);
            try {
                const tokens = await api.searchTokens(query);
                setResults(tokens.slice(0, 10));
            } catch (e) {
                console.error('Search failed:', e);
                setResults([]);
            }
            setIsLoading(false);
        };

        const timer = setTimeout(search, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const selectToken = (token: Token) => {
        if (tokenSearchType === 'input') {
            setInputToken(token);
        } else {
            setOutputToken(token);
        }
        closeTokenSearch();
        setQuery('');
        setResults([]);
    };

    if (!tokenSearchOpen) return null;

    const displayTokens = query.length >= 2 ? results : popularTokens;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeTokenSearch}>
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-[#25252b]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Select Token</h3>
                        <button onClick={closeTokenSearch} className="text-[#6b7280] hover:text-white text-xl">&times;</button>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, symbol, or address..."
                        className="w-full px-4 py-3 bg-[#1b1b1f] border border-[#25252b] rounded-xl text-white placeholder-[#6b7280] focus:outline-none focus:border-[#00d4aa]"
                    />
                </div>

                <div className="p-4 overflow-y-auto max-h-96">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : displayTokens.length === 0 && query.length >= 2 ? (
                        <div className="text-center py-8 text-[#6b7280]">No tokens found</div>
                    ) : (
                        <div className="space-y-1">
                            {!query && <div className="text-sm text-[#6b7280] mb-2">Popular Tokens</div>}
                            {displayTokens.map((token) => (
                                <button
                                    key={token.address}
                                    onClick={() => selectToken(token)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#1b1b1f] transition-colors"
                                >
                                    <img
                                        src={token.logoURI}
                                        alt={token.symbol}
                                        className="w-8 h-8 rounded-full"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                                        }}
                                    />
                                    <div className="text-left">
                                        <div className="text-white font-medium">{token.symbol}</div>
                                        <div className="text-sm text-[#6b7280]">{token.name}</div>
                                    </div>
                                    <div className="ml-auto text-xs text-[#6b7280] font-mono">
                                        {token.address.slice(0, 4)}...{token.address.slice(-4)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
