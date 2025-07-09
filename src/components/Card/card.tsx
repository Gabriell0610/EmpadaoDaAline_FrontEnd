import Image from 'next/image';
import ImageFood from '../../../public/image5.png';
import { ButtonDefault } from '../Button/Button';
import { normalizeCurrency } from '@/utils/helpers/normalizeCurrency';
import { TitleH3 } from '../Titles/Titles';
import { ListActiveItemsInterface } from '@/utils/types/items.type';

interface CardProps<T> {
  content: T;
  key: number;
  handleOpenCart: () => void;
}

export const Card = ({
  content,
  handleOpenCart,
}: CardProps<ListActiveItemsInterface>) => {
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
          <span>{normalizeCurrency(content.preco)}</span>
          <span>{content.pesoReal}</span>
        </div>
        <ButtonDefault
          type="button"
          variant="third"
          className="mt-4 outline-none"
          onClick={() => handleOpenCart()}
        >
          Adicionar
        </ButtonDefault>
      </div>
    </div>
  );
};
