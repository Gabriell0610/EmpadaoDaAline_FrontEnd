import z from 'zod';
import { startAndEndTimeValidation } from '../validators';

// Função para pegar a data de hoje em formato YYYY-MM-DD
function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Schema base
export const orderDetailsBaseSchema = z.object({
  schedulingDate: z
    .string()
    .nonempty('A data de agendamento é obrigatória')
    .transform((val) => val?.trim() || ''),

  idPaymentMethod: z
    .string()
    .nonempty('O método de pagamento é obrigatório')
    .transform((val) => val?.trim() || ''),

  startTime: z
    .string()
    .nonempty('O horário inicial é obrigatório')
    .transform((val) => val?.trim() || ''),

  endTime: z
    .string()
    .nonempty('O horário final é obrigatório')
    .transform((val) => val?.trim() || ''),

  observation: z.string().optional(),

  // Campos opcionais para Admin
  nameClient: z.string().optional(),

  cellphoneClient: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine(
      (val) => val === undefined || /^\d{11}$/.test(val),
      'Telefone deve conter 11 dígitos numéricos',
    ),
});

// Schema final com refinamentos
export const orderDetailsSchema = orderDetailsBaseSchema
  // Horário final maior que inicial
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true; // evita erro se algum estiver vazio
      return data.endTime >= data.startTime;
    },
    {
      message: 'O horário final deve ser maior que o inicial',
      path: ['endTime'],
    },
  )
  // Data de entrega não anterior a hoje
  .refine(
    (data) => {
      if (!data.schedulingDate) return true; // evita erro se estiver vazio
      return data.schedulingDate >= getTodayISO();
    },
    {
      message: 'A data de entrega não pode ser anterior a data de hoje',
      path: ['schedulingDate'],
    },
  )
  .refine(
    (data) => {
      if (!data.schedulingDate) return true;

      const hoje = getTodayISO();
      const agora = new Date();
      const horaAtual = agora.getHours();

      // Se a data escolhida for hoje e hora atual >= 12, bloqueia
      if (data.schedulingDate === hoje && horaAtual >= 12) {
        return false;
      }

      return true;
    },
    {
      message:
        'Não é possível pedir pronta entrega após as 12h. Agende para amanhã ou depois',
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
