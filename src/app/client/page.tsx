import { Header } from '@/components/Header/Header';
import ClientPage from './clientPage';
import { getServerSession } from 'next-auth';
import { Footer } from '@/components/Footer/Footer';
import { authOptions } from '@/libs/auth';
import { listActiveItem } from '@/services/itemService';

export default async function ClientDefaultPage() {
  const session = await getServerSession(authOptions);
  const res = await listActiveItem();
  return (
    <div className="flex min-h-screen flex-col">
      <Header session={session} />
      <ClientPage session={session} data={res.data} />
      <Footer />
    </div>
  );
}
