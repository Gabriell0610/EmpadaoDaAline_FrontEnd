import { Header } from '@/components/Header/Header';
import ClientPage from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { Footer } from '@/components/Footer/Footer';

export default async function ClientDefaultPage() {
  const session = await getServerSession(authOptions);
  const res = await listActiveItem();
  return (
    <div>
      <Header session={session} />
      <ClientPage data={res.data} />
      <Footer />
    </div>
  );
}
