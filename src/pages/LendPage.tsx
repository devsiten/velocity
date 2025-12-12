import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const lendingPools = [
    { token: 'USDC', supplyApy: '5.23%', totalSupply: '$45.2M', utilization: '78%', icon: '💵' },
    { token: 'USDT', supplyApy: '4.88%', totalSupply: '$32.1M', utilization: '72%', icon: '💴' },
    { token: 'SOL', supplyApy: '3.45%', totalSupply: '$28.5M', utilization: '65%', icon: '◎' },
];

export const LendPage: FC = () => {
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [amount, setAmount] = useState('');
    const [selectedToken, setSelectedToken] = useState('USDC');

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-[#1e2530]">
                    <h2 className="text-xl font-bold text-white">Lend Assets</h2>
                    <p className="text-sm text-[#8b949e] mt-1">
                        Supply assets to earn interest from borrowers
                    </p>
                </div>

                {/* Lending pools */}
                <div className="p-5">
                    <div className="rounded-xl border border-[#1e2530] overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#161b22]">
                                <tr className="text-xs text-[#8b949e]">
                                    <th className="text-left p-3 font-medium">Asset</th>
                                    <th className="text-right p-3 font-medium">Supply APY</th>
                                    <th className="text-right p-3 font-medium">Total Supply</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lendingPools.map((pool) => (
                                    <tr
                                        key={pool.token}
                                        onClick={() => setSelectedToken(pool.token)}
                                        className={`
                      cursor-pointer transition-colors border-t border-[#1e2530]
                      ${selectedToken === pool.token
                                                ? 'bg-[#00ffa3]/5'
                                                : 'hover:bg-[#161b22]'
                                            }
                    `}
                                    >
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{pool.icon}</span>
                                                <span className="font-medium text-white">{pool.token}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className="font-semibold text-[#00ffa3]">{pool.supplyApy}</span>
                                        </td>
                                        <td className="p-3 text-right text-[#8b949e]">{pool.totalSupply}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Amount input */}
                <div className="px-5 pb-5">
                    <div className="bg-[#161b22] rounded-xl p-4 border border-[#1e2530]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#8b949e]">Amount to Supply</span>
                            <span className="text-sm text-[#8b949e]">Balance: 0.00 {selectedToken}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="flex-1 bg-transparent text-2xl font-mono font-semibold text-white placeholder-[#8b949e] focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 bg-[#1e2530] hover:bg-[#2d3748] rounded-lg text-xs font-medium text-[#00ffa3] transition-colors">
                                    MAX
                                </button>
                                <span className="font-semibold text-white">{selectedToken}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supply button */}
                <div className="p-5 border-t border-[#1e2530]">
                    {connected ? (
                        <button
                            className="w-full py-4 bg-gradient-to-r from-[#00ffa3] to-[#00d4aa] text-black font-bold rounded-xl
                hover:opacity-90 transition-opacity"
                        >
                            Supply {selectedToken}
                        </button>
                    ) : (
                        <button
                            onClick={() => setVisible(true)}
                            className="w-full py-4 bg-[#1e2530] hover:bg-[#2d3748] text-white font-semibold rounded-xl transition-colors"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>

                {/* Your positions */}
                <div className="p-5 bg-[#161b22] border-t border-[#1e2530]">
                    <h3 className="text-sm font-semibold text-white mb-3">Your Supplied Assets</h3>
                    <div className="text-center py-6 text-[#8b949e] text-sm">
                        No supplied assets yet
                    </div>
                </div>
            </div>
        </div>
    );
};
