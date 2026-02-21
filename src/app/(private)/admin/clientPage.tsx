'use client';
import { TitleH1, TitleH3, TitleH4 } from '@/components/Titles/Titles';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import {
  DashboardFilterByPeriod,
  DashboardFilterByPeriodData,
} from '@/utils/schemas/dashboard.schema';
import { SlidersHorizontal } from 'lucide-react';
import { CardContent } from '@/components/CardContent/cardContent';
import { Card } from '@/components/Card/card';

export default function DashboardClientPage() {
  const {
    isLoading,
    orders,
    page,
    search,
    status,
    contentDashboardQuickStats,
    updateStatusOrder,
    setPage,
    setSearch,
    setStatus,
    setEndDatePeriod,
    setStartDatePeriod,
  } = useAdminRequest({});
  const navigate = useRouter();

  console.log(orders);

  function submitFilterOrderByPeriod(data: DashboardFilterByPeriodData) {
    setStartDatePeriod(data.startDate || null);
    setEndDatePeriod(data.endDate || null);
  }

  const isToday = (isoDate?: string | null) => {
    console.log('data: ', isoDate);
    if (!isoDate) return false;

    const dateOnly = isoDate.split('T')[0]; // YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    return dateOnly === today;
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mr-5 mt-3 flex flex-wrap justify-between">
        <TitleH3>Total de Pedidos: {orders?.totalItems}</TitleH3>
        <Popover>
          <PopoverTrigger className="w-32 px-2 py-1 text-left font-semibold tracking-wide text-neutral-black">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Filtros
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="font-semibold" htmlFor="">
                  Buscar
                </label>
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
              </div>
              <hr />
              <div className="flex flex-col gap-1">
                <label className="font-semibold" htmlFor="">
                  Filtre pelo status
                </label>
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
              <hr />
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Filtre pelo período</label>
                <DefaultForm
                  schema={DashboardFilterByPeriod}
                  onSubmit={submitFilterOrderByPeriod}
                >
                  <InputField
                    name="startDate"
                    label="Data ínicio"
                    type="date"
                  />
                  <InputField name="endDate" label="Data fim" type="date" />
                  <ButtonDefault type="submit" variant="primary">
                    Filtrar
                  </ButtonDefault>
                </DefaultForm>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
                  <p className="text-sm font-medium">
                    {order.usuario.role === AccessProfile.ADMIN
                      ? order.nomeCliente
                      : order.usuario.nome}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Celular:{' '}
                    {normalizeCellphoneNumber(
                      order.usuario.role === AccessProfile.ADMIN
                        ? order.celularCliente
                        : order.usuario.telefone,
                    )}
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
                {isToday(order.dataAgendamento) &&
                  order.status !== StatusOrder.CANCELADO &&
                  order.status !== StatusOrder.ENTREGUE && (
                    <div className="mt-3 w-28 rounded-md border bg-orange-500 text-center text-neutral-white">
                      <p>Entregar Hoje</p>
                    </div>
                  )}
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
      {contentDashboardQuickStats && (
        <section>
          <TitleH1>Resumo de hoje</TitleH1>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-2 font-medium">Encomendas para hoje</h2>
                <p className="font-semibold">
                  {contentDashboardQuickStats?.ordersScheduledToday}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="mb-2 font-medium">Pedidos entregues hoje</h2>
                <p className="font-semibold">
                  {contentDashboardQuickStats?.deliveriesDueToday}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="mb-2 font-medium">
                  Total pedidos cancelados hoje
                </h2>
                <p className="font-semibold">
                  {contentDashboardQuickStats?.canceledToday}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="mb-2 font-medium">
                  Total pedidos em progresso hoje
                </h2>
                <p className="font-semibold">
                  {contentDashboardQuickStats?.inProgressOrdersToday}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="mb-2 font-medium">
                  Total pedidos entregues até hoje
                </h2>
                <p className="font-semibold">
                  {contentDashboardQuickStats?.totalDelivered}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
      {isLoading && <LoadingComponent mode="fullScreen" />}
    </div>
  );
}
