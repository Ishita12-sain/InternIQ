import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { RoleType, User } from '../types/auth';
import { MOCK_USERS } from '../config/roles';

interface AuthContextType {
  user: User | null;
  role: RoleType | null;
  login: (role: RoleType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('interniq_active_user');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn('Failed to parse auth user from localStorage', err);
    }
    return {
      id: 'usr-default',
      name: MOCK_USERS.faculty.name,
      email: MOCK_USERS.faculty.email,
      role: 'faculty',
      department: MOCK_USERS.faculty.department,
    };
  });

  const role = user ? user.role : null;

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('interniq_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('interniq_active_user');
      }
    } catch (err) {
      console.warn('Failed to sync auth state to localStorage', err);
    }
  }, [user]);

  const login = (selectedRole: RoleType) => {
    const mock = MOCK_USERS[selectedRole];
    const newUser: User = {
      id: `usr-${selectedRole}`,
      name: mock.name,
      email: mock.email,
      role: selectedRole,
      department: mock.department,
      companyName: mock.companyName,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('interniq_active_user');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
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
