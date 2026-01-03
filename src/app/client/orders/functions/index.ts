import { ORDER, ORDER_CANCEL, ORDER_ME } from '@/constants';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
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
export function useClientOrder({ session, id }: DetailsPageProps) {
  const { call, isLoading } = useFetch();
  const [contentOrderByClientId, setContentOrderByClientId] =
    useState<ListOrderByClient>();
  const [listOrder, setListOrder] = useState<ListOrderByClient[]>([]);

  const handleCancelOrderByClient = async (id: string) => {
    const response = await call({
      method: StatusHttp.PATCH,
      url: `${ORDER_CANCEL}/${id}`,
      token: session?.user.accessToken,
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
        token: session?.user.accessToken,
      });

      if (!response.success) {
        toast.error(getSafeErrorMessage(response.message));
        return;
      }
      console.log(response.data);
      setContentOrderByClientId(response.data);
    },
    [call, session?.user.accessToken],
  );

  useEffect(() => {
    if (!id) return;
    listOrderByClientId(id);
  }, [id, listOrderByClientId]);

  const getOrderClient = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    const resListOrdersByClient = await call<null, ListOrderByClient[]>({
      token: session.user.accessToken,
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
  }, [session?.user?.accessToken, call]);

  useEffect(() => {
    if (session?.user.role == AccessProfile.ADMIN) {
      return;
    }
    getOrderClient();
  }, [getOrderClient, session?.user.role]);

  // cria o socket apenas uma vez
  useEffect(() => {
    const socket = io('http://localhost:1338', {
      query: {
        userId: session?.user.id,
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
  }, [session?.user.id]);

  async function editOrder(data: OrderUpdateDto) {
    console.log('editando esses dados', data);
    const result = await call<OrderUpdateDto, null>({
      method: StatusHttp.PUT,
      url: `${ORDER}/${id}`,
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

  return {
    handleCancelOrderByClient,
    listOrderByClientId,
    getOrderClient,
    setContentOrderByClientId,
    editOrder,
    isLoading,
    contentOrderByClientId,
    listOrder,
  };
}
