import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Star } from 'lucide-react-native';
import { StudentStackParamList } from '@features/student/student.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { reviewApi } from '@services/api/review.api';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<StudentStackParamList, 'WriteReview'>;

export const WriteReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId, artisanId } = route.params;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (comment.trim().length < 5) {
      Alert.alert('Add more detail', 'Please write at least a short comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.create({ bookingId, artisanId, rating, comment: comment.trim() });
      Alert.alert('Thank you!', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Submission failed', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="mb-6 font-heading text-2xl font-bold text-gray-900">
        Write a review
      </Text>

      <View className="mb-6 flex-row justify-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;
          return (
            <Pressable key={value} onPress={() => setRating(value)}>
              <Star
                size={36}
                color={colors.secondary}
                fill={value <= rating ? colors.secondary : 'transparent'}
              />
            </Pressable>
          );
        })}
      </View>

      <Input
        label="Your review"
        placeholder="Share details about your experience..."
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        className="min-h-[120px]"
      />

      <Button
        label="Submit Review"
        onPress={handleSubmit}
        isLoading={isSubmitting}
        fullWidth
        size="lg"
      />
    </ScreenWrapper>
  );
};
