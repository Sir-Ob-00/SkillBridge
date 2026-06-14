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
  plugins: ['expo-secure-store', 'expo-location'],
  extra: {
    apiBaseUrl: process.env.API_BASE_URL ?? 'https://api.skillbridge.dev',
    socketUrl: process.env.SOCKET_URL ?? 'https://api.skillbridge.dev',
  },
};

export default config;
