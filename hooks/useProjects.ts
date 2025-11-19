'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Project } from '@/lib/types';

export interface UseProjectsOptions {
  category?: string;
  difficulty?: string;
  search?: string;
  autoFetch?: boolean;
}

export const useProjects = (options: UseProjectsOptions = {}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.projects.getAll({
        category: options.category !== 'all' ? options.category : undefined,
        difficulty: options.difficulty !== 'all' ? options.difficulty : undefined,
        search: options.search,
      });

      if (response.success && response.data) {
        setProjects(response.data as Project[]);
      } else {
        setError(response.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.difficulty, options.search]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchProjects();
    }
  }, [fetchProjects, options.autoFetch]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
};
