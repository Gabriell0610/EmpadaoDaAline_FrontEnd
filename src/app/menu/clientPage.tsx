'use client';
import { Card } from '@/components/Card/card';
import { Cart } from '@/components/Cart/Cart';
import { Footer } from '@/components/Footer/Footer';
import { TitleH1 } from '@/components/Titles/Titles';
import { useCart } from '@/providers/cartContext/cartProvider';
import { PropsHome } from '@/utils/types/generics/listItemComponent.type';
//import { useRouter } from 'next/router';
import { useState } from 'react';

export default function MenuClient({ data }: PropsHome) {
  const [openCart, setOpenCart] = useState(false);
  const { addItemInCart } = useCart();
  //const navigate = useRouter();

  function handleOpenCart(itemId: string) {
    setOpenCart(true);
    addItemInCart(itemId);
  }

  return (
    <main className="mx-auto w-full">
      <section className="w-full px-8 py-10">
        <TitleH1>Empadões</TitleH1>
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
      <Footer />
    </main>
  );
}
