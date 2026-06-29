import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';
import { AvailabilitySlot } from '@services/api/artisan.api';
import { colors } from '@shared/ui/colors';

const DAYS: { key: AvailabilitySlot['day']; label: string; full: string }[] = [
  { key: 'monday', label: 'Mon', full: 'Monday' },
  { key: 'tuesday', label: 'Tue', full: 'Tuesday' },
  { key: 'wednesday', label: 'Wed', full: 'Wednesday' },
  { key: 'thursday', label: 'Thu', full: 'Thursday' },
  { key: 'friday', label: 'Fri', full: 'Friday' },
  { key: 'saturday', label: 'Sat', full: 'Saturday' },
  { key: 'sunday', label: 'Sun', full: 'Sunday' },
];

const DEFAULT_HOURS = { startTime: '09:00', endTime: '17:00' };

interface CalendarPickerProps {
  slots: AvailabilitySlot[];
  onChange: (slots: AvailabilitySlot[]) => void;
  holidayMode: boolean;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  slots,
  onChange,
  holidayMode,
}) => {
  const getSlot = (day: string) => slots.find((slot) => slot.day === day);

  const isDayEnabled = (day: string) =>
    !holidayMode && slots.some((slot) => slot.day === day);

  const toggleDay = (day: AvailabilitySlot['day']) => {
    if (isDayEnabled(day)) {
      onChange(slots.filter((slot) => slot.day !== day));
    } else {
      onChange([...slots, { day, ...DEFAULT_HOURS }]);
    }
  };

  const updateTime = (
    day: AvailabilitySlot['day'],
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    onChange(
      slots.map((slot) =>
        slot.day === day ? { ...slot, [field]: value } : slot
      )
    );
  };

  return (
    <View>
      <Text className="mb-3 text-sm font-medium text-gray-700">
        Available days
      </Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {DAYS.map((day) => {
          const enabled = isDayEnabled(day.key);
          return (
            <Pressable
              key={day.key}
              onPress={() => toggleDay(day.key)}
              disabled={holidayMode}
              className={[
                'h-11 w-11 items-center justify-center rounded-full',
                enabled ? 'bg-primary' : 'bg-white border border-gray-200',
                holidayMode ? 'opacity-40' : '',
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

      {holidayMode ? (
        <View className="mb-4 rounded-2xl bg-amber-50 p-4">
          <Text className="text-sm font-semibold text-amber-800">
            Holiday mode is ON
          </Text>
          <Text className="text-xs text-amber-600">
            You will not appear in search results until this is turned off.
          </Text>
        </View>
      ) : null}

      {!holidayMode && slots.length > 0 ? (
        <View className="gap-2">
          <Text className="mb-1 text-sm font-medium text-gray-700">
            Working hours
          </Text>
          {slots.map((slot) => {
            const dayInfo = DAYS.find((d) => d.key === slot.day);
            return (
              <View
                key={slot.day}
                className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-4"
              >
                <Text className="mr-4 w-16 text-base font-semibold text-gray-900">
                  {dayInfo?.label ?? slot.day}
                </Text>
                <TextInput
                  className="h-11 w-24 rounded-xl border border-gray-200 px-3 text-center text-base text-gray-900"
                  value={slot.startTime}
                  onChangeText={(val) => updateTime(slot.day, 'startTime', val)}
                  placeholder="09:00"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
                <Text className="mx-2 text-base text-gray-400">—</Text>
                <TextInput
                  className="mr-3 h-11 w-24 rounded-xl border border-gray-200 px-3 text-center text-base text-gray-900"
                  value={slot.endTime}
                  onChangeText={(val) => updateTime(slot.day, 'endTime', val)}
                  placeholder="17:00"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
                <Pressable
                  onPress={() =>
                    onChange(slots.filter((s) => s.day !== slot.day))
                  }
                  className="ml-auto h-7 w-7 items-center justify-center rounded-full bg-gray-100"
                >
                  <X size={14} color={colors.gray600} />
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
