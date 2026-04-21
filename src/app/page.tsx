import Home from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { notFound } from 'next/navigation';

export default async function HomePage() {
  try {
    const responseActiveItem = await listActiveItem();

    if (!responseActiveItem.data || responseActiveItem.data.length === 0) {
      notFound();
    }

    return (
      <>
        <Header />
        <Home activeItems={responseActiveItem.data} />
        <Footer />
      </>
    );
  } catch {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">
            Serviço temporariamente indisponível
          </h1>

          <p className="mb-6 max-w-md text-gray-500">
            Estamos com uma instabilidade no sistema no momento. Tente novamente
            em alguns instantes.
          </p>
        </div>
        <Footer />
      </>
    );
  }
}
