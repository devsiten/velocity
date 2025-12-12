import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { api } from '../lib/api';
import { Connection, VersionedTransaction } from '@solana/web3.js';

interface StakingPool {
    id: string;
    name: string;
    symbol: string;
    apy: number;
    tvl: number;
    description: string;
    logo: string;
    tokenMint: string;
    exchangeRate: number;
}

export const StakePage = () => {
    const { connected, publicKey, signTransaction } = useWallet();
    const { setVisible } = useWalletModal();
    const [pools, setPools] = useState<StakingPool[]>([]);
    const [selectedPool, setSelectedPool] = useState<string>('marinade');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [mode, setMode] = useState<'stake' | 'unstake'>('stake');

    useEffect(() => {
        loadPools();
    }, []);

    const loadPools = async () => {
        try {
            const data = await api.getStakingPools();
            setPools(data);
        } catch (e) {
            console.error('Failed to load staking pools:', e);
            // Fallback pools
            setPools([
                { id: 'marinade', name: 'Marinade', symbol: 'mSOL', apy: 7.2, tvl: 0, description: 'Liquid staking with mSOL', logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png', tokenMint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', exchangeRate: 1.08 },
                { id: 'jito', name: 'Jito', symbol: 'JitoSOL', apy: 7.8, tvl: 0, description: 'Liquid staking with MEV rewards', logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn/logo.png', tokenMint: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', exchangeRate: 1.09 },
            ]);
        }
    };

    const executeStake = async () => {
        if (!publicKey || !signTransaction || !amount) return;

        setIsLoading(true);
        setStatus('Building transaction...');

        try {
            const amountLamports = Math.floor(parseFloat(amount) * 1e9).toString();

            const result = mode === 'stake'
                ? await api.buildStakeTransaction(selectedPool, amountLamports)
                : await api.buildUnstakeTransaction(selectedPool, amountLamports);

            setStatus('Waiting for signature...');

            const swapTransactionBuf = Buffer.from(result.swapTransaction, 'base64');
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            const signedTransaction = await signTransaction(transaction);

            setStatus('Sending transaction...');

            const connection = new Connection('https://api.mainnet-beta.solana.com');
            const rawTransaction = signedTransaction.serialize();
            const txSignature = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2,
            });

            setStatus('Confirming...');
            await connection.confirmTransaction(txSignature, 'confirmed');

            setStatus(`Success! TX: ${txSignature.slice(0, 8)}...`);
            setAmount('');
            setTimeout(() => setStatus(null), 5000);

        } catch (error) {
            console.error('Stake failed:', error);
            setStatus(`Error: ${error instanceof Error ? error.message : 'Stake failed'}`);
            setTimeout(() => setStatus(null), 5000);
        }

        setIsLoading(false);
    };

    const pool = pools.find(p => p.id === selectedPool);

    return (
        <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Stake SOL</h1>
                <p className="text-sm text-[#6b7280] mt-2">Earn yield on your SOL with liquid staking</p>
            </div>

            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-6">
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setMode('stake')}
                        className={`flex-1 py-3 rounded-xl font-medium transition-colors ${mode === 'stake' ? 'bg-[#00d4aa] text-[#0b0b0e]' : 'bg-[#1b1b1f] text-[#9ca3af]'}`}
                    >
                        Stake
                    </button>
                    <button
                        onClick={() => setMode('unstake')}
                        className={`flex-1 py-3 rounded-xl font-medium transition-colors ${mode === 'unstake' ? 'bg-[#00d4aa] text-[#0b0b0e]' : 'bg-[#1b1b1f] text-[#9ca3af]'}`}
                    >
                        Unstake
                    </button>
                </div>

                {/* Pool Selection */}
                <div className="mb-4">
                    <label className="block text-sm text-[#6b7280] mb-2">Select Pool</label>
                    <div className="grid grid-cols-2 gap-3">
                        {pools.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPool(p.id)}
                                className={`p-4 rounded-xl border transition-colors ${selectedPool === p.id ? 'border-[#00d4aa] bg-[#00d4aa]/10' : 'border-[#25252b] bg-[#1b1b1f] hover:border-[#3a3a4a]'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={p.logo} className="w-8 h-8 rounded-full" alt={p.name} />
                                    <div className="text-left">
                                        <div className="text-white font-medium">{p.name}</div>
                                        <div className="text-[#00d4aa] text-sm">{p.apy.toFixed(1)}% APY</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                    <label className="block text-sm text-[#6b7280] mb-2">
                        {mode === 'stake' ? 'Amount (SOL)' : `Amount (${pool?.symbol || 'Token'})`}
                    </label>
                    <div className="bg-[#1b1b1f] rounded-xl p-4">
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={isLoading}
                            className="w-full bg-transparent text-2xl text-white placeholder-[#6b7280] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Pool Info */}
                {pool && (
                    <div className="bg-[#1b1b1f] rounded-xl p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6b7280]">APY</span>
                            <span className="text-[#00d4aa]">{pool.apy.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6b7280]">Exchange Rate</span>
                            <span className="text-white">1 SOL = {pool.exchangeRate.toFixed(4)} {pool.symbol}</span>
                        </div>
                        {amount && (
                            <div className="flex justify-between text-sm">
                                <span className="text-[#6b7280]">You'll Receive</span>
                                <span className="text-white">
                                    ~{(parseFloat(amount || '0') / pool.exchangeRate).toFixed(4)} {mode === 'stake' ? pool.symbol : 'SOL'}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Status */}
                {status && (
                    <div className={`text-center text-sm mb-4 ${status.includes('Error') ? 'text-[#ff6b6b]' : status.includes('Success') ? 'text-[#00d4aa]' : 'text-[#6b7280]'}`}>
                        {status}
                    </div>
                )}

                {/* Action Button */}
                {connected ? (
                    <button
                        onClick={executeStake}
                        disabled={!amount || isLoading}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-[#00d4aa] text-[#0b0b0e] hover:bg-[#00c49a] disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Processing...' : mode === 'stake' ? 'Stake SOL' : 'Unstake'}
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
