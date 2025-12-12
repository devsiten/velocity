import { FC } from 'react';

const trendingTokens = [
    { rank: 7, name: 'PRIME', change: '+0.05%', volume: '$15.3M', color: '#00ffa3' },
    { rank: 8, name: 'AVICI', change: '+10.32%', volume: '$4.22M', color: '#00ffa3' },
    { rank: 9, name: 'TROLL', change: '+34.56%', volume: '$3.41M', color: '#00ffa3' },
];

const launchpadRunners = [
    { name: '1649AC', change: '+183x', mc: '$1.44M' },
    { name: 'CALVIN', change: '+0.22%', mc: '$1.39M' },
];

const yieldOptions = [
    { token: 'USDC', apy: '+5.23%', icon: '💵' },
    { token: 'USDT', apy: '+4.88%', icon: '💴' },
    { token: 'EURC', apy: '+4.85%', icon: '💶' },
];

export const InfoPanels: FC = () => {
    return (
        <div className="hidden xl:block w-72 space-y-4">
            {/* Trending / Cooking */}
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        🔥 Cooking
                    </h3>
                    <button className="text-xs text-[#8b949e] hover:text-white transition-colors">
                        More &gt;
                    </button>
                </div>

                <div className="space-y-3">
                    {trendingTokens.map((token, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#8b949e]">#{token.rank}</span>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                                <span className="text-sm font-medium text-white">{token.name}</span>
                                <span className="text-xs text-[#00ffa3]">{token.change}</span>
                            </div>
                            <span className="text-xs text-[#8b949e]">Vol {token.volume}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Launchpad Runners */}
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">🚀 Launchpad Runners</h3>
                    <button className="text-xs text-[#8b949e] hover:text-white transition-colors">
                        More &gt;
                    </button>
                </div>

                <div className="space-y-3">
                    {launchpadRunners.map((token, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500" />
                                <span className="text-sm font-medium text-white">{token.name}</span>
                                <span className="text-xs text-[#00ffa3]">{token.change}</span>
                            </div>
                            <span className="text-xs text-[#8b949e]">MC {token.mc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Earn Flexible Yield */}
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">💰 Earn Flexible Yield</h3>
                    <button className="text-xs text-[#8b949e] hover:text-white transition-colors">
                        More &gt;
                    </button>
                </div>

                <div className="space-y-3">
                    {yieldOptions.map((option, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{option.icon}</span>
                                <span className="text-sm font-medium text-white">{option.token}</span>
                            </div>
                            <span className="text-sm font-medium text-[#00ffa3]">{option.apy} APY</span>
                        </div>
                    ))}
                </div>

                {/* Pagination dots */}
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b949e]/50" />
                </div>
            </div>
        </div>
    );
};
