import React from 'react';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';
import { ArtisanNavigator } from './ArtisanNavigator';
import { Loader } from '@shared/components/Loader';

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  if (!isAuthenticated) {
    return <AuthNavigator />;
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
