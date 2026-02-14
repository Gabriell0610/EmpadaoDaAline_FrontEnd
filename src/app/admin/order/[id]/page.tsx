import { PageProps } from '@/utils/types/generics/layout.type';
import AdminOrderDetailsPage from './clientPage';

export default async function OrderDetailsPage({ params }: PageProps) {
  return <AdminOrderDetailsPage id={params.id} />;
}
