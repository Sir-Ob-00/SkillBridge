import React, { useState } from 'react';
import { Alert, Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import { AuthStackParamList } from '../auth.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { colors } from '@shared/ui/colors';
import { useAuth } from '@hooks/useAuth';
import { validateEmail } from '@utils/validateEmail';
import { ROLE_LABELS } from '@constants/roles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const role = route.params?.role;
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const handleLogin = async () => {
    clearError();

    if (!validateEmail(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmailError(undefined);

    if (password.length < 1) {
      Alert.alert('Missing password', 'Please enter your password.');
      return;
    }

    try {
      await login({ email, password });
    } catch {
      // error surfaced via store state
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding>
      <View className="mt-6 mb-10">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <LogIn size={28} color={colors.primary} />
        </View>
        <Text className="font-heading text-4xl font-bold text-gray-900">
          Welcome back
        </Text>
        {role ? (
          <Text className="mt-3 text-base text-gray-500">
            Signing in as <Text className="font-bold text-primary">{ROLE_LABELS[role]}</Text>
          </Text>
        ) : (
          <Text className="mt-3 text-base text-gray-500">
            Sign in to continue to SkillBridge.
          </Text>
        )}
      </View>

      <Input
        label="Email"
        placeholder="you@university.edu"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        leftIcon={<Mail size={18} color={colors.gray400} />}
      />

      <Input
        label="Password"
        placeholder="••••••••"
        isPassword
        value={password}
        onChangeText={setPassword}
        leftIcon={<Lock size={18} color={colors.gray400} />}
      />

      {error ? (
        <Text className="mb-3 text-sm text-red-500">{error}</Text>
      ) : null}

      <Pressable
        onPress={() => navigation.navigate('ForgotPassword')}
        className="mb-6 self-end"
      >
        <Text className="text-sm font-medium text-primary">
          Forgot password?
        </Text>
      </Pressable>

      <Button
        label="Sign In"
        onPress={handleLogin}
        isLoading={isLoading}
        fullWidth
        size="lg"
      />

      <View className="mt-8 flex-row justify-center items-center">
        <Text className="text-base text-gray-500">Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Register', { role })} className="active:opacity-70">
          <Text className="text-base font-bold text-primary">Sign up</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};
