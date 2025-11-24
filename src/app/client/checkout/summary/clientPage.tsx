'use client';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import React, { useEffect } from 'react';
import useClientCheckout from '../functions';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { useOrderStore } from '@/stores/orderDetails-store';

export default function SummaryClientPage({ session }: ProfilePageProps) {
  const { detailsOrder, isLoading, address } = useClientCheckout({ session });
  const { itemsWithLoggedUser } = useCart();

  const orderDetails = useOrderStore((state) => state.order);

  useEffect(() => {
    console.log(orderDetails);
  }, []);

  return (
    <main className="flex items-center justify-center">
      <section>
        <p>Data: {orderDetails?.schedulingDate}</p>
      </section>
      <section></section>
    </main>
  );
}
