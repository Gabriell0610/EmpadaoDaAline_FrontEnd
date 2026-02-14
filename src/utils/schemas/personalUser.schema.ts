import { z } from 'zod';

export const personalUserDataSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  email: z.string().min(1, 'Campo obrigatório').email('Email inválido'),
  cellphone: z
    .string()
    .min(11, 'O telefone possui menos de 11 caracteres')
    .max(11, 'O telefone possui mais de 11 caracteres'),
});

export type PersonalUserData = z.infer<typeof personalUserDataSchema>;
