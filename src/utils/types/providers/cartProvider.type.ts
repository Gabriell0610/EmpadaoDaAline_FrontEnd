import { Session } from 'next-auth';
import { ListActiveItemsByIdInterface } from '../items.type';
import { Carrinho } from '../cart.type';

export interface CartItemLocal {
  item: ListActiveItemsByIdInterface;
  quantity: number;
}

export interface CartContextType {
  itemsWithGuestUser: CartItemLocal[];
  itemsWithLoggedUser: Carrinho | null;
  addItemInCart: (itemId: string) => Promise<void>;
  incrementOrDecrementItemCart: (
    itemId: string,
    act: string,
  ) => Promise<void> | void;
  removeItemCart: (itemId: string) => Promise<void> | void;
  isLoading: boolean;
  quantity: number;
  session: Session | null;
}
