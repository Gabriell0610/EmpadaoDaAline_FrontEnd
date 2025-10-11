/* eslint-disable react-hooks/rules-of-hooks */
import Home from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { Footer } from '@/components/Footer/Footer';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const responseActiveItem = await listActiveItem();

  if (!responseActiveItem.success) {
    console.error(responseActiveItem.message);
  }

  return (
    <>
      <Header session={session} />
      <Home activeItems={responseActiveItem.data} />
      <Footer />
    </>
  );
}
