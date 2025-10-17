import z from 'zod';

export const addressUserDataSchema = z.object({
  zipCode: z.string().max(8, 'Campo suporta apenas 8 caracteres'),
  neighborhood: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.string(),
});

export type addressUserData = z.infer<typeof addressUserDataSchema>;
