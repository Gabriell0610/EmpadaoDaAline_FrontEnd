'use client';
import { Card } from '@/components/Card/card';
import { Cart } from '@/components/Cart/Cart';
//import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { TitleH1 } from '@/components/Titles/Titles';
import { useCart } from '@/providers/cartContext/cartProvider';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface ClienPageProps {
  session?: Session | null;
  data: ListActiveItemsInterface[];
}

export default function ClientPage({ data }: ClienPageProps) {
  //const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { data: session } = useSession();
  const [openCart, setOpenCart] = useState(false);
  const { addItemInCart } = useCart();
  const [dataUser, setDataUser] = useState(session);

  useEffect(() => {
    setDataUser(session);
  }, [session]);

  function handleOpenCart(itemId: string) {
    setOpenCart(true);
    addItemInCart(itemId);
  }

  return (
    <main className="mx-auto w-full">
      <h2>
        Página onde o usuário vai pode escolher os itens e colocar no carrinho
      </h2>
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
      <div>
        <h1>Bem-vindo {session?.user.email}</h1>
        <p>ID: {session?.user.id}</p>
        <p>Role: {session?.user.role}</p>
        <p>Token: {dataUser?.user.accessToken}</p>
        <p onClick={() => signOut({ callbackUrl: '/login' })}>sair</p>
      </div>
      <Cart openCart={openCart} setOpenCart={setOpenCart} />
      {/* {isLoading && <LoadingComponent mode={'fullScreen'} />} */}
    </main>
  );
}
