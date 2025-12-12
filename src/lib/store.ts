import { create } from 'zustand';
import { Token, QuoteResponse, Strategy, UserPoints } from '../types/shared';
import { SOL_TOKEN } from './constants';

interface TradeState {
  inputToken: Token | null;
  outputToken: Token | null;
  inputAmount: string;
  slippageBps: number;
  quote: QuoteResponse | null;
  isQuoteLoading: boolean;
  isSwapping: boolean;

  setInputToken: (token: Token | null) => void;
  setOutputToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
  setSlippageBps: (bps: number) => void;
  setQuote: (quote: QuoteResponse | null) => void;
  setIsQuoteLoading: (loading: boolean) => void;
  setIsSwapping: (swapping: boolean) => void;
  swapTokens: () => void;
  reset: () => void;
}

export const useTradeStore = create<TradeState>((set, get) => ({
  inputToken: SOL_TOKEN,
  outputToken: null,
  inputAmount: '',
  slippageBps: 100,
  quote: null,
  isQuoteLoading: false,
  isSwapping: false,

  setInputToken: (token) => set({ inputToken: token, quote: null }),
  setOutputToken: (token) => set({ outputToken: token, quote: null }),
  setInputAmount: (amount) => set({ inputAmount: amount, quote: null }),
  setSlippageBps: (bps) => set({ slippageBps: bps }),
  setQuote: (quote) => set({ quote }),
  setIsQuoteLoading: (loading) => set({ isQuoteLoading: loading }),
  setIsSwapping: (swapping) => set({ isSwapping: swapping }),

  swapTokens: () => {
    const { inputToken, outputToken } = get();
    set({
      inputToken: outputToken,
      outputToken: inputToken,
      inputAmount: '',
      quote: null,
    });
  },

  reset: () => set({
    inputToken: SOL_TOKEN,
    outputToken: null,
    inputAmount: '',
    quote: null,
    isQuoteLoading: false,
    isSwapping: false,
  }),
}));

interface PriceState {
  prices: Record<string, number>;
  lastUpdate: number;
  setPrices: (prices: Record<string, number>) => void;
  getPrice: (mint: string) => number | null;
}

export const usePriceStore = create<PriceState>((set, get) => ({
  prices: {},
  lastUpdate: 0,

  setPrices: (prices) => set({
    prices: { ...get().prices, ...prices },
    lastUpdate: Date.now()
  }),

  getPrice: (mint) => get().prices[mint] ?? null,
}));

interface UserState {
  points: UserPoints | null;
  strategies: Strategy[];
  isLoading: boolean;

  setPoints: (points: UserPoints | null) => void;
  setStrategies: (strategies: Strategy[]) => void;
  addStrategy: (strategy: Strategy) => void;
  updateStrategy: (id: string, updates: Partial<Strategy>) => void;
  removeStrategy: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  points: null,
  strategies: [],
  isLoading: false,

  setPoints: (points) => set({ points }),
  setStrategies: (strategies) => set({ strategies }),

  addStrategy: (strategy) => set({
    strategies: [strategy, ...get().strategies]
  }),

  updateStrategy: (id, updates) => set({
    strategies: get().strategies.map(s =>
      s.id === id ? { ...s, ...updates } : s
    ),
  }),

  removeStrategy: (id) => set({
    strategies: get().strategies.filter(s => s.id !== id),
  }),

  setIsLoading: (loading) => set({ isLoading: loading }),
}));

interface UIState {
  activeTab: 'swap' | 'stake' | 'lend' | 'borrow';
  isTokenSearchOpen: boolean;
  tokenSearchMode: 'input' | 'output';
  isSettingsOpen: boolean;
  isSidebarOpen: boolean;

  setActiveTab: (tab: 'swap' | 'stake' | 'lend' | 'borrow') => void;
  openTokenSearch: (mode: 'input' | 'output') => void;
  closeTokenSearch: () => void;
  setIsSettingsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeTab: 'swap',
  isTokenSearchOpen: false,
  tokenSearchMode: 'input',
  isSettingsOpen: false,
  isSidebarOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  openTokenSearch: (mode) => set({ isTokenSearchOpen: true, tokenSearchMode: mode }),
  closeTokenSearch: () => set({ isTokenSearchOpen: false }),
  setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
}));
