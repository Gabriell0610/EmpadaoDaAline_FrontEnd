'use client';
import { Card } from '@/components/CardItens/card';
import { Cart } from '@/components/Cart/Cart';
import { TitleH1 } from '@/components/Titles/Titles';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { ClientPageProps } from '@/utils/types/components/listItemComponent.type';
import { useState } from 'react';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { IconButton } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyContent from '@/components/EmptyContent/emptyContent';

import ImageContentEmptyError from '../../../public/assets/erro_list_items.png';

export default function MenuClient({ activeItems }: ClientPageProps) {
  const [openCart, setOpenCart] = useState(false);
  const { addItemInCart } = useCart();

  function handleOpenCart(itemId: string) {
    console.log('itens ativos', activeItems);
    console.log('item id', itemId);
    setOpenCart(true);
    addItemInCart(itemId);
  }

  // separa os itens por tipo
  const empadoes = activeItems.filter((item) => item.tipo === 'EMPADAO');
  const panquecas = activeItems.filter((item) => item.tipo === 'PANQUECA');
  const almondegas = activeItems.filter((item) => item.tipo === 'ALMONDEGA');

  const renderSection = (
    title: string,
    items: typeof activeItems,
    id: string,
  ) => {
    if (items.length === 0) {
      return (
        <EmptyContent
          title="Ocorreu algum erro e estamos tentando resolver..."
          description="aguarde alguns instantes e renicie a página"
          image={ImageContentEmptyError}
          alt="conteúdo vazio na tela por conta do servidor"
        />
      );
    }

    return (
      <section className="relative mt-3">
        <TitleH1>{title}</TitleH1>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: `.swiper-button-next-${id}`,
              prevEl: `.swiper-button-prev-${id}`,
            }}
            breakpoints={{
              580: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            // Garante atualização quando o layout muda
            observer
            observeParents
            resizeObserver
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <Card content={item} handleOpenCart={handleOpenCart} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev */}
          <IconButton
            aria-label="prev"
            className={`swiper-button-prev-${id}`}
            variant="outline"
            size="xs"
            rounded="full"
            w="24px"
            h="24px"
            minW="24px"
            minH="24px"
            bg="white"
            shadow="sm"
            position="absolute"
            top="50%"
            left="-12px"
            transform="translateY(-50%)"
            zIndex={10}
            _hover={{ bg: 'gray.100' }}
          >
            <ChevronLeft className="size-4" />
          </IconButton>

          {/* Next */}
          <IconButton
            aria-label="next"
            className={`swiper-button-next-${id}`}
            variant="outline"
            rounded="full"
            size="xs"
            bg="white"
            shadow="sm"
            w="24px"
            h="24px"
            minW="24px"
            minH="24px"
            position="absolute"
            top="50%"
            right="-12px"
            transform="translateY(-50%)"
            zIndex={10}
            _hover={{ bg: 'gray.100' }}
          >
            <ChevronRight className="size-3" />
          </IconButton>
        </div>
      </section>
    );
  };

  return (
    <main className="container-custom">
      {renderSection('Empadões', empadoes, 'empadao')}
      {renderSection('Panquecas', panquecas, 'panqueca')}
      {renderSection('Almôndegas', almondegas, 'almondega')}

      <Cart openCart={openCart} setOpenCart={setOpenCart} />
    </main>
  );
}
