import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Calendar, DollarSign, FileText, Flag, User } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { StatusBadge } from '../components/StatusBadge';
import { useBookingStore } from '@store/booking.store';
import { formatCurrency } from '@utils/currency';
import { formatDateTime } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';
import { useRole } from '@hooks/useRole';
import { BookingStatus } from '@app-types/index';
import { useReviewsStore } from '@features/reviews/reviews.store';
import { artisanApi } from '@services/api/artisan.api';
import { ReportForm } from '@features/reports/components/ReportForm';

type Props = NativeStackScreenProps<{ BookingDetails: { bookingId: string } }, 'BookingDetails'>;

export const BookingDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const role = useRole();
  const { selectedBooking, isLoading, fetchBookingById, updateStatus } = useBookingStore();
  const { isReviewed, markReviewed } = useReviewsStore();
  const [reportVisible, setReportVisible] = useState(false);
  const [artisanUserId, setArtisanUserId] = useState<string | null>(null);

  React.useEffect(() => {
    void fetchBookingById(bookingId);
  }, [bookingId, fetchBookingById]);

  useEffect(() => {
    if (selectedBooking) {
      artisanApi.getById(selectedBooking.artisanId).then((profile) => {
        setArtisanUserId(profile.userId);
      }).catch(() => {});
    }
  }, [selectedBooking]);

  const handleStatusUpdate = useCallback(async (status: BookingStatus) => {
    try {
      await updateStatus(bookingId, status);
      Alert.alert('Updated', `Booking ${status.replace('_', ' ')} successfully.`);
    } catch {
      Alert.alert('Failed', 'Could not update booking status.');
    }
  }, [bookingId, updateStatus]);

  const confirmAction = (status: BookingStatus, label: string) => {
    Alert.alert(
      `${label} Booking`,
      `Are you sure you want to ${label.toLowerCase()} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: label, onPress: () => handleStatusUpdate(status) },
      ]
    );
  };

  if (isLoading || !selectedBooking) {
    return <Loader fullScreen label="Loading booking..." />;
  }

  const booking = selectedBooking;
  const isArtisan = role === 'artisan';
  const serviceName =
    booking.service?.title ?? booking.serviceTitle ?? `Booking #${booking.id.slice(-6).toUpperCase()}`;
  const displayPrice = booking.service?.price ?? booking.price ?? 0;
  const customerName = booking.student?.name ?? `Student #${booking.studentId.slice(-4).toUpperCase()}`;
  const artisanName = booking.artisan?.businessName ?? `Artisan #${booking.artisanId.slice(-4).toUpperCase()}`;
  const reportTargetUserId = isArtisan ? booking.studentId : (artisanUserId ?? booking.artisanId);

  return (
    <ScreenWrapper scrollable edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <View className="flex-row items-center justify-between">
        <Text className="flex-1 font-heading text-2xl font-bold text-gray-900" numberOfLines={1}>
          {serviceName}
        </Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setReportVisible(true)}
            accessibilityLabel="Report"
          >
            <Flag size={18} color={colors.gray600} />
          </Pressable>
          <StatusBadge status={booking.status} />
        </View>
      </View>

      <View className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
        <View className="flex-row items-center">
          <User size={18} color={colors.gray400} />
          <Text className="ml-2 text-sm text-gray-500">
            {isArtisan ? `Customer: ${customerName}` : `Artisan: ${artisanName}`}
          </Text>
        </View>

        <View className="mt-3 flex-row items-center">
          <Calendar size={18} color={colors.gray400} />
          <Text className="ml-2 text-base text-gray-900">
            {formatDateTime(booking.scheduledTime)}
          </Text>
        </View>

        {displayPrice > 0 ? (
          <View className="mt-3 flex-row items-center">
            <DollarSign size={18} color={colors.gray400} />
            <Text className="ml-2 text-base font-semibold text-gray-900">
              {formatCurrency(displayPrice)}
            </Text>
          </View>
        ) : null}

        {booking.notes ? (
          <View className="mt-3 flex-row items-start">
            <FileText size={18} color={colors.gray400} />
            <Text className="ml-2 flex-1 text-sm text-gray-600">{booking.notes}</Text>
          </View>
        ) : null}
      </View>

      {/* Artisan actions */}
      {isArtisan && booking.status === 'pending' ? (
        <View className="mt-6 flex-row gap-3">
          <Button
            label="Decline"
            variant="outline"
            onPress={() => confirmAction('rejected', 'Decline')}
            className="flex-1"
          />
          <Button
            label="Accept"
            onPress={() => handleStatusUpdate('accepted')}
            className="flex-1"
          />
        </View>
      ) : null}

      {isArtisan && booking.status === 'accepted' ? (
        <View className="mt-6">
          <Button
            label="Start Job"
            onPress={() => handleStatusUpdate('in_progress')}
            fullWidth
          />
        </View>
      ) : null}

      {isArtisan && booking.status === 'in_progress' ? (
        <View className="mt-6">
          <Button
            label="Complete Job"
            onPress={() => confirmAction('completed', 'Complete')}
            fullWidth
          />
        </View>
      ) : null}

      {isArtisan && booking.status === 'pending' ? (
        <Button
          label="Cancel Booking"
          variant="danger"
          onPress={() => confirmAction('cancelled', 'Cancel')}
          fullWidth
          className="mt-3"
        />
      ) : null}

      {/* Student actions */}
      {!isArtisan && booking.status === 'pending' ? (
        <Button
          label="Cancel Booking"
          variant="danger"
          onPress={() => confirmAction('cancelled', 'Cancel')}
          fullWidth
          className="mt-6"
        />
      ) : null}

      {!isArtisan && booking.status === 'completed' ? (
        isReviewed(booking.id) ? (
          <Button
            label="Review Submitted"
            variant="ghost"
            disabled
            fullWidth
            className="mt-6"
          />
        ) : (
          <Button
            label="Write a Review"
            onPress={() => {
              markReviewed(booking.id);
              (navigation as any).navigate('WriteReview', {
                bookingId: booking.id,
                artisanId: booking.artisanId,
              });
            }}
            fullWidth
            className="mt-6"
          />
        )
      ) : null}

      <ReportForm
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        targetUserId={reportTargetUserId}
      />
    </ScreenWrapper>
  );
};
