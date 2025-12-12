import { useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTradeStore, usePriceStore, useUIStore } from '../lib/store';
import { api } from '../lib/api';

export const SwapCard = () => {
    const { connected, publicKey } = useWallet();
    const { setVisible } = useWalletModal();
    const { openTokenSearch } = useUIStore();
    const { prices } = usePriceStore();
    const { inputToken, outputToken, inputAmount, outputAmount, quote, isQuoteLoading, setInputAmount, setOutputAmount, setQuote, setQuoteLoading, swapTokens } = useTradeStore();

    const pollRef = useRef<NodeJS.Timeout>();

    const fetchQuote = useCallback(async () => {
        if (!inputToken || !outputToken || !inputAmount || !publicKey || parseFloat(inputAmount) <= 0) {
            setQuote(null);
            setOutputAmount('');
            return;
        }
        setQuoteLoading(true);
        try {
            const amt = Math.floor(parseFloat(inputAmount) * Math.pow(10, inputToken.decimals)).toString();
            const q: any = await api.getQuote({ inputMint: inputToken.address, outputMint: outputToken.address, amount: amt, slippageBps: 100, userPublicKey: publicKey.toBase58() });
            setQuote(q);
            setOutputAmount((Number(q.outAmount) / Math.pow(10, outputToken.decimals)).toFixed(6));
        } catch (e) {
            console.error(e);
            setQuote(null);
            setOutputAmount('');
        }
        setQuoteLoading(false);
    }, [inputToken, outputToken, inputAmount, publicKey, setQuote, setOutputAmount, setQuoteLoading]);

    useEffect(() => {
        const t = setTimeout(fetchQuote, 500);
        return () => clearTimeout(t);
    }, [fetchQuote]);

    useEffect(() => {
        if (!inputAmount || parseFloat(inputAmount) <= 0) return;
        pollRef.current = setInterval(fetchQuote, 2000);
        return () => clearInterval(pollRef.current);
    }, [inputAmount, fetchQuote]);

    const inPrice = prices[inputToken?.address];
    const outPrice = prices[outputToken?.address];
    const inUsd = inputAmount && inPrice ? (parseFloat(inputAmount) * inPrice.price).toFixed(2) : '0';
    const outUsd = outputAmount && outPrice ? (parseFloat(outputAmount) * outPrice.price).toFixed(2) : '0';

    return (
        <div className="w-full max-w-[480px]">
            {/* Header with title */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Lightning Fast Solana Trading</h1>
                <p className="text-sm text-[#6b7280] mt-2">Trade at your own risk. Always verify token contracts.</p>
            </div>

            {/* Swap Card */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between px-2 py-3 mb-2">
                    <h2 className="text-lg font-semibold text-white">Swap</h2>
                    <div className="flex items-center gap-2">
                        {isQuoteLoading && <div className="w-4 h-4 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />}
                        <button className="p-2 hover:bg-[#1b1b1f] rounded-lg transition-colors">
                            <span className="text-[#6b7280]">⚙️</span>
                        </button>
                    </div>
                </div>

                {/* Selling section */}
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
                            />
                            <div className="text-sm text-[#6b7280] mt-1">${inUsd}</div>
                        </div>
                    </div>
                </div>

                {/* Swap button */}
                <div className="flex justify-center -my-3 z-10 relative">
                    <button onClick={swapTokens} className="p-3 bg-[#131318] border border-[#25252b] rounded-xl hover:bg-[#1b1b1f] transition-colors">
                        <span className="text-lg">↕️</span>
                    </button>
                </div>

                {/* Buying section */}
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

                {/* Quote details */}
                {quote && (
                    <div className="px-2 py-3 text-sm space-y-2 mt-2">
                        <div className="flex justify-between">
                            <span className="text-[#6b7280]">Rate</span>
                            <span className="text-white">1 {inputToken.symbol} = {(Number(quote.outAmount) / Number(quote.inAmount) * Math.pow(10, inputToken.decimals - outputToken.decimals)).toFixed(6)} {outputToken.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6b7280]">Price Impact</span>
                            <span className={parseFloat(quote.priceImpactPct) > 1 ? 'text-[#ff6b6b]' : 'text-[#00d4aa]'}>{parseFloat(quote.priceImpactPct).toFixed(2)}%</span>
                        </div>
                    </div>
                )}

                {/* Swap button */}
                <div className="mt-4">
                    {connected ? (
                        <button
                            disabled={!quote || isQuoteLoading}
                            className="w-full py-5 rounded-xl font-bold text-lg bg-[#00d4aa] text-[#0b0b0e] hover:bg-[#00c49a] disabled:opacity-50 transition-colors"
                        >
                            {isQuoteLoading ? 'Getting Quote...' : quote ? 'Swap' : 'Enter Amount'}
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
