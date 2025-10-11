import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import ClientOrderPage from './clientPage';

export default async function OrderPage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <ClientOrderPage session={session} />
    </div>
  );
}
