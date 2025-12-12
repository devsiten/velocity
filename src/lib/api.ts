// API Client for Velocity Backend

const API_BASE = import.meta.env.VITE_API_URL || 'https://velocity-api.devsiten.workers.dev';

class ApiClient {
  private publicKey: string | null = null;

  setPublicKey(key: string | null) {
    this.publicKey = key;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.publicKey) {
      headers['X-Public-Key'] = this.publicKey;
    }
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
  }

  // ==================== TRADE API ====================

  async searchTokens(query: string) {
    return this.request<any[]>(`/api/v1/trade/tokens/search?q=${encodeURIComponent(query)}`);
  }

  async getTokenInfo(mint: string) {
    return this.request<any>(`/api/v1/trade/tokens/${mint}`);
  }

  async getPrice(mint: string) {
    return this.request<{ mint: string; price: number; timestamp: number }>(`/api/v1/trade/price/${mint}`);
  }

  async getPrices(mints: string[]) {
    return this.request<{ prices: Record<string, { price: number; change24h: number }>; timestamp: number }>('/api/v1/trade/prices', {
      method: 'POST',
      body: JSON.stringify({ mints }),
    });
  }

  async getQuote(params: { inputMint: string; outputMint: string; amount: string; slippageBps: number; userPublicKey: string }) {
    return this.request<any>('/api/v1/trade/quote', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async buildSwap(quoteResponse: any, userPublicKey: string, inputSymbol?: string, outputSymbol?: string) {
    return this.request<{ swapTransaction: string; tradeId: string }>('/api/v1/trade/swap', {
      method: 'POST',
      body: JSON.stringify({ quoteResponse, userPublicKey, inputSymbol, outputSymbol }),
    });
  }

  async confirmSwap(tradeId: string, txSignature: string) {
    return this.request<{ confirmed: boolean; pointsEarned: number }>('/api/v1/trade/confirm', {
      method: 'POST',
      body: JSON.stringify({ tradeId, txSignature }),
    });
  }

  async getTradeHistory(limit = 20, offset = 0) {
    return this.request<any[]>(`/api/v1/trade/history?limit=${limit}&offset=${offset}`);
  }

  // ==================== STRATEGY API ====================

  async getStrategies() {
    return this.request<any[]>('/api/v1/strategy');
  }

  async createStrategy(strategy: {
    type: 'limit_order' | 'stop_loss' | 'take_profit' | 'dca';
    inputMint: string;
    outputMint: string;
    inputSymbol: string;
    outputSymbol: string;
    amount: string;
    triggerPrice?: number;
    slippageBps: number;
    dcaInterval?: number;
    dcaCount?: number;
  }) {
    return this.request<any>('/api/v1/strategy', {
      method: 'POST',
      body: JSON.stringify(strategy),
    });
  }

  async getStrategy(id: string) {
    return this.request<any>(`/api/v1/strategy/${id}`);
  }

  async updateStrategyStatus(id: string, status: 'active' | 'paused') {
    return this.request<{ updated: boolean }>(`/api/v1/strategy/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteStrategy(id: string) {
    return this.request<{ deleted: boolean }>(`/api/v1/strategy/${id}`, {
      method: 'DELETE',
    });
  }

  async executeStrategy(id: string) {
    return this.request<{ swapTransaction: string }>(`/api/v1/strategy/${id}/execute`);
  }

  async confirmStrategyExecution(id: string, txSignature: string) {
    return this.request<{ executed: boolean }>(`/api/v1/strategy/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ txSignature }),
    });
  }

  // ==================== POINTS API ====================

  async getMyPoints() {
    return this.request<{
      totalPoints: number;
      tradeCount: number;
      volumeUsd: number;
      weeklyPoints: number;
      rank: number | null;
    }>('/api/v1/points/me');
  }

  async getLeaderboard(limit = 20, weekly = false) {
    return this.request<{
      leaderboard: any[];
      type: 'weekly' | 'all_time';
    }>(`/api/v1/points/leaderboard?limit=${limit}&weekly=${weekly}`);
  }

  // ==================== EXTERNAL APIs ====================

  async getTrending() {
    const res = await fetch('https://token.jup.ag/trending');
    return res.json();
  }
}

export const api = new ApiClient();
