import { ORDER, ORDER_CANCEL, ORDER_ME } from '@/constants';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { getSafeErrorMessage } from '@/utils/helpers';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
interface UpdateStatusSocket {
  orderId: string;
  newStatus: StatusOrder;
}

interface UseClientOrderInterface extends ProfilePageProps {
  id?: string;
}

export function useClientOrder({ session }: UseClientOrderInterface) {
  const { call, isLoading } = useFetch();
  const [content, setContent] = useState<ListOrderByClient>();
  const [listOrder, setListOrder] = useState<ListOrderByClient[]>([]);

  const handleCancelOrderByClient = async (id: string) => {
    const response = await call({
      method: StatusHttp.PATCH,
      url: `${ORDER_CANCEL}/${id}`,
      token: session?.user.accessToken || '',
    });

    if (!response.success) {
      toast.error(getSafeErrorMessage(response.message));
      return;
    }

    toast.success(response.message);
    await handleOrderDetails(id);
  };

  const handleOrderDetails = async (id: string) => {
    const response = await call<null, ListOrderByClient>({
      method: StatusHttp.GET,
      url: `${ORDER}/${id}`,
      token: session?.user.accessToken || '',
    });

    if (!response.success) {
      toast.error(getSafeErrorMessage(response.message));
      return;
    }

    setContent(response.data);
  };

  async function getOrderClient() {
    const resListOrdersByClient = await call<null, ListOrderByClient[]>({
      token: session?.user.accessToken || '',
      method: StatusHttp.GET,
      url: `${ORDER_ME}${session?.user.id}`,
    });

    if (!resListOrdersByClient.success) {
      toast.error(resListOrdersByClient.message);
      return;
    }

    setListOrder(resListOrdersByClient.data);
  }

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
      setContent((prevContent) =>
        prevContent && prevContent.id === data.orderId
          ? { ...prevContent, status: data.newStatus }
          : prevContent,
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user.id]);

  return {
    handleCancelOrderByClient,
    handleOrderDetails,
    getOrderClient,
    setContent,
    isLoading,
    content,
    listOrder,
  };
}
