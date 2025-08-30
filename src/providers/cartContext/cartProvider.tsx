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
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { Carrinho } from '@/utils/types/cart.type';
import {
  CartContextType,
  CartItemLocal,
} from '@/utils/types/providers/cartProvider.type';
import { AuxiliarCartGuestUserProvider } from './function/guestUser';
import { AuxiliarCartLoggedUserProvider } from './function/loggedUser';
import toast from 'react-hot-toast';
import { getSafeErrorMessage } from '@/utils/helpers';
import { useCartHook } from '@/hooks/useCart';

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: SomeChildrenInterface) => {
  const { data: session } = useSession();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [quantity, setQuantity] = useState(0);
  const [itemsWithGuestUser, setItemsWithGuestUser] = useState<CartItemLocal[]>(
    [],
  );
  const [itemsWithLoggedUser, setItemsWithLoggedUser] =
    useState<Carrinho | null>(null);

  const { listCartByUser } = useCartHook();

  const {
    handleGuestAdd,
    incrementOrDecrementItemGuestUser,
    removeItemGuestUser,
  } = AuxiliarCartGuestUserProvider({
    itemsWithGuestUser,
    setItemsWithGuestUser,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart-items');
      setItemsWithGuestUser(stored ? JSON.parse(stored) : []);
    } catch {
      setItemsWithGuestUser([]);
    }
  }, []);

  useEffect(() => {
    if (!session?.user.accessToken) {
      const timeout = setTimeout(() => {
        localStorage.setItem('cart-items', JSON.stringify(itemsWithGuestUser));
        const quantity = itemsWithGuestUser.reduce(
          (acc, curr) => acc + curr.quantity,
          0,
        );
        setQuantity(quantity > 0 ? quantity : 0);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      const quantity = itemsWithLoggedUser?.carrinhoItens.reduce(
        (acc, curr) => acc + curr.quantidade,
        0,
      );
      setQuantity(quantity || 0);
    }
  }, [itemsWithGuestUser, itemsWithLoggedUser, session?.user.accessToken]);

  const listCart = useCallback(async () => {
    try {
      const token = session?.user?.accessToken || '';
      const res = await listCartByUser({ token });

      if (!res.data) {
        console.warn('Usuário sem dados no carrinho.');
        return;
      }

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        return;
      }

      setItemsWithLoggedUser(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [listCartByUser]);

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
