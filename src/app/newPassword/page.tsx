/* eslint-disable prettier/prettier */
import ClientPageNewPassword from './clientPage';
import imageNewPassword from '../../../public/image_newPassword3.png';
import { AuthLayout } from '@/components/AuthLayout/AuthLayout';
export default function NewPasswordPage() {
  return (
    <>
      <AuthLayout
        altImage="Uma pessoa confusa e pensando na senha perdida"
        imageUrl={imageNewPassword}
        title={'Adicione uma nova senha!'}
      >
        <ClientPageNewPassword />
      </AuthLayout>
    </>
  );
}
