import Home from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { notFound } from 'next/navigation';

export default async function HomePage() {
  try {
    const responseActiveItem = await listActiveItem();

    return (
      <>
        <Header />
        <Home activeItems={responseActiveItem.data} />
        <Footer />
      </>
    );
  } catch {
    notFound();
  }
}
