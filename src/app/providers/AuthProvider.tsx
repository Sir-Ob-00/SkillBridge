import React, { useEffect } from 'react';
import { useAuthStore } from '@store/auth.store';
import { Loader } from '@shared/components/Loader';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Bootstraps auth state from secure storage before rendering the app.
 * Shows a full-screen loader while restoring the session.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (isInitializing) {
    return <Loader fullScreen label="Loading SkillBridge..." />;
  }

  return <>{children}</>;
};
