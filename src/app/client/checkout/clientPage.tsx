'use client';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import useClientCheckout from './functions';
import { useEffect, useState } from 'react';
import { TitleH3, TitleH4 } from '@/components/Titles/Titles';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { addressUserDataSchema } from '@/utils/schemas/address.schema';
import { Modal } from '@/components/Modal/ModalComponent';
import { ButtonDefault } from '@/components/Button/Button';
import { orderSchema } from '@/utils/schemas/order.schema';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { useCart } from '@/providers/cartContext/cartProvider';
import { formartQuantityItem, normalizeCurrency } from '@/utils/helpers';
import { ListAddressUserById } from '@/utils/types/address.type';

export default function ClientCheckoutPage({ session }: ProfilePageProps) {
  const {
    address,
    paymentMethods,
    isLoading,
    getShippingAddress,
    setShippingAddress,
    calculateShipping,
    addAddress,
  } = useClientCheckout({
    session,
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const [totalCurrent, setCurrentTotal] = useState<number>(0);

  const { itemsWithLoggedUser } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getCalculateShippingAndTotalPrice = async (
    content: ListAddressUserById,
  ) => {
    // Se o usuário clicou no mesmo endereço (ou seja, está desmarcando)
    if (selectedAddressId === content.enderecoId) {
      setSelectedAddressId(null);
      setShippingAddress(null);
      setCurrentTotal(0);
      return; // não chama o cálculo de frete
    }

    // Caso contrário, é uma nova seleção
    setSelectedAddressId(content.enderecoId);
    await calculateShipping(content.enderecoId);
  };

  useEffect(() => {
    if (itemsWithLoggedUser?.valorTotal && getShippingAddress) {
      setCurrentTotal(
        Number(itemsWithLoggedUser.valorTotal) + Number(getShippingAddress),
      );
    }
  }, [itemsWithLoggedUser, getShippingAddress]);

  return (
    <main className="flex flex-col justify-between md:flex-row">
      <article className="mb-5">
        <section className="mb-4">
          {address && address.length != null ? (
            address?.map((content) => (
              <div key={content.enderecoId} className="flex flex-col">
                <TitleH3>Escolha seu endereço: </TitleH3>
                <label>
                  <input
                    type="checkbox"
                    name="address"
                    value={content.enderecoId}
                    checked={selectedAddressId === content.enderecoId}
                    className="mr-1 cursor-pointer"
                    onChange={() => getCalculateShippingAndTotalPrice(content)}
                  />
                  {content.endereco.rua}, {content.endereco.numero} -{' '}
                  {content.endereco.cidade} - {content.endereco.complemento}...
                </label>
              </div>
            ))
          ) : (
            <>
              <TitleH3>
                Você não tem endereço salvo, adicione um endereço
              </TitleH3>
              <ButtonDefault variant="primary" onClick={() => openModal()}>
                Adicionar
              </ButtonDefault>
              <Modal
                title="Cadastre um endereço"
                isOpen={isModalOpen}
                onClose={closeModal}
              >
                <DefaultForm
                  childrenButton="Adicionar"
                  onSubmit={addAddress}
                  gridClassName="class-grid-layout-forms"
                  layoutType="grid"
                  schema={addressUserDataSchema}
                  fields={[
                    {
                      name: 'zipCode',
                      label: 'Cep',
                      placeholder: 'Digite seu cep',
                    },
                    {
                      name: 'neighborhood',
                      label: 'Bairro',
                      placeholder: 'Digite seu bairro',
                    },
                    {
                      name: 'city',
                      label: 'Cidade',
                      placeholder: 'Digite sua cidade',
                    },
                    {
                      name: 'street',
                      label: 'Rua',
                      placeholder: 'Digite sua rua',
                    },
                    {
                      name: 'number',
                      label: 'Número',
                      placeholder: 'Digite o número',
                    },
                    {
                      name: 'complement',
                      label: 'Complemento',
                      placeholder: 'Ex: apto 410...',
                    },
                    {
                      name: 'state',
                      label: 'Estado',
                      placeholder: 'Digite seu estado',
                      defaultValue: 'RJ',
                      disabled: true,
                    },
                  ]}
                />
              </Modal>
            </>
          )}
        </section>
        <section>
          <TitleH3>Detalhes do pedido</TitleH3>
          <DefaultForm
            schema={orderSchema}
            onSubmit={() => null}
            childrenButton="Enviar"
            fields={[
              {
                name: 'schedulingDate',
                label: 'Data de entrega',
                type: 'date',
              },
              {
                name: 'idPaymentMethod',
                label: 'Método de pagamento',
                type: 'select',
                options: paymentMethods?.map((content) => ({
                  label: content.nome,
                  value: content.id,
                })),
              },
              {
                name: 'deliveryTime',
                label: 'Horário de entrega',
                placeholder: 'Exemplo: 10-11 OU 18-19',
              },
            ]}
          />
        </section>
      </article>
      <article>
        <section className="flex flex-col">
          {<TitleH3>Resumo do Pedido</TitleH3>}
          <div className="my-3">
            <TitleH4>Produtos: </TitleH4>
            {itemsWithLoggedUser?.carrinhoItens &&
              itemsWithLoggedUser?.carrinhoItens.map((content) => (
                <ul key={content.itemId}>
                  <li>
                    {formartQuantityItem(content)}x{' '}
                    {content.item.itemDescription.nome}
                  </li>
                </ul>
              ))}
            <p>
              Método de pagamento: <span>PIX</span>
            </p>
            <p>Subtotal: {itemsWithLoggedUser?.valorTotal}</p>
            <p>
              Frete:{' '}
              {getShippingAddress
                ? getShippingAddress
                : 'Selecione um endereço'}
            </p>
            <p>Total: {normalizeCurrency(totalCurrent)}</p>
          </div>
        </section>
      </article>
      {isLoading && <LoadingComponent mode="fullScreen" />}
    </main>
  );
}
