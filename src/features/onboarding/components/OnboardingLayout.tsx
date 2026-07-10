import React from 'react';
import { View, Text } from 'react-native';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { StepIndicator } from './StepIndicator';
import { OnboardingStepId } from '@app-types/index';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: OnboardingStepId;
  onNext?: () => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
  nextLabel?: string;
  isNextLoading?: boolean;
  disableNext?: boolean;
  hideNext?: boolean;
  hideStepIndicator?: boolean;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  onNext,
  onBack,
  onSaveDraft,
  nextLabel = 'Continue',
  isNextLoading = false,
  disableNext = false,
  hideNext = false,
  hideStepIndicator = false,
}) => {
  return (
    <ScreenWrapper scrollable keyboardAvoiding contentClassName="pb-32">
      <View className="flex-row items-center justify-between py-4">
        <Text className="font-heading text-xl font-bold text-gray-900">
          Artisan Onboarding
        </Text>
        {onSaveDraft && (
          <Button
            label="Save Draft"
            variant="ghost"
            onPress={onSaveDraft}
            size="sm"
          />
        )}
      </View>

      {!hideStepIndicator && <StepIndicator currentStep={currentStep} />}

      <View className="flex-1">{children}</View>

      <View className="mt-6 flex-row gap-3">
        {onBack && (
          <View className="flex-1">
            <Button label="Back" variant="outline" onPress={onBack} size="lg" />
          </View>
        )}
        {!hideNext && onNext && (
          <View className="flex-1">
            <Button
              label={nextLabel}
              onPress={onNext}
              isLoading={isNextLoading}
              disabled={disableNext}
              size="lg"
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};