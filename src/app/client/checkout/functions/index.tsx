import {
  ADD_ADDRESS,
  ADDRESS_ME,
  ORDER,
  PAYMENT_METHODS,
  SHIPPING,
} from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { addressUserData } from '@/utils/schemas/address.schema';
import { OrderDto } from '@/utils/schemas/order.schema';
import { ListAddressUserById } from '@/utils/types/address.type';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { PaymenMethodsInterface } from '@/utils/types/paymentMethods.type';
import { PostShippingInterface } from '@/utils/types/shipping';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useClientCheckout({ session }: ProfilePageProps) {
  const { call, isLoading } = useFetch();
  const [address, setAddress] = useState<ListAddressUserById[] | undefined>();
  const [paymentMethods, setPaymentMethods] =
    useState<PaymenMethodsInterface[]>();

  const [shipping, setShipping] = useState<number | null>(null);

  async function listAddressByUserId() {
    const res = await call<null, ListAddressUserById[] | undefined>({
      method: StatusHttp.GET,
      url: `${ADDRESS_ME}`,
      token: session?.user.accessToken,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    console.log('dados: ', res.data);

    setAddress(res.data);
  }

  async function listAllPaymentMethods() {
    const res = await call<null, PaymenMethodsInterface[]>({
      method: StatusHttp.GET,
      url: `${PAYMENT_METHODS}`,
      token: session?.user.accessToken,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    console.log('dados: ', res.data);
    setPaymentMethods(res.data);
  }

  async function addAddress(addressDto: addressUserData) {
    console.log('testando envio de endereco', addressDto);
    const res = await call<addressUserData, null>({
      method: StatusHttp.POST,
      url: `${ADD_ADDRESS}`,
      token: session?.user.accessToken,
      body: addressDto,
    });

    if (!res.success) {
      toast.error(res.message);
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
      toast.error(res.message);
      return;
    }

    console.log('frete ap´s selecionar endereco: ', res.data);
    setShipping(res.data);
  }
  useEffect(() => {
    listAddressByUserId();
    listAllPaymentMethods();
  }, []);

  async function createOrder(orderDto: OrderDto) {
    const res = await call<OrderDto, null>({
      method: StatusHttp.POST,
      url: `${ORDER}`,
      token: session?.user.accessToken,
      body: orderDto,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    console.log('dados: ', res.data);
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
  };
}
