import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface SearchCardProps {
  onPress: () => void;
}

export const SearchCard: React.FC<SearchCardProps> = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Search artisans"
      className="mb-6 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm shadow-gray-100 active:opacity-80"
    >
      <Search size={20} color={colors.gray400} />
      <Text className="ml-3 flex-1 text-base text-gray-400">
        Search artisans...
      </Text>
    </Pressable>
  );
};
