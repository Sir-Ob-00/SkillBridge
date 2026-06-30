import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input, Modal } from '@shared/components';
import { CATEGORIES } from '@constants/categories';
import { useUserStore } from '@store/user.store';
import { artisanService } from '@services/artisan.service';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<ArtisanStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const updateProfile = useUserStore((state) => state.updateProfile);

  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    artisanService
      .getMyProfile()
      .then((profile) => {
        setBusinessName(profile.businessName || '');
        setBio(profile.bio || '');
        setLocation(profile.location || '');
        setCategory(profile.category || CATEGORIES[0].id);
        setYearsOfExperience(
          profile.yearsOfExperience != null ? String(profile.yearsOfExperience) : ''
        );
        setProfileImageUrl(profile.profileImageUrl ?? null);
      })
      .catch((err) => {
        console.error('[ProfileSetupScreen] Failed to load profile', err);
      });
  }, []);

  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Allow access to your photo library to add a profile photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

    setPendingImage(result.assets[0].uri);
  };

  const handleUploadImage = async () => {
    if (!pendingImage) return;
    setUploading(true);
    try {
      const profile = await artisanService.uploadProfileImage(pendingImage);
      setProfileImageUrl(profile.profileImageUrl ?? null);
      setPendingImage(null);
    } catch (err) {
      console.error('[ProfileSetupScreen] Profile image upload failed', err);
      Alert.alert('Failed', 'Could not upload profile photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (businessName.trim().length < 2) {
      Alert.alert('Missing info', 'Please enter your business name.');
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        updateProfile({ name: businessName.trim() }),
        artisanService.updateMyProfile({
          businessName: businessName.trim(),
          bio,
          location,
          category,
          yearsOfExperience: yearsOfExperience
            ? Number(yearsOfExperience)
            : undefined,
        }),
      ]);
      Alert.alert('Profile saved', 'Your artisan profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Failed to save', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding contentClassName="pt-4">
      <Text className="mb-6 font-heading text-2xl font-bold text-gray-900">
        Set up your business profile
      </Text>

      <Pressable
        onPress={handlePickImage}
        className="mb-6 items-center self-center"
        accessibilityLabel="Change profile photo"
      >
        <View className="relative">
          {pendingImage || profileImageUrl ? (
            <Image
              source={{ uri: pendingImage ?? profileImageUrl! }}
              className="h-24 w-24 rounded-full bg-gray-200"
              resizeMode="cover"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <Camera size={28} color={colors.gray400} />
            </View>
          )}
          <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary shadow-sm">
            <Camera size={14} color="#ffffff" />
          </View>
        </View>
        <Text className="mt-2 text-sm font-medium text-primary">
          Change Photo
        </Text>
      </Pressable>

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

      <Input
        label="Years of Experience"
        placeholder="e.g. 5"
        value={yearsOfExperience}
        onChangeText={setYearsOfExperience}
        keyboardType="numeric"
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

      <Button label="Save Profile" onPress={handleSave} isLoading={isSaving} fullWidth size="lg" />

      <Modal
        visible={!!pendingImage}
        onClose={() => setPendingImage(null)}
        title="Upload Profile Photo"
      >
        {pendingImage && (
          <View className="items-center">
            <Image
              source={{ uri: pendingImage }}
              className="mb-4 h-48 w-48 rounded-full bg-gray-100"
              resizeMode="cover"
            />
            <View className="w-full flex-row gap-3">
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setPendingImage(null)}
                className="flex-1"
              />
              <Button
                label={uploading ? 'Uploading...' : 'Upload'}
                variant="primary"
                onPress={handleUploadImage}
                disabled={uploading}
                className="flex-1"
              />
            </View>
          </View>
        )}
      </Modal>
    </ScreenWrapper>
  );
};
