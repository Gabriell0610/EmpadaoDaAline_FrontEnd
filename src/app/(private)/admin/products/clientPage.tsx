/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { TitleH1, TitleH3 } from '@/components/Titles/Titles';
import {
  EditItensSchemaDto,
  editItensSchema,
  itensSchema,
  ItensSchemaDto,
} from '@/utils/schemas/itens.schema';
import {
  PackagePlus,
  Pencil,
  PencilLine,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DefaultValues, UseFormReturn } from 'react-hook-form';
import NewItemRequest from './function';
import { ItemType } from '@/constants/enums/ItemType';
import { ItemSize } from '@/constants/enums/ItemSize';
import { ItemStatus } from '@/constants/enums/ItemStatus';
import { EditTab } from './tab/editTab';
import { CreateTab } from './tab/createTab';
import { CupomTab } from './tab/cupomTab';

type ItemMode = 'edit' | 'create' | 'cupom';

const INPUT_CLASSNAME =
  '[&>label]:mb-1 [&>label]:text-xs [&>label]:font-medium [&>label]:text-text-secondary [&_input]:h-11 [&_input]:rounded-xl [&_input]:border-text-primary/20 [&_input]:bg-neutral-white [&_input]:text-sm [&_input]:focus:border-green_details-greenLight [&_input]:focus:ring-2 [&_input]:focus:ring-green_details-greenLight/25 [&_input]:focus:outline-none [&_select]:h-11 [&_select]:rounded-xl [&_select]:border-text-primary/20 [&_select]:bg-neutral-white [&_select]:text-sm [&_select]:focus:border-green_details-greenLight [&_select]:focus:ring-2 [&_select]:focus:ring-green_details-greenLight/25 [&_select]:focus:outline-none';

