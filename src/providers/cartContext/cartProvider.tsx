'use client';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSession } from 'next-auth/react';
import { Carrinho } from '@/utils/types/cart.type';
import {
  CartContextType,
  CartItemLocal,
} from '@/utils/types/providers/cartProvider.type';
import { AuxiliarCartGuestUserProvider } from './function/guestUser';
import { AuxiliarCartLoggedUserProvider } from './function/loggedUser';
import toast from 'react-hot-toast';
import { getSafeErrorMessage } from '@/utils/helpers';
import { StatusCart } from '@/constants/enums/StatusCart';
import { useFetch } from '@/hooks/useFetch/useFetch';

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: SomeChildrenInterface) => {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(0);
  const [itemsWithGuestUser, setItemsWithGuestUser] = useState<CartItemLocal[]>(
    [],
  );
  const [itemsWithLoggedUser, setItemsWithLoggedUser] =
    useState<Carrinho | null>(null);

  const { call, isLoading } = useFetch();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart-items');
      setItemsWithGuestUser(stored ? JSON.parse(stored) : []);
    } catch {
      setItemsWithGuestUser([]);
    }
  }, []);

  const {
    handleGuestAdd,
    incrementOrDecrementItemGuestUser,
    removeItemGuestUser,
  } = AuxiliarCartGuestUserProvider({
    itemsWithGuestUser,
    setItemsWithGuestUser,
  });

  useEffect(() => {
    let newQuantity: number = 0;
    if (!session?.user.accessToken) {
      localStorage.setItem('cart-items', JSON.stringify(itemsWithGuestUser));
      itemsWithGuestUser
        .map((item) => {
          if (item.item.unidades && item.quantity > 1) {
            return (newQuantity! += 1);
          } else {
            return (newQuantity! += item.quantity);
          }
        })
        .reduce((a, b) => a + b, 0);
      setQuantity(newQuantity > 0 ? newQuantity : 0);
    } else {
      itemsWithLoggedUser?.carrinhoItens
        .map((item) => {
          if (item.item.unidades && item.quantidade > 1) {
            return (newQuantity! += 1);
          } else {
            return (newQuantity! += item.quantidade);
          }
        })
        .reduce((a, b) => a + b, 0);

      setQuantity(newQuantity || 0);
    }
  }, [itemsWithGuestUser, itemsWithLoggedUser, session?.user.accessToken]);

  const listCart = useCallback(async () => {
    const token = session?.user?.accessToken || '';
    const res = await call<null, Carrinho>({
      token,
      method: 'GET',
      url: `cart`,
    });

    if (!res.data) {
      console.warn('Usuário sem dados no carrinho.');
      return;
    }

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    if (res.data.status === StatusCart.FINALIZADO) {
      return setItemsWithLoggedUser(null);
    }

    setItemsWithLoggedUser(res.data);
  }, [call]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      listCart();
    }
  }, [session?.user?.accessToken]);

  const {
    handleLoggedAdd,
    incrementOrDecrementItemLoggedUser,
    removeItemLoggedUser,
  } = AuxiliarCartLoggedUserProvider({
    session,
    listCart,
  });

  const addItemInCart = useCallback(
    async (itemId: string) => {
      if (!session?.user?.accessToken) {
        await handleGuestAdd(itemId);
      } else {
        await handleLoggedAdd(itemId);
      }
    },
    [handleGuestAdd, handleLoggedAdd, session?.user?.accessToken],
  );

  const incrementOrDecrementItem = async (act: string, itemId: string) => {
    if (!session?.user.accessToken) {
      incrementOrDecrementItemGuestUser(act, itemId);
    } else {
      await incrementOrDecrementItemLoggedUser(act, itemId);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!session?.user.accessToken) {
      removeItemGuestUser(itemId);
    } else {
      await removeItemLoggedUser(itemId);
    }
  };

  return (
    <CartContext.Provider
      value={{
        session,
        itemsWithGuestUser,
        itemsWithLoggedUser,
        isLoading,
        quantity,
        addItemInCart,
        incrementOrDecrementItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro do CartProvider');
  }
  return context;
}
