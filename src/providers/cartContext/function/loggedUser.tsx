'use client';
import { useCartHook } from '@/hooks/useCart';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import { Carrinho } from '@/utils/types/cart.type';
import { Session } from 'next-auth';
import { Dispatch, SetStateAction, useCallback, useContext } from 'react';
import toast from 'react-hot-toast';

interface AuxiliarCartLoggedUserProviderInterface {
  session: Session | null;
  setItemsWithLoggedUser?: Dispatch<SetStateAction<Carrinho | null>>;
  itemsWithLoggedUser?: Carrinho | null;
  listCart: () => Promise<void>;
}

export const AuxiliarCartLoggedUserProvider = ({
  session,
  listCart,
}: AuxiliarCartLoggedUserProviderInterface) => {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { createUserCart } = useCartHook();
  const { incrementOrDecrementItemInCart, removeItemCart } = useCartHook();

  const handleLoggedAdd = useCallback(
    async (itemId: string) => {
      try {
        setIsLoading(true);
        const res = await createUserCart({
          token: session?.user.accessToken || '',
          body: { itemId, userId: session?.user.id || '' },
        });

        if (!res.success) {
          toast.error(getSafeErrorMessage(res.message));
          return;
        }

        await listCart();
      } catch (error) {
        console.error(error);
        toast.error(getSafeErrorMessage());
      } finally {
        setIsLoading(false);
      }
    },
    [
      session?.user?.accessToken,
      session?.user?.id,
      createUserCart,
      listCart,
      setIsLoading,
    ],
  );

  const incrementOrDecrementItemLoggedUser = async (
    act: string,
    itemId: string,
  ) => {
    try {
      setIsLoading(true);
      const res = await incrementOrDecrementItemInCart(
        {
          token: session?.user.accessToken || '',
          body: { itemId: itemId },
        },
        act,
      );

      if (res.success) {
        await listCart();
      } else {
        toast.error(getSafeErrorMessage(res.message));
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(getSafeErrorMessage());
    }
  };

  const removeItemLoggedUser = async (itemId: string) => {
    try {
      setIsLoading(true);
      const res = await removeItemCart({
        token: session?.user.accessToken || '',
        body: { itemId: itemId },
      });

      if (res.success) {
        await listCart();
      } else {
        toast.error(getSafeErrorMessage(res.message));
      }
    } catch (error) {
      console.error(error);
      toast.error(getSafeErrorMessage());
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLoggedAdd,
    incrementOrDecrementItemLoggedUser,
    removeItemLoggedUser,
    listCart,
    isLoading,
  };
};
