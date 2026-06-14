import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { CATEGORIES } from '@constants/categories';
import { useUserStore } from '@store/user.store';

type Props = NativeStackScreenProps<ArtisanStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const updateProfile = useUserStore((state) => state.updateProfile);
  const isLoading = useUserStore((state) => state.isLoading);

  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);

  const handleSave = async () => {
    if (businessName.trim().length < 2) {
      Alert.alert('Missing info', 'Please enter your business name.');
      return;
    }

    try {
      // Persist basic profile fields; detailed artisan profile (category,
      // bio, location) is managed via a dedicated artisan profile endpoint
      // in the full backend integration.
      await updateProfile({ name: businessName.trim() });
      Alert.alert('Profile saved', 'Your artisan profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Failed to save', 'Please try again.');
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding contentClassName="pt-4">
      <Text className="mb-6 font-heading text-2xl font-bold text-gray-900">
        Set up your business profile
      </Text>

      <Input
        label="Business name"
        placeholder="e.g. Kofi's Barber Shop"
        value={businessName}
        onChangeText={setBusinessName}
      />

      <Input
        label="Bio"
        placeholder="Tell students about your work..."
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="min-h-[100px]"
      />

      <Input
        label="Location"
        placeholder="e.g. Near Unity Hall"
        value={location}
        onChangeText={setLocation}
      />

      <Text className="mb-1.5 text-sm font-medium text-gray-700">Category</Text>
      <View className="mb-6 flex-row flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              className={[
                'rounded-full px-3 py-1.5',
                isSelected ? 'bg-primary' : 'bg-white border border-gray-200',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-xs font-medium',
                  isSelected ? 'text-white' : 'text-gray-700',
                ].join(' ')}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button label="Save Profile" onPress={handleSave} isLoading={isLoading} fullWidth size="lg" />
    </ScreenWrapper>
  );
};
