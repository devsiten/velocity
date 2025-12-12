import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { useTradeStore } from '../lib/store';
import { api } from '../lib/api';
import { getExplorerUrl } from '../lib/constants';

export function useSwap() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { 
    inputToken, 
    outputToken, 
    quote, 
    setIsSwapping, 
    reset,
  } = useTradeStore();

  const executeSwap = useCallback(async () => {
    if (!publicKey || !signTransaction || !quote || !inputToken || !outputToken) {
      toast.error('Please connect wallet and get a quote first');
      return null;
    }

    setIsSwapping(true);
    const toastId = toast.loading('Building transaction...');

    try {
      const { swapTransaction, tradeId, lastValidBlockHeight } = await api.buildSwap(
        quote,
        publicKey.toBase58(),
        inputToken.symbol,
        outputToken.symbol
      );

      toast.loading('Please sign the transaction...', { id: toastId });

      const txBuffer = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(txBuffer);
      const signedTx = await signTransaction(transaction);

      toast.loading('Sending transaction...', { id: toastId });

      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      });

      toast.loading('Confirming...', { id: toastId });

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: transaction.message.recentBlockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      const { pointsEarned } = await api.confirmTrade(tradeId, signature);

      toast.success(
        `Swap successful! +${pointsEarned} points. View on explorer: ${getExplorerUrl(signature)}`,
        { id: toastId, duration: 6000 }
      );

      reset();
      return signature;

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Swap failed';
      
      if (message.includes('User rejected')) {
        toast.error('Transaction cancelled', { id: toastId });
      } else {
        toast.error(message, { id: toastId });
      }
      
      return null;
    } finally {
      setIsSwapping(false);
    }
  }, [publicKey, signTransaction, quote, inputToken, outputToken, connection, setIsSwapping, reset]);

  return { executeSwap };
}
