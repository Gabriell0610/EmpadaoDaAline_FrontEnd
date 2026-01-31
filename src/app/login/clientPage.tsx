/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import { AUTH_LOGIN } from '@/constants';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { useAuth } from '@/providers/authProvider';
import { loginDto, loginSchema } from '@/utils/schemas/login.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ClientPageLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { call, isLoading } = useFetch();
  const router = useRouter();
  const { refreshAuth, user } = useAuth();

  const handleLogin = async (data: loginDto) => {
    const res = await call<loginDto, null>({
      method: StatusHttp.POST,
      url: AUTH_LOGIN,
      body: data,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    await refreshAuth();

    if (user?.role === AccessProfile.ADMIN) {
      router.push('/admin');
    } else {
      router.push('/client');
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
