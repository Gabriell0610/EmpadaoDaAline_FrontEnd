'use clien';
import { ITENS, ITENS_ACTIVE } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { useAuth } from '@/providers/authProvider';
import {
  EditItensSchemaDto,
  ItensSchemaDto,
} from '@/utils/schemas/itens.schema';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NewItemRequest() {
  const { isAuthenticated } = useAuth();
  const { call, isLoading } = useFetch();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [listAllItens, setListAllItens] = useState<
    ListActiveItemsInterface[] | null
  >(null);
  async function getAllItens() {
    const result = await call<null, ListActiveItemsInterface[]>({
      method: StatusHttp.GET,
      url: `${ITENS_ACTIVE}`,
    });

    if (!result.success) {
      toast.error(result.message);
    }
    setListAllItens(result.data);
  }

  async function inativeItem(itemId: string) {
    const result = await call<null, null>({
      method: StatusHttp.PATCH,
      url: `${ITENS}/${itemId}`,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    toast.success(result.message);
  }

  async function editItem(itemId: string, data: EditItensSchemaDto) {
    const result = await call<EditItensSchemaDto, null>({
      method: StatusHttp.PUT,
      url: `${ITENS}/${itemId}`,
      body: data,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    toast.success(result.message);
    await getAllItens();
  }

  async function createItem(data: ItensSchemaDto) {
    const result = await call<ItensSchemaDto, null>({
      method: StatusHttp.POST,
      url: `${ITENS}`,
      body: data,
    });

    if (!result.success) {
      toast.error(result.message);
    }

    toast.success(result.message);
    await getAllItens();
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    getAllItens();
  }, [isAuthenticated]);

  return {
    inativeItem,
    editItem,
    createItem,
    isLoading,
    listAllItens,
    selectedItem,
    setSelectedItem,
  };
}
