import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import ClientOrderDetailsPage from './clientPage';
import { PageProps } from '@/utils/types/generics/layout.type';

export default async function OrderDetailsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  return <ClientOrderDetailsPage id={params.id} session={session} />;
}
