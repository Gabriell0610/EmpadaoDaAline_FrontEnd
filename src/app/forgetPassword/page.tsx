/* eslint-disable prettier/prettier */
import ClientPageForgetPassword from './clientPage';
import imageForgetPassword from '../../../public/image_forgetPassword.png';
import { AuthLayout } from '@/components/AuthLayout/AuthLayout';
export default function ForgetPasswordPage() {
  return (
    <>
      <AuthLayout
        altImage="Uma pessoa confusa e pensando na senha perdida"
        imageUrl={imageForgetPassword}
        title={'Esqueceu sua senha?'}
      >
        <ClientPageForgetPassword />
      </AuthLayout>
    </>
  );
}
