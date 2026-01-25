'use client';
import CardOrder from '@/components/CardOrder/cardOrder';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { TitleH1 } from '@/components/Titles/Titles';
import { useClientOrder } from './functions';
import ImageEmptyCart from '../../../../public/assets/empty_cart_doubt-2.png';
import EmptyContent from '@/components/EmptyContent/emptyContent';

export default function ClientOrderPage() {
  const { isLoading, listOrder } = useClientOrder({});

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
        <EmptyContent
          title="Você ainda não possui nenhum pedido!"
          description="Não perca tempo e peça seu delicioso lanche conosco"
          image={ImageEmptyCart}
          alt="carrinho de compras vazio"
        />
      )}

      {isLoading && <LoadingComponent mode="fullScreen" />}
    </div>
  );
}
