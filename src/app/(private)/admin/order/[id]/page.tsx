import { PageProps } from '@/utils/types/generics/layout.type';
import AdminOrderDetailsPage from './clientPage';

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminOrderDetailsPage id={id} />;
}
