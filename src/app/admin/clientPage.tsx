'use client';
import { TitleH3, TitleH4 } from '@/components/Titles/Titles';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { useAdminRequest } from './functions';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import StatusOrderComponent from '@/components/StatusOrder/statusOrderComponent';
import {
  formatDatePtBr,
  normalizeCellphoneNumber,
  normalizeCurrency,
} from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { ButtonDefault } from '@/components/Button/Button';

export default function DashboardClientPage({ session }: ProfilePageProps) {
  const {
    isLoading,
    orders,
    page,
    search,
    status,
    updateStatusOrder,
    setPage,
    setSearch,
    setStatus,
  } = useAdminRequest({ session });
  const navigate = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mr-5 mt-3 flex justify-between">
        <TitleH3>Total de Pedidos: {orders?.totalItems}</TitleH3>
        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Buscar por nome, email..."
            className="rounded-md border px-2 py-2 text-sm"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            value={status ?? ''}
            onChange={(e) => {
              setPage(1);
              setStatus((e.target.value as StatusOrder) || undefined);
            }}
            className="ap rounded-md border py-2 text-sm"
          >
            <option value="">Todos</option>
            {Object.values(StatusOrder).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders &&
          orders.data.map((order) => (
            <div
              key={order.id}
              className="cursor-pointer rounded-xl border border-black bg-muted/90 px-2 py-4 shadow-sm transition hover:shadow-md"
              onClick={() => navigate.push(`/admin/order/${order.id}`)}
            >
              <div>
                <div className="flex items-center justify-between">
                  <TitleH4 className="mb-0">
                    Pedido #{order.numeroPedido}
                  </TitleH4>
                  <StatusOrderComponent
                    mode={AccessProfile.ADMIN}
                    content={order.status}
                    onChange={(newStatus) => {
                      updateStatusOrder(order.id, { status: newStatus });
                    }}
                    className="md:"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">{order.usuario.nome}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Celular: {normalizeCellphoneNumber(order.usuario.telefone)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Agendado: {formatDatePtBr(order.dataAgendamento || '')} |{' '}
                    {order.horarioInicio} {order.horarioFim}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {normalizeCurrency(order.precoTotal)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.metodoPagamento.nome}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center justify-end gap-2">
        <ButtonDefault
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="cursor-pointer rounded border px-3 py-1 disabled:opacity-50"
          variant="secondary"
        >
          Anterior
        </ButtonDefault>

        <span className="text-sm">
          Página {orders?.page} de {orders?.totalPages}
        </span>

        <ButtonDefault
          disabled={page === orders?.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
          variant="secondary"
        >
          Próxima
        </ButtonDefault>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <h1>Dados dos pedidos</h1>
      </div>
      {isLoading && <LoadingComponent mode="fullScreen" />}
    </div>
  );
}
