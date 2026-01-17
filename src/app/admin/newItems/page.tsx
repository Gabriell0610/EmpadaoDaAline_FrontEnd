import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import { ClientItensPage } from './clientPage';

export default async function ItensPage() {
  const session = await getServerSession(authOptions);
  return <ClientItensPage session={session} />;
}
