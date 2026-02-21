'use client';
import { useClientOrder } from '@/app/(private)/client/orders/functions';
import {
  ADMIN_EDIT_OTDER,
  CHANGE_STATUS_ORDER,
  GET_DASHBOARD_QUICK_STATS,
  GET_DASHBOARD_REVENUE,
  GET_DASHBOARD_SUMMARY,
  ORDER,
} from '@/constants';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { useAuth } from '@/providers/authProvider';
import { OrderUpdateDto } from '@/utils/schemas/order.schema';
import {
  DashboardPeriodType,
  DashboardQuickStatsInterface,
  DashboardRevenueInterface,
  DashboardSummaryDto,
} from '@/utils/types/dashboard.type';
import { DetailsPageProps } from '@/utils/types/generics/layout.type';
import {
  ListAllOrdersInterface,
  UpdateStatusOrderInterface,
} from '@/utils/types/orderClient';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useAdminRequest({ id }: DetailsPageProps) {
  const { call, isLoading } = useFetch();
  const [orders, setOrders] = useState<ListAllOrdersInterface | null>(null);
  const { isAuthenticated } = useAuth();

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
    id,
  });

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
    });

    if (!response.success) {
      toast.error('Erro ao listar pedidos');
      return;
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
    const result = await call<OrderUpdateDto, null>({
      method: StatusHttp.PUT,
      url: `${ADMIN_EDIT_OTDER}/${id}`,
      body: data,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    if (!id) {
      toast.error('Erro inesperado, por favor entre em contato com suporte');
    } else {
      await listOrderByClientId(id);
      await listOrders();
    }
  }

  async function getDashboardSummary(dashboardPeriod: DashboardPeriodType) {
    const params = new URLSearchParams({
      period: dashboardPeriod,
    });

    const result = await call<null, DashboardSummaryDto>({
      method: StatusHttp.GET,
      url: `${GET_DASHBOARD_SUMMARY}?${params.toString()}`,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setContentDashboardSummary(result.data);
  }

  async function getDashboardRevenue(dashboardPeriod: DashboardPeriodType) {
    const params = new URLSearchParams({
      period: dashboardPeriod,
    });

    const result = await call<null, DashboardRevenueInterface[]>({
      method: StatusHttp.GET,
      url: `${GET_DASHBOARD_REVENUE}?${params.toString()}`,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setContentDashboardRevenue(result.data);
  }

  async function getDashboardQuickStats() {
    const result = await call<null, DashboardQuickStatsInterface[]>({
      method: StatusHttp.GET,
      url: `${GET_DASHBOARD_QUICK_STATS}`,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setContentDashboardQuickStats(result.data[0]);
  }
  useEffect(() => {
    if (!isAuthenticated) return;
    getDashboardSummary(dashboardPeriod);
    getDashboardRevenue(dashboardPeriod);
  }, [isAuthenticated, dashboardPeriod]);

  useEffect(() => {
    if (!isAuthenticated) return;
    listOrders();
  }, [isAuthenticated, page, search, status, startDate, endDate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getDashboardQuickStats();
  }, [isAuthenticated]);

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
  };
}
