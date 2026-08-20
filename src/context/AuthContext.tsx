import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { RoleType, User } from '../types/auth';
import { MOCK_USERS } from '../config/roles';

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

    // 2. Validate password is at least 6 characters
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // 3. Simulate short loading delay (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    // 4. Extract display name from email (e.g. dishaubale90 -> Disha Ubale or Disha Ubale from email prefix)
    const emailNamePart = trimmedEmail.split('@')[0].replace(/[0-9]/g, '').replace(/[\._]/g, ' ');
    const formattedName = emailNamePart
      ? emailNamePart
          .split(' ')
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : `${selectedRole.toUpperCase()} User`;

    const roleMock = MOCK_USERS[selectedRole];
    const newUser: User = {
      id: `usr-${selectedRole}-${Date.now().toString(36)}`,
      name: formattedName || roleMock?.name || `${selectedRole.toUpperCase()} User`,
      email: trimmedEmail,
      role: selectedRole,
      department: roleMock?.department || 'Computer Engineering',
      companyName: roleMock?.companyName,
    };

    // 5. Save user to state & localStorage
    setUser(newUser);
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