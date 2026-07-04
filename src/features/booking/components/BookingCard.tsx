import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, Clock, DollarSign } from 'lucide-react-native';
import { Booking } from '@app-types/index';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '@utils/formatDate';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  showCustomer?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress, showCustomer }) => {
  const serviceName =
    booking.service?.title ?? booking.serviceTitle ?? `Booking #${booking.id.slice(-6).toUpperCase()}`;
  const displayPrice =
    booking.service?.price ?? booking.price ?? 0;
  const customerName = booking.student?.name ?? `Student #${booking.studentId.slice(-4).toUpperCase()}`;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 active:opacity-80"
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-gray-900" numberOfLines={1}>
          {serviceName}
        </Text>
        <StatusBadge status={booking.status} />
      </View>

      {showCustomer ? (
        <Text className="mt-1.5 text-sm text-gray-500">
          Customer: {customerName}
        </Text>
      ) : null}

      <View className="mt-2 flex-row items-center">
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
        <View className="mt-2 flex-row items-start">
          <Clock size={14} color={colors.gray400} />
          <Text className="ml-1.5 flex-1 text-sm text-gray-500" numberOfLines={1}>
            {booking.notes}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};
