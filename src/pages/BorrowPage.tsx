import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const borrowPools = [
    { token: 'USDC', borrowApy: '8.12%', available: '$12.3M', ltv: '80%', icon: '💵' },
    { token: 'USDT', borrowApy: '7.65%', available: '$8.9M', ltv: '80%', icon: '💴' },
    { token: 'SOL', borrowApy: '5.23%', available: '$15.2M', ltv: '75%', icon: '◎' },
];

const collateralOptions = [
    { token: 'SOL', value: '$0.00', icon: '◎' },
    { token: 'mSOL', value: '$0.00', icon: '🌊' },
    { token: 'USDC', value: '$0.00', icon: '💵' },
];

export const BorrowPage: FC = () => {
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [borrowAmount, setBorrowAmount] = useState('');
    const [selectedBorrow, setSelectedBorrow] = useState('USDC');
    const [collateralAmount, setCollateralAmount] = useState('');
    const [selectedCollateral, setSelectedCollateral] = useState('SOL');

    const healthFactor = 0; // Would be calculated based on collateral/borrow ratio

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-[#1e2530]">
                    <h2 className="text-xl font-bold text-white">Borrow Assets</h2>
                    <p className="text-sm text-[#8b949e] mt-1">
                        Borrow against your collateral at competitive rates
                    </p>
                </div>

                {/* Collateral section */}
                <div className="p-5 border-b border-[#1e2530]">
                    <label className="text-sm font-medium text-[#8b949e] mb-3 block">Deposit Collateral</label>
                    <div className="bg-[#161b22] rounded-xl p-4 border border-[#1e2530]">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedCollateral}
                                    onChange={(e) => setSelectedCollateral(e.target.value)}
                                    className="bg-[#1e2530] text-white text-sm rounded-lg px-3 py-1.5 border border-[#3d4450] focus:outline-none focus:border-[#00ffa3]"
                                >
                                    {collateralOptions.map(opt => (
                                        <option key={opt.token} value={opt.token}>{opt.icon} {opt.token}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-sm text-[#8b949e]">Balance: 0.00</span>
                        </div>
                        <input
                            type="text"
                            value={collateralAmount}
                            onChange={(e) => setCollateralAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-transparent text-xl font-mono font-semibold text-white placeholder-[#8b949e] focus:outline-none mt-2"
                        />
                    </div>
                </div>

                {/* Borrow section */}
                <div className="p-5">
                    <label className="text-sm font-medium text-[#8b949e] mb-3 block">Borrow Amount</label>
                    <div className="space-y-2 mb-4">
                        {borrowPools.map((pool) => (
                            <button
                                key={pool.token}
                                onClick={() => setSelectedBorrow(pool.token)}
                                className={`
                  w-full flex items-center justify-between p-3 rounded-xl border transition-all
                  ${selectedBorrow === pool.token
                                        ? 'border-[#00ffa3] bg-[#00ffa3]/5'
                                        : 'border-[#1e2530] hover:border-[#3d4450]'
                                    }
                `}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{pool.icon}</span>
                                    <span className="font-medium text-white">{pool.token}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-[#f85149]">{pool.borrowApy} APR</span>
                                    <span className="text-xs text-[#8b949e] ml-2">LTV {pool.ltv}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#161b22] rounded-xl p-4 border border-[#1e2530]">
                        <input
                            type="text"
                            value={borrowAmount}
                            onChange={(e) => setBorrowAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-transparent text-xl font-mono font-semibold text-white placeholder-[#8b949e] focus:outline-none"
                        />
                        <div className="flex items-center justify-between mt-2 text-sm text-[#8b949e]">
                            <span>≈ $0.00</span>
                            <span>Max: $0.00</span>
                        </div>
                    </div>
                </div>

                {/* Health factor */}
                <div className="px-5 pb-5">
                    <div className="flex items-center justify-between p-3 bg-[#161b22] rounded-xl border border-[#1e2530]">
                        <span className="text-sm text-[#8b949e]">Health Factor</span>
                        <span className={`font-bold ${healthFactor > 1.5 ? 'text-[#00ffa3]' : healthFactor > 1 ? 'text-[#d29922]' : 'text-[#f85149]'}`}>
                            {healthFactor > 0 ? healthFactor.toFixed(2) : '—'}
                        </span>
                    </div>
                </div>

                {/* Borrow button */}
                <div className="p-5 border-t border-[#1e2530]">
                    {connected ? (
                        <button
                            className="w-full py-4 bg-gradient-to-r from-[#00ffa3] to-[#00d4aa] text-black font-bold rounded-xl
                hover:opacity-90 transition-opacity"
                        >
                            Borrow {selectedBorrow}
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

                {/* Active loans */}
                <div className="p-5 bg-[#161b22] border-t border-[#1e2530]">
                    <h3 className="text-sm font-semibold text-white mb-3">Your Active Loans</h3>
                    <div className="text-center py-6 text-[#8b949e] text-sm">
                        No active loans
                    </div>
                </div>
            </div>
        </div>
    );
};
