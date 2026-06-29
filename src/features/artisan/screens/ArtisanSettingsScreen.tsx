import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  User,
  Lock,
  Trash2,
  Wallet,
  Banknote,
  Receipt,
  Bell,
  BellOff,
  MessageCircle,
  DollarSign,
  ShieldCheck,
  Upload,
  LogOut,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react-native';
import { ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { useAuthStore } from '@store/auth.store';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<ArtisanStackParamList, 'Settings'>;

export const ArtisanSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handlePlaceholder = (feature: string) => {
    Alert.alert('Coming soon', `${feature} will be available in a future update.`);
  };

  const SECTION_HEADER = (title: string) => (
    <Text className="mb-3 ml-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
      {title}
    </Text>
  );

  const MenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    subtitle?: string;
    onPress?: () => void;
    right?: React.ReactNode;
    destructive?: boolean;
  }> = ({ icon, label, subtitle, onPress, right, destructive }) => (
    <Pressable
      onPress={onPress}
      className={[
        'flex-row items-center justify-between px-4 py-4 active:bg-gray-50',
        onPress ? '' : '',
      ].join(' ')}
    >
      <View className="flex-row items-center flex-1">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
          {icon}
        </View>
        <View className="flex-1">
          <Text
            className={[
              'text-base font-semibold',
              destructive ? 'text-red-600' : 'text-gray-900',
            ].join(' ')}
          >
            {label}
          </Text>
          {subtitle ? (
            <Text className="text-xs text-gray-500">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {right ?? (onPress ? <ChevronRight size={20} color={colors.gray400} /> : null)}
    </Pressable>
  );

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <View className="mb-4 flex-row items-center px-4 pt-2">
        <Pressable onPress={() => navigation.goBack()} className="mr-4 w-10 active:opacity-70">
          <ArrowLeft size={24} color={colors.gray800} />
        </Pressable>
        <Text className="font-heading text-2xl font-bold text-gray-900">
          Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-12">
        {/* Account */}
        {SECTION_HEADER('Account')}
        <View className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200">
          <MenuItem
            icon={<User size={20} color={colors.gray600} />}
            label="Personal Information"
            subtitle={user?.name ?? 'Set your name'}
            onPress={() => handlePlaceholder('Personal Information')}
          />
          <View className="mx-4 h-px bg-gray-100" />
          <MenuItem
            icon={<Lock size={20} color={colors.gray600} />}
            label="Security & Password"
            subtitle="Change your password"
            onPress={() => handlePlaceholder('Security & Password')}
          />
          <View className="mx-4 h-px bg-gray-100" />
          <MenuItem
            icon={<Trash2 size={20} color={colors.danger} />}
            label="Delete Account"
            destructive
            onPress={handleDeleteAccount}
          />
        </View>

        {/* Payments */}
        {SECTION_HEADER('Payments')}
        <View className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200">
          <MenuItem
            icon={<Wallet size={20} color={colors.gray600} />}
            label="Wallet Balance"
            subtitle="View your earnings and balance"
            onPress={() => handlePlaceholder('Wallet')}
          />
          <View className="mx-4 h-px bg-gray-100" />
          <MenuItem
            icon={<Banknote size={20} color={colors.gray600} />}
            label="Withdrawal Methods"
            subtitle="Bank account or mobile money"
            onPress={() => handlePlaceholder('Withdrawal Methods')}
          />
          <View className="mx-4 h-px bg-gray-100" />
          <MenuItem
            icon={<Receipt size={20} color={colors.gray600} />}
            label="Transaction History"
            subtitle="View all payouts"
            onPress={() => handlePlaceholder('Transaction History')}
          />
        </View>

        {/* Notifications */}
        {SECTION_HEADER('Notifications')}
        <View className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200">
          <MenuItem
            icon={pushEnabled ? <Bell size={20} color={colors.primary} /> : <BellOff size={20} color={colors.gray400} />}
            label="Push Notifications"
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: colors.gray200, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
          <View className="mx-4 h-px bg-gray-100" />
          <MenuItem
            icon={<MessageCircle size={20} color={colors.gray600} />}
            label="New Job Requests"
            subtitle="Get notified when students book you"
          />
          <View className="mx-4 h-px bg-gray-100" />
          <MenuItem
            icon={<DollarSign size={20} color={colors.gray600} />}
            label="Payment Alerts"
            subtitle="Payment confirmation and payouts"
          />
          <View className="mx-4 h-px bg-gray-100" />
          <MenuItem
            icon={smsEnabled ? <MessageCircle size={20} color={colors.primary} /> : <MessageCircle size={20} color={colors.gray400} />}
            label="SMS Notifications"
            right={
              <Switch
                value={smsEnabled}
                onValueChange={setSmsEnabled}
                trackColor={{ false: colors.gray200, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        {/* Verification Status */}
        {SECTION_HEADER('Verification Status')}
        <View className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200">
          <View className="p-4">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <BadgeCheck size={24} color={colors.success} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {user?.isVerified ? 'Verified Artisan' : 'Not Verified'}
                </Text>
                <Text className="text-xs text-gray-500">
                  {user?.isVerified
                    ? 'Your identity has been confirmed'
                    : 'Verify your account to build trust'}
                </Text>
              </View>
            </View>

            {!user?.isVerified ? (
              <>
                <View className="mb-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <View className="h-full w-1/3 rounded-full bg-primary" />
                </View>
                <Text className="mb-3 text-xs text-gray-500">
                  Verification in progress. Upload your ID document to complete verification.
                </Text>
                <Button
                  label="Upload ID Document"
                  variant="outline"
                  size="sm"
                  leftIcon={<Upload size={16} color={colors.primary} />}
                  onPress={() => handlePlaceholder('Document Upload')}
                  fullWidth
                />
              </>
            ) : null}
          </View>
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center rounded-2xl bg-red-50 py-4 active:opacity-80"
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="ml-2 text-base font-bold text-red-600">Sign Out</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
};
