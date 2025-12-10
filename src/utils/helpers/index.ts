import { ItemCarrinho } from '../types/cart.type';
import { cellphoneNumberRegex, cepRegex } from '../validators';

export const normalizeCurrency = (value: string | number) => {
  return `R$ ${value}`;
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
    'prisma',
  ];

  const isUnsafe = unsafePatterns.some((pattern) =>
    errorMessage.includes(pattern),
  );

  if (isUnsafe) {
    return 'Erro inesperado no servidor. Por favor, tente novamente mais tarde.';
  }

  return errorMessage;
};

export const normalizeCellphoneNumber = (cellphoneNumber: string) => {
  const digitsOnly = cellphoneNumber.replace(/\D/g, '');
  return digitsOnly.replace(cellphoneNumberRegex, '($1) $2-$3');
};

export const formatCep = (cep: string) => {
  return cep.replace(cepRegex, '$1-$2');
};

export const baseUrl = () => {
  const url = 'http://localhost:1338/api';
  if (!url) throw new Error('API base URL não definida!');
  return url;
};

export const formatDatePtBr = (date: Date | string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export function formartQuantityItem(data: ItemCarrinho) {
  const quantity = data.item.unidades
    ? Number(data.item.unidades) + data.quantidade - 1
    : data.quantidade;

  return quantity;
}

export const DEFAULTMESSAGEERROAPI =
  'Erro inesperado entre em contato com o suporte!';
