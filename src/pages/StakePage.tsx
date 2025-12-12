import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const stakeOptions = [
    { token: 'SOL', apy: '7.2%', tvl: '$1.2B', icon: '◎' },
    { token: 'mSOL', apy: '6.8%', tvl: '$890M', icon: '🌊' },
    { token: 'jitoSOL', apy: '7.5%', tvl: '$450M', icon: '⚡' },
];

export const StakePage: FC = () => {
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [amount, setAmount] = useState('');
    const [selectedPool, setSelectedPool] = useState('SOL');

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-[#1e2530]">
                    <h2 className="text-xl font-bold text-white">Stake SOL</h2>
                    <p className="text-sm text-[#8b949e] mt-1">
                        Stake your SOL to earn rewards while supporting the network
                    </p>
                </div>

                {/* Staking pools */}
                <div className="p-5 space-y-3">
                    <label className="text-sm font-medium text-[#8b949e]">Select Staking Pool</label>
                    <div className="space-y-2">
                        {stakeOptions.map((option) => (
                            <button
                                key={option.token}
                                onClick={() => setSelectedPool(option.token)}
                                className={`
                  w-full flex items-center justify-between p-4 rounded-xl border transition-all
                  ${selectedPool === option.token
                                        ? 'border-[#00ffa3] bg-[#00ffa3]/5'
                                        : 'border-[#1e2530] hover:border-[#3d4450]'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg">
                                        {option.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-white">{option.token}</div>
                                        <div className="text-xs text-[#8b949e]">TVL: {option.tvl}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-[#00ffa3]">{option.apy} APY</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount input */}
                <div className="px-5 pb-5">
                    <div className="bg-[#161b22] rounded-xl p-4 border border-[#1e2530]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#8b949e]">Amount to Stake</span>
                            <span className="text-sm text-[#8b949e]">Balance: 0.00 SOL</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="flex-1 bg-transparent text-2xl font-mono font-semibold text-white placeholder-[#8b949e] focus:outline-none"
                            />
                            <button className="px-3 py-1.5 bg-[#1e2530] hover:bg-[#2d3748] rounded-lg text-xs font-medium text-[#00ffa3] transition-colors">
                                MAX
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stake button */}
                <div className="p-5 border-t border-[#1e2530]">
                    {connected ? (
                        <button
                            className="w-full py-4 bg-gradient-to-r from-[#00ffa3] to-[#00d4aa] text-black font-bold rounded-xl
                hover:opacity-90 transition-opacity"
                        >
                            Stake SOL
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

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-5 bg-[#161b22] border-t border-[#1e2530]">
                    <div className="text-center">
                        <div className="text-xs text-[#8b949e]">Your Staked</div>
                        <div className="font-semibold text-white mt-1">0.00 SOL</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-[#8b949e]">Rewards</div>
                        <div className="font-semibold text-[#00ffa3] mt-1">0.00 SOL</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-[#8b949e]">Est. Yearly</div>
                        <div className="font-semibold text-white mt-1">0.00 SOL</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
