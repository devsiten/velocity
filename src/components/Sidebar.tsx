import { useUIStore } from '../lib/store';

const navItems = [
    { id: 'swap', label: 'Swap', icon: '↔️' },
    { id: 'stake', label: 'Stake', icon: '🏛️', badge: 'New' },
    { id: 'lend', label: 'Lend', icon: '💰' },
    { id: 'strategies', label: 'Strategies', icon: '📈' },
    { id: 'positions', label: 'Positions / PnL', icon: '📊' },
];

export const Sidebar = () => {
    const { activeTab, setActiveTab } = useUIStore();

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0b0b0e] border-r border-[#25252b] flex flex-col z-40">
            <div className="p-4 border-b border-[#25252b]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00d4aa] flex items-center justify-center text-[#0b0b0e] font-bold">V</div>
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
                        {item.badge && <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#00d4aa] text-[#0b0b0e] font-bold">{item.badge}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#25252b]">
                <div className="space-y-3 text-sm">

                    <a href="#" className="flex items-center gap-2 text-[#6b7280] hover:text-white transition-colors">
                        <span>💬</span> Help Center
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#6b7280] hover:text-white transition-colors">
                        <span>🐦</span> Twitter
                    </a>
                    <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#6b7280] hover:text-white transition-colors">
                        <span>💜</span> Discord
                    </a>
                </div>
                <div className="mt-4 pt-3 border-t border-[#25252b] text-xs text-[#6b7280]">
                    © 2025 Velocity Trade. All Rights Reserved.
                </div>
            </div>
        </aside>
    );
};
