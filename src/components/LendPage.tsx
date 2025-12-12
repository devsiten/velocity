import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { api } from '../lib/api';

interface LendingPool {
    id: string;
    asset: string;
    mint: string;
    logo: string;
    supplyApy: number;
    borrowApy: number;
    totalSupply: number;
    totalBorrow: number;
    utilization: number;
    ltv: number;
}

export const LendPage = () => {
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [pools, setPools] = useState<LendingPool[]>([]);
    const [selectedPool, setSelectedPool] = useState<string>('usdc');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        loadPools();
    }, []);

    const loadPools = async () => {
        try {
            const data = await api.getLendingPools();
            setPools(data);
        } catch (e) {
            console.error('Failed to load lending pools:', e);
            // Fallback pools
            setPools([
                { id: 'usdc', asset: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', supplyApy: 5.2, borrowApy: 8.5, totalSupply: 125000000, totalBorrow: 85000000, utilization: 68, ltv: 0.85 },
                { id: 'sol', asset: 'SOL', mint: 'So11111111111111111111111111111111111111112', logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', supplyApy: 3.8, borrowApy: 6.2, totalSupply: 450000, totalBorrow: 280000, utilization: 62, ltv: 0.75 },
                { id: 'usdt', asset: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png', supplyApy: 4.8, borrowApy: 7.9, totalSupply: 95000000, totalBorrow: 72000000, utilization: 75.8, ltv: 0.85 },
            ]);
        }
    };

    const fmtNum = (n: number) => {
        if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
        if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
        if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
        return `$${n.toFixed(0)}`;
    };

    const handleSupply = async () => {
        if (!amount) return;
        setIsLoading(true);
        setStatus('Building transaction...');

        try {
            await api.buildSupplyTransaction(selectedPool, amount);
            setStatus('Note: Full Kamino integration coming soon!');
        } catch (e) {
            setStatus(`Error: ${e instanceof Error ? e.message : 'Supply failed'}`);
        }

        setIsLoading(false);
        setTimeout(() => setStatus(null), 5000);
    };

    const pool = pools.find(p => p.id === selectedPool);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Lend Assets</h1>
                <p className="text-sm text-[#6b7280] mt-2">Earn interest by supplying assets to lending pools</p>
            </div>

            {/* Pools Table */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#25252b]">
                                <th className="text-left text-sm text-[#6b7280] p-4">Asset</th>
                                <th className="text-right text-sm text-[#6b7280] p-4">Supply APY</th>
                                <th className="text-right text-sm text-[#6b7280] p-4">Borrow APY</th>
                                <th className="text-right text-sm text-[#6b7280] p-4">Total Supply</th>
                                <th className="text-right text-sm text-[#6b7280] p-4">Utilization</th>
                                <th className="text-right text-sm text-[#6b7280] p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pools.map((p) => (
                                <tr key={p.id} className={`border-b border-[#25252b] hover:bg-[#1b1b1f] transition-colors ${selectedPool === p.id ? 'bg-[#1b1b1f]' : ''}`}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.logo} className="w-8 h-8 rounded-full" alt={p.asset} />
                                            <span className="text-white font-medium">{p.asset}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-[#00d4aa] font-medium">{p.supplyApy.toFixed(2)}%</td>
                                    <td className="p-4 text-right text-[#ff6b6b]">{p.borrowApy.toFixed(2)}%</td>
                                    <td className="p-4 text-right text-white">{fmtNum(p.totalSupply)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-2 bg-[#25252b] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#00d4aa]" style={{ width: `${p.utilization}%` }} />
                                            </div>
                                            <span className="text-white text-sm">{p.utilization.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedPool(p.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPool === p.id ? 'bg-[#00d4aa] text-[#0b0b0e]' : 'bg-[#25252b] text-white hover:bg-[#3a3a4a]'}`}
                                        >
                                            {selectedPool === p.id ? 'Selected' : 'Select'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Supply Form */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Supply {pool?.asset || 'Asset'}</h3>

                <div className="bg-[#1b1b1f] rounded-xl p-4 mb-4">
                    <label className="block text-sm text-[#6b7280] mb-2">Amount</label>
                    <div className="flex items-center gap-3">
                        {pool && <img src={pool.logo} className="w-8 h-8 rounded-full" alt={pool.asset} />}
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={isLoading}
                            className="flex-1 bg-transparent text-2xl text-white placeholder-[#6b7280] focus:outline-none"
                        />
                    </div>
                </div>

                {pool && (
                    <div className="bg-[#1b1b1f] rounded-xl p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6b7280]">Supply APY</span>
                            <span className="text-[#00d4aa]">{pool.supplyApy.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6b7280]">LTV</span>
                            <span className="text-white">{(pool.ltv * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                )}

                {status && (
                    <div className={`text-center text-sm mb-4 ${status.includes('Error') ? 'text-[#ff6b6b]' : 'text-[#00d4aa]'}`}>
                        {status}
                    </div>
                )}

                {connected ? (
                    <button
                        onClick={handleSupply}
                        disabled={!amount || isLoading}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-[#00d4aa] text-[#0b0b0e] hover:bg-[#00c49a] disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Processing...' : 'Supply'}
                    </button>
                ) : (
                    <button
                        onClick={() => setVisible(true)}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-[#00d4aa] text-[#0b0b0e] hover:bg-[#00c49a] transition-colors"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </div>
    );
};
