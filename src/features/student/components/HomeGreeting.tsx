import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

interface HomeGreetingProps {
  name: string | undefined;
}

function getGreeting(): { label: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { label: 'Good Morning', emoji: '☀️' };
  if (hour < 17) return { label: 'Good Afternoon', emoji: '🌤' };
  return { label: 'Good Evening', emoji: '🌙' };
}

export const HomeGreeting: React.FC<HomeGreetingProps> = ({ name }) => {
  const { label, emoji } = useMemo(() => getGreeting(), []);
  const initial = name?.charAt(0) ?? 'S';

  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-sm font-medium tracking-wide text-gray-500">
          {label} {emoji}
        </Text>
        <Text className="mt-0.5 font-heading text-3xl font-bold text-gray-900">
          {name ?? 'Student'}
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          Need a skilled artisan today?
        </Text>
      </View>
      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Text className="text-lg font-bold text-primary">{initial}</Text>
      </View>
    </View>
  );
};
