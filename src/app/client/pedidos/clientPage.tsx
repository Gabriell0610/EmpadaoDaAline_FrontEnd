'use client';
import CardOrder from '@/components/CardOrder/cardOrder';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { TitleH1 } from '@/components/Titles/Titles';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ClientOrderPage({ session }: ProfilePageProps) {
  const { accessToken, id: idUser } = session!.user;
  const [listOrder, setListOrder] = useState<ListOrderByClient[]>([]);
  const { call, isLoading } = useFetch();

  async function getOrderClient() {
    const resListOrdersByClient = await call<null, ListOrderByClient[]>({
      token: accessToken,
      method: 'GET',
      url: `order/me/${idUser}`,
    });
    if (resListOrdersByClient.success) {
      setListOrder(resListOrdersByClient.data);
    } else {
      toast.error(resListOrdersByClient.message);
    }
  }

  useEffect(() => {
    getOrderClient();
  }, []);

  return (
    <div>
      <TitleH1>Meus Pedidos</TitleH1>
      <p>{session?.user.accessToken}</p>
      <div className="mt-4 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listOrder &&
          listOrder.map((value, index) => (
            <CardOrder key={index} content={value} />
          ))}
      </div>

      {isLoading && <LoadingComponent mode="fullScreen" />}
    </div>
  );
}
