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

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: BackendUser;
  accessToken: string;
}

export interface MeResponse {
  success: boolean;
  user: BackendUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const normalizeRole = (role: string): RoleType => {
  const clean = role.toLowerCase().replace(/[^a-z]/g, '');
  if (clean === 'student') return 'student';
  if (clean === 'company') return 'company';
  if (clean === 'faculty') return 'faculty';
  if (clean === 'tnp' || clean === 'tp') return 'tnp';
  if (clean === 'admin') return 'admin';
  return 'student';
};

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
    console.warn('Failed to save token to localStorage:', err);
  }
};

export const removeStoredToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to remove token from localStorage:', err);
  }
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to save user to localStorage:', err);
  }
};

export const removeStoredUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.warn('Failed to remove user from localStorage:', err);
  }
};

const getEndpoint = (path: string): string => {
  const base = API_URL.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/api/${cleanPath}`;
};

/**
 * POST /api/auth/login
 */
export const loginApi = async (payload: LoginPayload): Promise<{ user: User; accessToken: string }> => {
  const response = await fetch(getEndpoint('auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
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
 * POST /api/auth/register
 */
export const registerApi = async (payload: RegisterPayload): Promise<{ user: User; accessToken: string }> => {
  const response = await fetch(getEndpoint('auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
      role: payload.role,
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
 * GET /api/auth/me
 */
export const getMeApi = async (token?: string | null): Promise<User | null> => {
  const authToken = token || getStoredToken();
  if (!authToken) return null;

  try {
    const response = await fetch(getEndpoint('auth/me'), {
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

    const data = (await response.json().catch(() => ({}))) as MeResponse;
    if (!data.success || !data.user) {
      return null;
    }

    const normalizedUser = sanitizeFrontendUser(data.user);
    setStoredUser(normalizedUser);
    return normalizedUser;
  } catch (err) {
    console.warn('Error fetching /api/auth/me:', err);
    return null;
  }
};
