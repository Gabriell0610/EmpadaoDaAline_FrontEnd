/* eslint-disable prettier/prettier */
import ClientPageRegister from './clientPage';
import imageRegister from '../../../public/image_register.png';
import { AuthLayout } from '@/components/AuthLayout/AuthLayout';
export default function RegisterPage() {
  return (
    <AuthLayout
      altImage="Imagem com pratos de comidas no estilo de desenho"
      imageUrl={imageRegister}
      title={'Crie sua conta e aproveite uma experiência personalizada!'}
      mode="register"
    >
      <ClientPageRegister />
    </AuthLayout>
  );
}
