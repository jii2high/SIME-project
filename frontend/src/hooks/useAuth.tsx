'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import api, { getCsrfCookie } from '@/lib/api';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  nisn?: string;
  kelas?: string;
  no_hp?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/user');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    await getCsrfCookie();
    await api.post('/login', { email, password });
    await fetchUser();
  };

  const register = async (data: RegisterData) => {
    await getCsrfCookie();
    await api.post('/register', data);
    await fetchUser();
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.some(r => user.roles.includes(r));
    }
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
