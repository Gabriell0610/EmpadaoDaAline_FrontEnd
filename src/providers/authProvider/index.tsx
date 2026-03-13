'use client';
import { AUTH_LOGOUT, USER_ME } from '@/constants';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
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
  isLoading: boolean;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { call } = useFetch();

  const loadUser = async () => {
    try {
      const res = await call<null, AuthUser>({
        method: StatusHttp.GET,
        url: USER_ME,
      });

      if (res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    const handleRefresh = () => {
      loadUser();
    };

    window.addEventListener('auth:refresh', handleRefresh);

    return () => {
      window.removeEventListener('auth:refresh', handleRefresh);
    };
  }, []);

  async function logout() {
    await call({
      method: StatusHttp.POST,
      url: AUTH_LOGOUT,
      requiresAuth: true,
    });

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: loading,
        reloadUser: loadUser,
        logout,
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
