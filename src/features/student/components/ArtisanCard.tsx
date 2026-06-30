import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import { ArtisanProfile } from '@app-types/index';
import { RatingStars } from './RatingStars';
import { formatCurrency } from '@utils/currency';
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
  const lowestPrice = artisan.services?.length
    ? Math.min(...artisan.services.map((s) => s.price))
    : (artisan.priceFrom ?? 0);

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm shadow-gray-200 active:opacity-80"
    >
      <View className="mr-3 self-center">
        {artisan.avatarUrl || artisan.profileImageUrl ? (
          <Image
            source={{ uri: artisan.avatarUrl ?? artisan.profileImageUrl! }}
            className="h-16 w-16 rounded-full bg-gray-100"
            resizeMode="cover"
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Text className="text-xl font-bold text-primary">
              {artisan.businessName?.charAt(0).toUpperCase() ?? 'A'}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 justify-center">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-base font-semibold text-gray-900" numberOfLines={1}>
            {artisan.businessName}
          </Text>
          {onToggleFavorite ? (
            <Pressable onPress={onToggleFavorite} hitSlop={8}>
              <Heart
                size={18}
                color={isFavorite ? colors.primary : colors.gray400}
                fill={isFavorite ? colors.primary : 'transparent'}
              />
            </Pressable>
          ) : null}
        </View>

        <View className="mt-0.5">
          <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} size={12} />
        </View>

        <Text className="mt-0.5 text-xs font-medium uppercase tracking-wide text-primary">
          {artisan.category}
        </Text>

        <View className="mt-0.5 flex-row items-center">
          <MapPin size={11} color={colors.gray400} />
          <Text className="ml-1 flex-1 text-xs text-gray-500" numberOfLines={1}>
            {artisan.location || 'Location not set'}
          </Text>
          {lowestPrice > 0 ? (
            <Text className="text-xs font-semibold text-gray-900">
              {formatCurrency(lowestPrice)}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};
