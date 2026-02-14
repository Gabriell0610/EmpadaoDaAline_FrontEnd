import { authOptions } from '@/libs/auth';
import DashboardAdmin from './clientPage';
import { getServerSession } from 'next-auth';

export default async function DashboardAdminPage() {
  const session = await getServerSession(authOptions);
  return <DashboardAdmin session={session} />;
}
