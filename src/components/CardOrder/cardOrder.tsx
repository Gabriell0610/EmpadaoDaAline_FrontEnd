'use client';
import { ListOrderByClient } from '@/utils/types/orderClient';
import {
  formartQuantityItem,
  formatDatePtBr,
  normalizeCurrency,
} from '@/utils/helpers';
import Link from 'next/link';
import StatusOrderComponent from '../StatusOrder/statusOrderComponent';

interface CardOrderInterface {
  content: ListOrderByClient;
}

export default function CardOrder({ content }: CardOrderInterface) {
  const contentInCart = content.carrinho.carrinhoItens[0];

  return (
    <>
      <Link
        className="border-1 min-h-10 w-auto cursor-pointer rounded-md bg-neutral-white px-2 py-2 text-xs hover:shadow-lg"
        href={`/client/orders/${content.id}`}
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-5">
          <StatusOrderComponent content={content.status} />
          <p className="text-p-custom">
            {formatDatePtBr(content.dataAgendamento || '')}
          </p>
        </div>
        {contentInCart && (
          <div key={contentInCart.item.id} className="text-p-custom mt-2">
            <div className="flex gap-1">
              <p>{formartQuantityItem(contentInCart)}x</p>
              <p>{contentInCart.item?.itemDescription?.nome}...</p>
            </div>
          </div>
        )}
        <p className="text-p-custom mt-2">
          <span>Total:</span>
          {normalizeCurrency(content.precoTotal)}
        </p>
      </Link>
    </>
  );
}
