import React, { useState } from 'react';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';
import { SplashScreen } from '@features/auth/screens/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';
import { ArtisanNavigator } from './ArtisanNavigator';
import { Loader } from '@shared/components/Loader';

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  const [showSplash, setShowSplash] = useState(true);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
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
