import React, { useEffect, useState } from 'react';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';
import { userService } from '@services/user.service';
import { SplashScreen } from '@features/auth/screens/SplashScreen';
import { CompleteProfileScreen } from '@features/auth/screens/CompleteProfileScreen';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';
import { ArtisanNavigator } from './ArtisanNavigator';
import { ArtisanOnboardingRouter } from '@features/onboarding/ArtisanOnboardingRouter';
import { Loader } from '@shared/components/Loader';

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const role = user?.role;
  const onboardingStatus = user?.onboardingStatus;
  const [showSplash, setShowSplash] = useState(true);
  const [isRefreshingUser, setIsRefreshingUser] = useState(() => isAuthenticated && !!user);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsRefreshingUser(true);
      userService.getMe()
        .then((freshUser) => {
          setUser(freshUser);
        })
        .catch(() => {
          // Use cached user if fetch fails
        })
        .finally(() => setIsRefreshingUser(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (role === 'artisan' && !user?.phone) {
    return <CompleteProfileScreen />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isRefreshingUser) {
    return <Loader fullScreen label="Loading your profile..." />;
  }

  if (role === 'artisan' && onboardingStatus !== 'ACTIVE') {
    return <ArtisanOnboardingRouter onboardingStatus={onboardingStatus || 'PENDING_PROFILE'} />;
  }

  switch (role) {
    case 'student':
      return <StudentNavigator />;
    case 'artisan':
      return <ArtisanNavigator />;
    default:
      return <Loader fullScreen label="Setting things up..." />;
  }
};