import { create } from 'zustand';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
}

interface PriceStore {
  prices: Record<string, { price: number; change24h: number }>;
  isLoading: boolean;
  setPrices: (p: Record<string, { price: number; change24h: number }>) => void;
  setLoading: (l: boolean) => void;
}

export const usePriceStore = create<PriceStore>((set) => ({
  prices: {},
  isLoading: true,
  setPrices: (prices) => set((s) => ({ prices: { ...s.prices, ...prices }, isLoading: false })),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface TrendingStore {
  tokens: any[];
  isLoading: boolean;
  setTokens: (t: any[]) => void;
  setLoading: (l: boolean) => void;
}

export const useTrendingStore = create<TrendingStore>((set) => ({
  tokens: [],
  isLoading: true,
  setTokens: (tokens) => set({ tokens, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface TradeStore {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  quote: any;
  isQuoteLoading: boolean;
  setInputToken: (t: Token) => void;
  setOutputToken: (t: Token) => void;
  setInputAmount: (a: string) => void;
  setOutputAmount: (a: string) => void;
  setQuote: (q: any) => void;
  setQuoteLoading: (l: boolean) => void;
  swapTokens: () => void;
}

export const useTradeStore = create<TradeStore>((set, get) => ({
  inputToken: {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  outputToken: {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  inputAmount: '',
  outputAmount: '',
  quote: null,
  isQuoteLoading: false,
  setInputToken: (inputToken) => set({ inputToken, quote: null }),
  setOutputToken: (outputToken) => set({ outputToken, quote: null }),
  setInputAmount: (inputAmount) => set({ inputAmount }),
  setOutputAmount: (outputAmount) => set({ outputAmount }),
  setQuote: (quote) => set({ quote }),
  setQuoteLoading: (isQuoteLoading) => set({ isQuoteLoading }),
  swapTokens: () => {
    const { inputToken, outputToken } = get();
    set({ inputToken: outputToken, outputToken: inputToken, inputAmount: '', outputAmount: '', quote: null });
  },
}));

interface UIStore {
  activeTab: string;
  tokenSearchOpen: boolean;
  tokenSearchType: 'input' | 'output';
  setActiveTab: (t: string) => void;
  openTokenSearch: (type: 'input' | 'output') => void;
  closeTokenSearch: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'swap',
  tokenSearchOpen: false,
  tokenSearchType: 'input',
  setActiveTab: (activeTab) => set({ activeTab }),
  openTokenSearch: (tokenSearchType) => set({ tokenSearchOpen: true, tokenSearchType }),
  closeTokenSearch: () => set({ tokenSearchOpen: false }),
}));
