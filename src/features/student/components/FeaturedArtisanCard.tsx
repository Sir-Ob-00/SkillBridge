import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import { ArtisanProfile } from '@app-types/index';
import { RatingStars } from './RatingStars';
import { useFavorites } from '../hooks/useFavorites';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

interface FeaturedArtisanCardProps {
  artisan: ArtisanProfile;
  onPress: () => void;
}

export const FeaturedArtisanCard: React.FC<FeaturedArtisanCardProps> = ({
  artisan,
  onPress,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(artisan.id);

  const lowestPrice = artisan.services?.length
    ? Math.min(...artisan.services.map((s) => s.price))
    : (artisan.priceFrom ?? 0);

  return (
    <Pressable
      onPress={onPress}
      className="mr-3 w-60 flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm shadow-gray-200 active:opacity-80"
    >
      <View className="mr-2.5 self-center">
        {artisan.avatarUrl || artisan.profileImageUrl ? (
          <Image
            source={{ uri: artisan.avatarUrl ?? artisan.profileImageUrl! }}
            className="h-12 w-12 rounded-full bg-gray-100"
            resizeMode="cover"
          />
        ) : (
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Text className="text-base font-bold text-primary">
              {artisan.businessName?.charAt(0).toUpperCase() ?? 'A'}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 justify-center">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-sm font-semibold text-gray-900" numberOfLines={1}>
            {artisan.businessName}
          </Text>
          <Pressable onPress={() => toggleFavorite(artisan.id)} hitSlop={8}>
            <Heart
              size={14}
              color={favorite ? colors.primary : colors.gray400}
              fill={favorite ? colors.primary : 'transparent'}
            />
          </Pressable>
        </View>

        <View className="mt-0.5">
          <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} size={10} />
        </View>

        <Text className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
          {artisan.category}
        </Text>

        {artisan.bio ? (
          <Text className="mt-0.5 text-[9px] text-gray-500" numberOfLines={1}>
            {artisan.bio}
          </Text>
        ) : null}

        <View className="mt-0.5 flex-row items-center">
          <MapPin size={9} color={colors.gray400} />
          <Text className="ml-0.5 flex-1 text-[10px] text-gray-500" numberOfLines={1}>
            {artisan.location || 'Location not set'}
          </Text>
          {lowestPrice > 0 ? (
            <Text className="text-[10px] font-semibold text-gray-900">
              {formatCurrency(lowestPrice)}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};
