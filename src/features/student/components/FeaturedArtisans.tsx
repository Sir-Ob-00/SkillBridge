import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ArtisanProfile } from '@app-types/index';
import { FeaturedArtisanCard } from './FeaturedArtisanCard';
import { ArtisanCardSkeleton } from '@shared/components/Loader';

interface FeaturedArtisansProps {
  artisans: ArtisanProfile[];
  isLoading: boolean;
  onPress: (artisanId: string) => void;
}

export const FeaturedArtisans: React.FC<FeaturedArtisansProps> = ({
  artisans,
  isLoading,
  onPress,
}) => {
  if (isLoading) {
    return (
      <View className="mb-6">
        <View className="mb-3">
          <Text className="font-heading text-lg font-bold text-gray-900">
            Featured Artisans
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="overflow-visible"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i} className="mr-3 w-60">
              <ArtisanCardSkeleton />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (artisans.length === 0) return null;

  const featured = artisans.slice(0, 5);

  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="font-heading text-lg font-bold text-gray-900">
          Featured Artisans
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-visible"
      >
        {featured.map((artisan) => (
          <FeaturedArtisanCard
            key={artisan.id}
            artisan={artisan}
            onPress={() => onPress(artisan.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
