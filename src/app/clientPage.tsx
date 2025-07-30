/* eslint-disable prettier/prettier */
'use client';
import Image from 'next/image';
import ImageChef from '../../public/image_chef.png';
import { Footer } from '@/components/Footer/Footer';
import { TitleH1 } from '@/components/Titles/Titles';
import { useEffect, useState } from 'react';
import { Cart } from '@/components/Cart/Cart';
import { useCart } from '@/providers/cartContext/cartProvider';
import { Card } from '@/components/Card/card';
import { useRouter } from 'next/navigation';
import { PropsHome } from '@/utils/types/generics/listItemComponent.type';

/* eslint-disable prettier/prettier */
export default function Home({ data }: PropsHome) {
  const [openCart, setOpenCart] = useState(false);
  const { addItemInCart } = useCart();
  const navigate = useRouter();
  function handleOpenCart(itemId: string) {
    setOpenCart(true);
    addItemInCart(itemId);
  }

  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <main className="mx-auto w-full">
      <section className="w-full px-8 py-10">
        <article className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
          <div className="flex flex-col gap-4">
            <TitleH1 className="mb-0">
              Receitas artesanais que{' '}
              <span className="text-yellow-600">aquecem</span> o coração e{' '}
              <span className="text-text-green">encantam</span> o paladar.
            </TitleH1>
            <p className="text-text-secondary">
              Prove o melhor da nossa cozinha: receitas com ingredientes
              selecionados, preparo artesanal e muito sabor. Surpreenda-se e
              transforme cada refeição em um momento especial.
            </p>
            <button
              onClick={() => navigate.push('/menu')}
              className="w-fit rounded-md bg-primary-greenLight px-4 py-2 text-neutral-white hover:bg-green-800"
            >
              Veja nosso Menu
            </button>
          </div>

          <div className="hidden min-w-[350px] max-w-[350px] md:flex">
            <Image src={ImageChef} alt="foto de uma chefe estilo 2d" />
          </div>
        </article>
      </section>

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
      <Footer />
    </main>
  );
}
