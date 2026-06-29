import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { Booking } from '@app-types/index';
import { useBookingStore } from '@store/booking.store';
import { colors } from '@shared/ui/colors';

interface DashboardTodaysJobsProps {
  bookings: Booking[];
  onViewDetails: (bookingId: string) => void;
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700' },
  accepted: { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700' },
  completed: { label: 'Completed', bg: 'bg-green-50', text: 'text-green-700' },
};

export const DashboardTodaysJobs: React.FC<DashboardTodaysJobsProps> = ({
  bookings,
  onViewDetails,
}) => {
  const { updateStatus } = useBookingStore();
  const todaysJobs = bookings.filter((b) => isToday(b.scheduledAt));

  const handleAction = async (booking: Booking) => {
    if (booking.status === 'pending' || booking.status === 'accepted') {
      const nextStatus = booking.status === 'pending' ? 'accepted' : 'completed';
      try {
        await updateStatus(booking.id, nextStatus as Booking['status']);
      } catch {
        Alert.alert('Failed', 'Could not update job status.');
      }
    } else {
      onViewDetails(booking.id);
    }
  };

  const actionLabel = (status: string) => {
    if (status === 'pending') return 'Start Job';
    if (status === 'accepted') return 'Mark Complete';
    return 'View Details';
  };

  return (
    <View className="mb-4">
      <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Today's Jobs
      </Text>

      {todaysJobs.length === 0 ? (
        <View className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-5">
          <View className="flex-row items-center">
            <Calendar size={20} color={colors.gray400} />
            <Text className="ml-2 text-sm text-gray-500">
              No jobs scheduled for today
            </Text>
          </View>
        </View>
      ) : (
        <View className="gap-3">
          {todaysJobs.map((booking) => {
            const style = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;
            return (
              <View
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200"
              >
                <View className="p-4">
                  <View className="mb-3 flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">
                        Student #{booking.studentId.slice(-4).toUpperCase()}
                      </Text>
                      {booking.notes ? (
                        <Text className="mt-0.5 text-sm text-gray-500">
                          {booking.notes}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      className={['rounded-full px-3 py-1', style.bg].join(' ')}
                    >
                      <Text className={['text-xs font-semibold', style.text].join(' ')}>
                        {style.label}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Clock size={14} color={colors.gray400} />
                    <Text className="ml-1.5 text-sm text-gray-600">
                      {new Date(booking.scheduledAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <Text className="mx-2 text-gray-300">|</Text>
                    <MapPin size={14} color={colors.gray400} />
                    <Text className="ml-1.5 text-sm text-gray-500">
                      Location TBD
                    </Text>
                  </View>

                  <View className="mt-3 flex-row gap-2">
                    <Pressable
                      onPress={() => handleAction(booking)}
                      className={[
                        'flex-1 items-center rounded-xl py-2.5 active:opacity-80',
                        booking.status === 'completed'
                          ? 'border border-gray-200 bg-white'
                          : 'bg-primary',
                      ].join(' ')}
                    >
                      <Text
                        className={[
                          'text-sm font-semibold',
                          booking.status === 'completed'
                            ? 'text-gray-700'
                            : 'text-white',
                        ].join(' ')}
                      >
                        {actionLabel(booking.status)}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => onViewDetails(booking.id)}
                      className="h-10 w-10 items-center justify-center rounded-xl bg-gray-50 active:opacity-80"
                    >
                      <ChevronRight size={18} color={colors.gray600} />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
