import { useEffect, useCallback, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTradeStore, usePriceStore, useUIStore } from '../lib/store';
import { Connection, VersionedTransaction } from '@solana/web3.js';

const API_BASE = 'https://velocity-api.devsiten.workers.dev';

export const SwapCard = () => {
    const { connected, publicKey, signTransaction } = useWallet();
    const { setVisible } = useWalletModal();
    const { openTokenSearch } = useUIStore();
    const { prices } = usePriceStore();
    const { inputToken, outputToken, inputAmount, outputAmount, quote, isQuoteLoading, setInputAmount, setOutputAmount, setQuote, setQuoteLoading, swapTokens } = useTradeStore();

    const [isSwapping, setIsSwapping] = useState(false);
    const [swapStatus, setSwapStatus] = useState<string | null>(null);
    const pollRef = useRef<NodeJS.Timeout>();

    // Fetch quote from backend API
    const fetchQuote = useCallback(async () => {
        if (!inputToken || !outputToken || !inputAmount || parseFloat(inputAmount) <= 0) {
            setQuote(null);
            setOutputAmount('');
            return;
        }
        setQuoteLoading(true);
        try {
            const amt = Math.floor(parseFloat(inputAmount) * Math.pow(10, inputToken.decimals)).toString();
            const userKey = publicKey?.toBase58() || '11111111111111111111111111111111';

            const res = await fetch(`${API_BASE}/api/v1/trade/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputMint: inputToken.address,
                    outputMint: outputToken.address,
                    amount: amt,
                    slippageBps: 100,
                    userPublicKey: userKey,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setQuote(data.data);
                setOutputAmount((Number(data.data.outAmount) / Math.pow(10, outputToken.decimals)).toFixed(6));
            } else {
                console.error('Quote error:', data.error);
                setQuote(null);
                setOutputAmount('');
            }
        } catch (e) {
            console.error('Quote error:', e);
            setQuote(null);
            setOutputAmount('');
        }
        setQuoteLoading(false);
    }, [inputToken, outputToken, inputAmount, publicKey, setQuote, setOutputAmount, setQuoteLoading]);

    // Debounced quote fetch when input changes
    useEffect(() => {
        const t = setTimeout(fetchQuote, 500);
        return () => clearTimeout(t);
    }, [fetchQuote]);

    // Poll for quote updates
    useEffect(() => {
        if (!inputAmount || parseFloat(inputAmount) <= 0) return;
        pollRef.current = setInterval(fetchQuote, 10000);
        return () => clearInterval(pollRef.current);
    }, [inputAmount, fetchQuote]);

    const executeSwap = async () => {
        if (!quote || !publicKey || !signTransaction) return;

        setIsSwapping(true);
        setSwapStatus('Building transaction...');

        try {
            // Build swap via backend
            const swapRes = await fetch(`${API_BASE}/api/v1/trade/swap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Public-Key': publicKey.toBase58(),
                },
                body: JSON.stringify({
                    quoteResponse: quote,
                    userPublicKey: publicKey.toBase58(),
                    inputSymbol: inputToken.symbol,
                    outputSymbol: outputToken.symbol,
                }),
            });

            const swapData = await swapRes.json();

            if (!swapData.success) {
                throw new Error(swapData.error || 'Swap build failed');
            }

            setSwapStatus('Waiting for signature...');

            const base64 = swapData.data.swapTransaction;
            const binaryString = atob(base64);
            const swapTransactionBuf = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                swapTransactionBuf[i] = binaryString.charCodeAt(i);
            }
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            const signedTransaction = await signTransaction(transaction);

            setSwapStatus('Sending transaction...');

            const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=e495db18-fb79-4c7b-9750-5bf08d316aaf');
            const rawTransaction = signedTransaction.serialize();
            const txSignature = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2,
            });

            setSwapStatus('Confirming...');
            await connection.confirmTransaction(txSignature, 'confirmed');

            // Confirm with backend for points
            try {
                await fetch(`${API_BASE}/api/v1/trade/confirm`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Public-Key': publicKey.toBase58(),
                    },
                    body: JSON.stringify({
                        tradeId: swapData.data.tradeId,
                        txSignature,
                    }),
                });
            } catch (e) {
                // Points confirmation failed, but swap succeeded
            }

            setSwapStatus(`Success! TX: ${txSignature.slice(0, 8)}...`);
            setInputAmount('');
            setOutputAmount('');
            setQuote(null);

            setTimeout(() => setSwapStatus(null), 5000);

        } catch (error) {
            console.error('Swap failed:', error);
            setSwapStatus(`Error: ${error instanceof Error ? error.message : 'Swap failed'}`);
            setTimeout(() => setSwapStatus(null), 5000);
        }

        setIsSwapping(false);
    };

    const inPrice = prices[inputToken?.address];
    const outPrice = prices[outputToken?.address];
    const inUsd = inputAmount && inPrice ? (parseFloat(inputAmount) * inPrice.price).toFixed(2) : '0';
    const outUsd = outputAmount && outPrice ? (parseFloat(outputAmount) * outPrice.price).toFixed(2) : '0';

    const getButtonText = () => {
        if (isSwapping) return swapStatus || 'Processing...';
        if (isQuoteLoading) return 'Getting Quote...';
        if (quote) return 'Swap';
        return 'Enter Amount';
    };

    return (
        <div className="w-full max-w-[480px]">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Lightning Fast Solana Trading</h1>
                <p className="text-sm text-[#6b7280] mt-2">Trade at your own risk. Always verify token contracts.</p>
            </div>

            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-4">
                <div className="flex items-center justify-between px-2 py-3 mb-2">
                    <h2 className="text-lg font-semibold text-white">Swap</h2>
                    <div className="flex items-center gap-2">
                        {(isQuoteLoading || isSwapping) && <div className="w-4 h-4 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />}
                        <button className="p-2 hover:bg-[#1b1b1f] rounded-lg transition-colors">
                            <span className="text-[#6b7280]">⚙️</span>
                        </button>
                    </div>
                </div>

                <div className="bg-[#1b1b1f] rounded-xl p-5">
                    <div className="text-sm text-[#6b7280] mb-3">Selling</div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => openTokenSearch('input')} className="flex items-center gap-2 px-4 py-2.5 bg-[#131318] rounded-full hover:bg-[#25252b] transition-colors">
                            <img src={inputToken.logoURI} className="w-7 h-7 rounded-full" />
                            <span className="text-white font-semibold">{inputToken.symbol}</span>
                            <span className="text-[#6b7280]">▼</span>
                        </button>
                        <div className="text-right">
                            <input
                                type="text"
                                value={inputAmount}
                                onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setInputAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-right text-4xl font-semibold text-white placeholder-[#6b7280] focus:outline-none w-48"
                                disabled={isSwapping}
                            />
                            <div className="text-sm text-[#6b7280] mt-1">${inUsd}</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center -my-3 z-10 relative">
                    <button onClick={swapTokens} disabled={isSwapping} className="p-3 bg-[#131318] border border-[#25252b] rounded-xl hover:bg-[#1b1b1f] transition-colors disabled:opacity-50">
                        <span className="text-lg">↕️</span>
                    </button>
                </div>

                <div className="bg-[#1b1b1f] rounded-xl p-5">
                    <div className="text-sm text-[#6b7280] mb-3">Buying</div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => openTokenSearch('output')} className="flex items-center gap-2 px-4 py-2.5 bg-[#131318] rounded-full hover:bg-[#25252b] transition-colors">
                            <img src={outputToken.logoURI} className="w-7 h-7 rounded-full" />
                            <span className="text-white font-semibold">{outputToken.symbol}</span>
                            <span className="text-[#6b7280]">▼</span>
                        </button>
                        <div className="text-right">
                            <div className="text-4xl font-semibold text-white w-48 text-right">
                                {isQuoteLoading ? <span className="text-[#6b7280] animate-pulse">...</span> : outputAmount || <span className="text-[#6b7280]">0.00</span>}
                            </div>
                            <div className="text-sm text-[#6b7280] mt-1">${outUsd}</div>
                        </div>
                    </div>
                </div>

                {quote && (
                    <div className="px-2 py-3 text-sm space-y-2 mt-2">
                        <div className="flex justify-between">
                            <span className="text-[#6b7280]">Rate</span>
                            <span className="text-white">1 {inputToken.symbol} = {(Number(quote.outAmount) / Number(quote.inAmount) * Math.pow(10, inputToken.decimals - outputToken.decimals)).toFixed(6)} {outputToken.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6b7280]">Price Impact</span>
                            <span className={parseFloat(quote.priceImpactPct || '0') > 1 ? 'text-[#ff6b6b]' : 'text-[#00d4aa]'}>{parseFloat(quote.priceImpactPct || '0').toFixed(2)}%</span>
                        </div>
                    </div>
                )}

                {swapStatus && (
                    <div className={`px-4 py-2 text-center text-sm ${swapStatus.includes('Error') ? 'text-[#ff6b6b]' : swapStatus.includes('Success') ? 'text-[#00d4aa]' : 'text-[#6b7280]'}`}>
                        {swapStatus}
                    </div>
                )}

                <div className="mt-4">
                    {connected ? (
                        <button
                            onClick={executeSwap}
                            disabled={!quote || isQuoteLoading || isSwapping}
                            className="w-full py-5 rounded-xl font-bold text-lg bg-[#00d4aa] text-[#0b0b0e] hover:bg-[#00c49a] disabled:opacity-50 transition-colors"
                        >
                            {getButtonText()}
                        </button>
                    ) : (
                        <button
                            onClick={() => setVisible(true)}
                            className="w-full py-5 rounded-xl font-bold text-lg bg-[#00d4aa] text-[#0b0b0e] hover:bg-[#00c49a] transition-colors"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
