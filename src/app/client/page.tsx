import { Header } from '@/components/Header/Header';
import ClientPage from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Footer } from '@/components/Footer/Footer';
export const dynamic = 'force-dynamic';
export default async function ClientDefaultPage() {
  const responseActiveItem = await listActiveItem();

  if (!responseActiveItem.success) {
    return (
      <>
        <Header />
        <div>Estamos enfretando um problema técnico, por favor aguarde...</div>
        <Footer />
      </>
    );
  }
  return (
    <div>
      <ClientPage activeItems={responseActiveItem.data} />
    </div>
  );
}
