'use client';
import CardOrder from '@/components/CardOrder/cardOrder';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { TitleH1 } from '@/components/Titles/Titles';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { useEffect } from 'react';
import { useClientOrder } from './functions';
import Image from 'next/image';
import imageEmptyCart from '../../../../public/assets/empty-cart-doubt-2.png';

export default function ClientOrderPage({ session }: ProfilePageProps) {
  const { getOrderClient, isLoading, listOrder } = useClientOrder({ session });

  useEffect(() => {
    getOrderClient();
  }, []);

  return (
    <div>
      {listOrder && listOrder.length > 0 ? (
        <>
          <TitleH1>Meus Pedidos</TitleH1>
          <div className="mt-4 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listOrder.map((content, index) => (
              <CardOrder key={index} content={content} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <TitleH1 className="mb-0">
              Você ainda não possui nenhum pedido!
            </TitleH1>
            <p className="text-xs text-text-secondary sm:text-base">
              Não perca tempo e peça seu delicioso lanche conosco
            </p>
            <Image src={imageEmptyCart} alt={'carrinho vazio'} width={200} />
          </div>
        </div>
      )}

      {isLoading && <LoadingComponent mode="fullScreen" />}
    </div>
  );
}
