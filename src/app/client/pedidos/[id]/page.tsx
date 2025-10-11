import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { ListOrderByClient } from '@/utils/types/orderClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { baseUrl } from '@/utils/helpers';
import ClientOrderDetailsPage from './clientPage';

interface PageProps {
  params: {
    id: string; // o [id] da rota
  };
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  let content = {} as ListOrderByClient;

  const reqOrderById = await fetch(`${baseUrl()}/order/${params.id}`, {
    method: 'GET',
    headers: {
      authorization: `${session?.user.accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const res: ApiResponse<ListOrderByClient> = await reqOrderById.json();

  content = res.data;

  return <ClientOrderDetailsPage content={content} />;
}
