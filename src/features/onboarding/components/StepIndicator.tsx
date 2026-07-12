import React from 'react';
import { Text, View } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';
import { OnboardingStepId } from '@app-types/index';
import { ONBOARDING_STEPS, STEP_TO_COMPLETED_KEY, COMPLETED_STEP_ORDER } from '../onboarding.types';
import { useOnboardingStore } from '../store/onboarding.store';

interface StepIndicatorProps {
  currentStep: OnboardingStepId;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const displaySteps = ONBOARDING_STEPS;
  const completedSteps = useOnboardingStore((s) => s.completedSteps);

  const isStepAccessible = (step: OnboardingStepId): boolean => {
    if (step === 1) return true;
    const prereqIdx = COMPLETED_STEP_ORDER.indexOf(STEP_TO_COMPLETED_KEY[(step - 1) as OnboardingStepId]);
    if (prereqIdx === -1) return true;
    return completedSteps.includes(STEP_TO_COMPLETED_KEY[(step - 1) as OnboardingStepId]);
  };

  const isStepCompleted = (step: OnboardingStepId): boolean => {
    if (step <= 1) return false;
    const key = STEP_TO_COMPLETED_KEY[step];
    if (!key) return false;
    return completedSteps.includes(key);
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between">
        {displaySteps.slice(0, 8).map((step, index) => {
          const stepNumber = step.id;
          const isCurrent = stepNumber === currentStep;
          const isLocked = !isStepAccessible(stepNumber);
          const isCompleted = isStepCompleted(stepNumber);
          const isLast = index === 7;

          return (
            <React.Fragment key={step.id}>
              <View className="items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isCompleted
                      ? 'bg-primary'
                      : isCurrent
                        ? 'border-2 border-primary bg-white'
                        : isLocked
                          ? 'bg-gray-100'
                          : 'bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} color="#ffffff" />
                  ) : isLocked ? (
                    <Lock size={14} color={colors.gray400} />
                  ) : (
                    <Text
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-primary' : 'text-gray-400'
                      }`}
                    >
                      {stepNumber}
                    </Text>
                  )}
                </View>
                <Text
                  className={`mt-1 text-[10px] ${
                    isCurrent
                      ? 'font-bold text-primary'
                      : isLocked
                        ? 'text-gray-300'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </Text>
              </View>
              {!isLast && (
                <View
                  className={`mx-1 h-[2px] flex-1 ${
                    isCompleted ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <Text className="mt-4 text-center text-sm text-gray-500">
        Step {currentStep} of {displaySteps.length}:{' '}
        {displaySteps.find((s) => s.id === currentStep)?.description || 'Review & Submit'}
      </Text>
    </View>
  );
};