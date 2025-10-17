import { ORDER, ORDER_CANCEL, ORDER_ME } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { getSafeErrorMessage } from '@/utils/helpers';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useClientOrder({ session }: ProfilePageProps) {
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
    }

    toast.success(response.message);
    await handleOrderDetails(id);
  };

  const handleOrderDetails = async (id: string) => {
    const response = await call<null, ListOrderByClient>({
      method: 'GET',
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
      method: 'GET',
      url: `${ORDER_ME}${session?.user.id}`,
    });
    if (resListOrdersByClient.success) {
      setListOrder(resListOrdersByClient.data);
    } else {
      toast.error(resListOrdersByClient.message);
    }
  }

  return {
    handleCancelOrderByClient,
    handleOrderDetails,
    getOrderClient,
    isLoading,
    content,
    listOrder,
  };
}
