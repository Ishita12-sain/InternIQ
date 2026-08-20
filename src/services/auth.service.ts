import { API_URL } from '../config/api';
import type { RoleType, User } from '../types/auth';

const TOKEN_KEY = 'interniq_token';
const USER_KEY = 'interniq_active_user';

export interface BackendUser {
  id: string | number;
  name: string;
  email: string;
  role: string;
  department?: string;
  companyName?: string;
  avatar?: string;
}

export interface AuthSuccessResponse {
  success: boolean;
  user: BackendUser;
  accessToken: string;
}

export interface MeSuccessResponse {
  success: boolean;
  user: BackendUser;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Normalizes backend role format (e.g. 'STUDENT', 'COMPANY', 'FACULTY', 'TNP', 'ADMIN')
 * to frontend RoleType format ('student', 'company', 'faculty', 'tnp', 'admin').
 */
export const normalizeRole = (role: string): RoleType => {
  const clean = role.toLowerCase().replace(/[^a-z]/g, '');
  if (clean === 'student') return 'student';
  if (clean === 'company') return 'company';
  if (clean === 'faculty') return 'faculty';
  if (clean === 'tnp' || clean === 'tp') return 'tnp';
  if (clean === 'admin') return 'admin';
  return 'student';
};

/**
 * Maps frontend RoleType to backend uppercase role enum.
 */
export const toBackendRole = (role: RoleType): string => {
  switch (role) {
    case 'student':
      return 'STUDENT';
    case 'company':
      return 'COMPANY';
    case 'faculty':
      return 'FACULTY';
    case 'tnp':
      return 'TNP';
    case 'admin':
      return 'ADMIN';
    default:
      return 'STUDENT';
  }
};

/**
 * Maps backend user object to frontend sanitized User interface.
 */
export const sanitizeFrontendUser = (backendUser: BackendUser): User => {
  return {
    id: String(backendUser.id),
    name: backendUser.name,
    email: backendUser.email,
    role: normalizeRole(backendUser.role),
    department: backendUser.department,
    companyName: backendUser.companyName,
    avatar: backendUser.avatar,
  };
};

/**
 * Token management helpers
 */
export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.warn('Failed to save auth token to localStorage', err);
  }
};

export const removeStoredToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to remove auth token from localStorage', err);
  }
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to save user session to localStorage', err);
  }
};

export const removeStoredUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.warn('Failed to remove user session from localStorage', err);
  }
};

/**
 * Clean base API URL helper ensuring single `/api` prefix
 */
const getAuthEndpoint = (path: string): string => {
  const base = API_URL.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/api/${cleanPath}`;
};

/**
 * Authenticate against backend /api/auth/login
 */
export const loginApi = async (credentials: LoginDTO): Promise<{ user: User; accessToken: string }> => {
  const response = await fetch(getAuthEndpoint('auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    const message = data.message || (data.errors && data.errors[0]?.message) || 'Invalid email or password';
    throw new Error(message);
  }

  const normalizedUser = sanitizeFrontendUser(data.user);
  setStoredToken(data.accessToken);
  setStoredUser(normalizedUser);

  return {
    user: normalizedUser,
    accessToken: data.accessToken,
  };
};

/**
 * Register against backend /api/auth/register
 */
export const registerApi = async (dto: RegisterDTO): Promise<{ user: User; accessToken: string }> => {
  const response = await fetch(getAuthEndpoint('auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: dto.name.trim(),
      email: dto.email.trim(),
      password: dto.password,
      role: dto.role,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    const message = data.message || (data.errors && data.errors[0]?.message) || 'Registration failed';
    throw new Error(message);
  }

  const normalizedUser = sanitizeFrontendUser(data.user);
  setStoredToken(data.accessToken);
  setStoredUser(normalizedUser);

  return {
    user: normalizedUser,
    accessToken: data.accessToken,
  };
};

/**
 * Validate token and retrieve current user profile from /api/auth/me
 */
export const getMeApi = async (token?: string | null): Promise<User | null> => {
  const authToken = token || getStoredToken();
  if (!authToken) return null;

  const response = await fetch(getAuthEndpoint('auth/me'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      removeStoredToken();
      removeStoredUser();
    }
    return null;
  }

  const data = (await response.json().catch(() => ({}))) as MeSuccessResponse;
  if (!data.success || !data.user) {
    return null;
  }

  const normalizedUser = sanitizeFrontendUser(data.user);
  setStoredUser(normalizedUser);
  return normalizedUser;
};
