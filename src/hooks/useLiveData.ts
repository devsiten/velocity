// src/hooks/useLiveData.ts
import { useEffect, useRef } from 'react';
import { usePriceStore, useTrendingStore } from '../lib/store';

// CoinGecko IDs for tracked tokens
const COINGECKO_IDS: Record<string, string> = {
    'So11111111111111111111111111111111111111112': 'solana',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'usd-coin',
    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 'jupiter-exchange-solana',
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'bonk',
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'tether',
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 'msol',
    '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': 'lido-staked-sol',
    'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': 'pyth-network',
    'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE': 'orca',
    'RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a': 'raydium',
    'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL': 'jito-governance-token',
    'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk': 'wen-4',
    'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn': 'jito-staked-sol',
};


export function useLivePrices(interval = 10000) {
    const { setPrices, setLoading } = usePriceStore();
    const ref = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const ids = Object.values(COINGECKO_IDS).join(',');
                const res = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
                );
                const data = await res.json();

                const prices: Record<string, { price: number; change24h: number }> = {};

                for (const [mint, geckoId] of Object.entries(COINGECKO_IDS)) {
                    if (data[geckoId]) {
                        prices[mint] = {
                            price: data[geckoId].usd || 0,
                            change24h: data[geckoId].usd_24h_change || 0,
                        };
                    }
                }

                setPrices(prices);
            } catch (e) {
                console.error('CoinGecko price fetch error:', e);
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
                // CoinGecko trending for Solana ecosystem
                const res = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=volume_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
                );
                const data = await res.json();

                const tokens = data.map((token: any, index: number) => ({
                    rank: index + 1,
                    id: token.id,
                    symbol: token.symbol?.toUpperCase(),
                    name: token.name,
                    logoURI: token.image,
                    price: token.current_price || 0,
                    change24h: token.price_change_percentage_24h || 0,
                    volume24h: token.total_volume || 0,
                    marketCap: token.market_cap || 0,
                }));

                setTokens(tokens);
            } catch (e) {
                console.error('CoinGecko trending fetch error:', e);
            }
            setLoading(false);
        };

        fetchTrending();
        ref.current = setInterval(fetchTrending, interval);
        return () => clearInterval(ref.current);
    }, [interval, setTokens, setLoading]);
}
