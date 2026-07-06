import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StudentTabParamList, StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { ArtisanCard } from '../components/ArtisanCard';
import { SearchCard } from '../components/SearchCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { FeaturedArtisans } from '../components/FeaturedArtisans';
import { PromoBanner } from '../components/PromoBanner';
import { ArtisanCardSkeleton } from '@shared/components/Loader';
import { Avatar, EmptyState } from '@shared/components';
import { artisanApi } from '@services/api/artisan.api';
import { ArtisanProfile } from '@app-types/index';
import { useAuthStore } from '@store/auth.store';
import { useFavorites } from '../hooks/useFavorites';
import { MessageCircle, Search as SearchIcon } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';
import { NotificationBell } from '@modules/notifications/components/NotificationBell';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning ☀️';
  if (hour < 17) return 'Good Afternoon 🌤';
  return 'Good Evening 🌙';
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, 'Home'>,
  NativeStackScreenProps<StudentStackParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name?.split(' ')[0];
  const { isFavorite, toggleFavorite } = useFavorites();
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadArtisans = useCallback(async () => {
    try {
      const result = await artisanApi.list({ page: 1 });
      setArtisans(result.items);
    } catch {
      setArtisans([]);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    void loadArtisans().finally(() => setIsLoading(false));
  }, [loadArtisans]);

  const filteredArtisans = useMemo(() => {
    if (!selectedCategory) return artisans;
    return artisans.filter((a) => a.category === selectedCategory);
  }, [artisans, selectedCategory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadArtisans();
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
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium tracking-wide text-gray-500">
            {getGreeting()}
          </Text>
          <Text className="mt-0.5 font-heading text-3xl font-bold text-gray-900">
            {userName ?? 'Student'}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => navigation.navigate('ChatList')}
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 active:opacity-70"
          >
            <MessageCircle size={20} color={colors.gray600} />
          </Pressable>
          <NotificationBell onPress={() => navigation.navigate('Notifications')} />
          <Avatar
            name={user?.name ?? 'User'}
            imageUrl={user?.avatarUrl}
            size="md"
          />
        </View>
      </View>
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
          artisans={filteredArtisans}
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
      title={selectedCategory ? 'No artisans in this category' : 'No artisans available'}
      description={
        selectedCategory
          ? 'Try selecting a different category.'
          : "We're onboarding skilled professionals. Check back soon."
      }
    />
  );

  return (
    <ScreenWrapper scrollable={false} contentClassName="pt-2">
      <FlatList
        data={isLoading ? [] : filteredArtisans}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={headerContent}
        ListEmptyComponent={emptyContent}
        renderItem={({ item }) => (
          <ArtisanCard
            artisan={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
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
