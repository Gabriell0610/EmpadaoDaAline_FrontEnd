import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { RequestInterface } from '@/utils/types/generics/request.type';
import { ListOrderByClient } from '@/utils/types/orderClient';

export function useOrder() {
  async function listOrderByClient({ token, idUser }: RequestInterface<null>) {
    const req = await fetch(`/api/order?idUser=${idUser}`, {
      method: 'GET',
      headers: {
        authorization: `${token}`,
        'Content-Type': 'application/json',
      },
    });

    const res: ApiResponse<ListOrderByClient[]> = await req.json();

    return res;
  }

  return {
    listOrderByClient,
  };
}
