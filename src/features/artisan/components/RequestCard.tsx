import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, DollarSign, User } from 'lucide-react-native';
import { Booking } from '@app-types/index';
import { StatusBadge } from '@features/booking/components/StatusBadge';
import { formatDateTime } from '@utils/formatDate';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

interface RequestCardProps {
  booking: Booking;
  onPress: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ booking, onPress }) => {
  const serviceName =
    booking.service?.title ?? booking.serviceTitle ?? `Booking #${booking.id.slice(-6).toUpperCase()}`;
  const displayPrice =
    booking.service?.price ?? booking.price ?? 0;
  const customerName = booking.student?.name ?? `Student #${booking.studentId.slice(-4).toUpperCase()}`;

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-[20px] border border-transparent bg-white p-5 shadow-sm shadow-gray-200 active:scale-[0.98] active:opacity-90"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <User size={16} color={colors.gray400} />
          <Text className="ml-1.5 flex-1 text-sm font-medium text-gray-700" numberOfLines={1}>
            {customerName}
          </Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <Text className="mt-2 text-base font-semibold text-gray-900">{serviceName}</Text>

      <View className="mt-1.5 flex-row items-center">
        <Calendar size={14} color={colors.gray400} />
        <Text className="ml-1.5 flex-1 text-sm text-gray-600">
          {formatDateTime(booking.scheduledTime)}
        </Text>
        {displayPrice > 0 ? (
          <View className="flex-row items-center">
            <DollarSign size={12} color={colors.gray400} />
            <Text className="ml-0.5 text-sm font-semibold text-gray-900">
              {formatCurrency(displayPrice)}
            </Text>
          </View>
        ) : null}
      </View>

      {booking.notes ? (
        <Text className="mt-2 text-sm text-gray-500" numberOfLines={2}>
          {booking.notes}
        </Text>
      ) : null}
    </Pressable>
  );
};
