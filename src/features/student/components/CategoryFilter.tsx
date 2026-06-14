import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { CATEGORIES } from '@constants/categories';

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
      contentContainerClassName="gap-2 pr-4"
    >
      <Pressable
        onPress={() => onSelectCategory(null)}
        className={[
          'rounded-full px-5 py-2.5',
          selectedCategory === null ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-gray-100 border border-transparent',
        ].join(' ')}
      >
        <Text
          className={[
            'text-sm font-medium',
            selectedCategory === null ? 'text-white' : 'text-gray-700',
          ].join(' ')}
        >
          All
        </Text>
      </Pressable>

      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className={[
              'rounded-full px-5 py-2.5',
              isSelected ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-gray-100 border border-transparent',
            ].join(' ')}
          >
            <Text
              className={[
                'text-sm font-medium',
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
