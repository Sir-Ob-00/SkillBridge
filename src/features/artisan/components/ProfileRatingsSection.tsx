import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Star, MessageSquare } from 'lucide-react-native';
import { Review } from '@app-types/index';
import { reviewApi } from '@services/api/review.api';
import { Loader } from '@shared/components/Loader';
import { colors } from '@shared/ui/colors';

interface ProfileRatingsSectionProps {
  artisanId: string;
}

export const ProfileRatingsSection: React.FC<ProfileRatingsSectionProps> = ({
  artisanId,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!artisanId) return;
    reviewApi
      .list(artisanId)
      .then((result) => setReviews(result.items))
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, [artisanId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <View className="mb-6">
      <Text className="mb-3 font-heading text-lg font-bold text-gray-900">
        Ratings & Reviews
      </Text>

      <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200">
        {isLoading ? (
          <Loader label="Loading reviews..." />
        ) : reviews.length === 0 ? (
          <View className="items-center py-4">
            <MessageSquare size={32} color={colors.gray400} />
            <Text className="mt-2 text-sm text-gray-500">
              No reviews yet
            </Text>
          </View>
        ) : (
          <>
            <View className="mb-4 flex-row items-center">
              <Text className="mr-2 font-heading text-3xl font-bold text-gray-900">
                {avgRating.toFixed(1)}
              </Text>
              <View className="flex-1">
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      color={colors.secondary}
                      fill={star <= Math.round(avgRating) ? colors.secondary : 'transparent'}
                    />
                  ))}
                </View>
                <Text className="mt-0.5 text-xs text-gray-500">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <View className="mb-4 gap-1.5">
              {breakdown.map(({ star, count, percentage }) => (
                <View key={star} className="flex-row items-center">
                  <Text className="mr-2 w-6 text-xs text-gray-500">
                    {star}★
                  </Text>
                  <View className="mr-2 h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <View
                      className="h-full rounded-full bg-secondary"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="w-5 text-right text-xs text-gray-500">
                    {count}
                  </Text>
                </View>
              ))}
            </View>

            <View className="border-t border-gray-100 pt-3">
              {reviews.slice(0, 5).map((review) => (
                <View key={review.id} className="mb-3">
                  <View className="flex-row items-center">
                    <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      <Text className="text-xs font-bold text-primary">
                        {review.studentId?.charAt(0).toUpperCase() ?? '?'}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={10}
                            color={colors.secondary}
                            fill={star <= review.rating ? colors.secondary : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text className="mt-1 text-sm text-gray-600">
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};
