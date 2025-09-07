'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export function SessionWatcher() {
  const { status, update } = useSession();
  const pathname = usePathname();
  const hasHandledSession = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (hasHandledSession.current) return;

    async function checkSession() {
      const newSession = await update();
      const tokenVazio = newSession?.user?.accessToken === '';
      const refreshExpired = newSession?.user?.refreshTokenExpired;

      if (tokenVazio || refreshExpired) {
        hasHandledSession.current = true;
        toast.error('Sessão expirada. Faça login novamente.');
        signOut({ callbackUrl: '/login' });
      }
    }

    checkSession();
  }, [status, pathname]);

  return null;
}
