// src/components/RightSidebar.tsx
import { useTrendingStore, usePriceStore } from '../lib/store';
import { useTrendingTokens } from '../hooks/useLiveData';

export const RightSidebar = () => {
    useTrendingTokens(60000);
    const { tokens, isLoading } = useTrendingStore();
    const { prices } = usePriceStore();

    const fmtVol = (v: number) => {
        if (!v) return '$0';
        if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
        if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
        if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
        return `$${v.toFixed(0)}`;
    };

    const fmtChg = (c: number) => `${c >= 0 ? '+' : ''}${c.toFixed(2)}%`;
    const fmtPrice = (p: number) => {
        if (!p) return '$0';
        if (p >= 1) return `$${p.toFixed(2)}`;
        if (p >= 0.0001) return `$${p.toFixed(4)}`;
        return `$${p.toFixed(8)}`;
    };

    return (
        <div className="space-y-4">
            {/* Trending Solana Tokens */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500">🔥</span>
                        <span className="text-sm font-medium text-white">Trending Solana</span>
                        {!isLoading && <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />}
                    </div>
                    <span className="text-sm text-[#9ca3af]">More →</span>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-14 bg-[#1b1b1f] rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {tokens.map((token: any) => (
                            <div
                                key={token.id}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1b1b1f] cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-[#6b7280] w-4">#{token.rank}</span>
                                    <img
                                        src={token.logoURI}
                                        alt={token.symbol}
                                        className="w-7 h-7 rounded-full"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/28';
                                        }}
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-white">{token.symbol}</span>
                                            <span
                                                className={`text-xs ${token.change24h >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'
                                                    }`}
                                            >
                                                {fmtChg(token.change24h)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-[#6b7280]">{fmtPrice(token.price)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-[#6b7280]">Vol</span>
                                    <div className="text-sm text-white">{fmtVol(token.volume24h)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center items-center gap-2 mt-4">
                    <span className="text-xs text-[#6b7280]">Live from CoinGecko</span>
                </div>
            </div>

            {/* SOL Price Card */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-4">
                <div className="flex items-center gap-3">
                    <img
                        src="https://assets.coingecko.com/coins/images/4128/small/solana.png"
                        className="w-10 h-10 rounded-full"
                        alt="SOL"
                    />
                    <div>
                        <div className="text-sm font-medium text-white">Solana</div>
                        <div className="text-xs text-[#6b7280]">SOL</div>
                    </div>
                    <div className="ml-auto text-right">
                        {prices['So11111111111111111111111111111111111111112'] ? (
                            <>
                                <div className="text-lg font-semibold text-white">
                                    ${prices['So11111111111111111111111111111111111111112'].price.toFixed(2)}
                                </div>
                                <div
                                    className={`text-sm ${prices['So11111111111111111111111111111111111111112'].change24h >= 0
                                        ? 'text-[#00d4aa]'
                                        : 'text-[#ff6b6b]'
                                        }`}
                                >
                                    {fmtChg(prices['So11111111111111111111111111111111111111112'].change24h)}
                                </div>
                            </>
                        ) : (
                            <span className="text-[#6b7280] animate-pulse">Loading...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
