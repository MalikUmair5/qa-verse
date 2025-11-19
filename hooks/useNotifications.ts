'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Notification } from '@/lib/types';

export const useNotifications = (userId: string, unreadOnly = false) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.notifications.getAll(userId, unreadOnly);

      if (response.success && response.data) {
        const notifs = response.data as Notification[];
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      } else {
        setError(response.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId, unreadOnly]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await api.notifications.markAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
  };
};
