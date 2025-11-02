'use client';
import CardOrder from '@/components/CardOrder/cardOrder';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { TitleH1, TitleH3 } from '@/components/Titles/Titles';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { useEffect } from 'react';
import { useClientOrder } from './functions';

export default function ClientOrderPage({ session }: ProfilePageProps) {
  const { getOrderClient, isLoading, listOrder } = useClientOrder({ session });

  useEffect(() => {
    getOrderClient();
  }, []);

  return (
    <div>
      <TitleH1>Meus Pedidos</TitleH1>
      <div className="mt-4 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listOrder && listOrder.length > 0 ? (
          listOrder.map((content, index) => (
            <CardOrder key={index} content={content} />
          ))
        ) : (
          <div>{<TitleH3>Você ainda não possui nenhum pedido!</TitleH3>}</div>
        )}
      </div>

      {isLoading && <LoadingComponent mode="fullScreen" />}
    </div>
  );
}
