// API utility functions for QAVerse
import type { User, Project, BugReport, Notification, ChatMessage, Achievement } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ==================== AUTH APIs ====================

export const authAPI = {
  login: async (email: string, password: string) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string, role: 'tester' | 'maintainer') => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  getCurrentUser: async () => {
    return apiFetch('/auth/user');
  },
};

// ==================== PROJECTS APIs ====================

export const projectsAPI = {
  getAll: async (filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    return apiFetch(`/projects${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiFetch(`/projects/${id}`);
  },

  create: async (projectData: Partial<Project>) => {
    return apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  update: async (id: string, projectData: Partial<Project>) => {
    return apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== BUGS APIs ====================

export const bugsAPI = {
  getAll: async (filters?: {
    projectId?: string;
    testerId?: string;
    status?: string;
    severity?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.testerId) params.append('testerId', filters.testerId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.severity) params.append('severity', filters.severity);

    const queryString = params.toString();
    return apiFetch(`/bugs${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiFetch(`/bugs/${id}`);
  },

  create: async (bugData: Partial<BugReport>) => {
    return apiFetch('/bugs', {
      method: 'POST',
      body: JSON.stringify(bugData),
    });
  },

  update: async (id: string, bugData: Partial<BugReport>) => {
    return apiFetch(`/bugs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bugData),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/bugs/${id}`, {
      method: 'DELETE',
    });
  },

  approve: async (id: string) => {
    return apiFetch(`/bugs/${id}/approve`, {
      method: 'POST',
    });
  },

  reject: async (id: string, reason: string) => {
    return apiFetch(`/bugs/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  resolve: async (id: string) => {
    return apiFetch(`/bugs/${id}/resolve`, {
      method: 'POST',
    });
  },

  // Comments
  getComments: async (bugId: string) => {
    return apiFetch(`/bugs/${bugId}/comments`);
  },

  addComment: async (bugId: string, commentData: {
    userId: string;
    userName: string;
    userRole: string;
    comment: string;
  }) => {
    return apiFetch(`/bugs/${bugId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
};

// ==================== LEADERBOARD APIs ====================

export const leaderboardAPI = {
  get: async (period?: 'all' | 'weekly' | 'monthly') => {
    const params = period ? `?period=${period}` : '';
    return apiFetch(`/leaderboard${params}`);
  },
};

// ==================== NOTIFICATIONS APIs ====================

export const notificationsAPI = {
  getAll: async (userId: string, unreadOnly = false) => {
    const params = new URLSearchParams({ userId });
    if (unreadOnly) params.append('unreadOnly', 'true');
    return apiFetch(`/notifications?${params.toString()}`);
  },

  markAsRead: async (notificationId: string) => {
    return apiFetch('/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify({ notificationId }),
    });
  },
};

// ==================== ACHIEVEMENTS APIs ====================

export const achievementsAPI = {
  getAll: async (userId?: string) => {
    const params = userId ? `?userId=${userId}` : '';
    return apiFetch(`/achievements${params}`);
  },
};

// ==================== CHAT APIs ====================

export const chatAPI = {
  getMessages: async (filters: {
    userId?: string;
    conversationId?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.conversationId) params.append('conversationId', filters.conversationId);

    const queryString = params.toString();
    return apiFetch(`/chat${queryString ? `?${queryString}` : ''}`);
  },

  sendMessage: async (messageData: {
    senderId: string;
    senderName: string;
    senderRole: string;
    receiverId: string;
    message: string;
    conversationId?: string;
  }) => {
    return apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getConversations: async (userId: string) => {
    return apiFetch(`/chat/conversations?userId=${userId}`);
  },
};

// ==================== ANALYTICS APIs ====================

export const analyticsAPI = {
  getUserAnalytics: async (userId: string) => {
    return apiFetch(`/analytics/user/${userId}`);
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  projects: projectsAPI,
  bugs: bugsAPI,
  leaderboard: leaderboardAPI,
  notifications: notificationsAPI,
  achievements: achievementsAPI,
  chat: chatAPI,
  analytics: analyticsAPI,
};

export default api;
