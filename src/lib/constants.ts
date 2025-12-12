export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export const SOL_TOKEN = {
  address: SOL_MINT,
  symbol: 'SOL',
  name: 'Solana',
  decimals: 9,
  logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
};

export const USDC_TOKEN = {
  address: USDC_MINT,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
};

export const PRESET_AMOUNTS = [
  { label: '0.1', value: '100000000', sol: 0.1 },
  { label: '0.5', value: '500000000', sol: 0.5 },
  { label: '1', value: '1000000000', sol: 1 },
  { label: '5', value: '5000000000', sol: 5 },
];

export const SLIPPAGE_PRESETS = [
  { label: '0.5%', value: 50 },
  { label: '1%', value: 100 },
  { label: '2%', value: 200 },
  { label: '5%', value: 500 },
];

export const EXPLORER_URL = 'https://solscan.io';

export const formatAmount = (amount: string, decimals: number): string => {
  const num = Number(amount) / Math.pow(10, decimals);
  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';
  if (num < 1) return num.toFixed(6);
  if (num < 1000) return num.toFixed(4);
  if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
  return `${(num / 1000000).toFixed(2)}M`;
};

export const formatUsd = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(2);
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const getExplorerUrl = (signature: string): string => {
  return `${EXPLORER_URL}/tx/${signature}`;
};
