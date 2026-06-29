import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StudentTabParamList, StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { ArtisanCard } from '../components/ArtisanCard';
import { HomeGreeting } from '../components/HomeGreeting';
import { SearchCard } from '../components/SearchCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { FeaturedArtisans } from '../components/FeaturedArtisans';
import { PromoBanner } from '../components/PromoBanner';
import { ArtisanCardSkeleton } from '@shared/components/Loader';
import { EmptyState } from '@shared/components';
import { artisanApi } from '@services/api/artisan.api';
import { ArtisanProfile } from '@app-types/index';
import { useAuthStore } from '@store/auth.store';
import { Search as SearchIcon } from 'lucide-react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, 'Home'>,
  NativeStackScreenProps<StudentStackParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const userName = useAuthStore((state) => state.user?.name?.split(' ')[0]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadArtisans = useCallback(async (category: string | null) => {
    try {
      const result = await artisanApi.list({
        category: category ?? undefined,
        page: 1,
      });
      setArtisans(result.items);
    } catch {
      setArtisans([]);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    void loadArtisans(selectedCategory).finally(() => setIsLoading(false));
  }, [selectedCategory, loadArtisans]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadArtisans(selectedCategory);
    setIsRefreshing(false);
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  const navigateToArtisanProfile = (artisanId: string) => {
    navigation.navigate('ArtisanProfile', { artisanId });
  };

  const headerContent = (
    <View className="pt-2">
      <HomeGreeting name={userName} />
      <SearchCard onPress={navigateToSearch} />

      <Text className="mb-3 font-heading text-lg font-bold text-gray-900">
        Browse Categories
      </Text>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View className="mt-6">
        <FeaturedArtisans
          artisans={artisans}
          isLoading={isLoading}
          onPress={navigateToArtisanProfile}
        />
      </View>

      <PromoBanner onExplore={navigateToSearch} />

      <Text className="mb-4 font-heading text-lg font-bold text-gray-900">
        All Artisans
      </Text>
    </View>
  );

  const emptyContent = isLoading ? (
    <View className="px-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <ArtisanCardSkeleton key={i} />
      ))}
    </View>
  ) : (
    <EmptyState
      icon={SearchIcon}
      title="No artisans available"
      description="We're onboarding skilled professionals. Check back soon."
    />
  );

  return (
    <ScreenWrapper scrollable={false} contentClassName="pt-2">
      <FlatList
        data={isLoading ? [] : artisans}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={headerContent}
        ListEmptyComponent={emptyContent}
        renderItem={({ item }) => (
          <ArtisanCard
            artisan={item}
            onPress={() => navigateToArtisanProfile(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </ScreenWrapper>
  );
};
