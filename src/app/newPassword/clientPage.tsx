'use client';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { useForgetPassword } from '@/hooks/useForgetPassword';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import {
  resetPasswordSchema,
  resetPasswordDto,
} from '@/utils/schemas/forgetPassword';
import { useRouter } from 'next/navigation';
import { destroyCookie, parseCookies } from 'nookies';
import { useContext } from 'react';
import toast from 'react-hot-toast';

export interface NewPasswordData {
  newPassword: string;
  email: string;
  token: string;
}

export default function ClientPageNewPassword() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { resetPassword } = useForgetPassword();
  const router = useRouter();

  const cookies = parseCookies();
  const userEmail = cookies['userEmail'];
  const token = cookies['userToken'];

  const handleNewPassword = async (data: resetPasswordDto) => {
    try {
      setIsLoading(true);

      const dataToSend: NewPasswordData = {
        email: userEmail as string,
        newPassword: data.newPassword,
        token: token as string,
      };

      const res = await resetPassword(dataToSend);

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        setIsLoading(false);
      } else {
        toast.success(getSafeErrorMessage(res.message));
        setIsLoading(false);
        router.push('/login');
        destroyCookie(null, 'userEmail');
        destroyCookie(null, 'userToken');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <section>
      <DefaultForm
        schema={resetPasswordSchema}
        onSubmit={handleNewPassword}
        isLoading={isLoading}
        fields={[
          {
            name: 'newPassword',
            label: 'Nova Senha',
            type: 'password',
            placeholder: 'Digite sua senha',
          },
          {
            name: 'samePassword',
            label: 'Repita a senha novamente',
            type: 'password',
            placeholder: 'Digite sua senha novamente',
          },
        ]}
        childrenButton={'Salvar'}
      />
    </section>
  );
}
