import { z } from 'zod';

export const itensSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  price: z.coerce.number().positive('Preço deve ser maior que zero'),
  description: z.string().optional(),
  image: z.string().optional(),
  size: z.string().nonempty('tamanho é obrigatório'),
  unitPrice: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce
      .number()
      .positive('Preço unitário deve ser maior que zero')
      .optional(),
  ),
});

export const editItensSchema = z.object({
  name: z.string().optional(),
  rice: z.coerce.number().positive('Preço deve ser maior que zero').optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  size: z.string().optional(),
  unitPrice: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce
      .number()
      .positive('Preço unitário deve ser maior que zero')
      .optional(),
  ),
});

export type ItensSchemaDto = z.infer<typeof itensSchema>;
export type EditItensSchemaDto = z.infer<typeof editItensSchema>;
