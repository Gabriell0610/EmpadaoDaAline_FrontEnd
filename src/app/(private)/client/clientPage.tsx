'use client';
import MenuClient from '../../menu/clientPage';
import { ClientPageProps } from '@/utils/types/components/listItemComponent.type';

export default function ClientPage({ activeItems }: ClientPageProps) {
  return (
    <>
      <MenuClient activeItems={activeItems} />
    </>
  );
}
