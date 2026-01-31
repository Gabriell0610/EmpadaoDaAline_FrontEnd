/* eslint-disable react-hooks/rules-of-hooks */
import Home from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const token = cookies().get('access_token');

  if (!token) {
    redirect('/login');
  }

  const responseActiveItem = await listActiveItem();

  if (!responseActiveItem.success) {
    console.error(responseActiveItem.message);
  }

  return (
    <>
      <Header />
      <Home activeItems={responseActiveItem.data} />
      <Footer />
    </>
  );
}
