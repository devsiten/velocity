import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SOL_MINT } from '../lib/constants';

// SPL Token Program ID - hardcoded to avoid @solana/spl-token dependency
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

interface TokenBalance {
  mint: string;
  balance: string;
  decimals: number;
}

export function useBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalances, setTokenBalances] = useState<Map<string, TokenBalance>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!publicKey) {
      setSolBalance(0);
      setTokenBalances(new Map());
      return;
    }

    setIsLoading(true);

    try {
      const [solBal, tokenAccounts] = await Promise.all([
        connection.getBalance(publicKey),
        connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        }),
      ]);

      setSolBalance(solBal / LAMPORTS_PER_SOL);

      const balances = new Map<string, TokenBalance>();

      balances.set(SOL_MINT, {
        mint: SOL_MINT,
        balance: solBal.toString(),
        decimals: 9,
      });

      for (const account of tokenAccounts.value) {
        const info = account.account.data.parsed.info;
        const mint = info.mint;
        const balance = info.tokenAmount.amount;
        const decimals = info.tokenAmount.decimals;

        if (BigInt(balance) > 0n) {
          balances.set(mint, { mint, balance, decimals });
        }
      }

      setTokenBalances(balances);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    fetchBalances();

    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [fetchBalances]);

  const getBalance = useCallback((mint: string): string => {
    const token = tokenBalances.get(mint);
    return token?.balance || '0';
  }, [tokenBalances]);

  const getFormattedBalance = useCallback((mint: string, decimals: number): string => {
    const balance = getBalance(mint);
    const num = Number(balance) / Math.pow(10, decimals);
    if (num === 0) return '0';
    if (num < 0.0001) return '<0.0001';
    return num.toFixed(4);
  }, [getBalance]);

  return {
    solBalance,
    tokenBalances,
    isLoading,
    getBalance,
    getFormattedBalance,
    refetch: fetchBalances,
  };
}
