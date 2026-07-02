import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Check, Clock, X } from 'lucide-react-native';
import { StudentStackParamList } from '@features/student/student.types';
import { ScreenWrapper } from '@shared/layout';
import { Loader } from '@shared/components/Loader';
import { useBookingStore } from '@store/booking.store';
import { BookingStatus } from '@app-types/index';
import { colors } from '@shared/ui/colors';
import { formatDateTime } from '@utils/formatDate';

type Props = NativeStackScreenProps<StudentStackParamList, 'BookingStatus'>;

const STEP_ORDER: BookingStatus[] = ['pending', 'accepted', 'completed'];

const STEP_LABELS: Record<BookingStatus, string> = {
  pending: 'Requested',
  accepted: 'Accepted by artisan',
  in_progress: 'In progress',
  completed: 'Service completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export const BookingStatusScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const { selectedBooking, isLoading, fetchBookingById } = useBookingStore();

  useEffect(() => {
    void fetchBookingById(bookingId);
  }, [bookingId, fetchBookingById]);

  if (isLoading || !selectedBooking) {
    return <Loader fullScreen label="Loading status..." />;
  }

  const booking = selectedBooking;
  const isTerminalNegative = booking.status === 'rejected' || booking.status === 'cancelled';
  const currentStepIndex = STEP_ORDER.indexOf(booking.status);

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="mb-6 font-heading text-2xl font-bold text-gray-900">
        Booking Status
      </Text>

      {isTerminalNegative ? (
        <View className="flex-row items-center rounded-2xl bg-red-50 p-4">
          <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <X size={18} color={colors.danger} />
          </View>
          <Text className="flex-1 text-sm font-medium text-red-700">
            {STEP_LABELS[booking.status]}
          </Text>
        </View>
      ) : (
        <View>
          {STEP_ORDER.map((step, index) => {
            const isComplete = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <View key={step} className="flex-row">
                <View className="items-center">
                  <View
                    className={[
                      'h-8 w-8 items-center justify-center rounded-full',
                      isComplete ? 'bg-success' : 'bg-gray-200',
                    ].join(' ')}
                  >
                    {isComplete ? (
                      <Check size={16} color="#ffffff" />
                    ) : (
                      <Clock size={16} color={colors.gray400} />
                    )}
                  </View>
                  {index < STEP_ORDER.length - 1 ? (
                    <View
                      className={[
                        'h-10 w-0.5',
                        index < currentStepIndex ? 'bg-success' : 'bg-gray-200',
                      ].join(' ')}
                    />
                  ) : null}
                </View>

                <View className="ml-3 flex-1 pb-2">
                  <Text
                    className={[
                      'text-sm font-medium',
                      isComplete ? 'text-gray-900' : 'text-gray-400',
                    ].join(' ')}
                  >
                    {STEP_LABELS[step]}
                  </Text>
                  {isCurrent ? (
                    <Text className="mt-0.5 text-xs text-gray-500">
                      Updated {formatDateTime(booking.createdAt)}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScreenWrapper>
  );
};
