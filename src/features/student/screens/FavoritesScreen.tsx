import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Heart } from 'lucide-react-native';
import { StudentTabParamList, StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { ArtisanCard } from '../components/ArtisanCard';
import { ArtisanCardSkeleton } from '@shared/components/Loader';
import { EmptyState } from '@shared/components';
import { useFavorites } from '../hooks/useFavorites';
import { artisanApi } from '@services/api/artisan.api';
import { ArtisanProfile } from '@types/index';

type Props = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, 'Favorites'>,
  NativeStackScreenProps<StudentStackParamList>
>;

export const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const { favoriteIds, isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (favoriteIds.length === 0) {
      setArtisans([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all(favoriteIds.map((id) => artisanApi.getById(id).catch(() => null)))
      .then((results) => {
        setArtisans(results.filter((item): item is ArtisanProfile => !!item));
      })
      .finally(() => setIsLoading(false));
  }, [favoriteIds, isLoaded]);

  return (
    <ScreenWrapper scrollable={false} contentClassName="pt-2">
      {isLoading ? (
        <View>
          {Array.from({ length: 2 }).map((_, i) => (
            <ArtisanCardSkeleton key={i} />
          ))}
        </View>
      ) : artisans.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on an artisan's card to save them here."
        />
      ) : (
        <FlatList
          data={artisans}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ArtisanCard
              artisan={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
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
