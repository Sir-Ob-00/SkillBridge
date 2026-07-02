import React, { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search as SearchIcon } from 'lucide-react-native';
import { StudentTabParamList, StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { Input } from '@shared/components';
import { ArtisanCard } from '../components/ArtisanCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { ArtisanCardSkeleton } from '@shared/components/Loader';
import { EmptyState } from '@shared/components';
import { artisanApi } from '@services/api/artisan.api';
import { ArtisanProfile } from '@app-types/index';
import { useDebounce } from '@hooks/useDebounce';
import { colors } from '@shared/ui/colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, 'Search'>,
  NativeStackScreenProps<StudentStackParamList>
>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<ArtisanProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!hasSearched && !debouncedQuery.trim() && !selectedCategory) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    artisanApi
      .list({
        query: debouncedQuery.trim() || undefined,
        page: 1,
      })
      .then((result) => {
        let filtered = result.items;
        if (selectedCategory) {
          filtered = filtered.filter((a) => a.category === selectedCategory);
        }
        setResults(filtered);
      })
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, selectedCategory]);

  return (
    <ScreenWrapper scrollable={false} contentClassName="pt-2">
      <View className="mb-4">
        <Text className="font-heading text-3xl font-bold text-gray-900">
          Discover
        </Text>
      </View>
      <Input
        placeholder="Search artisans, services, or categories"
        value={query}
        onChangeText={setQuery}
        leftIcon={<SearchIcon size={18} color={colors.gray400} />}
        autoCapitalize="none"
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {isLoading ? (
        <View>
          {Array.from({ length: 3 }).map((_, i) => (
            <ArtisanCardSkeleton key={i} />
          ))}
        </View>
      ) : !hasSearched ? (
        <EmptyState
          icon={SearchIcon}
          title="Find the right artisan"
          description="Search by name, category, or service to get started."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No results found"
          description="Try a different search term or category."
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ArtisanCard
              artisan={item}
              onPress={() =>
                navigation.navigate('ArtisanProfile', { artisanId: item.id })
              }
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
};
