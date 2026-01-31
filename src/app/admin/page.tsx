/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardClientPage from './clientPage';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decode } from 'jsonwebtoken';
import { AccessProfile } from '@/constants/enums/AccessProfile';

export default async function AdminPage() {
  const token = cookies().get('access_token')?.value;
  if (!token) redirect('/login');

  const payload = decode(token) as any;

  if (payload.role !== AccessProfile.ADMIN) {
    redirect('/client');
  }

  return <DashboardClientPage />;
}
