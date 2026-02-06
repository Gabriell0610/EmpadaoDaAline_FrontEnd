'use client';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { forceLogout, refreshToken } from '@/services/refreshToken';
import { StatusHttp } from '@/constants/enums/StautsHttp';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestApi<TBody> {
  method: Method;
  url: string;
  body?: TBody;
}

export function useFetch() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const router = useRouter();

  const call = useCallback(
    async <TBody, TResponse>(
      { method, url, body }: RequestApi<TBody>,
      retry = false,
    ): Promise<ApiResponse<TResponse>> => {
      try {
        setIsLoading(true);

        const request = await fetch('/api/server', {
          method: StatusHttp.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            method,
            url,
            body,
          }),
        });

        const response: ApiResponse<TResponse> = await request.json();
        console.log('response:', response.data);
        if (response.code === 401 && !retry) {
          const refreshed = await refreshToken();

          if (refreshed) {
            return call<TBody, TResponse>({ method, url, body }, true);
          }

          await forceLogout(router);
        }

        return response;
      } catch (error) {
        console.error(error);
        return {
          message: 'Erro inesperado aconteceu, entre em contato com suporte',
          success: false,
          code: 500,
          data: {} as TResponse,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, router],
  );

  return {
    call,
    isLoading,
  };
}
