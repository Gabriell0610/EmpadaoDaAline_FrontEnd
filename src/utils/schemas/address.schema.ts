import z from 'zod';
import { cepValidation } from '../validators';

export const addressUserDataSchema = z.object({
  zipCode: cepValidation,
  neighborhood: z.string().nonempty('O bairro é obrigatório'),
  city: z.string().nonempty('A cidade é obrigatória'),
  street: z.string().nonempty('A rua é obrigatório'),
  number: z.string().nonempty('O número é obrigatório'),
  state: z
    .string()
    .nonempty('O Estado é obrigatório')
    .min(2, 'O estado deve ter no mínimo dois caracteres'),
  complement: z.string().nonempty('complemento é obrigatório'),
});

export const editAddressUserDataSchema = z.object({
  zipCode: cepValidation.optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  state: z
    .string()
    .min(2, 'O estado deve ter no mínimo dois caracteres')
    .optional(),
  complement: z.string().optional(),
});

export type AddressUserData = z.infer<typeof addressUserDataSchema>;
export type EditAddressUserData = z.infer<typeof editAddressUserDataSchema>;
