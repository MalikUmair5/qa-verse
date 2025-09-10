'use client'
import { useState, useCallback } from 'react';

// Types for project data
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
  bugs: number;
  image?: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
}

// Custom hook for project operations
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching projects from API
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock project data
      const mockProjects: Project[] = [
        {
          id: '1',
          title: "QuantumLeap CRM",
          description: "A next-generation CRM for optimizing sales pipelines and customer relationships with advanced analytics.",
          category: "Functionality",
          difficulty: "Medium",
          participants: 12,
          bugs: 8,
          image: "/window.svg",
          status: "active",
          createdAt: "2025-09-01"
        },
        {
          id: '2',
          title: "Smart E-commerce Platform",
          description: "Modern e-commerce solution with AI-powered recommendations and seamless checkout experience.",
          category: "User Experience",
          difficulty: "Hard",
          participants: 25,
          bugs: 15,
          image: "/globe.svg",
          status: "active",
          createdAt: "2025-09-05"
        },
        {
          id: '3',
          title: "Mobile Banking App",
          description: "Secure and user-friendly mobile banking application with advanced security features.",
          category: "Security",
          difficulty: "Hard",
          participants: 18,
          bugs: 22,
          image: "/file.svg",
          status: "pending",
          createdAt: "2025-09-08"
        },
        {
          id: '4',
          title: "Task Management Tool",
          description: "Simple and effective task management tool for small teams and individual productivity.",
          category: "Productivity",
          difficulty: "Easy",
          participants: 8,
          bugs: 3,
          image: "/next.svg",
          status: "completed",
          createdAt: "2025-08-25"
        }
      ];
      
      setProjects(mockProjects);
    } catch (err) {
      setError('Failed to fetch projects. Please try again.');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter projects by status
  const getProjectsByStatus = useCallback((status: Project['status']) => {
    return projects.filter(project => project.status === status);
  }, [projects]);

  // Get project by ID
  const getProjectById = useCallback((id: string) => {
    return projects.find(project => project.id === id);
  }, [projects]);

  // Simulate joining a project
  const joinProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, participants: project.participants + 1 }
          : project
      ));
      
      return { success: true, message: 'Successfully joined project!' };
    } catch (err) {
      return { success: false, message: 'Failed to join project. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate reporting a bug
  const reportBug = useCallback(async (projectId: string, bugData: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, bugs: project.bugs + 1 }
          : project
      ));
      
      return { success: true, message: 'Bug reported successfully!' };
    } catch (err) {
      return { success: false, message: 'Failed to report bug. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    getProjectsByStatus,
    getProjectById,
    joinProject,
    reportBug
  };
};
