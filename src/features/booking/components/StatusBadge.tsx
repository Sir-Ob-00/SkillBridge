import React from 'react';
import { Text, View } from 'react-native';
import { BookingStatus } from '@app-types/index';

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  accepted: { label: 'Accepted', bg: 'bg-green-100', text: 'text-green-700' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700' },
  completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-600' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600' },
};

interface StatusBadgeProps {
  status: BookingStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <View className={['rounded-full px-3 py-1', config.bg].join(' ')}>
      <Text className={['text-xs font-semibold', config.text].join(' ')}>
        {config.label}
      </Text>
    </View>
  );
};
