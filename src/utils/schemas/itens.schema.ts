import { z } from 'zod';

export const itensSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  price: z.string().nonempty('preco é obrigatório'),
  description: z.string().optional(),
  image: z.string().nonempty('imagem é obrigatório'),
  size: z.string().nonempty('tamanho é obrigatório'),
});

export type ItensSchemaDto = z.infer<typeof itensSchema>;
