export const BorrowPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-[#9945FF] mb-6">Borrow</h1>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
                <div className="text-6xl mb-4">🏦</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Borrow against your crypto assets with competitive rates.
                    This feature is under development.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 rounded-xl p-4 text-center border border-gray-100">
                        <div className="text-sm text-gray-500">Expected APR</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">~5-8%</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 rounded-xl p-4 text-center border border-gray-100">
                        <div className="text-sm text-gray-500">Collateral Types</div>
                        <div className="text-xl font-bold text-gray-800">SOL, mSOL</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
