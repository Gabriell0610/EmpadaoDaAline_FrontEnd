/* eslint-disable react-hooks/rules-of-hooks */
import { redirect } from 'next/navigation';
import ClientPage from './clientPage';
import { listActiveItem } from '@/services/itemService';
export const dynamic = 'force-dynamic';
export default async function ClientDefaultPage() {
  const responseActiveItem = await listActiveItem();

  if (!responseActiveItem.success) {
    return redirect('not-found');
  }
  return (
    <div>
      <ClientPage activeItems={responseActiveItem.data} />
    </div>
  );
}
