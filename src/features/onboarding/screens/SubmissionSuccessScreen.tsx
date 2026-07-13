import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ClipboardCheck, Clock } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';
import { useAuthStore } from '@store/auth.store';
import { SafeAreaWrapper } from '@shared/layout/SafeAreaWrapper';
import { Button } from '@shared/components';
import { onboardingApi } from '../services/onboarding.api';

export const SubmissionSuccessScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const [isChecking, setIsChecking] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await onboardingApi.getOnboardingStatus();
      if (result.status === 'ACTIVE') {
        setIsApproved(true);
        if (user) {
          setUser({ ...user, onboardingStatus: 'ACTIVE' });
        }
      }
    } catch {
      // ignore
    } finally {
      setIsChecking(false);
    }
  }, [user, setUser]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleGoToDashboard = async () => {
    if (!isApproved || isNavigating) return;
    setIsNavigating(true);
    try {
      const result = await onboardingApi.getOnboardingStatus();
      if (result.status === 'ACTIVE' && user) {
        setUser({ ...user, onboardingStatus: 'ACTIVE' });
      }
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaWrapper>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-success/10">
            {isApproved ? (
              <ClipboardCheck size={40} color={colors.success} />
            ) : (
              <Clock size={40} color={colors.warning} />
            )}
          </View>
        </View>

        <Text className="mb-2 text-center font-heading text-2xl font-bold text-gray-900">
          {isApproved ? 'Application Approved!' : 'Application Submitted'}
        </Text>

        <Text className="mb-4 text-center text-lg font-medium text-primary">
          {isApproved ? 'Welcome to SkillBridge' : 'Under Review'}
        </Text>

        <Text className="mb-8 text-center text-base leading-6 text-gray-500">
          {isApproved
            ? 'Your artisan application has been approved. You can now access your dashboard and start receiving bookings.'
            : 'Your application has been submitted and is currently under review. You will be approved within 24 - 72 hours. Come back later to access your dashboard.'}
        </Text>

        <Button
          label={isApproved ? 'Go to Dashboard' : 'Awaiting Approval...'}
          onPress={handleGoToDashboard}
          disabled={!isApproved}
          isLoading={isNavigating}
          fullWidth
          size="lg"
        />

        {!isApproved && (
          <View className="mt-3">
            <Button
              label={isChecking ? 'Checking...' : 'Check Status'}
              onPress={isChecking ? undefined : checkStatus}
              variant="outline"
              fullWidth
              size="lg"
            />
          </View>
        )}

        <View className="mt-3">
          <Button
            label="Sign Out"
            onPress={logout}
            variant="ghost"
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};
