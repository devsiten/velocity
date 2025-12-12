import { FC, useState } from 'react';

type TradeMode = 'market' | 'limit' | 'recurring';

interface TradeTabsProps {
    mode?: TradeMode;
    onModeChange?: (mode: TradeMode) => void;
}

export const TradeTabs: FC<TradeTabsProps> = ({ mode = 'market', onModeChange }) => {
    const [activeMode, setActiveMode] = useState<TradeMode>(mode);

    const handleModeChange = (newMode: TradeMode) => {
        setActiveMode(newMode);
        onModeChange?.(newMode);
    };

    return (
        <div className="flex items-center gap-1 p-1 bg-[#0d1117] rounded-xl mb-4">
            {(['market', 'limit', 'recurring'] as TradeMode[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => handleModeChange(tab)}
                    className={`
            flex-1 py-2.5 px-4 rounded-lg text-sm font-medium capitalize
            transition-all duration-200
            ${activeMode === tab
                            ? 'bg-[#1a2332] text-white shadow-sm'
                            : 'text-[#8b949e] hover:text-white'
                        }
          `}
                >
                    {tab}
                    {tab === 'limit' && (
                        <span className="ml-1.5 text-[10px] bg-[#238636]/30 text-[#3fb950] px-1.5 py-0.5 rounded">
                            V2
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
