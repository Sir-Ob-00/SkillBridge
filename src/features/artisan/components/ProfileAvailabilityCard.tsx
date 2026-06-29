import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface ProfileAvailabilityCardProps {
  onPress: () => void;
}

export const ProfileAvailabilityCard: React.FC<ProfileAvailabilityCardProps> = ({
  onPress,
}) => {
  return (
    <View className="mb-6">
      <Text className="mb-3 font-heading text-lg font-bold text-gray-900">
        Availability
      </Text>
      <Pressable
        onPress={onPress}
        className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200 active:opacity-80"
      >
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Clock size={20} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900">
            Set Your Weekly Schedule
          </Text>
          <Text className="text-xs text-gray-500">
            Manage working hours and availability
          </Text>
        </View>
        <ChevronRight size={20} color={colors.gray400} />
      </Pressable>
    </View>
  );
};
