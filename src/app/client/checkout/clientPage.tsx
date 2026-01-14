/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import useClientCheckout from './functions';
import { TitleH1 } from '@/components/Titles/Titles';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import {
  OrderDetailsDto,
  orderDetailsSchema,
} from '@/utils/schemas/order.schema';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { InputField } from '@/components/InputField/InputField';
import { ButtonDefault } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/stores/orderDetails-store';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { ArrowLeft } from 'lucide-react';
import { AccessProfile } from '@/constants/enums/AccessProfile';

export default function ClientCheckoutPage({ session }: ProfilePageProps) {
  const navigate = useRouter();

  const { paymentMethods, isLoading } = useClientCheckout({
    session,
  });

  const { itemsWithLoggedUser } = useCart();

  const setOrder = useOrderStore((state) => state.setOrder);

  const handleDetailsOrder = (data: OrderDetailsDto) => {
    console.log(data);
    setOrder(data);
    <LoadingComponent mode="fullScreen" />;
    navigate.push('/client/checkout/summary');
  };

  function gerarHorarios(inicio = 7, fim = 18, intervalo = 30) {
    const horarios: string[] = [];

    for (let h = inicio; h <= fim; h++) {
      for (let m = 0; m < 60; m += intervalo) {
        if (h === fim && m > 0) continue;

        horarios.push(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        );
      }
    }

    return horarios;
  }

  const horarios = gerarHorarios(7, 18, 30);

  return (
    <main className="flex items-center justify-center">
      <article className="">
        <div className="mb-2 flex cursor-pointer gap-1">
          <ArrowLeft onClick={() => navigate.push('/')} /> Voltar
        </div>
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
          <div className="flex flex-col gap-4 md:flex-row">
            <InputField
              label="Horário Inicio"
              name="startTime"
              type="select"
              options={[
                { label: 'Selecione um horário de entrega', value: '' },
                ...horarios.map((h) => ({
                  label: h,
                  value: h,
                })),
              ]}
              disabled={isLoading}
            />

            <InputField
              label="Horário Fim"
              name="endTime"
              type="select"
              options={[
                { label: 'Selecione um horário de entrega', value: '' },
                ...horarios.map((h) => ({
                  label: h,
                  value: h,
                })),
              ]}
              disabled={isLoading}
            />
          </div>
          <InputField
            label="Observação"
            name="observation"
            type="text"
            placeholder="Ex: Sem coentro"
            disabled={isLoading}
          />
          {session?.user.role === AccessProfile.ADMIN && (
            <div>
              <InputField
                label="Nome do cliente"
                name="clientName"
                type="text"
                placeholder="João Silva"
              />
              <InputField
                label="Telefone"
                name="cellphone"
                type="text"
                placeholder="Ex: (21) 98665-3321"
              />
            </div>
          )}

          <ButtonDefault
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={
              itemsWithLoggedUser &&
              itemsWithLoggedUser.carrinhoItens.length === 0
                ? true
                : false
            }
          >
            Continuar
          </ButtonDefault>
        </DefaultForm>
      </article>
      {isLoading && <LoadingComponent mode="fullScreen" />}
    </main>
  );
}
