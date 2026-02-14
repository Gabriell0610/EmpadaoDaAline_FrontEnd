import ClientPage from './clientPage';
import { listActiveItem } from '@/services/itemService';

export default async function ClientDefaultPage() {
  const responseActiveItem = await listActiveItem();
  return (
    <div>
      <ClientPage activeItems={responseActiveItem.data} />
    </div>
  );
}
