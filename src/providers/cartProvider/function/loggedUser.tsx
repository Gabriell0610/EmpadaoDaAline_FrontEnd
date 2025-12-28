'use client';
import { CART, CART_ITEM } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { getSafeErrorMessage } from '@/utils/helpers';
import { AuxiliarCartLoggedUserProviderInterface } from '@/utils/types/providers/AuxiliarProvider';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const AuxiliarLoggedUserProviderCart = ({
  session,
  listCart,
}: AuxiliarCartLoggedUserProviderInterface) => {
  const { call, isLoading } = useFetch();

  const handleItemAdd = useCallback(
    async (itemId: string) => {
      const res = await call({
        method: StatusHttp.POST,
        token: session?.user.accessToken,
        body: { itemId, userId: session?.user.id },
        url: CART,
      });

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        return;
      }

      await listCart();
    },
    [session?.user?.accessToken, session?.user?.id, call, listCart],
  );

  const incrementOrDecrementItem = async (act: string, itemId: string) => {
    const res = await call({
      token: session?.user.accessToken || '',
      body: { itemId: itemId },
      url: `${CART_ITEM}/${itemId}/${act}`,
      method: StatusHttp.PATCH,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    await listCart();
  };

  const removeItem = async (itemId: string) => {
    const res = await call({
      method: StatusHttp.DELETE,
      token: session?.user.accessToken || '',
      url: `${CART_ITEM}/${itemId}`,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    await listCart();
  };

  return {
    handleItemAdd,
    incrementOrDecrementItem,
    removeItem,
    listCart,
    isLoading,
  };
};
