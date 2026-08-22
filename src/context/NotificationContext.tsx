import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../types';
import { getUserNotifications, markNotificationAsRead } from '../services/storageService';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'ai';
  title: string;
  message: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'ai') => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshNotifications = useCallback(() => {
    if (currentUser) {
      const items = getUserNotifications(currentUser.uid);
      setNotifications(items);
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 5000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const showToast = useCallback(
    (title: string, message: string, type: 'success' | 'error' | 'info' | 'ai' = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        showToast,
        removeToast,
        markAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
