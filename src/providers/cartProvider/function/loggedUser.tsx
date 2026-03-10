'use client';
import { CART, CART_ITEM } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { useAuth } from '@/providers/authProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import { AuxiliarCartLoggedUserProviderInterface } from '@/utils/types/providers/AuxiliarProvider';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const AuxiliarLoggedUserProviderCart = ({
  listCart,
}: AuxiliarCartLoggedUserProviderInterface) => {
  const { call, isLoading } = useFetch();
  const { user } = useAuth();

  const handleItemAdd = useCallback(
    async (itemId: string) => {
      const res = await call({
        method: StatusHttp.POST,
        body: { itemId, userId: user?.id },
        url: CART,
      });

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        return;
      }

      await listCart();
    },
    [call, listCart, user?.id],
  );

  const incrementOrDecrementItem = async (act: string, itemId: string) => {
    const res = await call({
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
