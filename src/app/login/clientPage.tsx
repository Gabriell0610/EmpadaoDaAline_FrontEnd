/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { baseUrl } from '@/utils/helpers';
import { loginDto, loginSchema } from '@/utils/schemas/login.schema';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';

export default function ClientPageLogin() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleLogin = async (data: loginDto) => {
    try {
      setIsLoading(true);

      const res = await fetch(`${baseUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error('Email ou senha inválidos');
      }

      // backend já setou os cookies
      const me = await fetch(`${baseUrl()}/users/me`, {
        method: StatusHttp.GET,
        credentials: 'include',
      }).then((r) => r.json());

      if (me.role === AccessProfile.ADMIN) {
        router.push('/admin');
      } else {
        router.push('/client');
      }

      toast.success('Login efetuado com sucesso');
    } catch (error: any) {
      toast.error('Erro ao realizar login', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <DefaultForm
        schema={loginSchema}
        onSubmit={handleLogin}
        isLoading={isLoading}
      >
        <InputField
          name={'email'}
          label="Email"
          type="email"
          placeholder="Digite seu email"
        />
        <InputField
          name={'password'}
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          setShowPassword={setShowPassword}
          showPassword={showPassword}
        />
        <ButtonDefault type="submit" isLoading={isLoading} variant="primary">
          Login
        </ButtonDefault>
      </DefaultForm>
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
    </section>
  );
}
