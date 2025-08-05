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
import { FaRegCircleUser } from 'react-icons/fa6';
import { FaBagShopping } from 'react-icons/fa6';

interface HeaderProps {
  session?: Session | null;
}

export function Header({ session }: HeaderProps) {
  const navigate = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);


  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

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
            <div className="flex gap-4 items-center">
              <ButtonDefault variant="link" href='/menu' className='text-text-primary'>Menu</ButtonDefault>

              <ButtonDefault variant="link" href='/client/profile' className="text-text-primary">
                <FaRegCircleUser size={22} />
              </ButtonDefault>

              <ButtonDefault className="relative bg-text-green px-3 py-3 rounded-lg text-neutral-white" onClick={() => setOpenCart(true)}>
                <span className='flex gap-2'> <FaBagShopping size={22} /> Sua sacola </span>
              </ButtonDefault>
            </div>
          )}
        </div>
      </nav>
      <Cart openCart={openCart} setOpenCart={setOpenCart} />
    </header>
  );
}
