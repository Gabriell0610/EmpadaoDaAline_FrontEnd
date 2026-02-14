import { authOptions } from '@/libs/auth';
import DashboardClientPage from './clientPage';
import { getServerSession } from 'next-auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  return <DashboardClientPage session={session} />;
}
