import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  BookOpen,
  Camera,
  Monitor,
  Palette,
  PenTool,
  Scissors,
  Shirt,
  Smartphone,
  Sparkles,
} from 'lucide-react-native';
import { CATEGORIES } from '@constants/categories';
import { colors } from '@shared/ui/colors';

const iconMap: Record<string, React.FC<{ size: number; color: string }>> = {
  scissors: Scissors,
  'pen-tool': PenTool,
  camera: Camera,
  palette: Palette,
  shirt: Shirt,
  monitor: Monitor,
  smartphone: Smartphone,
  'book-open': BookOpen,
  sparkles: Sparkles,
};

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerClassName="gap-3 pr-4"
    >
      <Pressable
        onPress={() => onSelectCategory(null)}
        className={[
          'flex-row items-center rounded-2xl px-5 py-3',
          selectedCategory === null
            ? 'bg-primary shadow-sm shadow-primary/20'
            : 'border border-gray-200 bg-white',
        ].join(' ')}
      >
        <Text
          className={[
            'text-sm font-semibold',
            selectedCategory === null ? 'text-white' : 'text-gray-700',
          ].join(' ')}
        >
          All
        </Text>
      </Pressable>

      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        const IconComponent = iconMap[category.icon];

        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className={[
              'flex-row items-center rounded-2xl px-5 py-3',
              isSelected
                ? 'bg-primary shadow-sm shadow-primary/20'
                : 'border border-gray-200 bg-white',
            ].join(' ')}
          >
            {IconComponent ? (
              <IconComponent
                size={18}
                color={isSelected ? '#ffffff' : colors.primary}
              />
            ) : null}
            <Text
              className={[
                'ml-2 text-sm font-semibold',
                isSelected ? 'text-white' : 'text-gray-700',
              ].join(' ')}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
