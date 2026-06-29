import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { BadgeCheck, MapPin } from 'lucide-react-native';
import { ArtisanProfile } from '@app-types/index';
import { RatingStars } from './RatingStars';
import { formatPriceRange } from '@utils/currency';
import { colors } from '@shared/ui/colors';

interface FeaturedArtisanCardProps {
  artisan: ArtisanProfile;
  onPress: () => void;
}

export const FeaturedArtisanCard: React.FC<FeaturedArtisanCardProps> = ({
  artisan,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="mr-3 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200 active:opacity-80"
    >
      <View className="h-28 w-full bg-gray-100">
        {artisan.avatarUrl ? (
          <Image
            source={{ uri: artisan.avatarUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-primary/10">
            <Text className="text-2xl font-bold text-primary">
              {artisan.businessName?.charAt(0).toUpperCase() ?? 'A'}
            </Text>
          </View>
        )}
      </View>

      <View className="p-2.5">
        <View className="flex-row items-center">
          <Text className="flex-1 text-sm font-semibold text-gray-900" numberOfLines={1}>
            {artisan.businessName}
          </Text>
          {artisan.isVerified ? (
            <BadgeCheck size={14} color={colors.success} className="ml-1" />
          ) : null}
        </View>
        <Text className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
          {artisan.category}
        </Text>
        <View className="mt-1.5 flex-row items-center justify-between">
          <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} size={12} />
          <Text className="text-xs font-semibold text-gray-900">
            {formatPriceRange(artisan.priceFrom)}
          </Text>
        </View>
        {artisan.location ? (
          <View className="mt-1 flex-row items-center">
            <MapPin size={10} color={colors.gray400} />
            <Text className="ml-0.5 text-[10px] text-gray-500" numberOfLines={1}>
              {artisan.location}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};
