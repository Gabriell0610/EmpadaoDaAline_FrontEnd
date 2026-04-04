/* eslint-disable @typescript-eslint/no-explicit-any */
import { AUTH_REFRESH, AUTH_LOGOUT } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function refreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/server', {
        method: StatusHttp.POST,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          method: StatusHttp.POST,
          url: AUTH_REFRESH,
        }),
      });

      const data = await res.json();
      return data.success === true;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function forceLogout(router: AppRouterInstance) {
  await fetch('/api/server', {
    method: StatusHttp.POST,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      method: StatusHttp.POST,
      url: AUTH_LOGOUT,
    }),
  });

  router.push('/');
}
