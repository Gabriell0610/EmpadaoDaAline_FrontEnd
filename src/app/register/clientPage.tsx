'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import { AUTH_REGISTER } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { getSafeErrorMessage } from '@/utils/helpers';
import { RegisterData, registerSchema } from '@/utils/schemas/register.schema';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ClientPageRegister() {
  const route = useRouter();
  const { call, isLoading } = useFetch();
  const handleRegister = async (data: RegisterData) => {
    const res = await call<RegisterData, null>({
      method: StatusHttp.POST,
      url: AUTH_REGISTER,
      body: data,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    toast.success(getSafeErrorMessage('Redirecionando...'));
    route.push('/login');
  };

  return (
    <section>
      <DefaultForm
        schema={registerSchema}
        onSubmit={handleRegister}
        isLoading={isLoading}
      >
        <InputField
          label="Nome Completo"
          name="name"
          type="text"
          placeholder="Ex: Joao Silva"
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Ex: joao@gmail.com"
        />
        <InputField
          label="Senha"
          name="password"
          type="password"
          placeholder="Coloque sua melhor senha"
        />
        <InputField
          label="Telefone"
          name="cellphone"
          type="text"
          maxLength={11}
          placeholder="Ex: 21 987764432"
        />
        <ButtonDefault type="submit" isLoading={isLoading} variant="primary">
          Cadastrar
        </ButtonDefault>
      </DefaultForm>
      <div className="mt-5 flex justify-center">
        <p>
          Já tem uma conta?{' '}
          <ButtonDefault href={'/login'} variant={'link'}>
            {'Login'}
          </ButtonDefault>
        </p>
      </div>
    </section>
  );
}