export function ClientItensPage() {
  const {
    listAllItens,
    selectedItem,
    setSelectedItem,
    changeStatusItem,
    editItem,
    createItem,
    isLoading,
    listTypeItemData,
  } = NewItemRequest();

  const [activeMode, setActiveMode] = useState<ItemMode>('edit');
  const [titleMode, setTitleMode] = useState<string>('');

  const selectedItemData = listAllItens.find(
    (item) =>
      item.id === selectedItem ||
      item.item.some((optionItem) => optionItem.id === selectedItem),
  );

  const itemOptionData =
    selectedItemData?.item.find(
      (optionItem) => optionItem.id === selectedItem,
    ) || selectedItemData?.item?.[0];

  const isEditMode = activeMode === 'edit';
  const createMode = activeMode === 'create';
  const cupomMode = activeMode === 'cupom';
  const isItemActive = selectedItemData?.disponivel === ItemStatus.ATIVO;

  const [selectedDescriptionId, setSelectedDescriptionId] =
    useState<string>('');

  const selectedBaseProduct =
    listAllItens.find((i) => i.id === selectedDescriptionId) ?? null;
  const isAddingToExisting = createMode && !!selectedBaseProduct;

  const formDefaultValues = useMemo<
    DefaultValues<ItensSchemaDto | EditItensSchemaDto>
  >(() => {
    if (isAddingToExisting && selectedBaseProduct) {
      return {
        name: selectedBaseProduct.nome,
        description: selectedBaseProduct.descricao,
        image: selectedBaseProduct.image,
        itemTypeId: selectedBaseProduct.itemType?.id ?? '',
        price: '',
        size: undefined,
        unitPrice: undefined,
        unity: undefined,
      };
    }
    return {
      name: '',
      price: '',
      image: '',
      size: undefined,
      description: '',
      unitPrice: undefined,
      type: undefined,
      unity: undefined,
    };
  }, [selectedDescriptionId]);

  async function handleEditOrCreateItem(
    data: ItensSchemaDto | EditItensSchemaDto,
    { reset }: UseFormReturn<any>,
  ) {
    if (isEditMode && selectedItem) {
      await editItem(selectedItem, data as EditItensSchemaDto);
      reset();
      return;
    }

    await createItem({
      ...(data as ItensSchemaDto),
      itemDescriptionId: selectedDescriptionId || undefined,
    });
    reset();
    setSelectedDescriptionId('');
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="rounded-xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm md:p-8">
        <div className="mb-6">
          <TitleH1 className="mb-2">Gerenciamento de itens</TitleH1>
          <p className="text-sm text-text-secondary sm:text-base">
            Edite um item existente ou cadastre um novo item.
          </p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-text-primary/10 pb-0.5">
          <button
            type="button"
            onClick={() => {
              setActiveMode('edit');
              setTitleMode(
                'Escolha um item da lista para visualizar e editar os dados.',
              );
            }}
            className={`inline-flex items-center gap-2 rounded-t-xl border px-4 py-3 text-sm font-semibold transition ${
              isEditMode
                ? 'border-green_details-greenLight/35 bg-green_details-greenLight/10 text-text-green'
                : 'border-transparent bg-neutral-offWhite text-text-primary hover:bg-neutral-offWhite/80'
            }`}
          >
            <PencilLine size={16} />
            Editar item
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('create');
              setSelectedItem('');
              setTitleMode(
                'Após criar um item, selecione o mesmo para poder acrescentar outros tipos',
              );
            }}
            className={`inline-flex items-center gap-2 rounded-t-xl border px-4 py-3 text-sm font-semibold transition ${
              createMode
                ? 'border-green_details-greenLight/35 bg-green_details-greenLight/10 text-text-green'
                : 'border-transparent bg-neutral-offWhite text-text-primary hover:bg-neutral-offWhite/80'
            }`}
          >
            <PlusCircle size={16} />
            Novo item
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('cupom');
              setTitleMode('Adicine desconto em algum item');
            }}
            className={`inline-flex items-center gap-2 rounded-t-xl border px-4 py-3 text-sm font-semibold transition ${
              cupomMode
                ? 'border-green_details-greenLight/35 bg-green_details-greenLight/10 text-text-green'
                : 'border-transparent bg-neutral-offWhite text-text-primary hover:bg-neutral-offWhite/80'
            }`}
          >
            <PlusCircle size={16} />
            Adicionar Cupom
          </button>
        </div>

        <article className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm">
            <TitleH3 className="mb-1">
              {isEditMode && 'Selecionar item para editar'}
              {activeMode === 'create' && 'Criar novo item'}
              {activeMode === 'cupom' && 'Adicionar cupom'}
            </TitleH3>
            <p className="mb-4 text-sm text-text-secondary">
              {isEditMode &&
                'Escolha um item da lista para visualizar e editar os dados.'}
              {createMode && ''}
              {cupomMode && 'Escolha o tipo de cupom e o item'}
            </p>

            {isEditMode && (
              <EditTab
                changeStatusItem={changeStatusItem}
                isItemActive={isItemActive}
                itemOptionData={itemOptionData}
                listAllItens={listAllItens}
                selectedItem={selectedItem}
                selectedItemData={selectedItemData}
                setSelectedItem={setSelectedItem}
              />
            )}

            {createMode && (
              <CreateTab
                listAllItens={listAllItens}
                selectedDescriptionId={selectedDescriptionId}
                onSelectDescription={(id) => {
                  setSelectedDescriptionId(id);
                }}
              />
            )}

            {cupomMode && <CupomTab />}
          </section>

          <section className="rounded-xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm">
            <TitleH3 className="mb-1">Dados do item</TitleH3>
            <p className="mb-4 text-sm text-text-secondary">{titleMode}</p>

            <DefaultForm
              onSubmit={handleEditOrCreateItem}
              schema={isEditMode ? editItensSchema : itensSchema}
              defaultValues={formDefaultValues}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InputField
                  type="text"
                  disabled={isLoading || isAddingToExisting}
                  placeholder="ex: Empadao de frango"
                  label="Nome do item"
                  name="name"
                  className={INPUT_CLASSNAME}
                />
                <InputField
                  type="number"
                  disabled={isLoading}
                  placeholder="ex: 23.99"
                  label="Preco"
                  name="price"
                  step="0.01"
                  className={INPUT_CLASSNAME}
                />
                <InputField
                  type="text"
                  disabled={isLoading || isAddingToExisting}
                  placeholder="ex: url da imagem"
                  label="URL da imagem"
                  name="image"
                  className={INPUT_CLASSNAME}
                />
                <InputField
                  type="select"
                  disabled={isLoading}
                  placeholder="ex: P | M | G | GG"
                  label="Tamanho"
                  name="size"
                  className={INPUT_CLASSNAME}
                  options={[
                    { label: 'Selecione um tamanho', value: '' },
                    { label: 'Pequeno (P)', value: ItemSize.P },
                    { label: 'Medio (M)', value: ItemSize.M },
                    { label: 'Grande (G)', value: ItemSize.G },
                    { label: 'Extra grande (GG)', value: ItemSize.GG },
                  ]}
                />
                <InputField
                  type="text"
                  disabled={isLoading || isAddingToExisting}
                  placeholder="ex: Panqueca suculenta"
                  label="Descricao"
                  name="description"
                  className={INPUT_CLASSNAME}
                />
                <InputField
                  type="number"
                  disabled={
                    isLoading || selectedItemData?.tipo === ItemType.EMPADAO
                  }
                  placeholder="ex: 3.88"
                  label="Preco unitario"
                  name="unitPrice"
                  step="0.01"
                  className={INPUT_CLASSNAME}
                />
                <InputField
                  type="select"
                  disabled={isLoading || isAddingToExisting}
                  label="Tipo do item"
                  placeholder="Selecione o Tipo"
                  name="itemTypeId"
                  className={INPUT_CLASSNAME}
                  options={listTypeItemData?.map((p) => ({
                    label: p.nome,
                    value: p.id,
                  }))}
                />
                <InputField
                  type="number"
                  disabled={isLoading}
                  placeholder="ex: 6"
                  label="Unidades"
                  name="unity"
                  step="0.01"
                  className={INPUT_CLASSNAME}
                />
              </div>

              <ButtonDefault
                type="submit"
                variant="primary"
                disabled={isEditMode && !selectedItem}
                className="inline-flex h-12 w-full items-center justify-center gap-2"
              >
                {isEditMode ? (
                  <>
                    <Pencil size={16} />
                    Atualizar item
                  </>
                ) : (
                  <>
                    <PackagePlus size={16} />
                    Criar item
                  </>
                )}
              </ButtonDefault>
            </DefaultForm>
          </section>
        </article>

        <section className="mt-6 rounded-xl border border-green-600/20 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 text-green-700" size={18} />
            <div>
              <p className="text-sm font-semibold text-text-primary">Dica</p>
              <p className="text-sm text-text-secondary">
                No modo editar, selecione um item e envie apenas os campos que
                deseja alterar.
              </p>
            </div>
          </div>
        </section>
      </div>
      {isLoading && <LoadingComponent mode="fullScreen" />}{' '}
    </main>
  );
}
