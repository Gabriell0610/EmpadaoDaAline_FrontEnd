/* eslint-disable react-hooks/rules-of-hooks */
import Home from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const responseActiveItem = await listActiveItem();
  let successRequest: boolean | null = null;
  if (!responseActiveItem.success) {
    successRequest = responseActiveItem.success;
    return successRequest;
  }

  return (
    <>
      <Header />
      <Home
        activeItems={responseActiveItem.data}
        successRequest={successRequest}
      />
      <Footer />
    </>
  );
}
