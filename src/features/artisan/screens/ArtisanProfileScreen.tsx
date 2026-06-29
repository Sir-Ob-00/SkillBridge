import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { LogOut, Settings } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Modal } from '@shared/components';
import { useAuth } from '@hooks/useAuth';
import { useAuthStore } from '@store/auth.store';
import { useUserStore } from '@store/user.store';
import { colors } from '@shared/ui/colors';
import { userService } from '@services/user.service';
import { ProfileBusinessCard } from '../components/ProfileBusinessCard';
import { ProfileServicesSection } from '../components/ProfileServicesSection';
import { ProfilePortfolio } from '../components/ProfilePortfolio';
import { ProfileRatingsSection } from '../components/ProfileRatingsSection';
import { ProfileAvailabilityCard } from '../components/ProfileAvailabilityCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Profile'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

export const ArtisanProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const artisanId = useAuthStore((state) => state.user?.id ?? '');
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Allow access to your photo library to change your profile picture.'
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

    setPendingAvatar(result.assets[0].uri);
  };

  const handleUploadAvatar = async () => {
    if (!pendingAvatar) return;
    setUploading(true);
    try {
      const updatedUser = await userService.uploadAvatar(pendingAvatar);
      await updateProfile({ avatarUrl: updatedUser.avatarUrl });
      setPendingAvatar(null);
    } catch {
      Alert.alert('Failed', 'Could not upload profile photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void logout() },
    ]);
  };

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <View className="mb-2 flex-row items-center justify-between px-4 pt-2">
        <Text className="font-heading text-2xl font-bold text-gray-900">
          Profile
        </Text>
        <View>
          <Button
            label=""
            variant="ghost"
            size="sm"
            leftIcon={<Settings size={20} color={colors.gray600} />}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pb-8"
      >
        <ProfileBusinessCard
          user={user}
          onEdit={() => navigation.navigate('ProfileSetup')}
          onPickImage={handlePickImage}
        />

        <ProfileServicesSection artisanId={artisanId} />

        <ProfilePortfolio artisanId={artisanId} />

        <ProfileRatingsSection artisanId={artisanId} />

        <ProfileAvailabilityCard
          onPress={() => navigation.navigate('Availability')}
        />

        <Button
          label="Sign out"
          variant="danger"
          leftIcon={<LogOut size={18} color="#ffffff" />}
          onPress={handleLogout}
          fullWidth
          className="mt-2"
        />
      </ScrollView>

      <Modal
        visible={!!pendingAvatar}
        onClose={() => setPendingAvatar(null)}
        title="Upload Profile Photo"
      >
        {pendingAvatar && (
          <View className="items-center">
            <Image
              source={{ uri: pendingAvatar }}
              className="mb-4 h-48 w-48 rounded-full bg-gray-100"
              resizeMode="cover"
            />
            <View className="w-full flex-row gap-3">
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setPendingAvatar(null)}
                className="flex-1"
              />
              <Button
                label={uploading ? 'Uploading...' : 'Upload'}
                variant="primary"
                onPress={handleUploadAvatar}
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
