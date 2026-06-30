import React, { useState } from 'react';
import { Alert, Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Mail, Lock, User as UserIcon, Phone, UserPlus } from 'lucide-react-native';
import { AuthStackParamList } from '../auth.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { colors } from '@shared/ui/colors';
import { useAuth } from '@hooks/useAuth';
import { validateEmail, validatePassword, validatePhone } from '@utils/validateEmail';
import { ROLE_LABELS } from '@constants/roles';
import { UserRole } from '@app-types/index';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const role: UserRole = route.params?.role ?? 'student';
  const { register, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    clearError();
    const errors: Record<string, string> = {};

    if (name.trim().length < 2) errors.name = 'Enter your full name.';
    if (!validateEmail(email)) errors.email = 'Enter a valid email address.';
    if (phone && !validatePhone(phone)) errors.phone = 'Enter a valid phone number.';
    if (!validatePassword(password)) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await register({ name, email, password, role, phone: phone || undefined });
    } catch {
      Alert.alert('Registration failed', 'Please try again.');
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding>
      <View className="mt-6 mb-10">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <UserPlus size={28} color={colors.primary} />
        </View>
        <Text className="font-heading text-4xl font-bold text-gray-900">
          Create account
        </Text>
        <Text className="mt-3 text-base text-gray-500">
          Joining as <Text className="font-bold text-primary">{ROLE_LABELS[role]}</Text>
        </Text>
      </View>

      <Input
        label="Full name"
        placeholder="Ama Owusu"
        value={name}
        onChangeText={setName}
        error={fieldErrors.name}
        leftIcon={<UserIcon size={18} color={colors.gray400} />}
      />

      <Input
        label="Email"
        placeholder="you@university.edu"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        leftIcon={<Mail size={18} color={colors.gray400} />}
      />

      <Input
        label="Phone (optional)"
        placeholder="0XX XXX XXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        error={fieldErrors.phone}
        leftIcon={<Phone size={18} color={colors.gray400} />}
      />

      <Input
        label="Password"
        placeholder="At least 8 characters"
        isPassword
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        leftIcon={<Lock size={18} color={colors.gray400} />}
      />

      <Input
        label="Confirm Password"
        placeholder="Re-enter your password"
        isPassword
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={fieldErrors.confirmPassword}
        leftIcon={<Lock size={18} color={colors.gray400} />}
      />

      {error ? (
        <Text className="mb-3 text-sm text-red-500">{error}</Text>
      ) : null}

      <Button
        label="Create Account"
        onPress={handleRegister}
        isLoading={isLoading}
        fullWidth
        size="lg"
      />

      <View className="mt-8 flex-row justify-center items-center">
        <Text className="text-base text-gray-500">Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login', { role })} className="active:opacity-70">
          <Text className="text-base font-bold text-primary">Sign in</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};
