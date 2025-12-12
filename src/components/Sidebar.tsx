import { FC } from 'react';
import { useUIStore } from '../lib/store';

const navItems = [
    { id: 'swap', label: 'Swap', icon: '⚡' },
    { id: 'stake', label: 'Stake', icon: '🔒' },
    { id: 'lend', label: 'Lend', icon: '💰' },
    { id: 'borrow', label: 'Borrow', icon: '🏦' },
] as const;

const secondaryItems = [
    { label: 'Airdrop Checker', icon: '🎁' },
    { label: 'Portfolio', icon: '📊' },
    { label: 'Analytics', icon: '📈' },
];

export const Sidebar: FC = () => {
    const { activeTab, setActiveTab, isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <>
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0d1117] border-r border-[#1e2530] z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-[#1e2530]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ffa3] to-[#00d4aa] flex items-center justify-center">
                            <span className="text-black font-bold text-sm">V</span>
                        </div>
                        <span className="text-lg font-bold text-white">Velocity</span>
                    </div>
                </div>

                {/* Main navigation */}
                <nav className="p-3 space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-[#8b949e] uppercase tracking-wider">
                        Trade
                    </div>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (isSidebarOpen) toggleSidebar();
                            }}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${activeTab === item.id
                                    ? 'bg-[#1a2332] text-[#00ffa3]'
                                    : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
                                }
              `}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                            {item.id === 'stake' && (
                                <span className="ml-auto text-[10px] bg-[#00ffa3]/20 text-[#00ffa3] px-1.5 py-0.5 rounded">
                                    NEW
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Secondary navigation */}
                <nav className="p-3 border-t border-[#1e2530]">
                    <div className="px-3 py-2 text-xs font-medium text-[#8b949e] uppercase tracking-wider">
                        Explore
                    </div>
                    {secondaryItems.map((item, index) => (
                        <button
                            key={index}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                text-[#8b949e] hover:text-white hover:bg-[#161b22] transition-all duration-200"
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Bottom links */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1e2530]">
                    <div className="space-y-2 text-xs text-[#8b949e]">
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                            <span>📱</span> Download App
                        </a>
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                            <span>💬</span> Help Center
                        </a>
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                            <span>🐦</span> Twitter
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
};
