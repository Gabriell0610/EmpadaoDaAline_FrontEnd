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
import { Trash2 } from 'lucide-react';
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
  } = useClientCheckout();

  const { isLoading: loading, setIsLoading } = useContext(LoadingContext);

  const { itemsWithLoggedUser } = useCart();
  const navigate = useRouter();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [addressId, setAddressId] = useState('');

  const addressFormMethodsRef = useRef<UseFormReturn<AddressUserData> | null>(
    null,
  );

  const [addressSelected, setAddressSelected] = useState(false);

  //zustand
  const orderDetails = useOrderStore((state) => state.order);

  useEffect(() => {
    if (!itemsWithLoggedUser) return;
    const total =
      (Number(itemsWithLoggedUser?.valorTotal) || 0) + (Number(shipping) || 0);
    setTotalPrice(total);
  }, [shipping, itemsWithLoggedUser]);

  const paymentMethod = paymentMethods?.find(
    (data) => data.id === orderDetails?.idPaymentMethod,
  );

  const calculateTotalPrice = (addressId: string) => {
    setAddressId(addressId);
    calculateShipping(addressId);
    setAddressSelected(true);
    addressFormMethodsRef.current?.reset();
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
    navigate.push(`/client/orders/${order?.id}`);
  }

  return (
    <main className="flex flex-col gap-10 md2:flex-row md2:items-start md2:gap-12 lg:gap-20">
      <section className="w-full md2:w-[60%] lg:w-[55%]">
        <BackPageButton />
        <TitleH1 className="mb-2">Endereço de entrega</TitleH1>
        <div>
          <div className="mb-4 flex flex-col gap-2 rounded-md border border-text-secondary p-3">
            <p className="mb-1 font-semibold">Selecione um endereço:</p>

            {address && address.length > 0 ? (
              address.map((address) => (
                <div className="flex justify-between" key={address.endereco.id}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={address.endereco.id}
                      className="h-4 w-4"
                      onClick={() => calculateTotalPrice(address.endereco.id)}
                    />
                    <span className="text-sm text-text-secondary">
                      {address.endereco.rua}, {address.endereco.numero} -{' '}
                      {address.endereco.bairro}, {address.endereco.cidade} -{' '}
                      {address.endereco.estado} (CEP {address.endereco.cep})
                    </span>
                  </label>
                  <Trash2
                    size={18}
                    color="#b81414"
                    className="cursor-pointer"
                    onClick={() => removeAddress(address.enderecoId)}
                  />
                </div>
              ))
            ) : (
              <div>
                <p className="mb-1 font-semibold text-blue-600">
                  Adicione um novo endereço para prosseguir
                </p>
              </div>
            )}
          </div>
          <div>
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
                        type="number"
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
                    >
                      Salvar Endereço
                    </ButtonDefault>
                  </>
                );
              }}
            </DefaultForm>
          </div>
        </div>
      </section>
      <section className="mt-7 w-full md2:w-[40%] lg:w-[35%]">
        <TitleH1 className="mb-2">Resumo do pedido</TitleH1>
        <TitleH4 className="mb-1">Produtos</TitleH4>
        <div className="flex flex-col gap-2">
          {itemsWithLoggedUser?.carrinhoItens &&
            itemsWithLoggedUser?.carrinhoItens.map((item) => (
              <div key={item.id}>
                <p>
                  {formartQuantityItem(item)}x {item.item.itemDescription.nome}
                </p>
              </div>
            ))}
          <hr />
          <p>
            {' '}
            <span className="font-semibold">Data de entrega: </span>{' '}
            {formatDatePtBr(orderDetails?.schedulingDate || '')}
          </p>
          <p>
            <span className="font-semibold"> Horário de entrega entre: </span>{' '}
            {orderDetails?.startTime} - {orderDetails?.endTime}
          </p>
          <p>
            <span className="font-semibold">Método de pagamento: </span>
            {paymentMethod?.nome ? paymentMethod.nome : WITHOUTCONTENT}
          </p>
          <p>
            <span className="font-semibold">Observação: </span>
            {orderDetails?.observation
              ? orderDetails.observation
              : 'sem observação...'}
          </p>
          <hr />
          <p className="font-semibold">
            Subtotal:{' '}
            {normalizeCurrency(
              itemsWithLoggedUser?.valorTotal
                ? itemsWithLoggedUser?.valorTotal
                : '0',
            )}
          </p>
          <p>
            <span className="font-semibold">
              Frete: {shipping ? normalizeCurrency(shipping) : '0.00'}
            </span>
          </p>
          <p className="font-semibold">
            Total: {normalizeCurrency(totalPrice)}
          </p>
          <hr />
          <ButtonDefault
            onClick={() => handleSubmitOrder()}
            className="mt-4"
            variant="primary"
            disabled={address?.length === 0 || addressSelected === false}
          >
            Fazer Pedido
          </ButtonDefault>
        </div>
      </section>
      {(isLoading || loading) && <LoadingComponent mode="fullScreen" />}
    </main>
  );
}
