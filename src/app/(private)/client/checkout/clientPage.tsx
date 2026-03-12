/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
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
import { gerarHorarios } from '@/utils/helpers';
import { useAuth } from '@/providers/authProvider';
import toast from 'react-hot-toast';

export default function ClientCheckoutPage() {
  const { user } = useAuth();

  const navigate = useRouter();

  const { paymentMethods, isLoading } = useClientCheckout();

  const { itemsWithLoggedUser } = useCart();

  const setOrder = useOrderStore((state) => state.setOrder);

  const handleDetailsOrder = (data: OrderDetailsDto) => {
    setOrder(data);
    toast.success('Aguarde você será redirecionado...');
    navigate.push('/client/checkout/summary');
  };

  function disabeldButton() {
    if (
      !itemsWithLoggedUser ||
      itemsWithLoggedUser.carrinhoItens.length === 0
    ) {
      return true;
    }
    return false;
  }

  const horarios = gerarHorarios(11, 18, 30);

  return (
    <main className="flex items-center justify-center">
      <article className="">
        <div className="mb-2 flex cursor-pointer gap-1">
          <ArrowLeft onClick={() => navigate.push('/')} /> Voltar
        </div>
        <TitleH1 className="mb-0">Detalhes do pedido</TitleH1>
        <p className="mb-3 text-text-secondary">
          Escolha a data de entrega, o método de pagamento e o melhor horário
          para o pedido ser entregue (de preferência um horário que tenha alguém
          em casa)!
        </p>
        <DefaultForm
          schema={orderDetailsSchema}
          onSubmit={handleDetailsOrder}
          isLoading={isLoading}
        >
          {user?.role === AccessProfile.ADMIN && (
            <div className="flex flex-col gap-4 md:flex-row">
              <InputField
                label="Nome do cliente"
                name="nameClient"
                type="text"
                placeholder="João Silva"
                disabled={isLoading}
              />
              <InputField
                label="Telefone"
                name="cellphoneClient"
                type="number"
                placeholder="Ex: (21) 98665-3321"
                maxLength={11}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="flex flex-col gap-4 md:flex-row">
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
          </div>

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
            label="Observação (opcional)"
            name="observation"
            type="text"
            placeholder="Ex: Sem coentro"
            disabled={isLoading}
          />

          <ButtonDefault
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={disabeldButton()}
          >
            Continuar
          </ButtonDefault>
        </DefaultForm>
      </article>
      {isLoading && <LoadingComponent mode="fullScreen" />}
    </main>
  );
}
