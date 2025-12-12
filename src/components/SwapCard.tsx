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
        <div className="w-full max-w-[420px]">
            <div className="flex gap-1 mb-4 p-1 bg-[#131318] rounded-xl border border-[#25252b]">
                <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-[#1b1b1f] text-white">Market</button>
                <button className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#9ca3af]">Limit <span className="ml-1 px-1 text-[10px] bg-[#c7f284] text-[#0b0b0e] rounded">V2</span></button>
                <button className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#9ca3af]">Recurring</button>
            </div>
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-2">
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-[#9ca3af]">⚡ Ultra V3 ⚙️</span>
                    {isQuoteLoading && <div className="w-4 h-4 border-2 border-[#c7f284] border-t-transparent rounded-full animate-spin" />}
                </div>
                <div className="bg-[#1b1b1f] rounded-xl p-4">
                    <div className="text-sm text-[#6b7280] mb-3">Selling</div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => openTokenSearch('input')} className="flex items-center gap-2 px-3 py-2 bg-[#131318] rounded-full hover:bg-[#25252b]">
                            <img src={inputToken.logoURI} className="w-6 h-6 rounded-full" />
                            <span className="text-white font-medium">{inputToken.symbol}</span>
                            <span className="text-[#6b7280]">▼</span>
                        </button>
                        <div className="text-right">
                            <input type="text" value={inputAmount} onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setInputAmount(e.target.value)} placeholder="0.00" className="bg-transparent text-right text-3xl font-medium text-white placeholder-[#6b7280] focus:outline-none w-40" />
                            <div className="text-sm text-[#6b7280]">${inUsd}</div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center -my-2 z-10 relative">
                    <button onClick={swapTokens} className="p-2 bg-[#131318] border border-[#25252b] rounded-lg hover:bg-[#1b1b1f]">↕️</button>
                </div>
                <div className="bg-[#1b1b1f] rounded-xl p-4">
                    <div className="text-sm text-[#6b7280] mb-3">Buying</div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => openTokenSearch('output')} className="flex items-center gap-2 px-3 py-2 bg-[#131318] rounded-full hover:bg-[#25252b]">
                            <img src={outputToken.logoURI} className="w-6 h-6 rounded-full" />
                            <span className="text-white font-medium">{outputToken.symbol}</span>
                            <span className="text-[#6b7280]">▼</span>
                        </button>
                        <div className="text-right">
                            <div className="text-3xl font-medium text-white w-40 text-right">{isQuoteLoading ? <span className="text-[#6b7280] animate-pulse">...</span> : outputAmount || <span className="text-[#6b7280]">0.00</span>}</div>
                            <div className="text-sm text-[#6b7280]">${outUsd}</div>
                        </div>
                    </div>
                </div>
                {quote && (
                    <div className="px-4 py-2 text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-[#6b7280]">Rate</span><span className="text-white">1 {inputToken.symbol} = {(Number(quote.outAmount) / Number(quote.inAmount) * Math.pow(10, inputToken.decimals - outputToken.decimals)).toFixed(6)} {outputToken.symbol}</span></div>
                        <div className="flex justify-between"><span className="text-[#6b7280]">Price Impact</span><span className={parseFloat(quote.priceImpactPct) > 1 ? 'text-[#ff6b6b]' : 'text-[#c7f284]'}>{parseFloat(quote.priceImpactPct).toFixed(2)}%</span></div>
                    </div>
                )}
                <div className="p-2">
                    {connected ? (
                        <button disabled={!quote || isQuoteLoading} className="w-full py-4 rounded-xl font-semibold text-lg bg-[#c7f284] text-[#0b0b0e] hover:bg-[#a8d96f] disabled:opacity-50">{isQuoteLoading ? 'Getting Quote...' : quote ? 'Swap' : 'Enter Amount'}</button>
                    ) : (
                        <button onClick={() => setVisible(true)} className="w-full py-4 rounded-xl font-semibold text-lg bg-[#c7f284] text-[#0b0b0e] hover:bg-[#a8d96f]">Connect</button>
                    )}
                </div>
            </div>
        </div>
    );
};
