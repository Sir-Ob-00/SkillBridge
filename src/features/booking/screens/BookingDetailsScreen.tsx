import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Calendar, FileText } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { StatusBadge } from '../components/StatusBadge';
import { useBookingStore } from '@store/booking.store';
import { formatDateTime } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';
import { useRole } from '@hooks/useRole';

type BookingDetailsRoute = { BookingDetails: { bookingId: string }; WriteReview?: { bookingId: string; artisanId: string } };
type Props = NativeStackScreenProps<BookingDetailsRoute, 'BookingDetails'>;

export const BookingDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const role = useRole();
  const { selectedBooking, isLoading, fetchBookingById, updateStatus } =
    useBookingStore();

  useEffect(() => {
    void fetchBookingById(bookingId);
  }, [bookingId, fetchBookingById]);

  if (isLoading || !selectedBooking) {
    return <Loader fullScreen label="Loading booking..." />;
  }

  const booking = selectedBooking;
  const isArtisan = role === 'artisan';

  return (
    <ScreenWrapper scrollable edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <View className="flex-row items-center justify-between">
        <Text className="font-heading text-2xl font-bold text-gray-900">
          Booking #{booking.id.slice(-6).toUpperCase()}
        </Text>
        <StatusBadge status={booking.status} />
      </View>

      <View className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
        <View className="flex-row items-center">
          <Calendar size={18} color={colors.gray400} />
          <Text className="ml-2 text-base text-gray-900">
            {formatDateTime(booking.scheduledAt)}
          </Text>
        </View>

        {booking.notes ? (
          <View className="mt-3 flex-row items-start">
            <FileText size={18} color={colors.gray400} className="mt-0.5" />
            <Text className="ml-2 flex-1 text-sm text-gray-600">{booking.notes}</Text>
          </View>
        ) : null}
      </View>

      {isArtisan && booking.status === 'pending' ? (
        <View className="mt-6 flex-row gap-3">
          <Button
            label="Decline"
            variant="outline"
            onPress={() => void updateStatus(booking.id, 'rejected')}
            className="flex-1"
          />
          <Button
            label="Accept"
            onPress={() => void updateStatus(booking.id, 'accepted')}
            className="flex-1"
          />
        </View>
      ) : null}

      {isArtisan && booking.status === 'accepted' ? (
        <Button
          label="Mark as Completed"
          onPress={() => void updateStatus(booking.id, 'completed')}
          fullWidth
          className="mt-6"
        />
      ) : null}

      {!isArtisan && booking.status === 'pending' ? (
        <Button
          label="Cancel Booking"
          variant="danger"
          onPress={() => void updateStatus(booking.id, 'cancelled')}
          fullWidth
          className="mt-6"
        />
      ) : null}

      {!isArtisan && booking.status === 'completed' ? (
        <Button
          label="Write a Review"
          onPress={() =>
            (navigation as unknown as NativeStackScreenProps<
              { WriteReview: { bookingId: string; artisanId: string } },
              'WriteReview'
            >['navigation']).navigate('WriteReview', {
              bookingId: booking.id,
              artisanId: booking.artisanId,
            })
          }
          fullWidth
          className="mt-6"
        />
      ) : null}
    </ScreenWrapper>
  );
};
