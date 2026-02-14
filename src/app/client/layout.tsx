import { Header } from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { Footer } from '@/components/Footer/Footer';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';

export default async function ClientLayout({
  children,
}: SomeChildrenInterface) {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex min-h-screen flex-col">
      <Header session={session} />

      <main className="container-custom flex-1">{children}</main>

      <Footer />
    </div>
  );
}
