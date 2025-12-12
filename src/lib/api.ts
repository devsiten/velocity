import { 
  APIResponse, 
  QuoteRequest, 
  QuoteResponse, 
  SwapResponse, 
  Token, 
  Strategy, 
  StrategyCreateRequest,
  UserPoints,
  LeaderboardEntry,
  TradeHistory,
} from '../types/shared';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
  private publicKey: string | null = null;

  setPublicKey(key: string | null) {
    this.publicKey = key;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.publicKey) {
      headers['X-Public-Key'] = this.publicKey;
      headers['X-Timestamp'] = Date.now().toString();
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json() as APIResponse<T>;

    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data as T;
  }

  async searchTokens(query: string): Promise<Token[]> {
    return this.request<Token[]>(`/trade/tokens/search?q=${encodeURIComponent(query)}`);
  }

  async getToken(mint: string): Promise<Token> {
    return this.request<Token>(`/trade/tokens/${mint}`);
  }

  async getPrice(mint: string): Promise<{ mint: string; price: number; timestamp: number }> {
    return this.request(`/trade/price/${mint}`);
  }

  async getPrices(mints: string[]): Promise<{ prices: Record<string, number>; timestamp: number }> {
    return this.request('/trade/prices', {
      method: 'POST',
      body: JSON.stringify({ mints }),
    });
  }

  async getQuote(request: QuoteRequest): Promise<QuoteResponse> {
    return this.request<QuoteResponse>('/trade/quote', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async buildSwap(
    quoteResponse: QuoteResponse,
    userPublicKey: string,
    inputSymbol: string,
    outputSymbol: string
  ): Promise<SwapResponse & { tradeId: string }> {
    return this.request('/trade/swap', {
      method: 'POST',
      body: JSON.stringify({ 
        quoteResponse, 
        userPublicKey,
        inputSymbol,
        outputSymbol,
      }),
    });
  }

  async confirmTrade(tradeId: string, txSignature: string): Promise<{ confirmed: boolean; pointsEarned: number }> {
    return this.request('/trade/confirm', {
      method: 'POST',
      body: JSON.stringify({ tradeId, txSignature }),
    });
  }

  async getTradeHistory(limit = 20, offset = 0): Promise<TradeHistory[]> {
    return this.request<TradeHistory[]>(`/trade/history?limit=${limit}&offset=${offset}`);
  }

  async getStrategies(): Promise<Strategy[]> {
    return this.request<Strategy[]>('/strategy');
  }

  async createStrategy(request: StrategyCreateRequest): Promise<Strategy> {
    return this.request<Strategy>('/strategy', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateStrategyStatus(id: string, status: 'active' | 'paused'): Promise<{ updated: boolean }> {
    return this.request(`/strategy/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteStrategy(id: string): Promise<{ deleted: boolean }> {
    return this.request(`/strategy/${id}`, {
      method: 'DELETE',
    });
  }

  async getStrategyExecution(id: string): Promise<{ strategy: Strategy; quote: QuoteResponse; swap: SwapResponse }> {
    return this.request(`/strategy/${id}/execute`);
  }

  async confirmStrategyExecution(id: string, txSignature: string): Promise<{ executed: boolean }> {
    return this.request(`/strategy/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ txSignature }),
    });
  }

  async getPoints(): Promise<UserPoints> {
    return this.request<UserPoints>('/points/me');
  }

  async getLeaderboard(weekly = false, limit = 20): Promise<{ leaderboard: LeaderboardEntry[]; type: string }> {
    return this.request(`/points/leaderboard?weekly=${weekly}&limit=${limit}`);
  }
}

export const api = new ApiClient();
