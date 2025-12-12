import { FC } from 'react';
import { useTradeStore } from '../lib/store';
import { formatAmount } from '../lib/constants';

export const QuoteDetails: FC = () => {
  const { inputToken, outputToken, quote, slippageBps, isQuoteLoading } = useTradeStore();

  if (!quote || !inputToken || !outputToken) return null;

  const rate = Number(quote.outAmount) / Number(quote.inAmount);
  const rateFormatted = rate.toFixed(6);
  
  const minReceived = Number(quote.outAmount) * (1 - slippageBps / 10000);
  const minReceivedFormatted = formatAmount(Math.floor(minReceived).toString(), outputToken.decimals);

  const priceImpact = parseFloat(quote.priceImpactPct);
  const priceImpactColor = priceImpact < 1 
    ? 'text-accent-primary' 
    : priceImpact < 3 
      ? 'text-accent-warning' 
      : 'text-accent-danger';

  return (
    <div className="space-y-2 px-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">Rate</span>
        <span className="text-text-secondary mono flex items-center gap-1">
          {isQuoteLoading && (
            <span className="w-3 h-3 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          )}
          1 {inputToken.symbol} = {rateFormatted} {outputToken.symbol}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">Price Impact</span>
        <span className={`mono ${priceImpactColor}`}>
          {priceImpact.toFixed(2)}%
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">Min. Received</span>
        <span className="text-text-secondary mono">
          {minReceivedFormatted} {outputToken.symbol}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">Slippage</span>
        <span className="text-text-secondary mono">
          {slippageBps / 100}%
        </span>
      </div>

      {quote.routePlan && quote.routePlan.length > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Route</span>
          <span className="text-text-secondary">
            {quote.routePlan.length} hops
          </span>
        </div>
      )}
    </div>
  );
};
