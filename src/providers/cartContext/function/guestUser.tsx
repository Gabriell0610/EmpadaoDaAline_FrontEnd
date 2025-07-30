'use client';
import { useItems } from '@/hooks/useItems';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import { CartItemLocal } from '@/utils/types/providers/cartProvider.type';
import { Dispatch, SetStateAction, useCallback, useContext } from 'react';
import toast from 'react-hot-toast';

interface AuxiliarCartGuestUserProviderInterface {
  itemsWithGuestUser: CartItemLocal[];
  setItemsWithGuestUser: Dispatch<SetStateAction<CartItemLocal[]>>;
}

export const AuxiliarCartGuestUserProvider = ({
  itemsWithGuestUser,
  setItemsWithGuestUser,
}: AuxiliarCartGuestUserProviderInterface) => {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { listItemById } = useItems();

  const handleGuestAdd = useCallback(
    async (itemId: string) => {
      try {
        setIsLoading(true);
        const response = await listItemById(itemId);

        if (!response.success) {
          toast.error(getSafeErrorMessage(response.message));
          return;
        }

        const existingIndex = itemsWithGuestUser.findIndex(
          (cartItem) => cartItem.item?.id === response.data.id,
        );

        if (existingIndex >= 0) {
          const updatedItems = [...itemsWithGuestUser];
          updatedItems[existingIndex].quantity += 1;
          setItemsWithGuestUser(updatedItems);
        } else {
          setItemsWithGuestUser((prevItems) => [
            ...prevItems,
            { item: response.data, quantity: 1 },
          ]);
        }
      } catch (error) {
        console.log(error);
        toast.error(getSafeErrorMessage());
      } finally {
        setIsLoading(false);
      }
    },
    [itemsWithGuestUser, listItemById, setIsLoading, setItemsWithGuestUser],
  );

  const incrementOrDecrementItemGuestUser = (act: string, itemId: string) => {
    const updatedItems = itemsWithGuestUser.map((item) => {
      if (item.item.id === itemId) {
        const newQuantity =
          act === 'increment' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    });
    setItemsWithGuestUser(updatedItems);
  };

  const removeItemGuestUser = (itemId: string) => {
    const updatedItems = itemsWithGuestUser.filter(
      (item) => item.item.id !== itemId,
    );
    setItemsWithGuestUser(updatedItems);
  };

  return {
    handleGuestAdd,
    incrementOrDecrementItemGuestUser,
    removeItemGuestUser,
    isLoading,
  };
};
