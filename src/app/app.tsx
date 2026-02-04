import { AuthProvider } from '@/providers/authProvider';
import { CartProvider } from '@/providers/cartProvider/cartProvider';
import { Chakra } from '@/providers/chakraProvider/chakraProvider';
import { LoadingProvider } from '@/providers/loadingProvider/loadingProvider';
import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import { Toaster } from 'react-hot-toast';

export default function App({ children }: SomeChildrenInterface) {
  return (
    <Chakra>
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </Chakra>
  );
}
