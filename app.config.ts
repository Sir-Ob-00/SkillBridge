import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'SkillBridge',
  slug: 'skillbridge-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/skillbridge-splash.png',
    resizeMode: 'contain',
    backgroundColor: '#f9feff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.skillbridge.mobile',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/skillbridge-adaptive.png',
      backgroundColor: '#f9feff',
    },
    package: 'com.skillbridge.mobile',
  },
  plugins: ['expo-secure-store', 'expo-location', 'expo-system-ui'],
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    socketUrl: process.env.SOCKET_URL,

    eas: {
      projectId: 'd070deda-b1e0-4935-8dfb-d01ddc84a317',
    },
  },
};

export default config;