import { WITHOUTCONTENT } from '@/constants';
import { ItemCarrinhoInterface } from '../types/cart.type';
import { ItemInCartItens } from '../types/orderClient';
import { cellphoneNumberRegex, cepRegex } from '../validators';

export const normalizeCurrency = (value: string | number) => {
  return `R$ ${value}`;
};

export const handleMessageWhenObservationIsNull = (
  observation: string | null | undefined,
) => {
  if (observation == null || observation === undefined) {
    return 'Sem Observação';
  }

  return observation;
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

export const normalizeCellphoneNumber = (cellphoneNumber: string | null) => {
  if (!cellphoneNumber) {
    return;
  }
  const digitsOnly = cellphoneNumber.replace(/\D/g, '');
  return digitsOnly.replace(cellphoneNumberRegex, '($1) $2-$3');
};

export const formatCep = (cep: string) => {
  return cep.replace(cepRegex, '$1-$2');
};

export const baseUrl = () => {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  if (!url) throw new Error('API base URL não definida!');
  return url;
};

export const formatDatePtBr = (date?: string | Date) => {
  if (!date) return WITHOUTCONTENT;

  if (date instanceof Date) {
    return date.toLocaleDateString('pt-BR');
  }

  // Remove tudo após o T (UTC)
  const [year, month, day] = date.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

export function formatDate(date: Date) {
  return new Date(date).toISOString().split('T')[0];
}

export function formartQuantityItem(
  data: ItemInCartItens | ItemCarrinhoInterface,
) {
  const quantity = data.item.unidades
    ? Number(data.item.unidades) + data.quantidade - 1
    : data.quantidade;

  return quantity;
}

export const DEFAULTMESSAGEERROAPI =
  'Erro inesperado entre em contato com o suporte!';

export function gerarHorarios(inicio = 7, fim = 18, intervalo = 30) {
  const horarios: string[] = [];

  for (let h = inicio; h <= fim; h++) {
    for (let m = 0; m < 60; m += intervalo) {
      if (h === fim && m > 0) continue;

      horarios.push(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      );
    }
  }

  return horarios;
}
