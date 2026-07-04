import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { StudentStackParamList } from '@features/student/student.types';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { StarRating } from '../components/StarRating';
import { useReviewsStore } from '../reviews.store';
import { validateReview, getErrorMessage } from '../reviews.service';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<StudentStackParamList, 'WriteReview'>;

export const WriteReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId, artisanId } = route.params;
  const createReview = useReviewsStore((state) => state.createReview);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const errors = validateReview(rating, comment);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await createReview(artisanId, { bookingId, rating, comment: comment.trim() });
      Alert.alert('Review submitted!', 'Thank you for your feedback.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const message = getErrorMessage(err);
      Alert.alert('Could not submit review', message);
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

      <Text className="mb-2 text-sm font-medium text-gray-700">Your rating</Text>
      <View className="mb-6 flex-row justify-center">
        <StarRating
          rating={rating}
          size={36}
          interactive
          onChange={setRating}
        />
      </View>
      {fieldErrors.rating ? (
        <Text className="-mt-4 mb-4 text-center text-sm text-red-500">
          {fieldErrors.rating}
        </Text>
      ) : null}

      <Text className="mb-1.5 text-sm font-medium text-gray-700">Your review</Text>
      <View className="rounded-2xl border border-transparent bg-gray-50 px-4">
        <TextInput
          placeholder="Share details about your experience..."
          placeholderTextColor={colors.gray400}
          value={comment}
          onChangeText={(text) => {
            setComment(text);
            if (fieldErrors.comment) setFieldErrors({});
          }}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="py-3 text-base text-gray-900 min-h-[120px]"
        />
      </View>
      {fieldErrors.comment ? (
        <Text className="mt-1 text-xs text-red-500">{fieldErrors.comment}</Text>
      ) : null}

      <View className="mt-2 mb-1">
        <Text className="text-xs text-gray-400">
          {comment.length}/1000 characters
        </Text>
      </View>

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
