import { Session } from 'next-auth';
import { ListActiveItemsByIdInterface } from '../items.type';
import { Carrinho } from '../cart.type';

export interface CartItemLocal {
  item: ListActiveItemsByIdInterface;
  quantity: number;
}

export interface CartContextType {
  itemsLocal: CartItemLocal[];
  itemsCartApi: Carrinho | null;
  addItemById: (itemId: string) => Promise<void>;
  incrementOrDecrementItem: (
    itemId: string,
    act: string,
  ) => Promise<void> | void;
  removeItem: (itemId: string) => Promise<void> | void;
  isLoading: boolean;
  quantity: number;
  session: Session | null;
}
