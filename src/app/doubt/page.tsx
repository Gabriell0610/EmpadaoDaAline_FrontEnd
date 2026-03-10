import DoubtClientPage from './clientPage';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export default async function DoubtPage() {
  return (
    <>
      <Header />
      <DoubtClientPage />
      <Footer />
    </>
  );
}
