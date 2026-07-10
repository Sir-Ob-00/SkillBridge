import React, { useEffect, useRef } from 'react';
import { Text, View, Animated } from 'react-native';
import { SafeAreaWrapper } from '@shared/layout/SafeAreaWrapper';
import { Button } from '@shared/components';
import { colors } from '@shared/ui/colors';

interface StatusScreenProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  animated?: boolean;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({
  icon,
  title,
  subtitle,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  animated = false,
}) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animated]);

  return (
    <SafeAreaWrapper>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 items-center">
          {animated ? (
            <Animated.View style={{ opacity: pulse, transform: [{ scale: pulse }] }}>
              {icon}
            </Animated.View>
          ) : (
            icon
          )}
        </View>

        <Text className="mb-2 text-center font-heading text-2xl font-bold text-gray-900">
          {title}
        </Text>

        {subtitle ? (
          <Text className="mb-4 text-center text-lg font-medium text-primary">
            {subtitle}
          </Text>
        ) : null}

        <Text className="mb-8 text-center text-base leading-6 text-gray-500">
          {message}
        </Text>

        {actionLabel && onAction ? (
          <Button label={actionLabel} onPress={onAction} fullWidth size="lg" />
        ) : null}

        {secondaryActionLabel && onSecondaryAction ? (
          <View className="mt-3">
            <Button
              label={secondaryActionLabel}
              onPress={onSecondaryAction}
              variant="outline"
              fullWidth
              size="lg"
            />
          </View>
        ) : null}
      </View>
    </SafeAreaWrapper>
  );
};
