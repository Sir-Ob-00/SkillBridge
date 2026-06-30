import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';
import { artisanPublicService, AvailabilitySlot } from '@services/artisan.public.service';
import { colors } from '@shared/ui/colors';

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

interface ProfileAvailabilityCardProps {
  artisanId: string;
  onPress: () => void;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
}

export const ProfileAvailabilityCard: React.FC<ProfileAvailabilityCardProps> = ({
  artisanId,
  onPress,
}) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    if (!artisanId) return;
    artisanPublicService
      .getAvailability(artisanId)
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [artisanId]);

  const hasAvailability = slots.length > 0;

  return (
    <View className="mb-6">
      <Text className="mb-3 font-heading text-lg font-bold text-gray-900">
        Availability
      </Text>
      <Pressable
        onPress={onPress}
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200 active:opacity-80"
      >
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Clock size={20} color={colors.primary} />
            </View>
            <Text className="text-sm font-semibold text-gray-900">
              {hasAvailability ? 'Weekly Schedule' : 'Set Your Weekly Schedule'}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.gray400} />
        </View>

        {hasAvailability ? (
          <View className="gap-2 border-t border-gray-100 pt-3">
            {slots.map((slot) => (
              <View key={slot.day} className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-gray-900">
                  {DAY_LABELS[slot.day] ?? slot.day}
                </Text>
                <Text className="text-sm text-gray-500">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-xs text-gray-500">
            Manage working hours and availability
          </Text>
        )}
      </Pressable>
    </View>
  );
};
