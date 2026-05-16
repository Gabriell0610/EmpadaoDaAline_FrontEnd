import { PackagePlus } from 'lucide-react';

export function CreateTab() {
  return (
    <div className="rounded-xl border border-green-600/20 bg-green-50 p-4">
      <div className="flex items-start gap-3">
        <PackagePlus className="mt-0.5 text-green-700" size={18} />
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Modo criacao ativo
          </p>
          <p className="text-sm text-text-secondary">
            O formulário ao lado será enviado como novo item.
          </p>
        </div>
      </div>
    </div>
  );
}
