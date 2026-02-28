/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { twMerge } from 'tailwind-merge';
import { ButtonDefault } from '@/components/Button/Button';
import {
  formartQuantityItem,
  formatDatePtBr,
  normalizeCurrency,
} from '@/utils/helpers';
import { DetailsPageProps } from '@/utils/types/generics/layout.type';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Package,
  MessageCircle,
  ShoppingCart,
  ArrowLeft,
  EditIcon,
} from 'lucide-react';

import { useClientOrder } from '@/app/(private)/client/orders/functions';
import { useRouter } from 'next/navigation';
import StatusOrderComponent from '@/components/StatusOrder/statusOrderComponent';
import { TitleH1 } from '@/components/Titles/Titles';
import { useState } from 'react';
import EditOrderModal from '@/components/EditOrderModal/editOrderModal';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import useClientCheckout from '../../../checkout/functions';

export default function ClientOrderDetailsPage({
  id,
  confirm,
}: DetailsPageProps) {
  const {
    handleCancelOrderByClient,
    editOrder,
    confirmOrder,
    contentOrderByClientId,
    isLoading,
  } = useClientOrder({
    id,
  });

  const { paymentMethods, isLoading: loadingClientCheckout } =
    useClientCheckout();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const status = contentOrderByClientId?.status;

  const isPreparing = status === StatusOrder.PREPARANDO;
  const isCanceled = status === StatusOrder.CANCELADO;
  const isConfirmed = status === StatusOrder.CONFIRMADO_CLIENTE;

  const navigate = useRouter();
  return (
    <main className="flex justify-center">
      <div className="w-full max-w-lg">
        <p
          className="class-container-icons-text cursor-pointer"
          onClick={() => navigate.push('/client')}
        >
          {' '}
          <ArrowLeft /> Voltar
        </p>
        <div className="mx-auto mt-8 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="flex items-center bg-gradient-to-r from-slate-800 to-slate-600 p-6 text-white">
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between">
                <TitleH1 className="mb-0 flex items-center gap-2 text-2xl font-bold text-white">
                  <ShoppingCart className="h-6 w-6" />
                  Pedido #{contentOrderByClientId?.numeroPedido}
                </TitleH1>

                <p
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() => openModal()}
                >
                  <EditIcon size={22} /> Editar
                </p>
              </div>

              <div className="mt-1">
                <StatusOrderComponent
                  content={contentOrderByClientId?.status}
                  description="Status Atual: "
                />
              </div>
            </div>
          </div>

          {/* Corpo */}
          <div className="space-y-6 p-6 text-gray-700">
            {/* Infos principais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-text-green" />
                <div>
                  <p className="text-sm text-gray-500">Data de agendamento</p>
                  <p className="font-medium">
                    {formatDatePtBr(
                      contentOrderByClientId?.dataAgendamento || '',
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-text-green" />
                <div>
                  <p className="text-sm text-gray-500">Horário de entrega</p>
                  <p className="font-medium">
                    {contentOrderByClientId?.horarioInicio} -{' '}
                    {contentOrderByClientId?.horarioFim}
                  </p>
                </div>
              </div>
            </div>

            {/* Pagamento */}
            <div className="flex items-start gap-2">
              <CreditCard className="h-5 w-5 text-text-green" />
              <div>
                <p className="text-sm text-gray-500">Meio de pagamento</p>
                <p className="font-medium">
                  {contentOrderByClientId?.metodoPagamento.nome}
                </p>
              </div>
            </div>

            {/* Observação */}
            <div className="flex items-start gap-2">
              <MessageCircle className="h-5 w-5 text-text-green" />
              <div>
                <p className="text-sm text-gray-500">Observação</p>
                <p className="font-medium">
                  {contentOrderByClientId?.observacao || 'Nenhuma observação'}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Itens */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-text-green" />
                <h2 className="font-semibold">Itens do pedido</h2>
              </div>

              <ul className="ml-2 list-inside list-disc text-gray-600">
                {contentOrderByClientId?.carrinho.carrinhoItens.map(
                  (item, index) => (
                    <li key={index}>
                      {formartQuantityItem(item)}x{' '}
                      {item.item?.itemDescription?.nome} - {item.item?.tamanho}
                    </li>
                  ),
                )}
              </ul>

              <p className="mt-4 text-lg font-semibold">
                Total:{' '}
                <span className="text-text-green">
                  {normalizeCurrency(contentOrderByClientId?.precoTotal || '')}
                </span>
              </p>
            </div>

            <hr className="border-gray-200" />

            {/* Endereço */}
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-text-green" />
              <div>
                <p className="text-sm text-gray-500">Entrega em</p>
                <p className="font-medium">
                  {contentOrderByClientId?.endereco.rua} -{' '}
                  {contentOrderByClientId?.endereco.numero} -{' '}
                  {contentOrderByClientId?.endereco.bairro} -{' '}
                  {contentOrderByClientId?.endereco.cidade}/
                  {contentOrderByClientId?.endereco.estado}{' '}
                  {contentOrderByClientId?.endereco.complemento}
                </p>
              </div>
            </div>
          </div>

          {!isPreparing && (
            <div className="flex justify-end gap-6 bg-gray-50 p-6">
              {!confirm && (
                <ButtonDefault
                  variant="fourth"
                  className={twMerge(
                    '!bg-red-500 text-white',
                    isCanceled ? 'opacity-75' : '',
                  )}
                  onClick={() =>
                    handleCancelOrderByClient(contentOrderByClientId?.id || '')
                  }
                  disabled={isCanceled}
                >
                  Cancelar Pedido
                </ButtonDefault>
              )}

              {confirm && (
                <ButtonDefault
                  variant="fourth"
                  className={twMerge(
                    '!bg-green-500 text-white',
                    isCanceled ? 'opacity-75' : isConfirmed ? 'opacity-75' : '',
                  )}
                  onClick={confirmOrder}
                  disabled={isCanceled || isConfirmed}
                >
                  Confirmar Pedido
                </ButtonDefault>
              )}
            </div>
          )}

          {isLoading && <LoadingComponent mode="fullScreen" />}
        </div>
      </div>
      {isModalOpen && (
        <EditOrderModal
          closeModal={closeModal}
          content={contentOrderByClientId!}
          isLoading={isLoading || loadingClientCheckout}
          paymentMethods={paymentMethods}
          isModalOpen={isModalOpen}
          submit={editOrder}
          title="Editar Pedido! "
          role={AccessProfile.CLIENT}
          description="Editar"
        />
      )}
    </main>
  );
}
