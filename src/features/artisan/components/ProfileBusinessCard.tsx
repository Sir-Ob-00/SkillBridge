import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Briefcase, MapPin, Clock, DollarSign, Edit3, Camera } from 'lucide-react-native';
import { Avatar, Button } from '@shared/components';
import { User, ArtisanProfile } from '@app-types/index';
import { CATEGORIES } from '@constants/categories';
import { colors } from '@shared/ui/colors';

interface ProfileBusinessCardProps {
  user: User | null;
  artisanProfile?: ArtisanProfile | null;
  onEdit: () => void;
  onPickImage: () => void;
}

export const ProfileBusinessCard: React.FC<ProfileBusinessCardProps> = ({
  user,
  artisanProfile,
  onEdit,
  onPickImage,
}) => {
  const categoryLabel = CATEGORIES.find(
    (c) => c.id === artisanProfile?.category
  )?.label;

  return (
    <View className="mb-6">
      <View className="items-center">
        <Pressable onPress={onPickImage} accessibilityLabel="Change profile photo">
          <View className="relative">
            <Avatar
              name={user?.name ?? 'Artisan'}
              imageUrl={user?.avatarUrl}
              size="xl"
            />
            <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary shadow-sm">
              <Camera size={14} color="#ffffff" />
            </View>
          </View>
        </Pressable>
        <Text className="mt-3 font-heading text-xl font-bold text-gray-900">
          {user?.name}
        </Text>
        <Text className="text-sm text-gray-500">{user?.email}</Text>
      </View>

      <View className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200">
        {artisanProfile?.bio ? (
          <Text className="mb-3 text-sm text-gray-600">{artisanProfile.bio}</Text>
        ) : null}

        <View className="mb-3 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase size={20} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Primary Skill</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {categoryLabel ?? 'Artisan'}
            </Text>
          </View>
        </View>

        <View className="mb-3 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <MapPin size={20} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Location</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {artisanProfile?.location || 'Service area not set'}
            </Text>
          </View>
        </View>

        <View className="mb-3 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Clock size={20} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Experience</Text>
            <Text className="text-sm font-semibold text-gray-900">
              Not specified
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <DollarSign size={20} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Service Pricing</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {artisanProfile?.priceFrom
                ? `From GHS ${artisanProfile.priceFrom}`
                : 'Set in services'}
            </Text>
          </View>
        </View>

        <Button
          label="Edit Business Profile"
          variant="outline"
          size="sm"
          leftIcon={<Edit3 size={16} color={colors.primary} />}
          onPress={onEdit}
          fullWidth
          className="mt-4"
        />
      </View>
    </View>
  );
};
