'use client';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { ButtonDefault } from '../Button/Button';
import { formatDatePtBr, normalizeCurrency } from '@/utils/helpers';
import { ItemCarrinho } from '@/utils/types/cart.type';
import { twMerge } from 'tailwind-merge';
import { StatusOrder } from '@/constants/enums/StatusOrder';

interface CardOrderInterface {
  content: ListOrderByClient;
}

export default function CardOrder({ content }: CardOrderInterface) {
  const contentInCart = content.carrinho.carrinhoItens[0];

  const pending = content.status === StatusOrder.PENDENTE;
  const preparing = content.status === StatusOrder.PREPARANDO;
  const cancel = content.status === StatusOrder.CANCELADO;
  const deliverd = content.status === StatusOrder.ENTREGUE;

  function formartDescriptionItem(data: ItemCarrinho) {
    const quantity = data.item.unidades
      ? Number(data.item.unidades) + data.quantidade - 1
      : data.quantidade;

    return quantity;
  }

  return (
    <>
      <div className="cursor-pointer rounded-md bg-neutral-white px-2 py-2 text-xs">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div
              className={twMerge(
                'h-2 w-2 rounded-full sm:h-3 sm:w-3',
                pending
                  ? 'bg-details-pending'
                  : preparing
                    ? 'bg-details-inProgress'
                    : cancel
                      ? 'bg-details-canceled'
                      : deliverd
                        ? 'bg-details-delivered'
                        : '',
              )}
            ></div>
            <p className="text-xs sm:text-lg">Pedido #{content.numeroPedido}</p>
            <p className="sm:text-base">{content.status}</p>
          </div>
          <p className="text-xs sm:text-base">
            {formatDatePtBr(content.dataAgendamento)}
          </p>
        </div>
        {contentInCart && (
          <div key={contentInCart.itemId} className="mt-2 text-xs sm:text-base">
            <div className="flex gap-1">
              <p>{formartDescriptionItem(contentInCart)}x</p>
              <p>{contentInCart.item.itemDescription.nome}...</p>
            </div>
          </div>
        )}
        <p className="text-p-custom mt-2">
          <span>Total:</span>
          {normalizeCurrency(content.precoTotal)}
        </p>
        <div className="mt-3">
          <ButtonDefault
            className="bg-red-500 px-2 py-1 text-xs hover:bg-red-500"
            variant="primary"
          >
            Cancelar
          </ButtonDefault>
        </div>
      </div>
    </>
  );
}
