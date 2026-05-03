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
  CircleSlash,
  PackagePlus,
  Pencil,
  PencilLine,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DefaultValues, UseFormReturn } from 'react-hook-form';
import NewItemRequest from './function';

type ItemMode = 'edit' | 'create';
type ItemType = 'EMPADAO' | 'PANQUECA' | 'ALMODENGA';
type ItemSize = 'P' | 'M' | 'G' | 'GG';

const INPUT_CLASSNAME =
  '[&>label]:mb-1 [&>label]:text-xs [&>label]:font-medium [&>label]:text-text-secondary [&_input]:h-11 [&_input]:rounded-xl [&_input]:border-text-primary/20 [&_input]:bg-neutral-white [&_input]:text-sm [&_input]:focus:border-green_details-greenLight [&_input]:focus:ring-2 [&_input]:focus:ring-green_details-greenLight/25 [&_input]:focus:outline-none [&_select]:h-11 [&_select]:rounded-xl [&_select]:border-text-primary/20 [&_select]:bg-neutral-white [&_select]:text-sm [&_select]:focus:border-green_details-greenLight [&_select]:focus:ring-2 [&_select]:focus:ring-green_details-greenLight/25 [&_select]:focus:outline-none';

const ITEM_TYPES: ItemType[] = ['EMPADAO', 'PANQUECA', 'ALMODENGA'];
const ITEM_SIZES: ItemSize[] = ['P', 'M', 'G', 'GG'];

function parseToNumber(value?: string | number | null) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return value;

  const parsed = Number.parseFloat(value.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
}

function formatMoney(value?: string | number | null) {
  const parsed = parseToNumber(value);

  if (parsed === null) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parsed);
}

function normalizeItemType(value?: string | null): ItemType | undefined {
  const parsed = value?.toUpperCase() as ItemType | undefined;
  if (!parsed) return undefined;
  return ITEM_TYPES.includes(parsed) ? parsed : undefined;
}

function normalizeItemSize(value?: string | null): ItemSize | undefined {
  const parsed = value?.toUpperCase() as ItemSize | undefined;
  if (!parsed) return undefined;
  return ITEM_SIZES.includes(parsed) ? parsed : undefined;
}

