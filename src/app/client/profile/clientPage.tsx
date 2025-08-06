/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { TitleH1, TitleH2 } from '@/components/Titles/Titles';
import { UserHook } from '@/hooks/userHook/userHook';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import {
  formatCep,
  getSafeErrorMessage,
  normalizeCellphoneNumber,
} from '@/utils/helpers';
import { ListDataUserLogged } from '@/utils/types/user.type';
import { useContext, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Session } from 'next-auth';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { Modal } from '@/components/modal/modalComponent';

interface ProfilePageProps {
  session: Session | null;
}

export default function ProfilePageClient({ session }: ProfilePageProps) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { getDataUserLogged } = UserHook();
  const [dataUserLogged, setDataUserLogged] = useState<ListDataUserLogged>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModal, setTitleModal] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  const editPersonalUserData = () => {
    setTitleModal('Editar dados pessoais');
    openModal();
  };

  const editAddressUserData = () => {
    setTitleModal('Editar Endereço');
    openModal();
  };

  useEffect(() => {
    handleDataUser();
  }, [session]);

  const loggedUserData = {
    'Nome Completo: ': dataUserLogged?.nome,
    'Email: ': dataUserLogged?.email,
    'Celular: ': normalizeCellphoneNumber(dataUserLogged?.telefone || ''),
  };

  return (
    <main className="mx-auto w-full">
      <article className="m-auto flex max-w-[750px] flex-col gap-5 px-8 py-6">
        <div className="mb-5 sm:text-center">
          <TitleH1 className="mb-0">Edite suas informações</TitleH1>
          <p className="text-xs sm:text-base">
            matenha seus dados sempre atualizados
          </p>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          {isLoading ? (
            <LoadingComponent mode="fullScreen" />
          ) : (
            <>
              <section>
                <div className="flex items-center gap-3">
                  <TitleH2 className="mb-0">Dados Pessoais</TitleH2>
                  <FaRegEdit
                    onClick={() => editPersonalUserData()}
                    className="cursor-pointer"
                    title="Editar dados pessoais"
                  />
                </div>
                <div className="my-2 flex flex-col gap-3">
                  {Object.entries(loggedUserData).map(([label, value]) => (
                    <p
                      key={label}
                      className="flex items-center gap-3 text-xs sm:text-base"
                    >
                      <span className="font-semibold text-text-primary">
                        {label}{' '}
                      </span>
                      {value}
                    </p>
                  ))}
                </div>
              </section>
              <section>
                <TitleH2>Endereços</TitleH2>
                {dataUserLogged?.enderecos.map((value) => (
                  <div
                    key={value.endereco.id}
                    className="mb-3 text-xs sm:text-base"
                  >
                    <div className="flex gap-3">
                      <p>
                        <span className="font-semibold">CEP:</span>{' '}
                        {formatCep(value.endereco.cep)}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Rua:</span>{' '}
                        {value.endereco.rua}
                        <FaRegEdit
                          className="cursor-pointer"
                          title="Editar endereço"
                          onClick={() => editAddressUserData()}
                        />
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <p>
                        <span className="font-semibold">Número:</span>{' '}
                        {value.endereco.numero}
                      </p>
                      <p>
                        <span className="font-semibold">Bairro:</span>{' '}
                        {value.endereco.bairro}
                      </p>
                    </div>
                    <p>
                      <span className="font-semibold">Cidade:</span>{' '}
                      {value.endereco.cidade}
                    </p>
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      </article>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={titleModal}>
        <h1>
          Testessssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
        </h1>
        <h1>Teste</h1>
        <h1>Teste</h1>
        <h1>Teste</h1>
        <h1>Teste</h1>
      </Modal>
    </main>
  );
}
