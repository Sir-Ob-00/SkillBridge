import React from 'react';
import { StatusBar, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: readonly Edge[];
  className?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  backgroundColor?: string;
}

/**
 * Wraps a screen with safe-area insets + status bar config.
 * Assumes a SafeAreaProvider is mounted once at the app root (see bootstrap.ts / App.tsx).
 */
export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  className,
  statusBarStyle = 'dark-content',
  backgroundColor = '#f9feff',
}) => {
  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <SafeAreaView edges={edges} className={['flex-1', className ?? ''].join(' ')}>
        {children}
      </SafeAreaView>
    </View>
  );
};
