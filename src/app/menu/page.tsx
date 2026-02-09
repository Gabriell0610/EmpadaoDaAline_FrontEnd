import { listActiveItem } from '@/services/itemService';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import MenuClient from './clientPage';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
export default async function HomeMenu() {
  const res = await listActiveItem();

  if (!res.success) {
    return (
      <>
        <Header />
        <div>Estamos enfretando um problema técnico, por favor aguarde...</div>
        <Footer />
      </>
    );
  }

  const data: ListActiveItemsInterface[] = res.data;
  return (
    <>
      <Header />
      <MenuClient activeItems={data} />
      <Footer />
    </>
  );
}
