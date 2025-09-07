import { z } from 'zod';
import { passwordValidation } from '../validators';

const defaultSchema = z.object({
  email: z.string().min(1, 'Campo obrigatório').email('Email inválido'),
});

const sendEmailSchema = defaultSchema.extend({});

const validateTokenSchema = defaultSchema.extend({
  token: z
    .string()
    .min(1, 'Campo obrigatório')
    .max(6, 'O token só pode ter 6 dígitos'),
});

const resetPasswordSchema = z
  .object({
    newPassword: passwordValidation,
    samePassword: z.string().min(1, 'Campo obrigatório'),
  })
  .refine((data) => data.newPassword === data.samePassword, {
    message: 'As senhas devem ser iguais',
    path: ['samePassword'],
  });

export type sendEmailDto = z.infer<typeof sendEmailSchema>;
export type resetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type validateTokenDto = z.infer<typeof validateTokenSchema>;

export { sendEmailSchema, resetPasswordSchema, validateTokenSchema };
