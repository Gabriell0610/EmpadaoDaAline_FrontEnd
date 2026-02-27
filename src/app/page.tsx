import Home from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const responseActiveItem = await listActiveItem();
  if (!responseActiveItem.success) {
    return redirect('not-found');
  }

  return (
    <>
      <Header />
      <Home activeItems={responseActiveItem.data} />
      <Footer />
    </>
  );
}
