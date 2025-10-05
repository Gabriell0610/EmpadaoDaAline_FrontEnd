import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import ClientOrderPage from './clientPage';

export default async function OrderPage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Header session={session} />
      <ClientOrderPage session={session} />
      <Footer />
    </div>
  );
}
