import './global.css';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { bootstrapApp } from '@app/bootstrap';
import {
  AuthProvider,
  ThemeProvider,
  QueryProvider,
  SocketProvider,
} from '@app/providers';
import { RootNavigator } from '@app/navigation';
import { FeedbackModal } from '@shared/components';
import { useFeedbackStore } from '@store/feedback.store';

function FeedbackOverlay() {
  const { visible, type, title, message, onDismiss, hide } = useFeedbackStore();

  return (
    <FeedbackModal
      visible={visible}
      type={type}
      title={title}
      message={message}
      onDismiss={() => {
        hide();
        onDismiss?.();
      }}
    />
  );
}

export default function App() {
  useEffect(() => {
    void bootstrapApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryProvider>
            <SocketProvider>
              <NavigationContainer>
                <AuthProvider>
                  <RootNavigator />
                </AuthProvider>
                <StatusBar style="dark" />
              </NavigationContainer>
              <FeedbackOverlay />
            </SocketProvider>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
