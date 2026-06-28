import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Scissors, GraduationCap, Sparkles } from 'lucide-react-native';
import { AuthStackParamList } from '../auth.types';
import { ScreenWrapper } from '@shared/layout';
import { colors } from '@shared/ui/colors';
import { UserRole } from '@app-types/index';

type Props = NativeStackScreenProps<AuthStackParamList, 'RoleSelect'>;

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'student',
    title: "I'm a Student",
    description: 'Find and book trusted campus artisans for any service.',
    icon: <GraduationCap size={28} color={colors.primary} />,
  },
  {
    role: 'artisan',
    title: "I'm an Artisan",
    description: 'Offer your services and manage bookings from students.',
    icon: <Scissors size={28} color={colors.primary} />,
  },
];

export const RoleSelectScreen: React.FC<Props> = ({ navigation }) => {
  const handleSelect = (role: UserRole) => {
    navigation.navigate('Login', { role });
  };

  return (
    <ScreenWrapper scrollable>
      <View className="mt-8 mb-10 items-center">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
          <Sparkles size={36} color={colors.primary} />
        </View>
        <Text className="font-heading text-4xl font-bold text-gray-900 text-center">
          SkillBridge
        </Text>
        <Text className="mt-3 text-base text-gray-500 text-center px-4">
          Choose how you'd like to use the platform.
        </Text>
      </View>

      <View className="gap-4">
        {ROLE_OPTIONS.map((option) => (
          <Pressable
            key={option.role}
            onPress={() => handleSelect(option.role)}
            className="flex-row items-center rounded-3xl border border-transparent bg-white p-5 shadow-sm shadow-gray-200 active:scale-[0.98] active:opacity-90"
          >
            <View className="mr-5 h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              {option.icon}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {option.title}
              </Text>
              <Text className="mt-1.5 text-sm text-gray-500 leading-5">
                {option.description}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScreenWrapper>
  );
};
