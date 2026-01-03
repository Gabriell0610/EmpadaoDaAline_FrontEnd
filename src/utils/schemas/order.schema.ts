import z from 'zod';
import { startAndEndTimeValidation } from '../validators';

function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const orderDetailsBaseSchema = z.object({
  schedulingDate: z
    .string({
      required_error: 'A data de agendamento é obrigatória',
      invalid_type_error:
        'A data de agendamento deve ser uma string no formato ISO (DD-MM-YYYY)',
    })
    .nonempty('A data de agendamento é obrigatória'),
  idPaymentMethod: z.string().nonempty('O método de pagamento é obrigatório'),
  startTime: z.string().nonempty('O horário inicial é obrigatório'),
  endTime: z.string().nonempty('O horário final é obrigatório'),
  observation: z.string().optional(),
});

export const orderDetailsSchema = orderDetailsBaseSchema
  .refine((data) => data.endTime >= data.startTime, {
    message: 'O horário final deve ser maior que o inicial',
    path: ['endTime'],
  })
  .refine(
    (data) => {
      const hoje = getTodayISO();
      return data.schedulingDate >= hoje;
    },
    {
      message: 'A data de entrega não pode ser anterior a data de hoje',
      path: ['schedulingDate'],
    },
  );

export const orderSchema = orderDetailsBaseSchema.extend({
  idCart: z.string(),
  idUser: z.string(),
  idAddress: z.string(),
  shipping: z.string(),
});

export const updateOrderSchema = z.object({
  idPaymentMethod: z.string().optional(),
  schedulingDate: z.string().optional(),
  startTime: startAndEndTimeValidation.optional(),
  endTime: startAndEndTimeValidation.optional(),
  observation: z.string().optional(),
  shipping: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido')
    .optional(),
});

export type OrderDto = z.infer<typeof orderSchema>;
export type OrderDetailsDto = z.infer<typeof orderDetailsSchema>;
export type OrderUpdateDto = z.infer<typeof updateOrderSchema>;
