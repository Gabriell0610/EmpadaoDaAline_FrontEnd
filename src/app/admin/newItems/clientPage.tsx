'use client';
import { ButtonDefault } from '@/components/Button/Button';
import { DefaultForm } from '@/components/DefaultForm/DefaultForm';
import { InputField } from '@/components/InputField/InputField';
import { TitleH1, TitleH3 } from '@/components/Titles/Titles';
import { itensSchema } from '@/utils/schemas/itens.schema';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { useAdminRequest } from '../functions';

export function ClientItensPage({ session }: ProfilePageProps) {
  const { listAllItens, selectedItem, setSelectedItem } = useAdminRequest({
    session,
  });
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <TitleH1>Sessão de itens</TitleH1>
      <article className="flex flex-col justify-between gap-4 px-5 lg:flex-row">
        <section className="w-full lg:w-[60%]">
          <TitleH3>Cadastre um novo item</TitleH3>
          <DefaultForm onSubmit={() => null} schema={itensSchema}>
            <div className="flex flex-col gap-2 lg:flex-row">
              <InputField
                type="text"
                disabled={false}
                placeholder="ex: Empadão de frango"
                label="Nome do item"
                name="name"
              />
              <InputField
                type="text"
                disabled={false}
                placeholder="ex: 23.99"
                label="Preço"
                name="price"
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
            <InputField
              type="text"
              disabled={false}
              placeholder="ex: Panqueca suculenta"
              label="Descrição"
              name="description"
            />
            <ButtonDefault type="submit" variant="primary">
              Criar
            </ButtonDefault>
          </DefaultForm>
        </section>
        <section className="mt-5 text-left">
          <TitleH3>Adicione um cupom</TitleH3>
        </section>
      </article>
      <section className="mt-5">
        <TitleH3>Inative algum item</TitleH3>
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
      </section>
    </main>
  );
}
