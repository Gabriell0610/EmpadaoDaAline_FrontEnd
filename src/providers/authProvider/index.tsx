'use client';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { baseUrl } from '@/utils/helpers';
import { createContext, useContext, useEffect, useState } from 'react';

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
  role: AccessProfile;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const res = await fetch(`${baseUrl()}/api/auth/me`, {
        credentials: 'include',
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const json = await res.json();

      const user: AuthUser = {
        id: json.data.id,
        nome: json.data.nome,
        email: json.data.email,
        role: json.data.role,
      };

      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
