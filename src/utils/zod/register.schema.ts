import { z } from 'zod';
import { passwordValidation } from '../validators/';

export const registerSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  email: z.string().min(1, 'Campo obrigatório').email('Email inválido'),
  password: passwordValidation,
  cellphone: z
    .string()
    .min(11, 'O telefone possui menos de 11 caracteres')
    .max(11, 'O telefone possui mais de 11 caracteres'),
});

export type RegisterData = z.infer<typeof registerSchema>;
