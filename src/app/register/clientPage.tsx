'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
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
        fields={[
          {
            name: 'name',
            label: 'Nome Completo',
            placeholder: 'Digite seu nome completo',
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'Digite seu email',
          },
          {
            name: 'password',
            label: 'Senha',
            type: 'password',
            placeholder: 'Digite sua senha',
          },
          {
            name: 'cellphone',
            label: 'Telefone',
            type: 'number',
            placeholder: 'Digite seu telefone',
          },
        ]}
        childrenButton="Continuar"
      />
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
