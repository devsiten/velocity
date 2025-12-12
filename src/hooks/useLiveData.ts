// src/hooks/useLiveData.ts
import { useEffect, useRef } from 'react';
import { usePriceStore, useTrendingStore } from '../lib/store';

// Use Jupiter API for prices (no CORS issues, no rate limits)
export function useLivePrices(interval = 10000) {
    const { setPrices, setLoading } = usePriceStore();
    const ref = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                // Jupiter Price API - free and no CORS issues
                const mints = [
                    'So11111111111111111111111111111111111111112', // SOL
                    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
                    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
                    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
                    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
                    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', // mSOL
                    'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', // JitoSOL
                ];

                const res = await fetch(`https://price.jup.ag/v6/price?ids=${mints.join(',')}`);
                const data = await res.json();

                const prices: Record<string, { price: number; change24h: number }> = {};

                for (const mint of mints) {
                    if (data.data && data.data[mint]) {
                        prices[mint] = {
                            price: data.data[mint].price || 0,
                            change24h: 0, // Jupiter doesn't provide 24h change in this endpoint
                        };
                    }
                }

                setPrices(prices);
            } catch (e) {
                console.error('Jupiter price fetch error:', e);
            }
            setLoading(false);
        };

        fetchPrices();
        ref.current = setInterval(fetchPrices, interval);
        return () => clearInterval(ref.current);
    }, [interval, setPrices, setLoading]);
}

export function useTrendingTokens(interval = 60000) {
    const { setTokens, setLoading } = useTrendingStore();
    const ref = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Jupiter Verified Token List - Top tokens by volume
                const res = await fetch('https://token.jup.ag/strict');
                const allTokens = await res.json();

                // Get top 10 popular tokens
                const popularMints = [
                    'So11111111111111111111111111111111111111112', // SOL
                    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
                    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
                    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
                    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', // mSOL
                    'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', // JitoSOL
                    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
                    'RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a', // RAY
                    'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE', // ORCA
                    'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', // PYTH
                ];

                // Get prices for these tokens
                const priceRes = await fetch(`https://price.jup.ag/v6/price?ids=${popularMints.join(',')}`);
                const priceData = await priceRes.json();

                const tokens = popularMints.map((mint, index) => {
                    const tokenInfo = allTokens.find((t: any) => t.address === mint);
                    const price = priceData.data?.[mint]?.price || 0;

                    return {
                        rank: index + 1,
                        id: mint,
                        address: mint,
                        symbol: tokenInfo?.symbol || 'UNKNOWN',
                        name: tokenInfo?.name || 'Unknown Token',
                        logoURI: tokenInfo?.logoURI || 'https://via.placeholder.com/28',
                        decimals: tokenInfo?.decimals || 9,
                        price: price,
                        change24h: 0, // Jupiter price API doesn't provide 24h change
                        volume24h: 0,
                        marketCap: 0,
                    };
                });

                setTokens(tokens);
            } catch (e) {
                console.error('Jupiter trending fetch error:', e);
            }
            setLoading(false);
        };

        fetchTrending();
        ref.current = setInterval(fetchTrending, interval);
        return () => clearInterval(ref.current);
    }, [interval, setTokens, setLoading]);
}
