import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { colors } from '@shared/ui/colors';

interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ label, fullScreen = false }) => {
  return (
    <View
      className={[
        'items-center justify-center',
        fullScreen ? 'flex-1 bg-background' : 'py-8',
      ].join(' ')}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text className="mt-3 text-sm text-gray-500">{label}</Text> : null}
    </View>
  );
};

interface SkeletonProps {
  width?: number | string;
  height?: number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedMap: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  rounded = 'md',
  className,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ width: width as number | `${number}%`, height, opacity }}
      className={['bg-gray-200', roundedMap[rounded], className ?? ''].join(' ')}
    />
  );
};

/** Skeleton placeholder for an ArtisanCard-style list item */
export const ArtisanCardSkeleton: React.FC = () => {
  return (
    <View className="mb-4 rounded-2xl bg-white p-3 shadow-sm">
      <Skeleton height={140} rounded="lg" className="mb-3" />
      <Skeleton width="70%" height={16} className="mb-2" />
      <Skeleton width="40%" height={14} />
    </View>
  );
};
