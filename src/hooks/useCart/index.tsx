/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateCartInteface,
  Carrinho,
  DecrementOrIncrementOrRemoveInterface,
} from '@/utils/types/cart.type';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { RequestInterface } from '@/utils/types/generics/request.type';

export function useCartHook() {
  async function createUserCart(data: RequestInterface<CreateCartInteface>) {
    const req = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        authorization: `${data.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.body),
    });

    const res: ApiResponse<any> = await req.json();

    return res;
  }

  async function listCartByUser(data: RequestInterface<any>) {
    const req = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        authorization: `${data.token}`,
        'Content-Type': 'application/json',
      },
    });

    const res: ApiResponse<Carrinho> = await req.json();

    return res;
  }

  async function incrementOrDecrementItemInCart(
    data: RequestInterface<DecrementOrIncrementOrRemoveInterface>,
    act: string,
  ) {
    const req = await fetch(
      `/api/cart?itemId=${data.body?.itemId}&action=${act}`,
      {
        method: 'PATCH',
        headers: {
          authorization: `${data.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const res: ApiResponse<string> = await req.json();

    return res;
  }

  async function removeItemCart(
    data: RequestInterface<DecrementOrIncrementOrRemoveInterface>,
  ) {
    const req = await fetch(`/api/cart?itemId=${data.body?.itemId}`, {
      method: 'DELETE',
      headers: {
        authorization: `${data.token}`,
        'Content-Type': 'application/json',
      },
    });
    const res: ApiResponse<string> = await req.json();

    return res;
  }

  return {
    createUserCart,
    listCartByUser,
    incrementOrDecrementItemInCart,
    removeItemCart,
  };
}
