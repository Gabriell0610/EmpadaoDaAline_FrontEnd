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
import { ListAddressUser, ListDataUserLogged } from '@/utils/types/user.type';
import { useContext, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Session } from 'next-auth';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { Modal } from '@/components/modal/modalComponent';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import {
  personalUserData,
  personalUserDataSchema,
} from '@/utils/schemas/personalUser.schema';
import {
  addressUserData,
  addressUserDataSchema,
} from '@/utils/schemas/address.schema';
import { ButtonDefault } from '@/components/Button/Button';
import { signOut } from 'next-auth/react';

interface ProfilePageProps {
  session: Session | null;
}

export default function ProfilePageClient({ session }: ProfilePageProps) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { getDataUserLogged } = UserHook();
  const [dataUserLogged, setDataUserLogged] = useState<ListDataUserLogged>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [modeModal, setModeModal] = useState('');
  const [selectAddress, setSelectAddress] = useState<ListAddressUser>();
  const { editDataUserLogger, editAddressUserData } = UserHook();
  const [idAddress, setIdAddress] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDataUser = async () => {
    try {
      setIsLoading(true);
      const res = await getDataUserLogged(session?.user.accessToken || '');
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

  const preparePersonalUserEdit = () => {
    setTitleModal('Editar dados pessoais');
    setModeModal('personal');
    openModal();
  };

  const prepareAddressEdit = (idAddress: string) => {
    setTitleModal('Editar Endereço');
    setModeModal('address');
    const valor = dataUserLogged?.enderecos.find(
      (value) => value.endereco.id === idAddress,
    );
    setSelectAddress(valor);
    setIdAddress(idAddress);
    openModal();
  };

  const handleEditPersonalUserData = async (data: personalUserData) => {
    try {
      setIsLoading(true);
      const res = await editDataUserLogger(
        session?.user.accessToken || '',
        data,
      );
      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
        setIsLoading(false);
      }
      await handleDataUser();
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddressUserData = async (data: addressUserData) => {
    try {
      setIsLoading(true);
      const res = await editAddressUserData(
        session?.user.accessToken || '',
        data,
        idAddress,
      );

      if (!res.success) {
        toast(getSafeErrorMessage(res.message));
        setIsLoading(false);
      }

      await handleDataUser();
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
    <main className="mx-auto w-full px-8 py-6">
      <article className="m-auto flex max-w-[750px] flex-col gap-8">
        {/* Título */}
        <div className="mb-5 text-center">
          <TitleH1 className="mb-1">Edite suas informações</TitleH1>
          <p className="text-sm text-gray-500 sm:text-base">
            Mantenha seus dados sempre atualizados
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Dados Pessoais */}
          <section className="flex-1 rounded-lg border border-gray-100 bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <TitleH2 className="mb-0">Dados Pessoais</TitleH2>
              <FaRegEdit
                onClick={() => preparePersonalUserEdit()}
                className="cursor-pointer text-green-600 hover:text-green-800"
                title="Editar dados pessoais"
              />
            </div>
            <div className="flex flex-col gap-3 text-sm sm:text-base">
              {Object.entries(loggedUserData).map(([label, value]) => (
                <p key={label} className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary">
                    {label}
                  </span>
                  {value}
                </p>
              ))}
            </div>
          </section>

          {/* Endereços */}
          <section className="flex-1 rounded-lg border border-gray-100 bg-white p-5 shadow-md">
            <TitleH2 className="mb-4">Endereços</TitleH2>
            <div className="flex flex-col gap-4">
              {dataUserLogged?.enderecos.map((value) => (
                <div
                  key={value.endereco.id}
                  className="border-b border-gray-100 pb-3 last:border-none"
                >
                  <div className="flex items-center justify-between">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">CEP:</span>
                      {formatCep(value.endereco.cep)}
                      <span className="ml-3 font-semibold">Rua:</span>
                      {value.endereco.rua}
                    </p>
                    <FaRegEdit
                      className="cursor-pointer text-green-600 hover:text-green-800"
                      title="Editar endereço"
                      onClick={() => prepareAddressEdit(value.endereco.id)}
                    />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4">
                    <p>
                      <span className="font-semibold">Número:</span>{' '}
                      {value.endereco.numero}
                    </p>
                    <p>
                      <span className="font-semibold">Bairro:</span>{' '}
                      {value.endereco.bairro}
                    </p>
                  </div>
                  <p className="mt-1">
                    <span className="font-semibold">Cidade:</span>{' '}
                    {value.endereco.cidade}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      {/* Botão de sair */}
      <div className="mt-8">
        <ButtonDefault
          variant="primary"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-fit px-6 py-2"
        >
          Sair
        </ButtonDefault>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={titleModal}>
        {modeModal === 'personal' ? (
          <DefaultForm
            onSubmit={handleEditPersonalUserData}
            schema={personalUserDataSchema}
            isLoading={isLoading}
            fields={[
              {
                name: 'name',
                label: 'Nome Completo',
                placeholder: '',
                defaultValue: dataUserLogged?.nome,
              },
              {
                name: 'email',
                label: 'Email',
                placeholder: '',
                defaultValue: dataUserLogged?.email,
              },
              {
                name: 'cellphone',
                label: 'Celular',
                placeholder: '',
                defaultValue: dataUserLogged?.telefone,
              },
            ]}
            childrenButton="Editar"
          />
        ) : (
          <DefaultForm
            onSubmit={handleEditAddressUserData}
            schema={addressUserDataSchema}
            isLoading={isLoading}
            fields={[
              {
                name: 'zipCode',
                label: 'CEP',
                placeholder: '',
                defaultValue: selectAddress?.endereco.cep,
              },
              {
                name: 'neighborhood',
                label: 'Bairro',
                placeholder: '',
                defaultValue: selectAddress?.endereco.bairro,
              },
              {
                name: 'city',
                label: 'Cidade',
                placeholder: '',
                defaultValue: selectAddress?.endereco.cidade,
              },
              {
                name: 'street',
                label: 'Rua',
                placeholder: '',
                defaultValue: selectAddress?.endereco.rua,
              },
              {
                name: 'number',
                label: 'Número',
                placeholder: '',
                defaultValue: selectAddress?.endereco.numero,
              },
            ]}
            childrenButton="Editar"
          />
        )}
      </Modal>

      {isLoading && <LoadingComponent mode={'fullScreen'} />}
    </main>
  );
}
