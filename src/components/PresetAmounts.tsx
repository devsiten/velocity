import { FC } from 'react';
import { useTradeStore } from '../lib/store';
import { PRESET_AMOUNTS } from '../lib/constants';

export const PresetAmounts: FC = () => {
  const { inputToken, setInputAmount } = useTradeStore();

  if (!inputToken || inputToken.symbol !== 'SOL') return null;

  return (
    <div className="flex gap-2">
      {PRESET_AMOUNTS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => setInputAmount(preset.sol.toString())}
          className="flex-1 py-2 px-3 text-sm font-medium bg-bg-tertiary hover:bg-bg-elevated 
            text-text-secondary hover:text-text-primary rounded-lg transition-colors border border-border-primary"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
};
