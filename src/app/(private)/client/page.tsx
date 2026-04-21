/* eslint-disable react-hooks/rules-of-hooks */
import { Header } from '@/components/Header/Header';
import ClientPage from './clientPage';
import { listActiveItem } from '@/services/itemService';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer/Footer';
export default async function ClientDefaultPage() {
  try {
    const responseActiveItem = await listActiveItem();

    if (!responseActiveItem.data || responseActiveItem.data.length === 0) {
      notFound();
    }

    return (
      <div>
        <ClientPage activeItems={responseActiveItem.data} />
      </div>
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
