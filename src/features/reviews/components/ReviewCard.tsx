import React from 'react';
import { Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Review } from '@app-types/index';
import { formatDate } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <View className="mb-3 rounded-2xl border border-gray-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              color={colors.secondary}
              fill={index < review.rating ? colors.secondary : 'transparent'}
            />
          ))}
        </View>
        <Text className="text-xs text-gray-400">{formatDate(review.createdAt)}</Text>
      </View>
      <Text className="mt-2 text-sm text-gray-700">{review.comment}</Text>
    </View>
  );
};
