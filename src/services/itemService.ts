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

    if (!req.ok) {
      throw new Error(`Erro na API: ${req.status}`);
    }

    const response = await req.json().catch(() => {
      throw new Error('Invalid JSON');
    });

    return { ...response, success: true };
  } catch (error) {
    console.error('HomePage error:', error);
    throw error;
  }
}
