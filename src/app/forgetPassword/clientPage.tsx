'use client';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import {
  sendEmailDto,
  sendEmailSchema,
  validateTokenDto,
  validateTokenSchema,
} from '@/utils/schemas/forgetPassword';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { setCookie } from 'nookies';
import { getSafeErrorMessage } from '@/utils/helpers';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { AUTH_FORGOT_PASSWORD, AUTH_VALIDATE_PASSOWRD } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { InputField } from '@/components/InputField/InputField';
import { ButtonDefault } from '@/components/Button/Button';

export default function ClientPageForgetPassword() {
  const [tokenNotGenerated, setTokenNotGenerated] = useState(true);
  const { call, isLoading } = useFetch();
  const router = useRouter();

  function saveDataInCookies(data: validateTokenDto) {
    setCookie(null, 'userEmail', data.email, {
      path: '/', // necessário para estar acessível em qualquer rota
      maxAge: 60 * 10, // opcional: tempo de expiração em segundos (ex: 10 minutos)
    });

    setCookie(null, 'userToken', data.token, {
      path: '/',
      maxAge: 60 * 10,
    });
  }

  const handleGenerateToken = async (data: sendEmailDto) => {
    const res = await call<sendEmailDto, null>({
      method: StatusHttp.POST,
      url: AUTH_FORGOT_PASSWORD,
      body: data,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
      return;
    }

    setTokenNotGenerated(false);
    toast.success(res.message);
  };

  const handleValidateToken = async (data: validateTokenDto) => {
    const res = await call<validateTokenDto, null>({
      method: StatusHttp.POST,
      url: AUTH_VALIDATE_PASSOWRD,
      body: data,
    });

    if (!res.success) {
      setTokenNotGenerated(true);
      toast.error(res.message);
      return;
    }

    toast.success('Aguarde ser redirecionado!');
    router.push('/newPassword');
    saveDataInCookies(data);
  };

  return (
    <section>
      {tokenNotGenerated ? (
        <div>
          <p className="mb-2">
            Informe seu email para gerar um token de segurança. Fique atento ao
            seu email!
          </p>
          <DefaultForm
            schema={sendEmailSchema}
            onSubmit={handleGenerateToken}
            isLoading={isLoading}
          >
            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="Digite seu email"
            />
            <ButtonDefault
              type="submit"
              isLoading={isLoading}
              variant="primary"
            >
              Gerar Token
            </ButtonDefault>
          </DefaultForm>
        </div>
      ) : (
        <div>
          <p>Coloque o token que você recebeu no seu email no campo abaixo!</p>
          <DefaultForm
            schema={validateTokenSchema}
            onSubmit={handleValidateToken}
            isLoading={isLoading}
          >
            <InputField
              name="token"
              label="Token"
              type="number"
              placeholder="Digite seu token"
            />
            <ButtonDefault
              type="submit"
              isLoading={isLoading}
              variant="primary"
            >
              Continuar
            </ButtonDefault>
          </DefaultForm>
        </div>
      )}
    </section>
  );
}
