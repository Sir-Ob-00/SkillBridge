import React from 'react';
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';
import { OnboardingStepId } from '@app-types/index';
import { ONBOARDING_STEPS } from '../onboarding.types';

interface StepIndicatorProps {
  currentStep: OnboardingStepId;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const displaySteps = ONBOARDING_STEPS;

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between">
        {displaySteps.map((step, index) => {
          const stepNumber = step.id;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLast = index === displaySteps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <View className="items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isCompleted
                      ? 'bg-primary'
                      : isCurrent
                        ? 'border-2 border-primary bg-white'
                        : 'bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} color="#ffffff" />
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
                    isCurrent ? 'font-bold text-primary' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </Text>
              </View>
              {!isLast && (
                <View
                  className={`mx-1 h-[2px] flex-1 ${
                    stepNumber < currentStep ? 'bg-primary' : 'bg-gray-200'
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