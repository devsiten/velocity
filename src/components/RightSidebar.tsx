// src/components/RightSidebar.tsx
import { useTrendingStore, usePriceStore, useTradeStore } from '../lib/store';
import { useTrendingTokens, useLivePrices } from '../hooks/useLiveData';

export const RightSidebar = () => {
    useTrendingTokens(60000);
    useLivePrices(15000);

    const { tokens, isLoading } = useTrendingStore();
    const { prices } = usePriceStore();
    const { setOutputToken } = useTradeStore();

    const fmtPrice = (p: number) => {
        if (!p) return '$0';
        if (p >= 1) return `$${p.toFixed(2)}`;
        if (p >= 0.0001) return `$${p.toFixed(4)}`;
        return `$${p.toFixed(8)}`;
    };

    const handleTokenClick = (token: any) => {
        setOutputToken({
            address: token.address,
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
            logoURI: token.logoURI,
        });
    };

    return (
        <div className="space-y-4">
            {/* Trending Solana Tokens */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500">🔥</span>
                        <span className="text-sm font-medium text-white">Top Tokens</span>
                        {!isLoading && <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />}
                    </div>
                    <span className="text-xs text-[#6b7280]">Click to swap</span>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-[#1b1b1f] rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : tokens.length === 0 ? (
                    <div className="text-center py-8 text-[#6b7280]">Loading tokens...</div>
                ) : (
                    <div className="space-y-1">
                        {tokens.slice(0, 8).map((token: any) => (
                            <button
                                key={token.id}
                                onClick={() => handleTokenClick(token)}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1b1b1f] cursor-pointer transition-colors text-left"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-xs text-[#6b7280] w-4">#{token.rank}</span>
                                    <img
                                        src={token.logoURI}
                                        alt={token.symbol}
                                        className="w-6 h-6 rounded-full"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24';
                                        }}
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-white">{token.symbol}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-white">{fmtPrice(token.price)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex justify-center items-center gap-2 mt-4">
                    <span className="text-xs text-[#6b7280]">Powered by Jupiter</span>
                </div>
            </div>

            {/* SOL Price Card */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-4">
                <div className="flex items-center gap-3">
                    <img
                        src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                        className="w-10 h-10 rounded-full"
                        alt="SOL"
                    />
                    <div>
                        <div className="text-sm font-medium text-white">Solana</div>
                        <div className="text-xs text-[#6b7280]">SOL</div>
                    </div>
                    <div className="ml-auto text-right">
                        {prices['So11111111111111111111111111111111111111112'] ? (
                            <div className="text-lg font-semibold text-white">
                                ${prices['So11111111111111111111111111111111111111112'].price.toFixed(2)}
                            </div>
                        ) : (
                            <span className="text-[#6b7280] animate-pulse">Loading...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
