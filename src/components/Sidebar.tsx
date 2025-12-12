import { useUIStore } from '../lib/store';

const navItems = [
    { id: 'swap', label: 'Swap', icon: '↔️' },
    { id: 'stake', label: 'Stake', icon: '🏛️', badge: 'New' },
    { id: 'lend', label: 'Lend', icon: '💰' },
    { id: 'airdrop', label: 'Airdrop Checker', icon: '🎁' },
    { id: 'positions', label: 'Positions / PnL', icon: '📊' },
];

export const Sidebar = () => {
    const { activeTab, setActiveTab } = useUIStore();

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0b0b0e] border-r border-[#25252b] flex flex-col z-40">
            <div className="p-4 border-b border-[#25252b]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#c7f284] flex items-center justify-center text-[#0b0b0e] font-bold">V</div>
                    <span className="text-xl font-bold text-white">Velocity</span>
                </div>
            </div>
            <nav className="flex-1 p-3 space-y-1">
                <div className="text-xs text-[#6b7280] uppercase px-4 py-2">Explore Apps</div>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id ? 'bg-[#1b1b1f] text-white' : 'text-[#9ca3af] hover:text-white hover:bg-[#1b1b1f]'
                            }`}
                    >
                        <span>{item.icon}</span>
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        {item.badge && <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#c7f284] text-[#0b0b0e] font-bold">{item.badge}</span>}
                    </button>
                ))}
            </nav>
        </aside>
    );
};
