import { ListItemsInterface } from '@/utils/types/items.type';
import { CircleSlash } from 'lucide-react';
import { ButtonDefault } from '@/components/Button/Button';
import Image from 'next/image';
import { normalizeCurrency } from '@/utils/helpers';
import { Dispatch, SetStateAction } from 'react';
import { ItemStatus } from '@/constants/enums/ItemStatus';

interface ItemOptionDataInterface {
  id: string;
  preco: string;
  tamanho: string;
  unidades: number;
  pesoReal: string;
}

interface EditTabInterface {
  selectedItem: string;
  listAllItens: ListItemsInterface[];
  selectedItemData: ListItemsInterface | undefined;
  isItemActive: boolean;
  changeStatusItem: (itemId: string, status: string) => Promise<void>;
  setSelectedItem: Dispatch<SetStateAction<string>>;
  itemOptionData: ItemOptionDataInterface | undefined;
}

export function EditTab({
  isItemActive,
  listAllItens,
  selectedItem,
  selectedItemData,
  itemOptionData,
  changeStatusItem,
  setSelectedItem,
}: EditTabInterface) {
  return (
    <>
      <select
        className="mb-4 h-11 w-full rounded-xl border border-text-primary/20 bg-neutral-white px-3 text-sm transition focus:border-green_details-greenLight focus:outline-none focus:ring-2 focus:ring-green_details-greenLight/25"
        value={selectedItem ?? ''}
        onChange={(e) => setSelectedItem(e.target.value)}
      >
        <option value="">Selecione o item</option>

        {listAllItens?.map((itemDescription) =>
          itemDescription.item.map((data, index) => (
            <option value={data.id} key={`${data.id}-${index}`}>
              {itemDescription.nome} {data.pesoReal ? `- ${data.pesoReal}` : ''}
            </option>
          )),
        )}
      </select>

      {selectedItemData ? (
        <div className="mb-4 rounded-xl border border-text-primary/10 bg-neutral-offWhite p-4">
          <div className="flex items-start gap-3">
            <div className="relative h-28 w-28 flex-shrink-0">
              <Image
                src={
                  selectedItemData.image ||
                  'https://placehold.co/100x100/e5e7eb/6b7280?text=Item'
                }
                alt={selectedItemData.nome}
                className="h-24 w-24 rounded-lg border border-text-primary/10 object-cover"
                fill
                quality={100}
              />
            </div>
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
                {selectedItemData.disponivel}
              </span>
              <p className="text-sm text-text-secondary">
                Tipo: {selectedItemData.tipo}
              </p>
              <p className="text-sm font-semibold text-text-primary">
                Preço: {normalizeCurrency(itemOptionData?.preco)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-dashed border-text-primary/20 bg-neutral-offWhite px-4 py-6 text-sm text-text-secondary">
          Selecione um item para carregar o preview e habilitar a edicao.
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ButtonDefault
          type="button"
          variant="normal"
          onClick={() => changeStatusItem(selectedItem, ItemStatus.INATIVO)}
          disabled={!selectedItem}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed"
        >
          <CircleSlash size={16} />
          Inativar item
        </ButtonDefault>
        <ButtonDefault
          type="button"
          variant="normal"
          onClick={() => changeStatusItem(selectedItem, ItemStatus.ATIVO)}
          disabled={!selectedItem}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-green-500 bg-green-50 px-4 text-sm font-semibold text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed"
        >
          <CircleSlash size={16} />
          Ativar item
        </ButtonDefault>
      </div>
    </>
  );
}
