import { ItemSize } from '@/constants/enums/ItemSize';
import { ItemType } from '@/constants/enums/ItemType';
import { z } from 'zod';

export const ITEM_SIZES = [
  ItemSize.P,
  ItemSize.M,
  ItemSize.G,
  ItemSize.GG,
] as const;
export const ITEM_TYPES = [
  ItemType.EMPADAO,
  ItemType.PANQUECA,
  ItemType.ALMODENGA,
] as const;

const sizeSchema = z.preprocess(
  (val) =>
    typeof val === 'string' ? val.trim().toUpperCase() || undefined : undefined,

  z.enum(ITEM_SIZES, {
    errorMap: (issue) => {
      if (issue.code === 'invalid_type') {
        return {
          message: 'O tamanho é obrigatório',
        };
      }

      return {
        message: 'Tamanho inválido. Use apenas: P, M, G ou GG.',
      };
    },
  }),
);

export const itensSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  price: z.preprocess(
    (val) => (val === '' || val === null ? undefined : String(val)),
    z.string({ required_error: 'O preço é obrigatório' }),
  ),
  description: z
    .string({ required_error: 'A descrição é obrigatória' })
    .min(10, 'A descrição não pode ser muito pequena'),
  size: sizeSchema,
  image: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string({ required_error: 'A url da imagem é obrigatória' }),
  ),
  unitPrice: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce
      .number()
      .positive('Preço unitário deve ser maior que zero')
      .optional(),
  ),

  unity: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce.number().optional(),
  ),

  itemTypeId: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z
      .string({ required_error: 'Tipo de item é obrigatório' })
      .uuid('Tipo do item inválido'),
  ),

  itemDescriptionId: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string().uuid('Tipo do item inválido').optional(),
  ),
});

export const editItensSchema = z.object({
  name: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string().optional(),
  ),

  price: z.preprocess(
    (val) => (val === '' || val === null ? undefined : String(val)),
    z.string().optional(),
  ),

  description: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string().min(10, 'A descrição não pode ser muito pequena').optional(),
  ),
  image: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string().optional(),
  ),

  size: sizeSchema.optional(),

  unitPrice: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce.number().positive().optional(),
  ),

  unity: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce.number().optional(),
  ),

  itemTypeId: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string().uuid('Tipo do item inválido').optional(),
  ),
});

export type ItensSchemaDto = z.infer<typeof itensSchema>;
export type EditItensSchemaDto = z.infer<typeof editItensSchema>;
