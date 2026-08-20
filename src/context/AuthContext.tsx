import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { RoleType, User } from '../types/auth';
import { authenticateUser } from '../utils/authStorage';

interface AuthContextType {
  user: User | null;
  role: RoleType | null;
  login: (
    email: string,
    password: string,
    selectedRole: RoleType
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('interniq_active_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.warn('Failed to load saved user:', error);
    }
    return null;
  });

  const role = user?.role ?? null;

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('interniq_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('interniq_active_user');
      }
    } catch (error) {
      console.warn('Failed to save auth user:', error);
    }
  }, [user]);

  const login = async (
    email: string,
    password: string,
    selectedRole: RoleType
  ): Promise<void> => {
    // 1. Validate email is present
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      throw new Error('Email address is required');
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    // 2. Validate password is present
    if (!password) {
      throw new Error('Password is required');
    }

    // 3. Simulate realistic network delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 4. Authenticate password against database / stored accounts / default credentials
    // If the password is wrong, authenticateUser throws: Error('Invalid password')
    const authenticatedUser = await authenticateUser(trimmedEmail, password, selectedRole);

    // 5. Generate mock access token and save active session only on success
    const accessToken = `jwt_token_${authenticatedUser.role}_${Date.now().toString(36)}`;
    try {
      localStorage.setItem('interniq_access_token', accessToken);
      localStorage.setItem('interniq_active_user', JSON.stringify(authenticatedUser));
    } catch (error) {
      console.warn('Failed to persist login session:', error);
    }

    setUser(authenticatedUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('interniq_active_user');
    localStorage.removeItem('interniq_access_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};