// src/hooks/useLiveData.ts
import { useEffect, useRef } from 'react';
import { usePriceStore } from '../lib/store';

const API_BASE = 'https://velocity-api.devsiten.workers.dev';

const TRACKED_MINTS = [
    'So11111111111111111111111111111111111111112',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
];

export function useLivePrices(interval = 10000) {
    const { setPrices, setLoading } = usePriceStore();
    const ref = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/v1/trade/prices`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mints: TRACKED_MINTS }),
                });
                const data = await res.json();
                if (data.success) {
                    // Convert prices object to store format
                    const formatted: Record<string, { price: number; change24h: number }> = {};
                    for (const [mint, priceData] of Object.entries(data.data.prices)) {
                        // Handle both number and { sol, usd } formats
                        let price: number;
                        if (typeof priceData === 'number') {
                            price = priceData;
                        } else if (typeof priceData === 'object' && priceData !== null) {
                            price = (priceData as any).usd || (priceData as any).sol || 0;
                        } else {
                            price = 0;
                        }
                        formatted[mint] = { price, change24h: 0 };
                    }
                    setPrices(formatted);
                }
            } catch (e) {
                console.error('Price fetch error:', e);
            }
            setLoading(false);
        };

        fetchPrices();
        ref.current = setInterval(fetchPrices, interval);
        return () => clearInterval(ref.current);
    }, [interval, setPrices, setLoading]);
}
