import ClientPage from './clientPage';
import { listActiveItem } from '@/services/itemService';

export default async function ClientDefaultPage() {
  const res = await listActiveItem();
  return (
    <div className="flex min-h-screen flex-col">
      <ClientPage data={res.data} />
    </div>
  );
}
