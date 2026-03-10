import ClientOrderDetailsPage from './clientPage';
import { PageProps } from '@/utils/types/generics/layout.type';

export default async function OrderDetailsPage({ params }: PageProps) {
  const isConfirmMode = params.action?.[0] === 'confirm';
  return <ClientOrderDetailsPage id={params.id} confirm={isConfirmMode} />;
}
