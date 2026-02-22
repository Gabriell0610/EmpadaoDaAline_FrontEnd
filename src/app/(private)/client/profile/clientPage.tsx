'use client';
import { TitleH1, TitleH2 } from '@/components/Titles/Titles';
import { normalizeCellphoneNumber } from '@/utils/helpers';
import { useState } from 'react';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { personalUserDataSchema } from '@/utils/schemas/personalUser.schema';
import {
  EditAddressUserData,
  editAddressUserDataSchema,
} from '@/utils/schemas/address.schema';
import { ButtonDefault } from '@/components/Button/Button';
import {
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  SquarePen,
  User,
} from 'lucide-react';
import { Modal } from '@/components/Modal/ModalComponent';
import { InputField } from '@/components/InputField/InputField';
import useProfileRequests from './functions';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';

export default function ProfilePageClient() {
  const [titleModal, setTitleModal] = useState('');
  const [modeModal, setModeModal] = useState('');
  const { logout } = useAuth();
  const router = useRouter();

  const {
    dataUserLogged,
    openModal,
    closeModal,
    isLoading,
    setIdAddress,
    setSelectAddress,
    isModalOpen,
    editPersonalUserData,
    selectAddress,
    editAddressUserData,
  } = useProfileRequests();

  const handleEditAddressUserData = async (
    data: EditAddressUserData,
    methods: UseFormReturn<EditAddressUserData>,
  ) => {
    // enviando apenas dados alterados para o payload do back via react-hook-form
    const { dirtyFields } = methods.formState;

    const editedData = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        data[key as keyof EditAddressUserData],
      ]),
    );

    if (Object.keys(editedData).length === 0) {
      return;
    }
    await editAddressUserData(editedData);
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

  const preparePersonalUserEdit = () => {
    setTitleModal('Editar dados pessoais');
    setModeModal('personal');
    openModal();
  };

  const loggedUserData = {
    'Nome Completo: ': dataUserLogged?.nome,
    'Email: ': dataUserLogged?.email,
    'Celular: ': normalizeCellphoneNumber(dataUserLogged?.telefone || ''),
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <>
      <article className="mx-auto w-full max-w-6xl pb-6">
        <header className="relative overflow-hidden rounded-3xl border border-text-primary/10 bg-gradient-to-br from-green_details-greenFooter/40 via-neutral-white to-neutral-white px-6 py-8 shadow-sm sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green_details-greenFluorescent/30 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-green_details-greenFooter/70 blur-2xl" />

          <div className="relative">
            <TitleH1 className="mb-2 text-2xl sm:text-3xl">
              Edite suas informações
            </TitleH1>
            <p className="max-w-2xl text-sm text-text-secondary sm:text-base">
              Mantenha seus dados sempre atualizados para garantir entregas
              corretas e contato rápido.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green_details-greenLight/20 bg-neutral-white/80 px-4 py-2 text-xs font-semibold text-text-green sm:text-sm">
              <ShieldCheck size={16} />
              Dados protegidos e editáveis a qualquer momento
            </div>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
          <section className="rounded-2xl border border-text-primary/10 bg-neutral-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <TitleH2 className="mb-1">Dados pessoais</TitleH2>
                <p className="text-sm text-text-secondary">
                  Revise e atualize suas informações de cadastro.
                </p>
              </div>
              <button
                onClick={() => preparePersonalUserEdit()}
                className="inline-flex items-center gap-2 rounded-lg border border-green_details-greenLight/25 bg-green_details-greenLight/5 px-3 py-2 text-sm font-semibold text-text-green transition-colors hover:bg-green_details-greenLight/10"
              >
                <SquarePen size={16} />
                Editar
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(loggedUserData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col gap-2 rounded-xl border border-text-primary/10 bg-neutral-offWhite px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="class-container-icons-text">
                    {key === 'Celular: ' ? (
                      <Phone className="class-icons" />
                    ) : key === 'Email: ' ? (
                      <Mail className="class-icons" />
                    ) : (
                      <User className="class-icons" />
                    )}
                    <span className="font-semibold text-text-primary">
                      {key}
                    </span>
                  </div>
                  <span className="break-all text-sm text-text-secondary sm:text-base">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-text-primary/10 bg-neutral-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <TitleH2 className="mb-1">Endereços</TitleH2>
                  <p className="text-sm text-text-secondary">
                    Selecione um endereço para editar.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-green_details-greenLight/10 px-3 py-1 text-xs font-semibold text-text-green">
                {dataUserLogged?.enderecos.length || 0} cadastrados
              </span>
            </div>

            <div className="space-y-3">
              {dataUserLogged?.enderecos.length ? (
                dataUserLogged.enderecos.map((value) => (
                  <button
                    key={value.endereco.id}
                    onClick={() => prepareAddressEdit(value.endereco.id)}
                    className="group w-full rounded-xl border border-text-primary/10 bg-neutral-offWhite p-4 text-left transition-colors hover:border-green_details-greenLight/30 hover:bg-neutral-white"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-text-primary sm:text-base">
                          <span className="font-semibold">Rua:</span>{' '}
                          {value.endereco.rua}, {value.endereco.numero}
                        </p>
                        <p className="text-sm text-text-secondary sm:text-base">
                          <span className="font-semibold text-text-primary">
                            Bairro:
                          </span>{' '}
                          {value.endereco.bairro} - {value.endereco.cidade}
                        </p>
                      </div>
                      <span className="rounded-md border border-green_details-greenLight/25 bg-green_details-greenLight/5 p-2 text-text-green transition-colors group-hover:bg-green_details-greenLight/10">
                        <SquarePen size={16} />
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-text-primary/20 bg-neutral-offWhite px-4 py-5 text-sm text-text-secondary">
                  Nenhum endereço cadastrado até o momento.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <ButtonDefault
            variant="fourth"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold sm:text-base"
          >
            <LogOut size={17} />
            Sair da conta
          </ButtonDefault>
        </div>
      </article>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={titleModal}
        className="w-full max-w-2xl rounded-2xl border border-text-primary/10 px-6 py-6 shadow-xl sm:px-8"
      >
        {modeModal === 'personal' ? (
          <DefaultForm
            onSubmit={editPersonalUserData}
            schema={personalUserDataSchema}
            isLoading={isLoading}
            className="space-y-1"
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
              maxLength={11}
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
            schema={editAddressUserDataSchema}
            isLoading={isLoading}
            className="space-y-1"
          >
            <InputField
              name="zipCode"
              label="Cep"
              defaultValue={selectAddress?.endereco.cep}
              type="text"
              maxLength={8}
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
