import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
  socketUrl?: string;
};

export const CONFIG = {
  API_BASE_URL: extra.apiBaseUrl ?? 'https://api.skillbridge.dev',
  SOCKET_URL: extra.socketUrl ?? 'https://api.skillbridge.dev',
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'skillbridge.accessToken',
    REFRESH_TOKEN: 'skillbridge.refreshToken',
    USER: 'skillbridge.user',
  },
  PAGE_SIZE: 20,
};
