import React from 'react';
import { Alert, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Briefcase, Clock, LogOut, MessageCircle } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Avatar, Button } from '@shared/components';
import { useAuth } from '@hooks/useAuth';
import { colors } from '@shared/ui/colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Profile'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

export const ArtisanProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void logout() },
    ]);
  };

  return (
    <ScreenWrapper scrollable contentClassName="pt-4">
      <View className="mb-6 items-center">
        <Avatar name={user?.name ?? 'Artisan'} imageUrl={user?.avatarUrl} size="xl" />
        <Text className="mt-3 font-heading text-xl font-bold text-gray-900">
          {user?.name}
        </Text>
        <Text className="text-sm text-gray-500">{user?.email}</Text>
      </View>

      <Button
        label="Business Profile"
        variant="outline"
        leftIcon={<Briefcase size={18} color={colors.primary} />}
        onPress={() => navigation.navigate('ProfileSetup')}
        fullWidth
        className="mb-3"
      />

      <Button
        label="Availability"
        variant="outline"
        leftIcon={<Clock size={18} color={colors.primary} />}
        onPress={() => navigation.navigate('Availability')}
        fullWidth
        className="mb-3"
      />

      <Button
        label="Messages"
        variant="outline"
        leftIcon={<MessageCircle size={18} color={colors.primary} />}
        onPress={() => navigation.navigate('ChatList')}
        fullWidth
        className="mb-3"
      />

      <Button
        label="Sign out"
        variant="danger"
        leftIcon={<LogOut size={18} color="#ffffff" />}
        onPress={handleLogout}
        fullWidth
      />
    </ScreenWrapper>
  );
};
