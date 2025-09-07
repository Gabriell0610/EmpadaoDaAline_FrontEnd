import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import ProfilePageClient from './clientPage';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export default async function HomeProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header session={session} />
      <ProfilePageClient session={session} />
      <Footer />
    </>
  );
}
