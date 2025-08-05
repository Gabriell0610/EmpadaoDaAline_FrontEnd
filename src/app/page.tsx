/* eslint-disable react-hooks/rules-of-hooks */
import Home from './clientPage';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { listActiveItem } from '@/services/itemService';

export default async function HomePage() {
  const res = await listActiveItem();

  const data: ListActiveItemsInterface[] = res.data;
  return (
    <>
      <Home data={data} />
    </>
  );
}
