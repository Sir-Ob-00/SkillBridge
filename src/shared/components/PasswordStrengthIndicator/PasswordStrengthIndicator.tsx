import React from 'react';
import { Text, View } from 'react-native';

interface PasswordStrengthIndicatorProps {
  strength: 'weak' | 'medium' | 'strong' | null;
}

const STRENGTH_CONFIG = {
  weak: {
    label: 'Weak',
    color: '#dc2626',
    width: '33%',
  },
  medium: {
    label: 'Medium',
    color: '#d97706',
    width: '66%',
  },
  strong: {
    label: 'Strong',
    color: '#08540a',
    width: '100%',
  },
} as const;

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strength }) => {
  if (!strength) return null;

  const config = STRENGTH_CONFIG[strength];

  return (
    <View className="mt-1">
      <View className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <View
          className="h-full rounded-full"
          style={{ width: config.width, backgroundColor: config.color }}
        />
      </View>
      <Text className="mt-0.5 text-xs" style={{ color: config.color }}>
        {config.label}
      </Text>
    </View>
  );
};
