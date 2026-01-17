import {
  ADD_ADDRESS,
  ADDRESS_ME,
  ORDER,
  PAYMENT_METHODS,
  SHIPPING,
  USER,
} from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import { AddressUserData } from '@/utils/schemas/address.schema';
import { OrderDto } from '@/utils/schemas/order.schema';
import { ListAddressUserById } from '@/utils/types/address.type';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { OrderCreateReturnDto } from '@/utils/types/orderClient';
import { PaymenMethodsInterface } from '@/utils/types/paymentMethods.type';
import { PostShippingInterface } from '@/utils/types/shipping';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useClientCheckout({ session }: ProfilePageProps) {
  const { call, isLoading } = useFetch();
  const [address, setAddress] = useState<ListAddressUserById[] | undefined>();
  const [paymentMethods, setPaymentMethods] =
    useState<PaymenMethodsInterface[]>();

  const [shipping, setShipping] = useState<string | null>(null);

  const { clearCart } = useCart();

  const listAddressByUserId = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    const res = await call<null, ListAddressUserById[] | undefined>({
      method: StatusHttp.GET,
      url: ADDRESS_ME,
      token: session.user.accessToken,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    setAddress(res.data);
  }, [session?.user?.accessToken]);

  const listAllPaymentMethods = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    const res = await call<null, PaymenMethodsInterface[]>({
      method: StatusHttp.GET,
      url: PAYMENT_METHODS,
      token: session.user.accessToken,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    setPaymentMethods(res.data);
  }, [session?.user?.accessToken]);

  async function addAddress(addressDto: AddressUserData) {
    console.log('testando envio de endereco', addressDto);
    const res = await call<AddressUserData, null>({
      method: StatusHttp.POST,
      url: `${ADD_ADDRESS}`,
      token: session?.user.accessToken,
      body: addressDto,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    console.log('dados: ', res.data);
    await listAddressByUserId();
  }

  async function calculateShipping(idAddress: string) {
    console.log(idAddress);
    const res = await call<PostShippingInterface, null>({
      method: StatusHttp.POST,
      url: `${SHIPPING}`,
      token: session?.user.accessToken,
      body: { id: idAddress },
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    console.log('frete ao selecionar endereco: ', res.data);
    setShipping(res.data);
  }

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    Promise.all([listAddressByUserId(), listAllPaymentMethods()]);
  }, [session?.user?.accessToken, listAddressByUserId, listAllPaymentMethods]);

  async function createOrder(orderDto: OrderDto) {
    const res = await call<OrderDto, OrderCreateReturnDto>({
      method: StatusHttp.POST,
      url: `${ORDER}`,
      token: session?.user.accessToken,
      body: orderDto,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    toast.success(res.message);
    clearCart();
    return res.data;
  }

  async function removeAddress(addressId: string) {
    const res = await call({
      method: StatusHttp.DELETE,
      url: `${USER}/${addressId}/address`,
      token: session?.user.accessToken,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    toast.success(res.message);
    await listAddressByUserId();
  }

  return {
    isLoading,
    address,
    paymentMethods,
    shipping,
    addAddress,
    calculateShipping,
    setShipping,
    createOrder,
    removeAddress,
  };
}
