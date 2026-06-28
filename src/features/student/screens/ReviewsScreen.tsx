import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Star } from 'lucide-react-native';
import { StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { Loader } from '@shared/components/Loader';
import { EmptyState } from '@shared/components';
import { ReviewCard } from '@features/reviews/components/ReviewCard';
import { reviewApi } from '@services/api/review.api';
import { Review } from '@app-types/index';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<StudentStackParamList, 'Reviews'>;

export const ReviewsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { artisanId } = route.params;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewApi
      .list(artisanId)
      .then((result) => setReviews(result.items))
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, [artisanId]);

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="mb-4 font-heading text-2xl font-bold text-gray-900">
        Reviews
      </Text>

      {isLoading ? (
        <Loader label="Loading reviews..." />
      ) : reviews.length === 0 ? (
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
          renderItem={({ item }) => <ReviewCard review={item} />}
        />
      )}
    </ScreenWrapper>
  );
};
