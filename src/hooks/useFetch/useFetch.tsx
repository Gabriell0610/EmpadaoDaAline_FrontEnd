'use client';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { useCallback, useContext } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestApi<TBody> {
  method: Method;
  url: string;
  body?: TBody;
  token?: string;
}

export function useFetch() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const call = useCallback(
    async <TBody, TResponse>({
      method,
      url,
      body,
      token,
    }: RequestApi<TBody>) => {
      try {
        setIsLoading(true);

        const request = await fetch('/api/server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method,
            url,
            body,
            token,
          }),
        });

        const response: ApiResponse<TResponse> = await request.json();
        console.log(response);
        return {
          ...response,
          success: response.success,
        };
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
    [setIsLoading],
  );

  return {
    call,
    isLoading,
  };
}
