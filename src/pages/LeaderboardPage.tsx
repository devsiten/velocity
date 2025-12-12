import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LeaderboardEntry, UserPoints } from '../types/shared';
import { api } from '../lib/api';
import { shortenAddress, formatNumber, formatUsd } from '../lib/constants';

export const LeaderboardPage: FC = () => {
  const { publicKey } = useWallet();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [isWeekly, setIsWeekly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [isWeekly]);

  useEffect(() => {
    if (publicKey) {
      api.setPublicKey(publicKey.toBase58());
      loadUserPoints();
    }
  }, [publicKey]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLeaderboard(isWeekly, 50);
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPoints = async () => {
    try {
      const points = await api.getPoints();
      setUserPoints(points);
    } catch (error) {
      console.error('Failed to load user points:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Leaderboard</h2>
          <p className="text-text-muted text-sm mt-1">
            Earn points by trading. Top traders get rewards.
          </p>
        </div>

        <div className="flex rounded-lg bg-bg-secondary border border-border-primary p-1">
          <button
            onClick={() => setIsWeekly(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${!isWeekly ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
          >
            All Time
          </button>
          <button
            onClick={() => setIsWeekly(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${isWeekly ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
          >
            This Week
          </button>
        </div>
      </div>

      {userPoints && (
        <div className="card p-4 mb-6 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border-accent-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Your Stats</p>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-2xl font-bold text-accent-primary mono">
                    {formatNumber(isWeekly ? userPoints.weeklyPoints : userPoints.totalPoints)}
                  </span>
                  <span className="text-text-muted ml-1">pts</span>
                </div>
                {userPoints.rank && (
                  <div className="text-text-secondary">
                    Rank <span className="font-semibold text-text-primary">#{userPoints.rank}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">{userPoints.tradeCount} trades</p>
              <p className="text-sm text-text-muted">{formatUsd(userPoints.volumeUsd)} volume</p>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-bg-tertiary border-b border-border-primary text-sm font-medium text-text-muted">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Trader</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-2 text-right">Trades</div>
          <div className="col-span-2 text-right">Volume</div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border-primary">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 shimmer" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-text-muted">No trades yet this period</p>
          </div>
        ) : (
          <div className="divide-y divide-border-primary">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = publicKey?.toBase58() === entry.publicKey;
              
              return (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-12 gap-4 px-4 py-4 items-center transition-colors
                    ${isCurrentUser ? 'bg-accent-primary/5' : 'hover:bg-bg-elevated'}`}
                >
                  <div className="col-span-1">
                    {index < 3 ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                          index === 1 ? 'bg-gray-400/20 text-gray-400' : 
                          'bg-orange-500/20 text-orange-500'}`}>
                        {index + 1}
                      </span>
                    ) : (
                      <span className="text-text-muted mono">{entry.rank}</span>
                    )}
                  </div>
                  
                  <div className="col-span-5">
                    <span className={`mono ${isCurrentUser ? 'text-accent-primary font-semibold' : 'text-text-primary'}`}>
                      {shortenAddress(entry.publicKey, 6)}
                    </span>
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-accent-primary">(you)</span>
                    )}
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <span className="mono font-semibold text-text-primary">
                      {formatNumber(entry.points)}
                    </span>
                  </div>
                  
                  <div className="col-span-2 text-right text-text-secondary mono">
                    {entry.tradeCount}
                  </div>
                  
                  <div className="col-span-2 text-right text-text-secondary mono">
                    {formatUsd(entry.volumeUsd)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 card p-4 bg-bg-tertiary/50">
        <h3 className="font-semibold text-text-primary mb-2">How Points Work</h3>
        <ul className="text-sm text-text-muted space-y-1">
          <li>• Earn 10 base points per trade</li>
          <li>• Earn 1 point per $1 trading volume</li>
          <li>• 1.5x multiplier after 10+ trades</li>
          <li>• Weekly leaderboard resets every Monday</li>
        </ul>
      </div>
    </div>
  );
};
