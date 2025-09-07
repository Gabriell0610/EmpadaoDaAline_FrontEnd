'use client';
import MenuClient from '../menu/clientPage';
import { ClientPageProps } from '@/utils/types/components/listItemComponent.type';

export default function ClientPage({ data }: ClientPageProps) {
  return <MenuClient data={data} />;
}
