import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Star,
} from 'lucide-react-native';
import { StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Loader } from '@shared/components';
import { RatingStars } from '../components/RatingStars';
import { useFavorites } from '../hooks/useFavorites';
import { artisanApi } from '@services/api/artisan.api';
import { ArtisanProfile, PortfolioItem, Service } from '@app-types/index';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<StudentStackParamList, 'ArtisanProfile'>;

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export const ArtisanProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { artisanId } = route.params;
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [profileData, servicesData, portfolioData, availabilityData] = await Promise.all([
        artisanApi.getById(artisanId).catch((err) => {
          console.error('[ArtisanProfileScreen] getById failed', err);
          return null;
        }),
        artisanApi.getServices(artisanId).catch((err) => {
          console.error('[ArtisanProfileScreen] getServices failed', err);
          return [];
        }),
        artisanApi.getPortfolio(artisanId).catch((err) => {
          console.error('[ArtisanProfileScreen] getPortfolio failed', err);
          return [];
        }),
        artisanApi.getAvailability(artisanId).catch((err) => {
          console.error('[ArtisanProfileScreen] getAvailability failed', err);
          return [];
        }),
      ]);
      if (!profileData) {
        console.error('[ArtisanProfileScreen] profileData is null');
        setArtisan(null);
        Alert.alert('Error', 'Could not load artisan profile.');
        return;
      }
      setArtisan({ ...profileData, services: servicesData });
      setPortfolio(portfolioData);
      setAvailability(availabilityData);
    } catch (err) {
      console.error('[ArtisanProfileScreen] Unexpected error in loadData', err);
      setArtisan(null);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [artisanId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookService = (service: Service) => {
    if (!artisan) return;
    navigation.navigate('Booking', {
      artisanId: artisan.id,
      serviceId: service.id,
    });
  };

  const favorite = isFavorite(artisanId);

  if (isLoading) {
    return <Loader fullScreen label="Loading profile..." />;
  }

  if (!artisan) {
    return (
      <ScreenWrapper>
        <Text className="mt-12 text-center text-gray-500">
          Artisan not found.
        </Text>
      </ScreenWrapper>
    );
  }

  const lowestPrice = artisan.services?.length
    ? Math.min(...artisan.services.map((s) => s.price))
    : (artisan.priceFrom ?? 0);

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-3 w-10">
          <ArrowLeft size={24} color={colors.gray800} />
        </Pressable>

        <View className="mb-6 items-center">
          <View className="relative">
            {artisan.avatarUrl || artisan.profileImageUrl ? (
              <Image
                source={{ uri: artisan.avatarUrl ?? artisan.profileImageUrl! }}
                className="h-24 w-24 rounded-full bg-gray-100"
                resizeMode="cover"
              />
            ) : (
              <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Text className="text-3xl font-bold text-primary">
                  {artisan.businessName?.charAt(0).toUpperCase() ?? 'A'}
                </Text>
              </View>
            )}
            {artisan.isVerified ? (
              <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white">
                <BadgeCheck size={16} color={colors.success} />
              </View>
            ) : null}
          </View>

          <View className="mt-3 flex-row items-center">
            <Text className="font-heading text-xl font-bold text-gray-900">
              {artisan.businessName}
            </Text>
          </View>

          <Text className="mt-0.5 text-sm uppercase tracking-wide text-primary">
            {artisan.category}
          </Text>

          <View className="mt-2 items-center">
            <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} />
          </View>

          <View className="mt-2 flex-row items-center gap-4">
            <View className="flex-row items-center">
              <MapPin size={13} color={colors.gray400} />
              <Text className="ml-1 text-sm text-gray-500">
                {artisan.location || 'Location not set'}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-gray-900">
              {formatCurrency(lowestPrice)}
            </Text>
          </View>
        </View>

        {artisan.bio ? (
          <View className="mb-6">
            <Text className="mb-1 text-sm font-semibold text-gray-900">About</Text>
            <Text className="text-sm leading-5 text-gray-600">{artisan.bio}</Text>
          </View>
        ) : null}

        <View className="mb-6">
          <Text className="mb-3 text-base font-semibold text-gray-900">
            Skills & Services
          </Text>
          {!artisan.services?.length ? (
            <Text className="text-sm text-gray-500">No services listed yet.</Text>
          ) : (
            artisan.services.map((service) => (
              <View
                key={service.id}
                className="mb-3 rounded-2xl border border-gray-100 bg-white p-4"
              >
                <Text className="text-base font-semibold text-gray-900">
                  {service.title}
                </Text>
                <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
                  {service.description}
                </Text>
                <View className="mt-2">
                  <Text className="text-sm font-semibold text-primary">
                    {formatCurrency(service.price)} · {service.durationMinutes} min
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {portfolio.length > 0 ? (
          <View className="mb-6">
            <Text className="mb-3 text-base font-semibold text-gray-900">
              Portfolio
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4"
            >
              {portfolio.map((item) => (
                <View key={item.id} className="mr-3">
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="h-28 w-28 rounded-xl bg-gray-100"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-28 w-28 items-center justify-center rounded-xl bg-gray-100">
                      <ImageIcon size={24} color={colors.gray400} />
                    </View>
                  )}
                  {item.title ? (
                    <Text
                      className="mt-1 w-28 text-xs text-gray-600"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-900">
              Ratings & Reviews
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate('Reviews', { artisanId: artisan.id })
              }
            >
              <Text className="text-sm font-medium text-primary">See all</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-900">
                {artisan?.rating?.toFixed?.(1) ?? '0.0'}
              </Text>
              <Text className="text-xs text-gray-500">
                {artisan.reviewCount ?? 0} review{artisan.reviewCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={colors.secondary}
                    fill={i < Math.round(artisan.rating ?? 0) ? colors.secondary : 'transparent'}
                  />
                ))}
              </View>
              <Text className="mt-1 text-xs text-gray-500">
                Rated {artisan?.rating?.toFixed?.(1) ?? '0.0'} out of 5
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-4">
          <Text className="mb-3 text-base font-semibold text-gray-900">
            Availability
          </Text>
          {availability.length === 0 ? (
            <Text className="text-sm text-gray-500">
              No availability set yet.
            </Text>
          ) : (
            <View className="rounded-2xl border border-gray-100 bg-white p-4">
              {availability.map((slot, idx) => (
                <View
                  key={slot.day}
                  className={[
                    'flex-row items-center justify-between py-2',
                    idx < availability.length - 1 ? 'border-b border-gray-50' : '',
                  ].join(' ')}
                >
                  <Text className="text-sm font-medium capitalize text-gray-900">
                    {slot.day}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {slot.startTime} - {slot.endTime}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View
        className="border-t border-gray-200 bg-white px-4 pt-3"
        style={{ paddingBottom: Math.max(bottomInset, 12) }}
      >
        <View className="flex-row gap-3">
          <Button
            label="Book Now"
            onPress={() => {
              if (artisan.services?.length) {
                handleBookService(artisan.services[0]);
              }
            }}
            className="flex-1"
            disabled={!artisan.services?.length}
          />
          <Button
            label="Chat"
            variant="outline"
            leftIcon={<MessageCircle size={18} color={colors.primary} />}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                chatId: `chat_${artisan.id}`,
                otherUserName: artisan.businessName,
              })
            }
            className="flex-1"
          />
          <Pressable
            onPress={() => toggleFavorite(artisanId)}
            className="h-11 w-11 items-center justify-center rounded-xl border border-gray-200"
          >
            <Heart
              size={20}
              color={favorite ? colors.primary : colors.gray400}
              fill={favorite ? colors.primary : 'transparent'}
            />
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};
