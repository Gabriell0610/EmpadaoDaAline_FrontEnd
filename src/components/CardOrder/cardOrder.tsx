'use client';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { ButtonDefault } from '../Button/Button';
import {
  formartQuantityItem,
  formatDatePtBr,
  normalizeCurrency,
} from '@/utils/helpers';
import { twMerge } from 'tailwind-merge';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import Link from 'next/link';

interface CardOrderInterface {
  content: ListOrderByClient;
}

export default function CardOrder({ content }: CardOrderInterface) {
  const contentInCart = content.carrinho.carrinhoItens[0];

  const pending = content.status === StatusOrder.PENDENTE;
  const accept = content.status === StatusOrder.ACEITO;
  const preparing = content.status === StatusOrder.PREPARANDO;
  const deliverd = content.status === StatusOrder.ENTREGUE;
  const cancel = content.status === StatusOrder.CANCELADO;

  return (
    <>
      <Link
        className="min-h-10 w-auto cursor-pointer rounded-md bg-neutral-white px-2 py-2 text-xs hover:shadow-lg"
        href={`/client/pedidos/${content.id}`}
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-5">
          <div className="flex items-center gap-2">
            <div
              className={twMerge(
                'min-h-2 min-w-2 rounded-full sm:min-h-3 sm:min-w-3',
                pending
                  ? 'bg-details-pending'
                  : preparing
                    ? 'bg-details-inProgress'
                    : cancel
                      ? 'bg-details-canceled'
                      : deliverd
                        ? 'bg-details-delivered'
                        : accept
                          ? 'bg-details-accept'
                          : '',
              )}
            ></div>
            <p className="sm:text-base">{content.status}</p>
          </div>
          <p className="text-p-custom">
            {formatDatePtBr(content.dataAgendamento)}
          </p>
        </div>
        {contentInCart && (
          <div key={contentInCart.itemId} className="text-p-custom mt-2">
            <div className="flex gap-1">
              <p>{formartQuantityItem(contentInCart)}x</p>
              <p>{contentInCart.item.itemDescription.nome}...</p>
            </div>
          </div>
        )}
        <p className="text-p-custom mt-2">
          <span>Total:</span>
          {normalizeCurrency(content.precoTotal)}
        </p>
        {content.status != StatusOrder.PREPARANDO ? (
          <div className="mt-3">
            <ButtonDefault variant="fourth">Cancelar</ButtonDefault>
          </div>
        ) : (
          ''
        )}
      </Link>
    </>
  );
}
