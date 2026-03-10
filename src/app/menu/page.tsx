import { listActiveItem } from '@/services/itemService';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import MenuClient from './clientPage';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default async function HomeMenu() {
  const responseActiveItem = await listActiveItem();

  if (!responseActiveItem.success) {
    return redirect('not-found');
  }

  const data: ListActiveItemsInterface[] = responseActiveItem.data;
  return (
    <>
      <Header />
      <MenuClient activeItems={data} />
      <Footer />
    </>
  );
}
