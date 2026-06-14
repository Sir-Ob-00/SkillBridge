import React from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Placeholder data-layer provider.
 *
 * The app currently uses Zustand stores + Axios directly (see src/store and
 * src/services/api). This provider exists as the seam for introducing a
 * caching/query layer (e.g. React Query / TanStack Query) later without
 * changing the app's provider tree.
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return <>{children}</>;
};
