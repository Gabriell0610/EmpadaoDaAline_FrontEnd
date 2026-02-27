import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';

export default function ClientLayout({ children }: SomeChildrenInterface) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container-custom flex-1">{children}</main>
      <Footer />
    </div>
  );
}
