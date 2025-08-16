import { getServerSession } from 'next-auth';
import DoubtClientPage from './clientPage';
import { authOptions } from '@/libs/auth';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export default async function DoubtPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Header session={session} />
      <DoubtClientPage />
      <Footer />
    </>
  );
}
