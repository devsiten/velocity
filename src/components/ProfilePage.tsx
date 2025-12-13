import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const API_BASE = 'https://velocity-api.devsiten.workers.dev';

interface Trade {
    id: string;
    inputSymbol: string;
    outputSymbol: string;
    inAmount: string;
    outAmount: string;
    status: string;
    txSignature: string;
    timestamp: string;
}

interface UserProfile {
    points: number;
    username: string;
    tradeCount: number;
    volumeUsd: number;
}

export const ProfilePage = () => {
    const { connected, publicKey } = useWallet();
    const { setVisible } = useWalletModal();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [profile, setProfile] = useState<UserProfile>({ points: 0, username: '', tradeCount: 0, volumeUsd: 0 });
    const [newUsername, setNewUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'points' | 'history' | 'settings'>('points');

    useEffect(() => {
        if (connected && publicKey) {
            fetchProfile();
            fetchHistory();
        }
    }, [connected, publicKey]);

    const fetchProfile = async () => {
        if (!publicKey) return;
        try {
            const res = await fetch(`${API_BASE}/api/v1/points/balance`, {
                headers: { 'x-public-key': publicKey.toBase58() }
            });
            const data = await res.json();
            if (data.success) {
                setProfile({
                    points: data.data.points || 0,
                    username: data.data.username || '',
                    tradeCount: data.data.tradeCount || 0,
                    volumeUsd: data.data.volumeUsd || 0
                });
                setNewUsername(data.data.username || '');
            }
        } catch (e) {
            console.error('Profile fetch error:', e);
        }
    };

    const fetchHistory = async () => {
        if (!publicKey) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/v1/trade/history`, {
                headers: { 'x-public-key': publicKey.toBase58() }
            });
            const data = await res.json();
            if (data.success) {
                setTrades(data.data || []);
            }
        } catch (e) {
            console.error('History fetch error:', e);
        }
        setIsLoading(false);
    };

    const updateUsername = async () => {
        if (!publicKey || !newUsername.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/api/v1/points/username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-public-key': publicKey.toBase58()
                },
                body: JSON.stringify({ username: newUsername.trim() })
            });
            const data = await res.json();
            if (data.success) {
                setProfile(p => ({ ...p, username: newUsername.trim() }));
            }
        } catch (e) {
            console.error('Username update error:', e);
        }
    };

    const short = (sig: string) => sig ? `${sig.slice(0, 8)}...${sig.slice(-8)}` : '';

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="text-6xl mb-4">👤</div>
                <h2 className="text-xl font-semibold text-[#9945FF] mb-2">Connect Your Wallet</h2>
                <p className="text-gray-500 mb-6">Connect your wallet to view your profile</p>
                <button
                    onClick={() => setVisible(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg"
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-[#9945FF] mb-6">Profile</h1>

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6">
                {(['points', 'history', 'settings'] as const).map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeSection === section
                                ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* Points Section */}
            {activeSection === 'points' && (
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <div className="text-sm text-gray-500 mb-2">Total Points</div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">{profile.points.toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="text-sm text-gray-500 mb-2">Total Trades</div>
                            <div className="text-2xl font-bold text-gray-800">{profile.tradeCount}</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="text-sm text-gray-500 mb-2">Volume (USD)</div>
                            <div className="text-2xl font-bold text-gray-800">${profile.volumeUsd.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="text-sm text-gray-500 mb-2">How to earn points</div>
                        <ul className="text-gray-700 text-sm space-y-2">
                            <li>• Trade on Velocity to earn 1 point per $10 volume</li>
                            <li>• Complete daily trading challenges</li>
                            <li>• Refer friends to earn bonus points</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* History Section */}
            {activeSection === 'history' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                    <h2 className="text-lg font-semibold text-[#9945FF] mb-4">Trade History</h2>
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : trades.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No trades yet. Start trading to see your history!</div>
                    ) : (
                        <div className="space-y-2">
                            {trades.map((trade) => (
                                <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <div className="text-gray-800 font-medium">
                                            {trade.inputSymbol} → {trade.outputSymbol}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(trade.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm ${trade.status === 'confirmed' ? 'text-[#14F195]' : 'text-amber-500'}`}>
                                            {trade.status}
                                        </div>
                                        {trade.txSignature && (
                                            <a
                                                href={`https://solscan.io/tx/${trade.txSignature}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-gray-400 hover:text-[#9945FF]"
                                            >
                                                {short(trade.txSignature)}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
                    <div>
                        <h2 className="text-lg font-semibold text-[#9945FF] mb-4">Profile Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Username</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#9945FF]"
                                    />
                                    <button
                                        onClick={updateUsername}
                                        className="px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-md"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Wallet Address</label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-mono text-sm">
                                    {publicKey?.toBase58()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
