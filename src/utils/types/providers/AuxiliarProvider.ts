import { Dispatch, SetStateAction } from 'react';
import { CartItemLocal } from './cartProvider.type';
import { Session } from 'next-auth';
import { Carrinho } from '../cart.type';

export interface AuxiliarCartGuestUserProviderInterface {
  itemsWithGuestUser: CartItemLocal[];
  setItemsWithGuestUser: Dispatch<SetStateAction<CartItemLocal[]>>;
}

export interface AuxiliarCartLoggedUserProviderInterface {
  session: Session | null;
  setItemsWithLoggedUser?: Dispatch<SetStateAction<Carrinho | null>>;
  itemsWithLoggedUser?: Carrinho | null;
  listCart: () => Promise<void>;
}
