import z from 'zod';

export const orderDetailsSchema = z.object({
  schedulingDate: z
    .string({
      required_error: 'A data de agendamento é obrigatória',
      invalid_type_error:
        'A data de agendamento deve ser uma string no formato ISO (DD-MM-YYYY)',
    })
    .nonempty('A data de agendamento é obrigatória'),
  idPaymentMethod: z.string().nonempty('O método de pagamento é obrigatório'),
  deliveryTimeStart: z.string().nonempty('O horário inicial é obrigatório'),
  deliveryTimeEnd: z.string().nonempty('O horário final é obrigatório'),
});

export const orderSchema = orderDetailsSchema.extend({
  idCart: z.string(),
  idUser: z.string(),
  idAddress: z.string(),
  shipping: z.number(),
});

export type OrderDto = z.infer<typeof orderSchema>;
export type orderDetailsDto = z.infer<typeof orderDetailsSchema>;
