import React from 'react';
import { Image, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../auth.types';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { colors } from '@shared/ui/colors';

const HERO_IMAGE = { uri: 'https://res.cloudinary.com/df6hdqpjl/image/upload/v1783657389/artisan-pic_ansgc6.jpg' };

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenWrapper scrollable={false} edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-4">
        <View className="mb-6 h-56 w-72 items-center justify-center overflow-hidden rounded-[80px] shadow-lg shadow-black/30">
          <Image
            source={HERO_IMAGE}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        <Text className="font-heading text-4xl font-bold text-gray-900 text-center">
          Welcome to SkillBridge
        </Text>
        <Text className="mt-4 text-base text-gray-500 text-center leading-6">
          The premium marketplace connecting students with trusted campus artisans for any service.
        </Text>
      </View>

      <View className="w-full px-4 pb-8 pt-4">
        <Button
          label="Get Started"
          onPress={() => navigation.navigate('RoleSelect')}
          size="lg"
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
};
