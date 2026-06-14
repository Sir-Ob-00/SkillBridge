import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, User } from 'lucide-react-native';
import { Booking } from '@types/index';
import { StatusBadge } from '@features/booking/components/StatusBadge';
import { formatDateTime } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';

interface RequestCardProps {
  booking: Booking;
  onPress: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ booking, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-[20px] border border-transparent bg-white p-5 shadow-sm shadow-gray-200 active:scale-[0.98] active:opacity-90 transition-transform"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <User size={16} color={colors.gray400} />
          <Text className="ml-1.5 text-sm font-medium text-gray-700">
            Student #{booking.studentId.slice(-4).toUpperCase()}
          </Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View className="mt-2 flex-row items-center">
        <Calendar size={14} color={colors.gray400} />
        <Text className="ml-1.5 text-sm text-gray-600">
          {formatDateTime(booking.scheduledAt)}
        </Text>
      </View>

      {booking.notes ? (
        <Text className="mt-2 text-sm text-gray-500" numberOfLines={2}>
          {booking.notes}
        </Text>
      ) : null}
    </Pressable>
  );
};
