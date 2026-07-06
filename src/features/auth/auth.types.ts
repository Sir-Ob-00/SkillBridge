import { UserRole } from '@app-types/index';

export type AuthStackParamList = {
  Onboarding: undefined;
  RoleSelect: undefined;
  Login: { role?: UserRole } | undefined;
  Register: { role?: UserRole } | undefined;
  ForgotPassword: undefined;
  CompleteProfile: undefined;
};
