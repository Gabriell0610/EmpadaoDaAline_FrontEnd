// REGEX
import { z } from 'zod';
export const cellphoneNumberRegex = /^(\d{2})(\d{5})(\d{4})$/;
export const cepRegex = /^(\d{5})(\d{3})$/;

export const passwordValidation = z
  .string()
  .min(1, 'Campo obrigatório')
  .min(8, 'A senha possui menos de 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[\W_]/, 'A senha deve conter pelo menos um caractere especial');

export const cepValidation = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length === 8, {
    message: 'CEP inválido',
  });

export const startAndEndTimeValidation = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:mm');
