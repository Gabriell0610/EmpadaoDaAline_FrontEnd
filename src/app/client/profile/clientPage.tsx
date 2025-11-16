'use client';
import { TitleH1, TitleH2 } from '@/components/Titles/Titles';
import { getSafeErrorMessage, normalizeCellphoneNumber } from '@/utils/helpers';
import { ListAddressUser, ListDataUserLogged } from '@/utils/types/user.type';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
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
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { useFetch } from '@/hooks/useFetch/useFetch';
import { Mail, MapPinHouse, Phone, SquarePen, User } from 'lucide-react';
import { EDIT_USER_ADDRESS, USER, USER_ME } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';
import { Modal } from '@/components/Modal/ModalComponent';
import { InputField } from '@/components/InputField/InputField';

export default function ProfilePageClient({ session }: ProfilePageProps) {
  const [dataUserLogged, setDataUserLogged] = useState<ListDataUserLogged>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [modeModal, setModeModal] = useState('');
  const [selectAddress, setSelectAddress] = useState<ListAddressUser>();
  const [idAddress, setIdAddress] = useState('');
  const { call, isLoading } = useFetch();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDataUser = async () => {
    const res = await call<null, ListDataUserLogged>({
      token: session?.user.accessToken || '',
      method: StatusHttp.GET,
      url: USER_ME,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    setDataUserLogged(res.data);
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
    const res = await call<personalUserData, null>({
      method: StatusHttp.PUT,
      url: USER,
      body: data,
      token: session?.user.accessToken || '',
    });
    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }
    await handleDataUser();
    closeModal();
  };

  const handleEditAddressUserData = async (data: addressUserData) => {
    const res = await call<addressUserData, null>({
      method: StatusHttp.PUT,
      url: `${EDIT_USER_ADDRESS}${idAddress}`,
      body: data,
      token: session?.user.accessToken || '',
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    toast.success(res.message);

    await handleDataUser();
    closeModal();
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
    <>
      <article className="m-auto max-w-4xl px-4 py-10">
        {/* Título */}
        <header className="mb-10 text-center">
          <TitleH1 className="mb-2 text-3xl font-bold text-gray-800">
            Edite suas informações
          </TitleH1>
          <p className="text-sm text-gray-500 sm:text-base">
            Mantenha seus dados sempre atualizados
          </p>
        </header>

        {/* Card único */}
        <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          {/* Header do card */}
          <div className="mb-6 flex items-center justify-between">
            <TitleH2>Perfil do Usuário</TitleH2>
            <SquarePen
              onClick={() => preparePersonalUserEdit()}
              className="cursor-pointer text-green-600 transition-transform duration-200 hover:scale-110 hover:text-green-700"
              textDecoration={'Editar dados pessoais'}
            />
          </div>

          {/* Dados pessoais */}
          <div className="mb-6 grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2">
            {Object.entries(loggedUserData).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center sm:gap-2"
              >
                <div className="class-container-icons-text">
                  {key === 'Celular: ' ? (
                    <Phone className="class-icons" />
                  ) : key === 'Email: ' ? (
                    <Mail className="class-icons" />
                  ) : (
                    <User className="class-icons" />
                  )}
                  <span className="font-semibold text-gray-900">{key}</span>
                </div>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {/* Lista resumida de endereços */}
          <div>
            <div className="flex items-center gap-2">
              <MapPinHouse className="class-icons" />
              <TitleH2>Endereços</TitleH2>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {dataUserLogged?.enderecos.map((value) => (
                <button
                  key={value.endereco.id}
                  onClick={() => prepareAddressEdit(value.endereco.id)}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-left shadow-sm transition-all hover:bg-gray-100 hover:shadow-md"
                >
                  <div>
                    <p className="text-sm sm:text-base">
                      <span className="font-semibold text-gray-900">Rua:</span>{' '}
                      {value.endereco.rua}, {value.endereco.numero}
                    </p>
                    <p className="text-sm sm:text-base">
                      <span className="font-semibold text-gray-900">
                        Bairro:
                      </span>{' '}
                      {value.endereco.bairro} - {value.endereco.cidade}
                    </p>
                  </div>
                  <SquarePen className="text-green-600 transition-transform hover:scale-110 hover:text-green-700" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de sair */}
        <div className="mt-10 flex justify-center">
          <ButtonDefault
            variant="primary"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-8 py-2 text-base font-medium"
          >
            Sair da conta
          </ButtonDefault>
        </div>
      </article>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={titleModal}>
        {modeModal === 'personal' ? (
          <DefaultForm
            onSubmit={handleEditPersonalUserData}
            schema={personalUserDataSchema}
            isLoading={isLoading}
          >
            <InputField
              name="name"
              label="Nome Completo"
              type="text"
              defaultValue={dataUserLogged?.nome}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              defaultValue={dataUserLogged?.email}
            />
            <InputField
              name="cellphone"
              label="Celular"
              type="text"
              defaultValue={dataUserLogged?.telefone}
            />
            <ButtonDefault
              type="submit"
              isLoading={isLoading}
              variant="primary"
            >
              Editar
            </ButtonDefault>
          </DefaultForm>
        ) : (
          <DefaultForm
            onSubmit={handleEditAddressUserData}
            schema={addressUserDataSchema}
            isLoading={isLoading}
          >
            <InputField
              name="zipCode"
              label="Cep"
              defaultValue={selectAddress?.endereco.cep}
              type="text"
            />
            <InputField
              name="neighborhood"
              label="Bairro"
              defaultValue={selectAddress?.endereco.bairro}
              type="text"
            />
            <InputField
              name="city"
              label="Cidade"
              defaultValue={selectAddress?.endereco.cidade}
              type="text"
            />
            <InputField
              name="street"
              label="Rua"
              defaultValue={selectAddress?.endereco.rua}
              type="text"
            />
            <InputField
              name="number"
              label="Número"
              defaultValue={selectAddress?.endereco.numero}
              type="text"
            />
            <ButtonDefault
              type="submit"
              isLoading={isLoading}
              variant="primary"
            >
              Editar
            </ButtonDefault>
          </DefaultForm>
        )}
      </Modal>

      {isLoading && <LoadingComponent mode="fullScreen" />}
    </>
  );
}
