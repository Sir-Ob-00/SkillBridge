import React from 'react';
import { Text, View } from 'react-native';
import { ReviewWithMeta } from '../reviews.types';
import { StarRating } from './StarRating';
import { getReviewerName, formatReviewDate } from '../reviews.service';
import { colors } from '@shared/ui/colors';

interface ReviewCardProps {
  review: ReviewWithMeta;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const reviewerName = getReviewerName(review);

  return (
    <View className="mb-3 rounded-2xl border border-gray-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <Text className="text-xs font-bold text-primary">
              {reviewerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>
            {reviewerName}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">{formatReviewDate(review.createdAt)}</Text>
      </View>

      <View className="mt-1.5">
        <StarRating rating={review.rating} size={14} />
      </View>

      <Text className="mt-2 text-sm leading-5 text-gray-700">{review.comment}</Text>
    </View>
  );
};
