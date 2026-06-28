import React from 'react';
import { Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showValue?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 0,
  reviewCount,
  size = 14,
  showValue = true,
}) => {
  const rounded = Math.round(rating);

  return (
    <View className="flex-row items-center">
      <View className="flex-row items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            color={colors.secondary}
            fill={index < rounded ? colors.secondary : 'transparent'}
          />
        ))}
      </View>

      {showValue ? (
        <Text className="ml-1.5 text-xs font-medium text-gray-600">
          {typeof rating === 'number' ? rating.toFixed(1) : '0.0'}
          {typeof reviewCount === 'number' ? ` (${reviewCount})` : ''}
        </Text>
      ) : null}
    </View>
  );
};
