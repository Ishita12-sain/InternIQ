export type RoleType = 'student' | 'company' | 'faculty' | 'tnp' | 'admin';

export interface UserRoleOption {
  id: RoleType;
  label: string;
  shortLabel: string;
  iconName: string;
  description: string;
  accentColor: string;
  badge: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  department?: string;
  companyName?: string;
  designation?: string;
  employeeId?: string;
  phone?: string;
  avatar?: string;
}

export interface LoginFormData {
  email: string;
  password?: string;
  role: RoleType;
  rememberMe: boolean;
}
