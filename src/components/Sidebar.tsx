import { useUIStore } from '../lib/store';

const navItems = [
    { id: 'swap', label: 'Swap', icon: '↔️' },
    { id: 'stake', label: 'Stake', icon: '🏛️', badge: 'New' },
    { id: 'lend', label: 'Lend', icon: '💰' },
    { id: 'borrow', label: 'Borrow', icon: '🏦' },
    { id: 'strategies', label: 'Strategies', icon: '📈' },
    { id: 'positions', label: 'Profile', icon: '👤' },
];

export const Sidebar = () => {
    const { activeTab, setActiveTab } = useUIStore();

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-gradient-to-b from-[#7C3AED] to-[#10B981] flex flex-col z-40">
            <div className="p-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#9945FF] font-bold">V</div>
                    <span className="text-xl font-bold text-white">Velocity</span>
                </div>
            </div>
            <nav className="flex-1 p-3 space-y-1">
                <div className="text-xs text-white/70 uppercase px-4 py-2">Explore Apps</div>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id
                            ? 'bg-white text-[#9945FF]'
                            : 'text-white hover:bg-white/20'
                            }`}
                    >
                        <span>{item.icon}</span>
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        {item.badge && <span className="px-2 py-0.5 text-[10px] rounded-full bg-white text-[#9945FF] font-bold">{item.badge}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/20">
                <div className="space-y-3 text-sm">
                    <a href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                        <span>💬</span> Help Center
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                        <span>🐦</span> Twitter
                    </a>
                    <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                        <span>💜</span> Discord
                    </a>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20 text-xs text-white/70">
                    © 2025 Velocity Trade. All Rights Reserved.
                </div>
            </div>
        </aside>
    );
};
