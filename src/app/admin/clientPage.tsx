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
    setEndDatePeriod,
    setStartDatePeriod,
  } = useAdminRequest({ session });
  const navigate = useRouter();

  function submitFilterOrderByPeriod(data: DashboardFilterByPeriodData) {
    console.log('periodo por data', data);
    setStartDatePeriod(data.startDate || null);
    setEndDatePeriod(data.endDate || null);
  }

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
      {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-4">
              <h2 className="mb-2 font-medium">Pedidos recentes</h2>
              <ul className="space-y-2 text-sm">
                <li>#1025 — Em preparo — 12 min</li>
                <li>#1026 — Novo — 3 min</li>
                <li>#1024 — Entregue — 28 min</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="mb-2 font-medium">Indicadores rápidos</h2>
              <ul className="space-y-2 text-sm">
                <li>Cupons usados: 18%</li>
                <li>Forma pagamento: PIX</li>
                <li>Reclamações abertas: 2</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div> */}
      {isLoading && <LoadingComponent mode="fullScreen" />}
    </div>
  );
}
