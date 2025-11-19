'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { User } from '@/lib/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.auth.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data as User);
      } else {
        setError(response.error || 'Failed to fetch user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.auth.login(email, password);

      if (response.success && response.data) {
        const userData = (response.data as any).user;
        setUser(userData);
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', (response.data as any).token);
        }
        return { success: true, data: userData };
      } else {
        setError(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    refetch: fetchCurrentUser,
  };
};
