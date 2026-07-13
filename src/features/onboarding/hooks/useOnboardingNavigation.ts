import { useLayoutEffect, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { OnboardingStackParamList, STEP_ROUTES } from '../onboarding.types';

export function useEnsureStackHasAllSteps(
  navigation: Pick<NavigationProp<OnboardingStackParamList>, 'getState' | 'dispatch'>,
  currentScreenStep: number,
): void {
  const prevScreenRoute =
    currentScreenStep > 1 ? STEP_ROUTES[currentScreenStep - 1] : null;
  const initialized = useRef(false);

  useLayoutEffect(() => {
    if (!prevScreenRoute || initialized.current) return;
    initialized.current = true;

    const state = navigation.getState();
    if (!state) return;

    const hasPrev = state.routes.some((r) => r.name === prevScreenRoute);
    if (!hasPrev) {
      const routes = Array.from({ length: currentScreenStep }, (_, i) => ({
        name: STEP_ROUTES[i + 1],
      })) as { name: keyof OnboardingStackParamList }[];

      navigation.dispatch(
        CommonActions.reset({
          index: currentScreenStep - 1,
          routes,
        }),
      );
    }
  }, [navigation, prevScreenRoute, currentScreenStep]);
}
