import z from 'zod';

export const addressUserDataSchema = z.object({
  zipCode: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.string(),
});

export type addressUserData = z.infer<typeof addressUserDataSchema>;
