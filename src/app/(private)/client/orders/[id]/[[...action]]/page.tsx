import ClientOrderDetailsPage from './clientPage';
import { PageProps } from '@/utils/types/generics/layout.type';

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id, action } = await params;
  const confirm = action?.[0] === 'confirm';
  return <ClientOrderDetailsPage id={id} confirm={confirm} />;
}
