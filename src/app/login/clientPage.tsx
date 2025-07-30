'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { loginDto, loginSchema } from '@/utils/schemas/login.schema';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import toast from 'react-hot-toast';

export default function ClientPageLogin() {
  const router = useRouter();

  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleLogin = async (data: loginDto) => {
    try {
      setIsLoading(true);
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res?.error) {
        const session = await getSession(); // Pega a session atualizada do usuário logado

        if (session?.user.role === AccessProfile.ADMIN) {
          router.push('/admin');
        } else {
          router.push('/client');
        }
        toast.success('Login efetuado com sucesso');
      } else {
        console.error(res.error);
        toast.error(res.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DefaultForm
        schema={loginSchema}
        onSubmit={handleLogin}
        isLoading={isLoading}
        fields={[
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
        ]}
        childrenButton="Entrar"
      />
      <div className="flex justify-end underline">
        <ButtonDefault
          href={'/forgetPassword'}
          variant="link"
          isLoading={isLoading}
        >
          Esqueceu sua senha?
        </ButtonDefault>
      </div>
      <div className="mt-5 flex justify-center">
        <p className="text-text-primary">
          Não possui uma conta?{' '}
          <ButtonDefault
            href={'/register'}
            variant="link"
            isLoading={isLoading}
          >
            Cadastre-se
          </ButtonDefault>
        </p>
      </div>
    </div>
  );
}
