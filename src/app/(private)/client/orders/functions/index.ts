import {
  ORDER_CONFIRM_CLIENT,
  ORDER,
  ORDER_CANCEL,
  ORDER_ME,
} from '@/constants';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { useAuth } from '@/providers/authProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import { OrderUpdateDto } from '@/utils/schemas/order.schema';
import { DetailsPageProps } from '@/utils/types/generics/layout.type';
import {
  ListOrderByClient,
  UpdateStatusSocket,
} from '@/utils/types/orderClient';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
export function useClientOrder({ id }: DetailsPageProps) {
  const { isAuthenticated, user } = useAuth();

  const { call, isLoading } = useFetch();
  const [contentOrderByClientId, setContentOrderByClientId] =
    useState<ListOrderByClient>();
  const [listOrder, setListOrder] = useState<ListOrderByClient[]>([]);

  const handleCancelOrderByClient = async (id: string) => {
    const response = await call({
      method: StatusHttp.PATCH,
      url: `${ORDER_CANCEL}/${id}`,
    });

    if (!response.success) {
      toast.error(getSafeErrorMessage(response.message));
      return;
    }

    toast.success(response.message);
    await listOrderByClientId(id);
  };

  const listOrderByClientId = useCallback(
    async (id: string) => {
      const response = await call<null, ListOrderByClient>({
        method: StatusHttp.GET,
        url: `${ORDER}/${id}`,
      });

      if (!response.success) {
        toast.error(getSafeErrorMessage(response.message));
        return;
      }

      setContentOrderByClientId(response.data);
    },
    [call],
  );

  useEffect(() => {
    if (!id) return;
    listOrderByClientId(id);
  }, [id, listOrderByClientId]);

  const getOrderClient = useCallback(async () => {
    if (!isAuthenticated) return;

    const resListOrdersByClient = await call<null, ListOrderByClient[]>({
      method: StatusHttp.GET,
      url: ORDER_ME,
    });

    if (!resListOrdersByClient.success) {
      toast(getSafeErrorMessage(resListOrdersByClient.message), {
        icon: '⚠️',
      });
      return;
    }

    setListOrder(resListOrdersByClient.data);
  }, [call, isAuthenticated]);

  useEffect(() => {
    getOrderClient();
  }, [getOrderClient]);

  // cria o socket apenas uma vez
  useEffect(() => {
    const socket = io('http://localhost:1338', {
      query: {
        userId: user?.id,
      },
    });

    socket.on('orderStatusUpdate', (data: UpdateStatusSocket) => {
      // Atualiza a lista de pedidos (histórico)
      setListOrder((prev) =>
        prev.map((order) =>
          order.id === data.orderId
            ? { ...order, status: data.newStatus }
            : order,
        ),
      );

      // Atualiza o pedido atual (detalhe)
      setContentOrderByClientId((prevContent) =>
        prevContent && prevContent.id === data.orderId
          ? { ...prevContent, status: data.newStatus }
          : prevContent,
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  async function editOrder(data: OrderUpdateDto) {
    const result = await call<OrderUpdateDto, null>({
      method: StatusHttp.PUT,
      url: `${ORDER}/${id}`,
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
    }
  }

  async function confirmOrder() {
    const result = await call<{ status: StatusOrder }, null>({
      method: StatusHttp.PATCH,
      url: `${ORDER_CONFIRM_CLIENT}/${id}`,
      body: { status: StatusOrder.CONFIRMADO_CLIENTE },
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  }

  return {
    handleCancelOrderByClient,
    listOrderByClientId,
    getOrderClient,
    setContentOrderByClientId,
    editOrder,
    confirmOrder,
    isLoading,
    contentOrderByClientId,
    listOrder,
  };
}
