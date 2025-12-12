const API_BASE = import.meta.env.VITE_API_URL || '';

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

  async getPrices(mints: string[]) {
    return this.request<{ prices: Record<string, { price: number; change24h: number }> }>('/api/v1/trade/prices', {
      method: 'POST',
      body: JSON.stringify({ mints }),
    });
  }

  async getQuote(params: { inputMint: string; outputMint: string; amount: string; slippageBps: number; userPublicKey: string }) {
    return this.request('/api/v1/trade/quote', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getTrending() {
    const res = await fetch('https://token.jup.ag/trending');
    return res.json();
  }
}

export const api = new ApiClient();
