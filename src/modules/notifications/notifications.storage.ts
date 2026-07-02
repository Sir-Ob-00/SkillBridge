import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification } from './notifications.types';

const STORAGE_KEY = '@skillbridge/notifications';

export async function saveNotifications(notifications: AppNotification[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('[NotificationsStorage] Failed to save notifications', error);
  }
}

export async function loadNotifications(): Promise<AppNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[NotificationsStorage] Failed to load notifications', error);
    return [];
  }
}

export async function clearNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[NotificationsStorage] Failed to clear notifications', error);
  }
}
