'use client';

import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Package,
  MessageCircle,
  ShoppingCart,
  EditIcon,
} from 'lucide-react';

import StatusOrderComponent from '@/components/StatusOrder/statusOrderComponent';
import {
  normalizeCurrency,
  formatDatePtBr,
  handleMessageWhenObservationIsNull,
} from '@/utils/helpers';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { ButtonDefault } from '@/components/Button/Button';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import EditOrderModal from '@/components/EditOrderModal/editOrderModal';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import React, { useState } from 'react';
import { useAdminRequest } from '../../functions';
import { TitleH2, TitleH3 } from '@/components/Titles/Titles';
import { twMerge } from 'tailwind-merge';
import useClientCheckout from '@/app/(private)/client/checkout/functions';
import { DetailsPageProps } from '@/utils/types/generics/layout.type';

export default function AdminOrderDetailsPage({ id }: DetailsPageProps) {
  const { paymentMethods, isLoading: loadingClientCheckout } =
    useClientCheckout();

  const {
    updateStatusOrder,
    adminEditOrder,
    isLoading,
    contentOrderByClientId,
  } = useAdminRequest({
    id,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) return <LoadingComponent mode="fullScreen" />;

  function createWppLink() {
    const replaceCellphone = contentOrderByClientId?.usuario.telefone.replace(
      /\D/g,
      '',
    );
    const message = encodeURIComponent(
      `Olá, confirme seu pedido de amanhã às ${contentOrderByClientId?.horarioInicio} - ${contentOrderByClientId?.horarioFim} Clique no link para confirmar. Caso não confirme daremos como cancelado o pedido!! Desde já agradeço a compreensão:http://localhost:3000/client/orders/${contentOrderByClientId?.id}/confirm`,
    );

    return `https://wa.me/55${replaceCellphone}?text=${message}`;
  }

  return (
    <main className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-6 w-6 text-text-green" />
          <TitleH2>Pedido #{contentOrderByClientId?.numeroPedido}</TitleH2>
        </div>

        <div className="flex items-center gap-4">
          <StatusOrderComponent
            content={contentOrderByClientId?.status}
            description="Status Atual: "
          />

          <ButtonDefault
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => openModal()}
          >
            <EditIcon size={18} />
            Editar
          </ButtonDefault>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Detalhes */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="space-y-6 text-text-secondary">
            {/* Datas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<Calendar />}
                label="Data de agendamento"
                value={formatDatePtBr(
                  contentOrderByClientId?.dataAgendamento || '',
                )}
              />
              <InfoItem
                icon={<Clock />}
                label="Horário"
                value={`${contentOrderByClientId?.horarioInicio} - ${contentOrderByClientId?.horarioFim}`}
              />
            </div>

            {/* Pagamento */}
            <InfoItem
              icon={<CreditCard />}
              label="Pagamento"
              value={contentOrderByClientId?.metodoPagamento.nome}
            />

            {/* Observação */}
            <InfoItem
              icon={<MessageCircle />}
              label="Observação"
              value={handleMessageWhenObservationIsNull(
                contentOrderByClientId?.observacao,
              )}
            />

            <hr />

            {/* Itens */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-text-green" />
                <h2 className="font-semibold text-text-primary">
                  Itens do pedido
                </h2>
              </div>

              <ul className="ml-4 list-disc space-y-1 text-sm">
                {contentOrderByClientId?.carrinho.carrinhoItens.map(
                  (item, index) => (
                    <li key={index}>
                      {item.quantidade}x {item.item?.itemDescription?.nome}
                    </li>
                  ),
                )}
              </ul>

              <p className="mt-4 text-right text-lg font-semibold text-text-primary">
                Total:{' '}
                <span className="text-text-green">
                  {normalizeCurrency(contentOrderByClientId?.precoTotal || '')}
                </span>
              </p>
              <div>
                <p className="text-right text-sm font-semibold text-text-secondary">
                  frete: {contentOrderByClientId?.frete}
                </p>
              </div>
            </div>

            <hr />

            {/* Endereço */}
            <InfoItem
              icon={<MapPin />}
              label="Endereço de entrega"
              value={`${contentOrderByClientId?.endereco.rua}, ${contentOrderByClientId?.endereco.numero} - ${contentOrderByClientId?.endereco.bairro} - ${contentOrderByClientId?.endereco.cidade}/${contentOrderByClientId?.endereco.estado}`}
            />
          </div>
        </section>

        {/* Ações do Admin */}
        <aside className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Ações do administrador
          </h3>

          <div className="space-y-3">
            {Object.values(StatusOrder).map((status) => (
              <ButtonDefault
                key={status}
                variant="third"
                className={twMerge(
                  'w-full justify-start',
                  status === StatusOrder.PREPARANDO
                    ? 'border-details-inProgress text-details-inProgress opacity-100 hover:bg-details-inProgress'
                    : status === StatusOrder.CANCELADO
                      ? 'border-details-canceled text-details-canceled hover:bg-details-canceled'
                      : status === StatusOrder.ENTREGUE
                        ? 'border-details-delivered text-details-delivered hover:bg-details-delivered'
                        : status === StatusOrder.PENDENTE
                          ? 'border-details-pending text-details-pending hover:bg-details-pending'
                          : status === StatusOrder.ACEITO
                            ? 'border-green_details-greenLight text-green_details-greenLight hover:bg-green_details-greenLight'
                            : '',
                )}
                disabled={contentOrderByClientId?.status === status}
                onClick={() =>
                  updateStatusOrder(contentOrderByClientId!.id, {
                    status: status,
                  })
                }
              >
                Marcar como {status}
              </ButtonDefault>
            ))}
          </div>
        </aside>
      </div>
      {isModalOpen && (
        <EditOrderModal
          closeModal={closeModal}
          content={contentOrderByClientId!}
          paymentMethods={paymentMethods}
          isLoading={isLoading || loadingClientCheckout}
          isModalOpen={isModalOpen}
          submit={adminEditOrder}
          title="Editar Pedido! "
          role={AccessProfile.ADMIN}
          description="Editar"
        />
      )}

      <div className="mt-5">
        <TitleH3>Envie mensagem para o cliente para confirmar o pedido</TitleH3>
        <ButtonDefault variant="link" href={createWppLink()}>
          Enviar Mensagem
        </ButtonDefault>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-text-green">{icon}</span>
      <div>
        <p className="text-sm text-text-placeholder">{label}</p>
        <p className="font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );
}
