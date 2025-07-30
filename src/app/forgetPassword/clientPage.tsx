'use client';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { useForgetPassword } from '@/hooks/useForgetPassword';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import {
  sendEmailDto,
  sendEmailSchema,
  validateTokenDto,
  validateTokenSchema,
} from '@/utils/schemas/forgetPassword';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { setCookie } from 'nookies';
import { getSafeErrorMessage } from '@/utils/helpers';

export default function ClientPageForgetPassword() {
  const [tokenNotGenerated, setTokenNotGenerated] = useState(true);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { generateToken, validateToken } = useForgetPassword();
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
    try {
      setIsLoading(true);
      const res = await generateToken(data);

      if (!res.success) {
        setIsLoading(false);
        toast.error(getSafeErrorMessage(res.message));
      } else {
        setTokenNotGenerated(false);
        toast.success(getSafeErrorMessage(res.message));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleValidateToken = async (data: validateTokenDto) => {
    try {
      setIsLoading(true);
      console.log(data.email);
      const res = await validateToken(data);

      if (!res.success) {
        setTokenNotGenerated(true);
        toast.error(res.message);
        setIsLoading(false);
      } else {
        toast.success('Aguarde ser redirecionado!');
        saveDataInCookies(data);
        router.push('/newPassword');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {tokenNotGenerated ? (
        <div>
          <p>
            Informe seu email para gerar um token de segurança. Fique atento ao
            seu email!
          </p>
          <DefaultForm
            schema={sendEmailSchema}
            onSubmit={handleGenerateToken}
            isLoading={isLoading}
            fields={[
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'Digite seu email',
              },
            ]}
            childrenButton={'Gerar Token'}
          />
        </div>
      ) : (
        <div>
          <p>Coloque o token que você recebeu no seu email no campo abaixo!</p>
          <DefaultForm
            schema={validateTokenSchema}
            onSubmit={handleValidateToken}
            isLoading={isLoading}
            fields={[
              {
                name: 'token',
                label: 'Token',
                type: 'number',
                placeholder: 'Digite seu token',
              },
            ]}
            childrenButton={'Continuar'}
          />
        </div>
      )}
    </>
  );
}
