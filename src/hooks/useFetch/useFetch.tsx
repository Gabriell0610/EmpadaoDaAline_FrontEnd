'use client';

import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestApi<TBody> {
  method: Method;
  url: string;
  body?: TBody;
}

export function useFetch() {
  const { setIsLoading, isLoading } = useContext(LoadingContext);
  const router = useRouter();

  const call = useCallback(
    async <TBody, TResponse>({
      method,
      url,
      body,
    }: RequestApi<TBody>): Promise<ApiResponse<TResponse>> => {
      setIsLoading(true);

      const doRequest = async () => {
        const req = await fetch('/api/server', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method,
            url,
            body,
          }),
        });

        return (await req.json()) as ApiResponse<TResponse>;
      };

      try {
        let response = await doRequest();

        // 👉 access_token expirou
        if (response.code === 401) {
          const refresh = await fetch('/api/server', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              method: 'POST',
              url: 'auth/refresh',
            }),
          });

          const refreshResponse = await refresh.json();

          if (!refresh.ok || refreshResponse.success === false) {
            // refresh falhou → logout forçado
            await fetch('/api/server', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                method: 'POST',
                url: 'auth/logout',
              }),
            });

            router.push('/login');

            return {
              success: false,
              code: 401,
              message: 'Sessão expirada',
              data: {} as TResponse,
            };
          }

          // 🔁 retry request original
          response = await doRequest();
        }

        return response;
      } catch (error) {
        console.error(error);
        return {
          message: 'Erro de conexão com o servidor',
          success: false,
          code: 500,
          data: {} as TResponse,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [router, setIsLoading],
  );

  return {
    call,
    isLoading,
  };
}
