import { create } from 'zustand';
import { AppNotification } from './notifications.types';
import { saveNotifications } from './notifications.storage';

interface NotificationsState {
  notifications: AppNotification[];
  hydrated: boolean;

  hydrate: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  hydrated: false,

  hydrate: (notifications) => {
    set({ notifications, hydrated: true });
  },

  addNotification: (notification) => {
    const exists = get().notifications.some((n) => n.id === notification.id);
    if (exists) return;

    const updated = [notification, ...get().notifications];
    set({ notifications: updated });
    void saveNotifications(updated);
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications: updated });
    void saveNotifications(updated);
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated });
    void saveNotifications(updated);
  },

  clearNotifications: () => {
    set({ notifications: [] });
    void saveNotifications([]);
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
