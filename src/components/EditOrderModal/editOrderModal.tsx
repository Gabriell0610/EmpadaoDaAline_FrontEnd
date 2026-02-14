'use client';
import {
  OrderUpdateDto,
  updateOrderSchema,
} from '@/utils/schemas/order.schema';
import { DefaultForm } from '../DefaultForm/DefaultForm';
import { Modal } from '../Modal/ModalComponent';
import { InputField } from '../InputField/InputField';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { formatDate } from '@/utils/helpers';
import { ButtonDefault } from '../Button/Button';
import { PaymenMethodsInterface } from '@/utils/types/paymentMethods.type';
import { UseFormReturn } from 'react-hook-form';

export interface EditOrderModalInterface {
  content: ListOrderByClient;
  title: string;
  isLoading: boolean;
  isModalOpen: boolean;
  closeModal: () => void;
  role?: string;
  submit: (data: OrderUpdateDto) => void;
  description: string;
  paymentMethods: PaymenMethodsInterface[] | undefined;
}

export default function EditOrderModal({
  closeModal,
  content,
  isLoading,
  isModalOpen,
  title,
  submit,
  description,
  paymentMethods,
}: EditOrderModalInterface) {
  const handleSubmit = (
    data: OrderUpdateDto,
    methods: UseFormReturn<OrderUpdateDto>,
  ) => {
    const { dirtyFields } = methods.formState;
    const editedData = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        data[key as keyof OrderUpdateDto],
      ]),
    );

    if (Object.keys(editedData).length === 0) {
      return;
    }

    submit(editedData);
    closeModal();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title={title}>
      <DefaultForm
        schema={updateOrderSchema}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        defaultValues={
          content
            ? {
                schedulingDate: formatDate(content.dataAgendamento!),
                idPaymentMethod: content.metodoPagamento.id,
                startTime: content.horarioInicio ?? undefined,
                endTime: content.horarioFim ?? undefined,
                observation: content.observacao ?? undefined,
                shipping: content.frete ?? undefined,
              }
            : undefined
        }
      >
        <>
          <InputField
            label="Data de entrega"
            name="schedulingDate"
            type="date"
            disabled={isLoading}
          />
          <InputField
            label="Método de pagamento"
            name="idPaymentMethod"
            type="select"
            options={paymentMethods?.map((p) => ({
              label: p.nome,
              value: p.id,
            }))}
            disabled={isLoading}
          />
          <div className="flex gap-4">
            <InputField
              label="Horário Inicio"
              name="startTime"
              type="time"
              disabled={isLoading}
            />

            <InputField
              label="Horário Fim"
              name="endTime"
              type="time"
              disabled={isLoading}
            />
          </div>
          <InputField
            label="Observação"
            name="observation"
            type="text"
            disabled={isLoading}
          />
          <InputField
            label="Frete"
            name="shipping"
            type="text"
            maxLength={5}
            disabled={isLoading}
          />
        </>
        <ButtonDefault className="mt-3 w-full" type="submit" variant="primary">
          {description}
        </ButtonDefault>
      </DefaultForm>
    </Modal>
  );
}
