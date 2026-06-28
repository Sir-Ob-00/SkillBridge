import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Booking } from '@app-types/index';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 active:opacity-80"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-gray-900">
          Booking #{booking.id.slice(-6).toUpperCase()}
        </Text>
        <StatusBadge status={booking.status} />
      </View>

      <View className="mt-2 flex-row items-center">
        <Calendar size={14} color={colors.gray400} />
        <Text className="ml-1.5 text-sm text-gray-600">
          {formatDateTime(booking.scheduledAt)}
        </Text>
      </View>

      {booking.notes ? (
        <View className="mt-2 flex-row items-start">
          <Clock size={14} color={colors.gray400} className="mt-0.5" />
          <Text className="ml-1.5 flex-1 text-sm text-gray-500" numberOfLines={2}>
            {booking.notes}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};
