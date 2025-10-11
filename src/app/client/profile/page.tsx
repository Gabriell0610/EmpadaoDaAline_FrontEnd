import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import ProfilePageClient from './clientPage';

export default async function HomeProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <ProfilePageClient session={session} />
    </>
  );
}
