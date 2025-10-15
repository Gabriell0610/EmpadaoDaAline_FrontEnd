'use client';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { getSafeErrorMessage } from '@/utils/helpers';
import { AuxiliarCartLoggedUserProviderInterface } from '@/utils/types/providers/AuxiliarProvider';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const AuxiliarCartLoggedUserProvider = ({
  session,
  listCart,
}: AuxiliarCartLoggedUserProviderInterface) => {
  const { call, isLoading } = useFetch();

  const handleLoggedAdd = useCallback(
    async (itemId: string) => {
      const res = await call({
        method: 'POST',
        token: session?.user.accessToken,
        body: { itemId, userId: session?.user.id || '' },
        url: 'cart',
      });

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        return;
      }

      await listCart();
    },
    [session?.user?.accessToken, session?.user?.id, call, listCart],
  );

  const incrementOrDecrementItemLoggedUser = async (
    act: string,
    itemId: string,
  ) => {
    const res = await call({
      token: session?.user.accessToken || '',
      body: { itemId: itemId },
      url: `cart/item/${itemId}/${act}`,
      method: 'PATCH',
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    await listCart();
  };

  const removeItemLoggedUser = async (itemId: string) => {
    const res = await call({
      method: 'DELETE',
      token: session?.user.accessToken || '',
      url: `cart/item/${itemId}`,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    await listCart();
  };

  return {
    handleLoggedAdd,
    incrementOrDecrementItemLoggedUser,
    removeItemLoggedUser,
    listCart,
    isLoading,
  };
};
