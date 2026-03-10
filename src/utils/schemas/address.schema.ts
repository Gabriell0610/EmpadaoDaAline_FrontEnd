import z from 'zod';
import { cepValidation } from '../validators';

export const addressUserDataSchema = z.object({
  zipCode: cepValidation,
  neighborhood: z
    .string({
      required_error: 'Bairro é obrigatório',
    })
    .nonempty('Bairro é obrigatório'),
  city: z
    .string({
      required_error: 'Cidade é obrigatório',
    })
    .nonempty('Cidade é obrigatóri é obrigatório'),
  street: z
    .string({
      required_error: 'Rua é obrigatório',
    })
    .nonempty('Rua é obrigatório'),
  number: z
    .string({
      required_error: 'O número é obrigatório',
    })
    .nonempty('O número é obrigatório'),

  complement: z
    .string({
      required_error: 'Complemento é obrigatório',
    })
    .nonempty('Complemento é obrigatório'),
  state: z
    .string({
      required_error: 'Estado é obrigatório',
    })
    .nonempty('Estado é obrigatório')
    .min(2, 'Estado deve ter no mínimo dois caracteres'),
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
