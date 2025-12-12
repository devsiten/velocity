import { FC } from 'react';
import { useTradeStore } from '../lib/store';
import { useQuote } from '../hooks/useQuote';
import { SwapButton } from '../components/SwapButton';
import { SlippageSelector } from '../components/SlippageSelector';
import { QuoteDetails } from '../components/QuoteDetails';
import { PromoBanner } from '../components/PromoBanner';
import { TradeTabs } from '../components/TradeTabs';
import { formatAmount } from '../lib/constants';

export const TradePage: FC = () => {
  const {
    inputToken,
    outputToken,
    inputAmount,
    setInputAmount,
    quote,
    isQuoteLoading,
    swapTokens,
  } = useTradeStore();

  useQuote();

  const outputAmount = quote && outputToken
    ? formatAmount(quote.outAmount, outputToken.decimals)
    : '';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Main Swap Card */}
      <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl overflow-hidden">
        {/* Trade Tabs */}
        <div className="p-4 pb-0">
          <TradeTabs />
        </div>

        {/* Ultra V3 Toggle */}
        <div className="px-4 pb-4 flex items-center gap-2">
          <span className="text-xs text-[#8b949e]">⚡ Ultra V3</span>
          <button className="p-1 hover:bg-[#1e2530] rounded transition-colors">
            <svg className="w-4 h-4 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Selling section */}
        <div className="px-4 space-y-1">
          <div className="bg-[#161b22] rounded-xl p-4 border border-[#1e2530]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#8b949e]">Selling</span>
              <SlippageSelector />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { }}
                className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-xl transition-colors"
              >
                {inputToken?.logoURI ? (
                  <img src={inputToken.logoURI} alt={inputToken.symbol} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                )}
                <span className="font-semibold text-white">{inputToken?.symbol || 'USDC'}</span>
                <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="flex-1 text-right">
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setInputAmount(value);
                    }
                  }}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-mono font-semibold text-white text-right placeholder-[#8b949e] focus:outline-none"
                />
                <div className="text-xs text-[#8b949e] mt-1">$0</div>
              </div>
            </div>
          </div>

          {/* Swap direction button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={swapTokens}
              className="p-2 bg-[#0d1117] border border-[#1e2530] rounded-lg hover:border-[#00ffa3]/50 transition-all group"
            >
              <svg
                className="w-4 h-4 text-[#8b949e] group-hover:text-[#00ffa3] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>

          {/* Buying section */}
          <div className="bg-[#161b22] rounded-xl p-4 border border-[#1e2530]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#8b949e]">Buying</span>
              <span className="text-xs text-[#8b949e]">$0</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { }}
                className="flex items-center gap-2 px-3 py-2 bg-[#1e2530] hover:bg-[#2d3748] rounded-xl transition-colors"
              >
                {outputToken?.logoURI ? (
                  <img src={outputToken.logoURI} alt={outputToken.symbol} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                )}
                <span className="font-semibold text-white">{outputToken?.symbol || 'SOL'}</span>
                <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="flex-1 text-right">
                {isQuoteLoading && inputAmount ? (
                  <div className="h-8 shimmer rounded-lg" />
                ) : (
                  <div className="text-2xl font-mono font-semibold text-white">
                    {outputAmount || '0.00'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Details */}
        {quote && (
          <div className="px-4 py-3 border-t border-[#1e2530] mt-4">
            <QuoteDetails />
          </div>
        )}

        {/* Swap Button */}
        <div className="p-4">
          <SwapButton />
        </div>

        {/* Price History */}
        <div className="px-4 pb-4 border-t border-[#1e2530] pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-white">USDC</span>
                <span className="text-xs text-[#8b949e]">$0.99999</span>
                <span className="text-xs text-[#00ffa3]">0.02%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-white">SOL</span>
                <span className="text-xs text-[#8b949e]">$137.23</span>
                <span className="text-xs text-[#00ffa3]">5.67%</span>
              </div>
            </div>
          </div>
          <button className="mt-3 text-xs text-[#8b949e] hover:text-white flex items-center gap-1 transition-colors">
            Show History
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
