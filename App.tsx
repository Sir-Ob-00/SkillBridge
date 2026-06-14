import './global.css';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { bootstrapApp } from '@app/bootstrap';
import {
  AuthProvider,
  ThemeProvider,
  QueryProvider,
  SocketProvider,
} from '@app/providers';
import { RootNavigator } from '@app/navigation';

export default function App() {
  useEffect(() => {
    void bootstrapApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SocketProvider>
                <StatusBar style="dark" />
                <RootNavigator />
              </SocketProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
