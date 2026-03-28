'use client';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import { AUTH_RESET_PASSWORD } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { getSafeErrorMessage } from '@/utils/helpers';
import {
  resetPasswordSchema,
  resetPasswordDto,
} from '@/utils/schemas/forgetPassword';
import { useRouter } from 'next/navigation';
import { ButtonDefault } from '@/components/Button/Button';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export interface NewPasswordData {
  newPassword: string;
  email: string;
  token: string;
}

export default function ClientPageNewPassword() {
  const { call, isLoading } = useFetch();
  const router = useRouter();

  const userEmail = Cookies.get('userEmail');
  const token = Cookies.get('userToken');

  const handleNewPassword = async (data: resetPasswordDto) => {
    const dataToSend: NewPasswordData = {
      email: userEmail as string,
      newPassword: data.newPassword,
      token: token as string,
    };

    const res = await call<NewPasswordData, null>({
      method: StatusHttp.POST,
      url: AUTH_RESET_PASSWORD,
      body: dataToSend,
      requiresAuth: false,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    toast.success(getSafeErrorMessage(res.message));
    Cookies.remove('userEmail');
    Cookies.remove('userToken');
    router.push('/login');
  };

  return (
    <section>
      <DefaultForm
        schema={resetPasswordSchema}
        onSubmit={handleNewPassword}
        isLoading={isLoading}
      >
        <InputField
          name={'newPassword'}
          label="Nova Senha"
          type="password"
          placeholder="Digite sua senha nova"
        />
        <InputField
          name={'samePassword'}
          label="Repita a senha novamente"
          type="password"
          placeholder="Digite sua senha novamente"
        />
        <ButtonDefault type="submit" isLoading={isLoading} variant="primary">
          Cadastrar senha nova
        </ButtonDefault>
      </DefaultForm>
    </section>
  );
}
