import z from 'zod';

export const orderDetailsSchema = z.object({
  schedulingDate: z.string({
    required_error: 'A data de agendamento é obrigatória',
    invalid_type_error:
      'A data de agendamento deve ser uma string no formato ISO (DD-MM-YYYY)',
  }),
  idPaymentMethod: z.string(),
  deliveryTimeStart: z.string(),
  deliveryTimeEnd: z.string(),
});

export type orderDetailsDto = z.infer<typeof orderDetailsSchema>;
