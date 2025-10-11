'use client';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { TitleH1, TitleParagrapgy } from '@/components/Titles/Titles';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { twMerge } from 'tailwind-merge';
import { ButtonDefault } from '@/components/Button/Button';
import {
  formartQuantityItem,
  formatDatePtBr,
  normalizeCurrency,
} from '@/utils/helpers';

interface ClientOrderDetailsInterface {
  content: ListOrderByClient;
}
export default function ClientOrderDetailsPage({
  content,
}: ClientOrderDetailsInterface) {
  const pending = content.status === StatusOrder.PENDENTE;
  const accept = content.status === StatusOrder.ACEITO;
  const preparing = content.status === StatusOrder.PREPARANDO;
  const deliverd = content.status === StatusOrder.ENTREGUE;
  const cancel = content.status === StatusOrder.CANCELADO;

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border p-6 shadow">
      <TitleH1>Pedido #{content.numeroPedido}</TitleH1>

      <TitleParagrapgy className="mt-2">
        Status atual:{' '}
        <span
          className={twMerge(
            'min-h-2 min-w-2 rounded-full sm:min-h-3 sm:min-w-3',
            pending
              ? 'text-details-pending'
              : preparing
                ? 'text-details-inProgress'
                : cancel
                  ? 'text-details-canceled'
                  : deliverd
                    ? 'text-details-delivered'
                    : accept
                      ? 'text-details-accept'
                      : '',
          )}
        >
          {content.status}
        </span>
      </TitleParagrapgy>
      <TitleParagrapgy>
        Data de agendamento:{' '}
        <span className="font-medium">
          {formatDatePtBr(content.dataAgendamento)}
        </span>
      </TitleParagrapgy>
      <TitleParagrapgy>
        Horário de entrega:{' '}
        <span className="font-medium">{content.horarioDeEntrega}</span>
      </TitleParagrapgy>
      <TitleParagrapgy>
        Meio de pagamento:{' '}
        <span className="font-medium">{content.meioPagamento}</span>
      </TitleParagrapgy>
      <TitleParagrapgy>
        Observação:{' '}
        <span className="font-medium">
          {content.observacao || 'Nenhuma observação'}
        </span>
      </TitleParagrapgy>

      <hr className="my-4 border-gray-200" />

      <div>
        <TitleParagrapgy>Itens do pedido:</TitleParagrapgy>
        {content.carrinho.carrinhoItens.map((item, index) => (
          <div key={index} className="mt-1">
            <span>
              {formartQuantityItem(item)}x {item.item.itemDescription.nome}
            </span>
          </div>
        ))}
      </div>

      <hr className="my-4 border-gray-200" />
      <div className="mt-2 flex gap-2">
        <TitleParagrapgy>Total:</TitleParagrapgy>
        <span>{normalizeCurrency(content.precoTotal)}</span>
      </div>

      <hr className="my-4 border-gray-200" />

      <div>
        <TitleParagrapgy className="font-semibold">Entrega em:</TitleParagrapgy>
        <p>
          {content.endereco.rua} - {content.endereco.numero} -{' '}
          {content.endereco.bairro} - {content.endereco.cidade}/
          {content.endereco.estado} {content.endereco.complemento}
        </p>
      </div>
      {content.status != StatusOrder.PREPARANDO ? (
        <div className="mt-3">
          <ButtonDefault variant="fourth">Cancelar</ButtonDefault>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
