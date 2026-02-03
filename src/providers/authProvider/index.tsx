'use client';
import { USER_ME } from '@/constants';
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
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { call } = useFetch();

  useEffect(() => {
    (async () => {
      const res = await call<null, AuthUser>({
        method: StatusHttp.GET,
        url: USER_ME,
      });

      if (res?.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return null; // 🔒 trava o app inteiro
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: loading,
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
