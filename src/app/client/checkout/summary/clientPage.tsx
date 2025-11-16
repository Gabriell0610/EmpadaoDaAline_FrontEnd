'use client';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import React from 'react';
import useClientCheckout from '../functions';
import { useCart } from '@/providers/cartProvider/cartProvider';

export default function SummaryClientPage({ session }: ProfilePageProps) {
  const { detailsOrder, isLoading, address } = useClientCheckout({ session });
  const { itemsWithLoggedUser } = useCart();

  return (
    <main className="flex items-center justify-center">
      <section>
        {address && address.map((value) => (
            
        ))}
      </section>
      <section></section>
    </main>
  );
}
