'use client';
import { useClientOrder } from '@/app/client/orders/functions';
import { ADMIN_EDIT_OTDER, CHANGE_STATUS_ORDER, ORDER } from '@/constants';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { OrderUpdateDto } from '@/utils/schemas/order.schema';
import { DetailsPageProps } from '@/utils/types/generics/layout.type';
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

  const { contentOrderByClientId, listOrderByClientId } = useClientOrder({
    session,
    id,
  });

  async function listOrders() {
    const params = new URLSearchParams({
      page: String(page),
      size: '9',
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

  useEffect(() => {
    listOrders();
  }, [page, search, status]);

  return {
    isLoading,
    orders,
    page,
    search,
    status,
    contentOrderByClientId,
    updateStatusOrder,
    adminEditOrder,
    setPage,
    setSearch,
    setStatus,
  };
}
