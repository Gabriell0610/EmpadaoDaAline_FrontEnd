import { ListItemsInterface } from '@/utils/types/items.type';
import { Layers, PackagePlus } from 'lucide-react';

interface CreateTabProps {
  listAllItens: ListItemsInterface[];
  selectedDescriptionId: string;
  onSelectDescription: (id: string) => void;
}

export function CreateTab({
  listAllItens,
  selectedDescriptionId,
  onSelectDescription,
}: CreateTabProps) {
  const isAddingToExisting = !!selectedDescriptionId;

  return (
    <div className="space-y-3">
      <select
        className="h-11 w-full rounded-xl border border-text-primary/20 bg-neutral-white px-3 text-sm transition focus:border-green_details-greenLight focus:outline-none focus:ring-2 focus:ring-green_details-greenLight/25"
        value={selectedDescriptionId}
        onChange={(e) => onSelectDescription(e.target.value)}
      >
        <option value="">
          Selecione um item para acrescenter outros pesos e preços
        </option>
        {listAllItens.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome}
          </option>
        ))}
      </select>

      <div
        className={`rounded-xl border p-4 ${
          isAddingToExisting
            ? 'border-blue-600/20 bg-blue-50'
            : 'border-green-600/20 bg-green-50'
        }`}
      >
        <div className="flex items-start gap-3">
          {isAddingToExisting ? (
            <Layers className="mt-0.5 text-blue-700" size={18} />
          ) : (
            <PackagePlus className="mt-0.5 text-green-700" size={18} />
          )}
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {isAddingToExisting ? 'Adicionando novo tamanho' : 'Novo produto'}
            </p>
            <p className="text-sm text-text-secondary">
              {isAddingToExisting
                ? 'Nome, descrição e tipo bloqueados.'
                : 'Preencha todos os campos para criar um novo produto.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
