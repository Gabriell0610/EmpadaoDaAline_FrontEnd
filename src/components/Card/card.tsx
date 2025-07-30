import Image from 'next/image';
import ImageFood from '../../../public/image5.png';
import { ButtonDefault } from '../Button/Button';
import { normalizeCurrency } from '@/utils/helpers';
import { TitleH3 } from '../Titles/Titles';
import { ListActiveItemsInterface } from '@/utils/types/items.type';
import { useState } from 'react';

interface CardProps<T> {
  content: T;
  key: number;
  handleOpenCart: (itemId: string) => void;
}

export const Card = ({
  content,
  handleOpenCart,
}: CardProps<ListActiveItemsInterface>) => {
  const [selectedItemId, setSelectedItemId] = useState(content.item[0]?.id);
  const selectedItem = content.item.find((item) => item.id === selectedItemId);

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-lg bg-white shadow-md">
      <Image
        src={content.image || ImageFood}
        alt="Empadão"
        className="h-40 w-full object-cover"
      />
      <div className="flex h-full flex-col justify-between p-4">
        <TitleH3 className="md:text-sm">{content.nome}</TitleH3>
        <p className="font mb-3 min-h-[72px] text-gray-700 md:text-sm lg:text-base">
          {content.descricao}
        </p>
        <div className="flex items-center justify-between text-gray-700 md:text-sm lg:text-base">
          {selectedItem && <span>{normalizeCurrency(selectedItem.preco)}</span>}
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="rounded border border-gray-300 p-2 text-sm outline-none"
          >
            {content.item.map((item) => (
              <option key={item.id} value={item.id}>
                {item.pesoReal}
              </option>
            ))}
          </select>
        </div>
        <ButtonDefault
          type="button"
          variant="third"
          className="mt-4 outline-none"
          onClick={() => handleOpenCart(selectedItem?.id || '')}
        >
          Adicionar
        </ButtonDefault>
      </div>
    </div>
  );
};
