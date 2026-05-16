'use client';

import { Cart } from '@/components/Cart/Cart';
import EmptyContent from '@/components/EmptyContent/emptyContent';

import { useCart } from '@/providers/cartProvider/cartProvider';
import { ClientPageProps } from '@/utils/types/components/listItemComponent.type';

import { useState } from 'react';

import ImageContentEmptyError from '../../../public/assets/erro_list_items.png';
import { ItemsCarousel } from '@/components/Swipper/ItemsCarousel';

export default function MenuClient({ activeItems }: ClientPageProps) {
  const [openCart, setOpenCart] = useState(false);

  const { addItemInCart } = useCart();

  function handleOpenCart(itemId: string) {
    setOpenCart(true);
    addItemInCart(itemId);
  }

  const empadoes = activeItems.filter(
    (item) => item.itemType?.nome === 'EMPADAO',
  );

  const panquecas = activeItems.filter(
    (item) => item.itemType?.nome === 'PANQUECA',
  );

  const almondegas = activeItems.filter(
    (item) => item.itemType?.nome === 'ALMONDEGA',
  );

  if (activeItems.length === 0) {
    return (
      <EmptyContent
        title="Ocorreu algum erro e estamos tentando resolver..."
        description="aguarde alguns instantes ou renicie a página"
        image={ImageContentEmptyError}
        alt="conteúdo vazio na tela por conta do servidor"
      />
    );
  }

  return (
    <main className="container-custom">
      <ItemsCarousel
        title="Empadões"
        items={empadoes}
        id="empadao"
        handleOpenCart={handleOpenCart}
      />

      <ItemsCarousel
        title="Panquecas"
        items={panquecas}
        id="panqueca"
        handleOpenCart={handleOpenCart}
      />

      <ItemsCarousel
        title="Almôndegas"
        items={almondegas}
        id="almondega"
        handleOpenCart={handleOpenCart}
      />

      <Cart openCart={openCart} setOpenCart={setOpenCart} />
    </main>
  );
}