export function ClientItensPage() {
  const {
    listAllItens,
    selectedItem,
    setSelectedItem,
    inativeItem,
    editItem,
    createItem,
    isLoading,
  } = NewItemRequest();

  const [activeMode, setActiveMode] = useState<ItemMode>('edit');

  const selectedItemData = useMemo(
    () =>
      listAllItens?.find(
        (item) =>
          item.id === selectedItem ||
          item.item.some((optionItem) => optionItem.id === selectedItem),
      ),
    [listAllItens, selectedItem],
  );

  const itemOptionData = useMemo(
    () =>
      selectedItemData?.item.find(
        (optionItem) => optionItem.id === selectedItem,
      ) || selectedItemData?.item?.[0],
    [selectedItem, selectedItemData],
  );
  const isEditMode = activeMode === 'edit';
  const isItemActive = selectedItemData?.status?.toUpperCase() === 'ATIVO';

  const formDefaultValues = useMemo<
    DefaultValues<ItensSchemaDto | EditItensSchemaDto>
  >(() => {
    if (isEditMode && selectedItemData) {
      const price = parseToNumber(itemOptionData?.preco);
      const units = Number(itemOptionData?.unidades || 0);

      return {
        name: selectedItemData.nome || '',
        price: itemOptionData?.preco || '',
        image: selectedItemData.image || '',
        size: normalizeItemSize(itemOptionData?.tamanho),
        description: selectedItemData.descricao || '',
        unitPrice:
          price !== null && units > 0
            ? Number((price / units).toFixed(2))
            : undefined,
        type: normalizeItemType(selectedItemData.tipo),
        unity: itemOptionData?.unidades || undefined,
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
  }, [
    isEditMode,
    itemOptionData?.preco,
    itemOptionData?.tamanho,
    itemOptionData?.unidades,
    selectedItemData,
  ]);

  async function handleEditOrCreateItem(
    data: ItensSchemaDto | EditItensSchemaDto,
    { reset }: UseFormReturn<any>,
  ) {
    if (isEditMode && selectedItem) {
      await editItem(selectedItem, data as EditItensSchemaDto);
      reset();
      return;
    }

    await createItem(data as ItensSchemaDto);
    reset();
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
            onClick={() => setActiveMode('edit')}
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
            }}
            className={`inline-flex items-center gap-2 rounded-t-xl border px-4 py-3 text-sm font-semibold transition ${
              !isEditMode
                ? 'border-green_details-greenLight/35 bg-green_details-greenLight/10 text-text-green'
                : 'border-transparent bg-neutral-offWhite text-text-primary hover:bg-neutral-offWhite/80'
            }`}
          >
            <PlusCircle size={16} />
            Novo item
          </button>
        </div>

        <article className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm">
            <TitleH3 className="mb-1">
              {isEditMode ? 'Selecionar item para editar' : 'Criar novo item'}
            </TitleH3>
            <p className="mb-4 text-sm text-text-secondary">
              {isEditMode
                ? 'Escolha um item da lista para visualizar e editar os dados.'
                : 'Preencha o formulario para cadastrar um novo item.'}
            </p>

            {isEditMode ? (
              <>
                <select
                  className="mb-4 h-11 w-full rounded-xl border border-text-primary/20 bg-neutral-white px-3 text-sm transition focus:border-green_details-greenLight focus:outline-none focus:ring-2 focus:ring-green_details-greenLight/25"
                  value={selectedItem ?? ''}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">Selecione o item</option>

                  {listAllItens?.map((itemDescription) =>
                    itemDescription.item.map((data, index) => (
                      <option
                        value={itemDescription.id}
                        key={`${itemDescription.id}-${index}`}
                      >
                        {itemDescription.nome}{' '}
                        {data.pesoReal ? `- ${data.pesoReal}` : ''}
                      </option>
                    )),
                  )}
                </select>

                {selectedItemData ? (
                  <div className="mb-4 rounded-xl border border-text-primary/10 bg-neutral-offWhite p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          selectedItemData.image ||
                          'https://placehold.co/100x100/e5e7eb/6b7280?text=Item'
                        }
                        alt={selectedItemData.nome}
                        className="h-24 w-24 rounded-lg border border-text-primary/10 object-cover"
                      />
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-text-primary">
                          {selectedItemData.nome}
                        </p>
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                            isItemActive
                              ? 'border border-green-600/25 bg-green-600/10 text-green-700'
                              : 'border border-red-500/25 bg-red-500/10 text-red-600'
                          }`}
                        >
                          {selectedItemData.status}
                        </span>
                        <p className="text-sm text-text-secondary">
                          Tipo: {selectedItemData.tipo}
                        </p>
                        <p className="text-sm font-semibold text-text-primary">
                          Preco: {formatMoney(itemOptionData?.preco)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl border border-dashed border-text-primary/20 bg-neutral-offWhite px-4 py-6 text-sm text-text-secondary">
                    Selecione um item para carregar o preview e habilitar a
                    edicao.
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <ButtonDefault
                    type="button"
                    variant="normal"
                    onClick={() => inativeItem(selectedItem)}
                    disabled={!selectedItem}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed"
                  >
                    <CircleSlash size={16} />
                    Inativar item
                  </ButtonDefault>
                  <ButtonDefault
                    type="button"
                    variant="normal"
                    onClick={() => setActiveMode('edit')}
                    disabled={!selectedItem}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-text-primary/20 bg-neutral-white px-4 text-sm font-semibold text-text-primary transition hover:bg-neutral-offWhite disabled:cursor-not-allowed"
                  >
                    <Pencil size={16} />
                    Editar item
                  </ButtonDefault>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-green-600/20 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <PackagePlus className="mt-0.5 text-green-700" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Modo criacao ativo
                    </p>
                    <p className="text-sm text-text-secondary">
                      O formulario ao lado sera enviado como novo item.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm">
            <TitleH3 className="mb-1">Dados do item</TitleH3>
            <p className="mb-4 text-sm text-text-secondary">
              {isEditMode
                ? 'Preencha as informacoes do item selecionado.'
                : 'Preencha as informacoes para cadastrar um novo item.'}
            </p>

            <DefaultForm
              onSubmit={handleEditOrCreateItem}
              schema={isEditMode ? editItensSchema : itensSchema}
              defaultValues={formDefaultValues}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InputField
                  type="text"
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                    { label: 'Pequeno (P)', value: 'P' },
                    { label: 'Medio (M)', value: 'M' },
                    { label: 'Grande (G)', value: 'G' },
                    { label: 'Extra grande (GG)', value: 'GG' },
                  ]}
                />
                <InputField
                  type="text"
                  disabled={isLoading}
                  placeholder="ex: Panqueca suculenta"
                  label="Descricao"
                  name="description"
                  className={INPUT_CLASSNAME}
                />
                <InputField
                  type="number"
                  disabled={isLoading}
                  placeholder="ex: 3.88"
                  label="Preco unitario"
                  name="unitPrice"
                  step="0.01"
                  className={INPUT_CLASSNAME}
                />
                <InputField
                  type="select"
                  disabled={isLoading}
                  label="Tipo do item"
                  placeholder="Selecione o Tipo"
                  name="type"
                  className={INPUT_CLASSNAME}
                  options={[
                    { label: 'Selecione o tipo', value: '' },
                    { label: 'EMPADAO', value: 'EMPADAO' },
                    { label: 'PANQUECA', value: 'PANQUECA' },
                    { label: 'ALMODENGA', value: 'ALMODENGA' },
                  ]}
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
                variant="normal"
                disabled={isEditMode && !selectedItem}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green_details-greenLight text-sm font-semibold text-neutral-white transition hover:bg-details-greenHover disabled:cursor-not-allowed"
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
                No modo editar, selecione um item para preencher o formulario
                automaticamente.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 text-green-700" size={18} />
          <div>
            <TitleH3 className="mb-1">Adicione um cupom</TitleH3>
            <p className="text-sm text-text-secondary">
              Sessao ainda em construcao...
            </p>
          </div>
        </div>
      </section>

      {isLoading && <LoadingComponent mode="fullScreen" />}
    </main>
  );
}
