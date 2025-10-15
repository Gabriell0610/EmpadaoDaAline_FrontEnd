'use client';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { getSafeErrorMessage } from '@/utils/helpers';
import {
  BodyItemInterface,
  ListActiveItemsByIdInterface,
} from '@/utils/types/items.type';
import { AuxiliarCartGuestUserProviderInterface } from '@/utils/types/providers/AuxiliarProvider';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const AuxiliarCartGuestUserProvider = ({
  itemsWithGuestUser,
  setItemsWithGuestUser,
}: AuxiliarCartGuestUserProviderInterface) => {
  const { call, isLoading } = useFetch();

  const handleGuestAdd = useCallback(
    async (itemId: string) => {
      const response = await call<
        BodyItemInterface,
        ListActiveItemsByIdInterface
      >({
        method: 'GET',
        url: `itens/${itemId}`,
        body: { itemId },
      });

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
    },
    [itemsWithGuestUser, setItemsWithGuestUser, call],
  );

  const incrementOrDecrementItemGuestUser = (act: string, itemId: string) => {
    const updatedItems = itemsWithGuestUser
      .map((item) => {
        if (item.item.id === itemId) {
          const newQuantity =
            act === 'increment' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQuantity }; // atualiza a quantidade
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // remove itens com quantidade 0

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
