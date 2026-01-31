'use client';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { useRoleGuard } from '@/hooks/userGuard/useGuard';

export default function ClientLayout({ children }: SomeChildrenInterface) {
  useRoleGuard(AccessProfile.CLIENT);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-custom flex-1">{children}</main>

      <Footer />
    </div>
  );
}
