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
    <Link
      className="group relative flex min-h-[150px] w-auto cursor-pointer flex-col overflow-hidden rounded-2xl border border-text-primary/10 bg-gradient-to-br from-neutral-offWhite via-neutral-white to-neutral-white p-4 text-xs shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-green_details-greenLight/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green_details-greenLight/60"
      href={`/client/orders/${content.id}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-green_details-greenFooter via-green_details-greenFluorescent/60 to-green_details-greenFooter opacity-80" />

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="rounded-full border border-text-primary/10 bg-neutral-white/90 px-2 py-1">
          <StatusOrderComponent content={content.status} />
        </div>
        <p className="text-p-custom font-medium text-text-secondary">
          {formatDatePtBr(content.dataAgendamento || '')}
        </p>
      </div>

      <div className="mt-3 flex-1">
        {contentInCart && (
          <div key={contentInCart.item.id} className="text-p-custom">
            <p className="flex gap-1 text-text-primary">
              <span className="font-semibold">
                {formartQuantityItem(contentInCart)}x
              </span>
              <span className="line-clamp-1">
                {contentInCart.item?.itemDescription?.nome}...
              </span>
            </p>
          </div>
        )}

        {!contentInCart && (
          <p className="text-p-custom italic text-text-secondary">
            Pedido sem itens no resumo
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-text-primary/10 pt-3">
        <p className="text-p-custom font-semibold text-text-secondary">Total</p>
        <p className="text-sm font-bold text-text-primary">
          {normalizeCurrency(content.precoTotal)}
        </p>
      </div>
    </Link>
  );
}
