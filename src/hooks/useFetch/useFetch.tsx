'use client';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { baseUrl } from '@/utils/helpers';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { useContext } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestApi<TBody> {
  method: Method;
  url: string;
  body?: TBody;
  token?: string;
}

export function useFetch() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  async function call<TBody, TResponse>({
    method,
    url,
    body,
    token,
  }: RequestApi<TBody>) {
    try {
      setIsLoading(true);
      const request = await fetch(`${baseUrl()}/${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const response: ApiResponse<TResponse> = await request.json();

      if (request.status >= 400) {
        return { ...response, success: false };
      }
      return { ...response, success: true };
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
  }

  return {
    call,
    isLoading,
  };
}
