/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITENS_ACTIVE } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { baseUrl } from '@/utils/helpers';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { ListActiveItemsInterface } from '@/utils/types/items.type';

export async function listActiveItem(): Promise<
  ApiResponse<ListActiveItemsInterface[]>
> {
  try {
    const req = await fetch(`${baseUrl()}/${ITENS_ACTIVE}`, {
      method: StatusHttp.GET,
      next: { revalidate: 300 },
    });

    const response: ApiResponse<ListActiveItemsInterface[]> = await req.json();

    if (req.status >= 400) {
      return { ...response, success: false };
    }

    return { ...response, success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, data: [], message: 'Serviço indisponível' };
  }
}
