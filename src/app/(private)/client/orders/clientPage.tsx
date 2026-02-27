'use client';
import CardOrder from '@/components/CardOrder/cardOrder';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { TitleH1 } from '@/components/Titles/Titles';
import { useClientOrder } from './functions';
import ImageEmptyCart from '../../../../../public/assets/empty_cart_doubt-2.png';
import EmptyContent from '@/components/EmptyContent/emptyContent';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { CheckCircle2, Clock3, ReceiptText } from 'lucide-react';

export default function ClientOrderPage() {
  const { isLoading, listOrder } = useClientOrder({});
  const totalOrders = listOrder?.length || 0;
  const activeOrders =
    listOrder?.filter((order) =>
      [StatusOrder.PREPARANDO].includes(order.status as StatusOrder),
    ).length || 0;
  const deliveredOrders =
    listOrder?.filter((order) => order.status === StatusOrder.ENTREGUE)
      .length || 0;

  return (
    <section className="mx-auto w-full max-w-6xl">
      <header className="relative overflow-hidden rounded-3xl border border-text-primary/10 bg-gradient-to-br from-green_details-greenFooter/30 via-neutral-white to-neutral-white px-5 py-6 shadow-sm sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-green_details-greenFluorescent/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 h-36 w-36 rounded-full bg-green_details-greenFooter/60 blur-2xl" />

        <div className="relative">
          <TitleH1 className="mb-2 flex items-center gap-2 text-2xl sm:text-3xl">
            <ReceiptText className="h-7 w-7 text-text-green" />
            Meus Pedidos
          </TitleH1>
          <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
            Acompanhe o histórico e o status dos seus pedidos em um só lugar.
            Clique em um card para ver os detalhes.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-text-primary/10 bg-neutral-white/90 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Total de pedidos
              </p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-xl border border-green_details-greenLight/20 bg-green_details-greenLight/5 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <Clock3 className="h-4 w-4 text-text-green" />
                Em andamento
              </p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {activeOrders}
              </p>
            </div>

            <div className="rounded-xl border border-text-primary/10 bg-neutral-white/90 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <CheckCircle2 className="h-4 w-4 text-text-green" />
                Entregues
              </p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {deliveredOrders}
              </p>
            </div>
          </div>
        </div>
      </header>

      {listOrder && listOrder.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-text-primary/10 bg-neutral-white p-4 shadow-sm sm:p-6">
          <p className="mb-4 text-sm text-text-secondary">
            Toque em um pedido para visualizar detalhes, acompanhar atualizações
            e gerenciar sua solicitação.
          </p>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listOrder.map((content, index) => (
              <CardOrder key={index} content={content} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-dashed border-text-primary/20 bg-neutral-white p-6 shadow-sm">
          <EmptyContent
            title="Você ainda não possui nenhum pedido!"
            description="Não perca tempo e peça seu delicioso lanche conosco"
            image={ImageEmptyCart}
            alt="carrinho de compras vazio"
          />
        </section>
      )}

      {isLoading && <LoadingComponent mode="fullScreen" />}
    </section>
  );
}
