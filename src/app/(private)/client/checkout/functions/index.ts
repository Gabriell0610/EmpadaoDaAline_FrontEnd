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
import { useAuth } from '@/providers/authProvider';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import { AddressUserData } from '@/utils/schemas/address.schema';
import { OrderDto } from '@/utils/schemas/order.schema';
import { ListAddressUserById } from '@/utils/types/address.type';
import { OrderCreateReturnDto } from '@/utils/types/orderClient';
import { PaymenMethodsInterface } from '@/utils/types/paymentMethods.type';
import { PostShippingInterface } from '@/utils/types/shipping';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useClientCheckout() {
  const { call, isLoading } = useFetch();
  const [address, setAddress] = useState<ListAddressUserById[] | undefined>();
  const [paymentMethods, setPaymentMethods] =
    useState<PaymenMethodsInterface[]>();

  const [shipping, setShipping] = useState<string | null>(null);

  const { clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const listAddressByUserId = useCallback(async () => {
    if (!isAuthenticated) return;

    const res = await call<null, ListAddressUserById[] | undefined>({
      method: StatusHttp.GET,
      url: ADDRESS_ME,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    setAddress(res.data);
  }, [isAuthenticated, call]);

  const listAllPaymentMethods = useCallback(async () => {
    const res = await call<null, PaymenMethodsInterface[]>({
      method: StatusHttp.GET,
      url: PAYMENT_METHODS,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    setPaymentMethods(res.data);
  }, []);

  async function addAddress(addressDto: AddressUserData) {
    const res = await call<AddressUserData, null>({
      method: StatusHttp.POST,
      url: `${ADD_ADDRESS}`,
      body: addressDto,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    await listAddressByUserId();
  }

  async function calculateShipping(idAddress: string) {
    const res = await call<PostShippingInterface, null>({
      method: StatusHttp.POST,
      url: `${SHIPPING}`,
      body: { id: idAddress },
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    setShipping(res.data);
  }

  useEffect(() => {
    if (!isAuthenticated) return;

    Promise.all([listAddressByUserId(), listAllPaymentMethods()]);
  }, [isAuthenticated, listAddressByUserId, listAllPaymentMethods]);

  async function createOrder(orderDto: OrderDto) {
    const res = await call<OrderDto, OrderCreateReturnDto>({
      method: StatusHttp.POST,
      url: `${ORDER}`,
      body: orderDto,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      console.error(res.message);
      return;
    }

    toast.success(res.message);
    clearCart();
    return res.data;
  }

  async function removeAddress(addressId: string) {
    const previousAddress = address;
    setAddress((prev) => prev?.filter((item) => item.enderecoId !== addressId));

    const res = await call({
      method: StatusHttp.DELETE,
      url: `${USER}/${addressId}/address`,
    });

    if (!res.success) {
      setAddress(previousAddress);
      toast.error(getSafeErrorMessage(res.message));
      return false;
    }

    toast.success(res.message);
    await listAddressByUserId();
    return true;
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
