'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { createSystem, defaultConfig } from '@chakra-ui/react';

export const chakraSystem = createSystem(defaultConfig);

export function Chakra({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>;
}
