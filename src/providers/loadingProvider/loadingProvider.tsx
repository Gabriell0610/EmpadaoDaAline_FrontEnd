'use client';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import { LoadingProviderInterface } from '@/utils/types/providers/loadingProvider.type';
import { createContext, useState } from 'react';

export const LoadingContext = createContext({} as LoadingProviderInterface);

export const LoadingProvider = ({ children }: SomeChildrenInterface) => {
  const [isLoadingProvider, setIsLoadingProvider] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading: isLoadingProvider,
        setIsLoading: setIsLoadingProvider,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
