import { FC, useState } from 'react';
import { useTradeStore, useUIStore } from '../lib/store';
import { SLIPPAGE_PRESETS } from '../lib/constants';

export const SlippageSelector: FC = () => {
  const { slippageBps, setSlippageBps } = useTradeStore();
  const { isSettingsOpen, setIsSettingsOpen } = useUIStore();
  const [customValue, setCustomValue] = useState('');

  const handleCustomChange = (value: string) => {
    setCustomValue(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0 && num <= 50) {
      setSlippageBps(Math.floor(num * 100));
    }
  };

  const isCustom = !SLIPPAGE_PRESETS.some(p => p.value === slippageBps);
  const displayValue = slippageBps / 100;

  return (
    <div className="relative">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary 
          hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        <span className="mono">{displayValue}%</span>
      </button>

      {isSettingsOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsSettingsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 z-50 card p-4 w-72 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Settings</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <label className="label">Slippage Tolerance</label>
              <div className="flex gap-2 mb-3">
                {SLIPPAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setSlippageBps(preset.value);
                      setCustomValue('');
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                      ${slippageBps === preset.value 
                        ? 'bg-accent-primary text-bg-primary' 
                        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated'
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={isCustom ? displayValue.toString() : customValue}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  placeholder="Custom"
                  className={`input text-right pr-8 ${isCustom ? 'border-accent-primary' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">%</span>
              </div>

              {slippageBps > 500 && (
                <p className="mt-2 text-sm text-accent-warning flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                  High slippage may result in unfavorable trades
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
