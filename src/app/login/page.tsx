import ClientPageLogin from './clientPage';
import imageLogin from '../../../public/image_login.png';
import { AuthLayout } from '@/components/AuthLayout/AuthLayout';
export default function LoginPage() {
  return (
    <AuthLayout
      altImage="Uma pessoa esperando ser logada"
      imageUrl={imageLogin}
      mode="register"
      title={'Acesse sua conta e faça seus pedidos!'}
    >
      <ClientPageLogin />
    </AuthLayout>
  );
}
