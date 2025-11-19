'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { LeaderboardEntry } from '@/lib/types';

export const useLeaderboard = (period: 'all' | 'weekly' | 'monthly' = 'all') => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.leaderboard.get(period);

      if (response.success && response.data) {
        setLeaderboard(response.data as LeaderboardEntry[]);
      } else {
        setError(response.error || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    isLoading,
    error,
    refetch: fetchLeaderboard,
  };
};
