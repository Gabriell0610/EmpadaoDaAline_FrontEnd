import z from 'zod';
import { startAndEndTimeValidation } from '../validators';

export const orderDetailsSchema = z.object({
  schedulingDate: z.string({
    required_error: 'A data de agendamento é obrigatória',
    invalid_type_error:
      'A data de agendamento deve ser uma string no formato ISO (DD-MM-YYYY)',
  }),
  idPaymentMethod: z.string(),
  deliveryTimeStart: startAndEndTimeValidation,
  deliveryTimeEnd: startAndEndTimeValidation,
});

export type orderDto = z.infer<typeof orderDetailsSchema>;
