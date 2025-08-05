/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { TitleH2 } from '@/components/Titles/Titles';
import { UserHook } from '@/hooks/userHook/userHook';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { getSafeErrorMessage, normalizeCellphoneNumber } from '@/utils/helpers';
import { ListDataUserLogged } from '@/utils/types/user.type';
import { useContext, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Session } from 'next-auth';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';

interface ProfilePageProps {
  session: Session | null;
}

export default function ProfilePageClient({ session }: ProfilePageProps) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { getDataUserLogged } = UserHook();
  const [dataUserLogged, setDataUserLogged] = useState<ListDataUserLogged>();

  const handleDataUser = async () => {
    try {
      setIsLoading(true);
      const res = await getDataUserLogged(session?.user.accessToken || '');
      console.log('dados', res);
      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        setIsLoading(false);
      }

      setDataUserLogged(res.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleDataUser();
    console.log();
  }, [session]);

  const loggedUserData = {
    'Nome Completo: ': dataUserLogged?.nome,
    'Email: ': dataUserLogged?.email,
    'Celular: ': normalizeCellphoneNumber(dataUserLogged?.telefone || ''),
  };

  // const loggedAddressUserData = {
  //   'CEP: ': dataUserLogged?.nome,
  //   'Rua: ': dataUserLogged?.email,
  //   'Celeular: ': normalizeCellphoneNumber(dataUserLogged?.telefone || ''),
  // };

  return (
    <main className="mx-auto w-full">
      <article className="m-auto flex max-w-[750px] flex-col gap-5 px-8 py-6">
        <TitleH2>Edite suas informações se necessário</TitleH2>
        <div className="flex flex-col justify-between sm:flex-row">
          {isLoading ? (
            <LoadingComponent mode="fullScreen" />
          ) : (
            <>
              <section>
                <TitleH2>Dados Cadastrais</TitleH2>
                <div className="flex flex-col gap-3">
                  {Object.entries(loggedUserData).map(([label, value]) => (
                    <p key={label} className="flex items-center gap-3">
                      <span className="font-semibold text-text-primary">
                        {label}{' '}
                      </span>
                      {value}
                      <FaRegEdit className="cursor-pointer" />
                    </p>
                  ))}
                </div>
              </section>
              <section>
                <div>
                  <TitleH2>Endereços</TitleH2>
                  {dataUserLogged?.enderecos.map((value) => (
                    <div key={value.endereco.id}>
                      <p>CEP: {value.endereco.cep}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
