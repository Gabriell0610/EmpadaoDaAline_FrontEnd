/* eslint-disable react-hooks/rules-of-hooks */
import Home from './clientPage';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { Footer } from '@/components/Footer/Footer';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const res = await listActiveItem();

  const data: ListActiveItemsInterface[] = res.data;
  return (
    <>
      <Header session={session} />
      <Home data={data} />
      <Footer />
    </>
  );
}
