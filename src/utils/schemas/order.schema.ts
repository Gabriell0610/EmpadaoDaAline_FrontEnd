import z from 'zod';

export const orderSchema = z.object({
  idUser: z.string(),
  idCart: z.string(),
  idAddress: z.string(),
  schedulingDate: z.string({
    required_error: 'A data de agendamento é obrigatória',
    invalid_type_error:
      'A data de agendamento deve ser uma string no formato ISO (DD-MM-YYYY)',
  }),
  idPaymentMethod: z.string(),
  deliveryTime: z.string(),
  shipping: z.number(),
  observation: z.string().optional(),
});

export type orderDto = z.infer<typeof orderSchema>;
