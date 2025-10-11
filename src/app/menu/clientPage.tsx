'use client';
import { Card } from '@/components/CardItens/card';
import { Cart } from '@/components/Cart/Cart';
import { TitleH1 } from '@/components/Titles/Titles';
import { useCart } from '@/providers/cartContext/cartProvider';
import { ClientPageProps } from '@/utils/types/components/listItemComponent.type';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { FaChevronRight } from 'react-icons/fa6';
import { FaChevronLeft } from 'react-icons/fa6';

import { IconButton } from '@chakra-ui/react';

export default function MenuClient({ activeItems }: ClientPageProps) {
  const { data: session } = useSession();
  const [openCart, setOpenCart] = useState(false);
  const { addItemInCart } = useCart();

  function handleOpenCart(itemId: string) {
    setOpenCart(true);
    addItemInCart(itemId);
    console.log(session?.user.accessToken);
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
    if (items.length === 0) return null;

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
            <FaChevronLeft className="size-4" />
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
            <FaChevronRight className="size-3" />
          </IconButton>
        </div>
      </section>
    );
  };

  return (
    <main className="">
      {renderSection('Empadões', empadoes, 'empadao')}
      {renderSection('Panquecas', panquecas, 'panqueca')}
      {renderSection('Almôndegas', almondegas, 'almondega')}

      <Cart openCart={openCart} setOpenCart={setOpenCart} />
    </main>
  );
}
