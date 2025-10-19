/* eslint-disable prettier/prettier */
'use client';
import logo from 'public/logo.svg';
import { ButtonDefault } from '../Button/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { Cart } from '../Cart/Cart';
import { useState } from 'react';
import { FaBagShopping } from 'react-icons/fa6';
import { ProfileHeader } from './MenuHeader/ProfileHeader';
import { useCart } from '@/providers/cartContext/cartProvider';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  session?: Session | null;
}

export function Header({ session }: HeaderProps) {
  const navigate = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const {quantity} = useCart()
  return (
    <header className="py-8 px-8">
      <nav className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
        <div className="flex min-w-0 items-center">
          <Link href={session?.user.accessToken ? "/client" : "/"}>
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
          {!session?.user.accessToken ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag 
                  className="cursor-pointer" 
                  size={22} 
                  onClick={() => setOpenCart(true)} 
                />
                
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
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
            <div className="flex gap-4 items-center">
              <ProfileHeader/>
              <ButtonDefault className='sm:py-2 sm:px-4 sm:bg-text-green sm:flex sm:items-center sm:gap-2 sm:text-neutral-white sm:rounded-md' onClick={() => setOpenCart(true)}>
                <FaBagShopping size={20}/>
                <span className='hidden sm:block'>Sua Sacola</span>
              </ButtonDefault>
            </div>
          )}
        </div>
      </nav>
     {openCart && <Cart openCart={openCart} setOpenCart={setOpenCart} />}
    </header>
  );
}
