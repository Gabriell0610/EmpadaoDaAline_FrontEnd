'use client';
import { Card } from '@/components/Card/card';
import { Cart } from '@/components/Cart/Cart';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { TitleH1 } from '@/components/Titles/Titles';
import { useCart } from '@/providers/cartContext/cartProvider';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useContext, useState } from 'react';

interface ClienPageProps {
  session: Session | null;
  data: ListActiveItemsInterface[];
}

export default function ClientPage({ session, data }: ClienPageProps) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [openCart, setOpenCart] = useState(false);
  const { addItemById } = useCart();

  function handleOpenCart(itemId: string) {
    setOpenCart(true);
    addItemById(itemId);
  }

  if (!session?.user.accessToken) {
    setIsLoading(true);
  } else {
    setIsLoading(false);
  }

  return (
    <main className="mx-auto w-full">
      <h2>
        Página onde o usuário vai pode escolher os itens e colocar no carrinho
      </h2>
      <section className="w-full px-8 py-6">
        <TitleH1>Os mais pedidos</TitleH1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {data
            ?.filter((_, index) => index === 0 || index === 5 || index === 11)
            .map((value, index) => (
              <Card
                content={value}
                key={index}
                handleOpenCart={() => handleOpenCart(value.id)}
              />
            ))}
        </div>
      </section>
      <div>
        <h1>Bem-vindo {session?.user.email}</h1>
        <p>ID: {session?.user.id}</p>
        <p>Role: {session?.user.role}</p>
        <p>Token: {session?.user.accessToken}</p>
        <p onClick={() => signOut({ callbackUrl: '/login' })}>sair</p>
      </div>
      <Cart openCart={openCart} setOpenCart={setOpenCart} />
      {isLoading && <LoadingComponent mode={'fullScreen'} />}
    </main>
  );
}
