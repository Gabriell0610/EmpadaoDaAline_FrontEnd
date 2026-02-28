'use client';
import useClientCheckout from '../functions';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { useOrderStore } from '@/stores/orderDetails-store';
import { TitleH1, TitleH4 } from '@/components/Titles/Titles';
import {
  formartQuantityItem,
  formatDatePtBr,
  normalizeCurrency,
} from '@/utils/helpers';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import {
  AddressUserData,
  addressUserDataSchema,
} from '@/utils/schemas/address.schema';
import { InputField } from '@/components/InputField/InputField';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { useContext, useEffect, useRef, useState } from 'react';
import { OrderDto } from '@/utils/schemas/order.schema';
import { AddressViaCepInterface } from '@/utils/types/address.type';
import toast from 'react-hot-toast';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  CreditCard,
  MapPinHouse,
  MessageSquareText,
  PackageCheck,
  Trash2,
  Truck,
} from 'lucide-react';
import BackPageButton from '@/components/BackPageButton/backPageButton';
import { WITHOUTCONTENT } from '@/constants';
import { UseFormReturn } from 'react-hook-form';

export default function SummaryClientPage() {
  const {
    isLoading,
    address,
    paymentMethods,
    shipping,
    calculateShipping,
    addAddress,
    createOrder,
    removeAddress,
    setShipping,
  } = useClientCheckout();

  const { isLoading: loading, setIsLoading } = useContext(LoadingContext);

  const { itemsWithLoggedUser } = useCart();
  const navigate = useRouter();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [addressId, setAddressId] = useState('');

  const addressFormMethodsRef = useRef<UseFormReturn<AddressUserData> | null>(
    null,
  );
  const isFinishingOrderRef = useRef(false);

  const [addressSelected, setAddressSelected] = useState(false);
  const [disableAddressButton, setDisableAddressButton] = useState(true);

  //zustand
  const orderDetails = useOrderStore((state) => state.order);
  const clearOrder = useOrderStore((state) => state.clearOrder);

  useEffect(() => {
    if (!itemsWithLoggedUser) return;
    const total =
      (Number(itemsWithLoggedUser?.valorTotal) || 0) + (Number(shipping) || 0);
    setTotalPrice(total);
  }, [shipping, itemsWithLoggedUser]);

  useEffect(() => {
    if (!orderDetails && !isFinishingOrderRef.current) {
      navigate.push('/client/checkout');
    }
  }, [orderDetails]);

  const paymentMethod = paymentMethods?.find(
    (data) => data.id === orderDetails?.idPaymentMethod,
  );

  const calculateTotalPrice = (newAddressId: string) => {
    setAddressId(newAddressId);
    calculateShipping(newAddressId);
    setAddressSelected(true);
    addressFormMethodsRef.current?.reset();
  };

  const handleRemoveAddress = async (
    currentEnderecoId: string,
    currentAddressId: string,
  ) => {
    const removed = await removeAddress(currentEnderecoId);
    if (!removed) return;

    if (addressId === currentAddressId) {
      setAddressId('');
      setAddressSelected(false);
      setTotalPrice(Number(itemsWithLoggedUser?.valorTotal) || 0);
      setShipping(null);
    }
  };

  async function handleSubmitOrder() {
    const createOrderObj: OrderDto = {
      idAddress: addressId,
      shipping: shipping!,
      endTime: orderDetails!.endTime,
      startTime: orderDetails!.startTime,
      idPaymentMethod: orderDetails!.idPaymentMethod,
      nameClient: orderDetails!.nameClient,
      cellphoneClient: orderDetails!.cellphoneClient,
      observation: orderDetails!.observation,
      schedulingDate: orderDetails!.schedulingDate,
    };

    const order = await createOrder(createOrderObj);
    if (order?.id == null) {
      return;
    }

    isFinishingOrderRef.current = true;
    clearOrder();
    navigate.push(`/client/orders/${order.id}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 md2:flex-row md2:items-start md2:gap-8">
      <section className="w-full md2:w-[62%] lg:w-[60%]">
        <div className="mb-5">
          <BackPageButton />
        </div>

        <header className="mb-5 rounded-3xl border border-text-primary/10 bg-gradient-to-br from-green_details-greenFooter/30 via-neutral-white to-neutral-white p-6 shadow-sm">
          <TitleH1 className="mb-2">Endereço de entrega</TitleH1>
          <p className="text-sm text-text-secondary sm:text-base">
            Selecione um endereço existente ou cadastre um novo para calcular o
            frete e concluir seu pedido.
          </p>
        </header>

        <article className="rounded-2xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPinHouse className="h-5 w-5 text-text-green" />
            <TitleH4 className="mb-0">Selecione um endereço</TitleH4>
          </div>

          <div className="space-y-3">
            {address && address.length > 0 ? (
              address.map((currentAddress) => (
                <div
                  key={currentAddress.endereco.id}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-text-primary/10 bg-neutral-offWhite px-4 py-3 transition-colors hover:border-green_details-greenLight/30 hover:bg-neutral-white"
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={currentAddress.endereco.id}
                      checked={addressId === currentAddress.endereco.id}
                      className="mt-1 h-4 w-4 accent-text-green"
                      onChange={() =>
                        calculateTotalPrice(currentAddress.endereco.id)
                      }
                    />
                    <span className="text-sm leading-relaxed text-text-secondary">
                      {currentAddress.endereco.rua},{' '}
                      {currentAddress.endereco.numero}
                      {' - '}
                      {currentAddress.endereco.bairro},{' '}
                      {currentAddress.endereco.cidade}
                      {' - '}
                      {currentAddress.endereco.estado} (CEP{' '}
                      {currentAddress.endereco.cep})
                    </span>
                  </label>

                  <button
                    type="button"
                    className="rounded-md p-1.5 text-details-error transition-colors hover:bg-details-error/10"
                    onClick={() =>
                      handleRemoveAddress(
                        currentAddress.enderecoId,
                        currentAddress.endereco.id,
                      )
                    }
                    aria-label="Remover endereço"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                Adicione um novo endereço para prosseguir
              </div>
            )}
          </div>
        </article>

        <article className="mt-5 rounded-2xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm sm:p-6">
          <TitleH4 className="mb-3">Novo endereço</TitleH4>

          <DefaultForm schema={addressUserDataSchema} onSubmit={addAddress}>
            {(methods) => {
              addressFormMethodsRef.current = methods;

              const consultaViaCep = async (cep: string) => {
                try {
                  setIsLoading(true);
                  if (cep != '') {
                    const result = await fetch(
                      `https://viacep.com.br/ws/${cep}/json/`,
                    );
                    const data: AddressViaCepInterface = await result.json();
                    setDisableAddressButton(cep ? false : true);
                    methods.setValue('street', data.logradouro);
                    methods.setValue('neighborhood', data.bairro);
                    methods.setValue('city', data.localidade);
                    methods.setValue('state', data.uf);
                  } else {
                    methods.reset();
                  }
                } catch (error) {
                  console.error(error);
                  toast.error('Erro ao pesquisar CEP, informe um cep válido');
                } finally {
                  setIsLoading(false);
                }
              };

              return (
                <>
                  <div className="class-form-checkout-summary">
                    <InputField
                      label="CEP"
                      name="zipCode"
                      type="text"
                      disabled={isLoading || loading}
                      placeholder="Digite seu cep"
                      maxLength={8}
                      onBlur={(e) => consultaViaCep(e.target.value)}
                    />
                    <InputField
                      label="Rua"
                      name="street"
                      type="text"
                      disabled={isLoading || loading}
                      placeholder="Ex: Roberto Silveira"
                    />
                  </div>

                  <div className="class-form-checkout-summary">
                    <InputField
                      label="Bairro"
                      name="neighborhood"
                      type="text"
                      placeholder="Ex: Fonseca"
                      disabled={isLoading || loading}
                    />
                    <InputField
                      label="Cidade"
                      name="city"
                      type="text"
                      placeholder="Ex: Niterói"
                      disabled={isLoading || loading}
                    />
                  </div>

                  <div className="class-form-checkout-summary">
                    <InputField
                      label="Estado"
                      name="state"
                      type="text"
                      placeholder="Ex: RJ"
                      disabled={isLoading || loading}
                    />
                    <InputField
                      label="Número"
                      name="number"
                      type="text"
                      placeholder="Ex: 33"
                      disabled={isLoading || loading}
                    />
                  </div>

                  <InputField
                    label="Complemento (obrigatório)"
                    name="complement"
                    type="text"
                    placeholder="Ex: Bloco2/apto:402"
                    disabled={isLoading || loading}
                  />

                  <ButtonDefault
                    type="submit"
                    variant="primary"
                    isLoading={isLoading || loading}
                    disabled={disableAddressButton || addressSelected}
                    className="mt-2"
                  >
                    Salvar Endereço
                  </ButtonDefault>
                </>
              );
            }}
          </DefaultForm>
        </article>
      </section>

      <section className="w-full md2:sticky md2:top-6 md2:w-[38%] lg:w-[36%]">
        <article className="rounded-2xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-text-green" />
            <TitleH1 className="mb-0 text-xl sm:text-2xl">
              Resumo do pedido
            </TitleH1>
          </div>

          <div className="space-y-3">
            <TitleH4 className="mb-0">Produtos</TitleH4>

            <div className="space-y-2 rounded-xl border border-text-primary/10 bg-neutral-offWhite p-3">
              {itemsWithLoggedUser?.carrinhoItens &&
                itemsWithLoggedUser.carrinhoItens.map((item) => (
                  <p key={item.id} className="text-sm text-text-primary">
                    {formartQuantityItem(item)}x{' '}
                    {item.item.itemDescription.nome} - {item.item.tamanho}
                  </p>
                ))}
            </div>

            <div className="space-y-2 rounded-xl border border-text-primary/10 bg-neutral-offWhite p-3 text-sm">
              <p className="class-container-icons-text text-text-secondary">
                <CalendarDays className="h-4 w-4 text-text-green" />
                <span className="font-semibold text-text-primary">
                  Data de entrega:
                </span>
                {formatDatePtBr(orderDetails?.schedulingDate || '')}
              </p>

              <p className="class-container-icons-text text-text-secondary">
                <Clock3 className="h-4 w-4 text-text-green" />
                <span className="font-semibold text-text-primary">
                  Horário de entrega:
                </span>
                {orderDetails?.startTime} - {orderDetails?.endTime}
              </p>

              <p className="class-container-icons-text text-text-secondary">
                <CreditCard className="h-4 w-4 text-text-green" />
                <span className="font-semibold text-text-primary">
                  Método de pagamento:
                </span>
                {paymentMethod?.nome ? paymentMethod.nome : WITHOUTCONTENT}
              </p>

              <p className="class-container-icons-text items-start text-text-secondary">
                <MessageSquareText className="mt-0.5 h-4 w-4 text-text-green" />
                <span className="font-semibold text-text-primary">
                  Observação:
                </span>
                {orderDetails?.observation
                  ? orderDetails.observation
                  : 'sem observação...'}
              </p>
            </div>

            <div className="rounded-xl border border-text-primary/10 bg-neutral-offWhite p-3">
              <p className="mb-2 flex items-center justify-between text-sm">
                <span className="class-container-icons-text">
                  <CircleDollarSign className="h-4 w-4 text-text-green" />
                  <span className="font-semibold text-text-primary">
                    Subtotal
                  </span>
                </span>
                <span className="font-semibold text-text-primary">
                  {normalizeCurrency(itemsWithLoggedUser?.valorTotal || '0')}
                </span>
              </p>

              <p className="mb-2 flex items-center justify-between text-sm">
                <span className="class-container-icons-text">
                  <Truck className="h-4 w-4 text-text-green" />
                  <span className="font-semibold text-text-primary">Frete</span>
                </span>
                <span className="font-semibold text-text-primary">
                  {shipping ? normalizeCurrency(shipping) : '0.00'}
                </span>
              </p>

              <div className="h-px bg-text-primary/10" />

              <p className="mt-2 flex items-center justify-between text-base font-bold text-text-primary">
                <span>Total</span>
                <span>{normalizeCurrency(totalPrice)}</span>
              </p>
            </div>

            <ButtonDefault
              onClick={() => handleSubmitOrder()}
              className="mt-2 w-full"
              variant="primary"
              disabled={address?.length === 0 || addressSelected === false}
            >
              Fazer Pedido
            </ButtonDefault>
          </div>
        </article>
      </section>

      {(isLoading || loading) && <LoadingComponent mode="fullScreen" />}
    </main>
  );
}
