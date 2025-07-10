'use client';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useItems } from '@/hooks/useItems';
import { useSession } from 'next-auth/react';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { useCartHook } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { Carrinho } from '@/utils/types/cart.type';
import { getSafeErrorMessage } from '@/utils/helpers';
import {
  CartContextType,
  CartItemLocal,
} from '@/utils/types/providers/cartProvider.type';

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: SomeChildrenInterface) => {
  const { data: session } = useSession();
  const { listItemById } = useItems();
  const {
    createUserCart,
    listCartByUser,
    incrementOrDecrementItemInCart,
    removeItemCart,
  } = useCartHook();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [quantity, setQuantity] = useState(0);
  const [itemsLocal, setItemsLocal] = useState<CartItemLocal[]>([]);
  const [itemsCartApi, setItemsCartApi] = useState<Carrinho | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart-items');
      setItemsLocal(stored ? JSON.parse(stored) : []);
    } catch {
      setItemsLocal([]);
    }
  }, []);

  useEffect(() => {
    if (!session?.user.id) {
      const timeout = setTimeout(() => {
        localStorage.setItem('cart-items', JSON.stringify(itemsLocal));
        const quantity = itemsLocal.reduce(
          (acc, curr) => acc + curr.quantity,
          0,
        );
        setQuantity(quantity > 0 ? quantity : 0);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      const quantity = itemsCartApi?.carrinhoItens.reduce(
        (acc, curr) => acc + curr.quantidade,
        0,
      );
      setQuantity(quantity || 0);
    }
  }, [itemsLocal, itemsCartApi, session]);

  useEffect(() => {
    listCart();
  }, [session]);

  const listCart = useCallback(async () => {
    const token = session?.user?.accessToken || '';

    const res = await listCartByUser({ token });

    if (!res.data) {
      console.warn('Usuário sem dados no carrinho.');
      return;
    }

    console.log('ANTES do set:', itemsCartApi);
    setItemsCartApi(res.data);
    console.log('Novo carrinhoSimplificado:', res.data);
  }, [listCartByUser, itemsCartApi, session?.user?.accessToken]);

  // Função para adicionar item ao carrinho
  const addItemById = useCallback(
    async (itemId: string) => {
      if (!session?.user?.id) {
        setIsLoading(true);

        const response = await listItemById(itemId);

        const existingIndex = itemsLocal.findIndex(
          (cartItem) => cartItem.item?.id === response.data.id,
        );

        if (existingIndex >= 0) {
          const updatedItems = [...itemsLocal];
          updatedItems[existingIndex].quantity += 1;
          setItemsLocal(updatedItems);
        } else {
          setItemsLocal((prevItems) => [
            ...prevItems,
            { item: response.data, quantity: 1 },
          ]);
        }

        setIsLoading(false);
      } else {
        try {
          setIsLoading(true);
          const res = await createUserCart({
            token: session.user.accessToken,
            body: { itemId: itemId, userId: session.user.id },
          });

          if (!res.success) {
            toast.error('Erro ao criar Carrinho. Entre em contato com suporte');
          } else {
            await listCart();
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [
      session?.user?.id,
      session?.user.accessToken,
      listItemById,
      createUserCart,
      setIsLoading,
      listCart,
      itemsLocal,
    ],
  );

  const incrementOrDecrementItem = async (act: string, itemId: string) => {
    if (!session?.user.id) {
      const updatedItems = itemsLocal.map((item) => {
        if (item.item.id === itemId) {
          const newQuantity =
            act === 'increment' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
      setItemsLocal(updatedItems);
    } else {
      setIsLoading(true);
      const res = await incrementOrDecrementItemInCart(
        {
          token: session.user.accessToken,
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
    }
  };

  const removeItem = async (itemId: string) => {
    if (!session?.user.id) {
      const updatedItems = itemsLocal.filter((item) => item.item.id !== itemId);
      setItemsLocal(updatedItems);
    } else {
      setIsLoading(true);
      const res = await removeItemCart({
        token: session.user.accessToken,
        body: { itemId: itemId },
      });

      if (res.success) {
        await listCart();
        console.log(res.message);
      } else {
        toast.error(getSafeErrorMessage(res.message));
      }
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        session,
        itemsLocal,
        itemsCartApi,
        isLoading,
        quantity,
        addItemById,
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
