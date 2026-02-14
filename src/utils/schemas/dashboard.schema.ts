import z from 'zod';

export const DashboardFilterByPeriod = z.object({
  startDate: z
    .string({
      invalid_type_error:
        'A data de agendamento deve ser uma string no formato ISO (DD-MM-YYYY)',
    })
    .optional(),
  endDate: z
    .string({
      invalid_type_error:
        'A data de agendamento deve ser uma string no formato ISO (DD-MM-YYYY)',
    })
    .optional(),
});

export type DashboardFilterByPeriodData = z.infer<
  typeof DashboardFilterByPeriod
>;
