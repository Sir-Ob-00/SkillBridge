import React, { useCallback, useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Star } from 'lucide-react-native';
import { StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { EmptyState } from '@shared/components';
import { ReviewCard } from '@features/reviews/components/ReviewCard';
import { useReviewsStore } from '@features/reviews/reviews.store';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<StudentStackParamList, 'Reviews'>;

export const ReviewsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { artisanId } = route.params;
  const { cache, isLoading, fetchReviews, loadMore } = useReviewsStore();
  const cached = cache[artisanId];
  const reviews = cached?.reviews ?? [];
  const page = cached?.page ?? 1;
  const totalPages = cached?.totalPages ?? 1;

  useEffect(() => {
    void fetchReviews(artisanId);
  }, [artisanId, fetchReviews]);

  const handleEndReached = useCallback(() => {
    if (page < totalPages && !isLoading[artisanId]) {
      void loadMore(artisanId);
    }
  }, [artisanId, page, totalPages, isLoading, loadMore]);

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="mb-4 font-heading text-2xl font-bold text-gray-900">
        Reviews
      </Text>

      {!isLoading[artisanId] && reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Be the first to leave a review after a booking."
        />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isLoading[artisanId] ?? false}
          onRefresh={() => fetchReviews(artisanId)}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading[artisanId] && reviews.length > 0 ? (
              <View className="py-4">
                <Text className="text-center text-sm text-gray-400">Loading more...</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <ReviewCard review={item} />}
        />
      )}
    </ScreenWrapper>
  );
};
