/* eslint-disable react-hooks/rules-of-hooks */
import Home from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export default async function HomePage() {
  const responseActiveItem = await listActiveItem();

  if (!responseActiveItem.success) {
    return;
  }

  return (
    <>
      <Header />
      <Home activeItems={responseActiveItem.data} />
      <Footer />
    </>
  );
}
