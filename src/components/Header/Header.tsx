/* eslint-disable prettier/prettier */
'use client';
import logo from 'public/logo.svg';
import { ButtonDefault } from '../Button/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { Cart } from '../Cart/Cart';
import { useEffect, useState } from 'react';
import { useCart } from '@/providers/cartContext/cartProvider';
import { FaRegCircleUser } from 'react-icons/fa6';
import { FaBagShopping } from 'react-icons/fa6';

interface HeaderProps {
  session?: Session | null;
}

export function Header({ session }: HeaderProps) {
  const navigate = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { quantity, itemsWithLoggedUser, itemsWithGuestUser } = useCart();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  function validtemsWithLoggedUser() {
    if (itemsWithLoggedUser && itemsWithLoggedUser.carrinhoItens) {
      return itemsWithLoggedUser.carrinhoItens;
    }

    return itemsWithGuestUser;
  }

  return (
    <header className="px-8 py-4">
      <nav className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-2">
        <div className="flex min-w-0 items-center">
          <Link href="/">
            <Image
              alt="logo da marca"
              src={logo}
              quality={100}
              className="h-14 w-auto object-contain sm:h-20"
            />
          </Link>
        </div>

        {/* BOTÕES LOGIN / CADASTRO */}
        <div className="flex items-center gap-2">
          {hasMounted && validtemsWithLoggedUser().length > 0 && (
            <ButtonDefault
              className="relative"
              onClick={() => setOpenCart(true)}
            >
              <FaBagShopping size={25} />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {quantity}
              </span>
            </ButtonDefault>
          )}
          {!session?.user.accessToken ? (
            <div className="flex gap-2">
              <ButtonDefault
                variant="secondary"
                onClick={() => navigate.push('/login')}
              >
                Login
              </ButtonDefault>
              <ButtonDefault
                variant="primary"
                onClick={() => navigate.push('/register')}
              >
                Cadastro
              </ButtonDefault>
            </div>
          ) : (
            <div className="flex gap-6">
              <ButtonDefault variant="link">Menu</ButtonDefault>
              <ButtonDefault variant="link" className="text-text-primary">
                <FaRegCircleUser size={25} />
              </ButtonDefault>
            </div>
          )}
        </div>
      </nav>
      <Cart openCart={openCart} setOpenCart={setOpenCart} />
    </header>
  );
}
