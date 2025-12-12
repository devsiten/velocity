import { FC, useState } from 'react';

export const PromoBanner: FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-[#1a2332] to-[#0d1117] rounded-xl p-4 mb-4 border border-[#1e2530] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffa3]/5 rounded-full blur-3xl" />

            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-[#8b949e] hover:text-white transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00ffa3] to-[#00d4aa] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm">VELOCITY LAUNCH SPECIAL</h3>
                    <p className="text-xs text-[#8b949e] mt-0.5 line-clamp-2">
                        The Next Chapter of On-Chain Finance Starts Here
                    </p>
                    <button className="mt-2 flex items-center gap-1 text-xs font-medium text-[#00ffa3] hover:text-[#00d4aa] transition-colors">
                        See More
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
