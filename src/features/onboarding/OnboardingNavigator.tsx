import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './onboarding.types';
import { Step1PersonalInfoScreen } from './screens/Step1PersonalInfoScreen';
import { Step2BusinessInfoScreen } from './screens/Step2BusinessInfoScreen';
import { Step3CategoriesScreen } from './screens/Step3CategoriesScreen';
import { Step4SkillsScreen } from './screens/Step4SkillsScreen';
import { Step5ServicesScreen } from './screens/Step5ServicesScreen';
import { Step6AvailabilityScreen } from './screens/Step6AvailabilityScreen';
import { Step7PortfolioScreen } from './screens/Step7PortfolioScreen';
import { Step8VerificationScreen } from './screens/Step8VerificationScreen';
import { Step9ReviewScreen } from './screens/Step9ReviewScreen';
import { useOnboardingStore } from './store/onboarding.store';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const STEP_ROUTES: Record<number, keyof OnboardingStackParamList> = {
  1: 'OnboardingStep1',
  2: 'OnboardingStep2',
  3: 'OnboardingStep3',
  4: 'OnboardingStep4',
  5: 'OnboardingStep5',
  6: 'OnboardingStep6',
  7: 'OnboardingStep7',
  8: 'OnboardingStep8',
  9: 'OnboardingStep9',
};

export const OnboardingNavigator: React.FC = () => {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const initialRoute = STEP_ROUTES[currentStep] || 'OnboardingStep1';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="OnboardingStep1" component={Step1PersonalInfoScreen} />
      <Stack.Screen name="OnboardingStep2" component={Step2BusinessInfoScreen} />
      <Stack.Screen name="OnboardingStep3" component={Step3CategoriesScreen} />
      <Stack.Screen name="OnboardingStep4" component={Step4SkillsScreen} />
      <Stack.Screen name="OnboardingStep5" component={Step5ServicesScreen} />
      <Stack.Screen name="OnboardingStep6" component={Step6AvailabilityScreen} />
      <Stack.Screen name="OnboardingStep7" component={Step7PortfolioScreen} />
      <Stack.Screen name="OnboardingStep8" component={Step8VerificationScreen} />
      <Stack.Screen name="OnboardingStep9" component={Step9ReviewScreen} />
    </Stack.Navigator>
  );
};