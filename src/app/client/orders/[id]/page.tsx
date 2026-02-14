import ClientOrderDetailsPage from './clientPage';
import { PageProps } from '@/utils/types/generics/layout.type';

export default async function OrderDetailsPage({ params }: PageProps) {
  return <ClientOrderDetailsPage id={params.id} />;
}
