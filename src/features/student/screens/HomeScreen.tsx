import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StudentTabParamList, StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { ArtisanCard } from '../components/ArtisanCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { ArtisanCardSkeleton } from '@shared/components/Loader';
import { EmptyState } from '@shared/components';
import { artisanApi } from '@services/api/artisan.api';
import { ArtisanProfile } from '@types/index';
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

  return (
    <ScreenWrapper
      scrollable={false}
      contentClassName="pt-2"
    >
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wider">Welcome back,</Text>
          <Text className="mt-1 font-heading text-3xl font-bold text-gray-900">
            {userName ?? 'Student'} 👋
          </Text>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Text className="text-lg font-bold text-primary">{userName?.charAt(0) ?? 'S'}</Text>
        </View>
      </View>

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
      ) : artisans.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No artisans found"
          description="Try a different category or check back later."
        />
      ) : (
        <FlatList
          data={artisans}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
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
