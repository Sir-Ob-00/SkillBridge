import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
  socketUrl?: string;
};

export const CONFIG = {
  API_BASE_URL: 'https://skillbridge-backend-owjk.onrender.com/api/v1',
  SOCKET_URL: 'https://skillbridge-backend-owjk.onrender.com',
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'skillbridge.accessToken',
    REFRESH_TOKEN: 'skillbridge.refreshToken',
    USER: 'skillbridge.user',
  },
  PAGE_SIZE: 20,
};
