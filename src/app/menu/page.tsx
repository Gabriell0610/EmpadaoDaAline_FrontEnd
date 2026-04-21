import { listActiveItem } from '@/services/itemService';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import MenuClient from './clientPage';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import NotFound from '../not-found';
export default async function HomeMenu() {
  try {
    const responseActiveItem = await listActiveItem();

    const data: ListActiveItemsInterface[] = responseActiveItem.data;
    return (
      <>
        <Header />
        <MenuClient activeItems={data} />
        <Footer />
      </>
    );
  } catch {
    NotFound();
  }
}
