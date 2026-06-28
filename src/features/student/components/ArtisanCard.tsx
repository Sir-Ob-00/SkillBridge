import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MapPin, BadgeCheck, Heart } from 'lucide-react-native';
import { ArtisanProfile } from '@app-types/index';
import { RatingStars } from './RatingStars';
import { formatPriceRange } from '@utils/currency';
import { colors } from '@shared/ui/colors';

interface ArtisanCardProps {
  artisan: ArtisanProfile;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ArtisanCard: React.FC<ArtisanCardProps> = ({
  artisan,
  onPress,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm shadow-gray-200 active:scale-[0.98] active:opacity-90 transition-transform"
    >
      <View className="h-36 w-full bg-gray-100">
        {artisan.avatarUrl ? (
          <Image
            source={{ uri: artisan.avatarUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-primary/10">
            <Text className="text-3xl font-bold text-primary">
              {artisan.businessName?.charAt(0).toUpperCase() ?? 'A'}
            </Text>
          </View>
        )}

        {onToggleFavorite ? (
          <Pressable
            onPress={onToggleFavorite}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-white/90"
          >
            <Heart
              size={16}
              color={colors.primary}
              fill={isFavorite ? colors.primary : 'transparent'}
            />
          </Pressable>
        ) : null}
      </View>

      <View className="p-3">
        <View className="flex-row items-center justify-between">
          <Text
            className="flex-1 text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {artisan.businessName}
          </Text>
          {artisan.isVerified ? (
            <BadgeCheck size={16} color={colors.success} className="ml-1" />
          ) : null}
        </View>

        <Text className="mt-0.5 text-xs uppercase tracking-wide text-primary">
          {artisan.category}
        </Text>

        <View className="mt-2 flex-row items-center justify-between">
          <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} />
          <Text className="text-sm font-semibold text-gray-900">
            {formatPriceRange(artisan.priceFrom)}
          </Text>
        </View>

        {artisan.location ? (
          <View className="mt-2 flex-row items-center">
            <MapPin size={12} color={colors.gray400} />
            <Text className="ml-1 text-xs text-gray-500" numberOfLines={1}>
              {artisan.location}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};
