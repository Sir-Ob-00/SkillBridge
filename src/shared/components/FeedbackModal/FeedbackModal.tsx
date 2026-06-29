import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal as RNModal,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react-native';
import { colors } from '@shared/ui/colors';
import { Button } from '@shared/components/Button';
import type { FeedbackType } from '@store/feedback.store';

interface FeedbackModalProps {
  visible: boolean;
  type: FeedbackType;
  title: string;
  message: string;
  onDismiss?: () => void;
  /** Auto-dismiss duration in ms (only for success). Default: 1500 */
  autoDismissMs?: number;
}

const ICON_MAP: Record<FeedbackType, { icon: React.ReactNode; color: string; bg: string }> = {
  success: {
    icon: <CheckCircle size={48} color={colors.success} />,
    color: colors.success,
    bg: '#08540a10',
  },
  error: {
    icon: <XCircle size={48} color={colors.danger} />,
    color: colors.danger,
    bg: '#dc262610',
  },
  warning: {
    icon: <AlertTriangle size={48} color={colors.warning} />,
    color: colors.warning,
    bg: '#d9770610',
  },
  info: {
    icon: <Info size={48} color={colors.primary} />,
    color: colors.primary,
    bg: '#8b003b10',
  },
};

const BUTTON_LABEL: Record<FeedbackType, string> = {
  success: 'Continue',
  error: 'Try Again',
  warning: 'OK',
  info: 'OK',
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  type,
  title,
  message,
  onDismiss,
  autoDismissMs = 1500,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { icon, bg } = ICON_MAP[type];
  const label = BUTTON_LABEL[type];
  const isSuccess = type === 'success';

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 80,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (isSuccess) {
        const timer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDismiss?.();
          });
        }, autoDismissMs);
        return () => clearTimeout(timer);
      }
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible, isSuccess, autoDismissMs, scaleAnim, opacityAnim, onDismiss]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={!isSuccess ? handleDismiss : undefined}
    >
      <View
        className="flex-1 items-center justify-center bg-black/40"
        accessibilityViewIsModal
      >
        <Pressable
          className="absolute inset-0"
          onPress={!isSuccess ? handleDismiss : undefined}
          accessibilityLabel="Close modal"
          accessibilityRole="button"
        />
        <Animated.View
          className="mx-8 w-10/12 max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          style={{
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <View className="mb-4 items-center">
            <View
              className="mb-3 h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: bg }}
            >
              {icon}
            </View>
            <Text className="mb-1 text-center font-heading text-xl font-bold text-gray-900">
              {title}
            </Text>
            <Text className="text-center text-base leading-6 text-gray-600">
              {message}
            </Text>
          </View>

          <Button
            label={label}
            onPress={handleDismiss}
            fullWidth
            size="md"
            variant={isSuccess ? 'primary' : type === 'error' ? 'danger' : 'primary'}
            accessibilityHint={
              isSuccess ? 'Continues to your dashboard' : 'Dismisses this message'
            }
          />
        </Animated.View>
      </View>
    </RNModal>
  );
};
