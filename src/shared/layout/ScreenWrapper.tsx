import React from 'react';
import {
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { colors } from '@shared/ui/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: readonly Edge[];
  className?: string;
  contentClassName?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  keyboardAvoiding?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  edges,
  className,
  contentClassName,
  onRefresh,
  refreshing = false,
  keyboardAvoiding = false,
}) => {
  const content = scrollable ? (
    <ScrollView
      className={['flex-1', className ?? ''].join(' ')}
      contentContainerClassName={['px-4 pb-8', contentClassName ?? ''].join(' ')}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View className={['flex-1 px-4', className ?? '', contentClassName ?? ''].join(' ')}>
      {children}
    </View>
  );

  return (
    <SafeAreaWrapper edges={edges}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          className="flex-1"
          behavior="padding"
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaWrapper>
  );
};
