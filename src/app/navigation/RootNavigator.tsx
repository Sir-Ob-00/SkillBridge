import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';
import { ArtisanNavigator } from './ArtisanNavigator';
import { Loader } from '@shared/components/Loader';

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const renderNavigator = () => {
    if (!isAuthenticated) {
      return <AuthNavigator />;
    }

    switch (role) {
      case 'student':
        return <StudentNavigator />;
      case 'artisan':
        return <ArtisanNavigator />;
      default:
        // Authenticated but role not yet resolved (e.g. cached session
        // missing role data) — show a loader rather than flashing auth UI.
        return <Loader fullScreen label="Setting things up..." />;
    }
  };

  return <NavigationContainer>{renderNavigator()}</NavigationContainer>;
};
