import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { PageProps } from '@/utils/types/generics/layout.type';
import AdminOrderDetailsPage from './clientPage';

export default async function OrderDetailsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  return <AdminOrderDetailsPage id={params.id} session={session} />;
}
