// REGEX
import { z } from 'zod';

export const passwordValidation = z
  .string()
  .min(1, 'Campo obrigatório')
  .min(8, 'A senha possui menos de 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[\W_]/, 'A senha deve conter pelo menos um caractere especial');

export const formatCellphoneNumber = /^(\d{2})(\d{5})(\d{4})$/;
