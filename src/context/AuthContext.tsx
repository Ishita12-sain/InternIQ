import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { RoleType, User } from '../types/auth';
import {
  loginApi,
  getMeApi,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  removeStoredToken,
  removeStoredUser,
} from '../services/auth.service';

export interface LoginCredentials {
  email: string;
  password: string;
  role?: RoleType;
}

export interface AuthContextType {
  user: User | null;
  role: RoleType | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials | RoleType) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync session on mount via /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const savedToken = getStoredToken();
      if (!savedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const remoteUser = await getMeApi(savedToken);
        if (isMounted) {
          if (remoteUser) {
            setUser(remoteUser);
            setToken(savedToken);
          } else {
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.warn('Session verification with /api/auth/me failed:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const role: RoleType | null = user ? user.role : null;

  const login = async (credentials: LoginCredentials | RoleType): Promise<User> => {
    if (typeof credentials === 'string') {
      throw new Error('Please provide email and password to sign in.');
    }

    const { user: authenticatedUser, accessToken } = await loginApi({
      email: credentials.email,
      password: credentials.password,
    });

    setUser(authenticatedUser);
    setToken(accessToken);
    setStoredToken(accessToken);
    setStoredUser(authenticatedUser);

    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeStoredToken();
    removeStoredUser();
  };

  const refreshUser = async (): Promise<User | null> => {
    const currentToken = token || getStoredToken();
    if (!currentToken) return null;

    try {
      const refreshed = await getMeApi(currentToken);
      if (refreshed) {
        setUser(refreshed);
      }
      return refreshed;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
