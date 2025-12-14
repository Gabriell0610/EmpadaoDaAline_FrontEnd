import { ITENS_ACTIVE } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { baseUrl } from '@/utils/helpers';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { ListActiveItemsInterface } from '@/utils/types/items.type';

export async function listActiveItem(): Promise<
  ApiResponse<ListActiveItemsInterface[]>
> {
  const req = await fetch(`${baseUrl()}/${ITENS_ACTIVE}`, {
    method: StatusHttp.GET,
  });

  const response: ApiResponse<ListActiveItemsInterface[]> = await req.json();

  if (req.status >= 400) {
    const error = { ...response, success: false };
    return error;
  }
  return response;
}
