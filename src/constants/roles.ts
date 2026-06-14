import { UserRole } from '@types/index';

export const ROLES: Record<string, UserRole> = {
  STUDENT: 'student',
  ARTISAN: 'artisan',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  artisan: 'Artisan',
};
