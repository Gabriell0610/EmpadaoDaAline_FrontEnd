'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { useRegister } from '@/hooks/useRegister/useRegister';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { getSafeErrorMessage } from '@/utils/helpers';
import { RegisterData, registerSchema } from '@/utils/schemas/register.schema';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import toast from 'react-hot-toast';

export default function ClientPageRegister() {
  const route = useRouter();
  const { register } = useRegister();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleRegister = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const res = await register(data);

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        setIsLoading(false);
      } else {
        toast.success(getSafeErrorMessage('Redirecionando...'));
        setIsLoading(false);
        route.push('/login');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
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
    </div>
  );
}
