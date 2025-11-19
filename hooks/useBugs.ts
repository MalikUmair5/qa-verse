'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { BugReport } from '@/lib/types';

export interface UseBugsOptions {
  projectId?: string;
  testerId?: string;
  status?: string;
  severity?: string;
  autoFetch?: boolean;
}

export const useBugs = (options: UseBugsOptions = {}) => {
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBugs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.bugs.getAll({
        projectId: options.projectId,
        testerId: options.testerId,
        status: options.status !== 'all' ? options.status : undefined,
        severity: options.severity !== 'all' ? options.severity : undefined,
      });

      if (response.success && response.data) {
        setBugs(response.data as BugReport[]);
      } else {
        setError(response.error || 'Failed to fetch bugs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.projectId, options.testerId, options.status, options.severity]);

  const createBug = useCallback(async (bugData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.bugs.create(bugData);
      
      if (response.success) {
        await fetchBugs(); // Refresh list
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to create bug report');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchBugs]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchBugs();
    }
  }, [fetchBugs, options.autoFetch]);

  return {
    bugs,
    isLoading,
    error,
    refetch: fetchBugs,
    createBug,
  };
};
