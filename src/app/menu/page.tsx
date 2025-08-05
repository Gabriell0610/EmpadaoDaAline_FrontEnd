import { listActiveItem } from '@/services/itemService';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import MenuClient from './clientPage';

export default async function HomeMenu() {
  const res = await listActiveItem();

  const data: ListActiveItemsInterface[] = res.data;
  return (
    <>
      <MenuClient data={data} />
    </>
  );
}
