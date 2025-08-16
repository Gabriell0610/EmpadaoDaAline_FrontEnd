import { listActiveItem } from '@/services/itemService';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import MenuClient from './clientPage';
import { Header } from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { Footer } from '@/components/Footer/Footer';
export default async function HomeMenu() {
  const session = await getServerSession(authOptions);
  const res = await listActiveItem();

  const data: ListActiveItemsInterface[] = res.data;
  return (
    <>
      <Header session={session} />
      <MenuClient data={data} />
      <Footer />
    </>
  );
}
