import ClientCheckoutPage from './clientPage';
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  return <>{<ClientCheckoutPage session={session} />}</>;
}
