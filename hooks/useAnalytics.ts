'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { UserAnalytics } from '@/lib/types';

export const useAnalytics = (userId: string) => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.analytics.getUserAnalytics(userId);

      if (response.success && response.data) {
        setAnalytics(response.data as UserAnalytics);
      } else {
        setError(response.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
};
