import React from 'react';
import { Image, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Rocket, Sparkles, ShieldCheck } from 'lucide-react-native';
import { AuthStackParamList } from '../auth.types';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenWrapper scrollable={false} edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-4">
        <View className="mb-8 h-32 w-32 items-center justify-center rounded-[40px] bg-primary/10 shadow-sm shadow-primary/20">
          <Rocket size={64} color={colors.primary} />
        </View>

        <Text className="font-heading text-4xl font-bold text-gray-900 text-center">
          Welcome to SkillBridge
        </Text>
        <Text className="mt-4 text-base text-gray-500 text-center leading-6">
          The premium marketplace connecting students with trusted campus artisans for any service.
        </Text>

        <View className="mt-12 w-full gap-6">
          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20">
              <Sparkles size={24} color={colors.secondary} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">Discover Talent</Text>
              <Text className="text-sm text-gray-500">Find the best services right on your campus.</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
              <ShieldCheck size={24} color={colors.success} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">Secure & Trusted</Text>
              <Text className="text-sm text-gray-500">Verified artisans and transparent reviews.</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="w-full pb-8 pt-4">
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
