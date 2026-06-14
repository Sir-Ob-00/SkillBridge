import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Bell, Lock, User, LogOut, ChevronRight, HelpCircle } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { colors } from '@shared/ui/colors';
import { useAuthStore } from '@store/auth.store';

// We type this loosely so it can be reused in any stack
type Props = NativeStackScreenProps<any, any>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  const SETTINGS_SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: <User size={20} color={colors.gray600} />, label: 'Personal Information' },
        { icon: <Lock size={20} color={colors.gray600} />, label: 'Security & Password' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={20} color={colors.gray600} />, label: 'Push Notifications' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle size={20} color={colors.gray600} />, label: 'Help Center' },
      ],
    },
  ];

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <View className="mb-4 flex-row items-center">
        <Pressable onPress={() => navigation.goBack()} className="mr-4 w-10 active:opacity-70">
          <ArrowLeft size={24} color={colors.gray800} />
        </Pressable>
        <Text className="font-heading text-2xl font-bold text-gray-900">
          Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {SETTINGS_SECTIONS.map((section, idx) => (
          <View key={idx} className="mb-6">
            <Text className="mb-3 ml-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              {section.title}
            </Text>
            <View className="overflow-hidden rounded-3xl border border-transparent bg-white shadow-sm shadow-gray-200">
              {section.items.map((item, itemIdx) => (
                <Pressable
                  key={itemIdx}
                  className={[
                    'flex-row items-center justify-between p-4 active:bg-gray-50',
                    itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : '',
                  ].join(' ')}
                >
                  <View className="flex-row items-center">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                      {item.icon}
                    </View>
                    <Text className="text-base font-semibold text-gray-900">{item.label}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.gray400} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable
          onPress={handleLogout}
          className="mt-4 flex-row items-center justify-center rounded-2xl bg-red-50 py-4 active:opacity-80"
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="ml-2 text-base font-bold text-red-600">Log Out</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
};
