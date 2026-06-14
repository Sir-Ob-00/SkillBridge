import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@utils/logger';

/**
 * Sensitive values (tokens) go to SecureStore.
 * Larger/non-sensitive values (cached user object) go to AsyncStorage.
 */
export const secureStorage = {
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error('secureStorage.setSecureItem failed', error);
    }
  },

  async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      logger.error('secureStorage.getSecureItem failed', error);
      return null;
    }
  },

  async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error('secureStorage.removeSecureItem failed', error);
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.error('secureStorage.setItem failed', error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      logger.error('secureStorage.getItem failed', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      logger.error('secureStorage.removeItem failed', error);
    }
  },
};
