export enum UserRole {
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  FACULTY = 'FACULTY',
  TNP = 'TNP',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  accessToken: string;
}
