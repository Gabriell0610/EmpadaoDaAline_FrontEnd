export const normalizeCurrency = (value: string) => {
  return `R$${value}`;
};

// utils/helpers.ts
export const getSafeErrorMessage = (errorMessage?: string): string => {
  if (!errorMessage) return 'Ocorreu um erro. Tente novamente mais tarde.';

  // Lista de mensagens que não devem ser mostradas diretamente
  const unsafePatterns = [
    'PrismaClientKnownRequestError',
    'Stacktrace',
    'Unexpected token',
    'ECONNREFUSED',
  ];

  const isUnsafe = unsafePatterns.some((pattern) =>
    errorMessage.includes(pattern),
  );

  if (isUnsafe) {
    return 'Erro inesperado no servidor. Por favor, tente novamente mais tarde.';
  }

  return errorMessage;
};

export const baseUrl = () => {
  const url = 'http://localhost:1338/api';
  if (!url) throw new Error('API base URL não definida!');
  return url;
};

export const DEFAULTMESSAGEERROAPI =
  'Erro inesperado entre em contato com o suporte!';
