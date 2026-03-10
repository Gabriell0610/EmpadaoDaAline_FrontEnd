/* eslint-disable prettier/prettier */
'use client';
import logo from 'public/logo.svg';
import { ButtonDefault } from '../Button/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cart } from '../Cart/Cart';
import { useState } from 'react';
import { FaBagShopping } from 'react-icons/fa6';
import { ProfileHeader } from './MenuHeader/ProfileHeader';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/providers/authProvider';

export function Header() {
  const navigate = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [openCart, setOpenCart] = useState(false);
  const { quantity } = useCart();

  function HeaderSkeleton() {
    return (
      <header className="px-8 py-8">
        <nav className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
          <div className="h-14 w-32 animate-pulse rounded bg-gray-200" />
          <div className="flex gap-4">
            <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        </nav>
      </header>
    );
  }

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="px-8 py-8">
      <nav className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
        <div className="flex min-w-0 items-center">
          <Link href={isAuthenticated ? '/client' : '/'}>
            <Image
              alt="logo da marca"
              src={logo}
              quality={100}
              className="h-14 w-auto object-contain sm:h-20"
            />
          </Link>
        </div>

        {/* BOTÕES LOGIN / CADASTRO */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag
                  className="cursor-pointer"
                  size={22}
                  onClick={() => setOpenCart(true)}
                />

                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {quantity}
                </span>
              </div>

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
            <div className="flex items-center gap-4">
              <ProfileHeader />
              <ButtonDefault
                className="sm:flex sm:items-center sm:gap-2 sm:rounded-md sm:bg-text-green sm:px-4 sm:py-2 sm:text-neutral-white"
                onClick={() => setOpenCart(true)}
              >
                <FaBagShopping size={20} />
                <span className="hidden sm:block">Sua Sacola</span>
              </ButtonDefault>
            </div>
          )}
        </div>
      </nav>
      {openCart && <Cart openCart={openCart} setOpenCart={setOpenCart} />}
    </header>
  );
}
