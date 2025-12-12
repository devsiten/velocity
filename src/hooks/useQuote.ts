import { useEffect, useRef, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTradeStore, usePriceStore } from '../lib/store';
import { api } from '../lib/api';

const QUOTE_REFRESH_INTERVAL = 2000;
const MIN_AMOUNT = '1000';

export function useQuote() {
  const { publicKey } = useWallet();
  const { 
    inputToken, 
    outputToken, 
    inputAmount, 
    slippageBps,
    setQuote,
    setIsQuoteLoading,
  } = useTradeStore();
  const { setPrices } = usePriceStore();
  
  const intervalRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!inputToken || !outputToken || !inputAmount || !publicKey) {
      setQuote(null);
      return;
    }

    const amountLamports = Math.floor(
      parseFloat(inputAmount) * Math.pow(10, inputToken.decimals)
    ).toString();

    if (BigInt(amountLamports) < BigInt(MIN_AMOUNT)) {
      setQuote(null);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      setIsQuoteLoading(true);
      
      const quote = await api.getQuote({
        inputMint: inputToken.address,
        outputMint: outputToken.address,
        amount: amountLamports,
        slippageBps,
        userPublicKey: publicKey.toBase58(),
      });

      setQuote(quote);

      const inputPrice = parseFloat(quote.inAmount) > 0 
        ? parseFloat(quote.outAmount) / parseFloat(quote.inAmount) 
        : 0;
      
      setPrices({
        [inputToken.address]: 1,
        [outputToken.address]: inputPrice,
      });

    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Quote error:', error);
        setQuote(null);
      }
    } finally {
      setIsQuoteLoading(false);
    }
  }, [inputToken, outputToken, inputAmount, slippageBps, publicKey, setQuote, setIsQuoteLoading, setPrices]);

  useEffect(() => {
    fetchQuote();

    if (inputToken && outputToken && inputAmount && publicKey) {
      intervalRef.current = window.setInterval(fetchQuote, QUOTE_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      abortRef.current?.abort();
    };
  }, [fetchQuote]);

  return { refetch: fetchQuote };
}
