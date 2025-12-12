import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTradeStore } from '../lib/store';
import { useSwap } from '../hooks/useSwap';
import { useBalance } from '../hooks/useBalance';

export const SwapButton: FC = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { 
    inputToken, 
    outputToken, 
    inputAmount, 
    quote, 
    isQuoteLoading, 
    isSwapping 
  } = useTradeStore();
  const { executeSwap } = useSwap();
  const { getBalance } = useBalance();

  if (!connected) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="w-full btn btn-primary py-4 text-lg font-semibold"
      >
        Connect Wallet
      </button>
    );
  }

  const hasInput = inputToken && inputAmount && parseFloat(inputAmount) > 0;
  const hasOutput = outputToken !== null;
  const hasQuote = quote !== null;

  let buttonText = 'Swap';
  let isDisabled = false;

  if (!hasInput) {
    buttonText = 'Enter amount';
    isDisabled = true;
  } else if (!hasOutput) {
    buttonText = 'Select output token';
    isDisabled = true;
  } else if (isQuoteLoading) {
    buttonText = 'Fetching quote...';
    isDisabled = true;
  } else if (!hasQuote) {
    buttonText = 'No route found';
    isDisabled = true;
  } else if (isSwapping) {
    buttonText = 'Swapping...';
    isDisabled = true;
  } else {
    const balance = getBalance(inputToken.address);
    const inputLamports = Math.floor(parseFloat(inputAmount) * Math.pow(10, inputToken.decimals));
    
    if (BigInt(inputLamports) > BigInt(balance)) {
      buttonText = `Insufficient ${inputToken.symbol}`;
      isDisabled = true;
    }
  }

  return (
    <button
      onClick={executeSwap}
      disabled={isDisabled}
      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200
        ${isDisabled 
          ? 'bg-bg-elevated text-text-muted cursor-not-allowed' 
          : 'btn-primary shadow-glow-sm hover:shadow-glow-md'
        }
        ${isSwapping ? 'animate-pulse' : ''}
      `}
    >
      {isSwapping && (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {buttonText}
        </span>
      )}
      {!isSwapping && buttonText}
    </button>
  );
};
