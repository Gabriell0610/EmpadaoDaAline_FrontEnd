import { Header } from '@/components/Header/Header';
import { authOptions } from '@/libs/auth';
import { listActiveItem } from '@/services/itemService';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { getServerSession } from 'next-auth';
import MenuClient from './clientPage';

export default async function HomeMenu() {
  const session = await getServerSession(authOptions);
  const res = await listActiveItem();

  const data: ListActiveItemsInterface[] = res.data;
  return (
    <>
      <Header session={session} />
      <MenuClient data={data} />
    </>
  );
}
