'use client';

import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export const AuthProvider = ({ children }: SomeChildrenInterface) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user.refreshTokenExpired) {
      console.warn('🔒 Sessão expirada — deslogando usuário...');
      signOut({ callbackUrl: '/login' });
    }
  }, [session, status]);

  return <>{children}</>;
};
