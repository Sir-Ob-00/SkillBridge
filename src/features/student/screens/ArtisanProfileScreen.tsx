import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, MapPin, MessageCircle, BadgeCheck } from 'lucide-react-native';
import { StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { RatingStars } from '../components/RatingStars';
import { artisanApi } from '@services/api/artisan.api';
import { ArtisanProfile, Service } from '@types/index';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<StudentStackParamList, 'ArtisanProfile'>;

export const ArtisanProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { artisanId } = route.params;
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    artisanApi
      .getById(artisanId)
      .then((data) => {
        if (isMounted) setArtisan(data);
      })
      .catch(() => {
        if (isMounted) setArtisan(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [artisanId]);

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

  const handleBookService = (service: Service) => {
    navigation.navigate('Booking', {
      artisanId: artisan.id,
      serviceId: service.id,
    });
  };

  return (
    <ScreenWrapper scrollable edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <View className="mb-6 h-56 w-full overflow-hidden rounded-[32px] bg-gray-100 shadow-sm shadow-gray-200">
        {artisan.avatarUrl ? (
          <Image
            source={{ uri: artisan.avatarUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-primary/10">
            <Text className="text-4xl font-bold text-primary">
              {artisan.businessName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="font-heading text-2xl font-bold text-gray-900">
          {artisan.businessName}
        </Text>
        {artisan.isVerified ? (
          <BadgeCheck size={20} color={colors.success} />
        ) : null}
      </View>

      <Text className="mt-1 text-sm uppercase tracking-wide text-primary">
        {artisan.category}
      </Text>

      <View className="mt-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => navigation.navigate('Reviews', { artisanId: artisan.id })}
        >
          <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} />
        </Pressable>

        {artisan.location ? (
          <View className="flex-row items-center">
            <MapPin size={14} color={colors.gray400} />
            <Text className="ml-1 text-sm text-gray-500">{artisan.location}</Text>
          </View>
        ) : null}
      </View>

      <Text className="mt-4 text-base leading-6 text-gray-700">{artisan.bio}</Text>

      <View className="mt-6 flex-row gap-3">
        <Button
          label="Message"
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
      </View>

      <Text className="mt-8 mb-3 text-lg font-semibold text-gray-900">
        Services
      </Text>

      {artisan.services.length === 0 ? (
        <Text className="text-sm text-gray-500">
          No services listed yet.
        </Text>
      ) : (
        artisan.services.map((service) => (
          <View
            key={service.id}
            className="mb-4 flex-row items-center justify-between rounded-3xl border border-transparent bg-white p-5 shadow-sm shadow-gray-200"
          >
            <View className="flex-1 pr-4">
              <Text className="text-base font-semibold text-gray-900">
                {service.title}
              </Text>
              <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
                {service.description}
              </Text>
              <Text className="mt-2 text-sm font-medium text-primary">
                {formatCurrency(service.price)} · {service.durationMinutes} min
              </Text>
            </View>
            <Button label="Book" size="sm" onPress={() => handleBookService(service)} />
          </View>
        ))
      )}
    </ScreenWrapper>
  );
};
