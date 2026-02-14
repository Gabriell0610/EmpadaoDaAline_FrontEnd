/* eslint-disable prettier/prettier */
'use client';
import Image from 'next/image';
import ImageChef from '../../public/image_chef.png';
import { TitleH1 } from '@/components/Titles/Titles';
import { useState } from 'react';
import { Cart } from '@/components/Cart/Cart';
import { Card } from '@/components/CardItens/card';
import { useRouter } from 'next/navigation';
import { ClientPageProps } from '@/utils/types/components/listItemComponent.type';
import { ButtonDefault } from '@/components/Button/Button';
import { useCart } from '@/providers/cartProvider/cartProvider';

/* eslint-disable prettier/prettier */
export default function Home({ activeItems }: ClientPageProps) {
  const [openCart, setOpenCart] = useState(false);
  const { addItemInCart } = useCart();
  const navigate = useRouter();

  const empadoes = activeItems.filter((item) => item.tipo === 'EMPADAO');

  function handleOpenCart(itemId: string) {
    console.log("id do item", itemId)
    setOpenCart(true);
    addItemInCart(itemId);
  }

  return (
    <main className="container-custom">
      <section className="w-full px-8 py-10">
        <article className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
          <div className="flex flex-col gap-4">
            <TitleH1 className="mb-0">
              Receitas artesanais que{' '}
              <span className="text-yellow-600">aquecem</span> o coração e{' '}
              <span className="text-text-green">encantam</span> o paladar.
            </TitleH1>
            <p className="text-text-secondary text-sm sm:text-base">
              Prove o melhor da nossa cozinha: receitas com ingredientes
              selecionados, preparo artesanal e muito sabor. Surpreenda-se e
              transforme cada refeição em um momento especial.
            </p>
            <ButtonDefault
              onClick={() => navigate.push('/menu')}
              variant='primary'
              className='w-fit'
            >
              Veja nosso Menu
            </ButtonDefault>
          </div>

          <div className="hidden min-w-[350px] max-w-[350px] md:flex">
            <Image src={ImageChef} alt="foto de uma chefe estilo 2d" />
          </div>
        </article>
      </section>

      {empadoes.length > 0 && (
        <section className="w-full px-8 py-10">
          <TitleH1>Os mais pedidos</TitleH1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {empadoes.map((value) => (
              <Card
                key={value.id}
                content={value}
                handleOpenCart={handleOpenCart}
              />
            ))}
          </div>
        </section>
      )}
      {openCart && <Cart openCart={openCart} setOpenCart={setOpenCart} />}
    </main>
  );
}
