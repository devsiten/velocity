// src/components/RightSidebar.tsx
import { usePriceStore } from '../lib/store';
import { useLivePrices } from '../hooks/useLiveData';

export const RightSidebar = () => {
    useLivePrices(15000);

    const { prices } = usePriceStore();

    return (
        <div className="space-y-4">
            {/* SOL Price Card */}
            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-4">
                <div className="flex items-center gap-3">
                    <img
                        src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                        className="w-10 h-10 rounded-full"
                        alt="SOL"
                    />
                    <div>
                        <div className="text-sm font-medium text-white">Solana</div>
                        <div className="text-xs text-[#6b7280]">SOL</div>
                    </div>
                    <div className="ml-auto text-right">
                        {prices['So11111111111111111111111111111111111111112'] ? (
                            <div className="text-lg font-semibold text-white">
                                ${prices['So11111111111111111111111111111111111111112'].price.toFixed(2)}
                            </div>
                        ) : (
                            <span className="text-[#6b7280] animate-pulse">Loading...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
