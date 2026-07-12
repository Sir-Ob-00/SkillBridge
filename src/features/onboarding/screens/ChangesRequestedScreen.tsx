import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Edit3 } from 'lucide-react-native';
import { OnboardingFlowParamList } from '../onboarding.types';
import { StatusScreen } from '../components/StatusScreen';
import { colors } from '@shared/ui/colors';
import { useAuth } from '@hooks/useAuth';
import { onboardingApi } from '../services/onboarding.api';

type Props = NativeStackScreenProps<OnboardingFlowParamList, 'ChangesRequested'>;

export const ChangesRequestedScreen: React.FC<Props> = ({ navigation }) => {
  const { logout } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChanges();
  }, []);

  const loadChanges = async () => {
    try {
      const result = await onboardingApi.getOnboardingStatus();
      setNotes(result.reviewNotes || 'Please review your application and make the necessary updates.');
    } catch {
      setNotes('Please review your application and make the necessary updates.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StatusScreen
        icon={
          <View className="h-20 w-20 items-center justify-center rounded-full bg-warning/10">
            <Edit3 size={40} color={colors.warning} />
          </View>
        }
        title="Changes requested"
        subtitle="Loading..."
        message=""
      />
    );
  }

  return (
    <StatusScreen
      icon={
        <View className="h-20 w-20 items-center justify-center rounded-full bg-warning/10">
          <Edit3 size={40} color={colors.warning} />
        </View>
      }
      title="Changes requested"
      subtitle="A few updates needed"
      message={notes}
      actionLabel="Resume Application"
      onAction={() => navigation.navigate('OnboardingSteps')}
      secondaryActionLabel="Sign Out"
      onSecondaryAction={logout}
    />
  );
};