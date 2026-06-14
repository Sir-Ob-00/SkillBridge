import { useAuthStore } from '@store/auth.store';
import { UserRole } from '@types/index';

export const useRole = (): UserRole | null => {
  const role = useAuthStore((state) => state.user?.role ?? null);
  return role;
};

export const useHasRole = (role: UserRole): boolean => {
  const currentRole = useRole();
  return currentRole === role;
};

export const useIsArtisan = (): boolean => useHasRole('artisan');
export const useIsStudent = (): boolean => useHasRole('student');
