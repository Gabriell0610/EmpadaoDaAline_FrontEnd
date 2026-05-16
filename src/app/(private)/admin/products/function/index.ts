'use clien';
import { ITENS, ITENS_TYPES } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { useAuth } from '@/providers/authProvider';
import {
  EditItensSchemaDto,
  ItensSchemaDto,
} from '@/utils/schemas/itens.schema';
import { ListItemsInterface, TypeItem } from '@/utils/types/items.type';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NewItemRequest() {
  const { isAuthenticated } = useAuth();
  const { call, isLoading } = useFetch();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [listAllItens, setListAllItens] = useState<ListItemsInterface[]>([]);
  const [listTypeItemData, setTypesItem] = useState<TypeItem[]>([]);

  async function getAllItens() {
    const result = await call<null, ListItemsInterface[]>({
      method: StatusHttp.GET,
      url: `${ITENS}`,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setListAllItens(result.data);
  }

  async function listTypeItems() {
    const result = await call<null, TypeItem[]>({
      method: StatusHttp.GET,
      url: `${ITENS_TYPES}`,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setTypesItem(result.data);
  }

  async function changeStatusItem(itemId: string, status: string) {
    const result = await call<{ status: string }, null>({
      method: StatusHttp.PATCH,
      url: `${ITENS}/${itemId}`,
      body: { status: status },
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setListAllItens((prev) =>
      prev.map((item) =>
        item.item.some((optionItem) => optionItem.id === itemId)
          ? {
              ...item,
              disponivel: status,
            }
          : item,
      ),
    );

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
      return;
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
      return;
    }

    toast.success(result.message);
    await getAllItens();
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    getAllItens();
    listTypeItems();
  }, [isAuthenticated]);

  return {
    changeStatusItem,
    editItem,
    createItem,
    isLoading,
    listAllItens,
    selectedItem,
    setSelectedItem,
    listTypeItems,
    listTypeItemData,
  };
}
