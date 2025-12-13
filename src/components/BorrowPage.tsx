export const BorrowPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Borrow</h1>

            <div className="bg-[#131318] border border-[#25252b] rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🏦</div>
                <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
                <p className="text-[#6b7280] max-w-md mx-auto">
                    Borrow against your crypto assets with competitive rates.
                    This feature is under development.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <div className="bg-[#1b1b1f] rounded-xl p-4 text-center">
                        <div className="text-sm text-[#6b7280]">Expected APR</div>
                        <div className="text-xl font-bold text-[#00d4aa]">~5-8%</div>
                    </div>
                    <div className="bg-[#1b1b1f] rounded-xl p-4 text-center">
                        <div className="text-sm text-[#6b7280]">Collateral Types</div>
                        <div className="text-xl font-bold text-white">SOL, mSOL</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
