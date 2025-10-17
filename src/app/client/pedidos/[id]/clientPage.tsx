'use client';
// import { TitleH1, TitleParagrapgy } from '@/components/Titles/Titles';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { twMerge } from 'tailwind-merge';
import { ButtonDefault } from '@/components/Button/Button';
import {
  formartQuantityItem,
  formatDatePtBr,
  normalizeCurrency,
} from '@/utils/helpers';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { useEffect } from 'react';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Package,
  MessageCircle,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react';

import { useClientOrder } from '@/app/client/pedidos/functions/index';
import { useRouter } from 'next/navigation';

interface ClientOrderDetailsInterface extends ProfilePageProps {
  id: string;
}
export default function ClientOrderDetailsPage({
  id,
  session,
}: ClientOrderDetailsInterface) {
  const { handleCancelOrderByClient, content, handleOrderDetails, isLoading } =
    useClientOrder({ session });

  useEffect(() => {
    handleOrderDetails(id);
  }, []);

  const navigate = useRouter();

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-lg">
        <p
          className="class-container-icons-text cursor-pointer"
          onClick={() => navigate.back()}
        >
          {' '}
          <ArrowLeft /> Voltar
        </p>
        <div className="mx-auto mt-8 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-600 p-6 text-white">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <ShoppingCart className="h-6 w-6" />
                Pedido #{content?.numeroPedido}
              </h1>
              <p className="mt-1 text-sm opacity-90">
                Status atual:{' '}
                <span
                  className={twMerge(
                    'rounded-md px-1 py-2 sm:min-h-3 sm:min-w-3',
                    content?.status === StatusOrder.PENDENTE
                      ? 'bg-details-pending'
                      : content?.status === StatusOrder.PREPARANDO
                        ? 'bg-details-inProgress'
                        : content?.status === StatusOrder.CANCELADO
                          ? 'bg-details-canceled'
                          : content?.status === StatusOrder.ENTREGUE
                            ? 'bg-details-delivered'
                            : content?.status === StatusOrder.ACEITO
                              ? 'bg-details-accept'
                              : 'bg-gray-500',
                  )}
                >
                  {content?.status}
                </span>
              </p>
            </div>
          </div>

          {/* Corpo */}
          <div className="space-y-6 p-6 text-gray-700">
            {/* Infos principais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-text-green" />
                <div>
                  <p className="text-sm text-gray-500">Data de agendamento</p>
                  <p className="font-medium">
                    {formatDatePtBr(content?.dataAgendamento || '')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-text-green" />
                <div>
                  <p className="text-sm text-gray-500">Horário de entrega</p>
                  <p className="font-medium">{content?.horarioDeEntrega}</p>
                </div>
              </div>
            </div>

            {/* Pagamento */}
            <div className="flex items-start gap-2">
              <CreditCard className="h-5 w-5 text-text-green" />
              <div>
                <p className="text-sm text-gray-500">Meio de pagamento</p>
                <p className="font-medium">{content?.meioPagamento}</p>
              </div>
            </div>

            {/* Observação */}
            <div className="flex items-start gap-2">
              <MessageCircle className="h-5 w-5 text-text-green" />
              <div>
                <p className="text-sm text-gray-500">Observação</p>
                <p className="font-medium">
                  {content?.observacao || 'Nenhuma observação'}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Itens */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-text-green" />
                <h2 className="font-semibold">Itens do pedido</h2>
              </div>

              <ul className="ml-2 list-inside list-disc text-gray-600">
                {content?.carrinho.carrinhoItens.map((item, index) => (
                  <li key={index}>
                    {formartQuantityItem(item)}x{' '}
                    {item.item.itemDescription.nome}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-lg font-semibold">
                Total:{' '}
                <span className="text-text-green">
                  {normalizeCurrency(content?.precoTotal || '')}
                </span>
              </p>
            </div>

            <hr className="border-gray-200" />

            {/* Endereço */}
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-text-green" />
              <div>
                <p className="text-sm text-gray-500">Entrega em</p>
                <p className="font-medium">
                  {content?.endereco.rua} - {content?.endereco.numero} -{' '}
                  {content?.endereco.bairro} - {content?.endereco.cidade}/
                  {content?.endereco.estado} {content?.endereco.complemento}
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          {content?.status !== StatusOrder.PREPARANDO && (
            <div className="flex justify-end bg-gray-50 p-6">
              <ButtonDefault
                variant="fourth"
                className="!bg-red-500 text-white hover:!bg-red-600"
                onClick={() => handleCancelOrderByClient(content?.id || '')}
              >
                Cancelar Pedido
              </ButtonDefault>
            </div>
          )}

          {isLoading && <LoadingComponent mode="fullScreen" />}
        </div>
      </div>
    </main>
  );
}
