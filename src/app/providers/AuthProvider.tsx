import React, { useEffect } from 'react';
import { useAuthStore } from '@store/auth.store';
import { useNotificationsStore } from '@modules/notifications/notifications.store';
import { loadNotifications } from '@modules/notifications/notifications.storage';
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
  const hydrate = useNotificationsStore((state) => state.hydrate);

  useEffect(() => {
    void initialize();
    void loadNotifications().then(hydrate);
  }, [initialize, hydrate]);

  if (isInitializing) {
    return <Loader fullScreen label="Loading SkillBridge..." />;
  }

  return <>{children}</>;
};
