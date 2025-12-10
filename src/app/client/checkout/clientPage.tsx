/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import useClientCheckout from './functions';
import { TitleH1 } from '@/components/Titles/Titles';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import {
  orderDetailsDto,
  orderDetailsSchema,
} from '@/utils/schemas/order.schema';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { InputField } from '@/components/InputField/InputField';
import { ButtonDefault } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/stores/orderDetails-store';

export default function ClientCheckoutPage({ session }: ProfilePageProps) {
  const navigate = useRouter();

  const { paymentMethods, isLoading } = useClientCheckout({
    session,
  });

  const setOrder = useOrderStore((state) => state.setOrder);

  const handleDetailsOrder = (data: orderDetailsDto) => {
    setOrder(data);
    <LoadingComponent mode="fullScreen" />;
    navigate.push('/client/checkout/summary');
  };

  return (
    <main className="flex items-center justify-center">
      <article className="mb-5 md:w-2/4">
        <section>
          <TitleH1 className="mb-0">Detalhes do pedido</TitleH1>
          <p className="mb-3 text-text-secondary">
            Escolha a data de entrega, o método de pagamento e o melhor horário
            para o pedido ser entregue!
          </p>
          <DefaultForm
            schema={orderDetailsSchema}
            onSubmit={handleDetailsOrder}
            isLoading={isLoading}
          >
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
              placeholder="Selecione o método de pagamento"
              defaultValue=""
              options={paymentMethods?.map((p) => ({
                label: p.nome,
                value: p.id,
              }))}
              disabled={isLoading}
            />
            <div className="flex gap-4">
              <InputField
                label="Horário Inicio"
                name="deliveryTimeStart"
                type="time"
                disabled={isLoading}
              />

              <InputField
                label="Horário Fim"
                name="deliveryTimeEnd"
                type="time"
                disabled={isLoading}
              />
            </div>
            <ButtonDefault
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Continuar
            </ButtonDefault>
          </DefaultForm>
        </section>
      </article>
      {isLoading && <LoadingComponent mode="fullScreen" />}
    </main>
  );
}
