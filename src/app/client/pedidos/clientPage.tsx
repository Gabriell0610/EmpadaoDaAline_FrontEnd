import { TitleH1 } from '@/components/Titles/Titles';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';

export default function ClientOrderPage({ session }: ProfilePageProps) {
  return (
    <main className="container-custom">
      <TitleH1>Histórico de Pedidos</TitleH1>
      <p>{session?.user.accessToken}</p>
    </main>
  );
}
