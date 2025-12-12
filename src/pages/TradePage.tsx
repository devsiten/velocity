import { FC } from 'react';
import { useTradeStore } from '../lib/store';
import { useQuote } from '../hooks/useQuote';
import { TokenInput } from '../components/TokenInput';
import { SwapButton } from '../components/SwapButton';
import { SlippageSelector } from '../components/SlippageSelector';
import { QuoteDetails } from '../components/QuoteDetails';
import { PresetAmounts } from '../components/PresetAmounts';
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
      <div className="card p-1.5">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-text-primary">Swap</h2>
          <SlippageSelector />
        </div>

        <div className="space-y-1 p-2">
          <TokenInput
            token={inputToken}
            amount={inputAmount}
            onAmountChange={setInputAmount}
            mode="input"
            label="You pay"
          />

          <div className="flex justify-center -my-3 relative z-10">
            <button
              onClick={swapTokens}
              className="p-2.5 bg-bg-secondary border border-border-primary rounded-xl 
                hover:bg-bg-elevated hover:border-accent-primary/50 transition-all duration-200
                group"
            >
              <svg
                className="w-5 h-5 text-text-muted group-hover:text-accent-primary 
                  transition-colors rotate-0 group-hover:rotate-180 duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <TokenInput
            token={outputToken}
            amount={outputAmount}
            mode="output"
            label="You receive"
            readonly
            isLoading={isQuoteLoading && !!inputAmount}
          />
        </div>

        <div className="px-4 pb-2">
          <PresetAmounts />
        </div>

        {quote && (
          <div className="px-4 py-3 border-t border-border-primary">
            <QuoteDetails />
          </div>
        )}

        <div className="p-4">
          <SwapButton />
        </div>
      </div>

      <p className="text-center text-xs text-text-muted mt-4">
        Trade at your own risk. Always verify token contracts.
      </p>
    </div>
  );
};
