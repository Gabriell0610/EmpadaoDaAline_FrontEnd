'use client';
import { Card } from '@/components/Card/card';
import { Cart } from '@/components/Cart/Cart';
//import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { TitleH1 } from '@/components/Titles/Titles';
import { useCart } from '@/providers/cartContext/cartProvider';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { Session } from 'next-auth';
// import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

interface ClienPageProps {
  session?: Session | null;
  data: ListActiveItemsInterface[];
}

export default function ClientPage({ data }: ClienPageProps) {
  const [openCart, setOpenCart] = useState(false);
  const { addItemInCart } = useCart();

  function handleOpenCart(itemId: string) {
    setOpenCart(true);
    addItemInCart(itemId);
  }

  return (
    <main className="mx-auto w-full">
      <section className="w-full px-8 py-6">
        <TitleH1>Os mais pedidos</TitleH1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {data.map((value, index) => (
            <Card
              content={value}
              key={index}
              handleOpenCart={(itemId) => handleOpenCart(itemId)}
            />
          ))}
        </div>
      </section>
      <Cart openCart={openCart} setOpenCart={setOpenCart} />
      {/* {isLoading && <LoadingComponent mode={'fullScreen'} />} */}
    </main>
  );
}
