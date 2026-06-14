import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AvailabilitySlot } from '@services/api/artisan.api';

const DAYS: { key: AvailabilitySlot['day']; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const DEFAULT_HOURS = { startTime: '09:00', endTime: '17:00' };

interface CalendarPickerProps {
  slots: AvailabilitySlot[];
  onChange: (slots: AvailabilitySlot[]) => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ slots, onChange }) => {
  const isDayEnabled = (day: string) => slots.some((slot) => slot.day === day);

  const toggleDay = (day: AvailabilitySlot['day']) => {
    if (isDayEnabled(day)) {
      onChange(slots.filter((slot) => slot.day !== day));
    } else {
      onChange([...slots, { day, ...DEFAULT_HOURS }]);
    }
  };

  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-gray-700">
        Available days
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {DAYS.map((day) => {
          const enabled = isDayEnabled(day.key);
          return (
            <Pressable
              key={day.key}
              onPress={() => toggleDay(day.key)}
              className={[
                'h-11 w-11 items-center justify-center rounded-full',
                enabled ? 'bg-primary' : 'bg-white border border-gray-200',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-xs font-semibold',
                  enabled ? 'text-white' : 'text-gray-600',
                ].join(' ')}
              >
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="mt-3 text-xs text-gray-500">
        Default hours are 9:00 AM – 5:00 PM. Per-day time customization is
        coming soon.
      </Text>
    </View>
  );
};
