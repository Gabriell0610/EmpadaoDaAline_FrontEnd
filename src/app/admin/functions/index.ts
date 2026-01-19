'use client';
import { useClientOrder } from '@/app/client/orders/functions';
import {
  ADMIN_EDIT_OTDER,
  CHANGE_STATUS_ORDER,
  GET_DASHBOARD_QUICK_STATS,
  GET_DASHBOARD_REVENUE,
  GET_DASHBOARD_SUMMARY,
  ITENS,
  ORDER,
} from '@/constants';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import {
  EditItensSchemaDto,
  ItensSchemaDto,
} from '@/utils/schemas/itens.schema';
import { OrderUpdateDto } from '@/utils/schemas/order.schema';
import {
  DashboardPeriodType,
  DashboardQuickStatsInterface,
  DashboardRevenueInterface,
  DashboardSummaryDto,
} from '@/utils/types/dashboard.type';
import { DetailsPageProps } from '@/utils/types/generics/layout.type';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import {
  ListAllOrdersInterface,
  UpdateStatusOrderInterface,
} from '@/utils/types/orderClient';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useAdminRequest({ session, id }: DetailsPageProps) {
  const { accessToken } = session!.user;
  const { call, isLoading } = useFetch();
  const [orders, setOrders] = useState<ListAllOrdersInterface | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusOrder | undefined>();
  const [startDate, setStartDatePeriod] = useState<string | null>(null);
  const [endDate, setEndDatePeriod] = useState<string | null>(null);

  const [dashboardPeriod, setDashboardPeriod] =
    useState<DashboardPeriodType>('1m');

  const [contentDashboardSummary, setContentDashboardSummary] =
    useState<DashboardSummaryDto | null>(null);

  const [contentDashboardRevenue, setContentDashboardRevenue] = useState<
    DashboardRevenueInterface[] | null
  >(null);

  const [contentDashboardQuickStats, setContentDashboardQuickStats] =
    useState<DashboardQuickStatsInterface | null>(null);

  const { contentOrderByClientId, listOrderByClientId } = useClientOrder({
    session,
    id,
  });

  const [selectedItem, setSelectedItem] = useState<string>('');

  const [listAllItens, setListAllItens] = useState<
    ListActiveItemsInterface[] | null
  >(null);

  async function listOrders() {
    const params = new URLSearchParams({
      page: String(page),
      size: '5',
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(search && { search }),
      ...(status && { status }),
    });

    const response = await call<null, ListAllOrdersInterface>({
      method: StatusHttp.GET,
      url: `${ORDER}?${params.toString()}`,
      token: accessToken,
    });

    if (!response.success) {
      toast.error('Erro ao listar pedidos');
      console.error(response.message);
    }

    setOrders(response.data);
  }

  async function updateStatusOrder(
    id: string,
    data: UpdateStatusOrderInterface,
  ) {
    const response = await call<UpdateStatusOrderInterface, null>({
      method: StatusHttp.PATCH,
      url: `${CHANGE_STATUS_ORDER}/${id}`,
      token: accessToken,
      body: data,
    });

    if (!response.success) {
      toast.error(response.message);
      console.error(response.message);
    }

    await listOrders();
    await getDashboardQuickStats();
    await listOrderByClientId(id);
  }

  async function adminEditOrder(data: OrderUpdateDto) {
    console.log('editando esses dados', data);
    const result = await call<OrderUpdateDto, null>({
      method: StatusHttp.PUT,
      url: `${ADMIN_EDIT_OTDER}/${id}`,
      token: session?.user.accessToken,
      body: data,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    toast.success(result.message);

    if (!id) {
      toast.error('Erro inesperado, por favor entre em contato com suporte');
    } else {
      await listOrderByClientId(id);
    }
  }

  async function getDashboardSummary(dashboardPeriod: DashboardPeriodType) {
    const params = new URLSearchParams({
      period: dashboardPeriod,
    });

    const result = await call<null, DashboardSummaryDto>({
      method: StatusHttp.GET,
      url: `${GET_DASHBOARD_SUMMARY}?${params.toString()}`,
      token: session?.user.accessToken,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    console.log(result.data);

    setContentDashboardSummary(result.data);
  }

  async function getDashboardRevenue(dashboardPeriod: DashboardPeriodType) {
    const params = new URLSearchParams({
      period: dashboardPeriod,
    });

    const result = await call<null, DashboardRevenueInterface[]>({
      method: StatusHttp.GET,
      url: `${GET_DASHBOARD_REVENUE}?${params.toString()}`,
      token: session?.user.accessToken,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    setContentDashboardRevenue(result.data);
  }

  async function getDashboardQuickStats() {
    const result = await call<null, DashboardQuickStatsInterface[]>({
      method: StatusHttp.GET,
      url: `${GET_DASHBOARD_QUICK_STATS}`,
      token: session?.user.accessToken,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    setContentDashboardQuickStats(result.data[0]);
  }

  async function getAllItens() {
    const result = await call<null, ListActiveItemsInterface[]>({
      method: StatusHttp.GET,
      url: `${ITENS}`,
      token: session?.user.accessToken,
    });

    if (!result.success) {
      toast.error(result.message);
    }
    console.log('listando todos os itens', result.data);
    setListAllItens(result.data);
  }

  async function inativeItem(itemId: string) {
    const result = await call<null, null>({
      method: StatusHttp.PATCH,
      url: `${ITENS}/${itemId}`,
      token: session?.user.accessToken,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    toast.success(result.message);
  }

  async function editItem(itemId: string, data: EditItensSchemaDto) {
    const result = await call<EditItensSchemaDto, null>({
      method: StatusHttp.PUT,
      url: `${ITENS}/${itemId}`,
      token: session?.user.accessToken,
      body: data,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    toast.success(result.message);
  }

  async function createItem(data: ItensSchemaDto) {
    const result = await call<ItensSchemaDto, null>({
      method: StatusHttp.POST,
      url: `${ITENS}`,
      token: session?.user.accessToken,
      body: data,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    toast.success(result.message);
  }

  useEffect(() => {
    getDashboardSummary(dashboardPeriod);
    getDashboardRevenue(dashboardPeriod);
  }, [dashboardPeriod]);

  useEffect(() => {
    listOrders();
  }, [page, search, status, startDate, endDate]);

  useEffect(() => {
    getDashboardQuickStats();
    getAllItens();
  }, []);

  return {
    isLoading,
    orders,
    page,
    search,
    status,
    contentOrderByClientId,
    dashboardPeriod,
    contentDashboardSummary,
    contentDashboardRevenue,
    contentDashboardQuickStats,
    listAllItens,
    selectedItem,
    setSelectedItem,
    setDashboardPeriod,
    updateStatusOrder,
    adminEditOrder,
    setPage,
    setSearch,
    setStatus,
    getDashboardSummary,
    setContentDashboardSummary,
    setStartDatePeriod,
    setEndDatePeriod,
    inativeItem,
    editItem,
    createItem,
  };
}
