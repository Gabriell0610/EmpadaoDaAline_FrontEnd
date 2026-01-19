'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import { TitleH1, TitleH3 } from '@/components/Titles/Titles';
import {
  editItensSchema,
  EditItensSchemaDto,
  itensSchema,
  ItensSchemaDto,
} from '@/utils/schemas/itens.schema';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { useAdminRequest } from '../functions';

export function ClientItensPage({ session }: ProfilePageProps) {
  const {
    listAllItens,
    selectedItem,
    setSelectedItem,
    inativeItem,
    editItem,
    createItem,
  } = useAdminRequest({
    session,
  });

  async function handleEditOrCreateItem(
    data: ItensSchemaDto | EditItensSchemaDto,
  ) {
    console.log('é editar ou criar?', data);
    if (selectedItem) {
      await editItem(selectedItem, data as EditItensSchemaDto);
    }

    await createItem(data as ItensSchemaDto);
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <TitleH1>Sessão de itens</TitleH1>
      <article className="flex flex-col justify-between gap-4 lg:flex-row">
        <section className="flex flex-col gap-2">
          <TitleH3>Selecione um item para inativar ou editar</TitleH3>
          <select
            className="rounded-md border py-2 text-sm"
            value={selectedItem ?? ''}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Selecione o item</option>
            {listAllItens?.map((item) => (
              <option value={item.id} key={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
          <ButtonDefault
            variant="primary"
            onClick={() => inativeItem(selectedItem)}
            disabled={selectedItem !== '' ? false : true}
          >
            Inativar item selecionado
          </ButtonDefault>
        </section>
        <section className="w-full lg:w-[60%]">
          <TitleH3>
            {selectedItem == ''
              ? 'Cadastre um novo item'
              : 'Edite o item selecionado'}
          </TitleH3>
          <DefaultForm
            onSubmit={() => handleEditOrCreateItem}
            schema={selectedItem ? editItensSchema : itensSchema}
          >
            <div className="flex flex-col gap-2 lg:flex-row">
              <InputField
                type="text"
                disabled={false}
                placeholder="ex: Empadão de frango"
                label="Nome do item"
                name="name"
              />
              <InputField
                type="number"
                disabled={false}
                placeholder="ex: 23.99"
                label="Preço"
                name="price"
                step="0.01"
              />
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              <InputField
                type="text"
                disabled={false}
                placeholder="ex: url da imagem"
                label="URL da imagem"
                name="image"
              />
              <InputField
                type="text"
                disabled={false}
                placeholder="ex: P | M | G | GG"
                label="Tamanho"
                name="size"
              />
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              <InputField
                type="text"
                disabled={false}
                placeholder="ex: Panqueca suculenta"
                label="Descrição"
                name="description"
              />
              <InputField
                type="number"
                disabled={false}
                placeholder="ex: 3.88"
                label="Preço unitário"
                name="unitPrice"
                step="0.01"
              />
            </div>
            <ButtonDefault type="submit" variant="primary">
              {selectedItem == '' ? 'Criar' : 'Editar'}
            </ButtonDefault>
          </DefaultForm>
        </section>
      </article>
      <section className="mt-5 text-left">
        <TitleH3>Adicione um cupom</TitleH3>
        <p>Sessão ainda em construção...</p>
      </section>
    </main>
  );
}
