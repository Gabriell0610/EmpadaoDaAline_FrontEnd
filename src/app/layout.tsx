/* eslint-disable @next/next/no-sync-scripts */
import '../../theme/globals.css';
import type { Metadata } from 'next';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import App from './app';

export const metadata: Metadata = {
  title: 'Empadão da Aline | Encomendas de Empadão em Niterói',
  description:
    'Peça seu empadão artesanal da Aline. Entrega em Niterói. Recheios variados, feito com amor.',
};

export default function RootLayout({ children }: SomeChildrenInterface) {
  return (
    <html lang="pt-br">
      <body
        suppressHydrationWarning={true}
        className="flex min-h-screen flex-col antialiased"
      >
        <App>
          <main className="flex-grow">{children}</main>
        </App>
      </body>
    </html>
  );
}
