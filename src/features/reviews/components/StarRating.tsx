import React from 'react';
import { Pressable, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 20,
  interactive = false,
  onChange,
}) => {
  return (
    <View className="flex-row items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const value = index + 1;
        const filled = value <= rating;

        if (interactive && onChange) {
          return (
            <Pressable
              key={value}
              onPress={() => onChange(value)}
              hitSlop={8}
              className="active:scale-110"
            >
              <Star
                size={size}
                color={colors.secondary}
                fill={filled ? colors.secondary : 'transparent'}
              />
            </Pressable>
          );
        }

        return (
          <Star
            key={value}
            size={size}
            color={colors.secondary}
            fill={filled ? colors.secondary : 'transparent'}
          />
        );
      })}
    </View>
  );
};
