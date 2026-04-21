/* eslint-disable react-hooks/rules-of-hooks */
import ClientPage from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { notFound } from 'next/navigation';
export default async function ClientDefaultPage() {
  try {
    const responseActiveItem = await listActiveItem();

    return (
      <div>
        <ClientPage activeItems={responseActiveItem.data} />
      </div>
    );
  } catch {
    notFound();
  }
}
